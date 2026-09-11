import type { Ref } from "react";
export declare function NowCursorLine({ now, nowRef, startHour, endHour, variant, hideDot, className, }: {
    /** Override for tests/Storybook — a fixed value stops the live tick entirely. */
    now?: Date;
    /** `marker` only — today's own instance, wherever it falls among the
     *  visible days, is the real DOM node backing `ScheduleTimedGrid`'s own
     *  `nowRef`, which `DaysView`/`Root` scroll to via `scrollElementToCenter`
     *  (`schedule-geometry.ts`) for a measured, not computed, "center on now"
     *  (RFC §14). Nothing reads it off the `guide` variant, so callers simply
     *  don't pass one there. */
    nowRef?: Ref<HTMLDivElement>;
    /** The rendered window's own top — the day-column only paints `[startHour, endHour)`. */
    startHour: number;
    /** The rendered window's own bottom — clamps the line to the visible range
     *  instead of floating past the day-column's own bottom edge whenever the
     *  actual current time falls before `startHour` or at/after `endHour`. */
    endHour: number;
    variant?: "marker" | "guide";
    /** `marker` only — set when this is the leftmost visible day column, so
     *  the dot (which spills half its width toward the gutter) would
     *  otherwise land right on top of `NowCursorLabel` instead of a real
     *  day column. Dropping it there also reads as more seamless: the line
     *  itself already starts flush against the gutter, so the label now
     *  looks like where the line originates rather than a disconnected dot
     *  sitting in between. */
    hideDot?: boolean;
    className?: string;
}): import("react").JSX.Element;
/**
 * The now-cursor's clock-time label — a leaf on its own, same isolation
 * reasoning as `NowCursorLine` above (a per-minute tick only re-renders
 * this, never the grid). Mounted once inside the sticky hour gutter
 * (`schedule-timed-grid.tsx`), not inside either line variant, so it reads
 * as part of the gutter's own hour axis instead of floating over today's
 * event content — see the "Correction after v1 shipped" note in RFC §13.
 */
export declare function NowCursorLabel({ now, startHour, endHour, locale, className, }: {
    /** Override for tests/Storybook — a fixed value stops the live tick entirely. */
    now?: Date;
    startHour: number;
    endHour: number;
    /** Threaded into `clockTimeLabel` — never a `timeZone`, see that helper's
     *  own doc comment. */
    locale?: string;
    className?: string;
}): import("react").JSX.Element;
/**
 * One row of the hour gutter's own hour axis (`schedule-timed-grid.tsx`),
 * broken out into its own leaf so hiding the current hour's number under
 * `NowCursorLabel` only re-renders this one row on tick, never the grid or
 * every other row. `hideWhenCurrent` gates whether it subscribes to
 * `useNow` at all — split into a separate `Live` component below rather
 * than an early `return` before the hook call, since conditionally calling
 * a hook from a prop is a rules-of-hooks violation. When the now-indicator
 * feature isn't in play (or today isn't visible), this renders once,
 * statically, exactly as it did before the label moved into the gutter.
 */
export declare function HourGutterTick({ hour, label, now, hideWhenCurrent, className, }: {
    hour: number;
    label: string;
    /** Override for tests/Storybook — a fixed value stops the live tick entirely. */
    now?: Date;
    className?: string;
    hideWhenCurrent: boolean;
}): import("react").JSX.Element;
//# sourceMappingURL=now-cursor-line.d.ts.map