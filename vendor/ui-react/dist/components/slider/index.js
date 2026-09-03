"use client";
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Slider as Slider$1 } from '@ark-ui/react/slider';
import { cva } from 'class-variance-authority';
import { jsx, jsxs } from 'react/jsx-runtime';

var toValueArray = (v) => v === void 0 ? void 0 : Array.isArray(v) ? v : [v];
var marksWrapper = cva("", {
  variants: {
    size: {
      xs: "px-0.5",
      sm: "px-0.75",
      md: "px-1.25",
      lg: "px-1.5",
      xl: "px-1.5"
    }
  },
  defaultVariants: { size: "md" }
});
var sliderTrack = cva(
  // `overflow-x-clip overflow-y-visible` keeps the Range's rounded ends
  // clipped (so the filled bar follows the track's pill shape) while
  // letting mark labels spill below the track without being cut off.
  [
    "relative w-full overflow-x-clip overflow-y-visible rounded-full bg-gray-light-200 dark:bg-gray-dark-800",
    "cursor-pointer disabled:cursor-not-allowed data-disabled:cursor-not-allowed",
    // Red invalid state — Ark stamps `data-invalid` on the root, so the track
    // (a descendant) reads it via `group-data-[invalid]`.
    "group-data-[invalid]/slider:bg-red-500/20 group-data-[invalid]/slider:ring-1 group-data-[invalid]/slider:ring-red-500/40"
  ],
  {
    variants: {
      // Padding matches half the dot width per size: the marker wrapper
      // lives inside the track as `relative`, so it occupies the track's
      // content box (padding-inset). Dot centers land at the inset edges,
      // and `-translate-x-1/2` puts the dot's outer edge flush with the
      // track's visible end. No first/last special-casing needed.
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
var sliderRange = cva(
  "h-full bg-(--c-solid) data-disabled:bg-(--c-solid-disabled) rounded-full",
  {
    variants: {
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: ""
      }
    }
  }
);
var sliderThumb = cva(
  [
    "hidden",
    "block rounded-full border-2 bg-gray-light-200 dark:bg-gray-dark-800 shadow-sm z-1",
    "border-(--c-solid)",
    "transition-transform",
    "cursor-pointer disabled:cursor-not-allowed data-disabled:cursor-not-allowed data-disabled:border-(--c-solid-disabled)",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--c-solid)/40",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500 dark:focus-visible:ring-offset-gray-dark-950",
    "data-dragging:scale-110"
  ],
  {
    variants: {
      size: {
        xs: "size-2.5 border-2",
        sm: "size-3 border-2",
        md: "size-4 border-3",
        lg: "size-5 border-4",
        xl: "size-6 border-4"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var sliderMark = cva(
  [
    "absolute top-1/2 -translate-y-1/2",
    "before:rounded-full",
    "before:absolute before:top-full before:-translate-y-1/2 before:-translate-x-1/2",
    "before:bg-gray-light-300 dark:before:bg-gray-dark-700 state-under-or-at:before:bg-(--c-solid-hover)"
  ],
  {
    variants: {
      size: {
        xs: "before:size-px",
        sm: "before:size-0.5",
        md: "before:size-1",
        lg: "before:size-1.5",
        xl: "before:size-2"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var THUMB_DIAMETER_PX = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24
};
var Slider = ({
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  marks,
  label,
  size,
  showLabel = "hover",
  color,
  min = 0,
  max = 100,
  step,
  disabled,
  invalid,
  onBlur,
  ref,
  description,
  error,
  required,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const _showLabel = label !== null && label !== void 0 && showLabel !== "never" && showLabel !== false;
  const renderLabel = (val) => typeof label === "function" ? label(val) : label;
  const showMarks = marks !== null && marks !== void 0 && marks.length > 0;
  const isInvalid = invalid || error != null;
  const isRange = Array.isArray(value ?? defaultValue);
  const emit = (next) => isRange ? next : next[0] ?? 0;
  const thumbDiameter = THUMB_DIAMETER_PX[size ?? "md"];
  return /* @__PURE__ */ jsx(
    FieldShell,
    {
      description,
      error,
      required,
      disabled,
      size: size ?? "md",
      className: classNames?.field,
      children: /* @__PURE__ */ jsxs(
        Slider$1.Root,
        {
          value: toValueArray(value),
          defaultValue: toValueArray(defaultValue),
          onValueChange: onChange ? ({ value: v }) => onChange(emit(v)) : void 0,
          onValueChangeEnd: onChangeEnd ? ({ value: v }) => onChangeEnd(emit(v)) : void 0,
          min,
          max,
          step,
          disabled,
          onBlur,
          thumbSize: { width: thumbDiameter, height: thumbDiameter },
          "data-color": color,
          ...props({ "data-invalid": isInvalid, "data-testid": testId }),
          className: cn(
            "group/slider relative flex w-full flex-col gap-2",
            { "mb-4": showMarks },
            className,
            classNames?.root
          ),
          ...rest,
          children: [
            /* @__PURE__ */ jsxs(
              Slider$1.Control,
              {
                className: cn(
                  "relative flex w-full items-center py-2",
                  marksWrapper({ size }),
                  classNames?.control
                ),
                children: [
                  /* @__PURE__ */ jsx(Slider$1.Track, { className: cn(sliderTrack({ size }), classNames?.track), children: /* @__PURE__ */ jsx(Slider$1.Range, { className: cn(sliderRange({ size }), classNames?.range) }) }),
                  /* @__PURE__ */ jsx(Slider$1.Context, { children: (api) => api.value.map((val, i) => /* @__PURE__ */ jsxs(
                    Slider$1.Thumb,
                    {
                      index: i,
                      ref: i === 0 ? ref : void 0,
                      "aria-invalid": isInvalid || void 0,
                      ...props({ "data-testid": testId && `${testId}-thumb-${i}` }),
                      className: cn(sliderThumb({ size }), classNames?.thumb),
                      children: [
                        /* @__PURE__ */ jsx(Slider$1.HiddenInput, {}),
                        _showLabel && /* @__PURE__ */ jsx(
                          "span",
                          {
                            "aria-hidden": "true",
                            className: cn(
                              "pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium transition-opacity",
                              "bg-gray-dark-900 text-white dark:bg-gray-dark-25 dark:text-gray-dark-900",
                              showLabel === "hover" ? "opacity-0 group-hover/slider:opacity-100 group-focus-within/slider:opacity-100 group-data-dragging:opacity-100" : "opacity-100",
                              classNames?.thumbLabel
                            ),
                            children: renderLabel(val)
                          }
                        )
                      ]
                    },
                    val
                  )) })
                ]
              }
            ),
            showMarks && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 h-full w-full select-none pointer-events-none ", children: /* @__PURE__ */ jsx(
              Slider$1.MarkerGroup,
              {
                className: cn(
                  marksWrapper({ size }),
                  "w-full h-full relative",
                  classNames?.markGroup
                ),
                children: marks.map((m) => /* @__PURE__ */ jsx(
                  Slider$1.Marker,
                  {
                    value: m.value,
                    className: cn(sliderMark({ size }), classNames?.mark),
                    children: m.label !== void 0 && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(
                          "absolute top-3/4 translate-y-3/4 -translate-x-1/2",
                          "text-xs text-gray-light-600 dark:text-gray-dark-400",
                          classNames?.markLabel
                        ),
                        children: m.label
                      }
                    )
                  },
                  m.value
                ))
              }
            ) })
          ]
        }
      )
    }
  );
};

export { Slider };
