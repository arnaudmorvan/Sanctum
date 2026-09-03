import type { DataTableColumnFilter } from "../data-table-meta";
import type { AnyColumn } from "./utils";
export { hasActiveFilterValue, resolveFilterFn } from "./data-table-filter-fns";
/** Renders the right control for a column's `meta.filter`, wired to
 *  `column.setFilterValue`. One body per discriminant — see
 *  `docs/rfcs/data-table.md` §6. */
export declare const DataTableFilterControl: ({ column, filter, onClose, }: {
    column: AnyColumn;
    filter: DataTableColumnFilter;
    /** Called when a control wants its host popover dismissed — the
     *  single-select filter after a pick, and the date/date-range filters once
     *  a range selection completes (or is cleared). */
    onClose?: () => void;
}) => import("react").JSX.Element;
//# sourceMappingURL=index.d.ts.map