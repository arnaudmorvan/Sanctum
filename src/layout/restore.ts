import { MCP_URL, SLUG } from "./env"

/** Putting the flow back to one of its versions — ONE owner for the call, because the
 *  gesture is now offered from two places: the History tab (the list of every version)
 *  and the banner of a past version (the one under your eyes, which is where somebody
 *  who has just LOOKED at it decides they want it back). Two copies of a POST that moves
 *  a branch is one copy too many, and the sentence said afterwards has to be the same
 *  sentence — hence `restoredNotice` here rather than in each caller.
 *
 *  The server owns the semantics (`_protos_restore`): the restore is exact, it is one
 *  more commit, and the version being replaced stays in the history. Nothing of that is
 *  re-decided here. */

/** The console's read key was refused. Distinct from every other failure: the caller
 *  drops the key and asks for it again, instead of showing a message about the flow. */
export class KeyRejected extends Error {
  constructor() {
    super("Key rejected by the server.")
    this.name = "KeyRejected"
  }
}

/** The server's own words when it has them — `{error}` — rather than a bare status code:
 *  "Version 154cfbc is already the current one" is an answer, "HTTP 400" is not. */
export const detail = async (r: Response): Promise<string> => {
  try {
    return ((await r.json()) as { error?: string }).error ?? `HTTP ${r.status}`
  } catch {
    return `HTTP ${r.status}`
  }
}

export const message = (e: unknown) => (e instanceof Error ? e.message : String(e))

export type Restored = { commit: string; restored_from: string }

export const restoreVersion = async (
  sha: string,
  key: string,
  author: string,
): Promise<Restored> => {
  const r = await fetch(`${MCP_URL}/console/protos/restore.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-DS-Key": key },
    body: JSON.stringify({ slug: SLUG, sha, author: author.trim() }),
  })
  if (r.status === 401) throw new KeyRejected()
  if (!r.ok) throw new Error(await detail(r))
  return (await r.json()) as Restored
}

/** What is said once it is done. The site rebuilds — a PO who reloads too early sees the
 *  old flow and concludes the restore failed, so the delay is part of the sentence. */
export const restoredNotice = (d: Restored): string =>
  `Version ${d.restored_from} is back (commit ${d.commit}). The site rebuilds: give it a few minutes.`
