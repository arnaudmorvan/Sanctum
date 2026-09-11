import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { cva } from 'class-variance-authority';
import { jsxs, jsx } from 'react/jsx-runtime';

var POSITION_CLASS = {
  "top-start": "top-0 inset-s-0 -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  "top-center": "top-0 inset-s-1/2 -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  "top-end": "top-0 inset-e-0 -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2",
  "middle-start": "top-1/2 inset-s-0 -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  "middle-center": "top-1/2 inset-s-1/2 -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  "middle-end": "top-1/2 inset-e-0 -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2",
  "bottom-start": "bottom-0 inset-s-0 translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  "bottom-center": "bottom-0 inset-s-1/2 translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2",
  "bottom-end": "bottom-0 inset-e-0 translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2"
};
var indicatorVariants = cva(
  [
    // `z-0` (not the `z-index:auto` a bare `absolute` gets) makes the dot its
    // own stacking context. That's load-bearing for `processing` below: its
    // pulse layer's `-z-10` only stays scoped to "behind this dot's own box"
    // when SOME ancestor is a real stacking context — `position: absolute` +
    // a non-auto `z-index` is what triggers one, `isolate` on a plain
    // `position: relative` ancestor (e.g. the root below) does not (it
    // matters where the context lands, not just that one exists somewhere):
    // `children` is a plain, non-positioned sibling of this dot, so even with
    // an isolating root, the pulse's negative z-index still paints in the
    // "negative z-index" paint step, which runs *before* `children`'s own
    // "in-flow, non-positioned" step regardless — verified empirically, an
    // isolating root alone does NOT fix the overlap. Giving the dot itself a
    // non-auto z-index instead lifts the *whole dot* (pulse included) into
    // the "positioned, stack-level 0" step, which paints after `children`'s
    // step — now the dot (and, tucked behind just its own box, the pulse) is
    // the thing establishing the context, so it's it that ends up on top.
    "absolute z-0 inline-flex items-center justify-center",
    "font-sans font-medium leading-none whitespace-nowrap select-none",
    "bg-(--c-solid) text-(--c-on-solid)"
  ],
  {
    variants: {
      shape: { dot: "rounded-full", label: "" },
      size: { xs: "", sm: "", md: "", lg: "", xl: "" },
      radius: { xs: "", sm: "", md: "", lg: "", xl: "" }
    },
    compoundVariants: [
      { shape: "dot", size: "xs", class: "size-1.5" },
      { shape: "dot", size: "sm", class: "size-2" },
      { shape: "dot", size: "md", class: "size-2.5" },
      { shape: "dot", size: "lg", class: "size-3" },
      { shape: "dot", size: "xl", class: "size-3.5" },
      { shape: "label", size: "xs", class: "min-h-3 min-w-3 px-0.5 text-[8px]" },
      { shape: "label", size: "sm", class: "min-h-3.5 min-w-3.5 px-1 text-[9px]" },
      { shape: "label", size: "md", class: "min-h-4 min-w-4 px-1 text-[10px]" },
      { shape: "label", size: "lg", class: "min-h-4.5 min-w-4.5 px-1.5 text-[11px]" },
      { shape: "label", size: "xl", class: "min-h-5 min-w-5 px-1.5 text-xs" },
      { shape: "label", radius: "xs", class: "rounded-xs" },
      { shape: "label", radius: "sm", class: "rounded-sm" },
      { shape: "label", radius: "md", class: "rounded-md" },
      { shape: "label", radius: "lg", class: "rounded-lg" },
      { shape: "label", radius: "xl", class: "rounded-xl" }
    ],
    defaultVariants: { shape: "dot", size: "md", radius: "xl" }
  }
);
var resolveOffset = (offset) => typeof offset === "number" ? { x: offset, y: offset } : { x: offset?.x ?? 0, y: offset?.y ?? 0 };
var buildOffsetStyle = (position, offset) => {
  const { x, y } = resolveOffset(offset);
  const style = {};
  if (y) {
    if (position.startsWith("top")) style.top = `calc(0px - ${y}px)`;
    else if (position.startsWith("bottom")) style.bottom = `calc(0px - ${y}px)`;
  }
  if (x) {
    if (position.endsWith("start")) style.insetInlineStart = `calc(0px - ${x}px)`;
    else if (position.endsWith("end")) style.insetInlineEnd = `calc(0px - ${x}px)`;
  }
  return style;
};
var Indicator = ({
  className,
  position = "top-end",
  offset,
  size,
  color,
  label,
  maxValue,
  showZero = true,
  processing,
  disabled,
  withBorder,
  radius,
  inline,
  zIndex,
  style,
  children,
  testId,
  ...rest
}) => {
  const hasLabel = label != null;
  const isZero = typeof label === "number" && label === 0;
  const visible = !disabled && !(isZero && !showZero);
  const displayLabel = typeof label === "number" && maxValue !== void 0 && label > maxValue ? `${maxValue}+` : label;
  const Root = inline ? "span" : "div";
  return /* @__PURE__ */ jsxs(
    Root,
    {
      className: cn("relative", inline ? "inline-block" : "block w-fit", className),
      style,
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        children,
        visible && /* @__PURE__ */ jsxs(
          "span",
          {
            "aria-hidden": "true",
            "data-part": "indicator",
            "data-position": position,
            "data-color": color,
            className: cn(
              indicatorVariants({ shape: hasLabel ? "label" : "dot", size, radius }),
              POSITION_CLASS[position],
              withBorder && "border-2 border-(--indicator-border-color)"
            ),
            style: {
              ...buildOffsetStyle(position, offset),
              ...zIndex !== void 0 ? { zIndex } : null
            },
            children: [
              processing && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  "data-part": "processing",
                  className: cn(
                    "absolute inset-0 -z-10 rounded-[inherit] bg-(--c-solid) opacity-75",
                    "animate-ping motion-reduce:animate-none"
                  )
                }
              ),
              hasLabel && displayLabel
            ]
          }
        )
      ]
    }
  );
};

export { Indicator };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map