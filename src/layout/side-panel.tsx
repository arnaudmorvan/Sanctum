import {
  Blocks,
  Eye,
  EyeOff,
  GripHorizontal,
  History,
  MessageSquarePlus,
  MessagesSquare,
  PanelRight,
  X,
} from "lucide-react"
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { CommentsBody } from "./comments"
import { FEEDBACK_KEY, SLUG } from "./env"
import { FeedbackBody } from "./feedback"
import { HistoryBody } from "./history"
import { InspectorBody } from "./inspector"
import { notesAvailable, refreshNotes, useNotes } from "./notes"
import { type PinKind, Pins } from "./pins"
import { UI_MARK } from "./target"

/** The side panel: ONE place for everything a reviewer does ABOUT the flow, as opposed to
 *  IN it. Four tabs — Feedback (say what should change, to the system), Comments (say it
 *  to the developers), Components (what the screen owes to the kit), History (every
 *  version of the flow, with the date and time each one was generated, and the way back
 *  to one of them). Plus the PINS: the comments and feedback of the screen on display,
 *  drawn where they were left (`pins.tsx`), with one switch to show or hide them — on
 *  the rail, so it works with the panel closed.
 *
 *  Before 2026-09-08 these were three different things in three different places: a
 *  floating widget for the feedback, a bottom sheet behind a button of the bar for the
 *  inspector, and nothing at all for the history. A PO reviewing a flow now has one
 *  gesture: the rail in the corner opens the panel on the tab they clicked, and the
 *  other two are a click away — without losing the feedback they were writing (the three
 *  bodies stay MOUNTED, only hidden: switching tabs to check a component must not wipe
 *  a half-written paragraph).
 *
 *  The container is the feedback widget's, unchanged in its mechanics: it FLOATS (a
 *  380 px panel one can drag out of the way of what is being criticised), and it DOCKS
 *  (a full-height rail against the right edge, for longer sessions). It does not push the
 *  page — shifting the flow would break everything it holds in `position: fixed`, and a
 *  panel that deforms the screen under review is worse than one covering an edge of it.
 *  Placement and mode are remembered per browser.
 *
 *  Three things not to break:
 *   • rail AND panel carry `UI_MARK`, otherwise they become targets of the feedback's own
 *     pointing (`isOurs` in `target.ts` reads that marker);
 *   • both stay at `z-50`, UNDER the `z-[60]` targeting overlay — and the panel hides
 *     itself entirely while aiming, so nothing of ours sits over what is being pointed at
 *     (the overlay itself is portalled to `body` by the feedback tab, so it survives);
 *   • the bottom bar is MEASURED, not assumed: it wraps its list of deep screens and goes
 *     from 44 px to 130 px depending on the flow. The panel rests above it. */

export type Tab = "feedback" | "comments" | "components" | "history"

const PINS_KEY = "sanctum-pins-visible"
const readPins = (): boolean => {
  try {
    return localStorage.getItem(PINS_KEY) !== "off"
  } catch {
    return true
  }
}

const PANEL_W = 380
const EDGE = 16 // the margin the panel keeps from the edges of the window
const BAR_FALLBACK = 44 // one row of the bottom bar, used until it has been measured
const PLACEMENT_KEY = "sanctum-panel-placement"
// The feedback widget's own placement, before the panel absorbed it. Read once as a
// fallback so nobody who parked the widget finds it back in the corner; never written.
const PLACEMENT_LEGACY = "feedback-widget-placement"

/** Where the panel sits. `x`/`y` are null as long as nobody has moved it: it then hangs from
 *  the bottom-right corner, which follows the window instead of being a frozen coordinate. */
type Placement = { docked: boolean; x: number | null; y: number | null }

const DEFAULT_PLACEMENT: Placement = { docked: false, x: null, y: null }

const readPlacement = (): Placement => {
  try {
    const raw = localStorage.getItem(PLACEMENT_KEY) ?? localStorage.getItem(PLACEMENT_LEGACY)
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

/** The height of the bottom bar, MEASURED. The bar declares itself with `data-sanctum-bar`;
 *  without it (a flow rendered without the bar) the fallback is one row. */
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

type TabDef = { key: Tab; label: string; icon: ReactNode; available: boolean; why?: string }

// What each tab needs to exist. Feedback is fail-closed on the build key (same safe
// default as the server route without its own); History needs to know WHICH flow it is.
// Components needs nothing: the marks are stamped at compile time.
const TABS: TabDef[] = [
  {
    key: "feedback",
    label: "Feedback",
    icon: <MessageSquarePlus size={15} aria-hidden="true" />,
    available: Boolean(FEEDBACK_KEY && SLUG),
  },
  {
    key: "comments",
    label: "Comments",
    icon: <MessagesSquare size={15} aria-hidden="true" />,
    available: notesAvailable,
  },
  {
    key: "components",
    label: "Components",
    icon: <Blocks size={15} aria-hidden="true" />,
    available: true,
  },
  {
    key: "history",
    label: "History",
    icon: <History size={15} aria-hidden="true" />,
    available: Boolean(SLUG),
  },
]

export const SidePanel = ({ screen }: { screen?: string }) => {
  const [active, setActive] = useState<Tab | null>(null)
  const [aiming, setAiming] = useState(false)
  const [pins, setPins] = useState(readPins)
  const [focus, setFocus] = useState<{ kind: PinKind; id: string } | null>(null)
  const notes = useNotes()
  const [placement, setPlacement] = useState<Placement>(readPlacement)
  const [dragging, setDragging] = useState(false)
  const bar = useBottomBar()
  const panel = useRef<HTMLDivElement | null>(null)
  const grab = useRef<{ dx: number; dy: number } | null>(null)

  const tabs = TABS.filter((t) => t.available)
  const open = active !== null

  // The notes are read once on mount — the pins and the counters need them with the
  // panel closed — and again on every opening: someone else may have commented since.
  useEffect(() => {
    void refreshNotes()
  }, [])
  useEffect(() => {
    if (open) void refreshNotes()
  }, [open])

  useEffect(() => {
    try {
      localStorage.setItem(PINS_KEY, pins ? "on" : "off")
    } catch {
      /* the switch is simply not remembered */
    }
  }, [pins])

  // A pin was clicked: open its tab on it. The focus is cleared when the tab changes
  // by hand, so the highlight does not stick to an item nobody asked for.
  const openNote = useCallback((kind: PinKind, id: string) => {
    setFocus({ kind, id })
    setActive(kind === "comment" ? "comments" : "feedback")
  }, [])
  const choose = (tab: Tab) => {
    setFocus(null)
    setActive(tab)
  }

  const nOpenComments = notes.comments.filter((c) => c.status === "open").length
  const nOpenFeedback = notes.feedback.filter((f) => f.status === "open").length
  const count = (tab: Tab) =>
    tab === "comments" ? nOpenComments : tab === "feedback" ? nOpenFeedback : 0

  useEffect(() => {
    try {
      localStorage.setItem(PLACEMENT_KEY, JSON.stringify(placement))
    } catch {
      /* the panel simply forgets where it was */
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
    setActive(null)
    setAiming(false)
    setFocus(null)
  }, [])

  // Esc closes the panel — except while aiming, where it belongs to the targeting overlay,
  // which cancels the aim and leaves the half-written feedback alone.
  useEffect(() => {
    if (!open || aiming) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, aiming, close])

  // A window resized smaller must not leave the panel outside of it.
  useEffect(() => {
    if (!open || placement.docked) return
    const onResize = () =>
      setPlacement((p) => (p.x === null || p.y === null ? p : { ...p, ...clamp(p.x, p.y) }))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [open, placement.docked, clamp])

  if (tabs.length === 0) return null

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (placement.docked) return
    // The header also carries the tabs, the dock and the close buttons. Capturing the
    // pointer on a press that started on one of them routes the pointerup to the header,
    // and the button never sees its click. What is grabbable is the header MINUS them.
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

  const style: CSSProperties = placement.docked
    ? // The rail takes all the height there is — down to the bar, not under it.
      { top: 0, right: 0, bottom: bar, width: "min(420px, 100vw)" }
    : {
        width: `min(${PANEL_W}px, calc(100vw - ${EDGE * 2}px))`,
        maxHeight: `min(72vh, calc(100vh - ${bar + 2 * EDGE}px), 680px)`,
        ...(placement.x !== null && placement.y !== null
          ? { left: placement.x, top: placement.y }
          : { right: EDGE, bottom: bar + 12 }),
      }

  return (
    <>
      <Pins screen={screen} visible={pins && notesAvailable} hidden={aiming} onOpen={openNote} />

      {/* The rail — the "menu on the side". It is the launcher: one tile per tab, and it
          steps aside once the panel is open (the header then carries the tabs). */}
      {!open && (
        <nav
          {...{ [UI_MARK]: "" }}
          aria-label="Review tools"
          style={{ right: EDGE, bottom: bar + 12 }}
          className="fixed z-50 flex flex-col overflow-hidden rounded-lg border border-gray-dark-800 bg-gray-dark-950/95 shadow-lg backdrop-blur"
        >
          {tabs.map((t) => {
            const n = count(t.key)
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => choose(t.key)}
                title={n ? `${t.label} — ${n} open` : t.label}
                className="relative flex w-[68px] flex-col items-center gap-1 border-gray-dark-800 border-b px-2 py-2 text-gray-dark-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {t.icon}
                <span className="text-[10px] leading-none">{t.label}</span>
                {n ? (
                  <span
                    className={`absolute top-1 right-2 min-w-4 rounded-full px-1 text-center font-mono font-semibold text-[9px] text-gray-dark-950 leading-4 ${
                      t.key === "comments" ? "bg-blue-400" : "bg-purple-400"
                    }`}
                  >
                    {n}
                  </span>
                ) : null}
              </button>
            )
          })}
          {notesAvailable ? (
            <button
              type="button"
              onClick={() => setPins((p) => !p)}
              aria-pressed={pins}
              title={pins ? "Hide the pins" : "Show the pins"}
              className={`flex w-[68px] flex-col items-center gap-1 px-2 py-2 transition-colors hover:bg-white/5 ${
                pins ? "text-white" : "text-gray-dark-500"
              }`}
            >
              {pins ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
              <span className="text-[10px] leading-none">Pins</span>
            </button>
          ) : null}
        </nav>
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
          } ${aiming ? "hidden" : ""}`}
          role="dialog"
          aria-label="Review panel"
        >
          {/* The header is the handle, and it carries the tabs. Docked, there is nowhere to
              take the panel: it stops being grabbable rather than pretending. */}
          <div
            onPointerDown={startDrag}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`flex shrink-0 select-none items-center gap-1 border-gray-dark-800 border-b bg-white/2 px-2 py-1.5 ${
              placement.docked ? "cursor-default" : dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {!placement.docked && (
              <GripHorizontal size={14} className="me-1 text-gray-dark-600" aria-hidden="true" />
            )}
            <div role="tablist" aria-label="Review tools" className="flex items-center gap-0.5">
              {tabs.map((t) => {
                const on = active === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => choose(t.key)}
                    title={t.label}
                    className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                      on
                        ? "bg-white/10 font-semibold text-white"
                        : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {t.icon}
                    {/* Four tabs in 380 px: the label of the active one only, the others
                        stay as icons — with their name in the tooltip. */}
                    {on ? t.label : <span className="sr-only">{t.label}</span>}
                    {count(t.key) ? (
                      <span
                        className={`min-w-4 rounded-full px-1 text-center font-mono font-semibold text-[9px] text-gray-dark-950 leading-4 ${
                          t.key === "comments" ? "bg-blue-400" : "bg-purple-400"
                        }`}
                      >
                        {count(t.key)}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
            {notesAvailable ? (
              <button
                type="button"
                onClick={() => setPins((p) => !p)}
                aria-pressed={pins}
                title={pins ? "Hide the pins" : "Show the pins"}
                className={`ms-auto rounded p-1 hover:bg-white/5 ${pins ? "text-white" : "text-gray-dark-500"}`}
              >
                {pins ? <Eye size={14} aria-hidden="true" /> : <EyeOff size={14} aria-hidden="true" />}
                <span className="sr-only">{pins ? "Hide the pins" : "Show the pins"}</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setPlacement((p) => ({ ...p, docked: !p.docked }))}
              aria-pressed={placement.docked}
              title={placement.docked ? "Float the panel" : "Dock it to the right edge"}
              className={`rounded p-1 text-gray-dark-500 hover:bg-white/5 hover:text-white ${
                notesAvailable ? "" : "ms-auto"
              }`}
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

          {/* All three bodies stay mounted; `hidden` toggles them. A tab that is not
              available is not rendered at all — its body would only explain its absence. */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {tabs.some((t) => t.key === "feedback") && (
              <section role="tabpanel" hidden={active !== "feedback"} className="flex flex-col">
                <FeedbackBody
                  screen={screen}
                  docked={placement.docked}
                  active={active === "feedback"}
                  focus={focus?.kind === "feedback" ? focus.id : null}
                  onAiming={setAiming}
                />
              </section>
            )}
            {tabs.some((t) => t.key === "comments") && (
              <section role="tabpanel" hidden={active !== "comments"} className="flex flex-col">
                <CommentsBody
                  screen={screen}
                  active={active === "comments"}
                  focus={focus?.kind === "comment" ? focus.id : null}
                  onAiming={setAiming}
                />
              </section>
            )}
            <section role="tabpanel" hidden={active !== "components"} className="flex flex-col">
              <InspectorBody active={active === "components"} />
            </section>
            {tabs.some((t) => t.key === "history") && (
              <section role="tabpanel" hidden={active !== "history"} className="flex flex-col">
                <HistoryBody active={active === "history"} />
              </section>
            )}
          </div>
        </div>
      )}
    </>
  )
}
