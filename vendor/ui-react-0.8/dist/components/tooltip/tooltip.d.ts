import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import { type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";
import { type LogicalPosition } from "../../lib/placement";
import type { WithTestId } from "../../lib/test-id";
/** Resets the `<button>` Ark renders for the default trigger down to plain inline
 *  text, so a Tooltip can sit on a word inside a `<p>` while staying keyboard-
 *  focusable. `cursor-help` signals the hint; `[font:inherit]` matches the prose. */
declare const tooltipTrigger: (props?: ({
    variant?: "text" | "inline" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type TooltipPlacement = NonNullable<NonNullable<ArkTooltip.RootProps["positioning"]>["placement"]>;
/** `position` accepts Ark's physical placements plus the logical, RTL-aware
 *  horizontal sides `start` / `end` (resolved to `left` / `right` by direction). */
export type TooltipPosition = LogicalPosition<TooltipPlacement>;
export type TooltipRootProps = Omit<ArkTooltip.RootProps, "positioning"> & {
    /** Bubble placement relative to the trigger. Prefer the logical `start` / `end`
     *  sides (RTL-aware), or use any Ark placement (`top`, `bottom`, `top-start`, …).
     *  Defaults to `"top"`. */
    position?: TooltipPosition;
    /** Gap in px between the trigger and the bubble. */
    offset?: number;
    /** Render the bubble in a Portal so it escapes clipping ancestors. Default `true`. */
    withinPortal?: boolean;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    /** Fires on close (any source) — pointer/focus leaving the trigger, Escape, or a controlled `onOpenChange`. */
    onClose?: () => void;
};
export type TooltipContentProps = ArkTooltip.ContentProps & WithTestId;
export type TooltipArrowProps = ArkTooltip.ArrowProps & WithTestId;
export type TooltipProps = TooltipRootProps & WithTestId & {
    /** The hint shown on hover and keyboard focus. Named `label` for parity with
     *  the rest of the kit; wired as a description via Ark's `aria-describedby`. */
    label: ReactNode;
    /** The trigger. By default it's wrapped in a focusable inline trigger (so it
     *  drops into running text); with `asChild`, this element *is* the trigger. */
    children: ReactNode;
    /** Render `children` as the trigger instead of wrapping them. */
    asChild?: boolean;
    /** Add a small arrow pointing at the trigger. For the compound form, compose
     *  `<Tooltip.Arrow />` inside `<Tooltip.Content>` instead. */
    withArrow?: boolean;
    variant?: VariantProps<typeof tooltipTrigger>["variant"];
    classNames?: {
        trigger?: string;
        content?: string;
        arrow?: string;
    };
};
export declare const Tooltip: (({ label, children, asChild, classNames, withArrow, variant, testId, ...root }: TooltipProps) => import("react").JSX.Element) & {
    Root: ({ position, offset, withinPortal, container, children, onOpenChange, onClose, ...rest }: TooltipRootProps) => import("react").JSX.Element;
    Trigger: import("react").ForwardRefExoticComponent<ArkTooltip.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Content: ({ className, children, testId, ...rest }: TooltipContentProps) => import("react").JSX.Element;
    Arrow: ({ className, style, testId }: TooltipArrowProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=tooltip.d.ts.map