"use client";
import { buildMaps, filterTree, flattenTree, isLeaf } from '../../chunk-WZB6LPQI.js';
import { usePillOverflow, PillOverflowCounter, pillsContent, pillsShell } from '../../chunk-MPZOVOA3.js';
import { Pill } from '../../chunk-3YVX2KOL.js';
import { Popover, popoverClearTrigger, popoverChevron, popoverEmpty } from '../../chunk-PRHZ6FHV.js';
import { inputSlot, placeholderColor, inputShell, inputControlClasses } from '../../chunk-MWXEQ5QX.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { CloseIcon, ChevronIcon, CheckIcon, MinusIcon } from '../../chunk-IG7FBZVM.js';
import { useUncontrolled } from '../../chunk-BEL75C7N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { cva } from 'class-variance-authority';
import { useState, useMemo, useRef, useEffect, Fragment as Fragment$1 } from 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var getLeafValues = (node, acc = []) => {
  if (isLeaf(node)) {
    if (!node.disabled) acc.push(node.value);
    return acc;
  }
  if (node.children) for (const child of node.children) getLeafValues(child, acc);
  return acc;
};
var getNodeState = (node, selected) => {
  const leaves = getLeafValues(node);
  if (leaves.length === 0) return "unchecked";
  let on = 0;
  for (const v of leaves) if (selected.has(v)) on++;
  if (on === 0) return "unchecked";
  return on === leaves.length ? "checked" : "indeterminate";
};
var toggleNode = (node, current) => {
  const leaves = getLeafValues(node);
  if (leaves.length === 0) return current;
  const set = new Set(current);
  const fullyChecked = leaves.every((v) => set.has(v));
  for (const v of leaves) fullyChecked ? set.delete(v) : set.add(v);
  return [...set];
};
var treeLine = "bg-brand-900/20 dark:bg-white/15";
var treeRow = cva(
  [
    "group/row relative flex w-full items-center rounded-sm ps-1.5 outline-none select-none cursor-pointer",
    "text-gray-light-900 dark:text-gray-dark-100",
    "hover:bg-black/5 dark:hover:bg-white/8",
    "data-active:bg-black/5 dark:data-active:bg-white/8",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/40"
  ],
  {
    variants: {
      size: {
        xs: "min-h-7 pe-1.5 text-xs",
        sm: "min-h-8 pe-2 text-sm",
        md: "min-h-9 pe-2 text-md",
        lg: "min-h-10 pe-2.5 text-lg",
        xl: "min-h-11 pe-3 text-xl"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var treeCheckbox = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-xs border transition-colors",
    "border-gray-light-300 dark:border-gray-dark-700",
    "bg-gray-light-25 dark:bg-gray-dark-900",
    "text-(--c-on-solid)",
    "group-data-checked/row:border-(--c-solid) group-data-checked/row:bg-(--c-solid)",
    "group-data-mixed/row:border-(--c-solid) group-data-mixed/row:bg-(--c-solid)"
  ],
  {
    variants: {
      size: {
        xs: "size-3.5 [&_svg]:size-2.5",
        sm: "size-4 [&_svg]:size-3",
        md: "size-4 [&_svg]:size-3",
        lg: "size-4.5 [&_svg]:size-3.5",
        xl: "size-5 [&_svg]:size-4"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var TreeMultiSelect = ({
  data,
  value: valueProp,
  defaultValue,
  onChange,
  renderItem,
  clearable = false,
  clearSectionMode = "replace",
  searchable = false,
  searchPlaceholder = "Search\u2026",
  empty = "Nothing found",
  placeholder = "Pick values",
  maxLines,
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
  testId
}) => {
  const [value, setValue] = useUncontrolled({
    value: valueProp,
    defaultValue: defaultValue ?? [],
    onChange,
    finalValue: []
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isInvalid = invalid || error != null;
  const { labelMap, nodeMap } = useMemo(() => buildMaps(data), [data]);
  const selectedSet = useMemo(() => new Set(value), [value]);
  const filteredData = useMemo(
    () => searchable ? filterTree(data, search) : data,
    [data, search, searchable]
  );
  const flat = useMemo(() => flattenTree(filteredData, !!disabled), [filteredData, disabled]);
  const enabledValues = useMemo(() => flat.filter((f) => !f.disabled).map((f) => f.value), [flat]);
  const [activeValueState, setActiveValue] = useState(null);
  const activeValue = activeValueState != null && enabledValues.includes(activeValueState) ? activeValueState : enabledValues[0] ?? null;
  const searchRef = useRef(null);
  const rowRefs = useRef(/* @__PURE__ */ new Map());
  const registerRow = (value2, el) => {
    if (el) rowRefs.current.set(value2, el);
    else rowRefs.current.delete(value2);
  };
  const focusRow = (next) => {
    if (next == null) return;
    setActiveValue(next);
    rowRefs.current.get(next)?.focus();
  };
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      if (searchable) searchRef.current?.focus({ preventScroll: true });
      else if (activeValue) rowRefs.current.get(activeValue)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open, searchable]);
  const toggle = (node) => setValue(toggleNode(node, value));
  const removeValue = (v) => setValue(value.filter((x) => x !== v));
  const { containerRef, visibleCount, hiddenCount } = usePillOverflow({
    maxLines,
    count: value.length
  });
  const moveActive = (dir) => {
    if (enabledValues.length === 0) return;
    const idx = activeValue ? enabledValues.indexOf(activeValue) : -1;
    const next = idx === -1 ? dir === 1 ? 0 : enabledValues.length - 1 : Math.min(Math.max(idx + dir, 0), enabledValues.length - 1);
    focusRow(enabledValues[next] ?? null);
  };
  const onTreeKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        focusRow(enabledValues[0] ?? null);
        break;
      case "End":
        event.preventDefault();
        focusRow(enabledValues[enabledValues.length - 1] ?? null);
        break;
      case " ":
      case "Enter": {
        event.preventDefault();
        const node = activeValue ? nodeMap.get(activeValue) : void 0;
        if (node && !(disabled || readOnly || node.disabled)) toggle(node);
        break;
      }
    }
  };
  const onSearchKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusRow(enabledValues[0] ?? null);
    }
  };
  const renderNode = (node, depth, ancestorHasNextSibling, isLast) => {
    const source = nodeMap.get(node.value) ?? node;
    const state = getNodeState(source, selectedSet);
    const checked = state === "checked";
    const mixed = state === "indeterminate";
    const nodeDisabled = disabled || node.disabled;
    const rowTestId = node.testId ?? `item-${node.value}`;
    const content = renderItem ? renderItem(node, {
      checked,
      indeterminate: mixed,
      leaf: isLeaf(source),
      disabled: !!nodeDisabled,
      depth
    }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("span", { "aria-hidden": true, className: cn(treeCheckbox({ size }), classNames?.checkbox), children: [
        checked && /* @__PURE__ */ jsx(CheckIcon, {}),
        mixed && /* @__PURE__ */ jsx(MinusIcon, {})
      ] }),
      /* @__PURE__ */ jsx("span", { className: cn("ms-1.5 min-w-0 flex-1 truncate text-start", classNames?.label), children: node.label })
    ] });
    return /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          role: "treeitem",
          "aria-level": depth + 1,
          "aria-checked": mixed ? "mixed" : checked,
          "aria-disabled": nodeDisabled || void 0,
          "data-checked": checked || void 0,
          "data-mixed": mixed || void 0,
          "data-active": node.value === activeValue || void 0,
          "data-disabled": nodeDisabled || void 0,
          "data-testid": rowTestId,
          tabIndex: node.value === activeValue ? 0 : -1,
          ref: (el) => registerRow(node.value, el),
          onClick: () => {
            if (nodeDisabled || readOnly) return;
            setActiveValue(node.value);
            toggle(source);
          },
          className: cn(treeRow({ size }), classNames?.node),
          children: [
            depth > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              ancestorHasNextSibling.map((hasNext, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Indentation is stable inside component, we would want to rerender anyway.
                /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "relative w-4 shrink-0 self-stretch", children: hasNext && /* @__PURE__ */ jsx("span", { className: cn("absolute inset-y-0 inset-s-1/2 w-px", treeLine) }) }, i)
              )),
              /* @__PURE__ */ jsxs("span", { "aria-hidden": true, className: "relative w-4 shrink-0 self-stretch", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "absolute inset-s-1/2 top-0 w-px",
                      treeLine,
                      isLast ? "h-1/2" : "bottom-0"
                    )
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: cn("absolute inset-s-1/2 top-1/2 h-px w-1/2", treeLine) })
              ] })
            ] }),
            content
          ]
        }
      ),
      node.children?.map(
        (child, i) => renderNode(
          child,
          depth + 1,
          depth === 0 ? [] : [...ancestorHasNextSibling, !isLast],
          i === (node.children?.length ?? 0) - 1
        )
      )
    ] }, node.value);
  };
  const showClear = clearable && value.length > 0 && !disabled && !readOnly;
  const control = /* @__PURE__ */ jsxs(
    Popover.Root,
    {
      open,
      onOpenChange: (details) => {
        if (disabled || readOnly) return;
        setOpen(details.open);
        if (!details.open) setSearch("");
      },
      autoFocus: false,
      width: "target",
      children: [
        /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref,
            role: "combobox",
            "aria-expanded": open,
            "aria-haspopup": "tree",
            "aria-invalid": isInvalid || void 0,
            "data-color": color,
            ...props({
              "data-disabled": disabled,
              "data-readonly": readOnly,
              "data-invalid": isInvalid,
              "data-with-start-slot": startSlot != null,
              // The trigger always ends in a chevron (and optional clear).
              "data-with-end-slot": true,
              // The shell IS the tabbable/focusable element here (no separate
              // inner control to route to), so `testId` lands directly on it.
              "data-testid": testId
            }),
            tabIndex: disabled ? -1 : 0,
            onBlur,
            onKeyDown: (event) => {
              if (disabled || readOnly) return;
              if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
              }
            },
            className: cn(
              inputShell({ size, variant }),
              pillsShell,
              "cursor-pointer",
              className,
              classNames?.trigger
            ),
            children: [
              startSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: startSlot }),
              /* @__PURE__ */ jsx("div", { ref: containerRef, className: pillsContent({ size }), children: value.length === 0 ? /* @__PURE__ */ jsx("span", { className: cn("min-w-0 flex-1 truncate", placeholderColor), children: placeholder }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                value.slice(0, visibleCount).map((v) => /* @__PURE__ */ jsx(
                  Pill,
                  {
                    size,
                    disabled,
                    withRemoveButton: !disabled && !readOnly,
                    onRemove: () => removeValue(v),
                    className: classNames?.pill,
                    "data-overflow-item": true,
                    children: labelMap.get(v) ?? v
                  },
                  v
                )),
                hiddenCount > 0 && /* @__PURE__ */ jsx(PillOverflowCounter, { count: hiddenCount, size })
              ] }) }),
              endSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, children: endSlot }),
              showClear && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Clear all",
                  onPointerDown: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  },
                  onClick: (event) => {
                    event.stopPropagation();
                    setValue([]);
                  },
                  className: popoverClearTrigger,
                  children: /* @__PURE__ */ jsx(CloseIcon, {})
                }
              ),
              (clearSectionMode === "both" || !showClear) && /* @__PURE__ */ jsx("span", { "aria-hidden": true, "data-chevron": true, className: cn(popoverChevron, open && "rotate-180"), children: /* @__PURE__ */ jsx(ChevronIcon, {}) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs(Popover.Content, { "data-color": color, className: classNames?.popover, children: [
          searchable && /* @__PURE__ */ jsx(Popover.Header, { children: /* @__PURE__ */ jsx(
            "input",
            {
              ref: searchRef,
              type: "text",
              value: search,
              onChange: (event) => setSearch(event.target.value),
              onKeyDown: onSearchKeyDown,
              placeholder: searchPlaceholder,
              "aria-label": "Search",
              className: cn(inputControlClasses, "text-sm", classNames?.search)
            }
          ) }),
          /* @__PURE__ */ jsx(Popover.Body, { children: flat.length === 0 ? /* @__PURE__ */ jsx("div", { className: popoverEmpty, children: empty }) : /* @__PURE__ */ jsx(
            "div",
            {
              role: "tree",
              "aria-multiselectable": "true",
              "aria-orientation": "vertical",
              onKeyDown: onTreeKeyDown,
              className: "flex flex-col",
              children: filteredData.map(
                (node, i) => renderNode(
                  // `filterTree` only removes non-matching nodes — it can't change
                  // their payload shape, so this is the same shape as `data`'s.
                  node,
                  0,
                  [],
                  i === filteredData.length - 1
                )
              )
            }
          ) })
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

export { TreeMultiSelect };
