import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Field as Field$1 } from '@ark-ui/react/field';
import { cva } from 'class-variance-authority';
import { jsx, jsxs } from 'react/jsx-runtime';

var fieldRoot = cva("flex w-full flex-col", {
  variants: {
    size: { xs: "gap-1", sm: "gap-1", md: "gap-1.5", lg: "gap-1.5", xl: "gap-2" }
  },
  defaultVariants: { size: "md" }
});
var fieldLabel = cva(
  [
    "inline-flex items-center font-medium select-none text-trim",
    "text-gray-light-700 dark:text-gray-dark-300",
    "data-disabled:opacity-60"
  ],
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-sm",
        lg: "text-md",
        xl: "text-lg"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var fieldHelp = cva("text-gray-light-600 dark:text-gray-dark-400", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-xs",
      lg: "text-sm",
      xl: "text-sm"
    }
  },
  defaultVariants: { size: "md" }
});
var fieldError = cva("text-red-600 dark:text-red-400", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-xs",
      lg: "text-sm",
      xl: "text-sm"
    }
  },
  defaultVariants: { size: "md" }
});
var fieldA11yProps = (field) => ({
  "aria-describedby": field?.invalid ? field.ids.errorText : field?.ariaDescribedby,
  "aria-errormessage": field?.invalid ? field.ids.errorText : void 0
});
var FieldShell = ({
  label,
  description,
  error,
  required,
  disabled,
  size,
  className,
  classNames,
  testId,
  children
}) => {
  const hasField = label != null || description != null || error != null || Boolean(required);
  if (!hasField) return children;
  return /* @__PURE__ */ jsx(
    Field,
    {
      label,
      description,
      error,
      required,
      disabled,
      size,
      className,
      classNames,
      testId,
      children
    }
  );
};
var Field = ({
  label,
  description,
  error,
  required,
  invalid,
  size,
  children,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const isInvalid = invalid ?? error != null;
  return /* @__PURE__ */ jsxs(
    Field$1.Root,
    {
      required,
      invalid: isInvalid,
      className: cn(fieldRoot({ size }), className, classNames?.root),
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        label != null && /* @__PURE__ */ jsxs(Field$1.Label, { className: cn(fieldLabel({ size }), classNames?.label), children: [
          label,
          required && /* @__PURE__ */ jsx(
            Field$1.RequiredIndicator,
            {
              className: cn("ms-0.5 text-red-500", classNames?.requiredIndicator),
              children: "*"
            }
          )
        ] }),
        children,
        error != null ? /* @__PURE__ */ jsx(
          Field$1.ErrorText,
          {
            className: cn(fieldError({ size }), classNames?.error),
            ...props({ "data-testid": testId && `${testId}-error` }),
            children: error
          }
        ) : description != null ? /* @__PURE__ */ jsx(
          Field$1.HelperText,
          {
            className: cn(fieldHelp({ size }), classNames?.description),
            ...props({ "data-testid": testId && `${testId}-description` }),
            children: description
          }
        ) : null
      ]
    }
  );
};

export { Field, FieldShell, fieldA11yProps, fieldLabel, fieldRoot };
