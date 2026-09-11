/** The REVIEW — what a human decides about a computed finding, shared by the Parity and
 *  Tokens tabs.
 *
 *  Both tabs compute lists a front-end dev or a designer will act on, and both need the
 *  same three gestures on a line: IGNORE it (with a reason, signed), RESTORE it, or FLAG
 *  something the page measured itself so it reaches the brief. One context, one set of
 *  buttons, one row component — because a decision is the same object whichever tab it
 *  was taken in, and it lands in the same file (`analysis/parity-review.json`, written by
 *  the MCP server).
 *
 *  Signed with the name `who.ts` holds — the flows' `Signature`, imported here — so a PO
 *  who signed a comment on a flow signs a review the same way. */
import { Badge } from "@42/ui-react/badge"
import { Text } from "@42/ui-react/text"
import { Check, ChevronDown, ChevronRight, Copy, EyeOff, Flag, RotateCcw, Sparkles } from "lucide-react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { useAuthor } from "../../../src/layout/who"
import { TYPO } from "../../../src/typo"
import {
  type FindingHistory,
  NotConfigured,
  type ParityFinding,
  type ReviewChange,
  reviewParity,
} from "../mcp"

/** ⚠️ An owner is a PERSON, and the labels say so. It used to name the artefact — "For
 *  the kit", "For the Figma file" — while the flag buttons on every row already said "the
 *  dev" and "the designer": one vocabulary for the same split, in two words, and a reader
 *  asking who to send a list to had to make the translation themselves. */
export const OWNER: Record<
  string,
  { label: string; person: string; short: string; hint: string; where: string; color: string }
> = {
  kit: {
    label: "For the dev",
    person: "The front-end dev",
    short: "dev",
    hint: "@42/ui-react has to move: a value is drawn and the code cannot render it.",
    where: "the 42staff/kit repo",
    color: "blue",
  },
  both: {
    label: "To settle together",
    person: "Both, together",
    short: "both",
    hint: "Neither side can decide alone — two defaults for the same thing.",
    where: "a decision first, then one side moves",
    color: "purple",
  },
  figma: {
    label: "For the designer",
    person: "The designer",
    short: "designer",
    hint: "The Figma file has to move: an unnamed axis, a missing description, a diverging name.",
    where: "the 42 UI Kit V3 Figma file",
    color: "orange",
  },
}

export const SEVERITY: Record<string, string> = { high: "red", medium: "orange", low: "gray" }

export type Owner = "kit" | "figma" | "both"

/** What every row that offers "ignore" or "flag" needs: who signs, whether the server
 *  can write, which ids are already decided, and ONE function that commits a change and
 *  reloads the report. */
export type Review = {
  author: string
  canWrite: boolean
  busy: string
  ignored: Set<string>
  flagged: Set<string>
  act: (change: Omit<ReviewChange, "by">) => Promise<void>
}

export const ReviewContext = createContext<Review>({
  author: "",
  canWrite: false,
  busy: "",
  ignored: new Set(),
  flagged: new Set(),
  act: async () => {},
})

export const useReview = () => useContext(ReviewContext)

/** Builds the context value for a tab. `reload` re-reads THAT tab's report after a
 *  decision — the server keeps the expensive computation cached and stamps the file on
 *  at serve time, so the round-trip is one small file read, never a rebuild. */
export const useReviewState = (
  state: { can_write: boolean; ignored_ids: string[]; flagged_ids: string[] } | undefined,
  reload: () => Promise<void>,
): { review: Review; error: string; clearError: () => void } => {
  const author = useAuthor()
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")

  const act = useCallback(
    async (change: Omit<ReviewChange, "by">) => {
      if (!author) {
        setError(
          "Say who you are first — the name in the toolbar. A decision nobody signs cannot be questioned later.",
        )
        return
      }
      setBusy(change.id)
      setError("")
      try {
        await reviewParity({ ...change, by: author })
        await reload()
      } catch (e) {
        setError(
          e instanceof NotConfigured
            ? `The review cannot be written on this server: ${e.message}`
            : e instanceof Error
              ? e.message
              : String(e),
        )
      } finally {
        setBusy("")
      }
    },
    [author, reload],
  )

  const review = useMemo<Review>(
    () => ({
      author,
      canWrite: Boolean(state?.can_write),
      busy,
      ignored: new Set(state?.ignored_ids ?? []),
      flagged: new Set(state?.flagged_ids ?? []),
      act,
    }),
    [author, state, busy, act],
  )

  return { review, error, clearError: () => setError("") }
}

/** "Ignore" is two steps and both are worth it: the click, and ONE line saying why. The
 *  reason is what the next reader — the dev opening the brief, the PO six weeks later —
 *  sees in place of the finding. Optional, because a decision taken is worth more than a
 *  decision postponed for lack of a sentence; Enter confirms, Escape backs out. */
export const IgnoreButton = ({
  id,
  title,
  compact,
}: {
  id: string
  title: string
  compact?: boolean
}) => {
  const review = useReview()
  const [asking, setAsking] = useState(false)
  const [why, setWhy] = useState("")
  if (!review.canWrite) return null
  const disabled = review.busy === id

  if (!asking)
    return (
      <button
        type="button"
        disabled={disabled}
        title={
          review.author ? "Leave it out of the brief and the counts" : "Say who you are first"
        }
        onClick={() => setAsking(true)}
        className="flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-gray-dark-500 hover:bg-white/5 hover:text-white disabled:opacity-40"
      >
        <EyeOff size={11} />
        {compact ? null : "Ignore"}
      </button>
    )
  return (
    <span className="flex shrink-0 items-center gap-1">
      <input
        // biome-ignore lint/a11y/noAutofocus: the field appears because the reader clicked "Ignore"
        autoFocus
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        placeholder="why (optional)"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            void review.act({ op: "ignore", id, why, title })
            setAsking(false)
          }
          if (e.key === "Escape") setAsking(false)
        }}
        className={`${TYPO.mono()} w-44 rounded border border-white/15 bg-transparent px-1.5 py-0.5 text-[11px] text-gray-dark-200`}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          void review.act({ op: "ignore", id, why, title })
          setAsking(false)
        }}
        className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-white hover:bg-white/15"
      >
        Ignore
      </button>
      <button
        type="button"
        onClick={() => setAsking(false)}
        className="px-1 text-[11px] text-gray-dark-500 hover:text-white"
      >
        cancel
      </button>
    </span>
  )
}

export const RestoreButton = ({ id }: { id: string }) => {
  const review = useReview()
  if (!review.canWrite) return null
  return (
    <button
      type="button"
      disabled={review.busy === id}
      onClick={() => void review.act({ op: "restore", id })}
      className="flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
    >
      <RotateCcw size={11} />
      Restore
    </button>
  )
}

/** FLAG — something the page measured itself becomes a finding the brief carries. Two
 *  targets, because a measured difference has two possible owners: the kit paints it
 *  wrong (the dev), or the mockup was drawn against a value the system never had (the
 *  designer). The reviewer is the one who knows which, so the row offers both. */
export const FlagButtons = ({
  id,
  flag,
}: {
  id: string
  flag: { component: string; title: string; detail: string; evidence?: string }
}) => {
  const review = useReview()
  if (!review.canWrite) return null
  if (review.flagged.has(id))
    return (
      <>
        <Badge color="blue" size="sm" variant="light">
          <Flag size={11} />
          in the brief
        </Badge>
        <button
          type="button"
          disabled={review.busy === id}
          onClick={() => void review.act({ op: "unflag", id })}
          className="px-1 text-[11px] text-gray-dark-500 hover:text-white"
        >
          unflag
        </button>
      </>
    )
  const one = (owner: Owner, label: string, hint: string) => (
    <button
      type="button"
      disabled={review.busy === id}
      title={hint}
      onClick={() => void review.act({ op: "flag", id, owner, ...flag, evidence: flag.evidence ?? "" })}
      className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
    >
      <Flag size={10} />
      {label}
    </button>
  )
  return (
    <span className="flex items-center gap-0.5 whitespace-nowrap">
      <span className="text-[10px] text-gray-dark-600">flag for</span>
      {one("kit", "the dev", "The kit paints it wrong: it becomes a finding for the kit")}
      {one("figma", "the designer", "The mockup is off: it becomes a finding for the Figma file")}
    </span>
  )
}

/** ROUTE a finding to a person. The computed owner is a DEFAULT — and `both` is in
 *  nobody's brief, so a finding left there is a finding nobody does. The reviewer knows
 *  the plan ("the dev takes this red this sprint") and says so; the per-person brief
 *  follows, and the report keeps what it had derived (`owner_computed`) so the next sync
 *  does not look like it changed its mind.
 *
 *  Shown as the three destinations, the current one marked. One click is one commit. */
export const AssignButtons = ({
  id,
  title,
  owner,
  assignedBy,
  computed,
}: {
  id: string
  title: string
  owner: Owner
  assignedBy?: string
  computed?: string
}) => {
  const review = useReview()
  if (!review.canWrite) return null
  const disabled = review.busy === id
  return (
    <span className="flex items-center gap-0.5 whitespace-nowrap">
      <span className="text-[10px] text-gray-dark-600">for</span>
      {(["kit", "figma", "both"] as const).map((o) => (
        <button
          key={o}
          type="button"
          disabled={disabled}
          title={
            o === owner && assignedBy
              ? `${assignedBy} put it here${computed ? ` — the report said ${OWNER[computed].short}` : ""}`
              : `Hand it to ${OWNER[o].person.toLowerCase()}: it moves to that brief`
          }
          onClick={() =>
            void review.act(
              o === owner && assignedBy
                ? { op: "unassign", id }
                : { op: "assign", id, owner: o, title },
            )
          }
          className={`rounded px-1.5 py-0.5 text-[11px] transition disabled:opacity-40 ${
            o === owner
              ? `border border-white/25 bg-white/10 text-white ${assignedBy ? "" : "opacity-80"}`
              : "text-gray-dark-500 hover:bg-white/5 hover:text-white"
          }`}
        >
          {OWNER[o].short}
        </button>
      ))}
    </span>
  )
}

/** A finding, with its decision. `href` links to what it is about (a component) when the
 *  reader is not already there. */
export const FindingRow = ({ f, href }: { f: ParityFinding; href?: string }) => {
  const review = useReview()
  const o = OWNER[f.owner]
  return (
    <li
      className={`border-white/6 border-t py-2 first:border-t-0 ${f.ignored ? "opacity-60" : ""}`}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <Badge color={SEVERITY[f.severity]} size="sm" variant="light">
          {f.severity}
        </Badge>
        <Badge color={o.color} size="sm" variant="outline">
          {o.short}
        </Badge>
        {f.flagged ? (
          <Badge color="blue" size="sm" variant="light">
            <Flag size={11} />
            seen in the browser
          </Badge>
        ) : null}
        {href ? (
          <a
            href={href}
            className={`${TYPO.title("semibold")} text-sm underline decoration-dotted underline-offset-2 hover:text-white ${
              f.ignored ? "line-through" : ""
            }`}
          >
            {f.title}
          </a>
        ) : (
          <Text
            size="sm"
            className={`${TYPO.title("semibold")} ${f.ignored ? "line-through" : ""}`}
          >
            {f.title}
          </Text>
        )}
        <span className="ml-auto flex items-center gap-1">
          {f.ignored ? (
            <RestoreButton id={f.id} />
          ) : (
            <>
              <AssignButtons
                id={f.id}
                title={f.title}
                owner={f.owner as Owner}
                assignedBy={f.assigned_by}
                computed={f.owner_computed}
              />
              {f.flagged && review.canWrite ? (
                <button
                  type="button"
                  disabled={review.busy === f.id}
                  onClick={() => void review.act({ op: "unflag", id: f.id })}
                  className="px-1 text-[11px] text-gray-dark-500 hover:text-white"
                >
                  unflag
                </button>
              ) : null}
              <IgnoreButton id={f.id} title={f.title} />
            </>
          )}
        </span>
      </div>
      {f.ignored ? (
        <Text size="xs" c="muted" className="mt-1">
          Ignored by {f.ignored_by || "?"}
          {f.ignored_at ? ` · ${f.ignored_at.slice(0, 10)}` : ""}
          {f.ignored_why ? ` — ${f.ignored_why}` : ""}
        </Text>
      ) : (
        <>
          <Text size="sm" c="secondary" className="mt-1">
            {f.detail}
          </Text>
          {f.evidence ? (
            <div className={`${TYPO.mono()} mt-1 text-[11px] text-gray-dark-500`}>
              {f.evidence}
            </div>
          ) : null}
        </>
      )}
    </li>
  )
}

/** WHO to send this to — the same block on both tabs.
 *
 *  Reported on 2026-09-10: "on n'a pas [de brief] pour le designer, pour le développeur,
 *  pour ensuite envoyer les prompts aux bonnes personnes". The per-owner brief existed —
 *  `?owner=` on both brief routes, `?prompt=1` for the preamble — behind a filter one had
 *  to move first and two buttons that copied "the current one". A hand-off is not a
 *  filter: it names the person, says what they get, and hands over a list or a prompt in
 *  one click each.
 *
 *  ⚠️ The two are NOT the same text. The list is what a human reads; the prompt is the
 *  same findings prefaced with where the work happens and which conventions hold, so it
 *  can be pasted into Claude as a task. Offering only one of them was what made the
 *  distinction invisible. */
export const HandOff = ({
  counts,
  copy,
  copied,
}: {
  counts: Record<string, number>
  copy: (owner: Owner, prompt: boolean) => void
  copied: string
}) => (
  <div className="rounded-lg border border-white/10">
    <div className="flex flex-wrap items-baseline gap-2 px-3 py-2">
      <Text size="sm" className={TYPO.title("semibold")}>
        Hand this to someone
      </Text>
      <span className="text-[11px] text-gray-dark-500">
        the same findings, split by the side that has to move — a list to read, or a prompt
        to run
      </span>
    </div>
    <ul className="flex flex-col">
      {(["kit", "figma", "both"] as const).map((o) => {
        const n = counts[o] ?? 0
        return (
          <li
            key={o}
            className={`flex flex-wrap items-center gap-2 border-white/8 border-t px-3 py-2 ${
              n === 0 ? "opacity-50" : ""
            }`}
          >
            <Badge color={OWNER[o].color} size="sm" variant="light">
              {OWNER[o].short}
            </Badge>
            <Text size="sm" className={TYPO.title("semibold")}>
              {OWNER[o].person}
            </Text>
            <span className={`${TYPO.mono()} text-gray-dark-300 text-xs`}>
              {n} finding{n === 1 ? "" : "s"}
            </span>
            <span className="min-w-0 flex-1 text-[11px] text-gray-dark-500">
              {OWNER[o].hint} → {OWNER[o].where}
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                disabled={n === 0}
                onClick={() => copy(o, false)}
                className="flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-[11px] text-gray-dark-200 hover:border-white/35 hover:text-white disabled:opacity-40"
              >
                {copied === o ? <Check size={12} /> : <Copy size={12} />}
                {copied === o ? "Copied" : "Copy the list"}
              </button>
              <button
                type="button"
                disabled={n === 0}
                title="The same findings, prefaced so an agent can run them"
                onClick={() => copy(o, true)}
                className="flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-[11px] text-gray-dark-200 hover:border-white/35 hover:text-white disabled:opacity-40"
              >
                {copied === `${o}:prompt` ? <Check size={12} /> : <Sparkles size={12} />}
                {copied === `${o}:prompt` ? "Copied" : "as a prompt for Claude"}
              </button>
            </span>
          </li>
        )
      })}
    </ul>
  </div>
)

/** What has been CLOSED — findings the report stopped producing, struck through with the
 *  day they went.
 *
 *  ⚠️ A finding that disappears is ambiguous: fixed, or no longer seen. The console cannot
 *  tell, and neither can the server — what it CAN do is refuse to record a mass
 *  disappearance as progress (`refused`, said here in as many words) and show the rest so
 *  a reviewer sees their own work land. A review where fixed things silently vanish gives
 *  no sense of progress, and a report that goes blind looks exactly like a job well done. */
export const Closed = ({ history }: { history?: FindingHistory }) => {
  const [open, setOpen] = useState(false)
  if (!history) return null
  const list = history.closed
  if (list.length === 0 && !history.refused)
    return (
      <Text size="xs" c="muted">
        Nothing has been closed yet — the report is tracking {history.tracked} findings, and
        strikes one through here the day it stops producing it.
      </Text>
    )
  return (
    <div className="flex flex-col gap-1">
      {history.refused ? (
        <Text size="xs" className="text-orange-300">
          ⚠️ {history.refused} Check the sources above before reading this as progress.
        </Text>
      ) : null}
      {list.length > 0 ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 text-left text-gray-dark-400 text-xs hover:text-white"
          >
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            <strong className="text-green-300">{history.closed_total} closed</strong> — the
            report no longer produces them
            {history.reopened.length > 0 ? (
              <span className="text-orange-300">
                · {history.reopened.length} came back
              </span>
            ) : null}
          </button>
          {open ? (
            <ul className="flex flex-col gap-0.5 pl-5">
              {list.map((f) => (
                <li key={f.id} className="flex flex-wrap items-baseline gap-2 text-xs">
                  <span className="text-gray-dark-500 line-through">{f.title}</span>
                  <span className={`${TYPO.mono()} text-[10px] text-gray-dark-600`}>
                    {f.owner ? `${OWNER[f.owner]?.short ?? f.owner} · ` : ""}
                    seen {f.first} → {f.closed}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

/** The three owner buttons — a FILTER for reading the list below, not the hand-off. */
export const OwnerBar = ({
  owner,
  counts,
  setOwner,
  children,
}: {
  owner: Owner
  counts: Record<string, number>
  setOwner: (o: Owner) => void
  children?: React.ReactNode
}) => (
  <div className="flex flex-wrap items-center gap-2">
    {(["kit", "both", "figma"] as const).map((o) => (
      <button
        key={o}
        type="button"
        onClick={() => setOwner(o)}
        className={`rounded-md border px-2.5 py-1 text-xs uppercase transition ${
          owner === o
            ? "border-white/40 bg-white/10 text-white"
            : "border-white/15 text-gray-dark-300 hover:border-white/30"
        }`}
      >
        {OWNER[o].label} ({counts[o] ?? 0})
      </button>
    ))}
    <span className="ml-auto flex items-center gap-2">{children}</span>
  </div>
)
