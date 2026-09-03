import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full"
    },
    padding: {
      none: "px-0",
      sm: "px-3",
      md: "px-4",
      lg: "px-6 md:px-8"
    }
  },
  defaultVariants: {
    size: "lg",
    padding: "md"
  }
});
var Container = ({ className, size, padding, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    ...props({ "data-testid": testId }),
    ...rest,
    className: cn(containerVariants({ size, padding }), className)
  }
);

export { Container };
