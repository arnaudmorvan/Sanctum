import type { CSSProperties } from "react";
export type GradientDir = "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";
export type GradientProps = {
    from?: string;
    to?: string;
    via?: string;
    /** Gradient direction. Defaults to `'to-r'`. */
    dir?: GradientDir;
};
export declare const TW_VIA_STOPS: string;
/**
 * Build CSS custom property overrides for a Tailwind gradient.
 *
 * `fromVar` / `toVar` / `viaVar` let callers redirect to intermediate CSS vars
 * (e.g. `--card-gradient-from`) instead of writing `--tw-gradient-*` directly.
 * This is needed when the gradient lives on a pseudo-element that reads the
 * vars via CSS cascade rather than receiving them through a Tailwind utility.
 *
 * `fromDefault` / `toDefault` fill in values when the caller passes no `from`
 * or `to` and the CVA class has no static fallback.
 */
export declare function buildGradientVars(g: GradientProps | undefined, { fromVar, toVar, viaVar, fromDefault, toDefault, }?: {
    fromVar?: string;
    toVar?: string;
    viaVar?: string;
    fromDefault?: string;
    toDefault?: string;
}): CSSProperties;
export declare const GRADIENT_DIR_CLASS: Record<GradientDir, string>;
export declare const GRADIENT_DIR_BEFORE_CLASS: Record<GradientDir, string>;
//# sourceMappingURL=gradient.d.ts.map