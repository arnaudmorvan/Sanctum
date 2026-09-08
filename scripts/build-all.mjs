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
import { DIST, ROOT, buildFlow, readFlows, toEntry } from "./build-flow.mjs"

const npx = (args, env = {}) =>
  execFileSync("npx", args, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } })

// The per-flow build (copy → tsc → vite) lives in build-flow.mjs: it is the SAME function
// the running site calls for a hot build right after `publish_proto`. Keeping one copy is
// what guarantees that the flow seen ten seconds after publishing is the flow the redeploy
// serves three minutes later.
const results = []
for (const proto of readFlows()) {
  process.stdout.write(`\n▸ flow ${proto.slug}\n`)
  const r = buildFlow(proto)
  if (r.ok) {
    process.stdout.write(r.log)
    results.push({ ...proto, ok: true })
  } else {
    console.error(`✗ ${proto.slug}: build failed — ${r.error}`)
    results.push({ ...proto, ok: false })
  }
}

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
    results.map(toEntry),
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
