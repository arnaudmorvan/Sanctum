import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import { type RenderItem, type SelectData, type SelectValue } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * ComboboxList — a searchable, single-value option list with no trigger of its
 * own. It renders permanently open: embed it inline inside a container you
 * already control the visibility of (a `Popover`, a `Drawer`, a custom panel)
 * rather than owning a floating dropdown. For a self-contained trigger +
 * floating panel, use [`Select`](/docs/select) instead — same `data` contract
 * and value shape, just with its own closed/open trigger button.
 *
 *   - `data` / `value` / `onChange` match `Select` exactly
 *     (`SelectValue<Data> | null`) — the picked value must come from `data`;
 *     for free text see [`Autocomplete`](/docs/autocomplete).
 *   - Type to filter; `clearable` adds a clear button next to the search icon
 *     once there's a value.
 *   - Label / description / error come from the built-in `Field`, same as the
 *     rest of the family — omit them when embedding inside your own popover.
 */
type ComboboxListClassNames = {
    /** The field wrapper (label / description / error). */
    field?: string;
    /** The search row (also targeted by `className`). */
    search?: string;
    /** The search `<input>`. */
    input?: string;
    /** A single option row. */
    option?: string;
    /** The scrollable option list. */
    list?: string;
};
export type ComboboxListProps<Data extends SelectData = SelectData> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
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
    /** Placeholder for the search field. */
    placeholder?: string;
    /** Message shown when no option matches. Pass `null` to render nothing. */
    empty?: ReactNode;
    /** Show a clear button once there's a value. */
    clearable?: boolean;
    size?: InputSize;
    /**
     * Search row treatment. Defaults to `"unstyled"` (no border/background) since
     * this is normally embedded inside a container that already draws its own
     * chrome; pass `"default"` / `"filled"` when using it standalone.
     */
    variant?: InputVariant;
    /** Accent palette for the focus ring / selected checks. */
    color?: Color;
    disabled?: boolean;
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Name for native form submission. */
    name?: string;
    /** Forwarded to the search input; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /** Lands on the focusable search `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    className?: string;
    classNames?: ComboboxListClassNames;
};
export declare const ComboboxList: <const Data extends SelectData = SelectData>({ data, value: valueProp, defaultValue, onChange, renderItem, placeholder, empty, clearable, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, }: ComboboxListProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=combobox-list.d.ts.map