import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var kbdVariants = cva(
  [
    "inline-flex items-center justify-center gap-1",
    "whitespace-nowrap select-none",
    "font-mono font-medium leading-none",
    "rounded-md border border-transparent",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none"
  ],
  {
    variants: {
      variant: {
        filled: "bg-(--c-solid) text-(--c-on-solid)",
        light: "bg-(--c-soft) text-(--c-text)",
        outline: "bg-transparent text-(--c-text) border-(--c-solid)",
        subtle: "bg-transparent text-(--c-text)",
        default: [
          "bg-gray-light-25 text-gray-light-900 border-gray-light-300",
          "dark:bg-gray-dark-900 dark:text-gray-dark-25 dark:border-gray-dark-700"
        ]
      },
      size: {
        sm: "h-5 min-w-5 px-1.5 text-[10px] [&_svg]:size-3",
        md: "h-6 min-w-6 px-1.5 text-xs [&_svg]:size-3.5",
        lg: "h-7 min-w-7 px-2 text-sm [&_svg]:size-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var Kbd = ({ className, variant, size, color, testId, ...rest }) => {
  return /* @__PURE__ */ jsx(
    ark.kbd,
    {
      "data-color": color,
      ...props({ "data-testid": testId }),
      ...rest,
      className: cn(kbdVariants({ variant, size }), className)
    }
  );
};

export { Kbd };
