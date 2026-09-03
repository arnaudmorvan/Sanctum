import { mergeRefs } from './chunk-UVYTJQTJ.js';
import { normalizeSelectData } from './chunk-TWGCWKRV.js';
import { controlOpenProps } from './chunk-5FDOOG4J.js';
import { scrollHighlightedIntoView, popoverClearTrigger, popoverChevron, popoverGroupLabel, popoverList, popoverContent, popoverIndicator, popoverOption } from './chunk-PRHZ6FHV.js';
import { inputSlot, placeholderColor, shellGap, inputShell } from './chunk-MWXEQ5QX.js';
import { FieldShell, fieldA11yProps } from './chunk-AL57HMNZ.js';
import { CloseIcon, ChevronIcon, CheckIcon } from './chunk-IG7FBZVM.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { useFieldContext } from '@ark-ui/react/field';
import { Portal } from '@ark-ui/react/portal';
import { Select as Select$1 } from '@ark-ui/react/select';
import { useMemo, useRef } from 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var toArkValue = (v) => v === void 0 ? void 0 : v === null ? [] : [v];
var SelectTrigger = ({
  ref,
  onBlur,
  invalid,
  testId,
  className,
  children
}) => {
  const field = useFieldContext();
  return /* @__PURE__ */ jsx(
    Select$1.Trigger,
    {
      ref,
      onBlur,
      "aria-invalid": invalid || void 0,
      ...fieldA11yProps(field),
      ...props({ "data-testid": testId }),
      className,
      children
    }
  );
};
var Select = ({
  data,
  value,
  defaultValue,
  onChange,
  renderItem,
  placeholder = "Pick a value",
  clearable,
  clearSectionMode = "replace",
  startSlot,
  endSlot,
  size = "md",
  variant = "default",
  color,
  disabled,
  readOnly,
  required,
  invalid,
  name,
  onBlur,
  ref,
  label,
  description,
  error,
  className,
  classNames,
  testId,
  ...selectProps
}) => {
  const { collection, items, groups } = useMemo(() => normalizeSelectData(data), [data]);
  const controlRef = useRef(null);
  const triggerRef = useRef(null);
  const isInvalid = invalid || error != null;
  const selected = items.find(({ value: iv }) => value === iv);
  const renderOption = (item) => /* @__PURE__ */ jsx(
    Select$1.Item,
    {
      item,
      "data-testid": item.testId,
      className: cn(popoverOption({ size }), classNames?.option),
      children: renderItem ? /* @__PURE__ */ jsx(Select$1.ItemContext, { children: (ctx) => renderItem(item, {
        selected: ctx.selected,
        highlighted: ctx.highlighted
      }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Select$1.ItemText, { children: item.label }),
        /* @__PURE__ */ jsx(Select$1.ItemIndicator, { className: popoverIndicator, children: /* @__PURE__ */ jsx(CheckIcon, {}) })
      ] })
    },
    item.value
  );
  const control = /* @__PURE__ */ jsxs(
    Select$1.Root,
    {
      collection,
      value: toArkValue(value),
      defaultValue: toArkValue(defaultValue),
      onValueChange: onChange ? (d) => onChange(d.value[0] ?? null) : void 0,
      disabled,
      readOnly,
      required,
      name,
      deselectable: clearable,
      positioning: {
        sameWidth: true,
        getAnchorRect: () => controlRef.current?.getBoundingClientRect() ?? null
      },
      scrollToIndexFn: scrollHighlightedIntoView,
      "data-color": color,
      className: cn("w-full", className),
      children: [
        /* @__PURE__ */ jsx(Select$1.Context, { children: (api) => {
          const showClear = Boolean(clearable) && api.hasSelectedItems && !disabled && !readOnly;
          const showChevron = clearSectionMode === "both" || !showClear;
          return /* @__PURE__ */ jsxs(
            Select$1.Control,
            {
              ref: controlRef,
              ...props({
                "data-invalid": isInvalid,
                "data-with-start-slot": startSlot != null,
                // The trigger always ends in a chevron / clear control.
                "data-with-end-slot": true
              }),
              ...disabled || readOnly ? {} : controlOpenProps(() => api.setOpen(true)),
              className: cn(inputShell({ size, variant }), "cursor-pointer", classNames?.control),
              children: [
                /* @__PURE__ */ jsxs(
                  SelectTrigger,
                  {
                    ref: mergeRefs(triggerRef, ref),
                    onBlur,
                    invalid: isInvalid,
                    testId,
                    className: cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center bg-transparent text-start outline-none disabled:cursor-not-allowed",
                      // Slots live inside the trigger (not the shell), so re-apply the
                      // shell's per-size gap here to space the icon from the value.
                      shellGap[size]
                    ),
                    children: [
                      startSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: startSlot }),
                      /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-start", children: api.hasSelectedItems ? renderItem && selected ? renderItem(selected, {
                        selected: false,
                        highlighted: false
                      }) : api.valueAsString : /* @__PURE__ */ jsx("span", { className: placeholderColor, children: placeholder }) }),
                      endSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, children: endSlot })
                    ]
                  }
                ),
                showClear && /* @__PURE__ */ jsx(Select$1.ClearTrigger, { className: popoverClearTrigger, children: /* @__PURE__ */ jsx(CloseIcon, {}) }),
                showChevron && // A sibling toggle button (the value `Ark.Trigger` can't nest it
                // next to the clear button), so the chevron sits at the far edge
                // like the rest of the family. Focus the trigger first so keyboard
                // nav stays on the combobox; `preventDefault` stops the tap from
                // stealing focus to this button. `tabIndex=-1`: the trigger is the
                // tab stop.
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    tabIndex: -1,
                    "aria-label": "Show options",
                    "data-chevron": true,
                    className: cn(
                      popoverChevron,
                      "inline-flex cursor-pointer items-center justify-center rounded-sm data-disabled:cursor-not-allowed",
                      api.open && "rotate-180"
                    ),
                    ...props({
                      "data-disabled": disabled,
                      "data-readonly": readOnly
                    }),
                    onPointerDown: (event) => event.preventDefault(),
                    ...!(disabled || readOnly) && {
                      onClick: () => {
                        triggerRef.current?.focus();
                        api.setOpen(!api.open);
                      }
                    },
                    children: /* @__PURE__ */ jsx(ChevronIcon, {})
                  }
                )
              ]
            }
          );
        } }),
        /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(Select$1.Positioner, { children: /* @__PURE__ */ jsx(Select$1.Content, { "data-color": color, className: cn(popoverContent, classNames?.popover), children: /* @__PURE__ */ jsx(Select$1.List, { className: popoverList({ withPaddingTop: true }), children: groups ? groups.map((group) => /* @__PURE__ */ jsxs(Select$1.ItemGroup, { children: [
          /* @__PURE__ */ jsx(Select$1.ItemGroupLabel, { className: popoverGroupLabel, children: group.group }),
          group.items.map(renderOption)
        ] }, group.group)) : items.map(renderOption) }) }) }) }),
        /* @__PURE__ */ jsx(Select$1.HiddenSelect, { ...selectProps })
      ]
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
      classNames: { label: classNames?.label },
      children: control
    }
  );
};

export { Select };
