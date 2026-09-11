/**
 * Bundled star glyph for `Rating` — hand-rolled (not lucide) so the component
 * works with zero icon setup, matching Popover's `icons.tsx` precedent. Both
 * inherit `currentColor` and are sized by their parent's `size-*` class.
 *
 * Two variants share one `path`: `StarIcon` fills it solid (the "full" layer),
 * `StarOutlineIcon` strokes it hollow (the "empty" backdrop). Stacking a
 * clipped `StarIcon` over a full-width `StarOutlineIcon` is what produces the
 * half-fill effect in `rating.tsx` — see `RatingSymbol`.
 */
/** Solid, filled star — the "full" layer. */
export declare const StarIcon: ({ className }: {
    className?: string;
}) => import("react").JSX.Element;
/** Hollow, outlined star — the "empty" backdrop layer. */
export declare const StarOutlineIcon: ({ className }: {
    className?: string;
}) => import("react").JSX.Element;
//# sourceMappingURL=icons.d.ts.map