import type { ReactNode } from "react";
import type { ScheduleAnyEvent, ScheduleTranslations } from "./schedule-types";
/**
 * The list↔detail swap shared by every "click a list of events, get one
 * event's full details" popover in this component — a compact row per
 * event, each opening into that event's *full* details (title, time, icon,
 * color, and `description`) via `ScheduleEventDetailsContent`, the same
 * content every other event-details popover here already shows. Used by the
 * timed grid's `ScheduleOverflowPopover` (hidden events only), the all-day
 * row's own overflow chip (same), and `MonthView`'s day-details popover
 * (the day's *full* agenda, via `renderList`) — despite the "Overflow" name
 * this file's history carries, Month's day click isn't an overflow case at
 * all, just the same list→detail shape with a different data source. The
 * caller owns `activeEvent`'s state (reset it to `null` alongside closing
 * the popover) — this component is a pure presentational swap between the
 * two views.
 */
export type ScheduleEventListPopoverContentProps<P = unknown> = {
    /** The list to show — the hidden events for a "+N" cluster, or (Month) a
     *  day's full, uncapped agenda. */
    events: ScheduleAnyEvent<P>[];
    /** `null` shows the list; a specific event shows that event's own full details. */
    activeEvent: ScheduleAnyEvent<P> | null;
    onSelectEvent: (event: ScheduleAnyEvent<P>) => void;
    onBack: () => void;
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
    /** Overrides the default list rows entirely — Month's day-details popover
     *  threads its own `renderDayDetails` override through here so it keeps
     *  the built-in list→detail swap (via the `onSelectEvent` it's handed)
     *  without giving up custom row markup. Absent (the default): the built-in
     *  dot + title rows below, including the empty-agenda message. */
    renderList?: (events: ScheduleAnyEvent<P>[], onSelectEvent: (event: ScheduleAnyEvent<P>) => void) => ReactNode;
    locale?: string;
    timeZone?: string;
    translations: Required<ScheduleTranslations>;
    /** The list rows' own className — distinct from the popover panel's own
     *  (threaded by the caller onto `Popover.Content` itself). */
    itemClassName?: string;
};
export declare function ScheduleEventListPopoverContent<P = unknown>({ events, activeEvent, onSelectEvent, onBack, renderEventDetails, renderList, locale, timeZone, translations, itemClassName, }: ScheduleEventListPopoverContentProps<P>): ReactNode;
//# sourceMappingURL=schedule-event-list-popover-content.d.ts.map