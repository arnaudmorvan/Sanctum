/** Static server for dist/ on Railway. No dependency: adding `serve` or express would pull
 *  a whole npm tree in just to read files off disk.
 *
 *  Plus TWO routes that are not static (scripts/hot-build.mjs, mounted only when `BUILD_KEY`
 *  is set): `POST /build/<slug>` rebuilds a single flow inside this container, seconds after
 *  `publish_proto`, instead of making the PO wait for the Railway redeploy; and
 *  `POST /preview/<slug>/<sha7>` builds a PAST version of a flow under `/v/<slug>/<sha7>/`,
 *  next to the live one — what lets the history be looked at without being restored. */
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { handleBuild, selfCheck } from "./scripts/hot-build.mjs"

const DIST = path.join(import.meta.dirname, "dist")
const PORT = process.env.PORT || 3000

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".woff2": "font/woff2", ".map": "application/json",
}

http
  .createServer(async (req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0])
    if (await handleBuild(req, res, url)) return
    // Traversal: we resolve first, then check we stayed under dist/.
    let target = path.join(DIST, url)
    if (!target.startsWith(DIST)) {
      res.writeHead(403).end("Forbidden")
      return
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, "index.html")
    }
    if (!fs.existsSync(target)) {
      // Every flow is a hash-routed SPA: any URL under /p/<slug>/ falls back to its index —
      // and so does a past version under /v/<slug>/<sha7>/. The hash never reaches the
      // server, so this is the only useful fallback.
      const m = url.match(/^\/p\/([^/]+)\//)
      const v = url.match(/^\/v\/([^/]+)\/([^/]+)\//)
      const fallback = m
        ? path.join(DIST, "p", m[1], "index.html")
        : v && path.join(DIST, "v", v[1], v[2], "index.html")
      if (fallback && fs.existsSync(fallback)) target = fallback
      else {
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" })
        res.end('<p style="font:14px system-ui;padding:40px">Not found — <a href="/">back to the prototypes</a></p>')
        return
      }
    }
    const type = TYPES[path.extname(target)] || "application/octet-stream"
    // Vite assets are hashed: immutable. HTML never is — otherwise a republish stays
    // invisible to anyone who has already opened the page.
    const cache = target.includes(`${path.sep}assets${path.sep}`)
      ? "public, max-age=31536000, immutable"
      : "no-cache"
    res.writeHead(200, { "content-type": type, "cache-control": cache })
    fs.createReadStream(target).pipe(res)
  })
  .listen(PORT, () => console.log(`Sanctum on :${PORT} · ${selfCheck()}`))
