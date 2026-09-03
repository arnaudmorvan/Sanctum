import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12"
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
    }
  },
  defaultVariants: {
    cols: 12,
    gap: "xl"
  }
});
var Grid = ({ className, cols, gap, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn(gridVariants({ cols, gap }), className)
  }
);

export { Grid };
