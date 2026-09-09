/** The two directions between a screen and its mockup, as PROMPTS.
 *
 *  Why a prompt and not a button that does the work: neither direction is something a
 *  browser can perform. Rebuilding a screen as a Figma frame means instantiating the real
 *  components key-first, binding the Variables and passing the tokens gate; re-lifting a
 *  frame into React means reading the DS catalog and republishing the flow. Both are agent
 *  work, driven by a skill of the 42 MCP — and no plugin does either: the « 42 — Sync
 *  Design System » plugin is a one-way Figma → YAML sync, and Figma Make exposes no way to
 *  be handed a prompt from outside.
 *
 *  So the button copies the exact sentence, with the slug, the screen and the skill to
 *  load already in it. The PO pastes it into a conversation that has the 42 MCP (and, for
 *  the first direction, the Figma MCP). Nothing is added to the MCP surface for it — a tool
 *  costs every client a reconnection, and this is not a tool, it is a sentence.
 *
 *  ⚠️ The skill name is what makes the answer reliable. Without it the agent improvises a
 *  mockup, which is exactly what this whole project exists to prevent. If a skill is
 *  renamed, it is renamed here too. */

/** Code → Figma. The direction that did not exist: the flow's screen becomes a frame in
 *  the DS file, and the frame becomes the screen's declared source in the same move. */
export const toFigmaPrompt = (slug: string, path: string, label: string): string =>
  [
    `Rebuild the screen "${label}" (${path}) of the Sanctum flow ${slug} as a Figma frame in the 42 Design System.`,
    "",
    "Load the skill `figma-from-screen` from the 42 MCP and follow it. The screen's code is in the flows repo — read it with `list_protos(\"" +
      slug +
      '", file="…")`; the flow\'s file list comes from the same call.',
    "",
    "When the frame is built, point the screen at it so the two stay linked: that is the last step of the skill.",
  ].join("\n")

/** Figma → code. This one exists already — it is `proto-from-figma` run on ONE screen —
 *  and what was missing was the sentence that says so, with the frame in it. */
export const fromFigmaPrompt = (
  slug: string,
  path: string,
  label: string,
  frameUrl: string,
): string =>
  [
    `Update the screen "${label}" (${path}) of the Sanctum flow ${slug} from its Figma source.`,
    frameUrl ? `Frame: ${frameUrl}` : "The flow declares the frame in its `figma-source.json`.",
    "",
    "Load the skill `proto-from-figma` and follow it FOR THIS SCREEN ONLY: re-lift the frame against today's DS, then publish only what changes — `publish_proto` takes `edits`, so a refresh costs a few dozen bytes rather than the whole file.",
    "",
    "Tell me what moved between the frame and the code before publishing.",
  ].join("\n")
