import type { ReactNode } from "react";
import type { ShikiTransformer } from "shiki";
import type { WithTestId } from "../../lib/test-id";
import { type CodeBlockClassNames, type CodeBlockTranslations } from "./chrome";
import type { CodeBlockGutterColumn } from "./gutters";
import { type CodeBlockTagStyle } from "./highlighter";
export type CodeBlockStaticProps = WithTestId & {
    code: string;
    language?: string;
    themes?: {
        light: string;
        dark: string;
    };
    tags?: Record<string, CodeBlockTagStyle>;
    gutters?: CodeBlockGutterColumn[];
    transformers?: ShikiTransformer[];
    /** @default true */
    withCopyButton?: boolean;
    copyIcon?: ReactNode | null;
    copiedIcon?: ReactNode | null;
    onCopy?: () => void;
    collapsedLines?: number;
    /** @default false */
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    expandIcon?: ReactNode | null;
    collapseIcon?: ReactNode | null;
    controls?: ReactNode;
    translations?: Partial<CodeBlockTranslations>;
    className?: string;
    classNames?: CodeBlockClassNames;
};
/**
 * `CodeBlock.Static` — an async React Server Component that `await`s
 * `highlightCode` directly during the server render, instead of `CodeBlock`
 * (code-block.tsx)'s client-side effect. For a page that's statically
 * generated (as this kit's own docs pages are), that bakes the highlighted
 * markup into the build output: zero client JS spent on Shiki at all, no
 * loading flash, real SSR — not just streamed-in, actually static.
 *
 * The tradeoff this makes: no reactivity. `code`/`tags`/etc. are resolved
 * once, server-side, at render time — there's no client-side re-highlight
 * if they change later (they can't, from a Server Component's own
 * perspective; a `code` value from live client state needs `CodeBlock`
 * instead). Use this for anything with a fixed, known-at-render-time
 * `code` (docs, MDX, a blog post's snippets); reach for `CodeBlock` itself
 * for anything editable/dynamic (a live playground).
 *
 * Deliberately NOT attached onto `CodeBlockComponent` (`code-block.tsx`)
 * itself — that file is `"use client"`, and an async Server Component
 * being imported into a Client Component's own module is exactly the
 * shape React Server Components don't support (a Client Component's render
 * can't `await`, on the server or the client). `CodeBlock.Static` is
 * attached in `index.ts` instead, a plain barrel with no directive of its
 * own, which is the well-supported way to compose a `"use client"` export
 * and a Server-Component-only export under one object.
 *
 * Requires a React Server Components-capable framework (e.g. Next.js App
 * Router) to actually run as a Server Component — a plain client-rendered
 * React app (Vite, CRA, Next Pages Router) has no runtime that knows how to
 * execute an async function component at all.
 */
export declare function CodeBlockStatic({ code, language, themes, tags, gutters, transformers, collapsedLines, className, classNames, ...chromeProps }: CodeBlockStaticProps): Promise<import("react").JSX.Element>;
//# sourceMappingURL=static.d.ts.map