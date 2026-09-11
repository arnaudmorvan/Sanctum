import { type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * Reproduces DataTable's own `DATA_TABLE_SKELETON_CLASS` exactly at the
 * rectangular default (`animate-pulse rounded-xs bg-black/15 dark:bg-white/8`)
 * — DataTable renders through this component internally, so pixel parity here
 * is load-bearing, not incidental. Monochrome by design: no `color` prop —
 * this is a shape axis, not a fill-treatment axis (see code-style.md's
 * variant/color split), and a loading placeholder should stay neutral rather
 * than compete with the content it precedes.
 *
 * `size` reuses the kit's shared `xs..xl` scale (`lib/sizes.ts`) at the same
 * `h-2..h-6` steps DataTable's own density scale already used — a text-line
 * bar height for `rectangular`, or (via the matching `size-2..size-6` step on
 * both axes) a small dot diameter for `circular`. Not wide enough for a
 * typical avatar circle by design — pass `width`/`height` for that.
 */
declare const skeletonVariants: (props?: ({
    shape?: "rectangular" | "circular" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type SkeletonShape = NonNullable<VariantProps<typeof skeletonVariants>["shape"]>;
export type SkeletonSize = Size;
export type SkeletonClassNames = {
    /** The placeholder box itself in wrap mode — separate from the wrapper's
     * own `className` so a caller can restyle just the placeholder (radius,
     * background) without touching the wrapper's layout. */
    skeleton?: string;
};
/**
 * Skeleton — a loading placeholder. Not routed through Ark's `ark.*` factory
 * (no `asChild`): wrap mode below repurposes `children` to mean "real content
 * to reveal," which collides with `asChild`'s usual meaning (the one child to
 * merge root props onto) — the same bespoke-primitive rationale as `Collapse`.
 *
 * **Standalone mode** (no `children`) — a fixed placeholder shape:
 *
 *   <Skeleton />
 *   <Skeleton shape="circular" width={40} height={40} />
 *
 * **Wrap mode** (`children` passed) — sizes a placeholder to the real
 * content's own box (no measurement, pure CSS: the content stays mounted but
 * `invisible` while loading, so it keeps contributing its box to the relative
 * wrapper the placeholder absolutely fills), then reveals the content once
 * `loading` is `false`:
 *
 *   <Skeleton loading={isLoading}>
 *     <Avatar src={user.avatarUrl} />
 *   </Skeleton>
 *
 * For complex card-style layouts, compose multiple `Skeleton`s inside the
 * kit's existing `Card`/`Flex`/`Grid` — Skeleton itself has no layout logic.
 *
 * The wrapper shrink-wraps to the content's *intrinsic* size (`inline-block`)
 * — content that itself stretches to fill its container (`w-full`, `flex-1`,
 * an unconstrained block paragraph) won't get a full-width overlay from wrap
 * mode alone. Add `className="block w-full"` in that case, or use standalone
 * mode with an explicit `width` instead.
 */
export type SkeletonProps = ComponentPropsWithoutRef<"div"> & VariantProps<typeof skeletonVariants> & WithTestId & {
    /** Fixed width. Standalone mode only (no `children`) — wrap mode sizes
     * itself off the real content instead. Needed for an avatar-scale
     * `circular` placeholder, since `size`'s scale tops out at 24px. */
    width?: CSSProperties["width"];
    /** Fixed height. Standalone mode only — see `width`. */
    height?: CSSProperties["height"];
    /** Plays the pulse animation. Default `true`. */
    animate?: boolean;
    /** Standalone (no `children`): `false` renders nothing. Wrap mode
     * (`children` set): `false` reveals the real children instead of the
     * placeholder. Default `true`. */
    loading?: boolean;
    /** Wrap mode: real content to size the placeholder against, revealed
     * once `loading` is `false`. Omit for a standalone fixed-shape
     * placeholder. */
    children?: ReactNode;
    classNames?: SkeletonClassNames;
};
export declare const Skeleton: ({ className, classNames, shape, size, width, height, animate, loading, style, children, testId, ...rest }: SkeletonProps) => import("react").JSX.Element | null;
export {};
//# sourceMappingURL=skeleton.d.ts.map