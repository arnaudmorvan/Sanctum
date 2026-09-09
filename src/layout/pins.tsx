import { useCallback, useEffect, useState } from "react"
import { type Comment, type FeedbackItem, numberOf, useNotes } from "./notes"
import { isOurs, type Target, UI_MARK } from "./target"

/** The PINS: every note left on the screen on display, drawn where it was left.
 *
 *  A pin is placed by RESOLVING the note's target — the selector it recorded — in the
 *  DOM of the moment, never by replaying the coordinates it recorded. The coordinates
 *  were viewport pixels of a window that no longer exists; the element still does, and
 *  it is what the note is about. Element target: the pin sits on the element's top-right
 *  corner. Zone target, or a comment dropped with the comment tool: at the point that was
 *  shown, kept as an offset from the element that held it (`target.anchor`). A note whose
 *  selector resolves to nothing on this version gets no pin — the list says so — rather
 *  than a pin on a guess.
 *
 *  Re-placed on scroll (capture: the flow scrolls inside the app shell, not the window),
 *  on resize, on route change, and on DOM mutations — the screen re-renders after the
 *  hash changes, and a pin placed before the render would sit on the previous screen.
 *  That whole listening is `useLiveLayout`, shared with the thread a pin opens: a thread
 *  that did not follow its pin while scrolling would point at the wrong thing.
 *
 *  Two kinds, two colours, one numbering each: the number is what the list repeats, so
 *  a PO reading "3" on the screen finds "3" in the tab. Handled feedback and resolved
 *  comments stay drawn, dimmed: what was done is still information, and a pin that
 *  vanished when the agent closed it would read as a lost note. A pin whose thread is
 *  open wears a ring — it is the one being talked about — and one that has been answered
 *  carries a dot, which is the whole reason to open it.
 *
 *  `z-40`: under the panel (z-50) and the targeting overlay (z-60); `UI_MARK`: never a
 *  target of the pointing; hidden while aiming, like the panel. */

export type PinKind = "comment" | "feedback"

export type At = { x: number; y: number }

type Placed = { kind: PinKind; id: string; n: number; x: number; y: number; done: boolean; label: string }

const PIN = 22
const EDGE = 4

const place = (target: Target | null): At | null => {
  if (!target?.selector) return null
  let el: Element | null = null
  try {
    el = document.querySelector(target.selector)
  } catch {
    return null
  }
  if (!el || isOurs(el)) return null
  const r = el.getBoundingClientRect()
  if (r.width === 0 && r.height === 0) return null
  const x = target.anchor ? r.left + target.anchor.dx : r.right - PIN / 2 - 2
  const y = target.anchor ? r.top + target.anchor.dy : r.top + PIN / 2 + 2
  // Off the viewport (scrolled away) → no pin: a fixed pin would float over whatever
  // sits there now.
  if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return null
  return { x: Math.round(x), y: Math.round(y) }
}

/** The bar is MEASURED, not assumed: it wraps its list of deep screens and goes from
 *  44 px to 130 px depending on the flow. Read fresh on every placement pass rather than
 *  through `useBottomBar` — this runs inside the layout loop, where a render is exactly
 *  what we are avoiding. Everything OUTSIDE that loop uses the hook. */
const bottomBarHeight = (): number => {
  const bar = document.querySelector("[data-sanctum-bar]")
  return bar ? Math.round(bar.getBoundingClientRect().height) : 44
}

/** Runs `compute` whenever anything could have moved what we draw OVER the screen, and
 *  once on mount. Coalesced on an animation frame — a scroll fires far more often than
 *  a frame, and each of those events would otherwise re-measure the DOM.
 *
 *  `compute` must be stable (`useCallback`): it is the effect's dependency. */
export const useLiveLayout = (compute: () => void, enabled: boolean): void => {
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        compute()
      })
    }
    compute()
    document.addEventListener("scroll", schedule, true)
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)
    const root = document.getElementById("root")
    const observer = root ? new MutationObserver(schedule) : null
    observer?.observe(root as Node, { childList: true, subtree: true, attributes: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      document.removeEventListener("scroll", schedule, true)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
      observer?.disconnect()
    }
  }, [compute, enabled])
}

/** Where ONE target sits right now — a thread's anchor, tracked like a pin.
 *
 *  It KEEPS its last position when the target leaves the viewport, where the pins layer
 *  drops the pin instead: a thread that unmounted on a scroll would take a half-written
 *  reply with it. Scrolling back puts the two together again.
 *
 *  `subject` is what that indulgence is bounded by — the id of the note being shown.
 *  When it changes, the position starts again from nothing: keeping it would draw the
 *  new thread on the previous thread's pin, and a thread pointing at the wrong element
 *  is worse than one that does not open. */
export const useAnchor = (
  target: Target | null | undefined,
  enabled: boolean,
  subject: string,
): At | null => {
  const [at, setAt] = useState<At | null>(null)
  useEffect(() => {
    setAt(null)
  }, [subject])
  const compute = useCallback(() => {
    const p = place(target ?? null)
    setAt((prev) => (!p ? prev : prev && prev.x === p.x && prev.y === p.y ? prev : p))
  }, [target])
  useLiveLayout(compute, enabled)
  return at
}

/** How many answers a note carries. Replies live in two different places — a comment's
 *  own file, a feedback item's queue — and are counted the same way. */
export const countReplies = (
  notes: { comments: Comment[]; feedback: FeedbackItem[] },
  kind: PinKind,
  id: string,
): number => {
  const note =
    kind === "comment"
      ? notes.comments.find((c) => c.id === id)
      : notes.feedback.find((f) => f.id === id)
  return note?.replies?.length ?? 0
}

export const Pins = ({
  screen,
  visible,
  hidden,
  openId,
  onOpen,
}: {
  screen?: string
  visible: boolean
  /** True while aiming: nothing of ours may sit over what is being pointed at. */
  hidden: boolean
  /** `<kind>:<id>` of the note whose thread is open — ringed among the others. */
  openId?: string
  onOpen: (kind: PinKind, id: string) => void
}) => {
  const notes = useNotes()
  const [placed, setPlaced] = useState<Placed[]>([])
  const on = visible && Boolean(screen)

  const compute = useCallback(() => {
    if (!screen) return
    const bar = bottomBarHeight()
    const out: Placed[] = []
    const push = (kind: PinKind, id: string, n: number, target: Target | null, done: boolean, label: string) => {
      const p = place(target)
      if (!p || p.y > window.innerHeight - bar) return
      out.push({ kind, id, n, x: Math.max(EDGE + PIN / 2, p.x), y: Math.max(EDGE + PIN / 2, p.y), done, label })
    }
    for (const c of notes.comments as Comment[]) {
      if (c.screen !== screen) continue
      push("comment", c.id, numberOf(notes.comments, c.id), c.target, c.status === "resolved", c.text)
    }
    for (const f of notes.feedback as FeedbackItem[]) {
      if (f.screen !== screen) continue
      push("feedback", f.id, numberOf(notes.feedback, f.id), f.target, f.status === "handled", f.text)
    }
    setPlaced(out)
  }, [screen, notes])

  useLiveLayout(compute, on)
  useEffect(() => {
    if (!on) setPlaced([])
  }, [on])

  if (!on || hidden || placed.length === 0) return null

  return (
    <div {...{ [UI_MARK]: "" }} className="pointer-events-none fixed inset-0 z-40" role="group" aria-label="Notes on this screen">
      {placed.map((p) => {
        const answers = countReplies(notes, p.kind, p.id)
        const what = p.kind === "comment" ? "Comment" : "Feedback"
        return (
          <button
            key={`${p.kind}:${p.id}`}
            type="button"
            onClick={() => onOpen(p.kind, p.id)}
            aria-label={`${what} ${p.n}${p.done ? " (done)" : ""}${answers ? `, ${answers} answered` : ""}: ${p.label.slice(0, 80)}`}
            title={`${what} ${p.n}${p.done ? " · done" : ""}${
              answers ? ` · ${answers} ${answers > 1 ? "replies" : "reply"}` : ""
            } — ${p.label.slice(0, 80)}`}
            style={{ left: p.x - PIN / 2, top: p.y - PIN / 2, width: PIN, height: PIN }}
            className={`pointer-events-auto absolute flex items-center justify-center rounded-full border-2 font-mono font-semibold text-[11px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform hover:scale-110 ${pinClass(p.kind, p.done)} ${
              openId === `${p.kind}:${p.id}`
                ? "ring-2 ring-white/70 ring-offset-1 ring-offset-gray-dark-950"
                : ""
            }`}
          >
            {p.n}
            {answers ? (
              <span
                aria-hidden="true"
                className="-right-1 -top-1 absolute size-2 rounded-full bg-white shadow-[0_0_0_2px_rgba(9,9,11,0.9)]"
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

/** The pin's look, shared with the list bubbles: same colour on the screen and in the
 *  tab, or the number means nothing. */
export const pinClass = (kind: PinKind, done: boolean): string => {
  if (kind === "comment")
    return done
      ? "border-blue-400/50 bg-gray-dark-950/80 text-blue-300/70"
      : "border-blue-200 bg-blue-400 text-gray-dark-950"
  return done
    ? "border-purple-400/50 bg-gray-dark-950/80 text-purple-300/70"
    : "border-purple-200 bg-purple-400 text-gray-dark-950"
}

export const Bubble = ({ kind, n, done }: { kind: PinKind; n: number; done: boolean }) => (
  <span
    className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border font-mono font-semibold text-[10px] ${pinClass(kind, done)}`}
  >
    {n}
  </span>
)
