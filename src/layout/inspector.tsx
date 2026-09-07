import { useCallback, useEffect, useState } from "react"
import { IMPORTS_KIT } from "virtual:42-imports-kit"
import { UI_MARK } from "./target"

/** The origin inspector: what the screen REALLY owes to the kit.
 *
 *  The question it answers — "what is a `@42/ui-react` component, and what is written by
 *  hand?" — has no answer in the rendered DOM: a kit `Card` and a hand-rolled `div` are
 *  two `div`s. The answer comes from the source code, stamped at compile time by
 *  `scripts/babel-origin.mjs` as `data-42`.
 *
 *  What it counts, and what it does not:
 *   • only the elements of the flow's own files (`src/proto/`) carry the mark;
 *   • the chrome (sidebar, ambient background, this bar) is provided by the skeleton and
 *     therefore stays out of the count — it says nothing about how THIS screen is
 *     integrated;
 *   • the flow's local components are not marked: it is their inner elements that are,
 *     which is the right granularity.
 *
 *  The ratio shown is a measure of elements, not of areas: two layout `div`s around a
 *  `Card` make 33 %, whereas the area itself is well covered. It reads as an order of
 *  magnitude and as a LIST — the detail is what informs. */

type Count = { name: string; n: number }

const read = (): { kit: Count[]; hand: Count[] } => {
  const kit = new Map<string, number>()
  const hand = new Map<string, number>()
  for (const el of document.querySelectorAll<HTMLElement>("[data-42]")) {
    const v = el.dataset["42"] ?? ""
    const [origin, ...rest] = v.split(":")
    const name = rest.join(":")
    if (!name) continue
    const target = origin === "kit" ? kit : hand
    target.set(name, (target.get(name) ?? 0) + 1)
  }
  const sort = (m: Map<string, number>) =>
    [...m.entries()]
      .map(([name, n]) => ({ name, n }))
      .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name))
  return { kit: sort(kit), hand: sort(hand) }
}

export const Inspector = () => {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [data, setData] = useState<{ kit: Count[]; hand: Count[] }>({ kit: [], hand: [] })

  // Sampled on opening AND on every screen change: the hash drives the routing, so the
  // DOM changes underneath the panel if it stays open.
  const sample = useCallback(() => setData(read()), [])
  useEffect(() => {
    if (!open) return
    sample()
    window.addEventListener("hashchange", sample)
    return () => window.removeEventListener("hashchange", sample)
  }, [open, sample])

  useEffect(() => {
    const active = open && highlight
    document.documentElement.toggleAttribute("data-42-inspect", active)
    return () => document.documentElement.removeAttribute("data-42-inspect")
  }, [open, highlight])

  const nKit = data.kit.reduce((s, c) => s + c.n, 0)
  const nHand = data.hand.reduce((s, c) => s + c.n, 0)
  const total = nKit + nHand
  const ratio = total ? Math.round((nKit / total) * 100) : 0

  // Components the flow imports but that no mark revealed: they do not forward their props
  // down to the DOM (the `SegmentGroup` case). Without this line, a kit component would
  // vanish from the count and the ratio would understate the truth.
  const seen = new Set(data.kit.map((c) => c.name.split(".")[0]))
  const silent = open ? IMPORTS_KIT.filter((n) => !seen.has(n)) : []

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`ms-auto rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          open
            ? "bg-white/10 font-semibold text-white"
            : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        Components
      </button>

      {open && (
        <div
          {...{ [UI_MARK]: "" }}
          className="fixed inset-x-0 bottom-11 z-50 max-h-[60vh] overflow-y-auto border-gray-dark-800 border-t bg-gray-dark-950/98 px-4 py-4 backdrop-blur"
          role="dialog"
          aria-label="Origin of the screen's components"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-semibold text-sm text-white">
                  {ratio}% from the kit
                </span>
                <span className="text-gray-dark-400 text-xs">
                  {nKit} @42/ui-react element{nKit > 1 ? "s" : ""} · {nHand} written by hand
                </span>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-gray-dark-400 text-xs">
                <input
                  type="checkbox"
                  checked={highlight}
                  onChange={(e) => setHighlight(e.target.checked)}
                  className="accent-pink-400"
                />
                Highlight in the screen
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Column
                title="Kit components"
                subtitle="imported from @42/ui-react"
                dot="bg-green-400"
                items={data.kit}
                empty="No kit component on this screen."
              />
              <Column
                title="Written by hand"
                subtitle="HTML elements placed in the flow"
                dot="bg-pink-400"
                items={data.hand}
                empty="Nothing written by hand."
              />
            </div>

            {silent.length > 0 && (
              <div className="flex flex-col gap-1 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2">
                <span className="text-gray-dark-300 text-xs">
                  <span className="font-semibold">Imported but not detected</span> — these kit
                  components really are used by the screen, but they do not forward their props
                  down to the DOM: they escape both the count and the highlighting.
                </span>
                <span className="font-mono text-gray-dark-200 text-xs">{silent.join(" · ")}</span>
              </div>
            )}

            <p className="text-gray-dark-500 text-xs leading-relaxed">
              A measure of elements, not of areas: two layout{" "}
              <code className="font-mono">div</code>s around a card weigh as much as the card.
              The chrome (sidebar, background, this bar) comes from the skeleton and is not
              counted. The origin is read from the source code at compile time, not guessed in
              the DOM.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

const Column = ({
  title,
  subtitle,
  dot,
  items,
  empty,
}: {
  title: string
  subtitle: string
  dot: string
  items: Count[]
  empty: string
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline gap-2">
      <span className={`size-2 rounded-full ${dot}`} />
      <span className="font-semibold text-sm text-white">{title}</span>
      <span className="text-gray-dark-500 text-xs">{subtitle}</span>
    </div>
    {items.length === 0 ? (
      <span className="text-gray-dark-500 text-xs italic">{empty}</span>
    ) : (
      <ul className="flex flex-col gap-1">
        {items.map((c) => (
          <li key={c.name} className="flex items-baseline justify-between gap-3">
            <span className="truncate font-mono text-gray-dark-200 text-xs">{c.name}</span>
            <span className="font-mono text-gray-dark-400 text-xs tabular-nums">×{c.n}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)
