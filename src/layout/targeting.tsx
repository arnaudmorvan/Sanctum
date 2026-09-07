import { useCallback, useEffect, useRef, useState } from "react"
import {
  describeElement,
  describeZone,
  holderElement,
  isOurs,
  breadcrumb,
  nearestOrigin,
  type Target,
  UI_MARK,
  type Zone,
} from "./target"

/** The pointing layer: show WHAT we are talking about before talking about it.
 *
 *  Two gestures, because there are two natures of feedback:
 *   • **Point at** — the feedback is about something that exists ("this button", "this
 *     card"). Hovering highlights the element and says what it is; the click freezes it.
 *   • **Circle** — the feedback is about nothing that exists ("some breathing room is
 *     missing here", "this band is too busy"). Without this mode, that kind of feedback
 *     latches onto the first `div` lying under the cursor and sends someone to fix an
 *     element that asked for nothing. The zone is anchored to the deepest element that
 *     contains it: the rectangle says what was shown, the anchor says where it lands in
 *     the screen.
 *
 *  The breadcrumb under the cursor solves the recurring pointing problem: we meant to aim
 *  at the card, we aimed at its title. Every link is a real ancestor and is clickable.
 *
 *  Everything is drawn in a `fixed` layer marked `data-sanctum-ui`, which the pointing
 *  forbids itself — otherwise we would target our own highlight. */

const MIN = 10
const DEFAULT_W = 200
const DEFAULT_H = 120

type Mode = "element" | "zone"

export const Targeting = ({
  mode,
  onTarget,
  onCancel,
}: {
  mode: Mode
  onTarget: (t: Target) => void
  onCancel: () => void
}) => {
  const [hovered, setHovered] = useState<Element | null>(null)
  const [drawn, setDrawn] = useState<Zone | null>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const layer = useRef<HTMLDivElement>(null)

  // Escape leaves the pointing mode, in both modes. `capture`: we go before the screen,
  // which may have its own handling (a kit Modal, for instance).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      e.preventDefault()
      e.stopPropagation()
      onCancel()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onCancel])

  // Element mode: we read what is UNDER the layer, since it intercepts the pointer.
  const underPointer = useCallback((x: number, y: number): Element | null => {
    for (const el of document.elementsFromPoint(x, y)) {
      if (!isOurs(el)) return el
    }
    return null
  }, [])

  const onMove = (e: React.PointerEvent) => {
    if (mode === "element") {
      setHovered(underPointer(e.clientX, e.clientY))
      return
    }
    if (!start.current) return
    const d = start.current
    setDrawn({
      x: Math.round(Math.min(d.x, e.clientX)),
      y: Math.round(Math.min(d.y, e.clientY)),
      w: Math.round(Math.abs(e.clientX - d.x)),
      h: Math.round(Math.abs(e.clientY - d.y)),
      scrollX: Math.round(window.scrollX),
      scrollY: Math.round(window.scrollY),
    })
  }

  const onDown = (e: React.PointerEvent) => {
    if (mode !== "zone" || e.button !== 0) return
    e.preventDefault()
    start.current = { x: e.clientX, y: e.clientY }
    layer.current?.setPointerCapture(e.pointerId)
  }

  const onUp = (e: React.PointerEvent) => {
    if (mode === "element") {
      const el = underPointer(e.clientX, e.clientY)
      if (el) onTarget(describeElement(el))
      return
    }
    const d = start.current
    if (!d) return
    start.current = null
    const w = Math.abs(e.clientX - d.x)
    const h = Math.abs(e.clientY - d.y)
    // A plain click instead of a drag: a default box, pulled back inside the window.
    // Without this case you get a zero-pixel zone and believe the tool does not work.
    const zone: Zone =
      w >= MIN && h >= MIN
        ? {
            x: Math.round(Math.min(d.x, e.clientX)),
            y: Math.round(Math.min(d.y, e.clientY)),
            w: Math.round(w),
            h: Math.round(h),
            scrollX: Math.round(window.scrollX),
            scrollY: Math.round(window.scrollY),
          }
        : {
            x: Math.round(Math.max(0, Math.min(e.clientX - DEFAULT_W / 2, window.innerWidth - DEFAULT_W - 4))),
            y: Math.round(Math.max(0, Math.min(e.clientY - DEFAULT_H / 2, window.innerHeight - DEFAULT_H - 4))),
            w: DEFAULT_W,
            h: DEFAULT_H,
            scrollX: Math.round(window.scrollX),
            scrollY: Math.round(window.scrollY),
          }
    setDrawn(zone)
    onTarget(describeZone(zone, holderElement(zone, document.body)))
  }

  const box = hovered?.getBoundingClientRect()

  return (
    <div
      ref={layer}
      {...{ [UI_MARK]: "" }}
      className="fixed inset-0 z-[60]"
      style={{ cursor: mode === "zone" ? "crosshair" : "default" }}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerUp={onUp}
    >
      {/* Element mode: the frame follows the hover, the label says WHAT IT IS. */}
      {mode === "element" && box && box.width > 0 && (
        <>
          <div
            className="pointer-events-none absolute rounded-sm border-2 border-pink-400 bg-pink-400/10"
            style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
          />
          <Label el={hovered as Element} box={box} />
        </>
      )}

      {/* Zone mode: the rectangle being drawn. */}
      {mode === "zone" && drawn && (
        <div
          className="pointer-events-none absolute rounded-sm border-2 border-pink-400 border-dashed bg-pink-400/10"
          style={{ left: drawn.x, top: drawn.y, width: drawn.w, height: drawn.h }}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
        <span className="rounded-md bg-gray-dark-950/95 px-3 py-1.5 text-gray-dark-200 text-xs shadow-lg">
          {mode === "element"
            ? "Click the element the feedback is about"
            : "Draw the area concerned"}{" "}
          <span className="text-gray-dark-500">· Esc to cancel</span>
        </span>
      </div>
    </div>
  )
}

/** The hover label: the name of the kit component, or the admission that there is none. */
const Label = ({ el, box }: { el: Element; box: DOMRect }) => {
  const origin = nearestOrigin(el)
  const [kind, name] = origin ? origin.split(":") : ["", ""]
  const above = box.top > 34
  return (
    <span
      className="pointer-events-none absolute flex items-center gap-2 rounded-md bg-gray-dark-950/95 px-2 py-1 font-mono text-[11px] shadow-lg"
      style={{ left: box.left, top: above ? box.top - 28 : box.bottom + 6 }}
    >
      <span className={kind === "kit" ? "text-green-400" : "text-pink-400"}>
        {kind === "kit" ? `@42/ui-react · ${name}` : kind === "dom" ? `hand-written · ${name}` : el.tagName.toLowerCase()}
      </span>
    </span>
  )
}

/** The reminder of what was pointed at, with the breadcrumb to correct the aim. */
export const ChosenTarget = ({
  target,
  element,
  onRetarget,
  onClear,
}: {
  target: Target
  element: Element | null
  onRetarget: (el: Element) => void
  onClear: () => void
}) => {
  const trail = element ? breadcrumb(element) : []
  const [kind, name] = target.origin ? target.origin.split(":") : ["", ""]
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-dark-500 text-xs">Feedback on</span>
        <span
          className={`font-mono text-xs ${kind === "kit" ? "text-green-400" : "text-pink-400"}`}
        >
          {target.type === "zone"
            ? target.name
            : kind === "kit"
              ? `${name} (kit)`
              : `${target.tag} (hand-written)`}
        </span>
        {target.name && target.type === "element" && (
          <span className="truncate text-gray-dark-300 text-xs">"{target.name.slice(0, 48)}"</span>
        )}
        <button
          type="button"
          onClick={onClear}
          className="ms-auto rounded px-1.5 py-0.5 text-gray-dark-500 text-xs hover:text-white"
        >
          Remove
        </button>
      </div>
      {trail.length > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-gray-dark-600 text-[11px]">Aim instead at:</span>
          {trail.slice(0, -1).map((link) => (
            <button
              key={`${link.label}-${trail.indexOf(link)}`}
              type="button"
              onClick={() => onRetarget(link.el)}
              className="rounded px-1.5 py-0.5 font-mono text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
