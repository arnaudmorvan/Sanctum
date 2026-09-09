/**
 * The TARGET of a feedback item: what the viewer points at, described by several proofs.
 *
 * Mechanism ported from the designBrain widget (`packages/widget/src/lib/anchor.ts`), plus
 * what THIS project has on top: `data-42`. A Sanctum flow knows, for every element, whether
 * it comes from a `@42/ui-react` component or was hand-written (the Babel plugin sets it at
 * compile time). A target therefore carries the information that decides **who must fix it**:
 * padding that is too tight on a kit `Card` is a kit task, the same on a layout `div` is a
 * flow task. No other feedback tool can tell you that.
 *
 * WHY SEVERAL PROOFS. A CSS selector is precise and fragile: the class changes at the next
 * publication and the feedback points at nothing. An accessible name is coarse and robust. We
 * keep both, plus the semantic path, plus the rectangle — and whoever handles the feedback
 * cross-checks. Several weak proofs beat one proof we believe to be strong.
 *
 * WHAT THIS IS NOT. Neither a screenshot (the flow is online, we can open it) nor an HTML
 * fragment (the code is in the repo, not behind an authentication): the two reasons that make
 * them indispensable in designBrain do not exist here.
 */

/** The marker our own tooling carries — never targetable. */
export const UI_MARK = "data-sanctum-ui"

export interface Target {
  type: "element" | "zone"
  /** `kit:Card`, `dom:div`, or "" when the element does not come from the flow (chrome, bare text). */
  origin: string
  name: string
  role: string
  tag: string
  path: string
  selector: string
  /** Viewport coordinates, like everything else: [x, y, w, h]. */
  rect: [number, number, number, number]
  /** Present only for a hand-drawn zone. */
  region?: { x: number; y: number; w: number; h: number; scrollX: number; scrollY: number }
  /** Where the PIN sits, relative to the element's top-left corner (2026-09-08, the pins
   *  layer). A zone's centre: without it the pin can only sit on the element's corner,
   *  and a circled corner of a wide card would be marked at the wrong end of it. Absent
   *  on an element target — the corner is the right place there. */
  anchor?: { dx: number; dy: number }
}

export interface Zone {
  x: number
  y: number
  w: number
  h: number
  scrollX: number
  scrollY: number
}

export const isOurs = (el: Element | null): boolean =>
  !!el && !!el.closest?.(`[${UI_MARK}]`)

/** The name someone would give the element out loud. */
export const accessibleName = (el: Element): string => {
  const aria = el.getAttribute("aria-label")
  if (aria?.trim()) return aria.trim().slice(0, 80)
  const by = el.getAttribute("aria-labelledby")
  if (by) {
    const target = document.getElementById(by)
    if (target?.textContent?.trim()) return target.textContent.trim().replace(/\s+/g, " ").slice(0, 80)
  }
  const alt = el.getAttribute("alt") ?? el.getAttribute("title")
  if (alt?.trim()) return alt.trim().slice(0, 80)
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim()
  return text.slice(0, 80)
}

const ROLES: Record<string, string> = {
  a: "link", button: "button", nav: "navigation", header: "header", footer: "footer",
  main: "content", aside: "aside", section: "section", article: "card", img: "image",
  h1: "heading", h2: "heading", h3: "heading", h4: "heading", h5: "heading", h6: "heading",
  input: "field", select: "list", textarea: "text area", ul: "list", ol: "list", li: "item",
}

export const roleOf = (el: Element): string => {
  const explicit = el.getAttribute("role")
  if (explicit) return explicit.toLowerCase()
  return ROLES[el.tagName.toLowerCase()] ?? el.tagName.toLowerCase()
}

/** The origin set by `scripts/babel-origin.mjs` — empty if the element is not from the flow. */
export const originOf = (el: Element): string =>
  (el as HTMLElement).dataset?.["42"] ?? ""

/** The nearest origin walking up: the bare text of a `Card` belongs to the `Card`. */
export const nearestOrigin = (el: Element): string => {
  let n: Element | null = el
  while (n && n !== document.body) {
    const o = originOf(n)
    if (o) return o
    n = n.parentElement
  }
  return ""
}

/**
 * The CLICKABLE breadcrumb — the answer to "I meant to target the card, I targeted its
 * title". Every link is a real ancestor: clicking it re-targets that element. We stop at the
 * screen's container: beyond it lies the skeleton, which is not under review.
 */
export const breadcrumb = (el: Element, max = 5): { el: Element; label: string }[] => {
  const short = (x: Element): string => {
    const o = originOf(x)
    if (o) return o.split(":")[1] ?? o
    const name = accessibleName(x)
    if (name) return name.length > 16 ? `${name.slice(0, 15)}…` : name
    return x.tagName.toLowerCase()
  }
  const trail = [{ el, label: short(el) }]
  let n: Element | null = el.parentElement
  while (n && n !== document.body && n !== document.documentElement && trail.length < max) {
    if (!isOurs(n)) trail.unshift({ el: n, label: short(n) })
    n = n.parentElement
  }
  return trail
}

/** Readable path, without `nth-child`: it must survive a republication. */
export const semanticPath = (el: Element): string => {
  const links: string[] = []
  let n: Element | null = el.parentElement
  while (n && n !== document.documentElement) {
    const o = originOf(n)
    const tag = n.tagName.toLowerCase()
    if (o) {
      links.unshift(o.startsWith("kit:") ? o.slice(4) : tag)
    } else if (["section", "aside", "nav", "main", "article", "header", "footer"].includes(tag)) {
      const title = n.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim().slice(0, 40)
      links.unshift(title ? `${tag} "${title}"` : tag)
    }
    n = n.parentElement
  }
  const name = accessibleName(el).slice(0, 40)
  links.push(name ? `${roleOf(el)} "${name}"` : roleOf(el))
  return links.join(" › ")
}

/** Best-effort selector: id first, otherwise a short, bounded path. */
export const selectorOf = (el: Element): string => {
  const esc = (v: string) => (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(v) : v)
  const id = el.getAttribute("id")
  if (id && document.querySelectorAll(`#${esc(id)}`).length === 1) return `#${esc(id)}`

  const parts: string[] = []
  let n: Element | null = el
  let depth = 0
  while (n && n !== document.body && depth < 4) {
    let p = n.tagName.toLowerCase()
    const cls = (n.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 2)
    if (cls.length) p += cls.map((c) => `.${esc(c)}`).join("")
    const parent = n.parentElement
    if (parent) {
      const sameTag = [...parent.children].filter((c) => c.tagName === n?.tagName)
      if (sameTag.length > 1) p += `:nth-child(${[...parent.children].indexOf(n) + 1})`
    }
    parts.unshift(p)
    n = n.parentElement
    depth++
  }
  return parts.join(" > ")
}

const rectOf = (el: Element): [number, number, number, number] => {
  const r = el.getBoundingClientRect()
  return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]
}

export const describeElement = (el: Element): Target => ({
  type: "element",
  origin: nearestOrigin(el),
  name: accessibleName(el),
  role: roleOf(el),
  tag: el.tagName.toLowerCase(),
  path: semanticPath(el),
  selector: selectorOf(el),
  rect: rectOf(el),
})

/**
 * A CLICK: the element under it, plus where in that element the click landed.
 *
 * This is the comment tool's gesture — Figma drops a pin at a point, and a point is a
 * coordinate of a window that no longer exists at the next publication. We drop it on an
 * ELEMENT and keep the offset: the element is the address that survives, the offset is
 * the precision that says "this corner of the card", not "this card".
 */
export const describePoint = (el: Element, x: number, y: number): Target => {
  const box = el.getBoundingClientRect()
  return {
    ...describeElement(el),
    anchor: { dx: Math.round(x - box.left), dy: Math.round(y - box.top) },
  }
}

export const describeZone = (zone: Zone, holder: Element): Target => {
  const box = holder.getBoundingClientRect()
  return {
    ...describeElement(holder),
    type: "zone",
    // The name carries the GESTURE, not the element: saying "section" would suggest the
    // feedback targets the whole section when the viewer circled one corner of it.
    name: `Zone ${zone.w}×${zone.h} in ${nearestOrigin(holder).split(":")[1] || holder.tagName.toLowerCase()}`,
    role: "region",
    rect: [zone.x, zone.y, zone.w, zone.h],
    region: zone,
    anchor: {
      dx: Math.round(zone.x + zone.w / 2 - box.left),
      dy: Math.round(zone.y + zone.h / 2 - box.top),
    },
  }
}

/**
 * The element a zone hangs onto: the deepest one that CONTAINS it entirely.
 *
 * We probe by points rather than walking the tree — `elementsFromPoint` does the browser's
 * work (transforms, layers, stacking) in five calls. The common prefix of the returned stacks
 * is the shared ancestor chain; its last element is the deepest container. A zone drawn in a
 * margin sometimes covers nothing: the container, on the other hand, always exists — at worst
 * the screen root, which is an honest answer.
 */
export const holderElement = (zone: Zone, root: Element): Element => {
  const m = 2
  const points: [number, number][] = [
    [zone.x + m, zone.y + m],
    [zone.x + zone.w - m, zone.y + m],
    [zone.x + m, zone.y + zone.h - m],
    [zone.x + zone.w - m, zone.y + zone.h - m],
    [zone.x + zone.w / 2, zone.y + zone.h / 2],
  ]
  const stacks: Element[][] = []
  for (const [px, py] of points) {
    if (px < 0 || py < 0 || px > window.innerWidth || py > window.innerHeight) continue
    const stack = document.elementsFromPoint(px, py).filter((el) => !isOurs(el))
    if (stack.length) stacks.push(stack.reverse())
  }
  if (!stacks.length) return root

  let common: Element = stacks[0][0] ?? root
  for (let i = 0; ; i++) {
    const ref = stacks[0][i]
    if (!ref || !stacks.every((p) => p[i] === ref)) break
    common = ref
  }

  let el: Element | null = common
  while (el && el !== document.body) {
    const r = el.getBoundingClientRect()
    if (r.left <= zone.x + 1 && r.top <= zone.y + 1 &&
        r.right >= zone.x + zone.w - 1 && r.bottom >= zone.y + zone.h - 1) {
      return el
    }
    el = el.parentElement
  }
  return root
}
