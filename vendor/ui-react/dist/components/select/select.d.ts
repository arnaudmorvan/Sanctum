import { type ComponentProps, type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type ClearSectionMode, type RenderItem, type SelectData, type SelectValue } from "../../lib/select-data";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * Select — data-driven single-value picker on Ark UI's Select machine. Pass
 * `data` and it renders: a styled trigger, a popover of options, native form
 * submission (hidden `<select>`), typeahead, and full keyboard / RTL / ARIA from
 * Ark. For a *searchable* picker use `Autocomplete`; for multiple values use
 * `MultiSelect`.
 *
 *   - `data` accepts `string[]`, `{ value, label?, disabled? }[]`, or grouped
 *     `{ group, items }[]` (see `SelectData`).
 *   - Value is a single `string | null`; the machine's array contract is hidden.
 *   - Label / description / error come from the built-in `Field` wrapper, so a
 *     `Select` is accessible and complete on its own.
 *   - `clearable` swaps the chevron for a clear button once a value is set.
 *
 * Palette rides on `data-color`; the trigger reuses the shared input shell and
 * the popover the shared option styling, so Select and Combobox look identical.
 */
type SelectClassNames = {
    field?: string;
    /** The label element itself — e.g. `"sr-only"` to keep the accessible name
     *  without showing it (pair with a sibling element for a visible label
     *  placed elsewhere in the layout). */
    label?: string;
    control?: string;
    option?: string;
    popover?: string;
};
export type SelectProps<Data extends SelectData = SelectData> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Options: `string[]`, `{ value, label?, disabled? }[]`, or `{ group, items }[]`. */
    data: Data;
    /** Controlled value. */
    value?: SelectValue<Data> | null;
    /** Uncontrolled initial value. */
    defaultValue?: SelectValue<Data> | null;
    /** Fires with the selected value (or `null` when cleared). */
    onChange?: (value: SelectValue<Data> | null) => void;
    /**
     * Render each option yourself. Receives the (value-narrowed) item and its live
     * `{ selected, highlighted }` state; you own the whole row, including any check
     * affordance. Omit it to render the label + selected check.
     */
    renderItem?: RenderItem<Data>;
    /** Placeholder shown while no value is selected. */
    placeholder?: string;
    /** Show a clear button (and allow deselecting) once a value is set. */
    clearable?: boolean;
    /** Whether the clear button replaces the chevron (`"replace"`, default) or sits beside it (`"both"`). */
    clearSectionMode?: ClearSectionMode;
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before the chevron / clear button. */
    endSlot?: ReactNode;
    size?: InputSize;
    variant?: InputVariant;
    color?: Color;
    disabled?: boolean;
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Wires the hidden `<select>` into native form submission. */
    name?: string;
    /** Forwarded to the trigger; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
    /** Lands on the trigger `<button>` for focus-on-error. */
    ref?: Ref<HTMLButtonElement>;
    className?: string;
    classNames?: SelectClassNames;
};
export declare const Select: <const Data extends SelectData = SelectData>({ data, value, defaultValue, onChange, renderItem, placeholder, clearable, clearSectionMode, startSlot, endSlot, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, ...selectProps }: SelectProps<Data> & Omit<ComponentProps<"select">, keyof SelectProps>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=select.d.ts.map