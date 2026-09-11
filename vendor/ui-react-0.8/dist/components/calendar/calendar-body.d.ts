import type { ReactNode } from "react";
import type { Size } from "../../lib/sizes";
/**
 * CalendarBody — the shared grid module behind both `Calendar` (inline) and, later,
 * `DatePicker` (popover): the RFC §3 "one implementation, not two" module. It renders only the
 * grid anatomy (`View` / `ViewControl` / nav triggers / `Table*` / `MonthSelect` / `YearSelect`)
 * — deliberately **not** `Control` / `Content` / `Positioner` / `Trigger` / `ClearTrigger`, the
 * popover-only chrome that belongs to `DatePicker`, not here.
 *
 * Every part below self-connects to the nearest ancestor `Ark.Root` via Ark's own React
 * context, so this module needs no `api` prop threaded in — both `Calendar` and `DatePicker`
 * just mount it as a plain child inside their own differently-configured `Ark.Root`.
 *
 * Not barrel-exported (no export from `calendar/index.ts`) — `DatePicker` reaches it directly
 * via `import { CalendarBody } from "../calendar/calendar-body"`, the established cross-folder
 * pattern for a shared internal part (`multi-select.tsx` → `../combobox/combobox`,
 * `drawer.tsx` → `../action-icon/action-icon`).
 */
export type CalendarBodyClassNames = {
    /** The prev/label/next navigation row. */
    header?: string;
    /** Each rendered `<table>` (one per visible month in the day view). */
    table?: string;
    /** Each day cell's clickable trigger. */
    day?: string;
};
export type CalendarBodyProps = {
    /** Months shown side by side in the day view. */
    numOfMonths?: number;
    withWeekNumbers?: boolean;
    /** Per-day decoration slot (RFC §9's "event dot"). Receives a native `Date` — converted from
     *  Ark's `DateValue` at the point of the call, via the same `timeZone` the root was configured
     *  with — and the day's live selection state. */
    renderDay?: (date: Date, ctx: {
        isUnavailable: boolean;
        isSelected: boolean;
    }) => ReactNode;
    size?: Size;
    /** The time zone the nearest `Ark.Root` was configured with. Required (not read from Ark's
     *  own api, which exposes no public `timeZone` getter) so `renderDay`'s Date conversion uses
     *  the exact same boundary `Calendar`/`DatePicker` used to build the root's own value —
     *  see `lib/date-value.ts`'s module doc on why this one conversion point matters. */
    timeZone: string;
    classNames?: CalendarBodyClassNames;
};
export declare const calendarGridWidth: (size: Size, numOfMonths: number) => number;
export declare const CalendarBody: ({ numOfMonths, withWeekNumbers, renderDay, size, timeZone, classNames, }: CalendarBodyProps) => import("react").JSX.Element;
//# sourceMappingURL=calendar-body.d.ts.map