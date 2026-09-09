import {
  ArrowLeft,
  ArrowLeftRight,
  ExternalLink,
  KeyRound,
  Link2,
  Link2Off,
} from "lucide-react"
import {
  type CSSProperties,
  type FormEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FIGMA, PREV } from "../../../src/layout/compare-link"
import { fromFigmaPrompt, toFigmaPrompt } from "../../../src/layout/figma-prompts"
import { TYPO } from "../../../src/typo"
import { AccessError, get, getFlows, MCP_URL, readKey, writeKey } from "../mcp"

/** The COMPARE page: two flows side by side, live, in two frames.
 *
 *  Two questions, one page:
 *   • "what changed between Tuesday and today?" — the same screen, in two VERSIONS of
 *     the flow. The right side is a past version (`/v/<slug>/<sha7>/`, built on demand by
 *     the site from the flow's files at that commit), the left is the live flow;
 *   • "do these two screens agree?" — two SCREENS of a flow, same version or not, or two
 *     flows altogether.
 *
 *  Each side is a LOCATOR in the URL — `?a=<slug>[@<sha7>|@prev][#/screen]&b=…` — so a
 *  comparison is a link one pastes in a message. `@prev` is the one version that cannot be
 *  written as a sha: it is what the Compare tile of a flow points at ("this screen against
 *  the previous publication"), and it is resolved here, against the flow's history, the
 *  moment that history arrives — after which the URL carries the sha it found. The frames are the flows themselves,
 *  rendered `?bare` (no bottom bar, no side panel: the tooling of a tab, drawn twice it
 *  would drive nothing), and they TALK: a frame says which screens it declares and where
 *  it is (`sanctum:state`), the page tells it where to go (`sanctum:navigate`) — see
 *  `src/layout/embed.ts`. That is what makes the screen picker per side and the SYNC
 *  possible: with sync on, navigating in one frame navigates the other to the same
 *  screen. Picking a different screen on one side turns it off — that is the "two
 *  screens" question, and a page that fought it would answer neither.
 *
 *  What needs a key, and what does not. A live flow is public. A past version is built
 *  by the site on request of the MCP (`POST /console/protos/preview.json`, the console's
 *  read key), and stays on the site's disk until pruned or redeployed — so this page
 *  checks first whether the build is already there (one HEAD, same origin, no key), and
 *  only asks for the key when a side must actually be built. The versions list of a
 *  picker is behind the same key: without it, a side can still be typed in the URL.
 *
 *  Scale. Two desktop layouts in half a window each is two cramped layouts. The frames
 *  are rendered at a FIXED width (1280 by default — the width a PO designs for) and
 *  scaled down to fit their column, so what is compared is the layout, not its
 *  response to a narrow viewport. "Fit" gives the native width when one wants the real
 *  thing. */

type Locator = { slug: string; sha: string; hash: string }

type EmbedView = { path: string; label: string; href: string; hidden: boolean }

type EmbedState = {
  type: "sanctum:state"
  slug: string
  version: string
  hash: string
  views: EmbedView[]
  /** Only from a side rendered as the mockup: the width the frame was designed at, and
   *  the frame's link and name — which this page has no other way to learn. */
  figmaWidth?: number
  figmaLink?: string
  figmaName?: string
}

type Status =
  | { kind: "idle" }
  /** `@prev` is waiting for the flow's history to say which commit it names. */
  | { kind: "resolving" }
  | { kind: "checking" }
  | { kind: "needs-key" }
  | { kind: "building" }
  | { kind: "ready"; base: string }
  | { kind: "error"; text: string }

type Flow = { slug: string; title?: string; ok?: boolean; published_at?: string }

type Version = {
  sha: string
  short: string
  date: string
  author: string
  title: string
  restored_from: string | null
}

type Side = "a" | "b"

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/
const SHA_RE = /^[0-9a-f]{7,40}$/

/** `<slug>[@<sha>|@prev][#/screen]` → a locator, or null when the string is not one. */
const parseLocator = (raw: string | null): Locator | null => {
  if (!raw) return null
  const hashAt = raw.indexOf("#")
  const head = hashAt >= 0 ? raw.slice(0, hashAt) : raw
  const hash = hashAt >= 0 ? raw.slice(hashAt) : ""
  const [slug, sha = ""] = head.split("@")
  if (!SLUG_RE.test(slug)) return null
  if (sha && sha !== PREV && sha !== FIGMA && !SHA_RE.test(sha)) return null
  return { slug, sha: sha === PREV || sha === FIGMA ? sha : sha.slice(0, 7), hash }
}

const formatLocator = (l: Locator) => `${l.slug}${l.sha ? `@${l.sha}` : ""}${l.hash}`

// The mockup is served by the LIVE flow, in a mode of its own (`?bare&figma`): it is not a
// past version of anything, and there is nothing to build for it.
const isMockup = (l: Locator) => l.sha === FIGMA

const baseOf = (l: Locator) =>
  l.sha && !isMockup(l) ? `/v/${l.slug}/${l.sha}/` : `/p/${l.slug}/`

const WIDTHS = [
  { key: 1280, label: "1280" },
  { key: 1440, label: "1440" },
  { key: 0, label: "Fit" },
]

/** How the two sides are shown. `side` is the historical page: two columns.
 *
 *  The four others STACK them in one box, and they exist because two columns answer
 *  "are these the same?" and nothing more precise. A 4 px shift is invisible between two
 *  neighbouring columns and obvious the moment the two are laid on top of each other —
 *  which is only meaningful if both are laid out at the SAME width, hence the frame's
 *  design width becoming a width option the moment a mockup side reports it. */
const MODES = [
  { key: "side", label: "Side by side", hint: "Two columns, the historical view" },
  { key: "curtain", label: "Curtain", hint: "Drag the divider: A on the left, B on the right" },
  { key: "flip", label: "Flip", hint: "Alternate the two in place — press F" },
  { key: "opacity", label: "Opacity", hint: "Dissolve B into A" },
  { key: "difference", label: "Difference", hint: "What is identical goes black; what differs lights up" },
] as const

type Mode = (typeof MODES)[number]["key"]

const isMode = (v: string | null): v is Mode => MODES.some((m) => m.key === v)

/** Whose first name goes into the commit. Read where the flow's own widgets left it, and
 *  never asked for here: a form that demands a name to accept a link is a form one closes. */
const whoami = (): string => {
  try {
    return (localStorage.getItem("feedback-author") ?? "").slice(0, 60)
  } catch {
    return ""
  }
}

const withTime = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
const when = (iso: string) => {
  const t = Date.parse(iso)
  return Number.isNaN(t) ? iso : withTime.format(t)
}

const detail = async (r: Response): Promise<string> => {
  try {
    return ((await r.json()) as { error?: string }).error ?? `HTTP ${r.status}`
  } catch {
    return `HTTP ${r.status}`
  }
}

/** Whether a past version is already built on the site. Same origin, no key. */
const isBuilt = async (base: string): Promise<boolean> => {
  try {
    const r = await fetch(`${base}index.html`, { method: "HEAD", cache: "no-store" })
    return r.ok
  } catch {
    return false
  }
}

/** Asks the MCP to build a past version on the site. Returns the served path. */
const build = async (l: Locator, key: string): Promise<string> => {
  const r = await fetch(`${MCP_URL}/console/protos/preview.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-DS-Key": key },
    body: JSON.stringify({ slug: l.slug, sha: l.sha }),
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (r.status === 422) {
    throw new Error(
      `This version no longer compiles against today's skeleton.\n${await detail(r)}`,
    )
  }
  if (!r.ok) throw new Error(await detail(r))
  const data = (await r.json()) as { path?: string }
  return data.path ?? baseOf(l)
}

// ------------------------------------------------------------------ one side

type Pane = {
  loc: Locator
  status: Status
  views: EmbedView[]
  /** The hash the frame reports — the truth once it has loaded. */
  hash: string
  /** Reported by a mockup side once its picture is in: the width it was designed at, and
   *  the frame it shows. */
  figmaWidth: number
  figmaLink: string
  figmaName: string
}

type PaneHandle = {
  pane: Pane
  /** Point the side somewhere else (flow, version, screen). */
  set: (l: Locator) => void
  /** What the frame just said about itself. */
  report: (s: EmbedState) => void
}

const usePane = (initial: Locator | null, key: string): PaneHandle => {
  const [loc, setLoc] = useState<Locator>(initial ?? { slug: "", sha: "", hash: "" })
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [views, setViews] = useState<EmbedView[]>([])
  const [hash, setHash] = useState(initial?.hash ?? "")
  const [figma, setFigma] = useState({ width: 0, link: "", name: "" })

  // Resolving the base: a live flow is a path; a past version is checked, then built.
  // Keyed on slug + sha — a hash change must NOT rebuild the side.
  const { slug, sha } = loc
  useEffect(() => {
    let alive = true
    if (!slug) {
      setStatus({ kind: "idle" })
      return
    }
    // `@prev` names no commit yet: the page resolves it from the flow's history. Asking
    // the server to build "prev" would be a 4xx, and probing `/v/<slug>/prev/` a 404.
    if (sha === PREV) {
      setStatus(key ? { kind: "resolving" } : { kind: "needs-key" })
      return
    }
    const l = { slug, sha, hash: "" }
    const base = baseOf(l)
    // The live flow, and the mockup it declares, are both already on the site.
    if (!sha || isMockup(l)) {
      setStatus({ kind: "ready", base })
      return
    }
    setStatus({ kind: "checking" })
    void (async () => {
      if (await isBuilt(base)) {
        if (alive) setStatus({ kind: "ready", base })
        return
      }
      if (!key) {
        if (alive) setStatus({ kind: "needs-key" })
        return
      }
      if (alive) setStatus({ kind: "building" })
      try {
        const path = await build(l, key)
        if (alive) setStatus({ kind: "ready", base: path })
      } catch (e) {
        if (!alive) return
        if (e instanceof AccessError) setStatus({ kind: "needs-key" })
        else setStatus({ kind: "error", text: e instanceof Error ? e.message : String(e) })
      }
    })()
    return () => {
      alive = false
    }
  }, [slug, sha, key])

  // The frame's screen list belongs to a (flow, version): a side pointed at another one
  // forgets it until the new frame reports its own.
  const locRef = useRef(loc)
  locRef.current = loc
  const set = useCallback((l: Locator) => {
    if (l.slug !== locRef.current.slug || l.sha !== locRef.current.sha) {
      setViews([])
      setFigma({ width: 0, link: "", name: "" })
    }
    setLoc(l)
    setHash(l.hash)
  }, [])

  const report = useCallback((s: EmbedState) => {
    setViews(s.views)
    setHash(s.hash)
    // Merged, not replaced: the link arrives first, the width three seconds later.
    if (s.figmaWidth || s.figmaLink !== undefined)
      setFigma((f) => ({
        width: s.figmaWidth || f.width,
        link: s.figmaLink ?? f.link,
        name: s.figmaName ?? f.name,
      }))
  }, [])

  const pane: Pane = useMemo(
    () => ({ loc, status, views, hash, figmaWidth: figma.width, figmaLink: figma.link,
             figmaName: figma.name }),
    [loc, status, views, hash, figma],
  )
  return { pane, set, report }
}

// ------------------------------------------------------------------ the frame

const Frame = ({
  pane,
  width,
  frameRef,
  nonce = 0,
}: {
  pane: Pane
  width: number
  frameRef: RefObject<HTMLIFrameElement | null>
  /** Bumped to REMOUNT the frame — the mockup side after its provenance was rewritten.
   *  It lands in the query, which is what `key` is built from. */
  nonce?: number
}) => {
  const box = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: Math.round(r.width), h: Math.round(r.height) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const frameW = width || size.w
  const scale = frameW && size.w ? Math.min(1, size.w / frameW) : 1
  const src =
    pane.status.kind === "ready"
      ? `${pane.status.base}?bare${isMockup(pane.loc) ? "&figma" : ""}` +
        `${nonce ? `&r=${nonce}` : ""}${pane.hash || pane.loc.hash}`
      : undefined

  return (
    <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-gray-dark-950">
      {src ? (
        <iframe
          ref={frameRef}
          key={src.split("#")[0]}
          src={src}
          title={`${pane.loc.slug}${pane.loc.sha ? ` @ ${pane.loc.sha}` : ""}`}
          className="absolute top-0 left-0 border-0 bg-gray-dark-950"
          style={{
            width: frameW || "100%",
            height: size.h ? size.h / scale : "100%",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      ) : null}
      {pane.status.kind !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {pane.status.kind === "idle" ? (
            <p className="text-gray-dark-500 text-sm">Pick a flow above.</p>
          ) : null}
          {pane.status.kind === "resolving" ? (
            <p className="text-gray-dark-400 text-sm">
              Looking up the version before the live one…
            </p>
          ) : null}
          {pane.status.kind === "checking" ? (
            <p className="text-gray-dark-400 text-sm">Looking for this version on the site…</p>
          ) : null}
          {pane.status.kind === "building" ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-white">
                Building version <span className="font-mono">{pane.loc.sha}</span>…
              </p>
              <p className="text-gray-dark-500 text-xs">
                From the flow's files at that commit. A few seconds; nothing is restored.
              </p>
            </div>
          ) : null}
          {pane.status.kind === "needs-key" ? (
            <p className="max-w-sm text-center text-gray-dark-400 text-sm">
              {pane.loc.sha === PREV
                ? "Which version comes before the live one is read from the flow's history: enter the console's read key above."
                : "This version is not built on the site yet. Building it goes through the MCP server: enter the console's read key above."}
            </p>
          ) : null}
          {pane.status.kind === "error" ? (
            <pre className="max-w-lg whitespace-pre-wrap font-mono text-pink-400 text-xs leading-snug">
              {pane.status.text}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

// ------------------------------------------------------------------ the stacked stage

/** The two sides IN ONE BOX. Everything here rests on a single condition, and it is the
 *  reason the mockup reports its design width: both frames are laid out at the SAME width
 *  and scaled by the SAME factor, so a pixel of one is a pixel of the other. Scaled to
 *  anything else, the built screen reflows while the picture merely shrinks, and the
 *  superposition compares two things that were never the same thing.
 *
 *  A is the ground and never moves. B is the layer, and the mode is nothing more than how
 *  B is painted over it: clipped (curtain), shown or not (flip), dissolved (opacity), or
 *  blended (difference). Which is why the four cost so little next to the first: the hard
 *  part was the alignment, not the four styles. */
const Stage = ({
  a,
  b,
  width,
  mode,
  curtain,
  blend,
  showB,
  nudge,
  frameA,
  frameB,
  nonceA,
  nonceB,
  onCurtain,
}: {
  a: Pane
  b: Pane
  width: number
  mode: Mode
  curtain: number
  blend: number
  showB: boolean
  nudge: { x: number; y: number }
  frameA: RefObject<HTMLIFrameElement | null>
  frameB: RefObject<HTMLIFrameElement | null>
  nonceA: number
  nonceB: number
  onCurtain: (pct: number) => void
}) => {
  const stage = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)

  const at = (clientX: number) => {
    const r = stage.current?.getBoundingClientRect()
    if (!r?.width) return
    onCurtain(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }

  const layer: Record<Mode, CSSProperties> = {
    side: {},
    curtain: { clipPath: `inset(0 0 0 ${curtain}%)` },
    flip: { opacity: showB ? 1 : 0, pointerEvents: showB ? "auto" : "none" },
    opacity: { opacity: blend },
    difference: { mixBlendMode: "difference" },
  }

  return (
    <div
      ref={stage}
      className="relative min-h-0 flex-1 overflow-hidden bg-gray-dark-950"
      // The blend of the difference mode must not reach the page behind the stage.
      style={{ isolation: "isolate" }}
    >
      <div className="absolute inset-0 flex">
        <Frame pane={a} width={width} frameRef={frameA} nonce={nonceA} />
      </div>
      <div
        className="absolute inset-0 flex"
        style={{
          ...layer[mode],
          // The NUDGE. A superposition almost always starts with a global offset — a
          // container padded differently, a header one line taller — and until it is
          // cancelled, every element reads as wrong and none of them stands out. Moving
          // the layer until the two agree somewhere turns "everything is off" into "this
          // is off", which is the finding one came for.
          ...(nudge.x || nudge.y
            ? { transform: `translate(${nudge.x}px, ${nudge.y}px)` }
            : {}),
        }}
      >
        <Frame pane={b} width={width} frameRef={frameB} nonce={nonceB} />
      </div>

      {mode === "curtain" ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-white/40"
            style={{ left: `${curtain}%` }}
            aria-hidden="true"
          />
          {/* A HANDLE, not a stage that follows the pointer: the frames stay clickable,
              which is half of what one comes to check on a built screen. */}
          <div
            role="slider"
            tabIndex={0}
            aria-label="Curtain position"
            aria-valuenow={Math.round(curtain)}
            aria-valuemin={0}
            aria-valuemax={100}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              setDragging(true)
            }}
            onPointerMove={(e) => dragging && at(e.clientX)}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId)
              setDragging(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") onCurtain(Math.max(0, curtain - (e.shiftKey ? 10 : 1)))
              if (e.key === "ArrowRight") onCurtain(Math.min(100, curtain + (e.shiftKey ? 10 : 1)))
            }}
            className="-translate-x-1/2 absolute inset-y-0 z-10 flex w-6 cursor-col-resize touch-none items-center justify-center focus:outline-none"
            style={{ left: `${curtain}%` }}
          >
            <span className="h-10 w-1.5 rounded-full bg-white/70 shadow" />
          </div>
        </>
      ) : null}
    </div>
  )
}

// ------------------------------------------------------------------ the header of a side

const SideHeader = ({
  side,
  pane,
  flows,
  versions,
  onChange,
  sync,
}: {
  side: Side
  pane: Pane
  flows: Flow[]
  versions: Version[] | null
  onChange: (l: Locator, why: "flow" | "version" | "screen") => void
  sync: boolean
}) => {
  const { loc } = pane
  const flow = flows.find((f) => f.slug === loc.slug)
  const version = versions?.find((v) => v.short === loc.sha)
  const screens = pane.views.filter((v) => !v.hidden || v.href === pane.hash)
  const current = pane.hash || loc.hash
  const open =
    pane.status.kind === "ready"
      ? `${pane.status.base}${isMockup(loc) ? `?bare&figma${current}` : current}`
      : ""

  const select =
    "min-w-0 rounded-md border border-gray-dark-800 bg-white/2 px-2 py-1 text-white text-xs focus:border-white/30 focus:outline-none disabled:opacity-40"

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-gray-dark-800 border-b px-3 py-2">
      <span className={`${TYPO.mono("semibold")} text-[11px] text-gray-dark-500 uppercase`}>
        {side}
      </span>
      <select
        aria-label={`Flow of side ${side.toUpperCase()}`}
        value={loc.slug}
        onChange={(e) => onChange({ slug: e.target.value, sha: "", hash: "" }, "flow")}
        className={`${select} max-w-[14rem]`}
      >
        {!loc.slug ? <option value="">— flow —</option> : null}
        {flows.map((f) => (
          <option key={f.slug} value={f.slug}>
            {f.title ?? f.slug}
          </option>
        ))}
        {loc.slug && !flow ? <option value={loc.slug}>{loc.slug}</option> : null}
      </select>
      <select
        aria-label={`Version of side ${side.toUpperCase()}`}
        value={loc.sha}
        disabled={!loc.slug}
        onChange={(e) => onChange({ ...loc, sha: e.target.value }, "version")}
        title={
          versions
            ? "Which version of the flow"
            : "The versions list needs the console's read key — a version can still be typed in the URL"
        }
        className={`${select} max-w-[16rem] font-mono`}
      >
        <option value="">live</option>
        {/* The mockup is a version of the screen — the designed one. It needs no history
            and no key: it is the flow rendered `?bare&figma`, which the live build serves. */}
        <option value={FIGMA}>Figma frame</option>
        {(versions ?? []).map((v, i) => (
          <option key={v.sha} value={v.short}>
            {when(v.date)}
            {i === 0 ? " · latest" : ""}
            {v.author ? ` · ${v.author}` : ""}
          </option>
        ))}
        {loc.sha && !version && loc.sha !== FIGMA ? (
          <option value={loc.sha}>{loc.sha === PREV ? "previous version…" : loc.sha}</option>
        ) : null}
      </select>
      <select
        aria-label={`Screen of side ${side.toUpperCase()}`}
        value={screens.some((s) => s.href === current) ? current : ""}
        disabled={screens.length === 0}
        onChange={(e) => onChange({ ...loc, hash: e.target.value }, "screen")}
        title={sync ? "Picking a screen here turns the sync off" : "Which screen"}
        className={`${select} max-w-[16rem]`}
      >
        {!screens.some((s) => s.href === current) ? (
          <option value="">{current || "— screen —"}</option>
        ) : null}
        {screens.map((s) => (
          <option key={s.path} value={s.href}>
            {s.label}
          </option>
        ))}
      </select>
      {version ? (
        <span className="truncate text-[11px] text-gray-dark-500">
          {version.restored_from ? `back to ${version.restored_from}` : version.title}
        </span>
      ) : null}
      {open ? (
        <a
          href={open}
          target="_blank"
          rel="noreferrer"
          title="Open this side in its own tab"
          className="ms-auto flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={11} aria-hidden="true" />
          Open
        </a>
      ) : null}
    </div>
  )
}

// ------------------------------------------------------------------ the Figma bar

/** What one does WITH the pair, once the two are side by side — and it is deliberately in
 *  the compare page rather than in the flow's rail: this is where the gap is visible, and
 *  the page already holds the console key that the write needs (a flow's bundle does not).
 *
 *  Three gestures, and only the first is ours to perform:
 *   • LINK a frame — `POST /console/protos/source.json`. It is what turned the provenance
 *     from something a skill stamps once into a property of the screen: a flow described
 *     orally can be given its mockup, and a node-id copied wrong can be corrected here
 *     instead of costing a republication;
 *   • SEND to Figma, and REFRESH from it — neither is something a browser can do (see
 *     `figma-prompts.ts`). The button copies the exact sentence, skill named, and the
 *     person pastes it into a conversation that has the MCPs. */
const FigmaBar = ({
  slug,
  path,
  label,
  frameLink,
  frameName,
  canWrite,
  onLinked,
}: {
  slug: string
  path: string
  label: string
  frameLink: string
  frameName: string
  canWrite: boolean
  onLinked: () => void
}) => {
  const [linking, setLinking] = useState(false)
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      window.setTimeout(() => setCopied(""), 2000)
    } catch {
      setError("the browser refused the clipboard — the prompt is in the console log.")
      console.log(text)
    }
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const r = await fetch(`${MCP_URL}/console/protos/source.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DS-Key": readKey() },
        body: JSON.stringify({ slug, path, url: value.trim(), author: whoami() }),
      })
      if (!r.ok) throw new Error(await detail(r))
      setLinking(false)
      setValue("")
      onLinked()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const chip =
    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] text-gray-dark-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-gray-dark-800 border-b bg-white/2 px-3 py-2">
      <span className={`${TYPO.mono("semibold")} text-[11px] text-gray-dark-500 uppercase`}>
        figma
      </span>
      <span className="max-w-[22rem] truncate text-gray-dark-400 text-xs">
        {frameName || (frameLink ? "linked frame" : "no frame declared for this screen")}
      </span>

      <span className="ms-auto flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setLinking((v) => !v)
            setValue(frameLink)
          }}
          aria-expanded={linking}
          disabled={!canWrite}
          title={
            canWrite
              ? "Point this screen at a Figma frame — or correct the one it names"
              : "Writing the provenance needs the console key: enter it above"
          }
          className={chip}
        >
          <Link2 size={13} aria-hidden="true" />
          {frameLink ? "Change the frame" : "Link a frame…"}
        </button>
        <button
          type="button"
          onClick={() => copy("to", toFigmaPrompt(slug, path, label))}
          title="Copy the prompt that rebuilds this screen as a Figma frame, in the DS"
          className={chip}
        >
          <ExternalLink size={13} aria-hidden="true" />
          {copied === "to" ? "Prompt copied" : "Send to Figma"}
        </button>
        <button
          type="button"
          onClick={() => copy("from", fromFigmaPrompt(slug, path, label, frameLink))}
          disabled={!frameLink}
          title={
            frameLink
              ? "Copy the prompt that re-lifts this screen from its frame"
              : "This screen names no frame yet — link one first"
          }
          className={chip}
        >
          <ArrowLeft size={13} aria-hidden="true" />
          {copied === "from" ? "Prompt copied" : "Refresh from Figma"}
        </button>
      </span>

      {linking ? (
        <form onSubmit={save} className="flex w-full flex-wrap items-center gap-2 pt-1">
          <input
            type="url"
            value={value}
            autoFocus
            placeholder="paste the Figma link of the frame (Copy link to selection)"
            onChange={(e) => setValue(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-1.5 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:opacity-40"
          >
            {busy ? "Writing…" : "Link"}
          </button>
          {/* An empty field is not a mistake: it is how a screen is declared to have no
              mockup behind it, which is a normal state of a composed drill-down. */}
          <span className="text-[11px] text-gray-dark-500">
            Empty ⇒ this screen has no mockup.
          </span>
        </form>
      ) : null}
      {error ? <p className="w-full text-[11px] text-pink-400">{error}</p> : null}
    </div>
  )
}

// ------------------------------------------------------------------ the page

const readParams = () => {
  const q = new URLSearchParams(window.location.search)
  const m = q.get("m")
  return { a: parseLocator(q.get("a")), b: parseLocator(q.get("b")), m: isMode(m) ? m : "side" }
}

export const CompareApp = () => {
  const initial = useMemo(readParams, [])
  const [key, setKey] = useState(readKey)
  const [keyInput, setKeyInput] = useState("")
  const [askKey, setAskKey] = useState(false)
  const [flows, setFlows] = useState<Flow[]>([])
  const [histories, setHistories] = useState<Record<string, Version[] | null>>({})
  const [width, setWidth] = useState<number>(1280)
  // The width follows the mockup as soon as one says how wide it was drawn — until someone
  // picks one by hand, after which the page stops deciding for them.
  const [autoWidth, setAutoWidth] = useState(true)
  const [mode, setMode] = useState<Mode>(initial.m)
  const [curtain, setCurtain] = useState(50)
  const [blend, setBlend] = useState(0.5)
  const [showB, setShowB] = useState(true)
  const [nudge, setNudge] = useState({ x: 0, y: 0 })
  // Bumped after the provenance is rewritten: the mockup side remounts and asks for the
  // frame it now names, instead of showing the one it was opened with.
  const [mockupNonce, setMockupNonce] = useState(0)
  const { pane: a, set: setA, report: reportA } = usePane(initial.a, key)
  const { pane: b, set: setB, report: reportB } = usePane(initial.b ?? initial.a, key)
  // Sync starts ON when both sides are the same flow on the same screen — the "two
  // versions" question. Two different screens is the other question: off.
  const [sync, setSync] = useState(() => {
    const x = initial.a
    const y = initial.b ?? initial.a
    return Boolean(x && y && x.slug === y.slug && x.hash === y.hash)
  })
  const frameA = useRef<HTMLIFrameElement | null>(null)
  const frameB = useRef<HTMLIFrameElement | null>(null)

  const frameWidth = a.figmaWidth || b.figmaWidth
  useEffect(() => {
    if (frameWidth && autoWidth) setWidth(frameWidth)
  }, [frameWidth, autoWidth])

  /** The two shortcuts of a superposition — F alternates the layers, the arrows move the
   *  top one (Shift × 10, 0 puts it back). They come from TWO places: this page, and the
   *  frames themselves, which give these keys up (`sanctum:key`). Without that, a click
   *  anywhere on the stage — that is, on a frame — would silently end the shortcuts, since
   *  the focus is then inside another document. */
  const shortcut = useCallback(
    (key: string, shift: boolean) => {
      if (mode === "side") return
      if (key.toLowerCase() === "f") {
        if (mode === "flip") setShowB((v) => !v)
        return
      }
      // In the curtain the arrows belong to the divider, which has its own handler.
      if (mode === "curtain") return
      if (key === "0") {
        setNudge({ x: 0, y: 0 })
        return
      }
      const step = shift ? 10 : 1
      const by: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }
      const d = by[key]
      if (!d) return
      setNudge((n) => ({ x: n.x + d[0], y: n.y + d[1] }))
    },
    [mode],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (!/^(Arrow(Left|Right|Up|Down)|f|F|0)$/.test(e.key)) return
      e.preventDefault()
      shortcut(e.key, e.shiftKey)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [shortcut])

  useEffect(() => {
    getFlows<Flow[]>()
      .then((l) => setFlows(l.filter((f) => f.ok !== false)))
      .catch(() => setFlows([]))
  }, [])

  // The versions of every flow on screen, once, behind the key. `null` marks "asked and
  // refused" so a rejected key does not retry on every render.
  // Deduplicated: the two sides are the SAME flow whenever one arrives from a flow's
  // Compare tile, and that asked the history twice.
  const slugs = [...new Set([a.loc.slug, b.loc.slug].filter(Boolean))]
  const wanted = slugs.filter((s) => !(s in histories)).join(",")
  useEffect(() => {
    if (!key || !wanted) return
    for (const slug of wanted.split(",")) {
      get<{ versions: Version[] }>(`/console/protos/history.json?slug=${encodeURIComponent(slug)}`)
        .then((d) => setHistories((h) => ({ ...h, [slug]: d.versions })))
        .catch((e: unknown) => {
          if (e instanceof AccessError) {
            setKey("")
            writeKey("")
          }
          setHistories((h) => ({ ...h, [slug]: null }))
        })
    }
  }, [key, wanted])

  // `@prev` becomes a sha as soon as the flow's history is in. A flow with one single
  // version has nothing before it: the side falls back to the live flow rather than
  // staying blank on a comparison that cannot exist. A history that was REFUSED (no key,
  // `null`) leaves the name in place — the side then says it needs the key, which is the
  // truth, and resolves itself the moment one is entered.
  useEffect(() => {
    for (const [pane, set] of [
      [a, setA],
      [b, setB],
    ] as const) {
      if (pane.loc.sha !== PREV) continue
      const versions = histories[pane.loc.slug]
      if (!versions) continue
      set({ ...pane.loc, sha: versions[1]?.short ?? "" })
    }
  }, [a, b, histories, setA, setB])

  // The URL is the state: a comparison is a link.
  useEffect(() => {
    const q = new URLSearchParams()
    if (a.loc.slug) q.set("a", formatLocator({ ...a.loc, hash: a.hash || a.loc.hash }))
    if (b.loc.slug) q.set("b", formatLocator({ ...b.loc, hash: b.hash || b.loc.hash }))
    if (mode !== "side") q.set("m", mode)
    window.history.replaceState(null, "", `${window.location.pathname}?${q.toString()}`)
  }, [a.loc, a.hash, b.loc, b.hash, mode])

  const navigate = useCallback((frame: HTMLIFrameElement | null, hash: string) => {
    frame?.contentWindow?.postMessage(
      { type: "sanctum:navigate", hash },
      window.location.origin,
    )
  }, [])

  // The frames talk: state in, navigation out. With sync on, a move on one side is
  // replayed on the other — and so is a SCROLL, which the stacked modes cannot do without:
  // two screens laid on top of each other are only comparable while they show the same part
  // of themselves. In side-by-side it follows the sync, which is what that button means.
  useEffect(() => {
    const onMessage = (
      e: MessageEvent<
        | EmbedState
        | { type: "sanctum:scroll"; top: number }
        | { type: "sanctum:key"; key: string; shiftKey: boolean }
      >,
    ) => {
      if (e.origin !== window.location.origin) return
      const fromA = e.source === frameA.current?.contentWindow
      const fromB = e.source === frameB.current?.contentWindow
      if (!fromA && !fromB) return
      const other = fromA ? frameB.current : frameA.current

      if (e.data?.type === "sanctum:key") {
        shortcut(e.data.key, e.data.shiftKey)
        return
      }
      if (e.data?.type === "sanctum:scroll") {
        if (mode === "side" && !sync) return
        other?.contentWindow?.postMessage(
          { type: "sanctum:scroll-to", top: e.data.top },
          window.location.origin,
        )
        return
      }
      if (e.data?.type !== "sanctum:state") return
      const otherPane = fromA ? b : a
      ;(fromA ? reportA : reportB)(e.data)
      if (sync && e.data.hash && e.data.hash !== otherPane.hash) navigate(other, e.data.hash)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [a, b, sync, mode, navigate, reportA, reportB, shortcut])

  const change = (side: Side, l: Locator, why: "flow" | "version" | "screen") => {
    const set = side === "a" ? setA : setB
    const frame = side === "a" ? frameA.current : frameB.current
    const other = side === "a" ? frameB.current : frameA.current
    if (why === "screen") {
      // Same document, new hash: told to the frame, not reloaded. Picking a screen on
      // ONE side is the "two screens" question — the sync lets go.
      if (sync) setSync(false)
      set(l)
      navigate(frame, l.hash)
      return
    }
    if (why === "version") {
      // Keep the screen: comparing versions is comparing the same screen.
      set({ ...l, hash: (side === "a" ? a : b).hash || l.hash })
      return
    }
    set(l)
    if (sync) navigate(other, "")
  }

  const swap = () => {
    const x = { ...a.loc, hash: a.hash || a.loc.hash }
    const y = { ...b.loc, hash: b.hash || b.loc.hash }
    setA(y)
    setB(x)
  }

  const toggleSync = () => {
    const next = !sync
    setSync(next)
    // Turning it on aligns B on A: the left side is the reference.
    if (next && a.hash) navigate(frameB.current, a.hash)
  }

  const needsKey = a.status.kind === "needs-key" || b.status.kind === "needs-key"
  const showKey = askKey || needsKey

  const submitKey = (e: FormEvent) => {
    e.preventDefault()
    const k = keyInput.trim()
    if (!k) return
    writeKey(k)
    setKey(k)
    setKeyInput("")
    setAskKey(false)
    setHistories({})
  }

  // What the Figma bar acts on: the mockup side names the flow and carries the frame, the
  // OTHER side is the built screen and is the one that knows the screens by name. Both are
  // needed — a path is what the provenance is keyed by, and only `views` gives it.
  const mockupPane = isMockup(a.loc) ? a : isMockup(b.loc) ? b : null
  const flowPane = !isMockup(a.loc) ? a : !isMockup(b.loc) ? b : null
  const currentHash = flowPane ? flowPane.hash || flowPane.loc.hash : ""
  const screen = flowPane?.views.find((v) => v.href === currentHash)

  // The frame's own width joins the list the moment a mockup side reports it, and leads —
  // it is the only one of them that makes a superposition exact.
  const widths = frameWidth
    ? [{ key: frameWidth, label: `${frameWidth} · frame` }, ...WIDTHS.filter((w) => w.key !== frameWidth)]
    : WIDTHS

  const control = (on: boolean) =>
    `flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
      on ? "bg-white/10 font-semibold text-white" : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
    }`

  return (
    <div className="flex h-dvh flex-col bg-gray-dark-950 text-white">
      <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-gray-dark-800 border-b px-3 py-2">
        <a
          href="/"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-dark-400 text-xs hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          All prototypes
        </a>
        <span className={`${TYPO.nav} text-[11px] text-gray-dark-500`}>Compare</span>

        <span className="ms-auto flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={toggleSync}
            aria-pressed={sync}
            title={
              sync
                ? "Both frames follow each other — off to compare two different screens"
                : "Make both frames follow each other (B aligns on A)"
            }
            className={control(sync)}
          >
            {sync ? <Link2 size={13} aria-hidden="true" /> : <Link2Off size={13} aria-hidden="true" />}
            {sync ? "Synced" : "Sync"}
          </button>
          <button
            type="button"
            onClick={swap}
            title="Swap the two sides"
            className={control(false)}
          >
            <ArrowLeftRight size={13} aria-hidden="true" />
            Swap
          </button>
          <span className="mx-1 h-4 w-px bg-gray-dark-800" aria-hidden="true" />
          <span role="group" aria-label="How the two sides are shown" className="flex items-center gap-0.5">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                aria-pressed={mode === m.key}
                title={m.hint}
                className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                  mode === m.key
                    ? "bg-white/10 font-semibold text-white"
                    : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </span>
          {mode === "opacity" ? (
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={blend}
              onChange={(e) => setBlend(Number(e.target.value))}
              aria-label="Opacity of side B"
              title="How much of B shows through A"
              className="mx-1 w-28 accent-white"
            />
          ) : null}
          {mode !== "side" && mode !== "curtain" ? (
            <button
              type="button"
              onClick={() => setNudge({ x: 0, y: 0 })}
              title="Arrow keys move the top layer (Shift × 10) — cancel a global offset to see what is left. 0 resets."
              className={control(Boolean(nudge.x || nudge.y))}
            >
              <span className="font-mono text-[11px]">
                {nudge.x || nudge.y ? `${nudge.x > 0 ? "+" : ""}${nudge.x}, ${nudge.y > 0 ? "+" : ""}${nudge.y}` : "0, 0"}
              </span>
            </button>
          ) : null}
          {mode === "flip" ? (
            <button
              type="button"
              onClick={() => setShowB((v) => !v)}
              title="Alternate the two — or press F"
              className={control(false)}
            >
              {showB ? "Showing B" : "Showing A"}
              <kbd className="rounded border border-gray-dark-700 px-1 font-mono text-[10px] text-gray-dark-500">
                F
              </kbd>
            </button>
          ) : null}
          <span className="mx-1 h-4 w-px bg-gray-dark-800" aria-hidden="true" />
          <span role="group" aria-label="Frame width" className="flex items-center gap-0.5">
            {widths.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => {
                  setAutoWidth(false)
                  setWidth(w.key)
                }}
                aria-pressed={width === w.key}
                title={
                  w.key
                    ? w.key === frameWidth
                      ? `The width the Figma frame was designed at — both sides laid out at ${w.key} px, which is what makes them superposable`
                      : `Render both sides at ${w.key} px and scale to fit`
                    : "Native width of each column"
                }
                className={`rounded-md px-2 py-1 font-mono text-[11px] transition-colors ${
                  width === w.key
                    ? "bg-white/10 font-semibold text-white"
                    : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {w.label}
              </button>
            ))}
          </span>
          <span className="mx-1 h-4 w-px bg-gray-dark-800" aria-hidden="true" />
          {key ? (
            <button
              type="button"
              onClick={() => {
                writeKey("")
                setKey("")
                setHistories({})
              }}
              title="Forget the console's read key on this browser"
              className={control(false)}
            >
              <KeyRound size={13} aria-hidden="true" />
              Signed in
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAskKey((v) => !v)}
              aria-expanded={showKey}
              title="The console's read key: lists the versions, builds a past one"
              className={control(showKey)}
            >
              <KeyRound size={13} aria-hidden="true" />
              Read key
            </button>
          )}
        </span>

        {showKey && !key ? (
          <form onSubmit={submitKey} className="flex w-full flex-wrap items-center gap-2">
            <p className="text-gray-dark-400 text-xs">
              Versions and their build go through the MCP server — the console's{" "}
              <span className="font-mono">DASHBOARD_KEY</span>. It stays in this browser.
            </p>
            <input
              type="password"
              value={keyInput}
              autoComplete="current-password"
              placeholder="paste the key here"
              onChange={(e) => setKeyInput(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-1.5 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!keyInput.trim()}
              className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:opacity-40"
            >
              Unlock
            </button>
          </form>
        ) : null}
      </header>

      {mockupPane && flowPane && screen ? (
        <FigmaBar
          slug={mockupPane.loc.slug}
          path={screen.path}
          label={screen.label}
          frameLink={mockupPane.figmaLink}
          frameName={mockupPane.figmaName}
          canWrite={Boolean(key)}
          onLinked={() => setMockupNonce((n) => n + 1)}
        />
      ) : null}

      {mode === "side" ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
          {(
            [
              { side: "a", pane: a, ref: frameA },
              { side: "b", pane: b, ref: frameB },
            ] as const
          ).map(({ side, pane, ref }) => (
            <section
              key={side}
              aria-label={`Side ${side.toUpperCase()}`}
              className={`flex min-h-0 flex-col ${side === "a" ? "md:border-gray-dark-800 md:border-e" : ""}`}
            >
              <SideHeader
                side={side}
                pane={pane}
                flows={flows}
                versions={histories[pane.loc.slug] ?? null}
                onChange={(l, why) => change(side, l, why)}
                sync={sync}
              />
              <Frame
                pane={pane}
                width={width}
                frameRef={ref}
                nonce={isMockup(pane.loc) ? mockupNonce : 0}
              />
            </section>
          ))}
        </div>
      ) : (
        /* Stacked: one box, so the two pickers stack above it rather than beside it. They
           are the same headers — a side is chosen the same way whichever mode reads it. */
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0">
            {(
              [
                { side: "a", pane: a },
                { side: "b", pane: b },
              ] as const
            ).map(({ side, pane }) => (
              <SideHeader
                key={side}
                side={side}
                pane={pane}
                flows={flows}
                versions={histories[pane.loc.slug] ?? null}
                onChange={(l, why) => change(side, l, why)}
                sync={sync}
              />
            ))}
          </div>
          <Stage
            a={a}
            b={b}
            width={width}
            mode={mode}
            curtain={curtain}
            blend={blend}
            showB={showB}
            nudge={nudge}
            frameA={frameA}
            frameB={frameB}
            nonceA={isMockup(a.loc) ? mockupNonce : 0}
            nonceB={isMockup(b.loc) ? mockupNonce : 0}
            onCurtain={setCurtain}
          />
        </div>
      )}
    </div>
  )
}
