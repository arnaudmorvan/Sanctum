import { Mark } from '../../chunk-Y6KTUK6N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { jsx } from 'react/jsx-runtime';

function CodeComponent({ className, color, testId, ...rest }) {
  return /* @__PURE__ */ jsx(
    ark.code,
    {
      "data-color": color,
      ...props({ "data-testid": testId }),
      ...rest,
      className: cn(
        "font-mono rounded-xs px-1.5 py-0.5",
        "bg-black/6 border border-black/8 dark:bg-white/10 dark:border-white/10",
        "text-gray-light-800 dark:text-gray-dark-100",
        "data-color:text-(--c-text)",
        className
      )
    }
  );
}
var Code = Object.assign(CodeComponent, { Mark });

export { Code };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map