import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { cva } from 'class-variance-authority';
import { jsxs, jsx } from 'react/jsx-runtime';

var skeletonVariants = cva(
  ["animate-pulse bg-black/15 dark:bg-white/8 motion-reduce:animate-none"],
  {
    variants: {
      shape: {
        rectangular: "w-full rounded-xs",
        circular: "shrink-0 rounded-full"
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: ""
      }
    },
    compoundVariants: [
      { shape: "rectangular", size: "xs", class: "h-2" },
      { shape: "rectangular", size: "sm", class: "h-3" },
      { shape: "rectangular", size: "md", class: "h-4" },
      { shape: "rectangular", size: "lg", class: "h-5" },
      { shape: "rectangular", size: "xl", class: "h-6" },
      { shape: "circular", size: "xs", class: "size-2" },
      { shape: "circular", size: "sm", class: "size-3" },
      { shape: "circular", size: "md", class: "size-4" },
      { shape: "circular", size: "lg", class: "size-5" },
      { shape: "circular", size: "xl", class: "size-6" }
    ],
    defaultVariants: { shape: "rectangular", size: "md" }
  }
);
var Skeleton = ({
  className,
  classNames,
  shape,
  size,
  width,
  height,
  animate = true,
  loading = true,
  style,
  children,
  testId,
  ...rest
}) => {
  if (children != null) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ...props({ "data-loading": loading, "aria-busy": loading, "data-testid": testId }),
        ...rest,
        style,
        className: cn("relative inline-block", className),
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "data-part": "content",
              "aria-hidden": loading || void 0,
              className: cn(loading && "invisible"),
              children
            }
          ),
          loading && /* @__PURE__ */ jsx(
            "div",
            {
              "data-part": "skeleton",
              "aria-hidden": "true",
              className: cn(
                skeletonVariants({ shape, size }),
                "absolute inset-0 size-full",
                !animate && "animate-none",
                classNames?.skeleton
              )
            }
          )
        ]
      }
    );
  }
  if (!loading) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-part": "skeleton",
      "aria-hidden": "true",
      ...props({ "data-testid": testId }),
      ...rest,
      style: {
        ...width !== void 0 && { width },
        ...height !== void 0 && { height },
        ...style
      },
      className: cn(skeletonVariants({ shape, size }), !animate && "animate-none", className)
    }
  );
};

export { Skeleton };
