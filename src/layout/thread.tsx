import { Check, CornerDownRight, Pencil, RotateCcw, Trash2, X } from "lucide-react"
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { readAuthor } from "./env"
import {
  addComment,
  addReply,
  changeComment,
  type Comment,
  deleteComment,
  type FeedbackItem,
  flowMeta,
  numberOf,
  REACTIONS,
  replyToFeedback,
  toggleReaction,
  useNotes,
  versionOf,
  whenISO,
  whenQueue,
} from "./notes"
import { useBottomBar } from "./bottom-bar"
import { type At, type PinKind, pinClass, useAnchor } from "./pins"
import type { Target } from "./target"

/** The THREAD: the conversation held at one point of a screen, opened where it was left.
 *
 *  Before 2026-09-09 a pin was a bookmark — clicking it opened the side panel and
 *  scrolled a list to the right row. The note was readable, but the gesture it invites —
 *  answering it — had nowhere to happen, so a screen collected three pins on the same
 *  button: the remark, the objection, and the decision, numbered apart and resolved
 *  apart. A thread is the same object seen right: one place, one subject, several voices.
 *
 *  Two kinds, and the difference is not cosmetic — it is WHO the thread talks to:
 *
 *   • a COMMENT thread talks to the developers. Root, replies, reactions, and the whole
 *     of it lives in `comments/<slug>.json`, outside everything the agent can read. It
 *     can be resolved, edited, deleted from here;
 *   • a FEEDBACK thread talks to the system. The item and the answers made to it live in
 *     the agent's queue (`context/flow-feedback/<slug>.md`), so an answer typed here IS
 *     read when the agent handles the item — that is the whole reason it goes there and
 *     not into the comments file. What stays out of reach is the STATUS: `open` →
 *     `handled` is the agent's to write, and a button here would close an item in its
 *     name. No reactions either: an emoji is something one says to a person.
 *
 *  It FOLLOWS its pin (`useAnchor`, the pins layer's own tracking), flips to the other
 *  side of it rather than leaving the window, and rests above the bottom bar — measured,
 *  not assumed. It keeps its last position when the anchor scrolls out of sight instead
 *  of unmounting: a thread that vanished mid-scroll would take a half-written reply with
 *  it.
 *
 *  A DRAFT is the same component with nothing in it yet: the comment tool drops a pin,
 *  the thread opens empty on that point, and posting turns it into a real one. Same
 *  frame for writing the first message and the fifth — which is what makes the tool
 *  read as one gesture.
 *
 *  `UI_MARK` is carried by the wrapper the side panel renders us in, so the pointing
 *  never targets a thread; `z-50`, with the panel, under the `z-[60]` aiming overlay. */

const W = 320
const GAP = 14
const EDGE = 8
const TEXT_MAX = 2000

const message = (e: unknown) => (e instanceof Error ? e.message : String(e))

/** Where the card sits, given where its pin is. Beside the pin, flipped to the left when
 *  the right edge is too close; vertically pulled back inside the window and above the
 *  bar. Measured height, because the same thread is 120 px empty and 420 px answered. */
const layout = (at: At, h: number, bar: number): { left: number; top: number } => {
  const room = window.innerWidth - at.x - GAP - EDGE
  const left = room >= W ? at.x + GAP : Math.max(EDGE, at.x - GAP - W)
  const highest = EDGE
  const lowest = Math.max(EDGE, window.innerHeight - bar - h - EDGE)
  return { left: Math.round(left), top: Math.round(Math.min(Math.max(at.y - 24, highest), lowest)) }
}

export type ThreadTarget =
  | { kind: PinKind; id: string }
  /** A comment being dropped: the point is chosen, nothing is written yet. */
  | { kind: "draft"; target: Target }

export const Thread = ({
  screen,
  open,
  hidden,
  onClose,
  onPosted,
}: {
  screen?: string
  open: ThreadTarget | null
  /** True while aiming: nothing of ours may sit over what is being pointed at. */
  hidden: boolean
  onClose: () => void
  /** A draft became a real comment — the parent switches to its thread. */
  onPosted: (id: string) => void
}) => {
  const notes = useNotes()
  const bar = useBottomBar()
  const card = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(240)

  const comment =
    open?.kind === "comment" ? notes.comments.find((c) => c.id === open.id) : undefined
  const item =
    open?.kind === "feedback" ? notes.feedback.find((f) => f.id === open.id) : undefined
  const target =
    open?.kind === "draft" ? open.target : (comment?.target ?? item?.target ?? null)

  // A note whose target no longer resolves has no pin, and therefore no thread on the
  // screen: the list is where it stays readable. `useAnchor` keeps the last position it
  // had, so a scroll does not close what is being written.
  const at = useAnchor(
    target,
    Boolean(open),
    open ? (open.kind === "draft" ? "draft" : `${open.kind}:${open.id}`) : "",
  )

  // The card grows as replies arrive and as the composer is typed into; the clamp that
  // keeps it above the bar has to follow, or a long thread ends up under it.
  useLayoutEffect(() => {
    const el = card.current
    if (!el) return
    const measure = () => setHeight(Math.round(el.getBoundingClientRect().height))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open || hidden || !at) return null

  const { left, top } = layout(at, height, bar)

  return (
    <div
      ref={card}
      style={{ left, top, width: W, maxHeight: `calc(100vh - ${bar + 2 * EDGE}px)` }}
      className="fixed z-50 flex flex-col overflow-hidden rounded-lg border border-gray-dark-800 bg-gray-dark-950/98 shadow-[0_18px_48px_rgba(0,0,0,0.6)] backdrop-blur"
      role="dialog"
      aria-label={open.kind === "draft" ? "New comment" : "Thread"}
    >
      {open.kind === "draft" ? (
        <Draft screen={screen} target={open.target} onClose={onClose} onPosted={onPosted} />
      ) : comment ? (
        <CommentThread
          key={comment.id}
          comment={comment}
          n={numberOf(notes.comments, comment.id)}
          onClose={onClose}
        />
      ) : item ? (
        <FeedbackThread
          key={item.id}
          item={item}
          n={numberOf(notes.feedback, item.id)}
          screen={screen}
          onClose={onClose}
        />
      ) : (
        // The note was deleted while its thread was open — by someone else, or from the
        // panel's list. Saying so beats an empty card that looks broken.
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <span className="text-gray-dark-400 text-xs italic">This note is gone.</span>
          <Close onClose={onClose} />
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ shared furniture

const Close = ({ onClose }: { onClose: () => void }) => (
  <button
    type="button"
    onClick={onClose}
    className="shrink-0 rounded p-1 text-gray-dark-500 hover:bg-white/5 hover:text-white"
  >
    <X size={13} aria-hidden="true" />
    <span className="sr-only">Close the thread</span>
  </button>
)

const Header = ({
  kind,
  n,
  done,
  title,
  chip,
  onClose,
}: {
  kind: PinKind
  n: number
  done: boolean
  title: string
  chip?: ReactNode
  onClose: () => void
}) => (
  <div className="flex shrink-0 items-center gap-2 border-gray-dark-800 border-b bg-white/2 px-2.5 py-1.5">
    <span
      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border font-mono font-semibold text-[10px] ${pinClass(kind, done)}`}
    >
      {n}
    </span>
    <span className="truncate text-gray-dark-300 text-xs">{title}</span>
    {chip}
    <span className="ms-auto" />
    <Close onClose={onClose} />
  </div>
)

/** One message: who, when, and what. Same shape for a root and for a reply — the only
 *  difference is the indent, because a reply is not a smaller kind of remark. */
const Message = ({
  author,
  when,
  text,
  edited,
  struck,
  indented,
  actions,
}: {
  author: string
  when: string
  text: string
  edited?: boolean
  struck?: boolean
  indented?: boolean
  actions?: ReactNode
}) => (
  <div className={`flex flex-col gap-1 ${indented ? "border-gray-dark-800 border-s ps-2.5" : ""}`}>
    <div className="flex flex-wrap items-baseline gap-x-2 text-[11px] text-gray-dark-500">
      <span className="font-semibold text-gray-dark-300">{author}</span>
      <span className="font-mono">{when}</span>
      {edited ? <span>· edited</span> : null}
      {actions ? <span className="ms-auto flex items-center gap-1">{actions}</span> : null}
    </div>
    <p
      className={`whitespace-pre-wrap text-gray-dark-100 text-sm leading-snug ${
        struck ? "line-through decoration-gray-dark-600" : ""
      }`}
    >
      {text}
    </p>
  </div>
)

/** The name is asked once per browser and shared with the feedback widget and the
 *  restore: an anonymous note is a note nobody can go back and question. */
const Composer = ({
  placeholder,
  hint,
  cta,
  min,
  focused,
  onSend,
}: {
  placeholder: string
  hint?: string
  cta: string
  min: number
  /** The draft's: the thread opened FOR writing, the caret belongs in it. */
  focused?: boolean
  onSend: (text: string, author: string) => Promise<void>
}) => {
  const [text, setText] = useState("")
  const [author, setAuthor] = useState(readAuthor)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const field = useRef<HTMLTextAreaElement | null>(null)

  // ONCE, on mount. A ref callback would run on every render and pull the caret back out
  // of the name field the moment someone typed in it.
  useEffect(() => {
    if (focused) field.current?.focus()
  }, [focused])

  const send = async () => {
    setBusy(true)
    setError("")
    try {
      localStorage.setItem("feedback-author", author)
    } catch {
      /* the name simply is not remembered */
    }
    try {
      await onSend(text.trim(), author.trim() || "anonymous")
      setText("")
    } catch (e) {
      setError(message(e))
    } finally {
      setBusy(false)
    }
  }

  const ready = text.trim().length >= min && text.length <= TEXT_MAX

  return (
    <div className="flex shrink-0 flex-col gap-1.5 border-gray-dark-800 border-t bg-white/2 px-2.5 py-2">
      <textarea
        ref={field}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={TEXT_MAX}
        rows={2}
        placeholder={placeholder}
        // ⌘/Ctrl+Enter sends: the thread is a conversation, and reaching for the mouse
        // between two sentences is what makes people stop answering.
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && ready && !busy) void send()
        }}
        className="w-full resize-y rounded-md border border-gray-dark-800 bg-gray-dark-950 px-2.5 py-1.5 text-sm text-white placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
      />
      <div className="flex flex-wrap items-center gap-1.5">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={60}
          placeholder="Your first name"
          className="w-28 rounded-md border border-gray-dark-800 bg-gray-dark-950 px-2 py-1 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
        />
        <button
          type="button"
          disabled={!ready || busy}
          onClick={() => void send()}
          className="rounded-md bg-white/10 px-2.5 py-1 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "…" : cta}
        </button>
        {hint ? <span className="text-[10px] text-gray-dark-600">{hint}</span> : null}
      </div>
      {error ? <span className="text-pink-400 text-xs">{error}</span> : null}
    </div>
  )
}

// ------------------------------------------------------------------ comment thread

const CommentThread = ({
  comment,
  n,
  onClose,
}: {
  comment: Comment
  n: number
  onClose: () => void
}) => {
  const done = comment.status === "resolved"
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [confirming, setConfirming] = useState<string | null>(null)

  const act = useCallback(async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError("")
    try {
      await fn()
    } catch (e) {
      setError(message(e))
    } finally {
      setBusy(false)
    }
  }, [])

  const me = () => readAuthor() || "anonymous"

  const edit = (id: string, text: string) => {
    setConfirming(null)
    setEditing(id)
    setDraft(text)
  }

  const saveEdit = () =>
    void act(async () => {
      const text = draft.trim()
      if (text.length < 2) return
      await changeComment(
        comment.id,
        editing === comment.id ? { text } : { reply: editing ?? "", text },
        me(),
      )
      setEditing(null)
    })

  const remove = (id: string) =>
    void act(async () => {
      await deleteComment(comment.id, me(), id === comment.id ? undefined : id)
      setConfirming(null)
    })

  const editor = () => (
    <div className="flex flex-col gap-1.5">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        maxLength={TEXT_MAX}
        rows={3}
        className="w-full resize-y rounded-md border border-gray-dark-800 bg-gray-dark-950 px-2 py-1 text-sm text-white focus:border-white/30 focus:outline-none"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy || draft.trim().length < 2}
          onClick={saveEdit}
          className="rounded-md bg-white/10 px-2.5 py-1 font-semibold text-white text-xs hover:bg-white/15 disabled:opacity-40"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="rounded-md px-2 py-1 text-gray-dark-400 text-xs hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  const confirm = (id: string, what: string) => (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-gray-dark-300">Delete this {what}?</span>
      <button
        type="button"
        disabled={busy}
        onClick={() => remove(id)}
        className="rounded-md bg-pink-400/20 px-2.5 py-1 font-semibold text-pink-200 hover:bg-pink-400/30"
      >
        Delete
      </button>
      <button
        type="button"
        onClick={() => setConfirming(null)}
        className="rounded-md px-2 py-1 text-gray-dark-400 hover:text-white"
      >
        Keep
      </button>
    </div>
  )

  const action = (onClick: () => void, label: string, icon: ReactNode) => (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      title={label}
      className="rounded p-0.5 text-gray-dark-500 hover:bg-white/5 hover:text-white"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  )

  return (
    <>
      <Header
        kind="comment"
        n={n}
        done={done}
        title={comment.screen || "This screen"}
        chip={
          done ? (
            <span className="shrink-0 rounded-full border border-green-400/40 px-1.5 py-px text-[10px] text-green-200">
              resolved
            </span>
          ) : undefined
        }
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-2.5 py-2.5">
        {editing === comment.id ? (
          editor()
        ) : (
          <Message
            author={comment.author}
            when={whenISO(comment.created_at)}
            text={comment.text}
            edited={Boolean(comment.updated_at)}
            struck={done}
            actions={
              confirming === comment.id ? null : (
                <>
                  {action(() => edit(comment.id, comment.text), "Edit",
                    <Pencil size={11} aria-hidden="true" />)}
                  {action(() => setConfirming(comment.id), "Delete the thread",
                    <Trash2 size={11} aria-hidden="true" />)}
                </>
              )
            }
          />
        )}
        {confirming === comment.id ? confirm(comment.id, "whole thread") : null}

        <Reactions comment={comment} onError={setError} />

        {comment.replies.map((r) =>
          editing === r.id ? (
            <div key={r.id} className="border-gray-dark-800 border-s ps-2.5">
              {editor()}
            </div>
          ) : (
            <div key={r.id} className="flex flex-col gap-1.5">
              <Message
                indented
                author={r.author}
                when={whenISO(r.created_at)}
                text={r.text}
                edited={Boolean(r.updated_at)}
                actions={
                  confirming === r.id ? null : (
                    <>
                      {action(() => edit(r.id, r.text), "Edit this reply",
                        <Pencil size={11} aria-hidden="true" />)}
                      {action(() => setConfirming(r.id), "Delete this reply",
                        <Trash2 size={11} aria-hidden="true" />)}
                    </>
                  )
                }
              />
              {confirming === r.id ? <div className="ps-2.5">{confirm(r.id, "reply")}</div> : null}
            </div>
          ),
        )}

        {error ? <span className="text-pink-400 text-xs">{error}</span> : null}

        <div className="flex items-center gap-1 border-gray-dark-800 border-t pt-2">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void act(() =>
                changeComment(comment.id, { status: done ? "open" : "resolved" }, me()),
              )
            }
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
          >
            {done ? <RotateCcw size={11} aria-hidden="true" /> : <Check size={11} aria-hidden="true" />}
            {done ? "Reopen" : "Resolve"}
          </button>
          {comment.version ? (
            <span className="ms-auto text-[10px] text-gray-dark-600">
              on the version of {whenISO(comment.version)}
            </span>
          ) : null}
        </div>
      </div>

      <Composer
        placeholder="Reply…"
        cta="Reply"
        min={2}
        hint="⌘↵"
        onSend={(text, author) => addReply(comment.id, text, author).then(() => undefined)}
      />
    </>
  )
}

/** The closed palette, drawn as five buttons. Counts, not names, with the names in the
 *  tooltip: a review with four people in it fits, a list of first names does not. */
const Reactions = ({
  comment,
  onError,
}: {
  comment: Comment
  onError: (message: string) => void
}) => {
  const [busy, setBusy] = useState(false)
  const me = readAuthor() || "anonymous"

  const toggle = async (emoji: string) => {
    setBusy(true)
    onError("")
    try {
      await toggleReaction(comment.id, emoji, me)
    } catch (e) {
      onError(message(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {REACTIONS.map((emoji) => {
        const who = comment.reactions[emoji] ?? []
        const mine = who.includes(me)
        // Empty ones stay visible but quiet: a reaction bar that only appears once
        // somebody reacted is a bar nobody discovers.
        return (
          <button
            key={emoji}
            type="button"
            disabled={busy}
            onClick={() => void toggle(emoji)}
            aria-pressed={mine}
            title={who.length ? who.join(", ") : `React ${emoji}`}
            className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors ${
              mine
                ? "border-blue-400/60 bg-blue-400/15 text-white"
                : who.length
                  ? "border-gray-dark-800 bg-white/2 text-gray-dark-300 hover:border-white/25"
                  : "border-transparent text-gray-dark-600 hover:border-gray-dark-800 hover:text-gray-dark-300"
            }`}
          >
            <span aria-hidden="true">{emoji}</span>
            {who.length ? <span className="font-mono">{who.length}</span> : null}
          </button>
        )
      })}
    </div>
  )
}

// ------------------------------------------------------------------ feedback thread

const FeedbackThread = ({
  item,
  n,
  screen,
  onClose,
}: {
  item: FeedbackItem
  n: number
  screen?: string
  onClose: () => void
}) => {
  const done = item.status === "handled"
  return (
    <>
      <Header
        kind="feedback"
        n={n}
        done={done}
        title={item.screen || screen || "This flow"}
        chip={
          <span
            className={`shrink-0 rounded-full border px-1.5 py-px text-[10px] ${
              done ? "border-green-400/40 text-green-200" : "border-purple-400/40 text-purple-200"
            }`}
          >
            {item.status}
          </span>
        }
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-2.5 py-2.5">
        <Message author={item.author} when={whenQueue(item.when)} text={item.text} />

        {item.replies.map((r) => (
          <Message
            key={`${r.when}-${r.author}-${r.text.slice(0, 24)}`}
            indented
            author={r.author}
            when={whenQueue(r.when)}
            text={r.text}
          />
        ))}

        {item.handled ? (
          <p className="flex gap-1.5 rounded-md border border-green-400/30 bg-green-400/5 px-2 py-1.5 text-[11px] text-green-200/90 leading-snug">
            <CornerDownRight size={12} className="mt-px shrink-0" aria-hidden="true" />
            <span>
              <span className="text-gray-dark-400">Handled: </span>
              {item.handled}
            </span>
          </p>
        ) : null}

        <p className="border-gray-dark-800 border-t pt-2 text-[10px] text-gray-dark-600 leading-relaxed">
          This thread goes to the agent: an answer joins the item in its queue, and is read
          when the flow is worked on. Closing it stays the agent's — the page shows where it
          stands, it does not decide it.
        </p>
      </div>

      <Composer
        placeholder="Answer — a precision, a change of mind…"
        cta="Send"
        min={2}
        hint="to the queue"
        onSend={(text, author) => replyToFeedback(item.id, text, author, item.screen || screen || "")}
      />
    </>
  )
}

// ------------------------------------------------------------------ the draft

const Draft = ({
  screen,
  target,
  onClose,
  onPosted,
}: {
  screen?: string
  target: Target
  onClose: () => void
  onPosted: (id: string) => void
}) => {
  const [version, setVersion] = useState("")
  const [kind, name] = target.origin ? target.origin.split(":") : ["", ""]

  useEffect(() => {
    void flowMeta().then((m) => setVersion(versionOf(m)))
  }, [])

  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-gray-dark-800 border-b bg-white/2 px-2.5 py-1.5">
        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-400 font-mono font-semibold text-[10px] text-gray-dark-950">
          +
        </span>
        <span className="truncate text-gray-dark-300 text-xs">New comment</span>
        <span className="ms-auto" />
        <Close onClose={onClose} />
      </div>

      {/* What was pointed at, in one line: it is the answer to "did I aim at the card or
          at its title?", and the reason this project's targets say who must fix a thing. */}
      <div className="flex flex-wrap items-baseline gap-x-2 px-2.5 pt-2 text-[11px]">
        <span className="text-gray-dark-500">On</span>
        <span className={`font-mono ${kind === "kit" ? "text-green-400" : "text-pink-400"}`}>
          {kind === "kit" ? `${name} (kit)` : `${target.tag} (hand-written)`}
        </span>
        {target.name ? (
          <span className="truncate text-gray-dark-400">"{target.name.slice(0, 40)}"</span>
        ) : null}
      </div>

      <Composer
        focused
        placeholder="A note for whoever builds this screen…"
        cta="Post"
        min={2}
        hint={version ? `on the version of ${whenISO(version)}` : undefined}
        onSend={async (text, author) => {
          const posted = await addComment({
            text,
            author,
            screen: screen ?? "",
            route: window.location.hash,
            target,
            version,
          })
          onPosted(posted.id)
        }}
      />
    </>
  )
}
