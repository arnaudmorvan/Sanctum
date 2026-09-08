import { useEffect } from "react"
import { hrefOf, type ProtoView } from "../proto-types"
import { SLUG, VERSION } from "./env"

/** The bridge between an EMBEDDED flow (`?bare`, inside a frame of the compare page) and
 *  the page that holds it. Two messages, and nothing else:
 *
 *   • child → parent, `sanctum:state`: which flow and version this is, the screens it
 *     declares, and the hash it is on. Sent on mount and on every navigation — it is
 *     what lets the compare page draw a screen picker per side, and follow one side
 *     with the other;
 *   • parent → child, `sanctum:navigate`: go to this hash.
 *
 *  Same origin on both ends (`/compare/` and `/p/…` are one site), so the messages are
 *  restricted to it: a flow embedded elsewhere says nothing, and listens to nobody. */

export type EmbedState = {
  type: "sanctum:state"
  slug: string
  version: string
  hash: string
  views: Array<{ path: string; label: string; href: string; hidden: boolean }>
}

export type EmbedNavigate = { type: "sanctum:navigate"; hash: string }

export const useEmbedBridge = (enabled: boolean, views: ProtoView[], hash: string) => {
  useEffect(() => {
    if (!enabled || window.parent === window) return
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
    }
    window.parent.postMessage(state, window.location.origin)
  }, [enabled, views, hash])

  useEffect(() => {
    if (!enabled || window.parent === window) return
    const onMessage = (e: MessageEvent<EmbedNavigate>) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      if (e.data?.type !== "sanctum:navigate" || typeof e.data.hash !== "string") return
      if (window.location.hash !== e.data.hash) window.location.hash = e.data.hash
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [enabled])
}
