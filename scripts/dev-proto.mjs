/**
 * `npm run dev <slug>` — open ONE flow locally, with hot reload.
 *
 * This is the gesture a dev makes after cloning the repo from the console ("Get the code").
 * The skeleton (`src/`) imports `./proto/views`: without a `src/proto/` in place, Vite has
 * nothing to start on. `build-all.mjs` installs it before every build by COPYING
 * `protos/<slug>/`; in development that copy would be a trap — you would edit the copy,
 * `src/proto/` is git-ignored, and the work would vanish at the next build.
 *
 * Hence a SYMLINK: what you change on screen really is `protos/<slug>/`, so it is what the
 * MCP published and what a commit will carry. The copy remains only as a fallback, where
 * the link is refused (Windows without the right privileges) — and the script then says so
 * out loud.
 */
import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const PROTOS = path.join(ROOT, "protos")
const SRC_PROTO = path.join(ROOT, "src", "proto")
const PORT = "4244"

const slugs = fs.existsSync(PROTOS)
  ? fs
      .readdirSync(PROTOS, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  : []

const slug = process.argv[2]

// A `vite` started on a flow that does not exist boots anyway, then fails on the import
// with a bundler error. Better to refuse here, with the list in plain sight.
if (!slug || !slugs.includes(slug)) {
  console.error(slug ? `\nUnknown flow: ${slug}` : "\nThe flow to open is missing.")
  console.error("\n  npm run dev <slug>\n")
  console.error(
    slugs.length
      ? `Available flows:\n${slugs.map((s) => `  ${s}`).join("\n")}\n`
      : "No flow in protos/.\n",
  )
  process.exit(1)
}

let title = slug
try {
  const meta = JSON.parse(fs.readFileSync(path.join(PROTOS, slug, "proto.json"), "utf8"))
  // `titre` is the legacy key: kept as a fallback for flows published before the migration.
  title = meta.title ?? meta.titre ?? slug
} catch {
  /* without metadata, the slug is the title */
}

// `rm` does not follow links: this removes the previous link, never the flow it pointed to.
fs.rmSync(SRC_PROTO, { recursive: true, force: true })
try {
  // "junction" only concerns Windows (and requires an absolute target, which it is);
  // elsewhere the type is ignored.
  fs.symlinkSync(path.join(PROTOS, slug), SRC_PROTO, "junction")
} catch (e) {
  fs.cpSync(path.join(PROTOS, slug), SRC_PROTO, { recursive: true })
  console.warn(
    `⚠️  Symlink refused (${e.code}) — falling back to a copy.\n` +
      `   What you change in src/proto/ will NOT flow back into protos/${slug}/.`,
  )
}

console.log(`\n▸ ${title} (${slug}) — http://localhost:${PORT}\n`)
// VITE_PROTO_TITLE: shown by the shared chrome (sidebar) under the logo, as at build time.
spawn("npx", ["vite", "--port", PORT, ...process.argv.slice(3)], {
  cwd: ROOT,
  stdio: "inherit",
  env: { ...process.env, VITE_PROTO_TITLE: title },
}).on("exit", (code) => process.exit(code ?? 0))
