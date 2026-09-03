import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { Color } from "../../lib/colors";
import { type GradientDir, type GradientProps } from "../../lib/gradient";
import type { WithTestId } from "../../lib/test-id";
declare const badgeVariants: (props?: ({
    variant?: "light" | "filled" | "outline" | "subtle" | "gradient" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>;
export type { GradientDir, GradientProps };
export type BadgeProps = Omit<HTMLArkProps<"span">, "color"> & VariantProps<typeof badgeVariants> & WithTestId & {
    /** Accent palette. Re-exported as `Color` from `@42/ui-react`. */
    color?: Color;
    /**
     * Gradient config. Only applied when `variant="gradient"`.
     * Mirrors Tailwind's from-* / to-* / via-* utilities: sets the individual
     * CSS vars so the existing --tw-gradient-stops chain picks them up.
     * Unset fields fall back to the CVA defaults (purple-300 → pink-400, to-r).
     */
    gradient?: GradientProps;
};
export declare const Badge: ({ className, variant, size, color, gradient, style, testId, ...rest }: BadgeProps) => import("react").JSX.Element;
//# sourceMappingURL=badge.d.ts.map