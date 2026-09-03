import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col"
    },
    gap: {
      none: "gap-0",
      xxs: "gap-0.5",
      xs: "gap-1",
      sm: "gap-1.5",
      md: "gap-2",
      lg: "gap-3",
      xl: "gap-4",
      xxl: "gap-6"
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline"
    },
    justify: {
      strech: "justify-stretch",
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap"
    }
  },
  defaultVariants: {
    direction: "row",
    gap: "md",
    align: "stretch",
    justify: "strech",
    wrap: false
  }
});
var Flex = ({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  ark.div,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn(flexVariants({ direction, gap, align, justify, wrap }), className)
  }
);

export { Flex };
