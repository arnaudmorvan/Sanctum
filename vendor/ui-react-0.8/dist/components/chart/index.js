"use client";
import { COLORS } from '../../chunk-JBVFWSRQ.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Chart as Chart$2 } from '@tanstack/charts/react';
import { Chart as Chart$1 } from '@tanstack/charts/react/core';
import { jsx } from 'react/jsx-runtime';

var KNOWN_COLORS = COLORS;
var resolveChartColor = (color) => KNOWN_COLORS.includes(color) ? `var(--color-${color}-500)` : color;
var CHART_PALETTE = [
  "blue",
  "green",
  "red",
  "pink",
  "orange",
  "purple",
  "teal",
  "yellow",
  "cyan"
];
function chartColors(colors = CHART_PALETTE) {
  return colors.map(resolveChartColor);
}
function Chart({
  color,
  colors,
  className,
  style,
  testId,
  renderer,
  renderSvg,
  onRender,
  ...rest
}) {
  const palette = colors ?? (color ? [color] : void 0);
  const paletteStyle = palette ? Object.fromEntries(
    chartColors(palette).map((value, index) => [`--ts-chart-${index + 1}`, value])
  ) : void 0;
  const dataColor = color ?? (colors?.length === 1 ? colors[0] : void 0);
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-part": "root",
      "data-color": dataColor,
      className: cn("chart-root", className),
      style: { ...paletteStyle, ...style },
      ...props({ "data-testid": testId }),
      children: renderer ? (
        // `onRender`'s context is renderer-agnostic here (no guaranteed
        // `.svg`, unlike the plain SVG renderer below) — a real narrowing,
        // not a cast of convenience; `renderer` callers reach for `onRender`
        // rarely enough that re-typing the whole prop for this one branch
        // isn't worth it.
        /* @__PURE__ */ jsx(
          Chart$1,
          {
            renderer,
            onRender,
            ...rest
          }
        )
      ) : /* @__PURE__ */ jsx(Chart$2, { renderSvg, onRender, ...rest })
    }
  );
}

export { CHART_PALETTE, Chart, chartColors };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map