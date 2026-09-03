import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import { type ClearSectionMode, type RenderItem, type SelectData, type SelectValue } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * MultiSelect — pick several values, shown as removable pills in a wrapping
 * input, searchable by default. It's the whole family working together:
 * Combobox (`multiple`) drives selection, the control is the PillsInput shell,
 * and each value renders as a `Pill`.
 *
 *   - `data` matches `Select` (strings / objects / groups); `value` is `string[]`.
 *   - Type to filter; pick to add (a check marks selected options); remove via a
 *     pill's ×, Backspace on the empty field, or the clear button.
 *   - `maxValues` caps selections; `hidePickedOptions` drops chosen options from
 *     the list; `searchable={false}` turns it into a click-to-open multi-picker.
 *   - Label / description / error come from the built-in `Field`.
 */
type MultiSelectClassNames = {
    root?: string;
    field?: string;
    control?: string;
    input?: string;
    option?: string;
    popover?: string;
    pill?: string;
};
export type MultiSelectProps<Data extends SelectData> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Options: `string[]`, `{ value, label?, disabled?, color? }[]`, or `{ group, items }[]`. */
    data: Data;
    /** Controlled selected values. */
    value?: SelectValue<Data>[];
    /** Uncontrolled initial selection. */
    defaultValue?: SelectValue<Data>[];
    /** Fires with the full selection on every add / remove. */
    onChange?: (value: SelectValue<Data>[]) => void;
    /**
     * Render each option yourself. Receives the (value-narrowed) item and its live
     * `{ selected, highlighted }` state; you own the whole row, including any check
     * affordance. Omit it to render the label + selected check.
     */
    renderItem?: RenderItem<Data>;
    /** Placeholder shown while nothing is selected. */
    placeholder?: string;
    /** Type to filter the options. Default `true`. */
    searchable?: boolean;
    /** Placeholder for the search field once a value is already picked — before that, the
     *  field shows `placeholder` instead. No default; omit it to show nothing, as today. */
    searchPlaceholder?: string;
    /** Show a button that clears all values. */
    clearable?: boolean;
    /** Whether the clear button replaces the chevron (`"replace"`, default) or sits beside it (`"both"`). */
    clearSectionMode?: ClearSectionMode;
    /** Cap the number of selected values. */
    maxValues?: number;
    /** Cap the pills at N rows; the rest collapse into a static "+N" counter. */
    maxLines?: number;
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before the clear button / chevron. */
    endSlot?: ReactNode;
    /** Hide options that are already selected. */
    hidePickedOptions?: boolean;
    /** Message shown when no option matches. Pass `null` to render nothing. */
    empty?: ReactNode;
    size?: InputSize;
    variant?: InputVariant;
    color?: Color;
    disabled?: boolean;
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Wires hidden inputs into native form submission. */
    name?: string;
    /** Forwarded to the search input; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /** Lands on the focusable search `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    className?: string;
    classNames?: MultiSelectClassNames;
};
export declare const MultiSelect: <const Data extends SelectData>({ data, value: valueProp, defaultValue, onChange, renderItem, placeholder, searchable, searchPlaceholder, clearable, clearSectionMode, maxValues, maxLines, startSlot, endSlot, hidePickedOptions, empty, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, }: MultiSelectProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=multi-select.d.ts.map