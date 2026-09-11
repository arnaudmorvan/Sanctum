import { type HTMLArkProps } from "@ark-ui/react";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import type { ScheduleAlign, ScheduleTranslations, ScheduleView } from "./schedule-types";
/**
 * RFC §14 (`docs/rfcs/schedule.md`) — `Schedule.Toolbar` is a dumb flex shell
 * (mirrors `Table.Toolbar`'s own border/padding recipe) plus five fully
 * prop-driven parts. No shared context between them — Schedule never uses
 * context for props (RFC §3) — so each part takes exactly the state it needs
 * directly, the same explicit-prop shape `DataTable`'s own toolbar pieces
 * (`DataTableGlobalFilter`, `DataTableColumnVisibilityMenu`) use inside
 * `Table.Toolbar`. `Schedule` (the root) composes these five parts for its
 * own default chrome; nothing stops importing them individually to build a
 * fully custom toolbar around a standalone view.
 */
export type ScheduleToolbarProps = HTMLArkProps<"div"> & WithTestId;
type PaginationTriggerProps = WithTestId & {
    view: ScheduleView;
    date: Date;
    onDateChange?: (date: Date) => void;
    timeZone?: string;
    translations?: ScheduleTranslations;
    size?: Size;
    className?: string;
    /** `"days"` view's window size, in days — forwarded to `paginateDate` so
     *  Prev/Next step by the same window the grid is actually showing. */
    visibleDays?: number;
};
export type ScheduleToolbarNowTriggerProps = WithTestId & {
    onDateChange?: (date: Date) => void;
    /** Override for tests — mirrors the views' own `now` prop. */
    now?: Date;
    translations?: ScheduleTranslations;
    size?: Size;
    className?: string;
};
export type ScheduleToolbarTitleProps = HTMLArkProps<"h2"> & WithTestId & {
    view: ScheduleView;
    date: Date;
    timeZone?: string;
    locale?: string;
    /** `"days"` view's window alignment — forwarded to `formatScheduleTitle`.
     *  Named `align`, not `startOfWeek`, matching `DaysViewProps`/
     *  `ScheduleProps` (this is fed by `Root`'s own `align`, whichever view
     *  is active — `formatScheduleTitle` only actually consults it for
     *  `"days"`). */
    align?: ScheduleAlign;
    /** `"days"` view's window size, in days — forwarded to `formatScheduleTitle`. */
    visibleDays?: number;
};
export type ScheduleToolbarViewSwitcherProps = WithTestId & {
    view: ScheduleView;
    onViewChange?: (view: ScheduleView) => void;
    /** Which views to offer, in order. Default all four. */
    views?: ScheduleView[];
    translations?: ScheduleTranslations;
    size?: Size;
    className?: string;
};
export declare const ScheduleToolbar: (({ className, testId, ...rest }: ScheduleToolbarProps) => import("react").JSX.Element) & {
    PrevTrigger: ({ view, date, onDateChange, timeZone, translations, size, className, testId, visibleDays, }: PaginationTriggerProps) => import("react").JSX.Element;
    NextTrigger: ({ view, date, onDateChange, timeZone, translations, size, className, testId, visibleDays, }: PaginationTriggerProps) => import("react").JSX.Element;
    NowTrigger: ({ onDateChange, now, translations, size, className, testId, }: ScheduleToolbarNowTriggerProps) => import("react").JSX.Element;
    Title: ({ view, date, timeZone, locale, align, visibleDays, className, testId, ...rest }: ScheduleToolbarTitleProps) => import("react").JSX.Element;
    ViewSwitcher: ({ view, onViewChange, views, translations, size, className, testId, }: ScheduleToolbarViewSwitcherProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=schedule-toolbar.d.ts.map