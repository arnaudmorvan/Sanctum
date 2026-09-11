import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import type { ClearSectionMode } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type RenderTreeSelectItem, type TreeNodeData, type TreePayload, type TreeSelectData, type TreeValue } from "../../lib/tree-data";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
type TreeSelectClassNames = {
    field?: string;
    trigger?: string;
    popover?: string;
    search?: string;
    node?: string;
    label?: string;
};
export type TreeSelectProps<Data extends TreeSelectData = TreeNodeData[]> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Hierarchical options. */
    data: Data;
    /** Controlled selection — the selected leaf value (or `null`). */
    value?: TreeValue<Data> | null;
    /** Uncontrolled initial selection. */
    defaultValue?: TreeValue<Data> | null;
    /** Fires with the selected leaf value, or `null` when cleared. */
    onChange?: (value: TreeValue<Data> | null) => void;
    /**
     * Render each node's content yourself. Receives the node and its live
     * `{ selected, leaf, disabled, depth }` state; the component keeps the row
     * (treeitem role, indent rails, roving focus, click), the callback fills the
     * content after the rails — including any selected check. Omit it for the
     * default label + check.
     */
    renderItem?: RenderTreeSelectItem<TreePayload<Data>>;
    /** Show a clear button (and allow deselecting) once a value is set. */
    clearable?: boolean;
    /** Whether the clear button replaces the chevron (`"replace"`, default) or sits beside it (`"both"`). */
    clearSectionMode?: ClearSectionMode;
    /** Show a search field that filters the tree. Default `false`. */
    searchable?: boolean;
    /** Placeholder for the search field. */
    searchPlaceholder?: string;
    /** Message shown when the search matches nothing. */
    empty?: ReactNode;
    /** Placeholder shown while no value is selected. */
    placeholder?: string;
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before the clear button / chevron. */
    endSlot?: ReactNode;
    size?: InputSize;
    variant?: InputVariant;
    color?: Color;
    disabled?: boolean;
    /** Keeps full contrast but blocks opening and selection. */
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Wires a hidden input into native form submission. */
    name?: string;
    /** Forwarded to the trigger; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    /** Lands on the trigger `<div role="combobox">` for focus-on-error. */
    ref?: Ref<HTMLDivElement>;
    className?: string;
    classNames?: TreeSelectClassNames;
};
export declare const TreeSelect: <const Data extends TreeSelectData = TreeNodeData[]>({ data, value: valueProp, defaultValue, onChange, renderItem, clearable, clearSectionMode, searchable, searchPlaceholder, empty, placeholder, startSlot, endSlot, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, }: TreeSelectProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=tree-select.d.ts.map