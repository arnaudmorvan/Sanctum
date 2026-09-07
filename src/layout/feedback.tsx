import { GripHorizontal, MessageSquarePlus, PanelRight, X } from "lucide-react"
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react"
import { describeElement, type Target, UI_MARK } from "./target"
import { ChosenTarget, Targeting } from "./targeting"

/** The "Feedback" widget: the mouth through which a viewer of the flow talks to the system.
 *
 *  Nothing to install — it is compiled into the app like the rest of the skeleton. The panel
 *  asks for TWO things: the kind of feedback and the text. The context (flow slug, screen on
 *  display, author) attaches itself.
 *
 *  Two kinds, two destinations on the server side (the MCP's feedback API):
 *   • "This flow"     → the queue `context/flow-feedback/<slug>.md`, counted by the MCP
 *     welcome panel and handled by the "handle feedback" gesture;
 *   • "A system rule" → a report in `context/reports/`, which follows the normal
 *     foundations consolidation. The widget is one more mouth on the existing pipeline.
 *
 *  Since 2026-09-06, a feedback item can carry a TARGET: the element pointed at or the area
 *  circled. It travels with several proofs (kit/hand-written origin, name, role, path,
 *  selector, rectangle) — see `target.ts`. What it changes for whoever handles the feedback:
 *  "it is too tight" becomes "the padding of this kit `Card` is too tight", hence a kit
 *  task, or "the layout div around it", hence a flow task.
 *
 *  SINCE 2026-09-07 IT FLOATS, mechanism ported from the designBrain widget. It used to be a
 *  button in the bottom bar opening a full-width banner above it: writing about a screen
 *  covered the bottom third of that very screen. Now a launcher in the corner opens a 360 px
 *  panel one can DRAG out of the way of what is being criticised, plus a "dock" mode — a
 *  full-height rail against the right edge, for when there are several feedback items to
 *  write. Placement and mode are remembered per browser: someone who reviews often gets
 *  their panel back where they left it.
 *
 *  It does NOT push the page (no `margin-right` on the app). Shifting the flow would break
 *  everything it holds in `position: fixed` — its own chrome first — and a feedback widget
 *  that deforms the screen under review is worse than one covering an edge of it.
 *
 *  Two things not to break:
 *   • launcher AND panel carry `UI_MARK`, otherwise the widget becomes a target of its own
 *     pointing (`isOurs` in `target.ts` reads that marker);
 *   • both stay at `z-50`, UNDER the `z-[60]` targeting overlay — and the panel hides itself
 *     entirely while aiming, so nothing of ours sits over what is being pointed at.
 *
 *  Fail-closed: without the feedback key set at build time, the widget DOES NOT EXIST — the
 *  same safe default as the server route without its own key. The embedded key is not a
 *  secret (it is readable in the bundle): it stops drive-by spam, the real limits (size,
 *  closed set of kinds, server-computed paths) are on the server side. */

// Deployment shim: the Railway build variable is still called VITE_RETOURS_KEY. Drop this
// fallback once the variable is renamed to VITE_FEEDBACK_KEY on the service.
const KEY =
  (import.meta.env.VITE_FEEDBACK_KEY as string | undefined) ??
  (import.meta.env.VITE_RETOURS_KEY as string | undefined) ??
  ""
const SLUG = (import.meta.env.VITE_PROTO_SLUG as string | undefined) ?? ""
// Same deployment shim, for the MCP base URL: VITE_RETOURS_URL is still the name on
// Railway. Drop the fallback once it is renamed to VITE_FEEDBACK_URL.
const MCP_URL =
  (import.meta.env.VITE_FEEDBACK_URL as string | undefined) ??
  (import.meta.env.VITE_RETOURS_URL as string | undefined) ??
  "https://mcp-42-production.up.railway.app"

const TEXT_MAX = 2000 // the server limit — refusing here saves a round trip for nothing

const PANEL_W = 360
const EDGE = 16 // the margin the panel keeps from the edges of the window
const BAR_FALLBACK = 44 // one row of the bottom bar, used until it has been measured
const PLACEMENT_KEY = "feedback-widget-placement"

type State = "editing" | "sending" | "thanks" | "error"

/** Where the panel sits. `x`/`y` are null as long as nobody has moved it: it then hangs from
 *  the bottom-right corner, which follows the window instead of being a frozen coordinate. */
type Placement = { docked: boolean; x: number | null; y: number | null }

const DEFAULT_PLACEMENT: Placement = { docked: false, x: null, y: null }

const readPlacement = (): Placement => {
  try {
    const raw = localStorage.getItem(PLACEMENT_KEY)
    if (!raw) return DEFAULT_PLACEMENT
    const saved = JSON.parse(raw) as Partial<Placement>
    return {
      docked: saved.docked === true,
      x: typeof saved.x === "number" ? saved.x : null,
      y: typeof saved.y === "number" ? saved.y : null,
    }
  } catch {
    return DEFAULT_PLACEMENT
  }
}

/** The height of the bottom bar, MEASURED. The widget rests above it — and its height is
 *  not a constant: the bar wraps its list of deep screens, and goes from 44 px to 130 px
 *  depending on the flow and the width of the window. Assuming a value means the panel sits
 *  over the tooling on exactly the flows that have the most screens. The bar declares itself
 *  with `data-sanctum-bar`; without it (a flow rendered without the bar) the fallback is one
 *  row. */
const useBottomBar = () => {
  const [height, setHeight] = useState(BAR_FALLBACK)
  useEffect(() => {
    const bar = document.querySelector("[data-sanctum-bar]")
    if (!bar) return
    const measure = () => setHeight(Math.round(bar.getBoundingClientRect().height))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [])
  return height
}

const KINDS = [
  {
    key: "flow",
    label: "This flow",
    help: "A change or a problem in THIS flow: a screen, a sequence, a piece of data.",
  },
  {
    key: "rule",
    label: "A system rule",
    help: "A rule the design system should know — it will go out for consolidation.",
  },
] as const

export const Feedback = ({ screen }: { screen?: string }) => {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<(typeof KINDS)[number]["key"]>("flow")
  const [text, setText] = useState("")
  const [author, setAuthor] = useState("")
  const [state, setState] = useState<State>("editing")
  const [error, setError] = useState("")
  const [target, setTarget] = useState<Target | null>(null)
  const [targetElement, setTargetElement] = useState<Element | null>(null)
  const [mode, setMode] = useState<"element" | "zone" | null>(null)
  const [placement, setPlacement] = useState<Placement>(readPlacement)
  const [dragging, setDragging] = useState(false)
  const bar = useBottomBar()
  const panel = useRef<HTMLDivElement | null>(null)
  const grab = useRef<{ dx: number; dy: number } | null>(null)

  // The author is asked ONCE per browser: anonymous feedback is feedback nobody can go
  // back and question.
  useEffect(() => {
    try {
      // `retours-auteur` is the legacy key, read once as a fallback so nobody who already
      // gave their name has to type it again. Only the new key is ever written.
      setAuthor(
        localStorage.getItem("feedback-author") ?? localStorage.getItem("retours-auteur") ?? "",
      )
    } catch {
      /* storage unavailable: the field stays empty, submitting still works */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(PLACEMENT_KEY, JSON.stringify(placement))
    } catch {
      /* same tolerance: the panel simply forgets where it was */
    }
  }, [placement])

  /** Keeps the whole panel inside the window — a header dragged past the edge would be a
   *  panel that can never be grabbed again. The bottom bar counts as an edge: the flow's
   *  tooling stays reachable while the panel is open. */
  const clamp = useCallback(
    (x: number, y: number) => {
      const box = panel.current?.getBoundingClientRect()
      const w = box?.width ?? PANEL_W
      const h = box?.height ?? 320
      return {
        x: Math.round(Math.max(EDGE, Math.min(x, window.innerWidth - w - EDGE))),
        y: Math.round(Math.max(EDGE, Math.min(y, window.innerHeight - bar - h - 8))),
      }
    },
    [bar],
  )

  const close = useCallback(() => {
    setOpen(false)
    setState("editing")
    setError("")
    setMode(null)
    setTarget(null)
    setTargetElement(null)
  }, [])

  // Esc closes the panel — except while aiming, where it belongs to the targeting overlay,
  // which cancels the aim and leaves the half-written feedback alone.
  useEffect(() => {
    if (!open || mode) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, mode, close])

  // A window resized smaller must not leave the panel outside of it.
  useEffect(() => {
    if (!open || placement.docked) return
    const onResize = () =>
      setPlacement((p) => (p.x === null || p.y === null ? p : { ...p, ...clamp(p.x, p.y) }))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [open, placement.docked, clamp])

  if (!KEY || !SLUG) return null

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (placement.docked) return
    // The header also carries the dock and close buttons. Capturing the pointer on a press
    // that started on one of them routes the pointerup to the header, and the button never
    // sees its click — it looks dead. What is grabbable is the header MINUS its controls.
    if ((e.target as HTMLElement).closest("button")) return
    const box = panel.current?.getBoundingClientRect()
    if (!box) return
    grab.current = { dx: e.clientX - box.left, dy: e.clientY - box.top }
    // Freeze the panel on the box it currently occupies BEFORE the first move: until now it
    // may have been hanging from `right`/`bottom`, and switching anchors mid-drag makes it
    // jump under the cursor.
    setPlacement((p) => ({ ...p, x: Math.round(box.left), y: Math.round(box.top) }))
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const onDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const from = grab.current
    if (!from) return
    setPlacement((p) => ({ ...p, ...clamp(e.clientX - from.dx, e.clientY - from.dy) }))
  }

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!grab.current) return
    grab.current = null
    setDragging(false)
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const send = async () => {
    setState("sending")
    setError("")
    try {
      localStorage.setItem("feedback-author", author)
    } catch {
      /* same tolerance as on read */
    }
    try {
      const r = await fetch(`${MCP_URL}/feedback/submit.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Feedback-Key": KEY },
        body: JSON.stringify({ kind, text, slug: SLUG, screen: screen ?? "", author, target }),
      })
      if (!r.ok) {
        const body = (await r.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? `HTTP ${r.status}`)
      }
      setState("thanks")
      setText("")
      setTarget(null)
      setTargetElement(null)
    } catch (e) {
      setState("error")
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const aimAt = (el: Element) => {
    setTargetElement(el)
    setTarget(describeElement(el))
  }

  const readyToSend = text.trim().length >= 10 && text.length <= TEXT_MAX

  const style: CSSProperties = placement.docked
    ? // The rail takes all the height there is — down to the bar, not under it.
      { top: 0, right: 0, bottom: bar, width: "min(400px, 100vw)" }
    : {
        width: `min(${PANEL_W}px, calc(100vw - ${EDGE * 2}px))`,
        maxHeight: `min(70vh, calc(100vh - ${bar + 2 * EDGE}px), 620px)`,
        ...(placement.x !== null && placement.y !== null
          ? { left: placement.x, top: placement.y }
          : { right: EDGE, bottom: bar + 12 }),
      }

  return (
    <>
      {mode && (
        <Targeting
          mode={mode}
          onCancel={() => setMode(null)}
          onTarget={(t) => {
            setTarget(t)
            // In zone mode, the holding element is not what was shown: the breadcrumb
            // would make no sense, so we do not offer it.
            setTargetElement(t.type === "element" ? document.querySelector(t.selector) : null)
            setMode(null)
          }}
        />
      )}

      {!open && (
        <button
          {...{ [UI_MARK]: "" }}
          type="button"
          onClick={() => setOpen(true)}
          style={{ right: EDGE, bottom: bar + 12 }}
          className="fixed z-50 flex items-center gap-2 rounded-full border border-gray-dark-800 bg-gray-dark-950/95 px-3.5 py-2 text-white text-xs shadow-lg backdrop-blur transition-colors hover:border-white/30 hover:bg-gray-dark-900"
        >
          <MessageSquarePlus size={14} aria-hidden="true" />
          Feedback
        </button>
      )}

      {open && (
        <div
          {...{ [UI_MARK]: "" }}
          ref={panel}
          style={style}
          className={`fixed z-50 flex flex-col overflow-hidden border border-gray-dark-800 bg-gray-dark-950/98 backdrop-blur ${
            placement.docked
              ? "rounded-none border-y-0 border-e-0 shadow-[-18px_0_48px_rgba(0,0,0,0.45)]"
              : "rounded-lg shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
          } ${mode ? "hidden" : ""}`}
          role="dialog"
          aria-label="Submit feedback"
        >
          {/* The header is the handle. Docked, there is nowhere to take the panel: it stops
              being grabbable rather than pretending. */}
          <div
            onPointerDown={startDrag}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`flex shrink-0 select-none items-center gap-2 border-gray-dark-800 border-b bg-white/2 px-3 py-2 ${
              placement.docked ? "cursor-default" : dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {!placement.docked && (
              <GripHorizontal size={14} className="text-gray-dark-600" aria-hidden="true" />
            )}
            <span className="font-semibold text-sm text-white">Feedback</span>
            <span className="truncate text-gray-dark-500 text-xs">{screen ?? SLUG}</span>
            <button
              type="button"
              onClick={() => setPlacement((p) => ({ ...p, docked: !p.docked }))}
              aria-pressed={placement.docked}
              title={placement.docked ? "Float the panel" : "Dock it to the right edge"}
              className="ms-auto rounded p-1 text-gray-dark-500 hover:bg-white/5 hover:text-white"
            >
              <PanelRight size={14} aria-hidden="true" />
              <span className="sr-only">
                {placement.docked ? "Float the panel" : "Dock it to the right edge"}
              </span>
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded p-1 text-gray-dark-500 hover:bg-white/5 hover:text-white"
            >
              <X size={14} aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
            {state === "thanks" ? (
              <div className="flex flex-col items-start gap-2">
                <span className="font-semibold text-sm text-white">Thanks, it's in.</span>
                <p className="text-gray-dark-400 text-xs leading-relaxed">
                  {kind === "flow"
                    ? "The feedback is in this flow's queue — it will be read the next time someone works on it."
                    : "The rule went out as a report: it will be reviewed and consolidated with the others."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setState("editing")}
                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-white text-xs hover:bg-white/15"
                  >
                    Submit more feedback
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Kind of feedback"
                >
                  {KINDS.map((k) => {
                    const on = kind === k.key
                    return (
                      <button
                        key={k.key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setKind(k.key)}
                        className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                          on
                            ? "border-white/30 bg-white/10 font-semibold text-white"
                            : "border-gray-dark-800 text-gray-dark-400 hover:text-white"
                        }`}
                      >
                        {k.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-gray-dark-500 text-xs">
                  {KINDS.find((k) => k.key === kind)?.help}
                </p>

                {target ? (
                  <ChosenTarget
                    target={target}
                    element={targetElement}
                    onRetarget={aimAt}
                    onClear={() => {
                      setTarget(null)
                      setTargetElement(null)
                    }}
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-dark-500 text-xs">Show where:</span>
                    <button
                      type="button"
                      onClick={() => setMode("element")}
                      className="rounded-md border border-gray-dark-800 px-2.5 py-1.5 text-gray-dark-300 text-xs hover:border-white/30 hover:text-white"
                    >
                      Point at an element
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("zone")}
                      className="rounded-md border border-gray-dark-800 px-2.5 py-1.5 text-gray-dark-300 text-xs hover:border-white/30 hover:text-white"
                    >
                      Circle an area
                    </button>
                    <span className="text-gray-dark-600 text-[11px]">optional</span>
                  </div>
                )}

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={TEXT_MAX}
                  rows={placement.docked ? 10 : 5}
                  placeholder={
                    kind === "flow"
                      ? "What should change in this flow, and where…"
                      : "The rule, and what makes you say it…"
                  }
                  // Docked, the field takes the height that was the reason for docking.
                  className={`w-full resize-y rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2 text-sm text-white placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none ${
                    placement.docked ? "min-h-40 flex-1" : ""
                  }`}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    maxLength={60}
                    placeholder="Your first name"
                    className="w-32 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-1.5 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!readyToSend || state === "sending"}
                    onClick={send}
                    className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {state === "sending" ? "Sending…" : "Send"}
                  </button>
                </div>
                {state === "error" && (
                  <span className="text-pink-400 text-xs">Could not submit: {error}</span>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
