import { TYPOGRAPHY_SIZE_CLASSES, resolveHeadingSize } from './chunk-C7V53TG4.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

var textVariants = cva("", {
  variants: {
    size: TYPOGRAPHY_SIZE_CLASSES,
    c: {
      default: "",
      secondary: "text-gray-light-700 dark:text-gray-dark-300",
      muted: "text-gray-light-600 dark:text-gray-dark-400"
    }
  },
  defaultVariants: {
    size: "md",
    c: "default"
  }
});
var Text = ({
  className,
  size,
  c,
  prefix,
  span,
  children,
  asChild,
  testId,
  ...rest
}) => {
  const Comp = span ? ark.span : ark.p;
  const resolvedSize = size ? resolveHeadingSize(size) : void 0;
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ...props({ "data-testid": testId }),
      ...rest,
      asChild,
      className: cn(textVariants({ size: resolvedSize, c }), className),
      children: asChild ? children : /* @__PURE__ */ jsxs(Fragment, { children: [
        prefix !== void 0 && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "select-none text-gray-light-600 dark:text-gray-dark-400",
            children: prefix
          }
        ),
        children
      ] })
    }
  );
};

export { Text };
