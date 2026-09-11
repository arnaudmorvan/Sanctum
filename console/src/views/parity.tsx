/** The Parity tab — the Figma catalogue and `@42/ui-react`, side by side, and REVIEWED.
 *
 *  Until this tab there was one answer to "what does the kit have that the file does not,
 *  and the other way round": `audit/parity-figma-vs-react.md`, hand-written in July 2026
 *  and stale the week after. It counted 29 pairs. There are 43, and nothing said so.
 *
 *  ## What this page is for, in the order a reviewer needs it
 *
 *    1. **One component, both sides, and what differs — with nothing to open.** Reported
 *       on 2026-09-10: "je dois encore trop rentrer dans des sous-menus". The previous
 *       version showed two renders and two toggles ("Show the 5 axes", "Show the coverage
 *       grid"); the differences were behind both. Now the list of what differs is the first
 *       thing under the renders, and what is BY DESIGN (a runtime state, a slot, the
 *       palette living in `color`) is folded under one line that says how many and why;
 *    2. **One number.** The card said "2 differences", the surface panel under it said "4".
 *       Two different measures, one word. Now the number on the list, on the card and in
 *       the brief is the same: the ACTIVE findings of that component. The surface panel
 *       measures something else (the paint of one rendered variant) and says so — and
 *       what it measures only becomes a finding when the reviewer FLAGS it;
 *    3. **The reviewer decides, and the decision persists.** "Ignore" takes a finding out
 *       of the brief and the counts; "flag" puts a measured difference in. Committed by the
 *       server to `analysis/parity-review.json`, signed with the name `who.ts` holds —
 *       because the brief is what reaches the front-end dev, and the whole point of the
 *       review is that what reaches them is what is left;
 *    4. **The holes, at a glance.** "In Figma only" and "In the kit only" are LISTS you
 *       open by clicking the number, not two cards at the bottom of an overview.
 *
 *  ⚠️ **The verdicts are computed server-side** (`parity.py`) and this file only paints
 *  them. That is not an accident of layering: the classification encodes the four
 *  documented model divergences — `variant` × `color`, the `Field` extraction, runtime
 *  states, the `size` scale — and it belongs where it is tested offline, not in a browser.
 *
 *  The ONE thing this page writes is the reviewer's file, through the server, and never
 *  `ds-actions.yaml`: a console that filed findings itself would be a second writer on a
 *  file the triage already corrupted once.
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
  ChevronDown,
  ChevronRight,
  Copy,
  ImageOff,
  Moon,
  RefreshCw,
} from "lucide-react"
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Signature } from "../../../src/layout/identity"
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
  type ParityAxis,
  type ParityDetail,
  type ParityFinding,
  type ParityPair,
  type ParityReport,
  readKey,
  type VariantVisual,
} from "../mcp"
import { NOT_PREVIEWABLE, PREVIEWS, PreviewBoundary } from "./previews"
import {
  FindingRow,
  FlagButtons,
  IgnoreButton,
  OWNER,
  type Owner,
  Closed,
  HandOff,
  OwnerBar,
  RestoreButton,
  ReviewContext,
  useReview,
  useReviewState,
} from "./review"

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
    means:
      "The manifest cannot see the values — a cva outside the file, a type alias. Says nothing about the kit.",
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

/** The verdicts that mean "nothing to do, and here is why". Folded under one line. */
const BY_DESIGN = new Set(["by-design", "composed", "code-only", "unreadable"])


/** The order in which an axis deserves to be a grid axis. A dev opens a coverage grid to
 *  see `variant × color`; opening it on `value × size` — the thumb position of a Slider,
 *  a SAMPLE frozen for the spec — is what made the pickers look like they did nothing. */
const AXIS_RANK: Record<string, number> = {
  surface: 0,
  palette: 1,
  scale: 2,
  layout: 3,
  slot: 4,
  "state-controlled": 5,
  "state-runtime": 6,
  content: 7,
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const sameName = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

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
 *  "the kit renders nothing", which is a lie about the kit.
 *
 *  `props` are the Figma DEFAULT variant's values, mapped to the kit's props: the two
 *  sides then show the SAME variant, and the surface measured underneath compares like
 *  with like. Without them the kit's own default (`<Badge />`, neutral) sat beside
 *  Figma's (brand) and every colour "differed" for a reason that was not a defect. */
const KitPreview = ({ name, props }: { name: string; props?: Record<string, unknown> }) => {
  const render = PREVIEWS[name]
  if (render)
    return (
      <PreviewBoundary name={name}>
        {/* `data-preview-wrap`: the surface measure descends through it to the component
            itself. Measuring this div compared Figma's badge with a transparent flex box —
            seven "differences", all about the wrong node. */}
        <div
          data-preview-wrap=""
          className="flex max-w-full items-center justify-center overflow-x-auto"
        >
          {render(props)}
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

/** OKLab → sRGB, the standard matrices (Björn Ottosson, 2020). Exact, so a colour the kit
 *  reaches through `color-mix(in oklab, …)` compares channel for channel with Figma's hex
 *  — a canvas read-back would come within a unit or two, and a comparison that says
 *  "differs" on a rounding is the false finding this panel exists not to make. */
const oklabToRgb = (L: number, a: number, b: number): [number, number, number] => {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s3 = s_ ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s3,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s3,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s3,
  ]
  return lin.map((c) => {
    const v = Math.max(0, Math.min(1, c))
    const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
    return Math.round(srgb * 255)
  }) as [number, number, number]
}

/** A computed colour in ANY syntax, brought back to `rgba()`.
 *
 *  ⚠️ Chrome answers `getComputedStyle` with `oklab(0.99 0.00004 0.00002 / 0.16)` for a
 *  `color-mix()` — which is what the kit's `light` variants are made of — and a regex for
 *  `rgb()` read that as "no colour", so the kit's whole `light` family compared as
 *  "differs". `oklab()`, `oklch()` and `color(srgb …)` are converted here, exactly. */
const normalise = (css: string): string => {
  const v = (css || "").trim()
  const m = /^(oklab|oklch|color)\(([^)]+)\)$/.exec(v)
  if (!m) return v
  const body = m[2].replace("/", " ").replace(/^srgb\s+/, "").trim()
  const parts = body.split(/\s+/).map((x) => (x.endsWith("%") ? Number(x.slice(0, -1)) / 100 : Number(x)))
  if (parts.some((n) => Number.isNaN(n))) return v
  const alpha = parts.length > 3 ? parts[3] : 1
  let rgb: [number, number, number]
  if (m[1] === "color") {
    if (!/^srgb\s/.test(m[2].trim())) return v
    rgb = [parts[0], parts[1], parts[2]].map((c) => Math.round(Math.max(0, Math.min(1, c)) * 255)) as [number, number, number]
  } else if (m[1] === "oklch") {
    const h = (parts[2] * Math.PI) / 180
    rgb = oklabToRgb(parts[0], parts[1] * Math.cos(h), parts[1] * Math.sin(h))
  } else {
    rgb = oklabToRgb(parts[0], parts[1], parts[2])
  }
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}

/** `rgb(99, 136, 227)` → `#6388e3`. A computed style never gives a hex, and Figma never
 *  gives an rgb() — one of the two has to move for a comparison to be possible at all. */
const toHex = (raw: string): string => {
  const css = normalise(raw)
  const m = /rgba?\(([^)]+)\)/.exec(css || "")
  if (!m) return (css || "").trim().toLowerCase()
  const [r, g, b, a] = m[1].split(",").map((n) => Number.parseFloat(n.trim()))
  if (a === 0) return "transparent"
  const hx = (n: number) => Math.round(n).toString(16).padStart(2, "0")
  const alpha = a !== undefined && a < 1 ? hx(a * 255) : ""
  return `#${hx(r)}${hx(g)}${hx(b)}${alpha}`
}

/** Two colours are the same when their RGB halves match within ONE unit per channel.
 *
 *  ⚠️ Alpha is compared SEPARATELY and never folded in: Figma paints `#f044381a` where the
 *  kit reaches the same place with an opaque colour and an opacity, and calling those two
 *  different would put a false finding on a third of the tokens.
 *
 *  The one unit is for Chrome's serialisation of `oklab(…)`, six significant digits, which
 *  can land a channel a unit beside the hex the kit was compiled from. `#fafafa` against
 *  `#ffffff` is five units away and still differs: a real gap survives, a rounding does
 *  not. */
const alphaOf = (hex: string): number => {
  const h = hex.replace("#", "")
  return h.length === 8 ? Number.parseInt(h.slice(6, 8), 16) / 255 : 1
}

/** `opacity` is the rendered element's own (the product up to the component's root):
 *  Figma's `#f044381a` and the kit's opaque red under `opacity-10` are the SAME paint,
 *  and only the product says so. The alpha halves are then held together within 0.1 —
 *  Figma's `29` is 0.16 where the kit writes `/15`, and that is not a finding — while a
 *  white at 35 % against a solid white IS one, whatever the RGB says. */
const sameColour = (a: string, b: string, opacity = 1): boolean => {
  // A hex whose alpha is 00 IS transparent, whatever its RGB: Figma exports a hidden
  // fill as `#ffffff00`, the browser says `transparent`, and they are the same paint.
  const norm = (v: string) => (/^#[0-9a-f]{6}00$/i.test(v || "") ? "transparent" : v)
  const x = norm(a)
  const y = norm(b)
  if (!x || !y) return false
  if (x === "transparent" || y === "transparent") return x === y
  const channels = (v: string): number[] | null => {
    const h = v.replace("#", "").slice(0, 6).toLowerCase()
    return /^[0-9a-f]{6}$/.test(h)
      ? [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16))
      : null
  }
  const p = channels(x)
  const q = channels(y)
  if (!p || !q) return x.toLowerCase() === y.toLowerCase()
  if (!p.every((c, i) => Math.abs(c - q[i]) <= 1)) return false
  return Math.abs(alphaOf(x) - alphaOf(y) * opacity) <= 0.1
}

const px = (v: string): number => Number.parseFloat(v || "0") || 0

type Theme = "dark" | "light"

type Line = {
  /** The id's tail — explicit, because `Padding ↕` and `Padding ↔` slugify to the same
   *  word, and one ignore would have hidden both. */
  key: string
  what: string
  figma: string
  react: string
  same: boolean
  /** Set when the line was NOT compared, and why. Shown as such and counted in neither
   *  column: a property the render cannot answer (no text on screen, one child to
   *  space, a token the foundations do not carry) is neither "same" nor "differs", and
   *  saying either would be the report accusing — or absolving — on its own blindness. */
  skip?: string
  note?: string
}

/** What a RENDERED element paints, read once with `getComputedStyle`. Split from the
 *  comparison so one render can be held against many drawn variants: forty variants that
 *  differ only on a slot share one render, and the measure runs once per render. */
type Rendered = {
  bg: string
  borderColor: string
  borderWidth: number
  radius: number
  width: number
  height: number
  padV: number
  /** True when `padV` was derived from a fixed height and centred content rather than
   *  read from `padding-top`. */
  padVDerived: boolean
  padH: number
  /** The spacing between the first two laid-out children — `null` when there is nothing
   *  to space (one child, or none) and no gap is declared either. */
  gap: number | null
  /** The painted node's opacity, multiplied up to the component's root. */
  opacity: number
  /** The label's own colour and size — `null` when the render carries no text. */
  text: { color: string; fontSize: number; opacity: number } | null
  /** True when the surface was read one level in, the root painting nothing. */
  viaChild: boolean
}

/** The product of `opacity` from `el` up to (and including) `root`. */
const opacityUpTo = (el: HTMLElement, root: HTMLElement): number => {
  let out = 1
  let cur: HTMLElement | null = el
  while (cur) {
    out *= Number.parseFloat(getComputedStyle(cur).opacity) || 1
    if (cur === root) break
    cur = cur.parentElement
  }
  return out
}

/** Inputs that DRAW text: a caret and a value, or a placeholder. A checkbox's hidden
 *  `<input>` is not one, and neither is a range's. */
const TEXT_INPUTS = new Set(["text", "search", "email", "url", "tel", "password", "number"])

const ownsText = (el: HTMLElement): boolean => {
  if (el instanceof HTMLTextAreaElement) return true
  if (el instanceof HTMLInputElement) return TEXT_INPUTS.has(el.type)
  return Array.from(el.childNodes).some(
    (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0,
  )
}

/** Has a box on screen. The off-screen host is `visibility: hidden`, so visibility cannot
 *  be the test; the rect can — `display: none`, an empty span and Ark's 1×1 hidden
 *  inputs all fail it. */
const laidOut = (el: Element): boolean => {
  const r = el.getBoundingClientRect()
  return r.width > 1 && r.height > 1
}

/** The first element carrying its own text, in READING order (depth-first, document
 *  order) — the actual label a Figma `text` layer is drawn against. `null` when the
 *  render carries no text at all: a Slider at rest, a Progress bar without a label, an
 *  Avatar showing a picture.
 *
 *  ⚠️ Breadth-first was tried first and picked the wrong node: `Alert`'s `Description`
 *  sits as a SIBLING of the header row that holds `Icon` + `Title`, one level shallower
 *  than `Title` itself. Breadth-first reached `Description` before `Title`, and read its
 *  colour (`gray-dark-300`) while agreeing with the title's font-size (both `text-sm`) —
 *  same number, wrong node, which made the bug look half-fixed. Depth-first visits `Title`
 *  first because it comes first on screen, whatever its depth.
 *
 *  ⚠️ An `<svg>` subtree is skipped whole: a `<title>` inside an icon is text for a screen
 *  reader, not paint, and the Spinner's was found as its "label". So is anything with no
 *  box — text that is not laid out is not what the eye compares. */
const firstTextCarrier = (el: HTMLElement): HTMLElement | null => {
  if (el instanceof SVGElement || !laidOut(el)) return null
  if (ownsText(el)) return el
  for (const child of Array.from(el.children)) {
    const found = firstTextCarrier(child as HTMLElement)
    if (found) return found
  }
  return null
}

/** The spacing between the first two laid-out children — which is what Figma's
 *  `itemSpacing` IS. Read from the boxes, not from `gap`: the kit reaches the same
 *  distance with a margin where Figma uses spacing, and a computed `gap` of `normal`
 *  read as 0 where the eye sees 8. Descends through single-child wrappers, because the
 *  kit often wraps its row (`PinInput`: a div around the flex that spaces the cells — the
 *  root's own gap was 0 and the panel said so, against the 8px anyone could see).
 *
 *  With fewer than two children the DECLARED gap is used when there is one (a Button
 *  rendered without its icon still says what it would space at), else `null`: nothing to
 *  space is not "0px". */
const measureGap = (root: HTMLElement): number | null => {
  // The children that take part in the layout: laid out, and in the flow. Ark's hidden
  // `<input>` (1×1, clipped) and an absolutely positioned indicator are not spaced.
  const inFlow = (el: HTMLElement) =>
    Array.from(el.children)
      .map((c) => ({ c: c as HTMLElement, cs: getComputedStyle(c), r: c.getBoundingClientRect() }))
      .filter(
        ({ cs, r }) =>
          cs.position !== "absolute" && cs.position !== "fixed" && r.width > 1 && r.height > 1,
      )
  let el = root
  let boxes = inFlow(el)
  while (boxes.length === 1 && !(boxes[0].c instanceof SVGElement)) {
    el = boxes[0].c
    boxes = inFlow(el)
  }
  if (boxes.length >= 2) {
    const a = boxes[0].r
    const b = boxes[1].r
    if (b.left >= a.right - 0.5) return Math.round((b.left - a.right) * 100) / 100
    if (b.top >= a.bottom - 0.5) return Math.round((b.top - a.bottom) * 100) / 100
    return null
  }
  const cs = getComputedStyle(el)
  const declared =
    cs.columnGap !== "normal" ? cs.columnGap : cs.rowGap !== "normal" ? cs.rowGap : ""
  return declared ? px(declared) : null
}

const transparent = (css: string): boolean => {
  const v = (css || "").trim()
  return v === "transparent" || /^rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\s*\)$/.test(v)
}

/** Whether an element paints a surface of its own: a background, a border or a radius. */
const paints = (cs: CSSStyleDeclaration): boolean =>
  !transparent(cs.backgroundColor) || px(cs.borderTopWidth) > 0 || px(cs.borderTopLeftRadius) > 0

/** The element the SURFACE is read on: the root, unless the root paints nothing and a
 *  descendant does. Figma's surface is the variant's root frame — the one thing that
 *  paints. The kit sometimes puts that paint one level in: `ButtonGroup` is a bare
 *  wrapper around buttons that carry the border and the radius, and read on the wrapper
 *  the group came out as "radius 4px drawn, 0px rendered · border 1px drawn, 0px
 *  rendered" — a border that IS on screen, on the next node down. Walks the first
 *  in-flow child while nothing paints; falls back to the root when nothing does at all
 *  (a Slider track paints, but a Checkbox's label wrapper and its control both do, and
 *  Figma's checkbox root exports no surface to compare it to anyway). */
const paintedNode = (root: HTMLElement): { el: HTMLElement; viaChild: boolean } => {
  let el = root
  for (let depth = 0; depth < 4; depth += 1) {
    if (paints(getComputedStyle(el))) return { el, viaChild: depth > 0 }
    const next = Array.from(el.children).find((c) => {
      if (c instanceof SVGElement) return false
      const cs = getComputedStyle(c)
      return cs.position !== "absolute" && cs.position !== "fixed" && laidOut(c)
    }) as HTMLElement | undefined
    if (!next) break
    el = next
  }
  return { el: root, viaChild: false }
}

/** The vertical inset the eye sees. The kit often fixes a HEIGHT (`h-8`) and centres the
 *  content, with no padding at all: Figma's `padding: 8` and the kit's `0px` then describe
 *  the same look, and "8px drawn, 0px rendered" on forty buttons was the panel counting
 *  the mechanism rather than the result. With no padding declared, the inset is derived
 *  from the box and its content — the tallest in-flow child, or the line box when the
 *  element holds bare text. Said in the line's note, because a derived number is not a
 *  measured one. */
const verticalInset = (el: HTMLElement, cs: CSSStyleDeclaration): { value: number; derived: boolean } => {
  const declared = px(cs.paddingTop)
  if (declared > 0) return { value: declared, derived: false }
  const inner =
    el.getBoundingClientRect().height - px(cs.borderTopWidth) - px(cs.borderBottomWidth)
  const kids = Array.from(el.children)
    .filter((c) => {
      const k = getComputedStyle(c)
      return k.position !== "absolute" && k.position !== "fixed" && laidOut(c)
    })
    .map((c) => c.getBoundingClientRect().height)
  const content = kids.length
    ? Math.max(...kids)
    : ownsText(el) && cs.lineHeight !== "normal"
      ? px(cs.lineHeight)
      : 0
  if (content <= 0 || inner <= content) return { value: declared, derived: false }
  return { value: Math.round(((inner - content) / 2) * 100) / 100, derived: true }
}

/** When the Figma entry names a PART of the React component rather than the component,
 *  the element that part is. The page pairs `↳ Table`'s `tableheadercell` with the kit's
 *  `Table`, and a header cell's surface held against a whole table's root reported
 *  "padding 24px drawn, 0px rendered" — true of the table, and not what was drawn. The
 *  mapping is deliberately tiny and by NAME: a suffix the DS uses, to an element the kit
 *  renders. Anything else measures the root, as before. */
const PART_SELECTORS: Record<string, string> = {
  headercell: "th",
  cell: "td",
  header: "thead",
  row: "tbody tr, tr",
}

const partSelector = (react: string, slug: string): string | undefined => {
  const base = react.toLowerCase()
  const rest = slug.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (!rest.startsWith(base) || rest === base) return undefined
  return PART_SELECTORS[rest.slice(base.length)]
}

const readSurface = (node: HTMLElement, part?: string): Rendered => {
  // The rendered preview wraps the component; the component itself is the first element
  // that is not one of OUR wrappers (`data-preview-wrap`). Measuring a wrapper would
  // compare Figma's surface with a transparent div — true, and about the wrong node.
  let root: HTMLElement = node
  while (root.firstElementChild && (root === node || root.hasAttribute("data-preview-wrap")))
    root = root.firstElementChild as HTMLElement
  if (part) root = root.querySelector<HTMLElement>(part) ?? root
  const { el, viaChild } = paintedNode(root)
  const cs = window.getComputedStyle(el)
  const box = el.getBoundingClientRect()
  const borderWidth = px(cs.borderTopWidth)
  const inset = verticalInset(el, cs)
  // ⚠️ Text properties are read on the label, not the root. Alert and Notifier set
  // `text-sm`/colour on a nested title; the root only inherits the page's own default
  // (16px, the body's colour), and that inherited value is not what Figma's `text` layer
  // was drawn against. Reading it there reported a false "16px rendered" against a title
  // that was, on screen, 14px. The surface (background, border, radius, padding) is read
  // on the painted node, which is correct for those.
  const carrier = firstTextCarrier(root)
  const text = carrier ? window.getComputedStyle(carrier) : null
  return {
    bg: cs.backgroundColor,
    // A border of width 0 has no colour on screen, whatever `currentColor` resolves to:
    // read as a colour it compared the body's text against Figma's stroke.
    borderColor: borderWidth > 0 ? cs.borderTopColor : "transparent",
    borderWidth,
    radius: px(cs.borderTopLeftRadius),
    width: box.width,
    height: box.height,
    padV: inset.value,
    padVDerived: inset.derived,
    padH: px(cs.paddingLeft),
    gap: measureGap(root),
    opacity: opacityUpTo(el, root),
    text:
      text && carrier
        ? { color: text.color, fontSize: px(text.fontSize), opacity: opacityUpTo(carrier, root) }
        : null,
    viaChild,
  }
}

/** What the DRAWN variant and the RENDERED component say about the same surface.
 *
 *  ⚠️ The React half is not read from any catalogue — it is measured on the live element.
 *  That is the only place the kit's Tailwind classes have actually become a colour and a
 *  width; `ui-manifest.json` carries the API, and `theme.css` carries the tokens, but
 *  neither says what `variant="outline" color="brand"` finally paints. The Figma half is
 *  the plugin's per-variant surface.
 *
 *  `theme` is the one the render was made in, and `modes` the ones the export carries.
 *  The foundations resolve every token at the DEFAULT mode — Dark, on this DS — so a
 *  drawn hex is the dark value unless the token carries `modes`; a light render is held
 *  against the light value, and against nothing when the export has none. */
const compareSurface = (
  visual: VariantVisual,
  r: Rendered,
  theme: Theme = "dark",
  modes: string[] = [],
): Line[] => {
  const out: Line[] = []
  const colour = (
    key: string,
    what: string,
    drawn: Paint | undefined,
    got: string,
    hint?: string,
    opacity = r.opacity,
  ) => {
    if (!drawn?.hex && !drawn?.token) return
    const react = toHex(got)
    const label = (hex: string) => (drawn.token ? `${drawn.token} · ${hex}` : hex)
    if (drawn.token && !drawn.hex) {
      // A token the foundations do not carry (`gray-modern-900`, bound in the file to a
      // variable the export never resolved). Nothing to hold the render against — and
      // an empty hex compared to a colour came out as "differs" on every such variant.
      out.push({
        key,
        what,
        figma: drawn.token,
        react,
        same: false,
        skip: `\`${drawn.token}\` is not in the foundations' colour map: nothing to compare against`,
      })
      return
    }
    if (theme !== "dark" && !modes.includes(theme)) {
      out.push({
        key,
        what,
        figma: label(drawn.hex),
        react,
        same: false,
        skip: "the export carries no light-mode values: the foundations resolve at the dark mode, and a light render has nothing to be held against",
      })
      return
    }
    const hex = drawn.modes?.[theme] ?? drawn.hex
    const same = sameColour(hex, react, opacity)
    // Same hue, other opacity: say which half differs, or the reader compares two hexes
    // that look alike and reads the line as a rounding.
    const hueSame = !same && sameColour(hex.slice(0, 7), react.slice(0, 7), 1)
    out.push({
      key,
      what,
      figma: label(hex),
      react: opacity < 1 ? `${react} × opacity ${Math.round(opacity * 100) / 100}` : react,
      same,
      note: hueSame ? "Same hue, other opacity." : hint,
    })
  }

  const via = r.viaChild
    ? "Read one level in: the root paints nothing, its first child does."
    : undefined
  colour("background", "Background", visual.fill, r.bg, via)
  if (visual.stroke) {
    colour("border-color", "Border colour", visual.stroke.color, r.borderColor, via)
    out.push({
      key: "border-width",
      what: "Border width",
      figma: `${visual.stroke.width}px`,
      react: `${r.borderWidth}px`,
      same: Math.abs(r.borderWidth - Number(visual.stroke.width)) < 0.51,
      note: via ?? "Figma draws sub-pixel borders; anything under half a pixel is a rounding.",
    })
  }
  if (typeof visual.radius === "number") {
    // ⚠️ Past half the element's height a radius paints the same shape whatever its
    // number: Figma's `radius-full` is 9999, the kit's 999, and both are a pill. Compared
    // as numbers they "differed" on 180 ThemeIcons out of 360.
    const half = Math.min(r.width, r.height) / 2
    const pill = half > 0 && visual.radius >= half - 0.5 && r.radius >= half - 0.5
    out.push({
      key: "radius",
      what: "Radius",
      figma: `${visual.radius}px`,
      react: `${r.radius}px`,
      same: pill || Math.abs(r.radius - visual.radius) < 0.51,
      note: pill ? "Both past half the height: a pill either way, whatever the number." : via,
    })
  }
  const padV = visual.padding
    ? (visual.padding.v ?? visual.padding.t ?? visual.padding.all)
    : undefined
  const padH = visual.padding
    ? (visual.padding.h ?? visual.padding.l ?? visual.padding.all)
    : undefined
  if (padV !== undefined && !r.padVDerived)
    out.push({
      key: "padding-v",
      what: "Padding ↕",
      figma: `${padV}px`,
      react: `${r.padV}px`,
      same: Math.abs(r.padV - padV) < 0.51,
      note: via,
    })
  else if (r.padVDerived && (typeof visual.height === "number" || padV !== undefined)) {
    // The kit fixes a HEIGHT (`h-8`) and centres the content, with no padding at all.
    // "8px drawn, 0px rendered" on forty buttons was the panel counting the mechanism
    // rather than the result; the result is the height, so that is what is compared.
    // A real finding reads "40px drawn, 32px rendered": the kit's buttons ARE shorter
    // than the mockup's.
    const got = Math.round(r.height * 100) / 100
    if (typeof visual.height === "number") {
      // ⚠️ Figma FIXES the height too, and the export says so (plugin ≥ 2026-09-11). It
      // used to be derived from the padding and the line height — and a Badge drawn 20px
      // tall with a vertical padding of 0 came out as 16 (2 × 0 + 16), a false "16px
      // Figma, 22px React" on every sm variant. The frame's own height is the number.
      out.push({
        key: "height",
        what: "Height",
        figma: `${visual.height}px`,
        react: `${got}px`,
        same: Math.abs(got - visual.height) < 1,
        note: "Both sides fix a height and centre the content: Figma's is the frame's own height, the kit's is its box.",
      })
    } else {
      // Figma hugs its content — or the export predates the height: Figma's height is
      // its padding around the label's line box.
      const v = padV as number
      const lh = visual.text?.lineHeight
      const drawn = typeof lh === "number" ? 2 * v + lh : null
      if (drawn === null)
        out.push({
          key: "height",
          what: "Height",
          figma: `${v}px padding, line height unknown`,
          react: `${got}px`,
          same: false,
          skip: "the kit fixes the height and centres the content, and the drawn line height is not exported: nothing to derive Figma's height from",
        })
      else
        out.push({
          key: "height",
          what: "Height",
          figma: `${drawn}px`,
          react: `${got}px`,
          same: Math.abs(got - drawn) < 1,
          note: `The kit fixes the height and centres the content; Figma's is DERIVED — ${v}px of padding around a ${lh}px line box. If the frame fixes its own height in Figma, that number is not in this export: a sync with the plugin of 2026-09-11 or later carries it.`,
        })
    }
  }
  if (padH !== undefined)
    out.push({
      key: "padding-h",
      what: "Padding ↔",
      figma: `${padH}px`,
      react: `${r.padH}px`,
      same: Math.abs(r.padH - padH) < 0.51,
    })
  if (visual.gap !== undefined) {
    if (r.gap === null)
      out.push({
        key: "gap",
        what: "Gap",
        figma: `${visual.gap}px`,
        react: "—",
        same: false,
        skip: "the render has nothing to space — one child, or none — and declares no gap",
      })
    else
      out.push({
        key: "gap",
        what: "Gap",
        figma: `${visual.gap}px`,
        react: `${r.gap}px`,
        same: Math.abs(r.gap - visual.gap) < 0.51,
      })
  }
  if (visual.text) {
    const fill = visual.text.fill
    if (!r.text) {
      const why =
        "the kit renders no text at rest for this variant: the drawn label has no counterpart to be measured"
      if (fill?.hex || fill?.token)
        out.push({
          key: "text-color",
          what: "Text colour",
          figma: fill.token ? `${fill.token} · ${fill.hex}` : fill.hex,
          react: "—",
          same: false,
          skip: why,
        })
      if (visual.text.size !== undefined)
        out.push({
          key: "font-size",
          what: "Font size",
          figma: `${visual.text.size}px`,
          react: "—",
          same: false,
          skip: why,
        })
    } else {
      colour("text-color", "Text colour", fill, r.text.color, undefined, r.text.opacity)
      if (visual.text.size !== undefined)
        out.push({
          key: "font-size",
          what: "Font size",
          figma: `${visual.text.size}px`,
          react: `${r.text.fontSize}px`,
          same: Math.abs(r.text.fontSize - visual.text.size) < 0.51,
          // Measured on the first element that owns its own text, not the root — but a
          // second label at the same depth (a value beside its own text) is not this one.
          note: "Measured on the first element carrying its own text — a sibling label may differ.",
        })
    }
  }
  return out
}

const measureSurface = (
  visual: VariantVisual,
  node: HTMLElement,
  theme: Theme,
  modes: string[],
  part?: string,
): Line[] => compareSurface(visual, readSurface(node, part), theme, modes)

/** Whether a drawn combination is the RESTING state of its component. ⚠️ A drawn
 *  interaction state (hover, focus, disabled…) is compared with nothing: the kit renders
 *  it at runtime, off Ark's `data-*`, and every render this tab makes is at rest. Holding
 *  a `state-hover` surface against a resting render reported the hover tint as a defect
 *  on every button. One owner for the rule, used by the all-variants pass, the shown
 *  variant and the grid's zoom alike. */
const atRest = (
  values: Record<string, string>,
  axes: CoverageAxis[],
  defaults: Record<string, string>,
): boolean =>
  axes
    .filter((a) => a.nature === "state-runtime")
    .every((a) => {
      const v = values[a.axis]
      if (v === undefined) return true
      const rest =
        defaults[a.axis] ?? (a.figma.some((x) => sameName(x, "default")) ? "default" : "")
      return !rest || sameName(v, rest)
    })

/** A drawn combination's values, as the kit's props — the MATCHING BY PROP the two sides
 *  are compared through. `coverage.axes` (server-side) is the single owner of "which
 *  React prop is this Figma axis, and what does the kit accept on it".
 *
 *  Returns `null` when the combination cannot be rendered faithfully: an axis the kit can
 *  read whose value it refuses (`grey`). Rendering it anyway would show the kit's default
 *  and compare Figma's grey against the kit's gray — a false "same" or a false "differs".
 *  Content samples (`value` on a Slider) and slots are not props to pass: skipped. */
/** Values of a controlled state under which the component looks like it does at rest. */
const RESTING_VALUES = new Set(["", "false", "none", "null", "default", "0", "off", "no"])

/** The FIRST axis whose value the render could not take, or `""`. An axis of the drawing
 *  that lands on no prop — `ButtonGroup`'s `variant` (the kit puts it on the buttons),
 *  `Avatar`'s `shape` — means the render is NOT this variant: `variant-filled` was rendered
 *  as the fixture's outline, and its filled background compared against an outline's,
 *  thirty-two times. The axis-level finding already says the axis lands nowhere; the
 *  surface must not say it again as a colour. Content, slots, runtime states and unnamed
 *  axes are not props by nature and do not count; a controlled state counts only when
 *  its value is not the resting one (`indeterminate-true`, not `indeterminate-false`). */
const unmappedAxis = (values: Record<string, string>, axes: CoverageAxis[]): string => {
  for (const [axis, value] of Object.entries(values)) {
    const row = axes.find((a) => sameName(a.axis, axis))
    if (!row || row.react) continue
    if (["content", "slot", "text", "swap", "state-runtime", "unnamed"].includes(row.nature))
      continue
    if (row.nature === "state-controlled" && RESTING_VALUES.has(value.toLowerCase())) continue
    return row.axis
  }
  return ""
}

const propsFor = (
  values: Record<string, string>,
  axes: CoverageAxis[],
): Record<string, unknown> | null => {
  const out: Record<string, unknown> = {}
  for (const [axis, value] of Object.entries(values)) {
    const row = axes.find((a) => sameName(a.axis, axis))
    if (!row?.react) continue
    if (["content", "slot", "text", "swap", "state-runtime", "unnamed"].includes(row.nature))
      continue
    if (row.readable && row.kit.length && !row.kit.some((k) => sameName(k, value))) return null
    out[row.react] = value === "true" ? true : value === "false" ? false : value
  }
  return out
}

/** The surface of ONE variant, drawn against rendered, and what the reviewer does with a
 *  line that differs. Two gestures, both persisted:
 *
 *   • FLAG — the line becomes a finding the dev will read (`surface:<component>:<prop>`,
 *     owner kit). The server cannot measure a rendered padding; the human who saw it can
 *     say it counts. That is what puts the "Padding ↕ 38px drawn, 0px rendered" of the
 *     Slider card into the brief, where before it could only be looked at;
 *   • IGNORE — the line stops being shown here. A Figma root that reserves 38px for a
 *     value bubble is a fact about the mockup, not a defect of the kit.
 *
 *  ⚠️ The count on this panel is NOT the component's count and is never added to it: it
 *  says how many properties differ on this one variant. The card's number is the active
 *  findings, and a flagged line is one of them. */
const SurfacePanel = ({
  react,
  variant,
  visual,
  node,
  exported,
  title,
  theme,
  modes,
  resting = true,
  part,
  unmapped = "",
}: {
  react: string
  variant: string
  visual?: VariantVisual
  node: HTMLElement | null
  exported: boolean
  title: string
  theme: Theme
  modes: string[]
  /** False when the variant is a drawn INTERACTION state: the render beside it is at
   *  rest, and holding a hover surface against it would report the hover tint as a
   *  defect. */
  resting?: boolean
  /** The element to measure when the Figma entry names a part (`partSelector`). */
  part?: string
  /** An axis of this variant that lands on no prop (`unmappedAxis`): the render is not
   *  this variant, and nothing is measured. */
  unmapped?: string
}) => {
  const review = useReview()
  const [lines, setLines] = useState<Line[] | null>(null)
  const [showIgnored, setShowIgnored] = useState(false)

  useEffect(() => {
    if (!node || !visual || !resting || unmapped) return setLines(null)
    setLines(measureSurface(visual, node, theme, modes, part))
  }, [node, visual, theme, modes, resting, part, unmapped])

  if (!exported)
    return (
      <Text size="xs" c="muted">
        The drawn surface (fill, border, radius, padding) is not in this export: the Figma
        plugin writes it per variant since 2026-09-10, into its own file. Re-run the plugin
        sync in Figma; nothing on this page fills it.
      </Text>
    )
  if (!visual)
    return (
      <Text size="xs" c="muted">
        This variant paints nothing of its own: its surface comes from a nested layer, which
        the export deliberately leaves out.
      </Text>
    )
  if (!node)
    return (
      <Text size="xs" c="muted">
        No live render to measure against for this component.
      </Text>
    )
  if (!resting)
    return (
      <Text size="xs" c="muted">
        This variant draws an interaction state (hover, focus, disabled…). The kit renders
        those at runtime, off Ark's <code className={TYPO.mono()}>data-*</code>, and the
        component beside it is at rest — holding the two against each other would report
        the hover tint as a defect. Only resting variants are measured.
      </Text>
    )
  if (unmapped)
    return (
      <Text size="xs" c="muted">
        The axis <code className={TYPO.mono()}>{unmapped}</code> lands on no prop of the kit:
        the render beside it could not take this variant's value, so it is not this variant
        and its surface is not measured. The axis itself is one of the findings above.
      </Text>
    )
  if (!lines) return null

  const lineId = (l: Line) => `surface:${slugify(react)}:${slugify(variant)}:${l.key}`
  const off = lines.filter((l) => !l.same && !l.skip)
  const hidden = off.filter((l) => review.ignored.has(lineId(l)))
  const shown = lines.filter((l) => l.same || l.skip || !review.ignored.has(lineId(l)))
  const left = off.length - hidden.length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Text size="sm" className={TYPO.title("semibold")}>
          {title}
        </Text>
        {left === 0 ? (
          <Badge color="green" size="sm">
            <Check size={13} />
            {off.length === 0 ? "identical" : "nothing left"}
          </Badge>
        ) : (
          <Badge color="orange" size="sm" variant="light">
            {left} propert{left === 1 ? "y" : "ies"} differ{left === 1 ? "s" : ""}
          </Badge>
        )}
        <code className={`${TYPO.mono()} text-[10px] text-gray-dark-600`}>{variant}</code>
        {hidden.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowIgnored((s) => !s)}
            className="text-[11px] text-gray-dark-500 hover:text-white"
          >
            {showIgnored ? "hide" : "show"} {hidden.length} ignored
          </button>
        ) : null}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[11px] text-gray-dark-500 uppercase">
            <th className="pb-1 pr-3 font-normal">Property</th>
            {/* ⚠️ The two sides are named FIGMA and REACT, here and everywhere else.
                "Drawn" and "Rendered" said how each value was obtained, which is true and
                is not what a reader navigates by: « je veux toujours avoir ces termes pour
                que ce soit facile de m'y retrouver ». */}
            <th className="pb-1 pr-3 font-normal">Figma</th>
            <th className="pb-1 pr-3 font-normal">React</th>
            <th className="pb-1 font-normal" />
          </tr>
        </thead>
        <tbody>
          {(showIgnored ? lines : shown).map((l) => {
            const id = lineId(l)
            const isIgnored = !l.same && review.ignored.has(id)
            const isFlagged = review.flagged.has(id)
            return (
              <tr
                key={l.what}
                className={`border-white/6 border-t align-top ${isIgnored ? "opacity-50" : ""}`}
              >
                <td className="py-1 pr-3 text-gray-dark-300 text-xs">{l.what}</td>
                <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-[11px]`}>
                  {l.figma}
                </td>
                <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-[11px]`}>
                  {l.react}
                </td>
                <td className="py-1">
                  {l.skip ? (
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge color="gray" size="sm" variant="outline">
                        not compared
                      </Badge>
                      <span className="max-w-xs text-[10px] text-gray-dark-500">{l.skip}</span>
                    </div>
                  ) : l.same ? (
                    <Check size={13} className="text-green-500" />
                  ) : (
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge color="orange" size="sm" variant="light">
                        differs
                      </Badge>
                      {isIgnored ? (
                        <RestoreButton id={id} />
                      ) : review.canWrite ? (
                        <>
                          <FlagButtons
                            id={id}
                            flag={{
                              component: react,
                              title: `${react}: ${l.what} is ${l.figma} drawn, ${l.react} rendered`,
                              detail: `Measured in the console on the rendered variant ${variant}, against the surface the Figma plugin exported for it.`,
                              evidence: l.note ?? "",
                            }}
                          />
                          {isFlagged ? null : (
                            <IgnoreButton id={id} title={`${react}: ${l.what}`} compact />
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                  {!l.same && !l.skip && l.note ? (
                    <div className="mt-0.5 max-w-xs text-[10px] text-gray-dark-500">{l.note}</div>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------- every variant, measured

type Aggregate = {
  key: string
  what: string
  figma: string
  react: string
  variants: string[]
  note?: string
}

/** WHICH variants a grouped difference is about, said in the drawing's own axes rather
 *  than as a count.
 *
 *  Reported on 2026-09-10: "il manque de l'info pour que je puisse identifier rapidement
 *  de quelle variante il s'agit". A row read "Height 36px drawn, 28px rendered · 20 of 60"
 *  and the twenty were behind a click, as a wall of slugs. What the reader is after is the
 *  CAUSE, and the cause is what those twenty share: `size sm`.
 *
 *  So: per axis, the values the group covers against the values the compared population
 *  covers. An axis that spans everything says nothing and is dropped (every colour differs
 *  here — that is not what picks the row out); an axis the group narrows IS the row's
 *  name. Fewest values first: one value is a cause, four are a coincidence. */
const signature = (
  variants: string[],
  population: string[],
  axes: CoverageAxis[],
  values: Map<string, Record<string, string>>,
): string => {
  const spread = (list: string[], axis: string) => {
    const out = new Set<string>()
    for (const v of list) {
      const x = values.get(v)?.[axis]
      if (x !== undefined) out.add(x)
    }
    return out
  }
  const parts: { text: string; n: number }[] = []
  for (const a of axes) {
    if (a.nature === "unnamed") continue
    const used = spread(variants, a.axis)
    if (used.size === 0 || used.size === spread(population, a.axis).size) continue
    const list = [...used]
    parts.push({
      n: used.size,
      text: `${a.axis} ${list.slice(0, 3).join(", ")}${list.length > 3 ? ` +${list.length - 3}` : ""}`,
    })
  }
  return parts
    .sort((x, y) => x.n - y.n)
    .map((x) => x.text)
    .join(" · ")
}

/** The surface of EVERY drawn variant the kit can render, measured in one pass and
 *  grouped by what differs.
 *
 *  Reported on 2026-09-10: "ce qu'on voit ici comprend bien l'analyse de toutes les
 *  variantes, ou je dois rentrer dans chaque variante ?" — it did not. The panel measured
 *  the one variant on screen, and the other ninety-five were a click each in the grid.
 *
 *  How: every drawn combination that has an exported surface is turned into kit props
 *  (`propsFor`); combinations that map to the SAME props share one render (forty Badges
 *  that differ only on a slot are one `<Badge color size variant>`), and every unique
 *  render is mounted once, off-screen, read with `getComputedStyle` and unmounted. Each
 *  variant's drawn surface is then held against its render, and the differences are
 *  grouped by (property, drawn value, rendered value) — "Radius 4px drawn, 6px rendered,
 *  on 60 of 60" is one line, not sixty.
 *
 *  ⚠️ Off-screen means `position: absolute; visibility: hidden` and never `display: none`:
 *  a hidden-by-display element has no used values, and its border width reads 0. */
const AllVariantsSurface = ({
  react,
  detail,
  dark,
  part,
}: {
  react: string
  detail: ParityDetail
  dark: boolean
  part?: string
}) => {
  const review = useReview()
  const host = useRef<HTMLDivElement | null>(null)
  const [measured, setMeasured] = useState<Map<string, Rendered | null> | null>(null)
  const [openRow, setOpenRow] = useState("")
  const [showIgnored, setShowIgnored] = useState(false)

  // The renders to make: one per distinct set of props, with the variants behind it.
  const { renders, refused, uncompared, states, unmapped } = useMemo(() => {
    const renders = new Map<string, { props: Record<string, unknown>; variants: string[] }>()
    const refused: string[] = []
    const unmapped = new Map<string, number>()
    let uncompared = 0
    let states = 0
    for (const c of detail.coverage.combinations) {
      if (!detail.visuals.variants[c.variant]) {
        uncompared += 1
        continue
      }
      if (!atRest(c.values, detail.coverage.axes, detail.defaults)) {
        states += 1
        continue
      }
      const missing = unmappedAxis(c.values, detail.coverage.axes)
      if (missing) {
        unmapped.set(missing, (unmapped.get(missing) ?? 0) + 1)
        continue
      }
      const p = propsFor(c.values, detail.coverage.axes)
      if (p === null) {
        refused.push(c.variant)
        continue
      }
      const sig = JSON.stringify(Object.entries(p).sort())
      const r = renders.get(sig) ?? { props: p, variants: [] }
      r.variants.push(c.variant)
      renders.set(sig, r)
    }
    return { renders, refused, uncompared, states, unmapped }
  }, [detail])

  // The drawn values behind a variant slug, for the signature of a grouped row.
  const comboValues = useMemo(
    () => new Map(detail.coverage.combinations.map((c) => [c.variant, c.values])),
    [detail],
  )

  // Measure once the hidden host has mounted; again when the theme flips.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `dark` re-renders the host and must re-measure
  useEffect(() => {
    setMeasured(null)
  }, [dark, renders])
  useEffect(() => {
    if (measured !== null || !host.current) return
    const out = new Map<string, Rendered | null>()
    for (const el of host.current.querySelectorAll<HTMLElement>("[data-sig]")) {
      const sig = el.dataset.sig ?? ""
      out.set(sig, el.querySelector("[data-preview-error]") ? null : readSurface(el, part))
    }
    setMeasured(out)
  }, [measured])

  const rows = useMemo(() => {
    if (!measured) return null
    const groups = new Map<string, Aggregate>()
    // Per property, the variants that HAVE that property compared — the population a
    // group is a subset of, and the denominator of its count.
    const present = new Map<string, string[]>()
    // What was NOT compared, by property and reason, with how many variants it concerns.
    // Said out loud rather than folded into "identical": a property this pass could not
    // answer is not a property that agreed.
    const skipped = new Map<string, { what: string; reason: string; variants: number }>()
    let compared = 0
    let broken = 0
    const theme: Theme = dark ? "dark" : "light"
    for (const [sig, r] of renders) {
      const rendered = measured.get(sig)
      if (rendered === null) {
        broken += r.variants.length
        continue
      }
      if (!rendered) continue
      for (const v of r.variants) {
        const visual = detail.visuals.variants[v]
        if (!visual) continue
        compared += 1
        for (const l of compareSurface(visual, rendered, theme, detail.visuals.modes ?? [])) {
          if (l.skip) {
            const sk = skipped.get(`${l.key}|${l.skip}`) ?? { what: l.what, reason: l.skip, variants: 0 }
            sk.variants += 1
            skipped.set(`${l.key}|${l.skip}`, sk)
            continue
          }
          present.set(l.key, [...(present.get(l.key) ?? []), v])
          if (l.same) continue
          const gk = `${l.key}|${l.figma}|${l.react}`
          const g = groups.get(gk) ?? {
            key: l.key,
            what: l.what,
            figma: l.figma,
            react: l.react,
            variants: [],
            note: l.note,
          }
          g.variants.push(v)
          groups.set(gk, g)
        }
      }
    }
    const list = [...groups.values()].sort((a, b) => b.variants.length - a.variants.length)
    return { list, present, compared, broken, skipped: [...skipped.values()] }
  }, [measured, renders, detail, dark])

  const id = (g: Aggregate) =>
    `surface:${slugify(react)}:all:${g.key}:${slugify(g.figma)}-${slugify(g.react)}`

  const hidden = rows ? rows.list.filter((g) => review.ignored.has(id(g))) : []
  const shown = rows
    ? rows.list.filter((g) => showIgnored || !review.ignored.has(id(g)))
    : []
  const clean = rows
    ? [...rows.present.keys()].filter((k) => !rows.list.some((g) => g.key === k))
    : []

  return (
    <div className="flex flex-col gap-2">
      {/* The off-screen renders: mounted only until they have been read. */}
      {measured === null ? (
        <div
          ref={host}
          aria-hidden="true"
          data-theme={dark ? "dark" : "light"}
          className="pointer-events-none absolute -left-[9999px] top-0 w-[400px]"
          style={{ visibility: "hidden" }}
        >
          {[...renders.entries()].map(([sig, r]) => (
            <div key={sig} data-sig={sig} className="p-2">
              <PreviewBoundary name={react}>{PREVIEWS[react]?.(r.props)}</PreviewBoundary>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Text size="sm" className={TYPO.title("semibold")}>
          The surface of every variant: Figma against React
        </Text>
        {!rows ? (
          <Badge color="gray" size="sm" variant="light">
            measuring {renders.size} render{renders.size > 1 ? "s" : ""}…
          </Badge>
        ) : rows.compared === 0 ? (
          <Badge color="gray" size="sm" variant="outline">
            nothing measured
          </Badge>
        ) : shown.length === 0 ? (
          <Badge color="green" size="sm">
            <Check size={13} />
            {rows.list.length === 0 ? "identical" : "nothing left"}
          </Badge>
        ) : (
          <Badge color="orange" size="sm" variant="light">
            {shown.length} difference{shown.length > 1 ? "s" : ""}
          </Badge>
        )}
        {rows ? (
          <span className="text-[11px] text-gray-dark-500">
            {rows.compared} variant{rows.compared > 1 ? "s" : ""} compared through{" "}
            {renders.size} render{renders.size > 1 ? "s" : ""}
            {refused.length > 0 ? ` · ${refused.length} not renderable` : ""}
            {[...unmapped.entries()]
              .map(
                ([axis, n]) =>
                  ` · ${n} left out: the axis \`${axis}\` lands on no prop, so a render could not be this variant`,
              )
              .join("")}
            {states > 0 ? ` · ${states} interaction states left out (the kit renders them at runtime)` : ""}
            {uncompared > 0 ? ` · ${uncompared} with no exported surface` : ""}
            {rows.broken > 0 ? ` · ${rows.broken} whose render threw` : ""}
          </span>
        ) : null}
        {hidden.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowIgnored((v) => !v)}
            className="text-[11px] text-gray-dark-500 hover:text-white"
          >
            {showIgnored ? "hide" : "show"} {hidden.length} ignored
          </button>
        ) : null}
      </div>

      {rows && shown.length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-gray-dark-500 uppercase">
              <th className="pb-1 pr-3 font-normal">Property</th>
              <th className="pb-1 pr-3 font-normal">Figma</th>
              <th className="pb-1 pr-3 font-normal">React</th>
              <th className="pb-1 pr-3 font-normal">Variants</th>
              <th className="pb-1 font-normal" />
            </tr>
          </thead>
          <tbody>
            {shown.map((g) => {
              const gid = id(g)
              const isIgnored = review.ignored.has(gid)
              const population = rows.present.get(g.key) ?? []
              const total = population.length
              const trait = signature(g.variants, population, detail.coverage.axes, comboValues)
              const open = openRow === gid
              return (
                <tr
                  key={gid}
                  className={`border-white/6 border-t align-top ${isIgnored ? "opacity-50" : ""}`}
                >
                  <td className="py-1 pr-3 text-xs">
                    <div className="text-gray-dark-300">{g.what}</div>
                    {/* The row's NAME: what its variants share. `size sm` is a cause; "20
                        of 60" is a quantity, and the reader was left to click to find out
                        which twenty. */}
                    <div className={`${TYPO.mono()} mt-0.5 text-[10px] text-orange-200/80`}>
                      {trait || "every variant"}
                    </div>
                  </td>
                  <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-[11px]`}>
                    {g.figma}
                  </td>
                  <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-[11px]`}>
                    {g.react}
                  </td>
                  <td className={`${TYPO.mono()} whitespace-nowrap py-1 pr-3 text-[11px]`}>
                    <button
                      type="button"
                      onClick={() => setOpenRow(open ? "" : gid)}
                      className="text-orange-300 underline decoration-dotted underline-offset-2"
                      title="List the variants"
                    >
                      {g.variants.length} of {total}
                    </button>
                    {open ? (
                      <div className="mt-1 max-h-32 max-w-xs overflow-auto text-[10px] text-gray-dark-500">
                        {g.variants.join(", ")}
                      </div>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap py-1">
                    <div className="flex items-center gap-1">
                      {isIgnored ? (
                        <RestoreButton id={gid} />
                      ) : (
                        <>
                          <FlagButtons
                            id={gid}
                            flag={{
                              component: react,
                              title: `${react}: ${g.what} is ${g.figma} drawn, ${g.react} rendered — on ${g.variants.length} of ${total} variants${trait ? ` (${trait})` : ""}`,
                              detail: `Measured in the console on every drawn variant the kit renders, against the surface the Figma plugin exported. Variants: ${g.variants.slice(0, 12).join(", ")}${g.variants.length > 12 ? "…" : ""}.`,
                              evidence: g.note ?? "",
                            }}
                          />
                          {review.flagged.has(gid) ? null : (
                            <IgnoreButton id={gid} title={`${react}: ${g.what}`} compact />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : null}
      {rows && clean.length > 0 ? (
        <Text size="xs" c="muted">
          Same on every variant:{" "}
          {clean
            .map((k) => ({ background: "background", "border-color": "border colour", "border-width": "border width", radius: "radius", "padding-v": "padding ↕", "padding-h": "padding ↔", gap: "gap", height: "height", "text-color": "text colour", "font-size": "font size" })[k] ?? k)
            .join(", ")}
          .
        </Text>
      ) : null}
      {rows && rows.skipped.length > 0 ? (
        <ul className="flex flex-col gap-0.5">
          {rows.skipped.map((sk) => (
            <li key={`${sk.what}|${sk.reason}`} className="text-[11px] text-gray-dark-500">
              <span className="text-gray-dark-400">{sk.what}</span> not compared on{" "}
              {sk.variants} variant{sk.variants > 1 ? "s" : ""}: {sk.reason}.
            </li>
          ))}
        </ul>
      ) : null}
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
    label: "in Figma and in React",
  },
  "kit-only": {
    ring: "border-white/10 opacity-45",
    dot: "bg-gray-500",
    label: "in React — nobody drew it in Figma",
  },
  "figma-only": {
    ring: "border-red-500/60 bg-red-500/5",
    dot: "bg-red-500",
    label: "in Figma — React refuses this value",
  },
  neither: {
    ring: "border-dashed border-white/8",
    dot: "",
    label: "in neither",
  },
} as const

type CellState = keyof typeof CELL

/** The two axes a grid should open on, ranked by what they MEAN (`AXIS_RANK`) and, within
 *  a rank, by where the holes are. Pure, so the choice is the same on every visit. */
const pickAxes = (axes: CoverageAxis[]): [string, string] => {
  const ranked = [...axes].sort((a, b) => {
    const ra = AXIS_RANK[a.nature] ?? 8
    const rb = AXIS_RANK[b.nature] ?? 8
    if (ra !== rb) return ra - rb
    const ha = a.only_figma.length + a.only_kit.length
    const hb = b.only_figma.length + b.only_kit.length
    if (ha !== hb) return hb - ha
    return b.figma.length + b.kit.length - (a.figma.length + a.kit.length)
  })
  return [ranked[0]?.axis ?? "", ranked[1]?.axis ?? ""]
}

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
 *  is a click away — which is the gesture you make once you have spotted the odd cell.
 *
 *  ⚠️ The pickers are drawn ONLY when there is a choice to make (three axes or more), and
 *  they open on the two axes that mean something — `AXIS_RANK`. Reported on 2026-09-10:
 *  "j'ai des sélecteurs, je ne sais pas à quoi ils servent, ils ne font rien". They did
 *  something; on a Slider it opened on `value × size` with a `range = any` filter, and
 *  changing the filter moved a dot nobody was looking at. */
const CoverageGrid = ({
  slug,
  react,
  cov,
  visuals,
  defaults,
  dark,
  frames,
}: {
  slug: string
  react: string
  cov: Coverage
  visuals: { exported: boolean; variants: Record<string, VariantVisual>; modes: string[] }
  defaults: Record<string, string>
  dark: boolean
  frames: boolean
}) => {
  const axes = cov.axes
  const [defaultRow, defaultCol] = useMemo(() => pickAxes(axes), [axes])
  const [rowAxis, setRowAxis] = useState(defaultRow)
  const [colAxis, setColAxis] = useState(defaultCol)
  const [fixed, setFixed] = useState<Record<string, string>>({})
  const [zoom, setZoom] = useState<CoverageCombo | null>(null)
  // The rendered element of the zoomed cell — the ONLY place the kit's classes have become
  // an actual colour and width, which is what the visual diff measures.
  const [zoomNode, setZoomNode] = useState<HTMLElement | null>(null)
  const zoomProps = zoom ? propsFor(zoom.values, axes) : undefined

  const find = (name: string) => axes.find((a) => a.axis === name)
  // The FIRST axis goes across (columns): `variant` reads better as a row of swatches. ONE
  // axis is still a grid — a single row. The previous version refused to draw it and sent
  // the reader back to the table, which cannot show a hole as a red cell.
  const colDef = find(colAxis) ?? find(defaultCol) ?? find(defaultRow) ?? axes[0]
  const rowDef = axes.length > 1 ? (find(rowAxis) ?? find(defaultRow)) : undefined
  if (!colDef)
    return (
      <Text size="xs" c="muted">
        No drawn combination could be decoded for this component.
      </Text>
    )
  if (rowDef && rowDef.axis === colDef.axis)
    return (
      <Text size="xs" c="muted">
        Pick two different axes.
      </Text>
    )

  // The union of both sides, so a value only ONE side has still gets its row: those are
  // exactly the rows worth looking at.
  const union = (a: CoverageAxis) => {
    const seen = new Map<string, string>()
    for (const v of [...a.figma, ...a.kit])
      if (!seen.has(v.toLowerCase())) seen.set(v.toLowerCase(), v)
    return [...seen.values()]
  }
  const rows = rowDef ? union(rowDef) : [""]
  const cols = union(colDef)
  const others = axes.filter((a) => a.axis !== rowDef?.axis && a.axis !== colDef.axis)

  const matching = (r: string, c: string) =>
    cov.combinations.filter(
      (k) =>
        (!rowDef || sameName(k.values[rowDef.axis] ?? "", r)) &&
        sameName(k.values[colDef.axis] ?? "", c) &&
        others.every((o) => !fixed[o.axis] || k.values[o.axis] === fixed[o.axis]),
    )

  const inKit = (a: CoverageAxis | undefined, v: string) =>
    // ⚠️ An axis whose values the manifest cannot read is treated as ACCEPTING the value.
    // The alternative is painting a whole grid red on the strength of what this report
    // cannot see — the accusation the whole module refuses to make.
    !a || !a.readable || a.kit.some((k) => sameName(k, v))

  const drawnBy = (a: CoverageAxis | undefined, v: string) =>
    !a || a.figma.some((f) => sameName(f, v))

  const state = (r: string, c: string): CellState => {
    const drawn = matching(r, c).length > 0
    const renderable = inKit(rowDef, r) && inKit(colDef, c)
    if (drawn && renderable) return "both"
    if (drawn) return "figma-only"
    return renderable ? "kit-only" : "neither"
  }

  const props = (r: string, c: string): Record<string, unknown> => {
    const out: Record<string, unknown> = {}
    if (rowDef?.react && rowDef.readable) out[rowDef.react] = r
    if (colDef.react && colDef.readable) out[colDef.react] = c
    for (const o of others)
      if (fixed[o.axis] && o.react && o.readable) out[o.react] = fixed[o.axis]
    return out
  }

  const cells = rows.length * cols.length
  const drawnCells = rows.reduce(
    (n, r) => n + cols.filter((c) => state(r, c) === "both").length,
    0,
  )
  const refusedCells = rows.reduce(
    (n, r) => n + cols.filter((c) => state(r, c) === "figma-only").length,
    0,
  )
  const renderableCells = rows.reduce(
    (n, r) =>
      n +
      cols.filter((c) => state(r, c) !== "neither" && state(r, c) !== "figma-only").length,
    0,
  )

  const select = (value: string, onChange: (v: string) => void, exclude: string) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${TYPO.mono()} rounded border border-white/15 bg-transparent px-1.5 py-0.5 text-gray-dark-200 text-xs`}
    >
      {axes
        .filter((a) => a.axis !== exclude)
        .map((a) => (
          <option key={a.axis} value={a.axis} className="bg-gray-dark-900">
            {a.axis}
          </option>
        ))}
    </select>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* What the grid IS, in one sentence, before any control. */}
      <Text size="xs" c="muted">
        Each cell renders the kit at <code className={TYPO.mono()}>{colDef.axis}</code>
        {rowDef ? (
          <>
            {" "}
            (columns) × <code className={TYPO.mono()}>{rowDef.axis}</code> (rows)
          </>
        ) : null}
        ; the dot says whether Figma drew that combination.
        {others.length > 0
          ? ` The other ${others.length === 1 ? "axis" : "axes"} (${others.map((o) => o.axis).join(", ")}) ${others.length === 1 ? "is" : "are"} not fixed: a cell counts as drawn if any of their values was.`
          : ""}
      </Text>

      {axes.length > 2 ? (
        <div className="flex flex-wrap items-center gap-3 text-gray-dark-500 text-xs">
          <label className="flex items-center gap-1">
            columns {select(colDef.axis, setColAxis, rowDef?.axis ?? "")}
          </label>
          <label className="flex items-center gap-1">
            rows {select(rowDef?.axis ?? "", setRowAxis, colDef.axis)}
          </label>
          {others.map((o) => (
            <label key={o.axis} className="flex items-center gap-1">
              fix {o.axis} to
              <select
                value={fixed[o.axis] ?? ""}
                onChange={(e) => setFixed((f) => ({ ...f, [o.axis]: e.target.value }))}
                className={`${TYPO.mono()} rounded border border-white/15 bg-transparent px-1.5 py-0.5 text-gray-dark-200 text-xs`}
              >
                <option value="" className="bg-gray-dark-900">
                  any value
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
      ) : null}

      {/* ⚠️ The answer, IN WORDS, above the grid. The first version encoded it in the
          border colour of a cell and left the reader to decode it through a legend at the
          bottom of the page — which is not an answer to "what is missing on which side",
          it is a puzzle whose solution happens to be one. The colours stay; they are now a
          second reading of a sentence, not the only one. */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 p-3">
        <Text size="sm">
          <strong>{drawnCells}</strong> of the {renderableCells} combinations the kit can
          render are drawn in Figma.
          {refusedCells > 0 ? (
            <span className="text-red-300">
              {" "}
              <strong>{refusedCells}</strong> drawn combination{refusedCells > 1 ? "s" : ""}{" "}
              cannot be rendered.
            </span>
          ) : null}
          {cells !== renderableCells && refusedCells === 0
            ? ` ${cells - renderableCells} more cell${cells - renderableCells > 1 ? "s" : ""} exist${cells - renderableCells > 1 ? "" : "s"} on one side only.`
            : ""}
        </Text>
        {[colDef, rowDef]
          .filter((a): a is CoverageAxis => Boolean(a))
          .map((a) => (
            <div key={a.axis} className="flex flex-col gap-0.5">
              {a.only_figma.length > 0 ? (
                <Text size="xs" className="text-red-300">
                  <code className={TYPO.mono()}>{a.axis}</code>: Figma draws{" "}
                  <strong>{a.only_figma.join(", ")}</strong> — the kit does not accept
                  {a.only_figma.length > 1 ? " those values" : " that value"}.
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
      </div>

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
                  ) : !drawnBy(colDef, c) ? (
                    <div className="text-[10px] text-gray-dark-600">kit only</div>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r || "-"}>
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
                  {rowDef && !inKit(rowDef, r) ? (
                    <div className="text-[10px] text-red-400">Figma only</div>
                  ) : rowDef && !drawnBy(rowDef, r) ? (
                    <div className="text-[10px] text-gray-dark-600">kit only</div>
                  ) : null}
                </th>
                {cols.map((c) => {
                  const s = state(r, c)
                  const hits = matching(r, c)
                  const tone = CELL[s]
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
                        title={`${rowDef ? `${rowDef.axis}=${r} · ` : ""}${colDef.axis}=${c} — ${tone.label}`}
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
              {/* Through `propsFor`, like the two other renders: it drops the axes that
                  are not props (content samples, states) and REFUSES a value the kit
                  does not take. Mapping every axis by name rendered `<Badge color="grey">`
                  as the kit's default and compared Figma's grey against it. */}
              {zoomProps === null ? (
                <Text size="xs" className="text-red-300 text-center">
                  This combination uses a value the kit refuses: nothing faithful can be
                  rendered beside it. It is one of the findings above.
                </Text>
              ) : (
                <PreviewBoundary name={react}>{PREVIEWS[react]?.(zoomProps)}</PreviewBoundary>
              )}
            </div>
          </div>
          <div className="mt-3">
            <SurfacePanel
              react={react}
              variant={zoom.variant}
              visual={visuals.variants[zoom.variant]}
              node={zoomProps === null ? null : zoomNode}
              exported={visuals.exported}
              title="This variant's surface: Figma against React"
              theme={dark ? "dark" : "light"}
              modes={visuals.modes ?? []}
              resting={atRest(zoom.values, axes, defaults)}
              unmapped={unmappedAxis(zoom.values, axes)}
              part={partSelector(react, slug)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- one axis row

/** ONE axis, the two sides facing each other, and the difference SPELLED OUT underneath.
 *  The values get room, the two sides are aligned so the eye can compare them without
 *  scanning across a table, and every divergence is a SENTENCE. */
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
        {register ? <span className="text-[10px] text-gray-dark-600">{register}</span> : null}
      </div>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {values.map((val) => {
            const only = highlight.some((h) => sameName(h, val))
            const isDefault = def && sameName(def, val)
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
          label="Figma"
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
        {a.figma_default && a.react_default && !sameName(a.figma_default, a.react_default) ? (
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

/** An axis that is BY DESIGN, in one line: what it is, where it lands, why it is not a
 *  finding. The reader who wants the two value lists opens the row. */
const AxisLine = ({ a }: { a: ParityAxis }) => {
  const [open, setOpen] = useState(false)
  const v = VERDICT[a.verdict] ?? VERDICT.unpaired
  return (
    <div className="border-white/6 border-t first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-2 py-1.5 text-left hover:bg-white/3"
      >
        {open ? (
          <ChevronDown size={12} className="mt-0.5 shrink-0 text-gray-dark-600" />
        ) : (
          <ChevronRight size={12} className="mt-0.5 shrink-0 text-gray-dark-600" />
        )}
        <code className={`${TYPO.mono()} shrink-0 text-gray-dark-200 text-xs`}>
          {a.axis || a.react}
        </code>
        {a.react && a.axis ? (
          <>
            <ArrowRight size={11} className="mt-1 shrink-0 text-gray-dark-600" />
            <code className={`${TYPO.mono()} shrink-0 text-gray-dark-400 text-xs`}>
              {a.react}
            </code>
          </>
        ) : null}
        <Badge color={v.color} size="sm" variant="light" className="shrink-0">
          {v.label}
        </Badge>
        <span className="min-w-0 flex-1 truncate text-[11px] text-gray-dark-500">
          {a.note || v.means}
        </span>
      </button>
      {open ? (
        <div className="pb-2 pl-5">
          <AxisPair a={a} />
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- one finding

/** One collapsible group with its count in the title. The page is made of these: what
 *  differs, what is by design, what is aligned, what is ignored — each foldable, the
 *  first one open. */
const Group = ({
  title,
  count,
  open: initial,
  tone,
  hint,
  children,
}: {
  title: string
  count: number
  open?: boolean
  tone?: string
  hint?: string
  children: ReactNode
}) => {
  const [open, setOpen] = useState(Boolean(initial))
  return (
    <div className="rounded-lg border border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/3"
      >
        {open ? (
          <ChevronDown size={14} className="shrink-0 text-gray-dark-500" />
        ) : (
          <ChevronRight size={14} className="shrink-0 text-gray-dark-500" />
        )}
        <Text size="sm" className={TYPO.title("semibold")}>
          {title}
        </Text>
        <Badge color={count > 0 ? (tone ?? "gray") : "gray"} size="sm" variant="light">
          {count}
        </Badge>
        {hint ? (
          <span className="ml-1 truncate text-[11px] text-gray-dark-500">{hint}</span>
        ) : null}
      </button>
      {open ? <div className="border-white/8 border-t px-3 py-2">{children}</div> : null}
    </div>
  )
}

// ---------------------------------------------------------------- one pair

/** ONE component, everything on one screen, the differences first.
 *
 *  Order, top to bottom: the two renders · what differs (the active findings, each with
 *  its owner and an Ignore) · the surface of the default variant, measured · what is by
 *  design, folded · what is aligned, folded · what was ignored, folded · the coverage
 *  grid, folded. Nothing a reviewer needs is behind a toggle they have to know exists. */
const Pair = ({
  pair,
  findings,
  dark,
  frames,
}: {
  pair: ParityPair
  findings: ParityFinding[]
  dark: boolean
  frames: boolean
}) => {
  const [variant, setVariant] = useState("")
  const [detail, setDetail] = useState<ParityDetail | null>(null)
  const [detailError, setDetailError] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  // The default render's node — where the surface of the default variant is measured.
  const [previewNode, setPreviewNode] = useState<HTMLElement | null>(null)

  // The detail is read on open, once per component: it carries the named variants (for
  // the picker), the per-variant surfaces (for the measure) and the coverage (for the
  // grid). One call instead of three toggles that each fetched the same thing.
  useEffect(() => {
    let alive = true
    setDetail(null)
    setDetailError("")
    if (!pair.figma.detail) return
    getParityDetail(pair.figma.slug, pair.react)
      .then((d) => alive && setDetail(d))
      .catch((e: Error) => alive && setDetailError(e.message))
    return () => {
      alive = false
    }
  }, [pair.figma.slug, pair.react, pair.figma.detail])

  const active = findings.filter((f) => !f.ignored)
  const ignored = findings.filter((f) => f.ignored)
  const byDesign = pair.axes.filter((a) => BY_DESIGN.has(a.verdict))
  const aligned = pair.axes.filter((a) => a.verdict === "aligned")
  // The axes behind the active findings. An axis whose only finding was IGNORED is
  // settled and leaves this block with it — otherwise the reviewer reads "unpaired" in red
  // under a list that no longer mentions it.
  const names = (f: ParityFinding) => f.id.split(":").slice(2).join(":")
  const about = (a: ParityAxis, list: ParityFinding[]) =>
    list.some((f) => {
      const tail = names(f)
      return (a.axis && tail === slugify(a.axis)) || (a.react && tail === slugify(a.react))
    })
  const differing = pair.axes.filter(
    (a) =>
      (a.verdict === "values" || a.verdict === "unpaired") &&
      (about(a, active) || !about(a, ignored)),
  )
  const blind = pair.axes.filter((a) => a.verdict === "unreadable")
  const comparable = pair.axes.length > blind.length

  // The default variant's surface: the key_variant whose node is the default node.
  const defaultVariant = detail
    ? (Object.entries(detail.key_variants).find(([, node]) => node === detail.default_node)?.[0] ??
      "")
    : ""
  const visuals = detail?.visuals ?? { exported: false, variants: {}, modes: [] }
  // The variant BOTH sides show: the one picked in the Figma dropdown, else Figma's
  // default. Its values become the kit's props (`propsFor`, matching by prop), so the two
  // renders and the surface measured under them are about the same variant.
  const shownVariant = variant || defaultVariant
  const shownValues = useMemo(() => {
    if (!detail) return null
    if (variant)
      return detail.coverage.combinations.find((c) => c.variant === variant)?.values ?? null
    return detail.defaults
  }, [detail, variant])
  const shownProps = useMemo(() => {
    if (!detail || !shownValues) return undefined
    const p = propsFor(shownValues, detail.coverage.axes)
    return p && Object.keys(p).length ? p : undefined
  }, [detail, shownValues])
  const refused = Boolean(detail && shownValues && propsFor(shownValues, detail.coverage.axes) === null)
  // An axis of the picked variant that lands on no prop: the render beside it is NOT that
  // variant, and its surface must not be held against the drawing's.
  const unmapped = detail && shownValues ? unmappedAxis(shownValues, detail.coverage.axes) : ""

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(await getParityBrief({ component: pair.react }))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* The header: ONE number, and it is the same one as in the list and the brief. */}
      <div className="flex flex-wrap items-center gap-2">
        <code className={`${TYPO.mono()} text-gray-dark-500 text-xs`}>{pair.figma.slug}</code>
        {pair.category ? (
          <Badge color="gray" size="sm" variant="outline">
            {pair.category}
          </Badge>
        ) : null}
        {active.length > 0 ? (
          <Badge color="orange" size="sm">
            {active.length} to review
          </Badge>
        ) : comparable ? (
          <Badge color="green" size="sm">
            <Check size={13} />
            nothing to review
          </Badge>
        ) : (
          <Badge color="purple" size="sm" variant="light">
            nothing comparable
          </Badge>
        )}
        {ignored.length > 0 ? (
          <Badge color="gray" size="sm" variant="outline">
            {ignored.length} ignored
          </Badge>
        ) : null}
        {!pair.figma.described ? (
          <Badge color="orange" size="sm" variant="outline">
            no description in Figma
          </Badge>
        ) : null}
        <span className="ml-auto">
          <Button size="sm" variant="outline" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy this component's brief"}
          </Button>
        </span>
      </div>
      {error ? (
        <Alert color="red" variant="light" title="Cannot copy" description={error} />
      ) : null}

      {/* The two sides, at the same width so the eye can actually compare them. */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Text size="xs" c="muted">
              Figma · {pair.figma.page.trim()}
            </Text>
            {detail && Object.keys(detail.key_variants).length > 1 ? (
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                title="Render another drawn variant"
                className={`${TYPO.mono()} max-w-[60%] rounded border border-white/15 bg-transparent px-1.5 py-0.5 text-[11px] text-gray-dark-300`}
              >
                <option value="" className="bg-gray-dark-900">
                  default variant
                </option>
                {Object.keys(detail.key_variants).map((k) => (
                  <option key={k} value={k} className="bg-gray-dark-900">
                    {k}
                  </option>
                ))}
              </select>
            ) : pair.figma.variant_count > 0 ? (
              <span className={`${TYPO.mono()} text-gray-dark-500 text-[11px]`}>
                {pair.figma.variant_count} variants
              </span>
            ) : null}
          </div>
          <div className="flex min-h-24 items-center justify-center">
            {frames ? (
              <FigmaFrame slug={pair.figma.slug} variant={variant} />
            ) : (
              <Text size="xs" c="muted" className="text-center">
                No FIGMA_TOKEN on the server: the comparison works, the picture cannot be
                rendered.
              </Text>
            )}
          </div>
        </div>
        <div
          className="rounded-lg border border-white/10 p-3"
          data-theme={dark ? "dark" : "light"}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <Text size="xs" c="muted" className="shrink-0">
              {pair.import ? "@42/ui-react" : "the kit"}
              {shownProps ? (variant ? " · same variant" : " · at Figma's default") : ""}
            </Text>
            <code className={`${TYPO.mono()} truncate text-gray-dark-500 text-[11px]`}>
              {shownProps
                ? `<${pair.react} ${Object.entries(shownProps)
                    .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
                    .join(" ")} />`
                : pair.snippet}
            </code>
          </div>
          <div
            ref={setPreviewNode}
            className={`flex min-h-24 items-center justify-center rounded ${
              dark ? "bg-black/20" : "bg-white"
            } p-3`}
          >
            {refused ? (
              <Text size="xs" className="text-red-300 text-center">
                This variant uses a value the kit refuses: nothing faithful can be rendered
                beside it. It is one of the findings above.
              </Text>
            ) : (
              <KitPreview name={pair.react} props={shownProps} />
            )}
          </div>
        </div>
      </div>

      {/* 1. What differs — the active findings of this component. The list the brief
          carries, the number the card shows. */}
      <Group
        title="What differs"
        count={active.length}
        open
        tone="orange"
        hint={
          active.length === 0
            ? comparable
              ? "nothing left to hand to a dev"
              : "no axis could be compared"
            : `${active.filter((f) => f.owner === "kit").length} for the kit · ${active.filter((f) => f.owner === "both").length} to settle · ${active.filter((f) => f.owner === "figma").length} for Figma`
        }
      >
        {active.length === 0 ? (
          <Text size="xs" c="muted">
            {comparable
              ? "Every axis that could be compared lines up, or was settled."
              : "The manifest cannot read this component's values — nothing here says anything about the kit."}
          </Text>
        ) : (
          <ul className="flex flex-col">
            {active.map((f) => (
              <FindingRow key={f.id} f={f} />
            ))}
          </ul>
        )}
        {differing.length > 0 ? (
          <div className="mt-3 border-white/8 border-t pt-2">
            <Text size="xs" c="muted" className="mb-1">
              The {differing.length === 1 ? "axis" : "axes"} behind{" "}
              {differing.length === 1 ? "it" : "them"}, both sides:
            </Text>
            {differing.map((a) => (
              <AxisPair key={`${a.axis}-${a.react}`} a={a} />
            ))}
          </div>
        ) : null}
      </Group>

      {/* 2. The surface, measured right here — ACROSS EVERY drawn variant the kit can
          render, then the one shown above in detail. Its counts are its own. */}
      {pair.figma.detail ? (
        <div className="flex flex-col gap-3 rounded-lg border border-white/10 px-3 py-2">
          {detailError ? (
            <Text size="xs" className="text-orange-300">
              {detailError}
            </Text>
          ) : !detail ? (
            <div className="flex items-center gap-2 py-1">
              <Spinner size="sm" />
              <Text size="xs" c="muted">
                Reading the drawn variants…
              </Text>
            </div>
          ) : (
            <>
              {visuals.exported && PREVIEWS[pair.react] ? (
                <AllVariantsSurface
                  react={pair.react}
                  detail={detail}
                  dark={dark}
                  part={partSelector(pair.react, pair.figma.slug)}
                />
              ) : null}
              <SurfacePanel
                react={pair.react}
                variant={shownVariant || "default"}
                visual={shownVariant ? visuals.variants[shownVariant] : undefined}
                node={PREVIEWS[pair.react] && !refused ? previewNode : null}
                exported={visuals.exported}
                title={
                  variant
                    ? "This variant's surface: Figma against React"
                    : "The default variant's surface: Figma against React"
                }
                theme={dark ? "dark" : "light"}
                modes={visuals.modes ?? []}
                resting={
                  !detail || !shownValues || atRest(shownValues, detail.coverage.axes, detail.defaults)
                }
                unmapped={unmapped}
                part={partSelector(pair.react, pair.figma.slug)}
              />
            </>
          )}
        </div>
      ) : null}

      {/* 3. By design — folded. The count says how much of the component is expected
          divergence; the lines say why, one each. */}
      <Group
        title="By design — nothing to do"
        count={byDesign.length}
        hint="runtime states, slots, the palette living in color, what Field owns"
      >
        {byDesign.length === 0 ? (
          <Text size="xs" c="muted">
            No axis of this component is an expected divergence.
          </Text>
        ) : (
          byDesign.map((a) => <AxisLine key={`${a.axis}-${a.react}`} a={a} />)
        )}
      </Group>

      <Group title="Aligned" count={aligned.length} tone="green">
        {aligned.length === 0 ? (
          <Text size="xs" c="muted">
            No axis lines up value for value on both sides.
          </Text>
        ) : (
          aligned.map((a) => <AxisLine key={`${a.axis}-${a.react}`} a={a} />)
        )}
      </Group>

      {ignored.length > 0 ? (
        <Group
          title="Ignored"
          count={ignored.length}
          hint="left out of the brief and the counts"
        >
          <ul className="flex flex-col">
            {ignored.map((f) => (
              <FindingRow key={f.id} f={f} />
            ))}
          </ul>
        </Group>
      ) : null}

      {/* 4. The coverage grid — folded: forty live renders are paid for only when asked. */}
      {pair.figma.variant_count > 1 ? (
        <Group
          title="Every combination, Figma against React"
          count={pair.figma.variant_count}
          hint="red cells are what Figma draws and React refuses"
        >
          {detailError ? (
            <Text size="xs" className="text-orange-300">
              {detailError}
            </Text>
          ) : detail ? (
            <CoverageGrid
              slug={pair.figma.slug}
              react={pair.react}
              cov={detail.coverage}
              visuals={visuals}
              defaults={detail.defaults}
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
          )}
        </Group>
      ) : null}

      {pair.others.length > 0 ? (
        <Text size="xs" c="muted">
          Also on this Figma page: {pair.others.map((o) => o.slug).join(", ")} — page blocks
          or private parts, not library components. If they are neither, they belong on
          another page.
        </Text>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- the overview

type OverviewTab = "findings" | "pairs" | "figma-only" | "kit-only" | "ignored"

/** The finding that stands for a one-sided entry: `missing-in-kit` (or the acknowledged
 *  gap) for a Figma-only component, `missing-in-figma` for a kit-only one. It is what the
 *  Ignore on those lists acts on. */
const findingFor = (findings: ParityFinding[], component: string, kinds: string[]) =>
  findings.find((f) => sameName(f.component, component) && kinds.includes(f.kind))

/** What the right-hand column shows while no component is picked — and the tab is chosen
 *  by clicking a NUMBER at the top: "In Figma only (4)" opens the four. The holes used to
 *  be two cards at the bottom of the findings; reported on 2026-09-10 ("In Figma only doit
 *  être cliquable, In the kit only aussi, pour voir en un clin d'œil les trous"). */
const Overview = ({
  data,
  tab,
  owner,
  setOwner,
  counts,
}: {
  data: ParityReport
  tab: OverviewTab
  owner: Owner
  setOwner: (o: Owner) => void
  counts: Record<string, { active: number; kit: number; ignored: number }>
}) => {
  const c = data.counts
  const [copied, setCopied] = useState("")
  const [error, setError] = useState("")
  const link = (name: string) =>
    data.pairs.some((p) => sameName(p.react, name))
      ? `#/parity/${encodeURIComponent(name)}`
      : undefined

  const copyOwner = async (o: Owner, prompt: boolean) => {
    try {
      await navigator.clipboard.writeText(await getParityBrief({ owner: o, prompt }))
      setCopied(prompt ? `${o}:prompt` : o)
      setTimeout(() => setCopied(""), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const decision = (f: ParityFinding | undefined) =>
    f ? (
      f.ignored ? (
        <RestoreButton id={f.id} />
      ) : (
        <IgnoreButton id={f.id} title={f.title} />
      )
    ) : null

  if (tab === "pairs")
    return (
      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          The {c.pairs} pairs, at a glance
        </Title>
        <Text size="xs" c="muted">
          One row per paired component: how many findings are left, and how many of them are
          the kit's. Click a name to open it.
        </Text>
        <Card>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] text-gray-dark-500 uppercase">
                    <th className="pb-1 pr-3 font-normal">Component</th>
                    <th className="pb-1 pr-3 font-normal">Figma</th>
                    <th className="pb-1 pr-3 font-normal">Page</th>
                    <th className="pb-1 pr-3 text-right font-normal">To review</th>
                    <th className="pb-1 pr-3 text-right font-normal">For the kit</th>
                    <th className="pb-1 text-right font-normal">Ignored</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pairs.map((p) => {
                    const k = counts[p.react] ?? { active: 0, kit: 0, ignored: 0 }
                    return (
                      <tr key={p.react} className="border-white/6 border-t">
                        <td className="py-1 pr-3">
                          <a
                            href={`#/parity/${encodeURIComponent(p.react)}`}
                            className="text-sm text-white underline decoration-dotted underline-offset-2"
                          >
                            {p.react}
                          </a>
                        </td>
                        <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-400 text-xs`}>
                          {p.figma.slug}
                        </td>
                        <td className="py-1 pr-3 text-gray-dark-500 text-xs">
                          {p.figma.page.trim()}
                        </td>
                        <td className={`${TYPO.mono()} py-1 pr-3 text-right text-xs`}>
                          {k.active > 0 ? (
                            <span className="text-orange-300">{k.active}</span>
                          ) : (
                            <Check size={12} className="ml-auto text-green-600" />
                          )}
                        </td>
                        <td className={`${TYPO.mono()} py-1 pr-3 text-right text-xs`}>
                          {k.kit > 0 ? <span className="text-blue-300">{k.kit}</span> : "·"}
                        </td>
                        <td
                          className={`${TYPO.mono()} py-1 text-right text-gray-dark-500 text-xs`}
                        >
                          {k.ignored > 0 ? k.ignored : "·"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      </div>
    )

  if (tab === "figma-only")
    return (
      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          In Figma, not in React ({data.figma_only.length})
        </Title>
        <Text size="xs" c="muted">
          Components of the Figma file with no counterpart in @42/ui-react. A screen that uses
          one is composed by hand. "Known gap" means the file itself declares the page as
          still to add on the React side.
        </Text>
        <Card>
          <Card.Content>
            {data.figma_only.length === 0 ? (
              <Text c="secondary" size="sm">
                Everything drawn has a counterpart in the kit.
              </Text>
            ) : (
              <ul className="flex flex-col">
                {data.figma_only.map((e) => {
                  const f = findingFor(data.findings, e.slug, [
                    "missing-in-kit",
                    "acknowledged-gap",
                  ])
                  return (
                    <li key={e.slug} className="border-white/6 border-t py-2 first:border-t-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className={`${TYPO.mono()} text-gray-dark-100 text-sm`}>
                          {e.slug}
                        </code>
                        <span className="text-gray-dark-500 text-xs">{e.page.trim()}</span>
                        {e.acknowledged ? (
                          <Badge color="gray" size="sm" variant="outline">
                            known gap
                          </Badge>
                        ) : null}
                        {e.internal ? (
                          <Badge color="gray" size="sm" variant="outline">
                            private part
                          </Badge>
                        ) : null}
                        {f?.ignored ? (
                          <Badge color="gray" size="sm" variant="light">
                            ignored
                          </Badge>
                        ) : null}
                        <span className="ml-auto">{decision(f)}</span>
                      </div>
                      {Object.keys(e.axes).length > 0 ? (
                        <div className={`${TYPO.mono()} mt-1 text-[11px] text-gray-dark-500`}>
                          axes: {Object.keys(e.axes).join(", ")}
                        </div>
                      ) : null}
                      {f?.ignored && f.ignored_why ? (
                        <Text size="xs" c="muted" className="mt-1">
                          {f.ignored_by}: {f.ignored_why}
                        </Text>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </Card.Content>
        </Card>
      </div>
    )

  if (tab === "kit-only")
    return (
      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          In React, not in Figma ({c.react_only_expected})
        </Title>
        <Text size="xs" c="muted">
          Components of @42/ui-react that no page of the Figma file draws. A designer has no
          instance to reach for, and an agent reading the catalogue does not know they exist.{" "}
          {data.react_only.length - c.react_only_expected} layout primitives and typography
          helpers are excluded: they are not meant to be drawn.
        </Text>
        <Card>
          <Card.Content>
            <ul className="flex flex-col">
              {data.react_only
                .filter((r) => r.drawn)
                .map((r) => {
                  const f = findingFor(data.findings, r.react, ["missing-in-figma"])
                  return (
                    <li key={r.react} className="border-white/6 border-t py-2 first:border-t-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`${TYPO.title("semibold")} text-sm`}>{r.react}</span>
                        <span className="text-gray-dark-500 text-xs">{r.category}</span>
                        <code className={`${TYPO.mono()} text-[11px] text-gray-dark-600`}>
                          {r.snippet}
                        </code>
                        {f?.ignored ? (
                          <Badge color="gray" size="sm" variant="light">
                            ignored
                          </Badge>
                        ) : null}
                        <span className="ml-auto">{decision(f)}</span>
                      </div>
                      {r.summary ? (
                        <Text size="xs" c="muted" className="mt-0.5">
                          {r.summary}
                        </Text>
                      ) : null}
                      {f?.ignored && f.ignored_why ? (
                        <Text size="xs" c="muted" className="mt-1">
                          {f.ignored_by}: {f.ignored_why}
                        </Text>
                      ) : null}
                    </li>
                  )
                })}
            </ul>
          </Card.Content>
        </Card>
      </div>
    )

  if (tab === "ignored") {
    const list = data.findings.filter((f) => f.ignored)
    return (
      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          Ignored by the reviewer ({list.length})
        </Title>
        <Text size="xs" c="muted">
          Left out of the brief and of every count, with who and why. Committed in{" "}
          <code className={TYPO.mono()}>{data.review.path}</code>; a restore puts one back.
        </Text>
        <Card>
          <Card.Content>
            {list.length === 0 ? (
              <Text c="secondary" size="sm">
                Nothing has been ignored yet.
              </Text>
            ) : (
              <ul className="flex flex-col">
                {list.map((f) => (
                  <FindingRow key={f.id} f={f} href={link(f.component)} />
                ))}
              </ul>
            )}
          </Card.Content>
        </Card>
      </div>
    )
  }

  const grouped = data.findings.filter((f) => f.owner === owner && !f.ignored)
  return (
    <div className="flex flex-col gap-3">
      <Title order={2} size="md" className={TYPO.title()}>
        What to change, and who changes it
      </Title>
      {/* WHO gets what, before the list: the per-owner brief existed behind a filter and
          two buttons that copied "the current one", which is not a hand-off. */}
      <HandOff counts={c.by_owner} copy={(o, prompt) => void copyOwner(o, prompt)} copied={copied} />
      <Closed history={data.history} />
      <Text size="xs" c="muted">
        Below: the same findings, to read here. Pick a side.
      </Text>
      <OwnerBar owner={owner} counts={c.by_owner} setOwner={setOwner} />
      <Text size="sm" c="secondary">
        {OWNER[owner].hint}
      </Text>
      {error ? (
        <Alert color="red" variant="light" title="Cannot copy" description={error} />
      ) : null}
      <Card>
        <Card.Content>
          {grouped.length === 0 ? (
            <Text c="secondary" size="sm">
              Nothing on this side.
            </Text>
          ) : (
            <ul className="flex flex-col">
              {grouped.map((f) => (
                <FindingRow key={f.id} f={f} href={link(f.component)} />
              ))}
            </ul>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------- the sub-navigation

/** The component list. Cheap — a row and a number — and exactly one component is mounted
 *  at a time. The selection lives in the HASH (`#/parity/Badge`): a reload lands back on
 *  the same component, and a link to one can be pasted to a colleague.
 *
 *  The number beside a name is the component's ACTIVE findings — the same number the card
 *  and the brief carry. Blue when some of them are the kit's, which is what a front-end dev
 *  scans the list for. */
const ComponentList = ({
  pairs,
  selected,
  counts,
}: {
  pairs: ParityPair[]
  selected: string
  counts: Record<string, { active: number; kit: number; ignored: number }>
}) => {
  const [filter, setFilter] = useState("")
  const [onlyGaps, setOnlyGaps] = useState(false)
  const needle = filter.trim().toLowerCase()
  const shown = pairs.filter((p) => {
    if (onlyGaps && (counts[p.react]?.active ?? 0) === 0) return false
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
        Only those with something to review
      </label>
      <div className="flex max-h-[70vh] flex-col overflow-y-auto">
        {shown.map((p) => {
          const k = counts[p.react] ?? { active: 0, kit: 0, ignored: 0 }
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
              {k.active > 0 ? (
                <span
                  title={`${k.active} to review, ${k.kit} for the kit`}
                  className={`${TYPO.mono()} shrink-0 text-[10px] ${
                    k.kit > 0 ? "text-blue-300" : "text-orange-300"
                  }`}
                >
                  {k.active}
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
            Written by the “42 — Sync Design System” plugin. Re-run a sync in Figma to refresh
            this side.
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
          {live && (s.react.snapshot_stale?.length ?? 0) > 0 ? (
            <Text size="xs" className="mt-1 text-orange-300">
              The committed ui-manifest.json disagrees on {s.react.snapshot_stale?.join(", ")}{" "}
              — regenerate it with{" "}
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
  // ⚠️ Dark ONLY, and not by choice of design. The kit wires `dark:` to
  // `[data-theme="dark"] *` — ANY dark ancestor — and the console is `<html
  // data-theme="dark">`, so a `data-theme="light"` on a preview box undoes nothing: the
  // component stays dark on a white box. The toggle this used to be compared those dark
  // renders against Figma's LIGHT values and reported every colour as a difference. A
  // light comparison needs the previews in their own frame; until then, saying "dark" is
  // the honest label. (Dark is also the DS's default mode, the one the foundations resolve.)
  const dark = true
  const [owner, setOwner] = useState<Owner>("kit")
  const [tab, setTab] = useState<OverviewTab>("findings")

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
              ? "Token rejected. Sign in again with your 42ds_… access token — the one your MCP connector uses."
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

  // Quietly, after a decision: the spinner of a full load would blank the component
  // being reviewed.
  const reload = useCallback(async () => setData(await getParity(false)), [])
  const { review, error: reviewError } = useReviewState(data?.review, reload)
  const author = review.author

  const [copiedFor, setCopiedFor] = useState("")
  const copyFor = async (owner: Owner) => {
    try {
      await navigator.clipboard.writeText(await getParityBrief({ owner }))
      setCopiedFor(owner)
      setTimeout(() => setCopiedFor(""), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
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
        title="This section reads the MCP server: it needs your access token."
        description="The same 42ds_… token your MCP connector uses. It stays in your browser."
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
  // ONE owner of "how many findings does this component have": the list, the card and
  // the pairs table all read this. Per component: active, of which the kit's, ignored.
  const counts: Record<string, { active: number; kit: number; ignored: number }> = {}
  for (const p of data.pairs) counts[p.react] = { active: 0, kit: 0, ignored: 0 }
  for (const f of data.findings) {
    const name = data.pairs.find((p) => sameName(p.react, f.component))?.react
    if (!name) continue
    if (f.ignored) counts[name].ignored += 1
    else {
      counts[name].active += 1
      if (f.owner === "kit") counts[name].kit += 1
    }
  }
  // The hash carries the selection. Matched case-insensitively so a hand-typed link works,
  // and falling back to nothing rather than to the first component — landing on a page
  // that silently shows something else than what the URL says is worse than an empty one.
  const current = data.pairs.find((p) => sameName(p.react, selected)) ?? null
  const currentFindings = current
    ? data.findings.filter((f) => sameName(f.component, current.react))
    : []

  const stat = (label: string, value: number, t: OverviewTab, tone?: string) => {
    const on = !current && tab === t
    return (
      <a
        key={t}
        href="#/parity"
        onClick={() => setTab(t)}
        className={`rounded-lg border p-3 no-underline transition ${
          on ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/25"
        }`}
      >
        <Text c="muted" size="sm">
          {label}
        </Text>
        <div className={`${TYPO.mono()} text-2xl ${tone ?? "text-white"}`}>{value}</div>
      </a>
    )
  }

  return (
    <ReviewContext.Provider value={review}>
      <div className="flex flex-col gap-6">
        <Sources s={data.sources} />

        <div className="flex flex-wrap items-center gap-2">
          {/* ⚠️ ONE sync gesture, and it is not here: the Figma → repo sync is the
              plugin's, whole. This button only re-reads what the plugin has committed. */}
          <Button
            size="sm"
            variant="outline"
            color="brand"
            onClick={() => load(true)}
            disabled={loading}
          >
            <RefreshCw size={14} />
            {loading ? "Reading the catalogue…" : "Refresh"}
          </Button>
          {/* The export, per person, in the toolbar — the same three lists the hand-off
              block hands out further down, where a reader looks for them first. */}
          <Button size="sm" variant="outline" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Everything"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="The findings the kit has to act on, as a list"
            onClick={() => void copyFor("kit")}
          >
            {copiedFor === "kit" ? <Check size={14} /> : <Copy size={14} />}
            Brief · dev
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="The findings the Figma file has to act on, as a list"
            onClick={() => void copyFor("figma")}
          >
            {copiedFor === "figma" ? <Check size={14} /> : <Copy size={14} />}
            Brief · designer
          </Button>
          <span
            className="flex items-center gap-1 text-[11px] text-gray-dark-500"
            title="The kit renders dark under any dark ancestor and the console is one: a light preview needs its own frame. Dark is also the DS's default mode, the one the foundations resolve."
          >
            <Moon size={13} />
            dark previews
          </span>
          {/* On the LEFT, after the buttons: the picker it opens is anchored to its left
              edge, and at the right end of the bar it ran off the page. */}
          <span className="ml-2 flex items-center gap-2 border-white/10 border-l pl-3">
            <Text size="xs" c="muted">
              Reviewing as
            </Text>
            <Signature />
          </span>
        </div>
        {!data.review.can_write ? (
          <Text size="xs" c="muted">
            The review is read-only on this server (no write access, or READ_ONLY): findings
            can be read and copied, not ignored or flagged.
          </Text>
        ) : !author ? (
          <Text size="xs" className="text-blue-200">
            Say who you are (top right) to ignore or flag a finding — a decision is signed.
          </Text>
        ) : null}
        {reviewError ? (
          <Alert
            color="red"
            variant="light"
            title="The decision was not saved"
            description={reviewError}
          />
        ) : null}

        {/* The numbers are DOORS. Each opens the list it counts. */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {stat("Paired", c.pairs, "pairs")}
          {stat(
            "To review",
            c.findings,
            "findings",
            c.findings > 0 ? "text-orange-300" : "text-white",
          )}
          {stat(
            "In Figma only",
            c.figma_only,
            "figma-only",
            c.figma_only > 0 ? "text-red-300" : "text-white",
          )}
          {stat("In React only", c.react_only_expected, "kit-only")}
          {stat("Ignored", c.ignored, "ignored", "text-gray-dark-400")}
        </div>

        {/* ⚠️ ONE component at a time. Mounting the 44 pairs together meant 44 live React
            previews, and once opened 44 coverage grids and 44 visual diffs. The list is
            cheap; the detail is paid for only where the reader is looking. */}
        <div className="flex flex-col gap-3">
          <Title order={2} size="md" className={TYPO.title()}>
            {current ? current.react : "Component by component"}
          </Title>
          {current ? (
            <a href="#/parity" className="text-gray-dark-400 text-xs hover:text-gray-dark-200">
              ← back to the overview
            </a>
          ) : (
            <Text size="xs" c="muted">
              Pick a component on the left. The number beside a name is what is left to review
              on it — the same number the brief carries; the address bar follows the selection,
              so a link to one can be sent as it is.
            </Text>
          )}
          <div className="grid gap-4 md:grid-cols-[minmax(200px,260px)_minmax(0,1fr)]">
            <ComponentList pairs={data.pairs} selected={current?.react ?? ""} counts={counts} />
            {/* `min-w-0`: a `1fr` track is `minmax(auto, 1fr)`, and a twelve-column grid
                inside it widened the whole page instead of scrolling in its own box. */}
            <div className="min-w-0">
              {current ? (
                <Pair
                  key={current.react}
                  pair={current}
                  findings={currentFindings}
                  dark={dark}
                  frames={data.sources.figma.frames !== false}
                />
              ) : (
                <Overview
                  data={data}
                  tab={tab}
                  owner={owner}
                  setOwner={setOwner}
                  counts={counts}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ReviewContext.Provider>
  )
}

export const PARITY_LEGEND: ReactNode = Object.entries(VERDICT).map(([k, v]) => (
  <div key={k}>
    <strong>{v.label}</strong> — {v.means}
  </div>
))
