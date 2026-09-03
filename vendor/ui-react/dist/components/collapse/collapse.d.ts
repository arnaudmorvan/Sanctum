import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
export type CollapseClassNames = {
    root?: string;
    content?: string;
};
/**
 * Collapse — reveal/hide content with a height animation, no JS measurement.
 *
 * The trick is a single-cell grid whose row track animates between `0fr`
 * (collapsed) and `1fr` (revealed). Because the row is a *fraction*, the track
 * resolves to the content's own height — so `auto`-height content animates
 * open and closed cleanly, both ways, without ever reading the DOM. A pure CSS
 * transition on `grid-template-rows` does the work; the inner cell clips its
 * overflow so the content slides under the fold.
 *
 * Each `Collapse` animates independently, so sibling sections (e.g. a
 * description and an action row) reveal on their own timelines. Respects
 * `prefers-reduced-motion` (the transition is dropped, the toggle is instant).
 *
 * Override the timing with a `duration-*` / `ease-*` class on `className`
 * (tailwind-merge lets the later class win); style the sliding region — layout,
 * padding — with `contentClassName`.
 */
export type CollapseProps = ComponentPropsWithoutRef<"div"> & WithTestId & {
    /** Whether the content is revealed. */
    open: boolean;
    /** Classes for the inner, clipped cell that holds (and slides) the content. */
    classNames?: CollapseClassNames;
    children?: ReactNode;
};
export declare const Collapse: ({ open, className, classNames, children, testId, ...rest }: CollapseProps) => import("react").JSX.Element;
//# sourceMappingURL=collapse.d.ts.map