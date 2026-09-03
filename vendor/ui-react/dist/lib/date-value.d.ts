import { type DateValue } from "@internationalized/date";
/**
 * The `Date ↔ DateValue` boundary (RFC §4/§13, `docs/rfcs/date-picker.md`) — the one place a
 * native `Date` *instant* converts to/from Ark's wall-calendar `DateValue`
 * (`CalendarDate | CalendarDateTime | ZonedDateTime`). `Calendar` and (later) `DatePicker` both
 * funnel every conversion through here, so there is exactly one audited crossing point instead
 * of one per component.
 *
 * `@internationalized/date` internals are deliberately NOT re-exported from this module — keep
 * the public surface to the boundary functions below (PR3's `date-picker/index.ts` re-exports
 * exactly one unrelated helper, `getLocalTimeZone`, directly from the library itself).
 */
/**
 * A range value: `{ start, end }`, each independently nullable (a real "unset" endpoint, never
 * `undefined`). Mirrors `Calendar`/`DatePicker`'s `range` value shape.
 */
export type DateRangeValue = {
    start: Date | null;
    end: Date | null;
};
/** Convert a native `Date` instant to Ark's `DateValue`, interpreted in `timeZone`. */
export declare function dateToCalendarValue(date: Date, timeZone: string): DateValue;
/**
 * Convert Ark's `DateValue` back to a native `Date`. A `ZonedDateTime` (what `dateToCalendarValue`
 * produces) already carries its own zone/offset — its `toDate()` takes no argument and would
 * silently ignore a mismatched `timeZone` here — while a plain `CalendarDate`/`CalendarDateTime`
 * (what the day-grid's own calendar arithmetic produces) needs one to resolve to an instant, so
 * branch on which shape we actually got rather than assuming the caller's `dateToCalendarValue`
 * origin.
 */
export declare function calendarValueToDate(value: DateValue, timeZone: string): Date;
/**
 * Wrap a public value into Ark's array contract. `undefined` stays uncontrolled (Ark's own
 * default takes over); `null` — or an all-null range — clears to `[]`; a single `Date` becomes a
 * one-element array; a range pushes only its defined ends, so a mid-selection range
 * (`{ start, end: null }`) naturally comes out length 1.
 */
export declare function toArkValues(value: Date | DateRangeValue | null | undefined, timeZone: string): DateValue[] | undefined;
/**
 * The inverse of `toArkValues` — Ark's `value` array back to the public shape. `range` picks
 * which shape to produce; a length-1 array under `range` is a mid-selection (`start` set,
 * `end` still `null`), not an error.
 */
export declare function fromArkValues(values: DateValue[], range: boolean, timeZone: string): Date | DateRangeValue | null;
//# sourceMappingURL=date-value.d.ts.map