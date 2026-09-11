import { type ReactNode } from "react";
import type { Color } from "../../lib/colors";
import type { NotificationVariant, ToastData, ToastId } from "./types";
/**
 * `createNotifier` — the imperative toast manager, modelled on the kit's
 * `createOverlays` (a framework-agnostic `useSyncExternalStore` store + a
 * once-mounted renderer + a bound controller).
 *
 * ```tsx
 *   // notifier.ts — one instance for the app
 *   export const { notify, Notifications } = createNotifier({ placement: "bottom-end" })
 *
 *   // app root — mount the region once
 *   <Notifications />
 *
 *   // anywhere
 *   notify("Copied to clipboard")                 // neutral / custom toast
 *   notify.success("Saved")
 *   notify.error({ title: "Upload failed", action: { label: "Retry", onClick: retry } })
 *   notify.promise(save(), { loading: "Saving…", success: "Saved", error: "Failed" })
 *
 *   const id = notify.loading("Uploading…")       // keep the id to update it
 *   notify.update(id, { description: "Halfway…" }) // patch in place
 *   notify.success({ id, title: "Uploaded" })     // …or transition its status
 * ```
 */
export type NotifyPlacement = "top-start" | "top" | "top-end" | "bottom-start" | "bottom" | "bottom-end";
/** Full options for a toast. A bare `ReactNode` (string/element) is shorthand
 *  for `{ title }`. */
export type NotifyOptions = {
    title?: ReactNode;
    description?: ReactNode;
    /** ms until auto-dismiss. Omit for the notifier default; `loading` never
     *  auto-dismisses. */
    duration?: number;
    /** Provide to update/dedupe an existing toast (mint via a returned id, or
     *  cast your own: `"upload" as ToastId`). */
    id?: ToastId;
    /** Render a close button. @default true */
    withCloseButton?: boolean;
    /** The action section — any `ReactNode` (e.g. an Undo `Notification.ActionTrigger`),
     *  revealed independently of the description. */
    action?: ReactNode;
    /** Hue override (defaults to the status hue for `.success`/`.error`/…). */
    color?: Color;
    /** Badge-style surface. Defaults to the notifier's `defaultVariant`. */
    variant?: NotificationVariant;
    /** Custom leading glyph; `null` hides the default status icon. */
    icon?: ReactNode | null;
};
export type NotifyInput = ReactNode | NotifyOptions;
export type CreateNotifierOptions = {
    /** Corner/edge the stack anchors to. @default "bottom-end" */
    placement?: NotifyPlacement;
    /** Max toasts on screen before the oldest is dismissed. @default 5 */
    max?: number;
    /** Default auto-dismiss duration (ms). @default 5000 */
    duration?: number;
    /** Expand the collapsed deck into a column on hover/focus. @default true */
    expand?: boolean;
    /** Render the region in a Portal (escape clipping ancestors). @default true */
    withinPortal?: boolean;
    /** Portal target. @default document.body */
    container?: HTMLElement | null;
    /** Surface applied to toasts that don't set `variant`. */
    defaultVariant?: NotificationVariant;
};
type StatusFn = (input: NotifyInput) => ToastId;
/** The `promise` sugar: a single toast tracking an async lifecycle. */
export type NotifyPromise = <T>(promise: Promise<T> | (() => Promise<T>), messages: {
    loading: NotifyInput;
    success?: NotifyInput | ((value: T) => NotifyInput);
    error?: NotifyInput | ((error: unknown) => NotifyInput);
}) => {
    id: ToastId;
    unwrap: () => Promise<T>;
};
/** Patch a live toast by id, accepting the same shorthand. Only the fields you
 *  pass change (title/description/color/variant/icon/duration/withCloseButton);
 *  status/type are preserved. To change status, re-call a status helper with
 *  the same `id` (e.g. `notify.success({ id })`). */
export type NotifyUpdate = (id: ToastId, input: NotifyInput) => ToastId;
/** The bound controller. Callable for a neutral toast; status helpers +
 *  `promise` + `update` + `dismiss`/`remove` on top. */
export type Notify = ((input: NotifyInput) => ToastId) & {
    success: StatusFn;
    error: StatusFn;
    warning: StatusFn;
    info: StatusFn;
    loading: StatusFn;
    promise: NotifyPromise;
    update: NotifyUpdate;
    /** Dismiss a toast (plays its exit); all toasts if no id. */
    dismiss: (id?: ToastId) => void;
    /** Immediately remove a toast (no exit animation). */
    remove: (id: ToastId) => void;
    /** Whether a toast with this id is still live (open or dismissing). */
    has: (id: ToastId) => boolean;
    /** Snapshot of the live toasts (advanced / testing). */
    getToasts: () => ToastData[];
};
export type Notifier = {
    notify: Notify;
    Notifications: () => ReactNode;
};
export declare function createNotifier(options?: CreateNotifierOptions): Notifier;
export {};
//# sourceMappingURL=create-notifier.d.ts.map