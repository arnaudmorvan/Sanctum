import { GRADIENT_DIR_BEFORE_CLASS, buildGradientVars } from './chunk-SKPM2FRX.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var cardVariants = cva("flex flex-col rounded-card border", {
  variants: {
    variant: {
      // Matches the 42 UI Kit Figma's card chrome — navy text in light
      // theme, white text in dark theme (a straight inversion, confirmed
      // against Figma's own light-mode test frame). The 4% white overlay
      // (Figma's own bg-primary token) is Figma's dark-theme elevation
      // tint — meant to sit on an already-dark page, lightening whatever's
      // behind it rather than imposing a flat hue — used here in both
      // themes for a consistently subtle surface.
      default: [
        "bg-white/4 text-brand-950 border-brand-900/30",
        "dark:text-white dark:border-white/10"
      ],
      filled: "bg-(--c-solid) text-(--c-on-solid) border-(--c-solid)",
      light: "bg-(--c-soft) text-(--c-text) border-(--c-soft)",
      outline: "bg-white/4 text-(--c-text) border-(--c-solid)",
      // from-(--card-gradient-from) / to-(--card-gradient-to) read CSS vars
      // cascaded from the card element's inline style via buildGradientVars().
      gradient: [
        "relative isolate border-transparent bg-white/4 text-brand-950 dark:text-white",
        "before:absolute before:-inset-px before:-z-10 before:rounded-card before:p-px",
        "before:bg-linear-to-r",
        "before:from-(--card-gradient-from) before:to-(--card-gradient-to)",
        "before:mask before:mask-exclude"
      ]
    },
    padding: {
      none: "p-0",
      xs: "p-2",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8"
    }
  },
  defaultVariants: {
    variant: "default",
    padding: "md"
  }
});
var CardComponent = ({
  className,
  variant,
  padding,
  color,
  gradient,
  style,
  testId,
  ...rest
}) => {
  const isGradient = variant === "gradient";
  return /* @__PURE__ */ jsx(
    ark.div,
    {
      "data-color": isGradient ? void 0 : color,
      style: isGradient ? {
        ...buildGradientVars(gradient, {
          fromVar: "--card-gradient-from",
          toVar: "--card-gradient-to",
          viaVar: "--card-gradient-via",
          fromDefault: "var(--color-purple-300)",
          toDefault: "var(--color-pink-400)"
        }),
        ...style
      } : style,
      className: cn(
        cardVariants({ variant, padding }),
        isGradient && gradient?.dir && GRADIENT_DIR_BEFORE_CLASS[gradient.dir],
        isGradient && gradient?.via && "before:via-(--card-gradient-via)",
        className
      ),
      ...props({ "data-testid": testId }),
      ...rest
    }
  );
};
var CardHeader = ({ className, withBorder, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    className: cn(
      "flex flex-col gap-1 px-4 py-3",
      { "border-b border-gray-light-200 dark:border-gray-dark-800": withBorder },
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var CardTitle = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.h3,
  {
    className: cn("font-semibold tracking-normal", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var CardDescription = ({ className, withBorder, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.p,
  {
    className: cn(
      "text-sm text-gray-light-500 dark:text-gray-dark-400",
      { "border-t border-gray-light-200 dark:border-gray-dark-800": withBorder },
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var CardContent = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    className: cn("flex-1 px-4 py-3", className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var CardFooter = ({ className, withBorder, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    className: cn(
      "flex items-center justify-end gap-2 px-4 py-3",
      { "border-t border-gray-light-200 dark:border-gray-dark-800": withBorder },
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
});

export { Card };
