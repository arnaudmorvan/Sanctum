"use client";
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Progress } from '@ark-ui/react/progress';
import { cva } from 'class-variance-authority';
import { useId } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var CIRCULAR_DIMENSIONS = {
  xs: { size: 24, thickness: 3 },
  sm: { size: 32, thickness: 3 },
  md: { size: 44, thickness: 4 },
  lg: { size: 60, thickness: 5 },
  xl: { size: 80, thickness: 6 }
};
var circularRange = cva(
  // Transition both the dash length and offset so toggling indeterminate morphs
  // the arc (value arc ↔ fixed 25% spinner arc) instead of snapping. The spin
  // itself lives on the <svg> (base rotation 0), so it starts seamlessly.
  ["fill-none", "[transition:stroke-dasharray_300ms_ease,stroke-dashoffset_300ms_ease]"],
  {
    variants: {
      // `gradient` strokes the SVG gradient (set inline); the palette variants
      // stroke a slot var.
      variant: {
        filled: "stroke-(--c-solid)",
        gradient: ""
      }
    },
    defaultVariants: { variant: "filled" }
  }
);
var CircularProgress = ({
  value,
  defaultValue,
  onChange,
  variant,
  size,
  thickness,
  color,
  gradient,
  min = 0,
  max = 100,
  children,
  ref,
  className,
  classNames,
  style,
  testId,
  ...rest
}) => {
  const isGradient = variant === "gradient";
  const dim = CIRCULAR_DIMENSIONS[size ?? "md"];
  const gradientId = useId();
  return /* @__PURE__ */ jsxs(
    Progress.Root,
    {
      value,
      defaultValue,
      onValueChange: onChange ? ({ value: v }) => onChange(v) : void 0,
      min,
      max,
      "data-color": !isGradient ? color : void 0,
      className: cn("group/cprogress relative inline-flex", className, classNames?.root),
      style: {
        "--size": `${dim.size}px`,
        "--thickness": `${thickness ?? dim.thickness}px`,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          Progress.Circle,
          {
            ref,
            className: cn(
              // Ark's CircleRange already rotates the arc to start at 12 o'clock.
              "block",
              // Indeterminate: Ark drops the dash, so the range below pins a fixed
              // arc; spin the whole ring. Gated under reduced motion in theme.css.
              "group-data-[state=indeterminate]/cprogress:animate-progress-spin",
              classNames?.circle
            ),
            ...props({ "data-testid": testId }),
            children: [
              isGradient && /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: gradient?.from ?? "var(--color-purple-300)" }),
                gradient?.via && /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: gradient.via }),
                /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: gradient?.to ?? "var(--color-pink-400)" })
              ] }) }),
              /* @__PURE__ */ jsx(
                Progress.CircleTrack,
                {
                  className: cn(
                    "fill-none stroke-gray-light-200 dark:stroke-gray-dark-800",
                    classNames?.track
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                Progress.CircleRange,
                {
                  strokeLinecap: "round",
                  className: cn(
                    circularRange({ variant }),
                    // Indeterminate: pin a fixed 25% arc (Ark omits the dash here).
                    "group-data-[state=indeterminate]/cprogress:[stroke-dasharray:calc(var(--circumference)*0.25)_var(--circumference)]",
                    "group-data-[state=indeterminate]/cprogress:[stroke-dashoffset:0]",
                    classNames?.range
                  ),
                  style: isGradient ? { stroke: `url(#${gradientId})` } : void 0
                }
              )
            ]
          }
        ),
        children != null && /* @__PURE__ */ jsx(
          "span",
          {
            className: cn("absolute inset-0 flex items-center justify-center", classNames?.label),
            children
          }
        )
      ]
    }
  );
};

export { CircularProgress };
