import { type CalendarTranslations } from "../../calendar/calendar";
import { type DatePickerPresetId, type DatePreset } from "../../date-picker/date-picker";
import type { TimeRowTranslations } from "../../time-input/time-row";
import type { AnyColumn, DateComparisonOp } from "./utils";
/** One unified `translations` prop, mirroring `DatePicker`'s own — Ark's own accessible names,
 *  the `presets={true}` default labels, and this filter's own From/To time + Clear microcopy.
 *  English defaults throughout; unset keys keep their built-in text. */
export type DateFilterTranslations = Partial<CalendarTranslations> & TimeRowTranslations & {
    /** Default `"From time"`. */
    fromTime?: string;
    /** Default `"To time"`. */
    toTime?: string;
    /** Default `"Clear"`. */
    clear?: string;
    presets?: Partial<Record<DatePickerPresetId, string>>;
};
/** `eq`/`gt`/`gte`/`lt`/`lte` are settable programmatically via controlled
 *  `filters` (matching the backend's operator vocabulary); the built-in
 *  `DateFilter` UI only ever derives `gte`/`between` from a calendar click
 *  (see `DateFilterPopover`'s doc comment on why `lte`-only isn't reachable
 *  through it). Bounds are required-but-nullable, not optional —
 *  `useUncontrolled`'s contract (see `lib/use-uncontrolled.ts`) treats a bare
 *  `undefined` value as "go uncontrolled," so "this bound isn't filled in"
 *  must be an explicit `null`, never an absent key. */
export type DateValue = {
    op: DateComparisonOp;
    date: string | null;
} | {
    op: "between";
    from: string | null;
    to: string | null;
};
export type DateRangeValue = {
    from: string | null;
    to: string | null;
};
export declare const DateFilter: ({ column, withTime, presets, timeZone, translations, onClose, }: {
    column: AnyColumn;
    withTime?: boolean;
    presets?: DatePreset[] | boolean;
    timeZone?: string;
    translations?: DateFilterTranslations;
    onClose?: () => void;
}) => import("react").JSX.Element;
export declare const DateRangeFilter: ({ column, withTime, presets, timeZone, translations, onClose, }: {
    column: AnyColumn;
    withTime?: boolean;
    presets?: DatePreset[] | boolean;
    timeZone?: string;
    translations?: DateFilterTranslations;
    onClose?: () => void;
}) => import("react").JSX.Element;
//# sourceMappingURL=data-table-date-filter.d.ts.map