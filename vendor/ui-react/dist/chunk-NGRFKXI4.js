import { normalizeSelectData, filterSelectData } from './chunk-TWGCWKRV.js';
import { Combobox } from './chunk-RDMZUUZQ.js';
import { popoverClearTrigger, popoverCheckbox } from './chunk-PRHZ6FHV.js';
import { inputSlot, inputControlClasses, inputShell } from './chunk-MWXEQ5QX.js';
import { FieldShell } from './chunk-AL57HMNZ.js';
import { CloseIcon, CheckIcon } from './chunk-IG7FBZVM.js';
import { useUncontrolled } from './chunk-BEL75C7N.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Combobox as Combobox$1 } from '@ark-ui/react/combobox';
import { SearchIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var MultiComboboxList = ({
  data,
  value: valueProp,
  defaultValue,
  onChange,
  renderItem,
  placeholder = "Search\u2026",
  empty = "Nothing found",
  clearable,
  maxValues,
  hidePickedOptions,
  size = "md",
  variant = "unstyled",
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
  const normalized = useMemo(() => normalizeSelectData(data), [data]);
  const { collection, items, groups } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const picked = new Set(value);
    return filterSelectData(
      normalized,
      (item) => (!hidePickedOptions || !picked.has(item.value)) && (q === "" || item.label.toLowerCase().includes(q))
    );
  }, [normalized, search, hidePickedOptions, value]);
  const canClear = Boolean(clearable) && !disabled && !readOnly;
  const showClear = canClear && (value != null && value.length > 0 || search.length > 0);
  const renderOption = (item) => /* @__PURE__ */ jsx(
    Combobox.Item,
    {
      item,
      "data-testid": item.testId,
      className: cn("group/item", classNames?.option),
      children: (state) => renderItem ? renderItem(item, state) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: cn(popoverCheckbox({ size }), classNames?.checkbox), children: /* @__PURE__ */ jsx(Combobox$1.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, {}) }) }),
        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: item.label })
      ] })
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
      onInputValueChange: (details) => setSearch(details.inputValue),
      selectionBehavior: "clear",
      open: true,
      onOpenChange: () => {
      },
      disableLayer: true,
      closeOnSelect: false,
      autoFocus: true,
      disabled,
      readOnly,
      size,
      variant,
      color,
      className,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            ...props({ "data-invalid": isInvalid, "data-with-end-slot": canClear }),
            className: cn(
              inputShell({ size, variant }),
              "rounded-none border-t-0 border-e-0 border-s-0 border-b border-brand-900/20 dark:border-white/15",
              classNames?.search
            ),
            children: [
              /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: /* @__PURE__ */ jsx(SearchIcon, {}) }),
              /* @__PURE__ */ jsx(
                Combobox$1.Input,
                {
                  placeholder,
                  onBlur,
                  ref,
                  "aria-invalid": isInvalid || void 0,
                  ...props({ "data-testid": testId }),
                  className: cn(inputControlClasses, classNames?.input)
                }
              ),
              canClear && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Clear value",
                  "aria-hidden": !showClear,
                  tabIndex: showClear ? 0 : -1,
                  onPointerDown: (event) => event.preventDefault(),
                  onClick: () => {
                    setValues([]);
                    setSearch("");
                  },
                  className: cn(popoverClearTrigger, !showClear && "invisible"),
                  children: /* @__PURE__ */ jsx(CloseIcon, {})
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Combobox.Panel, { className: classNames?.list, children: [
          groups ? groups.map((group) => /* @__PURE__ */ jsx(Combobox.Group, { label: group.group, children: group.items.map(renderOption) }, group.group)) : items.map(renderOption),
          empty != null && /* @__PURE__ */ jsx(Combobox.Empty, { children: empty })
        ] }),
        name != null && value.map((v) => /* @__PURE__ */ jsx("input", { type: "hidden", name, value: v }, v))
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

export { MultiComboboxList };
