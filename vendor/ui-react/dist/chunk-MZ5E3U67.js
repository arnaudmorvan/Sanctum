import { resolveLogicalPlacement } from './chunk-G52U24GR.js';
import { popoverChrome, popoverGroupLabel, popoverIndicator, popoverChevron } from './chunk-PRHZ6FHV.js';
import { CheckIcon, ChevronIcon } from './chunk-IG7FBZVM.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { useLocaleContext } from '@ark-ui/react/locale';
import { Menu } from '@ark-ui/react/menu';
import { Portal } from '@ark-ui/react/portal';
import { cva } from 'class-variance-authority';
import { createContext, useContext, useId } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

var menuContent = cn(
  popoverChrome,
  "flex w-max min-w-40 flex-col p-1",
  "max-h-[min(24rem,var(--available-height,24rem))] overflow-y-auto overscroll-contain"
);
var menuItem = cva(
  [
    "relative flex cursor-pointer items-center gap-2 rounded-xs px-2.5 py-1.5 text-md",
    "select-none outline-none",
    "data-[state=checked]:font-medium",
    "data-disabled:pointer-events-none data-disabled:opacity-50"
  ],
  {
    variants: {
      colored: {
        // Neutral highlight is transparent — a low-opacity black/white wash,
        // not an opaque gray — matching the surface's own background-dependent
        // tint (no Figma reference for this state yet).
        false: [
          "text-gray-light-900 dark:text-gray-dark-100",
          "data-highlighted:bg-black/5 dark:data-highlighted:bg-white/8"
        ],
        // Slot vars already shift by theme (colors.css), so no `dark:` needed.
        true: ["text-(--c-text)", "data-highlighted:bg-(--c-soft)"]
      }
    },
    defaultVariants: { colored: false }
  }
);
var menuDivider = "-mx-1 my-1 h-px border-0 bg-brand-900/20 dark:bg-white/15";
var MenuContext = createContext({ withinPortal: true });
var Root = ({
  position = "bottom",
  offset,
  withinPortal = true,
  container,
  onOpenChange,
  onClose,
  children,
  ...rest
}) => {
  const { dir } = useLocaleContext();
  return /* @__PURE__ */ jsx(MenuContext.Provider, { value: { withinPortal, container }, children: /* @__PURE__ */ jsx(
    Menu.Root,
    {
      positioning: { placement: resolveLogicalPlacement(position, dir), gutter: offset },
      onOpenChange: ({ open }) => {
        onOpenChange?.(open);
        if (!open) onClose?.();
      },
      ...rest,
      children
    }
  ) });
};
var Content = ({ className, children, testId, ...rest }) => {
  const { withinPortal, container } = useContext(MenuContext);
  const panel = /* @__PURE__ */ jsx(Menu.Positioner, { children: /* @__PURE__ */ jsx(
    Menu.Content,
    {
      className: cn(menuContent, className),
      ...props({ "data-testid": testId }),
      ...rest,
      children
    }
  ) });
  if (!withinPortal) return panel;
  return /* @__PURE__ */ jsx(Portal, { container: container ? { current: container } : void 0, children: panel });
};
var EndSection = ({ children }) => /* @__PURE__ */ jsx("span", { className: "ms-auto inline-flex shrink-0 items-center gap-2 text-gray-light-500 dark:text-gray-dark-400", children });
var Item = ({
  value,
  startSection,
  endSection,
  color,
  onClick,
  className,
  children,
  testId,
  ...rest
}) => {
  const autoId = useId();
  return /* @__PURE__ */ jsxs(
    Menu.Item,
    {
      value: value ?? autoId,
      onSelect: onClick,
      "data-color": color,
      className: cn(menuItem({ colored: color != null }), className),
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        startSection,
        children,
        endSection != null && /* @__PURE__ */ jsx(EndSection, { children: endSection })
      ]
    }
  );
};
var HeadingPrefix = ({ prefix }) => prefix === void 0 ? null : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "select-none", children: prefix });
var Label = ({ className, prefix, children, testId, ...rest }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: cn(popoverGroupLabel, className),
    ...props({ "data-testid": testId }),
    ...rest,
    children: [
      /* @__PURE__ */ jsx(HeadingPrefix, { prefix }),
      children
    ]
  }
);
var ItemGroupLabel = ({ className, prefix, children, testId, ...rest }) => /* @__PURE__ */ jsxs(
  Menu.ItemGroupLabel,
  {
    className: cn(popoverGroupLabel, className),
    ...props({ "data-testid": testId }),
    ...rest,
    children: [
      /* @__PURE__ */ jsx(HeadingPrefix, { prefix }),
      children
    ]
  }
);
var Divider = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Menu.Separator,
  {
    className: cn(menuDivider, className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var CheckboxItem = ({
  startSection,
  color,
  className,
  children,
  testId,
  ...rest
}) => /* @__PURE__ */ jsxs(
  Menu.CheckboxItem,
  {
    "data-color": color,
    className: cn(menuItem({ colored: color != null }), className),
    ...props({ "data-testid": testId }),
    ...rest,
    children: [
      startSection,
      children,
      /* @__PURE__ */ jsx(Menu.ItemIndicator, { className: popoverIndicator, children: /* @__PURE__ */ jsx(CheckIcon, {}) })
    ]
  }
);
var RadioGroup = ({ onChange, ...rest }) => /* @__PURE__ */ jsx(
  Menu.RadioItemGroup,
  {
    onValueChange: onChange ? ({ value }) => onChange(value) : void 0,
    ...rest
  }
);
var RadioItem = ({
  startSection,
  color,
  className,
  children,
  testId,
  ...rest
}) => /* @__PURE__ */ jsxs(
  Menu.RadioItem,
  {
    "data-color": color,
    className: cn(menuItem({ colored: color != null }), className),
    ...props({ "data-testid": testId }),
    ...rest,
    children: [
      startSection,
      children,
      /* @__PURE__ */ jsx(Menu.ItemIndicator, { className: popoverIndicator, children: /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "lucide lucide-dot-big",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ jsx("title", { children: "Dot big" }),
            /* @__PURE__ */ jsx("circle", { cx: "12.1", cy: "12.1", r: "4" })
          ]
        }
      ) })
    ]
  }
);
var SUBMENU_ALIGN_OFFSET = -5;
var Sub = ({ offset = 10, children, ...rest }) => /* @__PURE__ */ jsx(
  Menu.Root,
  {
    positioning: { offset: { mainAxis: offset, crossAxis: SUBMENU_ALIGN_OFFSET } },
    ...rest,
    children
  }
);
var SubTrigger = ({
  startSection,
  color,
  className,
  children,
  testId,
  ...rest
}) => /* @__PURE__ */ jsxs(
  Menu.TriggerItem,
  {
    "data-color": color,
    className: cn(menuItem({ colored: color != null }), className),
    ...props({ "data-testid": testId }),
    ...rest,
    children: [
      startSection,
      children,
      /* @__PURE__ */ jsx("span", { className: cn(popoverChevron, "ms-auto -me-1 -rotate-90 rtl:rotate-90 [&_svg]:size-4"), children: /* @__PURE__ */ jsx(ChevronIcon, {}) })
    ]
  }
);
var Trigger = Menu.Trigger;
var ContextTrigger = Menu.ContextTrigger;
var ItemGroup = Menu.ItemGroup;
var Context = Menu.Context;
var Separator = Divider;
var SubContent = Content;

export { CheckboxItem, Content, Context, ContextTrigger, Divider, Item, ItemGroup, ItemGroupLabel, Label, RadioGroup, RadioItem, Root, Separator, Sub, SubContent, SubTrigger, Trigger };
