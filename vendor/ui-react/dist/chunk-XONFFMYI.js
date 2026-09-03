import { FieldShell, fieldA11yProps } from './chunk-AL57HMNZ.js';
import { useUncontrolled } from './chunk-BEL75C7N.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { useFieldContext } from '@ark-ui/react/field';
import { SegmentGroup as SegmentGroup$1 } from '@ark-ui/react/segment-group';
import { cva } from 'class-variance-authority';
import { jsx, jsxs } from 'react/jsx-runtime';

var segItem = cva(
  [
    "font-medium",
    "cursor-pointer rounded-[6px] text-center whitespace-nowrap select-none",
    "text-gray-light-700 dark:text-gray-dark-300 hover:text-gray-light-950 dark:hover:text-gray-dark-50",
    "transition-colors",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    "group-data-invalid:text-red-500"
  ],
  {
    variants: {
      variant: {
        filled: "data-[state=checked]:text-(--c-on-solid) data-[state=checked]:hover:text-(--c-on-solid-hover)",
        light: "data-[state=checked]:text-(--c-text)",
        outline: "data-[state=checked]:text-(--c-text)",
        subtle: "data-[state=checked]:text-(--c-text)",
        default: [
          "data-[state=checked]:text-gray-dark-25 dark:data-[state=checked]:text-gray-light-900",
          "data-tinted:data-[state=checked]:text-(--c-on-solid)"
        ]
      },
      size: {
        xs: "px-2 py-0.5 text-xs",
        sm: "px-2.5 py-1 text-sm",
        md: "px-3 py-1.5 text-md",
        lg: "px-4 py-2 text-lg",
        xl: "px-5 py-2.5 text-xl",
        // `input-*`: no vertical padding of its own — the tray's `min-h` (below)
        // sets the box height and this item stretches to fill it (the tray's
        // default `align-items: stretch` propagates all the way down), so the
        // label just needs to center itself inside that taller box.
        "input-xs": "flex items-center justify-center px-1 text-xs",
        "input-sm": "flex items-center justify-center px-1.5 text-sm",
        "input-md": "flex items-center justify-center px-2 text-md",
        "input-lg": "flex items-center justify-center px-3 text-lg",
        "input-xl": "flex items-center justify-center px-4 text-xl"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);
var segItemWrap = cva([
  "relative z-1 inline-flex",
  "before:absolute before:rounded-full before:bg-gray-light-300 dark:before:bg-gray-dark-600",
  "group-data-invalid:before:bg-red-500/30",
  "before:transition-opacity before:duration-200",
  // Horizontal: a vertical rule centered on the leading edge, sitting in the gap.
  "before:top-1/2 before:left-0 before:h-1/2 before:w-px before:-translate-x-1/2 before:-translate-y-1/2",
  // Vertical: a horizontal rule centered on the top edge instead.
  "in-data-[orientation=vertical]:before:top-0 in-data-[orientation=vertical]:before:left-1/2 in-data-[orientation=vertical]:before:h-px in-data-[orientation=vertical]:before:w-1/2",
  // No separator before the first segment, or flanking the active pill.
  "nth-2:before:hidden",
  "data-[state=checked]:before:opacity-0 data-[state=checked]:[&+*]:before:opacity-0"
]);
var segIndicator = cva("z-0 rounded-[6px]", {
  variants: {
    variant: {
      filled: "bg-(--c-solid)",
      light: "bg-(--c-soft) border border-(--c-soft-hover)",
      outline: "bg-transparent border border-(--c-solid)",
      subtle: "bg-(--c-soft-hover)",
      default: "bg-gray-light-900 dark:bg-gray-dark-50 data-tinted:bg-(--c-solid)"
    }
  },
  defaultVariants: { variant: "default" }
});
var segTray = cva(
  [
    "relative inline-flex rounded-input border p-0.5 transition-colors max-w-fit group",
    "data-[orientation=vertical]:flex-col",
    "data-disabled:cursor-not-allowed data-disabled:opacity-60",
    // Focus halo + accent border, driven by the active palette's `--c-solid`. Keyed
    // off Zag's `data-focus-visible` (set only when the focus came from the keyboard,
    // never a mouse click) via `:has()`, so the ring stays off when you click a segment.
    "has-data-focus-visible:border-(--c-solid) has-data-focus-visible:ring-2 has-data-focus-visible:ring-(--c-solid)/15",
    // Invalid wins over the palette: red border + red halo.
    "data-invalid:border-red-500 data-invalid:has-data-focus-visible:border-red-500 data-invalid:has-data-focus-visible:ring-red-500/15 data-invalid:bg-red-500/10"
    // Disabled affordances on the shell.
  ],
  {
    variants: {
      variant: {
        filled: ["bg-gray-light-100 dark:bg-gray-dark-800", "border-transparent"],
        light: ["bg-white/4", "border-brand-900/20 dark:border-white/15"],
        outline: ["bg-transparent border-transparent"],
        subtle: ["bg-transparent border-transparent"],
        default: ["bg-white/4", "border-brand-900/20 dark:border-white/15"]
      },
      size: {
        xs: "gap-1",
        sm: "gap-1.5",
        md: "gap-2",
        lg: "gap-3",
        xl: "gap-4",
        // `input-*`: same gap as the matching base size, plus the exact
        // `min-h` `inputShell` (input.tsx) uses at that size — so a
        // `SegmentGroup` sits flush with an `Input` / `NumberInput` of the
        // same size in a row (see `TimeRow`, which composes both).
        "input-xs": "gap-0 min-h-7",
        "input-sm": "gap-0 min-h-8",
        "input-md": "gap-0 min-h-9",
        "input-lg": "gap-0 min-h-10",
        "input-xl": "gap-0 min-h-12"
      }
    },
    defaultVariants: { variant: "default" }
  }
);
var toFieldSize = (size) => size.startsWith("input-") ? size.slice("input-".length) : size;
var normalizeItem = (item) => typeof item === "string" ? {
  value: item,
  label: item,
  disabled: false,
  color: void 0,
  payload: void 0,
  testId: `item-${item}`
} : {
  value: item.value,
  label: item.label ?? item.value,
  disabled: item.disabled ?? false,
  color: item.color,
  payload: item.payload,
  testId: item.testId ?? `item-${item.value}`
};
var SegmentGroupRoot = ({
  value,
  onValueChange,
  disabled,
  readOnly,
  required,
  invalid,
  orientation,
  name,
  id,
  ref,
  onBlur,
  color,
  className,
  testId,
  children
}) => {
  const field = useFieldContext();
  return /* @__PURE__ */ jsx(
    SegmentGroup$1.Root,
    {
      value,
      onValueChange: (d) => onValueChange(d.value),
      disabled,
      readOnly,
      required,
      invalid,
      orientation,
      name,
      id,
      ref,
      onBlur,
      "data-color": color,
      ...props({ "data-invalid": invalid, "data-testid": testId }),
      ...fieldA11yProps(field),
      className,
      children
    }
  );
};
var SegmentGroup = ({
  data,
  value,
  defaultValue,
  onChange,
  renderItem,
  orientation = "horizontal",
  invalid,
  disabled,
  readOnly,
  required,
  size = "md",
  variant = "default",
  color,
  name,
  id,
  ref,
  onBlur,
  label,
  description,
  error,
  className,
  classNames,
  testId
}) => {
  const isInvalid = invalid || error != null;
  const [selectedValue, setSelectedValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange: (v) => v != null && onChange?.(v)
  });
  const normalized = data.map(normalizeItem);
  const selected = normalized.find((item) => item.value === selectedValue);
  return /* @__PURE__ */ jsx(
    FieldShell,
    {
      label,
      description,
      error,
      required,
      disabled,
      size: toFieldSize(size),
      className: classNames?.field,
      classNames: { label: classNames?.label },
      children: /* @__PURE__ */ jsxs(
        SegmentGroupRoot,
        {
          value: selectedValue,
          onValueChange: (v) => setSelectedValue(v),
          disabled,
          readOnly,
          required,
          invalid: isInvalid,
          orientation,
          name,
          id,
          ref,
          onBlur,
          color,
          testId,
          className: segTray({
            variant,
            size,
            className: [className, classNames?.root]
          }),
          children: [
            /* @__PURE__ */ jsx(
              SegmentGroup$1.Indicator,
              {
                style: {
                  width: "var(--width)",
                  height: "var(--height)",
                  transitionProperty: "left, top, width, height, background-color, border-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)"
                },
                ...props({
                  "data-tinted": selected?.color != null,
                  "data-color": selected?.color ?? color
                }),
                className: segIndicator({ className: classNames?.indicator, variant })
              }
            ),
            normalized.map((item) => /* @__PURE__ */ jsxs(
              SegmentGroup$1.Item,
              {
                value: item.value,
                disabled: item.disabled,
                "data-testid": item.testId,
                className: cn(segItemWrap(), classNames?.item),
                children: [
                  /* @__PURE__ */ jsx(
                    SegmentGroup$1.ItemText,
                    {
                      "data-color": item.color,
                      ...props({ "data-tinted": item.color != null }),
                      className: cn(segItem({ size, variant }), classNames?.itemText),
                      children: renderItem ? /* @__PURE__ */ jsx(SegmentGroup$1.ItemContext, { children: (ctx) => renderItem(item, {
                        checked: ctx.checked,
                        disabled: ctx.disabled
                      }) }) : item.label
                    }
                  ),
                  /* @__PURE__ */ jsx(SegmentGroup$1.ItemControl, {}),
                  /* @__PURE__ */ jsx(SegmentGroup$1.ItemHiddenInput, {})
                ]
              },
              item.value
            ))
          ]
        },
        orientation
      )
    }
  );
};

export { SegmentGroup };
