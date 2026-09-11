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
 *  who signed a comment on a flow signs a review the same way.
 *
 *  ⚠️ Since 2026-09-11 a decision is CHECKED, not committed. Every click used to be one
 *  GitHub round-trip (the repo is the database): « ça lague un peu l'attribution … j'ai
 *  l'impression que ça écrit à chaque fois ». It did — a stutter on every "for the dev",
 *  and forty `review(parity): assign …` commits behind one review session. Now a click
 *  checks the decision on its row (and a second click unchecks it), the row shows it as
 *  pending, and ONE "Validate" sends the whole batch to the same route in one POST — one
 *  commit, atomic, nothing written before. The `ignored` and `flagged` sets the tabs read
 *  carry the pending decisions laid over the committed ones, so the page already looks the
 *  way it will after the commit. */
import { Badge } from "@42/ui-react/badge"
import { Text } from "@42/ui-react/text"
import {
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Copy,
  EyeOff,
  Flag,
  RotateCcw,
  Sparkles,
  Square,
  Undo2,
} from "lucide-react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useAuthor } from "../../../src/layout/who"
import { TYPO } from "../../../src/typo"
import {
  type FindingHistory,
  NotConfigured,
  type ParityFinding,
  type ReviewChange,
  reviewParityBatch,
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

/** A decision checked on a row and not yet committed. `label` is what the pending bar
 *  shows for it — the finding's title when the click carried one, its id otherwise. */
export type Pending = Omit<ReviewChange, "by"> & { label: string }

/** What every row that offers "ignore", "flag" or "for …" needs: who signs, whether the
 *  server can write, which ids are decided (committed OR pending), the pending batch,
 *  and the gestures on it. `act` CHECKS a decision — a second identical click, or the
 *  inverse gesture, unchecks it; nothing reaches the server until `validate`. */
export type Review = {
  author: string
  canWrite: boolean
  /** `"*"` while the batch is being committed, `""` otherwise. */
  busy: string
  ignored: Set<string>
  flagged: Set<string>
  pending: Map<string, Pending>
  act: (change: Omit<ReviewChange, "by">) => Promise<void>
  unstage: (id: string) => void
  discard: () => void
  validate: () => Promise<void>
}

export const ReviewContext = createContext<Review>({
  author: "",
  canWrite: false,
  busy: "",
  ignored: new Set(),
  flagged: new Set(),
  pending: new Map(),
  act: async () => {},
  unstage: () => {},
  discard: () => {},
  validate: async () => {},
})

export const useReview = () => useContext(ReviewContext)

/** The gesture that undoes another: checking "restore" on a row where "ignore" is pending
 *  is an uncheck, not a second decision. */
const INVERSE: Record<ReviewChange["op"], ReviewChange["op"]> = {
  ignore: "restore",
  restore: "ignore",
  flag: "unflag",
  unflag: "flag",
  assign: "unassign",
  unassign: "assign",
}

/** Builds the context value for a tab. `reload` re-reads THAT tab's report after the
 *  batch is committed — the server keeps the expensive computation cached and stamps the
 *  file on at serve time, so the round-trip is one small file read, never a rebuild. */
export const useReviewState = (
  state: { can_write: boolean; ignored_ids: string[]; flagged_ids: string[] } | undefined,
  reload: () => Promise<void>,
): { review: Review; error: string; clearError: () => void } => {
  const author = useAuthor()
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState<Map<string, Pending>>(() => new Map())

  const act = useCallback(
    async (change: Omit<ReviewChange, "by">) => {
      if (!author) {
        setError(
          "Say who you are first — the name in the toolbar. A decision nobody signs cannot be questioned later.",
        )
        return
      }
      setError("")
      setPending((prev) => {
        const next = new Map(prev)
        const cur = next.get(change.id)
        const same =
          cur && cur.op === change.op && (cur.owner ?? "") === (change.owner ?? "")
        if (cur && (same || INVERSE[cur.op] === change.op)) next.delete(change.id)
        else next.set(change.id, { ...change, label: change.title || cur?.label || change.id })
        return next
      })
    },
    [author],
  )

  const unstage = useCallback((id: string) => {
    setPending((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const discard = useCallback(() => setPending(new Map()), [])

  const validate = useCallback(async () => {
    if (pending.size === 0) return
    setBusy("*")
    setError("")
    try {
      await reviewParityBatch(
        Array.from(pending.values()).map(
          ({ op, id, why, title, detail, evidence, component, owner }) => ({
            op,
            id,
            why,
            title,
            detail,
            evidence,
            component,
            owner,
          }),
        ),
        author,
      )
      setPending(new Map())
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
  }, [pending, author, reload])

  // A batch lost to a refresh is a review to redo: the browser asks before the page goes.
  useEffect(() => {
    if (pending.size === 0) return
    const guard = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", guard)
    return () => window.removeEventListener("beforeunload", guard)
  }, [pending.size])

  const review = useMemo<Review>(() => {
    // The committed decisions WITH the pending ones laid over: the page looks the way it
    // will after the commit, which is what lets a reviewer check the whole list and read
    // it back before validating.
    const ignored = new Set(state?.ignored_ids ?? [])
    const flagged = new Set(state?.flagged_ids ?? [])
    for (const p of pending.values()) {
      if (p.op === "ignore") ignored.add(p.id)
      else if (p.op === "restore") ignored.delete(p.id)
      else if (p.op === "flag") flagged.add(p.id)
      else if (p.op === "unflag") flagged.delete(p.id)
    }
    return {
      author,
      canWrite: Boolean(state?.can_write),
      busy,
      ignored,
      flagged,
      pending,
      act,
      unstage,
      discard,
      validate,
    }
  }, [author, state, busy, pending, act, unstage, discard, validate])

  return { review, error, clearError: () => setError("") }
}

/** The mark a pending decision leaves on a row: a checked box, and the way to uncheck. */
const PendingMark = ({ id, what }: { id: string; what: string }) => {
  const review = useReview()
  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <Badge color="orange" size="sm" variant="light">
        <CheckSquare size={11} />
        {what}
      </Badge>
      <button
        type="button"
        disabled={review.busy !== ""}
        title="Uncheck — nothing has been written"
        onClick={() => review.unstage(id)}
        className="flex items-center gap-0.5 px-1 text-[11px] text-gray-dark-500 hover:text-white disabled:opacity-40"
      >
        <Undo2 size={10} />
        undo
      </button>
    </span>
  )
}

/** "Ignore" is two steps and both are worth it: the click, and ONE line saying why. The
 *  reason is what the next reader — the dev opening the brief, the PO six weeks later —
 *  sees in place of the finding. Optional, because a decision taken is worth more than a
 *  decision postponed for lack of a sentence; Enter checks it, Escape backs out. */
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
  const disabled = review.busy !== ""
  if (review.pending.get(id)?.op === "ignore") return <PendingMark id={id} what="ignored" />

  if (!asking)
    return (
      <button
        type="button"
        disabled={disabled}
        title={
          review.author
            ? "Leave it out of the brief and the counts — checked here, written when you validate"
            : "Say who you are first"
        }
        onClick={() => setAsking(true)}
        className="flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-gray-dark-500 hover:bg-white/5 hover:text-white disabled:opacity-40"
      >
        <Square size={11} />
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
        className="flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-white hover:bg-white/15"
      >
        <EyeOff size={11} />
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
  if (review.pending.get(id)?.op === "restore") return <PendingMark id={id} what="restored" />
  return (
    <button
      type="button"
      disabled={review.busy !== ""}
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
/** What a flag carries (2026-09-11): the title is the ISSUE's, the rest is what an agent
 *  needs to act — or to stop. `cause` in one sentence; `locus` = file · axis.value ·
 *  the classes; `scope` = local, or the shared token and its consumers; `question` when
 *  nobody can be named; `proposed` = the edit, when the console could name it;
 *  `measured` = the kit version the browser rendered. */
export type FlagPayload = {
  component: string
  title: string
  detail: string
  evidence?: string
  cause?: string
  locus?: string
  scope?: string
  question?: string
  proposed?: string
  measured?: string
}

export const FlagButtons = ({
  id,
  flag,
  settle,
}: {
  id: string
  flag: FlagPayload
  /** Offer "to settle" (owner `both`, authority undecided): for a CAUSE where neither
   *  side can be named from the data — a shared token, a size nobody defined. An agent
   *  handed that finding asks the question and edits nothing. */
  settle?: boolean
}) => {
  const review = useReview()
  if (!review.canWrite) return null
  const p = review.pending.get(id)
  if (p?.op === "flag")
    return (
      <PendingMark
        id={id}
        what={p.owner === "both" ? "to settle" : `for ${OWNER[p.owner ?? "kit"].short}`}
      />
    )
  if (p?.op === "unflag") return <PendingMark id={id} what="unflagged" />
  if (review.flagged.has(id))
    return (
      <>
        <Badge color="blue" size="sm" variant="light">
          <Flag size={11} />
          in the brief
        </Badge>
        <button
          type="button"
          disabled={review.busy !== ""}
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
      disabled={review.busy !== ""}
      title={`${hint} — checked here, written when you validate`}
      onClick={() => void review.act({ op: "flag", id, owner, ...flag, evidence: flag.evidence ?? "" })}
      className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
    >
      <Square size={10} />
      {label}
    </button>
  )
  return (
    <span className="flex items-center gap-0.5 whitespace-nowrap">
      <span className="text-[10px] text-gray-dark-600">flag for</span>
      {one("kit", "the dev", "The kit paints it wrong: it becomes a finding for the kit")}
      {one("figma", "the designer", "The mockup is off: it becomes a finding for the Figma file")}
      {settle
        ? one(
            "both",
            "to settle",
            "Neither side can be named from the data: it becomes a QUESTION, and no agent edits on it",
          )
        : null}
    </span>
  )
}

/** ROUTE a finding to a person. The computed owner is a DEFAULT — and `both` is in
 *  nobody's brief, so a finding left there is a finding nobody does. The reviewer knows
 *  the plan ("the dev takes this red this sprint") and says so; the per-person brief
 *  follows, and the report keeps what it had derived (`owner_computed`) so the next sync
 *  does not look like it changed its mind.
 *
 *  Shown as the three destinations, the current one marked. A click CHECKS the new one
 *  (orange, boxed); clicking it again, or clicking the committed one back, unchecks. */
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
  const disabled = review.busy !== ""
  const p = review.pending.get(id)
  const shown: Owner =
    p?.op === "assign" && p.owner
      ? p.owner
      : p?.op === "unassign"
        ? ((computed as Owner | undefined) ?? owner)
        : owner
  return (
    <span className="flex items-center gap-0.5 whitespace-nowrap">
      <span className="text-[10px] text-gray-dark-600">for</span>
      {(["kit", "figma", "both"] as const).map((o) => {
        const isShown = o === shown
        const isPending = Boolean(p) && isShown
        return (
          <button
            key={o}
            type="button"
            disabled={disabled}
            title={
              isPending
                ? "Checked — written when you validate; click to uncheck"
                : o === owner && assignedBy
                  ? `${assignedBy} put it here${computed ? ` — the report said ${OWNER[computed].short}` : ""}`
                  : `Hand it to ${OWNER[o].person.toLowerCase()}: it moves to that brief`
            }
            onClick={() => {
              if (p && o === owner) review.unstage(id)
              else if (o === owner && assignedBy) void review.act({ op: "unassign", id })
              else if (o !== owner) void review.act({ op: "assign", id, owner: o, title })
            }}
            className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] transition disabled:opacity-40 ${
              isPending
                ? "border border-orange-400/70 bg-orange-400/15 text-orange-100"
                : isShown
                  ? `border border-white/25 bg-white/10 text-white ${assignedBy ? "" : "opacity-80"}`
                  : "text-gray-dark-500 hover:bg-white/5 hover:text-white"
            }`}
          >
            {isPending ? <CheckSquare size={10} /> : null}
            {OWNER[o].short}
          </button>
        )
      })}
    </span>
  )
}

/** A finding, with its decision. `href` links to what it is about (a component) when the
 *  reader is not already there. A pending decision shows on the row as it will look once
 *  committed, with the mark that says it is not yet. */
export const FindingRow = ({ f, href }: { f: ParityFinding; href?: string }) => {
  const review = useReview()
  const p = review.pending.get(f.id)
  const owner = (
    p?.op === "assign" && p.owner
      ? p.owner
      : p?.op === "unassign"
        ? (f.owner_computed ?? f.owner)
        : f.owner
  ) as Owner
  const ignored = p?.op === "ignore" ? true : p?.op === "restore" ? false : f.ignored
  const flagged = p?.op === "unflag" ? false : f.flagged
  const o = OWNER[owner]
  return (
    <li
      className={`border-white/6 border-t py-2 first:border-t-0 ${ignored ? "opacity-60" : ""} ${
        p ? "-ml-2 border-l-2 border-l-orange-400/60 pl-2" : ""
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <Badge color={SEVERITY[f.severity]} size="sm" variant="light">
          {f.severity}
        </Badge>
        <Badge color={o.color} size="sm" variant="outline">
          {o.short}
        </Badge>
        {flagged ? (
          <Badge color="blue" size="sm" variant="light">
            <Flag size={11} />
            seen in the browser
          </Badge>
        ) : null}
        {href ? (
          <a
            href={href}
            className={`${TYPO.title("semibold")} text-sm underline decoration-dotted underline-offset-2 hover:text-white ${
              ignored ? "line-through" : ""
            }`}
          >
            {f.title}
          </a>
        ) : (
          <Text
            size="sm"
            className={`${TYPO.title("semibold")} ${ignored ? "line-through" : ""}`}
          >
            {f.title}
          </Text>
        )}
        <span className="ml-auto flex items-center gap-1">
          {p?.op === "ignore" ? (
            <PendingMark id={f.id} what="ignored" />
          ) : p?.op === "restore" ? (
            <PendingMark id={f.id} what="restored" />
          ) : f.ignored ? (
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
              {p?.op === "unflag" ? (
                <PendingMark id={f.id} what="unflagged" />
              ) : f.flagged && review.canWrite ? (
                <button
                  type="button"
                  disabled={review.busy !== ""}
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
      {ignored ? (
        <Text size="xs" c="muted" className="mt-1">
          {p?.op === "ignore"
            ? `Will be ignored by ${review.author}${p.why ? ` — ${p.why}` : ""} · not written yet`
            : `Ignored by ${f.ignored_by || "?"}${f.ignored_at ? ` · ${f.ignored_at.slice(0, 10)}` : ""}${
                f.ignored_why ? ` — ${f.ignored_why}` : ""
              }`}
        </Text>
      ) : (
        <>
          <Text size="sm" c="secondary" className="mt-1">
            {f.cause || f.detail}
          </Text>
          {/* The structured half (2026-09-11): what an agent needs to act on this, or to
              stop. Only the lines the flag carried. */}
          {f.question ? (
            <Text size="xs" className="mt-1 text-purple-200">
              To settle: {f.question}
            </Text>
          ) : null}
          {f.locus ? (
            <div className={`${TYPO.mono()} mt-1 whitespace-pre-wrap break-all text-[11px] text-gray-dark-400`}>
              Code: {f.locus}
            </div>
          ) : null}
          {f.scope ? (
            <Text size="xs" c="muted" className="mt-0.5">
              Scope: {f.scope}
            </Text>
          ) : null}
          {f.proposed ? (
            <div className={`${TYPO.mono()} mt-0.5 text-[11px] text-green-200/80`}>
              Proposed: {f.proposed}
            </div>
          ) : null}
          {f.evidence ? (
            <div className={`${TYPO.mono()} mt-1 whitespace-pre-wrap text-[11px] text-gray-dark-500`}>
              {f.evidence}
            </div>
          ) : null}
          {f.measured ? (
            <Text size="xs" c="muted" className="mt-0.5">
              Measured on {f.measured}
            </Text>
          ) : null}
        </>
      )}
    </li>
  )
}

/** The words the pending bar uses for a decision. */
const PENDING_WORD: Record<ReviewChange["op"], string> = {
  ignore: "ignore",
  restore: "restore",
  flag: "flag for",
  unflag: "unflag",
  assign: "hand to",
  unassign: "give back",
}

/** THE PENDING BAR — what has been checked and not yet written, with the two gestures
 *  that end it. Sticks to the bottom of the tab while the batch is non-empty; disappears
 *  when it is. Each line has its own box to uncheck one decision before validating.
 *
 *  ⚠️ Nothing is saved until "Validate": the bar says so, because a reviewer who checks
 *  ten rows and closes the tab has done nothing, and must not believe otherwise. */
export const PendingBar = () => {
  const review = useReview()
  const [open, setOpen] = useState(false)
  if (review.pending.size === 0) return null
  const list = Array.from(review.pending.values())
  const n = list.length
  const busy = review.busy !== ""
  return (
    <div className="sticky bottom-3 z-20 rounded-lg border border-orange-400/40 bg-black/90 px-3 py-2 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <CheckSquare size={14} className="text-orange-300" />
        <Text size="sm" className={TYPO.title("semibold")}>
          {n} decision{n === 1 ? "" : "s"} to validate
        </Text>
        <span className="text-[11px] text-gray-dark-500">
          checked on the rows, nothing written yet — one commit when you validate
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-[11px] text-gray-dark-400 hover:text-white"
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {open ? "hide" : "show"}
        </button>
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            disabled={busy}
            onClick={review.discard}
            className="rounded border border-white/15 px-2 py-1 text-[11px] text-gray-dark-300 hover:border-white/35 hover:text-white disabled:opacity-40"
          >
            Discard all
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void review.validate()}
            className="flex items-center gap-1 rounded border border-orange-400/70 bg-orange-400/20 px-2.5 py-1 text-[11px] text-white hover:bg-orange-400/30 disabled:opacity-40"
          >
            <Check size={12} />
            {busy ? "Writing…" : `Validate ${n} — one commit`}
          </button>
        </span>
      </div>
      {open ? (
        <ul className="mt-2 flex flex-col gap-0.5 border-white/10 border-t pt-2">
          {list.map((p) => (
            <li key={p.id} className="flex items-center gap-2 text-xs">
              <button
                type="button"
                disabled={busy}
                title="Uncheck this one"
                onClick={() => review.unstage(p.id)}
                className="text-orange-300 hover:text-white disabled:opacity-40"
              >
                <CheckSquare size={13} />
              </button>
              <span className={`${TYPO.mono()} text-gray-dark-400`}>
                {PENDING_WORD[p.op]}
                {p.owner ? ` ${OWNER[p.owner].short}` : ""}
              </span>
              <span className="truncate text-gray-dark-200">{p.label}</span>
              {p.why ? <span className="truncate text-gray-dark-500">— {p.why}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
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
  copyJson,
}: {
  counts: Record<string, number>
  copy: (owner: Owner, prompt: boolean) => void
  copied: string
  /** The same findings as DATA (`brief.json`) — what an agent is handed. Only the tab
   *  that serves one passes it. */
  copyJson?: (owner: Owner) => void
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
              {copyJson ? (
                <button
                  type="button"
                  disabled={n === 0}
                  title="The same issues as JSON: authority, locus, scope, proposed, question — what an agent reads without parsing"
                  onClick={() => copyJson(o)}
                  className="flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-[11px] text-gray-dark-200 hover:border-white/35 hover:text-white disabled:opacity-40"
                >
                  {copied === `${o}:json` ? <Check size={12} /> : <Copy size={12} />}
                  {copied === `${o}:json` ? "Copied" : "as JSON"}
                </button>
              ) : null}
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
