import { LayoutGrid, Share2, X } from "lucide-react"
import {
  Component,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { hrefOf, matchView, type ProtoNavItem, type ProtoView } from "../proto-types"
import { TYPO } from "../typo"
import { AppChrome } from "./app-chrome"
import { AppLayout } from "./app-layout"
import { useBottomBar } from "./bottom-bar"
import { UI_MARK } from "./target"

/** The "Map" widget: the flow zooms out, and the whole app is on one canvas.
 *
 *  What it is for. A flow is walked one screen at a time; its DEPTH — how many screens hang
 *  under "Learn", what a section really contains, what only exists at the end of a path — is
 *  only ever seen by someone who clicks everywhere. Here it is seen at once: the real
 *  screens, live, in miniature, and clicking one enters it.
 *
 *  TWO READINGS, because the question has two halves:
 *   • **Grid** — the screens grouped by navigation section: what the app CONTAINS;
 *   • **Flow** — the same screens laid out by distance from the entry point, with the links
 *     between them drawn: what the app LEADS TO. This is the one that shows a flow whole.
 *
 *  Nothing to install, and NOTHING in the flow. Like the rest of the review tooling, this
 *  lives in the skeleton: a cloned or republished flow carries no trace of it, and a PO
 *  adding a screen to `VIEWS` sees it appear here without wiring anything. The map asks the flow for
 *  no declaration — which is why it works on every flow, including the ones written before
 *  it existed.
 *
 *  WHERE THE TREE COMES FROM. `VIEWS` gives the screens, `NAV` gives the sections: a screen
 *  belongs to the entry that targets it (`path`) or that covers it (`match`, the prefix that
 *  keeps a nav row lit on its deep screens). What no entry covers is grouped last: those are
 *  precisely the screens reachable only by walking through the product. Without a `NAV`
 *  export, one single group in the order of `VIEWS`.
 *
 *  WHERE THE ARROWS COME FROM — and this is the point: they are READ, not declared. A flow
 *  navigates with `<a href="#/…">`, and the map has just mounted every screen; so the links
 *  are in the DOM, and `readEdges` walks them. No `to:` field for a PO to keep up to date, no
 *  static analysis of the source, no capture of what has been clicked: what is drawn is what
 *  the screens really carry, on every flow, including those written before this existed.
 *
 *  ⚠️ WHAT THE SCALE DOES TO WHAT IT CONTAINS. Two effects, one welcome and one to be
 *  neutralised:
 *   • a `transform` on an ancestor becomes the containing block of its `position: fixed`
 *     descendants. The ambient background (two fixed layers) and any fixed or sticky element
 *     a screen carries are therefore CONTAINED in their miniature instead of covering the
 *     page — the map costs nothing to obtain that;
 *   • a component that measures its OWN rendered width reads the reduced width. `AppShell`
 *     is one (`breakpoint`, ResizeObserver on itself): left alone, every miniature shows the
 *     mobile drawer. Hence `breakpoint={0}` — see `app-chrome.tsx`. A kit component that
 *     measures itself the same way inside a screen would call for the same treatment.
 *  Tailwind's `md:`/`lg:` utilities, on the other hand, keep reading the real viewport: on a
 *  narrow window the screens render their mobile layout inside the miniatures. */

/** The reference screen a miniature is rendered at, before scaling. A desktop review size:
 *  the chrome's `max-w-6xl` (1152) plus the sidebar. */
const FRAME = { w: 1440, h: 900 }

const SIZES = [
  { key: "s", label: "S", tile: 236, node: 150 },
  { key: "m", label: "M", tile: 344, node: 210 },
  { key: "l", label: "L", tile: 520, node: 300 },
] as const
type SizeKey = (typeof SIZES)[number]["key"]

const ratio = (width: number) => Math.round(width * (FRAME.h / FRAME.w))

/** Screens no navigation entry covers: reachable only from inside another screen. */
const DEEP = "Reached from within the product"

type Group = { label: string; views: ProtoView[] }

const groupViews = (views: ProtoView[], nav?: ProtoNavItem[]): Group[] => {
  if (!nav?.length) return views.length ? [{ label: "", views }] : []
  const sections = nav.map((item) => ({ item, views: [] as ProtoView[] }))
  const deep: ProtoView[] = []
  for (const view of views) {
    // The exact target first: `match` is a prefix, and a section's own landing screen must
    // not be claimed by a broader entry declared before it.
    const section =
      sections.find((s) => s.item.path === view.path) ??
      sections.find((s) => s.item.match !== undefined && view.path.startsWith(s.item.match))
    if (section) section.views.push(view)
    else deep.push(view)
  }
  const groups = sections
    .filter((s) => s.views.length > 0)
    .map((s) => ({ label: s.item.label, views: s.views }))
  if (deep.length > 0) groups.push({ label: DEEP, views: deep })
  return groups
}

type Graph = { edges: Map<string, Set<string>>; dead: string[] }

/** The links, read off the rendered screens.
 *
 *  Two decisions carry the whole legibility of the drawing:
 *   • **the sidebar does not count.** It is the chrome, it links every section from every
 *     screen: counting it yields a complete graph, which says nothing. `main` is the screen's
 *     own content — `AppShell.Main` on one side, `<aside>` on the other.
 *   • **a link points at a VIEW, not at a URL.** Six links to six peers (`#/profile/mchen`,
 *     `#/profile/akaya`…) are ONE arrow towards `profile/:login`. Hence `matchView`, the very
 *     function the router uses — the map and the routing agree by construction.
 *  A link that matches no view is not dropped in silence: it goes nowhere, and the header
 *  says so. */
const readEdges = (root: HTMLElement, views: ProtoView[]): Graph => {
  const edges = new Map<string, Set<string>>()
  const dead: string[] = []
  for (const screen of root.querySelectorAll<HTMLElement>("[data-map-screen]")) {
    const from = screen.dataset.mapScreen
    if (!from) continue
    const scope = screen.querySelector("main") ?? screen
    for (const anchor of scope.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]')) {
      const href = anchor.getAttribute("href") ?? ""
      const match = matchView(views, href)
      if (!match) {
        dead.push(href)
        continue
      }
      // A breadcrumb pointing at the screen you are already on is not a path.
      if (match.view.path === from) continue
      const targets = edges.get(from) ?? new Set<string>()
      targets.add(match.view.path)
      edges.set(from, targets)
    }
  }
  return { edges, dead: [...new Set(dead)] }
}

/** What a screen is MISSING, when it is missing something — the answer to "why is this one
 *  attached to nothing?".
 *
 *  Two exemptions, without which the mark would cry wolf:
 *   • the ENTRY POINT has no incoming link by definition — you arrive there;
 *   • a screen a NAV entry targets has a way in: the sidebar. It is not orphaned, it is
 *     simply not linked from inside another screen.
 *  What is left really is orphaned: reachable only by typing its address. */
const missingLink = (
  view: ProtoView,
  edges: Map<string, Set<string>>,
  incoming: Set<string>,
  navTargets: Set<string>,
  entry?: string,
): string | null => {
  const noWayIn = !incoming.has(view.path) && view.path !== entry && !navTargets.has(view.path)
  const noWayOut = !edges.has(view.path)
  if (noWayIn && noWayOut) return "no way in or out"
  if (noWayIn) return "no way in"
  if (noWayOut) return "no way out"
  return null
}

type Placed = { view: ProtoView; column: number; x: number; y: number }
type Column = { label: string; x: number }
type Layout = { placed: Placed[]; columns: Column[]; width: number; height: number }

const columnLabel = (column: number, last: boolean, orphans: boolean) => {
  // NOT "sidebar only": a screen can land here while carrying links (`exams` is linked from
  // `agenda/registrations`), simply because nothing leads to the one that links it. What the
  // column really says is: no path from the entry point.
  if (orphans && last) return "Not reached from the entry point"
  if (column === 0) return "Entry point"
  return `${column} click${column > 1 ? "s" : ""} away`
}

/** Places the screens by DISTANCE from the entry point: one column per click.
 *
 *  A breadth-first walk from `VIEWS[0]` — the screen the flow opens on. What it never reaches
 *  is not missing from the map: those screens exist, they are simply only reachable from the
 *  sidebar, and they get the last column, which says exactly that.
 *
 *  Inside a column, the screens are ordered by the average row of the screens that point at
 *  them (a barycentre pass, left to right). It is the cheapest known way to stop the arrows
 *  from crossing for no reason — it does not minimise crossings, it just stops making them
 *  gratuitously. */
const layoutGraph = (views: ProtoView[], edges: Map<string, Set<string>>, width: number): Layout => {
  const height = ratio(width)
  const entry = views[0]?.path
  const depth = new Map<string, number>()
  if (entry !== undefined) {
    depth.set(entry, 0)
    const queue = [entry]
    while (queue.length > 0) {
      const path = queue.shift() as string
      const next = (depth.get(path) as number) + 1
      for (const target of edges.get(path) ?? []) {
        if (depth.has(target)) continue
        depth.set(target, next)
        queue.push(target)
      }
    }
  }
  const reached = [...depth.values()]
  const orphanColumn = (reached.length ? Math.max(...reached) : 0) + 1
  const buckets: ProtoView[][] = Array.from({ length: orphanColumn + 1 }, () => [])
  for (const view of views) buckets[depth.get(view.path) ?? orphanColumn].push(view)

  const parents = new Map<string, string[]>()
  for (const [from, targets] of edges) {
    for (const to of targets) parents.set(to, [...(parents.get(to) ?? []), from])
  }

  const rows = new Map<string, number>()
  const placed: Placed[] = []
  const columns: Column[] = []
  let column = 0
  buckets.forEach((bucket, index) => {
    if (bucket.length === 0) return
    if (index > 0) {
      // Stable sort: a screen whose parents are not placed yet keeps its declared order.
      const barycentre = (view: ProtoView) => {
        const known = (parents.get(view.path) ?? [])
          .map((p) => rows.get(p))
          .filter((r): r is number => r !== undefined)
        return known.length ? known.reduce((a, b) => a + b, 0) / known.length : bucket.length
      }
      bucket.sort((a, b) => barycentre(a) - barycentre(b))
    }
    const x = column * (width + GAP_X)
    columns.push({
      label: columnLabel(index, index === orphanColumn, buckets[orphanColumn].length > 0),
      x,
    })
    bucket.forEach((view, row) => {
      rows.set(view.path, row)
      placed.push({ view, column, x, y: row * (height + CAPTION + GAP_Y) })
    })
    column += 1
  })

  const tallest = Math.max(0, ...buckets.map((b) => b.length))
  return {
    placed,
    columns,
    width: Math.max(0, columns.length * (width + GAP_X) - GAP_X),
    height: Math.max(0, tallest * (height + CAPTION + GAP_Y) - GAP_Y),
  }
}

const CAPTION = 34
const GAP_X = 92
const GAP_Y = 26
/** Room kept above the first row for the column labels. Two lines' worth: "Not reached from
 *  the entry point" wraps at every tile width, and a label that overlaps its own column is
 *  worse than a gap. */
const HEADER = 44

/** The curve from one screen to another. Three cases, because a flow goes back:
 *   • forwards  — right edge to left edge, the reading direction;
 *   • sideways  — two screens in the same column: a loop out on the right;
 *   • backwards — a "back" link (a breadcrumb, a "back to the list"): left edge to right
 *     edge, drawn dashed. Half the links of a real flow are these, and drawing them like the
 *     others turns the canvas into wool. */
const edgePath = (a: Placed, b: Placed, width: number, height: number) => {
  const half = height / 2
  const ay = a.y + half
  const by = b.y + half
  if (b.column > a.column) {
    const x1 = a.x + width
    const bend = Math.max(40, (b.x - x1) / 2)
    return `M${x1},${ay} C${x1 + bend},${ay} ${b.x - bend},${by} ${b.x},${by}`
  }
  if (b.column === a.column) {
    const x = a.x + width
    const bend = 40 + Math.abs(by - ay) / 6
    return `M${x},${ay} C${x + bend},${ay} ${x + bend},${by} ${x},${by}`
  }
  const x2 = b.x + width
  const bend = Math.max(40, (a.x - x2) / 2)
  return `M${a.x},${ay} C${a.x - bend},${ay} ${x2 + bend},${by} ${x2},${by}`
}

/** A screen written by an agent can throw on render. Every screen of the flow mounts at once
 *  here: without this, one broken screen takes down the flow the PO was reviewing. */
class Guard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    // Sized for the miniature's scale: this text is read after a ÷4 reduction.
    return (
      <div className="flex h-full items-center justify-center bg-gray-dark-950 p-12 text-center">
        <span className="font-semibold text-5xl text-pink-400">This screen failed to render</span>
      </div>
    )
  }
}

const Miniature = ({
  view,
  views,
  nav,
  title,
}: {
  view: ProtoView
  views: ProtoView[]
  nav?: ProtoNavItem[]
  title?: string
}) => {
  // A parameterized route ("learn/project/:slug") is rendered on the example the flow itself
  // declares in `href` — the same link the bottom bar opens.
  const params = matchView(views, hrefOf(view))?.params ?? {}
  const screen = view.render(params)
  return (
    <Guard>
      {nav ? (
        <AppChrome
          nav={nav}
          views={views}
          currentPath={view.path}
          title={title}
          breakpoint={0}
        >
          {screen}
        </AppChrome>
      ) : (
        <AppLayout>{screen}</AppLayout>
      )}
    </Guard>
  )
}

/** One screen, reduced: the box, the scaled render, and the link laid over it. */
const Screenshot = ({
  view,
  views,
  nav,
  title,
  width,
  mounted,
  current,
  dimmed,
  missing,
  onPick,
  onHover,
}: {
  view: ProtoView
  views: ProtoView[]
  nav?: ProtoNavItem[]
  title?: string
  width: number
  mounted: boolean
  current: boolean
  dimmed?: boolean
  missing?: string | null
  onPick: () => void
  onHover?: (path: string | null) => void
}) => (
  <div
    className={`group relative overflow-hidden rounded-lg border bg-gray-dark-950 transition-all ${
      missing
        ? "border-orange-400"
        : current
          ? "border-brand-400"
          : "border-gray-dark-800 hover:border-white/25"
    } ${current ? "ring-2 ring-brand-400/50" : ""} ${dimmed ? "opacity-25" : ""}`}
    style={{ width, height: ratio(width) }}
    onMouseEnter={() => onHover?.(view.path)}
    onMouseLeave={() => onHover?.(null)}
  >
    {/* The scale wrapper: it reduces the screen AND contains the fixed layers it carries. */}
    <div
      data-map-screen={view.path}
      className="origin-top-left"
      style={{ width: FRAME.w, height: FRAME.h, transform: `scale(${width / FRAME.w})` }}
      // Not focusable, not clickable, not read: the miniature is an image of a screen. The
      // click target is the link laid over it.
      inert
      aria-hidden="true"
    >
      {mounted ? <Miniature view={view} views={views} nav={nav} title={title} /> : null}
    </div>
    {/* A real link (middle-click, copy the address) rather than a click handler, laid OVER
        the miniature rather than around it — an <a> must not wrap a screen full of buttons. */}
    <a
      href={hrefOf(view)}
      onClick={onPick}
      onFocus={() => onHover?.(view.path)}
      onBlur={() => onHover?.(null)}
      aria-label={`Open ${view.label}`}
      className="absolute inset-0 rounded-lg ring-brand-500 ring-inset transition-all focus-visible:outline-none focus-visible:ring-2 group-hover:bg-white/5"
    />
    {current ? (
      <span
        className={`${TYPO.nav} pointer-events-none absolute end-2 top-2 rounded bg-brand-500 px-1.5 py-0.5 text-[10px] text-white shadow-lg`}
      >
        You are here
      </span>
    ) : null}
    {missing ? (
      <span
        className={`${TYPO.nav} pointer-events-none absolute start-2 top-2 rounded bg-orange-400 px-1.5 py-0.5 text-[10px] text-gray-dark-950`}
      >
        {missing}
      </span>
    ) : null}
  </div>
)

const Caption = ({ view }: { view: ProtoView }) => (
  <div className="flex flex-col" style={{ height: CAPTION }}>
    <span className="truncate font-semibold text-white text-xs">{view.label}</span>
    <span className="truncate font-mono text-[11px] text-gray-dark-500">#/{view.path}</span>
  </div>
)

const Tile = ({
  view,
  views,
  nav,
  title,
  tile,
  current,
  onPick,
}: {
  view: ProtoView
  views: ProtoView[]
  nav?: ProtoNavItem[]
  title?: string
  tile: number
  current: boolean
  onPick: () => void
}) => {
  const box = useRef<HTMLLIElement>(null)
  const [mounted, setMounted] = useState(false)

  // Mounted only once in sight: a flow of twenty-six screens is twenty-six full apps, each
  // with its own sidebar and ambient background. Opening the map must not cost that.
  useEffect(() => {
    if (mounted) return
    const el = box.current
    if (!el || !("IntersectionObserver" in window)) {
      setMounted(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin: "600px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mounted])

  return (
    <li ref={box} className="flex flex-col gap-2">
      <Screenshot
        view={view}
        views={views}
        nav={nav}
        title={title}
        width={tile}
        mounted={mounted}
        current={current}
        onPick={onPick}
      />
      <Caption view={view} />
    </li>
  )
}

/** The map is CONTROLLED: the tile that opens it lives in the review rail (`side-panel.tsx`),
 *  not here. It still closes itself — Escape, its own Close, and picking a screen, which is
 *  what one opens it for. */
export const FlowMap = ({
  views,
  nav,
  title,
  current,
  open,
  onClose,
}: {
  views: ProtoView[]
  nav?: ProtoNavItem[]
  title?: string
  current?: ProtoView
  open: boolean
  onClose: () => void
}) => {
  const [mode, setMode] = useState<"grid" | "flow">("grid")
  const [size, setSize] = useState<SizeKey>("m")
  const [graph, setGraph] = useState<Graph | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const canvas = useRef<HTMLDivElement>(null)
  // The canvas stops exactly ON TOP of the bar — never over it: the flow's own navigation
  // stays reachable while the map is open, and one leaves the map by entering a screen.
  const barHeight = useBottomBar()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Read BEFORE the paint, and not in a `useEffect`: the first layout has no link yet, so it
  // stacks every screen into one column. `useLayoutEffect` re-renders in the same frame — the
  // wrong layout is computed but never shown.
  useLayoutEffect(() => {
    if (mode !== "flow" || graph !== null || !canvas.current) return
    setGraph(readEdges(canvas.current, views))
  }, [mode, graph, views])

  if (!open || views.length === 0) return null

  const chosen = SIZES.find((s) => s.key === size) ?? SIZES[1]
  const groups = groupViews(views, nav)
  const incoming = new Set([...(graph?.edges.values() ?? [])].flatMap((t) => [...t]))
  // A NAV entry is a way in too — through the sidebar. Both forms it can take resolve to a
  // screen: `path` names one, `href` is a concrete link that `matchView` resolves.
  const navTargets = new Set(
    (nav ?? []).flatMap((item) => {
      const paths: string[] = []
      if (item.path) paths.push(item.path)
      if (item.href) {
        const match = matchView(views, item.href)
        if (match) paths.push(match.view.path)
      }
      return paths
    }),
  )
  const layout = mode === "flow" ? layoutGraph(views, graph?.edges ?? new Map(), chosen.node) : null
  const byPath = new Map((layout?.placed ?? []).map((p) => [p.view.path, p]))
  const nodeHeight = ratio(chosen.node)
  const links = [...(graph?.edges ?? new Map())].flatMap(([from, targets]) =>
    [...targets].map((to) => ({ from, to })),
  )

  return (
    <div
      {...{ [UI_MARK]: "" }}
      className="fixed inset-x-0 top-0 z-50 overflow-auto bg-gray-dark-950/98 backdrop-blur"
      style={{ bottom: barHeight }}
      role="dialog"
      aria-modal="true"
      aria-label="Map of the flow"
    >
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-gray-dark-800 border-b bg-gray-dark-950/95 px-5 py-3 backdrop-blur">
        <span className="font-semibold text-sm text-white">{title ?? "Map of the flow"}</span>
        <span className="text-gray-dark-400 text-xs">
          {views.length} screen{views.length > 1 ? "s" : ""}
          {mode === "grid" && groups.length > 1 ? ` · ${groups.length} sections` : ""}
          {mode === "flow" ? ` · ${links.length} link${links.length > 1 ? "s" : ""}` : ""}
        </span>
        {mode === "flow" ? (
          <span className="flex items-center gap-3 text-[11px] text-gray-dark-500">
            <span className="flex items-center gap-1.5">
              <svg width="16" height="4" aria-hidden="true">
                <title>solid line</title>
                <line x1="0" y1="2" x2="16" y2="2" stroke="currentColor" className="text-white/35" />
              </svg>
              leads to
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="4" aria-hidden="true">
                <title>dashed line</title>
                <line
                  x1="0"
                  y1="2"
                  x2="16"
                  y2="2"
                  stroke="currentColor"
                  strokeDasharray="4 3"
                  className="text-white/35"
                />
              </svg>
              goes back
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[3px] border border-orange-400" />
              missing a link — in, out, or both
            </span>
            <span>hover a screen to isolate it</span>
          </span>
        ) : null}
        {mode === "flow" && graph && graph.dead.length > 0 ? (
          <span className="rounded bg-pink-400/10 px-2 py-0.5 font-mono text-[11px] text-pink-300">
            {graph.dead.length} link{graph.dead.length > 1 ? "s" : ""} to nowhere:{" "}
            {graph.dead.slice(0, 3).join(" ")}
          </span>
        ) : null}

        <div className="ms-auto flex items-center gap-1" role="group" aria-label="Reading">
          {(
            [
              { key: "grid", label: "Grid", icon: <LayoutGrid size={13} aria-hidden="true" /> },
              { key: "flow", label: "Flow", icon: <Share2 size={13} aria-hidden="true" /> },
            ] as const
          ).map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                mode === m.key
                  ? "bg-white/10 font-semibold text-white"
                  : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Zoom">
          {SIZES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSize(s.key)}
              aria-pressed={size === s.key}
              className={`rounded-md px-2 py-1 font-mono text-[11px] transition-colors ${
                size === s.key
                  ? "bg-white/10 font-semibold text-white"
                  : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={13} aria-hidden="true" />
          Close
        </button>
      </div>

      {mode === "grid" ? (
        <div className="flex flex-col gap-8 px-5 py-6">
          {groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-3">
              {group.label ? (
                <div className="flex items-baseline gap-2">
                  <h2 className={`${TYPO.nav} text-gray-dark-300 text-xs`}>{group.label}</h2>
                  <span className="font-mono text-[11px] text-gray-dark-600">
                    {group.views.length}
                  </span>
                </div>
              ) : null}
              <ul className="flex flex-wrap gap-x-5 gap-y-6">
                {group.views.map((view) => (
                  <Tile
                    key={view.path}
                    view={view}
                    views={views}
                    nav={nav}
                    title={title}
                    tile={chosen.tile}
                    current={view === current}
                    onPick={onClose}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="px-5 py-6">
          <div
            ref={canvas}
            className="relative"
            style={{ width: layout?.width, height: (layout?.height ?? 0) + HEADER }}
          >
            {layout?.columns.map((column) => (
              <span
                key={column.label}
                className={`${TYPO.nav} absolute top-0 text-[11px] text-gray-dark-500 leading-tight`}
                style={{ left: column.x, width: chosen.node + GAP_X - 16 }}
              >
                {column.label}
              </span>
            ))}
            <svg
              className="pointer-events-none absolute left-0 overflow-visible"
              style={{ top: HEADER }}
              width={layout?.width}
              height={layout?.height}
              aria-hidden="true"
            >
              <defs>
                {/* A link is read at its two ends: a DOT where it starts, an ARROW where
                    it lands. Without the dot, a "goes back" link — which leaves by the
                    left edge and heads left — looks exactly like a link arriving, and a
                    screen marked "no way in" seems to contradict its own drawing. */}
                <marker
                  id="flow-map-arrow"
                  viewBox="0 0 8 8"
                  refX="7"
                  refY="4"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M0,1 L7,4 L0,7 z" fill="currentColor" />
                </marker>
                <marker
                  id="flow-map-start"
                  viewBox="0 0 6 6"
                  refX="3"
                  refY="3"
                  markerWidth="5"
                  markerHeight="5"
                >
                  <circle cx="3" cy="3" r="2.2" fill="currentColor" />
                </marker>
              </defs>
              {links.map(({ from, to }) => {
                const a = byPath.get(from)
                const b = byPath.get(to)
                if (!a || !b) return null
                const back = b.column <= a.column
                const touched = hover === from || hover === to
                return (
                  <path
                    key={`${from}→${to}`}
                    d={edgePath(a, b, chosen.node, nodeHeight)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={touched ? 2 : 1}
                    strokeDasharray={back ? "4 3" : undefined}
                    markerStart="url(#flow-map-start)"
                    markerEnd="url(#flow-map-arrow)"
                    className={
                      touched
                        ? "text-brand-400"
                        : hover
                          ? "text-white/5"
                          : back
                            ? "text-white/15"
                            : "text-white/35"
                    }
                  />
                )
              })}
            </svg>
            {layout?.placed.map((node) => (
              <div
                key={node.view.path}
                className="absolute flex flex-col gap-2"
                style={{ left: node.x, top: node.y + HEADER, width: chosen.node }}
              >
                <Screenshot
                  view={node.view}
                  views={views}
                  nav={nav}
                  title={title}
                  width={chosen.node}
                  // Every screen mounts: the links are read off the rendered DOM, so a
                  // screen left unmounted would be a screen with no arrow — a hole that
                  // would read as "this one leads nowhere".
                  mounted
                  current={node.view === current}
                  missing={missingLink(
                    node.view,
                    graph?.edges ?? new Map(),
                    incoming,
                    navTargets,
                    views[0]?.path,
                  )}
                  dimmed={
                    hover !== null &&
                    hover !== node.view.path &&
                    !(graph?.edges.get(hover)?.has(node.view.path) ?? false) &&
                    !(graph?.edges.get(node.view.path)?.has(hover) ?? false)
                  }
                  onPick={onClose}
                  onHover={setHover}
                />
                <Caption view={node.view} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
