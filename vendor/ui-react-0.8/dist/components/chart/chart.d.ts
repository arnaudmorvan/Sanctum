import { type ChartProps as TanStackChartProps } from "@tanstack/charts/react";
import { type ChartProps as TanStackRendererChartProps } from "@tanstack/charts/react/core";
import type { ChartValue } from "@tanstack/charts";
import { type Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Ordered categorical palette for multi-series charts, built from `COLORS`
 * (`lib/colors.ts`) minus `brand` (kept free for `color`'s own single-series
 * identity) and `gray`/`neutral` (already the chart's own chrome color, via
 * `styles.css`).
 *
 * The first four — `blue`/`green`/`red`/`pink` — are the only 4-combination
 * of this kit's own hues that clears every check in the dataviz skill's
 * `validate_palette.js` (lightness band, CVD Delta E, and normal-vision
 * separation, all-pairs, not just adjacent) without relying on a specific
 * order. Every other pairing among the remaining five hues fails outright at
 * the "solid" (500) step this palette resolves to — `red`/`orange` and
 * `teal`/`green` read as near-duplicates even to normal color vision, and
 * `purple`/`blue` and `cyan`/`pink` fail the colorblind-safety floor. Rather
 * than drop those five hues from a consumer's options entirely, they're
 * appended after the validated four: safe to reach for a 5th+ series, same
 * as this kit accepts elsewhere, paired with the legend/tooltip (TanStack's
 * own default, "secondary encoding" in the skill's terms) every multi-series
 * example in the docs already ships.
 */
export declare const CHART_PALETTE: Color[];
/**
 * Resolves an ordered `Color[]` into literal CSS color values — for a
 * consumer building an explicit color scale themselves, e.g.
 * `scaleOrdinal().range(chartColors())`, or for `Chart`'s own `color`/
 * `colors` props (below), which build the `--ts-chart-N` custom properties
 * TanStack Charts' own default categorical scale already reads (see
 * `defaultChartTheme.palette` in `@tanstack/charts`) from this same output.
 * Defaults to `CHART_PALETTE`.
 */
export declare function chartColors(colors?: Color[]): string[];
export type ChartProps<TDatum = unknown, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue> = Omit<TanStackChartProps<TDatum, TXValue, TYValue>, "renderSvg"> & WithTestId & {
    /**
     * Single accent for a one-series chart: sets `data-color` and TanStack's
     * first categorical slot (`--ts-chart-1`) to this color. Ignored for the
     * palette slots when `colors` is also given (still sets `data-color`, if
     * `colors` isn't a multi-entry array).
     */
    color?: Color;
    /**
     * Ordered palette for a multi-series chart — see `CHART_PALETTE`/
     * `chartColors`. Sets `--ts-chart-1` through `--ts-chart-N`, one per
     * entry, for TanStack's own default categorical color scale to pick up
     * with zero changes to how the chart's `definition` builds its scales.
     * Beyond `--ts-chart-6`, only a custom `scaleOrdinal().range(...)` (see
     * `chartColors`) actually consumes the extra slots — TanStack's own
     * implicit default only cycles through six.
     */
    colors?: Color[];
    /**
     * Plain SVG paint function — TanStack's default renderer if omitted.
     * Ignored when `renderer` (below) is given.
     */
    renderSvg?: TanStackChartProps<TDatum, TXValue, TYValue>["renderSvg"];
    /**
     * A full custom renderer, e.g. `motion({...})` from
     * `@tanstack/charts/motion` — needed for continuous focus/crosshair
     * motion between points. TanStack's default SVG renderer paints each
     * frame at its target position with no interpolation; a mark's own
     * `motion` option alone does nothing without this. Routes through
     * `@tanstack/charts/react/core`'s lower-level `Chart` instead of the
     * plain one when given (its own prop surface has `renderer`, not
     * `renderSvg`, so the two are mutually exclusive).
     */
    renderer?: TanStackRendererChartProps<TDatum, TXValue, TYValue>["renderer"];
};
/**
 * Chart — a light theme wrapper around TanStack Charts' own `<Chart>`
 * (`@tanstack/charts/react`), an optional peer dependency. TanStack owns the
 * grammar (`defineChart`, marks, scales — imported directly from
 * `@tanstack/charts`, never re-exported here) and the SVG rendering; this
 * wrapper only makes it look native to the kit:
 *
 *   - Chrome (axis/grid/frame/legend/crosshair) already renders through
 *     inherited `currentColor` — `styles.css` sets `color` on this root,
 *     gated by `[data-theme="dark"]` like every other dark-mode rule in the
 *     kit, so chrome tracks the kit's own theme toggle rather than the OS
 *     `prefers-color-scheme` TanStack's un-themed default would otherwise
 *     follow via its `Canvas`/`CanvasText` system-color fallbacks.
 *   - The DOM tooltip surface/text/shadow/border and its "active row"
 *     highlight theme through `--ts-chart-tooltip-*` / `--ts-chart-tooltip-
 *     active-row-*`, also set in `styles.css`.
 *   - `color`/`colors` (above) theme the categorical series palette via
 *     `--ts-chart-N`, TanStack's own default color-scale slots.
 *
 * Not routed through Ark's `ark.*` factory (no `asChild`): TanStack's
 * `<Chart>` owns its entire internal DOM/SVG tree end to end, so there's no
 * "render as" swap for `asChild` to meaningfully do here — the same
 * rationale already documented on `Skeleton`/`Collapse` for components that
 * fully own their own rendering.
 *
 * `testId`/`data-color` land on this wrapping root, not on TanStack's own
 * `<Chart>` — its prop surface is a closed, typed interface (only
 * `className`/`style` reach its DOM), so this root is the only element that
 * can carry them.
 */
export declare function Chart<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>({ color, colors, className, style, testId, renderer, renderSvg, onRender, ...rest }: ChartProps<TDatum, TXValue, TYValue>): import("react").JSX.Element;
//# sourceMappingURL=chart.d.ts.map