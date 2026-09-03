import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import { type RenderItem, type SelectData, type SelectValue } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * MultiComboboxList — a searchable, multi-value option list with no trigger of
 * its own. Same idea as [`ComboboxList`](/docs/combobox-list) but for several
 * values at once: every option shows a checkbox instead of a single check
 * mark, and picking one doesn't close the list. It renders permanently open —
 * embed it inline inside a container you already control the visibility of
 * (a `Popover`, a `Drawer`, a custom panel).
 *
 *   - `data` / `value` / `onChange` match [`MultiSelect`](/docs/multi-select)
 *     exactly (`SelectValue<Data>[]`) — but options render as a checkbox list
 *     rather than pills in the input, which is lighter in a compact popover.
 *   - Type to filter; `clearable` clears every value at once; `maxValues` caps
 *     the selection; `hidePickedOptions` drops chosen options from the list.
 *   - Label / description / error come from the built-in `Field`, same as the
 *     rest of the family — omit them when embedding inside your own popover.
 */
type MultiComboboxListClassNames = {
    /** The field wrapper (label / description / error). */
    field?: string;
    /** The search row (also targeted by `className`). */
    search?: string;
    /** The search `<input>`. */
    input?: string;
    /** A single option row. */
    option?: string;
    /** The checkbox indicator inside an option row. */
    checkbox?: string;
    /** The scrollable option list. */
    list?: string;
};
export type MultiComboboxListProps<Data extends SelectData = SelectData> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Options: `string[]`, `{ value, label?, disabled? }[]`, or `{ group, items }[]`. */
    data: Data;
    /** Controlled selected values. */
    value?: SelectValue<Data>[];
    /** Uncontrolled initial selection. */
    defaultValue?: SelectValue<Data>[];
    /** Fires with the full selection on every add / remove. */
    onChange?: (value: SelectValue<Data>[]) => void;
    /**
     * Render each option yourself. Receives the (value-narrowed) item and its live
     * `{ selected, highlighted }` state; you own the whole row, including the
     * checkbox affordance. Omit it to render the checkbox + label.
     */
    renderItem?: RenderItem<Data>;
    /** Placeholder for the search field. */
    placeholder?: string;
    /** Message shown when no option matches. Pass `null` to render nothing. */
    empty?: ReactNode;
    /** Show a button that clears every value at once. */
    clearable?: boolean;
    /** Cap the number of selected values. */
    maxValues?: number;
    /** Hide options that are already selected. */
    hidePickedOptions?: boolean;
    size?: InputSize;
    /**
     * Search row treatment. Defaults to `"unstyled"` (no border/background) since
     * this is normally embedded inside a container that already draws its own
     * chrome; pass `"default"` / `"filled"` when using it standalone.
     */
    variant?: InputVariant;
    /** Accent palette for the focus ring / checked boxes. */
    color?: Color;
    disabled?: boolean;
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Name for native form submission (one hidden input per value). */
    name?: string;
    /** Forwarded to the search input; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /** Lands on the focusable search `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    className?: string;
    classNames?: MultiComboboxListClassNames;
};
export declare const MultiComboboxList: <const Data extends SelectData = SelectData>({ data, value: valueProp, defaultValue, onChange, renderItem, placeholder, empty, clearable, maxValues, hidePickedOptions, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, }: MultiComboboxListProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=multi-combobox-list.d.ts.map