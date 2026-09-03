import { DatePicker as Ark, type DatePickerDateView as DateView } from "@ark-ui/react/date-picker";
import type { ComponentProps, ReactNode } from "react";
import { type DateRangeValue } from "../../lib/date-value";
import type { FormControlProps } from "../../lib/form-control";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type CalendarBodyClassNames } from "./calendar-body";
/**
 * Calendar — the inline month grid (RFC §9, `docs/rfcs/date-picker.md`): Ark's `date-picker`
 * machine rendered `inline` (no trigger/popover), wrapping the shared `CalendarBody` grid that
 * `DatePicker` will later reuse verbatim inside its own popover.
 *
 *   - Value is a native `Date | null` (or `{ start, end }` under `range`) — the machine's
 *     `DateValue` array contract never leaks out; `lib/date-value.ts` is the one conversion
 *     boundary both directions go through.
 *   - Controlled/uncontrolled `value` / `defaultValue` / `onChange` go straight to Ark's own
 *     machine, which supports both natively — no `useUncontrolled` needed here.
 *   - `isDateUnavailable` / `min` / `max` take native `Date`s and are adapted to Ark's
 *     `DateValue`-based signature at this boundary; pair with the `lib/date-predicates.ts`
 *     helpers (`disablePast()`, `disableWeekends()`, …).
 *   - No `label` / `description` / `error` / `FieldShell` wrap — `Calendar` is a bare widget
 *     (like `Table`), not a form field. A `DatePicker` popover is where a field wrapper belongs.
 *
 *   <Calendar value={date} onChange={setDate} isDateUnavailable={disableWeekends()} />
 */
export type CalendarClassNames = CalendarBodyClassNames & {
    /** The outermost `Ark.Root` element. */
    root?: string;
};
/** Ark's own `translations` prop type, derived structurally rather than imported by name —
 *  `IntlTranslations` lives in `@zag-js/date-picker`, a transitive dependency of the
 *  `@ark-ui/react` peer dep, not one this package declares itself. */
type ArkTranslations = NonNullable<ComponentProps<typeof Ark.Root>["translations"]>;
/** The subset `CalendarBody`'s rendered anatomy actually exercises — `trigger`/`clearTrigger`
 *  only apply when composed under `DatePicker` (a bare `Calendar` never renders a trigger/clear
 *  button; harmless no-op keys there). Partial override: unset keys fall back to Ark's own
 *  English text. */
export type CalendarTranslations = Pick<ArkTranslations, "dayCell" | "trigger" | "viewTrigger" | "prevTrigger" | "nextTrigger" | "clearTrigger" | "content" | "weekColumnHeader" | "weekNumberCell">;
/** Merges a partial override over Ark's own English defaults into the full shape `Ark.Root`
 *  requires. `undefined` when nothing is passed, so the zero-config path forwards nothing to
 *  `Ark.Root` at all — identical to today's behavior. */
export declare const resolveCalendarTranslations: (overrides?: Partial<CalendarTranslations>) => ArkTranslations | undefined;
export type CalendarProps<Range extends boolean = false> = FormControlProps<Range extends true ? DateRangeValue : Date | null, HTMLDivElement> & WithTestId & {
    /** Select a `{ start, end }` range instead of a single date. */
    range?: Range;
    /** Months shown side by side. Default 1. */
    numOfMonths?: number;
    /** Restriction predicate over a native `Date`. Compose with `lib/date-predicates.ts`'s helpers. */
    isDateUnavailable?: (date: Date) => boolean;
    min?: Date;
    max?: Date;
    /** Bounds the view levels reachable via navigation (e.g. `minView="month"` for a month-only
     *  picker that never drills into individual days). */
    minView?: DateView;
    maxView?: DateView;
    /** Per-day decoration slot — the "event dot" (RFC §9). */
    renderDay?: (date: Date, ctx: {
        isUnavailable: boolean;
        isSelected: boolean;
    }) => ReactNode;
    /** Always render 6 week rows (padding with adjacent-month days) instead of however many the
     *  visible month(s) actually span (4–6) — keeps the grid's height constant while navigating
     *  between months. */
    fixedWeeks?: boolean;
    withWeekNumbers?: boolean;
    /** Overrides the active locale context. Drives month/day names and first-day-of-week. */
    locale?: string;
    /** Overrides the local time zone for every `Date ↔ DateValue` conversion. Default
     *  `getLocalTimeZone()` — **not** Ark's own machine default (`"UTC"`), which is why this is
     *  forwarded to `Ark.Root` explicitly rather than only used in this component's own
     *  conversions (see `lib/date-value.ts`'s module doc). */
    timeZone?: string;
    /** Overrides Ark's own built-in aria-label/accessible-name strings (day cells, prev/next, the
     *  view-cycling header, week numbers) — English by default. Unlike `locale`, nothing here
     *  auto-derives; supply your own translated strings. Partial — unset keys keep Ark's default. */
    translations?: Partial<CalendarTranslations>;
    size?: Size;
    className?: string;
    classNames?: CalendarClassNames;
};
export declare const Calendar: <Range extends boolean = false>({ range, value, defaultValue, onChange, onBlur, numOfMonths, isDateUnavailable, min, max, minView, maxView, renderDay, fixedWeeks, withWeekNumbers, locale, timeZone, translations, size, disabled, readOnly, required, invalid, name, id, ref, className, classNames, testId, }: CalendarProps<Range>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=calendar.d.ts.map