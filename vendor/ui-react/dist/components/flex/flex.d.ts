import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { WithTestId } from "../../lib/test-id";
/**
 * Flex — flexbox layout primitive for vertical or horizontal stacking.
 *
 * Pure React Server Component. Defaults to a column layout with a small gap
 * because that's the dominant case in dashboard / form UI. Use `asChild` to
 * morph the underlying element while keeping the layout behavior.
 *
 * `gap` is a named t-shirt scale (`xxs`→`xxl`) mapped to static Tailwind
 * `gap-*` classes so v4's scanner picks them up at build time. Need `0` or a
 * value outside the scale? Drop to `className="gap-0"`.
 */
declare const flexVariants: (props?: ({
    direction?: "col" | "row" | null | undefined;
    gap?: "xs" | "sm" | "md" | "lg" | "xl" | "none" | "xxs" | "xxl" | null | undefined;
    align?: "center" | "end" | "baseline" | "start" | "stretch" | null | undefined;
    justify?: "center" | "end" | "start" | "between" | "strech" | "around" | "evenly" | null | undefined;
    wrap?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type FlexProps = HTMLArkProps<"div"> & VariantProps<typeof flexVariants> & WithTestId;
export declare const Flex: ({ className, direction, gap, align, justify, wrap, testId, ...rest }: FlexProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=flex.d.ts.map