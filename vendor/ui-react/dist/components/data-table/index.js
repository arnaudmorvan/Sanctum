"use client";
import { Text } from '../../chunk-3XYZZCLG.js';
import { ThemeIcon } from '../../chunk-45ETEPFR.js';
import { Tooltip } from '../../chunk-WHYIEJSW.js';
import { Select } from '../../chunk-2VJSGBF4.js';
import { Skeleton } from '../../chunk-FDEXXP6V.js';
import { Table } from '../../chunk-HQ4BBARF.js';
import '../../chunk-BJZLQTAZ.js';
import { Root, Trigger, Content, CheckboxItem } from '../../chunk-MZ5E3U67.js';
import '../../chunk-G52U24GR.js';
import { MultiComboboxList } from '../../chunk-NGRFKXI4.js';
import { Pill } from '../../chunk-3YVX2KOL.js';
import '../../chunk-R5GMMWAY.js';
import '../../chunk-FMMKEYHB.js';
import { Flex } from '../../chunk-NPQBNCCM.js';
import { ComboboxList } from '../../chunk-P6JKYA6H.js';
import { serializeDateValue, DatePicker } from '../../chunk-WN767DZB.js';
import { resolveHourCycle } from '../../chunk-PVLZ5P54.js';
import '../../chunk-XONFFMYI.js';
import { NumberInput } from '../../chunk-4NXCBDHI.js';
import '../../chunk-ORTCK34Y.js';
import { Button } from '../../chunk-GHV47RCM.js';
import { resolveCalendarTranslations } from '../../chunk-F36B6WYQ.js';
import { Card } from '../../chunk-IVVT4DJF.js';
import '../../chunk-SKPM2FRX.js';
import { Checkbox } from '../../chunk-4LQC3ZBV.js';
import '../../chunk-Q7RNQGYE.js';
import '../../chunk-C7V53TG4.js';
import { Drawer } from '../../chunk-GHSRENN6.js';
import '../../chunk-UVYTJQTJ.js';
import { ActionIcon } from '../../chunk-3KHUHVCD.js';
import '../../chunk-RNXO7W2J.js';
import '../../chunk-TWGCWKRV.js';
import '../../chunk-RDMZUUZQ.js';
import '../../chunk-5FDOOG4J.js';
import { Popover } from '../../chunk-PRHZ6FHV.js';
import { Input } from '../../chunk-MWXEQ5QX.js';
import '../../chunk-AL57HMNZ.js';
import '../../chunk-IG7FBZVM.js';
import { useUncontrolled } from '../../chunk-BEL75C7N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { useReactTable, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
export { createColumnHelper } from '@tanstack/react-table';
import { useMemo, useRef, useState, useEffect } from 'react';
import { match, P } from 'ts-pattern';
import { useLocaleContext } from '@ark-ui/react/locale';
import { getLocalTimeZone, parseDateTime, parseDate } from '@internationalized/date';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { ServerCrashIcon, RotateCwIcon, SearchAlertIcon, EraserIcon, ChevronLeft, ChevronRight, Search, Columns3CogIcon, ListFilterIcon, ChevronsUpDownIcon, ChevronDownIcon, ChevronUpIcon, ArrowUpToLineIcon, ArrowDownToLineIcon } from 'lucide-react';
import { cva } from 'class-variance-authority';

var toDateBounds = (value) => {
  if (!value) return ["", ""];
  if (value.op === "between") return [value.from ?? "", value.to ?? ""];
  if (value.op === "lt" || value.op === "lte") return ["", value.date ?? ""];
  return [value.date ?? "", ""];
};
var parseBound = (raw, withTime) => withTime ? parseDateTime(raw) : parseDate(raw);
var toArkBounds = (from, to, withTime) => {
  const values = [];
  if (from) values.push(parseBound(from, withTime));
  if (to) values.push(parseBound(to, withTime));
  return values;
};
var NUM_OF_MONTHS = 2;
var DateFilterPopover = ({
  bounds: [from, to],
  withTime,
  presets,
  timeZone: timeZoneProp,
  translations,
  onCommit,
  onClose
}) => {
  const { locale } = useLocaleContext();
  const timeZone = timeZoneProp ?? getLocalTimeZone();
  const hourCycle = resolveHourCycle({ locale });
  return /* @__PURE__ */ jsx(
    DatePicker.Root,
    {
      inline: true,
      selectionMode: "range",
      locale,
      timeZone,
      translations: resolveCalendarTranslations(translations),
      numOfMonths: NUM_OF_MONTHS,
      value: toArkBounds(from, to, withTime),
      onValueChange: (details) => {
        onCommit(details.value);
        if (details.value.length !== 1) onClose?.();
      },
      children: /* @__PURE__ */ jsx(DatePicker.Context, { children: (api) => /* @__PURE__ */ jsxs(DatePicker.Content, { className: "flex flex-row flex-wrap items-stretch", children: [
        presets && /* @__PURE__ */ jsx(
          DatePicker.Presets,
          {
            presets,
            range: true,
            timeZone,
            translations: translations?.presets
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
          /* @__PURE__ */ jsx(DatePicker.Calendar, { numOfMonths: NUM_OF_MONTHS, size: "sm", timeZone }),
          withTime && /* @__PURE__ */ jsxs(DatePicker.Footer, { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsx(
              DatePicker.TimePanelRow,
              {
                value: api.value[0],
                onSetTime: (time) => api.setTime(time, 0),
                label: translations?.fromTime ?? "From time",
                hourCycle,
                locale,
                translations,
                size: "sm"
              }
            ),
            /* @__PURE__ */ jsx(
              DatePicker.TimePanelRow,
              {
                value: api.value[1],
                onSetTime: (time) => api.setTime(time, 1),
                label: translations?.toTime ?? "To time",
                disabled: api.value.length < 2,
                hourCycle,
                locale,
                translations,
                size: "sm"
              }
            )
          ] }),
          api.value.length > 0 && /* @__PURE__ */ jsx(DatePicker.Footer, { className: "flex justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => api.clearValue(),
              className: cn(
                "cursor-pointer rounded-xs px-2 py-1 text-sm transition-colors",
                "text-gray-light-500 hover:text-gray-light-900 dark:text-gray-dark-400 dark:hover:text-gray-dark-100"
              ),
              children: translations?.clear ?? "Clear"
            }
          ) })
        ] })
      ] }) })
    }
  );
};
var DateFilter = ({
  column,
  withTime,
  presets,
  timeZone,
  translations,
  onClose
}) => {
  const bounds = toDateBounds(column.getFilterValue());
  return /* @__PURE__ */ jsx(
    DateFilterPopover,
    {
      bounds,
      withTime,
      presets,
      timeZone,
      translations,
      onClose,
      onCommit: (values) => {
        const [start, end] = values;
        if (!start) return column.setFilterValue(void 0);
        if (!end)
          return column.setFilterValue({
            op: "gte",
            date: serializeDateValue(start, Boolean(withTime))
          });
        return column.setFilterValue({
          op: "between",
          from: serializeDateValue(start, Boolean(withTime)),
          to: serializeDateValue(end, Boolean(withTime))
        });
      }
    }
  );
};
var DateRangeFilter = ({
  column,
  withTime,
  presets,
  timeZone,
  translations,
  onClose
}) => {
  const value = column.getFilterValue() ?? { from: null, to: null };
  return /* @__PURE__ */ jsx(
    DateFilterPopover,
    {
      bounds: [value.from ?? "", value.to ?? ""],
      withTime,
      presets,
      timeZone,
      translations,
      onClose,
      onCommit: (values) => {
        const [start, end] = values;
        if (!start && !end) return column.setFilterValue(void 0);
        column.setFilterValue({
          from: start ? serializeDateValue(start, Boolean(withTime)) : null,
          to: end ? serializeDateValue(end, Boolean(withTime)) : null
        });
      }
    }
  );
};

// src/components/data-table/data-table-filter/utils.ts
var NUMBER_OP_COMPARE = {
  eq: (left, right) => left === right,
  gt: (left, right) => left > right,
  gte: (left, right) => left >= right,
  lt: (left, right) => left < right,
  lte: (left, right) => left <= right
};
var getNumberFilterValue = (column) => column.getFilterValue();
var setNumberFilterValue = (column, value) => {
  column.setFilterValue(value);
};
var parseDateValue = (value) => {
  if (value == null) return null;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};
var DAY_MS = 24 * 60 * 60 * 1e3;
var dateOpMatches = (op, rowTime, filterTime, withTime) => {
  if (withTime) {
    return op === "eq" ? rowTime === filterTime : op === "gt" ? rowTime > filterTime : op === "gte" ? rowTime >= filterTime : op === "lt" ? rowTime < filterTime : rowTime <= filterTime;
  }
  const dayEnd = filterTime + DAY_MS - 1;
  return op === "eq" ? rowTime >= filterTime && rowTime <= dayEnd : op === "gt" ? rowTime > dayEnd : op === "gte" ? rowTime >= filterTime : op === "lt" ? rowTime < filterTime : rowTime <= dayEnd;
};
var toBounds = (filter) => {
  if (!filter) return [null, null];
  if (filter.op === "between") return [filter.min, filter.max];
  if (filter.op === "lt" || filter.op === "lte") return [null, filter.value];
  return [filter.value, null];
};
var NumberFilter = ({
  column,
  min,
  max
}) => {
  const [lo, hi] = toBounds(getNumberFilterValue(column));
  const commit = (nextLo, nextHi) => {
    if (nextLo == null && nextHi == null) {
      setNumberFilterValue(column, void 0);
    } else if (nextLo != null && nextHi != null) {
      setNumberFilterValue(column, { op: "between", min: nextLo, max: nextHi });
    } else {
      setNumberFilterValue(
        column,
        nextLo != null ? { op: "gte", value: nextLo } : { op: "lte", value: nextHi }
      );
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-1", children: [
    /* @__PURE__ */ jsx(
      NumberInput,
      {
        size: "sm",
        placeholder: "Max",
        testId: "number-filter-max",
        min,
        max,
        value: hi,
        clearable: true,
        startSlot: /* @__PURE__ */ jsx(ArrowUpToLineIcon, {}),
        onChange: (next) => commit(lo, next)
      }
    ),
    /* @__PURE__ */ jsx(
      NumberInput,
      {
        size: "sm",
        placeholder: "Min",
        testId: "number-filter-min",
        min,
        max,
        value: lo,
        clearable: true,
        startSlot: /* @__PURE__ */ jsx(ArrowDownToLineIcon, {}),
        onChange: (next) => commit(next, hi)
      }
    )
  ] });
};
var SelectFilter = ({
  column,
  options,
  multiple,
  renderItem,
  onClose
}) => multiple ? /* @__PURE__ */ jsx(
  MultiComboboxList,
  {
    size: "sm",
    data: options,
    clearable: true,
    renderItem,
    value: column.getFilterValue() ?? [],
    onChange: (value) => column.setFilterValue(value.length > 0 ? value : void 0)
  }
) : /* @__PURE__ */ jsx(
  ComboboxList,
  {
    size: "sm",
    data: options,
    clearable: true,
    renderItem,
    value: column.getFilterValue() ?? null,
    onChange: (value) => {
      column.setFilterValue(value ?? void 0);
      onClose?.();
    }
  }
);
function useDebouncedCommit(value, delay, onCommit) {
  const [local, setLocal] = useState(value);
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;
  const isMount = useRef(true);
  useEffect(() => setLocal(value), [value]);
  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      return;
    }
    const id = setTimeout(() => onCommitRef.current(local), delay);
    return () => clearTimeout(id);
  }, [local, delay]);
  return [local, setLocal];
}
var TextFilter = ({
  column,
  placeholder,
  debounce = 300
}) => {
  const committed = column.getFilterValue() ?? "";
  const [value, setValue] = useDebouncedCommit(
    committed,
    debounce,
    (next) => column.setFilterValue(next || void 0)
  );
  return /* @__PURE__ */ jsx(
    Input,
    {
      size: "sm",
      autoFocus: true,
      placeholder,
      value,
      onChange: (e) => setValue(e.target.value)
    }
  );
};
var resolveFilterFn = (filter) => match(filter).with(
  { type: "text" },
  () => (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return value != null && String(value).toLowerCase().includes(String(filterValue).toLowerCase());
  }
).with(
  { type: "select" },
  (f) => f.multiple ? (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return value != null && filterValue.some((v) => String(v).toLowerCase() === String(value).toLowerCase());
  } : (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return value != null && String(value).toLowerCase() === String(filterValue).toLowerCase();
  }
).with(
  { type: "number" },
  () => (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);
    if (typeof rowValue !== "number" || !Number.isFinite(rowValue)) {
      return false;
    }
    return match(filterValue).with(P.nullish, () => true).with({ op: "between" }, ({ min, max }) => {
      return (min == null || rowValue >= min) && (max == null || rowValue <= max);
    }).with(
      { op: P.union("eq", "gt", "gte", "lt", "lte") },
      ({ op, value }) => value != null && NUMBER_OP_COMPARE[op](rowValue, value)
    ).exhaustive();
  }
).with(
  { type: "date" },
  (f) => (row, columnId, filterValue) => {
    const rowTime = parseDateValue(row.getValue(columnId));
    if (rowTime == null) return false;
    return match(filterValue).with(P.nullish, () => true).with({ op: "between" }, ({ from, to }) => {
      const fromTime = from != null ? parseDateValue(from) : null;
      const toTime = to != null ? parseDateValue(to) : null;
      if (fromTime != null && rowTime < fromTime) return false;
      if (toTime != null && rowTime > (f.withTime ? toTime : toTime + DAY_MS - 1))
        return false;
      return true;
    }).with({ op: P.union("eq", "gt", "gte", "lt", "lte") }, ({ op, date }) => {
      const filterTime = date != null ? parseDateValue(date) : null;
      return filterTime != null && dateOpMatches(op, rowTime, filterTime, f.withTime);
    }).exhaustive();
  }
).with(
  { type: "date-range" },
  (f) => (row, columnId, filterValue) => {
    const rowTime = parseDateValue(row.getValue(columnId));
    if (rowTime == null) return false;
    if (filterValue.from != null) {
      const from = parseDateValue(filterValue.from);
      if (from != null && rowTime < from) return false;
    }
    if (filterValue.to != null) {
      const to = parseDateValue(filterValue.to);
      if (to != null && rowTime > (f.withTime ? to : to + DAY_MS - 1)) return false;
    }
    return true;
  }
).exhaustive();
var hasActiveFilterValue = (value) => {
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.some((v) => v != null && v !== "");
  if (typeof value === "object")
    return Object.values(value).some((v) => v != null && v !== "");
  return true;
};
var DataTableFilterControl = ({
  column,
  filter,
  onClose
}) => match(filter).with({ type: "text" }, (f) => /* @__PURE__ */ jsx(TextFilter, { column, placeholder: f.placeholder, debounce: f.debounce })).with({ type: "select" }, (f) => /* @__PURE__ */ jsx(
  SelectFilter,
  {
    column,
    options: f.options,
    multiple: f.multiple,
    renderItem: f.renderItem,
    onClose
  }
)).with({ type: "number" }, (f) => /* @__PURE__ */ jsx(NumberFilter, { column, min: f.min, max: f.max })).with({ type: "date" }, (f) => /* @__PURE__ */ jsx(
  DateFilter,
  {
    column,
    withTime: f.withTime,
    presets: f.presets,
    timeZone: f.timeZone,
    translations: f.translations,
    onClose
  }
)).with({ type: "date-range" }, (f) => /* @__PURE__ */ jsx(
  DateRangeFilter,
  {
    column,
    withTime: f.withTime,
    presets: f.presets,
    timeZone: f.timeZone,
    translations: f.translations,
    onClose
  }
)).exhaustive();
var RESIZE_STEP = 5;
var SORT_LOOKUP = {
  asc: {
    icon: ChevronUpIcon,
    label: "ascending"
  },
  desc: {
    icon: ChevronDownIcon,
    label: "descending"
  },
  none: {
    icon: ChevronsUpDownIcon,
    label: "none"
  }
};
var columnLabel = (column) => {
  if (column.columnDef.meta?.label) return column.columnDef.meta.label;
  return typeof column.columnDef.header === "string" ? column.columnDef.header : column.id;
};
var renderColumnHeader = (header, mode) => flexRender(header.column.columnDef.header, { ...header.getContext(), mode });
var tableHeaderCell = cva(["flex items-center gap-3"], {
  variants: {
    align: {
      center: "justify-center",
      start: "justify-start",
      end: "justify-end"
    }
  }
});
function DataTableHeaderCell({
  header,
  truncate = true
}) {
  const { column } = header;
  const canSort = column.getCanSort();
  const align = column.columnDef.meta?.align ?? "start";
  const filter = column.columnDef.meta?.filter;
  const label = renderColumnHeader(header, "table");
  const ariaLabel = columnLabel(column);
  const labelClassName = cn(
    truncate && "shrink-0 truncate",
    "flex flex-row justify-center align-center"
  );
  return /* @__PURE__ */ jsxs("div", { className: tableHeaderCell({ align }), children: [
    canSort ? /* @__PURE__ */ jsx(DataTablerHeaderSort, { column, label: ariaLabel, labelClassName, children: label }) : /* @__PURE__ */ jsx("span", { className: labelClassName, children: label }),
    filter ? /* @__PURE__ */ jsx(DataTableHeaderFilter, { column, filter, label: ariaLabel }) : null
  ] });
}
function DataTableColumnResizeHandle({
  header
}) {
  const { column } = header;
  const ref = useRef(null);
  const label = columnLabel(column);
  const minSize = column.columnDef.minSize ?? 20;
  const maxSize = column.columnDef.maxSize ?? Number.MAX_SAFE_INTEGER;
  const handleKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = match({
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      key: event.key
    }).with(
      { shiftKey: true, altKey: false },
      ({ key }) => (
        /* Normal resize*/
        (key === "ArrowRight" ? RESIZE_STEP : -RESIZE_STEP) * 10
      )
    ).with({ altKey: true, shiftKey: false }, ({ key }) => key === "ArrowRight" ? 1 : -1).otherwise(
      ({ key }) => (
        /* Normal resize*/
        key === "ArrowRight" ? RESIZE_STEP : -RESIZE_STEP
      )
    );
    ref.current?.focus({ focusVisible: true });
    const nextSize = Math.min(maxSize, Math.max(minSize, header.getSize() + delta));
    header.getContext().table.setColumnSizing((old) => ({ ...old, [column.id]: nextSize }));
  };
  return (
    // biome-ignore lint/a11y/useSemanticElements: ARIA "window splitter" pattern (a focusable, draggable divider) — `<hr>` can't hold a resize interaction
    /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        onKeyDown: handleKeyDown,
        role: "separator",
        "aria-orientation": "vertical",
        "aria-label": `Resize ${label} column`,
        "aria-valuenow": header.getSize(),
        "aria-valuemin": minSize,
        "aria-valuemax": maxSize === Number.MAX_SAFE_INTEGER ? void 0 : maxSize,
        tabIndex: 0,
        className: cn(
          "absolute inset-y-0 -inset-e-1.5 z-10 w-3 cursor-col-resize touch-none select-none",
          "before:absolute before:inset-y-1 before:inset-s-1/2 before:-translate-x-1/2 before:w-px before:bg-brand-900/20 dark:before:bg-white/15 before:rounded-full",
          "after:absolute after:inset-x-1/2 after:-translate-x-1/2 after:top-1/2 after:-translate-y-1/2 after:transparent after:w-1 after:h-3 after:rounded-full",
          "hover:before:bg-brand-900/40 dark:hover:before:bg-white/30 before:transition-colors",
          "hover:after:bg-(--c-solid) focus-visible:after:bg-(--c-solid) after:transition-colors",
          // Matches thead's own brand-950 fill, not gray-dark-900 — the ring
          // gap this offset simulates has to blend with the real background.
          "after:ring-offset-1 dark:after:ring-offset-brand-950",
          "focus-visible:outline-none focus-visible:after:ring-(--c-solid) focus-visible:after:ring-1 focus-visible:before:bg-(--c-solid)/50",
          column.getIsResizing() && "after:bg-(--c-solid) before:bg-brand-900/40 dark:before:bg-white/30"
        )
      }
    )
  );
}
function DataTablerHeaderSort({
  column,
  label,
  labelClassName,
  children
}) {
  const sort = column.getIsSorted() || "none";
  const { icon: Icon, label: mode } = SORT_LOOKUP[sort];
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: column.getToggleSortingHandler(),
      className: cn(
        "group",
        "transition-colors rounded-xxs truncate",
        "inline-flex min-w-0 cursor-pointer items-center gap-1 font-medium select-none hover:text-gray-light-950 dark:hover:text-gray-dark-50",
        "focus-visible:ring-1 focus-visible:ring-offset-3 dark:focus-visible:ring-offset-brand-950 focus-visible:ring-brand-500 outline-0"
      ),
      "aria-label": `Sort ${label} (${mode})`,
      children: [
        /* @__PURE__ */ jsx("span", { className: cn("truncate", labelClassName), children }),
        /* @__PURE__ */ jsx(
          Icon,
          {
            "aria-hidden": "true",
            className: cn(
              "size-3.5 shrink-0 transition-colors",
              "text-gray-light-400 dark:text-gray-dark-500 group-hover:text-gray-light-950 dark:group-hover:text-gray-dark-50"
            )
          }
        )
      ]
    }
  );
}
function DataTableHeaderFilter({
  column,
  filter,
  label
}) {
  const active = hasActiveFilterValue(column.getFilterValue());
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(
    Popover.Root,
    {
      width: "auto",
      position: "bottom-start",
      offset: {
        mainAxis: 14,
        crossAxis: -10
      },
      open,
      onOpenChange: (details) => setOpen(details.open),
      children: [
        /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: cn(
              "transition-colors rounded-xxs size-4 shrink-0",
              "inline-flex cursor-pointer items-center gap-1 font-medium select-none hover:text-gray-light-950 dark:hover:text-gray-dark-50",
              "text-gray-light-400 dark:text-gray-dark-500",
              "focus-visible:ring-1 focus-visible:ring-offset-3 dark:focus-visible:ring-offset-brand-950 focus-visible:ring-brand-500 outline-0",
              {
                "relative before:absolute before:-top-0.5 before:-inset-e-0.5 before:size-1 before:rounded-full dark:before:bg-gray-dark-50 before:bg-gray-light-950": active
              }
            ),
            "aria-label": active ? `Filter ${label} (active)` : `Filter ${label}`,
            children: /* @__PURE__ */ jsx(ListFilterIcon, {})
          }
        ) }),
        /* @__PURE__ */ jsx(Popover.Content, { className: "min-w-48", children: /* @__PURE__ */ jsx(Popover.Body, { className: "overflow-visible p-0", children: /* @__PURE__ */ jsx(DataTableFilterControl, { column, filter, onClose: () => setOpen(false) }) }) })
      ]
    }
  );
}
var DEFAULT_TRANSLATIONS = {
  rows: "Rows per page",
  items: ({ totalKnown, from, hits, to }) => totalKnown ? `${from} to ${to} of ${hits}` : `${from} to ${to}`,
  previousPage: "Previous page",
  nextPage: "Next page"
};
function DataTablePagination({
  table,
  pageSizeOptions = [10, 20, 50],
  hasNextPage,
  className,
  translations: translationsProp,
  paginationMode = "page"
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalKnown = pageCount >= 0;
  const rowsOnPage = table.getRowModel().rows.length;
  const canPrevious = table.getCanPreviousPage();
  const canNext = totalKnown ? table.getCanNextPage() : hasNextPage ?? rowsOnPage >= pageSize;
  const translations = { ...DEFAULT_TRANSLATIONS, ...translationsProp };
  const rowCount = table.getRowCount();
  const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = pageIndex * pageSize + rowsOnPage;
  const sizeOptions = pageSizeOptions.includes(pageSize) ? pageSizeOptions : [...pageSizeOptions, pageSize].sort((a, b) => a - b);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        // Same brand-tinted fill as thead/tfoot — this is Table's third
        // chrome band (it renders inside the same container), not a separate
        // opaque surface.
        "bg-brand-50/90 dark:bg-brand-950/85",
        "flex shrink-0 items-center justify-between gap-2 border-t border-brand-900/20 px-4 py-3 dark:border-white/15",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-3 justify-center items-center", children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              size: "sm",
              label: translations.rows,
              classNames: { label: "sr-only" },
              data: sizeOptions.map(String),
              value: String(pageSize),
              onChange: (value) => value && table.setPageSize(Number(value)),
              disabled: sizeOptions.length <= 1,
              className: "w-24"
            }
          ),
          /* @__PURE__ */ jsx(Text, { size: "sm", c: "muted", children: translations.rows })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            ActionIcon,
            {
              variant: "subtle",
              size: "sm",
              "aria-label": translations.previousPage,
              disabled: !canPrevious,
              onClick: () => table.previousPage(),
              children: /* @__PURE__ */ jsx(ChevronLeft, {})
            }
          ),
          paginationMode === "rows" ? /* @__PURE__ */ jsx(Tooltip, { label: pageIndex + 1, children: /* @__PURE__ */ jsx(Text, { size: "sm", c: "muted", role: "status", children: translations.items({ hits: rowCount, from, to, totalKnown }) }) }) : /* @__PURE__ */ jsx(Tooltip, { label: translations.items({ hits: rowCount, from, to, totalKnown }), children: /* @__PURE__ */ jsx(Text, { size: "sm", c: "muted", children: pageIndex + 1 }) }),
          /* @__PURE__ */ jsx(
            ActionIcon,
            {
              variant: "subtle",
              size: "sm",
              "aria-label": translations.nextPage,
              disabled: !canNext,
              onClick: () => table.nextPage(),
              children: /* @__PURE__ */ jsx(ChevronRight, {})
            }
          )
        ] })
      ]
    }
  );
}
function RenderPlaceholder({
  node,
  defaultActions
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "flex flex-col gap-3 [&_data-title]:text-gray-light-900 dark:[&_data-title]:text-gray-dark-100",
        "**:data-desc:text-gray-light-400 dark:**:data-desc:text-gray-dark-500"
      ),
      children: match(node).when(
        (n) => !!(n && typeof n === "object" && "title" in n),
        ({ title, description, actions }) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { "data-title": true, children: title }),
            description && /* @__PURE__ */ jsx("span", { "data-desc": true, children: description })
          ] }),
          (actions || defaultActions) && /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-1 justify-center items-center", children: actions ?? defaultActions })
        ] })
      ).otherwise((n) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { "data-title": true, children: n }),
        defaultActions && /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-1 justify-center items-center", children: defaultActions })
      ] }))
    }
  );
}
function DataTableStackedRows({
  rows,
  view,
  error,
  refetching,
  empty,
  onRowClick,
  isInteractiveTarget: isInteractiveTarget2,
  onRetry,
  table,
  className,
  skeletonRowCount
}) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto p-3", className), children: match(view).with("error", () => /* @__PURE__ */ jsxs(
    "div",
    {
      role: "alert",
      className: "flex flex-col gap-3 items-center justify-center py-6 text-center min-h-48.5",
      children: [
        /* @__PURE__ */ jsx(ThemeIcon, { children: /* @__PURE__ */ jsx(ServerCrashIcon, {}) }),
        /* @__PURE__ */ jsx(
          RenderPlaceholder,
          {
            node: error,
            defaultActions: onRetry && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "light",
                color: "gray",
                size: "sm",
                startSlot: /* @__PURE__ */ jsx(RotateCwIcon, {}),
                onClick: onRetry,
                children: "Retry"
              }
            )
          }
        )
      ]
    }
  )).with(
    "loading",
    () => Array.from({ length: skeletonRowCount }).map((_, cardIndex) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: placeholder cards, no identity
      /* @__PURE__ */ jsx(Card, { padding: "sm", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Flex, { direction: "col", gap: "xs", children: table.getVisibleLeafColumns().slice(0, 4).map((column) => /* @__PURE__ */ jsx("div", { children: column.columnDef.meta?.skeleton ?? /* @__PURE__ */ jsx(Skeleton, { shape: "rectangular", size: "md", className: "w-full" }) }, column.id)) }) }, `skeleton-${cardIndex}`)
    ))
  ).with("empty", () => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 items-center justify-center py-6 text-center min-h-48.5", children: [
    /* @__PURE__ */ jsx(ThemeIcon, { children: /* @__PURE__ */ jsx(SearchAlertIcon, {}) }),
    /* @__PURE__ */ jsx(
      RenderPlaceholder,
      {
        node: empty,
        defaultActions: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "light",
            color: "gray",
            size: "sm",
            startSlot: /* @__PURE__ */ jsx(EraserIcon, {}),
            onClick: () => table.resetColumnFilters(),
            children: "Clear filters"
          }
        )
      }
    )
  ] })).with("items", () => {
    const headersByColumnId = new Map(
      table.getFlatHeaders().map((header) => [header.column.id, header])
    );
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "flex flex-col gap-2",
          refetching && "pointer-events-none opacity-60 transition-opacity"
        ),
        children: rows.map((row) => /* @__PURE__ */ jsx(
          Card,
          {
            padding: "sm",
            className: cn(
              "transition-colors",
              // Same black/white wash convention as Table's row hover/
              // DataTable's row selection, instead of a fixed per-theme gray.
              "hover:bg-black/5 dark:hover:bg-white/8",
              "data-[selected=true]:bg-black/8 dark:data-[selected=true]:bg-white/16",
              onRowClick && "cursor-pointer"
            ),
            ...props({ "data-selected": row.getIsSelected() }),
            onClick: onRowClick ? (event) => {
              if (!isInteractiveTarget2(event.target)) onRowClick(row.original);
            } : void 0,
            children: /* @__PURE__ */ jsx(Flex, { direction: "col", gap: "xs", children: row.getVisibleCells().map((cell) => {
              const header = headersByColumnId.get(cell.column.id);
              return /* @__PURE__ */ jsxs(Flex, { justify: "between", gap: "sm", children: [
                /* @__PURE__ */ jsx(Text, { size: "xs", c: "muted", children: header ? renderColumnHeader(header, "stack") : columnLabel(cell.column) }),
                /* @__PURE__ */ jsx("div", { children: flexRender(cell.column.columnDef.cell, cell.getContext()) })
              ] }, cell.id);
            }) })
          },
          row.id
        ))
      }
    );
  }).exhaustive() });
}
function DataTableStackOptions({
  table,
  enableColumnVisibility,
  className
}) {
  const [open, setOpen] = useState(false);
  const visibleColumns = table.getVisibleLeafColumns();
  const sortableColumns = visibleColumns.filter((column) => column.getCanSort());
  const filterableColumns = visibleColumns.filter((column) => column.columnDef.meta?.filter != null);
  if (sortableColumns.length === 0 && filterableColumns.length === 0 && !enableColumnVisibility) {
    return null;
  }
  const activeFilterCount = filterableColumns.filter(
    (column) => hasActiveFilterValue(column.getFilterValue())
  ).length;
  const activeSortCount = sortableColumns.filter((column) => column.getIsSorted()).length;
  const isSorted = table.getState().sorting.length > 0;
  const activeCount = activeFilterCount + (isSorted ? 1 : 0);
  return /* @__PURE__ */ jsxs("div", { className: cn("shrink-0 px-3 pt-3", className), children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "light",
        color: "gray",
        size: "sm",
        className: "w-full justify-between",
        startSlot: /* @__PURE__ */ jsx(ListFilterIcon, {}),
        endSlot: activeCount > 0 ? /* @__PURE__ */ jsx(Pill, { size: "xs", children: activeCount }) : void 0,
        onClick: () => setOpen(true),
        "aria-label": activeCount > 0 ? `Table options (${activeCount} active)` : "Table options",
        children: "Table options"
      }
    ),
    /* @__PURE__ */ jsx(
      Drawer,
      {
        placement: "bottom",
        withGrabber: true,
        size: "lg",
        title: "Table options",
        open,
        onOpenChange: setOpen,
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          enableColumnVisibility && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxs(Text, { size: "xs", c: "muted", className: "uppercase tracking-wide", children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "// " }),
              "Columns"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: table.getAllLeafColumns().filter((column) => !column.columnDef.meta?.hideFromMenu).map((column) => /* @__PURE__ */ jsx(
              Checkbox,
              {
                size: "sm",
                checked: column.getIsVisible(),
                disabled: !column.getCanHide(),
                onCheckedChange: () => column.toggleVisibility(),
                label: columnLabel(column)
              },
              column.id
            )) })
          ] }),
          sortableColumns.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("hr", { className: "mt-6 mb-2 border-0 border-t border-brand-900/20 dark:border-white/15" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs(Text, { size: "xs", c: "muted", className: "uppercase tracking-wide", children: [
                  /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "// " }),
                  "Sort by"
                ] }),
                activeSortCount > 0 ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => table.resetSorting(),
                    className: "text-xs font-medium text-gray-light-500 hover:text-gray-light-900 dark:text-gray-dark-400 dark:hover:text-gray-dark-100",
                    children: "Clear sorts"
                  }
                ) : null
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-0.5", children: sortableColumns.map((column) => {
                const sort = column.getIsSorted() || "none";
                const { icon: Icon, label: mode } = SORT_LOOKUP[sort];
                const label = columnLabel(column);
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: column.getToggleSortingHandler(),
                    className: "flex items-center justify-start gap-2 rounded-md py-1.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/8",
                    "aria-label": `Sort ${label} (${mode})`,
                    children: [
                      /* @__PURE__ */ jsx(
                        Icon,
                        {
                          "aria-hidden": "true",
                          className: "size-4 shrink-0 text-gray-light-400 dark:text-gray-dark-500"
                        }
                      ),
                      label
                    ]
                  },
                  column.id
                );
              }) })
            ] })
          ] }),
          filterableColumns.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            (sortableColumns.length > 0 || enableColumnVisibility) && /* @__PURE__ */ jsx("hr", { className: "mt-6 mb-2 border-0 border-t border-brand-900/20 dark:border-white/15" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs(Text, { size: "xs", c: "muted", className: "uppercase tracking-wide", children: [
                  /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "// " }),
                  "Filters"
                ] }),
                activeFilterCount > 0 ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => table.resetColumnFilters(),
                    className: "text-xs font-medium text-gray-light-500 hover:text-gray-light-900 dark:text-gray-dark-400 dark:hover:text-gray-dark-100",
                    children: "Clear filters"
                  }
                ) : null
              ] }),
              filterableColumns.map((column) => {
                const filter = column.columnDef.meta?.filter;
                if (!filter) return null;
                return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx(Text, { size: "xs", className: "font-medium", children: columnLabel(column) }),
                  /* @__PURE__ */ jsx(DataTableFilterControl, { column, filter })
                ] }, column.id);
              })
            ] })
          ] })
        ] })
      }
    )
  ] });
}
function DataTableGlobalFilter({
  value,
  onChange,
  placeholder = "Search\u2026",
  debounce = 300
}) {
  const [local, setLocal] = useDebouncedCommit(value, debounce, onChange);
  return /* @__PURE__ */ jsx(
    Input,
    {
      size: "sm",
      placeholder,
      startSlot: /* @__PURE__ */ jsx(Search, { className: "size-4" }),
      value: local,
      onChange: (e) => setLocal(e.target.value),
      className: "max-w-64"
    }
  );
}
function DataTableColumnVisibilityMenu({
  table,
  className
}) {
  const columns = table.getAllLeafColumns().filter((column) => !column.columnDef.meta?.hideFromMenu);
  return /* @__PURE__ */ jsxs(Root, { closeOnSelect: false, position: "bottom-end", children: [
    /* @__PURE__ */ jsx(Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
      ActionIcon,
      {
        variant: "subtle",
        color: "gray",
        size: "sm",
        "aria-label": "Toggle column visibility",
        className,
        children: /* @__PURE__ */ jsx(Columns3CogIcon, { strokeWidth: 1 })
      }
    ) }),
    /* @__PURE__ */ jsx(Content, { children: columns.map((column) => /* @__PURE__ */ jsx(
      CheckboxItem,
      {
        value: column.id,
        checked: column.getIsVisible(),
        disabled: !column.getCanHide(),
        onCheckedChange: () => column.toggleVisibility(),
        children: columnLabel(column)
      },
      column.id
    )) })
  ] });
}
var isInteractiveTarget = (target) => target instanceof Element && target.closest("a,button,input,label,select,textarea,summary,[role]") != null;
function resolveSort(canSort, sorted) {
  return canSort ? sorted ? sorted === "asc" ? "ascending" : "descending" : "none" : void 0;
}
var tableCell = cva("", {
  variants: {
    align: {
      start: "text-start",
      end: "text-end",
      center: "text-center"
    }
  }
});
var tableHeaderCell2 = cva("relative", {
  variants: {
    align: {
      start: "text-start justify-start",
      center: "text-center justify-center",
      end: "text-end justify-end"
    }
  }
});
var DEFAULT_PAGINATION = { pageIndex: 0, pageSize: 20 };
var DATA_TABLE_DEFAULT_EMPTY = "No results found";
var defaultRowTestId = (id) => `row-${id}`;
var SELECT_CHECKBOX_PX = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };
var SELECT_CELL_PADDING_PX = { xs: 8, sm: 10, md: 12, lg: 16, xl: 16 };
function createSelectColumn(size) {
  const width = SELECT_CHECKBOX_PX[size] + SELECT_CELL_PADDING_PX[size] * 2;
  return {
    id: "__select__",
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: width,
    minSize: width,
    maxSize: width,
    meta: {
      hideFromMenu: true
    },
    header: ({ table, mode }) => mode === "table" ? /* @__PURE__ */ jsx(
      Checkbox,
      {
        size,
        checked: table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false,
        onCheckedChange: (checked) => table.toggleAllPageRowsSelected(checked === true),
        label: "Select all rows",
        classNames: { label: "sr-only" }
      }
    ) : null,
    cell: ({ row }) => /* @__PURE__ */ jsx("span", { className: "flex flex-row justify-center items-center", children: /* @__PURE__ */ jsx(
      Checkbox,
      {
        size,
        checked: row.getIsSelected(),
        onCheckedChange: (checked) => row.toggleSelected(checked === true),
        disabled: !row.getCanSelect(),
        label: `Select row ${row.id}`,
        classNames: { label: "sr-only" }
      }
    ) })
  };
}
function DataTableComponent({
  data,
  columns,
  getRowId,
  getRowTestId,
  testId,
  sorting: sortingProp,
  onSortingChange,
  filters: filtersProp,
  onFiltersChange,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  pagination: paginationProp,
  onPaginationChange,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange,
  columnSizing: columnSizingProp,
  onColumnSizingChange,
  initialState,
  manualSorting,
  manualFiltering,
  manualPagination,
  enableMultiSort,
  rowCount,
  pageCount,
  hasNextPage,
  pageSizeOptions,
  translations,
  paginationMode,
  loading = false,
  error,
  onRetry,
  empty = DATA_TABLE_DEFAULT_EMPTY,
  enableRowSelection,
  onRowClick,
  title,
  toolbarActions,
  enableGlobalFilter,
  globalFilterPlaceholder,
  globalFilterDebounce,
  enableColumnVisibility: _enableColumnVisibility,
  enableColumnResizing,
  enablePagination = true,
  sizing = "fixed",
  fillLastColumn = true,
  size,
  striped,
  stickyHeader,
  stickyFooter,
  responsive = "scroll",
  className,
  classNames
}) {
  const [pagination, handlePaginationChange] = useUncontrolled({
    value: paginationProp,
    onChange: onPaginationChange,
    defaultValue: initialState?.pagination ?? DEFAULT_PAGINATION
  });
  const resetPagignation = () => handlePaginationChange((old) => old.pageIndex === 0 ? old : { ...old, pageIndex: 0 });
  const [sorting, handleSortingChange] = useUncontrolled({
    value: sortingProp,
    onChange: (value) => {
      resetPagignation();
      onSortingChange?.(value);
    },
    defaultValue: initialState?.sorting ?? []
  });
  const [columnFilters, handleColumnFiltersChange] = useUncontrolled({
    value: filtersProp,
    onChange: (value) => {
      resetPagignation();
      onFiltersChange?.(value);
    },
    defaultValue: initialState?.filters ?? []
  });
  const [globalFilter, handleGlobalFilterChange] = useUncontrolled({
    value: globalFilterProp,
    onChange: (value) => {
      resetPagignation();
      onGlobalFilterChange?.(value);
    },
    defaultValue: initialState?.globalFilter ?? ""
  });
  const [rowSelection, handleRowSelectionChange] = useUncontrolled({
    value: rowSelectionProp,
    onChange: onRowSelectionChange,
    defaultValue: initialState?.rowSelection ?? {}
  });
  const [columnVisibility, handleColumnVisibilityChange] = useUncontrolled({
    value: columnVisibilityProp,
    onChange: onColumnVisibilityChange,
    defaultValue: initialState?.columnVisibility ?? {}
  });
  const [columnSizing, handleColumnSizingChange] = useUncontrolled({
    value: columnSizingProp,
    onChange: onColumnSizingChange,
    defaultValue: initialState?.columnSizing ?? {}
  });
  const tableColumns = useMemo(() => {
    const withFilterFns = columns.map((col) => {
      const filter = col.meta?.filter;
      if (!filter || col.filterFn != null) return col;
      return { ...col, filterFn: resolveFilterFn(filter) };
    });
    if (!enableRowSelection) return withFilterFns;
    return [createSelectColumn(size ?? "md"), ...withFilterFns];
  }, [columns, enableRowSelection, size]);
  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
      columnVisibility,
      columnSizing
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onColumnSizingChange: handleColumnSizingChange,
    manualSorting,
    manualFiltering,
    manualPagination,
    enableMultiSort,
    enableRowSelection,
    // No fixed width for a drag to adjust in "auto" mode — see the `sizing` prop doc.
    enableColumnResizing: Boolean(enableColumnResizing) && sizing === "fixed",
    columnResizeMode: "onChange",
    rowCount,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });
  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const showSkeleton = loading && rows.length === 0;
  const isRefetching = loading && rows.length > 0;
  const skeletonRowCount = Math.min(Math.max(pagination.pageSize, 1), 100);
  const handleRowClick = (row) => (event) => {
    if (!onRowClick || isInteractiveTarget(event.target)) return;
    onRowClick(row);
  };
  const enableColumnVisibility = _enableColumnVisibility && table.getAllLeafColumns().some((column) => !column.columnDef.meta?.hideFromMenu);
  const showToolbar = title != null || toolbarActions != null || enableGlobalFilter || enableColumnVisibility;
  const isStacked = responsive === "stack";
  const isFixedSizing = sizing === "fixed";
  const isFillLast = isFixedSizing && fillLastColumn;
  const view = match({ error, showSkeleton, items: rows.length }).with({ error: P.nonNullable }, () => "error").with({ showSkeleton: true }, () => "loading").with({ items: P.number.lte(0) }, () => "empty").otherwise(() => "items");
  return /* @__PURE__ */ jsxs(
    Table,
    {
      testId,
      size,
      striped,
      stickyHeader,
      stickyFooter,
      "aria-busy": loading || void 0,
      className: cn(
        isStacked && "@container",
        // Selected rows — black/white wash + translucent border, same
        // background-dependent convention as Card's own translucent border,
        // instead of a fixed per-theme gray.
        // Yeah this selector is quite hardcore but we need to select the row before as we need to change the border on select
        "[&_tbody_tr]:data-[selected=true]:bg-black/8! [&_tbody_tr:has(+tr[data-selected=true])_td]:border-black/15! [&_tbody_tr[data-selected=true]_td]:border-black/15!",
        "dark:[&_tbody_tr]:data-[selected=true]:bg-white/16! dark:[&_tbody_tr:has(+tr[data-selected=true])_td]:border-white/20! dark:[&_tbody_tr[data-selected=true]_td]:border-white/20!",
        className,
        classNames?.root
      ),
      children: [
        showToolbar && /* @__PURE__ */ jsxs(Table.Toolbar, { className: classNames?.toolbar, children: [
          title != null ? /* @__PURE__ */ jsx(Table.Title, { children: title }) : /* @__PURE__ */ jsx("span", {}),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            enableGlobalFilter && /* @__PURE__ */ jsx(
              DataTableGlobalFilter,
              {
                value: globalFilter,
                onChange: handleGlobalFilterChange,
                placeholder: globalFilterPlaceholder,
                debounce: globalFilterDebounce
              }
            ),
            toolbarActions,
            enableColumnVisibility && /* @__PURE__ */ jsx(
              DataTableColumnVisibilityMenu,
              {
                table,
                className: isStacked ? "hidden @lg:flex" : void 0
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Table.Content,
          {
            className: cn("min-h-64", isStacked ? "hidden @lg:flex" : void 0),
            classNames: {
              table: cn(isFixedSizing ? "table-fixed" : "table-auto", classNames?.table)
            },
            style: !isFixedSizing ? void 0 : (
              // `w-full` (the base Table.Content class) supplies `width: 100%`; a
              // `min-width` floor lets the table still grow past its container for a
              // wide sum of column sizes, while leaving the last column's own width
              // unset (below) so it's the one CSS distributes 100%'s slack into.
              isFillLast ? { minWidth: table.getTotalSize() } : { width: table.getTotalSize() }
            ),
            children: [
              /* @__PURE__ */ jsx(Table.Head, { className: classNames?.head, children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(Table.Row, { className: classNames?.headerRow, children: headerGroup.headers.map((header, index, headers) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const isLast = index === headers.length - 1;
                const fillsRemaining = isFillLast && isLast;
                const resizable = isFixedSizing && !fillsRemaining && header.column.getCanResize();
                return /* @__PURE__ */ jsx(
                  Table.HeaderCell,
                  {
                    testId: `header-${header.column.id}`,
                    style: {
                      width: isFixedSizing && !fillsRemaining ? header.getSize() : void 0
                    },
                    className: cn(
                      tableHeaderCell2({ align: header.column.columnDef.meta?.align }),
                      classNames?.headerCell
                    ),
                    "aria-sort": resolveSort(canSort, sorted),
                    children: !header.isPlaceholder && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(
                        DataTableHeaderCell,
                        {
                          header,
                          truncate: isFixedSizing && header.column.id !== "__select__"
                        }
                      ),
                      resizable && /* @__PURE__ */ jsx(DataTableColumnResizeHandle, { header })
                    ] })
                  },
                  header.id
                );
              }) }, headerGroup.id)) }),
              /* @__PURE__ */ jsx(
                Table.Body,
                {
                  className: cn(
                    classNames?.body,
                    isRefetching && "pointer-events-none opacity-60 transition-opacity"
                  ),
                  children: match(view).with("error", () => /* @__PURE__ */ jsx(Table.Row, { "data-placeholder": true, children: /* @__PURE__ */ jsx(
                    Table.Cell,
                    {
                      colSpan: visibleColumnCount,
                      role: "alert",
                      className: cn("py-6 text-center", classNames?.error),
                      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 items-center justify-center min-h-48.5", children: [
                        /* @__PURE__ */ jsx(ThemeIcon, { children: /* @__PURE__ */ jsx(ServerCrashIcon, {}) }),
                        /* @__PURE__ */ jsx(
                          RenderPlaceholder,
                          {
                            node: error,
                            defaultActions: onRetry && /* @__PURE__ */ jsx(
                              Button,
                              {
                                variant: "light",
                                color: "gray",
                                size: "sm",
                                startSlot: /* @__PURE__ */ jsx(RotateCwIcon, {}),
                                onClick: onRetry,
                                children: "Retry"
                              }
                            )
                          }
                        )
                      ] })
                    }
                  ) })).with("empty", () => /* @__PURE__ */ jsx(Table.Row, { "data-placeholder": true, children: /* @__PURE__ */ jsx(
                    Table.Cell,
                    {
                      colSpan: visibleColumnCount,
                      className: cn("py-6 text-center", classNames?.empty),
                      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 items-center justify-center min-h-48.5", children: [
                        /* @__PURE__ */ jsx(ThemeIcon, { children: /* @__PURE__ */ jsx(SearchAlertIcon, {}) }),
                        /* @__PURE__ */ jsx(
                          RenderPlaceholder,
                          {
                            node: empty,
                            defaultActions: /* @__PURE__ */ jsx(
                              Button,
                              {
                                variant: "light",
                                color: "gray",
                                size: "sm",
                                startSlot: /* @__PURE__ */ jsx(EraserIcon, {}),
                                onClick: () => table.resetColumnFilters(),
                                children: "Clear filters"
                              }
                            )
                          }
                        )
                      ] })
                    }
                  ) })).with(
                    "loading",
                    () => Array.from({ length: skeletonRowCount }).map((_, rowIndex) => /* @__PURE__ */ jsx(
                      Table.Row,
                      {
                        testId: `skeleton-row-${rowIndex}`,
                        "aria-hidden": "true",
                        "data-placeholder": true,
                        children: table.getVisibleLeafColumns().map((column) => /* @__PURE__ */ jsx(Table.Cell, { testId: `skeleton-row-${rowIndex}-cell-${column.id}`, children: column.columnDef.meta?.skeleton ?? /* @__PURE__ */ jsx(Skeleton, { shape: "rectangular", size, className: "w-full" }) }, column.id))
                      },
                      `skeleton-${rowIndex}`
                    ))
                  ).with(
                    "items",
                    () => rows.map((row) => {
                      const rowTestId = getRowTestId ? getRowTestId(row.original, row.id) : defaultRowTestId(row.id);
                      return /* @__PURE__ */ jsx(
                        Table.Row,
                        {
                          testId: rowTestId,
                          onClick: onRowClick ? handleRowClick(row.original) : void 0,
                          className: cn(onRowClick && "cursor-pointer", classNames?.row),
                          ...props({ "data-selected": row.getIsSelected() }),
                          children: row.getVisibleCells().map((cell, index, cells) => {
                            const fillsRemaining = isFillLast && index === cells.length - 1;
                            return /* @__PURE__ */ jsx(
                              Table.Cell,
                              {
                                testId: `${rowTestId}-cell-${cell.column.id}`,
                                style: {
                                  width: isFixedSizing && !fillsRemaining ? cell.column.getSize() : void 0
                                },
                                className: cn(
                                  tableCell({
                                    align: cell.column.columnDef.meta?.align
                                  }),
                                  isFixedSizing && cell.column.id !== "__select__" && "truncate",
                                  classNames?.cell
                                ),
                                children: flexRender(cell.column.columnDef.cell, cell.getContext())
                              },
                              cell.id
                            );
                          })
                        },
                        row.id
                      );
                    })
                  ).exhaustive()
                }
              )
            ]
          }
        ),
        isStacked && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            DataTableStackOptions,
            {
              table,
              enableColumnVisibility,
              className: "@lg:hidden"
            }
          ),
          /* @__PURE__ */ jsx(
            DataTableStackedRows,
            {
              rows,
              view,
              error,
              refetching: isRefetching,
              empty,
              onRowClick,
              isInteractiveTarget,
              onRetry,
              table,
              skeletonRowCount,
              className: "@lg:hidden"
            }
          )
        ] }),
        enablePagination && /* @__PURE__ */ jsx(
          DataTablePagination,
          {
            table,
            pageSizeOptions,
            hasNextPage,
            translations,
            paginationMode,
            className: classNames?.pagination
          }
        )
      ]
    }
  );
}
var DataTable = Object.assign(DataTableComponent, {
  Pagination: DataTablePagination
});
function columnHelperFor(_schema) {
  return createColumnHelper();
}

// src/components/data-table/data-table-skeleton.ts
var DATA_TABLE_SKELETON_CLASS = "animate-pulse rounded-xs bg-black/15 dark:bg-white/8";

export { DATA_TABLE_SKELETON_CLASS, DataTable, columnHelperFor };
