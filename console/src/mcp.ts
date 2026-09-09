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

/** The administration key was refused (or never typed). Separate from `AccessError`: the
 *  console holds TWO keys and telling the person to re-type the wrong one is the fastest
 *  way to make them think the server is broken. */
export class AdminKeyError extends Error {}

/** The access administration key — `ACCESS_ADMIN_KEY` on the MCP service. It is NOT the
 *  console key: this one opens the registry, i.e. it can mint a token that writes into the
 *  DS repo. Kept apart in storage for the same reason it is kept apart on the server. */
const ADMIN_KEY = "42ds.console.access-key"

export const readAdminKey = (): string => {
  try {
    return localStorage.getItem(ADMIN_KEY) ?? ""
  } catch {
    return ""
  }
}

export const writeAdminKey = (v: string): void => {
  try {
    v ? localStorage.setItem(ADMIN_KEY, v) : localStorage.removeItem(ADMIN_KEY)
  } catch {
    /* without storage the key lives for the session — everything else still works */
  }
}

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

/** What the server is wired to — `GET /console/config.json`, served by `config_report.py`.
 *  A secret NEVER carries a `value`: the module reports set/unset and nothing else. */
export type ConfigVar = {
  name: string
  /** Other legal names for the same variable (FEEDBACK_KEY ← RETOURS_KEY). */
  aliases: string[]
  /** Which of those names actually carries the value. Empty when none does. */
  via: string
  set: boolean
  secret: boolean
  /** Required by its capability, or merely a refinement. This is what the panel colours
   *  on: an empty OPTIONAL variable is the normal state of a healthy server. */
  required: boolean
  /** What the code falls back on when the variable is empty. */
  default: string
  /** Only on non-secret variables. Reading it is the point (a stale UI_REPO, a wrong branch). */
  value?: string
  /** A variable that lives on the OTHER Railway service — a reminder, never a verdict. */
  twin?: string
}

export type ConfigCapability = {
  key: string
  label: string
  what: string
  state: "on" | "off" | "blocked"
  required: boolean
  optional: boolean
  missing: string[]
  /** Set when everything is configured but a mode (READ_ONLY) is closing it. */
  blocked_by: string
  vars: ConfigVar[]
  refines: ConfigVar[]
}

export type ConfigMode = {
  key: string
  label: string
  name: string
  on: boolean
  value: string
  detail: string
  warn: string
}

export type Config = {
  broken: string[]
  off: string[]
  capabilities: ConfigCapability[]
  modes: ConfigMode[]
  note: string
  /** Verdict on the admin key THIS browser presented. Booleans only — the server never
   *  echoes a key back. `configured` says the server has one at all. */
  admin_key: { configured: boolean; sent: boolean; ok: boolean }
}

/** The configuration, asked for WITH the administration key when the browser holds one —
 *  that is what makes the answer carry a verdict on it. The generic `get` only sends the
 *  console key, and a second header on every route would hand that key to routes that have
 *  no business seeing it. */
export async function getConfig(): Promise<Config> {
  const key = readKey()
  const admin = readAdminKey()
  const headers: Record<string, string> = {}
  if (key) headers["X-DS-Key"] = key
  if (admin) headers["X-Access-Key"] = admin
  const r = await fetch(`${BASE}/console/config.json`, { headers })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) throw new Error(`/console/config.json → HTTP ${r.status}`)
  return (await r.json()) as Config
}

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
  /** The server serves an administration route (ACCESS_ADMIN_KEY set, writing open). */
  can_edit?: boolean
  /** …and can derive a person's token (ACCESS_SECRET set). */
  can_reveal?: boolean
  error?: string
}

export type AccessUser = Access["users"][number]

export type AccessOp = "create" | "update" | "delete" | "token"

export type AccessChange = {
  ok: true
  op?: AccessOp
  id?: string
  /** The commit message — what git will show. Displayed back so the person sees the
   *  trace their click left. */
  message?: string
  commit?: string
  /** The registry AS COMMITTED: the tab replaces its state with it instead of re-reading. */
  users?: Access["users"]
  /** Only on a creation, and on `op: "token"`. Never stored, never logged. */
  token?: string
}

/** Opening an access, changing a role, revoking, removing — and reading back a token.
 *
 *  TWO keys travel: the console key (which opens every other route) and the administration
 *  key. The server refuses them separately (401 / 403), and so do we: it is the only way
 *  the tab can ask for the right one. */
export async function accessAction(
  op: AccessOp,
  payload: {
    id: string
    name?: string
    email?: string
    role?: string
    active?: boolean
    /** Goes into the commit message: these commits are no longer only hand-made pushes. */
    by?: string
  },
): Promise<AccessChange> {
  const key = readKey()
  const admin = readAdminKey()
  if (!admin) throw new AdminKeyError("The access administration key is missing.")
  const r = await fetch(`${BASE}/console/access/user.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "X-DS-Key": key } : {}),
      "X-Access-Key": admin,
    },
    body: JSON.stringify({ op, ...payload }),
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (r.status === 403) throw new AdminKeyError("Administration key refused by the server.")
  if (r.status === 404 && op !== "token")
    throw new Error("The server does not serve access administration (ACCESS_ADMIN_KEY unset).")
  if (!r.ok) {
    let detail = `HTTP ${r.status}`
    try {
      detail = ((await r.json()) as { error?: string }).error ?? detail
    } catch {
      /* non-JSON body: the status is enough */
    }
    throw new Error(detail)
  }
  return (await r.json()) as AccessChange
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

// ---------------------------------------------------------------- parity (Figma ↔ code)

/** One axis, both sides. `verdict` is the whole point of the tab and it is computed
 *  server-side (`parity.py`), because it encodes the four documented model divergences:
 *
 *   `aligned`    same axis, same values — the bulk of a healthy component;
 *   `values`     same axis, different values (`missing_in_kit` / `missing_in_figma`);
 *   `by-design`  a divergence the two models OWE each other — an interaction state, a
 *                slot, the palette living in `color`, a label owned by `Field`;
 *   `composed`   no prop of its own: in React the region is children. A question, not a hole;
 *   `unreadable` the MANIFEST cannot see it (a cva outside the file, a type alias). Never
 *                stated as an absence in the kit — that accusation was wrong twice;
 *   `code-only`  the kit has the axis, Figma draws nothing for it;
 *   `unpaired`   it lands nowhere. The only verdict that is a plain hole. */
export type ParityAxis = {
  axis: string
  nature: string
  verdict: "aligned" | "values" | "by-design" | "composed" | "unreadable" | "code-only" | "unpaired"
  register: string
  figma: string[]
  figma_default: string
  react: string
  react_values: string[]
  react_default: string
  note: string
  missing_in_kit?: string[]
  missing_in_figma?: string[]
  standard_scale?: boolean
}

export type ParityFigma = {
  slug: string
  page: string
  node: string
  key: string
  type: string
  axes: Record<string, string[] | string>
  defaults: Record<string, string>
  default_node: string
  variant_count: number
  described: boolean
  detail: boolean
  internal: boolean
  acknowledged?: boolean
}

export type ParityPair = {
  react: string
  slug: string
  category: string
  summary: string
  docs: string
  import: string
  snippet: string
  figma: ParityFigma
  others: ParityFigma[]
  axes: ParityAxis[]
  react_defaults: Record<string, string>
  react_props: string[]
}

/** Every finding names an OWNER — that is the difference between an audit and a tool.
 *  `kit` the code moves, `figma` the file moves, `both` nobody can settle it alone. */
export type ParityFinding = {
  owner: "kit" | "figma" | "both"
  severity: "high" | "medium" | "low"
  kind: string
  component: string
  title: string
  detail: string
  evidence: string
}

export type ParityReport = {
  pairs: ParityPair[]
  figma_only: ParityFigma[]
  react_only: Array<{
    react: string
    slug: string
    category: string
    summary: string
    snippet: string
    /** False for what is never DRAWN — a Flex, a ThemeScript. Not a hole in the file. */
    drawn: boolean
  }>
  findings: ParityFinding[]
  counts: {
    pairs: number
    figma_only: number
    react_only: number
    react_only_expected: number
    figma_components: number
    react_components: number
    findings: number
    by_owner: Record<string, number>
    described: number
  }
  sources: {
    /** `frames` is a boolean, not a string: it says whether the server can RENDER a
     *  component (FIGMA_TOKEN set). Without it the tab must not draw forty image slots
     *  whose fetches cannot even complete a preflight. */
    figma: Record<string, string> & { frames?: boolean }
    react: {
      /** ⚠️ `snapshot` means the kit was NOT read live: the comparison is against a
       *  hand-regenerated `ui-manifest.json`. The tab says so rather than looking fresh. */
      mode: "live" | "snapshot"
      package: string
      version: string
      origin: string
      generated_at?: string
      note?: string
      error?: string
      snapshot_version?: string
      snapshot_generated_at?: string
      snapshot_stale?: string[]
    }
  }
  generated_at: string
}

/** The whole comparison. Cached server-side for ten minutes — it reads fifty item files
 *  and, when the kit scan is wired, a hundred blobs of the kit. `fresh` is the Rescan
 *  button: the only thing that drops that cache. */
export async function getParity(fresh = false): Promise<ParityReport> {
  return get<ParityReport>(`/console/parity.json${fresh ? "?fresh=1" : ""}`)
}

export type ParityDetail = {
  slug: string
  description: string
  key_variants: Record<string, string>
  default_node: string
  axes: Record<string, string[] | string>
  defaults: Record<string, string>
  react: {
    props: Record<string, { type: unknown; required?: boolean; description?: string; default?: string }>
    variants: Record<string, string[]>
    defaultVariants: Record<string, string>
    exports: string[]
    extends: string[]
    import: string
    snippet: string
    docs: string
  } | null
}

/** One component in full — the Figma description, its named variants, the React props with
 *  their JSDoc. Deliberately not in the table above: `buttonsbutton-` alone declares 300
 *  named variants, and forty components' worth of those is a megabyte nobody scrolls. */
export async function getParityDetail(slug: string, react: string): Promise<ParityDetail> {
  return get<ParityDetail>(
    `/console/parity/component.json?slug=${encodeURIComponent(slug)}&react=${encodeURIComponent(react)}`,
  )
}

/** The Figma-rendered PNG of one component — Figma's own CDN URL, so the image never
 *  crosses the MCP server. The client names a SLUG and, optionally, one of that
 *  component's declared variants: never a file key and never a node. That bound is what
 *  keeps a token which can read every file of its owner from being a render proxy. */
export async function getParityFrame(
  slug: string,
  variant = "",
): Promise<{ slug: string; variant: string; node: string; url: string }> {
  const v = variant ? `&variant=${encodeURIComponent(variant)}` : ""
  return get(`/console/parity/frame.json?slug=${encodeURIComponent(slug)}${v}`)
}

/** The findings as markdown, to paste into a ticket. The console is not where a front-end
 *  dev works: the list has to be able to leave with them. */
export async function getParityBrief(): Promise<string> {
  const key = readKey()
  const r = await fetch(`${BASE}/console/parity/brief.md`, {
    headers: key ? { "X-DS-Key": key } : {},
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) throw new Error(`brief.md → HTTP ${r.status}`)
  return r.text()
}
