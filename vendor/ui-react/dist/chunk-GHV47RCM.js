import { Spinner } from './chunk-RNXO7W2J.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

var buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap select-none",
    "font-medium uppercase tracking-wide",
    "no-underline",
    "rounded-button border border-transparent",
    "transition-colors-radius",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "hover:cursor-pointer",
    "data-[loading=true]:pointer-events-none data-[loading=true]:cursor-progress",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none"
  ],
  {
    variants: {
      variant: {
        filled: ["bg-(--c-solid) text-(--c-on-solid)", "hover:bg-(--c-solid-hover)"],
        light: [
          "bg-(--c-soft) text-(--c-text) border-(--c-soft-hover)",
          "hover:bg-(--c-soft-hover) hover:border-(--c-solid)"
        ],
        outline: ["bg-transparent text-(--c-text) border-(--c-solid)", "hover:bg-(--c-soft)"],
        subtle: ["bg-transparent text-(--c-text)", "hover:bg-(--c-soft)"]
      },
      size: {
        xs: "h-7 px-2 text-xs [&_svg]:size-3 gap-1",
        sm: "h-8 px-3 text-sm [&_svg]:size-3.5 gap-1.5",
        md: "h-9 px-4 text-md [&_svg]:size-4 gap-2",
        lg: "h-10 px-4 text-lg [&_svg]:size-5 gap-3",
        xl: "h-12 px-5 text-xl [&_svg]:size-6 gap-3"
      }
    },
    defaultVariants: {
      variant: "filled",
      size: "md"
    }
  }
);
var startSlotVariants = cva("inline-flex shrink-0 items-center", {
  variants: {
    size: {
      xs: "-ms-0.5",
      sm: "-ms-1",
      md: "-ms-2",
      lg: "-ms-2.5",
      xl: "-ms-3"
    }
  }
});
var endSlotVariants = cva("inline-flex shrink-0 items-center", {
  variants: {
    size: {
      xs: "-me-0.5",
      sm: "-me-1",
      md: "-me-2",
      lg: "-me-2.5",
      xl: "-me-3"
    }
  }
});
var HiddenSlot = ({ children, className }) => /* @__PURE__ */ jsx(
  "span",
  {
    "aria-hidden": "true",
    className: cn("inline-flex shrink-0 items-center justify-center", className),
    children
  }
);
var Button = ({
  className,
  variant,
  size,
  color,
  loading = false,
  startSlot,
  endSlot,
  children,
  disabled,
  type,
  asChild,
  testId,
  ...rest
}) => {
  const resolvedDisabled = disabled || loading;
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
      "data-variant": variant ?? "filled",
      "data-size": size ?? "md",
      className: cn(buttonVariants({ variant, size }), className),
      ...props({ "data-testid": testId }),
      ...rest,
      children: asChild ? children : /* @__PURE__ */ jsxs(Fragment, { children: [
        loading ? /* @__PURE__ */ jsx(HiddenSlot, { className: startSlotVariants({ size }), children: /* @__PURE__ */ jsx(Spinner, { label: null }) }) : startSlot && /* @__PURE__ */ jsx(HiddenSlot, { className: startSlotVariants({ size }), children: startSlot }),
        children,
        endSlot && !loading && /* @__PURE__ */ jsx(HiddenSlot, { className: endSlotVariants({ size }), children: endSlot })
      ] })
    }
  );
};

export { Button };
