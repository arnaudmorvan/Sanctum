import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var PillGroupContext = createContext(null);
var pill = cva(
  [
    "inline-flex items-center max-w-full",
    "whitespace-nowrap select-none align-middle",
    "rounded-pill font-medium",
    // Neutral default; a `data-color` tint overrides it (higher specificity).
    "bg-black/8 dark:bg-white/16 text-gray-light-800 dark:text-gray-dark-100",
    "border border-black/8 dark:border-white/15",
    "data-color:bg-(--c-soft) data-color:text-(--c-text)",
    "data-color:bg-(--c-soft)/35",
    "data-disabled:cursor-not-allowed data-disabled:opacity-60",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0"
  ],
  {
    variants: {
      withRemoveButton: {
        xs: "pe-[0.125rem]",
        sm: "pe-[0.15rem]",
        md: "pe-[0.2rem]",
        lg: "pe-[0.25rem]",
        xl: "pe-[0.3rem]"
      },
      size: {
        xs: "h-4.5 px-1.5 text-[0.6875rem] gap-0.5",
        sm: "h-5 px-2 text-xs gap-1",
        md: "h-5.5 px-2 text-xs gap-1",
        lg: "h-6 px-2.5 text-sm gap-1",
        xl: "h-7 px-3 text-sm gap-1.5"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var pillRemove = cva(
  [
    "inline-flex items-center justify-center shrink-0 rounded-full",
    "text-current/70 hover:text-current",
    "transition-colors hover:bg-black/10 dark:hover:bg-white/10",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--c-solid)/40",
    "disabled:pointer-events-none",
    "cursor-pointer"
  ],
  {
    variants: {
      size: {
        xs: "size-3",
        sm: "size-3.5",
        md: "size-4",
        lg: "size-4.5",
        xl: "size-5"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var RemoveIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12" })
  }
);
var Pill = ({
  size: sizeProp,
  color,
  withRemoveButton = false,
  onRemove,
  removeLabel = "Remove",
  disabled: disabledProp,
  children,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const group = useContext(PillGroupContext);
  const size = sizeProp ?? group?.size ?? "md";
  const disabled = disabledProp ?? group?.disabled;
  return /* @__PURE__ */ jsxs(
    ark.span,
    {
      "data-color": color,
      "data-disabled": disabled || void 0,
      className: cn(
        pill({ size, withRemoveButton: withRemoveButton ? size : void 0 }),
        className,
        classNames?.root
      ),
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { className: cn("truncate text-trim", classNames?.label), children }),
        withRemoveButton && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": removeLabel,
            disabled,
            onMouseDown: (e) => e.preventDefault(),
            onClick: (e) => {
              e.stopPropagation();
              onRemove?.();
            },
            className: cn(pillRemove({ size }), classNames?.remove),
            ...props({ "data-testid": testId && `${testId}-remove` }),
            children: /* @__PURE__ */ jsx(RemoveIcon, {})
          }
        )
      ]
    }
  );
};
var PILL_GROUP_GAP = {
  xs: "gap-1",
  sm: "gap-1",
  md: "gap-1",
  lg: "gap-1.5",
  xl: "gap-1.5"
};
var PillGroup = ({
  size = "md",
  disabled,
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(PillGroupContext.Provider, { value: { size, disabled }, children: /* @__PURE__ */ jsx(
  ark.div,
  {
    className: cn(
      "inline-flex max-w-full flex-wrap items-center",
      PILL_GROUP_GAP[size],
      className
    ),
    ...rest,
    children
  }
) });

export { Pill, PillGroup, PillGroupContext, pill, pillRemove };
