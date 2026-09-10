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
  DownloadCloud,
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
  type Paint,
  syncComponents,
  type ParityAxis,
  type ParityFinding,
  type ParityPair,
  type ParityReport,
  readKey,
  type VariantVisual,
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

// ---------------------------------------------------------------- the visual diff

/** `rgb(99, 136, 227)` → `#6388e3`. A computed style never gives a hex, and Figma never
 *  gives an rgb() — one of the two has to move for a comparison to be possible at all. */
const toHex = (css: string): string => {
  const m = /rgba?\(([^)]+)\)/.exec(css || "")
  if (!m) return (css || "").trim().toLowerCase()
  const [r, g, b, a] = m[1].split(",").map((n) => Number.parseFloat(n.trim()))
  if (a === 0) return "transparent"
  const hx = (n: number) => Math.round(n).toString(16).padStart(2, "0")
  const alpha = a !== undefined && a < 1 ? hx(a * 255) : ""
  return `#${hx(r)}${hx(g)}${hx(b)}${alpha}`
}

/** Two colours are the same when their RGB halves match. ⚠️ Alpha is compared SEPARATELY
 *  and never folded in: Figma paints `#f044381a` where the kit reaches the same place with
 *  an opaque colour and an opacity, and calling those two different would put a false
 *  finding on a third of the tokens. */
const sameColour = (a: string, b: string): boolean => {
  const rgb = (v: string) => (v || "").replace("#", "").slice(0, 6).toLowerCase()
  if (!a || !b) return false
  if (a === "transparent" || b === "transparent") return a === b
  return rgb(a) === rgb(b)
}

const px = (v: string): number => Number.parseFloat(v || "0") || 0

type Line = {
  what: string
  figma: string
  react: string
  same: boolean
  note?: string
}

/** What the DRAWN variant and the RENDERED component say about the same surface.
 *
 *  ⚠️ The React half is not read from any catalogue — it is measured on the live element
 *  with `getComputedStyle`. That is the only place the kit's Tailwind classes have actually
 *  become a colour and a width; `ui-manifest.json` carries the API, and `theme.css` carries
 *  the tokens, but neither says what `variant="outline" color="brand"` finally paints.
 *
 *  The Figma half is the plugin's `variant_visuals`, which is why this panel says so
 *  plainly when the file has not been re-synced: with nothing on the left there is nothing
 *  to compare, and an empty table would read as agreement. */
const VisualDiff = ({
  visual,
  node,
  exported,
}: {
  visual?: VariantVisual
  node: HTMLElement | null
  exported: boolean
}) => {
  const [lines, setLines] = useState<Line[] | null>(null)

  useEffect(() => {
    if (!node || !visual) return setLines(null)
    // The rendered preview wraps the component; the component itself is the first element
    // child that actually paints. Measuring the wrapper would compare Figma's surface with
    // a transparent div — true, and about the wrong node.
    const el = (node.querySelector("*") as HTMLElement) ?? node
    const cs = window.getComputedStyle(el)
    const out: Line[] = []

    const colour = (what: string, drawn: Paint | undefined, got: string, hint?: string) => {
      if (!drawn?.hex && !drawn?.token) return
      const react = toHex(got)
      out.push({
        what,
        figma: drawn.token ? `${drawn.token} · ${drawn.hex}` : drawn.hex,
        react,
        same: sameColour(drawn.hex, react),
        note: hint,
      })
    }

    colour("Background", visual.fill, cs.backgroundColor)
    if (visual.stroke) {
      colour("Border colour", visual.stroke.color, cs.borderTopColor)
      const w = px(cs.borderTopWidth)
      out.push({
        what: "Border width",
        figma: `${visual.stroke.width}px`,
        react: `${w}px`,
        same: Math.abs(w - Number(visual.stroke.width)) < 0.51,
        note: "Figma draws sub-pixel borders; anything under half a pixel is a rounding.",
      })
    }
    if (typeof visual.radius === "number") {
      const r = px(cs.borderTopLeftRadius)
      out.push({
        what: "Radius",
        figma: `${visual.radius}px`,
        react: `${r}px`,
        same: Math.abs(r - visual.radius) < 0.51,
      })
    }
    if (visual.padding) {
      const v = visual.padding.v ?? visual.padding.t
      const h = visual.padding.h ?? visual.padding.l
      if (v !== undefined) {
        const got = px(cs.paddingTop)
        out.push({ what: "Padding ↕", figma: `${v}px`, react: `${got}px`, same: got === v })
      }
      if (h !== undefined) {
        const got = px(cs.paddingLeft)
        out.push({ what: "Padding ↔", figma: `${h}px`, react: `${got}px`, same: got === h })
      }
    }
    if (visual.gap !== undefined) {
      const got = px(cs.columnGap || cs.gap)
      out.push({ what: "Gap", figma: `${visual.gap}px`, react: `${got}px`, same: got === visual.gap })
    }
    if (visual.text) {
      colour("Text colour", visual.text.fill, cs.color)
      if (visual.text.size !== undefined) {
        const got = px(cs.fontSize)
        out.push({
          what: "Font size",
          figma: `${visual.text.size}px`,
          react: `${got}px`,
          same: Math.abs(got - visual.text.size) < 0.51,
          // The text may live on a child; the root's font-size is inherited and usually
          // right, but it is not a guarantee and saying so costs one line.
          note: "Measured on the component's root — a nested label may differ.",
        })
      }
    }
    setLines(out)
  }, [node, visual])

  if (!exported)
    return (
      <Alert
        type="info"
        variant="outline"
        title="The drawn surface has not been exported for this component"
        description="What each variant paints — fill, border, radius, padding — is exported by the Figma plugin alongside the catalogue, into its own file: inline in the fiches it would double the context an agent reads on every generation. If this is empty, either the sync predates the 2026-09-10 plugin, or no variant of this component paints anything on its own root — its surface comes from a nested layer, which the export deliberately leaves out. Re-run the plugin sync; nothing on this page fills it."
      />
    )
  if (!visual)
    return (
      <Text size="xs" c="muted">
        This variant paints nothing of its own: its surface comes from a nested layer, which
        the export deliberately leaves out.
      </Text>
    )
  if (!lines) return null

  const off = lines.filter((l) => !l.same)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Text size="sm" className={TYPO.title("semibold")}>
          The surface, drawn against rendered
        </Text>
        {off.length === 0 ? (
          <Badge color="green" size="sm">
            <Check size={13} />
            identical
          </Badge>
        ) : (
          <Badge color="orange" size="sm">
            {off.length} difference{off.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[11px] text-gray-dark-500 uppercase">
            <th className="pb-1 pr-3 font-normal">Property</th>
            <th className="pb-1 pr-3 font-normal">Figma</th>
            <th className="pb-1 pr-3 font-normal">Rendered</th>
            <th className="pb-1 font-normal" />
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.what} className="border-white/6 border-t align-top">
              <td className="py-1 pr-3 text-gray-dark-300 text-xs">{l.what}</td>
              <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-[11px]`}>
                {l.figma}
              </td>
              <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-[11px]`}>
                {l.react}
              </td>
              <td className="py-1">
                {l.same ? (
                  <Check size={13} className="text-green-500" />
                ) : (
                  <Badge color="orange" size="sm" variant="light">
                    differs
                  </Badge>
                )}
                {!l.same && l.note ? (
                  <div className="mt-0.5 max-w-xs text-[10px] text-gray-dark-500">
                    {l.note}
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  visuals,
  dark,
  frames,
}: {
  slug: string
  react: string
  cov: Coverage
  visuals: { exported: boolean; variants: Record<string, VariantVisual> }
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
  // The rendered element of the zoomed cell — the ONLY place the kit's classes have become
  // an actual colour and width, which is what the visual diff measures.
  const [zoomNode, setZoomNode] = useState<HTMLElement | null>(null)

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
        <span>
          · click a drawn cell to compare its surface
          {frames ? " and see Figma's own render of it" : ""}
        </span>
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
                  // ⚠️ NOT gated on `frames`. The zoom used to exist only to fetch Figma's
                  // render, so it was disabled without a token; it now also carries the
                  // visual diff, which is measured on the component rendered right here and
                  // needs nothing from Figma. Keeping the old condition made the comparison
                  // unreachable on exactly the servers that cannot render a frame.
                  const clickable = hits.length > 0
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
              {/* Same guard as the pair card. Ungating the CELL from `frames` (so the
                  visual diff is reachable without a Figma token) let this side fire a
                  fetch that cannot even complete its preflight — a CORS error in the
                  console for a route the server never mounted. */}
              {frames ? (
                <FigmaFrame slug={slug} variant={zoom.variant} />
              ) : (
                <Text size="xs" c="muted" className="text-center">
                  No FIGMA_TOKEN on the server: the surface below still compares, the
                  picture cannot be rendered.
                </Text>
              )}
            </div>
            <div
              ref={setZoomNode}
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
          <div className="mt-3">
            <VisualDiff
              visual={visuals.variants[zoom.variant]}
              node={zoomNode}
              exported={visuals.exported}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- one axis row

/** ONE axis, the two sides facing each other, and the difference SPELLED OUT underneath.
 *
 *  ⚠️ This replaced a five-column table (axis · drawn · → · in the kit · verdict). It held
 *  the same facts and nobody could read a difference out of it: the values ran together in
 *  narrow cells, and the only thing saying what was wrong was a coloured badge. Reported on
 *  2026-09-10 — "j'ai encore du mal à distinguer les différences au niveau des props et des
 *  variantes".
 *
 *  So the values get room, the two sides are aligned so the eye can compare them without
 *  scanning across a table, and every divergence is a SENTENCE. The badge stays, in the
 *  corner, as a second reading of it. */
const AxisPair = ({ a }: { a: ParityAxis }) => {
  const v = VERDICT[a.verdict] ?? VERDICT.unpaired
  const missingKit = a.missing_in_kit ?? []
  const missingFigma = a.missing_in_figma ?? []

  const Side = ({
    label,
    name,
    register,
    values,
    fallback,
    def,
    highlight,
  }: {
    label: string
    name: string
    register?: string
    values: string[]
    fallback?: string
    def?: string
    highlight: string[]
  }) => (
    <div className="flex-1 rounded border border-white/8 p-2">
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-[10px] text-gray-dark-500 uppercase">{label}</span>
        <code className={`${TYPO.mono()} text-gray-dark-200 text-xs`}>{name || "—"}</code>
        {register ? (
          <span className="text-[10px] text-gray-dark-600">{register}</span>
        ) : null}
      </div>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {values.map((val) => {
            // The value that exists on ONE side only is picked out where it lives. A list
            // of eleven values with a note underneath makes the reader do the diffing.
            const only = highlight.some((h) => h.toLowerCase() === val.toLowerCase())
            const isDefault = def && def.toLowerCase() === val.toLowerCase()
            return (
              <span
                key={val}
                title={isDefault ? "the default" : undefined}
                className={`${TYPO.mono()} rounded px-1.5 py-0.5 text-[11px] ${
                  only
                    ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/40"
                    : "bg-white/5 text-gray-dark-300"
                } ${isDefault ? "underline decoration-dotted underline-offset-2" : ""}`}
              >
                {val}
              </span>
            )
          })}
        </div>
      ) : (
        <span className="text-[11px] text-gray-dark-600">{fallback ?? "—"}</span>
      )}
    </div>
  )

  return (
    <div className="border-white/6 border-t py-3 first:border-t-0">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <Badge color={v.color} size="sm" variant="light">
          {v.label}
        </Badge>
        <span className="text-[11px] text-gray-dark-500">{a.nature}</span>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        <Side
          label="Figma axis"
          name={a.axis}
          values={a.figma}
          def={a.figma_default}
          highlight={missingKit}
          fallback="no value on this axis"
        />
        <div className="flex items-center justify-center md:px-1">
          <ArrowRight size={14} className="text-gray-dark-600" />
        </div>
        <Side
          label="React"
          name={a.react}
          register={a.register}
          values={a.react_values}
          def={a.react_default}
          highlight={missingFigma}
          fallback={a.react ? "no enumerable value" : "nothing of that name"}
        />
      </div>
      {/* The difference, in words. A reader should never have to subtract two lists. */}
      <div className="mt-1.5 flex flex-col gap-0.5">
        {missingKit.length > 0 ? (
          <Text size="xs" className="text-orange-300">
            Figma draws <strong>{missingKit.join(", ")}</strong> — the kit does not accept
            {missingKit.length > 1 ? " those values" : " that value"}.
          </Text>
        ) : null}
        {missingFigma.length > 0 ? (
          <Text size="xs" c="muted">
            The kit ships <strong>{missingFigma.join(", ")}</strong> — nothing draws
            {missingFigma.length > 1 ? " them" : " it"}.
          </Text>
        ) : null}
        {a.figma_default &&
        a.react_default &&
        a.figma_default.toLowerCase() !== a.react_default.toLowerCase() ? (
          <Text size="xs" className="text-red-300">
            Defaults disagree: an instance dropped in Figma is{" "}
            <strong>{a.figma_default}</strong>, the code with no prop is{" "}
            <strong>{a.react_default}</strong>.
          </Text>
        ) : null}
        {a.note ? (
          <Text size="xs" c="muted">
            {a.note}
          </Text>
        ) : null}
      </div>
    </div>
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
  const [onlyDiff, setOnlyDiff] = useState(true)
  const [covOpen, setCovOpen] = useState(false)
  const [cov, setCov] = useState<Coverage | null>(null)
  const [visuals, setVisuals] = useState<{
    exported: boolean
    variants: Record<string, VariantVisual>
  }>({ exported: false, variants: {} })
  const [covError, setCovError] = useState("")
  const blind = pair.axes.filter((a) => a.verdict === "unreadable")
  // Default to the differences: a healthy component is a page of "aligned", and the reader
  // came for what is not.
  const shownAxes = onlyDiff
    ? pair.axes.filter((a) => a.verdict !== "aligned" && a.verdict !== "by-design")
    : pair.axes
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
                    .then((d) => {
                      setCov(d.coverage)
                      setVisuals(d.visuals ?? { exported: false, variants: {} })
                    })
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
              <div className="mt-2">
                <label className="mb-1 flex items-center gap-2 text-gray-dark-400 text-xs">
                  <input
                    type="checkbox"
                    checked={onlyDiff}
                    onChange={(e) => setOnlyDiff(e.target.checked)}
                  />
                  Only the axes that differ
                </label>
                {shownAxes.length === 0 ? (
                  <Text size="xs" c="muted">
                    Every axis lines up on both sides.
                  </Text>
                ) : (
                  shownAxes.map((a) => <AxisPair key={`${a.axis}-${a.react}`} a={a} />)
                )}
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
                visuals={visuals}
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

/** What the right-hand column shows while no component is picked: the findings by owner and
 *  the two gap lists. They used to sit ABOVE the component list, which pushed the working
 *  surface off the first screen — the tab's whole point is now component by component, and
 *  the overview is what fills the space until one is chosen. */
const Overview = ({
  data,
  owner,
  setOwner,
}: {
  data: ParityReport
  owner: "kit" | "both" | "figma"
  setOwner: (o: "kit" | "both" | "figma") => void
}) => {
  const c = data.counts
  const grouped = data.findings.filter((f) => f.owner === owner)
  return (
    <div className="flex flex-col gap-6">
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
                <Finding
                  key={`${f.kind}-${f.component}-${i}`}
                  f={f}
                  paired={data.pairs.some((p) => p.react === f.component)}
                />
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
    </div>
  )
}

// ---------------------------------------------------------------- the sub-navigation

/** The component list — and the reason it exists is not tidiness.
 *
 *  ⚠️ The tab used to mount all 44 pairs at once: 44 live React previews, and once opened,
 *  44 coverage grids and 44 visual diffs on top. Reported on 2026-09-10 ("analyse composant
 *  par composant pour ne pas tout charger d'un coup"). Now the list is cheap — a row and a
 *  badge — and exactly one component is mounted at a time.
 *
 *  The selection lives in the HASH (`#/parity/Badge`), like the Context tab's corpora: a
 *  reload lands back on the same component, and a link to one can be pasted to a colleague.
 *  That is worth more than local state for something a front-end dev will want to send. */
const ComponentList = ({
  pairs,
  selected,
  counts,
}: {
  pairs: ParityPair[]
  selected: string
  counts: Record<string, { holes: number; blind: number }>
}) => {
  const [filter, setFilter] = useState("")
  const [onlyGaps, setOnlyGaps] = useState(false)
  const needle = filter.trim().toLowerCase()
  const shown = pairs.filter((p) => {
    if (onlyGaps && (counts[p.react]?.holes ?? 0) === 0) return false
    if (!needle) return true
    return (
      p.react.toLowerCase().includes(needle) ||
      p.figma.slug.toLowerCase().includes(needle) ||
      p.category.toLowerCase().includes(needle)
    )
  })

  return (
    <div className="flex flex-col gap-2">
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter the components"
        className={`${TYPO.mono()} w-full rounded border border-white/15 bg-transparent px-2 py-1 text-gray-dark-200 text-xs`}
      />
      <label className="flex items-center gap-2 text-gray-dark-400 text-xs">
        <input
          type="checkbox"
          checked={onlyGaps}
          onChange={(e) => setOnlyGaps(e.target.checked)}
        />
        Only those with differences
      </label>
      <div className="flex max-h-[70vh] flex-col overflow-y-auto">
        {shown.map((p) => {
          const holes = counts[p.react]?.holes ?? 0
          const on = p.react === selected
          return (
            <a
              key={p.react}
              href={`#/parity/${encodeURIComponent(p.react)}`}
              className={`flex items-center justify-between gap-2 rounded px-2 py-1.5 text-xs ${
                on ? "bg-white/10 text-white" : "text-gray-dark-300 hover:bg-white/5"
              }`}
            >
              <span className="truncate">
                {p.react}
                <span className={`${TYPO.mono()} ml-1.5 text-[10px] text-gray-dark-600`}>
                  {p.figma.slug}
                </span>
              </span>
              {holes > 0 ? (
                <span className={`${TYPO.mono()} shrink-0 text-[10px] text-orange-300`}>
                  {holes}
                </span>
              ) : (
                <Check size={12} className="shrink-0 text-green-600" />
              )}
            </a>
          )
        })}
        {shown.length === 0 ? (
          <Text size="xs" c="muted" className="px-2 py-1">
            Nothing matches.
          </Text>
        ) : null}
      </div>
      <Text size="xs" c="muted">
        {shown.length} of {pairs.length} shown
      </Text>
    </div>
  )
}

// ---------------------------------------------------------------- the page

/** A finding NAMES a component, so it links to it. Reading "Button: `variant` is drawn as
 *  link" and then hunting for Button in a list of forty-four is a step the page can take
 *  for the reader — and it writes the same address the sub-navigation does, so the two
 *  gestures land in the same place. `paired` guards it: a finding about something that
 *  exists on one side only has no pair to open. */
const Finding = ({ f, paired }: { f: ParityFinding; paired: boolean }) => (
  <li className="border-white/6 border-t py-2 first:border-t-0">
    <div className="flex flex-wrap items-baseline gap-2">
      <Badge color={SEVERITY[f.severity]} size="sm" variant="light">
        {f.severity}
      </Badge>
      {paired ? (
        <a
          href={`#/parity/${encodeURIComponent(f.component)}`}
          className={`${TYPO.title("semibold")} text-sm underline decoration-dotted underline-offset-2 hover:text-white`}
        >
          {f.title}
        </a>
      ) : (
        <Text size="sm" className={TYPO.title("semibold")}>
          {f.title}
        </Text>
      )}
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

export const ParityView = ({ selected = "" }: { selected?: string }) => {
  const key = readKey()
  const [data, setData] = useState<ParityReport | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncNote, setSyncNote] = useState("")
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

  /** The sync reads Figma and commits the catalogue. It takes a while — a hundred-odd
   *  calls — so the button says what it is doing rather than going quiet, and the report
   *  is reloaded from the new commit afterwards. */
  const runSync = async () => {
    setSyncing(true)
    setSyncNote("")
    try {
      const out = await syncComponents()
      setSyncNote(
        `${out.components} components and ${out.surfaces} surface files written in commit ` +
          `${out.commit} · ${out.pages}/${out.pages_declared} declared pages found · ` +
          `${out.variables_resolved} variable ids resolved through the plugin's file.`,
      )
      load(true)
    } catch (e) {
      setSyncNote(e instanceof Error ? e.message : String(e))
    } finally {
      setSyncing(false)
    }
  }

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
  // Computed once for the list's badges: a component's axes that genuinely differ, which
  // is the only number worth showing next to forty-four names.
  const holeCounts = Object.fromEntries(
    data.pairs.map((p) => [
      p.react,
      {
        holes: p.axes.filter((a) => a.verdict === "values" || a.verdict === "unpaired").length,
        blind: p.axes.filter((a) => a.verdict === "unreadable").length,
      },
    ]),
  )
  // The hash carries the selection. Matched case-insensitively so a hand-typed link works,
  // and falling back to nothing rather than to the first component — landing on a page
  // that silently shows something else than what the URL says is worse than an empty one.
  const current =
    data.pairs.find((p) => p.react.toLowerCase() === selected.toLowerCase()) ?? null

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
        {/* Only drawn when the server says it exists. A button that appears and then
            answers 503 is worse than one that is absent — the reader tries it, believes
            the feature is broken, and looks for the fault in the wrong place. */}
        {data.sources.figma.can_sync ? (
          <Button
            size="sm"
            variant="outline"
            color="brand"
            onClick={runSync}
            disabled={syncing}
          >
            <DownloadCloud size={14} />
            {syncing ? "Reading Figma…" : "Sync from Figma"}
          </Button>
        ) : null}
        <Button size="sm" variant="subtle" onClick={() => setDark((d) => !d)}>
          {dark ? <Moon size={14} /> : <Sun size={14} />}
          {dark ? "Dark" : "Light"} previews
        </Button>
        <Text size="xs" c="muted">
          The Figma file defaults to Dark — match it here to compare like for like.
        </Text>
      </div>
      {syncNote ? (
        <Text size="xs" c="secondary">
          {syncNote}
        </Text>
      ) : null}

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

      {/* ⚠️ ONE component at a time. Mounting the 44 pairs together meant 44 live React
          previews, and once opened 44 coverage grids and 44 visual diffs — the page took
          seconds to settle and the browser held all of it. The list is cheap; the detail
          is paid for only where the reader is looking. */}
      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          {current ? current.react : `The ${c.pairs} pairs`}
        </Title>
        {current ? (
          <a href="#/parity" className="text-gray-dark-400 text-xs hover:text-gray-dark-200">
            ← back to the findings
          </a>
        ) : (
          <Text size="xs" c="muted">
            Pick a component on the left to compare it. The number beside a name is how many
            of its axes differ; the address bar follows the selection, so a link to one can
            be sent as it is.
          </Text>
        )}
        <div className="grid gap-4 md:grid-cols-[minmax(200px,260px)_1fr]">
          <ComponentList pairs={data.pairs} selected={current?.react ?? ""} counts={holeCounts} />
          {current ? (
            <Pair
              key={current.react}
              pair={current}
              dark={dark}
              frames={data.sources.figma.frames !== false}
            />
          ) : (
            <Overview data={data} owner={owner} setOwner={setOwner} />
          )}
        </div>
      </div>
    </div>
  )
}

export const PARITY_LEGEND: ReactNode = Object.entries(VERDICT).map(([k, v]) => (
  <div key={k}>
    <strong>{v.label}</strong> — {v.means}
  </div>
))
