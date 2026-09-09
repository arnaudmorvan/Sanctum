import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { FEEDBACK_KEY, MCP_URL, SLUG } from "./env"
import { editFeedback, numberOf, refreshNotes, removeFeedback, useNotes, whenQueue as when } from "./notes"
import { Bubble } from "./pins"
import { describeElement, type Target } from "./target"
import { Signature } from "./identity"
import { ChosenTarget, Targeting } from "./targeting"
import { useAuthor } from "./who"

/** The "Feedback" tab: the mouth through which a viewer of the flow talks to the system.
 *
 *  Nothing to install — it is compiled into the app like the rest of the skeleton. The tab
 *  asks for TWO things: the kind of feedback and the text. The context (flow slug, screen on
 *  display, author) attaches itself.
 *
 *  Two kinds, two destinations on the server side (the MCP's feedback API):
 *   • "This flow"     → the queue `context/flow-feedback/<slug>.md`, counted by the MCP
 *     welcome panel and handled by the "handle feedback" gesture;
 *   • "A system rule" → a report in `context/reports/`, which follows the normal
 *     foundations consolidation. The widget is one more mouth on the existing pipeline.
 *
 *  Since 2026-09-06, a feedback item can carry a TARGET: the element pointed at or the area
 *  circled. It travels with several proofs (kit/hand-written origin, name, role, path,
 *  selector, rectangle) — see `target.ts`. What it changes for whoever handles the feedback:
 *  "it is too tight" becomes "the padding of this kit `Card` is too tight", hence a kit
 *  task, or "the layout div around it", hence a flow task.
 *
 *  It floated on its own from 2026-09-07 (mechanism ported from the designBrain widget);
 *  since 2026-09-08 it is one tab of the side panel (`side-panel.tsx`), which kept the
 *  floating/docking container and gave it two neighbours. What is left here is the FORM.
 *
 *  Aiming: the targeting overlay is portalled to `body`. The panel hides itself entirely
 *  while aiming (`onAiming`) so nothing of ours sits over what is being pointed at — and an
 *  overlay rendered inside it would vanish with it.
 *
 *  Since 2026-09-08 the tab also LISTS what was filed on this flow, with where each item
 *  stands: `open` until the agent handles it, `handled` after — the flip is the agent's
 *  (proto-build-flow skill, `— open` → `— handled` in the queue file), the page only reads
 *  it back. Read-only on purpose: the queue is a promise made to the agent, and a PO who
 *  could close an item by hand would be closing it in the agent's name.
 *
 *  Fail-closed: without the feedback key set at build time, the tab DOES NOT EXIST (the
 *  panel filters it out) — the same safe default as the server route without its own key.
 *  The embedded key is not a secret (it is readable in the bundle): it stops drive-by spam,
 *  the real limits (size, closed set of kinds, server-computed paths) are on the server. */

const TEXT_MAX = 2000 // the server limit — refusing here saves a round trip for nothing

type State = "editing" | "sending" | "thanks" | "error"

const KINDS = [
  {
    key: "flow",
    label: "This flow",
    help: "A change or a problem in THIS flow: a screen, a sequence, a piece of data.",
  },
  {
    key: "rule",
    label: "A system rule",
    help: "A rule the design system should know — it will go out for consolidation.",
  },
] as const

export const FeedbackBody = ({
  screen,
  docked,
  active,
  focus,
  onAiming,
  onOpen,
}: {
  screen?: string
  docked: boolean
  active: boolean
  /** The item the panel was asked to bring into view: scrolled to and highlighted. It
   *  travels WITH the thread now — it is what is left of the answer when the item's
   *  target no longer resolves and no thread can open on it. */
  focus: string | null
  onAiming: (aiming: boolean) => void
  /** Open an item's thread on the screen, from its row. */
  onOpen: (id: string) => void
}) => {
  const notes = useNotes()
  const [showHandled, setShowHandled] = useState(false)
  const [kind, setKind] = useState<(typeof KINDS)[number]["key"]>("flow")
  const [text, setText] = useState("")
  const author = useAuthor()
  const [state, setState] = useState<State>("editing")
  const [error, setError] = useState("")
  const [target, setTarget] = useState<Target | null>(null)
  const [targetElement, setTargetElement] = useState<Element | null>(null)
  const [mode, setMode] = useState<"element" | "zone" | null>(null)
  // Correcting or withdrawing an item, from the LIST — the thread is the other place,
  // and it only exists for an item whose pin can still be placed on this screen.
  const [editing, setEditing] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [acting, setActing] = useState(false)
  const [actError, setActError] = useState("")

  // The panel needs to know when we aim: it hides itself for the duration.
  useEffect(() => {
    onAiming(mode !== null)
  }, [mode, onAiming])

  // Leaving the tab (or the panel) mid-aim would leave an overlay over the flow with no
  // way back to the button that cancels it.
  useEffect(() => {
    if (!active) setMode(null)
  }, [active])

  useEffect(() => {
    if (!focus || !active) return
    const f = notes.feedback.find((x) => x.id === focus)
    if (f?.status === "handled") setShowHandled(true)
    const t = window.setTimeout(() => {
      document.getElementById(`feedback-${focus}`)?.scrollIntoView({ block: "center", behavior: "smooth" })
    }, 50)
    return () => window.clearTimeout(t)
  }, [focus, active, notes.feedback])

  if (!FEEDBACK_KEY || !SLUG) return null

  const send = async () => {
    setState("sending")
    setError("")
    try {
      const r = await fetch(`${MCP_URL}/feedback/submit.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Feedback-Key": FEEDBACK_KEY },
        body: JSON.stringify({ kind, text, slug: SLUG, screen: screen ?? "", author, target }),
      })
      if (!r.ok) {
        const body = (await r.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? `HTTP ${r.status}`)
      }
      setState("thanks")
      setText("")
      setTarget(null)
      setTargetElement(null)
      // A flow item shows up in the list (and as a pin) right away; a rule went to the
      // reports and has nothing to show here.
      if (kind === "flow") void refreshNotes()
    } catch (e) {
      setState("error")
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const aimAt = (el: Element) => {
    setTargetElement(el)
    setTarget(describeElement(el))
  }

  const readyToSend = text.trim().length >= 10 && text.length <= TEXT_MAX && Boolean(author)

  const act = async (fn: () => Promise<unknown>) => {
    setActing(true)
    setActError("")
    try {
      await fn()
      setEditing(null)
      setConfirming(null)
    } catch (e) {
      setActError(e instanceof Error ? e.message : String(e))
    } finally {
      setActing(false)
    }
  }

  return (
    <>
      {mode &&
        createPortal(
          <Targeting
            mode={mode}
            onCancel={() => setMode(null)}
            onTarget={(t) => {
              setTarget(t)
              // In zone mode, the holding element is not what was shown: the breadcrumb
              // would make no sense, so we do not offer it.
              setTargetElement(t.type === "element" ? document.querySelector(t.selector) : null)
              setMode(null)
            }}
          />,
          document.body,
        )}

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 py-3">
        <div className="flex items-baseline gap-2 text-xs">
          <span className="text-gray-dark-500">About</span>
          <span className="truncate text-gray-dark-300">{screen ?? SLUG}</span>
        </div>

        {state === "thanks" ? (
          <div className="flex flex-col items-start gap-2">
            <span className="font-semibold text-sm text-white">Thanks, it's in.</span>
            <p className="text-gray-dark-400 text-xs leading-relaxed">
              {kind === "flow"
                ? "The feedback is in this flow's queue — it will be read the next time someone works on it."
                : "The rule went out as a report: it will be reviewed and consolidated with the others."}
            </p>
            <button
              type="button"
              onClick={() => setState("editing")}
              className="rounded-md bg-white/10 px-2.5 py-1.5 text-white text-xs hover:bg-white/15"
            >
              Submit more feedback
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Kind of feedback">
              {KINDS.map((k) => {
                const on = kind === k.key
                return (
                  <button
                    key={k.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setKind(k.key)}
                    className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                      on
                        ? "border-white/30 bg-white/10 font-semibold text-white"
                        : "border-gray-dark-800 text-gray-dark-400 hover:text-white"
                    }`}
                  >
                    {k.label}
                  </button>
                )
              })}
            </div>
            <p className="text-gray-dark-500 text-xs">{KINDS.find((k) => k.key === kind)?.help}</p>

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
              rows={docked ? 10 : 5}
              placeholder={
                kind === "flow"
                  ? "What should change in this flow, and where…"
                  : "The rule, and what makes you say it…"
              }
              // Docked, the field takes the height that was the reason for docking.
              className={`w-full resize-y rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2 text-sm text-white placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none ${
                docked ? "min-h-40 flex-1" : ""
              }`}
            />

            <div className="flex flex-wrap items-center gap-2">
              <Signature />
              <button
                type="button"
                disabled={!readyToSend || state === "sending"}
                onClick={send}
                className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {state === "sending" ? "Sending…" : "Send"}
              </button>
            </div>
            {state === "error" && (
              <span className="text-pink-400 text-xs">Could not submit: {error}</span>
            )}
          </>
        )}

        {(() => {
          const nOpen = notes.feedback.filter((f) => f.status === "open").length
          const nHandled = notes.feedback.length - nOpen
          const shown = notes.feedback.filter((f) => showHandled || f.status !== "handled")
          return (
            <>
              <div className="mt-1 flex items-baseline justify-between gap-2 border-gray-dark-800 border-t pt-3">
                <span className="font-semibold text-sm text-white">
                  {nOpen} open
                  {nHandled ? (
                    <span className="font-normal text-gray-dark-500"> · {nHandled} handled</span>
                  ) : null}
                </span>
                {nHandled ? (
                  <label className="flex cursor-pointer items-center gap-1.5 text-gray-dark-400 text-xs">
                    <input
                      type="checkbox"
                      checked={showHandled}
                      onChange={(e) => setShowHandled(e.target.checked)}
                      className="accent-purple-400"
                    />
                    Show handled
                  </label>
                ) : null}
              </div>
              {!notes.loaded ? (
                <span className="text-gray-dark-500 text-xs italic">Reading…</span>
              ) : notes.feedback.length === 0 ? (
                <span className="text-gray-dark-500 text-xs italic">
                  No feedback filed on this flow yet.
                </span>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {shown.map((f) => {
                    const done = f.status === "handled"
                    const onScreen = f.screen === screen
                    return (
                      <li
                        key={f.id}
                        id={`feedback-${f.id}`}
                        className={`flex flex-col gap-1.5 rounded-md border px-2.5 py-2 ${
                          focus === f.id ? "border-purple-400/60 bg-purple-400/10" : "border-gray-dark-800"
                        } ${done ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          {/* On this screen and still placeable: the number opens the
                              thread, which is where one answers the item. */}
                          {onScreen && f.target ? (
                            <button
                              type="button"
                              onClick={() => onOpen(f.id)}
                              title="Open the thread on the screen"
                              className="rounded-full transition-transform hover:scale-110"
                            >
                              <Bubble kind="feedback" n={numberOf(notes.feedback, f.id)} done={done} />
                              <span className="sr-only">Open thread {numberOf(notes.feedback, f.id)}</span>
                            </button>
                          ) : (
                            <Bubble kind="feedback" n={numberOf(notes.feedback, f.id)} done={done} />
                          )}
                          <p className="min-w-0 flex-1 whitespace-pre-wrap text-gray-dark-100 text-sm leading-snug">
                            {f.text}
                          </p>
                          <span
                            className={`shrink-0 rounded-full border px-1.5 py-px text-[10px] ${
                              done
                                ? "border-green-400/40 text-green-200"
                                : "border-purple-400/40 text-purple-200"
                            }`}
                          >
                            {f.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-gray-dark-500">
                          <span>{f.author}</span>
                          <span>·</span>
                          <span className="font-mono">{when(f.when)}</span>
                          {f.screen ? (
                            <>
                              <span>·</span>
                              <span>{f.screen}</span>
                            </>
                          ) : null}
                          {f.replies.length ? (
                            <>
                              <span>·</span>
                              <span className="text-gray-dark-300">
                                {f.replies.length} {f.replies.length > 1 ? "replies" : "reply"}
                              </span>
                            </>
                          ) : null}
                        </div>
                        {f.handled ? (
                          <p className="text-[11px] text-green-200/80 leading-snug">
                            <span className="text-gray-dark-500">Handled: </span>
                            {f.handled}
                          </p>
                        ) : null}

                        {editing === f.id ? (
                          <div className="flex flex-col gap-1.5">
                            <textarea
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              maxLength={TEXT_MAX}
                              rows={3}
                              className="w-full resize-y rounded-md border border-gray-dark-800 bg-white/2 px-2 py-1 text-sm text-white focus:border-white/30 focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={acting || draft.trim().length < 10}
                                onClick={() =>
                                  void act(() => editFeedback(f.id, draft.trim(), author))
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
                          </div>
                        ) : confirming === f.id ? (
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-gray-dark-300">Withdraw this feedback?</span>
                            <button
                              type="button"
                              disabled={acting}
                              onClick={() => void act(() => removeFeedback(f.id, author))}
                              className="rounded-md bg-pink-400/20 px-2.5 py-1 font-semibold text-pink-200 hover:bg-pink-400/30"
                            >
                              Withdraw
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
                              disabled={acting || !author}
                              onClick={() => {
                                setConfirming(null)
                                setEditing(f.id)
                                setDraft(f.text)
                              }}
                              title={author ? "Correct what this item says" : "Say who you are first"}
                              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
                            >
                              <Pencil size={11} aria-hidden="true" />
                              Correct
                            </button>
                            <button
                              type="button"
                              disabled={acting || !author}
                              onClick={() => {
                                setEditing(null)
                                setConfirming(f.id)
                              }}
                              title={author ? "Withdraw it from the agent's queue" : "Say who you are first"}
                              className="ms-auto flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-dark-500 hover:bg-white/5 hover:text-pink-300 disabled:opacity-40"
                            >
                              <Trash2 size={11} aria-hidden="true" />
                              Withdraw
                            </button>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
              {actError ? <span className="text-pink-400 text-xs">{actError}</span> : null}
              <p className="text-[11px] text-gray-dark-600 leading-relaxed">
                Click a pin, or a number above, to open an item's thread and add a precision —
                it joins the item in the agent's queue. An item goes from open to handled when
                the agent works on this flow: it is the agent's to close, the page only shows
                where it stands.
              </p>
            </>
          )
        })()}
      </div>
    </>
  )
}
