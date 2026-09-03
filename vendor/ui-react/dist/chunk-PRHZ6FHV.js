import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Popover as Popover$1 } from '@ark-ui/react/popover';
import { Portal } from '@ark-ui/react/portal';
import { cva } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import { jsx } from 'react/jsx-runtime';

var popoverChrome = cn(
  "z-(--popover-z,50)",
  "rounded-input border border-brand-900/20 dark:border-white/15",
  "bg-brand-50/90 dark:bg-brand-950/85",
  "backdrop-blur-sm",
  "shadow-lg focus:outline-none",
  "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out",
  "data-[placement^=top]:origin-bottom data-[placement^=bottom]:origin-top"
);
var popoverContent = cn(popoverChrome, "flex w-full flex-col overflow-hidden");
var popoverList = cva(
  [
    "flex w-full flex-col ps-1 pe-1 pb-1",
    "overflow-y-auto overscroll-contain",
    "max-h-[min(16rem,var(--available-height,16rem))]"
  ],
  {
    variants: {
      withPaddingTop: {
        true: "pt-1"
      }
    }
  }
);
var scrollHighlightedIntoView = ({
  getElement
}) => getElement()?.scrollIntoView({ block: "nearest" });
var popoverPanel = cn(popoverChrome, "flex flex-col overflow-hidden");
var popoverViewport = cn(
  "flex flex-col overflow-y-auto overscroll-contain p-1",
  "max-h-[min(24rem,var(--available-height,24rem))]"
);
var popoverChevron = "shrink-0 text-gray-light-500 transition-transform dark:text-gray-dark-400";
var popoverClearTrigger = "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-light-500 transition-colors hover:text-gray-light-700 dark:text-gray-dark-400 dark:hover:text-gray-dark-200";
var popoverOption = cva(
  [
    "relative flex cursor-pointer items-center gap-2 rounded-sm",
    "select-none outline-none",
    "text-gray-light-900 dark:text-gray-dark-100",
    "data-highlighted:bg-black/5 dark:data-highlighted:bg-white/8",
    "data-[state=checked]:font-medium",
    "data-disabled:pointer-events-none data-disabled:opacity-50"
  ],
  {
    variants: {
      size: {
        xs: "px-2 py-1 text-xs",
        sm: "px-2 py-1 text-sm",
        md: "px-2.5 py-1.5 text-md",
        lg: "px-3 py-2 text-lg",
        xl: "px-3.5 py-2.5 text-xl"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var popoverIndicator = "ms-auto inline-flex shrink-0 items-center text-(--c-solid) [&_svg]:size-4";
var popoverCheckbox = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-xs border transition-colors",
    "border-gray-light-300 dark:border-gray-dark-700",
    "bg-gray-light-25 dark:bg-gray-dark-900",
    "text-(--c-on-solid)",
    "group-data-[state=checked]/item:border-(--c-solid) group-data-[state=checked]/item:bg-(--c-solid)"
  ],
  {
    variants: {
      size: {
        xs: "size-3.5 [&_svg]:size-2.5",
        sm: "size-4 [&_svg]:size-3",
        md: "size-4 [&_svg]:size-3",
        lg: "size-4.5 [&_svg]:size-3.5",
        xl: "size-5 [&_svg]:size-4"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var popoverGroupLabel = "px-2 py-1.5 text-xs font-medium select-none text-gray-light-500 dark:text-gray-dark-400";
var popoverEmpty = "px-2 py-6 text-center text-sm select-none text-gray-light-500 dark:text-gray-dark-400";
var PopoverContext = createContext({
  width: "target",
  withinPortal: true
});
var Root = ({
  width = "target",
  position,
  gutter,
  offset,
  withinPortal = true,
  container,
  children,
  onOpenChange,
  onClose,
  ...rest
}) => /* @__PURE__ */ jsx(PopoverContext.Provider, { value: { width, withinPortal, container }, children: /* @__PURE__ */ jsx(
  Popover$1.Root,
  {
    positioning: { sameWidth: width === "target", placement: position, gutter, offset },
    onOpenChange: (details) => {
      onOpenChange?.(details);
      if (!details.open) onClose?.();
    },
    ...rest,
    children
  }
) });
var Content = ({ className, children, testId, ...rest }) => {
  const { width, withinPortal, container } = useContext(PopoverContext);
  const panel = /* @__PURE__ */ jsx(Popover$1.Positioner, { children: /* @__PURE__ */ jsx(
    Popover$1.Content,
    {
      tabIndex: -1,
      className: cn(popoverPanel, width === "target" ? "w-full" : "w-max", className),
      ...props({ "data-testid": testId }),
      ...rest,
      children
    }
  ) });
  if (!withinPortal) return panel;
  return /* @__PURE__ */ jsx(Portal, { container: container ? { current: container } : void 0, children: panel });
};
var slotEdge = "shrink-0 px-2 py-1.5 border-brand-900/20 dark:border-white/15";
var Header = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(slotEdge, "border-b", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Footer = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx("div", { className: cn(slotEdge, className), ...props({ "data-testid": testId }), ...rest });
var Body = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(popoverViewport, slotEdge, className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Popover = {
  Root,
  Trigger: Popover$1.Trigger,
  Content,
  Header,
  Body,
  Footer
};

export { Popover, popoverCheckbox, popoverChevron, popoverChrome, popoverClearTrigger, popoverContent, popoverEmpty, popoverGroupLabel, popoverIndicator, popoverList, popoverOption, popoverPanel, scrollHighlightedIntoView };
