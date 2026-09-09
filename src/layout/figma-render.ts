import { FEEDBACK_KEY, MCP_URL, SLUG } from "./env"

/** The RENDER of a source frame — the one thing about the Figma provenance that a browser
 *  cannot do alone.
 *
 *  It lived inside `source-frame.tsx` until the compare page needed the same picture. It is
 *  extracted here rather than duplicated, and it stays INSIDE the flow's bundle on purpose:
 *  the flow is what holds the feedback key and what declares its own provenance, so it is
 *  the only thing entitled to ask for a render. The compare page never calls this — it
 *  embeds the flow in `?figma` mode and lets it answer for itself.
 *
 *  The memo is per screen and per page load. The server caches the rendered URL too
 *  (`figma_api.CACHE_TTL`); this one saves the round-trip. */

export type Rendered = { url: string; frame: string }

const memo = new Map<string, Rendered>()

export const renderFrame = async (path: string): Promise<Rendered> => {
  const hit = memo.get(path)
  if (hit) return hit
  // `npm run dev <slug>` bakes no key: saying so beats a 401 read as a Figma problem.
  if (!FEEDBACK_KEY)
    throw new Error("this build carries no feedback key, so it cannot ask for a render.")
  const url = `${MCP_URL}/figma/frame.json?slug=${encodeURIComponent(SLUG)}&path=${encodeURIComponent(path)}&scale=2`
  const res = await fetch(url, { headers: { "X-Feedback-Key": FEEDBACK_KEY } })
  // The route does not exist when the server has no FIGMA_TOKEN — fail-closed, by design.
  // A 404 that is not our JSON is that case, and it is not a failure of the flow.
  const body = (await res.json().catch(() => null)) as
    | { url?: string; frame?: string; error?: string }
    | null
  if (!res.ok || !body?.url) {
    throw new Error(
      body?.error ??
        (res.status === 404
          ? "this server does not render frames (no Figma token configured)."
          : `the render failed (HTTP ${res.status}).`),
    )
  }
  const loaded: Rendered = { url: body.url, frame: body.frame ?? "" }
  memo.set(path, loaded)
  return loaded
}

/** The width the frame was DESIGNED at, from the PNG we asked for at `scale=2`. Nothing
 *  declares it — not `figma-source.json`, not the server — and nothing needs to: the
 *  picture carries it. It is what makes a superposition exact rather than approximate,
 *  because the screen next to it must be laid out at that same width; scaled to anything
 *  else, a responsive layout reflows while a picture merely shrinks, and the two stop
 *  describing the same thing. */
export const SCALE = 2
export const designWidth = (img: HTMLImageElement): number =>
  Math.round(img.naturalWidth / SCALE)
