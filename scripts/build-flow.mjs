/**
 * Builds ONE flow — the unit shared by `build-all.mjs` (the CI, every flow) and
 * `server.mjs` (the hot build: one flow, inside the running container, seconds after
 * `publish_proto`).
 *
 * Why it had to become a module: the CI build and the hot build must produce the SAME
 * output from the same sources, or the flow a PO sees ten seconds after publishing would
 * differ from the one the redeploy serves three minutes later. One function, two callers.
 *
 * What it does, in order:
 *   1. copies `protos/<slug>/` into `src/proto/` — the skeleton imports `./proto/views`,
 *      so the flow has to sit there for the bundler to see it (proto.json removed: it is
 *      not code);
 *   2. `tsc --noEmit` — BEFORE the bundle, and it is essential: Vite/esbuild strip the
 *      types without checking them. A flow that writes `Table.Root` (which does not exist)
 *      bundles without a complaint, then blows up on open;
 *   3. `vite build` into `outDir` (default `dist/p/<slug>`; the hot build passes a temp
 *      directory and swaps it in atomically, so a viewer never hits a half-written flow).
 *
 * The output of the two steps is CAPTURED, not inherited: the hot build sends the tsc
 * errors back to the agent that published, so a broken flow gets fixed in the same
 * conversation instead of being discovered as a red card minutes later.
 *
 * The binaries are called directly (`node_modules/.bin/…`), not through `npx`: npx
 * resolves the package on every call, and that is ~300 ms paid twice per flow for nothing.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

export const ROOT = path.resolve(import.meta.dirname, "..")
export const PROTOS = path.join(ROOT, "protos")
export const SRC_PROTO = path.join(ROOT, "src", "proto")
export const DIST = path.join(ROOT, "dist")

const BIN = path.join(ROOT, "node_modules", ".bin")

/** proto.json is written by the MCP with English keys. The French keys are the legacy
 *  shape, kept as a fallback for flows published before the migration was deployed. */
export const readMeta = (raw, slug) => ({
  slug,
  title: raw.title ?? raw.titre ?? slug,
  author: raw.author ?? raw.auteur,
  summary: raw.summary ?? raw.resume,
  created_at: raw.created_at ?? raw.cree_le,
  updated_at: raw.updated_at ?? raw.maj_le,
  // To the second, stamped by the MCP at publication (2026-09-08). The two dates above
  // are days; this is what the flow's History tab shows before any key is typed. Absent
  // on flows published before the stamp existed — the tab then shows the day.
  published_at: raw.published_at,
  files: raw.files ?? raw.fichiers,
})

/** The flows on disk, with their metadata. A flow without proto.json stays buildable:
 *  the slug is enough. */
export const readFlows = () => {
  if (!fs.existsSync(PROTOS)) return []
  return fs
    .readdirSync(PROTOS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      let raw = {}
      try {
        raw = JSON.parse(fs.readFileSync(path.join(PROTOS, e.name, "proto.json"), "utf8"))
      } catch {
        /* a flow without metadata stays buildable */
      }
      return readMeta(raw, e.name)
    })
}

/** The `protos.json` entry of a build result — what the console reads. `files` travels
 *  too: it is what lets the console list a flow's screens without a call to the MCP. */
export const toEntry = ({
  slug, title, author, summary, created_at, updated_at, published_at, ok, files,
}) => ({
  slug, title, author, summary, created_at, updated_at, published_at, ok, files: files ?? [],
})

const run = (bin, args, env, log) => {
  try {
    const out = execFileSync(path.join(BIN, bin), args, {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 8 * 1024 * 1024,
    })
    log.push(out.toString())
  } catch (e) {
    // tsc writes its diagnostics on stdout, vite its errors on stderr: keep both, the
    // agent reading the failure needs the file:line, not "exit code 2".
    const text = [e.stdout?.toString(), e.stderr?.toString()].filter(Boolean).join("\n")
    throw new Error(`${bin} failed${text ? `:\n${text.trim()}` : ` (${e.message})`}`)
  }
}

/**
 * Builds one flow. Returns `{ ok, ms, log }`; on failure `{ ok: false, error, ms, log }` —
 * it never throws for a flow that does not compile: a broken flow must not take the
 * others down with it (the CI marks it, the hot build reports it).
 *
 * `outDir` is relative to ROOT. Default: `dist/p/<slug>` — the served location.
 * `source` is the directory the flow is copied FROM. Default: `protos/<slug>` — the
 *   live flow. The preview of a past version passes a temp directory holding the files
 *   as they were at that commit: the live folder is not touched.
 * `base` is the public path the bundle is served under. Default: `/p/<slug>/`.
 * `version` — `{ short, date, author }` — marks the bundle as a PAST version: the
 *   skeleton then shows a banner and keeps feedback and comments on the live flow.
 */
export function buildFlow(flow, { outDir, source, base, version } = {}) {
  const started = Date.now()
  const log = []
  const out = outDir ?? path.join("dist", "p", flow.slug)
  try {
    fs.rmSync(SRC_PROTO, { recursive: true, force: true })
    fs.cpSync(source ?? path.join(PROTOS, flow.slug), SRC_PROTO, { recursive: true })
    fs.rmSync(path.join(SRC_PROTO, "proto.json"), { force: true })
    run("tsc", ["--noEmit", "-p", "tsconfig.json"], {}, log)
    // VITE_PROTO_TITLE: shown by the shared chrome (sidebar) under the 42 logo.
    // VITE_PROTO_SLUG: the "Feedback" widget attaches it to every submission — it is what
    // tells the MCP server which queue the feedback falls into.
    // VITE_PROTO_VERSION*: only on the preview of a past version (see `version` above).
    run(
      "vite",
      ["build"],
      {
        PROTO_SLUG: flow.slug,
        PROTO_OUT_DIR: out,
        PROTO_BASE: base ?? "",
        VITE_PROTO_SLUG: flow.slug,
        VITE_PROTO_TITLE: flow.title ?? "",
        VITE_PROTO_VERSION: version?.short ?? "",
        VITE_PROTO_VERSION_AT: version?.date ?? "",
        VITE_PROTO_VERSION_BY: version?.author ?? "",
      },
      log,
    )
    return { ok: true, ms: Date.now() - started, log: log.join("") }
  } catch (e) {
    return { ok: false, error: e.message, ms: Date.now() - started, log: log.join("") }
  } finally {
    fs.rmSync(SRC_PROTO, { recursive: true, force: true })
  }
}
