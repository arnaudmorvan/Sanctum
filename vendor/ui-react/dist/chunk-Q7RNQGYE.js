import { cva } from 'class-variance-authority';

// src/components/checkbox/control.ts
var controlIndicator = cva(
  [
    "inline-flex shrink-0 items-center justify-center border transition-[background-color,border-color,box-shadow] box-border",
    // Neutral resting surface + border — the same gray tokens as the input
    // shell chrome, so a checkbox sits flush beside a text field.
    "bg-gray-light-25 dark:bg-gray-dark-900 border-gray-light-700 dark:border-gray-dark-300",
    // Checked / indeterminate fill — palette solid, via the slot var.
    "data-[state=checked]:bg-(--c-solid) data-[state=checked]:border-(--c-solid)",
    "data-[state=indeterminate]:bg-(--c-solid) data-[state=indeterminate]:border-(--c-solid)",
    // The mark inherits the on-solid foreground.
    "text-(--c-on-solid)",
    // Focus ring: a solid 3px brand ring with a 2px offset (the kit's standard
    // focus affordance, see button / tooltip), regardless of the control's palette.
    "data-focus-visible:ring-[3px] data-focus-visible:ring-brand-500 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-white dark:data-focus-visible:ring-offset-gray-dark-950",
    // Invalid wins over the palette: red border.
    "data-invalid:border-red-500",
    // Default cursor
    "cursor-pointer",
    // Disabled affordances.
    "data-disabled:opacity-60 data-disabled:cursor-not-allowed"
  ],
  {
    variants: {
      variant: {
        default: [
          "dark:data-[state=checked]:bg-gray-dark-100 data-[state=checked]:bg-gray-light-900 data-[state=checked]:border-transparent",
          "dark:data-[state=indeterminate]:bg-gray-dark-100 data-[state=indeterminate]:bg-gray-light-900  data-[state=indeterminate]:border-transparent"
        ],
        filled: [
          "data-[state=checked]:bg-(--c-solid) data-[state=checked]:border-(--c-solid)",
          "data-[state=indeterminate]:bg-(--c-solid) data-[state=indeterminate]:border-(--c-solid)"
        ]
      },
      size: {
        xs: "size-3.5 rounded-xs [&_svg]:block [&_svg]:size-3",
        sm: "size-4 rounded-xs [&_svg]:block [&_svg]:size-3.5",
        md: "size-4.5 rounded-sm [&_svg]:block [&_svg]:size-3.5",
        lg: "size-5 rounded-sm [&_svg]:block [&_svg]:size-4",
        xl: "size-6 rounded-sm [&_svg]:block [&_svg]:size-5"
      }
    },
    defaultVariants: { size: "md", variant: "default" }
  }
);

export { controlIndicator };
