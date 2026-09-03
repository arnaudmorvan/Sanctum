/** Disable every day before today (local time zone), today itself included as available. */
export declare const disablePast: () => ((date: Date) => boolean);
/** Disable every day after today (local time zone), today itself included as available. */
export declare const disableFuture: () => ((date: Date) => boolean);
/** Disable Saturdays/Sundays. */
export declare const disableWeekends: () => ((date: Date) => boolean);
/** Disable every day strictly before `boundary`. */
export declare const beforeDate: (boundary: Date) => ((date: Date) => boolean);
/** Disable every day strictly after `boundary`. */
export declare const afterDate: (boundary: Date) => ((date: Date) => boolean);
/** Disable an explicit set of days (matched by calendar day, not exact instant). */
export declare const disableDates: (dates: Date[]) => ((date: Date) => boolean);
/** OR-combine predicates — unavailable if ANY predicate disables the day. */
export declare const anyOf: (...predicates: Array<(date: Date) => boolean>) => (date: Date) => boolean;
/** AND-combine predicates — unavailable only if EVERY predicate disables the day. */
export declare const allOf: (...predicates: Array<(date: Date) => boolean>) => (date: Date) => boolean;
//# sourceMappingURL=date-predicates.d.ts.map