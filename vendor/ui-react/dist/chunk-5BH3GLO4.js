import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { jsx } from 'react/jsx-runtime';

var Collapse = ({
  open,
  className,
  classNames,
  children,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-state": open ? "open" : "closed",
    className: cn(
      "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
      "motion-reduce:transition-none",
      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      className,
      classNames?.root
    ),
    ...props({ "data-testid": testId }),
    ...rest,
    children: /* @__PURE__ */ jsx("div", { className: cn("min-h-0 overflow-clip", classNames?.content), children })
  }
);

export { Collapse };
