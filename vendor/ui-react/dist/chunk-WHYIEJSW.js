import { resolveLogicalPlacement } from './chunk-G52U24GR.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { useLocaleContext } from '@ark-ui/react/locale';
import { Portal } from '@ark-ui/react/portal';
import { Tooltip as Tooltip$1 } from '@ark-ui/react/tooltip';
import { cva } from 'class-variance-authority';
import { createContext, useId, useContext } from 'react';
import { match } from 'ts-pattern';
import { jsxs, jsx } from 'react/jsx-runtime';

var tooltipContent = cn(
  "z-(--popover-z,50) max-w-[16rem] rounded-xs px-2 py-1",
  "text-xs leading-snug focus:outline-none",
  "bg-gray-light-900 text-gray-light-25 dark:bg-gray-dark-100 dark:text-gray-dark-900",
  "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out",
  "data-[placement^=top]:origin-bottom data-[placement^=bottom]:origin-top",
  "data-[placement^=left]:origin-right data-[placement^=right]:origin-left"
);
var tooltipPositioner = "rounded-xs shadow-md";
var tooltipArrow = cn("-z-1! rounded-xxs", "bg-gray-light-900! dark:bg-gray-dark-100!");
var tooltipTrigger = cva(
  [
    "inline cursor-help appearance-none border-0 bg-transparent p-0",
    "[font:inherit] text-inherit",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950",
    "rounded-xs"
  ],
  {
    variants: {
      variant: {
        text: "underline decoration-dotted underline-offset-2 text-gray-light-900 dark:text-gray-dark-100",
        inline: ""
      }
    },
    defaultVariants: {
      variant: "inline"
    }
  }
);
var TooltipContext = createContext({ withinPortal: true });
var Root = ({
  position = "top",
  offset,
  withinPortal = true,
  container,
  children,
  onOpenChange,
  onClose,
  ...rest
}) => {
  const { dir } = useLocaleContext();
  return /* @__PURE__ */ jsx(TooltipContext.Provider, { value: { withinPortal, container }, children: /* @__PURE__ */ jsx(
    Tooltip$1.Root,
    {
      lazyMount: true,
      unmountOnExit: true,
      positioning: { placement: resolveLogicalPlacement(position, dir), gutter: offset },
      onOpenChange: (details) => {
        onOpenChange?.(details);
        if (!details.open) onClose?.();
      },
      ...rest,
      children
    }
  ) });
};
var Content = ({ className, children, testId, ...rest }) => {
  const { withinPortal, container } = useContext(TooltipContext);
  const bubble = /* @__PURE__ */ jsx(Tooltip$1.Positioner, { className: tooltipPositioner, children: /* @__PURE__ */ jsx(
    Tooltip$1.Content,
    {
      className: cn(tooltipContent, className),
      ...props({ "data-testid": testId }),
      ...rest,
      children
    }
  ) });
  if (!withinPortal) return bubble;
  return /* @__PURE__ */ jsx(Portal, { container: container ? { current: container } : void 0, children: bubble });
};
var Arrow = ({ className, style, testId }) => /* @__PURE__ */ jsx(
  Tooltip$1.Arrow,
  {
    style: { ["--arrow-size"]: "12px", ["--arrow-offset"]: "-8px", ...style },
    ...props({ "data-testid": testId }),
    children: /* @__PURE__ */ jsx(Tooltip$1.ArrowTip, { className: cn(tooltipArrow, className) })
  }
);
var TooltipComponent = ({
  label,
  children,
  asChild,
  classNames,
  withArrow,
  variant = "inline",
  testId,
  ...root
}) => {
  const id = `tooltip-${useId()}`;
  return /* @__PURE__ */ jsxs(Root, { ...root, children: [
    match({ asChild }).with({ asChild: true }, () => /* @__PURE__ */ jsx(Tooltip$1.Trigger, { asChild: true, children })).otherwise(() => /* @__PURE__ */ jsx(
      Tooltip$1.Trigger,
      {
        asChild: true,
        className: cn(tooltipTrigger({ variant }), classNames?.trigger),
        children: /* @__PURE__ */ jsx("span", { tabIndex: 0, "aria-describedby": id, children })
      }
    )),
    /* @__PURE__ */ jsxs(Content, { className: classNames?.content, id, testId, children: [
      withArrow && /* @__PURE__ */ jsx(Arrow, { className: classNames?.arrow }),
      label
    ] })
  ] });
};
var Tooltip = Object.assign(TooltipComponent, {
  Root,
  Trigger: Tooltip$1.Trigger,
  Content,
  Arrow
});

export { Tooltip };
