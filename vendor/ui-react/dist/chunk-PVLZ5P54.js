import { SegmentGroup } from './chunk-XONFFMYI.js';
import { NumberInput } from './chunk-4NXCBDHI.js';
import { cn } from './chunk-SAS62TWA.js';
import { useLocaleContext } from '@ark-ui/react/locale';
import { jsxs, jsx } from 'react/jsx-runtime';

// src/components/time-input/hour-cycle.ts
var resolveHourCycle = ({
  locale,
  format,
  hourCycle
}) => {
  if (hourCycle) return hourCycle;
  if (format !== void 0) return format === 12 ? "h12" : "h23";
  return Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle;
};
var is12Hour = (cycle) => cycle === "h11" || cycle === "h12";
var to12Hour = (hour24) => ({
  hour: hour24 % 12 || 12,
  period: hour24 < 12 ? "AM" : "PM"
});
var to24Hour = (hour12, period) => period === "PM" ? hour12 % 12 + 12 : hour12 % 12;
var dayPeriodLabels = (locale) => {
  const dayPeriod = (hour) => new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true }).formatToParts(new Date(2e3, 0, 1, hour)).find((part) => part.type === "dayPeriod")?.value ?? (hour < 12 ? "AM" : "PM");
  return { AM: dayPeriod(9), PM: dayPeriod(21) };
};
var UNIT_FALLBACK = { hour: "h", minute: "m", second: "s" };
var timeUnitLabels = (locale) => {
  const unit = (u) => new Intl.NumberFormat(locale, { style: "unit", unit: u, unitDisplay: "narrow" }).formatToParts(1).find((part) => part.type === "unit")?.value ?? UNIT_FALLBACK[u];
  return { hour: unit("hour"), minute: unit("minute"), second: unit("second") };
};
var TIME_FIELD_BASIS_PX = { xs: 64, sm: 72, md: 78, lg: 86, xl: 100 };
var timeFieldBasis = {
  xs: `basis-[${TIME_FIELD_BASIS_PX.xs}px] min-w-[${TIME_FIELD_BASIS_PX.xs}px]`,
  sm: `basis-[${TIME_FIELD_BASIS_PX.sm}px] min-w-[${TIME_FIELD_BASIS_PX.sm}px]`,
  md: `basis-[${TIME_FIELD_BASIS_PX.md}px] min-w-[${TIME_FIELD_BASIS_PX.md}px]`,
  lg: `basis-[${TIME_FIELD_BASIS_PX.lg}px] min-w-[${TIME_FIELD_BASIS_PX.lg}px]`,
  xl: `basis-[${TIME_FIELD_BASIS_PX.xl}px] min-w-[${TIME_FIELD_BASIS_PX.xl}px]`
};
var ROW_GAP_PX = 8;
var PERIOD_WIDTH_PX = { xs: 60, sm: 74, md: 88, lg: 110, xl: 133 };
var timeRowMinWidth = (size, hourCycle, withSeconds) => {
  const fieldCount = 2 + (withSeconds ? 1 : 0);
  const fieldsWidth = fieldCount * TIME_FIELD_BASIS_PX[size] + (fieldCount - 1) * ROW_GAP_PX;
  return is12Hour(hourCycle) ? Math.max(fieldsWidth, PERIOD_WIDTH_PX[size]) : fieldsWidth;
};
var TimeRow = ({
  hour,
  minute,
  second,
  onHourChange,
  onMinuteChange,
  onSecondChange,
  period,
  onPeriodChange,
  hourCycle,
  minuteStep = 1,
  withSeconds,
  placeholder = "--",
  locale,
  translations,
  size = "md",
  variant = "default",
  color,
  disabled,
  readOnly,
  invalid,
  ref,
  onBlur,
  className,
  classNames
}) => {
  const { locale: contextLocale } = useLocaleContext();
  const resolvedLocale = locale ?? contextLocale;
  const twelveHour = is12Hour(hourCycle);
  const units = timeUnitLabels(resolvedLocale);
  const periodLabels = twelveHour ? dayPeriodLabels(resolvedLocale) : null;
  return (
    // `flex-wrap`: at a single narrow month under `DatePicker`, Hour/Minute/[Second] fit the
    // calendar's own width but the AM/PM toggle doesn't (see `timeRowMinWidth`'s comment) — this
    // drops it to its own line there instead of forcing the whole popover wider than the
    // calendar to fit it on the same line. No visual change wherever there's already enough
    // width (every other context) — wrapping only kicks in once it's genuinely too narrow.
    /* @__PURE__ */ jsxs("div", { className: cn("flex flex-wrap items-end gap-2", className), children: [
      /* @__PURE__ */ jsx(
        NumberInput,
        {
          ref,
          onBlur,
          label: translations?.hour ?? "Hour",
          placeholder,
          value: hour,
          onChange: onHourChange,
          min: twelveHour ? 1 : 0,
          max: twelveHour ? 12 : 23,
          step: 1,
          wrap: true,
          formatOptions: { minimumIntegerDigits: 2 },
          size,
          variant,
          color,
          disabled,
          readOnly,
          invalid,
          suffix: units.hour,
          className: classNames?.hour,
          classNames: {
            field: cn("flex-1", timeFieldBasis[size]),
            label: "sr-only",
            input: "text-end"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        NumberInput,
        {
          label: translations?.minute ?? "Minute",
          placeholder,
          value: minute,
          onChange: onMinuteChange,
          min: 0,
          max: 59,
          step: minuteStep,
          wrap: true,
          formatOptions: { minimumIntegerDigits: 2 },
          size,
          variant,
          color,
          disabled,
          readOnly,
          invalid,
          suffix: units.minute,
          className: classNames?.minute,
          classNames: {
            field: cn("flex-1", timeFieldBasis[size]),
            label: "sr-only",
            input: "text-end"
          }
        }
      ),
      withSeconds && /* @__PURE__ */ jsx(
        NumberInput,
        {
          label: translations?.second ?? "Second",
          placeholder,
          value: second ?? null,
          onChange: onSecondChange,
          min: 0,
          max: 59,
          step: 1,
          wrap: true,
          formatOptions: { minimumIntegerDigits: 2 },
          size,
          variant,
          color,
          disabled,
          readOnly,
          invalid,
          suffix: units.second,
          className: classNames?.second,
          classNames: {
            field: cn("flex-1", timeFieldBasis[size]),
            label: "sr-only",
            input: "text-end"
          }
        }
      ),
      twelveHour && periodLabels && /* @__PURE__ */ jsx(
        SegmentGroup,
        {
          data: [
            { value: "AM", label: periodLabels.AM },
            { value: "PM", label: periodLabels.PM }
          ],
          label: translations?.period ?? "Period",
          value: period,
          onChange: (value) => onPeriodChange(value),
          size: `input-${size}`,
          disabled,
          readOnly,
          invalid,
          className: classNames?.period,
          classNames: { field: "w-auto shrink-0", label: "sr-only" }
        }
      )
    ] })
  );
};

export { TimeRow, is12Hour, resolveHourCycle, timeRowMinWidth, to12Hour, to24Hour };
