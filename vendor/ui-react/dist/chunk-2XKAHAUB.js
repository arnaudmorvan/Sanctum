import { ActionIcon } from './chunk-3KHUHVCD.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { cva } from 'class-variance-authority';
import { XIcon } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';

var modalBackdrop = cva([
  "fixed inset-0 z-(--modal-z,50) bg-black/50 backdrop-blur-lg pointer-events-auto select-none",
  "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
]);
var modalPositioner = cva(
  "fixed inset-0 z-(--modal-z,50) flex flex-col items-center overflow-y-auto p-4",
  {
    variants: {
      position: {
        center: "justify-center",
        top: "justify-start mt-[8vh]",
        bottom: "justify-end mb-[8vh]"
      }
    },
    defaultVariants: { position: "center" }
  }
);
var modalContent = cva(
  [
    "relative flex w-full flex-col",
    "max-h-[calc(100dvh-2rem)]",
    "bg-brand-50 text-gray-light-900 border border-brand-900/20 shadow-2xl",
    "dark:bg-brand-950 dark:text-gray-dark-25 dark:border-white/15",
    "focus:outline-none",
    "data-[state=open]:animate-modal-in data-[state=closed]:animate-modal-out"
  ],
  {
    variants: {
      size: {
        xs: "max-w-(--width-xs)",
        // 24rem
        sm: "max-w-(--width-sm)",
        // 30rem
        md: "max-w-(--width-md)",
        // 35rem
        lg: "max-w-(--width-lg)",
        // 40rem
        xl: "max-w-(--width-xl)",
        // 48rem
        full: "max-w-[calc(100vw-2rem)] min-h-[calc(100dvh-2rem)]"
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-xl",
        xl: "rounded-2xl"
      }
    },
    defaultVariants: { size: "md", radius: "sm" }
  }
);
var PADDING = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem"
};
var ModalRoot = Dialog.Root;
var ModalTrigger = Dialog.Trigger;
var ModalContext = Dialog.Context;
var ModalBackdrop = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Dialog.Backdrop,
  {
    className: cn(modalBackdrop(), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalPositioner = ({ className, position, testId, ...rest }) => /* @__PURE__ */ jsx(
  Dialog.Positioner,
  {
    className: cn(modalPositioner({ position }), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalContent = ({ className, size, radius, testId, ...rest }) => /* @__PURE__ */ jsx(
  Dialog.Content,
  {
    className: cn(modalContent({ size, radius }), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalTitle = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Dialog.Title,
  {
    className: cn("text-xl font-semibold leading-tight", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalDescription = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  Dialog.Description,
  {
    className: cn("text-sm text-gray-light-500 dark:text-gray-dark-400", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalCloseTrigger = ({
  children,
  className,
  "aria-label": ariaLabel = "Close",
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(Dialog.CloseTrigger, { asChild: true, ...rest, children: /* @__PURE__ */ jsx(
  ActionIcon,
  {
    variant: "subtle",
    color: "gray",
    size: "xs",
    "aria-label": ariaLabel,
    className,
    testId,
    children: children ?? /* @__PURE__ */ jsx(XIcon, {})
  }
) });
var ModalHeader = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex items-start min-h-15 justify-between gap-4 px-(--modal-px,1.25rem) pt-(--modal-px,1.25rem) pb-3",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalBody = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex-1 overflow-y-auto px-(--modal-px,1.25rem) py-1", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalFooter = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex items-center justify-end gap-2 px-(--modal-px,1.25rem) pb-(--modal-px,1.25rem) pt-4",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ModalComponent = ({
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  title,
  description,
  size,
  radius,
  position,
  withCloseButton = true,
  withBackdrop = true,
  padding = "md",
  closeOnEscape,
  closeOnInteractOutside,
  role,
  onExitComplete,
  container,
  children,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const hasHeader = title != null || description != null || withCloseButton;
  return /* @__PURE__ */ jsx(
    Dialog.Root,
    {
      open,
      defaultOpen,
      onOpenChange: ({ open: next }) => {
        onOpenChange?.(next);
        if (!next) onClose?.();
      },
      closeOnEscape,
      closeOnInteractOutside: closeOnInteractOutside ?? role !== "alertdialog",
      role,
      lazyMount: true,
      unmountOnExit: true,
      modal: withBackdrop,
      onExitComplete,
      ...rest,
      children: /* @__PURE__ */ jsxs(Portal, { container: container ? { current: container } : void 0, children: [
        withBackdrop && /* @__PURE__ */ jsx(ModalBackdrop, { className: classNames?.backdrop }),
        /* @__PURE__ */ jsx(
          ModalPositioner,
          {
            position,
            className: cn(classNames?.positioner, "overflow-clip"),
            children: /* @__PURE__ */ jsxs(
              ModalContent,
              {
                size,
                radius,
                style: { ["--modal-px"]: PADDING[padding] },
                className: cn(className, classNames?.content),
                testId,
                children: [
                  hasHeader && /* @__PURE__ */ jsxs(ModalHeader, { className: classNames?.header, children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                      title != null && /* @__PURE__ */ jsx(ModalTitle, { className: classNames?.title, children: title }),
                      description != null && /* @__PURE__ */ jsx(ModalDescription, { className: classNames?.description, children: description })
                    ] }),
                    withCloseButton && /* @__PURE__ */ jsx(ModalCloseTrigger, { className: classNames?.closeButton })
                  ] }),
                  /* @__PURE__ */ jsx(
                    ModalBody,
                    {
                      className: cn(
                        !hasHeader && "pt-(--modal-px,1.25rem)",
                        "pb-(--modal-px,1.25rem)",
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
var Modal = Object.assign(ModalComponent, {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Context: ModalContext,
  Backdrop: ModalBackdrop,
  Positioner: ModalPositioner,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseTrigger: ModalCloseTrigger,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter
});

export { Modal };
