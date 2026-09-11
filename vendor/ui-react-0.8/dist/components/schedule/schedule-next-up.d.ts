import { type HTMLArkProps } from "@ark-ui/react";
import { type ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
import type { ScheduleAnyEvent, ScheduleTranslations } from "./schedule-types";
/**
 * RFC — `Schedule.NextUp`: a chronological upcoming-events list, grouped by
 * day then by exact start time (same-start events stack under one shared
 * time label). A companion to the four calendar-grid views, not one of
 * them — it's exported alongside `Schedule` but never wired into
 * `Schedule.Toolbar`'s view switcher.
 *
 * Live-ticking by default via `useNow` (RFC §13's own clock primitive):
 * which events are shown, and their Today/Tomorrow/date grouping, re-derive
 * automatically as real time passes, unless a fixed `now` is passed for
 * tests/Storybook.
 *
 * Unstyled chrome — no built-in card/border/background, unlike `Root`/
 * `MonthView`/`YearView`'s own wrapping surface. A bare agenda list is a
 * layout primitive meant to sit inside whatever the consumer already has
 * (a sidebar, a dashboard card, a panel); wrap it in `Card` (or any other
 * surface) at the call site instead.
 */
export type ScheduleNextUpClassNames = {
    dayGroup?: string;
    dayLabel?: string;
    timeGroup?: string;
    time?: string;
    event?: string;
    icon?: string;
    title?: string;
    description?: string;
    duration?: string;
};
/** The only signal a custom `renderEvent` can't trivially recompute itself
 *  from `event` alone: whether this is the single soonest event in the
 *  whole list (tie-broken to the first event of the first same-start stack,
 *  if several share the earliest start). */
export type NextUpEventRenderState = {
    isNext: boolean;
};
export type ScheduleNextUpProps<P = unknown> = Omit<HTMLArkProps<"section">, "children"> & WithTestId & {
    /** Both interactive and read-only events, merged — `NextUp` never
     *  drags, resizes, or removes anything, so there's no reason to force
     *  callers to split one upcoming-events list into `data`/`staticEvents`
     *  the way the editable views do. */
    data: ScheduleAnyEvent<P>[];
    /** Override for tests/Storybook; a fixed value stops the live tick
     *  entirely — identical contract to the grid views' own `now`. */
    now?: Date;
    /** Minutes an event stays visible past its own `end` before this list
     *  drops it. */
    pastEventsOffset?: number;
    locale?: string;
    timeZone?: string;
    /** Only `empty` applies here — Today/Tomorrow/date-group labels are
     *  fully `Intl`-derived (see `resolveNextUpDayLabel`), so this reuses
     *  the same field name/type the grid views' `ScheduleTranslations`
     *  already carries rather than introducing a parallel vocabulary. */
    translations?: Pick<ScheduleTranslations, "empty">;
    /** Full override for the "nothing upcoming" state; `translations.empty`
     *  is just this slot's default copy — same `empty` prop +
     *  `translations.empty`-default split the grid views already use. */
    empty?: ReactNode;
    /**
     * Overrides one event's own row content entirely. The shared `HH:MM`
     * slot heading and each event's own duration both stay owned by
     * `NextUp` itself — like the time, duration always renders (in the
     * time column, under the `HH:MM` label) regardless of `renderEvent`;
     * this only replaces the title/icon/description content next to it.
     * Absent (the default): icon + bold title + muted description,
     * mirroring the built-in event-details popover's own default content.
     */
    renderEvent?: (event: ScheduleAnyEvent<P>, state: NextUpEventRenderState) => ReactNode;
    classNames?: ScheduleNextUpClassNames;
};
export declare function ScheduleNextUp<P = unknown>({ data, now, pastEventsOffset, locale, timeZone, translations, empty, renderEvent, classNames, className, testId, ...rest }: ScheduleNextUpProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-next-up.d.ts.map