import type { RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { Align } from "../../lib/align";
import type { RenderItem, SelectData } from "../../lib/select-data";
import type { DatePreset } from "../date-picker/date-picker";
import type { DateFilterTranslations } from "./data-table-filter/data-table-date-filter";
/**
 * Per-column filter config, keyed by `meta.filter`'s discriminant. Each shape
 * drives both the header filter control (`DataTable.HeaderCell`) and the
 * `filterType` lookup a consumer's query adapter reads to pick the right
 * operator (`text` → `like`, `select` → `eq`/`in`, …) — see the RFC's
 * `docs/rfcs/data-table.md` §5 `toApiQuery` recipe.
 */
export type DataTableColumnFilter = {
    type: "text";
    placeholder?: string;
    debounce?: number;
}
/** `renderItem` mirrors `ComboboxList`/`MultiComboboxList`'s own escape
 *  hatch (RFC pattern: option rendering is never more special-cased than
 *  the picker it wraps) — not generic over `options`'s literal shape here
 *  (module-augmented `ColumnMeta` isn't generic either), so `payload`
 *  arrives as `unknown`; narrow it yourself if you pass one through. */
 | {
    type: "select";
    options: SelectData;
    multiple?: boolean;
    renderItem?: RenderItem<SelectData>;
}
/** A value + comparison operator (equals / greater than / at least / less
 *  than / at most / between) — `min`/`max` are the input's clamp bounds,
 *  independent of the picked operator/value. */
 | {
    type: "number";
    min?: number;
    max?: number;
}
/** A date + comparison operator (on / after / on or after / before / on or before), edited via
 *  the same calendar + presets(+ time) popover `DatePicker` itself uses. `presets`/`timeZone`
 *  mirror `DatePicker`'s own props — `presets: true` for a mode-appropriate default set, or a
 *  custom array; `timeZone` overrides the local zone the `Date ↔ DateValue` boundary uses,
 *  same default (`getLocalTimeZone()`) as `DatePicker`/`Calendar`. */
 | {
    type: "date";
    withTime?: boolean;
    presets?: DatePreset[] | boolean;
    timeZone?: string;
    translations?: DateFilterTranslations;
}
/** In-range only (`gte` + `lte`) — out-of-range filtering is a later addition. */
 | {
    type: "date-range";
    withTime?: boolean;
    presets?: DatePreset[] | boolean;
    timeZone?: string;
    translations?: DateFilterTranslations;
};
/** Which surface a header is currently rendering into — the `<table>` head
 *  vs. a `responsive="stack"` card's field label (RFC §8) — so a custom
 *  `header` render function can tell the two apart (e.g. to drop an icon
 *  that only makes sense in one). */
export type DataTableHeaderMode = "table" | "stack";
/**
 * Augments react-table's own `ColumnMeta` extension point (module
 * augmentation, per its documented pattern) so filter/sort/responsive config
 * rides on the column def a consumer already writes — no parallel
 * `columnsConfig` map to keep in sync. Also augments `HeaderContext` with
 * `mode` (see `DataTableHeaderMode`) — optional because it's only ever set by
 * `renderColumnHeader`, not by react-table's own `header.getContext()`.
 */
declare module "@tanstack/react-table" {
    interface HeaderContext<TData, TValue> {
        mode?: DataTableHeaderMode;
    }
    interface ColumnMeta<TData extends RowData, TValue> {
        /** Enables a filter affordance on the header; picks its control + value shape. */
        filter?: DataTableColumnFilter;
        /** Cell + header text alignment. Default `"start"`. */
        align?: Align;
        /** Label used by the column-visibility menu / `responsive="stack"` cards
         *  when `header` isn't plain text. Falls back to a string `header`. */
        label?: string;
        /** v1+: pin the column during horizontal scroll (ships with column-pin work). */
        sticky?: boolean;
        /** v1+: higher = kept visible longer as width shrinks (priority-based hiding). */
        priority?: number;
        /** Excludes the column entirely from the column-visibility menu/drawer
         *  (`enableColumnVisibility`) — independent of `enableHiding`, which still
         *  lists a column but disables its toggle. For a utility/action column
         *  (e.g. a trailing "view" button) that was never a real visibility choice. */
        hideFromMenu?: boolean;
        /** Placeholder rendered in this column's cell for every loading-skeleton
         *  row, instead of the default self-sizing bar. Needed when the real
         *  cell's height doesn't come from line-height at all (an image, an
         *  `ActionIcon`, …) — a generic bar can't predict that footprint, so
         *  the row still visibly resizes once real data replaces the skeleton.
         *  A fixed node, not a `(row) => ReactNode` callback: during loading
         *  there's no `TEntity` to hand it, just
         *  `Array.from({ length: skeletonRowCount })` counters. */
        skeleton?: ReactNode;
    }
}
//# sourceMappingURL=data-table-meta.d.ts.map