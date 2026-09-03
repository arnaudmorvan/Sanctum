"use client";
import { controlIndicator } from '../../chunk-Q7RNQGYE.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { RadioGroup as RadioGroup$1 } from '@ark-ui/react/radio-group';
import { jsx, jsxs } from 'react/jsx-runtime';

var normalize = (item) => typeof item === "string" ? { value: item, label: item, disabled: void 0, testId: `item-${item}` } : { ...item, testId: item.testId ?? `item-${item.value}` };
var RadioGroup = ({
  value,
  defaultValue,
  onChange,
  data,
  orientation = "vertical",
  label,
  description,
  error,
  variant,
  required,
  invalid,
  disabled,
  readOnly,
  size = "md",
  color,
  name,
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
      size,
      className: classNames?.field,
      children: /* @__PURE__ */ jsx(
        RadioGroup$1.Root,
        {
          value,
          defaultValue,
          onValueChange: onChange ? (d) => d.value != null && onChange(d.value) : void 0,
          invalid: isInvalid,
          disabled,
          readOnly,
          required,
          name,
          orientation,
          id,
          ref,
          onBlur,
          "data-color": color,
          ...props({ "data-testid": testId }),
          className: cn(
            "flex gap-2",
            orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
            className,
            classNames?.root
          ),
          children: data.map((raw) => {
            const item = normalize(raw);
            return /* @__PURE__ */ jsxs(
              RadioGroup$1.Item,
              {
                value: item.value,
                disabled: item.disabled,
                "data-testid": item.testId,
                className: cn("inline-flex items-center gap-2 select-none", classNames?.item),
                children: [
                  /* @__PURE__ */ jsx(
                    RadioGroup$1.ItemControl,
                    {
                      className: cn(
                        controlIndicator({ size, variant }),
                        "rounded-full",
                        classNames?.control
                      ),
                      children: /* @__PURE__ */ jsx(RadioGroup$1.ItemContext, { children: (s) => s.checked ? /* @__PURE__ */ jsx("span", { className: "size-[50%] rounded-full bg-gray-light-100 dark:bg-gray-dark-800" }) : null })
                    }
                  ),
                  /* @__PURE__ */ jsx(RadioGroup$1.ItemText, { className: cn("text-sm", classNames?.label), children: item.label }),
                  /* @__PURE__ */ jsx(RadioGroup$1.ItemHiddenInput, {})
                ]
              },
              item.value
            );
          })
        }
      )
    }
  );
};

export { RadioGroup };
