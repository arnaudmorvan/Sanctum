"use client";
import { resolveLogicalPlacement } from '../../chunk-G52U24GR.js';
import { popoverChrome } from '../../chunk-GLWR5YCB.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { HoverCard as HoverCard$1 } from '@ark-ui/react/hover-card';
import { useLocaleContext } from '@ark-ui/react/locale';
import { Portal } from '@ark-ui/react/portal';
import { createContext, useContext, Children, useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

var hoverCardSlideStyle = {
  transitionProperty: "transform",
  transitionDuration: "200ms",
  transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)"
};
var HoverCardContext = createContext({
  width: "auto",
  withinPortal: true,
  sliding: false
});
var Root = ({
  width = "auto",
  position = "bottom",
  gutter,
  offset,
  withinPortal = true,
  container,
  openDelay,
  children,
  onOpenChange,
  onClose,
  ...rest
}) => {
  const { dir } = useLocaleContext();
  return /* @__PURE__ */ jsx(HoverCardContext.Provider, { value: { width, withinPortal, container, sliding: false }, children: /* @__PURE__ */ jsx(
    HoverCard$1.Root,
    {
      lazyMount: true,
      unmountOnExit: true,
      openDelay,
      positioning: {
        sameWidth: width === "target",
        placement: resolveLogicalPlacement(position, dir),
        gutter,
        offset
      },
      onOpenChange: ({ open }) => {
        onOpenChange?.(open);
        if (!open) onClose?.();
      },
      ...rest,
      children
    }
  ) });
};
var Content = ({
  className,
  children,
  testId,
  value: _value,
  ...rest
}) => {
  const { width, withinPortal, container, sliding } = useContext(HoverCardContext);
  const panel = /* @__PURE__ */ jsx(HoverCard$1.Positioner, { style: sliding ? hoverCardSlideStyle : void 0, children: /* @__PURE__ */ jsx(
    HoverCard$1.Content,
    {
      tabIndex: -1,
      className: cn(popoverChrome, width === "target" ? "w-full" : "w-max", className),
      ...props({ "data-testid": testId }),
      ...rest,
      children
    }
  ) });
  if (!withinPortal) return panel;
  return /* @__PURE__ */ jsx(Portal, { container: container ? { current: container } : void 0, children: panel });
};
var isGroupContent = (node) => isValidElement(node) && node.type === Content;
var Group = ({
  width = "auto",
  position = "bottom",
  gutter,
  offset,
  withinPortal = true,
  container,
  openDelay,
  children,
  onOpenChange,
  onClose,
  ...rest
}) => {
  const { dir } = useLocaleContext();
  const items = Children.toArray(children);
  const contents = items.filter(isGroupContent);
  const triggers = items.filter((item) => !isGroupContent(item));
  const [sliding, setSliding] = useState(false);
  const slidingRafRef = useRef(null);
  useEffect(
    () => () => {
      if (slidingRafRef.current != null) cancelAnimationFrame(slidingRafRef.current);
    },
    []
  );
  return /* @__PURE__ */ jsx(HoverCardContext.Provider, { value: { width, withinPortal, container, sliding }, children: /* @__PURE__ */ jsxs(
    HoverCard$1.Root,
    {
      lazyMount: true,
      unmountOnExit: true,
      openDelay,
      positioning: {
        sameWidth: width === "target",
        placement: resolveLogicalPlacement(position, dir),
        gutter,
        offset
      },
      onOpenChange: ({ open }) => {
        onOpenChange?.(open);
        if (open) {
          slidingRafRef.current = requestAnimationFrame(() => {
            slidingRafRef.current = null;
            setSliding(true);
          });
        } else {
          if (slidingRafRef.current != null) {
            cancelAnimationFrame(slidingRafRef.current);
            slidingRafRef.current = null;
          }
          setSliding(false);
          onClose?.();
        }
      },
      ...rest,
      children: [
        triggers,
        /* @__PURE__ */ jsx(HoverCard$1.Context, { children: (api) => {
          const active = contents.find((c) => c.props.value === api.triggerValue);
          return active ? cloneElement(active, { key: "hover-card-group-content" }) : null;
        } })
      ]
    }
  ) });
};
var HoverCard = {
  Root,
  Trigger: HoverCard$1.Trigger,
  Content,
  Group
};

export { HoverCard };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map