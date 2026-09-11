import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
import type { ScheduleEvent } from "./schedule-types";
export type UseEventDragOptions = {
    event: ScheduleEvent;
    /**
     * Whether this event can actually be dragged (the caller's already-
     * resolved `editable` grant for `"drag"`). When `false`, pointer down/up
     * are still tracked so click-to-open-details keeps working, but the chip
     * never visually follows the pointer and a drag attempt past `CLICK_SLOP`
     * is silently ignored — not a rejected commit, just not draggable at all.
     */
    enabled?: boolean;
    /** Minutes — both the grid's slot spacing and the drag snap increment. */
    slotDuration: number;
    slotDisabled?: ScheduleSlotPredicate;
    /** RFC §12a, axis A already resolved for this gesture by the caller. */
    preventOverlap?: boolean;
    /** RFC §12a, axis B already resolved by the caller — the event's own
     *  pre-drag range is excluded via `event.id`, so it never rejects against
     *  its own unmoved self. */
    overlapCandidates?: {
        id: string;
        start: Date;
        end: Date;
    }[];
    onEventChange?: (event: ScheduleEvent, next: {
        start: Date;
        end: Date;
    }, reason: "drag" | "resize") => void;
    onEventClick?: (event: ScheduleEvent) => void;
};
export declare function useEventDrag({ event, enabled, slotDuration, slotDisabled, preventOverlap, overlapCandidates, onEventChange, onEventClick, }: UseEventDragOptions): {
    getBodyProps: () => {
        onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
        style: CSSProperties;
    };
};
//# sourceMappingURL=use-event-drag.d.ts.map