import type { ReactNode } from "react";
import { type ActionIconProps } from "../action-icon/action-icon";
export type CopyRenderState = {
    /** Whether `value` was just copied to the clipboard — flips back to
     *  `false` once `timeout` elapses. */
    copied: boolean;
    /** Writes `value` to the clipboard — the exact same action `Clipboard.Trigger`
     *  itself calls on click. Wire it to your own trigger's `onClick`; `Copy`
     *  doesn't attach it for you. */
    copy: () => void;
};
export type CopyProps = Pick<ActionIconProps, "variant" | "size" | "radius" | "color" | "testId"> & {
    /** The value copied to the clipboard on click. */
    value: string;
    /** Ms before the copied state reverts to idle. Ark's own default (3000). */
    timeout?: number;
    /** Fires `true` once the value is copied — flattened from Ark's
     *  `onStatusChange`. Ark's machine only emits this on copy, never on the
     *  automatic revert to idle after `timeout` (an upstream characteristic of
     *  the machine, not a gap in this wrapper). */
    onCopiedChange?: (copied: boolean) => void;
    /** Omit for the default rendering (an icon-button `ActionIcon` whose icon
     *  swaps to a checkmark on copy). Pass a function instead to go fully
     *  headless: `Copy` renders none of its own markup and instead calls this
     *  with `{ copied, copy }`, letting you render whatever trigger you want —
     *  your own button, a text link, a custom icon — wiring `copy` to its
     *  `onClick` yourself. `copied` and `copy` still ride the same `timeout` /
     *  `onCopiedChange` behavior as the default button.
     *
     *    <Copy value={value}>
     *      {({ copied, copy }) => (
     *        <button type="button" onClick={copy}>
     *          {copied ? "Copied!" : "Copy"}
     *        </button>
     *      )}
     *    </Copy>
     */
    children?: (state: CopyRenderState) => ReactNode;
};
/**
 * Copy — a one-line preset: `Clipboard.Root` + `Clipboard.Trigger` wrapping this
 * kit's own `ActionIcon`. No visible input, just an icon button whose icon
 * swaps to a checkmark on copy and reverts to the copy icon after `timeout`.
 * `variant` / `size` / `radius` / `color` forward straight to `ActionIcon` — see
 * its own docs for that model.
 *
 *   <Copy value="https://example.com/s/abc123" />
 *
 * The accessible name comes from Ark's own `"Copy to clipboard"` /
 * `"Copied to clipboard"` translations. `Copy` is a closed leaf preset — it
 * owns its `ActionIcon` outright and doesn't accept `asChild` or a custom
 * `aria-label`; compose `Clipboard.Root` / `Clipboard.Trigger` directly (see
 * the `Clipboard` docs) for a different trigger element or translated text.
 *
 * For anything else — a text link, a custom icon, your own button styling —
 * pass a function as `children` instead and go headless: `Copy` then renders
 * only the function's own return value, no `ActionIcon`/icon-swap markup of
 * its own, and hands you `{ copied, copy }` to build the trigger yourself.
 *
 *   <Copy value="https://example.com/s/abc123">
 *     {({ copied, copy }) => (
 *       <button type="button" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
 *     )}
 *   </Copy>
 */
export declare const Copy: ({ value, timeout, onCopiedChange, variant, size, radius, color, testId, children, }: CopyProps) => import("react").JSX.Element;
//# sourceMappingURL=copy.d.ts.map