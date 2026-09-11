import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import type { ScheduleAnyEvent, ScheduleOverflowChipClassNames, ScheduleTranslations } from "./schedule-types";
/**
 * The "+N" overflow disclosure's shared open/active-event state and
 * `Popover.Root`/`Trigger`/`Content` wiring — previously duplicated nearly
 * verbatim between the timed grid's overflow chip and the all-day row's own
 * overflow chip (`schedule-overflow-chip.tsx`, `schedule-all-day-row.tsx`),
 * which differ only in how their trigger button is styled and positioned:
 * absolute px in one day-column's local coordinate space for the timed grid,
 * CSS grid placement spanning every day column for the all-day row. That
 * positioning difference is real and stays with each caller; `renderTrigger`
 * is the seam — this component owns every *behavioral* concern (open state,
 * list↔detail swap, click resolution, aria), the caller supplies only the
 * trigger element's markup/style/position, spreading the behavioral props
 * this hands it onto its own `<button>`.
 */
export type ScheduleOverflowTriggerProps = {
    onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
    "aria-label": string;
    "aria-haspopup"?: "dialog";
    "aria-expanded"?: boolean;
};
export type ScheduleOverflowPopoverProps<P = unknown> = {
    /** The hidden events for this cluster, in start-time order. */
    events: ScheduleAnyEvent<P>[];
    onEventClick?: (event: ScheduleAnyEvent<P>) => void;
    /** Overrides the built-in "+N" disclosure popover entirely — gated by
     *  presence, the same "defer to the consumer vs. show the built-in UI"
     *  idiom `onEventClick`/`onDayClick` already use elsewhere. Absent (the
     *  default): clicking "+N" opens the built-in popover. Present: this
     *  fires instead, with the full list of hidden events, and the popover
     *  never mounts. */
    onOverflowClick?: (events: ScheduleAnyEvent<P>[]) => void;
    /** Overrides the built-in event-details popover's content, once a hidden
     *  event is selected from the list. */
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
    locale?: string;
    timeZone?: string;
    translations: Required<ScheduleTranslations>;
    classNames?: ScheduleOverflowChipClassNames;
    /** Builds the "+N" trigger element. Receives every behavioral prop
     *  (`onClick`, aria attributes) to spread onto the caller's own button —
     *  this component decides *what* those are (gated on `onOverflowClick`'s
     *  presence, same as the popover itself); the caller decides how the
     *  button looks and where it sits. */
    renderTrigger: (props: ScheduleOverflowTriggerProps) => ReactNode;
};
export declare function ScheduleOverflowPopover<P = unknown>({ events, onEventClick, onOverflowClick, renderEventDetails, locale, timeZone, translations, classNames, renderTrigger, }: ScheduleOverflowPopoverProps<P>): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react").JSX.Element | null | undefined;
//# sourceMappingURL=schedule-overflow-popover.d.ts.map