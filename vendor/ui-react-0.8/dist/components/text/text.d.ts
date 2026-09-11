import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
import { type HeadingSizeAlias } from "../../lib/typography-size";
/**
 * Text — styled paragraph primitive.
 *
 * Pure React Server Component. Renders `<p>` by default and exposes a tight
 * prop surface: size (visual scale) and a `c` shade switch (default / secondary /
 * muted), matching the 42 UI Kit Figma's text-color tiers: `secondary` is
 * `text-secondary` (labels, section headings — gray-700/gray-300) and `muted`
 * is `text-tertiary` (supporting/paragraph text — gray-600/gray-400). For
 * headings use `Title`.
 *
 * `size` also accepts the heading aliases (`h1`..`h6`, `p`) as friendlier
 * names for the same scale — e.g. `size="h2"` is identical to `size="3xl"`.
 * These are visual-only: Text always renders `<p>`/`<span>`, never a
 * heading element, regardless of which size alias is used.
 *
 * The `prefix` slot lets callers prepend a decorative leader (the classic
 * `// ` for the code-themed aesthetic) without compromising assistive tech:
 *   - `aria-hidden="true"` keeps screen readers from announcing it
 *   - `select-none` keeps it out of clipboard copies
 *
 * Pass `span` when a `<p>` isn't valid HTML where Text is composed — e.g.
 * nested inside a consumer's own paragraph, or inside another phrasing-
 * content-only element. Visually identical; only the tag changes.
 */
declare const textVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | null | undefined;
    c?: "default" | "secondary" | "muted" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type TextSize = NonNullable<VariantProps<typeof textVariants>["size"]>;
export type TextProps = Omit<HTMLArkProps<"p">, "prefix"> & Omit<VariantProps<typeof textVariants>, "size"> & WithTestId & {
    /** Visual scale. Also accepts the heading aliases (`h1`..`h6`, `p`). */
    size?: TextSize | HeadingSizeAlias;
    /**
     * Decorative prefix rendered inside the paragraph. Hidden from screen
     * readers and the clipboard via `aria-hidden` + `select-none`. Ignored
     * when `asChild` is true — the consumer owns the inner structure.
     */
    prefix?: ReactNode;
    /** Renders a `<span>` instead of the default `<p>`. Same styling — only
     * the tag changes, for composing Text where a `<p>` isn't valid HTML. */
    span?: boolean;
};
export declare const Text: ({ className, size, c, prefix, span, children, asChild, testId, ...rest }: TextProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=text.d.ts.map