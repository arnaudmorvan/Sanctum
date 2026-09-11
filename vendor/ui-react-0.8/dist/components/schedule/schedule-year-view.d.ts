import { type HTMLArkProps } from "@ark-ui/react";
import type { WithTestId } from "../../lib/test-id";
import type { AnchorDateProps, PaginationChromeProps, ScheduleSharedProps } from "./schedule-types";
/**
 * RFC §10 (`docs/rfcs/schedule.md`) — the year overview: 12 mini-months, no
 * per-event rendering, ever. A day shows a neutral dot for exactly one
 * event, a capped numeral ("9+") for more, and nothing for zero — mixing up
 * to 9 event colors into ~2px dots at this cell size would read as
 * noise, not signal. Disabled days get a muted day-number only (Month's
 * diagonal-stripe overlay is illegible at mini-month scale).
 *
 * Each mini-month renders only its own real days — adjacent-month padding
 * is blank cells (no number, no dot), not `MonthView`'s dimmed-but-real
 * adjacent days, since duplicating a day's dot across two neighboring
 * mini-months (the seam) would be genuinely confusing at a glance.
 *
 * `repeat(4, 1fr)` is the RFC's specified desktop shape; a fixed 4-column
 * grid of 12 mini-calendars is illegible on a narrow viewport, and nothing
 * in the RFC forbids stepping that down responsively, so this falls back to
 * fewer columns below `sm`/`lg`.
 */
export type YearViewProps<P = unknown> = Omit<ScheduleSharedProps<P>, "onEventClick" | "renderEventDetails"> & AnchorDateProps & PaginationChromeProps & HTMLArkProps<"div"> & WithTestId & {
    /** Override for tests/Storybook — a fixed "today" instead of the live
     *  clock. Only affects which day-number gets the today accent below;
     *  unlike `DaysView`'s `now`, there's nothing here that ticks live. */
    now?: Date;
    /** Day-granularity, same predicate shape as `Calendar`/`DatePicker`'s
     *  `isDateUnavailable` — pair with `@42/ui-react/date-picker`'s predicates. */
    dateUnavailable?: (date: Date) => boolean;
};
export declare function YearView<P = unknown>({ data, staticEvents, onDayClick, locale, timeZone, translations, classNames, className, date, defaultDate, onDateChange, withPagination, withNowButton, now, dateUnavailable, testId, ...rest }: YearViewProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-year-view.d.ts.map