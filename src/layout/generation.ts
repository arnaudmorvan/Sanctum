/** What each generation of this flow COST — read from the flow's own bundle.
 *
 *  Where it comes from. `publish_proto` measures the window it just closed (the MCP's
 *  `workshop.py` watches the calls go past) and commits `generation.json` at the flow's
 *  root, in the same commit as the screens. `build-flow.mjs` copies the flow's folder into
 *  `src/proto/`, so this file is in the bundle: the panel builds its whole answer with no
 *  request, no key and no token — the same bargain `figma-source.ts` strikes.
 *
 *  ⚠️ OPTIONAL by construction, twice over: every flow published before 2026-09-09 has no
 *  record at all, and a flow republished by an older server would stop gaining them. A
 *  bare `import` would break their build; `import.meta.glob` tolerates zero matches, and
 *  spares us `resolveJsonModule`, which this tsconfig does not set.
 *
 *  THREE KINDS OF NUMBER, and the panel must never blur them:
 *   • MEASURED — the wall clock of a run, the time inside the model (the silences between
 *     two calls), the round trips. Read off the calls themselves;
 *   • ATTRIBUTED — the per-screen time. One publication carries several screens, so their
 *     individual times are shared out in proportion to what was written. It is the honest
 *     shape of the answer, and printing it as a measurement is what would make a
 *     comparison table lie;
 *   • ESTIMATED — the tokens. No model knows its own billed usage, so this is the
 *     characters that went through the MCP server, divided by four. It counts the context
 *     served and the code written; it does not know the host's own scaffolding. */

type RawFile = {
  path?: string
  bytes?: number
  lines?: number
  new?: boolean
  /** Attributed seconds — see above. Short key: this file ships in the bundle. */
  s?: number
}

type RawRun = {
  run?: number
  at?: string
  author?: string
  client?: string
  model?: string
  measured?: boolean
  wall_s?: number
  model_s?: number
  server_s?: number
  away_s?: number
  calls?: number
  tools?: Record<string, number>
  in_chars?: number
  out_chars?: number
  files?: RawFile[]
}

const found = import.meta.glob("../proto/generation.json", {
  eager: true,
  import: "default",
}) as Record<string, { runs?: RawRun[] }>

const RUNS: RawRun[] = Object.values(found)[0]?.runs?.filter(Boolean) ?? []

/** The same divisor as the MCP server's (`generation.CHARS_PER_TOKEN`) and as the
 *  metrics'. Two estimates of one thing with two divisors is how two panels come to
 *  contradict each other about the same flow. */
const CHARS_PER_TOKEN = 4

export const hasRecords = (): boolean => RUNS.length > 0

export type Run = {
  n: number
  at: string
  author: string
  model: string
  measured: boolean
  wallS: number
  modelS: number
  serverS: number
  awayS: number
  calls: number
  tools: [string, number][]
  tokensIn: number
  tokensOut: number
  files: number
}

export type FileCost = {
  path: string
  /** Attributed, never measured. */
  seconds: number
  runs: number
  bytes: number
  lines: number
  created: string
  updated: string
  isScreen: boolean
}

/** A screen, as opposed to fixtures or the registry — the convention every flow follows,
 *  and the same one the console's screen list uses. */
const isScreen = (path: string) => /^pages\/.+\.tsx?$/.test(path)

export const runs = (): Run[] =>
  RUNS.map((r) => ({
    n: r.run ?? 0,
    at: r.at ?? "",
    author: r.author ?? "",
    model: r.model ?? "",
    measured: r.measured !== false,
    wallS: r.wall_s ?? 0,
    modelS: r.model_s ?? 0,
    serverS: r.server_s ?? 0,
    awayS: r.away_s ?? 0,
    calls: r.calls ?? 0,
    tools: Object.entries(r.tools ?? {}).sort((a, b) => b[1] - a[1]),
    tokensIn: Math.floor((r.in_chars ?? 0) / CHARS_PER_TOKEN),
    tokensOut: Math.floor((r.out_chars ?? 0) / CHARS_PER_TOKEN),
    files: (r.files ?? []).length,
  })).sort((a, b) => b.n - a.n)

/** Per FILE, across every run. Keyed by file and not by the `path` of a `VIEWS` entry, on
 *  purpose: the server writes files, and mapping one back to a screen entry means parsing
 *  `views.tsx` and being wrong the day a flow spells it differently. `pages/dashboard.tsx`
 *  is a name a PO can check; an inferred one is not. */
export const files = (): FileCost[] => {
  const acc = new Map<string, FileCost>()
  for (const run of RUNS) {
    for (const f of run.files ?? []) {
      const path = f.path ?? ""
      if (!path) continue
      const entry = acc.get(path) ?? {
        path,
        seconds: 0,
        runs: 0,
        bytes: 0,
        lines: 0,
        created: "",
        updated: "",
        isScreen: isScreen(path),
      }
      entry.seconds += f.s ?? 0
      entry.runs += 1
      // The LAST state of the file wins: a screen rewritten three times weighs what it
      // weighs today, not the sum of its drafts.
      entry.bytes = f.bytes ?? entry.bytes
      entry.lines = f.lines ?? entry.lines
      entry.updated = run.at ?? entry.updated
      if (f.new || !entry.created) entry.created = run.at ?? ""
      acc.set(path, entry)
    }
  }
  return [...acc.values()].sort(
    (a, b) => Number(b.isScreen) - Number(a.isScreen) || b.seconds - a.seconds,
  )
}

export type Totals = {
  runs: number
  screens: number
  modelS: number
  wallS: number
  serverS: number
  awayS: number
  calls: number
  perScreenS: number
  tokensIn: number
  tokensOut: number
  models: string[]
  /** False as soon as ONE run was published by a server that had lost its window: the
   *  totals are then a floor, and the panel says so rather than showing a short number as
   *  if it were the whole cost. */
  allMeasured: boolean
}

export const totals = (): Totals => {
  const rows = runs()
  const screens = files().filter((f) => f.isScreen).length
  const modelS = rows.reduce((s, r) => s + r.modelS, 0)
  const models: string[] = []
  for (const r of rows) if (r.model && !models.includes(r.model)) models.push(r.model)
  return {
    runs: rows.length,
    screens,
    modelS,
    wallS: rows.reduce((s, r) => s + r.wallS, 0),
    serverS: rows.reduce((s, r) => s + r.serverS, 0),
    awayS: rows.reduce((s, r) => s + r.awayS, 0),
    calls: rows.reduce((s, r) => s + r.calls, 0),
    perScreenS: screens ? Math.round(modelS / screens) : 0,
    tokensIn: rows.reduce((s, r) => s + r.tokensIn, 0),
    tokensOut: rows.reduce((s, r) => s + r.tokensOut, 0),
    models,
    allMeasured: rows.every((r) => r.measured),
  }
}

/** `4 min 12 s`, `38 s`, `1 h 07`. Seconds are dropped past the hour: nobody compares two
 *  methods to the second at that scale, and the extra digits only make the number harder
 *  to read back. */
export const duration = (seconds: number): string => {
  const s = Math.max(0, Math.round(seconds))
  if (s < 60) return `${s} s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min${s % 60 ? ` ${s % 60} s` : ""}`
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`
}

export const compact = (n: number): string =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${Math.round(n / 1_000)}k`
      : String(n)

/** The file a screen was most likely written in — the last segment of its `VIEWS` path
 *  against the file's stem. A DISPLAY affordance only (it highlights one row), and the
 *  worst it can do is highlight nothing: nowhere is a number attributed on the strength
 *  of this guess. */
export const fileForScreen = (viewPath?: string): string => {
  const stem = (viewPath ?? "").split("/").filter(Boolean).pop()?.toLowerCase()
  if (!stem) return ""
  const norm = (v: string) => v.replace(/[-_]/g, "")
  const hits = files().filter(
    (f) => f.isScreen && norm(f.path.slice("pages/".length).replace(/\.tsx?$/, "")) === norm(stem),
  )
  return hits.length === 1 ? hits[0].path : ""
}
