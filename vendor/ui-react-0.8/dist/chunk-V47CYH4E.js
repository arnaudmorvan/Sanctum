import { Spinner } from './chunk-RNXO7W2J.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { isValidElement, cloneElement } from 'react';
import { jsx } from 'react/jsx-runtime';

var actionIconVariants = cva(
  [
    "inline-flex items-center justify-center",
    "aspect-square shrink-0 select-none",
    "font-medium uppercase tracking-wide",
    "no-underline",
    "rounded-action-icon border border-transparent",
    "transition-colors-radius",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950",
    "disabled:not-data-loading:pointer-events-none disabled:opacity-50",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "not-data-loading:hover:cursor-pointer",
    "data-loading:cursor-progress data-loading:opacity-50",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none"
  ],
  {
    variants: {
      variant: {
        filled: [
          "bg-(--c-solid) text-(--c-on-solid)",
          "not-data-loading:hover:bg-(--c-solid-hover)"
        ],
        light: [
          "bg-(--c-soft) text-(--c-text) border-(--c-soft-hover)",
          "not-data-loading:hover:bg-(--c-soft-hover) not-data-loading:hover:border-(--c-solid)"
        ],
        outline: [
          "bg-transparent text-(--c-text) border-(--c-solid)",
          "not-data-loading:hover:bg-(--c-soft)"
        ],
        subtle: ["bg-transparent text-(--c-text)", "not-data-loading:hover:bg-(--c-soft)"],
        default: [
          "dark:bg-gray-light-50 dark:text-gray-light-900 dark:border-gray-light-400 dark:not-data-loading:hover:bg-gray-light-300",
          "bg-gray-dark-900 text-gray-dark-25 border-gray-dark-800 not-data-loading:hover:bg-gray-dark-800"
        ]
      },
      size: {
        xs: "h-7 text-xs [&_svg]:size-5",
        sm: "h-8 text-sm [&_svg]:size-5.5",
        md: "h-9 text-md [&_svg]:size-6",
        lg: "h-10 text-lg [&_svg]:size-7",
        xl: "h-12 text-xl [&_svg]:size-8"
      },
      radius: {
        xs: "rounded-xs",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var preventWhileLoading = (event) => {
  event.preventDefault();
  event.stopPropagation();
};
var withAsChildLoading = (child, loading) => {
  if (!loading) return child;
  if (!isValidElement(child))
    return child;
  return cloneElement(child, {
    onClick: preventWhileLoading,
    children: /* @__PURE__ */ jsx(Spinner, { label: null })
  });
};
var ActionIcon = ({
  className,
  variant,
  size,
  radius,
  color,
  loading = false,
  children,
  disabled,
  type,
  asChild,
  testId,
  onClick,
  ...rest
}) => {
  const resolvedDisabled = disabled || loading;
  const resolvedOnClick = loading ? preventWhileLoading : onClick;
  return /* @__PURE__ */ jsx(
    ark.button,
    {
      asChild,
      type: asChild ? type : type ?? "button",
      disabled: resolvedDisabled,
      "aria-busy": loading || void 0,
      "aria-disabled": resolvedDisabled || void 0,
      "data-loading": loading || void 0,
      "data-color": color,
      "data-variant": variant ?? "default",
      className: cn(actionIconVariants({ variant, size, radius }), className),
      onClick: resolvedOnClick,
      ...props({ "data-testid": testId }),
      ...rest,
      children: asChild ? withAsChildLoading(children, loading) : loading ? /* @__PURE__ */ jsx(Spinner, { label: null }) : children
    }
  );
};

export { ActionIcon };
//# sourceMappingURL=chunk-V47CYH4E.js.map
//# sourceMappingURL=chunk-V47CYH4E.js.map