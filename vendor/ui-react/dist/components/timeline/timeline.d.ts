import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { Color } from "../../lib/colors";
import { type GradientDir, type GradientProps } from "../../lib/gradient";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * Three shared column tracks: an optional leading `label` (e.g. a date), the
 * fixed `axis` (bullet + connecting line), and the main `content`. Each
 * `Timeline.Item` re-declares these same tracks via `grid-cols-subgrid`, so
 * columns stay aligned across items even though any given item may only
 * populate one or two of the three.
 *
 * `label` and `axis` deliberately use `max-content` (not `auto`) as their max
 * sizing function: a track that no item populates collapses to exactly 0
 * instead of reserving dead space (the classic complaint with MUI's
 * `TimelineOppositeContent`, which reserves equal flex-basis whether or not
 * anything renders into it) — `max-content` sizes purely from the track's
 * actual content and never grows further. `auto` looks like the obvious
 * choice here but isn't: the grid track-sizing algorithm's "maximize tracks"
 * step expands *any* track whose max function is literally `auto` to absorb
 * leftover free space in the grid, even ones with zero content in every row —
 * that's the one column-sizing keyword this collapsing behavior can't use.
 * `content` gets the explicit `1fr` instead, so it's the one track that
 * intentionally absorbs whatever width `label`/`axis` don't need.
 *
 * `size` only ever touches dimensions (bullet size, line thickness, gaps,
 * spacing, text scale) via descendant selectors on stable `data-part` hooks —
 * never shape or color — so parts stay dumb and the whole tree stays a pure
 * Server Component, the same split `Table` uses for its `size` variant.
 *
 * The bullet's dimension is the one exception routed through a CSS custom
 * property (`--tl-bullet-size`, consumed by the bullet's own `size-(--tl-bullet-size)`
 * class, and by the line's `mt-(--tl-bullet-size)` — see `TimelineItem`)
 * rather than a plain `size-*` utility: a `Timeline.Item` can then override
 * just its own bullet (and keep the line in sync with it) via an inline
 * style on that same property, which always wins over the cascaded
 * class-based default regardless of selector specificity — a plain utility
 * class on the item couldn't reliably beat this descendant selector's own
 * specificity. It's declared on the root (not scoped to `[data-part=bullet]`)
 * so it cascades to the line too, not just the bullet that reads it first.
 * Each value below is a static literal (not built from `BULLET_SIZE` via
 * interpolation) because Tailwind's scanner needs the literal arbitrary-value
 * text in the source — an interpolated class name is invisible to it.
 */
declare const timelineVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    lineVariant?: "dashed" | "solid" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** Shape × color for the bullet — a small circle in the item's own
 * `data-color`. Mirrors Badge's (variant × color) axis (plus the same
 * `gradient` treatment) so a status dot reads consistently with the rest of
 * the kit. Dimensions are deliberately absent here (see `timelineVariants`)
 * so the same classes work at every `size`.
 *
 * `default` — the component's own default — mirrors Button's inverted
 * black/white treatment (dark surface in light mode, light surface in dark
 * mode), not a plain gray dot, so an untouched `<Timeline.Item>` reads as a
 * neutral, high-contrast marker rather than a colored status.
 *
 * `filled` and `default` ring their own fill with an *inset* box-shadow
 * ring-then-gap (`ring-inset` + `ring-offset`, page-background colored), not
 * plain outset `ring`/`ring-offset` — those grow the dot past
 * `--tl-bullet-size` and make it the one variant whose total footprint
 * doesn't match its same-`size` siblings. Inset shadows stay fully inside
 * the box no matter the color, so every variant — flat border or ringed
 * fill — renders at exactly the same diameter.
 *
 * That ring is for the *plain dot* reading, though — once a `bullet` icon
 * sits on top of it, a ring around a small icon reads as a stray outline
 * rather than a marker, so `TimelineItem` passes `ringed: !bullet` and the
 * `compoundVariants` below drop the ring/gap for a flat, fully filled disc
 * whenever there's icon content to frame. */
declare const timelineBulletVariants: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "subtle" | "dashed" | "gradient" | null | undefined;
    ringed?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** `Timeline`'s density scale — the kit's canonical `Size` (xs–xl). */
export type TimelineSize = Size;
export type TimelineLineVariant = NonNullable<VariantProps<typeof timelineVariants>["lineVariant"]>;
export type TimelineBulletVariant = NonNullable<VariantProps<typeof timelineBulletVariants>["variant"]>;
export type { GradientDir, GradientProps };
export type TimelineProps = HTMLArkProps<"ol"> & VariantProps<typeof timelineVariants> & WithTestId;
export type TimelineItemProps = Omit<HTMLArkProps<"li">, "color"> & Omit<VariantProps<typeof timelineBulletVariants>, "ringed"> & WithTestId & {
    /** Accent palette for the bullet. Re-exported as `Color` from `@42/ui-react`. */
    color?: Color;
    /** Overrides the default dot with any node — an icon, `<Avatar>`, or a
     * `<Spinner>` for an in-progress item. */
    bullet?: ReactNode;
    /** Overrides just this item's bullet diameter; defaults to `Timeline`'s
     * own `size`. Doesn't affect line thickness or spacing — only the dot. */
    size?: Size;
    /** Overrides `Timeline`'s connecting-line style for just the segment
     * below this item. */
    lineVariant?: TimelineLineVariant;
    /**
     * Gradient config. Only applied when `variant="gradient"`.
     * Mirrors Badge's gradient prop — unset fields fall back to the CVA
     * defaults (purple-300 → pink-400, to-r).
     */
    gradient?: GradientProps;
    /**
     * Nudges the bullet+line column down (a CSS length, e.g. `"11px"`) to
     * line the bullet up with something inside a custom `Timeline.Content` —
     * a card's title, say — that Timeline has no visibility into on its own.
     * Applied as a shared CSS custom property, not a plain padding class on
     * the bullet alone, because the connecting line is a separate sibling
     * element that also needs to shift down by the same amount to keep
     * meeting the bullet's (now lower) edge — see `TimelineItem`.
     */
    axisOffset?: string;
};
/** See `TimelineRoot`'s `isTimelineItem`/`prevItem` threading. */
type TimelinePrevItem = Pick<TimelineItemProps, "color" | "variant" | "gradient" | "lineVariant">;
/**
 * `prevItem` is internal-only — injected by `TimelineRoot`, never meant to be
 * passed directly by a consumer — so it's kept off the exported/documented
 * `TimelineItemProps` (the same internal/public split `ringed` already uses
 * on `timelineBulletVariants`, just at the plain-prop level here instead of
 * the cva-variant level).
 */
type TimelineItemInternalProps = TimelineItemProps & {
    prevItem?: TimelinePrevItem;
};
export type TimelineLabelProps = Omit<HTMLArkProps<"span">, "color"> & WithTestId & {
    /** Tints the label (and any icon inside it) to match the item's accent —
     * pass the same value given to the `Timeline.Item`'s `color`. Omit it to
     * keep the neutral muted default. */
    color?: Color;
};
export type TimelineContentProps = HTMLArkProps<"div"> & WithTestId;
export type TimelineTitleProps = HTMLArkProps<"span"> & WithTestId;
export declare const Timeline: (({ className, size, lineVariant, children, testId, ...rest }: TimelineProps) => import("react").JSX.Element) & {
    Item: ({ className, color, variant, bullet, size, lineVariant, gradient, axisOffset, style, children, prevItem, testId, ...rest }: TimelineItemInternalProps) => import("react").JSX.Element;
    Label: ({ className, color, testId, ...rest }: TimelineLabelProps) => import("react").JSX.Element;
    Content: ({ className, testId, ...rest }: TimelineContentProps) => import("react").JSX.Element;
    Title: ({ className, testId, ...rest }: TimelineTitleProps) => import("react").JSX.Element;
};
//# sourceMappingURL=timeline.d.ts.map