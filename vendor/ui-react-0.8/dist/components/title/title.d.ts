import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { WithTestId } from "../../lib/test-id";
import { type HeadingSizeAlias } from "../../lib/typography-size";
/**
 * Title — heading primitive.
 *
 * Pure React Server Component. The `order` prop selects the semantic
 * element (`<h1>`..`<h6>`); `size` controls the visual scale and defaults to
 * a sensible per-order mapping (h1=4xl, h2=3xl, …, h6=md). Decoupling order
 * from size lets a designer demote/promote a heading visually without
 * breaking the document outline:
 *
 *   <Title order={3} size="xl" />   ->   <h3 class="text-xl ...">
 *
 * `size` also accepts the heading aliases (`h1`..`h6`, `p`) as friendlier
 * names for the same scale, e.g. `<Title order={3} size="h1" />` is
 * identical to `size="4xl"` — still an `<h3>`, just sized like an `h1`.
 *
 * The visual scale is the same one `Text` uses (`lib/typography-size.ts`),
 * so a `Title` and a `Text` given the same `size` render at the same size.
 *
 * Always emits semibold + tight tracking; if a screen needs a different
 * weight, pass it via `className`.
 */
declare const titleVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleSize = NonNullable<VariantProps<typeof titleVariants>["size"]>;
export type TitleProps = HTMLArkProps<"h1"> & WithTestId & {
    /** Semantic heading level — picks the `<h*>` element. Defaults to `1`. */
    order?: TitleOrder;
    /**
     * Visual scale. Defaults to the per-order map (`order=3` -> `2xl`, etc.).
     * Also accepts the heading aliases (`h1`..`h6`, `p`) for the same tokens.
     */
    size?: TitleSize | HeadingSizeAlias;
};
export declare const Title: ({ className, order, size, testId, ...rest }: TitleProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=title.d.ts.map