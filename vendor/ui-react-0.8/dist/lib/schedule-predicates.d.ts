export type ScheduleSlotPredicate = (range: {
    start: Date;
    end: Date;
}) => boolean;
/** Disable any slot that isn't *entirely* within `[startHour, endHour)` —
 *  both `start` and `end` are checked, not just `start`, so an event can't
 *  be dragged/resized so its end crosses outside the allowed window while
 *  its start stays put. `end` is checked with a strict `>` against
 *  `endHour:00` (not `>=`): a slot ending exactly at the boundary doesn't
 *  overlap the disabled region, the same exclusive-end convention
 *  `rangesOverlap` uses everywhere else in Schedule. Multi-day/overnight
 *  spans (an `end` that lands on a later calendar day than `start`) aren't
 *  specially handled — same accepted limitation as cross-day drag. */
export declare const disableOutsideHours: (startHour: number, endHour: number) => ScheduleSlotPredicate;
/** Disable any slot starting before the current moment — for restricting
 *  event creation/placement to the future. Reads the live clock on every
 *  call rather than once at factory time, so the boundary keeps up as time
 *  passes instead of going stale for a predicate created once and reused;
 *  pass `now` to pin it for tests/Storybook. */
export declare const disablePast: (now?: Date) => ScheduleSlotPredicate;
/** Disable every slot whose start falls on a Saturday/Sunday. */
export declare const disableWeekends: () => ScheduleSlotPredicate;
/** Disable any slot that overlaps one of the given ranges. */
export declare const disableDateRanges: (ranges: {
    start: Date;
    end: Date;
}[]) => ScheduleSlotPredicate;
/** OR-combine predicates — disabled if ANY predicate disables the slot. */
export declare const anyOf: (...predicates: ScheduleSlotPredicate[]) => ScheduleSlotPredicate;
/** AND-combine predicates — disabled only if EVERY predicate disables the slot. */
export declare const allOf: (...predicates: ScheduleSlotPredicate[]) => ScheduleSlotPredicate;
//# sourceMappingURL=schedule-predicates.d.ts.map