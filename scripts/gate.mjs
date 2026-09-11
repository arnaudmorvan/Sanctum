/** The flows are behind the token — at the SERVER, not in the console.
 *
 *  Until 2026-09-11 the gallery and every flow were public: `/protos.json`, `/p/<slug>/`
 *  and `/v/<slug>/<sha7>/` are static files, and `server.mjs` served them to whoever had
 *  the URL. Hiding the Prototypes entry in the console would have protected nothing — a
 *  flow is a screen of an internal product, reachable by typing its address. So the gate
 *  sits here, in front of the static files, and the console's sign-in is what opens it.
 *
 *  How it decides, and what it owns. It owns NOTHING about identity: no secret, no
 *  registry, no role table. The browser presents the same `42ds_…` token it stores for
 *  the console, in a cookie (`ds_token`, written by `writeConsoleKey` next to the
 *  localStorage entry — a cookie because a navigation, an iframe and an asset request
 *  cannot carry a header). The gate asks the MCP server whether that token opens the
 *  console (`GET /console/summary.json`, the very call the sign-in screen makes) and
 *  caches the answer per token for a minute — a flow is a page plus three assets, and
 *  a person is not a round trip per file. The MCP server's answer is the whole truth:
 *  a role that reads Prototypes, a revoked person refused, the operator's key accepted.
 *
 *  Fail-closed, in both directions. No cookie or a refused token: a navigation is sent
 *  to the console's sign-in with the path to come back to (`/?next=…`), anything else
 *  gets a 401. An MCP server that cannot be reached is a 503, never a pass — the one
 *  time this must not be lenient is when it cannot verify.
 *
 *  What stays open: the console itself (`/`, its assets — it IS the sign-in screen),
 *  `/compare/` (a page that embeds flows, which are gated on their own), `/version.json`
 *  (a commit sha), and the hot-build routes, which carry their own key. */

/** What the gate stands in front of. Anchored on purpose: `/protos.json` exactly, and
 *  everything under `/p/` and `/v/`. */
const PROTECTED = /^\/(?:protos\.json$|p\/|v\/)/

export const COOKIE = "ds_token"

/** Where to verify. The same fallback chain as the flows' `env.ts`, so a staging service
 *  that sets `VITE_MCP_URL` verifies against its own server. */
export const MCP_URL = (
  process.env.MCP_URL ??
  process.env.VITE_MCP_URL ??
  process.env.VITE_FEEDBACK_URL ??
  process.env.VITE_RETOURS_URL ??
  "https://mcp-42-production.up.railway.app"
).replace(/\/$/, "")

const POSITIVE_TTL = 60_000 // a valid token is re-checked every minute (revocation bites then)
const NEGATIVE_TTL = 10_000 // a refused one is not re-asked on every asset of a refused page
const MAX_CACHED = 500

export const isProtected = (url) => PROTECTED.test(url)

/** The token in the cookie header, or "". Tolerant to the other cookies a browser sends. */
export const tokenOf = (req) => {
  const raw = req.headers?.cookie ?? ""
  for (const part of raw.split(";")) {
    const eq = part.indexOf("=")
    if (eq < 0) continue
    if (part.slice(0, eq).trim() !== COOKIE) continue
    try {
      return decodeURIComponent(part.slice(eq + 1).trim())
    } catch {
      return ""
    }
  }
  return ""
}

/** A navigation (a tab, an iframe) accepts HTML and can be redirected to the sign-in;
 *  a fetch of `protos.json` or of an asset cannot, and gets the status instead. */
export const wantsHtml = (req) => /\btext\/html\b/.test(req.headers?.accept ?? "")

/** Where a refused navigation is sent: the console, with the path to come back to. The
 *  path is the request's own (`req.url`, query included, so `?bare` survives). */
export const signInUrl = (req) => `/?next=${encodeURIComponent(req.url ?? "/")}`

/** Asks the MCP server. `true` / `false` are answers; anything else is an error and is
 *  thrown — the caller turns it into a 503, never into a pass. */
export const makeVerifier = (fetchImpl = fetch, base = MCP_URL) => async (token) => {
  const r = await fetchImpl(`${base}/console/summary.json`, {
    headers: { "X-DS-Key": token },
    signal: AbortSignal.timeout(8000),
  })
  if (r.status === 200) return true
  if (r.status === 401 || r.status === 403) return false
  throw new Error(`the MCP server answered ${r.status}`)
}

const send = (res, code, headers, body) => {
  res.writeHead(code, { "cache-control": "no-store", ...headers })
  res.end(body)
}

/** Builds the guard. `verify` and `now` are injectable so the tests drive it with no
 *  network and no clock. Returns a function with `handleBuild`'s contract: `true` when it
 *  answered the request, `false` when the static server should go on. */
export const makeGate = ({ verify = makeVerifier(), now = Date.now } = {}) => {
  const cache = new Map() // token → { ok, until }
  return async function guard(req, res, url) {
    if (!isProtected(url)) return false
    const token = tokenOf(req)
    let ok = false
    if (token) {
      const hit = cache.get(token)
      if (hit && hit.until > now()) {
        ok = hit.ok
      } else {
        try {
          ok = await verify(token)
        } catch (e) {
          send(res, 503, { "content-type": "application/json; charset=utf-8" },
               JSON.stringify({ error: `cannot verify the access right now: ${e.message}` }))
          return true
        }
        cache.set(token, { ok, until: now() + (ok ? POSITIVE_TTL : NEGATIVE_TTL) })
        if (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value)
      }
    }
    if (ok) return false
    if (wantsHtml(req)) {
      send(res, 302, { location: signInUrl(req) }, "")
    } else {
      send(res, 401, { "content-type": "application/json; charset=utf-8" },
           JSON.stringify({ error: "sign in: the flows are behind your access token." }))
    }
    return true
  }
}

export const guard = makeGate()
