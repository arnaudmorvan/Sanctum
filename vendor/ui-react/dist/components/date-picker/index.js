"use client";
import { DatePicker } from '../../chunk-WN767DZB.js';
export { DatePicker } from '../../chunk-WN767DZB.js';
import '../../chunk-PVLZ5P54.js';
import '../../chunk-XONFFMYI.js';
import '../../chunk-4NXCBDHI.js';
import '../../chunk-GHV47RCM.js';
import { dateToCalendarValue } from '../../chunk-F36B6WYQ.js';
import '../../chunk-UVYTJQTJ.js';
import '../../chunk-3KHUHVCD.js';
import '../../chunk-RNXO7W2J.js';
import '../../chunk-5FDOOG4J.js';
import '../../chunk-PRHZ6FHV.js';
import '../../chunk-MWXEQ5QX.js';
import '../../chunk-AL57HMNZ.js';
import '../../chunk-IG7FBZVM.js';
import '../../chunk-BEL75C7N.js';
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
