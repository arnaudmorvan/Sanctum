import { useEffect, useState } from "react"
import type { ProtoView } from "../proto-types"
import { frameOf } from "./figma-source"
import { designWidth, renderFrame } from "./figma-render"

/** The flow rendered as its MOCKUP — `?bare&figma`, one side of the compare page.
 *
 *  It is deliberately the dumbest thing that could work: the frame of the current screen,
 *  at the width it was designed at, in a scroller that behaves like the flow's own. No
 *  chrome, no zoom control, no link — the page holding the frame owns all of that, and a
 *  control drawn twice drives nothing (the same reason `?bare` drops the bar and the rail).
 *
 *  It reports its natural width up to the parent (`sanctum:state`), because that number is
 *  the whole condition of an exact superposition: the screen on the other side has to be
 *  laid out at the width the frame was drawn at, or a responsive layout reflows while a
 *  picture merely shrinks. */
export const FigmaView = ({
  current,
  onWidth,
}: {
  current?: ProtoView
  onWidth: (w: number) => void
}) => {
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "ok"; url: string } | { kind: "off"; why: string }
  >({ kind: "loading" })
  // The design width is not known until the picture is here: it IS the picture, divided by
  // the scale we asked for. Until then the img would lay out at its intrinsic 3000 px.
  const [w, setW] = useState(0)

  const frame = frameOf(current?.path)
  const path = current?.path

  useEffect(() => {
    if (!frame || !path) {
      setState({
        kind: "off",
        why: "This screen was not translated from a Figma frame — there is nothing to put next to it.",
      })
      return
    }
    let alive = true
    setState({ kind: "loading" })
    renderFrame(path)
      .then((r) => alive && setState({ kind: "ok", url: r.url }))
      .catch((e: Error) => alive && setState({ kind: "off", why: e.message }))
    return () => {
      alive = false
    }
  }, [frame, path])

  return (
    <div className="h-full overflow-auto bg-gray-dark-950">
      {state.kind === "loading" ? (
        <p className="p-6 text-gray-dark-400 text-sm">Rendering the frame…</p>
      ) : null}
      {state.kind === "off" ? (
        <div className="flex max-w-prose flex-col gap-2 p-6">
          <p className="text-gray-dark-300 text-sm">The frame cannot be shown here.</p>
          <p className="text-gray-dark-500 text-xs">{state.why}</p>
        </div>
      ) : null}
      {state.kind === "ok" ? (
        <img
          src={state.url}
          alt={frame?.name || "Figma frame"}
          // The design width, never a percentage: this side is a picture, and the page that
          // holds it scales BOTH sides by the same factor. Stretching it here would be a
          // second scale nobody could reason about.
          style={{ width: w || undefined, display: "block", opacity: w ? 1 : 0 }}
          onLoad={(e) => {
            const width = designWidth(e.currentTarget)
            setW(width)
            onWidth(width)
          }}
        />
      ) : null}
    </div>
  )
}
