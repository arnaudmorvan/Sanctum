"use client";
import { GRADIENT_DIR_CLASS, buildGradientVars } from '../../chunk-SKPM2FRX.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Progress as Progress$1 } from '@ark-ui/react/progress';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var progressTrack = cva(
  // `overflow-x-clip` clips the Range's rounded ends to the track's pill shape
  // (mirrors Slider's track); `relative` anchors the indeterminate sweep, whose
  // moving bar is positioned within the track's box.
  "relative w-full overflow-x-clip rounded-full bg-gray-light-200 dark:bg-gray-dark-800",
  {
    variants: {
      size: {
        xs: "h-0.5",
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2",
        xl: "h-3"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var progressRange = cva("h-full rounded-full", {
  variants: {
    variant: {
      filled: "bg-(--c-solid)",
      // Removed is it was ugly
      // light: "bg-(--c-soft)",
      // from-*/to-* are the CSS defaults for --tw-gradient-from/to and the
      // --tw-gradient-stops composition chain. A `gradient` prop only overrides
      // the individual vars it provides; the direction class is appended
      // dynamically (mirrors Badge's gradient variant).
      //
      // The gradient is stretched to the full track width and pinned to the
      // start (see the Range `style` below), so the Range reveals only its left
      // slice — the complete from→to shows only at 100%. `bg-no-repeat` keeps
      // the stretched image from tiling.
      gradient: "bg-linear-to-r from-purple-300 to-pink-400 bg-no-repeat bg-left"
    }
  },
  defaultVariants: { variant: "filled" }
});
var Progress = ({
  value,
  defaultValue,
  onChange,
  variant,
  size,
  color,
  gradient,
  min = 0,
  max = 100,
  ref,
  className,
  classNames,
  style,
  testId,
  ...rest
}) => {
  const isGradient = variant === "gradient";
  return /* @__PURE__ */ jsx(
    Progress$1.Root,
    {
      value,
      defaultValue,
      onValueChange: onChange ? ({ value: v }) => onChange(v) : void 0,
      min,
      max,
      "data-color": !isGradient ? color : void 0,
      className: cn("group/progress w-full", className, classNames?.root),
      style,
      ...rest,
      children: /* @__PURE__ */ jsx(
        Progress$1.Track,
        {
          ref,
          className: cn(progressTrack({ size }), classNames?.track),
          ...props({ "data-testid": testId }),
          children: /* @__PURE__ */ jsx(
            Progress$1.Range,
            {
              style: isGradient ? {
                backgroundSize: "calc(10000% / var(--percent, 100)) 100%",
                ...gradient ? buildGradientVars(gradient) : null
              } : void 0,
              className: cn(
                progressRange({ variant }),
                isGradient && gradient?.dir && GRADIENT_DIR_CLASS[gradient.dir],
                // Indeterminate: Ark omits the inline width, so the Range would
                // otherwise fill the track. Pin it to a fraction and animate a
                // clipped sweep. `group-data-[state=…]` reads the state Ark stamps
                // on the root.
                "group-data-[state=indeterminate]/progress:w-2/5",
                "group-data-[state=indeterminate]/progress:animate-progress-indeterminate",
                classNames?.range
              )
            }
          )
        }
      )
    }
  );
};

export { Progress };
