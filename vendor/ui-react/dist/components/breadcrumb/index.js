import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { House } from 'lucide-react';
import { Children, cloneElement, isValidElement } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var listClasses = cn(
  "m-0 inline-flex list-none items-center gap-1 rounded-xs border border-brand-900/20 px-2 py-1",
  "font-mono text-sm leading-[18px] dark:border-white/15"
);
var linkItemClasses = "text-gray-light-900 dark:text-gray-dark-25 hover:underline";
var currentItemClasses = "text-gray-light-500 dark:text-gray-dark-400";
var separatorClasses = "select-none text-gray-light-900 dark:text-gray-dark-25";
function isCrumbElement(node) {
  return isValidElement(node) && (node.type === BreadcrumbItem || node.type === BreadcrumbHome);
}
var BreadcrumbRoot = ({
  className,
  classNames,
  separator = "/",
  linkComponent,
  children,
  testId,
  ...rest
}) => {
  let content = children;
  if (!rest.asChild) {
    const rendered = [];
    let seenCrumb = false;
    for (const child of Children.toArray(children)) {
      if (!isCrumbElement(child)) {
        rendered.push(child);
        continue;
      }
      if (seenCrumb) {
        rendered.push(
          /* @__PURE__ */ jsx("li", { "aria-hidden": "true", className: separatorClasses, children: separator }, `separator-${rendered.length}`)
        );
      }
      rendered.push(
        cloneElement(child, { linkComponent: child.props.linkComponent ?? linkComponent })
      );
      seenCrumb = true;
    }
    content = /* @__PURE__ */ jsx("ol", { className: cn(listClasses, classNames?.list), children: rendered });
  }
  return /* @__PURE__ */ jsx(
    ark.nav,
    {
      "aria-label": "Breadcrumb",
      className,
      ...props({ "data-testid": testId }),
      ...rest,
      children: content
    }
  );
};
var BreadcrumbItem = ({
  href,
  current,
  linkComponent: LinkComponent,
  asChild,
  className,
  children,
  testId,
  ...rest
}) => {
  if (current) {
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      ark.span,
      {
        "aria-current": "page",
        className: cn(currentItemClasses, className),
        ...props({ "data-testid": testId }),
        ...rest,
        children
      }
    ) });
  }
  if (asChild) {
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      ark.a,
      {
        asChild: true,
        className: cn(linkItemClasses, className),
        ...props({ "data-testid": testId }),
        ...rest,
        children
      }
    ) });
  }
  if (LinkComponent) {
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      LinkComponent,
      {
        href,
        className: cn(linkItemClasses, className),
        ...props({ "data-testid": testId }),
        ...rest,
        children
      }
    ) });
  }
  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
    ark.a,
    {
      href,
      className: cn(linkItemClasses, className),
      ...props({ "data-testid": testId }),
      ...rest,
      children
    }
  ) });
};
var BreadcrumbHome = ({
  href,
  linkComponent: LinkComponent,
  asChild,
  className,
  children,
  "aria-label": ariaLabel = "Home",
  testId,
  ...rest
}) => {
  const icon = children ?? /* @__PURE__ */ jsx(House, { "aria-hidden": true, size: 16 });
  if (asChild) {
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      ark.a,
      {
        asChild: true,
        "aria-label": ariaLabel,
        className: cn(linkItemClasses, className),
        ...props({ "data-testid": testId }),
        ...rest,
        children: icon
      }
    ) });
  }
  if (LinkComponent) {
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      LinkComponent,
      {
        href,
        "aria-label": ariaLabel,
        className: cn(linkItemClasses, className),
        ...props({ "data-testid": testId }),
        ...rest,
        children: icon
      }
    ) });
  }
  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
    ark.a,
    {
      href,
      "aria-label": ariaLabel,
      className: cn(linkItemClasses, className),
      ...props({ "data-testid": testId }),
      ...rest,
      children: icon
    }
  ) });
};
var renderDataItem = (item, key, current) => /* @__PURE__ */ jsx(
  BreadcrumbItem,
  {
    href: item.href,
    linkComponent: item.linkComponent,
    current,
    testId: item.testId ?? item.href ?? key,
    children: item.label
  },
  key
);
var BreadcrumbComponent = ({ data, withHome, ...rootProps }) => {
  const explicitCurrent = data.some((item) => item.current !== void 0);
  return /* @__PURE__ */ jsxs(BreadcrumbRoot, { ...rootProps, children: [
    withHome && /* @__PURE__ */ jsx(BreadcrumbHome, { ...typeof withHome === "object" ? withHome : void 0 }),
    data.map(
      (item, i) => renderDataItem(
        item,
        `breadcrumb-item-${i}`,
        item.current ?? (!explicitCurrent && i === data.length - 1)
      )
    )
  ] });
};
var Breadcrumb = Object.assign(BreadcrumbComponent, {
  Root: BreadcrumbRoot,
  Home: BreadcrumbHome,
  Item: BreadcrumbItem
});

export { Breadcrumb };
