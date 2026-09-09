import { ArrowRight, History, RotateCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { LIVE_URL, readConsoleKey, SLUG, VERSION, VERSION_AT, VERSION_BY } from "./env"
import { Signature } from "./identity"
import { KeyRejected, message, restoredNotice, restoreVersion } from "./restore"
import { UI_MARK } from "./target"
import { useAuthor } from "./who"

/** The banner of a PAST version — the one thing that must never be missing from
 *  `/v/<slug>/<sha7>/`: a screen that looks exactly like the live flow, opened from a
 *  history list, is a screen someone will leave feedback on by mistake. It says which
 *  version this is, when it was generated and by whom, and offers the ways out: the live
 *  flow, the comparison of the two, and — since one is looking at this version precisely
 *  to decide whether to keep it — bringing it back.
 *
 *  Why the restore is HERE and not only in the History tab: the decision is made in front
 *  of the screen, and the tab is a list of dates. Sending someone back to a list to pick
 *  the line they are already inside is the kind of round-trip that makes a PO give up and
 *  ask an agent to republish. It is the SAME gesture — same call, same confirmation, same
 *  sentence afterwards (`restore.ts` owns all three) — offered where it is wanted. */

const withTime = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })

const when = (iso: string): string => {
  const t = Date.parse(iso)
  return Number.isNaN(t) ? iso : withTime.format(t)
}

export const VersionBanner = () => {
  const current = window.location.hash
  const [asking, setAsking] = useState(false)
  // Read when the box opens, never at mount: the History tab of this same page can unlock
  // the key after the banner is drawn, and a button that stays dead until a reload reads
  // as broken. `""` is not an error here — it is a flow opened by someone who never
  // signed into the console, and the box says what to do about it.
  const [key, setKey] = useState("")
  const [restoring, setRestoring] = useState(false)
  const [done, setDone] = useState("")
  const [error, setError] = useState("")
  const author = useAuthor()
  const box = useRef<HTMLDivElement | null>(null)

  // Anywhere else, or Escape, and the confirmation closes — captured, like the identity
  // picker, so the rail's own Escape does not close the panel behind our back. Never
  // while the call is in flight: a restore that has left must be reported, not hidden.
  useEffect(() => {
    if (!asking || restoring) return
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setAsking(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        setAsking(false)
      }
    }
    document.addEventListener("mousedown", away, true)
    window.addEventListener("keydown", esc, true)
    return () => {
      document.removeEventListener("mousedown", away, true)
      window.removeEventListener("keydown", esc, true)
    }
  }, [asking, restoring])

  if (!VERSION) return null

  const compare = `/compare/?a=${encodeURIComponent(`${SLUG}${current}`)}&b=${encodeURIComponent(`${SLUG}@${VERSION}${current}`)}`

  const ask = () => {
    setKey(readConsoleKey())
    setError("")
    setDone("")
    setAsking(true)
  }

  const restore = async () => {
    setRestoring(true)
    setError("")
    try {
      setDone(restoredNotice(await restoreVersion(VERSION, key, author)))
      setAsking(false)
    } catch (e) {
      setError(e instanceof KeyRejected ? `${e.message} Unlock it again in the History tab.` : message(e))
    } finally {
      setRestoring(false)
    }
  }

  return (
    // `relative z-40`: the banner is a sibling of the flow, drawn before it, and the
    // confirmation hangs BELOW it over the screen. Without a layer of its own, whatever
    // the flow positions at the top of its column would cut the box in half.
    <div
      {...{ [UI_MARK]: "" }}
      role="status"
      className="relative z-40 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-yellow-400/30 border-b bg-yellow-400/10 px-3 py-1.5 text-xs"
    >
      <span className="flex items-center gap-1.5 font-semibold text-yellow-200">
        <History size={13} aria-hidden="true" />
        Past version
      </span>
      <span className="text-yellow-100/80">
        <span className="font-mono">{VERSION}</span>
        {VERSION_AT ? ` · generated ${when(VERSION_AT)}` : ""}
        {VERSION_BY ? ` by ${VERSION_BY}` : ""}
      </span>
      {done ? (
        <span className="font-semibold text-green-200">{done}</span>
      ) : (
        <span className="text-yellow-100/60">
          Read-only: feedback and comments are left on the live flow.
        </span>
      )}
      <span className="ms-auto flex items-center gap-1">
        {done ? null : (
          <button
            type="button"
            onClick={ask}
            aria-expanded={asking}
            title="Make this version the live flow again"
            className="flex items-center gap-1 rounded-md border border-yellow-400/30 px-2 py-1 text-yellow-100/80 transition-colors hover:border-yellow-400/60 hover:text-white"
          >
            <RotateCcw size={12} aria-hidden="true" />
            Restore this version
          </button>
        )}
        <a
          href={compare}
          className="rounded-md px-2 py-1 text-yellow-100/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          Compare with live
        </a>
        <a
          href={`${LIVE_URL}${current}`}
          className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 font-semibold text-white transition-colors hover:bg-white/15"
        >
          Open the live flow
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      </span>

      {asking ? (
        <div
          ref={box}
          className="absolute end-3 top-full z-40 mt-1 flex w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col gap-2 rounded-lg border border-gray-dark-800 bg-gray-dark-950 p-3 text-start shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
        >
          <span className="font-semibold text-sm text-white">Restore this version</span>
          {key ? (
            <>
              <p className="text-gray-dark-300 text-xs leading-relaxed">
                The live flow will be exactly what it is on this page
                {VERSION_AT ? (
                  <>
                    {" — the version of "}
                    <span className="font-mono">{when(VERSION_AT)}</span>
                  </>
                ) : null}
                . A screen added since goes away too. The current version stays in the
                history, and this restore is one more entry in it.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Signature />
                <button
                  type="button"
                  disabled={restoring || !author}
                  onClick={() => void restore()}
                  className="rounded-md bg-white/10 px-2.5 py-1 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {restoring ? "Restoring…" : "Restore this version"}
                </button>
                <button
                  type="button"
                  disabled={restoring}
                  onClick={() => setAsking(false)}
                  className="rounded-md px-2 py-1 text-gray-dark-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-dark-300 text-xs leading-relaxed">
              The restore goes through the MCP server: it needs the console's read key
              (<span className="font-mono">DASHBOARD_KEY</span>). Open the{" "}
              <span className="text-white">History</span> tab of the review rail to unlock
              it — the browser keeps it, and the console shares it.
            </p>
          )}
          {error ? <span className="text-pink-400 text-xs leading-snug">{error}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
