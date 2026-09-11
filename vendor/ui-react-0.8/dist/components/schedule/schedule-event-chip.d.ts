import type { ReactNode } from "react";
import type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
import type { ScheduleAnyEvent, ScheduleEvent, ScheduleEventChipClassNames, ScheduleTranslations } from "./schedule-types";
export type ScheduleEventChipProps<P = unknown> = {
    event: ScheduleAnyEvent<P>;
    /** Percentage (0–100) of the day-column's own total height. */
    top: number;
    /** Percentage (0–100) of the day-column's own total height. Consumers
     *  apply a `max(height%, 18px)` CSS floor, not a JS one — a percentage
     *  can't express "at least 18px" as a flat number once the column's real
     *  rendered height can vary. */
    height: number;
    /** A *heuristic* px estimate of this chip's likely rendered height,
     *  derived from the schedule's floor (`hourHeight`/`defaultHourHeight`),
     *  not the chip's real rendered size — which is no longer knowable at
     *  render time once the day-column can stretch past that floor. Used only
     *  to decide whether there's likely room for the time-range subtext line
     *  (`SHOW_TIME_THRESHOLD`); may be mildly conservative once the column is
     *  genuinely stretched taller than its floor — an accepted trade-off, not
     *  chased further here (a CSS container query would be the fully-correct
     *  fix, matching `DataTable`'s own `@container` precedent, but is a
     *  separate, non-blocking follow-up). */
    estimatedPxHeight: number;
    insets: {
        left: string;
        width: string;
        zIndex: number;
    };
    slotDuration: number;
    slotDisabled?: ScheduleSlotPredicate;
    /** Schedule-level `editable` grant, already resolved per-gesture by the
     *  caller (`isEditGestureEnabled`) — composed here with the event's own
     *  `editable` (narrow-only) via `isEventGestureEnabled`. */
    editableDrag?: boolean;
    editableResize?: boolean;
    editableRemove?: boolean;
    /** RFC §12a, axis A already resolved per-gesture by the caller. */
    preventOverlapOnDrag?: boolean;
    preventOverlapOnResize?: boolean;
    /** RFC §12a, axis B already resolved by the caller for this day. */
    overlapCandidates?: {
        id: string;
        start: Date;
        end: Date;
    }[];
    onEventClick?: (event: ScheduleAnyEvent<P>) => void;
    onEventChange?: (event: ScheduleEvent<P>, next: {
        start: Date;
        end: Date;
    }, reason: "drag" | "resize") => void;
    onEventRemove?: (event: ScheduleEvent<P>) => void;
    /** Overrides the built-in event-details popover's content. */
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
    locale?: string;
    translations: Required<ScheduleTranslations>;
    classNames?: ScheduleEventChipClassNames;
    /** `ScheduleClassNames.eventDetailsPopover` — the popover panel itself,
     *  not a chip part, so it's threaded separately from `classNames` above. */
    detailsPopoverClassName?: string;
};
export declare function ScheduleEventChip<P = unknown>(props: ScheduleEventChipProps<P>): ReactNode;
//# sourceMappingURL=schedule-event-chip.d.ts.map