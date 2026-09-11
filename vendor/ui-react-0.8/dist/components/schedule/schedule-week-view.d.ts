import { type DaysViewProps } from "./schedule-days-view";
/**
 * RFC §17a (`docs/rfcs/schedule.md`) — a thin, preconfigured `DaysView` with
 * `visibleDays` fixed to `7`, reinstated as a convenience wrapper (not a
 * reimplementation — the whole point of the `DaysView` merge was one
 * underlying engine) for the common full-week case.
 *
 * Unlike `DayView`, `align` stays on the public surface — matching the
 * old, pre-merge `WeekView`'s `firstDayOfWeek` prop, a week genuinely has a
 * start-of-week concept to configure (unlike a single day, see `DayView`).
 *
 * Renders `data-schedule-part="days-view"`, same as `DaysView` itself —
 * this genuinely mounts one, so there's exactly one source of truth for
 * that attribute rather than a second value to keep in sync.
 */
export type WeekViewProps<P = unknown> = Omit<DaysViewProps<P>, "visibleDays">;
export declare function WeekView<P = unknown>(props: WeekViewProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-week-view.d.ts.map