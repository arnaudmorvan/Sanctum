import { scrollHighlightedIntoView, popoverChevron, popoverClearTrigger, popoverList, popoverContent, popoverIndicator, popoverOption, popoverGroupLabel, popoverEmpty } from './chunk-PRHZ6FHV.js';
import { inputSlot, inputShell, inputControlClasses } from './chunk-MWXEQ5QX.js';
import { ChevronIcon, CloseIcon, CheckIcon } from './chunk-IG7FBZVM.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Combobox as Combobox$1 } from '@ark-ui/react/combobox';
import { Portal } from '@ark-ui/react/portal';
import { createContext, useContext } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

var ComboboxStyleContext = createContext({
  size: "md",
  variant: "default"
});
var Root = ({
  size = "md",
  variant = "default",
  color,
  positioning,
  className,
  children,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(ComboboxStyleContext.Provider, { value: { size, variant, color }, children: /* @__PURE__ */ jsx(
  Combobox$1.Root,
  {
    "data-color": color,
    positioning: { sameWidth: true, ...positioning },
    scrollToIndexFn: scrollHighlightedIntoView,
    className: cn("w-full", className),
    ...props({ "data-testid": testId }),
    ...rest,
    children
  }
) });
var Control = ({
  startSlot,
  endSlot,
  className,
  children,
  testId,
  ...rest
}) => {
  const { size, variant } = useContext(ComboboxStyleContext);
  return /* @__PURE__ */ jsxs(
    Combobox$1.Control,
    {
      ...props({
        "data-with-start-slot": startSlot != null,
        // The composed Trigger / ClearTrigger always sits at the end.
        "data-with-end-slot": true,
        "data-testid": testId
      }),
      className: cn(inputShell({ size, variant }), className),
      ...rest,
      children: [
        startSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: startSlot }),
        children,
        endSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, children: endSlot })
      ]
    }
  );
};
var Input = ({
  className,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  Combobox$1.Input,
  {
    className: cn(inputControlClasses, className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Trigger = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(
  Combobox$1.Trigger,
  {
    className: cn(
      popoverChevron,
      "inline-flex cursor-pointer items-center justify-center rounded-sm",
      "data-[state=open]:rotate-180 disabled:cursor-not-allowed",
      className
    ),
    ...rest,
    children: children ?? /* @__PURE__ */ jsx(ChevronIcon, {})
  }
);
var ClearTrigger = ({
  className,
  children,
  ...rest
}) => (
  // zag marks the combobox clear control `tabIndex={-1}`; surface it in the tab
  // order so keyboard users can reach it (matching Select's clear and the tree
  // clears). A caller can still override via `tabIndex` in `rest`.
  /* @__PURE__ */ jsx(Combobox$1.ClearTrigger, { tabIndex: 0, className: cn(popoverClearTrigger, className), ...rest, children: children ?? /* @__PURE__ */ jsx(CloseIcon, {}) })
);
var Content = ({
  className,
  children,
  withPaddingTop = true,
  ...rest
}) => {
  const { color } = useContext(ComboboxStyleContext);
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(Combobox$1.Positioner, { children: /* @__PURE__ */ jsx(Combobox$1.Content, { "data-color": color, className: cn(popoverContent, className), ...rest, children: /* @__PURE__ */ jsx(Combobox$1.List, { className: popoverList({ withPaddingTop }), children }) }) }) });
};
var Panel = ({
  className,
  children,
  withPaddingTop = true,
  ...rest
}) => {
  const { color } = useContext(ComboboxStyleContext);
  return /* @__PURE__ */ jsx(Combobox$1.Content, { "data-color": color, ...rest, children: /* @__PURE__ */ jsx(Combobox$1.List, { className: cn(popoverList({ withPaddingTop }), className), children }) });
};
var Item = ({ className, children, testId, ...rest }) => {
  const { size } = useContext(ComboboxStyleContext);
  return /* @__PURE__ */ jsx(
    Combobox$1.Item,
    {
      className: cn(popoverOption({ size }), className),
      ...props({ "data-testid": testId }),
      ...rest,
      children: typeof children === "function" ? /* @__PURE__ */ jsx(Combobox$1.ItemContext, { children: (ctx) => children({ selected: ctx.selected, highlighted: ctx.highlighted }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Combobox$1.ItemText, { children }),
        /* @__PURE__ */ jsx(Combobox$1.ItemIndicator, { className: popoverIndicator, children: /* @__PURE__ */ jsx(CheckIcon, {}) })
      ] })
    }
  );
};
var Group = ({ label, className, children, ...rest }) => /* @__PURE__ */ jsxs(Combobox$1.ItemGroup, { className, ...rest, children: [
  label != null && /* @__PURE__ */ jsx(Combobox$1.ItemGroupLabel, { className: popoverGroupLabel, children: label }),
  children
] });
var Empty = ({ className, ...rest }) => /* @__PURE__ */ jsx(Combobox$1.Empty, { className: cn(popoverEmpty, className), ...rest });
var Combobox = {
  Root,
  Control,
  Input,
  Trigger,
  ClearTrigger,
  Content,
  Panel,
  Item,
  Group,
  Empty,
  Context: Combobox$1.Context
};

export { Combobox };
