import { type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Spinner — inline activity indicator.
 *
 * Pure React Server Component. The SVG strokes use `currentColor`, so when
 * `color` is omitted the spinner inherits its parent's text color — that's
 * how Button/ActionIcon embed it without extra plumbing. Pass a palette
 * `color` to route through the `data-color` + slot-var system and emit a
 * palette stroke regardless of the surrounding text color.
 *
 * Two non-palette `color` values round out the prop:
 *   - `"currentColor"` — the explicit, named form of the omit-color behavior
 *     (inherit the surrounding text color); handy when a call site wants to
 *     state the intent rather than rely on the absence of a prop.
 *   - `"default"` — the neutral high-contrast stroke that matches Button's
 *     `default` variant. Like that variant, it sidesteps the slot vars and
 *     paints literal neutral tokens (`gray-dark-900` / `gray-light-50`).
 *
 * Sizing follows the same logic: omit `size` to inherit from a parent's
 * `[&_svg]:size-*` rule (Button does this), or set it explicitly for
 * standalone use.
 *
 * Accessibility: defaults to `role="img"` + visible `<title>` so a standalone
 * spinner announces as "Loading" to screen readers. Inside containers that
 * already broadcast a busy state (`aria-busy="true"` on Button/ActionIcon),
 * pass `label={null}` to mark the spinner decorative and avoid double
 * announcements.
 */
declare const spinnerVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>["size"]>;
/**
 * The spinner's `color` accepts the shared palette plus two non-palette
 * tokens: `"currentColor"` (explicit inherit) and `"default"` (neutral
 * high-contrast stroke matching Button's `default` variant).
 */
export type SpinnerColor = Color | "currentColor" | "default";
export type SpinnerProps = Omit<ComponentPropsWithoutRef<"svg">, "color"> & WithTestId & {
    /** Explicit size; omit to inherit from a parent's `[&_svg]:size-*` rule. */
    size?: SpinnerSize;
    /**
     * Stroke color. Omit (or pass `"currentColor"`) to inherit the surrounding
     * text color; pass a palette name to route through the slot vars; pass
     * `"default"` for the neutral high-contrast stroke that matches Button's
     * `default` variant.
     */
    color?: SpinnerColor;
    /**
     * Accessible label. Defaults to `"Loading"`. Set to `null` for a purely
     * decorative spinner (e.g. inside a button that already has `aria-busy`).
     */
    label?: string | null;
    withTrack?: boolean;
};
export declare const Spinner: ({ className, size, color, label, withTrack, testId, ...rest }: SpinnerProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=spinner.d.ts.map