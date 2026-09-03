"use client";
import { resolveHourCycle, is12Hour, TimeRow, to12Hour, to24Hour } from '../../chunk-PVLZ5P54.js';
import '../../chunk-XONFFMYI.js';
import '../../chunk-4NXCBDHI.js';
import '../../chunk-PRHZ6FHV.js';
import '../../chunk-MWXEQ5QX.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import '../../chunk-IG7FBZVM.js';
import { useUncontrolled } from '../../chunk-BEL75C7N.js';
import { props } from '../../chunk-WYCMIIRR.js';
import '../../chunk-SAS62TWA.js';
import { useLocaleContext } from '@ark-ui/react/locale';
import { jsx, jsxs } from 'react/jsx-runtime';

var emptyDisplay = { hour: null, minute: null, second: null, period: null };
var toDisplay = (value, twelveHour) => {
  if (value == null) return emptyDisplay;
  const { hour, period } = twelveHour ? to12Hour(value.hour) : { hour: value.hour, period: null };
  return { hour, minute: value.minute, second: value.second ?? null, period };
};
var fromDisplay = (display, twelveHour) => {
  const hour = twelveHour ? to24Hour(display.hour ?? 12, display.period ?? "AM") : display.hour ?? 0;
  const minute = display.minute ?? 0;
  return display.second != null ? { hour, minute, second: display.second } : { hour, minute };
};
var TimeInput = ({
  value,
  defaultValue,
  onChange,
  format,
  hourCycle,
  minuteStep,
  withSeconds,
  placeholder,
  locale,
  translations,
  size = "md",
  variant = "default",
  color,
  disabled,
  readOnly,
  invalid,
  required,
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
  const { locale: contextLocale } = useLocaleContext();
  const resolvedLocale = locale ?? contextLocale;
  const resolvedCycle = resolveHourCycle({ locale: resolvedLocale, format, hourCycle });
  const twelveHour = is12Hour(resolvedCycle);
  const isInvalid = invalid || error != null;
  const [committed, setCommitted] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange
  });
  const patch = (partial) => {
    const current = toDisplay(committed, twelveHour);
    setCommitted(fromDisplay({ ...current, ...partial }, twelveHour));
  };
  const display = toDisplay(committed, twelveHour);
  const serialize = (time) => {
    if (time == null) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return time.second != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : `${pad(time.hour)}:${pad(time.minute)}`;
  };
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
      children: /* @__PURE__ */ jsxs("div", { className, ...props({ "data-testid": testId }), children: [
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
            hourCycle: resolvedCycle,
            minuteStep,
            withSeconds,
            placeholder,
            locale: resolvedLocale,
            translations,
            size,
            variant,
            color,
            disabled,
            readOnly,
            invalid: isInvalid,
            ref,
            onBlur,
            classNames
          }
        ),
        name && /* @__PURE__ */ jsx("input", { type: "hidden", name, value: serialize(committed) })
      ] })
    }
  );
};

export { TimeInput };
