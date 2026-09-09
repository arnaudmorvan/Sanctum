import { Check, Pencil, RotateCcw, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { readAuthor } from "./env"
import {
  addComment,
  changeComment,
  type Comment,
  deleteComment,
  flowMeta,
  numberOf,
  useNotes,
  versionOf,
  whenISO as when,
} from "./notes"
import { Bubble } from "./pins"
import { describeElement, type Target } from "./target"
import { ChosenTarget, Targeting } from "./targeting"

/** The "Comments" tab: what a PO tells the DEVELOPERS about a screen.
 *
 *  Not feedback. Feedback goes to the system — a queue the agent handles, a report the
 *  foundations consolidate. A comment goes to a person: "this label is wrong", "keep
 *  this order", "ask Léa first". It lives where no MCP tool can read it (see
 *  `comments_api.py`), and nothing here ever asks the agent to do anything with it.
 *
 *  What a comment knows: its text, who wrote it and when, the screen, optionally WHERE
 *  (the same pointing as feedback — an element or a circled area, drawn as a pin), and
 *  the VERSION of the flow the PO was looking at. The list is grouped by version, newest
 *  first: a comment made on the version of 10:13 stays under it after three more
 *  publications, and a dev reading it knows what it was about.
 *
 *  Edit, resolve, delete: anyone holding the page. The key is shared, not an identity;
 *  the first name goes into the commit message, which is the accountability this setup
 *  has. Deleting removes the comment from the file and from nowhere else — the MCP repo's
 *  history keeps it, version included. */

const TEXT_MAX = 2000

const message = (e: unknown) => (e instanceof Error ? e.message : String(e))

export const CommentsBody = ({
  screen,
  active,
  focus,
  onAiming,
  onOpen,
}: {
  screen?: string
  active: boolean
  /** The comment the panel was asked to bring into view: scrolled to and flashed. It
   *  travels WITH the thread now — it is what is left of the answer when the note's
   *  target no longer resolves and no thread can open on it. */
  focus: string | null
  onAiming: (aiming: boolean) => void
  /** Open a comment's thread on the screen, from its row. */
  onOpen: (id: string) => void
}) => {
  const notes = useNotes()
  const [text, setText] = useState("")
  const [author, setAuthor] = useState(readAuthor)
  const [target, setTarget] = useState<Target | null>(null)
  const [targetElement, setTargetElement] = useState<Element | null>(null)
  const [mode, setMode] = useState<"element" | "zone" | null>(null)
  const [version, setVersion] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [showResolved, setShowResolved] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [confirming, setConfirming] = useState<string | null>(null)

  useEffect(() => {
    void flowMeta().then((m) => setVersion(versionOf(m)))
  }, [])

  useEffect(() => {
    onAiming(mode !== null)
  }, [mode, onAiming])

  useEffect(() => {
    if (!active) setMode(null)
  }, [active])

  // A pin was clicked: bring its comment into view, resolved or not.
  useEffect(() => {
    if (!focus || !active) return
    const c = notes.comments.find((x) => x.id === focus)
    if (c?.status === "resolved") setShowResolved(true)
    const t = window.setTimeout(() => {
      document.getElementById(`comment-${focus}`)?.scrollIntoView({ block: "center", behavior: "smooth" })
    }, 50)
    return () => window.clearTimeout(t)
  }, [focus, active, notes.comments])

  const aimAt = (el: Element) => {
    setTargetElement(el)
    setTarget(describeElement(el))
  }

  const post = async () => {
    setBusy(true)
    setError("")
    try {
      localStorage.setItem("feedback-author", author)
    } catch {
      /* the name simply is not remembered */
    }
    try {
      await addComment({
        text,
        author,
        screen: screen ?? "",
        route: window.location.hash,
        target,
        version,
      })
      setText("")
      setTarget(null)
      setTargetElement(null)
    } catch (e) {
      setError(message(e))
    } finally {
      setBusy(false)
    }
  }

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError("")
    try {
      await fn()
    } catch (e) {
      setError(message(e))
    } finally {
      setBusy(false)
    }
  }

  // Grouped by version, newest first. ISO stamps sort as strings; the unversioned
  // bucket (flows published before the stamp existed, or a page that could not read
  // protos.json) goes last.
  const groups = useMemo(() => {
    const by = new Map<string, Comment[]>()
    for (const c of notes.comments) {
      const k = c.version || ""
      by.set(k, [...(by.get(k) ?? []), c])
    }
    return [...by.entries()].sort(([a], [b]) => (a === "" ? 1 : b === "" ? -1 : b.localeCompare(a)))
  }, [notes.comments])

  const nOpen = notes.comments.filter((c) => c.status === "open").length
  const nResolved = notes.comments.length - nOpen
  const ready = text.trim().length >= 2 && text.length <= TEXT_MAX

  return (
    <>
      {mode &&
        createPortal(
          <Targeting
            mode={mode}
            onCancel={() => setMode(null)}
            onTarget={(t) => {
              setTarget(t)
              setTargetElement(t.type === "element" ? document.querySelector(t.selector) : null)
              setMode(null)
            }}
          />,
          document.body,
        )}

      <div className="flex flex-col gap-3 px-3 py-3">
        <div className="flex items-baseline gap-2 text-xs">
          <span className="text-gray-dark-500">For the developers, about</span>
          <span className="truncate text-gray-dark-300">{screen ?? "this screen"}</span>
        </div>

        {target ? (
          <ChosenTarget
            target={target}
            element={targetElement}
            onRetarget={aimAt}
            onClear={() => {
              setTarget(null)
              setTargetElement(null)
            }}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-dark-500 text-xs">Show where:</span>
            <button
              type="button"
              onClick={() => setMode("element")}
              className="rounded-md border border-gray-dark-800 px-2.5 py-1.5 text-gray-dark-300 text-xs hover:border-white/30 hover:text-white"
            >
              Point at an element
            </button>
            <button
              type="button"
              onClick={() => setMode("zone")}
              className="rounded-md border border-gray-dark-800 px-2.5 py-1.5 text-gray-dark-300 text-xs hover:border-white/30 hover:text-white"
            >
              Circle an area
            </button>
            <span className="text-gray-dark-600 text-[11px]">optional</span>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={TEXT_MAX}
          rows={3}
          placeholder="A note for whoever builds this screen…"
          className="w-full resize-y rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2 text-sm text-white placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={60}
            placeholder="Your first name"
            className="w-32 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-1.5 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
          />
          <button
            type="button"
            disabled={!ready || busy}
            onClick={() => void post()}
            className="rounded-md bg-blue-400 px-3 py-1.5 font-semibold text-gray-dark-950 text-xs hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "…" : "Post the comment"}
          </button>
          {version ? (
            <span className="text-[11px] text-gray-dark-600">on the version of {when(version)}</span>
          ) : null}
        </div>
        {error ? <span className="text-pink-400 text-xs">{error}</span> : null}

        <div className="mt-1 flex items-baseline justify-between gap-2 border-gray-dark-800 border-t pt-3">
          <span className="font-semibold text-sm text-white">
            {nOpen} open
            {nResolved ? <span className="font-normal text-gray-dark-500"> · {nResolved} resolved</span> : null}
          </span>
          {nResolved ? (
            <label className="flex cursor-pointer items-center gap-1.5 text-gray-dark-400 text-xs">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="accent-blue-400"
              />
              Show resolved
            </label>
          ) : null}
        </div>

        {!notes.loaded ? (
          <span className="text-gray-dark-500 text-xs italic">Reading…</span>
        ) : notes.comments.length === 0 ? (
          <span className="text-gray-dark-500 text-xs italic">No comment on this flow yet.</span>
        ) : null}

        {groups.map(([v, list]) => {
          const shown = list.filter((c) => showResolved || c.status !== "resolved")
          if (shown.length === 0) return null
          const current = v !== "" && v === version
          return (
            <section key={v || "unversioned"} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-gray-dark-300 text-xs">
                  {v ? `Version of ${when(v)}` : "Unversioned"}
                </span>
                {current ? (
                  <span className="rounded-full border border-green-400/40 px-1.5 py-px text-[10px] text-green-200">
                    current
                  </span>
                ) : v ? (
                  <span className="text-[10px] text-gray-dark-600">earlier version</span>
                ) : null}
              </div>
              <ul className="flex flex-col gap-1.5">
                {shown.map((c) => {
                  const n = numberOf(notes.comments, c.id)
                  const done = c.status === "resolved"
                  const isEditing = editing === c.id
                  const onScreen = c.screen === screen
                  return (
                    <li
                      key={c.id}
                      id={`comment-${c.id}`}
                      className={`flex flex-col gap-1.5 rounded-md border px-2.5 py-2 ${
                        focus === c.id ? "border-blue-400/60 bg-blue-400/10" : "border-gray-dark-800"
                      } ${done ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {/* On this screen and still placeable: the number is the way
                            into the conversation, which is where it happens. */}
                        {onScreen && c.target ? (
                          <button
                            type="button"
                            onClick={() => onOpen(c.id)}
                            title="Open the thread on the screen"
                            className="rounded-full transition-transform hover:scale-110"
                          >
                            <Bubble kind="comment" n={n} done={done} />
                            <span className="sr-only">Open thread {n}</span>
                          </button>
                        ) : (
                          <Bubble kind="comment" n={n} done={done} />
                        )}
                        {isEditing ? (
                          <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            maxLength={TEXT_MAX}
                            rows={3}
                            className="w-full resize-y rounded-md border border-gray-dark-800 bg-white/2 px-2 py-1 text-sm text-white focus:border-white/30 focus:outline-none"
                          />
                        ) : (
                          <p
                            className={`min-w-0 flex-1 whitespace-pre-wrap text-gray-dark-100 text-sm leading-snug ${
                              done ? "line-through decoration-gray-dark-600" : ""
                            }`}
                          >
                            {c.text}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-dark-500">
                        <span>{c.author}</span>
                        <span>·</span>
                        <span className="font-mono">{when(c.created_at)}</span>
                        {c.updated_at ? <span title={`Edited ${when(c.updated_at)}`}>· edited</span> : null}
                        {c.screen ? (
                          <>
                            <span>·</span>
                            {c.route && !onScreen ? (
                              <a href={c.route} className="text-gray-dark-400 underline hover:text-white">
                                {c.screen}
                              </a>
                            ) : (
                              <span>{c.screen}</span>
                            )}
                          </>
                        ) : null}
                        {!c.target ? null : onScreen ? null : (
                          <span className="text-gray-dark-600">· pinned there</span>
                        )}
                        {c.replies.length ? (
                          <>
                            <span>·</span>
                            <span className="text-gray-dark-300">
                              {c.replies.length} {c.replies.length > 1 ? "replies" : "reply"}
                            </span>
                          </>
                        ) : null}
                        {Object.entries(c.reactions).map(([emoji, who]) => (
                          <span key={emoji} title={who.join(", ")} className="text-gray-dark-300">
                            {emoji} {who.length}
                          </span>
                        ))}
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy || draft.trim().length < 2}
                            onClick={() =>
                              void act(async () => {
                                await changeComment(c.id, { text: draft.trim() }, author)
                                setEditing(null)
                              })
                            }
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
                      ) : confirming === c.id ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-gray-dark-300">Delete this comment?</span>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              void act(async () => {
                                await deleteComment(c.id, author)
                                setConfirming(null)
                              })
                            }
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
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              void act(() => changeComment(c.id, { status: done ? "open" : "resolved" }, author))
                            }
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
                          >
                            {done ? <RotateCcw size={11} aria-hidden="true" /> : <Check size={11} aria-hidden="true" />}
                            {done ? "Reopen" : "Resolve"}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              setEditing(c.id)
                              setDraft(c.text)
                            }}
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
                          >
                            <Pencil size={11} aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setConfirming(c.id)}
                            className="ms-auto flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-dark-500 hover:bg-white/5 hover:text-pink-300"
                          >
                            <Trash2 size={11} aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}

        <p className="text-[11px] text-gray-dark-600 leading-relaxed">
          This tab holds every comment of the flow; the conversation happens on the screen —
          click a pin, or a number above, to open its thread and answer it. Comments are for
          people, not for the agent: it cannot read them. Deleting one removes it from the
          list; the repo's history keeps it, version included.
        </p>
      </div>
    </>
  )
}
