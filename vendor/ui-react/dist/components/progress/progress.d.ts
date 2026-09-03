import { Progress as Ark } from "@ark-ui/react/progress";
import { type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, CSSProperties, Ref } from "react";
import type { Color } from "../../lib/colors";
import { type GradientDir, type GradientProps } from "../../lib/gradient";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
declare const progressRange: (props?: ({
    variant?: "filled" | "gradient" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ProgressVariant = NonNullable<VariantProps<typeof progressRange>["variant"]>;
export type ProgressSize = Size;
export type { GradientDir, GradientProps };
type ProgressClassNames = {
    root?: string;
    track?: string;
    range?: string;
};
type ArkRootProps = ComponentPropsWithoutRef<typeof Ark.Root>;
export type ProgressProps = Omit<ArkRootProps, "value" | "defaultValue" | "onValueChange" | "ref" | "className"> & VariantProps<typeof progressRange> & WithTestId & {
    /**
     * Controlled value in `min..max`. Pass `null` for the indeterminate state.
     * Leave unset (with no `defaultValue`) for an uncontrolled bar.
     */
    value?: number | null;
    /** Uncontrolled initial value. Pass `null` to start indeterminate. */
    defaultValue?: number | null;
    /** Fires on every value change. */
    onChange?: (value: number | null) => void;
    size?: ProgressSize;
    /** Accent palette. Ignored when `variant="gradient"`. */
    color?: Color;
    /**
     * Gradient config; only applied when `variant="gradient"`. Mirrors Badge:
     * sets the individual `--tw-gradient-*` vars consumed by the gradient
     * utility chain. Unset fields fall back to the CVA defaults
     * (purple-300 → pink-400, to-r).
     */
    gradient?: GradientProps;
    /** Lands on the Track — the `role="progressbar"` element. */
    ref?: Ref<HTMLDivElement>;
    className?: string;
    classNames?: ProgressClassNames;
    style?: CSSProperties;
};
export declare const Progress: ({ value, defaultValue, onChange, variant, size, color, gradient, min, max, ref, className, classNames, style, testId, ...rest }: ProgressProps) => import("react").JSX.Element;
//# sourceMappingURL=progress.d.ts.map