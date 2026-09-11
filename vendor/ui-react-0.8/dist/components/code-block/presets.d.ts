import type { CodeBlockCounterGutterColumn } from "./gutters";
import type { CodeBlockTagStyle } from "./highlighter";
/**
 * Trivial one-liners for the two most common `gutters`/`tags` configurations
 * — `CodeBlock` itself has no dedicated boolean prop for "line numbers" or
 * "highlight a line" (there's exactly one mechanism, `gutters`/`tags`); these
 * are just pre-built arguments to it, not special component behavior.
 */
/** A plain sequential line-number column: `<CodeBlock gutters={[lineNumbers()]} />`. */
export declare function lineNumbers(options?: {
    startAt?: number;
}): CodeBlockCounterGutterColumn;
/**
 * A ready-made `tags` entry for `// [!code highlight]` (or a custom tag
 * name): `<CodeBlock tags={highlight()} />`. Defaults to the same
 * background `Mark` uses for its own unstyled highlight, for visual
 * consistency with the rest of the kit. Compose with a hand-written `tags`
 * object the same way as any other record: `tags={{ ...highlight(), removed: {...} }}`.
 */
export declare function highlight(options?: ({
    tag?: string;
} & CodeBlockTagStyle) | undefined): Record<string, CodeBlockTagStyle>;
//# sourceMappingURL=presets.d.ts.map