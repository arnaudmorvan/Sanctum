export type HourCycle = "h11" | "h12" | "h23" | "h24";
/**
 * Resolve 12h vs 24h display (Req #6): an explicit `hourCycle` wins, then
 * `format`, else the locale's own convention via `Intl.DateTimeFormat`. Shared
 * by `TimeInput` and `DatePicker`'s embedded time panel so both pick the same
 * cycle for the same locale.
 */
export declare const resolveHourCycle: ({ locale, format, hourCycle, }: {
    locale: string;
    format?: 12 | 24;
    hourCycle?: HourCycle;
}) => HourCycle;
/** Whether a resolved cycle displays 1–12 + AM/PM (`h11`/`h12`) rather than 0–23. */
export declare const is12Hour: (cycle: HourCycle) => boolean;
/** Convert a stored 24h hour (`0`–`23`) to a displayed 12h hour (`1`–`12`) + period. */
export declare const to12Hour: (hour24: number) => {
    hour: number;
    period: "AM" | "PM";
};
/** Convert a displayed 12h hour (`1`–`12`) + period back to a stored 24h hour. */
export declare const to24Hour: (hour12: number, period: "AM" | "PM") => number;
/** Locale-correct AM/PM display strings (e.g. "AM"/"PM" en-US, "午前"/"午後" ja-JP), read via
 *  `Intl.DateTimeFormat`'s own `dayPeriod` part rather than a hardcoded English literal. Keyed by
 *  the same `"AM" | "PM"` domain value `to12Hour`/`to24Hour` use throughout, so this only ever
 *  changes what's *displayed*, never what's stored/serialized. */
export declare const dayPeriodLabels: (locale: string) => Record<"AM" | "PM", string>;
export declare const timeUnitLabels: (locale: string) => {
    hour: string;
    minute: string;
    second: string;
};
//# sourceMappingURL=hour-cycle.d.ts.map