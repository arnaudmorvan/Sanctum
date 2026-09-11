import { type VariantProps } from "class-variance-authority";
import type { FocusEvent, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize } from "../input/input";
/**
 * PinInput — a row of single-character cells for one-time codes, PINs, and
 * confirmation tokens, on Ark UI's PinInput machine. Each cell is a real
 * `<input>`; the machine handles autofocus advance, paste-to-fill, backspace
 * navigation, masking, and `otp` autocomplete, and a `HiddenInput` backs form
 * submission.
 *
 *   - Value is a single `string` here (one char per cell): the machine speaks
 *     `string[]`, but `value` / `defaultValue` take a string and `onChange` /
 *     `onComplete` hand one back.
 *   - Like the rest of the family it carries its own `label` / `description` /
 *     `error` / `required` via [`Field`](/docs/field); `error` flips the cells
 *     to the invalid (red) state, or set `invalid` directly.
 *   - `onComplete` fires once every cell is filled.
 *
 * Cells reuse the shared shell tokens, so PinInput sits visually with the rest
 * of the family; palette rides on `data-color` (focus ring only).
 */
/** Single PIN cell — the shared shell chrome squared off per `size`. */
export declare const pinCell: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type PinCellVariants = VariantProps<typeof pinCell>;
type PinInputClassNames = {
    /** The field wrapper (label / description / error). */
    field?: string;
    /** The control row wrapping the cells (also targeted by `className`). */
    root?: string;
    /** Each cell `<input>`. */
    input?: string;
};
export type PinInputProps = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Controlled value — one character per cell. */
    value?: string;
    /** Uncontrolled initial value. */
    defaultValue?: string;
    /** Fires with the current joined value on every change. */
    onChange?: (value: string) => void;
    /** Fires with the joined value once every cell is filled. */
    onComplete?: (value: string) => void;
    /** Number of cells to render. */
    length: number;
    /** Use `autocomplete="one-time-code"` so OS-level OTP autofill works. */
    otp?: boolean;
    /** Mask the entered characters like a password field. */
    mask?: boolean;
    /** Which characters each cell accepts. */
    type?: "numeric" | "alphanumeric" | "alphabetic";
    /** Placeholder shown in each empty cell. */
    placeholder?: string;
    /** Field name for native form submission. */
    name?: string;
    /** Red invalid state; OR'd with `error`. */
    invalid?: boolean;
    /** Dims and disables the cells. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    size?: InputSize;
    /** Accent palette for the focus ring. */
    color?: Color;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the first cell for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    /** Forwarded to the first cell; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    className?: string;
    classNames?: PinInputClassNames;
};
export declare const PinInput: ({ value, defaultValue, onChange, onComplete, length, otp, mask, type, placeholder, name, invalid, disabled, readOnly, required, label, description, error, size, color, id, ref, onBlur, className, classNames, testId, }: PinInputProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=pin-input.d.ts.map