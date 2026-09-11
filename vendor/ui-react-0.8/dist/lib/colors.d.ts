/**
 * Single source of truth for the `color` prop accepted by colored components
 * (Button, ActionIcon, Slider, …). The const array drives both the type and
 * any runtime iteration (docs swatches, story controls).
 *
 * Adding a new color is a three-step change:
 *   1. Append the name here.
 *   2. Define its `--color-<name>-{25..950}` scale in `theme.css`.
 *   3. Add a `[data-color="<name>"]` block in `colors.css` with the slot vars
 *      (and a dark-mode override if the shade should shift).
 */
export declare const COLORS: readonly ["brand", "gray", "neutral", "red", "orange", "yellow", "green", "teal", "cyan", "blue", "purple", "pink"];
export type Color = (typeof COLORS)[number] | (string & {});
//# sourceMappingURL=colors.d.ts.map