/** The MCP server client.
 *
 *  The console is a static site served by Railway; the MCP is another service. Its routes
 *  expose `Access-Control-Allow-Origin: *`, so calling it directly works — no proxy to
 *  write.
 *
 *  What the stored key IS changed on 2026-09-11. It used to be `DASHBOARD_KEY`, a SHARED
 *  secret that named nobody. It is now, for a person, their own `42ds_…` access token —
 *  the same one their MCP connector carries — and the server answers with WHO they are and
 *  which sections their role opens (`Me`). The shared key still works: it is the
 *  operator's, reads as admin, and is simply not what anyone is handed any more.
 */
import { readConsoleKey, writeConsoleKey } from "../../src/layout/env"

const BASE = (
  import.meta.env.VITE_MCP_URL ?? "https://mcp-42-production.up.railway.app"
).replace(/\/$/, "")

/** The stored token has ONE owner, `src/layout/env.ts` — the flows share the origin and
 *  the storage, and since 2026-09-11 the same write also sets the cookie the Sanctum
 *  server checks before serving a flow. Two writers would mean a console that signs in
 *  and flows that stay closed. */
export const readKey = readConsoleKey
export const writeKey = writeConsoleKey

export class AccessError extends Error {}

/** Signed in, but the section is not open to this role: the server answered 403 with a
 *  sentence naming the role it takes. Separate from `AccessError` because the two call
 *  for opposite gestures — a 401 means re-paste the token, a 403 means the token is right
 *  and re-pasting it changes nothing. */
export class RoleError extends Error {}

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

/** A capability the server has deliberately NOT mounted, because its variables are not
 *  set. Distinct from a plain failure: nothing is broken, something is unconfigured, and
 *  the two call for opposite reactions from whoever is reading. The server answers 503 for
 *  exactly this case and puts the reason in the body. */
export class NotConfigured extends Error {}

export async function get<T>(route: string): Promise<T> {
  const key = readKey()
  const r = await fetch(`${BASE}${route}`, { headers: key ? { "X-DS-Key": key } : {} })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) {
    // ⚠️ The server's own message, not the status code. Every `/console/*` route answers
    // `{error: "…"}` with a sentence that says what is missing and where to set it — and
    // this function used to throw all of it away and show "HTTP 503", which is how a
    // fail-closed capability whose whole point is to explain itself explains nothing.
    // `deleteFlow` already did it this way; `get` was the inconsistent one.
    let detail = ""
    try {
      detail = ((await r.json()) as { error?: string }).error ?? ""
    } catch {
      /* a non-JSON body (a proxy error page): the status is all there is */
    }
    const message = detail || `${route} → HTTP ${r.status}`
    if (r.status === 503) throw new NotConfigured(message)
    if (r.status === 403) throw new RoleError(message)
    throw new Error(message)
  }
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

/** One person × one client application, with the tool list their connector still carries.
 *  A host FREEZES the tool list when the connector is added: after a server update, a
 *  connector nobody refreshed keeps calling the old one. `version` is the number each
 *  connector echoes back through `start(version=…)` — the only thing the server knows
 *  about a cached list. Served by `metrics.connectors_payload`. */
export type Connector = {
  id: string
  name: string
  email: string
  role: string
  client: string
  calls: number
  sessions: number
  first: string
  last: string
  /** `null` = never echoed a number: the list predates the mechanism, or the model
   *  skipped the parameter. Nudged, never refused. */
  version: number | null
  versionAt: string
  state: "blocked" | "stale" | "unknown" | "current"
}

/** ONE breakage, not one occurrence of it — `metrics.failures_payload` groups by tool ×
 *  message and counts. `what` is the exception's type and message, redacted and truncated
 *  server-side; `arg` is the primary argument of the LAST occurrence, which is half of a
 *  reproduction. Served behind DASHBOARD_KEY only: a message names internal paths.
 *  The row keyed `_other` is the CAP admitting itself — occurrences the week could no
 *  longer hold apart. */
export type Failure = {
  key: string
  tool: string
  what: string
  count: number
  first?: string
  last?: string
  lastAt?: string
  arg?: string
  client?: string
}

export type Metrics = {
  meta?: { range?: string; updated?: string; period?: string }
  /** The tool-list version in force, what the connectors are compared against.
   *  `hidden` is set when the server has no DASHBOARD_KEY: the counts stay public, the
   *  people do not, and `people` comes back empty. `refreshHowto` is served by
   *  `surface.REFRESH_HOWTO` — the single owner of that sentence. */
  surface?: {
    served?: number
    minimum?: number
    toUpdate?: number
    refreshHowto?: string
    hidden?: string
  }
  people?: Connector[]
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
  /** What failed and what it SAID. `errorRate` says how much; this says what — and it
   *  is the only field of the two one can act on. Empty on a server with no
   *  DASHBOARD_KEY, where the counts stay public and the messages do not. */
  failures?: Failure[]
  failuresDistinct?: number
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

/** What generating the flows COST — `GET /console/generations.json`.
 *
 *  Written by the MCP at every publication (`generation.py`), read here and, for one flow
 *  at a time, by the flow's own review rail. Both read the SAME arithmetic, computed
 *  server-side: two implementations of "the average time per screen" put two different
 *  numbers in front of the same person.
 *
 *  ⚠️ Three kinds of number, and the tab must keep them apart: MEASURED (a run's wall
 *  clock and the time inside the model), ATTRIBUTED (`s` per file — one publication
 *  carries several screens, so their share is prorated on what was written), ESTIMATED
 *  (the tokens: characters through the server ÷ 4 — no model knows its own billed
 *  usage). */
export type GenerationFile = {
  path: string
  /** Attributed seconds, never measured. */
  seconds: number
  runs: number
  bytes: number
  lines: number
  created: string
  updated: string
  models: string[]
}

export type GenerationRun = {
  run: number
  at: string
  author?: string
  client?: string
  model?: string
  measured?: boolean
  wall_s?: number
  model_s?: number
  /** The trailing silence — the turn in which the screens were composed. Part of
   *  `model_s`; the rest of it is deciding and looking things up. */
  write_s?: number
  server_s?: number
  away_s?: number
  calls?: number
  in_chars?: number
  out_chars?: number
  /** Tool → characters served. Sums to `in_chars`; past the top consumers the tail is
   *  folded into one row rather than dropped. */
  context?: Record<string, number>
}

export type GenerationFlow = {
  slug: string
  title: string
  runs: number
  measured_runs: number
  screens: number
  files: number
  model_s: number
  write_s: number
  wall_s: number
  server_s: number
  away_s: number
  calls: number
  tokens_in: number
  tokens_out: number
  per_screen_s: number
  models: string[]
  context: Record<string, number>
  first: string
  last: string
  detail: GenerationFile[]
  runs_detail: GenerationRun[]
}

export type Generations = {
  overall: {
    flows: number
    runs: number
    screens: number
    model_s: number
    write_s: number
    per_screen_s: number
    per_flow_s: number
    tokens_in: number
    tokens_out: number
    calls: number
    models: string[]
    context: Record<string, number>
  }
  flows: GenerationFlow[]
  chars_per_token: number
}

/** One call inside a session's timeline. `err` carries what the exception said, on the
 *  events where `ok` is false — the same text the Failures panel groups. */
export type SessionEvent = {
  t: string
  tool: string
  arg?: string
  dur?: number
  gap?: number
  bytes?: number
  ok?: boolean
  miss?: boolean
  err?: string
}

export type Session = {
  id: string
  client: string
  events?: SessionEvent[]
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

/** Who the server recognised behind the stored key — served by `/console/summary.json`
 *  (the sign-in check) and `/console/access.json`. `sections` is the list the sidebar
 *  draws: the SERVER owns which role opens which section (`auth.CONSOLE_SECTIONS`) and
 *  enforces the same table on every route, so this is a mirror of it, never a decision
 *  taken here. */
export type Me = {
  id: string
  name: string
  role: string
  /** `key` — the operator's DASHBOARD_KEY, which names nobody; `token` — a person. */
  via: "key" | "token"
  sections: string[]
}

export type Summary = {
  skills?: number
  foundations?: number
  product?: number
  reports?: number
  components?: number
  /** Absent on a server from before 2026-09-11: the console then shows every section, as
   *  it always did. */
  me?: Me
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
  /** STABLE across reports — `kind:component:subject`, never derived from the title, so
   *  a reviewer's "ignore" lands on the same finding after the next sync. */
  id: string
  owner: "kit" | "figma" | "both"
  severity: "high" | "medium" | "low"
  kind: string
  component: string
  title: string
  detail: string
  evidence: string
  /** The reviewer said "not ours". Still served, so the tab can show it under "ignored"
   *  with a way back; left out of the brief and of every count. */
  ignored: boolean
  ignored_by?: string
  ignored_at?: string
  ignored_why?: string
  /** The reviewer ADDED it: something the browser measured on a rendered variant (a
   *  padding, a colour) that no catalogue carries. Kind `reviewed`. */
  flagged?: boolean
  flagged_by?: string
  flagged_at?: string
  /** Colour findings only (tokens): the class, the root-cause family, the tokens on this
   *  colour and the components that paint with it. */
  class?: "semantic" | "primitive"
  family?: string
  tokens?: string[]
  used_by?: string[]
  /** What settles this colour, in one line — written server-side, where the class and the
   *  nearest kit colour are both known. An owner says WHO; this says what they do. */
  action?: string
  /** Set when a HUMAN overruled the computed owner: what the report had derived, and who
   *  decided otherwise. `owner` already carries the decision. */
  owner_computed?: string
  assigned_by?: string
  assigned_at?: string
  /** The structured half of a FLAGGED finding (2026-09-11): the cause in one sentence,
   *  the locus in the code (file · axis.value · classes), the scope (local, or a shared
   *  token and its consumers), the question to settle, the proposed edit, and the kit
   *  version the browser measured. Absent on flags taken before them. */
  cause?: string
  locus?: string
  scope?: string
  question?: string
  proposed?: string
  measured?: string
}

/** What a source's findings have DONE over time: the ones that stopped being produced,
 *  most recent first. A finding that disappears is ambiguous — fixed, or no longer seen —
 *  and this is what lets a reviewer tell the difference and see their own progress. */
export type FindingHistory = {
  closed: {
    id: string
    title: string
    owner: string
    kind: string
    /** The day it was first produced, and the day it stopped. */
    first: string
    closed: string
  }[]
  closed_total: number
  /** How many ids of this source the history holds, open and closed. */
  tracked: number
  /** ⚠️ Set when NOTHING was closed although findings vanished: half of them going at
   *  once is a measurement that moved, not a review. Said, never silently recorded. */
  refused: string
  reopened: string[]
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
    /** ACTIVE findings — the ignored ones are not in this number, nor in `by_owner`. The
     *  card, the list and the brief show the same number; that was the first complaint. */
    findings: number
    ignored: number
    flagged: number
    by_owner: Record<string, number>
    described: number
  }
  /** Whether the reviewer's file can be written from here. `false` under READ_ONLY (no
   *  commit helper): the tab draws no button whose route would answer 503. */
  history?: FindingHistory
  review: {
    can_write: boolean
    path: string
    ignored: number
    flagged: number
    /** Every ignored id, findings or not — a surface line the page measures itself is
     *  not a finding until flagged, so its "ignored" state travels here. */
    ignored_ids: string[]
    flagged_ids: string[]
    /** Findings whose owner a human decided, against the computed one. */
    assigned_ids: string[]
  }
  sources: {
    /** `frames` is a boolean, not a string: it says whether the server can RENDER a
     *  component (FIGMA_TOKEN set). Without it the tab must not draw forty image slots
     *  whose fetches cannot even complete a preflight. */
    figma: Record<string, string> & { frames?: boolean; can_sync?: boolean }
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
      /** The kit commit the snapshot was generated from (`kit_commit` in the manifest). */
      commit?: string
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

/** One axis of the coverage grid: what Figma DRAWS on it against what the kit RENDERS.
 *  `readable` false means the manifest cannot see the kit's values (a cva outside the
 *  component file, a type alias) — the grid then marks the axis rather than claiming
 *  the kit is missing anything. */
export type CoverageAxis = {
  axis: string
  /** The KIND of axis (`surface`, `palette`, `scale`, `content`, `state-controlled`…) —
   *  what lets the grid open on `variant × color` rather than on a sample axis. */
  nature: string
  react: string
  register: string
  readable: boolean
  figma: string[]
  kit: string[]
  only_figma: string[]
  only_kit: string[]
}

/** Every drawn combination, decoded. `variant` is the Figma key-variant slug — the string
 *  `/console/parity/frame.json?variant=` takes, so a cell can render its own exact frame. */
export type CoverageCombo = { variant: string; values: Record<string, string> }

export type Coverage = {
  axes: CoverageAxis[]
  combinations: CoverageCombo[]
  drawn: number
  /** Key-variant slugs the server could not decode. Said out loud: they are combinations
   *  missing from the grid, so the count is short by that many. */
  unparsed: string[]
}

/** A painted value as Figma declares it: the TOKEN it is bound to, and the hex that token
 *  resolves to. Both are kept — the token is what the two systems can genuinely share, the
 *  hex is what a browser's computed style will hand back to compare against. */
export type Paint = {
  token: string
  /** The value at the collection's DEFAULT mode — Dark, on this DS. */
  hex: string
  /** The value per mode (`dark`, `light`) when the export carries `values_by_mode`;
   *  absent for a single-mode token, which paints the same everywhere. */
  modes?: Record<string, string>
}

/** The SURFACE one drawn variant paints. Added by the Figma plugin on 2026-09-10: before
 *  it, only the default variant carried any of this — 9 components out of 56 had a fill. */
export type VariantVisual = {
  fill?: Paint
  stroke?: { color: Paint; width: number; align?: string }
  radius?: number | string | Record<string, number>
  padding?: Record<string, number>
  gap?: number
  /** The root's own height, exported only when Figma FIXES it (plugin ≥ 2026-09-11). A
   *  root that hugs its content has none, and the console derives it from the padding
   *  and the line height as before. */
  height?: number
  opacity?: number
  text?: { fill?: Paint; size?: number; weight?: string; lineHeight?: number }
}

export type ParityDetail = {
  slug: string
  description: string
  key_variants: Record<string, string>
  default_node: string
  axes: Record<string, string[] | string>
  defaults: Record<string, string>
  coverage: Coverage
  /** `exported` false means the Figma file has not been re-synced since the plugin learned
   *  to write per-variant visuals. Empty because nothing was exported, never because the
   *  component paints nothing — two opposite statements. */
  visuals: {
    exported: boolean
    variants: Record<string, VariantVisual>
    /** The modes the export carries (`["dark", "light"]`), empty before the plugin wrote
     *  `values_by_mode`. A light render is compared only when `light` is in here. */
    modes: string[]
  }
  react: {
    props: Record<string, { type: unknown; required?: boolean; description?: string; default?: string }>
    variants: Record<string, string[]>
    defaultVariants: Record<string, string>
    exports: string[]
    extends: string[]
    import: string
    snippet: string
    docs: string
    /** The LOCUS side (2026-09-11): the file, the classes behind every axis value, the
     *  comment above an axis, the CSS variables the cva reaches for and who else reads
     *  them, and the kit's own scales (px) so a proposed class can be named. Empty on a
     *  manifest generated before these keys. */
    file?: string
    classes?: Record<string, Record<string, string>>
    notes?: Record<string, string>
    tokens?: string[]
    tokenConsumers?: Record<string, string[]>
    scales?: { radius: Record<string, number>; text: Record<string, number>; spacing: number }
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
 *  dev works: the list has to be able to leave with them — as one owner's whole list, or
 *  as one component's. Ignored findings are left out and said to be. */
export async function getParityBrief(
  filter: { owner?: "kit" | "figma" | "both"; component?: string; prompt?: boolean } = {},
): Promise<string> {
  const key = readKey()
  const q = new URLSearchParams()
  if (filter.owner) q.set("owner", filter.owner)
  if (filter.component) q.set("component", filter.component)
  // `prompt`: the same list with a preamble saying where and how to apply it, so it can
  // be handed to an agent as a task rather than read as a report.
  if (filter.prompt) q.set("prompt", "1")
  const qs = q.toString()
  const r = await fetch(`${BASE}/console/parity/brief.md${qs ? `?${qs}` : ""}`, {
    headers: key ? { "X-DS-Key": key } : {},
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) throw new Error(`brief.md → HTTP ${r.status}`)
  return r.text()
}

/** The same brief as DATA — `brief.json`: one issue per decision with `authority`,
 *  `locus`, `scope`, `proposed`, `question`, `verify`. What an agent is handed; the
 *  markdown is a view of it. Returned pretty-printed, ready for a clipboard. */
/** ONE measured difference the console posts to the server — a line of `compareSurface`
 *  that was not the same and not skipped (the sub-perceptual ones go too: the server
 *  applies the threshold itself and reports how many it dropped). */
export type MeasuredLine = {
  variant: string
  key: string
  what: string
  figma: string
  react: string
  close: boolean
}

/** A measured difference attributed by the SERVER to the cva branch that produced it —
 *  the unit of a correction (C4, 2026-09-11). Everything an edit tool or a reviewer needs
 *  is here: the exact anchors, the classes concerned, the scope by consumers, the kit's own
 *  comment, the candidate edit (exposed as `proposed` only once declared for the kit), and
 *  a `verify` one edit can satisfy. */
export type BranchBlock = {
  id: string
  component: string
  slug: string
  cva: { axis: string; value: string }
  title: string
  cause: string
  question: string
  verify: string
  locus: { file: string; axis: string; value: string; anchors: string[]; relevant: string[] }
  locus_text: string
  source_comment: string
  scope: { kind: "shared" | "local"; tokens: string[]; consumers: string[]; count: number }
  scope_text: string
  candidates: string[]
  measured: string
  measured_in: { browser_mode: string; figma_mode: string }
  summary: { prop: string; what: string; figma: string; react: string; count: number; hues: string[] }[]
  evidence: { variant: string; prop: string; what: string; figma: string; react: string; hue: string }[]
  evidence_lines: string[]
  props: string[]
  hues: string[]
  variants: string[]
  settle: boolean
}

export type BranchResult = {
  component: string
  slug: string
  measured: string
  theme: string
  measured_in: { browser_mode: string; figma_mode: string }
  blocks: BranchBlock[]
  sub_perceptual: number
  refused: number
  unknown_variants: number
  compared: number
  at?: string
}

/** Posts what this browser measured on one component; the server attributes, groups and
 *  answers with the blocks. Memory only on its side — a restart loses the blocks, never a
 *  flag (a flag copies the block's fields into the review file). */
export async function postParityMeasurements(payload: {
  component: string
  slug: string
  measured: string
  theme: string
  modes: string[]
  compared: number
  present: Record<string, number>
  lines: MeasuredLine[]
}): Promise<BranchResult> {
  const key = readKey()
  const r = await fetch(`${BASE}/console/parity/measurements.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(key ? { "X-DS-Key": key } : {}) },
    body: JSON.stringify(payload),
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (r.status === 404) throw new Error("this server has no measurements route yet (deploy mcp-42)")
  if (!r.ok) {
    let detail = `measurements.json → HTTP ${r.status}`
    try {
      detail = ((await r.json()) as { error?: string }).error ?? detail
    } catch {
      /* the status is enough */
    }
    throw new Error(detail)
  }
  return (await r.json()) as BranchResult
}

export async function getParityBriefJson(
  filter: { owner?: "kit" | "figma" | "both"; component?: string } = {},
): Promise<string> {
  const key = readKey()
  const q = new URLSearchParams()
  if (filter.owner) q.set("owner", filter.owner)
  if (filter.component) q.set("component", filter.component)
  const qs = q.toString()
  const r = await fetch(`${BASE}/console/parity/brief.json${qs ? `?${qs}` : ""}`, {
    headers: key ? { "X-DS-Key": key } : {},
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) throw new Error(`brief.json → HTTP ${r.status}`)
  return JSON.stringify(await r.json(), null, 2)
}

/** ONE decision of the reviewer, committed to `analysis/parity-review.json` by the MCP
 *  server (the same commit helper as the component sync, so READ_ONLY darkens both).
 *
 *   `ignore`  — the finding leaves the brief and the counts; `why` is what the next
 *               reader sees in its place;
 *   `restore` — the reverse;
 *   `flag`    — a difference THIS BROWSER measured on a rendered variant is handed to the
 *               dev as a finding of its own. The server cannot measure a padding; the
 *               human who saw it can say it counts;
 *   `unflag`  — the reverse.
 *
 *  Signed: `by` is the name `who.ts` holds, and the server refuses an unsigned change —
 *  a decision nobody can go back and question is not worth committing. */
export type ReviewChange = {
  op: "ignore" | "restore" | "flag" | "unflag" | "assign" | "unassign"
  id: string
  by: string
  why?: string
  title?: string
  detail?: string
  evidence?: string
  component?: string
  owner?: "kit" | "figma" | "both"
  /** A flag's structured half (2026-09-11) — what makes the brief an issue an agent can
   *  act on, or stop on: `cause`, `locus`, `scope`, `question`, `proposed`, `measured`. */
  cause?: string
  locus?: string
  scope?: string
  question?: string
  proposed?: string
  measured?: string
}

export async function reviewParity(change: ReviewChange): Promise<{ commit: string }> {
  return reviewPost(change)
}

/** SEVERAL decisions in ONE commit — the console checks the rows and validates them
 *  together (2026-09-11: every click used to be a GitHub round-trip, felt as a stutter
 *  and left forty commits behind one session). Same route, same rules per decision;
 *  ATOMIC: one bad decision refuses the whole batch and nothing lands. `by` signs them
 *  all. */
export async function reviewParityBatch(
  changes: Omit<ReviewChange, "by">[],
  by: string,
): Promise<{ commit: string }> {
  return reviewPost({ by, changes })
}

async function reviewPost(body: unknown): Promise<{ commit: string }> {
  const key = readKey()
  const r = await fetch(`${BASE}/console/parity/review.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(key ? { "X-DS-Key": key } : {}) },
    body: JSON.stringify(body),
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) {
    let detail = `review.json → HTTP ${r.status}`
    try {
      detail = ((await r.json()) as { error?: string }).error ?? detail
    } catch {
      /* non-JSON body: the status is enough */
    }
    throw r.status === 503 ? new NotConfigured(detail) : new Error(detail)
  }
  return (await r.json()) as { commit: string }
}

// ---------------------------------------------------------------- foundations (tokens)

/** One token, both sides. `verdict` mirrors the components tab's vocabulary so a reader
 *  moving between the two tabs does not have to learn a second one. */
export type TokenRow = {
  token: string
  figma: string | null
  kit: string | null
  verdict: "aligned" | "differs" | "figma-only" | "kit-only" | "unreadable"
  note: string
  figma_px?: number
  kit_px?: number
}

export type TokenFamily = {
  key: string
  label: string
  kind: "length" | "text"
  what: string
  rows: TokenRow[]
  counts: { total: number; aligned: number; differs: number; figma_only: number; kit_only: number }
}

/** A Figma colour token and where it lands in the kit's palette. `in_palette` is empty
 *  when the colour it resolves to exists in no `--color-*`: nothing the kit ships can
 *  reproduce it. */
export type ColorRow = {
  token: string
  default: string
  alpha: number | null
  in_palette: string[]
  modes: Record<string, string>
  mode_hits: Record<string, string[]>
  /** `semantic` (a role a component binds to — blocking when unresolved) or `primitive`
   *  (a palette step nothing binds to on its own — informative). */
  kind: "semantic" | "primitive"
  /** The hue behind the role: `bg-error-primary` → `error`, `utility-blue-dark-50` →
   *  `utility-blue-dark`. The ROOT CAUSE the brief groups by. */
  family: string
  /** The components that paint with this token, read off the exported surfaces. */
  used_by: string[]
}


/** The off-palette colours folded to their root causes, ordered blocking first and by
 *  usage inside. What the brief is written from. */
export type ColorGroup = {
  kind: "semantic" | "primitive"
  family: string
  tokens: string[]
  colors: string[]
  used_by: string[]
}

export type TokensReport = {
  families: TokenFamily[]
  colors: {
    /** ⚠️ False means the export predates the plugin's 2026-09-09 fix: only the
     *  collection's DEFAULT mode is in the file, and here that default is Dark. The tab
     *  must say so rather than show one mode as if it were both. */
    modes_exported: boolean
    /** Every mode name in the export, across collections. */
    modes: string[]
    /** ⚠️ Modes belong to a COLLECTION, and the union of two collections is a switch that
     *  means nothing: this file has `Dark/Light` on every colour and `brand/gray/pink` on
     *  ONE token. A set is the modes a token carries together; the first covers the most
     *  tokens and is the one to offer. */
    mode_sets: { modes: string[]; tokens: number }[]
    /** The mode every OTHER number in this report is resolved at — `ds-fondations.yaml`
     *  resolves at the collection's default and never says which. Recovered by agreement:
     *  the mode whose value equals the resolved one for the most tokens. */
    default_mode: string
    rows: ColorRow[]
    palette_size: number
    reference_size: number
    unbound: string[]
    off_palette_colors: Record<string, string[]>
    /** Per colour the kit does NOT carry, the one it comes closest with and how far it is
     *  (0-100, black against white being 100). The difference between "re-bind this token"
     *  and "the kit has no such hue". Absent for a colour the palette carries. */
    nearest: Record<string, { name: string; hex: string; distance: number }>
    off_palette_groups: ColorGroup[]
    /** The off-palette colours the reviewer ignored (`color-off-palette:foundations:<rgb>`). */
    ignored_colors: string[]
    counts: { tokens: number; in_palette: number; off_palette: number; with_alpha: number }
  }
  spacing: {
    figma_steps: Record<string, string>
    kit_declares: string[]
    off_grid: string[]
  }
  /** What is NOT compared, one sentence each with its consequence — read FIRST. */
  scope: string[]
  findings: ParityFinding[]
  counts: {
    families: number
    tokens: number
    differs: number
    /** ACTIVE findings — ignored ones are not in this number, nor in `by_owner`. */
    findings: number
    ignored: number
    flagged: number
    by_owner: Record<string, number>
  }
  /** Same file and same semantics as the components' review. */
  history?: FindingHistory
  review: {
    can_write: boolean
    path: string
    ignored_ids: string[]
    flagged_ids: string[]
    assigned_ids: string[]
  }
  sources: {
    figma: Record<string, string>
    /** ⚠️ `snapshot` means the kit was NOT read from its own repo: the comparison ran
     *  against `ui-tokens.json`, regenerated by hand. Right answer, older date — and the
     *  tab has to say so, because a stale comparison looks exactly like a fresh one. */
    kit: {
      mode: "live" | "snapshot"
      repo: string
      branch: string
      sources: string[]
      package?: string
      version?: string
      generated_at?: string
      kit_commit?: string
      error?: string
      note?: string
    }
  }
  generated_at: string
}

/** ⚠️ Unlike the components comparison, this one has NO snapshot fallback: the kit's CSS
 *  is in no committed file, so without KIT_REPO the server answers 503 with the reason. */
export async function getTokens(fresh = false): Promise<TokensReport> {
  return get<TokensReport>(`/console/tokens.json${fresh ? "?fresh=1" : ""}`)
}

export async function getTokensBrief(
  filter: { owner?: "kit" | "figma" | "both"; prompt?: boolean } = {},
): Promise<string> {
  const key = readKey()
  const q = new URLSearchParams()
  if (filter.owner) q.set("owner", filter.owner)
  if (filter.prompt) q.set("prompt", "1")
  const qs = q.toString()
  const r = await fetch(`${BASE}/console/tokens/brief.md${qs ? `?${qs}` : ""}`, {
    headers: key ? { "X-DS-Key": key } : {},
  })
  if (r.status === 401) throw new AccessError("Key rejected by the server.")
  if (!r.ok) throw new Error((await r.text()) || `tokens/brief.md → HTTP ${r.status}`)
  return r.text()
}

/* ⚠️ The component sync used to live here — `syncComponents()`, POST /console/parity/sync.json,
 * which read the Figma API and committed the catalogue. Removed from the console on
 * 2026-09-10 with the button that called it: it was a SECOND producer of
 * `context/components/**` and of the index, next to the Figma plugin that owns them, and by
 * then it no longer wrote the surfaces at all — so pressing it left the export half fresh,
 * catalogue new and surfaces stale. The Figma → repo sync is the plugin's, whole and in one
 * gesture. The ROUTE is still mounted server-side and still reachable with the console key;
 * removing it is a separate decision, and a deliberate one, since nothing in this app calls
 * it any more. */
