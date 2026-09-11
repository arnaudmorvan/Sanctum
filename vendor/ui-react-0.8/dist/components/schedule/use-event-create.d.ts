import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
export type UseEventCreateOptions = {
    day: Date;
    startHour: number;
    endHour: number;
    /** Minutes — both the grid's slot spacing and the create snap increment. */
    slotDuration: number;
    /** Minutes. Defaults to `slotDuration` — a draft can never be shorter than
     *  one snap unit, mirroring `use-event-resize.ts`'s own floor. */
    minDurationMinutes?: number;
    slotDisabled?: ScheduleSlotPredicate;
    /** Whether `"create"` is granted — gates the draft-preview visuals and the
     *  actual `onEventCreate` commit below, but *not* pointer tracking itself
     *  (needed regardless, to resolve click-vs-drag for `onEventDismiss`). */
    editableCreate: boolean;
    /** RFC §12a, axis A already resolved for this gesture by the caller. */
    preventOverlap?: boolean;
    /** RFC §12a, axis B already resolved by the caller for this day. */
    overlapCandidates?: {
        id: string;
        start: Date;
        end: Date;
    }[];
    onEventCreate?: (range: {
        start: Date;
        end: Date;
    }) => void;
    onEventDismiss?: () => void;
};
export declare function useEventCreate({ day, startHour, endHour, slotDuration, minDurationMinutes, slotDisabled, editableCreate, preventOverlap, overlapCandidates, onEventCreate, onEventDismiss, }: UseEventCreateOptions): {
    getColumnProps: () => {
        onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
        onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
        style: CSSProperties;
    };
};
//# sourceMappingURL=use-event-create.d.ts.map