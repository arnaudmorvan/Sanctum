import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { Color } from "../../lib/colors";
import { type GradientDir, type GradientProps } from "../../lib/gradient";
import type { WithTestId } from "../../lib/test-id";
declare const cardVariants: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "gradient" | null | undefined;
    padding?: "xs" | "sm" | "md" | "lg" | "xl" | "none" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type CardVariant = NonNullable<VariantProps<typeof cardVariants>["variant"]>;
export type { GradientDir, GradientProps };
export type CardProps = HTMLArkProps<"div"> & VariantProps<typeof cardVariants> & WithTestId & {
    color?: Color;
    /**
     * Gradient config. Only applied when `variant="gradient"`.
     * Mirrors Tailwind's from-* / to-* / via-* utilities via CSS vars so
     * the ::before pseudo-element gradient is fully controlled from props.
     * Unset fields fall back to purple-300 → pink-400, to-r.
     */
    gradient?: GradientProps;
};
export type CardHeaderProps = HTMLArkProps<"div"> & WithTestId & {
    withBorder?: boolean;
};
export type CardTitleProps = HTMLArkProps<"h3"> & WithTestId;
export type CardDescriptionProps = HTMLArkProps<"p"> & WithTestId & {
    withBorder?: boolean;
};
export type CardContentProps = HTMLArkProps<"div"> & WithTestId;
export type CardFooterProps = HTMLArkProps<"div"> & WithTestId & {
    withBorder?: boolean;
};
export declare const Card: (({ className, variant, padding, color, gradient, style, testId, ...rest }: CardProps) => import("react").JSX.Element) & {
    Header: ({ className, withBorder, testId, ...rest }: CardHeaderProps) => import("react").JSX.Element;
    Title: ({ className, testId, ...rest }: CardTitleProps) => import("react").JSX.Element;
    Description: ({ className, withBorder, testId, ...rest }: CardDescriptionProps) => import("react").JSX.Element;
    Content: ({ className, testId, ...rest }: CardContentProps) => import("react").JSX.Element;
    Footer: ({ className, withBorder, testId, ...rest }: CardFooterProps) => import("react").JSX.Element;
};
//# sourceMappingURL=card.d.ts.map