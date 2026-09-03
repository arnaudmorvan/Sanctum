import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { Align } from "../../lib/align";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * `size` here only ever controls border thickness (1–5px, Mantine's own
 * xs..xl mapping) — unlike Timeline's density `size`, there's no parent/
 * child override relationship to defeat via a CSS custom property, so
 * thickness is a plain `(orientation × size)` compound lookup, the simpler
 * of the two mechanisms this kit uses for a sized dimension.
 *
 * Horizontal orientation's thickness sits on the block axis (`border-t`) —
 * RTL never touches top/bottom, so a physical property is fine, same split
 * `ButtonGroup` uses between its own horizontal/vertical orientations.
 * Vertical orientation's thickness sits on the inline axis, so it uses the
 * logical `border-s` (border-inline-start) instead, matching Timeline's own
 * vertical connecting line.
 *
 * Tailwind's default border-width scale has no 3px/5px step, hence the
 * arbitrary `[Npx]` values below — static literals (not interpolated) so
 * Tailwind v4's scanner keeps them.
 */
declare const dividerVariants: (props?: ({
    orientation?: "horizontal" | "vertical" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    variant?: "dashed" | "dotted" | "solid" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type DividerOrientation = NonNullable<VariantProps<typeof dividerVariants>["orientation"]>;
export type DividerVariant = NonNullable<VariantProps<typeof dividerVariants>["variant"]>;
/** Divider's thickness scale is the kit's canonical `Size` (xs–xl). */
export type DividerSize = Size;
export type DividerLabelPosition = Align;
export type DividerProps = Omit<HTMLArkProps<"div">, "children"> & VariantProps<typeof dividerVariants> & WithTestId & {
    /**
     * Accent palette for the line. Re-exported as `Color` from `@42/ui-react`.
     * Unset renders a neutral hairline — it deliberately does not fall
     * through to `--c-solid` (that cascades to a bold black/white default at
     * `:root`, wrong for a hairline).
     */
    color?: Color;
    /**
     * Content centered on the line (a word, an icon). Renders as three real
     * flex children — a leading line, the label, a trailing line — rather
     * than `::before`/`::after` pseudo-elements, matching Timeline's own line
     * convention. The label text is small (`text-xs`) and colored the same as
     * the line itself, so it reads as part of the separator rather than
     * competing with surrounding content. Omit for a plain, unlabeled line.
     */
    label?: ReactNode;
    /**
     * Where `label` sits along the line. `"start"`/`"end"` follow flexbox's
     * own logical main-axis edges (matching `Drawer`'s `placement` prop), so
     * they flip correctly under `dir="rtl"` with no extra CSS. Ignored when
     * `label` is unset. Both segments render equally (a centered label) by
     * default.
     */
    labelPosition?: DividerLabelPosition;
};
/**
 * Divider — a thin separator line, horizontal or vertical, with an optional
 * centered/leading/trailing label. Pure React Server Component.
 *
 * `orientation="vertical"` relies entirely on `align-self: stretch` — like
 * Mantine's own Divider, it has no self-sizing, so it needs a flex/grid
 * parent that already provides a definite height, or it renders with zero
 * height.
 *
 * ```tsx
 * <Divider />
 * <Divider label="OR" />
 * <Divider orientation="vertical" />
 * ```
 */
export declare const Divider: ({ className, orientation, size, variant, color, label, labelPosition, testId, ...rest }: DividerProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=divider.d.ts.map