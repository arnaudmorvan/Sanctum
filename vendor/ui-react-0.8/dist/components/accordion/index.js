"use client";
import { Title } from '../../chunk-BNJGUTED.js';
import '../../chunk-C7V53TG4.js';
import { ChevronIcon } from '../../chunk-IG7FBZVM.js';
import { Collapse } from '../../chunk-HLBFHYKE.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Accordion as Accordion$1 } from '@ark-ui/react/accordion';
import { cva } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

var accordionRoot = cva(["w-full"], {
  variants: {
    variant: {
      default: [
        "divide-y divide-brand-900/20 dark:divide-white/15",
        "overflow-hidden rounded-input border border-brand-900/20 dark:border-white/15",
        "bg-white/4"
      ],
      separated: "flex flex-col gap-3"
    }
  },
  defaultVariants: { variant: "default" }
});
var accordionItem = cva(["w-full overflow-hidden"], {
  variants: {
    variant: {
      default: "",
      separated: [
        "border bg-white/4 transition-colors",
        "border-brand-900/20 dark:border-white/15",
        "data-[state=open]:border-gray-light-900 dark:data-[state=open]:border-gray-dark-25"
      ]
    },
    radius: { xs: "", sm: "", md: "", lg: "", xl: "" }
  },
  compoundVariants: [
    { variant: "separated", radius: "xs", class: "rounded-xs" },
    { variant: "separated", radius: "sm", class: "rounded-sm" },
    { variant: "separated", radius: "md", class: "rounded-md" },
    { variant: "separated", radius: "lg", class: "rounded-lg" },
    { variant: "separated", radius: "xl", class: "rounded-xl" }
  ],
  defaultVariants: { variant: "default", radius: "sm" }
});
var accordionTrigger = cva(
  [
    "group/trigger flex w-full cursor-pointer items-center gap-2 text-start font-medium",
    "text-gray-light-900 dark:text-gray-dark-50",
    "outline-none transition-colors",
    "hover:bg-black/5 dark:hover:bg-white/8",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50"
  ],
  {
    variants: {
      size: {
        xs: "px-2.5 py-2 text-xs",
        sm: "px-3 py-2.5 text-sm",
        md: "px-4 py-3 text-md",
        lg: "px-5 py-3.5 text-lg",
        xl: "px-6 py-4 text-xl"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var accordionLabel = "min-w-0 flex-1 truncate";
var accordionIcon = "shrink-0 [&_svg]:size-4";
var accordionIndicator = cn(
  "flex shrink-0 items-center justify-center text-gray-light-500 transition-transform dark:text-gray-dark-400",
  "data-[state=open]:rotate-180 data-[state=open]:text-gray-light-900 dark:data-[state=open]:text-gray-dark-25",
  "[&_svg]:size-4"
);
var accordionContent = cva(["text-gray-light-700 dark:text-gray-dark-300"], {
  variants: {
    size: {
      xs: "px-2.5 pb-2 text-xs",
      sm: "px-3 pb-2.5 text-sm",
      md: "px-4 pb-3 text-md",
      lg: "px-5 pb-3.5 text-lg",
      xl: "px-6 pb-4 text-xl"
    }
  },
  defaultVariants: { size: "md" }
});
var AccordionStyleContext = createContext({
  variant: "default",
  size: "md",
  radius: "sm",
  chevronPosition: "end",
  chevron: void 0,
  order: 3
});
var Root = ({
  variant = "default",
  size = "md",
  radius = "sm",
  chevronPosition = "end",
  chevron,
  order = 3,
  orientation = "vertical",
  onChange,
  className,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  AccordionStyleContext.Provider,
  {
    value: { variant, size, radius, chevronPosition, chevron, order },
    children: /* @__PURE__ */ jsx(
      Accordion$1.Root,
      {
        orientation,
        onValueChange: onChange ? (d) => onChange(d.value) : void 0,
        className: cn(accordionRoot({ variant }), className),
        ...props({ "data-testid": testId }),
        ...rest
      }
    )
  }
);
var Item = ({ className, testId, ...rest }) => {
  const { variant, radius } = useContext(AccordionStyleContext);
  return /* @__PURE__ */ jsx(
    Accordion$1.Item,
    {
      className: cn(accordionItem({ variant, radius }), className),
      ...props({ "data-testid": testId }),
      ...rest
    }
  );
};
var ItemIndicator = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Accordion$1.ItemIndicator,
  {
    className: cn(accordionIndicator, className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ItemTrigger = ({ icon, children, className, testId, ...rest }) => {
  const { size, chevronPosition, chevron, order } = useContext(AccordionStyleContext);
  const indicator = chevron === null ? null : /* @__PURE__ */ jsx(ItemIndicator, { children: chevron ?? /* @__PURE__ */ jsx(ChevronIcon, {}) });
  return /* @__PURE__ */ jsx(Title, { order, className: "contents", children: /* @__PURE__ */ jsxs(
    Accordion$1.ItemTrigger,
    {
      className: cn(accordionTrigger({ size }), className),
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        chevronPosition === "start" && indicator,
        icon && /* @__PURE__ */ jsx("span", { className: accordionIcon, children: icon }),
        /* @__PURE__ */ jsx("span", { className: accordionLabel, children }),
        chevronPosition === "end" && indicator
      ]
    }
  ) });
};
var ItemContent = ({
  children,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const { size } = useContext(AccordionStyleContext);
  return /* @__PURE__ */ jsx(Accordion$1.ItemContext, { children: (item) => /* @__PURE__ */ jsx(Accordion$1.ItemContent, { asChild: true, children: /* @__PURE__ */ jsx(
    Collapse,
    {
      open: item.expanded,
      hidden: false,
      className,
      classNames,
      ...props({ "data-testid": testId }),
      ...rest,
      children: /* @__PURE__ */ jsx("div", { className: accordionContent({ size }), children })
    }
  ) }) });
};
var ItemContext = Accordion$1.ItemContext;
Accordion$1.Context;
var AccordionComponent = ({
  data,
  ...root
}) => /* @__PURE__ */ jsx(Root, { ...root, children: data.map((item) => {
  const testId = item.testId ?? `accordion-${item.value}`;
  return /* @__PURE__ */ jsxs(Item, { value: item.value, disabled: item.disabled, children: [
    /* @__PURE__ */ jsx(ItemTrigger, { icon: item.icon, testId, children: item.label }),
    /* @__PURE__ */ jsx(ItemContent, { testId: `${testId}-content`, children: item.content })
  ] }, item.value);
}) });
var Accordion = Object.assign(AccordionComponent, {
  Root,
  Item,
  ItemTrigger,
  ItemContent,
  ItemIndicator,
  ItemContext
});

export { Accordion };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map