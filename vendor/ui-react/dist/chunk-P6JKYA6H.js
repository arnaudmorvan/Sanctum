import { normalizeSelectData, filterSelectData } from './chunk-TWGCWKRV.js';
import { Combobox } from './chunk-RDMZUUZQ.js';
import { popoverClearTrigger } from './chunk-PRHZ6FHV.js';
import { inputSlot, inputControlClasses, inputShell } from './chunk-MWXEQ5QX.js';
import { FieldShell } from './chunk-AL57HMNZ.js';
import { CloseIcon } from './chunk-IG7FBZVM.js';
import { useUncontrolled } from './chunk-BEL75C7N.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { Combobox as Combobox$1 } from '@ark-ui/react/combobox';
import { SearchIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var toArkValue = (v) => v === null ? [] : [v];
var ComboboxList = ({
  data,
  value: valueProp,
  defaultValue,
  onChange,
  renderItem,
  placeholder = "Search\u2026",
  empty = "Nothing found",
  clearable,
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
  const [value, setValue] = useUncontrolled({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange
  });
  const [search, setSearch] = useState("");
  const normalized = useMemo(() => normalizeSelectData(data), [data]);
  const { collection, items, groups } = useMemo(() => {
    const q = search.trim().toLowerCase();
    return filterSelectData(normalized, (item) => q === "" || item.label.toLowerCase().includes(q));
  }, [normalized, search]);
  const canClear = Boolean(clearable) && !disabled && !readOnly;
  const showClear = canClear && (value != null || search.length > 0);
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
      value: toArkValue(value),
      onValueChange: (details) => setValue(details.value[0] ?? null),
      inputValue: search,
      onInputValueChange: (details) => setSearch(details.inputValue),
      open: true,
      onOpenChange: () => {
      },
      disableLayer: true,
      closeOnSelect: false,
      autoFocus: true,
      disabled,
      readOnly,
      required,
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
                    setValue(null);
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
        name != null && /* @__PURE__ */ jsx("input", { type: "hidden", name, value: value ?? "" })
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

export { ComboboxList };
