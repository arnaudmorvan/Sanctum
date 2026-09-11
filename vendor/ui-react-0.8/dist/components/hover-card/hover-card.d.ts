import { HoverCard as Ark } from "@ark-ui/react/hover-card";
import { type ReactNode } from "react";
import { type LogicalPosition } from "../../lib/placement";
import type { WithTestId } from "../../lib/test-id";
type HoverCardPlacement = NonNullable<NonNullable<Ark.RootProps["positioning"]>["placement"]>;
/** `position` accepts Ark's physical placements plus the logical, RTL-aware
 *  horizontal sides `start` / `end` (resolved to `left` / `right` by direction). */
export type HoverCardPosition = LogicalPosition<HoverCardPlacement>;
export type HoverCardRootProps = Omit<Ark.RootProps, "positioning" | "onOpenChange"> & {
    /** Match the trigger's width (`"target"`), or size to content (`"auto"`,
     *  default — a hover card's content is usually much larger than its
     *  trigger, unlike a dropdown). */
    width?: "target" | "auto";
    /** Panel placement relative to the trigger. Defaults to Ark's `"bottom"`. */
    position?: HoverCardPosition;
    /** Gap in px between the trigger and the panel. */
    gutter?: number;
    /** Positioner offset. */
    offset?: {
        mainAxis?: number | undefined;
        crossAxis?: number | undefined;
    } | undefined;
    /** Render the panel in a Portal so it escapes clipping ancestors. Default `true`. */
    withinPortal?: boolean;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    /** Fires when the card opens or closes (flattened from Ark's detail object). */
    onOpenChange?: (open: boolean) => void;
    /** Fires on close (any source) — pointer/focus leaving, Escape, outside
     *  interaction, or a controlled `onOpenChange`. */
    onClose?: () => void;
};
export type HoverCardContentProps = Ark.ContentProps & WithTestId & {
    /** Identifies which `HoverCard.Group` target this content belongs to —
     *  only meaningful inside `HoverCard.Group`, where several `Content`s
     *  share one panel and `Group` picks the one whose `value` matches the
     *  active trigger. Ignored (and never forwarded to the DOM) otherwise. */
    value?: string;
};
export type HoverCardGroupProps = Omit<Ark.RootProps, "positioning" | "onOpenChange" | "children"> & {
    /** Match every trigger's width (`"target"`), or size to content (`"auto"`,
     *  default). */
    width?: "target" | "auto";
    /** Panel placement relative to the active trigger. Defaults to Ark's `"bottom"`. */
    position?: HoverCardPosition;
    /** Gap in px between the active trigger and the panel. */
    gutter?: number;
    /** Positioner offset. */
    offset?: {
        mainAxis?: number | undefined;
        crossAxis?: number | undefined;
    } | undefined;
    /** Render the panel in a Portal so it escapes clipping ancestors. Default `true`. */
    withinPortal?: boolean;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    /** Fires when the card opens or closes (flattened from Ark's detail object). */
    onOpenChange?: (open: boolean) => void;
    /** Fires on close (any source) — pointer/focus leaving the whole group,
     *  Escape, outside interaction, or a controlled `onOpenChange`. */
    onClose?: () => void;
    /** `HoverCard.Trigger` (one per hover target, each with its own `value`)
     *  and `HoverCard.Content` (one per target's content, `value`-matched to
     *  its trigger) — the same parts `HoverCard.Root` uses, just several of
     *  each instead of one. */
    children?: ReactNode;
};
export declare const HoverCard: {
    Root: ({ width, position, gutter, offset, withinPortal, container, openDelay, children, onOpenChange, onClose, ...rest }: HoverCardRootProps) => import("react").JSX.Element;
    Trigger: import("react").ForwardRefExoticComponent<Ark.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Content: ({ className, children, testId, value: _value, ...rest }: HoverCardContentProps) => import("react").JSX.Element;
    Group: ({ width, position, gutter, offset, withinPortal, container, openDelay, children, onOpenChange, onClose, ...rest }: HoverCardGroupProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=hover-card.d.ts.map