"use client";
import { fieldA11yProps } from '../../chunk-FSC5UYO3.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { useFieldContext } from '@ark-ui/react/field';
import { RatingGroup } from '@ark-ui/react/rating-group';
import { cva } from 'class-variance-authority';
import { jsxs, jsx } from 'react/jsx-runtime';

var STAR_PATH = "M12 2.75l2.9 6.32 6.85.62-5.2 4.63 1.57 6.9L12 17.6l-6.12 3.62 1.57-6.9-5.2-4.63 6.85-.62L12 2.75z";
var StarIcon = ({ className }) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", className, children: /* @__PURE__ */ jsx("path", { d: STAR_PATH }) });
var StarOutlineIcon = ({ className }) => /* @__PURE__ */ jsx(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className,
    children: /* @__PURE__ */ jsx("path", { d: STAR_PATH })
  }
);
var DEFAULT_TRANSLATIONS = {
  ratingValueText: (index) => `Rate ${index} star${index === 1 ? "" : "s"}`
};
var resolveRatingTranslations = (overrides) => overrides ? { ...DEFAULT_TRANSLATIONS, ...overrides } : DEFAULT_TRANSLATIONS;
var ratingControl = cva(["inline-flex items-center", "data-disabled:opacity-60"], {
  variants: {
    size: {
      xs: "gap-0.5",
      sm: "gap-0.5",
      md: "gap-1",
      lg: "gap-1",
      xl: "gap-1.5"
    }
  },
  defaultVariants: { size: "md" }
});
var ratingItem = cva([
  "relative inline-flex rounded-xs outline-none",
  "cursor-pointer",
  "data-disabled:cursor-not-allowed",
  "data-readonly:cursor-default",
  "focus-visible:ring-2 focus-visible:ring-(--c-solid)/50",
  // A brief scale "pop" when this symbol becomes the checked one (a real
  // click/keyboard commit — Ark's `checked` state — not just the hover/drag
  // preview, which only ever touches `data-highlighted`).
  "data-checked:animate-rating-pop motion-reduce:data-checked:animate-none"
]);
var ratingSymbol = cva("relative inline-block shrink-0 [&_svg]:block [&_svg]:size-full", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-7"
    }
  },
  defaultVariants: { size: "md" }
});
var symbolFillPercent = (state, highlightSelectedOnly) => {
  const filled = highlightSelectedOnly ? state.checked : state.highlighted;
  if (!filled) return 0;
  return state.half ? 50 : 100;
};
var resolveItemColor = (color, index) => typeof color === "function" ? color(index) : color;
var ratingClipStyle = (fillPercent) => ({ "--rating-clip": `${100 - fillPercent}%` });
var RatingSymbol = ({
  size,
  fillPercent,
  fullSymbol,
  emptySymbol,
  className
}) => /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", className: cn(ratingSymbol({ size }), className), children: [
  /* @__PURE__ */ jsx("span", { className: "absolute inset-0", children: emptySymbol }),
  /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "absolute inset-0",
        "transition-[clip-path] duration-150 ease-out motion-reduce:transition-none",
        "[clip-path:inset(0_var(--rating-clip)_0_0)]",
        "rtl:[clip-path:inset(0_0_0_var(--rating-clip))]"
      ),
      style: ratingClipStyle(fillPercent),
      children: fullSymbol
    }
  )
] });
var RatingControl = ({
  ref,
  onBlur,
  className,
  testId,
  children
}) => {
  const field = useFieldContext();
  return /* @__PURE__ */ jsx(
    RatingGroup.Control,
    {
      ref,
      onBlur,
      className,
      ...props({ "data-invalid": field?.invalid, "data-testid": testId }),
      ...fieldA11yProps(field),
      children
    }
  );
};
var Rating = ({
  count = 5,
  value,
  defaultValue,
  onChange,
  readOnly,
  disabled,
  allowHalf,
  size = "md",
  color,
  fullSymbol,
  emptySymbol,
  highlightSelectedOnly,
  name,
  form,
  translations,
  ref,
  onBlur,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const resolvedTranslations = resolveRatingTranslations(translations);
  return /* @__PURE__ */ jsxs(
    RatingGroup.Root,
    {
      count,
      value,
      defaultValue,
      onValueChange: onChange ? ({ value: v }) => onChange(v) : void 0,
      readOnly,
      disabled,
      allowHalf,
      name,
      form,
      translations: resolvedTranslations,
      className: cn("inline-flex", className, classNames?.root),
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          RatingControl,
          {
            ref,
            onBlur,
            testId,
            className: cn(ratingControl({ size }), classNames?.control),
            children: Array.from({ length: count }, (_, i) => {
              const itemIndex = i + 1;
              return /* @__PURE__ */ jsx(
                RatingGroup.Item,
                {
                  index: itemIndex,
                  "data-color": resolveItemColor(color, i),
                  className: cn(ratingItem(), classNames?.item),
                  ...props({ "data-testid": testId && `${testId}-item-${itemIndex}` }),
                  children: /* @__PURE__ */ jsx(RatingGroup.ItemContext, { children: (state) => /* @__PURE__ */ jsx(
                    RatingSymbol,
                    {
                      size,
                      fillPercent: symbolFillPercent(state, highlightSelectedOnly),
                      fullSymbol: fullSymbol ?? /* @__PURE__ */ jsx(StarIcon, { className: "text-(--c-solid)" }),
                      emptySymbol: emptySymbol ?? /* @__PURE__ */ jsx(StarOutlineIcon, { className: "text-gray-light-300 dark:text-gray-dark-600" }),
                      className: classNames?.symbol
                    }
                  ) })
                },
                itemIndex
              );
            })
          }
        ),
        /* @__PURE__ */ jsx(RatingGroup.HiddenInput, {})
      ]
    }
  );
};

export { Rating, resolveRatingTranslations };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map