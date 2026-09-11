import { type HTMLArkProps } from "@ark-ui/react";
import type { ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
export type CodeBlockTranslations = {
    copy: string;
    copied: string;
    expand: string;
    collapse: string;
};
export type CodeBlockClassNames = {
    root?: string;
    pre?: string;
    controls?: string;
    copyButton?: string;
    expandButton?: string;
};
export type CodeBlockButtonProps = HTMLArkProps<"button"> & WithTestId;
/**
 * `CodeBlock.Button` — the toolbar's own compact icon-button primitive.
 * `Copy`/expand use it internally, and it's exported so a consumer's own
 * `controls` button matches the exact same size/style instead of hand-
 * rolling one — same composition API as the rest of the kit (`asChild`, via
 * `HTMLArkProps`, so it wraps in a `Tooltip` exactly like the built-in
 * buttons do).
 *
 * A plain hand-rolled button, not an `ActionIcon` wrapper: this toolbar
 * needed something smaller than `ActionIcon`'s own `xs` floor, which is
 * sized for general-purpose use, not a compact floating strip over code.
 */
export declare const CodeBlockButton: ({ className, asChild, type, testId, ...rest }: CodeBlockButtonProps) => import("react").JSX.Element;
export type CodeBlockChromeProps = WithTestId & {
    /** Raw source, used only for the copy button's clipboard value — this
     *  component never highlights anything itself. */
    code: string;
    /** Whether the tail half exists at all (mirrors the caller's own
     *  `collapsedLines`/line-count decision) — controls whether the expand
     *  toggle and the `Collapse`-wrapped tail slot render at all. */
    isCollapsible: boolean;
    /** The head half's already-rendered content (highlighted HTML, or a
     *  loading fallback — this component has no opinion on which). */
    headContent: ReactNode;
    /** The tail half's already-rendered content — only read when
     *  `isCollapsible`. */
    tailContent?: ReactNode;
    /** @default true */
    withCopyButton?: boolean;
    /** `null` hides it. @default <CopyIcon/> */
    copyIcon?: ReactNode | null;
    /** `null` hides it. @default <CheckIcon/> */
    copiedIcon?: ReactNode | null;
    onCopy?: () => void;
    /** @default false */
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    /** `null` hides it. @default <ChevronDownIcon/> */
    expandIcon?: ReactNode | null;
    /** `null` hides it. @default <ChevronUpIcon/> */
    collapseIcon?: ReactNode | null;
    controls?: ReactNode;
    translations?: Partial<CodeBlockTranslations>;
    className?: string;
    classNames?: CodeBlockClassNames;
};
/**
 * The interactive shell shared by `CodeBlock` (client, highlights via
 * `highlightCode` in an effect) and `CodeBlock.Static` (an async Server
 * Component that `await`s `highlightCode` directly during render, for a
 * fully static/SSR'd result with zero client JS spent on Shiki) — this
 * component owns the toolbar/copy/collapse-expand interactivity and
 * nothing about HOW `headContent`/`tailContent` were produced. Kept in its
 * own file specifically so `CodeBlock.Static` (no `"use client"`, safe to
 * import from a Server Component) can render it without pulling in
 * `code-block.tsx`'s own client-only highlighting logic.
 */
export declare function CodeBlockChrome({ code, isCollapsible, headContent, tailContent, withCopyButton, copyIcon, copiedIcon, onCopy, defaultExpanded, expanded: expandedProp, onExpandedChange, expandIcon, collapseIcon, controls, translations, testId, className, classNames, }: CodeBlockChromeProps): import("react").JSX.Element;
//# sourceMappingURL=chrome.d.ts.map