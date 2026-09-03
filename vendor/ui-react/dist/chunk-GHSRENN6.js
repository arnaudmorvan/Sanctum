import { ActionIcon } from './chunk-3KHUHVCD.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Drawer as Drawer$1 } from '@ark-ui/react/drawer';
import { Portal } from '@ark-ui/react/portal';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';

var PLACEMENT_TO_SWIPE = {
  start: "start",
  end: "end",
  top: "up",
  bottom: "down"
};
var isInline = (p) => p === "start" || p === "end";
var INLINE_SIZE = {
  xs: "w-[18rem]",
  sm: "w-[22rem]",
  md: "w-[28rem]",
  lg: "w-[34rem]",
  xl: "w-[42rem]"
};
var BLOCK_SIZE = {
  xs: "h-[30dvh]",
  sm: "h-[40dvh]",
  md: "h-[55dvh]",
  lg: "h-[70dvh]",
  xl: "h-[85dvh]"
};
var PADDING = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem"
};
var drawerBackdrop = cva([
  "fixed inset-0 z-(--modal-z,50) bg-black/50 backdrop-blur-lg",
  "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
]);
var drawerPositioner = cva("fixed inset-0 z-(--modal-z,50) flex", {
  variants: {
    placement: {
      start: "items-stretch justify-start",
      end: "items-stretch justify-end",
      top: "items-start justify-stretch",
      bottom: "items-end justify-stretch"
    }
  },
  defaultVariants: { placement: "end" }
});
var drawerContent = cva([
  "relative flex flex-col overflow-hidden",
  "bg-brand-50 text-gray-light-900 shadow-2xl",
  "dark:bg-brand-950 dark:text-gray-dark-25",
  "focus:outline-none",
  // border on the docked edge only — keyed by data-placement in theme.css
  "data-[placement=start]:border-e data-[placement=end]:border-s",
  "data-[placement=top]:border-b data-[placement=bottom]:border-t",
  "border-brand-900/20 dark:border-white/15",
  "data-[state=open]:animate-drawer-in data-[state=closed]:animate-drawer-out"
]);
var DrawerRoot = Drawer$1.Root;
var DrawerTrigger = Drawer$1.Trigger;
var DrawerContext = Drawer$1.Context;
var DrawerBackdrop = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Drawer$1.Backdrop,
  {
    className: cn(drawerBackdrop(), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var DrawerTitle = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Drawer$1.Title,
  {
    className: cn("text-lg font-semibold leading-tight", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var DrawerDescription = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Drawer$1.Description,
  {
    className: cn("text-sm text-gray-light-500 dark:text-gray-dark-400", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var DrawerCloseTrigger = ({
  children,
  className,
  "aria-label": ariaLabel = "Close",
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(Drawer$1.CloseTrigger, { asChild: true, ...rest, children: /* @__PURE__ */ jsx(
  ActionIcon,
  {
    variant: "subtle",
    color: "gray",
    size: "sm",
    "aria-label": ariaLabel,
    className,
    testId,
    children: children ?? /* @__PURE__ */ jsx(X, {})
  }
) });
var DrawerGrabber = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Drawer$1.Grabber,
  {
    className: cn(
      "flex shrink-0 cursor-grab touch-none items-center justify-center py-2",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest,
    children: /* @__PURE__ */ jsx(Drawer$1.GrabberIndicator, { className: "h-1.5 w-20 rounded-full bg-gray-light-300 dark:bg-gray-dark-700" })
  }
);
var DrawerHeader = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex items-start justify-between gap-4 px-(--drawer-px,1.25rem) pt-(--drawer-px,1.25rem) pb-3",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var DrawerBody = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex-1 overflow-y-auto px-(--drawer-px,1.25rem) py-1", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var DrawerFooter = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex items-center justify-end gap-2 px-(--drawer-px,1.25rem) pb-(--drawer-px,1.25rem) pt-4",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Drawer = ({
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  placement = "end",
  size = "md",
  title,
  description,
  withCloseButton = true,
  withGrabber = false,
  withBackdrop = true,
  padding = "md",
  closeOnEscape,
  closeOnInteractOutside,
  onExitComplete,
  container,
  children,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const hasHeader = title != null || description != null || withCloseButton;
  const sizeClass = isInline(placement) ? `${INLINE_SIZE[size]} h-full max-w-[90vw]` : `${BLOCK_SIZE[size]} w-full max-h-[90dvh]`;
  return /* @__PURE__ */ jsx(
    Drawer$1.Root,
    {
      open,
      defaultOpen,
      onOpenChange: ({ open: next }) => {
        onOpenChange?.(next);
        if (!next) onClose?.();
      },
      swipeDirection: PLACEMENT_TO_SWIPE[placement],
      closeOnEscape,
      closeOnInteractOutside,
      lazyMount: true,
      unmountOnExit: true,
      modal: withBackdrop,
      onExitComplete,
      ...rest,
      children: /* @__PURE__ */ jsxs(Portal, { container: container ? { current: container } : void 0, children: [
        withBackdrop && /* @__PURE__ */ jsx(DrawerBackdrop, { className: classNames?.backdrop }),
        /* @__PURE__ */ jsx(
          Drawer$1.Positioner,
          {
            "data-placement": placement,
            className: cn(drawerPositioner({ placement }), classNames?.positioner),
            children: /* @__PURE__ */ jsxs(
              Drawer$1.Content,
              {
                "data-placement": placement,
                style: { ["--drawer-px"]: PADDING[padding] },
                className: cn(drawerContent(), sizeClass, className, classNames?.content),
                ...props({ "data-testid": testId }),
                children: [
                  withGrabber && /* @__PURE__ */ jsx(DrawerGrabber, { className: classNames?.grabber }),
                  hasHeader && /* @__PURE__ */ jsxs(DrawerHeader, { className: classNames?.header, children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                      title != null && /* @__PURE__ */ jsx(DrawerTitle, { className: classNames?.title, children: title }),
                      description != null && /* @__PURE__ */ jsx(DrawerDescription, { className: classNames?.description, children: description })
                    ] }),
                    withCloseButton && /* @__PURE__ */ jsx(DrawerCloseTrigger, { className: classNames?.closeButton })
                  ] }),
                  /* @__PURE__ */ jsx(
                    DrawerBody,
                    {
                      className: cn(
                        !hasHeader && !withGrabber && "pt-(--drawer-px,1.25rem)",
                        "pb-(--drawer-px,1.25rem)",
                        classNames?.body
                      ),
                      children
                    }
                  )
                ]
              }
            )
          }
        )
      ] })
    }
  );
};
Drawer.Root = DrawerRoot;
Drawer.Trigger = DrawerTrigger;
Drawer.Context = DrawerContext;
Drawer.Backdrop = DrawerBackdrop;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.CloseTrigger = DrawerCloseTrigger;
Drawer.Grabber = DrawerGrabber;
Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

export { Drawer, DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContext, DrawerDescription, DrawerFooter, DrawerGrabber, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger };
