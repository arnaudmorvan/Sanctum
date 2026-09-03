import type { Table as ReactTableInstance } from "@tanstack/react-table";
import type { ReactNode } from "react";
export type DataTablePaginationTranslations = {
    /** The row range, and (when the total is known) the total row count. In
     *  `paginationMode="page"` (the default) it's the content of a `Tooltip`
     *  revealed on hover/focus of the page number; in `paginationMode="rows"`
     *  the two swap — this is always visible, and the page number moves into
     *  the tooltip instead. */
    items?: (infos: {
        hits: number;
        from: number;
        to: number;
        totalKnown: boolean;
    }) => ReactNode;
    /** Label for the page-size `Select` — rendered both as its (visually
     *  hidden) accessible name and as the visible text beside it. */
    rows?: ReactNode;
    /** Accessible name for the previous-page button. */
    previousPage?: string;
    /** Accessible name for the next-page button. */
    nextPage?: string;
};
export type DataTablePaginationProps<TEntity> = {
    table: ReactTableInstance<TEntity>;
    /** Page-size choices for the `Select`. Default `[10, 20, 50]`. */
    pageSizeOptions?: number[];
    /** Best-effort "next" gate when the total row count is unknown (e.g. a
     *  cursor-backed source) — overrides the row-count heuristic below. */
    hasNextPage?: boolean;
    /** Overrides the footer's wording — English defaults ship in the kit. */
    translations?: DataTablePaginationTranslations;
    /** `"page"` (default) shows the current page number, with the row
     *  range/total in a `Tooltip` on hover/focus. `"rows"` mirrors that: the
     *  row range/total is always visible (and announced via `role="status"`
     *  as it changes), with the page number moved into the tooltip instead. */
    paginationMode?: "page" | "rows";
    className?: string;
};
/**
 * `DataTable`'s pagination footer — a page-size `Select`, prev/next
 * `ActionIcon`s, and a current-page indicator. By default
 * (`paginationMode="page"`) it shows the page number, with the row
 * range/total in a `Tooltip` on hover/focus; `paginationMode="rows"` mirrors
 * that — the row range/total is always visible instead, with the page
 * number moved into the tooltip. `DataTable` renders one automatically;
 * exported as `DataTable.Pagination` for a power user composing the `Table`
 * parts with their own `useReactTable` instance (RFC §7). When
 * `table.getPageCount()` is `-1` (unknown total — `rowCount` omitted, or an
 * explicit `pageCount={-1}`), it degrades to prev/next-only: no last-page
 * jump. "Next" is then gated by `hasNextPage` when given, else by whether
 * the current page came back short of a full `pageSize` (the best-effort
 * signal that there's no next page).
 */
export declare function DataTablePagination<TEntity>({ table, pageSizeOptions, hasNextPage, className, translations: translationsProp, paginationMode, }: DataTablePaginationProps<TEntity>): import("react").JSX.Element;
//# sourceMappingURL=data-table-pagination.d.ts.map