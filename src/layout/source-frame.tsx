import { Columns2, ExternalLink, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { ProtoView } from "../proto-types"
import { TYPO } from "../typo"
import { useBottomBar } from "./bottom-bar"
import { compareWithMockupHref } from "./compare-link"
import { renderFrame } from "./figma-render"
import { frameOf, hasSource, PROVENANCE } from "./figma-source"
import { UI_MARK } from "./target"

/** The "Source" tile of the review rail: the Figma frame THIS screen was built from.
 *
 *  The question it answers is the one a PO asks in front of a translated screen — "is
 *  this what was designed?" — and until now it had no answer anywhere in the product: the
 *  provenance was in the flow's commit, read by nobody.
 *
 *  TWO HALVES, and only one of them needs a server:
 *   • the LINK is free. `figma-source.json` travels in the flow's own bundle, so
 *     `figma-source.ts` builds the deep link with no request, no key and no token. It
 *     works even with everything below switched off;
 *   • the CAPTURE cannot be. Rendering a frame of a private file takes a Figma token,
 *     and a token does not go into a JS bundle. So the MCP renders it
 *     (`GET /figma/frame.json`, `figma_api.py`) and answers a URL, which this `<img>`
 *     loads straight from Figma's CDN — nothing of the image crosses our server.
 *
 *  Which is why a missing token is not an error state: the panel opens, says the frame
 *  cannot be rendered, and still hands over the link. The button is attached to the
 *  CURRENT SCREEN — it disappears on a screen that was composed with no mockup behind it,
 *  which is itself worth knowing.
 *
 *  Since 2026-09-08 it opens from the review rail, next to the Map — but it is still NOT a
 *  tab of the panel: the panel is what one says ABOUT the flow, this is what the screen IS,
 *  and it is shown full width. The overlay covers the screen rather than shrinking it —
 *  looking is done by FLIPPING (Escape closes), not by squeezing two things into one width.
 *  Which is also why the tile disappears on a screen with no frame behind it.
 *
 *  MEASURING is a different gesture, and it is not done here: "Compare with the screen"
 *  hands this screen and its mockup to `/compare/`, which lays both out at the width the
 *  frame was designed at and stacks them — curtain, flip, opacity, difference. Flipping
 *  between two tabs tells you something is off; only a superposition tells you by how much.
 *  The render itself belongs to neither: `figma-render.ts` owns it, and the mockup side of
 *  the compare page is this same flow rendered `?bare&figma`. */

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; url: string }
  | { kind: "off"; why: string }

/** Controlled, like the map: the tile that opens it is in the review rail. */
export const SourceFrame = ({
  current,
  open,
  onClose,
}: {
  current?: ProtoView
  open: boolean
  onClose: () => void
}) => {
  const [zoom, setZoom] = useState<"fit" | "full">("fit")
  const [state, setState] = useState<State>({ kind: "idle" })
  // Same measurement as the map's: the overlay stops ON TOP of the bar, never over it.
  const barHeight = useBottomBar()

  const frame = frameOf(current?.path)
  // Read at render, like the rail's own Compare tile: the hash is part of the link.
  const compare = open ? compareWithMockupHref() : null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // The screen can change under an open overlay (the bar keeps routing): re-ask, or close
  // if the new screen has no frame at all.
  useEffect(() => {
    if (!open) return
    if (!frame || !current?.path) {
      onClose()
      return
    }
    let alive = true
    setState({ kind: "loading" })
    renderFrame(current.path)
      .then((r) => alive && setState({ kind: "ok", url: r.url }))
      .catch((e: Error) => alive && setState({ kind: "off", why: e.message }))
    return () => {
      alive = false
    }
  }, [open, current?.path, frame, onClose])

  // Nothing to point at: no provenance in this flow, or no frame behind this screen.
  if (!open || !hasSource() || !frame) return null

  const dates = [
    PROVENANCE.translatedOn ? `translated ${PROVENANCE.translatedOn}` : "",
    PROVENANCE.dsSync ? `DS synced ${PROVENANCE.dsSync}` : "",
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <div
      {...{ [UI_MARK]: "" }}
      className="fixed inset-x-0 top-0 z-50 overflow-auto bg-gray-dark-950/98 backdrop-blur"
      style={{ bottom: barHeight }}
      role="dialog"
      aria-modal="true"
      aria-label="Figma source of this screen"
    >
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-gray-dark-800 border-b bg-gray-dark-950/95 px-5 py-3 backdrop-blur">
        <span className="font-semibold text-sm text-white">
          {frame.name || "Source frame"}
        </span>
        <span className="font-mono text-[11px] text-gray-dark-600">{frame.node}</span>
        {dates ? <span className="text-gray-dark-500 text-xs">{dates}</span> : null}

        <div className="ms-auto flex items-center gap-1" role="group" aria-label="Zoom">
          {(
            [
              { key: "fit", label: "Fit" },
              { key: "full", label: "1:1" },
            ] as const
          ).map((z) => (
            <button
              key={z.key}
              type="button"
              onClick={() => setZoom(z.key)}
              aria-pressed={zoom === z.key}
              className={`rounded-md px-2 py-1 font-mono text-[11px] transition-colors ${
                zoom === z.key
                  ? "bg-white/10 font-semibold text-white"
                  : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
        {compare ? (
          <a
            href={compare}
            target="_blank"
            rel="noreferrer"
            title="This screen and its mockup in the same box — curtain, flip, opacity, difference"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs transition-colors hover:bg-white/5 hover:text-white"
          >
            <Columns2 size={13} aria-hidden="true" />
            Compare with the screen
          </a>
        ) : null}
        <a
          href={frame.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={13} aria-hidden="true" />
          Open in Figma
        </a>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={13} aria-hidden="true" />
          Close
        </button>
      </div>

      <div className="px-5 py-6">
        {state.kind === "loading" ? (
          <p className="text-gray-dark-400 text-sm">Rendering the frame…</p>
        ) : null}
        {state.kind === "off" ? (
          <div className="flex max-w-prose flex-col gap-2">
            <p className="text-gray-dark-300 text-sm">The frame cannot be shown here.</p>
            <p className="text-gray-dark-500 text-xs">{state.why}</p>
            <p className={`${TYPO.nav} text-gray-dark-500 text-xs`}>
              The link above still opens it in Figma.
            </p>
          </div>
        ) : null}
        {state.kind === "ok" ? (
          <a href={frame.url} target="_blank" rel="noreferrer" className="block">
            <img
              src={state.url}
              alt={frame.name || `Figma frame ${frame.node}`}
              className={
                zoom === "fit"
                  ? "mx-auto max-w-full rounded-lg border border-white/10"
                  : "max-w-none rounded-lg border border-white/10"
              }
            />
          </a>
        ) : null}
      </div>
    </div>
  )
}
