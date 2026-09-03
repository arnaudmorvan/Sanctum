import type { FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type ControlIndicatorVariant } from "./control";
/**
 * Checkbox — a single boolean (or tri-state) control on Ark UI's Checkbox
 * machine. The label sits inline beside the box, rendered through the
 * checkbox's own `Ark.Label` part (not `Field`'s) so it stays correctly
 * wired to the hidden input's `aria-labelledby` and — critically — carries no
 * layout footprint when it's visually hidden (e.g. `classNames.label:
 * "sr-only"`): an absolutely-positioned flex child isn't a flex item at all,
 * so it can't pick up the root's `gap-2`. `description` / `error` live below
 * it via the shared `Field` scaffold, so a `Checkbox` is accessible and
 * complete on its own. Implements the kit's `FormControlProps` contract: the
 * `ref` and `onBlur` land on the submittable hidden `<input>`, and `name`
 * wires it into native form submission.
 *
 *   - The checked state is `boolean | "indeterminate"`; `onCheckedChange`
 *     hands you that next value directly (the indeterminate state never sets
 *     itself — drive it from the parent, e.g. a "select all" header).
 *   - `invalid` is OR'd with `error != null`, matching the rest of the family,
 *     so a form library can flip the red state independently of the message.
 *
 * Two `variant`s decide the checked fill: `default` is a neutral, monochrome
 * box (palette-independent), while `filled` tints the checked fill with the
 * active palette via `data-color` + the `--c-solid` slot var. The box is
 * palette-independent at rest, and the focus ring is always the brand ring.
 */
export type CheckboxProps = WithTestId & {
    /** Controlled checked state. `"indeterminate"` renders the partial mark. */
    checked?: boolean | "indeterminate";
    /** Uncontrolled initial checked state. */
    defaultChecked?: boolean | "indeterminate";
    /** Fires with the next checked state (a value, not a DOM event). */
    onCheckedChange?: (checked: boolean | "indeterminate") => void;
    /** Inline label beside the box. */
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
    /** Checked-fill treatment: `default` (monochrome) or `filled` (palette-colored). */
    variant?: ControlIndicatorVariant;
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
        label?: string;
        field?: string;
    };
};
export declare const Checkbox: ({ checked, defaultChecked, onCheckedChange, label, description, error, required, invalid, disabled, readOnly, size, variant, color, name, value, id, ref, onBlur, className, classNames, testId, }: CheckboxProps) => import("react").JSX.Element;
//# sourceMappingURL=checkbox.d.ts.map