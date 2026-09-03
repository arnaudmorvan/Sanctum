import { TYPOGRAPHY_SIZE_CLASSES, resolveHeadingSize } from '../../chunk-C7V53TG4.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var titleVariants = cva(
  ["font-semibold tracking-tight text-gray-light-900 dark:text-gray-dark-50 font-mono text-trim"],
  { variants: { size: TYPOGRAPHY_SIZE_CLASSES } }
);
var ELEMENT_BY_ORDER = {
  1: ark.h1,
  2: ark.h2,
  3: ark.h3,
  4: ark.h4,
  5: ark.h5,
  6: ark.h6
};
var SIZE_BY_ORDER = {
  1: "4xl",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
  6: "md"
};
var Title = ({ className, order = 1, size, testId, ...rest }) => {
  const Element = ELEMENT_BY_ORDER[order];
  const resolvedSize = size ? resolveHeadingSize(size) : SIZE_BY_ORDER[order];
  return /* @__PURE__ */ jsx(
    Element,
    {
      ...props({ "data-testid": testId }),
      ...rest,
      className: cn(titleVariants({ size: resolvedSize }), className)
    }
  );
};

export { Title };
