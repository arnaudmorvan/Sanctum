/**
 * The HOT BUILD — `POST /build/<slug>` on the running site.
 *
 * The problem it solves: `publish_proto` commits a flow, and the commit triggers a Railway
 * redeploy — clone, `npm ci`, build, image, swap. The build itself takes ~3 s per flow; the
 * pipeline around it takes minutes, and for those minutes the PO looks at a card that says
 * "published · deploying" and nothing else. This route builds ONE flow inside the container
 * that is already running, from the files the MCP has just committed, and serves it at once.
 *
 * What it is NOT: a second source of truth. The git commit remains the flow; this is a
 * fast-forward of what the next deploy will produce anyway — the same `buildFlow` as the CI,
 * on the same files. If the hook is down, missing, or refuses, nothing is lost: the redeploy
 * still lands minutes later, exactly as before.
 *
 * Guards (the caller is the MCP server, but the route is reachable by whoever holds the key):
 *   • fail-closed — without `BUILD_KEY` in the environment the route does not exist;
 *   • the key is compared in constant time;
 *   • the payload is re-validated here with the SAME bounds as the MCP (slug shape, file
 *     count, size, depth, extension allowlist, no path escape): the MCP checked them, but a
 *     route that trusts its caller's validation is a route with none;
 *   • builds are SERIALIZED: `src/proto/` is a single working directory, two concurrent
 *     builds would interleave their copies;
 *   • the bundle lands in a temp directory and is swapped into `dist/p/<slug>/` with two
 *     renames — a viewer refreshing mid-build gets the old flow or the new one, never a 404.
 */
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { DIST, PROTOS, ROOT, buildFlow, toEntry } from "./build-flow.mjs"

export const BUILD_KEY = process.env.BUILD_KEY ?? ""

/** What the hot build needs at RUNTIME, checked once at boot. Railway builds and runs the
 *  same image, so `node_modules/.bin/{tsc,vite}` are normally there — but a host that
 *  prunes devDependencies after the build would leave the route mounted and every build
 *  failing with an ENOENT. Said once in the logs instead of once per publication. */
export const selfCheck = () => {
  if (!BUILD_KEY) return "hot build disabled (no BUILD_KEY)"
  const bin = path.join(ROOT, "node_modules", ".bin")
  const missing = ["tsc", "vite"].filter((b) => !fs.existsSync(path.join(bin, b)))
  return missing.length
    ? `⚠️ hot build mounted but ${missing.join(", ")} missing from node_modules/.bin — ` +
        "devDependencies pruned? every POST /build will fail"
    : "hot build enabled (POST /build/<slug>)"
}

// Same bounds as `_proto_validate_files` / `_proto_validate_slug` in the MCP's server.py.
// A drift between the two would let a flow pass there and be refused here (or the reverse).
const SLUG = /^[a-z0-9][a-z0-9-]{1,48}$/
const MAX_FILES = 40
const MAX_FILE_BYTES = 200_000
const MAX_TOTAL_BYTES = 1_000_000
const MAX_DEPTH = 3
const EXTENSIONS = [".tsx", ".ts", ".css", ".json", ".md", ".svg"]
const RESERVED = new Set(["node_modules", "dist", ".github", "_shell"])
const MAX_BODY = 1_500_000 // the 1 MB of files plus the JSON around them

export class BuildError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export const validateSlug = (slug) => {
  if (typeof slug !== "string" || !SLUG.test(slug)) {
    throw new BuildError(400, `Invalid slug: ${JSON.stringify(slug)}.`)
  }
  return slug
}

/** Returns the files as a clean `{path: content}` map, or throws a BuildError. */
export const validateFiles = (files) => {
  if (!files || typeof files !== "object" || Array.isArray(files) || !Object.keys(files).length) {
    throw new BuildError(400, "`files` must be a non-empty object {path: content}.")
  }
  const names = Object.keys(files)
  if (names.length > MAX_FILES) {
    throw new BuildError(400, `${names.length} files: maximum ${MAX_FILES} per flow.`)
  }
  const clean = {}
  let total = 0
  for (const raw of names) {
    const p = String(raw).trim().replace(/^\/+/, "")
    if (!p || p.includes("..") || p.startsWith(".") || p.includes("\\")) {
      throw new BuildError(400, `File path refused: ${JSON.stringify(raw)}.`)
    }
    if (p.split("/").length > MAX_DEPTH) {
      throw new BuildError(400, `Path too deep: ${p} (maximum ${MAX_DEPTH} levels).`)
    }
    if (!EXTENSIONS.some((ext) => p.endsWith(ext))) {
      throw new BuildError(400, `Extension refused: ${p}.`)
    }
    if (RESERVED.has(p.split("/")[0])) {
      throw new BuildError(400, `Reserved folder, not writable by a flow: ${p}.`)
    }
    const content = files[raw]
    if (typeof content !== "string") {
      throw new BuildError(400, `The content of ${p} must be a string.`)
    }
    const bytes = Buffer.byteLength(content, "utf8")
    if (bytes > MAX_FILE_BYTES) {
      throw new BuildError(400, `${p} is ${Math.round(bytes / 1000)} KB: maximum 200 KB per file.`)
    }
    total += bytes
    clean[p] = content
  }
  if (total > MAX_TOTAL_BYTES) {
    throw new BuildError(400, `Flow of ${Math.round(total / 1000)} KB: maximum 1000 KB overall.`)
  }
  if (!names.some((n) => n === "views.tsx" || n.endsWith("/views.tsx"))) {
    throw new BuildError(400, "`views.tsx` is missing: it is the flow's screens registry.")
  }
  return clean
}

const keyMatches = (given) => {
  if (!BUILD_KEY || typeof given !== "string") return false
  const a = Buffer.from(given)
  const b = Buffer.from(BUILD_KEY)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** Writes the flow on disk the way the commit did: add and replace, never delete. The
 *  container's `protos/<slug>/` is a copy of git at deploy time; overlaying the published
 *  files reproduces exactly what git holds after the commit. */
const writeFlow = (slug, files, meta) => {
  const root = path.join(PROTOS, slug)
  fs.mkdirSync(root, { recursive: true })
  for (const [p, content] of Object.entries(files)) {
    const target = path.join(root, p)
    // Resolved AFTER validation, checked anyway: the last line of defense costs one call.
    if (!target.startsWith(root + path.sep)) throw new BuildError(400, `Path escapes the flow: ${p}`)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, content)
  }
  fs.writeFileSync(path.join(root, "proto.json"), `${JSON.stringify(meta, null, 2)}\n`)
}

/** `dist/protos.json` is what the console reads. Replace the slug's entry or add it, keep
 *  the alphabetical order the CI produces (readdirSync order). */
const updateIndex = (entry) => {
  const file = path.join(DIST, "protos.json")
  let list = []
  try {
    list = JSON.parse(fs.readFileSync(file, "utf8"))
  } catch {
    /* first flow on a site built without any — the index starts here */
  }
  const next = [...list.filter((e) => e.slug !== entry.slug), entry].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  )
  fs.mkdirSync(DIST, { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`)
}

/** Two renames: the served directory is never empty, not even for a millisecond. */
const swapIn = (slug, tmp) => {
  const served = path.join(DIST, "p", slug)
  const old = `${served}.old-${Date.now()}`
  fs.mkdirSync(path.dirname(served), { recursive: true })
  if (fs.existsSync(served)) fs.renameSync(served, old)
  fs.renameSync(tmp, served)
  fs.rmSync(old, { recursive: true, force: true })
}

// One build at a time. `src/proto/` is a single working directory: two concurrent copies
// would interleave. The chain never rejects — a failed build resolves with ok:false.
let queue = Promise.resolve()

const runBuild = (slug, files, meta) =>
  new Promise((resolve) => {
    queue = queue.then(() => {
      let result
      try {
        writeFlow(slug, files, meta)
        const tmp = path.join(DIST, ".build", `${slug}-${Date.now()}`)
        result = buildFlow({ slug, title: meta.title }, { outDir: path.relative(ROOT, tmp) })
        if (result.ok) swapIn(slug, tmp)
        else fs.rmSync(tmp, { recursive: true, force: true })
        // A failed build is written to the index too: the console shows the red card
        // straight away instead of a "deploying" one that never resolves.
        updateIndex(toEntry({ ...meta, slug, ok: result.ok }))
      } catch (e) {
        result = { ok: false, error: e.message, ms: 0, log: "" }
      }
      resolve(result)
    })
  })

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on("data", (c) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(new BuildError(413, "Payload too large."))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })

const send = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" })
  res.end(`${JSON.stringify(body)}\n`)
}

/** The route handler. Returns false when the URL is not ours (the static server goes on). */
export async function handleBuild(req, res, url) {
  const m = url.match(/^\/build\/([^/]+)\/?$/)
  if (!m) return false
  // Fail-closed: no key in the environment, no route — the same rule as the MCP's console.
  if (!BUILD_KEY) return false
  if (req.method !== "POST") {
    send(res, 405, { ok: false, error: "POST only." })
    return true
  }
  if (!keyMatches(req.headers["x-build-key"])) {
    send(res, 401, { ok: false, error: "Build key refused." })
    return true
  }
  try {
    const slug = validateSlug(m[1])
    const body = JSON.parse(await readBody(req))
    const files = validateFiles(body.files)
    const meta = {
      slug,
      title: String(body.meta?.title ?? slug),
      author: String(body.meta?.author ?? ""),
      summary: String(body.meta?.summary ?? ""),
      created_at: body.meta?.created_at,
      updated_at: body.meta?.updated_at,
      // Stamped by the MCP at publication (to the second); the console's History tab
      // reads it. Passed through so a hot-built flow shows the same as a CI-built one.
      published_at: body.meta?.published_at,
      files: Object.keys(files).sort(),
    }
    const r = await runBuild(slug, files, meta)
    if (r.ok) {
      send(res, 200, { ok: true, slug, url: `/p/${slug}/`, ms: r.ms })
    } else {
      // 422: the request was fine, the FLOW does not compile. The body carries the
      // diagnostics — the agent that published reads them and republishes a fix.
      send(res, 422, { ok: false, slug, error: r.error, ms: r.ms })
    }
  } catch (e) {
    const status = e instanceof BuildError ? e.status : e instanceof SyntaxError ? 400 : 500
    // A 5xx is OURS (disk, spawn, pruned binaries): it must reach the Railway logs, the
    // MCP only sees "the hook did not answer" and falls back to the CI wording.
    if (status >= 500) console.error(`hot build ${m[1]}: ${e.message}`)
    send(res, status, { ok: false, error: e.message })
  }
  return true
}
