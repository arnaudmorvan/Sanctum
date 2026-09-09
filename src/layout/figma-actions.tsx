import { ArrowLeft, Columns2, KeyRound, Link2 } from "lucide-react"
import { type FormEvent, useState } from "react"
import { TYPO } from "../typo"
import { MCP_URL, readConsoleKey, writeConsoleKey } from "./env"
import { fromFigmaPrompt, toFigmaPrompt } from "./figma-prompts"

/** What one does with a screen and its mockup — the THREE gestures, in one component
 *  mounted in two places: the flow's Source panel, and the compare page's bar.
 *
 *  It started as a bar of the compare page alone, on the reasoning that a gesture deserves
 *  one owner. That was the wrong cut, and a PO found it in a minute: the panel that says
 *  "this screen was not translated from a Figma frame" is exactly where one wants to give
 *  it one, and sending someone to another page to do it is a detour, not a discipline. One
 *  owner is the COMPONENT, not the location.
 *
 *  Only the first gesture is ours to perform:
 *   • LINK — `POST /console/protos/source.json`. The provenance stopped being something a
 *     skill stamps once at translation time;
 *   • SEND to Figma, and REFRESH from it — neither is something a browser can do (see
 *     `figma-prompts.ts`). The button copies the exact sentence, skill named, and the
 *     person pastes it into a conversation that has the MCPs.
 *
 *  The console's read key is what the write needs, and the flows share the console's
 *  origin — so a PO who signed in once has it here too (`readConsoleKey`). When they have
 *  not, the form asks for it rather than offering a button that would 401. */
export const FigmaActions = ({
  slug,
  path,
  label,
  frameLink,
  frameName,
  onLinked,
}: {
  slug: string
  path: string
  label: string
  frameLink: string
  frameName: string
  /** What the host does once the provenance is written. The compare page remounts its
   *  mockup side; the flow reloads, because its own bundle CARRIES the provenance and the
   *  build that just ran is the only thing that can hand it the new one. */
  onLinked: () => void
}) => {
  const [linking, setLinking] = useState(false)
  const [value, setValue] = useState("")
  const [key, setKey] = useState(readConsoleKey)
  const [keyInput, setKeyInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      window.setTimeout(() => setCopied(""), 2000)
    } catch {
      setError("the browser refused the clipboard — the prompt is in the console log.")
      console.log(text)
    }
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const k = keyInput.trim() || key
    if (!k) {
      setError("the console's read key is what authorises this write.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const r = await fetch(`${MCP_URL}/console/protos/source.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-DS-Key": k },
        body: JSON.stringify({ slug, path, url: value.trim(), author: whoami() }),
      })
      if (!r.ok) {
        let why = `HTTP ${r.status}`
        try {
          why = ((await r.json()) as { error?: string }).error ?? why
        } catch {
          /* not our JSON: the status is the whole message */
        }
        throw new Error(why)
      }
      if (keyInput.trim()) {
        writeConsoleKey(keyInput.trim())
        setKey(keyInput.trim())
        setKeyInput("")
      }
      setLinking(false)
      setValue("")
      onLinked()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const chip =
    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] text-gray-dark-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
  const field =
    "min-w-0 flex-1 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-1.5 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className={`${TYPO.mono("semibold")} text-[11px] text-gray-dark-500 uppercase`}>
        figma
      </span>
      <span className="max-w-[20rem] truncate text-gray-dark-400 text-xs">
        {frameName || (frameLink ? "linked frame" : "no frame declared for this screen")}
      </span>

      <span className="ms-auto flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setLinking((v) => !v)
            setValue(frameLink)
            setError("")
          }}
          aria-expanded={linking}
          title="Point this screen at a Figma frame — or correct the one it names"
          className={chip}
        >
          <Link2 size={13} aria-hidden="true" />
          {frameLink ? "Change the frame" : "Link a frame…"}
        </button>
        <button
          type="button"
          onClick={() => copy("to", toFigmaPrompt(slug, path, label))}
          title="Copy the prompt that rebuilds this screen as a Figma frame, in the DS"
          className={chip}
        >
          <Columns2 size={13} aria-hidden="true" />
          {copied === "to" ? "Prompt copied" : "Send to Figma"}
        </button>
        <button
          type="button"
          onClick={() => copy("from", fromFigmaPrompt(slug, path, label, frameLink))}
          disabled={!frameLink}
          title={
            frameLink
              ? "Copy the prompt that re-lifts this screen from its frame"
              : "This screen names no frame yet — link one first"
          }
          className={chip}
        >
          <ArrowLeft size={13} aria-hidden="true" />
          {copied === "from" ? "Prompt copied" : "Refresh from Figma"}
        </button>
      </span>

      {linking ? (
        <form onSubmit={save} className="flex w-full flex-wrap items-center gap-2 pt-1">
          {!key ? (
            <label className="flex min-w-0 flex-1 items-center gap-2">
              <KeyRound size={13} aria-hidden="true" className="shrink-0 text-gray-dark-500" />
              <input
                type="password"
                value={keyInput}
                autoComplete="current-password"
                placeholder="the console's read key"
                onChange={(e) => setKeyInput(e.target.value)}
                className={field}
              />
            </label>
          ) : null}
          <input
            type="url"
            value={value}
            placeholder="paste the Figma link of the frame (Copy link to selection)"
            onChange={(e) => setValue(e.target.value)}
            className={field}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:opacity-40"
          >
            {busy ? "Writing…" : "Link"}
          </button>
          {/* An empty field is not a mistake: it is how a screen is declared to have no
              mockup behind it, which is a normal state of a composed drill-down. */}
          <span className="text-[11px] text-gray-dark-500">Empty ⇒ no mockup.</span>
        </form>
      ) : null}
      {error ? <p className="w-full text-[11px] text-pink-400">{error}</p> : null}
    </div>
  )
}

/** Whose first name goes into the commit. Read where the flow's own widgets left it, and
 *  never asked for here: a form that demands a name to accept a link is a form one closes. */
const whoami = (): string => {
  try {
    return (localStorage.getItem("feedback-author") ?? "").slice(0, 60)
  } catch {
    return ""
  }
}
