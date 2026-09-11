/**
 * Comment-notation parser for `CodeBlock` — the ONLY per-line targeting
 * mechanism in the new design (replaces the old hand-counted `{ line }` /
 * { from, to }` index-based `decorations`). A line opts into styling/gutter
 * content by carrying a marker comment, e.g. `// [!code removed]` or
 * `// [!code blame:alice]`, anywhere a trailing comment is recognized —
 * modeled on Shiki's own `[!code xxx]` convention, but built from scratch
 * here rather than depending on `@shikijs/transformers`: its generic
 * `transformerNotationMap` only supports a fixed keyword enum (no arbitrary
 * `tag:payload` capture), and the lower-level engine that *would* support
 * that (`createCommentNotationTransformer`) is an internal, non-exported
 * module in that package — not something to depend on.
 *
 * Pure string → data. No Shiki/hast import at all, so it's callable once
 * per `CodeBlock` render (over the FULL, unsplit `code` prop) and shared
 * across both halves of the collapse/expand head-tail split — see
 * `code-block.tsx` and the `notation` option in `highlighter.ts`.
 *
 * ## Grammar
 *
 * `[!code <tag>]` or `[!code <tag>:<payload>]`. `<tag>` is any consumer-
 * defined identifier (`[A-Za-z][\w-]*`) — CodeBlock itself has no built-in
 * vocabulary ("diff"/"highlight"/"blame" are just tag names someone chose).
 * `<payload>` is free-form text; `\:` and `\]` escape a literal colon or
 * bracket inside it. Multiple distinct markers may stack on one line
 * (`// [!code blame:alice] [!code coverage:miss]`) — a deliberate
 * generalization the fixed-enum Shiki transformers can't express, since
 * each of those is a single-keyword regex, not a general engine.
 *
 * There is deliberately NO range/count-suffix shorthand (Shiki's own
 * `[!code highlight:3]` "applies to the next 3 lines"). That shorthand
 * reintroduces exactly the counting problem this mechanism exists to
 * remove — you'd have to count how many lines a block spans to write `:5`.
 * Every marker applies only to the single line it's written on; a multi-
 * line diff removal is the same marker repeated on every affected line,
 * trivial when machine-generated (see `diff.ts`) and no worse by hand
 * either, since the marker sits right next to the line it describes.
 *
 * ## Comment styles recognized
 *
 * A marker is only honored inside a RECOGNIZED trailing comment, checked
 * per physical line (never across lines):
 *   - `<!-- ... -->` and `/* ... *\/` — block-style, single line only, and
 *     ONLY as the comment's entire content (see "Known limitation" below).
 *   - `{/* ... *\/}` — a JSX/TSX expression-container comment, matched only
 *     when it's the sole content of its own line (leading/trailing
 *     whitespace aside).
 *   - A line-style opener — `//`, `#`, `;`/`;;`, `%`/`%%`, or `--` — found
 *     as the RIGHTMOST such token on the line (so `// TODO: fix // [!code
 *     todo]` finds the second `//`, treating it as its own trailing
 *     comment, leaving the first comment's prose untouched).
 *   - A `*`-continuation line inside a `/** ... *\/` block (a line that,
 *     once left-trimmed, starts with `*` not immediately followed by `/`)
 *     — so a marker on the 2nd+ line of a JSDoc-style comment is found too.
 *
 * Detection is purely textual against the raw source line, independent of
 * which language grammar Shiki tokenizes it with — this is what lets a
 * `//`-style marker (what `diff.ts` always emits) work correctly even for
 * a language whose grammar wouldn't itself treat `//` as a comment (e.g. a
 * diff of a CSS or Python sample): the *removal* (see `highlighter.ts`'s
 * `trimTrailingChars`) trims a character count off the end of the rendered
 * line, not a token, so it doesn't need the grammar's cooperation.
 *
 * ## What gets removed, and the "trailing only" constraint
 *
 * A marker is only recognized as notation if it — plus, for a line-style
 * opener, only whitespace, or for a block/JSX style, only whitespace and
 * the closing delimiter — runs to the true end of the line. This keeps
 * removal a clean SUFFIX trim (`stripCount` characters off the end of the
 * rendered line), which is what makes the hast-mutation side in
 * `highlighter.ts` a simple, robust operation instead of a fragile interior
 * edit. Two concrete behaviors this produces:
 *   - `sum += x; // [!code highlight]` → not blank; only the marker (and
 *     the now-empty `// `) is stripped, the code before it is untouched.
 *   - `// [!code highlight]` alone on a line → the WHOLE line is blank and
 *     is removed entirely (see `blank`), not left behind as an empty line.
 *
 * A marker with real prose BEFORE it in the same comment is supported for
 * line-style openers and the `*`-continuation form (`// keep this [!code
 * highlight]` → strips only the marker, keeping `// keep this`), since
 * those have no closing delimiter to preserve. Block/HTML/JSX comments do
 * NOT support this — the marker must be their entire content — because
 * removing an interior marker while preserving a `*\/`/`-->`/`}` closer
 * isn't a suffix trim. A marker mixed with prose inside `/* *\/`/`<!-- -->`/
 * `{/* *\/}` is simply not recognized as notation and renders as literal
 * text; use a line-style trailing comment instead when prose needs to sit
 * alongside a marker.
 *
 * ## Known limitation
 *
 * The line-style opener scan picks the RIGHTMOST occurrence of `//`/`#`/
 * `;`/`;;`/`%`/`%%`/`--` that sits outside every marker's own matched span
 * (so a payload containing one of those substrings, e.g. `[!code
 * note:see--also]`, can't itself be mistaken for an opener) — but it does
 * not otherwise understand string literals or real comment grammar. A
 * comment-opener-like substring inside an unrelated string literal, at the
 * very end of a line with nothing after it, could in principle be
 * misdetected. This is a deliberate, documented tradeoff (a purely textual
 * heuristic, not a full per-language parser) rather than a bug to chase —
 * acceptable for hand-authored/machine-generated notation, which is what
 * this mechanism is for.
 */
export type NotationMatch = {
    tag: string;
    payload?: string;
};
export type ParsedLine = {
    /** Every marker matched on this line, in written order. */
    matches: NotationMatch[];
    /** Characters to trim off the END of this line's rendered text to
     *  produce the marker-free version. 0 when the line has no marker, or
     *  when `blank` is true (the whole line is removed instead). */
    stripCount: number;
    /** True when the line becomes fully empty after removing its marker(s)
     *  AND had at least one match — i.e. it should be spliced out of the
     *  render entirely, not left behind as a blank line. A line that was
     *  already blank in the source (no marker at all) is never flagged. */
    blank: boolean;
};
/** Index 0 = source line 1. */
export type ParsedNotation = {
    perLine: ParsedLine[];
};
/** Parses every notation marker in `code`, once, line by line. */
export declare function parseNotation(code: string): ParsedNotation;
//# sourceMappingURL=notation.d.ts.map