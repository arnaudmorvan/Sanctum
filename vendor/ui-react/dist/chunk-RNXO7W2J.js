import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { cva } from 'class-variance-authority';
import { jsx, jsxs } from 'react/jsx-runtime';

var spinnerVariants = cva("animate-spin text-current origin-center block aspect-square", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8"
    }
  }
});
var spinnerWrapperVariants = cva("flex items-center justify-center shrink-0 aspect-square", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8"
    }
  }
});
var Spinner = ({
  className,
  size,
  color,
  label = "Loading",
  withTrack = false,
  testId,
  ...rest
}) => {
  const decorative = label === null;
  const isPalette = color !== void 0 && color !== "currentColor" && color !== "default";
  return /* @__PURE__ */ jsx("div", { className: spinnerWrapperVariants({ size }), children: /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "data-color": isPalette ? color : void 0,
      className: cn(
        spinnerVariants({ size }),
        isPalette && "text-(--c-solid)",
        color === "default" && "text-gray-dark-900 dark:text-gray-light-50",
        className
      ),
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        /* @__PURE__ */ jsx("title", { children: "Spinner" }),
        !decorative && /* @__PURE__ */ jsx("title", { children: label }),
        withTrack && /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeWidth: 1, className: "opacity-20" }),
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10",
            strokeWidth: 2,
            strokeDasharray: "42 20",
            strokeLinecap: "round",
            className: "opacity-90"
          }
        )
      ]
    }
  ) });
};

export { Spinner };
