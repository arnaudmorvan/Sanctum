import type { FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
export type SwitchProps = WithTestId & {
    /** Controlled checked state. */
    checked?: boolean;
    /** Uncontrolled initial checked state. */
    defaultChecked?: boolean;
    /** Fires with the next checked state (a value, not a DOM event). */
    onCheckedChange?: (checked: boolean) => void;
    /** Inline label beside the track. */
    label?: ReactNode;
    /** Helper text below the control. */
    description?: ReactNode;
    /** Error message below the control; its presence sets the invalid state. */
    error?: ReactNode;
    /** Required flag (and, with a label, the red asterisk). */
    required?: boolean;
    /** Red invalid state, OR'd with `error != null`. */
    invalid?: boolean;
    /** Dims and blocks interaction. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    size?: Size;
    color?: Color;
    /** Field name for native form submission. */
    name?: string;
    /** Submitted value when checked (defaults to `"on"`). */
    value?: string;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the hidden `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    /** Forwarded to the hidden `<input>`; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    className?: string;
    classNames?: {
        root?: string;
        control?: string;
        thumb?: string;
        label?: string;
        field?: string;
    };
};
export declare const Switch: ({ checked, defaultChecked, onCheckedChange, label, description, error, required, invalid, disabled, readOnly, size, color, name, value, id, ref, onBlur, className, classNames, testId, }: SwitchProps) => import("react").JSX.Element;
//# sourceMappingURL=switch.d.ts.map