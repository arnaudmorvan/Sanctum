export type ToDiffNotationOptions = {
    /** Notation tag appended to every line present in `oldCode` but not `newCode`.
     *  @default "removed" */
    removedTag?: string;
    /** Notation tag appended to every line present in `newCode` but not `oldCode`.
     *  @default "added" */
    addedTag?: string;
};
/**
 * Turns two full versions of a file into ONE merged code string, with a
 * `// [!code <tag>]` notation marker already appended to every added/removed
 * line — so a diff view needs zero hand-typed markers. Feed the result
 * straight into `CodeBlock`/`CodeBlock.Static`'s `code` prop, alongside
 * whatever `tags`/`gutters` config renders the visual diff (colored
 * backgrounds, a `+`/`−` gutter column, diverging old/new line-number
 * columns via a counter's `skip`) — see the "A diff-style view" and
 * "Diverging old/new line numbers" examples on the CodeBlock docs page.
 *
 * Runs a real line-diff (jsdiff's `diffLines`, Myers-algorithm-based) rather
 * than anything CodeBlock itself understands — CodeBlock has no notion of
 * "diff" at all, only of tags/gutters driven by whatever markers are in the
 * source text (see `notation.ts`). This function is just the one utility
 * that produces those markers algorithmically instead of by hand.
 *
 * ## Always emits `//`-style markers, regardless of the result's language
 *
 * The returned string always uses a trailing `// [!code <tag>]` comment,
 * even when `oldCode`/`newCode` are, say, Python, CSS, or YAML — languages
 * whose OWN grammar wouldn't treat `//` as a comment opener. This is safe
 * and intentional: `notation.ts`'s marker detection is purely textual
 * (a regex scan of the raw source line), not grammar-aware — the eventual
 * *removal* of the marker from the rendered line is a character-count trim
 * on Shiki's already-tokenized hast output, not a language-aware edit. A
 * `//` marker is found and correctly stripped no matter what `language` the
 * merged result is later highlighted as.
 *
 * ## Never a range/count shorthand
 *
 * Exactly one marker is appended per added/removed line, always — there is
 * no `[!code removed:3]` "applies to the next 3 lines" form, matching the
 * rest of the notation system's own design constraint (see the "no range
 * shorthand" doc comment in `notation.ts`): counting how many lines a hunk
 * spans is exactly the bookkeeping this whole mechanism exists to eliminate,
 * and it would be especially pointless here, where the line count is already
 * known internally (it's whatever `diffLines` returns) — there's no reason
 * to reintroduce a count for a human to get wrong.
 *
 * ## Why this is its own subpath, not part of `@42/ui-react/code-block`
 *
 * Import from `@42/ui-react/code-block/diff`, not the main `code-block`
 * barrel — this is a genuinely separate, tree-shakeable entry point (see
 * `nav-link/tanstack` for the same pattern). It depends on the `diff` npm
 * package, a real diff-algorithm implementation; the vast majority of
 * `CodeBlock` consumers never render a diff and shouldn't pay for that
 * dependency in their bundle just because they imported `CodeBlock` for
 * something else entirely (a plain snippet, a highlighted zone, a blame
 * gutter, ...).
 *
 * ## A blank added/removed line won't render as its own marked row
 *
 * `notation.ts` splices a line out of the render entirely once it becomes
 * fully empty after its marker(s) are stripped (`ParsedLine.blank`) — that's
 * true for ANY marker-only line, hand-typed or generated. An originally
 * empty line that gains a trailing `// [!code removed]`/`// [!code added]`
 * IS a marker-only line (there's no real code on it to keep), so it hits
 * that same rule and vanishes from the rendered output, even though a real
 * blank line was genuinely added or removed in the diff.
 *
 * This is a deliberate, accepted limitation, not a bug to work around: the
 * alternative would be inventing fake non-blank content for a line that has
 * none, which would misrepresent the diff rather than faithfully mark it.
 * It's also perfectly consistent with `notation.ts`'s own pre-existing rule
 * for hand-typed markers — a hand-authored `// [!code removed]` alone on a
 * line already behaves the same way. Any gutter counter still advances (or
 * skips) correctly for a vanished blank line, since counting happens against
 * the parsed notation, independent of whether the line is later rendered.
 */
export declare function toDiffNotation(oldCode: string, newCode: string, options?: ToDiffNotationOptions): string;
//# sourceMappingURL=diff.d.ts.map