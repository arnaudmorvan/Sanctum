import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * ThemeIcon — square, non-interactive icon-display box. Visually related to
 * `ActionIcon` (same size/radius scales) but deliberately **not** its
 * (variant × color) look: every variant here is a muted, low-saturation
 * surface — just enough contrast to read as "raised above the page," never
 * a vivid CTA-style fill. There's no focus ring, no hover state, and no
 * cursor affordance, because this is a display, not a control.
 *
 * `asChild` renders the single child as the root, so it composes on top of
 * an interactive element (e.g. wrap a `Link`) when the icon itself needs to
 * be clickable — reach for `ActionIcon` instead when that's the common case
 * (it supplies the focus/disabled handling a real trigger needs).
 */
declare const themeIconVariants: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "subtle" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ThemeIconVariant = NonNullable<VariantProps<typeof themeIconVariants>["variant"]>;
export type ThemeIconSize = NonNullable<VariantProps<typeof themeIconVariants>["size"]>;
export type ThemeIconRadius = NonNullable<VariantProps<typeof themeIconVariants>["radius"]>;
export type ThemeIconProps = HTMLArkProps<"div"> & VariantProps<typeof themeIconVariants> & WithTestId & {
    /** Accent palette. Re-exported as `Color` from `@42/ui-react`. */
    color?: Color;
};
export declare const ThemeIcon: ({ className, variant, size, radius, color, asChild, testId, ...rest }: ThemeIconProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=theme-icon.d.ts.map