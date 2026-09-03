import type { FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { FlatValueOf } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type ControlIndicatorSize, type ControlIndicatorVariant } from "../checkbox/control";
/**
 * RadioGroup — a single-choice set of options on Ark UI's RadioGroup machine.
 * Each option is a circular control with an inline label; the group's
 * `description` / `error` / `required` live below it via the shared `Field`
 * scaffold, so a `RadioGroup` is accessible and complete on its own. Implements
 * the kit's `FormControlProps` contract: `name` wires every option's hidden
 * `<input type="radio">` into native form submission, and `ref` / `onBlur` land
 * on the group root for focus-on-error.
 *
 *   - The value is a `string | null`; `onChange` hands you the next value
 *     directly (a value, not a DOM event), matching the rest of the family.
 *   - `data` accepts either `{ value, label, disabled? }` objects or bare
 *     strings (normalized to `{ value: s, label: s }`).
 *   - `invalid` is OR'd with `error != null`, so a form library can flip the
 *     red state independently of the message.
 *
 * Each option reuses the family's shared `controlIndicator` surface layered with
 * `rounded-full`, so its two `variant`s match `Checkbox`: `default` fills the
 * selected circle monochrome, `filled` tints it with the active palette
 * (`data-color` + the `--c-solid` slot var). A neutral inner dot sits on top in
 * both, and the focus ring is always the brand ring.
 */
/** A single option: an explicit object, or a bare string used as both value + label. */
export type RadioGroupItem = {
    value: string;
    label: ReactNode;
    disabled?: boolean;
    /** `data-testid` on the rendered option. Defaults to `` `item-${value}` ``. */
    testId?: string;
} | string;
export type RadioGroupData = ReadonlyArray<RadioGroupItem>;
/** The value union `data` narrows to — literal option values for a `const`-typed
 *  `data` array, or plain `string` for a dynamically-built one. */
export type RadioGroupValue<Data extends RadioGroupData> = FlatValueOf<Data>;
export type RadioGroupProps<Data extends RadioGroupData = RadioGroupItem[]> = WithTestId & {
    /** Controlled value. `null` clears the selection. */
    value?: RadioGroupValue<Data> | null;
    /** Uncontrolled initial value. */
    defaultValue?: RadioGroupValue<Data> | null;
    /** Fires with the next selected value (a value, not a DOM event). */
    onChange?: (value: RadioGroupValue<Data>) => void;
    /** The options. Bare strings are normalized to `{ value, label }`. */
    data: Data;
    /** Stacking direction of the options. */
    orientation?: "horizontal" | "vertical";
    /** Field label above the group. */
    label?: ReactNode;
    /** Helper text below the group. */
    description?: ReactNode;
    /** Error message below the group; its presence sets the invalid state. */
    error?: ReactNode;
    /** Required flag (and, with a label, the red asterisk). */
    required?: boolean;
    /** Red invalid state, OR'd with `error != null`. */
    invalid?: boolean;
    /** Dims and blocks interaction. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    size?: ControlIndicatorSize;
    variant?: ControlIndicatorVariant;
    color?: Color;
    /** Field name for native form submission. */
    name?: string;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the group root for focus-on-error. */
    ref?: Ref<HTMLDivElement>;
    /** Forwarded to the group root; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    className?: string;
    classNames?: {
        root?: string;
        item?: string;
        control?: string;
        label?: string;
        field?: string;
    };
};
export declare const RadioGroup: <const Data extends RadioGroupData = RadioGroupItem[]>({ value, defaultValue, onChange, data, orientation, label, description, error, variant, required, invalid, disabled, readOnly, size, color, name, id, ref, onBlur, className, classNames, testId, }: RadioGroupProps<Data>) => import("react").JSX.Element;
//# sourceMappingURL=radio-group.d.ts.map