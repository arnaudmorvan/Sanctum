import { type Header } from "@tanstack/react-table";
import { type ReactNode } from "react";
import type { DataTableHeaderMode } from "./data-table-meta";
export declare const SORT_LOOKUP: {
    readonly asc: {
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
        readonly label: "ascending";
    };
    readonly desc: {
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
        readonly label: "descending";
    };
    readonly none: {
        readonly icon: import("react").ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
        readonly label: "none";
    };
};
/** A column's label as plain text — `meta.label`, else its string `header`,
 *  else its id. Used by the filter trigger's `aria-label` and the Toolbar's
 *  column-visibility menu (both `Header.column` and a plain `Column` share
 *  this `columnDef`/`id` shape). */
export declare const columnLabel: (column: {
    columnDef: {
        header?: unknown;
        meta?: {
            label?: string;
        };
    };
    id: string;
}) => string;
/** A column's rendered header — the same `flexRender(columnDef.header, ...)`
 *  `DataTableHeaderCell` shows in the `<table>` head, so a custom (non-string)
 *  header renders identically wherever a column's header needs to appear
 *  outside the head itself (e.g. the stacked-card field label). `mode` rides
 *  along on the render context (`HeaderContext.mode`, augmented in
 *  `data-table-meta.ts`) so a custom header can tell which surface it's
 *  rendering into. */
export declare const renderColumnHeader: <TEntity>(header: Header<TEntity, unknown>, mode: DataTableHeaderMode) => ReactNode | import("react").JSX.Element;
/**
 * Renders a header cell's interactive content: the sort-toggle button (when
 * `column.getCanSort()`) and the per-column filter popover (when
 * `meta.filter` is set) — see `docs/rfcs/data-table.md` §6. `aria-sort` lives
 * on the enclosing `<th>` (set by the caller), not in here.
 */
export declare function DataTableHeaderCell<TEntity>({ header, truncate, }: {
    header: Header<TEntity, unknown>;
    /** Ellipsize the label instead of letting it grow the column — off under
     *  `sizing="auto"`, where a column's width already tracks its content, so
     *  there's nothing to truncate against. Default `true`. */
    truncate?: boolean;
}): import("react").JSX.Element;
/**
 * A drag handle anchored to a header cell's trailing edge — `position:
 * relative` on the enclosing `<th>` (set by the caller) makes it possible.
 * `getResizeHandler()` is react-table's own combined mouse+touch handler, so
 * dragging and releasing are already handled; the only custom behavior here
 * is the `ArrowLeft`/`ArrowRight` keyboard nudge, since a pointer-only
 * control has no keyboard equivalent otherwise. Rendered by the caller only
 * when `header.column.getCanResize()`.
 */
export declare function DataTableColumnResizeHandle<TEntity>({ header, }: {
    header: Header<TEntity, unknown>;
}): import("react").JSX.Element;
//# sourceMappingURL=data-table-header-cell.d.ts.map