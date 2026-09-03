import type { FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * NumberInput — a numeric `<input>` with increment / decrement steppers on Ark
 * UI's NumberInput machine. It lives on the same shell as [`Input`](/docs/input)
 * (border, focus ring, slots, invalid / disabled states) and adds spin buttons,
 * clamping, locale-aware formatting, and the full keyboard / wheel model.
 *
 *   - Value is a real `number` here (or `null` for empty): the machine speaks
 *     strings internally, but `value` / `defaultValue` take a `number | null`
 *     and `onChange` hands one back — `null` whenever the field has no valid
 *     number (empty, or mid-edit on a partial token).
 *   - Like the rest of the family it carries its own `label` / `description` /
 *     `error` / `required` via [`Field`](/docs/field); `error` flips the red
 *     state, or set `invalid` directly.
 *   - `hideControls` drops the steppers for a plain numeric field.
 *   - `clearable` adds a clear (×) button once there's a value, resetting to
 *     `null` — the numeric analogue of `Select`'s `clearable`.
 *
 * Palette rides on `data-color`; only the focus ring tints, matching the family.
 */
type NumberInputClassNames = {
    /** The field wrapper (label / description / error). */
    field?: string;
    /** The label element itself — e.g. `"sr-only"` to keep the accessible name
     *  without showing it (pair with `suffix` for a unit hint in its place). */
    label?: string;
    /** The shell `<div>` (also targeted by `className`). */
    root?: string;
    /** The inner `<input>` element. */
    input?: string;
    /** The stepper column wrapping the increment / decrement triggers. */
    control?: string;
};
export type NumberInputProps = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Controlled value; `null` for empty. */
    value?: number | null;
    /** Uncontrolled initial value; `null` for empty. */
    defaultValue?: number | null;
    /** Fires with the next numeric value, or `null` when the field has no valid number. */
    onChange?: (value: number | null) => void;
    /** Minimum value. */
    min?: number;
    /** Maximum value. */
    max?: number;
    /** Increment / decrement step. */
    step?: number;
    /** Placeholder shown while the field is empty. */
    placeholder?: string;
    /** Options forwarded to `Intl.NumberFormat` for display (currency, percent, …). */
    formatOptions?: Intl.NumberFormatOptions;
    /** Allow the mouse wheel to change the value while focused. */
    allowMouseWheel?: boolean;
    /** Clamp the value into `[min, max]` when the input blurs. */
    clampValueOnBlur?: boolean;
    /** Wrap past `min` / `max` instead of clamping (23 → 0, 0 → 59, …) — for
     *  cyclical fields like hours/minutes. Requires both `min` and `max`, and
     *  the field to be used controlled: the wrapped value round-trips back in
     *  as `value` on the next render to correct the display. */
    wrap?: boolean;
    /** Hide the increment / decrement steppers for a plain numeric field. */
    hideControls?: boolean;
    /** Show a clear button once there's a value, resetting to `null`. */
    clearable?: boolean;
    /** Field name for native form submission. */
    name?: string;
    /** Red invalid state; OR'd with `error`. */
    invalid?: boolean;
    /** Dims the shell and disables the input. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    variant?: InputVariant;
    size?: InputSize;
    /** Accent palette for the focus ring. */
    color?: Color;
    /** Inline-start adornment (icon, prefix). */
    startSlot?: ReactNode;
    /** Non-interactive unit hint (e.g. `"h"`, `"%"`) rendered right after the
     *  value, before the clear button / steppers — `aria-hidden` and
     *  non-selectable, never part of the editable value. Distinct from a
     *  generic end adornment: `InputBase`'s `endSlot` renders after *all*
     *  content (i.e. after the steppers here), which would sit away from the
     *  digits instead of glued to them. */
    suffix?: ReactNode;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    /** Forwarded to the `<input>`; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    className?: string;
    classNames?: NumberInputClassNames;
};
export declare const NumberInput: ({ value, defaultValue, onChange, min, max, step, placeholder, formatOptions, allowMouseWheel, clampValueOnBlur, wrap, hideControls, clearable, name, invalid, disabled, readOnly, required, label, description, error, variant, size, color, startSlot, suffix, id, ref, onBlur, className, classNames, testId, }: NumberInputProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=number-input.d.ts.map