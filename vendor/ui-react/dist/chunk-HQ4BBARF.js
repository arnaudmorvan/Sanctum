import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx, jsxs } from 'react/jsx-runtime';

var tableContainer = cn(
  "flex w-full flex-col overflow-hidden contain-layout",
  // Brand-derived border, matching InputBase/Popover/Modal/Drawer's shell
  // (border-brand-900/20 dark:border-white/15) rather than a neutral gray.
  "rounded-sm border border-brand-900/20 dark:border-white/15"
);
var tableVariants = cva(
  [
    // Row separators — on cells, since separate-mode ignores <tr> borders.
    "[&_tbody_tr:not(:last-child)_td]:border-b",
    "[&_tbody_td]:border-brand-900/20 dark:[&_tbody_td]:border-white/15",
    // Cells
    "[&_td]:align-middle",
    "[&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-gray-light-800 dark:[&_th]:text-gray-dark-200",
    // Header — subtle fill + a bottom separator that survives sticky. Same
    // brand-tinted fill Popover/Modal/Drawer use for their own surface, at
    // the same /90 light /85 dark opacity recipe.
    "[&_thead]:bg-brand-50/90 dark:[&_thead]:bg-brand-950/85",
    "[&_thead_th]:border-b [&_thead_th]:border-brand-900/20 dark:[&_thead_th]:border-white/15",
    // Footer — subtle fill + a top separator that survives sticky.
    "[&_tfoot]:bg-brand-50/90 dark:[&_tfoot]:bg-brand-950/85 [&_tfoot]:font-medium",
    "[&_tfoot_th]:border-t [&_tfoot_td]:border-t",
    "[&_tfoot_th]:border-brand-900/20 [&_tfoot_td]:border-brand-900/20 dark:[&_tfoot_th]:border-white/15 dark:[&_tfoot_td]:border-white/15",
    // Excludes a `data-placeholder` row (an empty/error/loading state, e.g.
    // `DataTable`'s) — it has no row to hover, so it shouldn't tint like one.
    // Black/white wash, same convention as Popover/Menu/TreeSelect's own row
    // highlight — background-dependent instead of a fixed per-theme gray.
    "[&_tbody_tr:not([data-placeholder]):hover]:bg-black/5! dark:[&_tbody_tr:not([data-placeholder]):hover]:bg-white/8! [&_tbody_tr]:transition-colors"
  ],
  {
    variants: {
      // Cell padding + text scale, keyed to the kit's canonical `Size` scale.
      size: {
        xs: "text-xs [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1",
        sm: "text-sm [&_th]:px-2.5 [&_td]:px-2.5 [&_th]:py-1.5 [&_td]:py-1.5",
        md: "text-sm [&_th]:px-3 [&_td]:px-3 [&_th]:py-2.5 [&_td]:py-2.5",
        lg: "text-base [&_th]:px-4 [&_td]:px-4 [&_th]:py-3 [&_td]:py-3",
        xl: "text-base [&_th]:px-4 [&_td]:px-4 [&_th]:py-4 [&_td]:py-4"
      },
      striped: {
        true: "[&_tbody_tr:nth-child(even)]:bg-black/3 dark:[&_tbody_tr:nth-child(even)]:bg-white/4",
        false: ""
      }
    },
    defaultVariants: { size: "md", striped: false }
  }
);
var stickyHeaderClasses = "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:backdrop-blur-lg";
var stickyFooterClasses = "[&_tfoot]:sticky [&_tfoot]:bottom-0 [&_tfoot]:z-10 [&_tfoot]:backdrop-blur-lg";
var TableRoot = ({
  className,
  size,
  striped,
  stickyHeader,
  stickyFooter,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  ark.div,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn(
      tableContainer,
      tableVariants({ size, striped }),
      stickyHeader && stickyHeaderClasses,
      stickyFooter && stickyFooterClasses,
      className
    )
  }
);
var TableToolbar = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn(
      "flex shrink-0 items-center justify-between gap-2 border-b border-brand-900/20 px-3 ps-5 py-3 dark:border-white/15",
      className
    )
  }
);
var TableTitle = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.h3,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn("font-semibold tracking-normal", className)
  }
);
var TableContent = ({ className, classNames, testId, ...rest }) => /* @__PURE__ */ jsxs("div", { className: cn("table-scroll-frame flex min-h-0 flex-1 flex-col", className), children: [
  /* @__PURE__ */ jsx("div", { className: "table-scroll-x min-h-0 w-full flex-1 overflow-auto", children: /* @__PURE__ */ jsx(
    ark.table,
    {
      ...props({ "data-testid": testId }),
      ...rest,
      className: cn(
        "w-full border-separate border-spacing-0 text-left text-gray-light-900 dark:text-gray-dark-25",
        classNames?.table
      )
    }
  ) }),
  /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": "true",
      className: "table-fade-start pointer-events-none absolute inset-y-0 left-0 w-6"
    }
  ),
  /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": "true",
      className: "table-fade-end pointer-events-none absolute inset-y-0 right-0 w-6"
    }
  )
] });
var TableHead = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.thead,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: className ? cn(className) : void 0
  }
);
var TableBody = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.tbody,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: className ? cn(className) : void 0
  }
);
var TableFoot = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.tfoot,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: className ? cn(className) : void 0
  }
);
var TableRow = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.tr,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: className ? cn(className) : void 0
  }
);
var TableHeaderCell = ({ className, scope = "col", testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.th,
  {
    scope,
    ...props({ "data-testid": testId }),
    ...rest,
    className: className ? cn(className) : void 0
  }
);
var TableCell = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.td,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: className ? cn(className) : void 0
  }
);
var Table = Object.assign(TableRoot, {
  Toolbar: TableToolbar,
  Title: TableTitle,
  Content: TableContent,
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell
});

export { Table };
