import { Drawer as Ark } from "@ark-ui/react/drawer";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * Drawer — edge-anchored panel on top of Ark UI's Drawer state machine. Ark
 * owns swipe-to-dismiss, snap points, focus-trap, scroll-lock and the
 * `data-state="open|closed"` attribute; this wrapper adds an RTL-aware
 * `placement` prop (Ark has none) by writing `data-placement` on the positioner
 * + content and deriving Ark's logical `swipeDirection`. Docking, sizing and
 * the slide animation are pure CSS keyed on `[data-placement]` (see
 * `theme.css`), so `start`/`end` flip automatically under `dir="rtl"`.
 *
 * Mirrors `Modal`'s dual API: high-level `<Drawer open placement size … >` plus
 * low-level parts (`Drawer.Root`, `Drawer.Content`, …). Padding flows through
 * the `--drawer-px` CSS var.
 */
export type DrawerPlacement = "start" | "end" | "top" | "bottom";
export declare const DrawerRoot: (props: Ark.RootProps) => import("react").JSX.Element;
export declare const DrawerTrigger: import("react").ForwardRefExoticComponent<Ark.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const DrawerContext: (props: Ark.ContextProps) => ReactNode;
export type DrawerBackdropProps = ComponentPropsWithoutRef<typeof Ark.Backdrop> & WithTestId;
export declare const DrawerBackdrop: ({ className, testId, ...rest }: DrawerBackdropProps) => import("react").JSX.Element;
export type DrawerTitleProps = ComponentPropsWithoutRef<typeof Ark.Title> & WithTestId;
export declare const DrawerTitle: ({ className, testId, ...rest }: DrawerTitleProps) => import("react").JSX.Element;
export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof Ark.Description> & WithTestId;
export declare const DrawerDescription: ({ className, testId, ...rest }: DrawerDescriptionProps) => import("react").JSX.Element;
export type DrawerCloseTriggerProps = ComponentPropsWithoutRef<typeof Ark.CloseTrigger> & WithTestId & {
    "aria-label"?: string;
};
export declare const DrawerCloseTrigger: ({ children, className, "aria-label": ariaLabel, testId, ...rest }: DrawerCloseTriggerProps) => import("react").JSX.Element;
export type DrawerGrabberProps = ComponentPropsWithoutRef<typeof Ark.Grabber> & WithTestId;
export declare const DrawerGrabber: ({ className, testId, ...rest }: DrawerGrabberProps) => import("react").JSX.Element;
export type DrawerHeaderProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export declare const DrawerHeader: ({ className, testId, ...rest }: DrawerHeaderProps) => import("react").JSX.Element;
export type DrawerBodyProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export declare const DrawerBody: ({ className, testId, ...rest }: DrawerBodyProps) => import("react").JSX.Element;
export type DrawerFooterProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export declare const DrawerFooter: ({ className, testId, ...rest }: DrawerFooterProps) => import("react").JSX.Element;
type ArkRootProps = ComponentPropsWithoutRef<typeof Ark.Root>;
export type DrawerClassNames = Partial<Record<"backdrop" | "positioner" | "content" | "header" | "title" | "description" | "body" | "grabber" | "closeButton", string>>;
export type DrawerProps = Omit<ArkRootProps, "open" | "defaultOpen" | "onOpenChange" | "children" | "swipeDirection"> & WithTestId & {
    /** Controlled open state. */
    open?: boolean;
    /** Uncontrolled initial open state. */
    defaultOpen?: boolean;
    /** Fires with the next open state. Flattened from Ark's `{ open }`. */
    onOpenChange?: (open: boolean) => void;
    /** Fires on close (any source) — Escape, backdrop click, swipe, or a controlled `onOpenChange`. */
    onClose?: () => void;
    /** RTL-aware docking edge. @default "end" */
    placement?: DrawerPlacement;
    size?: Size;
    title?: ReactNode;
    description?: ReactNode;
    /** Render the default close button in the header. @default true */
    withCloseButton?: boolean;
    /** Show the drag grabber handle. @default false */
    withGrabber?: boolean;
    /**
     * Render the dimming backdrop. Set `false` when an ancestor (e.g. the modals
     * manager) draws a single shared backdrop for the whole overlay stack.
     * @default true
     */
    withBackdrop?: boolean;
    /** Inner padding token; sets `--drawer-px`. @default "md" */
    padding?: Size;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    /** Fires after the exit animation completes — the manager unmounts on this. */
    onExitComplete?: () => void;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    children?: ReactNode;
    className?: string;
    classNames?: DrawerClassNames;
};
export declare const Drawer: {
    ({ open, defaultOpen, onOpenChange, onClose, placement, size, title, description, withCloseButton, withGrabber, withBackdrop, padding, closeOnEscape, closeOnInteractOutside, onExitComplete, container, children, className, classNames, testId, ...rest }: DrawerProps): import("react").JSX.Element;
    Root: (props: Ark.RootProps) => import("react").JSX.Element;
    Trigger: import("react").ForwardRefExoticComponent<Ark.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Context: (props: Ark.ContextProps) => ReactNode;
    Backdrop: ({ className, testId, ...rest }: DrawerBackdropProps) => import("react").JSX.Element;
    Title: ({ className, testId, ...rest }: DrawerTitleProps) => import("react").JSX.Element;
    Description: ({ className, testId, ...rest }: DrawerDescriptionProps) => import("react").JSX.Element;
    CloseTrigger: ({ children, className, "aria-label": ariaLabel, testId, ...rest }: DrawerCloseTriggerProps) => import("react").JSX.Element;
    Grabber: ({ className, testId, ...rest }: DrawerGrabberProps) => import("react").JSX.Element;
    Header: ({ className, testId, ...rest }: DrawerHeaderProps) => import("react").JSX.Element;
    Body: ({ className, testId, ...rest }: DrawerBodyProps) => import("react").JSX.Element;
    Footer: ({ className, testId, ...rest }: DrawerFooterProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=drawer.d.ts.map