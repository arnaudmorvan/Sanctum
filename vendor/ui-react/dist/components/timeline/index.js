import { buildGradientVars, GRADIENT_DIR_CLASS } from '../../chunk-SKPM2FRX.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { Children, cloneElement, isValidElement } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

var BULLET_SIZE = {
  xs: "0.875rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "1.75rem"
};
var timelineVariants = cva(
  ["m-0 grid list-none ps-0 grid-cols-[minmax(0,max-content)_max-content_minmax(0,1fr)]"],
  {
    variants: {
      size: {
        xs: [
          "gap-x-2 text-xs [--tl-bullet-size:0.875rem]",
          "**:data-[part=line]:border-s",
          "**:data-[part=content]:pb-3"
        ],
        sm: [
          "gap-x-2.5 text-sm [--tl-bullet-size:1rem]",
          "**:data-[part=line]:border-s",
          "**:data-[part=content]:pb-4"
        ],
        md: [
          "gap-x-3 text-sm [--tl-bullet-size:1.25rem]",
          "**:data-[part=line]:border-s-2",
          "**:data-[part=content]:pb-5"
        ],
        lg: [
          "gap-x-3.5 text-base [--tl-bullet-size:1.5rem]",
          "**:data-[part=line]:border-s-2",
          "**:data-[part=content]:pb-6"
        ],
        xl: [
          "gap-x-4 text-base [--tl-bullet-size:1.75rem]",
          "**:data-[part=line]:border-s-4",
          "**:data-[part=content]:pb-7"
        ]
      },
      // Sets the default via the same CSS-custom-property indirection as
      // `--tl-bullet-size` (see the line's fixed `[border-style:var(--tl-line-style)]`
      // class in `TimelineItem`) — a `Timeline.Item` overrides just its own
      // segment with an inline style on that property.
      lineVariant: {
        solid: "**:data-[part=line]:[--tl-line-style:solid]",
        dashed: "**:data-[part=line]:[--tl-line-style:dashed]"
      }
    },
    defaultVariants: { size: "md", lineVariant: "solid" }
  }
);
var timelineBulletVariants = cva(["rounded-full shrink-0"], {
  variants: {
    variant: {
      // `dark:[&_svg]:text-white` overrides the slot-var/theme text color for
      // just the icon, on the four variants whose dark-mode surface is a
      // saturated or dark fill — `default`/`gradient` invert to a *light*
      // dark-mode surface instead, so forcing white there would hide the icon.
      filled: "bg-(--c-solid) text-(--c-on-solid) dark:[&_svg]:text-white",
      light: "bg-(--c-soft) text-(--c-text) dark:[&_svg]:text-white",
      outline: "border-(--c-solid) border dark:[&_svg]:text-white",
      subtle: "border-(--c-text)/40 border dark:[&_svg]:text-white",
      dashed: "border-dashed border-(--c-solid) border dark:[&_svg]:text-white",
      default: "dark:bg-gray-light-50 dark:text-gray-light-900 bg-gray-dark-900 text-gray-dark-25 border",
      // from-*/to-* are the CSS defaults for --tw-gradient-from/to — see Badge.
      gradient: [
        "bg-linear-to-r from-purple-300 to-pink-400 text-black",
        "relative",
        "before:absolute before:inset-px before:border-2 dark:before:border-gray-dark-900 before:border-gray-light-50 before:rounded-full"
      ]
    },
    /** Internal only — never exposed on `TimelineItemProps` (see `Omit` on
     * its type). Derived from whether the item has a custom `bullet`. */
    ringed: { true: "", false: "" }
  },
  compoundVariants: [
    {
      variant: "filled",
      ringed: true,
      class: "border ring-2 ring-offset-2 dark:ring-offset-gray-dark-900 ring-(--c-solid) ring-inset"
    },
    {
      variant: "default",
      ringed: true,
      class: "ring-2 ring-offset-2 dark:ring-offset-gray-dark-900 ring-gray-light-950 dark:ring-gray-light-50 ring-inset"
    }
  ],
  defaultVariants: { variant: "default", ringed: true }
});
var LINE_COLOR_CLASS = {
  filled: "border-(--c-solid)",
  outline: "border-(--c-solid)",
  dashed: "border-(--c-solid)",
  light: "border-(--c-soft)",
  subtle: "border-(--c-text)"
};
function lineTreatment({
  color,
  variant,
  gradient,
  lineVariant
}, { flattenGradient = false } = {}) {
  const isGradient = variant === "gradient";
  const gradientVars = isGradient ? buildGradientVars(gradient, {
    fromDefault: "var(--color-purple-300)",
    toDefault: "var(--color-pink-400)"
  }) : void 0;
  return {
    dataColor: !isGradient ? color : void 0,
    style: {
      ...gradientVars,
      ...lineVariant ? { "--tl-line-style": lineVariant } : void 0
    },
    className: isGradient ? flattenGradient ? "border-(--tw-gradient-to)" : "border-transparent [border-image:linear-gradient(to_bottom,var(--tw-gradient-from),var(--tw-gradient-to))_1]" : color && LINE_COLOR_CLASS[variant ?? "default"] || "border-gray-light-300 dark:border-gray-dark-700"
  };
}
function isTimelineItem(node) {
  return isValidElement(node) && node.type === TimelineItem;
}
var TimelineRoot = ({
  className,
  size,
  lineVariant,
  children,
  testId,
  ...rest
}) => {
  const items = Children.toArray(children);
  const withPrevItem = rest.asChild ? children : items.map((child, i) => {
    if (!isTimelineItem(child)) return child;
    const prev = i > 0 ? items[i - 1] : void 0;
    const prevItem = prev && isTimelineItem(prev) ? {
      color: prev.props.color,
      variant: prev.props.variant,
      gradient: prev.props.gradient,
      lineVariant: prev.props.lineVariant
    } : void 0;
    return cloneElement(child, { prevItem });
  });
  return /* @__PURE__ */ jsx(
    ark.ol,
    {
      className: cn(timelineVariants({ size, lineVariant }), className),
      ...props({ "data-testid": testId }),
      ...rest,
      children: withPrevItem
    }
  );
};
var TimelineItem = ({
  className,
  color,
  variant,
  bullet,
  size,
  lineVariant,
  gradient,
  axisOffset,
  style,
  children,
  prevItem,
  testId,
  ...rest
}) => {
  const isGradient = variant === "gradient";
  const gradientVars = isGradient ? buildGradientVars(gradient, {
    fromDefault: "var(--color-purple-300)",
    toDefault: "var(--color-pink-400)"
  }) : void 0;
  const ownLine = lineTreatment({ color, variant, gradient, lineVariant });
  const leadingLine = lineTreatment(prevItem ?? {}, { flattenGradient: true });
  return /* @__PURE__ */ jsxs(
    ark.li,
    {
      style: {
        ...size ? { "--tl-bullet-size": BULLET_SIZE[size] } : void 0,
        ...axisOffset ? { "--tl-axis-offset": axisOffset } : void 0,
        ...style
      },
      className: cn(
        "col-span-3 grid grid-cols-subgrid",
        "[&:first-child_[data-part=line][data-edge=start]]:hidden",
        "[&:last-child_[data-part=line][data-edge=end]]:hidden",
        className
      ),
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "data-part": "line",
            "data-edge": "start",
            "data-color": leadingLine.dataColor,
            style: leadingLine.style,
            className: cn(
              "col-start-2 row-start-1 self-start justify-self-center [border-style:var(--tl-line-style)]",
              "h-(--tl-axis-offset,0px)",
              leadingLine.className
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            "data-part": "line",
            "data-edge": "end",
            "data-color": ownLine.dataColor,
            style: ownLine.style,
            className: cn(
              "col-start-2 row-start-1 justify-self-center [border-style:var(--tl-line-style)]",
              "mt-[calc(var(--tl-bullet-size)+var(--tl-axis-offset,0px))]",
              ownLine.className
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-part": "axis",
            className: "col-start-2 row-start-1 flex justify-center self-start pt-(--tl-axis-offset)",
            children: /* @__PURE__ */ jsx(
              "span",
              {
                "data-part": "bullet",
                "data-color": !isGradient ? color : void 0,
                style: gradientVars,
                className: cn(
                  timelineBulletVariants({ variant, ringed: !bullet }),
                  "size-(--tl-bullet-size) grid place-items-center overflow-hidden",
                  "[&_svg]:size-full [&_svg]:p-0.5",
                  isGradient && gradient?.dir && GRADIENT_DIR_CLASS[gradient.dir]
                ),
                children: bullet
              }
            )
          }
        ),
        children
      ]
    }
  );
};
var TimelineLabel = ({ className, color, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.span,
  {
    "data-part": "label",
    "data-color": color,
    className: cn(
      "col-start-1 inline-flex items-center gap-1.5 self-start pt-px [&_svg]:size-3.5 [&_svg]:shrink-0",
      color ? "text-(--c-text)" : "text-gray-light-500 dark:text-gray-dark-400",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var TimelineContent = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    "data-part": "content",
    className: cn("col-start-3", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var TimelineTitle = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.span,
  {
    className: cn("block font-medium text-gray-light-900 dark:text-gray-dark-25", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
  Label: TimelineLabel,
  Content: TimelineContent,
  Title: TimelineTitle
});

export { Timeline };
