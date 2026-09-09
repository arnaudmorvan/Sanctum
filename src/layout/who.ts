import { useSyncExternalStore } from "react"
import { MCP_URL, readConsoleKey } from "./env"

/** WHO is leaving this note — asked once, then never again.
 *
 *  Every form here used to carry a "Your first name" field: the feedback widget, the
 *  comment composer, and each thread. Three fields for one fact, re-typed on every note,
 *  and an `|| "anonymous"` behind each of them — which is how a flow ends up with a
 *  queue of items nobody can go back and question. The name is a PROPERTY OF THE PERSON,
 *  not of the message: it belongs in one place.
 *
 *  Where it comes from, in this order:
 *
 *   1. what is already stored (`feedback-author`) — everyone who has ever left a note in
 *      a flow of this site already has it, and nobody is asked again;
 *   2. the ACCESS REGISTRY, when the browser holds the console key (`/console/access.json`
 *      — the flows share the console's origin, so a PO who signed into the console once
 *      is already carrying it). One picks oneself from the list, and the name that goes
 *      into every commit afterwards is the one the registry spells;
 *   3. typed by hand — the fallback for whoever only ever opens a flow.
 *
 *  ⚠️ The registry cannot say which of its people is holding the page: the console key is
 *  SHARED, not personal. So this is a choice, not an authentication, and it is worth being
 *  plain about it — the name in a commit is what this setup has instead of an identity,
 *  and it has always been that. Picking from the registry only makes it spelt the same
 *  way twice.
 *
 *  Read through a module store rather than a hook per form: the identity is asked for by
 *  the panel, by every thread and by the pins layer, and two copies of it would drift the
 *  moment somebody changes their name. */

const KEY = "feedback-author"
// The pre-migration key, read once so nobody who already gave their name types it again.
const KEY_LEGACY = "retours-auteur"

export type Person = { id: string; name: string; role?: string }

const read = (): string => {
  try {
    return localStorage.getItem(KEY) ?? localStorage.getItem(KEY_LEGACY) ?? ""
  } catch {
    return ""
  }
}

let name = read()
const listeners = new Set<() => void>()

const emit = () => {
  for (const l of listeners) l()
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** The name every form uses, and the only one. Empty until somebody says who they are —
 *  which is what the panel asks for before letting a note be written. */
export const useAuthor = (): string => useSyncExternalStore(subscribe, () => name)

/** Outside React — the pins layer, an action fired from a menu. */
export const authorNow = (): string => name

export const setAuthor = (value: string): void => {
  name = value.trim().slice(0, 60)
  try {
    if (name) localStorage.setItem(KEY, name)
    else localStorage.removeItem(KEY)
  } catch {
    /* without storage the name lives for the session, which is still better than a field */
  }
  emit()
}

/** The people the access registry knows, or an empty list — no console key, no registry,
 *  and that is not an error: it is a flow opened by someone who never signed into the
 *  console. Fetched once per page, never retried: the fallback is a text field, and a
 *  spinner in front of it would be worse than the field. */
let roster: Promise<Person[]> | null = null

export const people = (): Promise<Person[]> => {
  if (!roster) {
    const key = readConsoleKey()
    roster = !key
      ? Promise.resolve([])
      : fetch(`${MCP_URL}/console/access.json`, { headers: { "X-DS-Key": key } })
          .then((r) => (r.ok ? r.json() : Promise.resolve({ users: [] })))
          .then((body: { users?: { id?: string; name?: string; role?: string; active?: boolean }[] }) =>
            (body.users ?? [])
              // A revoked access is not a person to file a note as.
              .filter((u) => u.active !== false && (u.name || u.id))
              .map((u) => ({ id: String(u.id ?? ""), name: String(u.name || u.id), role: u.role })),
          )
          .catch(() => [])
  }
  return roster
}
