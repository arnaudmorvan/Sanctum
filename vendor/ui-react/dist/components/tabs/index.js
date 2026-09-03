"use client";
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Tabs as Tabs$1 } from '@ark-ui/react/tabs';
import { cva } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var tabsList = cva(
  [
    "relative inline-flex max-w-fit rounded-input border p-0.5 transition-colors",
    "data-[orientation=vertical]:flex-col"
  ],
  {
    variants: {
      variant: {
        filled: ["bg-gray-light-100 dark:bg-gray-dark-800", "border-transparent"],
        light: ["bg-white/4", "border-brand-900/20 dark:border-white/15"],
        outline: ["bg-transparent border-transparent"],
        subtle: ["bg-transparent border-transparent"],
        default: ["bg-white/4", "border-brand-900/20 dark:border-white/15"]
      },
      size: {
        xs: "gap-1",
        sm: "gap-1.5",
        md: "gap-2",
        lg: "gap-3",
        xl: "gap-4"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);
var tabsTrigger = cva(
  [
    "relative z-1 cursor-pointer rounded-[6px] text-center font-medium whitespace-nowrap select-none",
    "text-gray-light-700 dark:text-gray-dark-300 hover:text-gray-light-950 dark:hover:text-gray-dark-50",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    "before:absolute before:rounded-full before:bg-gray-light-300 dark:before:bg-gray-dark-600",
    "before:transition-opacity before:duration-200",
    "before:top-1/2 before:left-0 before:h-1/2 before:w-px before:-translate-x-1/2 before:-translate-y-1/2",
    "in-data-[orientation=vertical]:before:top-0 in-data-[orientation=vertical]:before:left-1/2 in-data-[orientation=vertical]:before:h-px in-data-[orientation=vertical]:before:w-1/2",
    "nth-2:before:hidden",
    "data-selected:before:opacity-0 data-selected:[&+*]:before:opacity-0"
  ],
  {
    variants: {
      variant: {
        filled: "data-selected:text-(--c-on-solid) data-selected:hover:text-(--c-on-solid-hover)",
        light: "data-selected:text-(--c-text)",
        outline: "data-selected:text-(--c-text)",
        subtle: "data-selected:text-(--c-text)",
        default: "data-selected:text-gray-dark-25 dark:data-selected:text-gray-light-900"
      },
      size: {
        xs: "px-2 py-0.5 text-xs",
        sm: "px-2.5 py-1 text-sm",
        md: "px-3 py-1.5 text-md",
        lg: "px-4 py-2 text-lg",
        xl: "px-5 py-2.5 text-xl"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);
var tabsIndicator = cva("z-0 rounded-[6px]", {
  variants: {
    variant: {
      filled: "bg-(--c-solid)",
      light: "bg-(--c-soft) border border-(--c-soft-hover)",
      outline: "bg-transparent border border-(--c-solid)",
      subtle: "bg-(--c-soft-hover)",
      default: "bg-gray-light-900 dark:bg-gray-dark-50"
    }
  },
  defaultVariants: { variant: "default" }
});
var tabsContent = "mt-3 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950";
var TabsStyleContext = createContext({
  variant: "default",
  size: "md"
});
var Root = ({ orientation = "horizontal", color, testId, ...rest }) => (
  // `key={orientation}` remounts on an axis flip so Ark re-measures the
  // indicator rect for the new layout (it only measures on mount + value
  // change, mirroring the same limitation `SegmentGroup` works around) — at
  // the cost of resetting an *uncontrolled* value on that flip. Pass a
  // controlled `value` if the orientation can change at runtime and the
  // selection must survive it.
  /* @__PURE__ */ jsx(
    Tabs$1.Root,
    {
      orientation,
      "data-color": color,
      ...props({ "data-testid": testId }),
      ...rest
    },
    orientation
  )
);
var List = ({ variant = "default", size = "md", className, testId, ...rest }) => /* @__PURE__ */ jsx(TabsStyleContext.Provider, { value: { variant, size }, children: /* @__PURE__ */ jsx(
  Tabs$1.List,
  {
    className: tabsList({ variant, size, className }),
    ...props({ "data-testid": testId }),
    ...rest
  }
) });
var Trigger = ({ className, testId, ...rest }) => {
  const { variant, size } = useContext(TabsStyleContext);
  return /* @__PURE__ */ jsx(
    Tabs$1.Trigger,
    {
      className: tabsTrigger({ variant, size, className }),
      ...props({ "data-testid": testId }),
      ...rest
    }
  );
};
var Content = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Tabs$1.Content,
  {
    className: cn(tabsContent, className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Indicator = ({ className, style, testId, ...rest }) => {
  const { variant } = useContext(TabsStyleContext);
  return /* @__PURE__ */ jsx(
    Tabs$1.Indicator,
    {
      style: {
        width: "var(--width)",
        height: "var(--height)",
        transitionProperty: "left, top, width, height, background-color, border-color",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
        ...style
      },
      className: tabsIndicator({ variant, className }),
      ...props({ "data-testid": testId }),
      ...rest
    }
  );
};
var Context = Tabs$1.Context;
var TabsComponent = ({
  data,
  variant,
  size,
  color,
  value,
  defaultValue,
  onChange,
  ...root
}) => /* @__PURE__ */ jsxs(
  Root,
  {
    value,
    defaultValue: defaultValue ?? data[0]?.value,
    onValueChange: onChange ? (d) => onChange(d.value) : void 0,
    color,
    ...root,
    children: [
      /* @__PURE__ */ jsxs(List, { variant, size, children: [
        /* @__PURE__ */ jsx(Indicator, {}),
        data.map((item) => /* @__PURE__ */ jsx(
          Trigger,
          {
            value: item.value,
            disabled: item.disabled,
            testId: item.testId ?? `tab-${item.value}`,
            children: item.label
          },
          item.value
        ))
      ] }),
      data.map((item) => /* @__PURE__ */ jsx(
        Content,
        {
          value: item.value,
          testId: `${item.testId ?? `tab-${item.value}`}-panel`,
          children: item.content
        },
        item.value
      ))
    ]
  }
);
var Tabs = Object.assign(TabsComponent, {
  Root,
  List,
  Trigger,
  Content,
  Indicator,
  Context
});

export { Tabs };
