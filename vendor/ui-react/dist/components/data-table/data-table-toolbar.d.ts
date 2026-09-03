import type { Table as ReactTableInstance } from "@tanstack/react-table";
/** The global-search box in `Table.Toolbar` — debounces the same way as a
 *  `text` column filter (RFC §6) so a keystroke storm never reaches
 *  `globalFilter` / the `queryKey`. */
export declare function DataTableGlobalFilter({ value, onChange, placeholder, debounce, }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounce?: number;
}): import("react").JSX.Element;
/** Menu of checkbox items toggling each column's visibility. `meta.hideFromMenu`
 *  removes a column from this list entirely (e.g. a utility/action column
 *  that was never a real visibility choice); `enableHiding: false` is a
 *  separate, independent control — that column still appears here, just
 *  checked and disabled. */
export declare function DataTableColumnVisibilityMenu<TEntity>({ table, className, }: {
    table: ReactTableInstance<TEntity>;
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=data-table-toolbar.d.ts.map