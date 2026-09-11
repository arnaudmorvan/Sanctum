import type { ReactNode } from "react";
import type { ScheduleAnyEvent } from "./schedule-types";
export type ScheduleEventDetailsContentProps<P = unknown> = {
    event: ScheduleAnyEvent<P>;
    locale?: string;
    /** Only actually read for an `allDay` event, to resolve `allDayRangeLabel`
     *  — every caller already has a resolved `timeZone` in scope regardless. */
    timeZone?: string;
    /** Full override — replaces the default content below entirely when set. */
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
};
/**
 * The single source of truth for an event's default popover content —
 * reused verbatim by both the standalone event-details popover
 * (`ScheduleEventChip`) and the day-details popover's list→single-event
 * swap (`MonthView`), so there's one definition of "what an event's details
 * look like," not two.
 */
export declare function ScheduleEventDetailsContent<P = unknown>({ event, locale, timeZone, renderEventDetails, }: ScheduleEventDetailsContentProps<P>): ReactNode;
//# sourceMappingURL=schedule-event-details.d.ts.map