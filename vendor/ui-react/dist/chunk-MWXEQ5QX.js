import { fieldA11yProps } from './chunk-AL57HMNZ.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { useFieldContext } from '@ark-ui/react/field';
import { cva } from 'class-variance-authority';
import { jsxs, jsx } from 'react/jsx-runtime';

var inputControlClasses = cn(
  "w-full flex-1 min-w-0 appearance-none border-0 bg-transparent p-0 m-0",
  // `font: inherit` is the canonical form-control reset — without it the UA
  // forces its own font-size and the shell's `size` text scale is ignored.
  // No `text-trim`: a native `<input>`'s text renders inside the UA's own
  // form-control internals, not a normal CSS line box, so `text-box-trim`
  // computes an inconsistent (content-dependent) box height there — Chrome
  // was scrolling the text vertically once its computed box stopped matching
  // the element's actual rendered height.
  "font-[inherit] text-inherit",
  "outline-none focus:outline-none",
  "placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-400",
  "disabled:cursor-not-allowed"
);
var shellChrome = [
  "group/input relative rounded-input border outline-none",
  "text-gray-light-900 dark:text-gray-dark-25",
  "transition-[color,box-shadow,border-color]",
  // Fixed brand-500 focus halo + border, per the 42 UI Kit Figma — independent
  // of the instance's own `color`. The combined selector matches either shape
  // in the family: a shell wrapping a real focusable descendant (Input,
  // Select, Combobox, MultiSelect, ComboboxList, MultiComboboxList, PinInput's
  // per-cell shell) or a shell that IS the tabbable element itself (TreeSelect,
  // TreeMultiSelect). `:has()` alone only matches the former.
  "[&:is(:focus-visible,:has(:focus-visible))]:border-brand-500 [&:is(:focus-visible,:has(:focus-visible))]:ring-[3px] [&:is(:focus-visible,:has(:focus-visible))]:ring-brand-500/15",
  // Invalid wins over the palette: red border + red halo. Same combined
  // selector as the rule above so the two can't drift out of sync.
  "data-invalid:border-red-500 data-invalid:[&:is(:focus-visible,:has(:focus-visible))]:border-red-500 data-invalid:[&:is(:focus-visible,:has(:focus-visible))]:ring-red-500/15 data-invalid:bg-red-500/10",
  // Disabled affordances on the shell.
  "data-disabled:cursor-not-allowed data-disabled:opacity-60",
  "data-disabled:bg-white/8",
  "data-pointer:cursor-pointer",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0"
];
var shellVariants = {
  // Translucent border to go with the translucent fill: at `bg-white/4` the
  // shell has no ground of its own, so a fixed opaque hairline can vanish (on
  // a light-gray card) or over-assert (on a mid-tone host page). Same hue
  // language as Card's `default` (navy-tinted light / white-tinted dark), one
  // alpha step tighter — these render within a shade of the opaque colors
  // they replace, so the hairline keeps its weight and only gains
  // background-adaptivity.
  default: ["bg-white/4", "border-brand-900/20 dark:border-white/15"],
  filled: ["bg-gray-light-100 dark:bg-gray-dark-800", "border-transparent"],
  // Escape hatch: strip the chrome but keep the layout (height / slots). Same
  // combined selector as `shellChrome`'s "on" rule so the cancel can't drift.
  unstyled: [
    "border-transparent bg-transparent",
    "rounded-none [&:is(:focus-visible,:has(:focus-visible))]:ring-0"
  ]
};
var shellGap = {
  xs: "gap-1.5",
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
  xl: "gap-3"
};
var inputShell = cva([...shellChrome, "flex w-full items-center gap-y-0.5"], {
  variants: {
    variant: shellVariants,
    // Padding is slot-aware: the base is the tight, no-adornment inset, and each
    // side gains a step of inline padding only when `InputBase` flags an
    // adornment there (`data-with-start-slot` / `data-with-end-slot`). These are
    // self-referential `data-*` variants — the attributes live on this same
    // shell element, so a `group-*` variant (which targets descendants) wouldn't
    // match.
    size: {
      xs: [
        "ps-1.5 pe-1.5",
        "data-with-start-slot:ps-2 data-with-end-slot:pe-2",
        `min-h-7 ${shellGap.xs} text-xs [&_svg]:size-3`
      ],
      sm: [
        "ps-2 pe-2",
        "data-with-start-slot:ps-2.5 data-with-end-slot:pe-2.5",
        `min-h-8 ${shellGap.sm} text-sm [&_svg]:size-3.5`
      ],
      md: [
        "ps-2 pe-2",
        "data-with-start-slot:ps-2.5 data-with-end-slot:pe-2.5",
        `min-h-9 ${shellGap.md} text-md [&_svg]:size-4`
      ],
      lg: [
        "ps-3 pe-3",
        "data-with-start-slot:ps-3.5 data-with-end-slot:pe-3.5",
        `min-h-10 ${shellGap.lg} text-lg [&_svg]:size-5`
      ],
      xl: [
        "ps-3.5 pe-3.5",
        "data-with-start-slot:ps-4 data-with-end-slot:pe-4",
        `min-h-12 ${shellGap.xl} text-xl [&_svg]:size-6`
      ]
    }
  },
  defaultVariants: { variant: "default", size: "md" }
});
var inputSlot = cn(
  "inline-flex shrink-0 items-center justify-center",
  "text-gray-light-500 dark:text-gray-dark-400"
);
var placeholderColor = "text-gray-light-500 dark:text-gray-dark-400";
var InputBase = ({
  variant,
  size,
  color,
  invalid,
  disabled,
  readOnly,
  pointer,
  startSlot,
  endSlot,
  children,
  className,
  classNames,
  testId,
  ...rest
}) => /* @__PURE__ */ jsxs(
  ark.div,
  {
    "data-color": color,
    ...props({
      "data-invalid": invalid,
      "data-disabled": disabled,
      "data-readonly": readOnly,
      "data-pointer": pointer,
      // Drive the slot-aware padding in `inputShell`: each side gains a step of
      // inline padding when an adornment sits there (`data-with-*-slot:`).
      "data-with-start-slot": startSlot != null,
      "data-with-end-slot": endSlot != null,
      // Only meaningful when `InputBase` is used bare (no `Input`-style inner
      // control routing its own `testId`) — a `testId` given to a control that
      // wraps `InputBase` itself (Input, NumberInput, Select, …) always lands
      // on that control's real interactive element instead, never here.
      "data-testid": testId
    }),
    className: cn(className, classNames?.root, inputShell({ variant, size })),
    ...rest,
    children: [
      startSlot != null && /* @__PURE__ */ jsx("span", { className: cn(inputSlot, classNames?.startSlot), "aria-hidden": true, children: startSlot }),
      children,
      endSlot != null && /* @__PURE__ */ jsx("span", { className: cn(inputSlot, classNames?.endSlot), "aria-hidden": true, children: endSlot })
    ]
  }
);
var Input = ({
  variant,
  size,
  color,
  invalid,
  disabled,
  readOnly,
  pointer,
  startSlot,
  endSlot,
  className,
  classNames,
  testId,
  ...rest
}) => {
  const field = useFieldContext();
  const fieldInputProps = field?.getInputProps();
  return /* @__PURE__ */ jsx(
    InputBase,
    {
      variant,
      size,
      color,
      pointer,
      startSlot,
      endSlot,
      className,
      classNames: {
        root: classNames?.root,
        startSlot: classNames?.startSlot,
        endSlot: classNames?.endSlot
      },
      ...props({
        disabled: disabled || field?.disabled,
        invalid: invalid || field?.invalid,
        readOnly: readOnly || field?.readOnly
      }),
      children: /* @__PURE__ */ jsx(
        ark.input,
        {
          ...fieldInputProps,
          ...fieldA11yProps(field),
          ...props({
            disabled: disabled || field?.disabled,
            "aria-invalid": invalid || field?.invalid,
            readOnly: readOnly || field?.readOnly,
            "data-testid": testId
          }),
          className: cn(inputControlClasses, classNames?.input),
          ...rest
        }
      )
    }
  );
};

export { Input, InputBase, inputControlClasses, inputShell, inputSlot, placeholderColor, shellChrome, shellGap, shellVariants };
