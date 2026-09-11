import type { LanguageInput, ShikiTransformer, ThemeInput } from "shiki";
import type { Color } from "../../lib/colors";
import { type CodeBlockGutterColumn } from "./gutters";
import { type ParsedNotation } from "./notation";
/**
 * Register a custom TextMate grammar so `<CodeBlock language="...">` can
 * reference it by name, the same as a bundled language — Shiki's own
 * extension mechanism for a language it doesn't ship. Await this once
 * (e.g. at app startup) before rendering a `CodeBlock` that uses it.
 */
export declare function registerLanguage(lang: LanguageInput): Promise<void>;
/** Register a custom VS Code-style theme, the same as a bundled theme —
 *  Shiki's own extension mechanism for a theme it doesn't ship. */
export declare function registerTheme(theme: ThemeInput): Promise<void>;
/** Palette-driven styling — `background`/`color` tint via the kit's own
 *  theme-aware `Color` tokens (the same `--c-soft`/`--c-text` mechanism
 *  every colored component uses), independent of each other, the same
 *  relationship `Mark`'s own `background`/`color` props have. `className`/
 *  `style` stay as the escape hatch for anything the two color props don't
 *  cover (layout, a specific shade, an arbitrary Tailwind utility) — prefer
 *  `background`/`color` first; reach for `className`/`style` only for what
 *  they can't express. */
type CodeBlockStyle = {
    /** Text color, via the same `Color` tokens as the rest of the kit. */
    color?: Color;
    /** Background/highlight tint, via the same `Color` tokens as the rest of the kit. */
    background?: Color;
    /** Escape hatch: an arbitrary class, for anything `color`/`background` don't cover. */
    className?: string;
    /** Escape hatch: raw CSS text (e.g. `"text-decoration: line-through"`), not
     *  a React `CSSProperties` object — styles are threaded through Shiki's
     *  hast → HTML string pipeline, never React's own DOM `style` prop. */
    style?: string;
};
/** Styling for a notation tag — a line carrying `// [!code removed]` looks
 *  up `tags.removed`. `CodeBlock` has no built-in tag vocabulary of its
 *  own: "removed", "highlight", "blame", etc. are just names a consumer
 *  chose — see `notation.ts` for the full grammar. */
export type CodeBlockTagStyle = CodeBlockStyle;
export type HighlightOptions = {
    lang?: string;
    themes?: {
        light: string;
        dark: string;
    };
    /** Notation-tag → styling lookup — see `CodeBlockTagStyle`. */
    tags?: Record<string, CodeBlockTagStyle>;
    /** Stacked, ordered gutter columns rendered left of the code — see
     *  `CodeBlockGutterColumn` (`gutters.ts`). */
    gutters?: CodeBlockGutterColumn[];
    /** Offset added to every rendered line number before matching notation/
     *  seeding gutter counters — used by `CodeBlock`'s collapse split so a
     *  highlighted "tail" half still reports its true position in the
     *  original source. */
    lineOffset?: number;
    /** A precomputed `parseNotation` of the FULL, un-split source. Passed by
     *  `CodeBlock` so the collapsed head/tail split's two independent
     *  `highlightCode` calls share one notation pass — this is what keeps a
     *  `skip`-aware gutter counter's numbering continuous across that split.
     *  Omitted (e.g. a consumer calling `highlightCode` directly) → computed
     *  from this call's own `code`. */
    notation?: ParsedNotation;
    /** Extra Shiki transformers (e.g. from the `@shikijs/transformers`
     *  ecosystem, or your own), run after the internal notation transformer.
     *  This is the escape hatch for extending Shiki's own capabilities —
     *  anything a `ShikiTransformer` can do (custom notation, extra markup,
     *  post-processing) works here without `CodeBlock` needing to know about
     *  it. See also `registerLanguage`/`registerTheme` for extending the
     *  language/theme side of the parser. */
    transformers?: ShikiTransformer[];
};
/** Highlights `code` as HTML via the shared Shiki singleton. Loads the
 *  requested language/themes on demand — via the highlighter's own
 *  `getLoadedLanguages`/`getLoadedThemes` (authoritative, so a name
 *  registered through `registerLanguage`/`registerTheme` is recognized as
 *  already loaded and never re-fetched as if it were a bundled id). `lang`
 *  defaults to `"text"` (Shiki's built-in plaintext grammar — no dynamic
 *  import needed). Called with `defaultColor: false` so neither theme is
 *  inlined as a plain `color`/`background-color` — both live only in the
 *  `--shiki-light`/`--shiki-dark` custom properties consumed by
 *  `styles.css`, so the dark-mode CSS rule there needs no `!important`. */
export declare function highlightCode(code: string, opts?: HighlightOptions): Promise<string>;
export {};
//# sourceMappingURL=highlighter.d.ts.map