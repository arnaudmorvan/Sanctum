import { TimeRow, resolveHourCycle, timeRowMinWidth, is12Hour, to12Hour, to24Hour } from './chunk-PVLZ5P54.js';
import { Button } from './chunk-GHV47RCM.js';
import { CalendarBody, calendarGridWidth, calendarValueToDate, dateToCalendarValue, fromArkValues, toArkValues, resolveCalendarTranslations } from './chunk-F36B6WYQ.js';
import { mergeRefs } from './chunk-UVYTJQTJ.js';
import { controlOpenProps } from './chunk-5FDOOG4J.js';
import { Popover, popoverClearTrigger, popoverPanel } from './chunk-PRHZ6FHV.js';
import { inputSlot, placeholderColor, shellGap, inputShell } from './chunk-MWXEQ5QX.js';
import { FieldShell } from './chunk-AL57HMNZ.js';
import { CalendarIcon, CloseIcon } from './chunk-IG7FBZVM.js';
import { useUncontrolled } from './chunk-BEL75C7N.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { DatePicker as DatePicker$1 } from '@ark-ui/react/date-picker';
import { useLocaleContext } from '@ark-ui/react/locale';
import { Portal } from '@ark-ui/react/portal';
import { getLocalTimeZone, DateFormatter, today } from '@internationalized/date';
import { useRef, useState } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

var datePickerPresets = cn(
  "flex shrink-0 flex-col gap-0.5 border-e p-1",
  "border-brand-900/20 dark:border-white/15"
);
var presetTrigger = cn(
  "w-full cursor-pointer rounded-xs px-2 py-1.5 text-start text-sm whitespace-nowrap transition-colors",
  "hover:bg-gray-light-100 dark:hover:bg-gray-dark-800",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
);
var timePanelLabel = "text-xs font-medium text-gray-light-500 dark:text-gray-dark-400";
var pad = (n) => String(n).padStart(2, "0");
var serializeDateValue = (value, withTime) => {
  const date = `${value.year}-${pad(value.month)}-${pad(value.day)}`;
  if (!withTime) return date;
  const time = "hour" in value ? value : { hour: 0, minute: 0, second: 0 };
  return `${date}T${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}`;
};
var getDefaultPresets = (range, timeZone, labels) => {
  const now = today(timeZone);
  const toDate = (value) => calendarValueToDate(value, timeZone);
  const label = (id, fallback) => labels?.[id] ?? fallback;
  if (!range) {
    return [
      { label: label("today", "Today"), date: toDate(now) },
      { label: label("yesterday", "Yesterday"), date: toDate(now.subtract({ days: 1 })) },
      { label: label("tomorrow", "Tomorrow"), date: toDate(now.add({ days: 1 })) },
      { label: label("nextWeek", "Next week"), date: toDate(now.add({ days: 7 })) }
    ];
  }
  const yesterday = now.subtract({ days: 1 });
  return [
    { label: label("today", "Today"), range: { start: toDate(now), end: toDate(now) } },
    {
      label: label("yesterday", "Yesterday"),
      range: { start: toDate(yesterday), end: toDate(yesterday) }
    },
    { label: label("thisWeek", "This week"), value: "thisWeek" },
    { label: label("lastWeek", "Last week"), value: "lastWeek" },
    { label: label("thisMonth", "This month"), value: "thisMonth" },
    { label: label("lastMonth", "Last month"), value: "lastMonth" },
    { label: label("thisYear", "This year"), value: "thisYear" },
    { label: label("allTime", "All time"), range: null }
  ];
};
var PresetsRail = ({
  presets,
  range,
  timeZone,
  withConfirm,
  translations,
  className
}) => {
  const resolved = presets === true ? getDefaultPresets(Boolean(range), timeZone, translations) : presets === false ? [] : presets;
  if (resolved.length === 0) return null;
  return /* @__PURE__ */ jsx(DatePicker$1.Context, { children: (api) => /* @__PURE__ */ jsx("div", { className: cn(datePickerPresets, className), children: resolved.map((preset) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        const values = "value" in preset ? api.getRangePresetValue(preset.value) : "range" in preset ? toArkValues(preset.range, timeZone) ?? [] : toArkValues(preset.date, timeZone) ?? [];
        api.setValue(values);
        if (!withConfirm) api.setOpen(false);
      },
      "aria-label": preset.label,
      className: presetTrigger,
      children: preset.label
    },
    preset.label
  )) }) });
};
var emptyDisplayTime = { hour: null, minute: null, second: null, period: null };
var toDisplayTime = (value, twelveHour) => {
  if (!value || !("hour" in value)) return emptyDisplayTime;
  const { hour, period } = twelveHour ? to12Hour(value.hour) : { hour: value.hour, period: null };
  return { hour, minute: value.minute, second: value.second ?? null, period };
};
var fromDisplayTime = (display, twelveHour) => {
  const hour = twelveHour ? to24Hour(display.hour ?? 12, display.period ?? "AM") : display.hour ?? 0;
  const minute = display.minute ?? 0;
  return display.second != null ? { hour, minute, second: display.second } : { hour, minute };
};
var TimePanelRow = ({
  value,
  onSetTime,
  label,
  disabled,
  hourCycle,
  minuteStep,
  withSeconds,
  placeholder,
  locale,
  translations,
  size,
  variant,
  color,
  classNames
}) => {
  const twelveHour = is12Hour(hourCycle);
  const display = toDisplayTime(value, twelveHour);
  const patch = (partial) => onSetTime(fromDisplayTime({ ...display, ...partial }, twelveHour));
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-1", classNames?.root), children: [
    label && /* @__PURE__ */ jsx("span", { className: timePanelLabel, children: label }),
    /* @__PURE__ */ jsx(
      TimeRow,
      {
        hour: display.hour,
        minute: display.minute,
        second: display.second,
        onHourChange: (hour) => patch({ hour }),
        onMinuteChange: (minute) => patch({ minute }),
        onSecondChange: withSeconds ? (second) => patch({ second }) : void 0,
        period: display.period,
        onPeriodChange: (period) => patch({ period }),
        hourCycle,
        minuteStep,
        withSeconds,
        placeholder,
        locale,
        translations,
        size,
        variant,
        color,
        disabled,
        classNames
      }
    )
  ] });
};
var DatePickerImpl = ({
  range,
  withTime,
  numOfMonths = 1,
  fixedWeeks,
  presets,
  withConfirm,
  clearable,
  value,
  defaultValue,
  onChange,
  onBlur,
  isDateUnavailable,
  min,
  max,
  minView,
  maxView,
  locale,
  timeZone,
  format,
  hourCycle,
  minuteStep,
  withSeconds,
  timePlaceholder,
  translations,
  placeholder = "Pick a date",
  startSlot,
  size = "md",
  variant = "default",
  color,
  disabled,
  readOnly,
  required,
  invalid,
  name,
  id,
  ref,
  label,
  description,
  error,
  className,
  classNames,
  testId
}) => {
  const { locale: contextLocale } = useLocaleContext();
  const resolvedLocale = locale ?? contextLocale;
  const resolvedTimeZone = timeZone ?? getLocalTimeZone();
  const resolvedHourCycle = resolveHourCycle({ locale: resolvedLocale, format, hourCycle });
  const isInvalid = invalid || error != null;
  const isRange = Boolean(range);
  const controlRef = useRef(null);
  const triggerRef = useRef(null);
  const emptyValue = isRange ? { start: null, end: null } : null;
  const [committed, setCommitted] = useUncontrolled({
    value,
    defaultValue,
    finalValue: emptyValue,
    onChange
  });
  const [staged, setStaged] = useState(committed);
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
      children: /* @__PURE__ */ jsx(
        DatePicker$1.Root,
        {
          id,
          "data-color": color,
          selectionMode: isRange ? "range" : "single",
          closeOnSelect: withConfirm ? false : void 0,
          locale: resolvedLocale,
          timeZone: resolvedTimeZone,
          translations: resolveCalendarTranslations(translations),
          numOfMonths,
          fixedWeeks,
          minView,
          maxView,
          value: toArkValues(withConfirm ? staged : value, resolvedTimeZone),
          defaultValue: withConfirm ? void 0 : toArkValues(defaultValue, resolvedTimeZone),
          onValueChange: (details) => {
            const next = fromArkValues(details.value, isRange, resolvedTimeZone);
            if (withConfirm) setStaged(next);
            else onChange?.(next);
          },
          onOpenChange: (details) => {
            if (withConfirm && details.open) setStaged(committed);
          },
          isDateUnavailable: isDateUnavailable ? (dateValue) => isDateUnavailable(calendarValueToDate(dateValue, resolvedTimeZone)) : void 0,
          min: min ? dateToCalendarValue(min, resolvedTimeZone) : void 0,
          max: max ? dateToCalendarValue(max, resolvedTimeZone) : void 0,
          format: withTime ? (date, { locale: fmtLocale }) => new DateFormatter(fmtLocale, { dateStyle: "medium", timeStyle: "short" }).format(
            calendarValueToDate(date, resolvedTimeZone)
          ) : void 0,
          positioning: { getAnchorRect: () => controlRef.current?.getBoundingClientRect() ?? null },
          disabled,
          readOnly,
          required,
          invalid: isInvalid,
          className: cn("w-full", className),
          children: /* @__PURE__ */ jsx(DatePicker$1.Context, { children: (api) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              DatePicker$1.Control,
              {
                ref: controlRef,
                ...props({
                  "data-invalid": isInvalid,
                  "data-with-start-slot": true,
                  "data-with-end-slot": true
                }),
                ...disabled || readOnly ? {} : controlOpenProps(() => api.setOpen(true)),
                className: cn(inputShell({ size, variant }), "cursor-pointer", classNames?.control),
                children: [
                  /* @__PURE__ */ jsxs(
                    DatePicker$1.Trigger,
                    {
                      ref: mergeRefs(triggerRef, ref),
                      onBlur,
                      "aria-invalid": isInvalid || void 0,
                      ...props({ "data-testid": testId }),
                      className: cn(
                        "flex min-w-0 flex-1 cursor-pointer items-center bg-transparent text-start outline-none disabled:cursor-not-allowed",
                        shellGap[size]
                      ),
                      children: [
                        /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: startSlot ?? /* @__PURE__ */ jsx(CalendarIcon, {}) }),
                        /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-start", children: isRange ? api.value.length === 0 ? /* @__PURE__ */ jsx("span", { className: placeholderColor, children: placeholder }) : (
                          // Not `Ark.RangeText`: despite the name, it renders the calendar's
                          // *visible* month/year viewport (the same text the header's ViewTrigger
                          // shows), not the selected range — `datePicker.visibleRangeText` in Ark's
                          // own source. Build the real selected-range text from `valueAsString`
                          // instead (the same per-value formatted strings `Ark.ValueText` uses).
                          api.valueAsString.join(" \u2013 ")
                        ) : /* @__PURE__ */ jsx(DatePicker$1.ValueText, { placeholder }) })
                      ]
                    }
                  ),
                  clearable && // Ark's own ClearTrigger already self-hides (`hidden`) while empty.
                  /* @__PURE__ */ jsx(DatePicker$1.ClearTrigger, { className: popoverClearTrigger, children: /* @__PURE__ */ jsx(CloseIcon, {}) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(DatePicker$1.Positioner, { children: /* @__PURE__ */ jsxs(
              DatePicker$1.Content,
              {
                "data-color": color,
                className: cn(
                  popoverPanel,
                  "max-w-[92vw] flex-row flex-wrap items-stretch",
                  classNames?.content
                ),
                children: [
                  presets && /* @__PURE__ */ jsx(
                    PresetsRail,
                    {
                      presets,
                      range: isRange,
                      timeZone: resolvedTimeZone,
                      withConfirm,
                      translations: translations?.presets,
                      className: classNames?.presets
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex min-w-0 flex-1 flex-col",
                      style: {
                        width: Math.max(
                          calendarGridWidth(size, numOfMonths),
                          withTime ? timeRowMinWidth(size, resolvedHourCycle, withSeconds) : 0
                        ) + 16
                        // Take the x padding into account
                      },
                      children: [
                        /* @__PURE__ */ jsx(
                          Popover.Body,
                          {
                            className: cn("p-2", withTime || withConfirm ? "border-b" : void 0),
                            children: /* @__PURE__ */ jsx(
                              CalendarBody,
                              {
                                numOfMonths,
                                size,
                                timeZone: resolvedTimeZone,
                                classNames: classNames?.calendar
                              }
                            )
                          }
                        ),
                        withTime && /* @__PURE__ */ jsxs(
                          Popover.Footer,
                          {
                            className: cn(
                              "flex gap-x-2 gap-y-2 pb-2",
                              // Stacked by default — side by side only widens to match the extra
                              // room multiple months already provide; with a single month, sitting
                              // two time rows side by side would force the popover wider than the
                              // calendar above them for no reason.
                              numOfMonths > 1 ? "flex-row flex-wrap" : "flex-col",
                              classNames?.footer
                            ),
                            children: [
                              /* @__PURE__ */ jsx(
                                TimePanelRow,
                                {
                                  value: api.value[0],
                                  onSetTime: (time) => api.setTime(time, 0),
                                  label: isRange ? translations?.startTime ?? "Start time" : void 0,
                                  hourCycle: resolvedHourCycle,
                                  minuteStep,
                                  withSeconds,
                                  placeholder: timePlaceholder,
                                  locale: resolvedLocale,
                                  translations,
                                  size,
                                  variant,
                                  color,
                                  classNames: { root: "flex-1", ...classNames?.timePanel }
                                }
                              ),
                              isRange && /* @__PURE__ */ jsx(
                                TimePanelRow,
                                {
                                  value: api.value[1],
                                  onSetTime: (time) => api.setTime(time, 1),
                                  label: translations?.endTime ?? "End time",
                                  disabled: api.value.length < 2,
                                  hourCycle: resolvedHourCycle,
                                  minuteStep,
                                  withSeconds,
                                  placeholder: timePlaceholder,
                                  locale: resolvedLocale,
                                  translations,
                                  size,
                                  variant,
                                  color,
                                  classNames: { root: "flex-1", ...classNames?.timePanel }
                                }
                              )
                            ]
                          }
                        ),
                        withConfirm && /* @__PURE__ */ jsxs(Popover.Footer, { className: "flex justify-end gap-2 pb-2", children: [
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "subtle",
                              color: "gray",
                              size,
                              onClick: () => {
                                setStaged(committed);
                                api.setOpen(false);
                              },
                              children: translations?.cancel ?? "Cancel"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              color,
                              size,
                              onClick: () => {
                                setCommitted(staged);
                                api.setOpen(false);
                              },
                              children: translations?.apply ?? "Apply"
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ]
              }
            ) }) }),
            name && (isRange ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "hidden",
                  name: `${name}Start`,
                  value: api.value[0] ? serializeDateValue(api.value[0], Boolean(withTime)) : ""
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "hidden",
                  name: `${name}End`,
                  value: api.value[1] ? serializeDateValue(api.value[1], Boolean(withTime)) : ""
                }
              )
            ] }) : /* @__PURE__ */ jsx(
              "input",
              {
                type: "hidden",
                name,
                value: api.value[0] ? serializeDateValue(api.value[0], Boolean(withTime)) : ""
              }
            ))
          ] }) })
        }
      )
    }
  );
};
var DatePicker = Object.assign(DatePickerImpl, {
  Root: DatePicker$1.Root,
  Context: DatePicker$1.Context,
  Control: DatePicker$1.Control,
  Input: DatePicker$1.Input,
  Trigger: DatePicker$1.Trigger,
  ClearTrigger: DatePicker$1.ClearTrigger,
  Content: DatePicker$1.Content,
  Presets: PresetsRail,
  Calendar: CalendarBody,
  TimePanel: TimeRow,
  TimePanelRow,
  Footer: Popover.Footer
});

export { DatePicker, serializeDateValue };
