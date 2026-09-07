/**
 * Builds ONE site: the console at the root, and N flows under /p/<slug>/.
 *
 * One build per flow, and not a single global build: the protos' code is written by agents
 * driven by POs. A flow that does not compile must not take the others down with it — it is
 * marked "build failed" in the console, the others stay online. Hence the failure caught
 * here instead of letting the process exit.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const PROTOS = path.join(ROOT, "protos")
const SRC_PROTO = path.join(ROOT, "src", "proto")
const DIST = path.join(ROOT, "dist")

const npx = (args, env = {}) =>
  execFileSync("npx", args, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } })

// proto.json is written by the MCP with English keys. The French keys are the legacy shape,
// kept as a fallback for flows published before the migration was deployed.
const readMeta = (raw, slug) => ({
  slug,
  title: raw.title ?? raw.titre ?? slug,
  author: raw.author ?? raw.auteur,
  summary: raw.summary ?? raw.resume,
  created_at: raw.created_at ?? raw.cree_le,
  updated_at: raw.updated_at ?? raw.maj_le,
  files: raw.files ?? raw.fichiers,
})

const readFlows = () => {
  if (!fs.existsSync(PROTOS)) return []
  return fs
    .readdirSync(PROTOS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      let raw = {}
      try {
        raw = JSON.parse(fs.readFileSync(path.join(PROTOS, e.name, "proto.json"), "utf8"))
      } catch {
        /* a flow without metadata stays buildable: the slug is enough */
      }
      return readMeta(raw, e.name)
    })
}

const build = (proto) => {
  fs.rmSync(SRC_PROTO, { recursive: true, force: true })
  fs.cpSync(path.join(PROTOS, proto.slug), SRC_PROTO, { recursive: true })
  // proto.json is not code: leaving it in src/ would feed it to the bundler.
  fs.rmSync(path.join(SRC_PROTO, "proto.json"), { force: true })
  // Typecheck BEFORE the bundle, and it is essential: Vite/esbuild strip the types without
  // checking them. A flow that writes `Table.Root` (which does not exist — the root is
  // `Table` itself) bundles without a complaint, then blows up on open. Without this step,
  // the console would show green flows that are broken.
  npx(["tsc", "--noEmit", "-p", "tsconfig.json"])
  // VITE_PROTO_TITLE: shown by the shared chrome (sidebar) under the 42 logo.
  // VITE_PROTO_SLUG: the "Feedback" widget attaches it to every submission — it is what
  // tells the MCP server which queue (`context/feedback-flows/<slug>.md`) the feedback
  // falls into.
  npx(["vite", "build"], {
    PROTO_SLUG: proto.slug,
    VITE_PROTO_SLUG: proto.slug,
    VITE_PROTO_TITLE: proto.title ?? "",
  })
}

const results = []
for (const proto of readFlows()) {
  process.stdout.write(`\n▸ flow ${proto.slug}\n`)
  try {
    build(proto)
    results.push({ ...proto, ok: true })
  } catch (e) {
    console.error(`✗ ${proto.slug}: build failed — ${e.message}`)
    results.push({ ...proto, ok: false })
  }
}
fs.rmSync(SRC_PROTO, { recursive: true, force: true })

fs.mkdirSync(DIST, { recursive: true })

// "Which commit is deployed?" has to be a curl, not a dig through Railway: a manual
// redeploy replays the snapshot of the deployment that was clicked, not the repo HEAD, and
// without this stamp the gap is invisible from the outside.
const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
  } catch {
    return null
  }
}
const sha = process.env.RAILWAY_GIT_COMMIT_SHA ?? git("rev-parse", "HEAD")

// Where the code comes from: this is what the console shows a dev who wants to clone a
// flow. Railway provides owner/name/branch as variables (the build runs on a snapshot with
// no remote); locally we read the remote. With neither, `repo` is null and the console only
// names the directory — it does not invent a URL.
const fromRailway =
  process.env.RAILWAY_GIT_REPO_OWNER && process.env.RAILWAY_GIT_REPO_NAME
    ? {
        owner: process.env.RAILWAY_GIT_REPO_OWNER,
        name: process.env.RAILWAY_GIT_REPO_NAME,
        branch: process.env.RAILWAY_GIT_BRANCH ?? "main",
      }
    : null
const fromRemote = (() => {
  const m = git("remote", "get-url", "origin")?.match(
    /github\.com[:/]([^/]+)\/([^/\s]+?)(?:\.git)?$/,
  )
  return m
    ? { owner: m[1], name: m[2], branch: git("rev-parse", "--abbrev-ref", "HEAD") ?? "main" }
    : null
})()
const origin = fromRailway ?? fromRemote
const repo = origin
  ? {
      ...origin,
      url: `https://github.com/${origin.owner}/${origin.name}`,
      clone: `git@github.com:${origin.owner}/${origin.name}.git`,
      protos_dir: "protos",
    }
  : null

fs.writeFileSync(
  path.join(DIST, "version.json"),
  `${JSON.stringify({ commit: sha, built_at: new Date().toISOString(), repo }, null, 2)}\n`,
)

// Read by the console on load (same origin, no key). Written BEFORE its build so that a
// local `vite preview` finds the file straight away.
fs.writeFileSync(
  path.join(DIST, "protos.json"),
  `${JSON.stringify(
    // `files` travels too: it is what lets the console list a flow's screens — and
    // therefore offer ONE of them — without a call to the MCP just to draw a list.
    results.map(({ slug, title, author, summary, created_at, updated_at, ok, files }) => ({
      slug, title, author, summary, created_at, updated_at, ok, files: files ?? [],
    })),
    null,
    2,
  )}\n`,
)

process.stdout.write("\n▸ console\n")
npx(["tsc", "--noEmit", "-p", "tsconfig.console.json"])
npx(["vite", "build", "--config", "vite.console.config.ts"])

const failed = results.filter((r) => !r.ok)
console.log(`\nConsole built. ${results.length - failed.length}/${results.length} flows.`)
if (failed.length) console.log(`Failed: ${failed.map((k) => k.slug).join(", ")}`)
