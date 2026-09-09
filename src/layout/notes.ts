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
 *  Both are THREADS since 2026-09-09: a note carries the answers made to it. A pin on a
 *  screen is a place where a conversation happens, and three pins on the same button —
 *  the remark, the objection, the decision — was the shape the flat list forced. Where
 *  the answers live differs, and the difference is the same one as above: a reply to a
 *  comment goes to `comments/`, a reply to a feedback item goes to the agent's QUEUE, as
 *  its own appended section. Reactions exist on comments only — an emoji is a thing one
 *  says to a person.
 *
 *  One store, module-level, `useSyncExternalStore`: the pins are drawn while the panel
 *  is closed, the counters sit on the rail, the lists sit in two tabs, the threads open
 *  on the screen — five readers of the same two arrays, which must never disagree on
 *  whether a comment exists. */

/** One message in a thread: a reply. Thinner than its root on purpose — it has no
 *  target, no version and no status of its own, it inherits the thread's. */
export type Reply = {
  id: string
  text: string
  author: string
  created_at: string
  updated_at: string | null
}

/** Who holds which mark, by emoji. Only the palette below ever appears here. */
export type Reactions = Record<string, string[]>

/** ⚠️ The SAME five as `comments_api.REACTIONS`, in the same order. A closed palette,
 *  because a free emoji field is a second free-text field; the server refuses anything
 *  else, so a sixth added here would only produce a 400. */
export const REACTIONS = ["\u{1F44D}", "\u2705", "\u{1F440}", "\u2764\uFE0F", "\u{1F389}"] as const

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
  replies: Reply[]
  reactions: Reactions
}

/** An answer to a feedback item. It lives in the AGENT's queue, as its own section of
 *  `context/flow-feedback/<slug>.md` — which is why it has no id and cannot be edited:
 *  the page's only power over that file is to append to it. */
export type FeedbackReply = { when: string; author: string; text: string }

export type FeedbackItem = {
  id: string
  when: string
  author: string
  status: "open" | "handled"
  screen: string
  handled: string
  target: Target | null
  text: string
  replies: FeedbackReply[]
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

/** ⚠️ The two repos do NOT deploy together: a `publish_proto` rebuilds this flow on the
 *  running Sanctum site in seconds, while a change to the MCP server waits minutes for
 *  its own redeploy. So a page carrying threads can very well be talking to a server
 *  that has never heard of them. Filling the fields here — rather than testing for them
 *  in each of the five readers — is what makes that window uneventful. */
const thread = <T extends { replies?: unknown; reactions?: unknown }>(note: T) => ({
  ...note,
  replies: Array.isArray(note.replies) ? note.replies : [],
  reactions: note.reactions && typeof note.reactions === "object" ? note.reactions : {},
})

let refreshing: Promise<void> | null = null

/** Both lists, in parallel. One failing does not blank the other: a feedback file that
 *  does not exist yet must not hide the comments. */
export const refreshNotes = (force = false): Promise<void> => {
  if (!notesAvailable) return Promise.resolve()
  // A caller that has just written needs a read that STARTS after its write: handing it
  // the in-flight promise would answer it with the state predating its own deposit.
  if (refreshing && !force) return refreshing
  if (refreshing && force) return refreshing.then(() => refreshNotes(true))
  refreshing = (async () => {
    const [c, f] = await Promise.allSettled([
      call<{ comments: Comment[] }>(`/comments/list.json?slug=${encodeURIComponent(SLUG)}`),
      call<{ items: FeedbackItem[] }>(`/feedback/list.json?slug=${encodeURIComponent(SLUG)}`),
    ])
    const errors: string[] = []
    const patch: Partial<Notes> = { loaded: true }
    if (c.status === "fulfilled") patch.comments = c.value.comments.map(thread)
    else errors.push(`comments: ${c.reason instanceof Error ? c.reason.message : String(c.reason)}`)
    if (f.status === "fulfilled") patch.feedback = f.value.items.map(thread)
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
  const posted = thread(comment)
  set({ comments: [...state.comments, posted] })
  return posted
}

/** A reply, through the SAME route as a comment: the deposit is the same gesture, only
 *  `parent` says where the text lands. The server answers with the whole thread, which
 *  is what the store replaces — a reply appended locally would be a second truth. */
export const addReply = async (parent: string, text: string, author: string): Promise<Comment> => {
  const { comment } = await call<{ comment: Comment }>("/comments/submit.json", {
    slug: SLUG,
    parent,
    text,
    author,
  })
  const answered = thread(comment)
  set({ comments: state.comments.map((c) => (c.id === parent ? answered : c)) })
  return answered
}

/** Edits the root, flips the status, or toggles a reaction — one route, and the answer
 *  is always the whole thread. `reply` aims the `text` at one message of it. */
export const changeComment = async (
  id: string,
  change: { text?: string; status?: Comment["status"]; reaction?: string; reply?: string },
  author: string,
): Promise<Comment> => {
  const { comment } = await call<{ comment: Comment }>("/comments/update.json", {
    slug: SLUG,
    id,
    author,
    ...change,
  })
  const updated = thread(comment)
  set({ comments: state.comments.map((c) => (c.id === id ? updated : c)) })
  return updated
}

/** One emoji, one name, both directions: the server adds or removes depending on
 *  whether that name was already there. The palette is `REACTIONS` and nothing else. */
export const toggleReaction = (id: string, emoji: string, author: string): Promise<Comment> =>
  changeComment(id, { reaction: emoji }, author)

/** Deletes the whole thread, or — with `reply` — one message of it. */
export const deleteComment = async (
  id: string,
  author: string,
  reply?: string,
): Promise<void> => {
  const answer = await call<{ ok: true; comment?: Comment }>("/comments/delete.json", {
    slug: SLUG,
    id,
    author,
    ...(reply ? { reply } : {}),
  })
  if (reply && answer.comment) {
    const updated = thread(answer.comment)
    set({ comments: state.comments.map((c) => (c.id === id ? updated : c)) })
    return
  }
  set({ comments: state.comments.filter((c) => c.id !== id) })
}

/** Correcting an item, or withdrawing one — including one answer to it (`reply` is its
 *  rank, 1 for the first). Both rewrite ONE section of the agent's queue: the server
 *  keeps the title, so a status is never changed this way, and it hands back the file's
 *  items, which is what the store takes.
 *
 *  ⚠️ The ids are POSITIONAL (`f3` is the third item): a deletion renumbers what follows,
 *  server-side and in the same commit. Which is why the answer replaces the whole list
 *  rather than being merged into it — half of it may have moved. */
const changeFeedback = async (route: string, body: Record<string, unknown>): Promise<void> => {
  const { items } = await call<{ items: FeedbackItem[] }>(route, { slug: SLUG, ...body })
  set({ feedback: items.map(thread) })
}

export const editFeedback = (
  id: string,
  text: string,
  author: string,
  reply = 0,
): Promise<void> => changeFeedback("/feedback/update.json", { id, text, author, reply })

export const removeFeedback = (id: string, author: string, reply = 0): Promise<void> =>
  changeFeedback("/feedback/delete.json", { id, author, reply })

/** An answer to a FEEDBACK item. It goes to the agent's queue — the same route that
 *  files feedback, with `parent` — because a precision nobody reads is worse than a
 *  precision one cannot write. Nothing comes back to merge: the queue file is the
 *  truth, so the whole list is re-read. */
export const replyToFeedback = async (
  parent: string,
  text: string,
  author: string,
  screen: string,
): Promise<void> => {
  await call<{ ok: true }>("/feedback/submit.json", {
    kind: "flow",
    slug: SLUG,
    parent,
    text,
    author,
    screen,
  })
  await refreshNotes(true)
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

// ---------------------------------------------------------------- dates

/** The two stamp shapes this system writes, formatted in the reader's own locale and
 *  time zone. Here rather than in each reader: the same comment is dated in the list,
 *  in its thread and in the pin's tooltip, and three formatters drift.  */
const withTime = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
const dayOnly = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })

/** An ISO stamp (a comment, a version) — or a bare day, for flows published before
 *  `published_at` existed, which only ever had one. */
export const whenISO = (iso: string): string => {
  if (!iso) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return dayOnly.format(new Date(`${iso}T12:00:00`))
  const t = Date.parse(iso)
  return Number.isNaN(t) ? iso : withTime.format(t)
}

/** The agent's queue writes `YYYY-MM-DD HH:MM`, in UTC. */
export const whenQueue = (s: string): string => {
  if (!s) return ""
  const t = Date.parse(`${s.replace(" ", "T")}:00Z`)
  return Number.isNaN(t) ? s : withTime.format(t)
}

// ---------------------------------------------------------------- numbering

/** The number a pin shows, and the list repeats: creation order within the kind, across
 *  every version and every screen. Stable while nothing is deleted — and after a
 *  deletion the numbers shift, which is the price of numbers a human can read. */
export const numberOf = <T extends { id: string }>(items: T[], id: string): number =>
  items.findIndex((c) => c.id === id) + 1
