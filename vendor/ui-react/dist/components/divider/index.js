import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

var dividerVariants = cva(["shrink-0"], {
  variants: {
    // No own classes — matched by `compoundVariants` only, the same
    // internal-only pattern `timelineBulletVariants`'s `ringed` axis uses.
    orientation: { horizontal: "", vertical: "" },
    size: { xs: "", sm: "", md: "", lg: "", xl: "" },
    // A different vocabulary than the kit's shape axis (filled/light/
    // outline/subtle/default) — same precedent as Timeline's own local
    // `TimelineLineVariant`.
    variant: {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted"
    }
  },
  compoundVariants: [
    { orientation: "horizontal", size: "xs", class: "border-t-[1px]" },
    { orientation: "horizontal", size: "sm", class: "border-t-[2px]" },
    { orientation: "horizontal", size: "md", class: "border-t-[3px]" },
    { orientation: "horizontal", size: "lg", class: "border-t-[4px]" },
    { orientation: "horizontal", size: "xl", class: "border-t-[5px]" },
    { orientation: "vertical", size: "xs", class: "border-s-[1px]" },
    { orientation: "vertical", size: "sm", class: "border-s-[2px]" },
    { orientation: "vertical", size: "md", class: "border-s-[3px]" },
    { orientation: "vertical", size: "lg", class: "border-s-[4px]" },
    { orientation: "vertical", size: "xl", class: "border-s-[5px]" }
  ],
  defaultVariants: { orientation: "horizontal", size: "xs", variant: "solid" }
});
var Divider = ({
  className,
  orientation,
  size,
  variant,
  color,
  label,
  labelPosition,
  testId,
  ...rest
}) => {
  const isVertical = orientation === "vertical";
  const lineClass = cn(
    dividerVariants({ orientation, size, variant }),
    color ? "border-(--c-solid)" : "border-brand-900/20 dark:border-white/15"
  );
  const labelClass = cn(
    "shrink-0 text-xs",
    color ? "text-(--c-solid)" : "text-brand-900/20 dark:text-white/15"
  );
  return /* @__PURE__ */ jsx(
    ark.div,
    {
      role: "separator",
      "aria-orientation": isVertical ? "vertical" : void 0,
      "data-orientation": orientation ?? "horizontal",
      "data-color": color,
      ...props({ "data-testid": testId }),
      ...rest,
      className: cn(
        label ? ["flex items-center gap-2", isVertical ? "flex-col self-stretch" : "w-full"] : [lineClass, isVertical ? "self-stretch" : "w-full"],
        className
      ),
      children: label && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "data-part": "line",
            className: cn(lineClass, "flex-1", labelPosition === "start" && "hidden")
          }
        ),
        /* @__PURE__ */ jsx("span", { "data-part": "label", className: labelClass, children: label }),
        /* @__PURE__ */ jsx(
          "span",
          {
            "data-part": "line",
            className: cn(lineClass, "flex-1", labelPosition === "end" && "hidden")
          }
        )
      ] })
    }
  );
};

export { Divider };
