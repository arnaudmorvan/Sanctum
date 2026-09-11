"use client";
import { DatePicker } from '../../chunk-6IYVOPTS.js';
export { DatePicker } from '../../chunk-6IYVOPTS.js';
import '../../chunk-VSUMISTM.js';
import '../../chunk-OWMQ7H6E.js';
import '../../chunk-7TSYEYGF.js';
import '../../chunk-UNMCKHMI.js';
import { dateToCalendarValue } from '../../chunk-TCWYBVIL.js';
import '../../chunk-UVYTJQTJ.js';
import '../../chunk-5FDOOG4J.js';
import '../../chunk-E2Y73U4Z.js';
import '../../chunk-FSC5UYO3.js';
import '../../chunk-JCOCDKAC.js';
import '../../chunk-GLWR5YCB.js';
import '../../chunk-V47CYH4E.js';
import '../../chunk-BEL75C7N.js';
import '../../chunk-IG7FBZVM.js';
import '../../chunk-RNXO7W2J.js';
import '../../chunk-WYCMIIRR.js';
import '../../chunk-SAS62TWA.js';
import { getLocalTimeZone, today, isWeekend, isSameDay } from '@internationalized/date';
export { getLocalTimeZone } from '@internationalized/date';
import { jsx } from 'react/jsx-runtime';

var WEEKEND_LOCALE = "en-US";
var disablePast = () => {
  const timeZone = getLocalTimeZone();
  const boundary = today(timeZone);
  return (date) => dateToCalendarValue(date, timeZone).compare(boundary) < 0;
};
var disableFuture = () => {
  const timeZone = getLocalTimeZone();
  const boundary = today(timeZone);
  return (date) => dateToCalendarValue(date, timeZone).compare(boundary) > 0;
};
var disableWeekends = () => {
  const timeZone = getLocalTimeZone();
  return (date) => isWeekend(dateToCalendarValue(date, timeZone), WEEKEND_LOCALE);
};
var beforeDate = (boundary) => {
  const timeZone = getLocalTimeZone();
  const boundaryValue = dateToCalendarValue(boundary, timeZone);
  return (date) => dateToCalendarValue(date, timeZone).compare(boundaryValue) < 0;
};
var afterDate = (boundary) => {
  const timeZone = getLocalTimeZone();
  const boundaryValue = dateToCalendarValue(boundary, timeZone);
  return (date) => dateToCalendarValue(date, timeZone).compare(boundaryValue) > 0;
};
var disableDates = (dates) => {
  const timeZone = getLocalTimeZone();
  const boundaries = dates.map((date) => dateToCalendarValue(date, timeZone));
  return (date) => {
    const value = dateToCalendarValue(date, timeZone);
    return boundaries.some((boundary) => isSameDay(value, boundary));
  };
};
var anyOf = (...predicates) => (date) => predicates.some((predicate) => predicate(date));
var allOf = (...predicates) => (date) => predicates.every((predicate) => predicate(date));
var DateRangePicker = (props) => /* @__PURE__ */ jsx(DatePicker, { ...props, range: true });
var DateTimePicker = (props) => /* @__PURE__ */ jsx(DatePicker, { ...props, withTime: true });
var DateTimeRangePicker = (props) => /* @__PURE__ */ jsx(DatePicker, { ...props, range: true, withTime: true });

export { DateRangePicker, DateTimePicker, DateTimeRangePicker, afterDate, allOf, anyOf, beforeDate, disableDates, disableFuture, disablePast, disableWeekends };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map