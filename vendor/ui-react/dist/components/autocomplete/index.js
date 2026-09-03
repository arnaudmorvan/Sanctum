"use client";
import { normalizeSelectData, filterSelectData } from '../../chunk-TWGCWKRV.js';
import { Combobox } from '../../chunk-RDMZUUZQ.js';
import { controlOpenProps } from '../../chunk-5FDOOG4J.js';
import { popoverClearTrigger } from '../../chunk-PRHZ6FHV.js';
import { inputControlClasses, inputSlot } from '../../chunk-MWXEQ5QX.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { CloseIcon } from '../../chunk-IG7FBZVM.js';
import { useUncontrolled } from '../../chunk-BEL75C7N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Combobox as Combobox$1 } from '@ark-ui/react/combobox';
import { useMemo } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var Autocomplete = ({
  data,
  value,
  defaultValue,
  onChange,
  renderItem,
  placeholder,
  clearable,
  clearSectionMode = "replace",
  startSlot,
  endSlot,
  empty = "Nothing found",
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
  testId
}) => {
  const isInvalid = invalid || error != null;
  const [query, setQuery] = useUncontrolled({
    value,
    defaultValue,
    onChange,
    finalValue: ""
  });
  const showClear = Boolean(clearable && query);
  const normalized = useMemo(() => normalizeSelectData(data), [data]);
  const { collection, items, groups } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const exact = normalized.items.some((i) => i.label.toLowerCase() === q);
    const shouldFilter = q.length > 0 && !exact;
    return filterSelectData(
      normalized,
      (item) => !shouldFilter || item.label.toLowerCase().includes(q)
    );
  }, [normalized, query]);
  const renderOption = (item) => /* @__PURE__ */ jsx(
    Combobox.Item,
    {
      item,
      "data-testid": item.testId,
      className: classNames?.option,
      children: renderItem ? (state) => renderItem(item, state) : item.label
    },
    item.value
  );
  const control = /* @__PURE__ */ jsxs(
    Combobox.Root,
    {
      collection,
      inputValue: query,
      onInputValueChange: (details) => setQuery(details.inputValue),
      allowCustomValue: true,
      openOnClick: true,
      disabled,
      readOnly,
      size,
      variant,
      color,
      className,
      children: [
        /* @__PURE__ */ jsx(Combobox.Context, { children: (api) => /* @__PURE__ */ jsxs(
          Combobox.Control,
          {
            className: classNames?.control,
            startSlot,
            ...props({ "data-invalid": isInvalid }),
            ...disabled || readOnly ? {} : controlOpenProps(() => api.setOpen(true)),
            children: [
              /* @__PURE__ */ jsx(
                Combobox$1.Input,
                {
                  placeholder,
                  name,
                  onBlur,
                  ref,
                  "aria-invalid": isInvalid || void 0,
                  ...props({ "data-testid": testId }),
                  className: cn(inputControlClasses, classNames?.input)
                }
              ),
              endSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, children: endSlot }),
              showClear && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Clear value",
                  onPointerDown: (event) => event.preventDefault(),
                  onClick: () => setQuery(""),
                  className: popoverClearTrigger,
                  children: /* @__PURE__ */ jsx(CloseIcon, {})
                }
              ),
              (clearSectionMode === "both" || !showClear) && /* @__PURE__ */ jsx(Combobox.Trigger, { "aria-label": "Show options", "data-chevron": true })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs(Combobox.Content, { className: classNames?.popover, children: [
          groups ? groups.map((group) => /* @__PURE__ */ jsx(Combobox.Group, { label: group.group, children: group.items.map(renderOption) }, group.group)) : items.map(renderOption),
          empty != null && /* @__PURE__ */ jsx(Combobox.Empty, { children: empty })
        ] })
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
      children: control
    }
  );
};

export { Autocomplete };
