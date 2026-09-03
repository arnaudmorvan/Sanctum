import type { RenderItem, SelectData } from "../../../lib/select-data";
import type { AnyColumn } from "./utils";
export declare const SelectFilter: ({ column, options, multiple, renderItem, onClose, }: {
    column: AnyColumn;
    options: SelectData;
    multiple?: boolean;
    /** Same escape hatch `ComboboxList`/`MultiComboboxList` already expose —
     *  passed straight through, one render function for both pickers. */
    renderItem?: RenderItem<SelectData>;
    /** Called after a single-value pick — closes the header popover, matching
     *  `Select`'s own close-on-pick habit. Multi-select stays open so more
     *  values can be toggled. */
    onClose?: () => void;
}) => import("react").JSX.Element;
//# sourceMappingURL=data-table-select-filter.d.ts.map