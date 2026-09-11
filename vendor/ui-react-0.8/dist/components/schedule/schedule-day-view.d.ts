import { type DaysViewProps } from "./schedule-days-view";
/**
 * RFC §17a (`docs/rfcs/schedule.md`) — a thin, preconfigured `DaysView` with
 * `visibleDays` fixed to `1`, reinstated as a convenience wrapper (not a
 * reimplementation — the whole point of the `DaysView` merge was one
 * underlying engine) for the common single-day case.
 *
 * `align` is omitted from the public surface entirely, matching the
 * old, pre-merge `DayView`'s shape exactly (it never accepted a
 * `firstDayOfWeek` prop — a single day has no week-start concept to snap
 * to). This isn't just an API-cleanliness choice: `getVisibleRange`'s
 * `"days"` branch special-cases `visibleDays === 1` to always anchor on the
 * date itself, the same as `align: "relative"`, regardless of what
 * `align` would otherwise resolve to — so the prop is provably
 * meaningless here, not just conventionally hidden.
 *
 * Renders `data-schedule-part="days-view"`, same as `DaysView` itself —
 * this genuinely mounts one, so there's exactly one source of truth for
 * that attribute rather than a second value to keep in sync.
 */
export type DayViewProps<P = unknown> = Omit<DaysViewProps<P>, "visibleDays" | "align">;
export declare function DayView<P = unknown>(props: DayViewProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-day-view.d.ts.map