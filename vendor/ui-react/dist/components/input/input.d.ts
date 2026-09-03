import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Input / InputBase — the styled input *shell* the whole form family renders
 * into (Select trigger, Combobox/Autocomplete search field, PillsInput, and a
 * future TextInput). It is deliberately the lowest layer: label / description /
 * error live in `Field`, not here.
 *
 *   - `InputBase` is the polymorphic shell. It draws the bordered (or filled)
 *     box, the focus-visible ring, the disabled / invalid states, and lays out
 *     an optional `startSlot` / `endSlot` around a single control child. The
 *     child can be anything — an `<input>`, a `<button>` (Select trigger), or a
 *     `<div>` of pills (PillsInput). Style your control with the exported
 *     `inputControlClasses` so it sits flush inside the shell.
 *   - `Input` is the common case: `InputBase` wrapping a real `<input>`. Native
 *     input props (`value`, `onChange`, `placeholder`, `name`, `type`, `ref`, …)
 *     are forwarded straight to the element; `className` styles the shell root
 *     (matching the kit's other components), and `classNames` overrides parts.
 *
 * Color rides on `data-color` + the slot vars: the shell is palette-independent
 * for fill/text and only the focus ring references `--c-solid`, so every kit
 * palette (and consumer palettes) tints the focus state for free. `invalid`
 * swaps the border / ring to red regardless of `color`.
 */
/** Inner-control reset — apply to whatever element you nest inside `InputBase`
 *  (input, button, …) so it inherits the shell's font and fills the row. */
export declare const inputControlClasses: string;
/**
 * Shared shell chrome — surface, border, focus ring, and state styling. The
 * single-line `Input` shell and the multi-line `PillsInput` shell both build on
 * these; only the layout (row vs wrap) and the sizing differ, so the visual
 * treatment (incl. the invalid red halo) lives in exactly one place.
 */
export declare const shellChrome: string[];
/** Surface treatment per `variant`, shared across the input shells. */
export declare const shellVariants: {
    default: string[];
    filled: string[];
    unstyled: string[];
};
/**
 * Inline gap between the shell's slots and control, per `size`. The single
 * source for this spacing: `inputShell` applies it to the shell row, and any
 * control that lays out its *own* slots inside a nested flex (e.g. the Select
 * trigger) reuses it so adornments sit identically across the family.
 */
export declare const shellGap: {
    readonly xs: "gap-1.5";
    readonly sm: "gap-1.5";
    readonly md: "gap-2";
    readonly lg: "gap-2.5";
    readonly xl: "gap-3";
};
/** Single-line input shell. Reused by the family's button / input controls. */
export declare const inputShell: (props?: ({
    variant?: "default" | "filled" | "unstyled" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** Start/end adornment slot — the shared visual contract for the inline-start /
 *  inline-end content the whole form family lays out (icon, chevron, clear).
 *  Exported so Select / Combobox / the pills controls slot their adornments
 *  identically to `InputBase` instead of re-deriving the layout. */
export declare const inputSlot: string;
/** Muted color for a component's own custom-rendered placeholder / empty-state text — a
 *  `<span>` standing in for a native `::placeholder` wherever the value display isn't a real
 *  `<input>` (Select's trigger, MultiSelect's non-searchable mode, TreeSelect / TreeMultiSelect's
 *  trigger, DatePicker's range-mode trigger). Same color pairing as `inputControlClasses`'s native
 *  `::placeholder` rule above. Kept as its own export, not folded into `inputSlot` — `inputSlot`'s
 *  `inline-flex items-center justify-center shrink-0` are icon-slot layout rules; forced onto a
 *  run of text they'd center it and block it from shrinking, silently breaking truncation on the
 *  call sites where this color sits on the same span as `flex-1`/`truncate`. */
export declare const placeholderColor = "text-gray-light-500 dark:text-gray-dark-400";
export type InputVariant = NonNullable<VariantProps<typeof inputShell>["variant"]>;
export type InputSize = NonNullable<VariantProps<typeof inputShell>["size"]>;
type ShellClassNames = {
    /** The shell `<div>` (also targeted by `className`). */
    root?: string;
    startSlot?: string;
    endSlot?: string;
};
/** Props shared by the shell and the convenience `Input`. */
type ShellOwnProps = VariantProps<typeof inputShell> & {
    /** Accent palette for the focus ring. Re-exported as `Color` from `@42/ui-react`. */
    color?: Color;
    /** Red border + ring; also wires `aria-invalid` on `Input`. */
    invalid?: boolean;
    /** Dims the shell and (on `Input`) disables the element. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits (on `Input`). */
    readOnly?: boolean;
    /** `cursor: pointer` — for button-like triggers (Select). */
    pointer?: boolean;
    /** Decorative or interactive content at the inline-start of the control. */
    startSlot?: ReactNode;
    /** Content at the inline-end — chevron, clear button, spinner. */
    endSlot?: ReactNode;
};
export type InputBaseProps = Omit<HTMLArkProps<"div">, "color"> & ShellOwnProps & WithTestId & {
    classNames?: ShellClassNames;
};
export declare const InputBase: ({ variant, size, color, invalid, disabled, readOnly, pointer, startSlot, endSlot, children, className, classNames, testId, ...rest }: InputBaseProps) => import("react").JSX.Element;
export type InputProps = Omit<HTMLArkProps<"input">, "size" | "color"> & ShellOwnProps & WithTestId & {
    classNames?: ShellClassNames & {
        /** The inner `<input>` element. */
        input?: string;
    };
};
export declare const Input: ({ variant, size, color, invalid, disabled, readOnly, pointer, startSlot, endSlot, className, classNames, testId, ...rest }: InputProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=input.d.ts.map