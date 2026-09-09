/** What the build stamps into a flow, read in one place. Every value is optional on
 *  purpose: `npm run dev <slug>` sets none of the keys, and a flow must still open — the
 *  tabs that need one simply say so instead of existing or not depending on a variable. */

export const SLUG = (import.meta.env.VITE_PROTO_SLUG as string | undefined) ?? ""

/** Set ONLY on the preview of a PAST version (`/v/<slug>/<sha7>/`, built on demand by
 *  `scripts/hot-build.mjs` from the flow's files at that commit). Empty on the live flow.
 *  What it changes: a banner says which version this is, and feedback and comments stay
 *  on the live flow — a pin left on a screen that no longer exists would point at nothing. */
export const VERSION = (import.meta.env.VITE_PROTO_VERSION as string | undefined) ?? ""
export const VERSION_AT = (import.meta.env.VITE_PROTO_VERSION_AT as string | undefined) ?? ""
export const VERSION_BY = (import.meta.env.VITE_PROTO_VERSION_BY as string | undefined) ?? ""
export const IS_PAST_VERSION = Boolean(VERSION)

/** The live flow's URL, from wherever this bundle is served. A past version links back to
 *  it; the compare page builds both sides from it. */
export const LIVE_URL = SLUG ? `/p/${SLUG}/` : "/"

/** `?figma` — the flow rendered as the MOCKUP it was translated from: the source frame of
 *  the current screen, at the width it was designed at, and nothing else. Only meaningful
 *  with `?bare`, and only from the compare page, which uses it as one of its two sides.
 *
 *  Why a mode of the FLOW rather than a picture the compare page fetches itself: the render
 *  takes the feedback key and the flow's own provenance, and both live here. The compare
 *  page carries no key — asking it to hold one would put the same secret in a second
 *  bundle to save an iframe. */
export const FIGMA_VIEW = (() => {
  try {
    return new URLSearchParams(window.location.search).has("figma")
  } catch {
    return false
  }
})()

/** `?bare` — the flow rendered for a FRAME, not a tab: the compare page (`/compare/`)
 *  embeds two of them side by side. The bottom bar and the side panel are the tooling of
 *  ONE tab; in a frame they would be drawn twice and would drive nothing. The screen keeps
 *  its own chrome (the product sidebar): that is part of what is being compared. */
export const BARE = (() => {
  try {
    return new URLSearchParams(window.location.search).has("bare")
  } catch {
    return false
  }
})()

// Deployment shim: the Railway build variables are still called VITE_RETOURS_KEY and
// VITE_RETOURS_URL. Drop both fallbacks once they are renamed to VITE_FEEDBACK_*.
export const FEEDBACK_KEY =
  (import.meta.env.VITE_FEEDBACK_KEY as string | undefined) ??
  (import.meta.env.VITE_RETOURS_KEY as string | undefined) ??
  ""

export const MCP_URL = (
  (import.meta.env.VITE_FEEDBACK_URL as string | undefined) ??
  (import.meta.env.VITE_RETOURS_URL as string | undefined) ??
  "https://mcp-42-production.up.railway.app"
).replace(/\/$/, "")

/** The console's read key, SHARED with the console: the flows live under `/p/<slug>/` on
 *  the same origin as `/`, so `localStorage` is one and the same. A PO who signed into the
 *  console once does not type the key again in a flow — and the reverse holds. Same names
 *  as `console/src/mcp.ts` (the legacy one read as a fallback, never written). */
const CONSOLE_KEY = "42ds.console.key"
const CONSOLE_KEY_LEGACY = "42ds.console.cle"

export const readConsoleKey = (): string => {
  try {
    return localStorage.getItem(CONSOLE_KEY) ?? localStorage.getItem(CONSOLE_KEY_LEGACY) ?? ""
  } catch {
    return ""
  }
}

export const writeConsoleKey = (v: string): void => {
  try {
    v ? localStorage.setItem(CONSOLE_KEY, v) : localStorage.removeItem(CONSOLE_KEY)
    localStorage.removeItem(CONSOLE_KEY_LEGACY)
  } catch {
    /* without storage the key lives for the session */
  }
}

