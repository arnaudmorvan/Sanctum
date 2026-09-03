import { GRADIENT_DIR_CLASS, buildGradientVars } from '../../chunk-SKPM2FRX.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var badgeVariants = cva(
  [
    "inline-flex items-center",
    "whitespace-nowrap select-none",
    "font-sans font-medium",
    "border border-transparent",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg]:size-3"
  ],
  {
    variants: {
      variant: {
        filled: "bg-(--c-solid) text-(--c-on-solid)",
        // Neutral by default; a `data-color` tint overrides it. Those rules
        // compile to `&[data-color]` (specificity 0,2,0), which beats both
        // the plain and the `dark:` neutral classes below (0,1,0 — `dark:`
        // is a `:where()` variant) regardless of source order — same
        // treatment as `Pill`, the kit's other chip surface.
        light: [
          "bg-black/8 dark:bg-white/16 text-gray-light-800 dark:text-gray-dark-100",
          "border-black/8 dark:border-white/15",
          "data-color:bg-(--c-soft)/35 data-color:text-(--c-text) data-color:border-(--c-soft)"
        ],
        outline: "bg-transparent text-(--c-text) border-(--c-solid)",
        subtle: "bg-transparent text-(--c-text)",
        // from-*/to-* are the CSS defaults for --tw-gradient-from/to and the
        // --tw-gradient-stops composition chain. Props only override the individual
        // vars they provide — the chain resolves them lazily without JS defaults.
        gradient: "bg-origin-border bg-linear-to-r from-purple-300 to-pink-400 text-black border-white/20"
      },
      // Height/padding/radius/font pulled straight from the Figma spec (node
      // 14950-143827, sizes sm/md/lg) — xs/xl are extrapolated one step past
      // either end of that scale, since Figma only defines the middle three.
      size: {
        xs: "min-h-5 px-0.5 text-[10px] gap-0.5 rounded-sm",
        sm: "min-h-5.5 px-1 text-xs gap-0.5 rounded-sm",
        md: "min-h-6 px-1.5 text-sm gap-1 rounded-sm",
        lg: "min-h-7 px-2 text-sm gap-1 rounded-md",
        xl: "min-h-8 px-2.5 text-sm gap-1 rounded-lg"
      }
    },
    defaultVariants: {
      variant: "light",
      size: "md"
    }
  }
);
var Badge = ({
  className,
  variant,
  size,
  color,
  gradient,
  style,
  testId,
  ...rest
}) => {
  const isGradient = variant === "gradient";
  return /* @__PURE__ */ jsx(
    ark.span,
    {
      "data-color": !isGradient ? color : void 0,
      style: isGradient && gradient ? { ...buildGradientVars(gradient), ...style } : style,
      className: cn(
        badgeVariants({ variant, size }),
        isGradient && gradient?.dir && GRADIENT_DIR_CLASS[gradient.dir],
        className
      ),
      ...props({ "data-testid": testId }),
      ...rest
    }
  );
};

export { Badge };
