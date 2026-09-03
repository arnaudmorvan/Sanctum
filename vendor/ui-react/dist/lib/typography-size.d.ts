/**
 * Shared visual size scale for the typography primitives, `Text` and
 * `Title`. Both map onto this exact same set of Tailwind `text-*`
 * utilities, so `size="lg"` (or `size="h1"`, see below) renders at the
 * same size on either component.
 */
export declare const TYPOGRAPHY_SIZE_CLASSES: {
    readonly xs: "text-xs";
    readonly sm: "text-sm";
    readonly md: "text-base";
    readonly lg: "text-lg";
    readonly xl: "text-xl";
    readonly "2xl": "text-2xl";
    readonly "3xl": "text-3xl";
    readonly "4xl": "text-4xl";
};
export type TypographySize = keyof typeof TYPOGRAPHY_SIZE_CLASSES;
/**
 * Heading-shaped aliases for `size` — friendlier names for the same scale.
 * `h1`..`h6` and `p` resolve to the same tokens `size="4xl"`..`size="md"`
 * already produce. Purely visual: never changes which HTML element gets
 * rendered — `Title`'s `order` still owns that, `Text` always renders
 * `<p>`/`<span>`.
 */
export declare const HEADING_SIZE_ALIASES: {
    readonly h1: "4xl";
    readonly h2: "3xl";
    readonly h3: "2xl";
    readonly h4: "xl";
    readonly h5: "lg";
    readonly h6: "md";
    readonly p: "md";
};
export type HeadingSizeAlias = keyof typeof HEADING_SIZE_ALIASES;
/** Resolves a heading alias to its underlying token; passes any other size through unchanged. */
export declare function resolveHeadingSize<TSize extends string>(size: TSize | HeadingSizeAlias): TSize;
//# sourceMappingURL=typography-size.d.ts.map