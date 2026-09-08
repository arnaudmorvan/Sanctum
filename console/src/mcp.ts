/** The MCP server client.
 *
 *  The console is a static site served by Railway; the MCP is another service. Its routes
 *  expose `Access-Control-Allow-Origin: *`, so calling it directly works — no proxy to
 *  write.
 *
 *  ⚠️ `DASHBOARD_KEY` is a SHARED secret, typed once and kept in the browser. It is not an
 *  identity: it does not say WHO is looking. Per-person auth exists on the server side
 *  (access/users.json, `42ds_…` tokens) — the Access tab shows it.
 */
const BASE = (
  import.meta.env.VITE_MCP_URL ?? "https://mcp-42-production.up.railway.app"
).replace(/\/$/, "")

const KEY = "42ds.console.key"
/** Deployment shim: the key used to live under this name. We read it once so nobody who
 *  already signed in gets kicked out by the rename — we never write it back. Delete once
 *  every browser has rolled over. */
const LEGACY_KEY = "42ds.console.cle"

export const readKey = (): string => {
  try {
    return localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY) ?? ""
  } catch {
    return "" // private browsing, storage blocked: we ask for the key again
  }
}

export const writeKey = (v: string): void => {
  try {
    v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY)
    // Whatever happens, the old entry stops being a second source of truth.
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* without storage the key lives for the session — everything else still works */
  }
}

export class AccessError extends Error {}

export async function get<T>(route: string): Promise<T> {
  const key = readKey()
  const r = await fetch(`${BASE}${route}`, { headers: key ? { "X-DS-Key": key } : {} })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) throw new Error(`${route} → HTTP ${r.status}`)
  return (await r.json()) as T
}

/** The flows are written by the build, next to the console: same origin, no key. */
export async function getFlows<T>(): Promise<T> {
  const r = await fetch("/protos.json")
  if (!r.ok) throw new Error(`protos.json → HTTP ${r.status}`)
  return (await r.json()) as T
}

/** The build stamp: which commit is being served, and where the code comes from. Same
 *  origin, no key. This is what lets the console tell a dev HOW to clone a flow without a
 *  single repo URL being hard-coded here. */
export async function getVersion(): Promise<Version> {
  const r = await fetch("/version.json")
  if (!r.ok) throw new Error(`version.json → HTTP ${r.status}`)
  return (await r.json()) as Version
}

/** Removes a flow from the flows repo — one commit, reversible with `git revert`. The MCP
 *  server holds the PAT; the console only presents the key. The flow only disappears from
 *  the site at the next deployment: `protos.json` is written by the build. */
export async function deleteFlow(slug: string): Promise<Deletion> {
  const key = readKey()
  const r = await fetch(`${BASE}/console/protos/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: key ? { "X-DS-Key": key } : {},
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (r.status === 404)
    throw new Error("The server cannot delete flows (route missing, or flow already removed).")
  if (!r.ok) {
    let detail = `HTTP ${r.status}`
    try {
      detail = ((await r.json()) as { error?: string }).error ?? detail
    } catch {
      /* non-JSON body: the status is enough */
    }
    throw new Error(detail)
  }
  return (await r.json()) as Deletion
}

/** Tests a key WITHOUT storing it: this is what lets the sign-in screen say "rejected"
 *  instead of saving a wrong key and letting six tabs fail one by one. Returns the summary
 *  on success — the call does double duty. */
export async function checkKey(key: string): Promise<Summary> {
  const r = await fetch(`${BASE}/console/summary.json`, { headers: { "X-DS-Key": key } })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) throw new Error(`Server unreachable (HTTP ${r.status}).`)
  return (await r.json()) as Summary
}

export const MCP_URL = BASE

// ---------------------------------------------------------------- served shapes

export type Pair = { n: string; v: number }

export type Metrics = {
  meta?: { range?: string; updated?: string; period?: string }
  totalCalls?: number
  activeTools?: number
  clients?: number
  errorRate?: number
  latencyMs?: number
  tokensServed?: number
  creditsSaved?: number
  thinkMs?: number
  topTools?: Pair[]
  gaps?: Pair[]
  gapsTotal?: number
  sequences?: Pair[]
  clientsList?: string[]
  recent?: Array<{ t: string; n: string; lat: number; ok: boolean }>
  series?: { calls?: number[]; sessions?: number[]; errors?: number[] }
  heatmap?: number[][]
  payloadTop?: Pair[]
  aliases?: Array<{ searched: string; suggested: string; count: number; score: number }>
  requested?: Array<{ group: string; items: Pair[] }>
  matrix?: Array<{ tool: string; row: number[] }>
}

export type Session = {
  id: string
  client: string
  calls: number
  errors: number
  misses: number
  loops: number
  repeats: number
  durationS: number
  tokens: number
  friction: number
}

export type Quality = {
  points?: Array<Record<string, unknown>>
  empty?: boolean
}

export type Entry = { name: string; type: string; size: number }
export type Tree = { dir: string; entries: Entry[] }
export type FileContent = { path: string; content: string; truncated?: boolean }

export type Access = {
  users: Array<{
    id?: string
    name?: string
    email?: string
    role?: string
    active?: boolean
    added_at?: string
  }>
  roles: Record<string, string>
  regime?: string
  read_only?: boolean
  error?: string
}

export type Summary = {
  skills?: number
  foundations?: number
  product?: number
  reports?: number
  components?: number
}

/** Written by `scripts/build-all.mjs`. `repo` is null when the build found neither Railway
 *  variables nor a git remote — the console then names the folder, not the URL. */
export type Repo = {
  owner: string
  name: string
  branch: string
  url: string
  clone: string
  protos_dir: string
}

export type Version = {
  commit: string | null
  built_at: string
  repo?: Repo | null
}

export type Deletion = { ok: true; slug: string; commit: string; files: number }

/** One flow being built at this second. `role` says which of the three little agents is at
 *  work — the server names it (`workshop.py`), the console only draws it: a phase added over
 *  there must not need a deployment over here. */
export type Building = {
  id: string
  slug: string
  title: string
  author: string
  client: string
  phase: string
  role: "po" | "designer" | "dev" | string
  activity: string
  shipped: boolean
  calls: number
  seconds: number
  idle: number
}

/** The flows being built RIGHT NOW, and what the agent is doing on them. Read from the MCP
 *  server's memory (`workshop.py`), which deduces it from the tool calls themselves — so the
 *  card lights up without anything being asked of the agent or of the connector.
 *
 *  Polled while the Prototypes tab is open: the answer costs no GitHub call, which is what
 *  makes a five-second cadence acceptable. */
export async function getWorkshop(): Promise<{ building: Building[] }> {
  return get<{ building: Building[] }>("/console/workshop.json")
}

/** The source of ONE screen: the file asked for, and the flow files it imports — its
 *  fixtures, a block it shares. A `pages/x.tsx` alone imports things that exist nowhere
 *  else and ports nowhere, which is what made "clone the repo" the only answer until now.
 *
 *  `truncated`: the bundle hit the server's cap (a screen that pulls the whole flow). What
 *  came back is complete for what it contains — the rest is in the repo. */
export type ScreenSource = {
  slug: string
  path: string
  files: Array<{ path: string; content: string }>
  truncated: boolean
}

/** Read through the MCP server: the flows repo is private, and the console key is the door.
 *  The sources are deliberately NOT published next to the site — a proto URL circulates. */
export async function getScreenSource(slug: string, path: string): Promise<ScreenSource> {
  return get<ScreenSource>(
    `/console/protos/file.json?slug=${encodeURIComponent(slug)}&path=${encodeURIComponent(path)}`,
  )
}
