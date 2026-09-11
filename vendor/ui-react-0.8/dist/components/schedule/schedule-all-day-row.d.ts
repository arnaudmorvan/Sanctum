import type { ReactNode } from "react";
import type { ScheduleAnyEvent, ScheduleClassNames, ScheduleTranslations } from "./schedule-types";
export type AllDayBar<P = unknown> = {
    event: ScheduleAnyEvent<P>;
    /** 0-based lane (row) index within the all-day area. */
    lane: number;
    /** 0-based day-column index, inclusive. */
    colStart: number;
    /** 0-based day-column index, exclusive. */
    colEnd: number;
};
export type AllDayLayout<P = unknown> = {
    /** Total rows to render, already capped at `maxLanes` — real event lanes
     *  plus, if anything overflowed, one shared row for it (never both
     *  simultaneously add up to *more* than `maxLanes`: `maxAllDayRows={2}`
     *  means at most 2 rows, full stop, whether that's 2 events, 1 event + a
     *  "+N", or just a "+N" on its own). Never padded up to `maxLanes` when
     *  fewer rows are actually needed — this is one shared row structure
     *  spanning every day column, not an independent per-cell layout like
     *  Month's, so there's no "different cells need different heights"
     *  problem to pad against. */
    rowCount: number;
    bars: AllDayBar<P>[];
    /** Day-column index → the events hidden for that specific day. */
    overflowByDay: Map<number, ScheduleAnyEvent<P>[]>;
};
/**
 * Pure, no React — `days` is the visible window's own day list (already
 * timeZone-correct, from `enumerateDays`); `events` must already be filtered
 * to `allDay && rangesOverlap(event, visibleWindow)` by the caller, the same
 * "caller pre-clips" contract `layoutEventColumns` documents for its own
 * per-day-column input.
 *
 * **Sweep order: longest event first (by its own true, unclipped duration —
 * not the window-clipped span), ties broken by earlier start, then original
 * array order.** The longest event lands in lane 0 (rendered at the row's
 * top); once enough lanes are claimed by longer events, a later (shorter)
 * event overflows instead. Ranking by *true* duration, not the clipped one,
 * keeps an event's lane stable as the visible window pages forward/back — a
 * 10-day conference doesn't jump lanes just because only a sliver of it is
 * in view this week.
 *
 * This is *not* simply "sort differently" applied to
 * `layoutEventColumnsCapped`'s own sweep — it deliberately reimplements the
 * greedy free-lane bookkeeping locally, because that shared function's sort
 * is baked into its own private sweep and changing it would also change the
 * timed grid's unrelated time-axis column packing. Reimplementing here is
 * still provably a *correct* interval-graph coloring, not just a priority
 * hack: the free-a-lane check compares real `start`/`end` timestamps, not
 * sweep-processing order, so two events that genuinely overlap in time can
 * never land in the same lane regardless of which one gets swept first —
 * sweep order only ever decides *which* lane (and therefore whether an
 * event survives the cap), never whether an assignment is valid.
 *
 * **`maxLanes` bounds the *total* row count, overflow row included.**
 * `sweepLanes` runs once at `maxLanes`; if that leaves anything overflowed,
 * it re-runs at `maxLanes - 1` instead, so the freed-up row can carry a
 * shared overflow indicator without pushing the grand total past `maxLanes`
 * — `maxAllDayRows={2}` always means at most 2 rows, never 2 real lanes
 * *plus* a 3rd for "+N".
 */
export declare function computeAllDayLayout<P = unknown>(days: Date[], events: ScheduleAnyEvent<P>[], maxLanes: number, timeZone: string): AllDayLayout<P>;
export type ScheduleAllDayRowProps<P = unknown> = {
    days: Date[];
    /** Pre-filtered by the caller: `allDay && rangesOverlap(event, visibleWindow)`. */
    events: ScheduleAnyEvent<P>[];
    maxAllDayRows: number;
    /** Which row of the *caller's* grid lane 0 maps to — this component places
     *  its cells directly into that shared grid (via `gridRow`/`gridColumn`
     *  on each child), rather than building a nested grid of its own, so it
     *  needs to know where its own row-space actually starts. `ScheduleTimedGrid`
     *  passes `2`, since its header occupies row 1. */
    rowOffset: number;
    timeZone: string;
    onEventClick?: (event: ScheduleAnyEvent<P>) => void;
    onOverflowClick?: (events: ScheduleAnyEvent<P>[]) => void;
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
    locale?: string;
    translations: Required<ScheduleTranslations>;
    classNames?: ScheduleClassNames;
};
/** Renders nothing when there's no all-day event in the visible window —
 *  schedules with none pay no visual cost, and the caller's grid (which has
 *  no explicit row count of its own) simply grows no implicit rows. */
export declare function ScheduleAllDayRow<P = unknown>({ days, events, maxAllDayRows, rowOffset, timeZone, onEventClick, onOverflowClick, renderEventDetails, locale, translations, classNames, }: ScheduleAllDayRowProps<P>): import("react").JSX.Element | null;
//# sourceMappingURL=schedule-all-day-row.d.ts.map