import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var themeIconVariants = cva(
  [
    "inline-flex items-center justify-center",
    "aspect-square shrink-0 select-none",
    "rounded-lg border",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none"
  ],
  {
    variants: {
      variant: {
        // A translucent wash of `--c-solid` (not the opaque token) so the
        // fill blends with whatever surface it sits on instead of reading
        // as a painted CTA block. The border mixes in black on top of that
        // same var — a fixed darkening, not another opacity step of it —
        // so it reads as a recessed edge in both themes; some colors (gray
        // in particular) have a dark-mode `--c-solid` that's lighter than
        // its own soft/text steps, which would flip a same-var-opacity
        // border the wrong way. This is the ThemeIcon-specific reading of
        // "filled": raised, not loud. Button/Badge/ActionIcon's `filled`
        // (opaque bg-(--c-solid)) would look like a button here —
        // intentionally not reused.
        filled: "bg-(--c-solid)/15 text-(--c-text) border-[color-mix(in_oklab,var(--c-solid)_35%,black_65%)]",
        light: "bg-(--c-soft) text-(--c-text) border-transparent",
        outline: "bg-transparent text-(--c-text) border-(--c-solid)",
        subtle: "bg-transparent text-(--c-text) border-transparent",
        // Palette-independent neutral surface. Unlike ActionIcon's
        // high-contrast inverted `default` (a black/white button look),
        // this stays a muted card in both themes.
        default: [
          "bg-gray-light-100/50 text-gray-light-700 border-gray-light-300/50",
          "dark:bg-gray-dark-800/50 dark:text-gray-dark-300 dark:border-gray-dark-700/50"
        ]
      },
      size: {
        xs: "h-7 [&_svg]:size-5",
        sm: "h-8 [&_svg]:size-5.5",
        md: "h-9 [&_svg]:size-6",
        lg: "h-10 [&_svg]:size-7",
        xl: "h-12 [&_svg]:size-8"
      },
      radius: {
        xs: "rounded-xs",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md"
    }
  }
);
var ThemeIcon = ({
  className,
  variant,
  size,
  radius,
  color,
  asChild,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  ark.div,
  {
    asChild,
    "data-color": color,
    "data-variant": variant ?? "default",
    className: cn(themeIconVariants({ variant, size, radius }), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);

export { ThemeIcon };
