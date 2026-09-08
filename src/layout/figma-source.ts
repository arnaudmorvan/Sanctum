import { SLUG } from "./env"

/** The flow's PROVENANCE — which Figma frame each screen was built from.
 *
 *  It is not declared here and it is not new: the `proto-from-figma` skill writes
 *  `figma-source.json` at the flow's root, in the same commit as the screens, and
 *  `build-flow.mjs` copies it into `src/proto/` along with the rest. Until 2026-09-08 it
 *  was read by nobody — the link between a mockup and the screen it produced existed in
 *  git and nowhere on screen.
 *
 *  The screens are keyed by the `path` of their `VIEWS` entry. THAT is the link: no field
 *  was added to `ProtoView`, and none should be. The provenance file already owns this,
 *  and it owns two things a screen entry could not carry anyway — the file key, and the
 *  date of the DS sync the translation was made against.
 *
 *  ⚠️ OPTIONAL by construction: a flow described orally (`proto-build-flow`) has no
 *  provenance file, and every flow published before this existed has none either. A bare
 *  `import` would break their build; `import.meta.glob` tolerates zero matches — and it
 *  spares us `resolveJsonModule`, which this tsconfig does not set. */

type RawScreen = { node?: string | null; frame?: string | null }

type RawSource = {
  figma_file_key?: string
  ds_sync?: string
  translated_on?: string
  screens?: Record<string, RawScreen>
}

const found = import.meta.glob("../proto/figma-source.json", {
  eager: true,
  import: "default",
}) as Record<string, RawSource>

const SOURCE: RawSource | undefined = Object.values(found)[0]

// Both spellings of a node-id: Figma's API writes `22489:9756`, a Figma URL writes
// `22489-9756`. A provenance file filled from a copied link must not silently produce a
// screen whose source never opens.
const NODE = /^[0-9]+[:-][0-9]+$/

const FILE_KEY = (SOURCE?.figma_file_key ?? "").trim()

/** What the flow says about its own translation — shown next to the frame, because it is
 *  what tells whether the code is behind: a mockup re-worked after `translatedOn` has not
 *  been re-lifted. Both may be absent on an older provenance file. */
export const PROVENANCE = {
  fileKey: FILE_KEY,
  dsSync: (SOURCE?.ds_sync ?? "").trim(),
  translatedOn: (SOURCE?.translated_on ?? "").trim(),
}

export type Frame = {
  /** API spelling (`22489:9756`) — what `/figma/frame.json` renders. */
  node: string
  /** The frame's name in Figma, as recorded at translation time. */
  name: string
  /** Deep link into the file, landing on that frame. */
  url: string
}

/** The frame a screen was built from, or `null` — which is a normal answer three times
 *  over: the flow has no provenance file, the screen is not listed in it, or it is listed
 *  with `node: null` (a drill-down composed with no mockup behind it). */
export const frameOf = (path?: string): Frame | null => {
  if (!FILE_KEY || !path) return null
  const entry = SOURCE?.screens?.[path]
  const node = (entry?.node ?? "").trim()
  if (!NODE.test(node)) return null
  // The name segment of a Figma URL is decorative — Figma redirects to the canonical one.
  // We put the flow's slug there so a pasted link still says what it opens.
  const segment = encodeURIComponent(SLUG || "frame")
  return {
    node: node.replace("-", ":"),
    name: (entry?.frame ?? "").trim(),
    url: `https://www.figma.com/design/${FILE_KEY}/${segment}?node-id=${node.replace(":", "-")}`,
  }
}

/** Whether ANY screen of this flow has a source frame. Read once by the bar: a flow with
 *  no provenance must not carry a button that is always disabled. */
export const hasSource = (): boolean =>
  Boolean(FILE_KEY) &&
  Object.values(SOURCE?.screens ?? {}).some((s) => NODE.test((s?.node ?? "").trim()))
