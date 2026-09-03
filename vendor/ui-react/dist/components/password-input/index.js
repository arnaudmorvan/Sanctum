"use client";
import { InputBase, inputControlClasses, inputSlot } from '../../chunk-MWXEQ5QX.js';
import { FieldShell, fieldA11yProps } from '../../chunk-AL57HMNZ.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { useFieldContext } from '@ark-ui/react/field';
import { PasswordInput as PasswordInput$1 } from '@ark-ui/react/password-input';
import { EyeOff, Eye } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';

var PasswordInputField = ({
  ref,
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  placeholder,
  testId,
  className
}) => {
  const field = useFieldContext();
  return /* @__PURE__ */ jsx(
    PasswordInput$1.Input,
    {
      ref,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      placeholder,
      ...fieldA11yProps(field),
      ...props({ "data-testid": testId }),
      className
    }
  );
};
var PasswordInput = ({
  value,
  defaultValue,
  onChange,
  name,
  placeholder,
  variant,
  size,
  color,
  invalid,
  disabled,
  readOnly,
  required,
  label,
  description,
  error,
  startSlot,
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
      children: /* @__PURE__ */ jsx(
        PasswordInput$1.Root,
        {
          id,
          invalid: isInvalid,
          disabled,
          readOnly,
          required,
          "data-color": color,
          children: /* @__PURE__ */ jsxs(
            InputBase,
            {
              variant,
              size,
              color,
              invalid: isInvalid,
              disabled,
              readOnly,
              startSlot,
              className,
              classNames: { root: classNames?.root },
              children: [
                /* @__PURE__ */ jsx(
                  PasswordInputField,
                  {
                    ref,
                    value,
                    defaultValue,
                    onChange,
                    onBlur,
                    name,
                    placeholder,
                    testId,
                    className: cn(inputControlClasses, classNames?.input)
                  }
                ),
                /* @__PURE__ */ jsx(
                  PasswordInput$1.VisibilityTrigger,
                  {
                    className: cn(inputSlot, "cursor-pointer", classNames?.visibilityTrigger),
                    children: /* @__PURE__ */ jsx(PasswordInput$1.Indicator, { fallback: /* @__PURE__ */ jsx(Eye, {}), children: /* @__PURE__ */ jsx(EyeOff, {}) })
                  }
                )
              ]
            }
          )
        }
      )
    }
  );
};

export { PasswordInput };
