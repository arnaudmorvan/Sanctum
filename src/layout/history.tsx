import { Columns2, ExternalLink, KeyRound, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import {
  LIVE_URL,
  MCP_URL,
  readConsoleKey,
  SLUG,
  VERSION,
  writeConsoleKey,
} from "./env"
import { Signature } from "./identity"
import { useNotes } from "./notes"
import { detail, KeyRejected, message, restoredNotice, restoreVersion } from "./restore"
import { useAuthor } from "./who"

/** The "History" tab: every version of the flow, WHEN it was generated (to the minute —
 *  `proto.json` only carries the day), by whom, and the way back to one of them.
 *
 *  Where it reads. The site serves the latest build and nothing else: "what did this look
 *  like yesterday?" has no answer in `dist/`. The flows repo has it — every publication is
 *  one commit under `protos/<slug>/` — and the MCP server, which holds the PAT, serves it
 *  through `GET /console/protos/history.json`. Restoring is `POST …/restore.json`: one
 *  commit that makes the folder identical to the chosen version (a screen added since is
 *  removed too), then Railway rebuilds. Nothing is lost either way — the version being
 *  replaced stays in the list, and the restore is one more entry in it.
 *
 *  Two levels of access, on purpose:
 *   • with NO key, the tab still answers the first question: the "generated at" comes
 *     from `/protos.json` (same origin, written by the build), where `published_at` is
 *     stamped by the MCP at publication. A flow published before that stamp existed only
 *     has a day, and the tab says a day;
 *   • the list and the restore need the console's read key — the same `DASHBOARD_KEY`
 *     the console asks for, and the same browser entry: a PO who signed into the console
 *     is already in here. The key is a shared secret, not an identity: the restore asks
 *     for a first name, which goes into the commit message.
 *
 *  "Deploying": a version newer than the served build (`/version.json`, `built_at`) is
 *  not on the site yet. The badge closes the same gap the console's construction-site
 *  card does — without it, a PO who just restored a version reloads, sees no change, and
 *  concludes the restore failed.
 *
 *  LOOKING without restoring (2026-09-08, later the same day). "Open" builds the version
 *  on the site, on demand, under `/v/<slug>/<sha7>/` (`POST …/preview.json` → the site's
 *  hot build, from the flow's files at that commit) and opens it in a new tab: nothing is
 *  committed, the live flow does not move. "Compare" opens `/compare/` with the live flow
 *  on the left and that version on the right, on the screen currently displayed. Both
 *  exist only where the hot build is wired — the history says so (`preview`), and the
 *  tab explains instead of drawing buttons that would answer 503. */

type Version = {
  sha: string
  short: string
  date: string
  author: string
  title: string
  message: string
  published: boolean
  restored_from: string | null
}

type PublicMeta = {
  slug: string
  title?: string
  author?: string
  published_at?: string
  updated_at?: string
  created_at?: string
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const withTime = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
const dayOnly = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })

/** A day stays a day: parsing "2026-09-08" gives UTC midnight, which a Paris browser would
 *  print as 02:00 — a time nobody generated anything at. */
const when = (iso: string | undefined): string => {
  if (!iso) return ""
  if (DATE_ONLY.test(iso)) return dayOnly.format(new Date(`${iso}T12:00:00`))
  const t = Date.parse(iso)
  return Number.isNaN(t) ? iso : withTime.format(t)
}

export const HistoryBody = ({ active }: { active: boolean }) => {
  const [key, setKey] = useState(readConsoleKey)
  const [keyInput, setKeyInput] = useState("")
  const [keyError, setKeyError] = useState("")
  const [meta, setMeta] = useState<PublicMeta | null>(null)
  const [builtAt, setBuiltAt] = useState<string | null>(null)
  const [versions, setVersions] = useState<Version[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [confirm, setConfirm] = useState<string | null>(null)
  const author = useAuthor()
  const [restoring, setRestoring] = useState(false)
  const [notice, setNotice] = useState("")
  // Whether a past version can be OPENED on this site (the hot build is wired). Said by
  // the history itself, so the tab never draws an "Open" whose route would answer 503.
  const [canPreview, setCanPreview] = useState(false)
  const [opening, setOpening] = useState<string | null>(null)
  const [openError, setOpenError] = useState<{ sha: string; text: string } | null>(null)
  const notes = useNotes()

  // How many comments were made on a version. A comment records the `published_at`
  // stamp it saw; the commit that carried it was made seconds before — five minutes is
  // the tolerance, a day-only version (pre-stamp flows) matches nothing.
  const commentsOn = (v: Version): number => {
    const t = Date.parse(v.date)
    if (Number.isNaN(t)) return 0
    return notes.comments.filter((c) => {
      const u = Date.parse(c.version)
      return !Number.isNaN(u) && c.version.includes("T") && Math.abs(u - t) < 5 * 60 * 1000
    }).length
  }

  // What the build knows, key or not: the flow's public metadata and the served build.
  useEffect(() => {
    if (!active || meta) return
    fetch("/protos.json")
      .then((r): Promise<PublicMeta[]> => (r.ok ? r.json() : Promise.resolve([])))
      .then((all) => setMeta(all.find((p) => p.slug === SLUG) ?? { slug: SLUG }))
      .catch(() => setMeta({ slug: SLUG }))
    fetch("/version.json")
      .then((r): Promise<{ built_at?: string }> => (r.ok ? r.json() : Promise.resolve({})))
      .then((v) => setBuiltAt(v.built_at ?? null))
      .catch(() => setBuiltAt(null))
  }, [active, meta])

  const load = useCallback(async (k: string) => {
    setLoading(true)
    setError("")
    try {
      const r = await fetch(
        `${MCP_URL}/console/protos/history.json?slug=${encodeURIComponent(SLUG)}`,
        { headers: { "X-DS-Key": k } },
      )
      if (r.status === 401) {
        // The entry is kept in storage — the console decides that — but this tab stops
        // sending it, and says why: a rejected key must not look like an empty history.
        setKey("")
        setKeyError("Key rejected by the server.")
        return
      }
      if (!r.ok) throw new Error(await detail(r))
      const data = (await r.json()) as { versions: Version[]; preview?: boolean }
      setVersions(data.versions)
      setCanPreview(Boolean(data.preview))
      setKey(k)
      setKeyError("")
      writeConsoleKey(k)
    } catch (e) {
      setError(message(e))
    } finally {
      setLoading(false)
    }
  }, [])

  // Reloaded on every activation: a version restored from another tab, or published by
  // an agent since, must show up when the PO comes back to the list.
  useEffect(() => {
    if (active && key) void load(key)
  }, [active, key, load])

  const restore = async (sha: string) => {
    setRestoring(true)
    setError("")
    setNotice("")
    try {
      setNotice(restoredNotice(await restoreVersion(sha, key, author)))
      setConfirm(null)
      await load(key)
    } catch (e) {
      if (e instanceof KeyRejected) {
        setKey("")
        setKeyError(e.message)
      } else {
        setError(message(e))
      }
    } finally {
      setRestoring(false)
    }
  }

  /** Opens a version in a NEW tab, on the screen currently displayed. The live one is a
   *  link; a past one is built first. The tab is opened synchronously — a `window.open`
   *  after an `await` is what popup blockers eat — and pointed at the URL once known. */
  const open = async (v: Version, isLive: boolean) => {
    const hash = window.location.hash
    if (isLive) {
      window.open(`${LIVE_URL}${hash}`, "_blank", "noopener")
      return
    }
    const tab = window.open("", "_blank")
    if (tab) {
      tab.document.title = `Building version ${v.short}…`
      tab.document.body.style.cssText = "font:14px system-ui;padding:40px;color:#ccc;background:#111"
      tab.document.body.textContent = `Building the version of ${when(v.date)} — a few seconds.`
    }
    setOpening(v.sha)
    setOpenError(null)
    try {
      const r = await fetch(`${MCP_URL}/console/protos/preview.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DS-Key": key },
        body: JSON.stringify({ slug: SLUG, sha: v.sha }),
      })
      if (r.status === 401) {
        setKey("")
        setKeyError("Key rejected by the server.")
        throw new Error("Key rejected by the server.")
      }
      const data = (await r.json().catch(() => ({}))) as { path?: string; url?: string; error?: string }
      if (!r.ok) {
        throw new Error(
          r.status === 422
            ? `This version no longer compiles against today's skeleton.\n${data.error ?? ""}`
            : (data.error ?? `HTTP ${r.status}`),
        )
      }
      // `path` is relative (`/v/<slug>/<sha7>/`): same origin as this page, whatever
      // hostname the MCP was told the site lives at.
      const target = `${data.path ?? data.url ?? ""}${hash}`
      if (tab) tab.location.href = target
      else window.open(target, "_blank", "noopener")
    } catch (e) {
      tab?.close()
      setOpenError({ sha: v.sha, text: message(e) })
    } finally {
      setOpening(null)
    }
  }

  /** The compare page, live flow on the left and this version on the right, on the
   *  screen currently displayed. The page builds the version itself if needed. */
  const compareHref = (v: Version) => {
    const hash = window.location.hash
    const a = encodeURIComponent(`${SLUG}${hash}`)
    const b = encodeURIComponent(`${SLUG}@${v.short}${hash}`)
    return `/compare/?a=${a}&b=${b}`
  }

  const built = builtAt ? Date.parse(builtAt) : Number.NaN
  const deploying = (v: Version) =>
    !Number.isNaN(built) && !Number.isNaN(Date.parse(v.date)) && Date.parse(v.date) > built
  // The newest version that IS on the site. Everything above it is still deploying.
  const live = versions?.find((v) => !deploying(v))
  const byShort = new Map((versions ?? []).map((v) => [v.short, v]))

  // The "generated at" line: the newest commit when the list is loaded, the public stamp
  // otherwise — and a plain day when the flow predates the stamp.
  const latest = versions?.[0]
  const generated = latest
    ? { at: when(latest.date), by: latest.author }
    : meta?.published_at
      ? { at: when(meta.published_at), by: meta.author ?? "" }
      : meta?.updated_at
        ? { at: when(meta.updated_at), by: meta.author ?? "", dayOnly: true }
        : null

  return (
    <div className="flex flex-col gap-4 px-3 py-3">
      <div className="flex flex-col gap-1">
        <span className="text-gray-dark-500 text-xs">Generated</span>
        {generated ? (
          <>
            <span className="font-mono text-sm text-white">{generated.at}</span>
            {generated.by ? (
              <span className="text-gray-dark-400 text-xs">by {generated.by}</span>
            ) : null}
            {generated.dayOnly ? (
              <span className="text-[11px] text-gray-dark-600">
                Published before the time was recorded — the day is all there is.
              </span>
            ) : null}
          </>
        ) : (
          <span className="text-gray-dark-500 text-xs italic">
            {meta ? "No publication record for this flow." : "Reading…"}
          </span>
        )}
        {builtAt ? (
          <span className="text-[11px] text-gray-dark-600">
            Site built {when(builtAt)}
            {latest && deploying(latest) ? " — the latest version is still deploying." : ""}
          </span>
        ) : null}
      </div>

      {!key ? (
        <form
          className="flex flex-col gap-2 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (keyInput.trim()) void load(keyInput.trim())
          }}
        >
          <span className="flex items-center gap-2 font-semibold text-sm text-white">
            <KeyRound size={14} aria-hidden="true" />
            Read key
          </span>
          <p className="text-gray-dark-400 text-xs leading-relaxed">
            The versions and the restore go through the MCP server: they need the console's
            read key (<span className="font-mono">DASHBOARD_KEY</span>). It stays in your
            browser, and the console shares it.
          </p>
          <div className="flex items-center gap-2">
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
              disabled={!keyInput.trim() || loading}
              className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Checking…" : "Unlock"}
            </button>
          </div>
          {keyError ? <span className="text-pink-400 text-xs">{keyError}</span> : null}
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-sm text-white">Versions</span>
            {versions ? (
              <span className="font-mono text-gray-dark-500 text-xs tabular-nums">
                {versions.length}
              </span>
            ) : null}
          </div>

          {notice ? (
            <p className="rounded-md border border-green-400/30 bg-green-400/10 px-3 py-2 text-green-200 text-xs leading-relaxed">
              {notice}
            </p>
          ) : null}
          {error ? <span className="text-pink-400 text-xs">Could not read: {error}</span> : null}

          {!versions && loading ? (
            <span className="text-gray-dark-500 text-xs italic">Reading the history…</span>
          ) : null}

          {versions ? (
            <ol className="flex flex-col gap-1.5">
              {versions.map((v, i) => {
                const isLive = v === live
                const isDeploying = deploying(v)
                // The version THIS bundle is (a past version opened from the history).
                const isViewing = Boolean(VERSION) && v.short === VERSION
                const from = v.restored_from ? byShort.get(v.restored_from) : undefined
                const asking = confirm === v.sha
                const openable = isLive || canPreview
                return (
                  <li
                    key={v.sha}
                    className={`flex flex-col gap-1 rounded-md border px-3 py-2 ${
                      isViewing
                        ? "border-yellow-400/40 bg-yellow-400/5"
                        : isLive
                          ? "border-white/20 bg-white/5"
                          : "border-gray-dark-800"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-mono text-white text-xs">{when(v.date)}</span>
                      {isViewing ? (
                        <span className="rounded-full border border-yellow-400/40 px-1.5 py-px text-[10px] text-yellow-200">
                          you are looking at it
                        </span>
                      ) : null}
                      {isDeploying ? (
                        <span className="rounded-full border border-yellow-400/40 px-1.5 py-px text-[10px] text-yellow-200">
                          deploying
                        </span>
                      ) : isLive ? (
                        <span className="rounded-full border border-green-400/40 px-1.5 py-px text-[10px] text-green-200">
                          on the site
                        </span>
                      ) : null}
                      {openable && !asking ? (
                        <span className="ms-auto flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={opening !== null}
                            onClick={() => void open(v, isLive)}
                            title={
                              isLive
                                ? "Open the live flow in a new tab"
                                : "Build this version on the site and open it in a new tab — nothing is restored"
                            }
                            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <ExternalLink size={11} aria-hidden="true" />
                            {opening === v.sha ? "Building…" : "Open"}
                          </button>
                          {!isLive ? (
                            <a
                              href={compareHref(v)}
                              target="_blank"
                              rel="noreferrer"
                              title="Side by side with the live flow, on this screen"
                              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
                            >
                              <Columns2 size={11} aria-hidden="true" />
                              Compare
                            </a>
                          ) : null}
                        </span>
                      ) : null}
                    </div>
                    {openError?.sha === v.sha ? (
                      <pre className="whitespace-pre-wrap font-mono text-[11px] text-pink-400 leading-snug">
                        {openError.text}
                      </pre>
                    ) : null}
                    <span className="text-gray-dark-200 text-xs leading-snug">
                      {v.restored_from
                        ? `Back to the version of ${from ? when(from.date) : v.restored_from}`
                        : v.title}
                    </span>
                    {commentsOn(v) ? (
                      <span className="text-[11px] text-blue-300/80">
                        {commentsOn(v)} comment{commentsOn(v) > 1 ? "s" : ""} on this version
                      </span>
                    ) : null}
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[11px] text-gray-dark-500">
                        {v.author ? `${v.author} · ` : ""}
                        <span className="font-mono">{v.short}</span>
                      </span>
                      {i > 0 && !asking ? (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirm(v.sha)
                            setNotice("")
                          }}
                          className="ms-auto flex items-center gap-1 rounded-md border border-gray-dark-800 px-2 py-1 text-[11px] text-gray-dark-300 hover:border-white/30 hover:text-white"
                        >
                          <RotateCcw size={11} aria-hidden="true" />
                          Restore
                        </button>
                      ) : null}
                    </div>

                    {asking ? (
                      <div className="mt-1 flex flex-col gap-2 rounded-md border border-gray-dark-800 bg-white/2 px-2.5 py-2">
                        <p className="text-gray-dark-300 text-xs leading-relaxed">
                          The flow will be exactly what it was on{" "}
                          <span className="font-mono">{when(v.date)}</span> — a screen added
                          since goes away too. The current version stays in this list.
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Signature />
                          <button
                            type="button"
                            disabled={restoring || !author}
                            onClick={() => void restore(v.sha)}
                            className="rounded-md bg-white/10 px-2.5 py-1 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {restoring ? "Restoring…" : "Restore this version"}
                          </button>
                          <button
                            type="button"
                            disabled={restoring}
                            onClick={() => setConfirm(null)}
                            className="rounded-md px-2 py-1 text-gray-dark-400 text-xs hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          ) : null}

          {versions && versions.length === 0 ? (
            <span className="text-gray-dark-500 text-xs italic">No version recorded.</span>
          ) : null}

          {versions && !canPreview ? (
            <p className="text-[11px] text-gray-dark-500 leading-relaxed">
              Past versions cannot be opened on this site: it needs the hot build
              (<span className="font-mono">BUILD_KEY</span> on the Sanctum service,{" "}
              <span className="font-mono">SANCTUM_BUILD_URL</span> +{" "}
              <span className="font-mono">SANCTUM_BUILD_KEY</span> on the MCP). Restoring
              still works.
            </p>
          ) : null}

          <p className="text-[11px] text-gray-dark-600 leading-relaxed">
            One entry per commit that touched this flow, newest first. A restore is one more
            commit — nothing is ever removed from this list. Opening a past version builds
            it next to the live flow and changes nothing.
          </p>
        </div>
      )}
    </div>
  )
}
