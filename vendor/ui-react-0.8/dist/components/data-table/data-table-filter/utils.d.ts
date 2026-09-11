import type { Column } from "@tanstack/react-table";
/** These controls only ever call `getFilterValue`/`setFilterValue`, which
 *  don't depend on the column's row/value types — `any` mirrors react-table's
 *  own convention for a value-type-agnostic `Column` (see `ColumnDef<T, any>`
 *  in `data-table.tsx`). */
export type AnyColumn = Column<any, unknown>;
export type NumberComparisonOp = "eq" | "gt" | "gte" | "lt" | "lte";
export type NumberOp = NumberComparisonOp | "between";
/** `eq`/`gt`/`gte`/`lt`/`lte` are settable programmatically via controlled
 *  `filters` (matching the backend's operator vocabulary); the built-in
 *  `NumberFilter` UI only ever derives `gte`/`lte`/`between` from which of its
 *  two (min/max) inputs are filled. Bounds are required-but-nullable, not
 *  optional — `useUncontrolled`'s contract (see `lib/use-uncontrolled.ts`)
 *  treats a bare `undefined` value as "go uncontrolled," so "this bound isn't
 *  filled in" must be an explicit `null`, never an absent key, anywhere it
 *  can flow into a controlled `NumberInput`'s `value` prop. */
export type NumberFilterValue = {
    op: NumberComparisonOp;
    value: number | null;
} | {
    op: "between";
    min: number | null;
    max: number | null;
};
export declare const NUMBER_OP_COMPARE: Record<NumberComparisonOp, (left: number, right: number) => boolean>;
/** `column.getFilterValue()` is `undefined` (never `null`) at runtime when no
 *  filter is active — no entry exists for this column id in react-table's
 *  `columnFilters` array. */
export declare const getNumberFilterValue: (column: AnyColumn) => NumberFilterValue | undefined;
/** `undefined` clears the filter — react-table drops the column's entry from
 *  `columnFilters` entirely, matching `TextFilter`/`SelectFilter`'s own
 *  clear-to-`undefined` convention in this same module. */
export declare const setNumberFilterValue: (column: AnyColumn, value: NumberFilterValue | undefined) => void;
export type DateComparisonOp = "eq" | "gt" | "gte" | "lt" | "lte";
/** Parses a row's raw cell value (or a filter's date-input string) into a
 *  comparable timestamp — handles `Date` objects, ISO strings, and anything
 *  else `Date` itself accepts. `null` when it doesn't parse. */
export declare const parseDateValue: (value: unknown) => number | null;
export declare const DAY_MS: number;
/** Date-only (`withTime` off) compares against the whole calendar day instead
 *  of an exact instant, so `eq` ("on") matches any row timestamped that day
 *  and `gt`/`gte`/`lt`/`lte` compare against its start/end boundaries. */
export declare const dateOpMatches: (op: DateComparisonOp, rowTime: number, filterTime: number, withTime?: boolean) => boolean;
//# sourceMappingURL=utils.d.ts.map