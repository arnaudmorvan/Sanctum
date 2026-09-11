import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { jsx } from 'react/jsx-runtime';

var Mark = ({ className, color, background, children, testId, ...rest }) => {
  const showBackground = background !== void 0 || color === void 0;
  const bg = background ?? "yellow";
  return /* @__PURE__ */ jsx(
    "mark",
    {
      "data-color": showBackground ? bg : void 0,
      ...props({ "data-testid": testId }),
      ...rest,
      className: cn(
        "rounded-xs",
        // Browsers ship a UA-stylesheet default for `<mark>` (a solid yellow
        // background, historically with black text) — an explicit
        // `bg-transparent` is required in the no-background branch, or that
        // default bleeds through instead of "no highlight at all".
        showBackground ? "bg-(--c-soft)/60 px-0.5 py-px" : "bg-transparent",
        className
      ),
      children: /* @__PURE__ */ jsx("span", { "data-color": color ?? "gray", className: "text-(--c-text)", children })
    }
  );
};

export { Mark };
//# sourceMappingURL=chunk-Y6KTUK6N.js.map
//# sourceMappingURL=chunk-Y6KTUK6N.js.map