"use client";
import { buildMaps, filterTree, flattenTree, isLeaf } from '../../chunk-WZB6LPQI.js';
import { Popover, popoverClearTrigger, popoverChevron, popoverEmpty, popoverIndicator } from '../../chunk-PRHZ6FHV.js';
import { inputSlot, placeholderColor, inputShell, inputControlClasses } from '../../chunk-MWXEQ5QX.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { CloseIcon, ChevronIcon, CheckIcon } from '../../chunk-IG7FBZVM.js';
import { useUncontrolled } from '../../chunk-BEL75C7N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { cva } from 'class-variance-authority';
import { useState, useMemo, useRef, useEffect, Fragment as Fragment$1 } from 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var treeLine = "bg-brand-900/20 dark:bg-white/15";
var treeRow = cva(
  ["group/row relative flex w-full items-center rounded-sm ps-1.5 outline-none select-none"],
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
var treeLeafRow = cn(
  "cursor-pointer text-gray-light-900 dark:text-gray-dark-100",
  "hover:bg-black/5 dark:hover:bg-white/8",
  "data-active:bg-black/5 dark:data-active:bg-white/8",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/40"
);
var treeBranchRow = "cursor-default font-medium text-gray-light-600 dark:text-gray-dark-300";
var TreeSelect = ({
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
  placeholder = "Pick a value",
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
    defaultValue: defaultValue ?? null,
    onChange,
    finalValue: null
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isInvalid = invalid || error != null;
  const { labelMap, nodeMap } = useMemo(() => buildMaps(data), [data]);
  const filteredData = useMemo(
    () => searchable ? filterTree(data, search) : data,
    [data, search, searchable]
  );
  const flat = useMemo(() => flattenTree(filteredData, !!disabled), [filteredData, disabled]);
  const enabledLeaves = useMemo(
    () => flat.filter(
      (f) => !f.disabled && isLeaf(nodeMap.get(f.value) ?? { value: f.value, label: f.value })
    ).map((f) => f.value),
    [flat, nodeMap]
  );
  const [activeValueState, setActiveValue] = useState(null);
  const activeValue = activeValueState != null && enabledLeaves.includes(activeValueState) ? activeValueState : enabledLeaves[0] ?? null;
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
  const typeahead = useRef({
    query: "",
    timer: null
  });
  useEffect(
    () => () => {
      if (typeahead.current.timer) clearTimeout(typeahead.current.timer);
    },
    []
  );
  const typeToFocus = (char) => {
    const state = typeahead.current;
    if (state.timer) clearTimeout(state.timer);
    state.query += char;
    state.timer = setTimeout(() => {
      state.query = "";
    }, 500);
    const n = enabledLeaves.length;
    if (n === 0) return;
    const q = state.query.toLowerCase();
    const repeated = q.length > 1 && [...q].every((c) => c === q.charAt(0));
    const needle = repeated ? q.charAt(0) : q;
    const start = activeValue ? enabledLeaves.indexOf(activeValue) : -1;
    const base = start === -1 ? 0 : start;
    const advance = start !== -1 && (q.length === 1 || repeated) ? 1 : 0;
    for (let i = 0; i < n; i++) {
      const value2 = enabledLeaves[(base + advance + i) % n];
      if (value2 && (labelMap.get(value2) ?? value2).toLowerCase().startsWith(needle)) {
        focusRow(value2);
        break;
      }
    }
  };
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      if (searchable) searchRef.current?.focus({ preventScroll: true });
      else if (activeValue) rowRefs.current.get(activeValue)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open, searchable]);
  const selectLeaf = (node) => {
    setValue(node.value);
    setOpen(false);
    setSearch("");
  };
  const moveActive = (dir) => {
    if (enabledLeaves.length === 0) return;
    const idx = activeValue ? enabledLeaves.indexOf(activeValue) : -1;
    const next = idx === -1 ? dir === 1 ? 0 : enabledLeaves.length - 1 : Math.min(Math.max(idx + dir, 0), enabledLeaves.length - 1);
    focusRow(enabledLeaves[next] ?? null);
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
        focusRow(enabledLeaves[0] ?? null);
        break;
      case "End":
        event.preventDefault();
        focusRow(enabledLeaves[enabledLeaves.length - 1] ?? null);
        break;
      case " ":
      case "Enter": {
        event.preventDefault();
        const node = activeValue ? nodeMap.get(activeValue) : void 0;
        if (node && !(disabled || readOnly || node.disabled)) selectLeaf(node);
        break;
      }
      default: {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          typeToFocus(event.key);
        }
      }
    }
  };
  const onSearchKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusRow(enabledLeaves[0] ?? null);
    }
  };
  const renderNode = (node, depth, ancestorHasNextSibling, isLast, posinset, setsize) => {
    const source = nodeMap.get(node.value) ?? node;
    const leaf = isLeaf(source);
    const selected = leaf && value === node.value;
    const nodeDisabled = disabled || node.disabled;
    const rowTestId = node.testId ?? `item-${node.value}`;
    const rails = depth > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
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
    ] });
    const label2 = /* @__PURE__ */ jsx("span", { className: cn("ms-1.5 min-w-0 flex-1 truncate text-start", classNames?.label), children: node.label });
    const content = renderItem ? renderItem(node, { selected, leaf, disabled: !!nodeDisabled, depth }) : leaf ? /* @__PURE__ */ jsxs(Fragment, { children: [
      label2,
      selected && /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: popoverIndicator, children: /* @__PURE__ */ jsx(CheckIcon, {}) })
    ] }) : label2;
    return /* @__PURE__ */ jsxs(Fragment$1, { children: [
      leaf ? (
        // biome-ignore lint/a11y/useKeyWithClickEvents: row activation (Enter/Space) is handled centrally by the tree container's onKeyDown via roving focus, not co-located per row.
        /* @__PURE__ */ jsxs(
          "div",
          {
            role: "treeitem",
            "aria-level": depth + 1,
            "aria-setsize": setsize,
            "aria-posinset": posinset,
            "aria-selected": selected,
            "aria-disabled": nodeDisabled || void 0,
            "data-active": node.value === activeValue || void 0,
            "data-disabled": nodeDisabled || void 0,
            "data-testid": rowTestId,
            tabIndex: node.value === activeValue ? 0 : -1,
            ref: (el) => registerRow(node.value, el),
            onClick: () => {
              if (nodeDisabled || readOnly) return;
              setActiveValue(node.value);
              selectLeaf(source);
            },
            className: cn(
              treeRow({ size }),
              treeLeafRow,
              selected && "font-medium",
              classNames?.node
            ),
            children: [
              rails,
              content
            ]
          }
        )
      ) : (
        // Present as a treeitem for well-formed levels; `tabIndex={-1}` keeps it
        // out of the tab order, and roving focus + arrow nav stay on leaves.
        /* @__PURE__ */ jsxs(
          "div",
          {
            role: "treeitem",
            "aria-level": depth + 1,
            "aria-expanded": true,
            "aria-setsize": setsize,
            "aria-posinset": posinset,
            "aria-disabled": nodeDisabled || void 0,
            "data-testid": rowTestId,
            tabIndex: -1,
            className: cn(treeRow({ size }), treeBranchRow, classNames?.node),
            children: [
              rails,
              content
            ]
          }
        )
      ),
      node.children?.map(
        (child, i) => renderNode(
          child,
          depth + 1,
          depth === 0 ? [] : [...ancestorHasNextSibling, !isLast],
          i === (node.children?.length ?? 0) - 1,
          i + 1,
          node.children?.length ?? 0
        )
      )
    ] }, node.value);
  };
  const showClear = clearable && value != null && !disabled && !readOnly;
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
              "cursor-pointer",
              className,
              classNames?.trigger
            ),
            children: [
              startSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: startSlot }),
              /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-start", children: value != null ? labelMap.get(value) ?? value : /* @__PURE__ */ jsx("span", { className: placeholderColor, children: placeholder }) }),
              endSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, children: endSlot }),
              showClear && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Clear",
                  onPointerDown: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  },
                  onClick: (event) => {
                    event.stopPropagation();
                    setValue(null);
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
                  i === filteredData.length - 1,
                  i + 1,
                  filteredData.length
                )
              )
            }
          ) })
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

export { TreeSelect };
