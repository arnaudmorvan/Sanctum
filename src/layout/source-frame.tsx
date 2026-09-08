import { ExternalLink, Frame, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ProtoView } from "../proto-types"
import { TYPO } from "../typo"
import { FEEDBACK_KEY, MCP_URL, SLUG } from "./env"
import { frameOf, hasSource, PROVENANCE } from "./figma-source"
import { UI_MARK } from "./target"

/** The "Source" button of the bottom bar: the Figma frame THIS screen was built from.
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
 *  It sits in the bar next to the Map, deliberately NOT as a fifth tab of the side panel:
 *  the panel is what one says ABOUT the flow, this is what the screen IS. And the overlay
 *  covers the screen rather than shrinking it — comparing is done by FLIPPING (Escape
 *  closes), not by squeezing two things into one width. */

type Loaded = { url: string; frame: string }

// Per-screen memo: flipping between the mockup and the screen must not re-ask on every
// open. The server caches the render too — this one saves the round-trip itself.
const memo = new Map<string, Loaded>()

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; url: string }
  | { kind: "off"; why: string }

const fetchFrame = async (path: string): Promise<Loaded> => {
  const hit = memo.get(path)
  if (hit) return hit
  // `npm run dev <slug>` bakes no key: saying so beats a 401 read as a Figma problem.
  if (!FEEDBACK_KEY) throw new Error("this build carries no feedback key, so it cannot ask for a render.")
  const url = `${MCP_URL}/figma/frame.json?slug=${encodeURIComponent(SLUG)}&path=${encodeURIComponent(path)}&scale=2`
  const res = await fetch(url, { headers: { "X-Feedback-Key": FEEDBACK_KEY } })
  // The route does not exist when the server has no FIGMA_TOKEN — fail-closed, by
  // design. A 404 that is not our JSON is that case, and it is not a failure of the flow.
  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.url) {
    throw new Error(
      body?.error ??
        (res.status === 404
          ? "this server does not render frames (no Figma token configured)."
          : `the render failed (HTTP ${res.status}).`),
    )
  }
  const loaded: Loaded = { url: body.url as string, frame: (body.frame as string) ?? "" }
  memo.set(path, loaded)
  return loaded
}

export const SourceFrame = ({ current }: { current?: ProtoView }) => {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState<"fit" | "full">("fit")
  const [state, setState] = useState<State>({ kind: "idle" })
  const [barHeight, setBarHeight] = useState(44)
  const button = useRef<HTMLButtonElement>(null)

  const frame = frameOf(current?.path)

  // Same measurement as the map's: the overlay stops ON TOP of the bar, never over it —
  // the button that opened it has to stay in reach to close it, and the bar wraps onto a
  // second line as soon as the flow declares enough screens.
  useEffect(() => {
    if (!open) return
    const bar = button.current?.closest("nav")
    if (!bar) return
    const measure = () => setBarHeight(bar.getBoundingClientRect().height)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(bar)
    return () => ro.disconnect()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // The screen can change under an open overlay (the bar keeps routing): re-ask, or close
  // if the new screen has no frame at all.
  useEffect(() => {
    if (!open) return
    if (!frame || !current?.path) {
      setOpen(false)
      return
    }
    let alive = true
    setState({ kind: "loading" })
    fetchFrame(current.path)
      .then((l) => alive && setState({ kind: "ok", url: l.url }))
      .catch((e: Error) => alive && setState({ kind: "off", why: e.message }))
    return () => {
      alive = false
    }
  }, [open, current?.path, frame])

  // Nothing to point at: no provenance in this flow, or no frame behind this screen.
  if (!hasSource() || !frame) return null

  const dates = [
    PROVENANCE.translatedOn ? `translated ${PROVENANCE.translatedOn}` : "",
    PROVENANCE.dsSync ? `DS synced ${PROVENANCE.dsSync}` : "",
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title={frame.name || "The Figma frame this screen was built from"}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          open
            ? "bg-white/10 font-semibold text-white"
            : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Frame size={13} aria-hidden="true" />
        Source
      </button>

      {open && (
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
              onClick={() => setOpen(false)}
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
      )}
    </>
  )
}
