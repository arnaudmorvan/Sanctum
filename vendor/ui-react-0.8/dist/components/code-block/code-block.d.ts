import { type ReactNode } from "react";
import type { ShikiTransformer } from "shiki";
import type { WithTestId } from "../../lib/test-id";
import { type CodeBlockClassNames, type CodeBlockTranslations } from "./chrome";
import type { CodeBlockGutterColumn } from "./gutters";
import { type CodeBlockTagStyle } from "./highlighter";
export type { CodeBlockButtonProps, CodeBlockClassNames, CodeBlockTranslations, } from "./chrome";
export type { CodeBlockContentGutterColumn, CodeBlockCounterGutterColumn, CodeBlockGutterColumn, } from "./gutters";
export type { CodeBlockTagStyle } from "./highlighter";
/**
 * CodeBlock — Shiki-powered syntax highlighting, spec'd off Mantine's
 * `CodeHighlight`: a copy button, collapse/expand for long snippets, and
 * custom-icon support. `"use client"` — highlighting is inherently async
 * (Shiki's `codeToHtml`), so the component renders a plain, unhighlighted
 * `<pre><code>` fallback (same chrome, no layout shift) until it resolves.
 * Reactive to prop changes (re-highlights whenever `code`/`tags`/etc.
 * change) — use this for anything editable/dynamic (a live playground). For
 * static content known at render time (the common case — docs, MDX, a
 * fixed snippet), `CodeBlock.Static` is an async Server Component that
 * `await`s the same `highlightCode` during the server render instead,
 * shipping zero client JS for Shiki at all; the two share the exact same
 * `CodeBlockChrome` (chrome.tsx) for the toolbar/collapse UI.
 *
 * `tags`/`gutters` are a general notation-driven / gutter-column mechanism —
 * see `notation.ts` for the full `// [!code tag]` comment grammar and
 * `/docs/code-block` for worked examples. There's no baked-in "highlight"
 * or "diff" concept: a diff view, a spotlighted zone, blame, a redacted
 * token, etc. are all just tags/gutters the consumer authors themselves
 * (or generates — see `@42/ui-react/code-block/diff`). `lineNumbers()`/
 * `highlight()` (from `@42/ui-react/code-block`) are pre-built one-liner
 * arguments to `gutters`/`tags` for the two most common cases — not a
 * separate mechanism, and not a dedicated prop on `CodeBlock` itself.
 *
 * Ship `@42/ui-react/code-block/styles.css` alongside this component — it's
 * not part of the universal `colors.css`/`theme.css` chain, since only
 * consumers who render a `CodeBlock` need Shiki's token/gutter CSS.
 */
export type CodeBlockProps = WithTestId & {
    /** Source text to highlight. No `children` slot — content is Shiki-derived. */
    code: string;
    /** Shiki-bundled language id (e.g. "tsx", "bash", "json"). Omit → plain "text" grammar, no async load. */
    language?: string;
    /** Override the light/dark Shiki theme pair. @default { light: "github-light", dark: "github-dark-default" } */
    themes?: {
        light: string;
        dark: string;
    };
    /** Notation-tag → styling lookup — a line carrying `// [!code removed]`
     *  looks up `tags.removed`. See the component doc comment / `notation.ts`. */
    tags?: Record<string, CodeBlockTagStyle>;
    /** Stacked, ordered gutter columns rendered left of the code — real DOM
     *  nodes, never `::before` pseudo-elements. `lineNumbers()` (from
     *  `@42/ui-react/code-block`) is the one-liner for a plain counter. */
    gutters?: CodeBlockGutterColumn[];
    /** Extra Shiki transformers (e.g. `@shikijs/transformers`, or your own),
     *  run after the internal notation transformer — the escape hatch for
     *  extending Shiki's own capabilities. See also `registerLanguage`/
     *  `registerTheme` (exported from `@42/ui-react/code-block`) for
     *  registering a custom language/theme the bundled set doesn't ship. */
    transformers?: ShikiTransformer[];
    /** @default true */
    withCopyButton?: boolean;
    /** `null` hides it. @default <CopyIcon/> */
    copyIcon?: ReactNode | null;
    /** `null` hides it. @default <CheckIcon/> */
    copiedIcon?: ReactNode | null;
    onCopy?: () => void;
    /** Lines always visible before the fade + expand seam. Omit → never collapses. */
    collapsedLines?: number;
    /** @default false */
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    /** `null` hides it. @default <ChevronDownIcon/> */
    expandIcon?: ReactNode | null;
    /** `null` hides it. @default <ChevronUpIcon/> */
    collapseIcon?: ReactNode | null;
    /** Extra control(s) in the same floating controls row, rendered before the
     *  expand/copy buttons. Purely additive — build them with `CodeBlock.Button`
     *  for the exact same size/style as the built-in ones. */
    controls?: ReactNode;
    /** Button/label copy, factored into one object — same convention as `Calendar`/`DatePicker`'s `translations` prop: a flat `Partial<CodeBlockTranslations>`, merged over English defaults, no context/bundled locale packs. */
    translations?: Partial<CodeBlockTranslations>;
    className?: string;
    classNames?: CodeBlockClassNames;
};
declare function CodeBlockComponent({ code, language, themes, tags, gutters, transformers, collapsedLines, className, classNames, ...chromeProps }: CodeBlockProps): import("react").JSX.Element;
/** `CodeBlock.Button` is `CodeBlockButton` itself (chrome.tsx) — attached
 *  for discoverable composition when building a custom `controls` button
 *  (`<CodeBlock.Button>`), mirroring `Code.Mark`'s same "attach, don't
 *  reimplement" pattern. Still independently exported at
 *  `@42/ui-react/code-block` for a bare import. `CodeBlock.Static` is
 *  attached separately, from `index.ts` — see its own doc comment for why
 *  (it's an async Server Component; not safe to import into this
 *  `"use client"` file). */
export declare const CodeBlock: typeof CodeBlockComponent & {
    Button: ({ className, asChild, type, testId, ...rest }: import("./chrome").CodeBlockButtonProps) => import("react").JSX.Element;
};
//# sourceMappingURL=code-block.d.ts.map