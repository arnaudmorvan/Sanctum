"use client";
import { Drawer } from '../../chunk-GHSRENN6.js';
import { mergeRefs } from '../../chunk-UVYTJQTJ.js';
import { useContainerQuery } from '../../chunk-P3XMBETI.js';
import '../../chunk-3KHUHVCD.js';
import '../../chunk-RNXO7W2J.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { createContext, useRef, useState, useContext } from 'react';
import { jsx } from 'react/jsx-runtime';

var AppShellContext = createContext(null);
function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("AppShell parts must be rendered within <AppShell>.");
  return ctx;
}
var AppShellRoot = ({
  breakpoint = 768,
  className,
  style,
  children,
  ref,
  testId,
  ...rest
}) => {
  const rootRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useContainerQuery(rootRef, breakpoint);
  return /* @__PURE__ */ jsx(AppShellContext.Provider, { value: { mobileOpen, setMobileOpen, isMobile }, children: /* @__PURE__ */ jsx(
    ark.div,
    {
      ...props({ "data-testid": testId }),
      ...rest,
      ref: mergeRefs(ref, rootRef),
      style: { gridTemplateAreas: `"sidebar header header" "sidebar main aside"`, ...style },
      className: cn(
        "@container grid h-dvh grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] overflow-hidden",
        className
      ),
      children
    }
  ) });
};
var SIDEBAR_WIDTH = {
  xs: "w-56",
  sm: "w-64",
  md: "w-72",
  lg: "w-80",
  xl: "w-96"
};
var AppShellSidebar = ({
  size = "md",
  className,
  children,
  testId,
  ...rest
}) => {
  const { isMobile, mobileOpen, setMobileOpen } = useAppShell();
  if (isMobile) {
    return /* @__PURE__ */ jsx(
      Drawer,
      {
        open: mobileOpen,
        onOpenChange: setMobileOpen,
        placement: "end",
        withCloseButton: false,
        testId,
        classNames: { body: "flex flex-col overflow-hidden p-0" },
        className: cn("w-full max-w-none", className),
        children
      }
    );
  }
  return /* @__PURE__ */ jsx(
    ark.aside,
    {
      ...props({ "data-testid": testId }),
      ...rest,
      className: cn(
        "[grid-area:sidebar] flex flex-col overflow-hidden text-gray-light-900 dark:text-gray-dark-25",
        // Brand-derived border/fill, matching InputBase/Popover/Modal/Drawer/Table's
        // own chrome (border-brand-900/20 dark:border-white/15, bg-brand-50/90
        // dark:bg-brand-950/85) rather than a neutral gray.
        "border-e border-brand-900/20 bg-brand-50/90 dark:border-white/15 dark:bg-brand-950/85",
        SIDEBAR_WIDTH[size],
        className
      ),
      children
    }
  );
};
var HEADER_HEIGHT_CLASS = "h-14";
var AppShellSidebarHeader = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(HEADER_HEIGHT_CLASS, "flex shrink-0 items-center gap-2 px-4", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var AppShellSidebarBody = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "min-h-0 flex-1 overflow-y-auto overscroll-contain p-4",
      "[mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-12px),transparent)]",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var AppShellSidebarFooter = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("shrink-0 p-4", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var AppShellHeader = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.header,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn(
      HEADER_HEIGHT_CLASS,
      // Brand-derived border/fill, matching InputBase/Popover/Modal/Drawer/Table's
      // own chrome (border-brand-900/20 dark:border-white/15, bg-brand-50/90
      // dark:bg-brand-950/85) rather than a neutral gray.
      "[grid-area:header] flex shrink-0 items-center gap-3 border-b border-brand-900/20 bg-brand-50/90 px-4 text-gray-light-900",
      "dark:border-white/15 dark:bg-brand-950/85 dark:text-gray-dark-25",
      className
    )
  }
);
var AppShellMain = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.main,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn("[grid-area:main] min-h-0 overflow-y-auto", className)
  }
);
var ASIDE_WIDTH = {
  xs: "@xl:w-56",
  sm: "@xl:w-64",
  md: "@xl:w-72",
  lg: "@xl:w-80",
  xl: "@xl:w-96"
};
var AppShellAside = ({ size = "md", className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.aside,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn(
      "[grid-area:aside] hidden flex-col overflow-y-auto text-gray-light-900 dark:text-gray-dark-25",
      "@xl:flex",
      ASIDE_WIDTH[size],
      className
    )
  }
);
var AppShellSidebarTrigger = ({ onClick, testId, ...rest }) => {
  const { isMobile, setMobileOpen } = useAppShell();
  if (!isMobile) return null;
  return /* @__PURE__ */ jsx(
    ark.button,
    {
      type: "button",
      ...props({ "data-testid": testId }),
      ...rest,
      onClick: (event) => {
        onClick?.(event);
        setMobileOpen((open) => !open);
      }
    }
  );
};
var AppShell = Object.assign(AppShellRoot, {
  Sidebar: AppShellSidebar,
  SidebarHeader: AppShellSidebarHeader,
  SidebarBody: AppShellSidebarBody,
  SidebarFooter: AppShellSidebarFooter,
  SidebarTrigger: AppShellSidebarTrigger,
  Header: AppShellHeader,
  Main: AppShellMain,
  Aside: AppShellAside
});

export { AppShell };
