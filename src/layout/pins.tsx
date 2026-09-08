import { useEffect, useState } from "react"
import { type Comment, type FeedbackItem, numberOf, useNotes } from "./notes"
import { isOurs, type Target, UI_MARK } from "./target"

/** The PINS: every note left on the screen on display, drawn where it was left.
 *
 *  A pin is placed by RESOLVING the note's target — the selector it recorded — in the
 *  DOM of the moment, never by replaying the coordinates it recorded. The coordinates
 *  were viewport pixels of a window that no longer exists; the element still does, and
 *  it is what the note is about. Element target: the pin sits on the element's top-right
 *  corner. Zone target: at the zone's centre, kept as an offset from the element that
 *  held it (`target.anchor`). A note whose selector resolves to nothing on this version
 *  gets no pin — the list says so — rather than a pin on a guess.
 *
 *  Re-placed on scroll (capture: the flow scrolls inside the app shell, not the window),
 *  on resize, on route change, and on DOM mutations — the screen re-renders after the
 *  hash changes, and a pin placed before the render would sit on the previous screen.
 *
 *  Two kinds, two colours, one numbering each: the number is what the list repeats, so
 *  a PO reading "3" on the screen finds "3" in the tab. Handled feedback and resolved
 *  comments stay drawn, dimmed: what was done is still information, and a pin that
 *  vanished when the agent closed it would read as a lost note.
 *
 *  `z-40`: under the panel (z-50) and the targeting overlay (z-60); `UI_MARK`: never a
 *  target of the pointing; hidden while aiming, like the panel. */

export type PinKind = "comment" | "feedback"

type Placed = { kind: PinKind; id: string; n: number; x: number; y: number; done: boolean; label: string }

const PIN = 22
const EDGE = 4

const place = (target: Target | null): { x: number; y: number } | null => {
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

const bottomBar = (): number => {
  const bar = document.querySelector("[data-sanctum-bar]")
  return bar ? Math.round(bar.getBoundingClientRect().height) : 44
}

export const Pins = ({
  screen,
  visible,
  hidden,
  onOpen,
}: {
  screen?: string
  visible: boolean
  /** True while aiming: nothing of ours may sit over what is being pointed at. */
  hidden: boolean
  onOpen: (kind: PinKind, id: string) => void
}) => {
  const notes = useNotes()
  const [placed, setPlaced] = useState<Placed[]>([])

  useEffect(() => {
    if (!visible || !screen) {
      setPlaced([])
      return
    }
    let frame = 0
    const compute = () => {
      frame = 0
      const bar = bottomBar()
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
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute)
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
  }, [visible, screen, notes])

  if (!visible || hidden || placed.length === 0) return null

  return (
    <div {...{ [UI_MARK]: "" }} className="pointer-events-none fixed inset-0 z-40" role="group" aria-label="Notes on this screen">
      {placed.map((p) => (
        <button
          key={`${p.kind}:${p.id}`}
          type="button"
          onClick={() => onOpen(p.kind, p.id)}
          aria-label={`${p.kind === "comment" ? "Comment" : "Feedback"} ${p.n}${p.done ? " (done)" : ""}: ${p.label.slice(0, 80)}`}
          title={`${p.kind === "comment" ? "Comment" : "Feedback"} ${p.n}${p.done ? " · done" : ""} — ${p.label.slice(0, 80)}`}
          style={{ left: p.x - PIN / 2, top: p.y - PIN / 2, width: PIN, height: PIN }}
          className={`pointer-events-auto absolute flex items-center justify-center rounded-full border-2 font-mono font-semibold text-[11px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform hover:scale-110 ${pinClass(p.kind, p.done)}`}
        >
          {p.n}
        </button>
      ))}
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
