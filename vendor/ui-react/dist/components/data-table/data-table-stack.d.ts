import { type Table as ReactTableInstance, type Row } from "@tanstack/react-table";
import { type DataTablePlaceholder, type DataTableView } from "./data-table-placeholder";
/**
 * The `responsive="stack"` body: below the container-query breakpoint, each
 * row renders as a `Card` of `label: value` pairs instead of a `<table>` row
 * (RFC §8). Mirrors the table body's error / skeleton / empty / data
 * branches so the two renderings stay in parity — only one is visible at a
 * given container width, but both exist in the DOM.
 *
 * Accessibility tradeoff, made explicit (RFC §9): this drops the row/column
 * semantics screen-reader users rely on. It's opt-in, each card labels its
 * fields from `meta.label`, and `"scroll"` (the default) stays the
 * SR-faithful path.
 */
export declare function DataTableStackedRows<TEntity>({ rows, view, error, refetching, empty, onRowClick, isInteractiveTarget, onRetry, table, className, skeletonRowCount, }: {
    rows: Row<TEntity>[];
    /** Resolved once in `DataTable` (see the `match` there) and passed down so
     *  the `<table>` and stacked-card renderings never disagree on state. */
    view: DataTableView;
    error?: DataTablePlaceholder;
    empty?: DataTablePlaceholder;
    refetching: boolean;
    onRowClick?: (row: TEntity) => void;
    isInteractiveTarget: (target: EventTarget | null) => boolean;
    onRetry?: () => void;
    table: ReactTableInstance<TEntity>;
    className?: string;
    skeletonRowCount: number;
}): import("react").JSX.Element;
/**
 * The stacked layout's substitute for the per-header sort/filter controls and
 * the toolbar's column-visibility menu — all three live inside the `<table>`
 * (hidden below `@lg`, RFC §8) or `Table.Toolbar`, so a `responsive="stack"`
 * table otherwise has no way to sort, filter, or hide columns on a narrow
 * viewport. Opens a bottom `Drawer` (the kit's own mobile bottom-sheet
 * pattern) listing every sortable column, every filterable column, and —
 * when `enableColumnVisibility` is set — every column's visibility toggle.
 */
export declare function DataTableStackOptions<TEntity>({ table, enableColumnVisibility, className, }: {
    table: ReactTableInstance<TEntity>;
    /** Mirrors `DataTable`'s own gate for the toolbar's `DataTableColumnVisibilityMenu`
     *  — passed straight through so both surfaces agree on when column
     *  visibility is editable. */
    enableColumnVisibility?: boolean;
    className?: string;
}): import("react").JSX.Element | null;
//# sourceMappingURL=data-table-stack.d.ts.map