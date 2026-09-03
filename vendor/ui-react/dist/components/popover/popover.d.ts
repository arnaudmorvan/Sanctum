import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { type ComponentPropsWithoutRef } from "react";
import type { WithTestId } from "../../lib/test-id";
/** Shared floating-panel chrome — border, surface, shadow, layering token, and
 *  the open/close animation (origin follows `data-placement`). Every popover
 *  surface builds on this so they stay visually identical. Exported so overlays
 *  that aren't scroll-clipping listboxes (e.g. Menu) can build their own surface
 *  on the exact same border/shadow/animation without drift.
 *
 *  Brand-tinted surface, matching `InputBase`'s shell (`border-brand-900/20
 *  dark:border-white/15`): the fill sits at the two extreme ends of the brand
 *  scale (`brand-50` / `brand-950`, near-white/near-black) so floating panels
 *  read as part of the same brand-derived surface family as inputs rather than
 *  a neutral gray. The backdrop blur stays; only the fill/border are tinted. */
export declare const popoverChrome: string;
/** Outer chrome for the machine-driven listboxes (Combobox / Select / Autocomplete
 *  / MultiSelect): border, surface, shadow, and the open/close animation. It's a
 *  rounded **clipping** wrapper (`overflow-hidden`), NOT the scroller — the inner
 *  `popoverList` scrolls, and this clip rounds that scrollbar's corners on the
 *  scrollbar side. Border + clip on one element (like `popoverPanel`) keep the
 *  border whole, and `data-state` rides here so the whole box animates in/out and
 *  unmounts cleanly — no eaten corner, no floating frame on close. */
export declare const popoverContent: string;
/** Inner scroll region for the machine-driven listboxes — the actual scroller,
 *  nested in `popoverContent`, capped at 16rem via `--available-height`. Has no
 *  border/radius of its own; the parent clip rounds its scrollbar corners. Since
 *  Content is `overflow-hidden`, the machines can't auto-scroll it natively, so
 *  scrolling is routed here via `scrollHighlightedIntoView` (the root's
 *  `scrollToIndexFn`). */
export declare const popoverList: (props?: ({
    withPaddingTop?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** Scroll the highlighted option into view from inside the `popoverList` scroller.
 *  Wired as the combobox/select root's `scrollToIndexFn` so the machine routes
 *  scrolling through here instead of its native path — which early-returns unless
 *  the (now `overflow-hidden`) Content is itself scrollable. Native `scrollIntoView`
 *  walks to the nearest scrollable ancestor, i.e. the List. */
export declare const scrollHighlightedIntoView: ({ getElement, }: {
    getElement: () => HTMLElement | null;
}) => void | undefined;
/** Panel chrome for the `Popover` component — NOT a scroll container: it clips
 *  its children so fixed Header/Footer and the scrolling Body sit flush inside
 *  the rounded border. Pair with `popoverViewport`. Its own `overflow-hidden`
 *  never clips its own shadow, and the inner Body's scrollbar is rounded by this
 *  panel's clip — so it doesn't need `scrollbar-soft`. */
export declare const popoverPanel: string;
/** The scroll region inside a `Popover` panel (its `Body`). Height tracks the
 *  positioner's `--available-height`, capped at 24rem. */
export declare const popoverViewport: string;
/** Trigger chevron — base look; add rotation per machine
 *  (`data-[state=open]:rotate-180`, or `open && "rotate-180"`). */
export declare const popoverChevron = "shrink-0 text-gray-light-500 transition-transform dark:text-gray-dark-400";
/** Clear (×) button — shared by Combobox / Select / TagsInput / NumberInput clear triggers. */
export declare const popoverClearTrigger = "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-light-500 transition-colors hover:text-gray-light-700 dark:text-gray-dark-400 dark:hover:text-gray-dark-200";
/** A single option row. Highlight is `data-highlighted`, selection is
 *  `data-state=checked`, both owned by the Ark machine. Highlight is neutral
 *  and transparent — a low-opacity black/white wash, not an opaque gray —
 *  matching the surface's own background-dependent tint (no Figma reference
 *  for this specific state yet, so this is a considered default, not an
 *  extracted value). */
export declare const popoverOption: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** The check / selected indicator slot at the inline-end of an option. */
export declare const popoverIndicator = "ms-auto inline-flex shrink-0 items-center text-(--c-solid) [&_svg]:size-4";
/** Presentational checkbox for a multi-select option row — a box that fills
 *  once its parent row carries `data-state="checked"` (needs `group/item` on
 *  the row; the check icon itself should still be an `Ark.ItemIndicator` so it
 *  only mounts when selected). Modeled on `TreeMultiSelect`'s local
 *  `treeCheckbox`, generalized off `data-state` instead of that component's own
 *  hand-rolled `data-checked`/`data-mixed` (there's no tri-state "mixed" outside
 *  a tree, so this only needs the one variant). */
export declare const popoverCheckbox: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** Group heading above a set of options. */
export declare const popoverGroupLabel = "px-2 py-1.5 text-xs font-medium select-none text-gray-light-500 dark:text-gray-dark-400";
/** Empty / nothing-found message. */
export declare const popoverEmpty = "px-2 py-6 text-center text-sm select-none text-gray-light-500 dark:text-gray-dark-400";
/**
 * Popover — the kit's floating panel, a styled layer over Ark UI's Popover.
 *
 *   <Popover.Root open={open} onOpenChange={...}>
 *     <Popover.Trigger asChild><button>…</button></Popover.Trigger>
 *     <Popover.Content>
 *       <Popover.Header>…</Popover.Header>   // optional fixed slot
 *       <Popover.Body>…</Popover.Body>       // the scroll region
 *       <Popover.Footer>…</Popover.Footer>   // optional fixed slot
 *     </Popover.Content>
 *   </Popover.Root>
 *
 * It's a *panel*, not a menu: hosts (TreeSelect, custom pickers) render their own
 * rows inside `Body`. Portaled by default (escapes `overflow:hidden` ancestors),
 * width-matched to the trigger, and animated via the kit's `popover-in/out`.
 */
type PopoverPosition = NonNullable<NonNullable<ArkPopover.RootProps["positioning"]>["placement"]>;
export type PopoverProps = Omit<ArkPopover.RootProps, "positioning"> & {
    /** Match the trigger's width (`"target"`, default) or size to content (`"auto"`). */
    width?: "target" | "auto";
    /** Panel placement relative to the trigger. Defaults to Ark's `"bottom"`. */
    position?: PopoverPosition;
    /** Gap in px between the trigger and the panel. */
    gutter?: number;
    /** Positionner offset */
    offset?: {
        mainAxis?: number | undefined;
        crossAxis?: number | undefined;
    } | undefined;
    /** Render the panel in a Portal so it escapes clipping ancestors. Default `true`. */
    withinPortal?: boolean;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    /** Fires on close (any source) — Escape, outside interaction, or a controlled `onOpenChange`. */
    onClose?: () => void;
};
export type PopoverContentProps = ArkPopover.ContentProps & WithTestId;
export type PopoverHeaderProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export type PopoverFooterProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export type PopoverBodyProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export declare const Popover: {
    Root: ({ width, position, gutter, offset, withinPortal, container, children, onOpenChange, onClose, ...rest }: PopoverProps) => import("react").JSX.Element;
    Trigger: import("react").ForwardRefExoticComponent<ArkPopover.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Content: ({ className, children, testId, ...rest }: PopoverContentProps) => import("react").JSX.Element;
    Header: ({ className, testId, ...rest }: PopoverHeaderProps) => import("react").JSX.Element;
    Body: ({ className, testId, ...rest }: PopoverBodyProps) => import("react").JSX.Element;
    Footer: ({ className, testId, ...rest }: PopoverFooterProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=popover.d.ts.map