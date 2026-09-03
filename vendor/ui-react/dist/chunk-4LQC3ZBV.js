import { controlIndicator } from './chunk-Q7RNQGYE.js';
import { fieldLabel, FieldShell, fieldRoot } from './chunk-AL57HMNZ.js';
import { CheckIcon } from './chunk-IG7FBZVM.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Checkbox as Checkbox$1 } from '@ark-ui/react/checkbox';
import { Minus } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var Checkbox = ({
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
  variant,
  color,
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
    Checkbox$1.Label,
    {
      className: cn(fieldLabel({ size }), !hasStack && "min-w-0 flex-1", classNames?.label),
      children: [
        label,
        required && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "ms-0.5 text-red-500", children: "*" })
      ]
    }
  );
  return /* @__PURE__ */ jsxs(
    Checkbox$1.Root,
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
        /* @__PURE__ */ jsxs(Checkbox$1.Control, { className: cn(controlIndicator({ size, variant }), classNames?.control), children: [
          /* @__PURE__ */ jsx(Checkbox$1.Indicator, { children: /* @__PURE__ */ jsx(CheckIcon, {}) }),
          /* @__PURE__ */ jsx(Checkbox$1.Indicator, { indeterminate: true, children: /* @__PURE__ */ jsx(Minus, {}) })
        ] }),
        hasStack ? /* @__PURE__ */ jsxs("div", { className: cn(fieldRoot({ size }), classNames?.field), children: [
          labelNode,
          /* @__PURE__ */ jsx(FieldShell, { description, error, size, children: /* @__PURE__ */ jsx(Checkbox$1.HiddenInput, { ref, onBlur }) })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          labelNode,
          /* @__PURE__ */ jsx(
            FieldShell,
            {
              description,
              error,
              size,
              className: classNames?.field,
              children: /* @__PURE__ */ jsx(Checkbox$1.HiddenInput, { ref, onBlur })
            }
          )
        ] })
      ]
    }
  );
};

export { Checkbox };
