import {
  Blocks,
  Columns2,
  Eye,
  EyeOff,
  Frame,
  GripHorizontal,
  History,
  LayoutGrid,
  MapPin,
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
import { createPortal } from "react-dom"
import type { ProtoNavItem, ProtoView } from "../proto-types"
import { useBottomBar } from "./bottom-bar"
import { CommentsBody } from "./comments"
import { compareHref } from "./compare-link"
import { setDock } from "./dock"
import { FEEDBACK_KEY, IS_PAST_VERSION, SLUG } from "./env"
import { FeedbackBody } from "./feedback"
import { frameOf } from "./figma-source"
import { FlowMap } from "./flow-map"
import { HistoryBody } from "./history"
import { InspectorBody } from "./inspector"
import { notesAvailable, refreshNotes, useNotes } from "./notes"
import { type PinKind, Pins } from "./pins"
import { SourceFrame } from "./source-frame"
import { Targeting } from "./targeting"
import { Thread, type ThreadTarget } from "./thread"
import { UI_MARK } from "./target"

/** The review rail and its panel: ONE place for everything a PO does WITH a flow, as
 *  opposed to IN it. The rail is the launcher, and it holds two kinds of tile:
 *
 *   • what one SAYS about the flow — Feedback (to the system), Comments (to the
 *     developers), Components (what the screen owes to the kit), History (every version,
 *     dated, and the way back to one). These OPEN THE PANEL on their tab;
 *   • what one LOOKS at the flow with — Map (the whole flow on one canvas), Source (the
 *     Figma frame this screen was translated from), Compare (this screen beside another
 *     screen, or another version). These open no panel: an overlay, or a new tab.
 *
 *  Plus two things that live ON the screen rather than in the panel, and are launched
 *  from the rail because that is where a PO looks for the flow's tooling:
 *
 *   • the PINS — the comments and feedback of the screen on display, drawn where they
 *     were left (`pins.tsx`), shown or hidden from the rail so the switch works with the
 *     panel closed. Clicking one opens its THREAD (`thread.tsx`) on the spot: until
 *     2026-09-09 it opened this panel and scrolled a list to the right row, which read
 *     the note but gave the gesture it invites — answering it — nowhere to happen;
 *   • the COMMENT tool — a click anywhere on the screen drops a pin and opens an empty
 *     thread on it. It is the pointing layer in `pin` mode, so a comment left this way
 *     carries the same proofs as any other target and survives a republication.
 *
 *  The panel keeps the LISTS, and that division is the whole design: one place to read
 *  everything the flow has collected, one place to hold each conversation.
 *
 *  Those two kinds used to live in two places — the tabs here, the map, the source and
 *  the compare link in the bottom bar — for no reason a PO could see: a bar button and a
 *  rail tile are the same gesture on the same object. Bringing them together (2026-09-08)
 *  leaves the bar with navigation only, which is its subject, and costs nothing at
 *  runtime: the overlays are rendered here, CONTROLLED (`open` / `onClose`), and they are
 *  deliberately NOT tabs — the map and a Figma frame are looked at full width, and a panel
 *  380 px wide is the wrong container for either.
 *
 *  ⚠️ The overlays are rendered as siblings of the rail, never inside it: the rail carries
 *  `backdrop-blur`, which makes it the containing block of its `position: fixed`
 *  descendants — an overlay nested in it would be clipped to a 68 px column.
 *
 *  Before 2026-09-08 the review tools were three different things in three different
 *  places: a floating widget for the feedback, a bottom sheet behind a button of the bar
 *  for the inspector, and nothing at all for the history. A PO reviewing a flow now has
 *  one gesture: the rail in the corner opens the panel on the tab they clicked, and the
 *  others are a click away — without losing the feedback they were writing (the bodies
 *  stay MOUNTED, only hidden: switching tabs to check a component must not wipe a
 *  half-written paragraph).
 *
 *  The container is the feedback widget's, unchanged in its mechanics: it FLOATS (a
 *  380 px panel one can drag out of the way of what is being criticised), and it DOCKS
 *  (a full-height column against the right edge, for longer sessions). Placement and mode
 *  are remembered per browser.
 *
 *  Docked, it PUSHES the flow since 2026-09-09 (`dock.ts`, and the stage in `app.tsx`)
 *  instead of covering its right edge. Covering was defended on the grounds that shifting
 *  the flow breaks what it holds in `position: fixed` — true, and answered where the
 *  problem is: the stage becomes the containing block of those elements, so "the viewport"
 *  means the visible flow while the panel is open. What was not answered was the review
 *  itself — a docked panel hides exactly the column a PO is reading, and the workaround
 *  was to drag the panel off what one wanted to look at. Floating still floats: it is the
 *  mode for a glance, and a 380 px box that deforms the page on every opening would be
 *  the worse trade.
 *
 *  The push has a floor, and the panel pays first: it narrows from 420 to 320 before the
 *  flow gives up anything, and under a stage of 960 px it goes back to covering. A window
 *  too small to hold both is the only case where a docked panel still overlays.
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

/** Docked and PUSHING: how the width of the window is shared.
 *
 *  The panel gives up its own width before it takes the flow's. `MIN_STAGE` is the width
 *  under which the screens stop being reviewable — measured on `42next-profile`, whose
 *  two-column grid crushes its cards under ~960 px of stage — so above it the panel takes
 *  what is left, up to `DOCK_MAX`, and shrinks down to `DOCK_MIN` rather than eat into it.
 *  Under that, it goes back to COVERING: a flow squeezed into its mobile state is not the
 *  flow under review, and a panel that silently changes what it shows is worse than one
 *  covering an edge of it.
 *
 *  Practical thresholds: a window ≥ 1280 pushes (the usual laptop), ≥ 1380 gives the panel
 *  its full 420, anything narrower covers exactly as before. */
const DOCK_MAX = 420
const DOCK_MIN = 320
const MIN_STAGE = 960

/** What a docked panel reserves in a window this wide. 0 = it covers. */
const reserveFor = (w: number): number => {
  const left = w - MIN_STAGE
  return left >= DOCK_MIN ? Math.min(DOCK_MAX, left) : 0
}
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

/** The KEYS. Every entry of the rail answers to one, plus the two switches and Escape —
 *  a review is a lot of opening and closing, and reaching for a 68 px tile each time is
 *  what makes people stop looking at the map.
 *
 *  Digits for the entries, in the order the rail draws them, because that order is what
 *  the eye already knows and because a flow decides which entries exist — a letter per
 *  label would collide the day "Comments" and the comment tool sit in the same rail, and
 *  they do. Two letters for the two things that are not entries: `C` for the comment
 *  tool, which is where every other tool puts it, and `P` for the pins.
 *
 *  ⚠️ A flow contains forms. The handler stands down whenever the key is going into a
 *  field, or whenever a modifier is held — `1` must type a 1, and ⌘1 belongs to the
 *  browser. */
const typing = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null
  if (!el?.tagName) return false
  return (
    el.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) ||
    Boolean(el.closest?.('[contenteditable="true"]'))
  )
}

/** One tile of the rail. A tab tile opens the panel, an action tile fires straight away —
 *  same shape, because for the person clicking it is the same gesture. `href` renders an
 *  anchor: "Compare" is a link, and a link must be openable in a tab of its own. */
const TILE =
  "relative flex w-[68px] flex-col items-center gap-1 px-2 py-2 transition-colors hover:bg-white/5 hover:text-white"

const RailTile = ({
  icon,
  label,
  title,
  badge,
  badgeClass,
  hint,
  onClick,
  href,
  last,
  pressed,
  tone = "text-gray-dark-300",
}: {
  icon: ReactNode
  label: string
  title?: string
  badge?: number
  badgeClass?: string
  /** The key that does the same thing — drawn on the tile, which is the only way a
   *  shortcut gets found by somebody who was not told about it. */
  hint?: string
  onClick?: () => void
  href?: string
  last?: boolean
  pressed?: boolean
  tone?: string
}) => {
  const className = `${TILE} ${tone} ${last ? "" : "border-white/5 border-b"}`
  const body = (
    <>
      {hint ? (
        <span
          aria-hidden="true"
          className="absolute top-1 left-1.5 font-mono text-[9px] text-gray-dark-600"
        >
          {hint}
        </span>
      ) : null}
      {icon}
      <span className="text-[10px] leading-none">{label}</span>
      {badge ? (
        <span
          className={`absolute top-1 right-2 min-w-4 rounded-full px-1 text-center font-mono font-semibold text-[9px] text-gray-dark-950 leading-4 ${badgeClass}`}
        >
          {badge}
        </span>
      ) : null}
    </>
  )
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" title={title ?? label} className={className}>
      {body}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      title={title ?? label}
      className={className}
    >
      {body}
    </button>
  )
}

type TabDef = { key: Tab; label: string; icon: ReactNode; available: boolean; why?: string }

/** An overlay opened FROM the rail and rendered beside it — never a tab: both are looked
 *  at full width. `null` when neither is open. */
type Overlay = "map" | "source"

type ActionDef = {
  key: Overlay | "compare"
  label: string
  title: string
  icon: ReactNode
  available: boolean
  onClick?: () => void
  href?: string
}

// What each tab needs to exist. Feedback is fail-closed on the build key (same safe
// default as the server route without its own); History needs to know WHICH flow it is.
// Components needs nothing: the marks are stamped at compile time. On a PAST version
// (`/v/<slug>/<sha7>/`) feedback and comments are off — both are addressed to the live
// flow, and a pin left on a screen that no longer exists would point at nothing; the
// banner says so, and the history stays, it is how one moves between versions.
const TABS: TabDef[] = [
  {
    key: "feedback",
    label: "Feedback",
    icon: <MessageSquarePlus size={15} aria-hidden="true" />,
    available: Boolean(FEEDBACK_KEY && SLUG) && !IS_PAST_VERSION,
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

export const SidePanel = ({
  views,
  nav,
  title,
  current,
}: {
  views: ProtoView[]
  nav?: ProtoNavItem[]
  title?: string
  current?: ProtoView
}) => {
  // The screen the feedback, the comments and the pins are attached to — its label, which
  // is what a PO reads back in the queue. The rail takes the whole `ProtoView` because the
  // map and the source need the screen itself, not its name.
  const screen = current?.label
  const [active, setActive] = useState<Tab | null>(null)
  const [overlay, setOverlay] = useState<Overlay | null>(null)
  const [aiming, setAiming] = useState(false)
  const [pins, setPins] = useState(readPins)
  const [focus, setFocus] = useState<{ kind: PinKind; id: string } | null>(null)
  // The conversation open ON the screen, and the tool that drops a new one. Both are
  // the flow's, not the panel's: a thread reads and answers with the panel closed.
  const [thread, setThread] = useState<ThreadTarget | null>(null)
  const [dropping, setDropping] = useState(false)
  const notes = useNotes()
  const [placement, setPlacement] = useState<Placement>(readPlacement)
  const [dragging, setDragging] = useState(false)
  // Read, not assumed: whether the panel pushes or covers depends on it, and a window
  // dragged narrower must give the flow its width back rather than crush it.
  const [winW, setWinW] = useState(() => window.innerWidth)
  const bar = useBottomBar()
  const panel = useRef<HTMLDivElement | null>(null)
  const grab = useRef<{ dx: number; dy: number } | null>(null)

  const tabs = TABS.filter((t) => t.available)
  const open = active !== null

  // What one LOOKS at the flow with. Availability is not a preference: the map needs
  // screens, "Source" only exists on a screen translated from a Figma frame — which is
  // itself an answer to "was this one designed, or composed?" — and "Compare" needs the
  // slug the build stamps (`npm run dev <slug>` bakes none).
  const frame = frameOf(current?.path)
  const compare = compareHref()
  const tools: ActionDef[] = [
    {
      key: "map",
      label: "Map",
      title: "The whole flow on one canvas",
      icon: <LayoutGrid size={15} aria-hidden="true" />,
      available: views.length > 0,
      onClick: () => setOverlay("map"),
    },
    {
      key: "source",
      label: "Source",
      title: frame?.name || "The Figma frame this screen was built from — none yet",
      icon: <Frame size={15} aria-hidden="true" />,
      // Drawn even with no frame behind the screen. Its absence used to be an answer in
      // itself ("this one was composed, not designed"); since a frameless screen can now
      // be given a frame — or have one built from it — that sentence costs an action.
      available: true,
      onClick: () => setOverlay("source"),
    },
    {
      key: "compare",
      label: "Compare",
      title: "This screen side by side with another screen, or another version",
      icon: <Columns2 size={15} aria-hidden="true" />,
      available: Boolean(compare),
      href: compare ?? undefined,
    },
  ]
  const actions = tools.filter((a) => a.available)

  const closeOverlay = useCallback(() => setOverlay(null), [])

  // The notes are read once on mount — the pins and the counters need them with the
  // panel closed — and again on every opening: someone else may have commented since.
  useEffect(() => {
    void refreshNotes()
  }, [])
  useEffect(() => {
    if (open) void refreshNotes()
  }, [open])
  useEffect(() => {
    if (thread) void refreshNotes()
  }, [thread])

  useEffect(() => {
    try {
      localStorage.setItem(PINS_KEY, pins ? "on" : "off")
    } catch {
      /* the switch is simply not remembered */
    }
  }, [pins])

  // A pin was clicked: its THREAD opens on the spot (2026-09-09). It used to open the
  // side panel and scroll a list to the right row — readable, but the gesture a note
  // invites is answering it, and that had nowhere to happen. The panel keeps the lists:
  // one place to read everything, one place to hold each conversation.
  const openNote = useCallback((kind: PinKind, id: string) => {
    setDropping(false)
    setThread({ kind, id })
  }, [])
  const closeThread = useCallback(() => setThread(null), [])
  const choose = (tab: Tab) => {
    setFocus(null)
    setActive(tab)
  }

  // Opening a note FROM its row in a list. Both at once, on purpose: the thread is the
  // answer, and the highlighted row is what is left when the thread cannot open — a
  // target this version no longer resolves has no pin to hang a thread on, and a click
  // that produced nothing at all would read as a broken button.
  const openFromList = useCallback((kind: PinKind, id: string) => {
    setThread({ kind, id })
    setFocus({ kind, id })
  }, [])

  // The comment tool. It hides the panel and the pins like any aiming does — what is
  // being pointed at must have nothing of ours over it.
  const drop = useCallback(() => {
    setActive(null)
    setThread(null)
    setDropping(true)
  }, [])

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

  // Esc closes the panel — except while aiming, where it belongs to the targeting overlay
  // (which cancels the aim and leaves the half-written feedback alone), and except while a
  // thread is open over it, which is the topmost thing and therefore the one Esc means.
  useEffect(() => {
    if (!open || aiming || thread) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, aiming, thread, close])

  // The keys. One list, built from what the rail actually draws — a shortcut for an
  // entry a flow does not have would be a key that does nothing, silently.
  const entries: (() => void)[] = [
    ...tabs.map((t) => () => choose(t.key)),
    ...actions.map((a) => () =>
      a.href ? window.open(a.href, "_blank", "noreferrer") : a.onClick?.(),
    ),
  ]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return
      const key = e.key.toLowerCase()
      if (key === "c" && notesAvailable) {
        e.preventDefault()
        drop()
        return
      }
      if (key === "p" && notesAvailable) {
        e.preventDefault()
        setPins((p) => !p)
        return
      }
      const nth = Number.parseInt(e.key, 10)
      if (!Number.isNaN(nth) && nth >= 1 && nth <= entries.length) {
        e.preventDefault()
        entries[nth - 1]()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // No dependency array on purpose: `entries` is rebuilt on every render (a tab
    // appears, an overlay closes), and a listener pinned to the first one would open
    // yesterday's rail.
  })

  // A window resized smaller must not leave the panel outside of it.
  useEffect(() => {
    if (!open || placement.docked) return
    const onResize = () =>
      setPlacement((p) => (p.x === null || p.y === null ? p : { ...p, ...clamp(p.x, p.y) }))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [open, placement.docked, clamp])

  // Always listening, docked or not: the mode is remembered, so the width the panel would
  // reserve has to be known before it is opened again.
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // What the flow gives up. Published rather than passed down: the stage is a sibling
  // (`app.tsx`), and it must be one — the margin must never apply to the panel itself.
  const reserve = open && placement.docked ? reserveFor(winW) : 0
  useEffect(() => {
    setDock(reserve)
  }, [reserve])
  // A flow that unmounts with the panel docked would leave the stage short of 420 px.
  useEffect(() => () => setDock(0), [])

  if (tabs.length === 0 && actions.length === 0) return null

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
    ? reserve
      ? // Pushing: the bar is BESIDE the panel now, not under it, so the column takes the
        // whole height — stopping at `bar` would leave a hole in the corner.
        { top: 0, right: 0, bottom: 0, width: reserve }
      : // Covering (a window too narrow to push): down to the bar, never over it.
        { top: 0, right: 0, bottom: bar, width: "min(420px, 100vw)" }
    : {
        width: `min(${PANEL_W}px, calc(100vw - ${EDGE * 2}px))`,
        maxHeight: `min(72vh, calc(100vh - ${bar + 2 * EDGE}px), 680px)`,
        ...(placement.x !== null && placement.y !== null
          ? { left: placement.x, top: placement.y }
          : { right: EDGE, bottom: bar + 12 }),
      }

  const aimingNow = aiming || dropping

  return (
    <>
      <Pins
        screen={screen}
        visible={pins && notesAvailable}
        hidden={aimingNow}
        openId={thread && thread.kind !== "draft" ? `${thread.kind}:${thread.id}` : undefined}
        onOpen={openNote}
      />

      {/* The comment tool: a click anywhere drops the pin and opens an empty thread on
          it. Portalled to `body` — the panel hides itself while aiming, and an overlay
          nested in it would go with it. */}
      {dropping &&
        createPortal(
          <Targeting
            mode="pin"
            onCancel={() => setDropping(false)}
            onTarget={(target) => {
              setDropping(false)
              setThread({ kind: "draft", target })
            }}
          />,
          document.body,
        )}

      {/* The rail — the "menu on the side". It is the launcher, and it holds the whole tool
          box: the tabs first (they open the panel), then what one looks at the flow with
          (they open no panel), then the pins switch. It steps aside once the panel is open
          — the header then carries the tabs. A window too short for eight tiles scrolls
          the rail rather than pushing tiles under the bar. */}
      {!open && !dropping && (
        <nav
          {...{ [UI_MARK]: "" }}
          aria-label="Review tools"
          style={{
            right: EDGE,
            bottom: bar + 12,
            maxHeight: `calc(100vh - ${bar + 2 * EDGE}px)`,
          }}
          className="fixed z-50 flex w-[68px] flex-col overflow-y-auto overscroll-contain rounded-lg border border-gray-dark-800 bg-gray-dark-950/95 shadow-lg backdrop-blur"
        >
          <div className="flex flex-col">
            {tabs.map((t, i) => (
              <RailTile
                key={t.key}
                icon={t.icon}
                label={t.label}
                hint={`${i + 1}`}
                title={`${t.label}${count(t.key) ? ` — ${count(t.key)} open` : ""} · key ${i + 1}`}
                badge={count(t.key)}
                badgeClass={t.key === "comments" ? "bg-blue-400" : "bg-purple-400"}
                onClick={() => choose(t.key)}
                last={i === tabs.length - 1}
              />
            ))}
          </div>
          {actions.length > 0 ? (
            <div className="flex flex-col border-gray-dark-800 border-t">
              {actions.map((a, i) => (
                <RailTile
                  key={a.key}
                  icon={a.icon}
                  label={a.label}
                  hint={`${tabs.length + i + 1}`}
                  title={`${a.title} · key ${tabs.length + i + 1}`}
                  onClick={a.onClick}
                  href={a.href}
                  last={i === actions.length - 1}
                />
              ))}
            </div>
          ) : null}
          {notesAvailable ? (
            <div className="flex flex-col border-gray-dark-800 border-t">
              {/* Leaving a comment is the one gesture here that starts ON THE SCREEN and
                  not in a panel — hence a tile of its own, next to the switch that shows
                  what it produces. */}
              <RailTile
                icon={<MapPin size={15} aria-hidden="true" />}
                label="Comment"
                hint="C"
                title="Click a spot on the screen to comment on it · key C"
                onClick={drop}
                pressed={dropping}
                tone={dropping ? "text-white" : "text-gray-dark-300"}
              />
              <RailTile
                icon={
                  pins ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />
                }
                label="Pins"
                hint="P"
                title={`${pins ? "Hide the pins" : "Show the pins"} · key P`}
                onClick={() => setPins((p) => !p)}
                pressed={pins}
                tone={pins ? "text-white" : "text-gray-dark-500"}
                last
              />
            </div>
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
              ? // Pushing, the panel is BESIDE the flow and casts no shadow on it: an
                // elevation that does not exist reads as a panel still lying on top.
                `rounded-none border-y-0 border-e-0 ${
                  reserve ? "" : "shadow-[-18px_0_48px_rgba(0,0,0,0.45)]"
                }`
              : "rounded-lg shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
          } ${aimingNow ? "hidden" : ""}`}
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
                    title={`${t.label} · key ${tabs.indexOf(t) + 1}`}
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
                onClick={drop}
                title="Click a spot on the screen to comment on it · key C"
                className="ms-auto rounded p-1 text-gray-dark-500 hover:bg-white/5 hover:text-white"
              >
                <MapPin size={14} aria-hidden="true" />
                <span className="sr-only">Comment on a spot of the screen</span>
              </button>
            ) : null}
            {notesAvailable ? (
              <button
                type="button"
                onClick={() => setPins((p) => !p)}
                aria-pressed={pins}
                title={`${pins ? "Hide the pins" : "Show the pins"} · key P`}
                className={`rounded p-1 hover:bg-white/5 ${pins ? "text-white" : "text-gray-dark-500"}`}
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
              title="Close · Esc"
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
                  onOpen={(id) => openFromList("feedback", id)}
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
                  onOpen={(id) => openFromList("comment", id)}
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

      {/* Opened from the rail, rendered OUTSIDE it — the rail's `backdrop-blur` would make
          it their containing block, and a `position: fixed` overlay would end up clipped to
          a 68 px column. Last in the fragment, so they cover the rail that opened them:
          both carry their own Close, and Escape closes them. */}
      <FlowMap
        views={views}
        nav={nav}
        title={title}
        current={current}
        open={overlay === "map"}
        onClose={closeOverlay}
      />
      <SourceFrame current={current} open={overlay === "source"} onClose={closeOverlay} />

      {/* Last, and marked as ours: it sits over the pins it belongs to, and the pointing
          must never take a thread for a piece of the screen. */}
      <div {...{ [UI_MARK]: "" }}>
        <Thread
          screen={screen}
          open={thread}
          hidden={aimingNow}
          onClose={closeThread}
          onPosted={(id) => setThread({ kind: "comment", id })}
        />
      </div>
    </>
  )
}
