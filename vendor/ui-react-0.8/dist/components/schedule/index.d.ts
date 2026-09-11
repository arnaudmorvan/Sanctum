/**
 * RFC (`docs/rfcs/schedule.md`) — full v1 scope: the core engine, all four
 * views, `Schedule.Toolbar`, and the orchestrating `Schedule` root. Every
 * view stays independently importable (RFC §1) in addition to hanging off
 * the compound `Schedule` namespace below, the same "usable standalone or
 * composed" shape `Calendar`/`DatePicker` establish for the date-picker
 * family.
 */
export type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
export { allOf, anyOf, disableDateRanges, disableOutsideHours, disablePast, disableWeekends, } from "../../lib/schedule-predicates";
export type { ScheduleProps } from "./schedule";
export { ScheduleRoot } from "./schedule";
export type { DateRange } from "./schedule-dates";
export { dayKey, durationLabel, enumerateDays, enumerateMonths, eventOccursOnDay, formatScheduleTitle, getVisibleRange, isSameMonth, isToday, paginateDate, rangeOverlapsAny, rangesOverlap, resolveNextUpDayLabel, resolveOverlapCandidates, timeLabel, } from "./schedule-dates";
export type { DayViewProps } from "./schedule-day-view";
export { DayView } from "./schedule-day-view";
export type { DaysViewProps } from "./schedule-days-view";
export { DaysView } from "./schedule-days-view";
export type { ScheduleCappedLayout, ScheduleLayoutResult, ScheduleOverflowSpan, } from "./schedule-layout";
export { layoutEventColumns, layoutEventColumnsCapped } from "./schedule-layout";
export type { MonthViewProps } from "./schedule-month-view";
export { MonthView } from "./schedule-month-view";
export type { NextUpEventRenderState, ScheduleNextUpClassNames, ScheduleNextUpProps, } from "./schedule-next-up";
export { ScheduleNextUp } from "./schedule-next-up";
export type { NextUpDayGroup, NextUpTimeSlot, } from "./schedule-next-up-grouping";
export { buildNextUpAgenda, filterUpcomingEvents, groupUpcomingEvents, } from "./schedule-next-up-grouping";
export type { ScheduleToolbarNowTriggerProps, ScheduleToolbarProps, ScheduleToolbarTitleProps, ScheduleToolbarViewSwitcherProps, } from "./schedule-toolbar";
export { ScheduleToolbar } from "./schedule-toolbar";
export type { FirstDayOfWeek, ScheduleAlign, ScheduleAnyEvent, ScheduleClassNames, ScheduleEvent, ScheduleEventChipClassNames, ScheduleOverflowChipClassNames, ScheduleOverlapGesture, ScheduleOverlapPreventionOptions, ScheduleOverlapTarget, ScheduleStaticEvent, ScheduleTranslations, ScheduleView, } from "./schedule-types";
export type { WeekViewProps } from "./schedule-week-view";
export { WeekView } from "./schedule-week-view";
export type { YearViewProps } from "./schedule-year-view";
export { YearView } from "./schedule-year-view";
import { ScheduleRoot as _ScheduleRoot } from "./schedule";
import { DayView as _DayView } from "./schedule-day-view";
import { DaysView as _DaysView } from "./schedule-days-view";
import { MonthView as _MonthView } from "./schedule-month-view";
import { ScheduleNextUp as _ScheduleNextUp } from "./schedule-next-up";
import { WeekView as _WeekView } from "./schedule-week-view";
import { YearView as _YearView } from "./schedule-year-view";
/** RFC §3 — the compound export, the same `Object.assign` namespace shape
 *  as `Modal`/`Tooltip`. `EventChip` and the disabled-overlay/now-cursor
 *  internals stay unexported (RFC §3/§19) — nothing stops adding them to the
 *  namespace later without a breaking change. `DayView`/`WeekView` are thin
 *  preconfigured `DaysView` wrappers (RFC §17a), not independent
 *  implementations — reinstated for convenience after the `DaysView` merge.
 *  `NextUp` is a standalone agenda list, not one of the toolbar-switchable
 *  views — it never appears in `ScheduleView`/`Schedule.Toolbar.ViewSwitcher`. */
export declare const Schedule: typeof _ScheduleRoot & {
    Root: typeof _ScheduleRoot;
    DaysView: typeof _DaysView;
    DayView: typeof _DayView;
    WeekView: typeof _WeekView;
    MonthView: typeof _MonthView;
    YearView: typeof _YearView;
    Toolbar: (({ className, testId, ...rest }: import("./schedule-toolbar").ScheduleToolbarProps) => import("react").JSX.Element) & {
        PrevTrigger: ({ view, date, onDateChange, timeZone, translations, size, className, testId, visibleDays, }: import("../../lib/test-id").WithTestId & {
            view: import("./schedule-types").ScheduleView;
            date: Date;
            onDateChange?: (date: Date) => void;
            timeZone?: string;
            translations?: import("./schedule-types").ScheduleTranslations;
            size?: import("../..").Size;
            className?: string;
            visibleDays?: number;
        }) => import("react").JSX.Element;
        NextTrigger: ({ view, date, onDateChange, timeZone, translations, size, className, testId, visibleDays, }: import("../../lib/test-id").WithTestId & {
            view: import("./schedule-types").ScheduleView;
            date: Date;
            onDateChange?: (date: Date) => void;
            timeZone?: string;
            translations?: import("./schedule-types").ScheduleTranslations;
            size?: import("../..").Size;
            className?: string;
            visibleDays?: number;
        }) => import("react").JSX.Element;
        NowTrigger: ({ onDateChange, now, translations, size, className, testId, }: import("./schedule-toolbar").ScheduleToolbarNowTriggerProps) => import("react").JSX.Element;
        Title: ({ view, date, timeZone, locale, align, visibleDays, className, testId, ...rest }: import("./schedule-toolbar").ScheduleToolbarTitleProps) => import("react").JSX.Element;
        ViewSwitcher: ({ view, onViewChange, views, translations, size, className, testId, }: import("./schedule-toolbar").ScheduleToolbarViewSwitcherProps) => import("react").JSX.Element;
    };
    NextUp: typeof _ScheduleNextUp;
};
//# sourceMappingURL=index.d.ts.map