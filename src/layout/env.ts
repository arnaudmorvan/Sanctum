/** What the build stamps into a flow, read in one place. Every value is optional on
 *  purpose: `npm run dev <slug>` sets none of the keys, and a flow must still open — the
 *  tabs that need one simply say so instead of existing or not depending on a variable. */

export const SLUG = (import.meta.env.VITE_PROTO_SLUG as string | undefined) ?? ""

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

/** The first name the feedback widget remembers — reused by the restore, so that the
 *  history says who brought a version back. Read-only here: the widget owns the write. */
export const readAuthor = (): string => {
  try {
    return localStorage.getItem("feedback-author") ?? localStorage.getItem("retours-auteur") ?? ""
  } catch {
    return ""
  }
}
