import { fromDate } from '@internationalized/date';

// src/lib/date-value.ts
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

export { calendarValueToDate, dateToCalendarValue, fromArkValues, toArkValues };
//# sourceMappingURL=chunk-TCWYBVIL.js.map
//# sourceMappingURL=chunk-TCWYBVIL.js.map