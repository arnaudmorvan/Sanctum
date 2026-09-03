import type { StandardSchemaV1 } from "@standard-schema/spec";
import { type ColumnDef, type ColumnFiltersState, type ColumnSizingState, type OnChangeFn, type PaginationState, type Row, type RowSelectionState, type SortingState, type VisibilityState } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
import { type TableSize } from "../table/table";
import "./data-table-meta";
import { DataTablePagination, type DataTablePaginationTranslations } from "./data-table-pagination";
import { type DataTablePlaceholder } from "./data-table-placeholder";
/** Overrides `DataTable`'s own wording — currently just the pagination
 *  footer's, widened to an intersection of more subcomponents' translation
 *  types as the rest of `DataTable`'s arbitrary microcopy is revisited (same
 *  shape `DatePickerTranslations` composes from `CalendarTranslations` +
 *  `TimeRowTranslations`). */
export type DataTableTranslations = DataTablePaginationTranslations;
/** Multi-slot styling — merged with `cn` alongside each part's own classes. */
export type DataTableClassNames = {
    root?: string;
    table?: string;
    head?: string;
    headerRow?: string;
    headerCell?: string;
    body?: string;
    row?: string;
    cell?: string;
    empty?: string;
    error?: string;
    toolbar?: string;
    pagination?: string;
};
export type DataTableProps<TEntity> = WithTestId & {
    /** The current page (or full set) of entities to render. */
    data: TEntity[];
    /** Column defs from `createColumnHelper<TEntity>()` (re-exported from this
     *  subpath — see `docs/rfcs/data-table.md` §4). */
    columns: ColumnDef<TEntity, any>[];
    /** Optional Standard Schema (Zod v4, Valibot, …); infers `TEntity` for
     *  `data`/`columns` end-to-end. Type inference only — see §4. */
    schema?: StandardSchemaV1<unknown, TEntity>;
    /** Stable row id; defaults to react-table's own (the row's index). Required
     *  for selection to survive a page change. */
    getRowId?: (row: TEntity, index: number) => string;
    /** `data-testid` for each row, keyed off the row's resolved id (from
     *  `getRowId`, or react-table's own index-based fallback). Defaults to
     *  `` `row-${id}` `` — override for a different naming scheme. Every cell in
     *  the row automatically derives `` `${rowTestId}-cell-${columnId}` ``, so a
     *  single row testid is enough to target any cell too; no per-cell config. */
    getRowTestId?: (row: TEntity, id: string) => string;
    /** Controlled sort state. */
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    /** Controlled column-filter state — react-table calls this `columnFilters`;
     *  see §5's note on the `filters` rename. */
    filters?: ColumnFiltersState;
    onFiltersChange?: OnChangeFn<ColumnFiltersState>;
    /** Controlled global-search value, flattened to a plain string. */
    globalFilter?: string;
    onGlobalFilterChange?: (value: string) => void;
    /** Controlled pagination state. */
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    /** Controlled row-selection state. */
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    /** Controlled column-visibility state. */
    columnVisibility?: VisibilityState;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    /** Controlled column-width state — keyed by column id, in px. Only ever
     *  changes via user drag when `enableColumnResizing` is set; a column
     *  with no entry here renders at its own `size` (default `150`). */
    columnSizing?: ColumnSizingState;
    onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
    /** Seeds internal state for any omitted (uncontrolled) slice. */
    initialState?: Partial<{
        sorting: SortingState;
        filters: ColumnFiltersState;
        globalFilter: string;
        pagination: PaginationState;
        rowSelection: RowSelectionState;
        columnVisibility: VisibilityState;
        columnSizing: ColumnSizingState;
    }>;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    manualPagination?: boolean;
    /** Shift-click multi-column sort. Off by default (single-column). */
    enableMultiSort?: boolean;
    /** Total server rows; lets react-table derive `pageCount`. */
    rowCount?: number;
    /** Explicit page count when `rowCount` is unknown. `-1` → prev/next-only. */
    pageCount?: number;
    /** Best-effort "next" gate when the total is unknown (e.g. a cursor
     *  source) — see `DataTable.Pagination`. */
    hasNextPage?: boolean;
    /** Page-size choices for the pagination `Select`. Default `[10, 20, 50]`. */
    pageSizeOptions?: number[];
    /** Overrides the pagination footer's wording — English defaults ship in the kit. */
    translations?: DataTableTranslations;
    /** Controls how the pagination footer shows the row range/total — see
     *  `DataTable.Pagination`'s own `paginationMode` doc. Default `"page"`. */
    paginationMode?: "page" | "rows";
    /** Skeleton rows on first load; dims existing rows on a refetch. */
    loading?: boolean;
    /** Replaces the body with a `role="alert"` region. */
    error?: DataTablePlaceholder;
    onRetry?: () => void;
    /** Shown when `!loading && data` produced no rows. Default `DATA_TABLE_DEFAULT_EMPTY`. */
    empty?: DataTablePlaceholder;
    /** Auto-injects a leading checkbox column (header = indeterminate
     *  select-all); mirrors react-table's own table option of the same name. */
    enableRowSelection?: boolean | ((row: Row<TEntity>) => boolean);
    /** /!\ Attention /!\ You shouldn't really use this as it's not great with a11y !
     *
     * Fires unless the click landed on a nested interactive element
     *  (a link, button, menu, checkbox, …), never the row's only affordance. */
    onRowClick?: (row: TEntity) => void;
    /** Rendered via `Table.Title`. */
    title?: ReactNode;
    /** Rendered at the toolbar's trailing edge, after search / column-visibility. */
    toolbarActions?: ReactNode;
    /** Shows the debounced global-search `Input`, bound to `globalFilter`. */
    enableGlobalFilter?: boolean;
    /** Placeholder for the global-search input. */
    globalFilterPlaceholder?: string;
    /** Debounce (ms) before a keystroke reaches `globalFilter`. Default `300`. */
    globalFilterDebounce?: number;
    /** Shows the column-visibility `Menu` (only hideable columns are listed). */
    enableColumnVisibility?: boolean;
    /** Shows a drag handle on each resizable header cell (mouse + touch, via
     *  react-table's built-in `getResizeHandler`). Off by default. A column's
     *  `size` (default width) and `minSize` (drag floor) are plain `ColumnDef`
     *  fields — set them to give the dev's intent; the end user's drag is the
     *  final word once this is on. Set `enableResizing: false` on a column to
     *  exempt it. */
    enableColumnResizing?: boolean;
    /** Show the pagination footer to be able to control pages/page size */
    enablePagination?: boolean;
    /** `"fixed"` (default) gives every column a real, stable width — see the
     *  `enableColumnResizing` note above — so filtering/sorting never reflows
     *  a column. `"auto"` opts back into the browser's own content-fit
     *  `table-layout: auto` sizing (no `table-fixed`, no per-cell width style,
     *  no truncation): columns size themselves from whatever rows are
     *  currently visible, which means they *can* reflow when the visible row
     *  set changes. `enableColumnResizing` has no effect in `"auto"` — there's
     *  no fixed width for a drag to adjust. */
    sizing?: "auto" | "fixed";
    /** `sizing="fixed"` only: stretches the last visible column to absorb any
     *  width left over once every other column has its own size — so the
     *  table always fills its container instead of leaving a gap when column
     *  widths sum to less than the available space. On by default; set
     *  `false` to let the last column keep its own `size`/`minSize` and leave
     *  the gap (matches pre-fill behavior). No resize handle renders on the
     *  last column while this is on — it has no fixed width of its own for a
     *  drag to adjust (the second-to-last column's own handle still works). */
    fillLastColumn?: boolean;
    size?: TableSize;
    striped?: boolean;
    stickyHeader?: boolean;
    stickyFooter?: boolean;
    /** `"scroll"` (default) keeps the `<table>` + horizontal scroll shell;
     *  `"stack"` renders each row as a label:value `Card` below a
     *  container-query breakpoint (`@lg`). See §8, §9 (a11y tradeoff). */
    responsive?: "scroll" | "stack";
    className?: string;
    classNames?: DataTableClassNames;
};
/** Default `empty` copy — exported so tests/docs assert against one source
 *  instead of a hand-copied literal that can drift out of sync. */
export declare const DATA_TABLE_DEFAULT_EMPTY = "No results found";
/**
 * DataTable — a smart, data-driven table over [TanStack
 * Table](https://tanstack.com/table) (headless row/column engine), rendered
 * through the styled `Table` primitive. Define columns once with
 * `createColumnHelper` (re-exported from this subpath for a single type
 * identity), hand it `data` + whichever state slices you want to control, and
 * the rest — sorting, filtering, pagination — round-trips as react-table-native
 * state your app can serialize straight into a query. See
 * `docs/rfcs/data-table.md` for the full contract.
 *
 *   const columns = [
 *     col.accessor("email", { header: "Email" }),
 *     col.accessor("age", { header: "Age", meta: { align: "end" } }),
 *   ]
 *   <DataTable columns={columns} data={users} />
 *
 * A power user who wants total control composes the `Table` parts with their
 * own `useReactTable` instance and skips `DataTable` entirely.
 */
declare function DataTableComponent<TEntity>({ data, columns, getRowId, getRowTestId, testId, sorting: sortingProp, onSortingChange, filters: filtersProp, onFiltersChange, globalFilter: globalFilterProp, onGlobalFilterChange, pagination: paginationProp, onPaginationChange, rowSelection: rowSelectionProp, onRowSelectionChange, columnVisibility: columnVisibilityProp, onColumnVisibilityChange, columnSizing: columnSizingProp, onColumnSizingChange, initialState, manualSorting, manualFiltering, manualPagination, enableMultiSort, rowCount, pageCount, hasNextPage, pageSizeOptions, translations, paginationMode, loading, error, onRetry, empty, enableRowSelection, onRowClick, title, toolbarActions, enableGlobalFilter, globalFilterPlaceholder, globalFilterDebounce, enableColumnVisibility: _enableColumnVisibility, enableColumnResizing, enablePagination, sizing, fillLastColumn, size, striped, stickyHeader, stickyFooter, responsive, className, classNames, }: DataTableProps<TEntity>): import("react").JSX.Element;
export declare const DataTable: typeof DataTableComponent & {
    Pagination: typeof DataTablePagination;
};
export {};
//# sourceMappingURL=data-table.d.ts.map