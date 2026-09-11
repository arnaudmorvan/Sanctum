import { CodeBlockButton, type CodeBlockButtonProps, type CodeBlockClassNames, type CodeBlockTranslations } from "./chrome";
import { type CodeBlockProps } from "./code-block";
import type { CodeBlockContentGutterColumn, CodeBlockCounterGutterColumn, CodeBlockGutterColumn } from "./gutters";
import { type CodeBlockTagStyle, registerLanguage, registerTheme } from "./highlighter";
import { highlight, lineNumbers } from "./presets";
import { CodeBlockStatic, type CodeBlockStaticProps } from "./static";
/**
 * `CodeBlock.Static` is attached here, not inside `code-block.tsx` itself
 * — see `CodeBlockStatic`'s own doc comment (`static.tsx`) for why: it's an
 * async Server Component, and `code-block.tsx` is `"use client"`, which
 * can't import an async component without breaking the Client/Server
 * boundary (a Client Component's render can never `await`). This file
 * carries no directive of its own, so it can safely compose the
 * `"use client"` `CodeBlock` and the Server-Component-only
 * `CodeBlockStatic` under the one object consumers import.
 */
export declare const CodeBlock: (({ code, language, themes, tags, gutters, transformers, collapsedLines, className, classNames, ...chromeProps }: CodeBlockProps) => import("react").JSX.Element) & {
    Button: ({ className, asChild, type, testId, ...rest }: CodeBlockButtonProps) => import("react").JSX.Element;
} & {
    Static: typeof CodeBlockStatic;
};
export { CodeBlockButton, type CodeBlockButtonProps, type CodeBlockClassNames, type CodeBlockContentGutterColumn, type CodeBlockCounterGutterColumn, type CodeBlockGutterColumn, type CodeBlockProps, type CodeBlockStaticProps, type CodeBlockTagStyle, type CodeBlockTranslations, highlight, lineNumbers, registerLanguage, registerTheme, };
//# sourceMappingURL=index.d.ts.map