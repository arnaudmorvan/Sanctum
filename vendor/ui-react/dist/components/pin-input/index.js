"use client";
import { shellChrome, shellVariants } from '../../chunk-MWXEQ5QX.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { PinInput as PinInput$1 } from '@ark-ui/react/pin-input';
import { cva } from 'class-variance-authority';
import { jsx, jsxs } from 'react/jsx-runtime';

var pinCell = cva(
  [
    ...shellChrome,
    ...shellVariants.default,
    "appearance-none outline-none",
    "text-center tabular-nums aspect-square"
  ],
  {
    variants: {
      size: {
        xs: "size-7 text-xs",
        sm: "size-8 text-sm",
        md: "size-9 text-md",
        lg: "size-10 text-lg",
        xl: "size-12 text-xl"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var PinInput = ({
  value,
  defaultValue,
  onChange,
  onComplete,
  length,
  otp,
  mask,
  type,
  placeholder = "\u2022",
  name,
  invalid,
  disabled,
  readOnly,
  required,
  label,
  description,
  error,
  size = "md",
  color,
  id,
  ref,
  onBlur,
  className,
  classNames,
  testId
}) => {
  const isInvalid = invalid || error != null;
  return /* @__PURE__ */ jsx(
    FieldShell,
    {
      label,
      description,
      error,
      required,
      disabled,
      size,
      className: classNames?.field,
      children: /* @__PURE__ */ jsxs(
        PinInput$1.Root,
        {
          value: value != null ? [...value] : void 0,
          defaultValue: defaultValue != null ? [...defaultValue] : void 0,
          onValueChange: onChange ? (details) => onChange(details.valueAsString) : void 0,
          onValueComplete: onComplete ? (details) => onComplete(details.valueAsString) : void 0,
          count: length,
          otp,
          mask,
          type,
          placeholder,
          name,
          ...props({ invalid: isInvalid, disabled, readOnly, required }),
          ids: id ? { root: id } : void 0,
          "data-color": color,
          className: cn(className, classNames?.root),
          children: [
            /* @__PURE__ */ jsx(PinInput$1.Control, { className: "flex items-center gap-2", children: Array.from({ length }).map((_, i) => /* @__PURE__ */ jsx(
              PinInput$1.Input,
              {
                index: i,
                ref: i === 0 ? ref : void 0,
                onBlur: i === 0 ? onBlur : void 0,
                ...props({ "data-testid": testId && `${testId}-${i}` }),
                className: cn(pinCell({ size }), classNames?.input)
              },
              i
            )) }),
            /* @__PURE__ */ jsx(PinInput$1.HiddenInput, {})
          ]
        }
      )
    }
  );
};

export { PinInput };
