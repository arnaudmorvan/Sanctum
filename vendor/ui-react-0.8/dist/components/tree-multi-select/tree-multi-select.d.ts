import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import type { ClearSectionMode } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type RenderTreeMultiSelectItem, type TreeNodeData, type TreePayload, type TreeSelectData, type TreeValue } from "../../lib/tree-data";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
type TreeMultiSelectClassNames = {
    field?: string;
    trigger?: string;
    popover?: string;
    search?: string;
    node?: string;
    label?: string;
    checkbox?: string;
    pill?: string;
};
export type TreeMultiSelectProps<Data extends TreeSelectData = TreeNodeData[]> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Hierarchical options. */
    data: Data;
    /** Controlled selection — the selected leaf values. */
    value?: TreeValue<Data>[];
    /** Uncontrolled initial selection. */
    defaultValue?: TreeValue<Data>[];
    /** Fires with the full leaf selection on every toggle / removal. */
    onChange?: (value: TreeValue<Data>[]) => void;
    /**
     * Render each node's content yourself. Receives the node and its live
     * `{ checked, indeterminate, leaf, disabled, depth }` state; the component keeps
     * the row (treeitem role, indent rails, roving focus, click), the callback fills
     * the content after the rails — including any checkbox. Omit it for the default
     * checkbox + label.
     */
    renderItem?: RenderTreeMultiSelectItem<TreePayload<Data>>;
    /** Show a button that clears the whole selection. */
    clearable?: boolean;
    /** Whether the clear button replaces the chevron (`"replace"`, default) or sits beside it (`"both"`). */
    clearSectionMode?: ClearSectionMode;
    /** Show a search field that filters the tree. Default `true`. */
    searchable?: boolean;
    /** Placeholder for the search field. */
    searchPlaceholder?: string;
    /** Message shown when the search matches nothing. */
    empty?: ReactNode;
    /** Placeholder shown while nothing is selected. */
    placeholder?: string;
    /** Cap the pills at N rows; the rest collapse into a static "+N" counter. */
    maxLines?: number;
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before the clear button / chevron. */
    endSlot?: ReactNode;
    size?: InputSize;
    variant?: InputVariant;
    color?: Color;
    disabled?: boolean;
    /** Keeps full contrast but blocks opening and toggling. */
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Wires hidden inputs into native form submission. */
    name?: string;
    /** Forwarded to the trigger; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    /** Lands on the trigger `<div role="combobox">` for focus-on-error. */
    ref?: Ref<HTMLDivElement>;
    className?: string;
    classNames?: TreeMultiSelectClassNames;
};
export declare const TreeMultiSelect: <const Data extends TreeSelectData = TreeNodeData[]>({ data, value: valueProp, defaultValue, onChange, renderItem, clearable, clearSectionMode, searchable, searchPlaceholder, empty, placeholder, maxLines, startSlot, endSlot, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, }: TreeMultiSelectProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=tree-multi-select.d.ts.map