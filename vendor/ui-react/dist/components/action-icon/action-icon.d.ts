import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * ActionIcon — square, icon-only sibling of `Button`.
 *
 * Same (variant × color) model as `Button`:
 *   - `variant` picks the shape (filled / light / outline / subtle / default)
 *   - `color`   picks the palette (brand / gray / red / …)
 *   - Color is delivered via `data-color` + the slot vars in `colors.css`,
 *     so dark mode shade-shifts happen at the CSS layer.
 *
 * What's specific to ActionIcon:
 *   - Forced 1:1 aspect ratio.
 *   - Own `radius` scale (incl. `full` for circular FABs / like-buttons).
 *   - Wider size scale (xs..xl) than Button — toolbar density matters here.
 *
 * The accessible name MUST come from `aria-label` (or `aria-labelledby`); the
 * icon children are decoration.
 *
 * `asChild` renders the single child with ActionIcon's styling. When set,
 * `loading` is skipped (Spinner would conflict with `Children.only`) — pass
 * a spinner directly in the child if needed.
 */
declare const actionIconVariants: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "subtle" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ActionIconVariant = NonNullable<VariantProps<typeof actionIconVariants>["variant"]>;
export type ActionIconSize = NonNullable<VariantProps<typeof actionIconVariants>["size"]>;
export type ActionIconRadius = NonNullable<VariantProps<typeof actionIconVariants>["radius"]>;
export type ActionIconProps = Omit<HTMLArkProps<"button">, "color"> & VariantProps<typeof actionIconVariants> & WithTestId & {
    /** Accent palette. Re-exported as `Color` from `@42/ui-react`. */
    color?: Color;
    /**
     * Replace the icon with a spinner, mark the element as busy, and suppress
     * pointer interactions. Mirrors `Button`'s `loading`.
     */
    loading?: boolean;
};
export declare const ActionIcon: ({ className, variant, size, radius, color, loading, children, disabled, type, asChild, testId, ...rest }: ActionIconProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=action-icon.d.ts.map