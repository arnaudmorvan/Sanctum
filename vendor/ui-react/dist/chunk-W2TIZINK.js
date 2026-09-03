import { useLinkComponent } from './chunk-GTKKRV5N.js';
import { Collapse } from './chunk-5BH3GLO4.js';
import { ChevronIcon } from './chunk-IG7FBZVM.js';
import { useUncontrolled } from './chunk-BEL75C7N.js';
import { cn } from './chunk-SAS62TWA.js';
import { cva } from 'class-variance-authority';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

var navLinkRow = cva(
  [
    "flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-start text-sm",
    "outline-none transition-colors",
    "hover:bg-black/5 dark:hover:bg-white/8",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50"
  ],
  {
    variants: {
      current: {
        true: "bg-black/5 font-medium text-gray-light-900 dark:bg-white/8 dark:text-gray-dark-25",
        false: "text-gray-light-700 dark:text-gray-dark-200"
      }
    },
    defaultVariants: { current: false }
  }
);
var chevronButton = cn(
  "flex shrink-0 cursor-pointer items-center justify-center rounded-md p-2 text-gray-light-500 transition-colors",
  "hover:bg-black/5 dark:text-gray-dark-400 dark:hover:bg-white/8",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-dark-950"
);
var chevron = (open) => /* @__PURE__ */ jsx(
  "span",
  {
    "aria-hidden": "true",
    "data-state": open ? "open" : "closed",
    className: "ms-auto flex shrink-0 transition-transform data-[state=open]:rotate-180 [&_svg]:size-4",
    children: /* @__PURE__ */ jsx(ChevronIcon, {})
  }
);
function NavLinkImpl({
  label,
  icon,
  suffix,
  current,
  disabled,
  open,
  defaultOpen,
  onOpenChange,
  linkOptions,
  linkComponent,
  classNames,
  className,
  children
}) {
  const [isOpen, setOpen] = useUncontrolled({
    value: open,
    defaultValue: defaultOpen,
    finalValue: false,
    onChange: onOpenChange
  });
  const hasChildren = children != null;
  const isLink = linkOptions != null;
  const Comp = useLinkComponent(linkComponent) ?? "a";
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    icon,
    /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: label }),
    suffix
  ] });
  const rowClassName = cn(navLinkRow({ current }), classNames?.row, className);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-stretch gap-1", children: [
      isLink ? /* @__PURE__ */ jsx(
        Comp,
        {
          ...linkOptions,
          "aria-current": current ? "page" : void 0,
          "aria-disabled": disabled || void 0,
          className: rowClassName,
          children: content
        }
      ) : /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          "aria-current": current ? "page" : void 0,
          "aria-disabled": disabled || void 0,
          "aria-expanded": hasChildren ? isOpen : void 0,
          disabled,
          onClick: () => hasChildren && setOpen(!isOpen),
          className: rowClassName,
          children: [
            content,
            hasChildren && chevron(isOpen)
          ]
        }
      ),
      hasChildren && isLink && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-expanded": isOpen,
          "aria-label": isOpen ? "Collapse" : "Expand",
          onClick: () => setOpen(!isOpen),
          className: chevronButton,
          children: chevron(isOpen)
        }
      )
    ] }),
    hasChildren && /* @__PURE__ */ jsx(Collapse, { open: isOpen, children: /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "ms-4.5 space-y-0.5 border-s border-brand-900/20 ps-2 pt-0.5 dark:border-white/15",
          classNames?.items
        ),
        children
      }
    ) })
  ] });
}
function NavLink(props) {
  return /* @__PURE__ */ jsx(NavLinkImpl, { ...props });
}
var renderItem = (item, key, linkComponent) => /* @__PURE__ */ jsx(
  NavLink,
  {
    label: item.label,
    icon: item.icon,
    suffix: item.suffix,
    current: item.current,
    disabled: item.disabled,
    defaultOpen: item.defaultOpen,
    linkOptions: item.linkOptions,
    linkComponent,
    children: item.items && item.items.length > 0 ? item.items.map((child, i) => renderItem(child, `${key}.${i}`, linkComponent)) : void 0
  },
  key
);
function NavigationImpl({ data, linkComponent }) {
  return /* @__PURE__ */ jsx(Fragment, { children: data.map((item, i) => renderItem(item, `nav-${i}`, linkComponent)) });
}
function Navigation(props) {
  return /* @__PURE__ */ jsx(NavigationImpl, { ...props });
}

export { NavLink, Navigation };
