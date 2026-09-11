import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * The full 9-cell grid `position` can anchor to. Already logical/RTL-aware —
 * `start`/`end` are inline-axis (flip under `dir="rtl"`), `top`/`middle`/
 * `bottom` are block-axis (unaffected by direction).
 */
export type IndicatorPosition = "top-start" | "top-center" | "top-end" | "middle-start" | "middle-center" | "middle-end" | "bottom-start" | "bottom-center" | "bottom-end";
/** A single px value applied to both axes, or independent x/y nudges. */
export type IndicatorOffset = number | {
    x: number;
    y: number;
};
export type IndicatorProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & WithTestId & {
    /** Which corner (or edge midpoint) of `children` the dot anchors to, straddling it. Default `"top-end"`. */
    position?: IndicatorPosition;
    /** Extra px nudge away from the anchor point — a single number for both axes, or `{ x, y }` independently. Ignored on whichever axis a position has no directional edge for (the `center`/`middle` axis of that position). */
    offset?: IndicatorOffset;
    /** Dot diameter (no `label`) or badge height, off the kit's shared `xs`–`xl` scale. Default `"md"`. */
    size?: Size;
    /** Accent palette. Re-exported as `Color` from `@42/ui-react`. Unset cascades the neutral/brand default from `--c-solid` at `:root`, same as `Badge`'s `filled` variant. */
    color?: Color;
    /** Numeric or text content. Omitted renders a plain dot. A number of `0` is still "set" — see `showZero`. */
    label?: ReactNode;
    /** Caps a numeric `label` display at `` `${maxValue}+` `` once it's exceeded. No-ops when `label` isn't a number. */
    maxValue?: number;
    /** When `label` is the number `0`, `false` hides the indicator entirely (children still render). Default `true`. */
    showZero?: boolean;
    /** Renders a second layer behind the dot doing a CSS `animate-ping` pulse — no JS, no observer. Respects `prefers-reduced-motion` (the pulse layer is dropped, matching `Skeleton`'s own `motion-reduce:animate-none` treatment of its pulse). */
    processing?: boolean;
    /** Hides the dot/badge entirely — `children` still render. Default `false`. */
    disabled?: boolean;
    /** Rings the dot in a page-surface color so it reads as cut into whatever it overlays. Color comes from the `--indicator-border-color` custom property (default light=white/dark=gray-dark-900 — this kit has no dedicated "page background" token). Unlike `Avatar.Group`'s mask-based notch, `Indicator` has no same-size neighbor to cut a real hole for, so it still falls back to this color guess. Override the property — e.g. `style={{ "--indicator-border-color": "var(--color-brand-50)" }}` — when `Indicator` sits on a non-default surface (a colored `Card`, a tinted panel) so the ring actually matches instead of just the page-background guess. */
    withBorder?: boolean;
    /** Corner rounding of the label badge shape once `label` is set — irrelevant to the bare dot, which is always a circle. Default `"xl"`. */
    radius?: Size;
    /** Root renders as a `<span>` with `display: inline-block` instead of the default `<div>`/`block` — for wrapping a run of inline content (a word, an icon) that shouldn't force its own line. The tag itself has to change, not just the display: a `<div>` is flow content and is never valid inside phrasing content (e.g. a `<p>`), regardless of its CSS display. Both modes shrink-wrap to `children`'s own intrinsic size either way (the default adds `width: fit-content` — a plain `display: block` box would otherwise stretch to its container's full width, dragging the corner dot away from a small child like an `Avatar` whenever the parent isn't already a flex/grid context). */
    inline?: boolean;
    /** Stacking order of the dot/badge overlay. */
    zIndex?: number;
    /** The element being decorated. Required — `Indicator` has no meaningful standalone render. */
    children: ReactNode;
};
/**
 * Indicator — a small dot or numeric/text badge overlaid on a corner (or edge
 * midpoint) of another element, e.g. an unread-count bubble on an `Avatar` or
 * a status dot on an `ActionIcon`. Fully static: `position`, `offset`,
 * `color`, `label`, and the `processing` pulse are all render-time props +
 * CSS — no JS measurement, no observer, no client component anywhere in this
 * file (or its barrel).
 *
 * No `asChild` — same reasoning as `Skeleton`: the root must stay a real
 * wrapping element around *two* things at once (`children` **and** the
 * absolutely-positioned dot sibling), which is structurally incompatible
 * with `asChild`'s single-element merge. Don't add it later assuming every
 * component needs it.
 *
 *   <Indicator label={3} color="red">
 *     <Avatar name="Ada Lovelace" />
 *   </Indicator>
 *
 *   <Indicator processing color="green" position="bottom-end">
 *     <ActionIcon><Wifi /></ActionIcon>
 *   </Indicator>
 */
export declare const Indicator: ({ className, position, offset, size, color, label, maxValue, showZero, processing, disabled, withBorder, radius, inline, zIndex, style, children, testId, ...rest }: IndicatorProps) => import("react").JSX.Element;
//# sourceMappingURL=indicator.d.ts.map