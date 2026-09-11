import type { ReactNode } from "react";
import type { Brand } from "../../lib/brand";
import type { Color } from "../../lib/colors";
/** A toast's id. Branded so it can't be passed a plain string or an id from a
 *  different manager (e.g. an overlay id). Minted by `createNotifier`. */
export type ToastId = Brand<string, "ToastId">;
/** Status presets — each maps to a hue + a default leading icon (see `STATUS`
 *  in `notification.tsx`). A toast with no `type` is neutral/custom. */
export type ToastType = "success" | "error" | "warning" | "info" | "loading";
/** Badge-style surface (the `variant` axis; `color` is the orthogonal axis). */
export type NotificationVariant = "filled" | "light" | "outline" | "subtle" | "default";
/**
 * A live toast in the store. `status` drives the exit lifecycle: `dismiss`
 * flips it to `"dismissing"` (which flips Ark Presence to `present=false` → the
 * exit keyframe plays), and `remove` hard-deletes it once the animation ends.
 */
export type ToastData = {
    id: ToastId;
    status: "open" | "dismissing";
    type?: ToastType;
    title?: ReactNode;
    description?: ReactNode;
    /** The action section — any content (buttons, links…), revealed independently
     *  of the description. Dismiss from within via a returned id / `notify.dismiss`. */
    action?: ReactNode;
    /** Accent palette; defaults to the status hue. */
    color?: Color;
    /** Surface; defaults to the notifier's `defaultVariant` / the status preset. */
    variant?: NotificationVariant;
    /** Custom leading glyph; `null` hides the default status icon. */
    icon?: ReactNode | null;
    /** ms until auto-dismiss. `Number.POSITIVE_INFINITY` = never (e.g. loading). */
    duration: number;
    /** Render the close (×) button. Takes precedence over `withCollapse` (on the
     *  ready-made `Notification`). */
    withCloseButton?: boolean;
};
//# sourceMappingURL=types.d.ts.map