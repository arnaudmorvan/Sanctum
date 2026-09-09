import { SLUG, VERSION } from "./env"

/** The version BEFORE the live one, named rather than numbered. The compare page resolves
 *  it against the flow's history (`console/src/compare/app.tsx`) and rewrites the URL with
 *  the sha it found — so what one copies from the address bar afterwards is a fixed
 *  comparison, while the link the rail hands out keeps meaning "against the previous
 *  version" on a flow republished twice a day. */
export const PREV = "prev"

/** Where the rail's "Compare" tile leads: THIS screen as it is now, next to the same
 *  screen in the previous version. That is the question a PO opens the compare page with
 *  — "what changed since the last publication?" — and it used to take three moves to
 *  set up (the link opened the screen against itself, then one picked the version in the
 *  right-hand list). Either side can still be switched afterwards, to another screen or
 *  another version: the second question the page answers is "do these two screens agree?".
 *
 *  It is a plain link, opened in a new tab on purpose: the comparison is a different
 *  activity from walking the flow, and the flow's tab is where one comes back to leave the
 *  feedback. From a past version (`/v/…`), the right side is THAT version and the left the
 *  live flow — one is already looking at a fixed point, and the question becomes "how far
 *  is it from today?".
 *
 *  `null` when the bundle carries no slug (`npm run dev <slug>` bakes none): the tile is
 *  then not drawn at all, rather than pointing at a compare page with nothing to compare.
 *  Called at render time, not once at import: the hash is part of the link, and the rail
 *  re-renders on every screen change. */
export const compareHref = (): string | null => {
  if (!SLUG) return null
  const hash = typeof window === "undefined" ? "" : window.location.hash
  const a = encodeURIComponent(`${SLUG}${hash}`)
  const b = encodeURIComponent(`${SLUG}@${VERSION || PREV}${hash}`)
  return `/compare/?a=${a}&b=${b}`
}

/** The version that is not a commit: the MOCKUP. `<slug>@figma` is a legal side of the
 *  compare page — the flow rendered `?bare&figma`, which is to say the Figma frame this
 *  screen was translated from. Written as a version rather than as a third kind of side
 *  because that is what it is: the designed one, next to the built one.
 *
 *  Where it leads from the Source panel: this screen against its own mockup, on the
 *  CURTAIN — of the four gestures the compare page offers, it is the one that answers the
 *  question one opens this link with ("does the built thing sit where it was drawn?"), and
 *  the other three are one click away. */
export const FIGMA = "figma"

export const compareWithMockupHref = (): string | null => {
  if (!SLUG) return null
  const hash = typeof window === "undefined" ? "" : window.location.hash
  const a = encodeURIComponent(`${SLUG}${VERSION ? `@${VERSION}` : ""}${hash}`)
  const b = encodeURIComponent(`${SLUG}@${FIGMA}${hash}`)
  return `/compare/?a=${a}&b=${b}&m=curtain`
}
