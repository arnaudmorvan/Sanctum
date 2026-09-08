import {
  ArrowLeft,
  ArrowLeftRight,
  ExternalLink,
  KeyRound,
  Link2,
  Link2Off,
} from "lucide-react"
import {
  type FormEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
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
 *  Each side is a LOCATOR in the URL — `?a=<slug>[@<sha7>][#/screen]&b=…` — so a
 *  comparison is a link one pastes in a message. The frames are the flows themselves,
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
}

type Status =
  | { kind: "idle" }
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

/** `<slug>[@<sha>][#/screen]` → a locator, or null when the string is not one. */
const parseLocator = (raw: string | null): Locator | null => {
  if (!raw) return null
  const hashAt = raw.indexOf("#")
  const head = hashAt >= 0 ? raw.slice(0, hashAt) : raw
  const hash = hashAt >= 0 ? raw.slice(hashAt) : ""
  const [slug, sha = ""] = head.split("@")
  if (!SLUG_RE.test(slug)) return null
  if (sha && !SHA_RE.test(sha)) return null
  return { slug, sha: sha.slice(0, 7), hash }
}

const formatLocator = (l: Locator) => `${l.slug}${l.sha ? `@${l.sha}` : ""}${l.hash}`

const baseOf = (l: Locator) => (l.sha ? `/v/${l.slug}/${l.sha}/` : `/p/${l.slug}/`)

const WIDTHS = [
  { key: 1280, label: "1280" },
  { key: 1440, label: "1440" },
  { key: 0, label: "Fit" },
] as const

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

  // Resolving the base: a live flow is a path; a past version is checked, then built.
  // Keyed on slug + sha — a hash change must NOT rebuild the side.
  const { slug, sha } = loc
  useEffect(() => {
    let alive = true
    if (!slug) {
      setStatus({ kind: "idle" })
      return
    }
    const l = { slug, sha, hash: "" }
    const base = baseOf(l)
    if (!sha) {
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
    if (l.slug !== locRef.current.slug || l.sha !== locRef.current.sha) setViews([])
    setLoc(l)
    setHash(l.hash)
  }, [])

  const report = useCallback((s: EmbedState) => {
    setViews(s.views)
    setHash(s.hash)
  }, [])

  const pane: Pane = useMemo(() => ({ loc, status, views, hash }), [loc, status, views, hash])
  return { pane, set, report }
}

// ------------------------------------------------------------------ the frame

const Frame = ({
  pane,
  width,
  frameRef,
}: {
  pane: Pane
  width: number
  frameRef: RefObject<HTMLIFrameElement | null>
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
    pane.status.kind === "ready" ? `${pane.status.base}?bare${pane.loc.hash}` : undefined

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
              This version is not built on the site yet. Building it goes through the MCP
              server: enter the console's read key above.
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
  const open = pane.status.kind === "ready" ? `${pane.status.base}${current}` : ""

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
        {(versions ?? []).map((v, i) => (
          <option key={v.sha} value={v.short}>
            {when(v.date)}
            {i === 0 ? " · latest" : ""}
            {v.author ? ` · ${v.author}` : ""}
          </option>
        ))}
        {loc.sha && !version ? <option value={loc.sha}>{loc.sha}</option> : null}
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

// ------------------------------------------------------------------ the page

const readParams = () => {
  const q = new URLSearchParams(window.location.search)
  return { a: parseLocator(q.get("a")), b: parseLocator(q.get("b")) }
}

export const CompareApp = () => {
  const initial = useMemo(readParams, [])
  const [key, setKey] = useState(readKey)
  const [keyInput, setKeyInput] = useState("")
  const [askKey, setAskKey] = useState(false)
  const [flows, setFlows] = useState<Flow[]>([])
  const [histories, setHistories] = useState<Record<string, Version[] | null>>({})
  const [width, setWidth] = useState<number>(1280)
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

  useEffect(() => {
    getFlows<Flow[]>()
      .then((l) => setFlows(l.filter((f) => f.ok !== false)))
      .catch(() => setFlows([]))
  }, [])

  // The versions of every flow on screen, once, behind the key. `null` marks "asked and
  // refused" so a rejected key does not retry on every render.
  const slugs = [a.loc.slug, b.loc.slug].filter(Boolean)
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

  // The URL is the state: a comparison is a link.
  useEffect(() => {
    const q = new URLSearchParams()
    if (a.loc.slug) q.set("a", formatLocator({ ...a.loc, hash: a.hash || a.loc.hash }))
    if (b.loc.slug) q.set("b", formatLocator({ ...b.loc, hash: b.hash || b.loc.hash }))
    window.history.replaceState(null, "", `${window.location.pathname}?${q.toString()}`)
  }, [a.loc, a.hash, b.loc, b.hash])

  const navigate = useCallback((frame: HTMLIFrameElement | null, hash: string) => {
    frame?.contentWindow?.postMessage(
      { type: "sanctum:navigate", hash },
      window.location.origin,
    )
  }, [])

  // The frames talk: state in, navigation out. With sync on, a move on one side is
  // replayed on the other.
  useEffect(() => {
    const onMessage = (e: MessageEvent<EmbedState>) => {
      if (e.origin !== window.location.origin || e.data?.type !== "sanctum:state") return
      const fromA = e.source === frameA.current?.contentWindow
      const fromB = e.source === frameB.current?.contentWindow
      if (!fromA && !fromB) return
      const other = fromA ? frameB.current : frameA.current
      const otherPane = fromA ? b : a
      ;(fromA ? reportA : reportB)(e.data)
      if (sync && e.data.hash && e.data.hash !== otherPane.hash) navigate(other, e.data.hash)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [a, b, sync, navigate, reportA, reportB])

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
          <span role="group" aria-label="Frame width" className="flex items-center gap-0.5">
            {WIDTHS.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => setWidth(w.key)}
                aria-pressed={width === w.key}
                title={w.key ? `Render both sides at ${w.key} px and scale to fit` : "Native width of each column"}
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
            <Frame pane={pane} width={width} frameRef={ref} />
          </section>
        ))}
      </div>
    </div>
  )
}
