import { useEffect, useState } from "react"
import { describeElement, type Target, UI_MARK } from "./target"
import { ChosenTarget, Targeting } from "./targeting"

/** The "Feedback" widget: the mouth through which a viewer of the flow talks to the system.
 *
 *  Nothing to install — it is a button in the bottom bar, compiled into the app like the
 *  rest of the skeleton. The panel asks for TWO things: the kind of feedback and the text.
 *  The context (flow slug, screen on display, author) attaches itself.
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
 *  Fail-closed: without the feedback key set at build time, the button DOES NOT EXIST —
 *  the same safe default as the server route without its own key. The embedded key is not
 *  a secret (it is readable in the bundle): it stops drive-by spam, the real limits (size,
 *  closed set of kinds, server-computed paths) are on the server side. */

// Deployment shim: the Railway build variable is still called VITE_RETOURS_KEY. Drop this
// fallback once the variable is renamed to VITE_FEEDBACK_KEY on the service.
const KEY =
  (import.meta.env.VITE_FEEDBACK_KEY as string | undefined) ??
  (import.meta.env.VITE_RETOURS_KEY as string | undefined) ??
  ""
const SLUG = (import.meta.env.VITE_PROTO_SLUG as string | undefined) ?? ""
// Same deployment shim, for the MCP base URL: VITE_RETOURS_URL is still the name on
// Railway. Drop the fallback once it is renamed to VITE_FEEDBACK_URL.
const MCP_URL =
  (import.meta.env.VITE_FEEDBACK_URL as string | undefined) ??
  (import.meta.env.VITE_RETOURS_URL as string | undefined) ??
  "https://mcp-42-production.up.railway.app"

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

export const Feedback = ({ screen }: { screen?: string }) => {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<(typeof KINDS)[number]["key"]>("flow")
  const [text, setText] = useState("")
  const [author, setAuthor] = useState("")
  const [state, setState] = useState<State>("editing")
  const [error, setError] = useState("")
  const [target, setTarget] = useState<Target | null>(null)
  const [targetElement, setTargetElement] = useState<Element | null>(null)
  const [mode, setMode] = useState<"element" | "zone" | null>(null)

  // The author is asked ONCE per browser: anonymous feedback is feedback nobody can go
  // back and question.
  useEffect(() => {
    try {
      // `retours-auteur` is the legacy key, read once as a fallback so nobody who already
      // gave their name has to type it again. Only the new key is ever written.
      setAuthor(
        localStorage.getItem("feedback-author") ?? localStorage.getItem("retours-auteur") ?? "",
      )
    } catch {
      /* storage unavailable: the field stays empty, submitting still works */
    }
  }, [])

  if (!KEY || !SLUG) return null

  const send = async () => {
    setState("sending")
    setError("")
    try {
      localStorage.setItem("feedback-author", author)
    } catch {
      /* same tolerance as on read */
    }
    try {
      const r = await fetch(`${MCP_URL}/feedback/submit.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Feedback-Key": KEY },
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
    } catch (e) {
      setState("error")
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const close = () => {
    setOpen(false)
    setState("editing")
    setError("")
    setMode(null)
    setTarget(null)
    setTargetElement(null)
  }

  const aimAt = (el: Element) => {
    setTargetElement(el)
    setTarget(describeElement(el))
  }

  const readyToSend = text.trim().length >= 10 && text.length <= TEXT_MAX

  return (
    <>
      {mode && (
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
        />
      )}
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        className={`rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          open
            ? "bg-white/10 font-semibold text-white"
            : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        Feedback
      </button>

      {open && (
        <div
          {...{ [UI_MARK]: "" }}
          className="fixed inset-x-0 bottom-11 z-50 max-h-[60vh] overflow-y-auto border-gray-dark-800 border-t bg-gray-dark-950/98 px-4 py-4 backdrop-blur"
          role="dialog"
          aria-label="Submit feedback"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {state === "thanks" ? (
              <div className="flex flex-col items-start gap-2">
                <span className="font-semibold text-sm text-white">Thanks, it's in.</span>
                <p className="text-gray-dark-400 text-xs leading-relaxed">
                  {kind === "flow"
                    ? "The feedback is in this flow's queue — it will be read the next time someone works on it."
                    : "The rule went out as a report: it will be reviewed and consolidated with the others."}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setState("editing")}
                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-white text-xs hover:bg-white/15"
                  >
                    Submit more feedback
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm text-white">Submit feedback</span>
                  <span className="text-gray-dark-500 text-xs">
                    {screen ? `Screen: ${screen}` : `Flow: ${SLUG}`}
                  </span>
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Kind of feedback"
                >
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
                <p className="text-gray-dark-500 text-xs">
                  {KINDS.find((k) => k.key === kind)?.help}
                </p>

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
                  rows={4}
                  placeholder={
                    kind === "flow"
                      ? "What should change in this flow, and where…"
                      : "The rule, and what makes you say it…"
                  }
                  className="w-full resize-y rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2 text-sm text-white placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    maxLength={60}
                    placeholder="Your first name"
                    className="w-40 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-1.5 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!readyToSend || state === "sending"}
                    onClick={send}
                    className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {state === "sending" ? "Sending…" : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                  {state === "error" && (
                    <span className="text-pink-400 text-xs">Could not submit: {error}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
