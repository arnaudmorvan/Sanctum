import { Check, UserRound } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { type Person, people, setAuthor, useAuthor } from "./who"

/** WHO SIGNS — the control that replaced the "Your first name" field of every form.
 *
 *  There were three of those fields (feedback, comment, thread), each re-typed on every
 *  note and each falling back to `anonymous`. A name is a property of the person, not of
 *  the message: it is asked once, shown where it applies, and changed from the same
 *  place.
 *
 *  Two states, one control:
 *   • KNOWN — a quiet line, "Arnaud", clickable to change. It does not compete with the
 *     text being written;
 *   • UNKNOWN — the same spot becomes the question, and the Send button next to it stays
 *     disabled. A note nobody can go back and question is worth less than the ten seconds
 *     it costs to say who is leaving it, and that is the whole argument for making it a
 *     step rather than a placeholder.
 *
 *  The picker offers the ACCESS REGISTRY when the browser holds the console key, and a
 *  text field always. Picking from the registry is what makes "Arnaud", "arnaud" and
 *  "Arnaud Morvan" stop being three people in the same feedback file. It is a choice,
 *  not an authentication — see `who.ts`. */

export const Signature = ({ compact }: { compact?: boolean }) => {
  const author = useAuthor()
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title={author ? "Sign as somebody else" : "Say who you are"}
        className={
          author
            ? "flex items-center gap-1 rounded px-1 py-0.5 text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
            : "flex items-center gap-1 rounded-md border border-blue-400/50 bg-blue-400/10 px-2 py-1 font-semibold text-[11px] text-blue-100 hover:bg-blue-400/20"
        }
      >
        <UserRound size={11} aria-hidden="true" />
        {author ? (compact ? author.split(" ")[0] : author) : "Who are you?"}
      </button>
      {open ? <Picker onClose={() => setOpen(false)} /> : null}
    </span>
  )
}

const Picker = ({ onClose }: { onClose: () => void }) => {
  const author = useAuthor()
  const [roster, setRoster] = useState<Person[]>([])
  const [typed, setTyped] = useState(author)
  const box = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    void people().then(setRoster)
  }, [])

  // Anywhere else, and it closes. A picker that needed its own X would be a third click
  // for a fact that takes one.
  useEffect(() => {
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) onClose()
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener("mousedown", away, true)
    window.addEventListener("keydown", key, true)
    return () => {
      document.removeEventListener("mousedown", away, true)
      window.removeEventListener("keydown", key, true)
    }
  }, [onClose])

  const choose = (name: string) => {
    if (!name.trim()) return
    setAuthor(name)
    onClose()
  }

  return (
    <div
      ref={box}
      className="absolute bottom-full left-0 z-10 mb-1 flex w-56 flex-col gap-1 rounded-lg border border-gray-dark-800 bg-gray-dark-950 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
    >
      {roster.length ? (
        <>
          <span className="px-1 text-[10px] text-gray-dark-600">From the access registry</span>
          {roster.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choose(p.name)}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-start text-white text-xs hover:bg-white/10"
            >
              <span className="truncate">{p.name}</span>
              {p.role ? <span className="text-[10px] text-gray-dark-500">{p.role}</span> : null}
              {p.name === author ? (
                <Check size={11} className="ms-auto text-green-400" aria-hidden="true" />
              ) : null}
            </button>
          ))}
          <span className="mt-1 border-gray-dark-800 border-t px-1 pt-1.5 text-[10px] text-gray-dark-600">
            Or a name
          </span>
        </>
      ) : null}
      <div className="flex items-center gap-1">
        <input
          // biome-ignore lint/a11y/noAutofocus: the picker exists to be typed into
          autoFocus={roster.length === 0}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") choose(typed)
          }}
          maxLength={60}
          placeholder="Your name"
          className="min-w-0 flex-1 rounded-md border border-gray-dark-800 bg-white/2 px-2 py-1 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
        />
        <button
          type="button"
          disabled={!typed.trim()}
          onClick={() => choose(typed)}
          className="rounded-md bg-white/10 px-2 py-1 font-semibold text-white text-xs hover:bg-white/15 disabled:opacity-40"
        >
          OK
        </button>
      </div>
    </div>
  )
}
