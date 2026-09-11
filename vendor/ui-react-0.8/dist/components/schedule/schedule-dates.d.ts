import type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
import type { FirstDayOfWeek, ScheduleAlign, ScheduleAnyEvent, ScheduleEvent, ScheduleOverlapTarget, ScheduleStaticEvent, ScheduleView } from "./schedule-types";
/**
 * RFC §5 (`docs/rfcs/schedule.md`) date math. Kept in the component folder,
 * not `lib/` — it's keyed on `ScheduleView`, which nothing else in the kit
 * has. All arithmetic goes through `@internationalized/date`'s own `.add()`/
 * `.set()` instance methods on the value `lib/date-value.ts`'s boundary
 * produces — never hand-rolled ms/day math — so DST and month-length edges
 * are the library's problem, not ours.
 */
export type DateRange = {
    start: Date;
    end: Date;
};
type RangeOptions = {
    timeZone: string;
    locale: string;
    /**
     * `DaysView`/`Root`'s public prop is named `align` (not `startOfWeek` —
     * see `ScheduleAlign`'s own doc comment for why), but this option-bag
     * field keeps the lower-level `startOfWeek` name: it's fed into
     * `@internationalized/date`'s own `startOfWeek()` function below for
     * every branch (`"days"`, `"month"`, `"year"` alike), which is still an
     * accurate description of what's being computed here regardless of what
     * the public prop that supplies it is called.
     */
    startOfWeek?: ScheduleAlign;
    /** `"days"` view's window size, in days. Default `7`. */
    visibleDays?: number;
};
type PaginateOptions = {
    timeZone: string;
    visibleDays?: number;
};
/**
 * Narrows `DaysView`/`Root`'s wider `ScheduleAlign` (`FirstDayOfWeek |
 * "relative"`) down to what `@internationalized/date`'s own `startOfWeek`
 * accepts — `"relative"` isn't a real day-of-week, it's Schedule's own
 * "don't snap, start the window at the anchor itself" mode, so it resolves
 * to `undefined` (locale default) here rather than being forwarded. Shared
 * by `getVisibleRange`'s month/year branches (which have no `"relative"`
 * concept of their own) and `schedule.tsx`'s `Root`-to-`MonthView` forwarding.
 */
export declare function resolveWeekStartDay(startOfWeek?: FirstDayOfWeek | "relative"): FirstDayOfWeek | undefined;
/**
 * The visible range for a view anchored at `date`. Month's range is the
 * padded 6-week grid (adjacent-month days are visible and need their events
 * queried too), not the strict calendar-month boundary.
 */
export declare function getVisibleRange(view: ScheduleView, date: Date, options: RangeOptions): DateRange;
/** One step forward/back for the given view — "Today" needs no special case:
 *  it's just `onDateChange?.(now)`, since each view's own `getVisibleRange`
 *  snaps any anchor to that view's natural boundary. */
export declare function paginateDate(view: ScheduleView, date: Date, direction: -1 | 1, options: PaginateOptions): Date;
/** Whether `event` overlaps the calendar day containing `day`, in `timeZone`. */
export declare function eventOccursOnDay(event: {
    start: Date;
    end: Date;
}, day: Date, timeZone: string): boolean;
/** Exclusive-end overlap test — an event ending when another starts doesn't overlap it. */
export declare function rangesOverlap(a: DateRange, b: DateRange): boolean;
/**
 * Overlap-prevention (RFC §12a) — a deliberately separate mechanism from
 * `slotDisabled`, never folded into it (§12's own "occupied and disabled
 * are two different, non-conflated concepts" principle applies here too).
 *
 * Whether `range` overlaps any of `candidates`, excluding `excludeId` — so
 * dragging/resizing an event never rejects against its own pre-gesture self.
 * Assumes `id`s are unique across `data` and `staticEvents` combined; a
 * shared `id` across the two arrays would incorrectly exclude the wrong one
 * when checking against both kinds.
 */
export declare function rangeOverlapsAny(range: DateRange, candidates: {
    id: string;
    start: Date;
    end: Date;
}[], excludeId?: string): boolean;
/** Axis-B candidate-pool selection for overlap-prevention — pure, so it's
 *  independently testable from the gesture wiring that calls it. */
export declare function resolveOverlapCandidates(data: ScheduleEvent[], staticEvents: ScheduleStaticEvent[], against: ScheduleOverlapTarget | "both"): ScheduleAnyEvent[];
/** Which of the two independent commit-time gates rejected a range —
 *  `"disabled"` and `"overlap"` are deliberately never conflated into one
 *  "unavailable" reason (RFC §12's own non-conflation principle), so a
 *  rejection's visual/attribute treatment can tell them apart later even
 *  though both currently animate identically. */
export type RangeCommitResult = {
    ok: true;
} | {
    ok: false;
    reason: "disabled" | "overlap";
};
/**
 * The one place `slotDisabled` and overlap-prevention compose — both are
 * independent gates, checked identically by drag (pointer + keyboard),
 * resize, and create. Exported for the other schedule-internal modules that
 * call it, but deliberately not re-exported from the public barrel
 * (`index.ts`) — internal wiring only, callers build `overlapCandidates`
 * themselves via `resolveOverlapCandidates`.
 */
export declare function checkRangeCommit(range: DateRange, options: {
    slotDisabled?: ScheduleSlotPredicate;
    preventOverlap?: boolean;
    overlapCandidates?: {
        id: string;
        start: Date;
        end: Date;
    }[];
    excludeId?: string;
}): RangeCommitResult;
/** A stable, timeZone-aware per-day key (`YYYY-MM-DD`) — used for React keys
 *  and `data-testid`s across `MonthView`/`YearView`'s day grids.
 *  `Date#toISOString()` would read the instant's *UTC* calendar day, not the
 *  schedule's configured one, so it can't stand in for this near a midnight
 *  boundary outside UTC. */
export declare function dayKey(date: Date, timeZone: string): string;
/**
 * Each calendar day's local-midnight instant from `range.start` up to (not
 * including) `range.end`, stepping via `paginateDate`'s calendar-aware
 * `.add({ days: 1 })` rather than a fixed 86,400,000ms increment — a
 * DST-transition day still lands on the correct next midnight.
 */
export declare function enumerateDays(range: DateRange, timeZone: string): Date[];
/**
 * Each month's local-midnight-of-the-1st instant from `range.start` up to
 * (not including) `range.end` — `YearView`'s 12 mini-months, the same
 * calendar-aware stepping `enumerateDays` uses for days.
 */
export declare function enumerateMonths(range: DateRange, timeZone: string): Date[];
/** Whether `a` and `b` fall in the same calendar month (and year), in `timeZone` —
 *  `MonthView`'s adjacent-month dimming and `YearView`'s blank-cell padding both
 *  key off this rather than comparing native `Date#getMonth()`, which reads the
 *  *host's* local time zone instead of the schedule's configured one. */
export declare function isSameMonth(a: Date, b: Date, timeZone: string): boolean;
/** Whether `day` falls on the same calendar day as `now`, in `timeZone` —
 *  Month/Year's own "today" cell highlight. Compares via `dayKey` (already
 *  used for these views' own React keys) rather than `toZoned`'s
 *  year/month/day fields like `isSameMonth` above, since a plain string
 *  comparison of the two is exactly as timeZone-correct and cheaper than
 *  building two full `ZonedDateTime`s just to compare three numbers.
 *  `now` is threaded in, not read internally via `new Date()` — same
 *  "resolve once per render, stay pure/testable" reasoning as
 *  `ScheduleTimedGrid`'s own `todayRef`. */
export declare function isToday(day: Date, now: Date, timeZone: string): boolean;
/** An event's start–end time range, e.g. "09:00 AM – 10:30 AM" — shared by
 *  the event chip's subtext and the built-in event-details popover, so
 *  there's one definition of how a range reads, not two.
 *
 *  `hour: "2-digit"`, not `"numeric"` — a real SSR hydration mismatch,
 *  verified in a real browser: `"numeric"` leaves zero-padding up to each
 *  runtime's own bundled ICU data, which Node and a browser don't
 *  necessarily agree on for every locale (observed: `fr-FR` renders
 *  "9:00" server-side, "09:00" client-side). `"2-digit"` is the one
 *  spec-guaranteed-deterministic option, unlike `formatScheduleTitle`'s
 *  separator-glyph mismatch below, which normalization can paper over —
 *  padding is real digit content, so it has to be pinned instead. */
export declare function timeRangeLabel(start: Date, end: Date, locale?: string): string;
/**
 * A single clock time, e.g. "09:30" — the now-cursor's own label
 * (`now-cursor-line.tsx`). Deliberately **no `timeZone` option**, unlike
 * every other formatter in this file: `schedule-timed-grid.tsx`'s hour-axis
 * gutter labels are host-local by construction (`hourFormatter`, fed a
 * `new Date(2000, 0, 1, hour)` with no timezone conversion involved), and so
 * is the now-line's own pixel position (`nowIndicatorTop`, `schedule-
 * geometry.ts`, via `minutesFromMidnight`'s `.getHours()`/`.getMinutes()`).
 * Threading `timeZone` through here too would let this label disagree with
 * both of those the moment a consumer sets a `timeZone` other than the
 * host's own — the line would still point at the host-local hour, but the
 * text next to it would claim a different one. `locale` alone is safe to
 * thread: it only affects digit shape/ordering (and a leading zero via
 * `"2-digit"`), never which instant gets read as "now."
 */
export declare function clockTimeLabel(date: Date, locale?: string): string;
/**
 * An all-day event's date (or date range), e.g. "July 15, 2026" or
 * "July 15 – 17, 2026" — the `allDay` counterpart to `timeRangeLabel` above,
 * shown instead of a time-of-day range since an all-day event's `start`/`end`
 * are day *boundaries*, not meaningful clock times (RFC's all-day addendum:
 * `start` = midnight of the first day, `end` = midnight of the day *after*
 * the last day, exclusive).
 *
 * `end.getTime() - 1` — one millisecond before the exclusive boundary — reads
 * back the last real day without any calendar-unit arithmetic: it's always
 * inside that day by construction, so `Intl.DateTimeFormat`'s own `timeZone`
 * resolves the correct calendar date directly. This is display formatting on
 * a fixed instant, not the calendar math (pagination, visible-range) the RFC
 * requires going through `@internationalized/date` for — there's no day
 * arithmetic here to get wrong across a DST boundary.
 *
 * `formatRange` + `.normalize("NFKC")`, not a hand-rolled `${a} – ${b}` join
 * — same real SSR-hydration fix `formatScheduleTitle`'s week title already
 * needs and documents above (a genuine separator-glyph mismatch between
 * Node's and a browser's bundled ICU data).
 */
export declare function allDayRangeLabel(start: Date, end: Date, timeZone: string, locale?: string): string;
/**
 * The toolbar title for a view anchored at `date` — RFC §14. Native
 * `Intl.DateTimeFormat` throughout, exactly like this file's own
 * `timeRangeLabel`: this is display formatting, not calendar arithmetic, so
 * it doesn't need the `@internationalized/date` boundary the way pagination
 * math does.
 *
 * Week uses `formatRange` for a locale-correct condensed span ("Aug 25 – 31,
 * 2026" vs. "Aug 25 – Sep 1, 2026" across a month boundary) — CLDR's actual
 * per-locale range phrasing, which a hand-rolled `${start} – ${end}` join
 * can't reproduce for every locale (some don't just dash-join two dates).
 *
 * `.normalize("NFKC")` on the result is load-bearing, not defensive
 * copy-paste: verified in a real browser that `formatRange` produces a
 * genuine SSR hydration mismatch otherwise — Node's bundled ICU and a
 * browser's don't necessarily agree on the exact separator glyph for the
 * identical locale/options (observed: a plain space + en dash vs. a *thin*
 * space + en dash), so the server- and client-rendered text differ byte-
 * for-byte while looking identical. NFKC's compatibility decomposition maps
 * typographic space variants (thin space, figure space, …) back to a plain
 * space, which converges exactly that divergence; NFC does not (canonical
 * equivalence doesn't cover compatibility variants like space width).
 */
export declare function formatScheduleTitle(view: ScheduleView, date: Date, options: {
    timeZone: string;
    locale?: string;
    /** Same low-level-name-kept rationale as `RangeOptions.startOfWeek`
     *  above — this is what actually gets forwarded into `getVisibleRange`'s
     *  own field of the same name below, not the public `align` prop name. */
    startOfWeek?: ScheduleAlign;
    visibleDays?: number;
}): string;
/** A single clock-reading, e.g. "09:00" (or "09:00 AM" — a locale's own
 *  12h/24h convention, same as `timeRangeLabel`, is never overridden here)
 *  — `Schedule.NextUp`'s per-slot time label. Reuses `timeRangeLabel`'s own
 *  `hour: "2-digit"` choice (not "numeric") for the same documented
 *  Node/browser ICU zero-padding hydration-mismatch reason above. Unlike
 *  `timeRangeLabel`, this *does* take `timeZone`: `Schedule.NextUp` exposes
 *  its own `timeZone` prop the same way every other view does, and a bare
 *  `Intl.DateTimeFormat` call with no `timeZone` silently falls back to the
 *  host runtime's local zone instead — invisible in a browser whose local
 *  zone happens to match, but wrong the moment it doesn't. */
export declare function timeLabel(date: Date, timeZone: string, locale?: string): string;
/**
 * Compact "1h 30m" / "45m" duration — `Schedule.NextUp`'s per-event badge,
 * shown for every event so same-start-time events (stacked under one shared
 * time label) can still be told apart by how long each one runs. Composed
 * from `Intl.NumberFormat({ style: "unit" })`, the same pattern
 * `time-input/hour-cycle.ts`'s `timeUnitLabels` already uses — not
 * `Intl.DurationFormat`: there's no existing usage of it anywhere in the
 * kit, and this file already carries two documented SSR-hydration fixes
 * (`.normalize("NFKC")` above, `"2-digit"` over `"numeric"`) from trusting
 * newer/less-uniform ICU behavior across runtimes — composing from the
 * already-proven `NumberFormat` unit style avoids repeating that exact risk
 * for a still-green API.
 */
export declare function durationLabel(start: Date, end: Date, locale?: string): string;
/**
 * `Schedule.NextUp`'s day-group label — "Today"/"Tomorrow" via
 * `Intl.RelativeTimeFormat`, the same class of Intl-derivable string as this
 * file's own weekday/month names (`ScheduleTranslations`' doc comment:
 * "Weekday/month names… are Intl-derivable… and deliberately have no key"),
 * so this needs no translation key either — it falls back to a numeric
 * phrase for any locale/unit combination without a dedicated word. Anything
 * further out than tomorrow gets a short weekday+day+month format (e.g.
 * "Fri, 28 Aug"; token order is CLDR's own per locale — never hand-reorder).
 * Compares `dayKey` strings directly rather than computing a numeric
 * day-offset, since the branch itself already tells us which literal offset
 * (`0`/`1`) applies.
 */
export declare function resolveNextUpDayLabel(date: Date, now: Date, options: {
    timeZone: string;
    locale?: string;
}): string;
export {};
//# sourceMappingURL=schedule-dates.d.ts.map