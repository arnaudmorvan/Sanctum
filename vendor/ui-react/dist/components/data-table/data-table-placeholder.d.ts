import type { ReactNode } from "react";
type Placeholder = {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
};
export type DataTablePlaceholder = ReactNode | Placeholder;
/** The body's resolved view — `DataTable` and `DataTableStackedRows` both
 *  branch on this single value (see the `match({ error, showSkeleton, items
 *  })` in `data-table.tsx`) so the `<table>` and stacked-card renderings can
 *  never disagree on which state is showing. */
export type DataTableView = "error" | "loading" | "empty" | "items";
export declare function RenderPlaceholder({ node, defaultActions, }: {
    node: DataTablePlaceholder;
    defaultActions?: ReactNode;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=data-table-placeholder.d.ts.map