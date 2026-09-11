import { type HTMLArkProps } from "@ark-ui/react";
import type { WithTestId } from "../../lib/test-id";
import { type MonthViewProps } from "./schedule-month-view";
import type { AnchorDateProps, EditableCallbacks, ScheduleAlign, ScheduleEditGesture, ScheduleSharedProps, ScheduleView, TimeGridSharedProps } from "./schedule-types";
/**
 * RFC §1/§3 (`docs/rfcs/schedule.md`) — `Schedule` (`Root`): orchestrates
 * view-switching and the shared anchor date via `Schedule.Toolbar`,
 * delegating all rendering to whichever view is active
 * (`ts-pattern match(view).exhaustive()`). Composed by intersection from the
 * four views' own prop slices, never a context provider — the same "share
 * via a superset type, not context" mechanism the RFC establishes
 * throughout. Passes `withPagination={false} withNowButton={false}` to
 * whichever view it renders, since `Root`'s own toolbar already covers both
 * — a standalone view keeps its own built-in chrome exactly as before.
 *
 * `Editable` (inferred from a literal `editable` at the call site — see
 * `EditableCallbacks`) makes a granted gesture's matching callback a compile
 * error to omit, on top of the existing dev-mode runtime warning
 * (`TimeGridSharedProps.editable`'s own doc comment). `Root`-only: the
 * standalone `DaysView`/`DayView`/`WeekView` don't get this generic, for the
 * reason `EditableCallbacks` explains.
 */
export type ScheduleProps<P = unknown, Editable extends boolean | readonly ScheduleEditGesture[] = false> = ScheduleSharedProps<P> & Omit<TimeGridSharedProps<P>, "editable" | "onEventChange" | "onEventRemove" | "onEventCreate"> & EditableCallbacks<P, Editable> & {
    editable?: Editable;
} & AnchorDateProps & HTMLArkProps<"div"> & WithTestId & Pick<MonthViewProps<P>, "dateUnavailable" | "renderDayDetails"> & {
    view?: ScheduleView;
    defaultView?: ScheduleView;
    onViewChange?: (view: ScheduleView) => void;
    /** Default `true` — the standalone-view default is `false`, since a bare
     *  `DaysView`/... has no toolbar row of its own to put it in unless
     *  `withPagination` is also on; `Root` always has one. */
    withNowButton?: boolean;
    /** `"days"` view's window size, in days. Default `7`. */
    visibleDays?: number;
    /**
     * Locale default when omitted; `"relative"` starts the days-window at
     * the anchor date itself instead of snapping to a calendar-week
     * boundary. Named `align`, not `startOfWeek` — this same value also
     * governs Month's window, and Root's own days-window isn't necessarily
     * a week (`visibleDays` can be anything), so a literal "start of week"
     * name would mislead here. Wider than `MonthViewProps.startOfWeek` —
     * defined directly here (not via `Pick<MonthViewProps, ...>`, which
     * would wrongly narrow `Root` to Month's stricter `FirstDayOfWeek`-only
     * type, under the wrong name besides) and narrowed via
     * `resolveWeekStartDay` when forwarded to `MonthView` below.
     */
    align?: ScheduleAlign;
};
export declare function ScheduleRoot<P = unknown, const Editable extends boolean | readonly ScheduleEditGesture[] = false>({ data, staticEvents, onEventClick, onDayClick, renderEventDetails, renderDayDetails, locale, timeZone, translations, classNames, className, startHour, endHour, slotDuration, hourHeight, slotDisabled, now, withNowIndicator, onEventChange, onEventRemove, onEventCreate, onEventDismiss, editable, preventOverlap, maxOverlapColumns, maxAllDayRows, onOverflowClick, empty, date, defaultDate, onDateChange, view, defaultView, onViewChange, withNowButton, align, visibleDays, dateUnavailable, testId, ...rest }: ScheduleProps<P, Editable>): import("react").JSX.Element;
//# sourceMappingURL=schedule.d.ts.map