"use client";
import { Tabs } from '../../chunk-RQR5H2PG.js';
import { Text } from '../../chunk-3XYZZCLG.js';
import { Divider } from '../../chunk-XDS772KJ.js';
import { calendarValueToDate, dateToCalendarValue } from '../../chunk-TCWYBVIL.js';
import { mergeRefs } from '../../chunk-UVYTJQTJ.js';
import { Button } from '../../chunk-JCOCDKAC.js';
import { Popover } from '../../chunk-GLWR5YCB.js';
import '../../chunk-C7V53TG4.js';
import { ActionIcon } from '../../chunk-V47CYH4E.js';
import { useUncontrolled } from '../../chunk-BEL75C7N.js';
import '../../chunk-RNXO7W2J.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { getLocalTimeZone, startOfWeek, startOfMonth, endOfWeek, endOfMonth, startOfYear, endOfYear, isWeekend } from '@internationalized/date';
import { ark } from '@ark-ui/react';
import { useRef, useCallback, useSyncExternalStore, Fragment as Fragment$1, useState, useEffect } from 'react';
import { match } from 'ts-pattern';
import { cva } from 'class-variance-authority';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { ChevronRightIcon, ChevronLeftIcon, ArrowLeftIcon, XIcon } from 'lucide-react';
import { usePresence } from '@ark-ui/react/presence';

var WEEKEND_LOCALE = "en-US";
var disableOutsideHours = (startHour, endHour) => {
  const minutesOfDay = (date) => date.getHours() * 60 + date.getMinutes();
  return ({ start, end }) => minutesOfDay(start) < startHour * 60 || minutesOfDay(start) >= endHour * 60 || minutesOfDay(end) > endHour * 60;
};
var disablePast = (now) => {
  return ({ start }) => start.getTime() < (now ?? /* @__PURE__ */ new Date()).getTime();
};
var disableWeekends = () => {
  const timeZone = getLocalTimeZone();
  return ({ start }) => isWeekend(dateToCalendarValue(start, timeZone), WEEKEND_LOCALE);
};
var disableDateRanges = (ranges) => {
  return (slot) => ranges.some(
    (range) => slot.start.getTime() < range.end.getTime() && range.start.getTime() < slot.end.getTime()
  );
};
var anyOf = (...predicates) => (range) => predicates.some((predicate) => predicate(range));
var allOf = (...predicates) => (range) => predicates.every((predicate) => predicate(range));
function resolveWeekStartDay(startOfWeek) {
  return startOfWeek === "relative" ? void 0 : startOfWeek;
}
var toZoned = (date, timeZone) => dateToCalendarValue(date, timeZone);
var midnightOf = (value) => value.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
function getVisibleRange(view, date, options) {
  const { timeZone, locale, startOfWeek: startOfWeek$1, visibleDays = 7 } = options;
  const value = toZoned(date, timeZone);
  const weekStartDay = resolveWeekStartDay(startOfWeek$1);
  const range = match(view).with("days", () => {
    const start = startOfWeek$1 === "relative" || visibleDays === 1 ? midnightOf(value) : midnightOf(startOfWeek(value, locale, weekStartDay));
    return { start, end: start.add({ days: visibleDays }) };
  }).with("month", () => {
    const start = startOfWeek(midnightOf(startOfMonth(value)), locale, weekStartDay);
    const end = endOfWeek(midnightOf(endOfMonth(value)), locale, weekStartDay).add({ days: 1 });
    return { start, end };
  }).with("year", () => {
    const start = midnightOf(startOfYear(value));
    const end = midnightOf(endOfYear(value)).add({ days: 1 });
    return { start, end };
  }).exhaustive();
  return {
    start: calendarValueToDate(range.start, timeZone),
    end: calendarValueToDate(range.end, timeZone)
  };
}
function paginateDate(view, date, direction, options) {
  const value = toZoned(date, options.timeZone);
  const duration = match(view).with("days", () => ({ days: options.visibleDays ?? 7 })).with("month", () => ({ months: 1 })).with("year", () => ({ years: 1 })).exhaustive();
  const next = direction === 1 ? value.add(duration) : value.subtract(duration);
  return calendarValueToDate(next, options.timeZone);
}
function eventOccursOnDay(event, day, timeZone) {
  const dayStart = midnightOf(toZoned(day, timeZone));
  const dayRange = {
    start: calendarValueToDate(dayStart, timeZone),
    end: calendarValueToDate(dayStart.add({ days: 1 }), timeZone)
  };
  return rangesOverlap(event, dayRange);
}
function rangesOverlap(a, b) {
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}
function rangeOverlapsAny(range, candidates, excludeId) {
  return candidates.some((c) => c.id !== excludeId && rangesOverlap(range, c));
}
function resolveOverlapCandidates(data, staticEvents, against) {
  if (against === "event") return data;
  if (against === "static") return staticEvents;
  return [...data, ...staticEvents];
}
function checkRangeCommit(range, options) {
  const { slotDisabled, preventOverlap, overlapCandidates = [], excludeId } = options;
  if (slotDisabled?.(range)) return { ok: false, reason: "disabled" };
  if (preventOverlap && rangeOverlapsAny(range, overlapCandidates, excludeId)) {
    return { ok: false, reason: "overlap" };
  }
  return { ok: true };
}
function dayKey(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}
function enumerateDays(range, timeZone) {
  const days = [];
  let cursor = range.start;
  while (cursor.getTime() < range.end.getTime()) {
    days.push(cursor);
    cursor = paginateDate("days", cursor, 1, { timeZone, visibleDays: 1 });
  }
  return days;
}
function enumerateMonths(range, timeZone) {
  const months = [];
  let cursor = range.start;
  while (cursor.getTime() < range.end.getTime()) {
    months.push(cursor);
    cursor = paginateDate("month", cursor, 1, { timeZone });
  }
  return months;
}
function isSameMonth(a, b, timeZone) {
  const za = toZoned(a, timeZone);
  const zb = toZoned(b, timeZone);
  return za.year === zb.year && za.month === zb.month;
}
function isToday(day, now, timeZone) {
  return dayKey(day, timeZone) === dayKey(now, timeZone);
}
function timeRangeLabel(start, end, locale) {
  const formatter = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });
  return `${formatter.format(start)} \u2013 ${formatter.format(end)}`;
}
function clockTimeLabel(date, locale) {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(date);
}
function allDayRangeLabel(start, end, timeZone, locale) {
  const lastDay = new Date(end.getTime() - 1);
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone });
  if (dayKey(start, timeZone) === dayKey(lastDay, timeZone)) return formatter.format(start);
  return formatter.formatRange(start, lastDay).normalize("NFKC");
}
function formatScheduleTitle(view, date, options) {
  const { timeZone, locale, startOfWeek, visibleDays } = options;
  return match(view).with("days", () => {
    const days = visibleDays ?? 7;
    if (days === 1) {
      return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone }).format(date);
    }
    const range = getVisibleRange("days", date, {
      timeZone,
      locale: locale ?? "en-US",
      startOfWeek,
      visibleDays: days
    });
    const lastDay = paginateDate("days", range.end, -1, { timeZone, visibleDays: 1 });
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone }).formatRange(range.start, lastDay).normalize("NFKC");
  }).with(
    "month",
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone }).format(date)
  ).with("year", () => new Intl.DateTimeFormat(locale, { year: "numeric", timeZone }).format(date)).exhaustive();
}
function timeLabel(date, timeZone, locale) {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone }).format(
    date
  );
}
function durationLabel(start, end, locale) {
  const totalMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 6e4));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (hours > 0) {
    parts.push(
      new Intl.NumberFormat(locale, { style: "unit", unit: "hour", unitDisplay: "narrow" }).format(
        hours
      )
    );
  }
  if (minutes > 0 || hours === 0) {
    parts.push(
      new Intl.NumberFormat(locale, {
        style: "unit",
        unit: "minute",
        unitDisplay: "narrow"
      }).format(minutes)
    );
  }
  return parts.join(" ");
}
function resolveNextUpDayLabel(date, now, options) {
  const { timeZone, locale } = options;
  const dateKey = dayKey(date, timeZone);
  if (dateKey === dayKey(now, timeZone)) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "day");
  }
  const tomorrow = paginateDate("days", now, 1, { timeZone, visibleDays: 1 });
  if (dateKey === dayKey(tomorrow, timeZone)) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(1, "day");
  }
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone
  }).format(date);
}

// src/lib/dev-warn.ts
function devWarn(message) {
  console.warn(message);
}

// src/components/schedule/schedule-geometry.ts
function minutesFromMidnight(date) {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}
function minutesToPercent(minutes, totalWindowMinutes) {
  return totalWindowMinutes === 0 ? 0 : minutes / totalWindowMinutes * 100;
}
function pixelsToMinutes(pixels, pxPerMinute) {
  return pxPerMinute === 0 ? 0 : pixels / pxPerMinute;
}
function dateAtMinutes(day, minutes) {
  const base = new Date(day);
  base.setHours(0, 0, 0, 0);
  return new Date(base.getTime() + minutes * 6e4);
}
var MIN_SLOT_PX = 12;
var MIN_HOUR_HEIGHT_PX = 28;
var MAX_HOUR_HEIGHT_PX = 160;
function defaultHourHeight(slotDuration) {
  const slotsPerHour = 60 / slotDuration;
  return Math.min(MAX_HOUR_HEIGHT_PX, Math.max(MIN_HOUR_HEIGHT_PX, slotsPerHour * MIN_SLOT_PX));
}
var MAX_CASCADE_Z_INDEX = 15;
function columnInsets({ column, columnCount }) {
  const isLastColumn = column === columnCount - 1;
  if (column === 0) {
    const width2 = isLastColumn ? "calc(100% - var(--sch-column-gap, 0px))" : "calc(100% * var(--sch-column-fraction, 0.7) - var(--sch-column-gap, 0px))";
    return { left: "0%", width: width2, zIndex: 1 };
  }
  const leftPercent = column / columnCount * 100;
  const overlap = `${column} * var(--sch-column-overlap, 0px)`;
  const remaining = `${100 - leftPercent}% + ${overlap}`;
  const width = isLastColumn ? `calc(${remaining} - var(--sch-column-gap, 0px))` : `calc((${remaining}) * var(--sch-column-fraction, 0.7) - var(--sch-column-gap, 0px))`;
  return {
    left: `calc(${leftPercent}% - ${overlap})`,
    width,
    zIndex: Math.min(column + 1, MAX_CASCADE_Z_INDEX)
  };
}
function resolvePxPerMinute(dayColumnEl, rect) {
  const totalMinutes = Number(
    getComputedStyle(dayColumnEl).getPropertyValue("--sch-window-minutes")
  );
  if (!(totalMinutes > 0)) {
    devWarn(
      "Schedule: --sch-window-minutes missing or non-positive on the day-column \u2014 drag/resize/create geometry will be wrong."
    );
    return 0;
  }
  return (rect ?? dayColumnEl.getBoundingClientRect()).height / totalMinutes;
}
function nowIndicatorTop(now, startHour, endHour) {
  const totalWindowMinutes = (endHour - startHour) * 60;
  const rawPercent = minutesToPercent(minutesFromMidnight(now) - startHour * 60, totalWindowMinutes);
  return Math.min(Math.max(rawPercent, 0), 100);
}
function scrollElementToCenter(container, element, options = {}) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { behavior = reduceMotion ? "auto" : "smooth" } = options;
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const elementLeft = container.scrollLeft + elementRect.left - containerRect.left - container.clientLeft;
  const elementTop = container.scrollTop + elementRect.top - containerRect.top - container.clientTop;
  const desiredLeft = elementLeft - (container.clientWidth - elementRect.width) / 2;
  const desiredTop = elementTop - (container.clientHeight - elementRect.height) / 2;
  const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);
  const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
  const left = Math.max(0, Math.min(desiredLeft, maxLeft));
  const top = Math.max(0, Math.min(desiredTop, maxTop));
  container.scrollTo({ left, top, behavior });
}
var EPOCH = /* @__PURE__ */ new Date(0);
function useNow(override) {
  const clockRef = useRef(override ?? /* @__PURE__ */ new Date());
  const subscribeToClock = useCallback(
    (onStoreChange) => {
      if (override) return () => {
      };
      const tick = () => {
        clockRef.current = /* @__PURE__ */ new Date();
        onStoreChange();
      };
      const msToNextMinute = 6e4 - Date.now() % 6e4;
      let interval;
      const timeout = setTimeout(() => {
        tick();
        interval = setInterval(tick, 6e4);
      }, msToNextMinute);
      return () => {
        clearTimeout(timeout);
        if (interval) clearInterval(interval);
      };
    },
    [override]
  );
  const getSnapshot = useCallback(() => override ?? clockRef.current, [override]);
  const getServerSnapshot = useCallback(() => override ?? EPOCH, [override]);
  return useSyncExternalStore(subscribeToClock, getSnapshot, getServerSnapshot);
}
var nowLineWrapper = cva(
  ["pointer-events-none absolute inset-x-0", "[--sch-now-line-color:var(--color-red-500)]"],
  // `marker` sits above the sticky hour gutter (z-30, `schedule-timed-grid.tsx`)
  // so its dot — deliberately centered on the day column's own left edge,
  // spilling half its width outward — isn't clipped by the gutter's opaque
  // surface whenever today is the leftmost visible column. Safe to sit above
  // the header/all-day block's z-40 too: this only ever renders inside a
  // `DayColumn` (row-2), which never shares screen space with that row-1 block.
  { variants: { variant: { marker: "z-20", guide: "z-10" } } }
);
var nowLineMark = cva("absolute inset-x-0 top-0 -translate-y-1/2 rounded-full", {
  variants: {
    variant: {
      marker: "border-t-2 border-(--sch-now-line-color)",
      guide: "border-t border-(--sch-now-line-color)/30"
    }
  }
});
function NowCursorLine({
  now,
  nowRef,
  startHour,
  endHour,
  variant = "marker",
  hideDot = false,
  className
}) {
  const current = useNow(now);
  const top = nowIndicatorTop(current, startHour, endHour);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: nowRef,
      "aria-hidden": true,
      "data-schedule-part": "now-indicator",
      "data-variant": variant,
      className: cn(nowLineWrapper({ variant }), className),
      style: { top: `${top}%` },
      children: [
        /* @__PURE__ */ jsx("div", { className: nowLineMark({ variant }) }),
        variant === "marker" && !hideDot ? /* @__PURE__ */ jsx(
          "div",
          {
            "data-schedule-part": "now-indicator-dot",
            className: "absolute top-0 inset-s-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--sch-now-line-color)"
          }
        ) : null
      ]
    }
  );
}
function NowCursorLabel({
  now,
  startHour,
  endHour,
  locale,
  className
}) {
  const current = useNow(now);
  const top = nowIndicatorTop(current, startHour, endHour);
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": true,
      "data-schedule-part": "now-indicator-label",
      className: cn(
        "pointer-events-none absolute -inset-e-0.75 -translate-y-1/2 whitespace-nowrap rounded-full bg-(--sch-now-line-color) px-1.5 py-0.5 text-[10px] font-medium leading-none text-white",
        "[--sch-now-line-color:var(--color-red-500)]",
        className
      ),
      style: { top: `${top}%` },
      children: clockTimeLabel(current, locale)
    }
  );
}
function HourGutterTick({
  hour,
  label,
  now,
  hideWhenCurrent,
  className
}) {
  return hideWhenCurrent ? /* @__PURE__ */ jsx(HourGutterTickLive, { hour, label, now, className }) : /* @__PURE__ */ jsx("div", { className, children: label });
}
function HourGutterTickLive({
  hour,
  label,
  now,
  className
}) {
  const current = useNow(now);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(className, "opacity-100 transition-opacity", {
        "opacity-0": hideOverlapHour({ hour, current })
      }),
      children: label
    }
  );
}
function hideOverlapHour({ hour, current }) {
  const hours = current.getHours();
  const minutes = current.getMinutes();
  return hours === hour && minutes <= 30 || hours + 1 === hour && minutes > 50;
}
function ScheduleEventDetailsContent({
  event,
  locale,
  timeZone,
  renderEventDetails
}) {
  if (renderEventDetails) return renderEventDetails(event);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex flex-col gap-1",
      "data-schedule-part": "event-details",
      "data-color": event.color ?? "pink",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          event.icon != null ? /* @__PURE__ */ jsx("span", { className: "mt-0.5 shrink-0 text-(--c-text) [&_svg]:size-4", children: event.icon }) : null,
          /* @__PURE__ */ jsx("p", { className: "min-w-0 flex-1 font-medium text-sm", children: event.title })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-light-500 text-xs dark:text-gray-dark-400", children: event.allDay ? allDayRangeLabel(event.start, event.end, timeZone ?? getLocalTimeZone(), locale) : timeRangeLabel(event.start, event.end, locale) }),
        event.description ? (
          // `div`, not `p` — `description` is `ReactNode`, so it can carry
          // block-level content (a list, a nested `div`); a `<p>` can only
          // hold phrasing content, and nesting a block element inside one is
          // invalid HTML that browsers silently "fix" by auto-closing the
          // `<p>` early during parsing — a real, verified SSR hydration
          // mismatch (server-rendered HTML re-parsed differently than React's
          // own tree), not just a lint nicety.
          /* @__PURE__ */ jsx("div", { className: "text-gray-light-700 text-sm dark:text-gray-dark-300", children: event.description })
        ) : null
      ]
    }
  );
}

// src/components/schedule/schedule-event-styles.ts
var EVENT_COLOR_CLASSES = "border border-(--c-text)/30 bg-(--c-soft) text-(--c-text)";
var autoHeightPanel = cn(
  "flex flex-col overflow-hidden",
  "[interpolate-size:allow-keywords] transition-[height] duration-150",
  "ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
);
function ScheduleEventListPopoverContent({
  events,
  activeEvent,
  onSelectEvent,
  onBack,
  renderEventDetails,
  renderList,
  locale,
  timeZone,
  translations,
  itemClassName
}) {
  const body = activeEvent ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Popover.Header, { className: "flex items-center", children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.stopPropagation();
          onBack();
        },
        "aria-label": translations.back,
        className: "-ms-1 flex items-center gap-1 rounded-sm px-1 py-0.5 text-gray-light-500 text-xs hover:bg-black/5 dark:text-gray-dark-400 dark:hover:bg-white/8",
        children: [
          /* @__PURE__ */ jsx(ArrowLeftIcon, { className: "size-3.5" }),
          translations.back
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(Popover.Body, { children: /* @__PURE__ */ jsx(
      ScheduleEventDetailsContent,
      {
        event: activeEvent,
        locale,
        timeZone,
        renderEventDetails
      }
    ) })
  ] }) : renderList ? /* @__PURE__ */ jsx(Popover.Body, { children: renderList(events, onSelectEvent) }) : events.length === 0 ? /* @__PURE__ */ jsx(Popover.Body, { children: /* @__PURE__ */ jsx("p", { className: "px-1 py-2 text-center text-gray-light-500 text-xs dark:text-gray-dark-400", children: translations.empty }) }) : /* @__PURE__ */ jsx(Popover.Body, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-0.5", children: events.map((event) => /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "data-color": event.color ?? "pink",
      onClick: (e) => {
        e.stopPropagation();
        onSelectEvent(event);
      },
      className: itemClassName ?? "flex items-center gap-1.5 rounded-xs px-1.5 py-1 text-start text-xs hover:bg-black/5 dark:hover:bg-white/8",
      children: [
        /* @__PURE__ */ jsx("span", { className: "size-1.5 shrink-0 rounded-full bg-(--c-solid)" }),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: event.title })
      ]
    },
    event.id
  )) }) });
  return /* @__PURE__ */ jsx("div", { className: autoHeightPanel, children: body });
}

// src/components/schedule/schedule-types.ts
var DEFAULT_TRANSLATIONS = {
  now: "Now",
  previous: "Previous",
  next: "Next",
  days: "Week",
  month: "Month",
  year: "Year",
  empty: "No events",
  removeEvent: "Remove event",
  eventCount: "{count} events",
  back: "Back",
  allDay: "All day",
  eventCreated: "New event created, {range}",
  eventRemoved: "{title} removed"
};
var resolveScheduleTranslations = (overrides) => ({ ...DEFAULT_TRANSLATIONS, ...overrides });
var eventCountLabel = (template, count) => template.replace("{count}", String(count));
function isOverlapGestureEnabled(preventOverlap, gesture) {
  if (!preventOverlap) return false;
  return preventOverlap === true || preventOverlap.includes(gesture);
}
function resolveOverlapPrevention(preventOverlap) {
  if (!preventOverlap) return { gestures: false, against: "both" };
  if (preventOverlap === true) return { gestures: true, against: "both" };
  return {
    gestures: preventOverlap.gestures ?? true,
    against: preventOverlap.against ?? "both"
  };
}
function isEditGestureEnabled(editable, gesture) {
  if (!editable) return false;
  return editable === true || editable.includes(gesture);
}
function isEventGestureEnabled(scheduleGrant, event, gesture) {
  if (!scheduleGrant) return false;
  if (event.editable === void 0) return true;
  if (!event.editable) return false;
  return event.editable === true || event.editable.includes(gesture);
}
function eventEditGestureExceedsSchedule(scheduleEditable, event) {
  if (!event.editable) return [];
  const requested = event.editable === true ? ["drag", "resize", "remove"] : event.editable;
  return requested.filter((gesture) => !isEditGestureEnabled(scheduleEditable, gesture));
}
function ScheduleOverflowPopover({
  events,
  onEventClick,
  onOverflowClick,
  renderEventDetails,
  locale,
  timeZone,
  translations,
  classNames,
  renderTrigger
}) {
  const [open, setOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const showPopover = onOverflowClick == null;
  const activeEvent = activeEventId ? events.find((e) => e.id === activeEventId) ?? null : null;
  const handleSelectEvent = (event) => {
    if (onEventClick) {
      onEventClick(event);
      setOpen(false);
    } else {
      setActiveEventId(event.id);
    }
  };
  const trigger = renderTrigger({
    onClick: onOverflowClick ? (e) => {
      e.stopPropagation();
      onOverflowClick(events);
    } : void 0,
    "aria-label": eventCountLabel(translations.eventCount, events.length),
    ...showPopover ? { "aria-haspopup": "dialog", "aria-expanded": open } : {}
  });
  if (!showPopover) return trigger;
  return /* @__PURE__ */ jsxs(
    Popover.Root,
    {
      open,
      onOpenChange: (d) => {
        setOpen(d.open);
        if (!d.open) setActiveEventId(null);
      },
      width: "auto",
      children: [
        /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: trigger }),
        /* @__PURE__ */ jsx(Popover.Content, { className: cn("w-72", classNames?.content), children: /* @__PURE__ */ jsx(
          ScheduleEventListPopoverContent,
          {
            events,
            activeEvent,
            onSelectEvent: handleSelectEvent,
            onBack: () => setActiveEventId(null),
            renderEventDetails,
            locale,
            timeZone,
            translations,
            itemClassName: classNames?.item
          }
        ) })
      ]
    }
  );
}
var stickySurface = "bg-brand-50/90 backdrop-blur-lg dark:bg-brand-950/85";
function sweepLanes(sorted, maxLanes, dayIndexOf) {
  const activeLaneEnds = [];
  const bars = [];
  const overflowByDay = /* @__PURE__ */ new Map();
  let laneCount = 0;
  for (const { event, start, end } of sorted) {
    const startMs = start.getTime();
    for (let i = 0; i < activeLaneEnds.length; i++) {
      if (activeLaneEnds[i] !== null && activeLaneEnds[i] <= startMs) {
        activeLaneEnds[i] = null;
      }
    }
    let lane = activeLaneEnds.indexOf(null);
    if (lane === -1) lane = activeLaneEnds.length;
    const colStart = dayIndexOf(start);
    const colEnd = dayIndexOf(new Date(end.getTime() - 1)) + 1;
    if (lane >= maxLanes) {
      for (let i = colStart; i < colEnd; i++) {
        const existing = overflowByDay.get(i);
        if (existing) existing.push(event);
        else overflowByDay.set(i, [event]);
      }
      continue;
    }
    if (lane === activeLaneEnds.length) activeLaneEnds.push(null);
    activeLaneEnds[lane] = end.getTime();
    bars.push({ event, lane, colStart, colEnd });
    laneCount = Math.max(laneCount, lane + 1);
  }
  return { bars, overflowByDay, laneCount };
}
function computeAllDayLayout(days, events, maxLanes, timeZone) {
  if (days.length === 0 || events.length === 0) {
    return { rowCount: 0, bars: [], overflowByDay: /* @__PURE__ */ new Map() };
  }
  const windowStart = days[0];
  const windowEnd = paginateDate("days", days[days.length - 1], 1, {
    timeZone,
    visibleDays: 1
  });
  const dayIndexOf = (date) => {
    for (let i = days.length - 1; i >= 0; i--) {
      if (date.getTime() >= days[i].getTime()) return i;
    }
    return 0;
  };
  const clipped = events.map((event, index) => ({
    event,
    index,
    // stable tie-break — Array#sort's own stability already gives us
    // this for equal-key pairs, but a duration+start tie is genuinely
    // possible (two same-day events), so the key needs it explicitly.
    start: event.start.getTime() < windowStart.getTime() ? windowStart : event.start,
    end: event.end.getTime() > windowEnd.getTime() ? windowEnd : event.end
  }));
  const sorted = [...clipped].sort((a, b) => {
    const durationA = a.event.end.getTime() - a.event.start.getTime();
    const durationB = b.event.end.getTime() - b.event.start.getTime();
    return durationB - durationA || a.start.getTime() - b.start.getTime() || a.index - b.index;
  });
  const safeMaxLanes = Math.max(1, maxLanes);
  const atFullCap = sweepLanes(sorted, safeMaxLanes, dayIndexOf);
  if (atFullCap.overflowByDay.size === 0) {
    return { rowCount: atFullCap.laneCount, bars: atFullCap.bars, overflowByDay: /* @__PURE__ */ new Map() };
  }
  const reduced = sweepLanes(sorted, safeMaxLanes - 1, dayIndexOf);
  return { rowCount: safeMaxLanes, bars: reduced.bars, overflowByDay: reduced.overflowByDay };
}
function AllDayEventBar({
  event,
  colStart,
  colEnd,
  lane,
  onEventClick,
  renderEventDetails,
  locale,
  timeZone,
  detailsPopoverClassName
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const showDetailsPopover = onEventClick == null;
  const style = { gridColumn: `${colStart + 2} / ${colEnd + 2}`, gridRow: lane + 1 };
  const button = /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "data-schedule-part": "all-day-event",
      "data-kind": event.kind,
      "data-color": event.color ?? "pink",
      ...props({ "data-testid": event.testId ?? event.id }),
      onClick: (e) => {
        e.stopPropagation();
        onEventClick?.(event);
      },
      "aria-label": `${event.title}, ${allDayRangeLabel(event.start, event.end, timeZone, locale)}`,
      ...showDetailsPopover ? { "aria-haspopup": "dialog", "aria-expanded": detailsOpen } : {},
      style,
      className: cn(
        "mx-0.5 my-px block truncate rounded-xs px-1.5 py-0.5 text-start text-xs",
        EVENT_COLOR_CLASSES
      ),
      children: [
        event.icon != null ? /* @__PURE__ */ jsx("span", { className: "mr-1 inline-flex align-[-1px] [&_svg]:size-3", children: event.icon }) : null,
        event.title
      ]
    }
  );
  if (!showDetailsPopover) return button;
  return /* @__PURE__ */ jsxs(Popover.Root, { open: detailsOpen, onOpenChange: (d) => setDetailsOpen(d.open), width: "auto", children: [
    /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(Popover.Content, { className: cn("max-w-64", detailsPopoverClassName), children: /* @__PURE__ */ jsx(Popover.Body, { children: /* @__PURE__ */ jsx(
      ScheduleEventDetailsContent,
      {
        event,
        locale,
        timeZone,
        renderEventDetails
      }
    ) }) })
  ] });
}
function AllDayOverflowChip({
  dayIndex,
  lane,
  events,
  onEventClick,
  onOverflowClick,
  renderEventDetails,
  locale,
  timeZone,
  translations,
  classNames
}) {
  const style = { gridColumn: dayIndex + 2, gridRow: lane + 1 };
  return /* @__PURE__ */ jsx(
    ScheduleOverflowPopover,
    {
      events,
      onEventClick,
      onOverflowClick,
      renderEventDetails,
      locale,
      timeZone,
      translations,
      classNames,
      renderTrigger: (triggerProps) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "data-schedule-part": "all-day-overflow-chip",
          ...triggerProps,
          style,
          className: cn(
            "mx-0.5 my-px truncate rounded-xs px-1.5 py-0.5 text-start text-xs",
            "bg-(--c-soft) text-(--c-text) hover:bg-(--c-soft-hover)",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--c-solid)",
            classNames?.root
          ),
          children: `+${events.length}`
        }
      )
    }
  );
}
function ScheduleAllDayRow({
  days,
  events,
  maxAllDayRows,
  rowOffset,
  timeZone,
  onEventClick,
  onOverflowClick,
  renderEventDetails,
  locale,
  translations,
  classNames
}) {
  if (events.length === 0) return null;
  const { rowCount, bars, overflowByDay } = computeAllDayLayout(
    days,
    events,
    maxAllDayRows,
    timeZone
  );
  const hasOverflow = overflowByDay.size > 0;
  const overflowLane = rowCount - 1;
  const laneOffset = rowOffset - 1;
  const visualBars = [...bars].sort((a, b) => a.lane - b.lane || a.colStart - b.colStart);
  const overflowEntries = Array.from(overflowByDay.entries()).sort(([a], [b]) => a - b);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "sticky inset-s-0 flex items-center justify-end pe-2 py-0.5 text-[10px]",
          "text-gray-light-500 dark:text-gray-dark-500",
          stickySurface
        ),
        style: { gridColumn: 1, gridRow: `${rowOffset} / ${rowOffset + rowCount}` },
        children: translations.allDay
      }
    ),
    visualBars.map(({ event, lane, colStart, colEnd }) => /* @__PURE__ */ jsx(
      AllDayEventBar,
      {
        event,
        colStart,
        colEnd,
        lane: lane + laneOffset,
        onEventClick,
        renderEventDetails,
        locale,
        timeZone,
        detailsPopoverClassName: classNames?.eventDetailsPopover
      },
      event.id
    )),
    hasOverflow ? overflowEntries.map(
      ([dayIndex, hidden]) => (
        // A "+1" chip costs exactly the same row space as just showing
        // that one event would — there's nothing to disclose a lone
        // hidden event *behind*, so render it as a real (single-day)
        // pill instead. Only 2+ genuinely benefits from collapsing.
        hidden.length === 1 ? /* @__PURE__ */ jsx(
          AllDayEventBar,
          {
            event: hidden[0],
            colStart: dayIndex,
            colEnd: dayIndex + 1,
            lane: overflowLane + laneOffset,
            onEventClick,
            renderEventDetails,
            locale,
            timeZone,
            detailsPopoverClassName: classNames?.eventDetailsPopover
          },
          hidden[0]?.id
        ) : /* @__PURE__ */ jsx(
          AllDayOverflowChip,
          {
            dayIndex,
            lane: overflowLane + laneOffset,
            events: hidden,
            onEventClick,
            onOverflowClick,
            renderEventDetails,
            locale,
            timeZone,
            translations,
            classNames: classNames?.overflowChip
          },
          dayIndex
        )
      )
    ) : null
  ] });
}
function ScheduleCreateDraft({ className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": true,
      "data-schedule-part": "create-draft",
      className: cn(
        "pointer-events-none absolute inset-x-0 hidden rounded-sm border-2 border-dashed",
        "border-brand-500/60 bg-brand-500/10 data-active:block",
        "data-invalid:border-red-500/60 data-invalid:bg-red-500/10",
        className
      ),
      style: { top: "var(--sch-create-top, 0px)", height: "var(--sch-create-height, 0px)" }
    }
  );
}
function ScheduleDisabledOverlay({
  className,
  style
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": true,
      "data-schedule-part": "disabled-overlay",
      style,
      className: cn(
        "pointer-events-auto absolute inset-0 cursor-not-allowed",
        "bg-black/4 dark:bg-white/6",
        className
      )
    }
  );
}

// src/components/schedule/schedule-snap.ts
function snapToIncrement(minutes, incrementMinutes) {
  if (incrementMinutes <= 0) return minutes;
  return Math.round(minutes / incrementMinutes) * incrementMinutes;
}
function addSnappedMinutes(date, deltaMinutes, incrementMinutes) {
  const snapped = snapToIncrement(deltaMinutes, incrementMinutes);
  return new Date(date.getTime() + snapped * 6e4);
}
var CLICK_SLOP = 5;
var resetVisual = (el) => {
  el.style.transition = "";
  el.style.removeProperty("--sch-drag-offset-y");
  delete el.dataset["invalid"];
};
var flashRejected = (el, reason) => {
  el.style.transition = "transform 120ms ease-out";
  el.style.transform = "scale(0.98)";
  el.dataset["scheduleRejectReason"] = reason;
  requestAnimationFrame(() => {
    el.style.transform = "";
    el.style.transition = "";
    delete el.dataset["scheduleRejectReason"];
  });
};
function useEventDrag({
  event,
  enabled = true,
  slotDuration,
  slotDisabled,
  preventOverlap,
  overlapCandidates,
  onEventChange,
  onEventClick
}) {
  const dragRef = useRef(null);
  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    const target = e.target;
    if (target.closest("[data-schedule-part='resize-handle'],[data-schedule-part='remove']")) return;
    const dayColumnEl = e.currentTarget.closest("[data-schedule-part='day-column']") ?? e.currentTarget;
    dragRef.current = {
      pointerId: e.pointerId,
      startClientY: e.clientY,
      maxAbsDelta: 0,
      pxPerMinute: resolvePxPerMinute(dayColumnEl)
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback(
    (e) => {
      const state = dragRef.current;
      if (!state || e.pointerId !== state.pointerId) return;
      const dy = e.clientY - state.startClientY;
      state.maxAbsDelta = Math.max(state.maxAbsDelta, Math.abs(dy));
      if (!enabled) return;
      const el = e.currentTarget;
      el.style.transition = "none";
      el.style.setProperty("--sch-drag-offset-y", `${dy}px`);
      const deltaMinutes = pixelsToMinutes(dy, state.pxPerMinute);
      const candidate = {
        start: addSnappedMinutes(event.start, deltaMinutes, slotDuration),
        end: addSnappedMinutes(event.end, deltaMinutes, slotDuration)
      };
      const invalid = !checkRangeCommit(candidate, {
        slotDisabled,
        preventOverlap,
        overlapCandidates,
        excludeId: event.id
      }).ok;
      if (invalid) {
        el.dataset["invalid"] = "true";
      } else {
        delete el.dataset["invalid"];
      }
    },
    [enabled, event, slotDuration, slotDisabled, preventOverlap, overlapCandidates]
  );
  const onPointerUp = useCallback(
    (e) => {
      const state = dragRef.current;
      dragRef.current = null;
      if (!state || e.pointerId !== state.pointerId) return;
      const el = e.currentTarget;
      if (state.maxAbsDelta < CLICK_SLOP) {
        resetVisual(el);
        onEventClick?.(event);
        return;
      }
      if (!enabled) {
        resetVisual(el);
        return;
      }
      const dy = e.clientY - state.startClientY;
      const deltaMinutes = pixelsToMinutes(dy, state.pxPerMinute);
      const next = {
        start: addSnappedMinutes(event.start, deltaMinutes, slotDuration),
        end: addSnappedMinutes(event.end, deltaMinutes, slotDuration)
      };
      resetVisual(el);
      const result = checkRangeCommit(next, {
        slotDisabled,
        preventOverlap,
        overlapCandidates,
        excludeId: event.id
      });
      if (!result.ok) {
        flashRejected(el, result.reason);
        return;
      }
      onEventChange?.(event, next, "drag");
    },
    [
      event,
      enabled,
      slotDuration,
      slotDisabled,
      preventOverlap,
      overlapCandidates,
      onEventChange,
      onEventClick
    ]
  );
  const onPointerCancel = useCallback((e) => {
    const state = dragRef.current;
    dragRef.current = null;
    if (!state || e.pointerId !== state.pointerId) return;
    resetVisual(e.currentTarget);
  }, []);
  return {
    getBodyProps: () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      style: { touchAction: "none" }
    })
  };
}
var MINUTES_IN_DAY = 24 * 60;
var minutesSinceMidnight = (date) => date.getHours() * 60 + date.getMinutes();
function clampDelta(edge, deltaMinutes, event, minDurationMinutes) {
  const durationMinutes = (event.end.getTime() - event.start.getTime()) / 6e4;
  return edge === "start" ? Math.min(deltaMinutes, durationMinutes - minDurationMinutes) : Math.max(deltaMinutes, minDurationMinutes - durationMinutes);
}
function applyDelta(event, edge, deltaMinutes) {
  const deltaMs = deltaMinutes * 6e4;
  return edge === "start" ? { start: new Date(event.start.getTime() + deltaMs), end: event.end } : { start: event.start, end: new Date(event.end.getTime() + deltaMs) };
}
var findChip = (el) => el.closest("[data-schedule-part='event-chip']");
var resetVisual2 = (chip) => {
  if (!chip) return;
  chip.style.transition = "";
  delete chip.dataset["resizingEdge"];
  chip.style.removeProperty("--sch-resize-delta-y");
  delete chip.dataset["invalid"];
};
var flashRejected2 = (chip, reason) => {
  if (!chip) return;
  chip.style.transition = "transform 120ms ease-out";
  chip.style.transform = "scale(0.98)";
  chip.dataset["scheduleRejectReason"] = reason;
  requestAnimationFrame(() => {
    chip.style.transform = "";
    chip.style.transition = "";
    delete chip.dataset["scheduleRejectReason"];
  });
};
function useEventResize({
  event,
  edge,
  slotDuration,
  minDurationMinutes = slotDuration,
  slotDisabled,
  preventOverlap,
  overlapCandidates,
  onEventChange,
  locale
}) {
  const resizeRef = useRef(null);
  const resolveCandidate = useCallback(
    (rawDeltaMinutes) => {
      const snapped = snapToIncrement(rawDeltaMinutes, slotDuration);
      const clamped = clampDelta(edge, snapped, event, minDurationMinutes);
      const next = applyDelta(event, edge, clamped);
      const result = checkRangeCommit(next, {
        slotDisabled,
        preventOverlap,
        overlapCandidates,
        excludeId: event.id
      });
      return { next, result };
    },
    [
      edge,
      event,
      minDurationMinutes,
      slotDuration,
      slotDisabled,
      preventOverlap,
      overlapCandidates
    ]
  );
  const commit = useCallback(
    (rawDeltaMinutes) => {
      const { next, result } = resolveCandidate(rawDeltaMinutes);
      if (!result.ok) return result;
      onEventChange?.(event, next, "resize");
      return { ok: true };
    },
    [resolveCandidate, event, onEventChange]
  );
  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const dayColumnEl = e.currentTarget.closest("[data-schedule-part='day-column']") ?? e.currentTarget;
    resizeRef.current = {
      pointerId: e.pointerId,
      startClientY: e.clientY,
      pxPerMinute: resolvePxPerMinute(dayColumnEl)
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback(
    (e) => {
      const state = resizeRef.current;
      if (!state || e.pointerId !== state.pointerId) return;
      const chip = findChip(e.currentTarget);
      if (!chip) return;
      chip.style.transition = "none";
      chip.dataset["resizingEdge"] = edge;
      chip.style.setProperty("--sch-resize-delta-y", `${e.clientY - state.startClientY}px`);
      const { result } = resolveCandidate(
        pixelsToMinutes(e.clientY - state.startClientY, state.pxPerMinute)
      );
      if (!result.ok) {
        chip.dataset["invalid"] = "true";
      } else {
        delete chip.dataset["invalid"];
      }
    },
    [edge, resolveCandidate]
  );
  const onPointerUp = useCallback(
    (e) => {
      const state = resizeRef.current;
      resizeRef.current = null;
      if (!state || e.pointerId !== state.pointerId) return;
      const chip = findChip(e.currentTarget);
      const dy = e.clientY - state.startClientY;
      const result = commit(pixelsToMinutes(dy, state.pxPerMinute));
      resetVisual2(chip);
      if (!result.ok) flashRejected2(chip, result.reason);
    },
    [commit]
  );
  const onPointerCancel = useCallback((e) => {
    const state = resizeRef.current;
    resizeRef.current = null;
    if (!state || e.pointerId !== state.pointerId) return;
    resetVisual2(findChip(e.currentTarget));
  }, []);
  const onKeyDown = useCallback(
    (e) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      e.stopPropagation();
      const step = match({ shiftKey: e.shiftKey, altKey: e.altKey }).with({ shiftKey: true, altKey: false }, () => slotDuration * 4).with({ altKey: true, shiftKey: false }, () => 1).otherwise(() => slotDuration);
      const result = commit(e.key === "ArrowUp" ? -step : step);
      if (!result.ok) flashRejected2(findChip(e.currentTarget), result.reason);
    },
    [commit, slotDuration]
  );
  return {
    getHandleProps: () => {
      const value = edge === "start" ? event.start : event.end;
      return {
        role: "separator",
        "aria-orientation": "horizontal",
        tabIndex: 0,
        "aria-valuenow": minutesSinceMidnight(value),
        "aria-valuemin": 0,
        "aria-valuemax": MINUTES_IN_DAY,
        // `hour: "2-digit"`, not `"numeric"` — same SSR-hydration reasoning
        // as `schedule-dates.ts`'s `timeRangeLabel`: `"numeric"`'s
        // zero-padding isn't guaranteed identical between Node's and a
        // browser's bundled ICU data.
        "aria-valuetext": new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit"
        }).format(value),
        "aria-label": `${edge === "start" ? "Adjust start time" : "Adjust end time"} of ${event.title}`,
        "data-schedule-part": "resize-handle",
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onKeyDown,
        style: { touchAction: "none" }
      };
    }
  };
}
var SHOW_TIME_THRESHOLD = 32;
var flashRejected3 = (el, reason) => {
  el.style.transition = "transform 120ms ease-out";
  el.style.transform = "scale(0.98)";
  el.dataset["scheduleRejectReason"] = reason;
  requestAnimationFrame(() => {
    el.style.transform = "";
    el.style.transition = "";
    delete el.dataset["scheduleRejectReason"];
  });
};
var gripBase = cn(
  "absolute inset-x-0 z-10 flex h-(--sch-handle-hit-size) touch-none justify-center select-none",
  "[--sch-handle-hit-size:8px] [@media(pointer:coarse)]:[--sch-handle-hit-size:44px]",
  "cursor-ns-resize",
  "before:h-0.5 before:w-16 before:max-w-[70%] before:rounded-full",
  "before:bg-current/50 before:opacity-0 before:transition-[opacity,transform]",
  "group-hover:before:opacity-100",
  "group-focus-within:before:opacity-100",
  "focus-visible:before:opacity-100",
  "focus-visible:before:bg-primary",
  "focus-visible:before:ring-2 focus-visible:before:ring-(--c-solid) focus-visible:before:ring-offset-2 focus-visible:before:ring-offset-white dark:focus-visible:before:ring-offset-gray-dark-950",
  "focus-visible:outline-none"
);
var gripTop = "-top-0.25 -translate-y-full items-end pb-px group-hover:before:transform-[translateY(-2px)] group-focus-within:before:transform-[translateY(-2px)] focus-visible:before:transform-[translateY(-2px)]";
var gripBottom = "-bottom-0.25 translate-y-full items-start pt-px group-hover:before:transform-[translateY(2px)] group-focus-within:before:transform-[translateY(2px)] focus-visible:before:transform-[translateY(2px)]";
var chipShell = cva(
  [
    "absolute select-none rounded-sm px-2 py-1 text-start text-xs",
    EVENT_COLOR_CLASSES,
    // A soft card-like shadow — cheap depth cue that reads as "layered" once
    // `--sch-chip-z`/`columnInsets` below actually overlap two chips'
    // boxes; harmless (barely visible) on a lone, non-overlapping event.
    // Lifts slightly further on hover — the kit's own micro-interaction
    // idiom elsewhere is a background/border-color shift (Button, ActionIcon,
    // ChoiceCardGroup), never geometry, so a shadow bump (not a scale/
    // translate) is what stays "classy and sober" here while still reading
    // as a distinct hover cue.
    "shadow-sm shadow-black/10 dark:shadow-black/30",
    "transition-shadow duration-150 motion-reduce:transition-none",
    "hover:shadow-md hover:shadow-black/15 dark:hover:shadow-black/40",
    // Scoped to `left`/`width` only — the overlap-cascade's own outputs
    // (`columnInsets`, recomputed fresh every render whenever a sibling
    // event is created/removed/moved). Deliberately excludes `top`/`height`
    // (driven *live*, every pointermove, by drag/resize's own transform/
    // calc() preview vars below — a transition there would lag the pointer)
    // and z-index (paint-order only, not worth animating). Reuses the same
    // ease-out curve `schedule-chip-in`/`popover-in`/`toast-in` already
    // share, so this reads as the same family of motion, not a mismatched
    // one-off.
    "transition-[left,width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
    "transform-[translateY(var(--sch-drag-offset-y,0px))] top-(--sch-base-top) h-(--sch-base-height)",
    "data-[resizing-edge=start]:top-[calc(var(--sch-base-top)+var(--sch-resize-delta-y))]",
    "data-[resizing-edge=start]:h-[calc(var(--sch-base-height)-var(--sch-resize-delta-y))]",
    "data-[resizing-edge=end]:h-[calc(var(--sch-base-height)+var(--sch-resize-delta-y))]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--c-solid)",
    // `columnInsets` (`schedule-geometry.ts`) hands every chip a cascade
    // z-index via `--sch-chip-z` (higher `column` = further overlapping =
    // painted in front) instead of relying on DOM order, since overlapping
    // columns now genuinely intrude on each other's boxes instead of
    // sitting flush side by side.
    "z-(--sch-chip-z)",
    // The always-on `transform` above already makes every chip its own
    // stacking context (regardless of whether it's actually mid-drag), so a
    // later-starting event that begins right where an earlier one ends
    // paints entirely on top of it in plain DOM order — including that
    // earlier chip's resize-handle hit area, which straddles past its own
    // edge into exactly that shared boundary (see `gripBase`'s comment).
    // Promote the chip whenever it's actually being interacted with, so its
    // handles are always reachable regardless of the cascade's own z-index
    // (`MAX_CASCADE_Z_INDEX` in `schedule-geometry.ts` stays under this).
    // Still well under the gutter/header's z-30/z-40, so sticky chrome stays
    // on top.
    "hover:z-25 focus-within:z-25 data-resizing-edge:z-25",
    "w-(--sch-chip-w)",
    // Live drag/resize invalidity (`use-event-drag.ts`/`use-event-resize.ts`
    // write this on every `pointermove`) — overrides the event's own
    // `data-color` tint with red regardless of which color it is, the same
    // "one status signal" role `schedule-create-draft.tsx`'s own
    // `data-invalid:` variant plays for the create-drag ghost box.
    "data-invalid:bg-red-500/10 data-invalid:text-red-700 dark:data-invalid:text-red-400"
  ],
  {
    // Static and data chips render identically now (see the `color` note in
    // `schedule-types.ts`) — the only remaining distinction is behavioral,
    // not visual: a static event is read-only, so it never shows a grab
    // cursor.
    variants: {
      kind: {
        // No cursor class here — an interactive chip's cursor depends on
        // whether it's actually draggable right now (`editable`), not on
        // `kind` alone, so `InteractiveEventChip` applies it separately.
        event: "",
        static: "cursor-default"
      }
    }
  }
);
var chipShellStyle = (top, height, insets) => ({
  "--sch-base-top": `${top}%`,
  // `max(...)`, not a JS `Math.max` on a px number (correction after v1
  // shipped) — `height` is a percentage of the day-column's own real
  // (possibly-stretched) height now, so "at least 18px" can only be
  // expressed as a CSS floor, not a flat number computed once at render
  // time. `calc()` throughout this file's own resize-preview formulas
  // (`chipShell`'s `data-[resizing-edge=...]` variants) already mix
  // `%`/`px` operands freely, so nesting `max()` inside them needs no
  // further change there.
  "--sch-base-height": `max(${height}%, 18px)`,
  "--sch-chip-z": insets.zIndex,
  "--sch-chip-w": insets.width,
  left: insets.left
});
var detailsPopoverContent = "max-w-64";
function ChipContent({
  event,
  estimatedPxHeight,
  locale,
  classNames,
  reserveRemoveSpace
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1", children: [
    event.icon != null ? /* @__PURE__ */ jsx("span", { className: cn("mt-0.5 shrink-0 [&_svg]:size-3", classNames?.icon), children: event.icon }) : null,
    /* @__PURE__ */ jsxs("div", { className: cn("min-w-0 flex-1", reserveRemoveSpace && "pe-5"), children: [
      /* @__PURE__ */ jsx("p", { className: cn("truncate font-medium", classNames?.title), children: event.title }),
      estimatedPxHeight >= SHOW_TIME_THRESHOLD ? /* @__PURE__ */ jsx("p", { className: cn("truncate text-(--c-text)/80", classNames?.time), children: timeRangeLabel(event.start, event.end, locale) }) : null
    ] })
  ] });
}
function StaticEventChip({
  event,
  top,
  height,
  estimatedPxHeight,
  insets,
  onEventClick,
  renderEventDetails,
  locale,
  classNames,
  detailsPopoverClassName
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const showDetailsPopover = onEventClick == null;
  const button = /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "data-schedule-part": "event-chip",
      "data-kind": event.kind,
      "data-color": event.color ?? "pink",
      ...props({ "data-testid": event.testId ?? event.id }),
      onClick: onEventClick ? () => onEventClick(event) : void 0,
      "aria-label": `${event.title}, ${timeRangeLabel(event.start, event.end, locale)}`,
      ...showDetailsPopover ? { "aria-haspopup": "dialog", "aria-expanded": detailsOpen } : {},
      className: cn(chipShell({ kind: "static" }), "animate-schedule-chip-in", classNames?.root),
      style: chipShellStyle(top, height, insets),
      children: /* @__PURE__ */ jsx(
        ChipContent,
        {
          event,
          estimatedPxHeight,
          locale,
          classNames
        }
      )
    }
  );
  if (!showDetailsPopover) return button;
  return /* @__PURE__ */ jsxs(Popover.Root, { open: detailsOpen, onOpenChange: (d) => setDetailsOpen(d.open), width: "auto", children: [
    /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(Popover.Content, { className: cn(detailsPopoverContent, detailsPopoverClassName), children: /* @__PURE__ */ jsx(Popover.Body, { children: /* @__PURE__ */ jsx(
      ScheduleEventDetailsContent,
      {
        event,
        locale,
        renderEventDetails
      }
    ) }) })
  ] });
}
function InteractiveEventChip({
  event,
  top,
  height,
  estimatedPxHeight,
  insets,
  slotDuration,
  slotDisabled,
  editableDrag,
  editableResize,
  editableRemove,
  preventOverlapOnDrag,
  preventOverlapOnResize,
  overlapCandidates,
  onEventClick,
  onEventChange,
  onEventRemove,
  renderEventDetails,
  locale,
  translations,
  classNames,
  detailsPopoverClassName
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const showDetailsPopover = onEventClick == null;
  const chipRef = useRef(null);
  const [present, setPresent] = useState(true);
  const presence = usePresence({ present, onExitComplete: () => onEventRemove?.(event) });
  const canDrag = isEventGestureEnabled(editableDrag ?? false, event, "drag");
  const canResize = isEventGestureEnabled(editableResize ?? false, event, "resize");
  const canRemove = isEventGestureEnabled(editableRemove ?? false, event, "remove");
  const resolvedOnEventClick = onEventClick ?? (() => setDetailsOpen(true));
  const resolvedOnEventChange = onEventChange;
  const drag = useEventDrag({
    event,
    enabled: canDrag,
    slotDuration,
    slotDisabled,
    preventOverlap: preventOverlapOnDrag,
    overlapCandidates,
    onEventChange: resolvedOnEventChange,
    onEventClick: resolvedOnEventClick
  });
  const resizeStart = useEventResize({
    event,
    edge: "start",
    slotDuration,
    slotDisabled,
    preventOverlap: preventOverlapOnResize,
    overlapCandidates,
    onEventChange: resolvedOnEventChange,
    locale
  });
  const resizeEnd = useEventResize({
    event,
    edge: "end",
    slotDuration,
    slotDisabled,
    preventOverlap: preventOverlapOnResize,
    overlapCandidates,
    onEventChange: resolvedOnEventChange,
    locale
  });
  const handleBodyKeyDown = (e) => {
    if (!present) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      resolvedOnEventClick(event);
      return;
    }
    if (!canDrag) return;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const step = e.shiftKey ? slotDuration * 4 : slotDuration;
    const deltaMinutes = e.key === "ArrowUp" ? -step : step;
    const next = {
      start: addSnappedMinutes(event.start, deltaMinutes, slotDuration),
      end: addSnappedMinutes(event.end, deltaMinutes, slotDuration)
    };
    const result = checkRangeCommit(next, {
      slotDisabled,
      preventOverlap: preventOverlapOnDrag,
      overlapCandidates,
      excludeId: event.id
    });
    if (!result.ok) {
      flashRejected3(e.currentTarget, result.reason);
      return;
    }
    onEventChange?.(event, next, "drag");
  };
  const chipBody = (
    // biome-ignore lint/a11y/useSemanticElements: no native element supports both a drag/resize gesture and a nested remove <button> — a <button> can't contain interactive children
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: mergeRefs(presence.ref, chipRef),
        ...drag.getBodyProps(),
        ...presence.getPresenceProps(),
        "data-schedule-part": "event-chip",
        "data-kind": event.kind,
        "data-color": event.color ?? "pink",
        ...props({ "data-testid": event.testId ?? event.id }),
        tabIndex: present ? 0 : -1,
        role: "button",
        "aria-label": `${event.title}, ${timeRangeLabel(event.start, event.end, locale)}`,
        ...showDetailsPopover ? { "aria-haspopup": "dialog", "aria-expanded": detailsOpen } : {},
        onKeyDown: handleBodyKeyDown,
        className: cn(
          "group",
          chipShell({ kind: "event" }),
          canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default",
          "data-[state=open]:animate-schedule-chip-in data-[state=closed]:animate-schedule-chip-out data-[state=closed]:pointer-events-none",
          classNames?.root
        ),
        style: chipShellStyle(top, height, insets),
        children: [
          /* @__PURE__ */ jsx(
            ChipContent,
            {
              event,
              estimatedPxHeight,
              locale,
              classNames,
              reserveRemoveSpace: onEventRemove != null
            }
          ),
          canResize ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                ...resizeStart.getHandleProps(),
                className: cn(gripBase, gripTop, classNames?.grip)
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                ...resizeEnd.getHandleProps(),
                className: cn(gripBase, gripBottom, classNames?.grip)
              }
            )
          ] }) : null,
          canRemove ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "data-schedule-part": "remove",
              "aria-label": translations.removeEvent,
              onClick: (e) => {
                e.stopPropagation();
                setPresent(false);
              },
              onPointerDown: (e) => e.stopPropagation(),
              className: cn(
                "absolute top-1 inset-e-1 z-10 rounded-full p-0.5 text-(--c-text)",
                "hover:bg-(--c-soft-hover) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--c-solid)",
                // A small, isolated scale micro-interaction — safe here (unlike
                // the chip root) since this button has no other `transform` to
                // compose with or fight.
                "transition-transform duration-150 motion-reduce:transition-none",
                "hover:transform-[scale(1.08)] active:transform-[scale(0.92)]",
                classNames?.removeButton
              ),
              children: /* @__PURE__ */ jsx(XIcon, { className: "size-3" })
            }
          ) : null
        ]
      }
    )
  );
  if (!showDetailsPopover) return chipBody;
  return /* @__PURE__ */ jsxs(
    Popover.Root,
    {
      open: detailsOpen,
      onOpenChange: (d) => setDetailsOpen(d.open),
      finalFocusEl: () => chipRef.current,
      width: "auto",
      children: [
        /* @__PURE__ */ jsx(Popover.Anchor, { asChild: true, children: chipBody }),
        /* @__PURE__ */ jsx(Popover.Content, { className: cn(detailsPopoverContent, detailsPopoverClassName), children: /* @__PURE__ */ jsx(Popover.Body, { children: /* @__PURE__ */ jsx(
          ScheduleEventDetailsContent,
          {
            event,
            locale,
            renderEventDetails
          }
        ) }) })
      ]
    }
  );
}
function ScheduleEventChip(props2) {
  return props2.event.kind === "event" ? /* @__PURE__ */ jsx(InteractiveEventChip, { ...props2, event: props2.event }) : /* @__PURE__ */ jsx(StaticEventChip, { ...props2, event: props2.event });
}

// src/components/schedule/schedule-layout.ts
function computeSpan(e, clusterVisible, bound) {
  let span = 1;
  for (let col = e.column + 1; col < bound; col++) {
    const blocked = clusterVisible.some(
      (o) => o.column === col && o.start.getTime() < e.end.getTime() && e.start.getTime() < o.end.getTime()
    );
    if (blocked) break;
    span++;
  }
  return span;
}
function groupIntoClusters(sorted) {
  const clusters = [];
  let current = [];
  let clusterEnd = Number.NEGATIVE_INFINITY;
  for (const event of sorted) {
    if (current.length > 0 && event.start.getTime() >= clusterEnd) {
      clusters.push(current);
      current = [];
      clusterEnd = Number.NEGATIVE_INFINITY;
    }
    current.push(event);
    clusterEnd = Math.max(clusterEnd, event.end.getTime());
  }
  if (current.length > 0) clusters.push(current);
  return clusters;
}
function placeCluster(clusterEvents, maxColumns) {
  const activeColumnEnds = [];
  const clusterVisible = [];
  const clusterOverflow = [];
  for (const event of clusterEvents) {
    const startMs = event.start.getTime();
    const endMs = event.end.getTime();
    for (let i = 0; i < activeColumnEnds.length; i++) {
      if (activeColumnEnds[i] !== null && activeColumnEnds[i] <= startMs) {
        activeColumnEnds[i] = null;
      }
    }
    let column = activeColumnEnds.indexOf(null);
    if (column === -1) {
      column = activeColumnEnds.length;
      activeColumnEnds.push(null);
    }
    activeColumnEnds[column] = endMs;
    const record = { id: event.id, start: event.start, end: event.end, column };
    if (column < maxColumns) {
      clusterVisible.push(record);
    } else {
      clusterOverflow.push(record);
    }
  }
  const visibleColumnCount = clusterVisible.length ? Math.max(...clusterVisible.map((e) => e.column)) + 1 : 1;
  const hasOverflow = clusterOverflow.length > 0;
  const columnCount = hasOverflow ? maxColumns + 1 : visibleColumnCount;
  const spanBound = hasOverflow ? maxColumns : visibleColumnCount;
  const visible = /* @__PURE__ */ new Map();
  for (const e of clusterVisible) {
    visible.set(e.id, {
      column: e.column,
      columnSpan: computeSpan(e, clusterVisible, spanBound),
      columnCount
    });
  }
  return { visible, overflowRaw: clusterOverflow };
}
function runLayout(events, maxColumns) {
  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime()
  );
  const clusters = groupIntoClusters(sorted);
  const visible = /* @__PURE__ */ new Map();
  const overflow = [];
  for (const cluster of clusters) {
    let result = placeCluster(cluster, maxColumns);
    if (result.overflowRaw.length > 0) {
      result = placeCluster(cluster, Math.max(0, maxColumns - 1));
    }
    for (const [id, entry] of result.visible) visible.set(id, entry);
    if (result.overflowRaw.length > 0) {
      const starts = result.overflowRaw.map((e) => e.start.getTime());
      const ends = result.overflowRaw.map((e) => e.end.getTime());
      overflow.push({
        start: new Date(Math.min(...starts)),
        end: new Date(Math.max(...ends)),
        ids: result.overflowRaw.map((e) => e.id)
      });
    }
  }
  return { visible, overflow };
}
function layoutEventColumns(events) {
  return runLayout(events, Number.POSITIVE_INFINITY).visible;
}
function layoutEventColumnsCapped(events, maxColumns) {
  const { visible, overflow } = runLayout(events, Math.max(1, maxColumns));
  return { layout: visible, overflow };
}
function ScheduleOverflowChip({
  top,
  height,
  insets,
  events,
  onEventClick,
  onOverflowClick,
  renderEventDetails,
  locale,
  timeZone,
  translations,
  classNames,
  testId
}) {
  return /* @__PURE__ */ jsx(
    ScheduleOverflowPopover,
    {
      events,
      onEventClick,
      onOverflowClick,
      renderEventDetails,
      locale,
      timeZone,
      translations,
      classNames,
      renderTrigger: (triggerProps) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "data-schedule-part": "overflow-chip",
          ...props({ "data-testid": testId }),
          ...triggerProps,
          className: cn(
            "absolute select-none truncate rounded-sm text-xs text-end py-1 px-3",
            "border",
            "dark:border-white/15 dark:text-brand-50",
            "dark:bg-brand-950/85 dark:hover:bg-brand-950/95",
            "border-brand-900/20",
            "bg-brand-50/90 hover:bg-brand-50",
            "transition-colors cursor-pointer",
            // Same cascade depth cue `ScheduleEventChip`'s `chipShell` uses —
            // the "+N" chip reuses `columnInsets`' full output (`left`/`width`/
            // `zIndex`), same as a real event chip, so it sits at the right
            // stack position and width in its own overflowing cluster.
            "shadow-sm shadow-black/10 dark:shadow-black/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--c-solid)",
            // `z-(--sch-chip-z)` + `hover:z-20 focus-within:z-20`, not an inline
            // `zIndex` — same reasoning as `ScheduleEventChip`'s `chipShell`
            // (an inline z-index always wins over a same-property class,
            // regardless of source order, so the hover/focus promotion below
            // would never fire against one). `focus-within`, not `focus-visible`
            // — matching `chipShell` again — so a mouse click (which focuses
            // this button but usually doesn't trigger a visible focus ring)
            // still promotes it, not just keyboard Tab.
            "z-(--sch-chip-z) hover:z-20 focus-within:z-20",
            "w-(--sch-chip-w)",
            classNames?.root
          ),
          style: {
            top: `${top}%`,
            // `max(...)`, not a JS `Math.max` on a px number — same
            // reasoning as `ScheduleEventChip`'s own `chipShellStyle`.
            height: `max(${height}%, 18px)`,
            left: insets.left,
            "--sch-chip-z": insets.zIndex,
            "--sch-chip-w": insets.width
          },
          children: `+${events.length}`
        }
      )
    }
  );
}
var CLICK_SLOP2 = 5;
var LONG_PRESS_MS = 450;
var JITTER_PX = 10;
var findDraft = (columnEl) => columnEl.querySelector("[data-schedule-part='create-draft']");
var showDraft = (draft, low, high, startHour, totalWindowMinutes, invalid) => {
  if (!draft) return;
  draft.style.setProperty(
    "--sch-create-top",
    `${minutesToPercent(low - startHour * 60, totalWindowMinutes)}%`
  );
  draft.style.setProperty(
    "--sch-create-height",
    `${minutesToPercent(high - low, totalWindowMinutes)}%`
  );
  draft.dataset["active"] = "true";
  if (invalid) {
    draft.dataset["invalid"] = "true";
  } else {
    delete draft.dataset["invalid"];
  }
};
var hideDraft = (draft) => {
  if (!draft) return;
  delete draft.dataset["active"];
  delete draft.dataset["invalid"];
  draft.style.removeProperty("--sch-create-top");
  draft.style.removeProperty("--sch-create-height");
};
var flashRejected4 = (draft, reason) => {
  if (!draft) return;
  draft.style.transition = "transform 120ms ease-out";
  draft.style.transform = "scale(0.98)";
  draft.dataset["scheduleRejectReason"] = reason;
  requestAnimationFrame(() => {
    draft.style.transition = "";
    draft.style.transform = "";
    delete draft.dataset["scheduleRejectReason"];
  });
};
function useEventCreate({
  day,
  startHour,
  endHour,
  slotDuration,
  minDurationMinutes = slotDuration,
  slotDisabled,
  editableCreate,
  preventOverlap,
  overlapCandidates,
  onEventCreate,
  onEventDismiss
}) {
  const totalWindowMinutes = (endHour - startHour) * 60;
  const stateRef = useRef(null);
  const pendingRef = useRef(null);
  const armTimerRef = useRef(null);
  const clearPending = useCallback(() => {
    if (armTimerRef.current != null) clearTimeout(armTimerRef.current);
    armTimerRef.current = null;
    pendingRef.current = null;
  }, []);
  const onPointerDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      const target = e.target;
      if (target.closest("[data-schedule-part='event-chip'],[data-schedule-part='overflow-chip']"))
        return;
      const el = e.currentTarget;
      const pointerId = e.pointerId;
      const startClientY = e.clientY;
      const startClientX = e.clientX;
      const rect = el.getBoundingClientRect();
      const pxPerMinute = resolvePxPerMinute(el, rect);
      const anchorMinutes = startHour * 60 + pixelsToMinutes(startClientY - rect.top, pxPerMinute);
      const arm = () => {
        try {
          el.setPointerCapture(pointerId);
        } catch {
          return;
        }
        stateRef.current = { pointerId, anchorMinutes, startClientY, maxAbsDelta: 0, pxPerMinute };
      };
      if (e.pointerType === "mouse") {
        arm();
        return;
      }
      pendingRef.current = { pointerId, startClientX, startClientY };
      armTimerRef.current = setTimeout(() => {
        armTimerRef.current = null;
        pendingRef.current = null;
        arm();
      }, LONG_PRESS_MS);
    },
    [startHour]
  );
  const onPointerMove = useCallback(
    (e) => {
      const pending = pendingRef.current;
      if (pending && e.pointerId === pending.pointerId) {
        const dx = e.clientX - pending.startClientX;
        const dy2 = e.clientY - pending.startClientY;
        if (Math.hypot(dx, dy2) > JITTER_PX) clearPending();
        return;
      }
      const state = stateRef.current;
      if (!state || e.pointerId !== state.pointerId) return;
      const dy = e.clientY - state.startClientY;
      state.maxAbsDelta = Math.max(state.maxAbsDelta, Math.abs(dy));
      if (!editableCreate) return;
      const candidateMinutes = state.anchorMinutes + pixelsToMinutes(dy, state.pxPerMinute);
      const low = Math.min(state.anchorMinutes, candidateMinutes);
      const high = Math.max(state.anchorMinutes, candidateMinutes);
      const snappedLow = snapToIncrement(low, slotDuration);
      const snappedHigh = Math.max(
        snapToIncrement(high, slotDuration),
        snappedLow + minDurationMinutes
      );
      const snappedCandidate = {
        start: dateAtMinutes(day, snappedLow),
        end: dateAtMinutes(day, snappedHigh)
      };
      const invalid = !checkRangeCommit(snappedCandidate, {
        slotDisabled,
        preventOverlap,
        overlapCandidates
      }).ok;
      showDraft(findDraft(e.currentTarget), low, high, startHour, totalWindowMinutes, invalid);
    },
    [
      clearPending,
      editableCreate,
      startHour,
      totalWindowMinutes,
      day,
      slotDuration,
      minDurationMinutes,
      slotDisabled,
      preventOverlap,
      overlapCandidates
    ]
  );
  const onPointerUp = useCallback(
    (e) => {
      const pending = pendingRef.current;
      if (pending && e.pointerId === pending.pointerId) {
        clearPending();
        return;
      }
      const state = stateRef.current;
      stateRef.current = null;
      if (!state || e.pointerId !== state.pointerId) return;
      const draft = findDraft(e.currentTarget);
      hideDraft(draft);
      if (state.maxAbsDelta < CLICK_SLOP2) {
        onEventDismiss?.();
        return;
      }
      if (!editableCreate) return;
      const dy = e.clientY - state.startClientY;
      const candidateMinutes = state.anchorMinutes + pixelsToMinutes(dy, state.pxPerMinute);
      const low = Math.min(state.anchorMinutes, candidateMinutes);
      const high = Math.max(state.anchorMinutes, candidateMinutes);
      const snappedLow = snapToIncrement(low, slotDuration);
      const snappedHigh = Math.max(
        snapToIncrement(high, slotDuration),
        snappedLow + minDurationMinutes
      );
      const next = { start: dateAtMinutes(day, snappedLow), end: dateAtMinutes(day, snappedHigh) };
      const result = checkRangeCommit(next, { slotDisabled, preventOverlap, overlapCandidates });
      if (!result.ok) {
        flashRejected4(draft, result.reason);
        return;
      }
      onEventCreate?.(next);
    },
    [
      clearPending,
      editableCreate,
      day,
      slotDuration,
      minDurationMinutes,
      slotDisabled,
      preventOverlap,
      overlapCandidates,
      onEventCreate,
      onEventDismiss
    ]
  );
  const onPointerCancel = useCallback(
    (e) => {
      const pending = pendingRef.current;
      if (pending && e.pointerId === pending.pointerId) {
        clearPending();
        return;
      }
      const state = stateRef.current;
      stateRef.current = null;
      if (!state || e.pointerId !== state.pointerId) return;
      hideDraft(findDraft(e.currentTarget));
    },
    [clearPending]
  );
  return {
    getColumnProps: () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      // Deliberately `"auto"` — unlike the chip/handle gestures, which set
      // `"none"` since they're small, deliberate targets that should never
      // concede to a native scroll. The day-column spans nearly the whole
      // grid and needs both native pan directions (DaysView's horizontal
      // day-to-day swipe, vertical hour scroll) available by default; a fast
      // swipe should start a real scroll immediately (the browser fires
      // `pointercancel` here once it does, caught below), and only a
      // stationary long-press should ever call `setPointerCapture`.
      style: { touchAction: "auto" }
    })
  };
}
var DEFAULT_MAX_OVERLAP_COLUMNS = 4;
var DEFAULT_MAX_ALL_DAY_ROWS = 2;
var DEFAULT_COLUMN_OVERLAP_PX = 10;
var DEFAULT_COLUMN_OVERLAP_PX_MULTI_DAY = 20;
function disabledHourRuns(day, startHour, endHour, slotDisabled) {
  const runs = [];
  let runStart = null;
  for (let hour = startHour; hour < endHour; hour++) {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(day);
    end.setHours(hour + 1, 0, 0, 0);
    const disabled = slotDisabled({ start, end });
    if (disabled && runStart === null) runStart = hour * 60;
    if (!disabled && runStart !== null) {
      runs.push({ startMinute: runStart, endMinute: hour * 60 });
      runStart = null;
    }
  }
  if (runStart !== null) runs.push({ startMinute: runStart, endMinute: endHour * 60 });
  return runs;
}
function DayColumn({
  day,
  columnIndex,
  dayEvents,
  dayStatic,
  startHour,
  endHour,
  hourHeight,
  totalWindowMinutes,
  slotDuration,
  slotDisabled,
  editableCreate,
  editableDrag,
  editableResize,
  editableRemove,
  preventOverlapOnCreate,
  preventOverlapOnDrag,
  preventOverlapOnResize,
  overlapAgainst,
  maxOverlapColumns,
  onEventClick,
  onEventChange,
  onEventRemove,
  onEventCreate,
  onEventDismiss,
  onOverflowClick,
  renderEventDetails,
  locale,
  timeZone,
  translations,
  classNames,
  isToday: isToday2,
  isFirstDayColumn,
  now,
  nowRef,
  withNowIndicator
}) {
  const byId = /* @__PURE__ */ new Map();
  for (const event of dayEvents) byId.set(event.id, event);
  for (const event of dayStatic) byId.set(event.id, event);
  const { layout, overflow } = layoutEventColumnsCapped(
    [...dayEvents, ...dayStatic],
    maxOverlapColumns
  );
  const disabledRuns = slotDisabled ? disabledHourRuns(day, startHour, endHour, slotDisabled) : [];
  const overlapCandidates = resolveOverlapCandidates(dayEvents, dayStatic, overlapAgainst);
  const create = useEventCreate({
    day,
    startHour,
    endHour,
    slotDuration,
    slotDisabled,
    editableCreate,
    preventOverlap: preventOverlapOnCreate,
    overlapCandidates,
    onEventCreate,
    onEventDismiss
  });
  const renderChip = (event, insets) => {
    const top = minutesToPercent(
      minutesFromMidnight(event.start) - startHour * 60,
      totalWindowMinutes
    );
    const durationMinutes = (event.end.getTime() - event.start.getTime()) / 6e4;
    const height = minutesToPercent(durationMinutes, totalWindowMinutes);
    const estimatedPxHeight = durationMinutes * (hourHeight / 60);
    return /* @__PURE__ */ jsx(
      ScheduleEventChip,
      {
        event,
        top,
        height,
        estimatedPxHeight,
        insets,
        slotDuration,
        slotDisabled,
        editableDrag,
        editableResize,
        editableRemove,
        preventOverlapOnDrag,
        preventOverlapOnResize,
        overlapCandidates,
        onEventClick,
        onEventChange,
        onEventRemove,
        renderEventDetails,
        locale,
        translations,
        classNames: classNames?.event,
        detailsPopoverClassName: classNames?.eventDetailsPopover
      },
      event.id
    );
  };
  const totalHours = endHour - startHour;
  const eventChips = [...dayStatic, ...dayEvents].flatMap((event) => {
    const entry = layout.get(event.id);
    if (!entry) return [];
    return [
      {
        key: event.id,
        start: event.start.getTime(),
        column: entry.column,
        node: renderChip(event, columnInsets(entry))
      }
    ];
  });
  const overflowChips = overflow.map((segment) => {
    const insets = columnInsets({
      column: maxOverlapColumns,
      columnCount: maxOverlapColumns + 1
    });
    const segmentEvents = segment.ids.map((id) => byId.get(id)).filter((event) => event != null);
    const top = minutesToPercent(
      minutesFromMidnight(segment.start) - startHour * 60,
      totalWindowMinutes
    );
    const height = minutesToPercent(
      (segment.end.getTime() - segment.start.getTime()) / 6e4,
      totalWindowMinutes
    );
    const key = `${segment.start.getTime()}-${segment.end.getTime()}`;
    return {
      key,
      start: segment.start.getTime(),
      // Always the reserved last column (see `insets` above) — the "+N"
      // indicator is always the rightmost card in its own cluster.
      column: maxOverlapColumns,
      node: (
        // No "lone overflow renders as a real chip instead of a wasteful
        // +1" special case here (unlike the all-day row's own overflow,
        // which keeps one): `layoutEventColumnsCapped` only ever overflows a
        // cluster by retrying at one fewer real column once *any* overflow
        // occurs at the original cap, and that retry's own overflow count
        // is provably always >= 2 (never exactly 1) — reducing by exactly
        // one column can only free up room for one *fewer* real event, so
        // whichever event the un-reduced pass had already overflowed stays
        // overflowed, plus whichever one the reduction just displaced joins
        // it. A "+1" here would mean this branch is literally unreachable,
        // not just rare.
        /* @__PURE__ */ jsx(
          ScheduleOverflowChip,
          {
            top,
            height,
            insets,
            events: segmentEvents,
            onEventClick,
            onOverflowClick,
            renderEventDetails,
            locale,
            timeZone,
            translations,
            classNames: classNames?.overflowChip,
            testId: `overflow-${key}`
          },
          key
        )
      )
    };
  });
  const chips = [...eventChips, ...overflowChips].sort(
    (a, b) => a.start - b.start || a.column - b.column
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...create.getColumnProps(),
      "data-schedule-part": "day-column",
      className: cn(
        // `h-full` — stretches to fill the shared timed row's own resolved
        // height (the row's `minmax(floor, 1fr)` track, see
        // `ScheduleTimedGrid`'s inner grid wrapper), not a fixed height of
        // its own; `align-self: stretch` (the grid default) is what makes
        // that stretch actually apply here.
        "relative row-2 h-full",
        // Only *between* day columns, not on the first one — that edge
        // borders the gutter, not a sibling cell, and the gutter already
        // reads as its own distinct region (sticky, opaque surface) without
        // a redundant hairline restating the boundary.
        !isFirstDayColumn && "border-s border-brand-900/20 dark:border-white/15"
      ),
      style: { gridColumn: columnIndex + 2 },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            "data-schedule-part": "hour-gridlines",
            className: cn(
              "pointer-events-none absolute inset-x-0 bottom-0",
              "[--sch-gridline-color:color-mix(in_oklab,var(--color-brand-900)_10%,transparent)]",
              "dark:[--sch-gridline-color:rgb(255_255_255/0.08)]"
            ),
            style: {
              top: `calc(100% / ${totalHours})`,
              backgroundImage: totalHours > 1 ? `repeating-linear-gradient(to bottom, var(--sch-gridline-color) 0 1px, transparent 1px calc(100% / ${totalHours - 1}))` : void 0
            }
          }
        ),
        disabledRuns.map((run) => /* @__PURE__ */ jsx(
          ScheduleDisabledOverlay,
          {
            style: {
              top: `${minutesToPercent(run.startMinute - startHour * 60, totalWindowMinutes)}%`,
              height: `${minutesToPercent(run.endMinute - run.startMinute, totalWindowMinutes)}%`
            }
          },
          run.startMinute
        )),
        /* @__PURE__ */ jsx(ScheduleCreateDraft, { className: classNames?.createDraft }),
        chips.map((chip) => chip.node),
        withNowIndicator && isToday2 ? /* @__PURE__ */ jsx(
          NowCursorLine,
          {
            now,
            nowRef,
            startHour,
            endHour,
            hideDot: isFirstDayColumn,
            className: classNames?.nowIndicator
          }
        ) : null
      ]
    }
  );
}
var stickySurface2 = "bg-brand-50/90 backdrop-blur-lg dark:bg-brand-950/85";
function ScheduleTimedGrid({
  days,
  data,
  staticEvents,
  startHour,
  endHour,
  slotDuration,
  slotDisabled,
  now,
  withNowIndicator,
  onEventClick,
  onEventChange,
  onEventRemove,
  onEventCreate,
  onEventDismiss,
  editable,
  preventOverlap,
  maxOverlapColumns = DEFAULT_MAX_OVERLAP_COLUMNS,
  maxAllDayRows = DEFAULT_MAX_ALL_DAY_ROWS,
  onOverflowClick,
  onDayClick,
  renderEventDetails,
  locale,
  timeZone,
  translations,
  classNames,
  empty,
  hourHeight,
  ref,
  nowRef
}) {
  const [announcement, setAnnouncement] = useState("");
  const announce = useCallback((text) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(text));
  }, []);
  const handleEventRemove = useCallback(
    (event) => {
      announce(translations.eventRemoved.replace("{title}", event.title));
      onEventRemove?.(event);
    },
    [onEventRemove, translations, announce]
  );
  const handleEventCreate = useCallback(
    (range) => {
      announce(
        translations.eventCreated.replace(
          "{range}",
          timeRangeLabel(range.start, range.end, locale)
        )
      );
      onEventCreate?.(range);
    },
    [onEventCreate, translations, locale, announce]
  );
  const resolvedHourHeight = hourHeight ?? defaultHourHeight(slotDuration);
  const totalWindowMinutes = (endHour - startHour) * 60;
  const minTimedHeightPx = (endHour - startHour) * resolvedHourHeight;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const hasAnyEvent = data.length > 0 || staticEvents.length > 0;
  const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric" });
  const hourFormatter = new Intl.DateTimeFormat(locale, { hour: "2-digit" });
  const todayRef = now ?? /* @__PURE__ */ new Date();
  const columnsTemplate = `var(--sch-gutter-width) repeat(${days.length}, minmax(var(--sch-day-min-width), 1fr))`;
  const anyDayIsToday = days.some(
    (day) => eventOccursOnDay({ start: todayRef, end: new Date(todayRef.getTime() + 1) }, day, timeZone)
  );
  const visibleWindowEnd = paginateDate("days", days[days.length - 1], 1, {
    timeZone,
    visibleDays: 1
  });
  const allDayEvents = [...data, ...staticEvents].filter(
    (event) => event.allDay && rangesOverlap(event, { start: days[0], end: visibleWindowEnd })
  );
  const { gestures: preventOverlapGestures, against: overlapAgainst } = resolveOverlapPrevention(preventOverlap);
  const preventOverlapOnCreate = isOverlapGestureEnabled(preventOverlapGestures, "create");
  const preventOverlapOnDrag = isOverlapGestureEnabled(preventOverlapGestures, "drag");
  const preventOverlapOnResize = isOverlapGestureEnabled(preventOverlapGestures, "resize");
  const editableCreate = isEditGestureEnabled(editable, "create");
  const editableDrag = isEditGestureEnabled(editable, "drag");
  const editableResize = isEditGestureEnabled(editable, "resize");
  const editableRemove = isEditGestureEnabled(editable, "remove");
  useEffect(() => {
    if (editableDrag && !onEventChange) {
      devWarn(
        'Schedule: `editable` grants "drag" but `onEventChange` is missing \u2014 the affordance will render but committing it will do nothing.'
      );
    }
    if (editableResize && !onEventChange) {
      devWarn(
        'Schedule: `editable` grants "resize" but `onEventChange` is missing \u2014 the affordance will render but committing it will do nothing.'
      );
    }
    if (editableRemove && !onEventRemove) {
      devWarn(
        'Schedule: `editable` grants "remove" but `onEventRemove` is missing \u2014 the affordance will render but committing it will do nothing.'
      );
    }
    if (editableCreate && !onEventCreate) {
      devWarn(
        'Schedule: `editable` grants "create" but `onEventCreate` is missing \u2014 the affordance will render but committing it will do nothing.'
      );
    }
    for (const event of data) {
      for (const gesture of eventEditGestureExceedsSchedule(editable, event)) {
        devWarn(
          `Schedule: event "${event.id}" sets editable to include "${gesture}", but the schedule-level \`editable\` doesn't grant it \u2014 an event's \`editable\` can only narrow the schedule-level grant, never widen it, so this has no effect.`
        );
      }
    }
  }, [
    editableDrag,
    editableResize,
    editableRemove,
    editableCreate,
    onEventChange,
    onEventRemove,
    onEventCreate,
    editable,
    data
  ]);
  const columnOverlapPx = days.length > 1 ? DEFAULT_COLUMN_OVERLAP_PX_MULTI_DAY : DEFAULT_COLUMN_OVERLAP_PX;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-schedule-part": "timed-grid",
      className: cn("h-full min-w-0 overflow-auto", classNames?.grid),
      style: {
        "--sch-window-minutes": `${totalWindowMinutes}`,
        "--sch-gutter-width": "3.5rem",
        "--sch-day-min-width": "9rem",
        "--sch-column-gap": "3px",
        "--sch-column-overlap": `${columnOverlapPx}px`,
        "--sch-column-fraction": 0.7
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative grid h-full",
            style: {
              gridTemplateColumns: columnsTemplate,
              gridTemplateRows: `auto minmax(${minTimedHeightPx}px, 1fr)`
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: cn(
                    "sticky top-0 z-40 col-span-full row-1 grid border-b border-brand-900/20 dark:border-white/15",
                    stickySurface2
                  ),
                  style: { gridTemplateColumns: columnsTemplate },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: cn("sticky inset-s-0", stickySurface2) }),
                    days.map((day) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onDayClick?.(day),
                        className: "truncate px-2 py-2 text-center text-sm font-medium hover:bg-black/5 dark:hover:bg-white/8",
                        children: dayFormatter.format(day)
                      },
                      day.toISOString()
                    )),
                    /* @__PURE__ */ jsx(
                      ScheduleAllDayRow,
                      {
                        days,
                        events: allDayEvents,
                        maxAllDayRows,
                        rowOffset: 2,
                        timeZone,
                        onEventClick,
                        onOverflowClick,
                        renderEventDetails,
                        locale,
                        translations,
                        classNames
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: cn("sticky inset-s-0 z-30 row-2 flex flex-col border-e", stickySurface2), children: [
                hours.map((hour) => /* @__PURE__ */ jsx(
                  HourGutterTick,
                  {
                    hour,
                    label: hourFormatter.format(new Date(2e3, 0, 1, hour)),
                    now,
                    hideWhenCurrent: withNowIndicator && anyDayIsToday,
                    className: "flex-1 shrink-0 pe-2 text-end text-[10px] text-gray-light-500 dark:text-gray-dark-500"
                  },
                  hour
                )),
                withNowIndicator && anyDayIsToday ? /* @__PURE__ */ jsx(
                  NowCursorLabel,
                  {
                    now,
                    startHour,
                    endHour,
                    locale,
                    className: classNames?.nowIndicator
                  }
                ) : null
              ] }),
              withNowIndicator && anyDayIsToday ? /* @__PURE__ */ jsx("div", { className: "relative col-[2/-1] row-2 min-w-0", children: /* @__PURE__ */ jsx(
                NowCursorLine,
                {
                  now,
                  startHour,
                  endHour,
                  variant: "guide",
                  className: classNames?.nowIndicator
                }
              ) }) : null,
              days.map((day, columnIndex) => {
                const dayEvents = data.filter(
                  (event) => !event.allDay && eventOccursOnDay(event, day, timeZone)
                );
                const dayStatic = staticEvents.filter(
                  (event) => !event.allDay && eventOccursOnDay(event, day, timeZone)
                );
                const isToday2 = eventOccursOnDay(
                  { start: todayRef, end: new Date(todayRef.getTime() + 1) },
                  day,
                  timeZone
                );
                return /* @__PURE__ */ jsx(
                  DayColumn,
                  {
                    day,
                    columnIndex,
                    isFirstDayColumn: day === days[0],
                    dayEvents,
                    dayStatic,
                    startHour,
                    endHour,
                    hourHeight: resolvedHourHeight,
                    totalWindowMinutes,
                    slotDuration,
                    slotDisabled,
                    editableCreate,
                    editableDrag,
                    editableResize,
                    editableRemove,
                    preventOverlapOnCreate,
                    preventOverlapOnDrag,
                    preventOverlapOnResize,
                    overlapAgainst,
                    maxOverlapColumns,
                    onEventClick,
                    onEventChange,
                    onEventRemove: handleEventRemove,
                    onEventCreate: handleEventCreate,
                    onEventDismiss,
                    onOverflowClick,
                    renderEventDetails,
                    locale,
                    timeZone,
                    translations,
                    classNames,
                    isToday: isToday2,
                    now,
                    nowRef,
                    withNowIndicator
                  },
                  day.toISOString()
                );
              })
            ]
          }
        ),
        !hasAnyEvent && empty !== null ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-sm text-gray-light-500 dark:text-gray-dark-500", children: empty ?? translations.empty }) : null,
        /* @__PURE__ */ jsx("div", { role: "status", className: "sr-only", children: announcement })
      ]
    }
  );
}
var ScheduleToolbarRoot = ({ className, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    "data-schedule-part": "toolbar",
    className: cn(
      "flex shrink-0 flex-wrap items-center justify-between gap-2 bg-white/4",
      "border-b border-brand-900/20 px-3 py-3 dark:border-white/15",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var ScheduleToolbarPrevTrigger = ({
  view,
  date,
  onDateChange,
  timeZone = getLocalTimeZone(),
  translations,
  size = "sm",
  className,
  testId,
  visibleDays
}) => {
  const t = resolveScheduleTranslations(translations);
  return /* @__PURE__ */ jsx(
    ActionIcon,
    {
      variant: "subtle",
      color: "neutral",
      size,
      "aria-label": t.previous,
      onClick: () => onDateChange?.(paginateDate(view, date, -1, { timeZone, visibleDays })),
      className,
      testId,
      children: /* @__PURE__ */ jsx(ChevronLeftIcon, {})
    }
  );
};
var ScheduleToolbarNextTrigger = ({
  view,
  date,
  onDateChange,
  timeZone = getLocalTimeZone(),
  translations,
  size = "sm",
  className,
  testId,
  visibleDays
}) => {
  const t = resolveScheduleTranslations(translations);
  return /* @__PURE__ */ jsx(
    ActionIcon,
    {
      variant: "subtle",
      color: "neutral",
      size,
      "aria-label": t.next,
      onClick: () => onDateChange?.(paginateDate(view, date, 1, { timeZone, visibleDays })),
      className,
      testId,
      children: /* @__PURE__ */ jsx(ChevronRightIcon, {})
    }
  );
};
var ScheduleToolbarNowTrigger = ({
  onDateChange,
  now,
  translations,
  size = "sm",
  className,
  testId
}) => {
  const t = resolveScheduleTranslations(translations);
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: "subtle",
      color: "neutral",
      size,
      onClick: () => onDateChange?.(now ?? /* @__PURE__ */ new Date()),
      className,
      testId,
      children: t.now
    }
  );
};
var ScheduleToolbarTitle = ({
  view,
  date,
  timeZone = getLocalTimeZone(),
  locale,
  align,
  visibleDays,
  className,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  ark.h2,
  {
    "data-schedule-part": "toolbar-title",
    className: cn("truncate font-semibold text-sm", className),
    ...props({ "data-testid": testId }),
    ...rest,
    children: formatScheduleTitle(view, date, { timeZone, locale, startOfWeek: align, visibleDays })
  }
);
var ALL_VIEWS = ["days", "month", "year"];
var ScheduleToolbarViewSwitcher = ({
  view,
  onViewChange,
  views = ALL_VIEWS,
  translations,
  size = "sm",
  className,
  testId
}) => {
  const t = resolveScheduleTranslations(translations);
  const labels = {
    days: t.days,
    month: t.month,
    year: t.year
  };
  return /* @__PURE__ */ jsx(
    Tabs.Root,
    {
      value: view,
      onValueChange: (details) => onViewChange?.(details.value),
      className,
      testId,
      children: /* @__PURE__ */ jsxs(Tabs.List, { size, children: [
        /* @__PURE__ */ jsx(Tabs.Indicator, {}),
        views.map((v) => /* @__PURE__ */ jsx(Tabs.Trigger, { value: v, children: labels[v] }, v))
      ] })
    }
  );
};
var ScheduleToolbar = Object.assign(ScheduleToolbarRoot, {
  PrevTrigger: ScheduleToolbarPrevTrigger,
  NextTrigger: ScheduleToolbarNextTrigger,
  NowTrigger: ScheduleToolbarNowTrigger,
  Title: ScheduleToolbarTitle,
  ViewSwitcher: ScheduleToolbarViewSwitcher
});
function DaysView({
  data,
  staticEvents = [],
  onEventClick,
  onDayClick,
  renderEventDetails,
  locale,
  timeZone = getLocalTimeZone(),
  translations,
  classNames,
  className,
  startHour = 0,
  endHour = 24,
  slotDuration = 15,
  hourHeight,
  slotDisabled,
  now,
  withNowIndicator = true,
  onEventChange,
  onEventRemove,
  onEventCreate,
  onEventDismiss,
  editable,
  preventOverlap,
  maxOverlapColumns,
  maxAllDayRows,
  onOverflowClick,
  empty,
  date,
  defaultDate,
  onDateChange,
  withPagination = true,
  withNowButton = false,
  visibleDays = 7,
  align,
  gridRef,
  nowRef,
  testId,
  ...rest
}) {
  const [anchorDate, setAnchorDate] = useUncontrolled({
    value: date,
    defaultValue: defaultDate,
    finalValue: now ?? /* @__PURE__ */ new Date(),
    onChange: onDateChange
  });
  const internalGridRef = useRef(null);
  const nowCursorRef = useRef(null);
  const t = resolveScheduleTranslations(translations);
  const range = getVisibleRange("days", anchorDate, {
    timeZone,
    locale: locale ?? "en-US",
    startOfWeek: align,
    visibleDays
  });
  const days = enumerateDays(range, timeZone);
  return /* @__PURE__ */ jsxs(
    ark.div,
    {
      className: cn("flex h-full flex-col", className),
      "data-schedule-part": "days-view",
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        withPagination || withNowButton ? /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-1", children: [
          withPagination ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ScheduleToolbar.PrevTrigger,
              {
                view: "days",
                date: anchorDate,
                onDateChange: setAnchorDate,
                timeZone,
                translations: t,
                visibleDays
              }
            ),
            /* @__PURE__ */ jsx(
              ScheduleToolbar.NextTrigger,
              {
                view: "days",
                date: anchorDate,
                onDateChange: setAnchorDate,
                timeZone,
                translations: t,
                visibleDays
              }
            )
          ] }) : null,
          withNowButton ? /* @__PURE__ */ jsx(
            ScheduleToolbar.NowTrigger,
            {
              onDateChange: (d) => {
                setAnchorDate(d);
                if (internalGridRef.current && nowCursorRef.current) {
                  scrollElementToCenter(internalGridRef.current, nowCursorRef.current);
                }
              },
              now,
              translations: t,
              className: "ms-2"
            }
          ) : null
        ] }) : null,
        /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1", children: /* @__PURE__ */ jsx(
          ScheduleTimedGrid,
          {
            ref: mergeRefs(gridRef, internalGridRef),
            days,
            data,
            staticEvents,
            startHour,
            endHour,
            slotDuration,
            hourHeight,
            slotDisabled,
            now,
            nowRef: mergeRefs(nowRef, nowCursorRef),
            withNowIndicator,
            onEventClick,
            onEventChange,
            onEventRemove,
            onEventCreate,
            onEventDismiss,
            editable,
            preventOverlap,
            maxOverlapColumns,
            maxAllDayRows,
            onOverflowClick,
            onDayClick,
            renderEventDetails,
            locale,
            timeZone,
            translations: t,
            classNames,
            empty
          }
        ) })
      ]
    }
  );
}
function monthRowMinHeightRem(maxEventsPerDay) {
  const gap = 0.125;
  const dayNumber = 1;
  const cellPaddingY = 0.5;
  const pillLine = 1.25;
  const linesInEventsArea = maxEventsPerDay + 1;
  return cellPaddingY + dayNumber + gap + linesInEventsArea * pillLine + (linesInEventsArea - 1) * gap;
}
function MonthEventPill({
  event,
  onEventClick,
  renderEventDetails,
  locale,
  timeZone,
  detailsPopoverClassName
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const showDetailsPopover = onEventClick == null;
  const button = /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "data-schedule-part": "event-chip",
      "data-kind": event.kind,
      "data-color": event.color ?? "pink",
      ...props({ "data-testid": event.testId ?? event.id }),
      onClick: (e) => {
        e.stopPropagation();
        onEventClick?.(event);
      },
      ...showDetailsPopover ? { "aria-haspopup": "dialog", "aria-expanded": detailsOpen } : {},
      className: cn(
        "block w-full truncate rounded-xs px-1 py-0.5 text-start text-xs",
        EVENT_COLOR_CLASSES
      ),
      children: [
        event.icon != null ? /* @__PURE__ */ jsx("span", { className: "mr-1 inline-flex align-[-1px] [&_svg]:size-3", children: event.icon }) : null,
        event.title
      ]
    }
  );
  if (!showDetailsPopover) return button;
  return /* @__PURE__ */ jsxs(Popover.Root, { open: detailsOpen, onOpenChange: (d) => setDetailsOpen(d.open), width: "auto", children: [
    /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(Popover.Content, { className: cn("max-w-64", detailsPopoverClassName), children: /* @__PURE__ */ jsx(Popover.Body, { children: /* @__PURE__ */ jsx(
      ScheduleEventDetailsContent,
      {
        event,
        locale,
        timeZone,
        renderEventDetails
      }
    ) }) })
  ] });
}
function MonthDayCell({
  day,
  cellKey,
  dayEvents,
  visible,
  overflow,
  inMonth,
  disabled,
  today,
  dayNumber,
  isLastColumn,
  isLastRow,
  onDayClick,
  onEventClick,
  renderEventDetails,
  renderDayDetails,
  locale,
  timeZone,
  translations,
  classNames
}) {
  const [dayPopoverOpen, setDayPopoverOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const showDayPopover = onDayClick == null && dayEvents.length > 0;
  const openDayPopover = () => {
    if (onDayClick) onDayClick(day);
    else setDayPopoverOpen(true);
  };
  const handleSelectEvent = (event) => {
    if (onEventClick) {
      onEventClick(event);
      setDayPopoverOpen(false);
    } else {
      setActiveEventId(event.id);
    }
  };
  const activeEvent = activeEventId ? dayEvents.find((e) => e.id === activeEventId) ?? null : null;
  const dayNumberButton = /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: onDayClick ? (e) => {
        e.stopPropagation();
        onDayClick(day);
      } : (e) => e.stopPropagation(),
      ...showDayPopover ? { "aria-haspopup": "dialog", "aria-expanded": dayPopoverOpen } : {},
      ...props({ "data-today": today }),
      className: cn(
        "relative w-fit rounded-full px-1 text-xs hover:bg-black/5 dark:hover:bg-white/8",
        inMonth && !disabled ? "font-medium text-gray-light-900 dark:text-gray-dark-25" : "text-gray-light-400 dark:text-gray-dark-600",
        // Same "today" convention `Calendar`/`DatePicker` already use
        // (`calendar-body.tsx`'s `dayCellTrigger`) — bold + brand accent,
        // no background/ring, so it stays a subtle, secondary signal next
        // to a day's own events. Skipped when `disabled`: an unavailable
        // day being "today" is still unavailable, and accenting it would
        // read as more clickable than it actually is.
        today && !disabled && "font-semibold text-brand-500",
        showDayPopover ? "cursor-pointer" : "cursor-auto"
      ),
      children: dayNumber
    }
  );
  const dayNumberSection = !showDayPopover ? dayNumberButton : /* @__PURE__ */ jsxs(
    Popover.Root,
    {
      open: dayPopoverOpen,
      onOpenChange: (d) => {
        setDayPopoverOpen(d.open);
        if (!d.open) setActiveEventId(null);
      },
      width: "auto",
      children: [
        /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: dayNumberButton }),
        /* @__PURE__ */ jsx(Popover.Content, { className: cn("w-72", classNames?.dayDetailsPopover), children: /* @__PURE__ */ jsx(
          ScheduleEventListPopoverContent,
          {
            events: dayEvents,
            activeEvent,
            onSelectEvent: handleSelectEvent,
            onBack: () => setActiveEventId(null),
            renderEventDetails,
            renderList: renderDayDetails ? (events, onSelectEvent) => renderDayDetails(day, events, { onSelectEvent }) : void 0,
            locale,
            timeZone,
            translations
          }
        ) })
      ]
    }
  );
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: mouse-only convenience click-through — the day-number button is the real keyboard-focusable trigger for the same action, so this outer cell is deliberately not itself a focusable/keyboard-operable control.
    /* @__PURE__ */ jsxs(
      "div",
      {
        ...props({
          "data-testid": `day-${cellKey}`,
          "data-disabled": disabled,
          "data-today": today
        }),
        onClick: openDayPopover,
        className: cn(
          // `overflow-hidden` (+ `min-h-0`) is load-bearing, not
          // decorative: a grid item's automatic minimum height is its
          // own content size by default, so a day packed with pills
          // would otherwise refuse to shrink to its 1fr track's real
          // height and visually spill into the row below — breaking
          // every other row's alignment for the whole grid, not just
          // this one cell. `overflow-hidden` resets that automatic
          // minimum to 0 (it establishes a new formatting context),
          // which is what actually makes `maxEventsPerDay` + the "+N"
          // pill a real cap instead of just a lower bound.
          "relative flex min-h-0 cursor-pointer flex-col gap-0.5 overflow-hidden p-1",
          !isLastColumn ? "border-e border-brand-900/20 dark:border-white/15" : null,
          !isLastRow ? "border-b border-brand-900/20 dark:border-white/15" : null,
          disabled ? "cursor-not-allowed" : null
        ),
        children: [
          disabled ? /* @__PURE__ */ jsx(ScheduleDisabledOverlay, { className: classNames?.disabledOverlay }) : null,
          dayNumberSection,
          /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col gap-0.5", children: [
            visible.map((event) => /* @__PURE__ */ jsx(
              MonthEventPill,
              {
                event,
                onEventClick,
                renderEventDetails,
                locale,
                timeZone,
                detailsPopoverClassName: classNames?.eventDetailsPopover
              },
              event.id
            )),
            overflow > 0 ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": eventCountLabel(translations.eventCount, overflow),
                onClick: (e) => {
                  e.stopPropagation();
                  openDayPopover();
                },
                className: "truncate px-1 text-start text-gray-light-500 text-xs hover:underline dark:text-gray-dark-400",
                children: `+${overflow}`
              }
            ) : null
          ] })
        ]
      },
      cellKey
    )
  );
}
function MonthView({
  data,
  staticEvents = [],
  onEventClick,
  onDayClick,
  renderEventDetails,
  renderDayDetails,
  locale,
  timeZone = getLocalTimeZone(),
  translations,
  classNames,
  className,
  date,
  defaultDate,
  onDateChange,
  withPagination = true,
  withNowButton = false,
  startOfWeek,
  now,
  dateUnavailable,
  maxEventsPerDay = 3,
  testId,
  ...rest
}) {
  const [currentDate, setCurrentDate] = useUncontrolled({
    value: date,
    defaultValue: defaultDate,
    finalValue: /* @__PURE__ */ new Date(),
    onChange: onDateChange
  });
  const t = resolveScheduleTranslations(translations);
  const todayRef = now ?? /* @__PURE__ */ new Date();
  const range = getVisibleRange("month", currentDate, {
    timeZone,
    locale: locale ?? "en-US",
    startOfWeek
  });
  const days = enumerateDays(range, timeZone);
  const weeks = days.length / 7;
  const weekdayLabels = days.slice(0, 7).map((d) => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone }).format(d));
  const allEvents = [...data, ...staticEvents];
  const rowMinHeightRem = monthRowMinHeightRem(maxEventsPerDay);
  return /* @__PURE__ */ jsxs(
    ark.div,
    {
      className: cn("flex h-full flex-col", className),
      "data-schedule-part": "month-view",
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        withPagination || withNowButton ? /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-1", children: [
          withPagination ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ScheduleToolbar.PrevTrigger,
              {
                view: "month",
                date: currentDate,
                onDateChange: setCurrentDate,
                timeZone,
                translations: t
              }
            ),
            /* @__PURE__ */ jsx(
              ScheduleToolbar.NextTrigger,
              {
                view: "month",
                date: currentDate,
                onDateChange: setCurrentDate,
                timeZone,
                translations: t
              }
            )
          ] }) : null,
          withNowButton ? /* @__PURE__ */ jsx(
            ScheduleToolbar.NowTrigger,
            {
              onDateChange: setCurrentDate,
              translations: t,
              className: "ms-2"
            }
          ) : null
        ] }) : null,
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              // `overflow-y-auto`: if a consumer's container is shorter than
              // `weeks * rowMinHeightRem` genuinely needs, the calendar scrolls
              // internally instead of either clipping pills (the cells' own
              // `overflow-hidden` would otherwise do that) or silently
              // overflowing whatever comes after it on the page.
              //
              // No border on this container itself — only the internal `border-e`/
              // `border-b` dividers below (each one skipped on the grid's own last
              // column/row) organize the cells. A full perimeter here would nest a
              // second bordered box directly inside whatever already-bordered
              // surface a consumer wraps the view in (e.g. this doc's own preview
              // card), reading as a redundant "double border".
              "grid min-h-0 flex-1 grid-cols-7 overflow-y-auto",
              classNames?.grid
            ),
            style: { gridTemplateRows: `auto repeat(${weeks}, minmax(${rowMinHeightRem}rem, 1fr))` },
            children: [
              weekdayLabels.map((label, i) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: cn(
                    "border-b border-brand-900/20 bg-brand-50/90 px-1.5 py-1 text-center font-medium text-gray-light-500 text-xs dark:border-white/15 dark:bg-brand-950/85 dark:text-gray-dark-400",
                    i % 7 !== 6 ? "border-e border-brand-900/20 dark:border-white/15" : null
                  ),
                  children: label
                },
                label
              )),
              days.map((day, i) => {
                const isLastColumn = i % 7 === 6;
                const isLastRow = i >= days.length - 7;
                const inMonth = isSameMonth(day, currentDate, timeZone);
                const today = isToday(day, todayRef, timeZone);
                const dayEvents = allEvents.filter((event) => eventOccursOnDay(event, day, timeZone)).sort((a, b) => a.start.getTime() - b.start.getTime());
                const visible = dayEvents.slice(0, maxEventsPerDay);
                const overflow = dayEvents.length - visible.length;
                const disabled = dateUnavailable?.(day) ?? false;
                const cellKey = dayKey(day, timeZone);
                const dayNumber = new Intl.DateTimeFormat(locale, { day: "numeric", timeZone }).format(
                  day
                );
                return /* @__PURE__ */ jsx(
                  MonthDayCell,
                  {
                    day,
                    cellKey,
                    dayEvents,
                    visible,
                    overflow,
                    inMonth,
                    disabled,
                    today,
                    dayNumber,
                    isLastColumn,
                    isLastRow,
                    onDayClick,
                    onEventClick,
                    renderEventDetails,
                    renderDayDetails,
                    locale,
                    timeZone,
                    translations: t,
                    classNames
                  },
                  cellKey
                );
              })
            ]
          }
        )
      ]
    }
  );
}
var eventCountLabel2 = (template, count) => template.replace("{count}", String(count));
function YearView({
  data,
  staticEvents = [],
  onDayClick,
  locale,
  timeZone = getLocalTimeZone(),
  translations,
  classNames,
  className,
  date,
  defaultDate,
  onDateChange,
  withPagination = true,
  withNowButton = false,
  now,
  dateUnavailable,
  testId,
  ...rest
}) {
  const [currentDate, setCurrentDate] = useUncontrolled({
    value: date,
    defaultValue: defaultDate,
    finalValue: /* @__PURE__ */ new Date(),
    onChange: onDateChange
  });
  const t = resolveScheduleTranslations(translations);
  const todayRef = now ?? /* @__PURE__ */ new Date();
  const yearRange = getVisibleRange("year", currentDate, { timeZone, locale: locale ?? "en-US" });
  const monthStarts = enumerateMonths(yearRange, timeZone);
  const allEvents = [...data, ...staticEvents];
  return /* @__PURE__ */ jsxs(
    ark.div,
    {
      className: cn("flex h-full flex-col", className),
      "data-schedule-part": "year-view",
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        withPagination || withNowButton ? /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-1", children: [
          withPagination ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ScheduleToolbar.PrevTrigger,
              {
                view: "year",
                date: currentDate,
                onDateChange: setCurrentDate,
                timeZone,
                translations: t
              }
            ),
            /* @__PURE__ */ jsx(
              ScheduleToolbar.NextTrigger,
              {
                view: "year",
                date: currentDate,
                onDateChange: setCurrentDate,
                timeZone,
                translations: t
              }
            )
          ] }) : null,
          withNowButton ? /* @__PURE__ */ jsx(
            ScheduleToolbar.NowTrigger,
            {
              onDateChange: setCurrentDate,
              translations: t,
              className: "ms-2"
            }
          ) : null
        ] }) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "grid min-h-0 flex-1 auto-rows-min grid-cols-2 gap-4 overflow-auto sm:grid-cols-3 lg:grid-cols-4 p-4",
              classNames?.grid
            ),
            children: monthStarts.map((monthStart) => {
              const monthGrid = getVisibleRange("month", monthStart, {
                timeZone,
                locale: locale ?? "en-US"
              });
              const nextMonthStart = monthStarts.find((m) => m.getTime() > monthStart.getTime());
              const monthEnd = nextMonthStart ?? yearRange.end;
              const daysInMonth = enumerateDays({ start: monthStart, end: monthEnd }, timeZone);
              const leadingBlanks = enumerateDays(
                { start: monthGrid.start, end: monthStart },
                timeZone
              ).length;
              const trailingBlanks = (7 - (leadingBlanks + daysInMonth.length) % 7) % 7;
              const monthName = new Intl.DateTimeFormat(locale, { month: "long", timeZone }).format(
                monthStart
              );
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-center font-medium text-gray-light-700 text-xs dark:text-gray-dark-300", children: monthName }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-7 gap-px", children: [
                  Array.from({ length: leadingBlanks }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length blank padding, never reordered.
                    /* @__PURE__ */ jsx("div", {}, i)
                  )),
                  daysInMonth.map((day) => {
                    const count = allEvents.filter(
                      (event) => eventOccursOnDay(event, day, timeZone)
                    ).length;
                    const disabled = dateUnavailable?.(day) ?? false;
                    const today = isToday(day, todayRef, timeZone);
                    const dayNumber = new Intl.DateTimeFormat(locale, {
                      day: "numeric",
                      timeZone
                    }).format(day);
                    const fullLabel = new Intl.DateTimeFormat(locale, {
                      dateStyle: "long",
                      timeZone
                    }).format(day);
                    const label = count > 0 ? `${fullLabel}, ${eventCountLabel2(t.eventCount, count)}` : fullLabel;
                    const key = dayKey(day, timeZone);
                    const cellClassName = cn(
                      "flex aspect-square flex-col items-center justify-center gap-px rounded-xs text-[10px] leading-none",
                      disabled ? "text-gray-light-300 dark:text-gray-dark-700" : "text-gray-light-700 dark:text-gray-dark-300"
                    );
                    const indicator = count === 1 ? /* @__PURE__ */ jsx("span", { className: "size-1 rounded-full bg-current" }, `${key}-dot`) : count > 1 ? /* @__PURE__ */ jsx("span", { className: "text-[8px]", children: count > 9 ? "9+" : count }, `${key}-count`) : null;
                    const dayNumberSpan = /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: cn(today && !disabled && "font-semibold text-brand-500"),
                        children: dayNumber
                      },
                      `${key}-number`
                    );
                    return onDayClick ? /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => onDayClick(day),
                        "aria-label": label,
                        ...props({
                          "data-testid": `day-${key}`,
                          "data-disabled": disabled,
                          "data-today": today
                        }),
                        className: cn(
                          cellClassName,
                          "cursor-pointer hover:bg-black/5 dark:hover:bg-white/8"
                        ),
                        children: [
                          dayNumberSpan,
                          indicator
                        ]
                      },
                      key
                    ) : (
                      // No `onDayClick`: a plain, non-interactive cell. No `aria-label`
                      // either — a generic `<div>`'s implicit role doesn't support one,
                      // and the visible day-number/indicator text is already exposed to
                      // assistive tech via normal document flow.
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          ...props({
                            "data-testid": `day-${key}`,
                            "data-disabled": disabled,
                            "data-today": today
                          }),
                          className: cellClassName,
                          children: [
                            dayNumberSpan,
                            indicator
                          ]
                        },
                        key
                      )
                    );
                  }),
                  Array.from({ length: trailingBlanks }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length blank padding, never reordered.
                    /* @__PURE__ */ jsx("div", {}, i)
                  ))
                ] })
              ] }, monthName);
            })
          }
        )
      ]
    }
  );
}
function ScheduleRoot({
  data,
  staticEvents = [],
  onEventClick,
  onDayClick,
  renderEventDetails,
  renderDayDetails,
  locale,
  timeZone = getLocalTimeZone(),
  translations,
  classNames,
  className,
  startHour = 0,
  endHour = 24,
  slotDuration = 15,
  hourHeight,
  slotDisabled,
  now,
  withNowIndicator = true,
  onEventChange,
  onEventRemove,
  onEventCreate,
  onEventDismiss,
  editable,
  preventOverlap,
  maxOverlapColumns,
  maxAllDayRows,
  onOverflowClick,
  empty,
  date,
  defaultDate,
  onDateChange,
  view,
  defaultView,
  onViewChange,
  withNowButton = true,
  align,
  visibleDays = 7,
  dateUnavailable,
  testId,
  ...rest
}) {
  const [currentDate, setCurrentDate] = useUncontrolled({
    value: date,
    defaultValue: defaultDate,
    finalValue: now ?? /* @__PURE__ */ new Date(),
    onChange: onDateChange
  });
  const [currentView, setCurrentView] = useUncontrolled({
    value: view,
    defaultValue: defaultView,
    finalValue: "days",
    onChange: onViewChange
  });
  const gridRef = useRef(null);
  const nowRef = useRef(null);
  const t = resolveScheduleTranslations(translations);
  return /* @__PURE__ */ jsxs(
    ark.div,
    {
      className: cn(
        "flex h-full flex-col overflow-hidden rounded-sm",
        // Days already closes its own frame — a `border-b` under the
        // header+all-day block and a `border-s` on each day column (which
        // also separates the hour gutter from day column 0) — so a second,
        // wrapping card border here would just be a redundant outer box.
        // Month/Year don't: `MonthView` deliberately skips its own outer-edge
        // cell borders and relies on this wrapper border to close its frame
        // (see its own comment), so only they keep it.
        "border border-brand-900/20 dark:border-white/15",
        className
      ),
      "data-schedule-part": "root",
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(ScheduleToolbar, { className: classNames?.toolbar, children: [
          /* @__PURE__ */ jsx(
            ScheduleToolbar.Title,
            {
              view: currentView,
              date: currentDate,
              timeZone,
              locale,
              align,
              visibleDays
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            withNowButton ? /* @__PURE__ */ jsx(
              ScheduleToolbar.NowTrigger,
              {
                onDateChange: (d) => {
                  setCurrentDate(d);
                  if (currentView === "days" && gridRef.current && nowRef.current) {
                    scrollElementToCenter(gridRef.current, nowRef.current);
                  }
                },
                now,
                translations: t
              }
            ) : null,
            /* @__PURE__ */ jsx(
              ScheduleToolbar.PrevTrigger,
              {
                view: currentView,
                date: currentDate,
                onDateChange: setCurrentDate,
                timeZone,
                translations: t,
                visibleDays
              }
            ),
            /* @__PURE__ */ jsx(
              ScheduleToolbar.NextTrigger,
              {
                view: currentView,
                date: currentDate,
                onDateChange: setCurrentDate,
                timeZone,
                translations: t,
                visibleDays
              }
            ),
            /* @__PURE__ */ jsx(
              ScheduleToolbar.ViewSwitcher,
              {
                view: currentView,
                onViewChange: setCurrentView,
                translations: t,
                className: "ms-1"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1", children: match(currentView).with("days", () => /* @__PURE__ */ jsx(
          DaysView,
          {
            data,
            staticEvents,
            onEventClick,
            onDayClick,
            renderEventDetails,
            locale,
            timeZone,
            translations: t,
            classNames,
            startHour,
            endHour,
            slotDuration,
            hourHeight,
            slotDisabled,
            now,
            withNowIndicator,
            onEventChange,
            onEventRemove,
            onEventCreate,
            onEventDismiss,
            editable,
            preventOverlap,
            maxOverlapColumns,
            maxAllDayRows,
            onOverflowClick,
            empty,
            date: currentDate,
            onDateChange: setCurrentDate,
            withPagination: false,
            withNowButton: false,
            visibleDays,
            align,
            gridRef,
            nowRef
          }
        )).with("month", () => /* @__PURE__ */ jsx(
          MonthView,
          {
            data,
            staticEvents,
            onEventClick,
            onDayClick,
            renderEventDetails,
            renderDayDetails,
            locale,
            timeZone,
            translations: t,
            classNames,
            date: currentDate,
            onDateChange: setCurrentDate,
            withPagination: false,
            withNowButton: false,
            startOfWeek: resolveWeekStartDay(align),
            now,
            dateUnavailable
          }
        )).with("year", () => /* @__PURE__ */ jsx(
          YearView,
          {
            data,
            staticEvents,
            onDayClick,
            locale,
            timeZone,
            translations: t,
            classNames,
            date: currentDate,
            onDateChange: setCurrentDate,
            withPagination: false,
            withNowButton: false,
            now,
            dateUnavailable
          }
        )).exhaustive() })
      ]
    }
  );
}
function DayView(props2) {
  return /* @__PURE__ */ jsx(DaysView, { ...props2, visibleDays: 1 });
}

// src/components/schedule/schedule-next-up-grouping.ts
function filterUpcomingEvents(events, now, pastEventsOffset) {
  const cutoff = now.getTime() - pastEventsOffset * 6e4;
  return events.filter((event) => event.end.getTime() > cutoff);
}
function groupUpcomingEvents(events, timeZone) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const groups = [];
  for (const event of sorted) {
    const key = dayKey(event.start, timeZone);
    let group = groups.at(-1);
    if (!group || group.key !== key) {
      group = { key, date: event.start, slots: [] };
      groups.push(group);
    }
    let slot = group.slots.at(-1);
    if (!slot || slot.start.getTime() !== event.start.getTime()) {
      slot = { start: event.start, events: [] };
      group.slots.push(slot);
    }
    slot.events.push(event);
  }
  return groups;
}
function buildNextUpAgenda(events, now, options) {
  return groupUpcomingEvents(
    filterUpcomingEvents(events, now, options.pastEventsOffset),
    options.timeZone
  );
}
function ScheduleNextUp({
  data,
  now,
  pastEventsOffset = 30,
  locale,
  timeZone = getLocalTimeZone(),
  translations,
  empty,
  renderEvent,
  classNames,
  className,
  testId,
  ...rest
}) {
  const current = useNow(now);
  const agenda = buildNextUpAgenda(data, current, { pastEventsOffset, timeZone });
  const firstEventId = agenda[0]?.slots[0]?.events[0]?.id;
  return /* @__PURE__ */ jsx(
    ark.section,
    {
      "data-schedule-part": "next-up-root",
      className: cn("flex flex-col gap-4", className),
      ...props({ "data-testid": testId }),
      ...rest,
      children: agenda.length === 0 ? /* @__PURE__ */ jsx("div", { "data-schedule-part": "next-up-empty", className: "py-6 text-center", children: /* @__PURE__ */ jsx(Text, { c: "muted", children: empty ?? translations?.empty ?? "No events" }) }) : /* @__PURE__ */ jsx("ol", { "data-schedule-part": "next-up-days", className: "flex flex-col gap-4", children: agenda.map((group) => {
        const labelId = `next-up-day-${group.key}`;
        return /* @__PURE__ */ jsxs(
          "li",
          {
            "data-schedule-part": "next-up-day-group",
            "aria-labelledby": labelId,
            className: cn("flex flex-col gap-2", classNames?.dayGroup),
            children: [
              /* @__PURE__ */ jsx(
                Divider,
                {
                  label: resolveNextUpDayLabel(group.date, current, { timeZone, locale }),
                  id: labelId,
                  labelPosition: "start",
                  className: cn("uppercase tracking-wide", classNames?.dayLabel)
                }
              ),
              /* @__PURE__ */ jsx("ol", { className: "grid grid-cols-[max-content_minmax(0,1fr)] items-start gap-x-3 gap-y-3", children: group.slots.map((slot) => /* @__PURE__ */ jsx(
                NextUpTimeGroupRow,
                {
                  slot,
                  locale,
                  timeZone,
                  firstEventId,
                  renderEvent,
                  classNames
                },
                `${group.key}-${slot.start.toISOString()}`
              )) })
            ]
          },
          group.key
        );
      }) })
    }
  );
}
function NextUpTimeGroupRow({
  slot,
  locale,
  timeZone,
  firstEventId,
  renderEvent,
  classNames
}) {
  const eventRow = (event, isFirst) => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "col-start-1 flex flex-col h-full items-end justify-center gap-0.5 pt-0.5", children: [
      isFirst ? /* @__PURE__ */ jsx(
        "time",
        {
          dateTime: slot.start.toISOString(),
          className: cn(
            "text-xs text-gray-light-900 tabular-nums dark:text-gray-dark-25 text-end",
            classNames?.time
          ),
          children: timeLabel(slot.start, timeZone, locale)
        }
      ) : null,
      /* @__PURE__ */ jsx(
        "span",
        {
          className: cn(
            "text-xs text-gray-light-500 tabular-nums dark:text-gray-dark-400 text-end",
            classNames?.duration
          ),
          children: durationLabel(event.start, event.end, locale)
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "col-start-2 min-w-0", children: /* @__PURE__ */ jsx(
      NextUpEventRow,
      {
        event,
        isNext: event.id === firstEventId,
        renderEvent,
        classNames
      }
    ) })
  ] });
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-schedule-part": "next-up-time-group",
      className: cn("col-span-2 grid grid-cols-subgrid items-start", classNames?.timeGroup),
      children: slot.events.length > 1 ? /* @__PURE__ */ jsx("ol", { className: "col-span-2 grid grid-cols-subgrid items-start gap-y-2", children: slot.events.map((event, i) => /* @__PURE__ */ jsx("li", { className: "col-span-2 grid grid-cols-subgrid items-start", children: eventRow(event, i === 0) }, event.id)) }) : (
        // Exactly one event — `groupUpcomingEvents` never produces an
        // empty slot, but `.map` (vs. a `[0]` index access) sidesteps
        // `noUncheckedIndexedAccess` without asserting that, and skips the
        // redundant "list of 1" nesting a lone event doesn't need.
        slot.events.map((event) => /* @__PURE__ */ jsx(Fragment$1, { children: eventRow(event, true) }, event.id))
      )
    }
  );
}
function NextUpEventRow({
  event,
  isNext,
  renderEvent,
  classNames
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-schedule-part": "next-up-event",
      "data-color": event.color,
      ...props({ "data-testid": event.testId ?? event.id }),
      className: cn("flex items-center gap-2", classNames?.event),
      children: renderEvent ? renderEvent(event, { isNext }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        event.icon != null ? /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "shrink-0 [&_svg]:size-4.5",
              event.color ? "text-(--c-text)" : "text-gray-light-400 dark:text-gray-dark-500",
              classNames?.icon
            ),
            children: event.icon
          }
        ) : null,
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: cn(
                "truncate text-start font-semibold text-gray-light-900 dark:text-gray-dark-25",
                classNames?.title
              ),
              children: event.title
            }
          ),
          event.description ? (
            // `div`, not `p` — `description` is `ReactNode`, so it can carry
            // block-level content; see `schedule-event-details.tsx`'s own
            // identical comment for why a `<p>` here is a real SSR
            // hydration-mismatch risk, not just a lint nicety.
            /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "truncate text-gray-light-500 text-start text-xs dark:text-gray-dark-400",
                  classNames?.description
                ),
                children: event.description
              }
            )
          ) : null
        ] })
      ] })
    }
  );
}
function WeekView(props2) {
  return /* @__PURE__ */ jsx(DaysView, { ...props2, visibleDays: 7 });
}

// src/components/schedule/index.ts
var Schedule = Object.assign(ScheduleRoot, {
  Root: ScheduleRoot,
  DaysView,
  DayView,
  WeekView,
  MonthView,
  YearView,
  Toolbar: ScheduleToolbar,
  NextUp: ScheduleNextUp
});

export { DayView, DaysView, MonthView, Schedule, ScheduleNextUp, ScheduleRoot, ScheduleToolbar, WeekView, YearView, allOf, anyOf, buildNextUpAgenda, dayKey, disableDateRanges, disableOutsideHours, disablePast, disableWeekends, durationLabel, enumerateDays, enumerateMonths, eventOccursOnDay, filterUpcomingEvents, formatScheduleTitle, getVisibleRange, groupUpcomingEvents, isSameMonth, isToday, layoutEventColumns, layoutEventColumnsCapped, paginateDate, rangeOverlapsAny, rangesOverlap, resolveNextUpDayLabel, resolveOverlapCandidates, timeLabel };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map