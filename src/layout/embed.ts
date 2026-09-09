import { useCallback, useEffect, useRef } from "react"
import { hrefOf, type ProtoView } from "../proto-types"
import { SLUG, VERSION } from "./env"

/** The bridge between an EMBEDDED flow (`?bare`, inside a frame of the compare page) and
 *  the page that holds it. Three conversations, and nothing else:
 *
 *   • WHERE WE ARE — child → parent, `sanctum:state`: which flow and version this is, the
 *     screens it declares, the hash it is on, and — when this frame is the flow rendered as
 *     its mockup (`?figma`) — the width that mockup was DESIGNED at. Sent on mount and on
 *     every navigation. It is what lets the compare page draw a screen picker per side,
 *     follow one side with the other, and lay both sides out at the same width;
 *     parent → child, `sanctum:navigate`: go to this hash.
 *
 *   • WHERE WE ARE SCROLLED — child → parent, `sanctum:scroll`, and back the other way,
 *     `sanctum:scroll-to`. This one exists for the SUPERPOSITION: two screens stacked at
 *     the same width are only comparable while they show the same part of themselves, and
 *     the compare page cannot scroll a frame from outside. Absolute pixels, not a ratio:
 *     the question is "is this button 4 px lower than in the mockup", and a ratio between
 *     two documents of different heights would answer a different one.
 *
 *   • WHICH KEYS ARE NOT OURS — child → parent, `sanctum:key`. See `GIVEN_UP`.
 *
 *  Same origin on both ends (`/compare/` and `/p/…` are one site), so the messages are
 *  restricted to it: a flow embedded elsewhere says nothing, and listens to nobody. */

export type EmbedState = {
  type: "sanctum:state"
  slug: string
  version: string
  hash: string
  views: Array<{ path: string; label: string; href: string; hidden: boolean }>
  /** Only from a frame rendered `?figma`: the mockup's design width in CSS pixels, and
   *  the frame's deep link and name. The width makes the superposition exact; the link is
   *  the one thing the holder cannot build for itself — the file key lives in the flow's
   *  bundle and nowhere else. */
  figmaWidth?: number
  figmaLink?: string
  figmaName?: string
}

export type EmbedNavigate = { type: "sanctum:navigate"; hash: string }
export type EmbedScroll = { type: "sanctum:scroll"; top: number }
export type EmbedScrollTo = { type: "sanctum:scroll-to"; top: number }
export type EmbedKey = { type: "sanctum:key"; key: string; shiftKey: boolean }

/** The few keys an embedded flow GIVES UP to the page holding it. Found by testing rather
 *  than by reading: in the stacked modes the frames cover the whole stage, so a click puts
 *  focus inside one of them and every shortcut of the holder silently stops working —
 *  which is how a superposition one cannot nudge, and a flip one cannot flip, would have
 *  shipped. They are prevented here too: arrows would otherwise scroll this frame AND
 *  nudge the layer above it, which is two answers to one gesture. The wheel still
 *  scrolls, and it is the wheel one scrolls a mockup with. */
const GIVEN_UP = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "f", "F", "0"])

/** The element that actually scrolls in a flow. It is never the document: the flow's root
 *  is `h-dvh` and the scrolling happens inside (`AppLayout`, or the main column of
 *  `AppChrome`). So we take the deepest element that CAN scroll and does — measured, not
 *  assumed, because a flow is free to lay itself out otherwise. */
const scroller = (): Element | null => {
  let best: Element | null = null
  let most = 0
  for (const el of document.querySelectorAll("*")) {
    const over = el.scrollHeight - el.clientHeight
    if (over <= most) continue
    const style = getComputedStyle(el)
    if (!/(auto|scroll)/.test(style.overflowY)) continue
    best = el
    most = over
  }
  return best
}

export const useEmbedBridge = (
  enabled: boolean,
  views: ProtoView[],
  hash: string,
  mockup?: { width: number; link: string; name: string },
) => {
  const send = useCallback((message: object) => {
    if (window.parent === window) return
    window.parent.postMessage(message, window.location.origin)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const state: EmbedState = {
      type: "sanctum:state",
      slug: SLUG,
      version: VERSION,
      hash,
      views: views.map((v) => ({
        path: v.path,
        label: v.label,
        href: hrefOf(v),
        hidden: Boolean(v.hidden),
      })),
      // The link travels as soon as it is known; the width only once the picture is in.
      ...(mockup?.link ? { figmaLink: mockup.link, figmaName: mockup.name } : {}),
      ...(mockup?.width ? { figmaWidth: mockup.width } : {}),
    }
    send(state)
  }, [enabled, views, hash, mockup, send])

  // The scroller is looked up lazily and remembered: it changes with the screen, and a
  // scan of the DOM on every wheel event would be the one expensive thing in this file.
  const box = useRef<Element | null>(null)
  const echo = useRef(false)

  useEffect(() => {
    if (!enabled) return
    box.current = null
    let frame = 0
    const onScroll = (e: Event) => {
      const el = e.target instanceof Element ? e.target : null
      if (el) box.current = el
      // One message per animation frame: a trackpad fires scroll events far faster than
      // the other side can be laid out, and each one crosses a frame boundary.
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        // A scroll we caused ourselves, obeying the parent, must not travel back: two
        // frames echoing each other never settle.
        if (echo.current) {
          echo.current = false
          return
        }
        send({ type: "sanctum:scroll", top: Math.round(el?.scrollTop ?? 0) })
      })
    }
    // Capture: a scroll inside a nested element does not bubble.
    document.addEventListener("scroll", onScroll, true)
    return () => {
      document.removeEventListener("scroll", onScroll, true)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled, send])

  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) || el.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey || !GIVEN_UP.has(e.key)) return
      e.preventDefault()
      send({ type: "sanctum:key", key: e.key, shiftKey: e.shiftKey })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [enabled, send])

  useEffect(() => {
    if (!enabled || window.parent === window) return
    const onMessage = (e: MessageEvent<EmbedNavigate | EmbedScrollTo>) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      const data = e.data
      if (data?.type === "sanctum:navigate" && typeof data.hash === "string") {
        if (window.location.hash !== data.hash) window.location.hash = data.hash
        return
      }
      if (data?.type === "sanctum:scroll-to" && typeof data.top === "number") {
        const el = (box.current ??= scroller())
        if (!el || Math.abs(el.scrollTop - data.top) < 1) return
        echo.current = true
        el.scrollTop = data.top
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [enabled])
}
