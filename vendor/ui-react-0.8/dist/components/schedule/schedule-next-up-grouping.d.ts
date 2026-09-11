import type { ScheduleAnyEvent } from "./schedule-types";
/**
 * `Schedule.NextUp`'s filter/group pipeline — pure, no React, the same "small
 * composed functions" shape `schedule-layout.ts` already uses for its own
 * column-clustering pipeline (a different, heavier problem: full
 * interval-overlap clustering for side-by-side column packing, vs. the much
 * simpler "bucket by identical `start`" grouping below).
 */
/** An event stays visible until `pastEventsOffset` minutes after its own
 *  `end` — an in-progress event (`start <= now < end`) is never excluded by
 *  this alone, only `end` (plus the grace window) decides. */
export declare function filterUpcomingEvents<P>(events: ScheduleAnyEvent<P>[], now: Date, pastEventsOffset: number): ScheduleAnyEvent<P>[];
export type NextUpTimeSlot<P = unknown> = {
    start: Date;
    events: ScheduleAnyEvent<P>[];
};
export type NextUpDayGroup<P = unknown> = {
    key: string;
    date: Date;
    slots: NextUpTimeSlot<P>[];
};
/**
 * Single pass over a chronologically-sorted list — a day's events are always
 * contiguous in that order, so no separate grouping pass is needed: open a
 * new day group whenever `dayKey` changes, a new slot whenever the exact
 * `start` timestamp changes (this is what stacks same-start-time events
 * together). `group.date` borrows the first event's own `start` as the
 * representative instant for day-label formatting.
 */
export declare function groupUpcomingEvents<P>(events: ScheduleAnyEvent<P>[], timeZone: string): NextUpDayGroup<P>[];
/** Filters then groups — the pipeline `Schedule.NextUp` renders from on
 *  every tick of its live clock. */
export declare function buildNextUpAgenda<P>(events: ScheduleAnyEvent<P>[], now: Date, options: {
    pastEventsOffset: number;
    timeZone: string;
}): NextUpDayGroup<P>[];
//# sourceMappingURL=schedule-next-up-grouping.d.ts.map