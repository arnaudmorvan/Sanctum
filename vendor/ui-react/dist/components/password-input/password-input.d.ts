import type { ChangeEvent, FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * PasswordInput — a native password field with a built-in show / hide toggle.
 * Like {@link Input} it is **event-based**: `value` / `onChange` / `name`
 * forward to the underlying `<input>` (so RHF's `register` and a plain
 * `onChange` handler work as usual). Like the rest of the family it carries its
 * own `label` / `description` / `error` / `required` via [`Field`](/docs/field),
 * so it's complete on its own; `error` flips it to the invalid (red) state.
 *
 * The reveal toggle is owned by Ark's `PasswordInput` machine — it flips the
 * input `type` between `password` and `text` and swaps the indicator icon. The
 * machine is field-aware, so nested in the built-in `Field` it inherits the
 * `id`, `aria-describedby`, and disabled / invalid / read-only state.
 *
 * The toggle renders as a real `<button>` sibling of the input — NOT via the
 * shell's decorative `endSlot`, whose wrapper span is `aria-hidden` and would
 * hide the control from assistive tech. As a direct child it stays clickable
 * and exposed to AT (with `aria-controls` / `aria-expanded` from the machine).
 * Ark deliberately sets `tabIndex={-1}` on it: the input itself is the focus
 * stop, and the toggle is a redundant pointer convenience.
 */
export type PasswordInputProps = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Controlled value, forwarded to the native input. */
    value?: string;
    /** Uncontrolled initial value. */
    defaultValue?: string;
    /** Native change event (forwarded straight to the `<input>`). */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Field name for native form submission. */
    name?: string;
    /** Placeholder shown while the field is empty. */
    placeholder?: string;
    /** Shell treatment: bordered (`default`), soft-filled, or chrome-less. */
    variant?: InputVariant;
    /** Height step / control font / slot icon size. */
    size?: InputSize;
    /** Focus-ring accent. Any kit palette or a consumer-defined one. */
    color?: Color;
    /** Red border + ring; also wires `aria-invalid`. OR'd with `error`. */
    invalid?: boolean;
    /** Dims the shell and disables the input + toggle. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    /** Decorative or interactive content at the inline-start of the control. */
    startSlot?: ReactNode;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the underlying `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    /** Forwarded to the input; drives touched / blurred validation. */
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    /** Styles the shell root. */
    className?: string;
    /** Per-part class overrides. */
    classNames?: {
        field?: string;
        root?: string;
        input?: string;
        visibilityTrigger?: string;
    };
};
export declare const PasswordInput: ({ value, defaultValue, onChange, name, placeholder, variant, size, color, invalid, disabled, readOnly, required, label, description, error, startSlot, id, ref, onBlur, className, classNames, testId, }: PasswordInputProps) => import("react").JSX.Element;
//# sourceMappingURL=password-input.d.ts.map