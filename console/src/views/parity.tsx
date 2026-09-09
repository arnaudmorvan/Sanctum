/** The Parity tab — the Figma catalogue and `@42/ui-react`, side by side.
 *
 *  Until this tab there was one answer to "what does the kit have that the file does not,
 *  and the other way round": `audit/parity-figma-vs-react.md`, hand-written in July 2026
 *  and stale the week after. It counted 29 pairs. There are 43, and nothing said so.
 *
 *  Three things are on this page, in the order a front-end dev needs them:
 *
 *    1. **Where the two sides come from and how fresh they are.** First, deliberately. A
 *       comparison against a stale snapshot looks exactly like a fresh one, and a report
 *       whose provenance is buried is a report nobody dares expire;
 *    2. **The findings, grouped by OWNER** — the kit moves, the file moves, or nobody can
 *       settle it alone. That grouping is the whole difference between an audit and
 *       something to act on, and it is why the copy button exists: this console is not
 *       where a dev works, so the list has to leave with them;
 *    3. **The pairs**, one row each, with the component RENDERED on both sides — Figma's
 *       own PNG against the live `@42/ui-react` component mounted in this browser. Two
 *       tables of prop names would answer "do the axes match" and never "does the built
 *       thing look like the drawn thing".
 *
 *  ⚠️ **The verdicts are computed server-side** (`parity.py`) and this file only paints
 *  them. That is not an accident of layering: the classification encodes the four
 *  documented model divergences — `variant` × `color`, the `Field` extraction, runtime
 *  states, the `size` scale — and it belongs where it is tested offline, not in a browser.
 *
 *  Nothing here writes. The Figma-side findings are candidates for `ds-actions.yaml`,
 *  which the MCP server writes after a human said so; a console that filed them itself
 *  would be a second writer on a file the triage already corrupted once.
 */
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import {
  ArrowRight,
  Check,
  Copy,
  Grid3x3,
  ImageOff,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react"
import { type ReactNode, useCallback, useEffect, useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  AccessError,
  type Coverage,
  type CoverageAxis,
  type CoverageCombo,
  getParity,
  getParityBrief,
  getParityDetail,
  getParityFrame,
  type ParityAxis,
  type ParityFinding,
  type ParityPair,
  type ParityReport,
  readKey,
} from "../mcp"
import { NOT_PREVIEWABLE, PREVIEWS, PreviewBoundary } from "./previews"

// ---------------------------------------------------------------- vocabulary

/** A verdict's colour and, more importantly, its ONE-LINE MEANING. The words matter more
 *  than the colours here: `composed` and `unpaired` look alike on a screen and are
 *  opposite statements — one is "React does this with children", the other "this lands
 *  nowhere". Painting them the same was how the first pass read as 50 defects. */
const VERDICT: Record<string, { color: string; label: string; means: string }> = {
  aligned: { color: "green", label: "aligned", means: "Same axis, same values." },
  values: {
    color: "orange",
    label: "values differ",
    means: "Same axis on both sides, different value sets.",
  },
  "by-design": {
    color: "blue",
    label: "by design",
    means: "A divergence the two models owe each other — not a defect.",
  },
  composed: {
    color: "gray",
    label: "composed",
    means: "No prop of its own: in React the region is children. A question, not a hole.",
  },
  unreadable: {
    color: "purple",
    label: "not readable",
    means: "The manifest cannot see the values — a cva outside the file, a type alias. Says nothing about the kit.",
  },
  "code-only": {
    color: "gray",
    label: "code only",
    means: "The kit has this axis; nothing in Figma draws it.",
  },
  unpaired: {
    color: "red",
    label: "unpaired",
    means: "Lands nowhere in the code. The only verdict that is a plain hole.",
  },
}

const OWNER: Record<string, { label: string; hint: string; color: string }> = {
  kit: {
    label: "For the kit",
    hint: "@42/ui-react has to move: a value is drawn and cannot be rendered.",
    color: "blue",
  },
  both: {
    label: "To settle together",
    hint: "Neither side can decide alone — two defaults for the same component.",
    color: "purple",
  },
  figma: {
    label: "For the Figma file",
    hint: "The file has to move: an unnamed axis, a missing description, a diverging name.",
    color: "orange",
  },
}

const SEVERITY: Record<string, string> = { high: "red", medium: "orange", low: "gray" }

// ---------------------------------------------------------------- the two sides rendered

/** The Figma frame — fetched only when the card actually comes into view.
 *
 *  ⚠️ Not an optimisation. Every one of these is a RENDER JOB on Figma's side, one to
 *  three seconds each; forty-four fired on tab open (which is what the first version did)
 *  is forty-four jobs queued against someone else's rate limit for a page whose reader
 *  will scroll past most of them. The observer starts the fetch a screen ahead
 *  (`rootMargin`), so a frame is normally there by the time the card is.
 *
 *  The URL that comes back is Figma's own CDN — the image never crosses the MCP server. */
const FigmaFrame = ({ slug, variant }: { slug: string; variant: string }) => {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [seen, setSeen] = useState(false)
  const [box, setBox] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!box || seen) return
    // No IntersectionObserver (an old browser, a test runner): load rather than never
    // show anything. Degrading to the eager behaviour is the safe direction here.
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: "600px" },
    )
    io.observe(box)
    return () => io.disconnect()
  }, [box, seen])

  useEffect(() => {
    if (!seen) return
    let alive = true
    setLoading(true)
    setError("")
    setUrl("")
    getParityFrame(slug, variant)
      .then((r) => alive && setUrl(r.url))
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [slug, variant, seen])

  if (!seen) return <div ref={setBox} className="h-24 w-full" />
  if (loading)
    return (
      <div className="flex h-24 items-center justify-center">
        <Spinner size="sm" />
      </div>
    )
  if (error || !url)
    return (
      <div className="flex h-24 flex-col items-center justify-center gap-1 text-center">
        <ImageOff size={16} className="text-gray-dark-500" />
        <Text size="xs" c="muted">
          {error || "No frame."}
        </Text>
      </div>
    )
  return (
    <img
      src={url}
      alt={`${slug} rendered by Figma`}
      className="max-h-64 max-w-full object-contain"
    />
  )
}

/** The live component. `NOT_PREVIEWABLE` and "no preview written" are two different
 *  statements and both are said out loud — a blank cell next to a Figma frame reads as
 *  "the kit renders nothing", which is a lie about the kit. */
const KitPreview = ({ name }: { name: string }) => {
  const render = PREVIEWS[name]
  if (render)
    return (
      <PreviewBoundary name={name}>
        <div className="flex max-w-full items-center justify-center overflow-x-auto">
          {render()}
        </div>
      </PreviewBoundary>
    )
  const why = NOT_PREVIEWABLE[name]
  return (
    <Text size="xs" c="muted" className="text-center">
      {why ?? "No preview written for this component yet."}
    </Text>
  )
}

// ---------------------------------------------------------------- the coverage grid

/** What a cell IS, and the four words are the whole tool. `figma-only` is the one that
 *  costs a screen: a mockup uses a combination the code cannot render. */
const CELL = {
  both: {
    ring: "border-white/10",
    dot: "bg-green-500",
    label: "in Figma and in the kit",
    short: "both sides",
  },
  "kit-only": {
    ring: "border-white/10 opacity-45",
    dot: "bg-gray-500",
    label: "in the kit only — nobody drew it",
    short: "kit only",
  },
  "figma-only": {
    ring: "border-red-500/60 bg-red-500/5",
    dot: "bg-red-500",
    label: "in Figma only — the kit refuses this value",
    short: "Figma only",
  },
  neither: {
    ring: "border-dashed border-white/8",
    dot: "",
    label: "in neither",
    short: "neither",
  },
} as const

type CellState = keyof typeof CELL

/** The coverage matrix: two axes crossed, one live React render per cell.
 *
 *  ⚠️ This exists because the pair card answered the wrong question. It showed ONE Figma
 *  frame and ONE React default; on `Badge` that is one cell out of ninety-six drawn and
 *  sixty renderable, so "where is the hole" was not answerable by looking. Here a whole
 *  column reads red when a hue is drawn and refused (`grey`), and a whole column reads
 *  faded when the kit ships something nobody ever drew (`gradient`).
 *
 *  The cells render the KIT, not Figma, and that is a deliberate asymmetry: a React render
 *  is free and instant, where sixty Figma frames would be sixty render jobs of one to three
 *  seconds against someone else's rate limit. Figma's own drawing of one exact combination
 *  is a click away — which is the gesture you make once you have spotted the odd cell. */
const CoverageGrid = ({
  slug,
  react,
  cov,
  dark,
  frames,
}: {
  slug: string
  react: string
  cov: Coverage
  dark: boolean
  frames: boolean
}) => {
  const axes = cov.axes
  // Default to the two widest axes, `variant` and `color` first when they exist: that is
  // the pair a designer means by "the colours next to each other".
  const preferred = (names: string[]) =>
    names.find((n) => axes.some((a) => a.axis === n)) ?? ""
  const widest = [...axes].sort((a, b) => b.figma.length + b.kit.length - a.figma.length - a.kit.length)
  const [rowAxis, setRowAxis] = useState(
    preferred(["variant", "variants", "type", "style"]) || widest[0]?.axis || "",
  )
  const [colAxis, setColAxis] = useState(
    preferred(["color"]) || widest.find((a) => a.axis !== rowAxis)?.axis || "",
  )
  const [fixed, setFixed] = useState<Record<string, string>>({})
  const [zoom, setZoom] = useState<CoverageCombo | null>(null)

  const find = (name: string) => axes.find((a) => a.axis === name)
  const rowDef = find(rowAxis)
  const colDef = find(colAxis)
  if (!rowDef || !colDef || rowAxis === colAxis)
    return (
      <Text size="xs" c="muted">
        This component varies on a single axis — the table above already says everything a
        grid could.
      </Text>
    )

  // The union of both sides, so a value only ONE side has still gets its row: those are
  // exactly the rows worth looking at.
  const union = (a: CoverageAxis) => {
    const seen = new Map<string, string>()
    for (const v of [...a.figma, ...a.kit]) if (!seen.has(v.toLowerCase())) seen.set(v.toLowerCase(), v)
    return [...seen.values()]
  }
  const rows = union(rowDef)
  const cols = union(colDef)
  const others = axes.filter((a) => a.axis !== rowAxis && a.axis !== colAxis)

  const matching = (r: string, c: string) =>
    cov.combinations.filter(
      (k) =>
        k.values[rowAxis]?.toLowerCase() === r.toLowerCase() &&
        k.values[colAxis]?.toLowerCase() === c.toLowerCase() &&
        others.every((o) => !fixed[o.axis] || k.values[o.axis] === fixed[o.axis]),
    )

  const inKit = (a: CoverageAxis, v: string) =>
    // ⚠️ An axis whose values the manifest cannot read is treated as ACCEPTING the value.
    // The alternative is painting a whole grid red on the strength of what this report
    // cannot see — the accusation the whole module refuses to make.
    !a.readable || a.kit.some((k) => k.toLowerCase() === v.toLowerCase())

  const state = (r: string, c: string): CellState => {
    const drawn = matching(r, c).length > 0
    const renderable = inKit(rowDef, r) && inKit(colDef, c)
    if (drawn && renderable) return "both"
    if (drawn) return "figma-only"
    return renderable ? "kit-only" : "neither"
  }

  const props = (r: string, c: string): Record<string, unknown> => {
    const out: Record<string, unknown> = {}
    for (const [axis, value] of [
      [rowDef, r],
      [colDef, c],
    ] as const)
      if (axis.react && axis.readable) out[axis.react] = value
    for (const o of others)
      if (fixed[o.axis] && o.react && o.readable) out[o.react] = fixed[o.axis]
    return out
  }

  const cells = rows.length * cols.length
  const drawnCells = rows.reduce(
    (n, r) => n + cols.filter((c) => state(r, c) === "both").length,
    0,
  )
  const renderableCells = rows.reduce(
    (n, r) => n + cols.filter((c) => state(r, c) !== "neither" && state(r, c) !== "figma-only").length,
    0,
  )

  const Picker = ({
    value,
    onChange,
    label,
  }: {
    value: string
    onChange: (v: string) => void
    label: string
  }) => (
    <label className="flex items-center gap-1 text-gray-dark-500 text-xs">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${TYPO.mono()} rounded border border-white/15 bg-transparent px-1.5 py-0.5 text-gray-dark-200 text-xs`}
      >
        {axes.map((a) => (
          <option key={a.axis} value={a.axis} className="bg-gray-dark-900">
            {a.axis}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Picker label="rows" value={rowAxis} onChange={setRowAxis} />
        <Picker label="columns" value={colAxis} onChange={setColAxis} />
        {others.map((o) => (
          <label key={o.axis} className="flex items-center gap-1 text-gray-dark-500 text-xs">
            {o.axis}
            <select
              value={fixed[o.axis] ?? ""}
              onChange={(e) => setFixed((f) => ({ ...f, [o.axis]: e.target.value }))}
              className={`${TYPO.mono()} rounded border border-white/15 bg-transparent px-1.5 py-0.5 text-gray-dark-200 text-xs`}
            >
              <option value="" className="bg-gray-dark-900">
                any
              </option>
              {union(o).map((v) => (
                <option key={v} value={v} className="bg-gray-dark-900">
                  {v}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {/* ⚠️ The answer, IN WORDS, above the grid. The first version encoded it in the
          border colour of a cell and left the reader to decode it through a legend at the
          bottom of the page — which is not an answer to "what is missing on which side",
          it is a puzzle whose solution happens to be one. The colours stay; they are now a
          second reading of a sentence, not the only one. */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 p-3">
        <Text size="sm">
          <strong>{drawnCells}</strong> of the {renderableCells} combinations the kit can
          render are drawn in Figma.
          {cells !== renderableCells
            ? ` ${cells - renderableCells} more cell${cells - renderableCells > 1 ? "s" : ""} exist${cells - renderableCells > 1 ? "" : "s"} on one side only.`
            : ""}
        </Text>
        {[rowDef, colDef].map((a) => (
          <div key={a.axis} className="flex flex-col gap-0.5">
            {a.only_figma.length > 0 ? (
              <Text size="xs" className="text-red-300">
                <code className={TYPO.mono()}>{a.axis}</code>: Figma draws{" "}
                <strong>{a.only_figma.join(", ")}</strong> — the kit does not accept
                {a.only_figma.length > 1 ? " those values" : " that value"}, so
                {a.axis === rowAxis ? " those rows" : " those columns"} cannot be built.
              </Text>
            ) : null}
            {a.only_kit.length > 0 ? (
              <Text size="xs" c="muted">
                <code className={TYPO.mono()}>{a.axis}</code>: the kit ships{" "}
                <strong>{a.only_kit.join(", ")}</strong> — nothing in Figma draws
                {a.only_kit.length > 1 ? " them" : " it"}.
              </Text>
            ) : null}
            {!a.readable ? (
              <Text size="xs" c="muted">
                <code className={TYPO.mono()}>{a.axis}</code>: the manifest cannot read the
                kit's values here, so every cell is given the benefit of the doubt.
              </Text>
            ) : null}
          </div>
        ))}
        {rowDef.only_figma.length === 0 &&
        rowDef.only_kit.length === 0 &&
        colDef.only_figma.length === 0 &&
        colDef.only_kit.length === 0 ? (
          <Text size="xs" c="muted">
            Both axes hold the same values on both sides — what is left is which
            combinations were drawn.
          </Text>
        ) : null}
      </div>

      {/* The legend, ABOVE the grid and showing real cells: a swatch of the thing itself
          beats a dot that has to be matched to a sentence forty rows further down. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-dark-400">
        {(Object.keys(CELL) as CellState[]).map((k) => (
          <span key={k} className="flex items-center gap-1.5">
            <span
              className={`relative h-5 w-8 rounded border ${CELL[k].ring} ${
                dark ? "bg-black/20" : "bg-white"
              }`}
            >
              {CELL[k].dot ? (
                <span
                  className={`absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full ${CELL[k].dot}`}
                />
              ) : null}
            </span>
            {CELL[k].label}
          </span>
        ))}
        {frames ? <span>· click a drawn cell to see Figma's own render of it</span> : null}
      </div>

      {cols.length > 6 ? (
        <Text size="xs" c="muted">
          {cols.length} columns — the grid scrolls sideways; the row labels stay put.
        </Text>
      ) : null}

      {/* ⚠️ No edge fade here, and that was tried first: a permanent mask on the trailing
          40px hides the LAST column once you have scrolled to the end, which is worse than
          the clipping it was meant to explain. The line above says the grid scrolls; a
          sentence that is always true beats a gradient that lies at one end of the range. */}
      <div className="overflow-x-auto" data-theme={dark ? "dark" : "light"}>
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th className={`sticky left-0 z-10 ${dark ? "bg-gray-dark-950" : "bg-white"}`} />
              {cols.map((c) => (
                <th key={c} className="px-1 pb-1 text-center font-normal">
                  <div
                    className={`${TYPO.mono()} text-[11px] ${
                      inKit(colDef, c) ? "text-gray-dark-400" : "text-red-400"
                    }`}
                  >
                    {c}
                  </div>
                  {/* The side is NAMED on the header, not left to the colour. Red-on-dark
                      at 11px is not a statement anyone should have to decode. */}
                  {!inKit(colDef, c) ? (
                    <div className="text-[10px] text-red-400">Figma only</div>
                  ) : !colDef.figma.some((v) => v.toLowerCase() === c.toLowerCase()) ? (
                    <div className="text-[10px] text-gray-dark-600">kit only</div>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                {/* Sticky: `color` alone is thirteen columns wide once both sides' values
                    are unioned, so the grid scrolls — and a row whose label has scrolled
                    off is a row of anonymous swatches. */}
                <th
                  className={`sticky left-0 z-10 pr-2 text-right font-normal ${
                    dark ? "bg-gray-dark-950" : "bg-white"
                  }`}
                >
                  <div
                    className={`${TYPO.mono()} text-[11px] ${
                      inKit(rowDef, r) ? "text-gray-dark-400" : "text-red-400"
                    }`}
                  >
                    {r}
                  </div>
                  {!inKit(rowDef, r) ? (
                    <div className="text-[10px] text-red-400">Figma only</div>
                  ) : !rowDef.figma.some((v) => v.toLowerCase() === r.toLowerCase()) ? (
                    <div className="text-[10px] text-gray-dark-600">kit only</div>
                  ) : null}
                </th>
                {cols.map((c) => {
                  const s = state(r, c)
                  const hits = matching(r, c)
                  const tone = CELL[s]
                  const clickable = hits.length > 0 && frames
                  return (
                    <td key={c}>
                      {/* ⚠️ A div, not a button. Half of these cells render a Button, an
                          ActionIcon or a Select — a <button> inside a <button> is invalid
                          HTML, and React said so on every render. `pointer-events-none` on
                          the preview settles the other half of the problem: sixty live
                          selects that steal the click and take focus are not something a
                          coverage grid wants either. */}
                      {/* biome-ignore lint/a11y/useSemanticElements: see above — the cell
                          cannot be a <button> because its content often is one. */}
                      <div
                        role={clickable ? "button" : undefined}
                        tabIndex={clickable ? 0 : undefined}
                        title={`${rowAxis}=${r} · ${colAxis}=${c} — ${tone.label}`}
                        onClick={clickable ? () => setZoom(hits[0]) : undefined}
                        onKeyDown={
                          clickable
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  setZoom(hits[0])
                                }
                              }
                            : undefined
                        }
                        className={`relative flex h-14 w-24 items-center justify-center overflow-hidden rounded border p-1 ${tone.ring} ${
                          dark ? "bg-black/20" : "bg-white"
                        } ${clickable ? "cursor-pointer" : "cursor-default"}`}
                      >
                        {s === "neither" ? null : (
                          <PreviewBoundary name={react}>
                            <div className="pointer-events-none scale-90">
                              {PREVIEWS[react]?.(props(r, c))}
                            </div>
                          </PreviewBoundary>
                        )}
                        {tone.dot ? (
                          <span
                            className={`absolute top-1 right-1 h-1.5 w-1.5 rounded-full ${tone.dot}`}
                          />
                        ) : null}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Said out loud rather than swallowed: an undecoded key-variant is a combination
          missing from this grid, so the count above is short by that many. */}
      {cov.unparsed.length > 0 ? (
        <Text size="xs" className="text-orange-300">
          {cov.unparsed.length} Figma variant name{cov.unparsed.length > 1 ? "s" : ""} could
          not be decoded ({cov.unparsed.slice(0, 3).join(", ")}
          {cov.unparsed.length > 3 ? "…" : ""}): those combinations are missing here.
        </Text>
      ) : null}

      {zoom ? (
        <div className="rounded-lg border border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <code className={`${TYPO.mono()} text-gray-dark-300 text-xs`}>{zoom.variant}</code>
            <button
              type="button"
              className="text-gray-dark-500 text-xs hover:text-gray-dark-200"
              onClick={() => setZoom(null)}
            >
              close
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex min-h-24 items-center justify-center">
              <FigmaFrame slug={slug} variant={zoom.variant} />
            </div>
            <div
              className={`flex min-h-24 items-center justify-center rounded ${
                dark ? "bg-black/20" : "bg-white"
              } p-3`}
            >
              <PreviewBoundary name={react}>
                {PREVIEWS[react]?.(
                  Object.fromEntries(
                    Object.entries(zoom.values)
                      .map(([axis, v]) => [find(axis)?.react || "", v])
                      .filter(([k]) => k),
                  ),
                )}
              </PreviewBoundary>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- one axis row

const AxisRow = ({ a }: { a: ParityAxis }) => {
  const v = VERDICT[a.verdict] ?? VERDICT.unpaired
  return (
    <tr className="border-white/6 border-t align-top">
      <td className="py-1.5 pr-3">
        <code className={`${TYPO.mono()} text-gray-dark-200 text-xs`}>{a.axis || "—"}</code>
        <div className="text-gray-dark-500 text-[11px]">{a.nature}</div>
      </td>
      <td className="py-1.5 pr-3 text-gray-dark-300 text-xs">
        {a.figma.length > 0 ? a.figma.join(" · ") : "—"}
        {a.figma_default ? (
          <span className="text-gray-dark-500"> (default {a.figma_default})</span>
        ) : null}
      </td>
      <td className="py-1.5 pr-3">
        <ArrowRight size={12} className="text-gray-dark-600" />
      </td>
      <td className="py-1.5 pr-3 text-xs">
        <code className={`${TYPO.mono()} text-gray-dark-200`}>{a.react || "—"}</code>
        {a.register ? <span className="text-gray-dark-500"> · {a.register}</span> : null}
        <div className="text-gray-dark-300">
          {a.react_values.length > 0 ? a.react_values.join(" · ") : ""}
          {a.react_default ? (
            <span className="text-gray-dark-500"> (default {a.react_default})</span>
          ) : null}
        </div>
      </td>
      <td className="py-1.5">
        <Badge color={v.color} size="sm" variant="light">
          {v.label}
        </Badge>
        {a.missing_in_kit && a.missing_in_kit.length > 0 ? (
          <div className="mt-1 text-[11px] text-orange-300">
            not in the kit: {a.missing_in_kit.join(", ")}
          </div>
        ) : null}
        {a.missing_in_figma && a.missing_in_figma.length > 0 ? (
          <div className="mt-1 text-[11px] text-gray-dark-400">
            not drawn: {a.missing_in_figma.join(", ")}
          </div>
        ) : null}
        {a.note ? (
          <div className="mt-1 max-w-md text-[11px] text-gray-dark-500">{a.note}</div>
        ) : null}
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------- one pair

const Pair = ({ pair, dark, frames }: { pair: ParityPair; dark: boolean; frames: boolean }) => {
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState("")
  const holes = pair.axes.filter((a) => a.verdict === "values" || a.verdict === "unpaired")
  // ⚠️ "aligned" and "nothing could be compared" are not the same statement, and the first
  // version said the former for both: `Alert` showed a green tick while BOTH its axes were
  // unreadable (its cva lives in `alertRoot`). A green tick on an unmeasured component is
  // the one thing this tab must never print.
  const [covOpen, setCovOpen] = useState(false)
  const [cov, setCov] = useState<Coverage | null>(null)
  const [covError, setCovError] = useState("")
  const blind = pair.axes.filter((a) => a.verdict === "unreadable")
  const comparable = pair.axes.length > blind.length

  return (
    <Card>
      <Card.Header>
        <div className="flex flex-wrap items-center gap-2">
          <Card.Title>{pair.react}</Card.Title>
          <code className={`${TYPO.mono()} text-gray-dark-500 text-xs`}>
            {pair.figma.slug}
          </code>
          {pair.category ? (
            <Badge color="gray" size="sm" variant="outline">
              {pair.category}
            </Badge>
          ) : null}
          {holes.length > 0 ? (
            <Badge color="orange" size="sm">
              {holes.length} difference{holes.length > 1 ? "s" : ""}
            </Badge>
          ) : comparable ? (
            <Badge color="green" size="sm">
              <Check size={13} />
              aligned
            </Badge>
          ) : (
            <Badge color="purple" size="sm" variant="light">
              nothing comparable
            </Badge>
          )}
          {blind.length > 0 && comparable ? (
            <Badge color="purple" size="sm" variant="light">
              {blind.length} axis{blind.length > 1 ? "es" : ""} not readable
            </Badge>
          ) : null}
          {!pair.figma.described ? (
            <Badge color="orange" size="sm" variant="outline">
              no description in Figma
            </Badge>
          ) : null}
        </div>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-4">
          {/* The two sides, at the same width so the eye can actually compare them. */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Text size="xs" c="muted">
                  Figma · {pair.figma.page.trim()}
                </Text>
                {pair.figma.variant_count > 0 ? (
                  <span className={`${TYPO.mono()} text-gray-dark-500 text-[11px]`}>
                    {pair.figma.variant_count} variants
                  </span>
                ) : null}
              </div>
              <div className="flex min-h-24 items-center justify-center">
                {frames ? (
                  <FigmaFrame slug={pair.figma.slug} variant={variant} />
                ) : (
                  // Said once, plainly, rather than forty failed fetches: the server has
                  // no FIGMA_TOKEN, so nothing here can render — and that is a
                  // configuration fact, not a fault of this component.
                  <Text size="xs" c="muted" className="text-center">
                    No FIGMA_TOKEN on the server: the comparison works, the picture cannot
                    be rendered.
                  </Text>
                )}
              </div>
            </div>
            <div
              className="rounded-lg border border-white/10 p-3"
              data-theme={dark ? "dark" : "light"}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Text size="xs" c="muted">
                  {pair.import ? "@42/ui-react" : "the kit"}
                </Text>
                <code className={`${TYPO.mono()} text-gray-dark-500 text-[11px]`}>
                  {pair.snippet}
                </code>
              </div>
              <div
                className={`flex min-h-24 items-center justify-center rounded ${
                  dark ? "bg-black/20" : "bg-white"
                } p-3`}
              >
                <KitPreview name={pair.react} />
              </div>
            </div>
          </div>

          {/* The axes. Open on demand: a healthy component is ten rows of "aligned", and
              the reader came for the differences. */}
          <div>
            {/* The grid is fetched on demand, per component: `buttonsbutton-` alone
                carries 300 named variants, and forty of those in the list payload is a
                megabyte nobody scrolls. */}
            {pair.figma.variant_count > 1 ? (
              <button
                type="button"
                className="mr-4 cursor-pointer text-gray-dark-400 text-xs hover:text-gray-dark-200"
                onClick={() => {
                  if (cov) return setCovOpen((o) => !o)
                  setCovOpen(true)
                  setCovError("")
                  getParityDetail(pair.figma.slug, pair.react)
                    .then((d) => setCov(d.coverage))
                    .catch((e: Error) => setCovError(e.message))
                }}
              >
                <Grid3x3 size={12} className="mr-1 inline" />
                {covOpen ? "Hide" : "Show"} the coverage grid
              </button>
            ) : null}
            {pair.axes.length === 0 ? (
              <Text size="xs" c="muted">
                This Figma component declares no axis and no property: there is nothing to
                compare but the drawing itself.
              </Text>
            ) : (
              <button
                type="button"
                className="cursor-pointer text-gray-dark-400 text-xs hover:text-gray-dark-200"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? "Hide" : "Show"} the {pair.axes.length} ax
                {pair.axes.length > 1 ? "es" : "is"}
              </button>
            )}
            {open ? (
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-dark-500 text-[11px] uppercase">
                      <th className="pb-1 pr-3 font-normal">Figma axis</th>
                      <th className="pb-1 pr-3 font-normal">drawn</th>
                      <th />
                      <th className="pb-1 pr-3 font-normal">in the kit</th>
                      <th className="pb-1 font-normal">verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pair.axes.map((a) => (
                      <AxisRow key={`${a.axis}-${a.react}`} a={a} />
                    ))}
                  </tbody>
                </table>
                {pair.figma.variant_count > 1 ? (
                  <div className="mt-3 flex items-center gap-2">
                    <Text size="xs" c="muted">
                      Render another Figma variant:
                    </Text>
                    <input
                      className={`${TYPO.mono()} rounded border border-white/15 bg-transparent px-2 py-1 text-xs text-gray-dark-200`}
                      placeholder="variant-outline-type-error"
                      defaultValue={variant}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          setVariant((e.target as HTMLInputElement).value.trim())
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {covOpen ? (
            covError ? (
              <Text size="xs" className="text-orange-300">
                {covError}
              </Text>
            ) : cov ? (
              <CoverageGrid
                slug={pair.figma.slug}
                react={pair.react}
                cov={cov}
                dark={dark}
                frames={frames}
              />
            ) : (
              <div className="flex items-center gap-2 py-2">
                <Spinner size="sm" />
                <Text size="xs" c="muted">
                  Decoding the drawn combinations…
                </Text>
              </div>
            )
          ) : null}

          {pair.others.length > 0 ? (
            <Text size="xs" c="muted">
              Also on this Figma page:{" "}
              {pair.others.map((o) => o.slug).join(", ")} — page blocks or private parts,
              not library components. If they are neither, they belong on another page.
            </Text>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  )
}

// ---------------------------------------------------------------- the page

const Finding = ({ f }: { f: ParityFinding }) => (
  <li className="border-white/6 border-t py-2 first:border-t-0">
    <div className="flex flex-wrap items-baseline gap-2">
      <Badge color={SEVERITY[f.severity]} size="sm" variant="light">
        {f.severity}
      </Badge>
      <Text size="sm" className={TYPO.title("semibold")}>
        {f.title}
      </Text>
    </div>
    <Text size="sm" c="secondary" className="mt-1">
      {f.detail}
    </Text>
    {f.evidence ? (
      <div className={`${TYPO.mono()} mt-1 text-[11px] text-gray-dark-500`}>{f.evidence}</div>
    ) : null}
  </li>
)

/** Where the two sides come from, and how fresh each is. FIRST on the page on purpose: a
 *  parity report is only worth its provenance, and the failure mode this whole tab exists
 *  to prevent — a stale catalogue that looks current — starts here. */
const Sources = ({ s }: { s: ParityReport["sources"] }) => {
  const live = s.react.mode === "live"
  return (
    <Card variant="outline" padding="sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Text size="xs" c="muted">
            Figma
          </Text>
          <Text size="sm">
            {s.figma.ds_name || "the DS file"}{" "}
            <span className={`${TYPO.mono()} text-gray-dark-500`}>
              · synced {s.figma.generated_at || "?"}
            </span>
          </Text>
          <Text size="xs" c="muted" className="mt-1">
            Written by the “42 — Sync Design System” plugin. Re-run a sync in Figma to
            refresh this side.
          </Text>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Text size="xs" c="muted">
              React
            </Text>
            <Badge color={live ? "green" : "orange"} size="sm" variant="light">
              {live ? "scanned live" : "snapshot"}
            </Badge>
          </div>
          <Text size="sm">
            {s.react.package} {s.react.version}{" "}
            <span className={`${TYPO.mono()} text-gray-dark-500`}>· {s.react.origin}</span>
          </Text>
          {s.react.note ? (
            <Text size="xs" className="mt-1 text-orange-300">
              {s.react.note}
            </Text>
          ) : null}
          {s.react.error ? (
            <Text size="xs" className="mt-1 text-orange-300">
              {s.react.error}
            </Text>
          ) : null}
          {/* The one thing a live scan is FOR: saying the committed snapshot has drifted,
              which is invisible from anywhere else. */}
          {live && (s.react.snapshot_stale?.length ?? 0) > 0 ? (
            <Text size="xs" className="mt-1 text-orange-300">
              The committed ui-manifest.json disagrees on{" "}
              {s.react.snapshot_stale?.join(", ")} — regenerate it with{" "}
              <code className={TYPO.mono()}>python3 tools/gen-ui-manifest.py &lt;kit&gt;</code>.
            </Text>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export const ParityView = () => {
  const key = readKey()
  const [data, setData] = useState<ParityReport | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dark, setDark] = useState(true)
  const [owner, setOwner] = useState<"kit" | "both" | "figma">("kit")

  const load = useCallback(
    (fresh: boolean) => {
      if (!key) return
      setLoading(true)
      setError("")
      getParity(fresh)
        .then(setData)
        .catch((e: Error) =>
          setError(
            e instanceof AccessError
              ? "Key rejected. It is DASHBOARD_KEY, in the MCP service variables."
              : e.message,
          ),
        )
        .finally(() => setLoading(false))
    },
    [key],
  )

  useEffect(() => {
    load(false)
  }, [load])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(await getParityBrief())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  if (!key)
    return (
      <Alert
        type="info"
        variant="outline"
        title="This section reads the MCP server: it needs the read key."
        description="It is the DASHBOARD_KEY variable of the MCP service. It stays in your browser."
      />
    )
  if (error && !data)
    return <Alert color="red" variant="light" title="Cannot read" description={error} />
  if (!data)
    return (
      <div className="flex items-center gap-2 py-8">
        <Spinner size="sm" />
        <Text c="secondary">Comparing the two catalogues…</Text>
      </div>
    )

  const c = data.counts
  const grouped = data.findings.filter((f) => f.owner === owner)

  return (
    <div className="flex flex-col gap-6">
      <Sources s={data.sources} />

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => load(true)} disabled={loading}>
          <RefreshCw size={14} />
          {loading ? "Rescanning…" : "Rescan"}
        </Button>
        <Button size="sm" variant="outline" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy the brief"}
        </Button>
        <Button size="sm" variant="subtle" onClick={() => setDark((d) => !d)}>
          {dark ? <Moon size={14} /> : <Sun size={14} />}
          {dark ? "Dark" : "Light"} previews
        </Button>
        <Text size="xs" c="muted">
          The Figma file defaults to Dark — match it here to compare like for like.
        </Text>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Paired", c.pairs],
          ["In Figma only", c.figma_only],
          ["In the kit only", c.react_only_expected],
          ["Findings", c.findings],
        ].map(([label, value]) => (
          <Card key={String(label)} variant="outline" padding="sm">
            <Text c="muted" size="sm">
              {label}
            </Text>
            <div className={`${TYPO.mono()} text-2xl text-white`}>{value}</div>
          </Card>
        ))}
      </div>

      {/* The findings, by owner. The tabs are the recommendation: a front-end dev opens
          "For the kit" and has their list; the rest is somebody else's column. */}
      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          What to change, and who changes it
        </Title>
        <div className="flex flex-wrap gap-2">
          {(["kit", "both", "figma"] as const).map((o) => (
            <Button
              key={o}
              size="sm"
              variant={owner === o ? "filled" : "outline"}
              color={OWNER[o].color}
              onClick={() => setOwner(o)}
            >
              {OWNER[o].label} ({c.by_owner[o] ?? 0})
            </Button>
          ))}
        </div>
        <Text size="sm" c="secondary">
          {OWNER[owner].hint}
        </Text>
        <Card>
          <Card.Content>
            {grouped.length === 0 ? (
              <Text c="secondary" size="sm">
                Nothing on this side.
              </Text>
            ) : (
              <ul className="flex flex-col">
                {grouped.map((f, i) => (
                  <Finding key={`${f.kind}-${f.component}-${i}`} f={f} />
                ))}
              </ul>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* The gaps, said plainly before the table of pairs: they are the answer to "what is
          missing", and a reader should not have to infer them from forty rows. */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Drawn, not shipped ({data.figma_only.length})</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="flex flex-col gap-1">
              {data.figma_only.map((e) => (
                <li key={e.slug} className="text-sm">
                  <code className={`${TYPO.mono()} text-gray-dark-200 text-xs`}>{e.slug}</code>
                  <span className="text-gray-dark-500 text-xs"> · {e.page.trim()}</span>
                  {e.acknowledged ? (
                    <Badge color="gray" size="sm" variant="outline" className="ml-2">
                      known gap
                    </Badge>
                  ) : null}
                </li>
              ))}
              {data.figma_only.length === 0 ? (
                <Text c="secondary" size="sm">
                  Everything drawn has a counterpart in the kit.
                </Text>
              ) : null}
            </ul>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Shipped, not drawn ({c.react_only_expected})</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="flex flex-col gap-1">
              {data.react_only
                .filter((r) => r.drawn)
                .map((r) => (
                  <li key={r.react} className="text-sm">
                    <code className={`${TYPO.mono()} text-gray-dark-200 text-xs`}>
                      {r.react}
                    </code>
                    <span className="text-gray-dark-500 text-xs"> · {r.category}</span>
                  </li>
                ))}
            </ul>
            {/* Not counted as holes, and said so: a Flex or a ThemeScript drawn in a UI
                kit would be the anomaly. Hiding them silently would leave a reader
                wondering why the two counts do not add up. */}
            <Text size="xs" c="muted" className="mt-2">
              {data.react_only.length - c.react_only_expected} layout primitives and
              typography helpers are excluded: they are not meant to be drawn.
            </Text>
          </Card.Content>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          The {c.pairs} pairs
        </Title>
        {data.pairs.map((p) => (
          <Pair key={p.react} pair={p} dark={dark} frames={data.sources.figma.frames !== false} />
        ))}
      </div>
    </div>
  )
}

export const PARITY_LEGEND: ReactNode = Object.entries(VERDICT).map(([k, v]) => (
  <div key={k}>
    <strong>{v.label}</strong> — {v.means}
  </div>
))
