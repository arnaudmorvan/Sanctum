import { Collapse } from './chunk-5BH3GLO4.js';
import { Spinner } from './chunk-RNXO7W2J.js';
import { CloseIcon } from './chunk-IG7FBZVM.js';
import { useUncontrolled } from './chunk-BEL75C7N.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { InfoIcon, TriangleAlertIcon, AlertCircleIcon, CheckCircleIcon, ChevronDownIcon } from 'lucide-react';
import { useRef } from 'react';
import { match } from 'ts-pattern';
import { jsxs, jsx } from 'react/jsx-runtime';

var notificationSurface = {
  filled: [
    "bg-gray-true-100/70 dark:bg-gray-true-900/70",
    "text-(--c-on-solid) border-transparent"
  ],
  light: "bg-(--c-soft) text-(--c-text) border-transparent",
  outline: [
    "bg-brand-50/90 dark:bg-brand-950/85",
    "text-(--c-solid) border-(--c-solid) backdrop-blur-lg"
  ],
  subtle: [
    "text-(--c-solid)",
    // Brand-tinted surface, matching InputBase's shell and the other
    // floating surfaces (Popover/Modal/Drawer) — see popover.tsx.
    "bg-brand-50/90 dark:bg-brand-950/85",
    "text-gray-light-900 border-brand-900/20",
    "dark:text-gray-dark-25 dark:border-white/15"
  ],
  default: [
    "text-gray-light-900 dark:text-gray-dark-25",
    "border-gray-true-900 dark:border-gray-true-25/80",
    "bg-brand-50/90 dark:bg-brand-950/85",
    "backdrop-blur-lg"
  ]
};
var notificationRoot = cva(
  [
    "data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out",
    "pointer-events-auto flex flex-col w-88 max-w-[calc(100vw-2rem)]",
    // Phones (< xs): fill the full-bleed bottom region (see createNotifier).
    "max-xs:w-full! max-xs:max-w-none!",
    "rounded-card border px-3 py-3",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
    "shadow-2xl shadow-gray-light-100 dark:shadow-gray-dark-900",
    "overflow-clip"
  ],
  {
    variants: { variant: notificationSurface },
    defaultVariants: { variant: "outline" }
  }
);
var TOAST_STATUS = {
  success: { color: "green", variant: "outline", icon: /* @__PURE__ */ jsx(CheckCircleIcon, {}) },
  error: { color: "red", variant: "outline", icon: /* @__PURE__ */ jsx(AlertCircleIcon, {}) },
  warning: { color: "orange", variant: "outline", icon: /* @__PURE__ */ jsx(TriangleAlertIcon, {}) },
  info: { color: "gray", variant: "default", icon: /* @__PURE__ */ jsx(InfoIcon, {}) },
  loading: { color: "gray", variant: "default", icon: /* @__PURE__ */ jsx(Spinner, { size: "md", label: null }) }
};
var Root = ({ className, variant, color, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    "data-color": color,
    className: cn(notificationRoot({ variant }), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Icon = ({
  className,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  "span",
  {
    className: cn("inline-flex [&_svg]:size-5", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Title = ({
  className,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("text-sm font-bold text-gray-light-950 dark:text-gray-dark-25", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Description = ({
  className,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "mt-1 text-sm font-normal text-gray-light-700 opacity-90 dark:text-gray-dark-300",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ActionTrigger = ({
  className,
  type,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  "button",
  {
    type: type ?? "button",
    className: cn(
      "inline-flex h-7 cursor-pointer items-center rounded-input px-2 text-xs font-medium",
      "border border-current/30 hover:bg-current/10",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50",
      "transition-colors",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var CloseTrigger = ({
  className,
  children,
  type,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  "button",
  {
    type: type ?? "button",
    "aria-label": "Dismiss",
    className: cn(
      "ms-auto inline-flex size-5 shrink-0 cursor-pointer items-center justify-center",
      "rounded-full opacity-70 hover:opacity-100 [&_svg]:size-4",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50",
      "transition-colors",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest,
    children: children ?? /* @__PURE__ */ jsx(CloseIcon, {})
  }
);
var CollapseTrigger = ({
  className,
  children,
  type,
  open,
  ...rest
}) => /* @__PURE__ */ jsx(
  "button",
  {
    type: type ?? "button",
    "aria-label": open ? "Collapse" : "Expand",
    "aria-expanded": open,
    className: cn(
      "ms-auto inline-flex size-5 shrink-0 cursor-pointer items-center justify-center",
      "rounded-full opacity-70 hover:opacity-100 [&_svg]:size-4",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50",
      "transition-colors",
      className
    ),
    ...rest,
    children: children ?? /* @__PURE__ */ jsx(
      ChevronDownIcon,
      {
        "data-open": open,
        className: cn(
          "ms-auto inline-flex size-5 shrink-0 cursor-pointer items-center justify-center",
          "rounded-full opacity-70 hover:opacity-100 [&_svg]:size-4",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50",
          "data-[open=true]:rotate-0 data-[open=false]:rotate-180",
          "transition-[transform,color,background-color,border-color,outline-color]",
          className
        )
      }
    )
  }
);
function NotificationComponent({
  type,
  title,
  description,
  action,
  color: _color,
  variant: _variant,
  icon: _icon,
  withCloseButton = true,
  withCollapse = false,
  defaultOpen,
  open: _open,
  onOpenChange,
  onClose,
  // Notifier-managed plumbing — not rendered onto the card.
  status: _status,
  duration: _duration,
  ...rest
}) {
  const preset = type ? TOAST_STATUS[type] : void 0;
  const color = _color ?? preset?.color;
  const variant = _variant ?? preset?.variant ?? "outline";
  const icon = _icon === void 0 ? preset?.icon : _icon;
  const [open, setOpen] = useUncontrolled({
    defaultValue: defaultOpen,
    value: _open,
    finalValue: match({ withCloseButton, withCollapse }).with({ withCloseButton: true }, () => true).with({ withCollapse: true }, () => false).with({ withCollapse: false }, () => true).exhaustive(),
    onChange: onOpenChange
  });
  const lastDescription = useRef(description);
  if (description != null) lastDescription.current = description;
  const lastAction = useRef(action);
  if (action != null) lastAction.current = action;
  return /* @__PURE__ */ jsxs(Root, { variant, color, ...rest, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-3", children: [
      icon != null && /* @__PURE__ */ jsx(Icon, { children: icon }),
      title != null && /* @__PURE__ */ jsx(Title, { children: title }),
      match({ withCloseButton, withCollapse }).with({ withCloseButton: true }, () => /* @__PURE__ */ jsx(CloseTrigger, { onClick: onClose })).with({ withCollapse: true }, () => /* @__PURE__ */ jsx(CollapseTrigger, { open, onClick: () => setOpen(!open) })).with({ withCollapse: false }, () => null).exhaustive()
    ] }),
    /* @__PURE__ */ jsx(Collapse, { open: description != null && open, children: /* @__PURE__ */ jsx(Description, { children: description ?? lastDescription.current }) }),
    /* @__PURE__ */ jsx(Collapse, { open: action != null && open, children: /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: action ?? lastAction.current }) })
  ] });
}
var Notification = Object.assign(NotificationComponent, {
  Root,
  Icon,
  Title,
  Description,
  ActionTrigger,
  CloseTrigger
});

export { ActionTrigger, CloseTrigger, Description, Icon, Notification, TOAST_STATUS, Title, notificationRoot, notificationSurface };
