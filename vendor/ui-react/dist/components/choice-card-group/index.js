import { controlIndicator } from '../../chunk-Q7RNQGYE.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { CheckIcon } from '../../chunk-IG7FBZVM.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { CheckboxGroup, Checkbox } from '@ark-ui/react/checkbox';
import { RadioGroup } from '@ark-ui/react/radio-group';
import { cva } from 'class-variance-authority';
import { useId } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

var choiceCard = cva(
  [
    "relative flex w-full cursor-pointer rounded-card border text-start select-none transition-[background-color,border-color,box-shadow]",
    "bg-white/4 text-gray-light-900 dark:text-gray-dark-25",
    "border-brand-900/20 dark:border-white/15",
    "hover:border-brand-900/30 dark:hover:border-white/25",
    // Keyboard focus ring on the whole card — the kit's standard brand ring,
    // matching Checkbox / Radio regardless of palette.
    "data-focus-visible:ring-[3px] data-focus-visible:ring-brand-500 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-white dark:data-focus-visible:ring-offset-gray-dark-950",
    // Invalid wins over the palette: red border (per-card or group-level).
    "data-invalid:border-red-500 group-data-invalid:border-red-500",
    // Disabled affordances (per-card item or group-level).
    "data-disabled:cursor-not-allowed data-disabled:opacity-60",
    "group-data-disabled:cursor-not-allowed group-data-disabled:opacity-60"
  ],
  {
    variants: {
      // Selected treatment, mirroring the indicator's own `variant`.
      variant: {
        // Palette-independent: a strong neutral border (the mark fills dark).
        default: "data-[state=checked]:border-gray-light-900 dark:data-[state=checked]:border-gray-dark-25",
        // Palette-tinted: colored border + soft fill off the root's `data-color`.
        filled: "data-[state=checked]:border-(--c-solid) data-[state=checked]:bg-(--c-soft)"
      },
      size: {
        xs: "gap-2 p-2",
        sm: "gap-2.5 p-2.5",
        md: "gap-3 p-3",
        lg: "gap-3.5 p-4",
        xl: "gap-4 p-5"
      },
      // Center a single-line card; top-align once a description makes it taller.
      align: { center: "items-center", start: "items-start" }
    },
    defaultVariants: { variant: "default", size: "md", align: "center" }
  }
);
var cardLabel = cva("font-medium text-trim", {
  variants: {
    size: { xs: "text-xs", sm: "text-sm", md: "text-sm", lg: "text-md", xl: "text-lg" }
  },
  defaultVariants: { size: "md" }
});
var cardDescription = cva("text-gray-light-600 dark:text-gray-dark-400", {
  variants: {
    size: { xs: "text-xs", sm: "text-xs", md: "text-xs", lg: "text-sm", xl: "text-sm" }
  },
  defaultVariants: { size: "md" }
});
var cardIcon = cva(
  "inline-flex shrink-0 items-center justify-center text-gray-light-700 dark:text-gray-dark-300",
  {
    variants: {
      size: {
        xs: "[&_svg]:size-4",
        sm: "[&_svg]:size-4.5",
        md: "[&_svg]:size-5",
        lg: "[&_svg]:size-6",
        xl: "[&_svg]:size-7"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var noIndicatorRing = "data-focus-visible:ring-0";
var normalize = (item) => typeof item === "string" ? { value: item, label: item, testId: `item-${item}` } : { ...item, testId: item.testId ?? `item-${item.value}` };
var onCardArrowKeyDown = (event) => {
  const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
  if (!dir) return;
  const cards = Array.from(
    event.currentTarget.querySelectorAll("input[type=checkbox]:not(:disabled)")
  );
  const at = cards.indexOf(document.activeElement);
  if (at === -1) return;
  event.preventDefault();
  cards[(at + dir + cards.length) % cards.length]?.focus();
};
var ChoiceCardInner = ({
  item,
  size,
  indicator,
  content
}) => {
  const text = /* @__PURE__ */ jsx("span", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: content });
  return item.icon != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { className: cardIcon({ size }), "aria-hidden": true, children: item.icon }),
    text,
    indicator
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    indicator,
    text
  ] });
};
var defaultContent = (item, size, classNames) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("span", { className: cn(cardLabel({ size }), classNames?.label), children: item.label }),
  item.description != null && /* @__PURE__ */ jsx("span", { className: cn(cardDescription({ size }), classNames?.description), children: item.description })
] });
var ChoiceCardGroup = ({
  data,
  multiple,
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  renderItem,
  label,
  description,
  error,
  required,
  invalid,
  disabled,
  readOnly,
  size = "md",
  variant = "default",
  color,
  name,
  id,
  ref,
  onBlur,
  className,
  classNames,
  testId
}) => {
  const isInvalid = invalid || error != null;
  const normalized = data.map(normalize);
  const reactId = useId();
  const rootClass = cn(
    "group flex w-full gap-2",
    orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
    className,
    classNames?.root
  );
  const itemClass = (item) => choiceCard({
    variant,
    size,
    align: item.description != null ? "start" : "center",
    className: classNames?.item
  });
  const group = multiple ? /* @__PURE__ */ jsx(
    CheckboxGroup,
    {
      value,
      defaultValue,
      onValueChange: onChange ? (v) => onChange(
        v
      ) : void 0,
      disabled,
      readOnly,
      invalid: isInvalid,
      name,
      id,
      ref,
      onBlur,
      onKeyDown: onCardArrowKeyDown,
      "data-color": color,
      ...props({ "data-testid": testId }),
      className: rootClass,
      children: normalized.map((item, index) => {
        const indicator = /* @__PURE__ */ jsx(
          Checkbox.Control,
          {
            className: cn(
              controlIndicator({ size, variant }),
              noIndicatorRing,
              classNames?.control
            ),
            children: /* @__PURE__ */ jsx(Checkbox.Indicator, { children: /* @__PURE__ */ jsx(CheckIcon, {}) })
          }
        );
        const content = renderItem ? /* @__PURE__ */ jsx(Checkbox.Context, { children: (api) => renderItem(item, { checked: api.checked === true, disabled: Boolean(api.disabled) }) }) : defaultContent(item, size, classNames);
        return /* @__PURE__ */ jsxs(
          Checkbox.Root,
          {
            value: item.value,
            disabled: item.disabled,
            invalid: isInvalid,
            ids: { hiddenInput: `${reactId}-${index}` },
            "data-testid": item.testId,
            className: itemClass(item),
            children: [
              /* @__PURE__ */ jsx(ChoiceCardInner, { item, size, indicator, content }),
              /* @__PURE__ */ jsx(Checkbox.HiddenInput, {})
            ]
          },
          item.value
        );
      })
    }
  ) : /* @__PURE__ */ jsx(
    RadioGroup.Root,
    {
      value,
      defaultValue,
      onValueChange: onChange ? (d) => onChange(
        d.value
      ) : void 0,
      invalid: isInvalid,
      disabled,
      readOnly,
      required,
      name,
      id,
      ref,
      onBlur,
      orientation,
      "data-color": color,
      ...props({ "data-testid": testId }),
      className: rootClass,
      children: normalized.map((item) => {
        const indicator = /* @__PURE__ */ jsx(
          RadioGroup.ItemControl,
          {
            className: cn(
              controlIndicator({ size, variant }),
              "rounded-full",
              noIndicatorRing,
              classNames?.control
            ),
            children: /* @__PURE__ */ jsx(RadioGroup.ItemContext, { children: (s) => s.checked ? /* @__PURE__ */ jsx("span", { className: "size-[50%] rounded-full bg-gray-light-100 dark:bg-gray-dark-800" }) : null })
          }
        );
        const content = renderItem ? /* @__PURE__ */ jsx(RadioGroup.ItemContext, { children: (s) => renderItem(item, { checked: s.checked, disabled: Boolean(s.disabled) }) }) : defaultContent(item, size, classNames);
        return /* @__PURE__ */ jsxs(
          RadioGroup.Item,
          {
            value: item.value,
            disabled: item.disabled,
            "data-testid": item.testId,
            className: itemClass(item),
            children: [
              /* @__PURE__ */ jsx(ChoiceCardInner, { item, size, indicator, content }),
              /* @__PURE__ */ jsx(RadioGroup.ItemHiddenInput, {})
            ]
          },
          item.value
        );
      })
    }
  );
  return /* @__PURE__ */ jsx(
    FieldShell,
    {
      label,
      description,
      error,
      required,
      disabled,
      size,
      className: classNames?.field,
      children: group
    }
  );
};

export { ChoiceCardGroup };
