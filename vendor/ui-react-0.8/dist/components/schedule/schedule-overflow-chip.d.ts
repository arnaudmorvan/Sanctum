import type { ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
import type { ScheduleAnyEvent, ScheduleOverflowChipClassNames, ScheduleTranslations } from "./schedule-types";
/**
 * RFC §5 many-way-overlap indicator for the Day/Week timed grid — once
 * `layoutEventColumnsCapped` collapses excess concurrent events into a
 * `ScheduleOverflowSpan`, the caller resolves its ids back to real events
 * and renders one of these in the reserved trailing column. Unlike Month
 * view's "+N" pill (which navigates via `onDayClick` — there's nowhere more
 * detailed to jump to from here, since Day/Week are already the most
 * granular view), this discloses the hidden events itself via the shared
 * `ScheduleOverflowPopover`, so each hidden event's *full* details
 * (including `description`) are one click away, not just a compact one-line
 * summary. Only this trigger button's own markup/position is local to Day/
 * Week — `ScheduleOverflowPopover` owns everything behavioral.
 */
export type ScheduleOverflowChipProps<P = unknown> = WithTestId & {
    /** Percentage (0–100) of the day-column's own total height — same
     *  convention as `ScheduleEventChipProps`. */
    top: number;
    /** Percentage (0–100) of the day-column's own total height. A CSS
     *  `max(height%, 18px)` floor is applied at render time, not a JS one. */
    height: number;
    insets: {
        left: string;
        width: string;
        zIndex: number;
    };
    /** The hidden events for this cluster, in start-time order. */
    events: ScheduleAnyEvent<P>[];
    onEventClick?: (event: ScheduleAnyEvent<P>) => void;
    onOverflowClick?: (events: ScheduleAnyEvent<P>[]) => void;
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
    locale?: string;
    timeZone?: string;
    translations: Required<ScheduleTranslations>;
    classNames?: ScheduleOverflowChipClassNames;
};
export declare function ScheduleOverflowChip<P = unknown>({ top, height, insets, events, onEventClick, onOverflowClick, renderEventDetails, locale, timeZone, translations, classNames, testId, }: ScheduleOverflowChipProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-overflow-chip.d.ts.map