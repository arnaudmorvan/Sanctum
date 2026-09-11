import type { FilterFn } from "@tanstack/react-table";
import type { DataTableColumnFilter } from "../data-table-meta";
/** Same value-type-agnostic convention as `AnyColumn` — `resolveFilterFn` is
 *  built from `meta.filter` alone, independent of any particular `TEntity`. */
type AnyFilterFn = FilterFn<any>;
/** Assigns a filterFn matched to `meta.filter.type`, so client-side
 *  (non-`manualFiltering`) filtering mirrors the query-adapter semantics in
 *  `docs/rfcs/data-table.md` §5 instead of react-table's `filterFn: "auto"`
 *  default — which resolves purely off the *first row's* runtime value type
 *  (coincidentally right for `text`, wrong for a multi-select array or a
 *  `date`/`date-range`/`number` filter object). Only applied by `DataTable`
 *  when the column doesn't already declare its own `filterFn`. */
export declare const resolveFilterFn: (filter: DataTableColumnFilter) => AnyFilterFn;
/** Whether a column's current filter value should count as "active" for the
 *  header indicator — any non-empty string/array/object. */
export declare const hasActiveFilterValue: (value: unknown) => boolean;
export {};
//# sourceMappingURL=data-table-filter-fns.d.ts.map