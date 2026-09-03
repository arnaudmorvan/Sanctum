import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * All table styling rides on the container as descendant-selector classes, so
 * the part components stay dumb and `size` / `striped` / sticky can live on
 * `<Table>` (the root) without React context — keeping the whole thing a pure
 * Server Component. Every variant value is a static class string so Tailwind
 * v4's scanner keeps it.
 *
 * The `<table>` uses `border-collapse: separate` (see `TableContent`): collapsed
 * borders detach from sticky `<thead>` / `<tfoot>` while scrolling, so the
 * header/footer separators are cell borders (`thead th` bottom, `tfoot td/th`
 * top) that stay put when pinned.
 */
declare const tableVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    striped?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** `Table`'s density scale — the kit's canonical `Size` (xs–xl). */
export type TableSize = Size;
export type TableProps = HTMLArkProps<"div"> & VariantProps<typeof tableVariants> & WithTestId & {
    /** Pins the header row during vertical scroll. Needs a bounded height —
     * set `max-h-*` on `Table` or `Table.Content`. */
    stickyHeader?: boolean;
    /** Pins a `Table.Foot` row (e.g. totals) to the bottom during vertical
     * scroll. Same bounded-height requirement as `stickyHeader`. */
    stickyFooter?: boolean;
};
export type TableToolbarProps = HTMLArkProps<"div"> & WithTestId;
export type TableTitleProps = HTMLArkProps<"h3"> & WithTestId;
export type TableContentProps = HTMLArkProps<"table"> & WithTestId & {
    /** Style the inner `<table>` element; `className` targets the scroll region. */
    classNames?: {
        table?: string;
    };
};
export type TableHeadProps = HTMLArkProps<"thead"> & WithTestId;
export type TableBodyProps = HTMLArkProps<"tbody"> & WithTestId;
export type TableFootProps = HTMLArkProps<"tfoot"> & WithTestId;
export type TableRowProps = HTMLArkProps<"tr"> & WithTestId;
export type TableHeaderCellProps = HTMLArkProps<"th"> & WithTestId;
export type TableCellProps = HTMLArkProps<"td"> & WithTestId;
export declare const Table: (({ className, size, striped, stickyHeader, stickyFooter, testId, ...rest }: TableProps) => import("react").JSX.Element) & {
    Toolbar: ({ className, testId, ...rest }: TableToolbarProps) => import("react").JSX.Element;
    Title: ({ className, testId, ...rest }: TableTitleProps) => import("react").JSX.Element;
    Content: ({ className, classNames, testId, ...rest }: TableContentProps) => import("react").JSX.Element;
    Head: ({ className, testId, ...rest }: TableHeadProps) => import("react").JSX.Element;
    Body: ({ className, testId, ...rest }: TableBodyProps) => import("react").JSX.Element;
    Foot: ({ className, testId, ...rest }: TableFootProps) => import("react").JSX.Element;
    Row: ({ className, testId, ...rest }: TableRowProps) => import("react").JSX.Element;
    HeaderCell: ({ className, scope, testId, ...rest }: TableHeaderCellProps) => import("react").JSX.Element;
    Cell: ({ className, testId, ...rest }: TableCellProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=table.d.ts.map