import { type HTMLArkProps } from "@ark-ui/react";
import type { Ref } from "react";
import type { WithTestId } from "../../lib/test-id";
import type { AnchorDateProps, PaginationChromeProps, ScheduleAlign, ScheduleSharedProps, TimeGridSharedProps } from "./schedule-types";
/**
 * RFC §1/§17 (`docs/rfcs/schedule.md`) — standalone Days view: mountable with
 * no `<Schedule.Root>` wrapper, its own uncontrolled anchor date, and its own
 * (optional) pagination chrome. Replaces the old, separately-mountable
 * `DayView`/`WeekView` pair with one `visibleDays`-sized rolling/calendar
 * window — `visibleDays={1}` reproduces the old `DayView`, `visibleDays={7}`
 * (the default) reproduces the old `WeekView`, and any other size is now a
 * real, first-class option.
 */
export type DaysViewProps<P = unknown> = ScheduleSharedProps<P> & TimeGridSharedProps<P> & AnchorDateProps & PaginationChromeProps & HTMLArkProps<"div"> & WithTestId & {
    /** How many day-columns to show at once. Default `7`. */
    visibleDays?: number;
    /** Locale default when omitted; `"relative"` starts the window at the
     *  anchor date itself instead of snapping to a calendar-week boundary —
     *  see `ScheduleAlign`. */
    align?: ScheduleAlign;
    /**
     * Exposes the underlying `ScheduleTimedGrid`'s scrollable root DOM node
     * — merged (via `mergeRefs`) with this view's own internal ref, which
     * it needs regardless of whether a caller passes this, to scroll the
     * grid to the now-line when its own built-in Now button is clicked
     * (`withNowButton`, RFC §14's scroll-to-now addendum). Not part of
     * `TimeGridSharedProps` — `Root` also composes that shared slice for
     * its own public props and must not gain a raw DOM-ref field there; it
     * manages its own ref privately instead (see `schedule.tsx`).
     */
    gridRef?: Ref<HTMLDivElement>;
    /**
     * Exposes today's own rendered now-marker DOM node (`NowCursorLine`'s
     * `marker` instance) — same "merged with an internal ref this view
     * needs regardless" and "kept off `TimeGridSharedProps`" reasoning as
     * `gridRef` above. Paired with `gridRef`, this is what
     * `scrollElementToCenter` (`schedule-geometry.ts`) needs to center the
     * scroll on the *actual rendered* marker rather than a recomputed pixel
     * position — a real measurement stays correct even if something about
     * the grid's layout math ever drifts from what's actually on screen.
     */
    nowRef?: Ref<HTMLDivElement>;
};
export declare function DaysView<P = unknown>({ data, staticEvents, onEventClick, onDayClick, renderEventDetails, locale, timeZone, translations, classNames, className, startHour, endHour, slotDuration, hourHeight, slotDisabled, now, withNowIndicator, onEventChange, onEventRemove, onEventCreate, onEventDismiss, editable, preventOverlap, maxOverlapColumns, maxAllDayRows, onOverflowClick, empty, date, defaultDate, onDateChange, withPagination, withNowButton, visibleDays, align, gridRef, nowRef, testId, ...rest }: DaysViewProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-days-view.d.ts.map