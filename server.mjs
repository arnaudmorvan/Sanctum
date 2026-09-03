/** Serveur statique de dist/ pour Railway. Sans dépendance : ajouter `serve` ou express
 *  ferait installer un arbre npm entier pour lire des fichiers sur disque. */
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
    // Traversée : on résout puis on vérifie qu'on est resté sous dist/.
    let cible = path.join(DIST, url)
    if (!cible.startsWith(DIST)) {
      res.writeHead(403).end("Forbidden")
      return
    }
    if (fs.existsSync(cible) && fs.statSync(cible).isDirectory()) {
      cible = path.join(cible, "index.html")
    }
    if (!fs.existsSync(cible)) {
      // Chaque parcours est une SPA à routage par hash : toute URL sous /p/<slug>/ retombe
      // sur son index. Le hash ne partant jamais au serveur, c'est le seul repli utile.
      const m = url.match(/^\/p\/([^/]+)\//)
      const repli = m && path.join(DIST, "p", m[1], "index.html")
      if (repli && fs.existsSync(repli)) cible = repli
      else {
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" })
        res.end('<p style="font:14px system-ui;padding:40px">Introuvable — <a href="/">retour aux prototypes</a></p>')
        return
      }
    }
    const type = TYPES[path.extname(cible)] || "application/octet-stream"
    // Les assets Vite sont hachés : immuables. Les HTML, jamais — sinon une republication
    // reste invisible pour qui a déjà ouvert la page.
    const cache = cible.includes(`${path.sep}assets${path.sep}`)
      ? "public, max-age=31536000, immutable"
      : "no-cache"
    res.writeHead(200, { "content-type": type, "cache-control": cache })
    fs.createReadStream(cible).pipe(res)
  })
  .listen(PORT, () => console.log(`protos-42 sur :${PORT}`))
