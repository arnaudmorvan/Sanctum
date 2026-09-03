import { ActionIcon } from './chunk-3KHUHVCD.js';
import { ChevronLeftIcon, ChevronRightIcon } from './chunk-IG7FBZVM.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { DatePicker } from '@ark-ui/react/date-picker';
import { useLocaleContext } from '@ark-ui/react/locale';
import { fromDate, getLocalTimeZone } from '@internationalized/date';
import { cva } from 'class-variance-authority';
import { match } from 'ts-pattern';
import { jsx, jsxs } from 'react/jsx-runtime';

function dateToCalendarValue(date, timeZone) {
  return fromDate(date, timeZone);
}
function calendarValueToDate(value, timeZone) {
  return "timeZone" in value ? value.toDate() : value.toDate(timeZone);
}
function toArkValues(value, timeZone) {
  if (value === void 0) return void 0;
  if (value === null) return [];
  if (value instanceof Date) return [dateToCalendarValue(value, timeZone)];
  const values = [];
  if (value.start !== null) values.push(dateToCalendarValue(value.start, timeZone));
  if (value.end !== null) values.push(dateToCalendarValue(value.end, timeZone));
  return values;
}
function fromArkValues(values, range, timeZone) {
  if (!range) {
    const [only] = values;
    return only ? calendarValueToDate(only, timeZone) : null;
  }
  const [start, end] = values;
  return {
    start: start ? calendarValueToDate(start, timeZone) : null,
    end: end ? calendarValueToDate(end, timeZone) : null
  };
}
var dayCellTrigger = cva(
  [
    "relative flex size-full items-center justify-center rounded-xs",
    "cursor-pointer select-none tabular-nums transition-colors-radius",
    "hover:bg-gray-light-950/20 dark:hover:bg-gray-dark-50/20",
    "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
    "data-today:font-semibold data-today:text-brand-500",
    // `!` (important) on bg/text: a day can be `data-today` *and* `data-selected` at once (e.g.
    // the default `new Date()` value), or a range endpoint is simultaneously `data-selected` *and*
    // `data-in-range` (the closed interval includes its own ends) — without `!`, these rules fight
    // over the same `background-color`/`color` and Tailwind's variant ordering (not this class
    // list's order) can win the wrong one, e.g. leaving the selected cell's text the same color
    // as its own solid-fill background, invisible. `data-selected` — the solid highlight — always
    // wins over both.
    "data-selected:bg-gray-light-950! dark:data-selected:bg-gray-dark-50! data-selected:text-(--c-on-solid)! data-selected:font-semibold data-selected:hover:bg-gray-light-700! dark:data-selected:hover:bg-gray-dark-300!",
    "data-in-range:rounded-none data-in-range:bg-gray-light-950/10 dark:data-in-range:bg-gray-dark-50/10",
    // Pill-cap rounding, split into two independently-true conditions rather than reacting to
    // `data-range-start`/`data-range-end` alone: a lone click (before any second day exists)
    // still carries `data-range-start`, and capping on that alone made the first pick look like
    // an already-established range extending rightward.
    //
    // 1. A genuinely *committed* range exists — `data-range-committed` is set from
    //    `api.value.length === 2` in JS, not from the DOM. An earlier version checked whether the
    //    *other* endpoint's `data-range-start`/`data-range-end` was present anywhere among the
    //    visible months instead — that broke as soon as only one endpoint's month was in view
    //    (e.g. the range was set, then the calendar paged away from one end): the other endpoint
    //    was never rendered at all, so its attribute could never be found, and the cap silently
    //    stopped applying to the *visible* endpoint too, even though the range was still fully
    //    committed. `api.value` reflects the committed selection regardless of what's currently
    //    paged into view, so this doesn't have that failure mode.
    // 2. A genuine *live hover preview* toward a different day — self-contained on this cell's
    //    own attributes, no group lookup needed: `hoveredRangeValue` is `[start, hoveredValue]`
    //    sorted chronologically, so the anchor cell gets exactly one of `data-hover-range-start` /
    //    `data-hover-range-end` when truly hovering elsewhere (direction decides which), but
    //    *both* simultaneously when the pointer is merely resting on the same cell it just
    //    clicked (a zero-width hover range) — requiring the other one be *absent* rules out that
    //    degenerate, "changes before you've moved anywhere" case.
    "data-range-start:data-range-committed:rounded-s-xs",
    "data-range-end:data-range-committed:rounded-e-xs",
    "data-hover-range-start:not-data-hover-range-end:rounded-s-xs",
    "data-hover-range-end:not-data-hover-range-start:rounded-e-xs",
    // The degenerate case above (pointer resting on the just-clicked day, `data-hover-range-start`
    // and `data-hover-range-end` both present on this same cell) still falls into `data-in-range`
    // (a zero-width range trivially contains itself), which would otherwise render it
    // `rounded-none` — sharp corners, reading as broken rather than "just this one day, nothing
    // decided yet." Round it fully instead, `!` to beat that `data-in-range:rounded-none`
    // regardless of Tailwind's variant ordering.
    "data-hover-range-start:data-hover-range-end:rounded-xs!",
    "data-outside-range:text-gray-light-500 dark:data-outside-range:text-gray-dark-700",
    "data-in-range:data-outside-range:text-gray-light-700 dark:data-in-range:data-outside-range:text-gray-dark-400",
    "data-unavailable:pointer-events-none data-unavailable:text-gray-light-300 data-unavailable:line-through dark:data-unavailable:text-gray-dark-700",
    "data-disabled:pointer-events-none data-disabled:opacity-40"
  ],
  {
    variants: {
      size: {
        xs: "size-7 text-xs",
        sm: "size-8 text-xs",
        md: "size-9 text-sm",
        lg: "size-10 text-base",
        xl: "size-11 text-base"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var DAY_CELL_SIZE = { xs: 28, sm: 32, md: 36, lg: 40, xl: 44 };
var MONTH_GAP = 24;
var calendarGridWidth = (size, numOfMonths) => DAY_CELL_SIZE[size] * 7 * numOfMonths + MONTH_GAP * (numOfMonths - 1);
var gridCellTrigger = cva(
  [
    "flex w-full items-center justify-center truncate rounded-sm px-2 py-2.5",
    "cursor-pointer transition-colors",
    "hover:bg-gray-light-100 dark:hover:bg-gray-dark-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
    "data-selected:bg-(--c-solid) data-selected:text-(--c-on-solid) data-selected:hover:bg-(--c-solid-hover)",
    "data-disabled:pointer-events-none data-disabled:opacity-40"
  ],
  {
    variants: {
      size: { xs: "text-xs", sm: "text-xs", md: "text-sm", lg: "text-base", xl: "text-base" }
    },
    defaultVariants: { size: "md" }
  }
);
var weekdayHeader = "pb-1 text-center text-xs font-medium text-gray-light-500 dark:text-gray-dark-400";
var weekNumberCell = cn(
  "p-1 align-top text-center text-xs font-medium text-gray-light-500 dark:text-gray-dark-400 h-full"
);
var navIcon = (direction, size, className) => /* @__PURE__ */ jsx(ActionIcon, { variant: "subtle", color: "gray", size, className, children: direction === "prev" ? /* @__PURE__ */ jsx(ChevronLeftIcon, {}) : /* @__PURE__ */ jsx(ChevronRightIcon, {}) });
var NAV_ICON_SIZE = { xs: 28, sm: 32, md: 36, lg: 40, xl: 48 };
var CalendarBody = ({
  numOfMonths = 1,
  withWeekNumbers,
  renderDay,
  size = "md",
  timeZone,
  classNames
}) => /* @__PURE__ */ jsx(DatePicker.Context, { children: (api) => {
  const nav = /* @__PURE__ */ jsxs(
    DatePicker.ViewControl,
    {
      className: cn("mb-2 flex items-strech justify-between gap-1", classNames?.header),
      children: [
        /* @__PURE__ */ jsx(DatePicker.PrevTrigger, { asChild: true, children: navIcon("prev", size) }),
        /* @__PURE__ */ jsx(
          DatePicker.ViewTrigger,
          {
            className: cn(
              "transition-colors",
              "min-w-0 flex-1 cursor-pointer truncate rounded-sm px-2 py-1 text-center text-sm font-medium",
              "hover:bg-gray-light-100 dark:hover:bg-gray-dark-800",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              "disabled:pointer-events-none disabled:opacity-50"
            ),
            children: api.visibleRange.end.month === api.visibleRange.start.month ? api.visibleRangeText.start : api.visibleRangeText.formatted
          }
        ),
        /* @__PURE__ */ jsx(DatePicker.NextTrigger, { asChild: true, children: navIcon("next", size) })
      ]
    }
  );
  const isCommittedRange = api.value.length === 2;
  return match(api.view).with("day", () => /* @__PURE__ */ jsx(DatePicker.View, { view: "day", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "grid items-center justify-center",
      style: {
        gridTemplateColumns: `repeat(${numOfMonths}, auto)`,
        columnGap: MONTH_GAP,
        rowGap: 8
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn("relative", classNames?.header),
            style: {
              gridColumn: `1 / span ${numOfMonths}`,
              gridRow: 1,
              height: NAV_ICON_SIZE[size]
            },
            children: [
              /* @__PURE__ */ jsx(DatePicker.PrevTrigger, { asChild: true, children: navIcon("prev", size, "absolute start-0 top-1/2 z-10 -translate-y-1/2") }),
              /* @__PURE__ */ jsxs(
                DatePicker.ViewTrigger,
                {
                  className: cn(
                    "group relative grid size-full cursor-pointer items-center rounded-sm text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    "disabled:pointer-events-none disabled:opacity-50"
                  ),
                  style: {
                    gridTemplateColumns: `repeat(${numOfMonths}, 1fr)`,
                    columnGap: MONTH_GAP
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": true,
                        className: "pointer-events-none absolute inset-y-0 rounded-sm transition-colors group-hover:bg-gray-light-100 dark:group-hover:bg-gray-dark-800",
                        style: {
                          insetInlineStart: NAV_ICON_SIZE[size],
                          insetInlineEnd: NAV_ICON_SIZE[size]
                        }
                      }
                    ),
                    Array.from({ length: numOfMonths }, (_, monthIndex) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length run of adjacent months, never reordered.
                      /* @__PURE__ */ jsx("span", { className: "relative min-w-0 truncate text-center", children: api.getOffset({ months: monthIndex }).visibleRangeText.start }, monthIndex)
                    ))
                  ]
                }
              ),
              /* @__PURE__ */ jsx(DatePicker.NextTrigger, { asChild: true, children: navIcon("next", size, "absolute end-0 top-1/2 z-10 -translate-y-1/2") })
            ]
          }
        ),
        Array.from({ length: numOfMonths }, (_, monthIndex) => {
          const offset = api.getOffset({ months: monthIndex });
          return /* @__PURE__ */ jsxs(
            DatePicker.Table,
            {
              style: { gridColumn: monthIndex + 1, gridRow: 2 },
              className: cn("border-separate border-spacing-0", classNames?.table),
              children: [
                /* @__PURE__ */ jsx(DatePicker.TableHead, { children: /* @__PURE__ */ jsxs(DatePicker.TableRow, { children: [
                  withWeekNumbers && /* @__PURE__ */ jsx(DatePicker.WeekNumberHeaderCell, { className: weekdayHeader }),
                  api.weekDays.map((weekDay) => /* @__PURE__ */ jsx(DatePicker.TableHeader, { className: weekdayHeader, children: weekDay.narrow }, weekDay.long))
                ] }) }),
                /* @__PURE__ */ jsx(DatePicker.TableBody, { children: offset.weeks.map((week, weekIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length run of consecutive weeks, never reordered.
                  /* @__PURE__ */ jsxs(DatePicker.TableRow, { children: [
                    withWeekNumbers && /* @__PURE__ */ jsx(DatePicker.WeekNumberCell, { weekIndex, week, children: /* @__PURE__ */ jsx("span", { className: weekNumberCell, children: api.getWeekNumber(week) }) }),
                    week.map((value) => {
                      const cellState = renderDay ? api.getDayTableCellState({
                        value,
                        visibleRange: offset.visibleRange
                      }) : void 0;
                      return /* @__PURE__ */ jsx(
                        DatePicker.TableCell,
                        {
                          value,
                          visibleRange: offset.visibleRange,
                          children: /* @__PURE__ */ jsxs(
                            DatePicker.TableCellTrigger,
                            {
                              "data-range-committed": isCommittedRange || void 0,
                              className: cn(dayCellTrigger({ size }), classNames?.day),
                              children: [
                                value.day,
                                cellState && renderDay?.(calendarValueToDate(value, timeZone), {
                                  isUnavailable: cellState.unavailable,
                                  isSelected: cellState.selected
                                })
                              ]
                            }
                          )
                        },
                        value.toString()
                      );
                    })
                  ] }, weekIndex)
                )) })
              ]
            },
            monthIndex
          );
        })
      ]
    }
  ) })).with("month", () => /* @__PURE__ */ jsxs(DatePicker.View, { view: "month", children: [
    nav,
    /* @__PURE__ */ jsx(
      DatePicker.Table,
      {
        className: cn("mx-auto table-fixed", classNames?.table),
        style: { width: calendarGridWidth(size, numOfMonths) },
        children: /* @__PURE__ */ jsx(DatePicker.TableBody, { children: api.getMonthsGrid({ columns: 4, format: "short" }).map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length grid chunked at render time, never reordered.
          /* @__PURE__ */ jsx(DatePicker.TableRow, { children: row.map((month) => /* @__PURE__ */ jsx(DatePicker.TableCell, { value: month.value, children: /* @__PURE__ */ jsx(DatePicker.TableCellTrigger, { className: gridCellTrigger({ size }), children: month.label }) }, month.value)) }, rowIndex)
        )) })
      }
    )
  ] })).with("year", () => /* @__PURE__ */ jsxs(DatePicker.View, { view: "year", children: [
    nav,
    /* @__PURE__ */ jsx(
      DatePicker.Table,
      {
        columns: 5,
        className: cn("mx-auto table-fixed", classNames?.table),
        style: { width: calendarGridWidth(size, numOfMonths) },
        children: /* @__PURE__ */ jsx(DatePicker.TableBody, { children: api.getYearsGrid({ columns: 5 }).map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length grid chunked at render time, never reordered.
          /* @__PURE__ */ jsx(DatePicker.TableRow, { children: row.map((year) => /* @__PURE__ */ jsx(DatePicker.TableCell, { value: year.value, children: /* @__PURE__ */ jsx(DatePicker.TableCellTrigger, { className: gridCellTrigger({ size }), children: year.label }) }, year.value)) }, rowIndex)
        )) })
      }
    )
  ] })).exhaustive();
} });
var VIEW_TRIGGER_LABEL = {
  year: "Switch to month view",
  month: "Switch to day view",
  day: "Switch to year view"
};
var PREV_TRIGGER_LABEL = {
  year: "Switch to previous decade",
  month: "Switch to previous year",
  day: "Switch to previous month"
};
var NEXT_TRIGGER_LABEL = {
  year: "Switch to next decade",
  month: "Switch to next year",
  day: "Switch to next month"
};
var ARK_DEFAULT_TRANSLATIONS = {
  dayCell: (state) => state.unavailable ? `Not available. ${state.valueText}` : state.firstInRange ? `Starting range from ${state.valueText}` : state.lastInRange ? `Range ending at ${state.valueText}` : state.selected ? `Selected date. ${state.valueText}` : `Choose ${state.valueText}`,
  trigger: (open) => open ? "Close calendar" : "Open calendar",
  viewTrigger: (view) => VIEW_TRIGGER_LABEL[view],
  prevTrigger: (view) => PREV_TRIGGER_LABEL[view],
  nextTrigger: (view) => NEXT_TRIGGER_LABEL[view],
  presetTrigger: (value) => `select ${value[0] ?? ""} to ${value[1] ?? ""}`,
  placeholder: () => ({ day: "dd", month: "mm", year: "yyyy" }),
  content: "calendar",
  monthSelect: "Select month",
  yearSelect: "Select year",
  clearTrigger: "Clear selected dates",
  weekColumnHeader: "Wk",
  weekNumberCell: (weekNumber) => `Week ${weekNumber}`
};
var resolveCalendarTranslations = (overrides) => overrides ? { ...ARK_DEFAULT_TRANSLATIONS, ...overrides } : void 0;
var Calendar = ({
  range,
  value,
  defaultValue,
  onChange,
  onBlur,
  numOfMonths = 1,
  isDateUnavailable,
  min,
  max,
  minView,
  maxView,
  renderDay,
  fixedWeeks,
  withWeekNumbers,
  locale,
  timeZone,
  translations,
  size = "md",
  disabled,
  readOnly,
  required,
  invalid,
  name,
  id,
  ref,
  className,
  classNames,
  testId
}) => {
  const { locale: contextLocale } = useLocaleContext();
  const resolvedLocale = locale ?? contextLocale;
  const resolvedTimeZone = timeZone ?? getLocalTimeZone();
  const isRange = Boolean(range);
  return /* @__PURE__ */ jsx(
    DatePicker.Root,
    {
      inline: true,
      ref,
      id,
      selectionMode: isRange ? "range" : "single",
      locale: resolvedLocale,
      timeZone: resolvedTimeZone,
      translations: resolveCalendarTranslations(translations),
      value: toArkValues(value, resolvedTimeZone),
      defaultValue: toArkValues(defaultValue, resolvedTimeZone),
      onValueChange: onChange ? (
        // The machine's value is a plain DateValue[]; `range` is a runtime flag here, so
        // narrow the result back to the caller's declared shape.
        (details) => onChange(
          fromArkValues(details.value, isRange, resolvedTimeZone)
        )
      ) : void 0,
      onBlur,
      numOfMonths,
      fixedWeeks,
      showWeekNumbers: withWeekNumbers,
      isDateUnavailable: isDateUnavailable ? (dateValue) => isDateUnavailable(calendarValueToDate(dateValue, resolvedTimeZone)) : void 0,
      min: min ? dateToCalendarValue(min, resolvedTimeZone) : void 0,
      max: max ? dateToCalendarValue(max, resolvedTimeZone) : void 0,
      minView,
      maxView,
      disabled,
      readOnly,
      required,
      invalid,
      name,
      className: cn("inline-flex flex-col", className, classNames?.root),
      ...props({ "data-testid": testId }),
      children: /* @__PURE__ */ jsx(DatePicker.Content, { children: /* @__PURE__ */ jsx(
        CalendarBody,
        {
          numOfMonths,
          withWeekNumbers,
          renderDay,
          size,
          timeZone: resolvedTimeZone,
          classNames
        }
      ) })
    }
  );
};

export { Calendar, CalendarBody, calendarGridWidth, calendarValueToDate, dateToCalendarValue, fromArkValues, resolveCalendarTranslations, toArkValues };
