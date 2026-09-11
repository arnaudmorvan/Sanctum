/**
 * AmbientBackground — a decorative, brand-tinted page background: a soft
 * radial glow plus a fine film-grain noise texture, so a flat page fill reads
 * as a considered surface instead of a plain color.
 *
 * Render it once, as the first child of your root layout (so later content
 * naturally paints over it) — both layers are `position: fixed`, so a single
 * instance covers the whole viewport regardless of scroll position or page
 * height. It renders nothing interactive: `aria-hidden`, `pointer-events-none`,
 * and hidden under `forced-colors` (Windows High Contrast), since a decorative
 * background has no place overriding a user's forced palette.
 *
 * Glow and noise render as two *independent* fixed elements rather than one
 * wrapper containing two children, so either can be toggled/overridden
 * without the other, and neither traps a future blend-mode override inside
 * an isolated stacking context (`position: fixed` always creates one,
 * regardless of z-index — nesting a blended layer inside another `fixed`
 * wrapper would cut off what it can blend against).
 *
 * The actual glow/noise values are CSS custom properties (`--ambient-glow` /
 * `--ambient-noise`, defined in `theme.css`, brand-tinted and theme-aware via
 * `data-theme`) rather than hardcoded here — override either on `:root` to
 * reskin it without forking this component.
 *
 * Pure Server Component: no state, no client JS.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * <body>
 *   <AmbientBackground />
 *   {children}
 * </body>
 * ```
 */
export type AmbientBackgroundProps = {
    /** Render the radial glow layer. Default `true`. */
    glow?: boolean;
    /** Render the film-grain noise layer. Default `true`. */
    noise?: boolean;
    classNames?: {
        glow?: string;
        noise?: string;
    };
};
export declare const AmbientBackground: ({ glow, noise, classNames, }: AmbientBackgroundProps) => import("react").JSX.Element;
//# sourceMappingURL=ambient-background.d.ts.map