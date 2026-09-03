import { popoverClearTrigger } from './chunk-PRHZ6FHV.js';
import { InputBase, inputControlClasses, inputSlot } from './chunk-MWXEQ5QX.js';
import { FieldShell, fieldA11yProps } from './chunk-AL57HMNZ.js';
import { CloseIcon } from './chunk-IG7FBZVM.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { useFieldContext } from '@ark-ui/react/field';
import { NumberInput as NumberInput$1 } from '@ark-ui/react/number-input';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';

var toArkValue = (value) => value === void 0 ? void 0 : value === null ? "" : String(value);
var wrapValue = (raw, min, max) => {
  const span = max - min + 1;
  return ((raw - min) % span + span) % span + min;
};
var NumberInputField = ({
  ref,
  placeholder,
  onBlur,
  testId,
  className
}) => {
  const field = useFieldContext();
  return /* @__PURE__ */ jsx(
    NumberInput$1.Input,
    {
      ref,
      placeholder,
      onBlur,
      "data-testid": testId,
      ...fieldA11yProps(field),
      className
    }
  );
};
var NumberInput = ({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step,
  placeholder,
  formatOptions,
  allowMouseWheel,
  clampValueOnBlur,
  wrap,
  hideControls,
  clearable,
  name,
  invalid,
  disabled,
  readOnly,
  required,
  label,
  description,
  error,
  variant = "default",
  size = "md",
  color,
  startSlot,
  suffix,
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
      classNames: { label: classNames?.label },
      children: /* @__PURE__ */ jsx(
        NumberInput$1.Root,
        {
          value: toArkValue(value),
          defaultValue: toArkValue(defaultValue),
          onValueChange: onChange ? (details) => {
            const raw = details.valueAsNumber;
            if (Number.isNaN(raw)) {
              onChange(null);
            } else if (wrap && min !== void 0 && max !== void 0) {
              onChange(wrapValue(raw, min, max));
            } else {
              onChange(raw);
            }
          } : void 0,
          min: wrap ? void 0 : min,
          max: wrap ? void 0 : max,
          step,
          formatOptions,
          allowMouseWheel,
          clampValueOnBlur,
          name,
          ...props({ invalid: isInvalid, disabled, readOnly, required }),
          ids: id ? { input: id } : void 0,
          "data-color": color,
          className: cn("w-full", className),
          children: /* @__PURE__ */ jsx(NumberInput$1.Context, { children: (api) => {
            const canClear = Boolean(clearable) && !disabled && !readOnly;
            const showClear = canClear && !api.empty;
            return /* @__PURE__ */ jsxs(
              InputBase,
              {
                variant,
                size,
                color,
                invalid: isInvalid,
                disabled,
                readOnly,
                startSlot,
                classNames: { root: classNames?.root },
                className: "pe-0! overflow-clip",
                ...props({ "data-with-end-slot": !hideControls || canClear || suffix != null }),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 items-center", children: [
                    /* @__PURE__ */ jsx(
                      NumberInputField,
                      {
                        ref,
                        placeholder,
                        onBlur,
                        testId,
                        className: cn(inputControlClasses, classNames?.input)
                      }
                    ),
                    suffix != null && /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: cn(inputSlot, "select-none"), children: suffix })
                  ] }),
                  canClear && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Clear value",
                      "aria-hidden": !showClear,
                      tabIndex: showClear ? 0 : -1,
                      onPointerDown: (event) => event.preventDefault(),
                      onClick: () => api.clearValue(),
                      className: cn(popoverClearTrigger, !showClear && "invisible"),
                      children: /* @__PURE__ */ jsx(CloseIcon, {})
                    }
                  ),
                  !hideControls && /* @__PURE__ */ jsxs(NumberInput$1.Control, { className: cn("-my-1 flex flex-col", classNames?.control), children: [
                    /* @__PURE__ */ jsx(
                      NumberInput$1.IncrementTrigger,
                      {
                        "aria-label": "Increment",
                        disabled: !wrap && !!(max !== void 0 && (value ?? 0) >= max),
                        ...props({
                          "data-disabled": !wrap && !!(max !== void 0 && (value ?? 0) >= max)
                        }),
                        className: cn(
                          "inline-flex shrink-0 items-center justify-center",
                          "h-1/2 cursor-pointer w-6 dark:[&:hover:not([data-disabled])]:bg-gray-dark-800 [&:hover:not([data-disabled])]:bg-gray-light-300 transition-colors rounded-xxs",
                          "data-disabled:cursor-not-allowed data-disabled:text-current/20"
                        ),
                        children: /* @__PURE__ */ jsx(ChevronUp, {})
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      NumberInput$1.DecrementTrigger,
                      {
                        "aria-label": "Decrement",
                        disabled: !wrap && !!(min !== void 0 && (value ?? 0) <= min),
                        ...props({
                          "data-disabled": !wrap && !!(min !== void 0 && (value ?? 0) <= min)
                        }),
                        className: cn(
                          "inline-flex shrink-0 items-center justify-center",
                          "h-1/2 cursor-pointer w-6 dark:[&:hover:not([data-disabled])]:bg-gray-dark-800 [&:hover:not([data-disabled])]:bg-gray-light-300 transition-colors rounded-xxs",
                          "data-disabled:cursor-not-allowed data-disabled:text-gray-light-500 dark:data-disabled:text-gray-dark-600"
                        ),
                        children: /* @__PURE__ */ jsx(ChevronDown, {})
                      }
                    )
                  ] })
                ]
              }
            );
          } })
        }
      )
    }
  );
};

export { NumberInput };
