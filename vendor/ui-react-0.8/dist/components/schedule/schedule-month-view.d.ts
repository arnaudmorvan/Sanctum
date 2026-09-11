import { type HTMLArkProps } from "@ark-ui/react";
import type { ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
import type { AnchorDateProps, FirstDayOfWeek, PaginationChromeProps, ScheduleAnyEvent, ScheduleSharedProps } from "./schedule-types";
/**
 * RFC §9 (`docs/rfcs/schedule.md`) — the read-only month grid. Standalone
 * pagination reuses `Schedule.Toolbar`'s own `PrevTrigger`/`NextTrigger`/
 * `NowTrigger` parts (retrofitted onto `DaysView` alongside this
 * view, so every view shares one button implementation).
 *
 * Note on RSC: unlike the RFC's original "pure Server Component, no hooks"
 * plan, this file uses `useUncontrolled` for standalone anchor-date state —
 * matching `DaysView`'s already-shipped standalone behavior (RFC
 * §1: "every view individually importable and usable"). A day-cell without
 * a hook has nowhere to hold the anchor date across a Prev/Next click, so
 * the two goals were incompatible; parity with the sibling views won out.
 */
export type MonthViewProps<P = unknown> = ScheduleSharedProps<P> & AnchorDateProps & PaginationChromeProps & HTMLArkProps<"div"> & WithTestId & {
    /** Locale default when omitted. */
    startOfWeek?: FirstDayOfWeek;
    /** Override for tests/Storybook — a fixed "today" instead of the live
     *  clock. Only affects which day-number gets the today accent below;
     *  unlike `DaysView`'s `now`, there's nothing here that ticks live. */
    now?: Date;
    /** Day-granularity, same predicate shape as `Calendar`/`DatePicker`'s
     *  `isDateUnavailable` — pair with `@42/ui-react/date-picker`'s predicates. */
    dateUnavailable?: (date: Date) => boolean;
    /** Chips shown per day before a "+N more" pill — RFC §9. Same for every
     *  cell, computed at render time (no `ResizeObserver`), so this stays
     *  SSR-safe. Default `3`. */
    maxEventsPerDay?: number;
    /**
     * Overrides the built-in day-details popover's agenda-list content
     * (Month only; gated by `onDayClick`'s absence, like the popover
     * itself). `ctx.onSelectEvent` still drives the same built-in
     * list→single-event swap the default list uses, so custom row markup
     * doesn't have to give up that behavior to customize how rows look.
     */
    renderDayDetails?: (date: Date, events: ScheduleAnyEvent<P>[], ctx: {
        onSelectEvent: (event: ScheduleAnyEvent<P>) => void;
    }) => ReactNode;
};
export declare function MonthView<P = unknown>({ data, staticEvents, onEventClick, onDayClick, renderEventDetails, renderDayDetails, locale, timeZone, translations, classNames, className, date, defaultDate, onDateChange, withPagination, withNowButton, startOfWeek, now, dateUnavailable, maxEventsPerDay, testId, ...rest }: MonthViewProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-month-view.d.ts.map