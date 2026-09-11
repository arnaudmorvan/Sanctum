import type { Color } from "../../lib/colors";
import type { ParsedLine, ParsedNotation } from "./notation";
/** A hast `<span>` node in the exact shape Shiki's own `line()` transformer
 *  hook expects as a child — kept structurally minimal (not importing
 *  `hast`'s own `Element` type) for the same reason `highlighter.ts`
 *  derives `LineHast` via `Parameters<...>` rather than a direct import.
 *  `children` allows a nested span (not just text) for the same reason
 *  `applyStyle` (highlighter.ts) sometimes wraps a line's children in an
 *  inner span — see `applyMarkerColor` below. */
export type GutterSpanHast = {
    type: "element";
    tagName: "span";
    properties: Record<string, string>;
    children: Array<{
        type: "text";
        value: string;
    } | GutterSpanHast>;
};
type CodeBlockGutterColumnBase = {
    /** CSS length reserved for this column, applied as `min-width` (not
     *  `width`) — content can still grow past it rather than clipping.
     *  @default for a counter column, sized to fit the largest number that
     *  will actually appear anywhere in the document (e.g. 2.5ch once any
     *  rendered value reaches 2 digits) — computed once, up front, and
     *  applied uniformly to every line so a 1-digit line's number stays
     *  right-aligned with a 2-digit one instead of shifting the code that
     *  follows it. @default "3ch" for a content column. */
    width?: string;
    /** @default "right" for a counter column, "center" for a content column */
    align?: "left" | "center" | "right";
    /** Escape hatch: extra class applied to every span this column renders. */
    className?: string;
    /** Override the kind-based default (a counter is `aria-hidden` by
     *  default — reading "1, 2, 3..." aloud per line is noise, redundant
     *  with visual position; a content column is left in the accessible
     *  tree by default, since its text is meaningful). */
    ariaHidden?: boolean;
};
export type CodeBlockCounterGutterColumn = CodeBlockGutterColumnBase & {
    kind: "counter";
    /** @default 1 */
    startAt?: number;
    /** Tags that make this column skip (not advance, render blank) on that
     *  line — this is the whole mechanism behind diverging diff old/new
     *  numbering: an "old" column's `skip: ["removed"]` is wrong (it should
     *  advance on removed/context, skip added) — see the worked diff example
     *  in the docs. A line that's fully removed via notation (see
     *  `ParsedLine.blank`) never advances any counter, since it never
     *  renders at all. */
    skip?: string[];
};
/** A content column's per-tag mapping, in its full form — `color` tints the
 *  marker's own TEXT, `background` its own fill, exactly the same split
 *  every other styling surface in the kit uses (never conflated into one
 *  "colors" concept). Independent of whatever color/background (if any)
 *  the matched tag's own `tags` styling gives the *line* — a marker's
 *  identity color (e.g. a diff's "−" always red, "+" always green) is a
 *  different concern than the line's tint, and often wants to stay
 *  legible even when the line itself only sets a translucent
 *  `background`, no `color`. */
type CodeBlockGutterMarker = {
    /** `true` renders the notation marker's own payload verbatim (blame's
     *  name, coverage's status, a tutorial-step number); a literal string
     *  renders that fixed text regardless of payload (a diff's static
     *  "+"/"−"). */
    text: string | true;
    color?: Color;
    background?: Color;
};
export type CodeBlockContentGutterColumn = CodeBlockGutterColumnBase & {
    kind: "content";
    /** Maps a notation tag to what this column renders when that tag matches
     *  the line — either the shorthand (`true` for the payload verbatim, or a
     *  literal string), or the full `{ text, color?, background? }` form when
     *  the marker also needs its own color independent of the line's. The
     *  first matching tag (in written order) wins. No match on a line → an
     *  empty (but still width-reserving) cell. */
    tags: Record<string, string | true | CodeBlockGutterMarker>;
};
export type CodeBlockGutterColumn = CodeBlockCounterGutterColumn | CodeBlockContentGutterColumn;
/** Resolves a `gutters` configuration against a full-source notation parse
 *  into a stateful `render` closure — one call per rendered line, in
 *  increasing line order, matching how Shiki's `line()` transformer hook
 *  actually fires. Counter columns carry running state across those calls;
 *  `headLineOffset` (the transformer's own `lineOffset`, 0 for the head
 *  half of a collapsed split, `collapsedLines` for the tail half) seeds
 *  each counter's starting value from how many non-skipped, non-blank
 *  lines came before this rendering window in the FULL source — this is
 *  what keeps a `skip`-aware counter's numbering continuous across that
 *  split with no new architecture: both halves independently derive the
 *  correct starting count from the same shared, already-parsed `notation`
 *  (see `code-block.tsx`). */
export declare function resolveGutterColumns(gutters: CodeBlockGutterColumn[], notation: ParsedNotation, headLineOffset: number): {
    /** A blank (fully-removed) line never advances any counter, since it
     *  never renders at all — callers should not invoke this for a line
     *  whose `ParsedLine.blank` is true. */
    render(parsed: ParsedLine | undefined): GutterSpanHast[];
};
export {};
//# sourceMappingURL=gutters.d.ts.map