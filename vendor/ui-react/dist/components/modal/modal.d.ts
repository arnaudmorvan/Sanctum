import { Dialog as Ark } from "@ark-ui/react/dialog";
import { type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
declare const modalPositioner: (props?: ({
    position?: "center" | "top" | "bottom" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const modalContent: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | null | undefined;
    radius?: "sm" | "md" | "lg" | "xl" | "none" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ModalBackdropProps = ComponentPropsWithoutRef<typeof Ark.Backdrop> & WithTestId;
export type ModalPosition = VariantProps<typeof modalPositioner>["position"];
export type ModalPositionerProps = ComponentPropsWithoutRef<typeof Ark.Positioner> & WithTestId & {
    position?: ModalPosition;
};
export type ModalContentProps = ComponentPropsWithoutRef<typeof Ark.Content> & VariantProps<typeof modalContent> & WithTestId;
export type ModalTitleProps = ComponentPropsWithoutRef<typeof Ark.Title> & WithTestId;
export type ModalDescriptionProps = ComponentPropsWithoutRef<typeof Ark.Description> & WithTestId;
export type ModalCloseTriggerProps = ComponentPropsWithoutRef<typeof Ark.CloseTrigger> & WithTestId & {
    "aria-label"?: string;
};
export type ModalHeaderProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export type ModalBodyProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export type ModalFooterProps = ComponentPropsWithoutRef<"div"> & WithTestId;
type ArkRootProps = ComponentPropsWithoutRef<typeof Ark.Root>;
export type ModalSize = NonNullable<VariantProps<typeof modalContent>["size"]>;
export type ModalRadius = NonNullable<VariantProps<typeof modalContent>["radius"]>;
export type ModalClassNames = Partial<Record<"backdrop" | "positioner" | "content" | "header" | "title" | "description" | "body" | "closeButton", string>>;
export type ModalProps = Omit<ArkRootProps, "open" | "defaultOpen" | "onOpenChange" | "children" | "role"> & WithTestId & {
    /** Controlled open state. */
    open?: boolean;
    /** Uncontrolled initial open state. */
    defaultOpen?: boolean;
    /** Fires with the next open state. Flattened from Ark's `{ open }`. */
    onOpenChange?: (open: boolean) => void;
    /** Header title; renders the header when set. */
    title?: ReactNode;
    /** Optional subtitle under the title. */
    description?: ReactNode;
    size?: ModalSize;
    radius?: ModalRadius;
    /** Vertically center the modal (vs. anchored near the top). */
    position?: ModalPosition;
    /** Render the default close button in the header. @default true */
    withCloseButton?: boolean;
    /**
     * Render the dimming backdrop. Set `false` when an ancestor (e.g. the modals
     * manager) draws a single shared backdrop for the whole overlay stack.
     * @default true
     */
    withBackdrop?: boolean;
    /** Inner padding token; sets `--modal-px`. @default "md" */
    padding?: Size;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    /** Use `alertdialog` semantics (confirm flows). @default "dialog" */
    role?: "dialog" | "alertdialog";
    /** Fires after the exit animation completes; the manager unmounts on this. */
    onExitComplete?: () => void;
    /** Fires on close (any source) */
    onClose?: () => void;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    children?: ReactNode;
    className?: string;
    classNames?: ModalClassNames;
};
export declare const Modal: (({ open, defaultOpen, onOpenChange, onClose, title, description, size, radius, position, withCloseButton, withBackdrop, padding, closeOnEscape, closeOnInteractOutside, role, onExitComplete, container, children, className, classNames, testId, ...rest }: ModalProps) => import("react").JSX.Element) & {
    Root: (props: Ark.RootProps) => import("react").JSX.Element;
    Trigger: import("react").ForwardRefExoticComponent<Ark.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Context: (props: Ark.ContextProps) => ReactNode;
    Backdrop: ({ className, testId, ...rest }: ModalBackdropProps) => import("react").JSX.Element;
    Positioner: ({ className, position, testId, ...rest }: ModalPositionerProps) => import("react").JSX.Element;
    Content: ({ className, size, radius, testId, ...rest }: ModalContentProps) => import("react").JSX.Element;
    Title: ({ className, testId, ...rest }: ModalTitleProps) => import("react").JSX.Element;
    Description: ({ className, testId, ...rest }: ModalDescriptionProps) => import("react").JSX.Element;
    CloseTrigger: ({ children, className, "aria-label": ariaLabel, testId, ...rest }: ModalCloseTriggerProps) => import("react").JSX.Element;
    Header: ({ className, testId, ...rest }: ModalHeaderProps) => import("react").JSX.Element;
    Body: ({ className, testId, ...rest }: ModalBodyProps) => import("react").JSX.Element;
    Footer: ({ className, testId, ...rest }: ModalFooterProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=modal.d.ts.map