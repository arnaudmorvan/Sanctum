"use client";
import { usePillOverflow, PillOverflowCounter, pillsContent, pillsShell } from '../../chunk-MPZOVOA3.js';
import { Pill } from '../../chunk-3YVX2KOL.js';
import { normalizeSelectData, filterSelectData } from '../../chunk-TWGCWKRV.js';
import { Combobox } from '../../chunk-RDMZUUZQ.js';
import { controlOpenProps } from '../../chunk-5FDOOG4J.js';
import '../../chunk-PRHZ6FHV.js';
import { inputSlot, inputControlClasses, placeholderColor, inputShell } from '../../chunk-MWXEQ5QX.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import '../../chunk-IG7FBZVM.js';
import { useUncontrolled } from '../../chunk-BEL75C7N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Combobox as Combobox$1 } from '@ark-ui/react/combobox';
import { useState, useMemo } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var MultiSelect = ({
  data,
  value: valueProp,
  defaultValue,
  onChange,
  renderItem,
  placeholder,
  searchable = true,
  searchPlaceholder,
  clearable,
  clearSectionMode = "replace",
  maxValues,
  maxLines,
  startSlot,
  endSlot,
  hidePickedOptions,
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
  const [value, setSelected] = useUncontrolled({
    value: valueProp,
    defaultValue: defaultValue ?? [],
    onChange
  });
  const [search, setSearch] = useState("");
  const setValues = (next) => {
    if (maxValues != null && next.length > value.length && next.length > maxValues) {
      return;
    }
    setSelected(next);
  };
  const removeValue = (v) => setValues(value.filter((x) => x !== v));
  const { containerRef, visibleCount, hiddenCount, measuring } = usePillOverflow({
    maxLines,
    count: value.length
  });
  const normalized = useMemo(() => normalizeSelectData(data), [data]);
  const itemMap = useMemo(() => new Map(normalized.items.map((i) => [i.value, i])), [normalized]);
  const { collection, items, groups } = useMemo(() => {
    const q = searchable ? search.trim().toLowerCase() : "";
    const picked = new Set(value);
    return filterSelectData(
      normalized,
      (item) => (!hidePickedOptions || !picked.has(item.value)) && (q === "" || item.label.toLowerCase().includes(q))
    );
  }, [normalized, search, searchable, hidePickedOptions, value]);
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
      multiple: true,
      collection,
      value,
      onValueChange: (details) => setValues(details.value),
      inputValue: search,
      onInputValueChange: (details) => {
        if (searchable) setSearch(details.inputValue);
      },
      selectionBehavior: "clear",
      closeOnSelect: false,
      openOnClick: true,
      disabled,
      readOnly,
      size,
      variant,
      color,
      className: cn(className, classNames?.root),
      children: [
        /* @__PURE__ */ jsx(Combobox$1.Context, { children: (api) => {
          const showClear = Boolean(clearable) && api.hasSelectedItems && !disabled && !readOnly;
          return /* @__PURE__ */ jsxs(
            Combobox$1.Control,
            {
              ...props({
                "data-invalid": isInvalid,
                "data-with-start-slot": startSlot != null,
                // The composed Trigger always sits at the end. for now.
                "data-with-end-slot": true
              }),
              ...disabled || readOnly ? {} : controlOpenProps(() => api.setOpen(true)),
              className: cn(inputShell({ size, variant }), pillsShell, classNames?.control),
              children: [
                startSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: startSlot }),
                /* @__PURE__ */ jsxs("div", { ref: containerRef, className: pillsContent({ size }), children: [
                  value.slice(0, visibleCount).map((v) => /* @__PURE__ */ jsx(
                    Pill,
                    {
                      size,
                      color: itemMap.get(v)?.color,
                      disabled,
                      withRemoveButton: !readOnly,
                      onRemove: () => removeValue(v),
                      className: classNames?.pill,
                      "data-overflow-item": true,
                      children: itemMap.get(v)?.label ?? v
                    },
                    v
                  )),
                  (hiddenCount > 0 || measuring && maxLines != null) && /* @__PURE__ */ jsx(
                    PillOverflowCounter,
                    {
                      count: measuring ? value.length : hiddenCount,
                      size,
                      className: measuring ? "invisible" : void 0
                    }
                  ),
                  searchable ? /* @__PURE__ */ jsx(
                    Combobox$1.Input,
                    {
                      "data-overflow-field": true,
                      placeholder: value.length === 0 ? placeholder : searchPlaceholder,
                      readOnly: !searchable || readOnly,
                      onBlur,
                      ref,
                      "aria-invalid": isInvalid || void 0,
                      ...props({ "data-testid": testId }),
                      className: cn(inputControlClasses, "w-auto min-w-16", classNames?.input),
                      onKeyDown: (event) => {
                        const last = value[value.length - 1];
                        if (event.key === "Backspace" && event.currentTarget.value === "" && last !== void 0 && !readOnly) {
                          removeValue(last);
                        }
                      }
                    }
                  ) : value.length <= 0 && /* @__PURE__ */ jsx("span", { className: cn(placeholderColor, "truncate"), children: placeholder })
                ] }),
                endSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, children: endSlot }),
                showClear && /* @__PURE__ */ jsx(Combobox.ClearTrigger, {}),
                (clearSectionMode === "both" || !showClear) && /* @__PURE__ */ jsx(Combobox.Trigger, { "aria-label": "Show options", "data-chevron": true }),
                name != null && value.map((v) => /* @__PURE__ */ jsx("input", { type: "hidden", name, value: v }, v))
              ]
            }
          );
        } }),
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

export { MultiSelect };
