import { type HTMLArkProps } from "@ark-ui/react";
import type { ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import type { NotificationVariant, ToastType } from "../notification/types";
/**
 * Alert — a wide, static status card: the same surface as `Notification`
 * (`variant` × `color`, `type` presets, the `Icon` / `Title` / `Description` /
 * `ActionTrigger` / `CloseTrigger` parts) but full-width and always-mounted —
 * for an inline note in page content (a doc callout, a form-level warning),
 * not a floating, self-dismissing toast.
 *
 * It reuses `Notification`'s non-width parts and `type` → hue/icon presets
 * directly (see `notification.tsx`) so the two stay visually identical; only
 * the root surface — width, shadow, enter/exit animation — differs.
 *
 * @example
 * ```tsx
 * <Alert type="warning" title="Breaking change" description="…" />
 * ```
 */
/** Same presets as `Notification`, minus `loading` — a static alert isn't an
 *  in-flight async state. */
export type AlertType = Exclude<ToastType, "loading">;
/** The card surface. Full-width and flat (no toast shadow/animation) — meant
 *  to sit inline in page content rather than float above it. */
export declare const alertRoot: (props?: ({
    variant?: NotificationVariant | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type AlertRootProps = HTMLArkProps<"div"> & WithTestId & {
    variant?: NotificationVariant;
    /** Accent palette. Drives the `--c-*` slot vars for the whole card. */
    color?: Color;
    ref?: Ref<HTMLDivElement>;
};
/**
 * Props for the ready-made `Alert` card — the presentational fields it
 * shares with `Notification` (`type` / `title` / `description` / `action` /
 * `color` / `variant` / `icon`), minus the collapse/notifier-only plumbing
 * that only makes sense for a spawned toast.
 */
export type AlertProps = Omit<AlertRootProps, "title"> & {
    /** Status preset — maps to a hue + a default leading icon. Omit for a neutral card. */
    type?: AlertType;
    /** The header row content. */
    title?: ReactNode;
    /** Secondary line, below the header row. */
    description?: ReactNode;
    /** Action row (e.g. an `ActionTrigger`), below the description. */
    action?: ReactNode;
    /** Override the leading glyph; `null` hides it. */
    icon?: ReactNode | null;
    /** Render the close (×) button; `onClose` fires when pressed. Static by
     *  default — an inline alert usually isn't meant to be dismissed. */
    withCloseButton?: boolean;
    /** Invoked when the close (×) button is pressed. */
    onClose?: () => void;
};
/**
 * The ready-made **`Alert` card** — the presentational body composed from a
 * status-shaped object, same as `Notification`: resolves `type` → `TOAST_STATUS`
 * (hue + leading icon), lets an explicit `color`/`variant`/`icon` override
 * (`icon={null}` hides the glyph), and lays out the icon/title/close row plus
 * the description and action sections underneath.
 *
 * No store, presence, or collapse state — it's always fully mounted. For a
 * bespoke layout, compose the parts directly: `Alert.Root`, `.Icon`, `.Title`,
 * `.Description`, `.ActionTrigger`, `.CloseTrigger`.
 */
declare function AlertComponent({ type, title, description, action, color: _color, variant: _variant, icon: _icon, withCloseButton, onClose, ...rest }: AlertProps): import("react").JSX.Element;
/**
 * `Alert` — the ready-made card (batteries-included), with the compound
 * parts attached for bespoke composition. Mirrors `Notification`: the bare
 * name is the convenience form; `.Root` and friends are the primitives.
 */
export declare const Alert: typeof AlertComponent & {
    Root: ({ className, variant, color, testId, ...rest }: AlertRootProps) => import("react").JSX.Element;
    Icon: ({ className, testId, ...rest }: import("react").ComponentPropsWithoutRef<"span"> & WithTestId) => import("react").JSX.Element;
    Title: ({ className, testId, ...rest }: import("react").ComponentPropsWithoutRef<"div"> & WithTestId) => import("react").JSX.Element;
    Description: ({ className, testId, ...rest }: import("react").ComponentPropsWithoutRef<"div"> & WithTestId) => import("react").JSX.Element;
    ActionTrigger: ({ className, type, testId, ...rest }: import("react").ComponentPropsWithoutRef<"button"> & WithTestId) => import("react").JSX.Element;
    CloseTrigger: ({ className, children, type, testId, ...rest }: import("react").ComponentPropsWithoutRef<"button"> & WithTestId) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=alert.d.ts.map