"use client";
import { fieldLabel, FieldShell, fieldRoot, fieldA11yProps } from '../../chunk-AL57HMNZ.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { useFieldContext } from '@ark-ui/react/field';
import { Switch as Switch$1 } from '@ark-ui/react/switch';
import { cva } from 'class-variance-authority';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var switchTrack = cva(
  [
    "inline-flex shrink-0 items-center rounded-sm transition-colors relative",
    // Neutral resting track.
    "bg-gray-light-300 dark:bg-gray-dark-700",
    // Checked fill — palette solid, via the slot var.
    "data-[state=checked]:bg-(--c-solid)",
    // Focus ring: a solid 3px brand ring with a 2px offset (the kit's standard
    // focus affordance), keyed off the Control's own `data-focus-visible` (zag
    // mirrors the hidden input's focus-visible state onto every switch part).
    "data-focus-visible:ring-2 data-focus-visible:ring-brand-500 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-white dark:data-focus-visible:ring-offset-gray-dark-950",
    // Invalid wins over the palette: red wash.
    "data-invalid:bg-red-500/40",
    // Disabled affordances.
    "data-disabled:opacity-60 data-disabled:cursor-not-allowed"
  ],
  {
    variants: {
      size: {
        xs: "h-4 w-7 p-0.5",
        sm: "h-4.5 w-8 p-0.5",
        md: "h-5 w-9 p-0.5",
        lg: "h-6 w-11 p-0.5",
        xl: "h-7 w-13 p-0.5"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var switchThumb = cva(
  [
    "rounded-xs bg-white shadow-sm transition-[inset] absolute inset-s-0.5 data-[state=checked]:inset-s-1/2"
  ],
  {
    variants: {
      size: {
        xs: "size-3",
        sm: "size-3.5",
        md: "size-4",
        lg: "size-5",
        xl: "size-6"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var SwitchHiddenInput = ({ ref, onBlur }) => {
  const field = useFieldContext();
  return /* @__PURE__ */ jsx(Switch$1.HiddenInput, { ref, onBlur, ...fieldA11yProps(field) });
};
var Switch = ({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  description,
  error,
  required,
  invalid,
  disabled,
  readOnly,
  size = "md",
  color = "green",
  name,
  value,
  id,
  ref,
  onBlur,
  className,
  classNames,
  testId
}) => {
  const isInvalid = invalid || error != null;
  const hasStack = label != null && (description != null || error != null);
  const labelNode = label != null && /* @__PURE__ */ jsxs(
    Switch$1.Label,
    {
      className: cn(fieldLabel({ size }), !hasStack && "min-w-0 flex-1", classNames?.label),
      children: [
        label,
        required && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "ms-0.5 text-red-500", children: "*" })
      ]
    }
  );
  return /* @__PURE__ */ jsxs(
    Switch$1.Root,
    {
      checked,
      defaultChecked,
      onCheckedChange: onCheckedChange ? (d) => onCheckedChange(d.checked) : void 0,
      invalid: isInvalid,
      disabled,
      readOnly,
      required,
      name,
      value,
      id,
      "data-color": color,
      ...props({ "data-testid": testId }),
      className: cn("inline-flex items-center gap-2 select-none", className, classNames?.root),
      children: [
        /* @__PURE__ */ jsx(Switch$1.Control, { className: cn(switchTrack({ size }), classNames?.control), children: /* @__PURE__ */ jsx(Switch$1.Thumb, { className: cn(switchThumb({ size }), classNames?.thumb) }) }),
        hasStack ? /* @__PURE__ */ jsxs("div", { className: cn(fieldRoot({ size }), classNames?.field), children: [
          labelNode,
          /* @__PURE__ */ jsx(FieldShell, { description, error, size, children: /* @__PURE__ */ jsx(SwitchHiddenInput, { ref, onBlur }) })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          labelNode,
          /* @__PURE__ */ jsx(
            FieldShell,
            {
              description,
              error,
              size,
              className: classNames?.field,
              children: /* @__PURE__ */ jsx(SwitchHiddenInput, { ref, onBlur })
            }
          )
        ] })
      ]
    }
  );
};

export { Switch };
