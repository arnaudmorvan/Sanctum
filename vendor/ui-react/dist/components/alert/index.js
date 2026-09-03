"use client";
import { notificationSurface, CloseTrigger, ActionTrigger, Description, Title, Icon, TOAST_STATUS } from '../../chunk-YFKAUYE2.js';
import '../../chunk-5BH3GLO4.js';
import '../../chunk-RNXO7W2J.js';
import '../../chunk-IG7FBZVM.js';
import '../../chunk-BEL75C7N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsxs, jsx } from 'react/jsx-runtime';

var alertRoot = cva(
  [
    "flex flex-col w-full",
    "rounded-card border px-3 py-3",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
    "overflow-clip"
  ],
  {
    variants: { variant: notificationSurface },
    defaultVariants: { variant: "outline" }
  }
);
var Root = ({ className, variant, color, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    "data-color": color,
    className: cn(alertRoot({ variant }), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
function AlertComponent({
  type,
  title,
  description,
  action,
  color: _color,
  variant: _variant,
  icon: _icon,
  withCloseButton = false,
  onClose,
  ...rest
}) {
  const preset = type ? TOAST_STATUS[type] : void 0;
  const color = _color ?? preset?.color;
  const variant = _variant ?? preset?.variant ?? "outline";
  const icon = _icon === void 0 ? preset?.icon : _icon;
  return /* @__PURE__ */ jsxs(Root, { variant, color, ...rest, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-3", children: [
      icon != null && /* @__PURE__ */ jsx(Icon, { children: icon }),
      title != null ? /* @__PURE__ */ jsx(Title, { children: title }) : (
        // No title: the description takes its place in the header row
        // (still in description styling, just not stranded under a lone
        // icon) instead of sitting in its own block below.
        description != null && /* @__PURE__ */ jsx(Description, { className: "mt-0", children: description })
      ),
      withCloseButton && /* @__PURE__ */ jsx(CloseTrigger, { onClick: onClose })
    ] }),
    title != null && description != null && /* @__PURE__ */ jsx(Description, { children: description }),
    action != null && /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: action })
  ] });
}
var Alert = Object.assign(AlertComponent, {
  Root,
  Icon,
  Title,
  Description,
  ActionTrigger,
  CloseTrigger
});

export { Alert, alertRoot };
