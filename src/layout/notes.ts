import { useSyncExternalStore } from "react"
import { FEEDBACK_KEY, IS_PAST_VERSION, MCP_URL, SLUG } from "./env"
import type { Target } from "./target"

/** The NOTES of a flow — the two things a viewer leaves on a screen, read by everyone who
 *  shows them (the Comments tab, the Feedback tab, the pins layer, the rail's counters).
 *
 *  Two kinds, and the difference is who they are for:
 *   • a COMMENT is addressed to the developers. It lives in the MCP repo under
 *     `comments/<slug>.json`, outside everything the agent can read: a comment is never
 *     an instruction. It can be edited, resolved, deleted — and it records the VERSION
 *     of the flow the PO was looking at, so it stays readable three publications later;
 *   • a FEEDBACK item is addressed to the system. It lives in the agent's queue
 *     (`context/flow-feedback/<slug>.md`), and the agent closes it (`— open` →
 *     `— handled`). The page only READS it back — to pin it, and to show where it
 *     stands.
 *
 *  One store, module-level, `useSyncExternalStore`: the pins are drawn while the panel
 *  is closed, the counters sit on the rail, the lists sit in two tabs — four readers of
 *  the same two arrays, which must never disagree on whether a comment exists. */

export type Comment = {
  id: string
  text: string
  author: string
  created_at: string
  updated_at: string | null
  screen: string
  route: string
  target: Target | null
  /** The `published_at` (or `updated_at` day) of the version the PO was looking at. */
  version: string
  status: "open" | "resolved"
}

export type FeedbackItem = {
  id: string
  when: string
  author: string
  status: "open" | "handled"
  screen: string
  handled: string
  target: Target | null
  text: string
}

export type Notes = {
  comments: Comment[]
  feedback: FeedbackItem[]
  loaded: boolean
  error: string
}

let state: Notes = { comments: [], feedback: [], loaded: false, error: "" }
const listeners = new Set<() => void>()

const set = (patch: Partial<Notes>) => {
  state = { ...state, ...patch }
  for (const l of listeners) l()
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useNotes = (): Notes => useSyncExternalStore(subscribe, () => state)

// Off on a past version: the notes are the LIVE flow's, and drawing its pins over
// yesterday's screens would put every one of them in the wrong place.
export const notesAvailable = Boolean(FEEDBACK_KEY && SLUG) && !IS_PAST_VERSION

const headers = { "Content-Type": "application/json", "X-Feedback-Key": FEEDBACK_KEY }

const detail = async (r: Response): Promise<string> => {
  try {
    return ((await r.json()) as { error?: string }).error ?? `HTTP ${r.status}`
  } catch {
    return `HTTP ${r.status}`
  }
}

const call = async <T>(route: string, body?: unknown): Promise<T> => {
  const r = await fetch(`${MCP_URL}${route}`, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!r.ok) throw new Error(await detail(r))
  return (await r.json()) as T
}

let refreshing: Promise<void> | null = null

/** Both lists, in parallel. One failing does not blank the other: a feedback file that
 *  does not exist yet must not hide the comments. */
export const refreshNotes = (): Promise<void> => {
  if (!notesAvailable) return Promise.resolve()
  if (refreshing) return refreshing
  refreshing = (async () => {
    const [c, f] = await Promise.allSettled([
      call<{ comments: Comment[] }>(`/comments/list.json?slug=${encodeURIComponent(SLUG)}`),
      call<{ items: FeedbackItem[] }>(`/feedback/list.json?slug=${encodeURIComponent(SLUG)}`),
    ])
    const errors: string[] = []
    const patch: Partial<Notes> = { loaded: true }
    if (c.status === "fulfilled") patch.comments = c.value.comments
    else errors.push(`comments: ${c.reason instanceof Error ? c.reason.message : String(c.reason)}`)
    if (f.status === "fulfilled") patch.feedback = f.value.items
    else errors.push(`feedback: ${f.reason instanceof Error ? f.reason.message : String(f.reason)}`)
    patch.error = errors.join(" · ")
    set(patch)
  })().finally(() => {
    refreshing = null
  })
  return refreshing
}

export const addComment = async (input: {
  text: string
  author: string
  screen: string
  route: string
  target: Target | null
  version: string
}): Promise<Comment> => {
  const { comment } = await call<{ comment: Comment }>("/comments/submit.json", {
    slug: SLUG,
    ...input,
  })
  set({ comments: [...state.comments, comment] })
  return comment
}

export const changeComment = async (
  id: string,
  change: { text?: string; status?: Comment["status"] },
  author: string,
): Promise<Comment> => {
  const { comment } = await call<{ comment: Comment }>("/comments/update.json", {
    slug: SLUG,
    id,
    author,
    ...change,
  })
  set({ comments: state.comments.map((c) => (c.id === id ? comment : c)) })
  return comment
}

export const deleteComment = async (id: string, author: string): Promise<void> => {
  await call<{ ok: true }>("/comments/delete.json", { slug: SLUG, id, author })
  set({ comments: state.comments.filter((c) => c.id !== id) })
}

// ---------------------------------------------------------------- the current version

/** What the build knows about this flow — `published_at` first (to the second, stamped
 *  by the MCP), the `updated_at` day for flows published before the stamp existed. It is
 *  the identity a comment records, so that "made on the version of 10:13" survives the
 *  next publication. Same origin, no key, fetched once. */
export type FlowMeta = {
  slug: string
  title?: string
  author?: string
  published_at?: string
  updated_at?: string
  created_at?: string
}

let metaPromise: Promise<FlowMeta> | null = null

export const flowMeta = (): Promise<FlowMeta> => {
  if (!metaPromise) {
    metaPromise = fetch("/protos.json")
      .then((r): Promise<FlowMeta[]> => (r.ok ? r.json() : Promise.resolve([])))
      .then((all) => all.find((p) => p.slug === SLUG) ?? { slug: SLUG })
      .catch(() => ({ slug: SLUG }))
  }
  return metaPromise
}

export const versionOf = (meta: FlowMeta): string => meta.published_at ?? meta.updated_at ?? ""

// ---------------------------------------------------------------- numbering

/** The number a pin shows, and the list repeats: creation order within the kind, across
 *  every version and every screen. Stable while nothing is deleted — and after a
 *  deletion the numbers shift, which is the price of numbers a human can read. */
export const numberOf = <T extends { id: string }>(items: T[], id: string): number =>
  items.findIndex((c) => c.id === id) + 1
