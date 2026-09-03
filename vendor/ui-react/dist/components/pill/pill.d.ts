import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Pill — compact, optionally removable chip. The visual the form family renders
 * selected values into (MultiSelect / TagsInput), and a standalone tag/token
 * elsewhere.
 *
 *   - Neutral gray by default; pass a `color` to tint it with the palette's
 *     soft surface + text slots (`--c-soft` / `--c-text`) via `data-color`.
 *   - `withRemoveButton` renders a trailing `×` button that fires `onRemove`.
 *   - `size` (and `disabled`) can be set per-pill or inherited once from a
 *     wrapping `PillGroup` through context — explicit props win.
 *
 * `asChild` is inherited from the `ark.span` factory for polymorphism.
 */
type PillGroupContextValue = {
    size?: PillSize;
    disabled?: boolean;
};
/** Exported so `PillsInput` can size/disable the pills it hosts (same as a group). */
export declare const PillGroupContext: import("react").Context<PillGroupContextValue | null>;
/** Exported so TagsInput can style its Ark tag preview to look like a Pill. */
export declare const pill: (props?: ({
    withRemoveButton?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** Exported alongside `pill` for TagsInput's delete trigger. */
export declare const pillRemove: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type PillSize = NonNullable<VariantProps<typeof pill>["size"]>;
type PillClassNames = {
    root?: string;
    label?: string;
    remove?: string;
};
export type PillProps = Omit<HTMLArkProps<"span">, "color"> & WithTestId & {
    size?: PillSize;
    /** Accent palette — tints the chip with the soft surface. Neutral when unset. */
    color?: Color;
    /** Render a trailing remove (`×`) button that fires `onRemove`. */
    withRemoveButton?: boolean;
    /** Called when the remove button is activated. */
    onRemove?: () => void;
    /** Accessible label for the remove button. */
    removeLabel?: string;
    disabled?: boolean;
    classNames?: PillClassNames;
};
export declare const Pill: ({ size: sizeProp, color, withRemoveButton, onRemove, removeLabel, disabled: disabledProp, children, className, classNames, testId, ...rest }: PillProps) => import("react").JSX.Element;
export type PillGroupProps = HTMLArkProps<"div"> & {
    /** Shared size for child pills (each pill can still override). */
    size?: PillSize;
    /** Disable every pill in the group. */
    disabled?: boolean;
};
export declare const PillGroup: ({ size, disabled, className, children, ...rest }: PillGroupProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=pill.d.ts.map