import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import { type ClearSectionMode, type ItemRenderState, type NormalizedItem, type SelectData, type SelectPayload } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * Autocomplete — free-text input with a suggestion popover, on the `Combobox`
 * engine. Unlike `Select`, the **value is the typed string** (`allowCustomValue`):
 * `data` are only suggestions, and the user can type anything or pick one.
 *
 *   - `data` accepts the same shapes as `Select` (strings / objects / groups).
 *   - Suggestions filter as you type. Once the query exactly
 *     matches a suggestion (e.g. right after picking one) the full list shows
 *     again rather than collapsing to that single match.
 *   - Label / description / error come from the built-in `Field` wrapper.
 */
type AutocompleteClassNames = {
    field?: string;
    control?: string;
    input?: string;
    option?: string;
    popover?: string;
};
export type AutocompleteProps<Data extends SelectData = SelectData> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Suggestions: `string[]`, `{ value, label?, disabled? }[]`, or `{ group, items }[]`. */
    data: Data;
    /** Controlled input text (this is the value). */
    value?: string;
    /** Uncontrolled initial text. */
    defaultValue?: string;
    /** Fires with the input text on every change (typing or picking a suggestion). */
    onChange?: (value: string) => void;
    /**
     * Render each suggestion yourself. Receives the item — including its typed
     * `payload` — and its live `{ selected, highlighted }` state; you own the whole
     * row, including any check affordance. Omit it to render the label + selected
     * check.
     */
    renderItem?: (item: NormalizedItem<SelectPayload<Data>>, state: ItemRenderState) => ReactNode;
    /** Placeholder shown while the field is empty — this same field also filters the
     *  suggestion list, so there's no separate search placeholder. */
    placeholder?: string;
    /** Show a clear button once there's text. */
    clearable?: boolean;
    /** Whether the clear button replaces the chevron (`"replace"`, default) or sits beside it (`"both"`). */
    clearSectionMode?: ClearSectionMode;
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before the clear button / chevron. */
    endSlot?: ReactNode;
    /** Message shown when no suggestion matches. Pass `null` to render nothing. */
    empty?: ReactNode;
    size?: InputSize;
    variant?: InputVariant;
    color?: Color;
    disabled?: boolean;
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Name for the underlying input (form submission). */
    name?: string;
    /** Forwarded to the input; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /** Lands on the focusable `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    className?: string;
    classNames?: AutocompleteClassNames;
};
export declare const Autocomplete: <const Data extends SelectData = SelectData>({ data, value, defaultValue, onChange, renderItem, placeholder, clearable, clearSectionMode, startSlot, endSlot, empty, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, }: AutocompleteProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=autocomplete.d.ts.map