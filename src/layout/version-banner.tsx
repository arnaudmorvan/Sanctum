import { ArrowRight, History } from "lucide-react"
import { LIVE_URL, SLUG, VERSION, VERSION_AT, VERSION_BY } from "./env"
import { UI_MARK } from "./target"

/** The banner of a PAST version — the one thing that must never be missing from
 *  `/v/<slug>/<sha7>/`: a screen that looks exactly like the live flow, opened from a
 *  history list, is a screen someone will leave feedback on by mistake. It says which
 *  version this is, when it was generated and by whom, and offers the two ways out: the
 *  live flow, and the comparison of the two. */

const withTime = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })

const when = (iso: string): string => {
  const t = Date.parse(iso)
  return Number.isNaN(t) ? iso : withTime.format(t)
}

export const VersionBanner = () => {
  if (!VERSION) return null
  const current = window.location.hash
  const compare = `/compare/?a=${encodeURIComponent(`${SLUG}${current}`)}&b=${encodeURIComponent(`${SLUG}@${VERSION}${current}`)}`
  return (
    <div
      {...{ [UI_MARK]: "" }}
      role="status"
      className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-yellow-400/30 border-b bg-yellow-400/10 px-3 py-1.5 text-xs"
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
      <span className="text-yellow-100/60">
        Read-only: feedback and comments are left on the live flow.
      </span>
      <span className="ms-auto flex items-center gap-1">
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
    </div>
  )
}
