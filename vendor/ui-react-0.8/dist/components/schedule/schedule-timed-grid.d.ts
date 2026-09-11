import type { ReactNode, Ref } from "react";
import type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
import type { ScheduleAnyEvent, ScheduleClassNames, ScheduleEditGesture, ScheduleEvent, ScheduleEventChangeHandler, ScheduleEventCreateHandler, ScheduleEventRemoveHandler, ScheduleOverlapPreventionOptions, ScheduleStaticEvent, ScheduleTranslations } from "./schedule-types";
export type ScheduleTimedGridProps<P = unknown> = {
    days: Date[];
    data: ScheduleEvent<P>[];
    staticEvents: ScheduleStaticEvent<P>[];
    startHour: number;
    endHour: number;
    slotDuration: number;
    slotDisabled?: ScheduleSlotPredicate;
    now?: Date;
    withNowIndicator: boolean;
    onEventClick?: (event: ScheduleAnyEvent<P>) => void;
    onEventChange?: ScheduleEventChangeHandler<P>;
    onEventRemove?: ScheduleEventRemoveHandler<P>;
    /** RFC — click-drag-to-create on empty grid space. */
    onEventCreate?: ScheduleEventCreateHandler;
    /**
     * Fires on a plain click (no discernible drag) that lands on empty
     * day-column space — not on an event/overflow chip, and never alongside a
     * committed create-drag (the same click-vs-drag resolution that decides
     * `onEventCreate` decides this too, mutually exclusively). Independent of
     * `editable`'s `"create"` grant — deselecting/dismissing something the
     * consumer is tracking (e.g. a details panel driven by `onEventClick`)
     * shouldn't require create permission.
     */
    onEventDismiss?: () => void;
    /** Which gestures are possible at all — see `TimeGridSharedProps.editable`. */
    editable?: boolean | readonly ScheduleEditGesture[];
    /** See `TimeGridSharedProps.preventOverlap`. */
    preventOverlap?: boolean | ScheduleOverlapPreventionOptions;
    /** Cap on side-by-side columns before excess concurrent events collapse
     *  into a "+N" overflow indicator. Default `4`. */
    maxOverlapColumns?: number;
    /** Cap on visible concurrent all-day lanes before excess all-day events
     *  collapse into a per-day "+N" overflow indicator. Default `2`. */
    maxAllDayRows?: number;
    /**
     * Overrides the built-in "+N" overflow disclosure popover entirely —
     * gated by presence, like `onEventClick`/`onDayClick`. Applies to both
     * the timed grid's own column overflow and the all-day row's per-day
     * overflow. Absent (default): clicking "+N" opens the built-in popover
     * (a list of hidden events, each opening into its own full details).
     */
    onOverflowClick?: (events: ScheduleAnyEvent<P>[]) => void;
    onDayClick?: (date: Date) => void;
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
    locale?: string;
    timeZone: string;
    translations: Required<ScheduleTranslations>;
    classNames?: ScheduleClassNames;
    empty?: ReactNode;
    /** Absent: defaults to `defaultHourHeight(slotDuration)`. */
    hourHeight?: number;
    /** Exposes the scrollable root (`data-schedule-part="timed-grid"`) —
     *  `DaysView`'s own scroll-to-now wiring (RFC §14) needs a real DOM node
     *  to call `scrollElementToCenter` (`schedule-geometry.ts`) on. Plain
     *  `ref` prop, no `forwardRef` — same idiom `alert.tsx`/`tree-select.tsx`
     *  already use on React 19. */
    ref?: Ref<HTMLDivElement>;
    /** Forwarded to today's own `NowCursorLine` `marker` instance (via
     *  `DayColumn`) — the other DOM node that same scroll-to-now wiring
     *  needs, alongside `ref` above. */
    nowRef?: Ref<HTMLDivElement>;
};
export declare function ScheduleTimedGrid<P = unknown>({ days, data, staticEvents, startHour, endHour, slotDuration, slotDisabled, now, withNowIndicator, onEventClick, onEventChange, onEventRemove, onEventCreate, onEventDismiss, editable, preventOverlap, maxOverlapColumns, maxAllDayRows, onOverflowClick, onDayClick, renderEventDetails, locale, timeZone, translations, classNames, empty, hourHeight, ref, nowRef, }: ScheduleTimedGridProps<P>): import("react").JSX.Element;
//# sourceMappingURL=schedule-timed-grid.d.ts.map