import { type HTMLArkProps } from "@ark-ui/react";
import { type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import type { NotificationVariant, ToastData, ToastType } from "./types";
/**
 * Notification — the kit's **toast**: transient, non-blocking feedback spawned
 * imperatively from anywhere (`notify.success("Saved")`) via `createNotifier`.
 *
 * This module holds the *visual* compound (`Notification.Root` / `Icon` /
 * `Title` / `Description` / `ActionTrigger` / `CloseTrigger`) and the ready-made
 * `Notification` card composed from a toast-shaped object (`type` → hue + icon,
 * `title` / `description` / `action`). It is deliberately dumb: the toaster
 * behavior that drives it — store, presence, height measurement,
 * swipe-to-dismiss, stacking — lives in `store.ts` / `create-notifier.tsx`, so
 * the card is equally usable on its own (e.g. a page-level alert).
 *
 * The surface reuses Badge's two orthogonal axes — `variant` (the shape, owned
 * by `cva`) × `color` (the palette, a `data-color` attribute resolved to the
 * `--c-*` slot vars). Status presets map a `type` onto a hue + a leading icon.
 * Enter/exit is driven by Ark Presence → `data-state` → the `toast-in/out`
 * keyframes (like modal/drawer/popover).
 */
/** The `variant` × `color` surface classes — shared with `Alert` (the wide,
 *  static sibling that reuses this exact mapping via `notificationSurface`)
 *  so the two stay visually identical; only the structural classes
 *  (width, shadow, enter/exit animation) differ between the two roots. */
export declare const notificationSurface: Record<NotificationVariant, string | string[]>;
/** The toast card. Enter/exit via `data-state` keyframes (Ark Presence sets
 *  `data-state`); stacking position via the `[data-scope=notifications]` rules
 *  in theme.css (driven by the `--index`/`--offset`/`--height` vars the toaster
 *  sets on each card — see create-notifier). */
export declare const notificationRoot: (props?: ({
    variant?: NotificationVariant | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** `type` → hue + default leading icon. There are no status color *tokens* in
 *  the kit — status maps onto existing hues, reusing the same `--c-*` slots as
 *  Badge/Button. `loading` uses the kit Spinner. Exported so `Alert` (which
 *  drops the toast-only `loading` type) resolves the same presets. */
export declare const TOAST_STATUS: Record<ToastType, {
    color: Color;
    variant: NotificationVariant;
    icon: ReactNode;
}>;
export type NotificationRootProps = HTMLArkProps<"div"> & WithTestId & {
    variant?: NotificationVariant;
    /** Accent palette. Drives the `--c-*` slot vars for the whole toast. */
    color?: Color;
    /** Forwarded to the underlying element (used by Presence for enter/exit). */
    ref?: Ref<HTMLDivElement>;
};
/** Leading-glyph slot. Inherits the Root's text color (so it flips to
 *  `--c-on-solid` on `filled`) and sizes any child svg to match the text.
 *  Exported (like the parts below) so `Alert` reuses it as-is — these are
 *  width-agnostic, so nothing about them is toast-specific. */
export declare const Icon: ({ className, testId, ...rest }: ComponentPropsWithoutRef<"span"> & WithTestId) => import("react").JSX.Element;
export declare const Title: ({ className, testId, ...rest }: ComponentPropsWithoutRef<"div"> & WithTestId) => import("react").JSX.Element;
export declare const Description: ({ className, testId, ...rest }: ComponentPropsWithoutRef<"div"> & WithTestId) => import("react").JSX.Element;
export declare const ActionTrigger: ({ className, type, testId, ...rest }: ComponentPropsWithoutRef<"button"> & WithTestId) => import("react").JSX.Element;
export declare const CloseTrigger: ({ className, children, type, testId, ...rest }: ComponentPropsWithoutRef<"button"> & WithTestId) => import("react").JSX.Element;
/**
 * Props for the ready-made `Notification` card. The presentational fields it
 * shares with a spawned toast (`type` / `title` / `description` / `action` /
 * `color` / `variant` / `icon` / `withCloseButton`) plus its own collapse controls;
 * the Notifier-managed plumbing (`id` / `status` / `duration`) is optional, so a
 * standalone card is just `<Notification type="success" title="Saved" />`.
 */
export type NotificationProps = Omit<NotificationRootProps, "title"> & Omit<ToastData, "id" | "status" | "duration"> & Partial<Pick<ToastData, "id" | "status" | "duration">> & {
    /** Invoked when the close (×) button is pressed. */
    onClose?: () => void;
    /** Swap the close (×) button for a chevron that folds the description and
     *  action rows away. `withCloseButton` takes precedence over this. */
    withCollapse?: boolean;
    /** Uncontrolled initial open state — collapsed by default when `withCollapse`,
     *  open otherwise. Pair with `withCollapse`. */
    defaultOpen?: boolean;
    /** Controlled open state — pair with `onOpenChange`. */
    open?: boolean;
    /** Fired when the collapse toggle is pressed. */
    onOpenChange?: (open: boolean) => void;
};
/**
 * The ready-made **`Notification` card** — the presentational body composed from
 * a toast-shaped object: resolves `type` → `TOAST_STATUS` (hue + leading icon), lets
 * an explicit `color`/`variant`/`icon` override (`icon={null}` hides the glyph),
 * and lays out the icon/title/close row plus the independently-collapsing
 * description and action sections.
 *
 * Owns no store, presence or gesture state — the Notifier's render body drives
 * it by forwarding a `ref`, stacking style vars, pointer handlers and `onClose`
 * straight through to the `Root`. Rendered on its own it is just a status card
 * (e.g. a page-level alert). For a bespoke layout, compose the parts directly:
 * `Notification.Root`, `.Icon`, `.Title`, `.Description`, `.ActionTrigger`,
 * `.CloseTrigger`.
 */
declare function NotificationComponent({ type, title, description, action, color: _color, variant: _variant, icon: _icon, withCloseButton, withCollapse, defaultOpen, open: _open, onOpenChange, onClose, status: _status, duration: _duration, ...rest }: NotificationProps): import("react").JSX.Element;
/**
 * `Notification` — the ready-made card (batteries-included), with the compound
 * parts attached for bespoke composition. Mirrors `Tooltip`/`Modal`: the bare
 * name is the convenience form; `.Root` and friends are the primitives.
 */
export declare const Notification: typeof NotificationComponent & {
    Root: ({ className, variant, color, testId, ...rest }: NotificationRootProps) => import("react").JSX.Element;
    Icon: ({ className, testId, ...rest }: ComponentPropsWithoutRef<"span"> & WithTestId) => import("react").JSX.Element;
    Title: ({ className, testId, ...rest }: ComponentPropsWithoutRef<"div"> & WithTestId) => import("react").JSX.Element;
    Description: ({ className, testId, ...rest }: ComponentPropsWithoutRef<"div"> & WithTestId) => import("react").JSX.Element;
    ActionTrigger: ({ className, type, testId, ...rest }: ComponentPropsWithoutRef<"button"> & WithTestId) => import("react").JSX.Element;
    CloseTrigger: ({ className, children, type, testId, ...rest }: ComponentPropsWithoutRef<"button"> & WithTestId) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=notification.d.ts.map