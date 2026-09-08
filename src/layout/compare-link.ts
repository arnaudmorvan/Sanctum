import { SLUG, VERSION } from "./env"

/** Where the rail's "Compare" tile leads: this screen, twice, side by side on the compare
 *  page (`/compare/`) — where either side can then be switched to ANOTHER screen of the
 *  flow, or to another VERSION of it. Two questions with one page: "what changed between
 *  Tuesday and today?" and "do these two screens agree?".
 *
 *  It is a plain link, opened in a new tab on purpose: the comparison is a different
 *  activity from walking the flow, and the flow's tab is where one comes back to leave the
 *  feedback. From a past version (`/v/…`), the right side is that version and the left the
 *  live flow — the comparison a PO looking at yesterday's build most likely wants.
 *
 *  `null` when the bundle carries no slug (`npm run dev <slug>` bakes none): the tile is
 *  then not drawn at all, rather than pointing at a compare page with nothing to compare.
 *  Called at render time, not once at import: the hash is part of the link, and the rail
 *  re-renders on every screen change. */
export const compareHref = (): string | null => {
  if (!SLUG) return null
  const hash = typeof window === "undefined" ? "" : window.location.hash
  const a = encodeURIComponent(`${SLUG}${hash}`)
  const b = encodeURIComponent(`${SLUG}${VERSION ? `@${VERSION}` : ""}${hash}`)
  return `/compare/?a=${a}&b=${b}`
}
