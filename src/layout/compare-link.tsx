import { Columns2 } from "lucide-react"
import { SLUG, VERSION } from "./env"

/** The "Compare" button of the bottom bar: this screen, twice, side by side on the
 *  compare page (`/compare/`) — where either side can then be switched to ANOTHER screen
 *  of the flow, or to another VERSION of it. Two questions with one page: "what changed
 *  between Tuesday and today?" and "do these two screens agree?".
 *
 *  It opens a new tab on purpose: the comparison is a different activity from walking
 *  the flow, and the flow's tab is where one comes back to leave the feedback. From a
 *  past version (`/v/…`), the right side is that version and the left the live flow —
 *  the comparison a PO looking at yesterday's build most likely wants. */
export const CompareLink = () => {
  if (!SLUG) return null
  const hash = typeof window === "undefined" ? "" : window.location.hash
  const a = encodeURIComponent(`${SLUG}${hash}`)
  const b = encodeURIComponent(`${SLUG}${VERSION ? `@${VERSION}` : ""}${hash}`)
  return (
    <a
      href={`/compare/?a=${a}&b=${b}`}
      target="_blank"
      rel="noreferrer"
      title="This screen side by side with another screen, or another version"
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs transition-colors hover:bg-white/5 hover:text-white"
    >
      <Columns2 size={13} aria-hidden="true" />
      Compare
    </a>
  )
}
