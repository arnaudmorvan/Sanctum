import { Progress as Ark } from "@ark-ui/react/progress";
import { type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef, type CSSProperties, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import type { GradientDir, GradientProps } from "../../lib/gradient";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
declare const circularRange: (props?: ({
    variant?: "filled" | "gradient" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type CircularProgressVariant = NonNullable<VariantProps<typeof circularRange>["variant"]>;
export type CircularProgressSize = Size;
export type { GradientDir, GradientProps };
type CircularProgressClassNames = {
    root?: string;
    circle?: string;
    track?: string;
    range?: string;
    label?: string;
};
type ArkRootProps = ComponentPropsWithoutRef<typeof Ark.Root>;
export type CircularProgressProps = Omit<ArkRootProps, "value" | "defaultValue" | "onValueChange" | "ref" | "className" | "children"> & VariantProps<typeof circularRange> & WithTestId & {
    /** Controlled value (0..max). Pass `null` for the indeterminate state. */
    value?: number | null;
    /** Uncontrolled initial value. Pass `null` to start indeterminate. */
    defaultValue?: number | null;
    /** Fires on every value change. */
    onChange?: (value: number | null) => void;
    size?: CircularProgressSize;
    /** Stroke width in px. Defaults to a per-size value. */
    thickness?: number;
    /** Accent palette. Ignored when `variant="gradient"`. */
    color?: Color;
    /**
     * Gradient stops; only applied when `variant="gradient"`. `from` / `to` /
     * `via` are CSS colors (default purple-300 → pink-400). `dir` is ignored —
     * the SVG sweep direction is fixed (top-left → bottom-right).
     */
    gradient?: GradientProps;
    /** Centered content, e.g. a percentage label. */
    children?: ReactNode;
    /** Lands on the ring `<svg>` — the `role="progressbar"` element. */
    ref?: Ref<SVGSVGElement>;
    className?: string;
    classNames?: CircularProgressClassNames;
    style?: CSSProperties;
};
export declare const CircularProgress: ({ value, defaultValue, onChange, variant, size, thickness, color, gradient, min, max, children, ref, className, classNames, style, testId, ...rest }: CircularProgressProps) => import("react").JSX.Element;
//# sourceMappingURL=circular-progress.d.ts.map