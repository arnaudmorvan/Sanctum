"use client";
import { InputBase, inputControlClasses } from '../../chunk-MWXEQ5QX.js';
import { FieldShell, fieldA11yProps } from '../../chunk-AL57HMNZ.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { useFieldContext } from '@ark-ui/react/field';
import { jsx } from 'react/jsx-runtime';

var TEXTAREA_PADDING = {
  xs: { className: "ps-1.5 pe-1.5 py-1", blockRem: 0.5 },
  sm: { className: "ps-2 pe-2 py-1.5", blockRem: 0.75 },
  md: { className: "ps-2 pe-2 py-2", blockRem: 1 },
  lg: { className: "ps-3 pe-3 py-2.5", blockRem: 1.25 },
  xl: { className: "ps-3.5 pe-3.5 py-3", blockRem: 1.5 }
};
var TextareaControl = ({
  variant,
  size,
  color,
  invalid,
  disabled,
  readOnly,
  minRows,
  maxRows,
  ref,
  resizable,
  className,
  classNames,
  style,
  testId,
  ...rest
}) => {
  const field = useFieldContext();
  const fieldTextareaProps = field?.getTextareaProps();
  const padding = TEXTAREA_PADDING[size ?? "md"];
  const minRowsValue = minRows ?? 3;
  const maxRowsValue = maxRows ?? 3;
  return /* @__PURE__ */ jsx(
    InputBase,
    {
      variant,
      size,
      color,
      className: cn("min-h-0! items-start! ps-0! pe-0! overflow-clip", className),
      classNames: { root: classNames?.root },
      ...props({
        disabled: disabled || field?.disabled,
        invalid: invalid || field?.invalid,
        readOnly: readOnly || field?.readOnly
      }),
      children: /* @__PURE__ */ jsx(
        ark.textarea,
        {
          ref,
          ...fieldTextareaProps,
          ...fieldA11yProps(field),
          ...props({
            disabled: disabled || field?.disabled,
            "aria-invalid": invalid || field?.invalid,
            readOnly: readOnly || field?.readOnly,
            "data-testid": testId
          }),
          rows: minRowsValue,
          style: {
            "--textarea-min-rows": minRowsValue,
            "--textarea-max-rows": maxRowsValue,
            "--textarea-py": `${padding.blockRem}rem`,
            ...style
          },
          className: cn(
            inputControlClasses,
            padding.className,
            "field-sizing-content",
            "min-h-[calc(var(--textarea-min-rows)*1lh+var(--textarea-py))]",
            "max-h-[calc(var(--textarea-max-rows)*1lh+var(--textarea-py))]",
            // Restyle the native grip flush against the border (Chrome/Edge/Safari
            // only — `::-webkit-resizer` has no equivalent in Firefox, which keeps
            // its plain native grip, still fully functional). Only ever paints
            // when `resizable` is on: the browser doesn't render a resizer pseudo
            // for `resize: none`. See `textarea-resizer` in theme.css — its color
            // is baked in to exactly match the shell's own border.
            "textarea-resizer",
            resizable ? "resize-y" : "resize-none",
            classNames?.input
          ),
          ...rest
        }
      )
    }
  );
};
var Textarea = ({
  label,
  description,
  error,
  required,
  disabled,
  size,
  classNames,
  ...control
}) => /* @__PURE__ */ jsx(
  FieldShell,
  {
    label,
    description,
    error,
    required,
    disabled,
    size,
    className: classNames?.field,
    children: /* @__PURE__ */ jsx(TextareaControl, { disabled, size, classNames, ...control })
  }
);

export { Textarea };
