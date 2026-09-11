import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
import type { ScheduleEvent } from "./schedule-types";
type Edge = "start" | "end";
export type UseEventResizeOptions = {
    event: ScheduleEvent;
    edge: Edge;
    /** Minutes — both the grid's slot spacing and the resize snap increment. */
    slotDuration: number;
    /** Minutes. Defaults to `slotDuration` — a resize can never shrink an
     *  event below one snap unit. */
    minDurationMinutes?: number;
    slotDisabled?: ScheduleSlotPredicate;
    /** RFC §12a, axis A already resolved for this gesture by the caller. */
    preventOverlap?: boolean;
    /** RFC §12a, axis B already resolved by the caller — excludes the event's
     *  own pre-resize range via `event.id`. */
    overlapCandidates?: {
        id: string;
        start: Date;
        end: Date;
    }[];
    onEventChange?: (event: ScheduleEvent, next: {
        start: Date;
        end: Date;
    }, reason: "drag" | "resize") => void;
    locale?: string;
};
export declare function useEventResize({ event, edge, slotDuration, minDurationMinutes, slotDisabled, preventOverlap, overlapCandidates, onEventChange, locale, }: UseEventResizeOptions): {
    getHandleProps: () => {
        role: "separator";
        "aria-orientation": "horizontal";
        tabIndex: number;
        "aria-valuenow": number;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuetext": string;
        "aria-label": string;
        "data-schedule-part": "resize-handle";
        onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
        onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => void;
        style: CSSProperties;
    };
};
export {};
//# sourceMappingURL=use-event-resize.d.ts.map