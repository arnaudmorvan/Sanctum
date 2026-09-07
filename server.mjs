/** Static server for dist/ on Railway. No dependency: adding `serve` or express would pull
 *  a whole npm tree in just to read files off disk. */
import fs from "node:fs"
import http from "node:http"
import path from "node:path"

const DIST = path.join(import.meta.dirname, "dist")
const PORT = process.env.PORT || 3000

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".woff2": "font/woff2", ".map": "application/json",
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0])
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
      // Every flow is a hash-routed SPA: any URL under /p/<slug>/ falls back to its index.
      // The hash never reaches the server, so this is the only useful fallback.
      const m = url.match(/^\/p\/([^/]+)\//)
      const fallback = m && path.join(DIST, "p", m[1], "index.html")
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
  .listen(PORT, () => console.log(`Sanctum on :${PORT}`))
