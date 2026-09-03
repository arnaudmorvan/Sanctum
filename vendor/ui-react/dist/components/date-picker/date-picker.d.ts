import { DatePicker as Ark, type DatePickerDateRangePreset as DateRangePreset, type DateValue, type DatePickerDateView as DateView } from "@ark-ui/react/date-picker";
import { type ReactNode } from "react";
import type { Color } from "../../lib/colors";
import { type DateRangeValue } from "../../lib/date-value";
import type { FormControlProps } from "../../lib/form-control";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type CalendarTranslations } from "../calendar/calendar";
import { CalendarBody, type CalendarBodyClassNames } from "../calendar/calendar-body";
import { type FieldProps } from "../field/field";
import { type InputVariant } from "../input/input";
import { Popover } from "../popover/popover";
import { type HourCycle } from "../time-input/hour-cycle";
import { TimeRow, type TimeRowTranslations } from "../time-input/time-row";
/** Hidden-input serialization. `DateValue#toString()` isn't safe to call directly here: a
 *  `ZonedDateTime` (what our own `dateToCalendarValue` produces for a `defaultValue`/`value`
 *  passed in) stringifies with a full offset + IANA zone suffix, while a plain `CalendarDate`
 *  (what a day-grid click produces) stringifies as a clean date — two different formats for the
 *  same picked day depending on provenance. Read the wall-calendar fields directly instead.
 *  Whether to append the time portion is driven by the picker's own `withTime` flag, not by
 *  whether the value happens to carry an `hour` field — a `ZonedDateTime` always has one (even
 *  at local midnight), so that structural check can't tell "date-only" from "with time" apart. */
export declare const serializeDateValue: (value: DateValue, withTime: boolean) => string;
export type DatePickerClassNames = {
    field?: string;
    control?: string;
    content?: string;
    presets?: string;
    calendar?: CalendarBodyClassNames;
    timePanel?: {
        hour?: string;
        minute?: string;
        second?: string;
        period?: string;
    };
    footer?: string;
};
/** `value`/`range`-shaped entries are for `range` mode; `date`-shaped entries are for single-date
 *  mode. Nothing prevents mixing them for the picker's current mode — the shape you pass is
 *  trusted, not validated at runtime (a mismatched entry just doesn't produce useful behavior;
 *  `api.setValue`/`getRangePresetValue` are mode-agnostic in the underlying machine). */
export type DatePreset = {
    label: string;
    value: DateRangePreset;
} | {
    label: string;
    range: {
        start: Date;
        end: Date;
    } | null;
} | {
    label: string;
    date: Date | null;
};
/** Identifies each entry `getDefaultPresets` builds for `presets={true}`, so a `translations`
 *  override can target one label without redefining the whole set. */
export type DatePickerPresetId = "today" | "yesterday" | "tomorrow" | "nextWeek" | "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth" | "thisYear" | "allTime";
/** One unified `translations` prop rather than one per string source — Ark's own accessible
 *  names, the `presets={true}` default labels, and the embedded time row's strings all belong to
 *  the same `DatePicker` instance a consumer is localizing. English defaults throughout;
 *  unset keys keep their built-in text. */
export type DatePickerTranslations = Partial<CalendarTranslations> & TimeRowTranslations & {
    /** The `withConfirm` footer's revert button. Default `"Cancel"`. */
    cancel?: string;
    /** The `withConfirm` footer's commit button. Default `"Apply"`. */
    apply?: string;
    /** The embedded time row's label under `range` + `withTime` (first row). Default `"Start time"`. */
    startTime?: string;
    /** The embedded time row's label under `range` + `withTime` (second row). Default `"End time"`. */
    endTime?: string;
    /** Individual `presets={true}` default-set labels, keyed by id — override just the ones you
     *  need without redefining the whole array. Pass your own `DatePreset[]` for full control. */
    presets?: Partial<Record<DatePickerPresetId, string>>;
};
export type DatePickerProps<Range extends boolean = false> = FormControlProps<Range extends true ? DateRangeValue : Date | null, HTMLButtonElement> & Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Select a `{ start, end }` range instead of a single date. */
    range?: Range;
    /** Adds an embedded HOUR/MINUTE (+ SECOND) time row; the value carries H/M too. */
    withTime?: boolean;
    /** Months shown side by side. Default `1`, regardless of `range` — pass `2` to show a full
     *  range without paging (matches `Calendar`'s own plain default). */
    numOfMonths?: number;
    /** Always render 6 week rows (padding with adjacent-month days) instead of however many the
     *  visible month(s) actually span (4–6) — keeps the popover's height constant while
     *  navigating between months. */
    fixedWeeks?: boolean;
    /** Preset sidebar — range shortcuts under `range`, single-date shortcuts otherwise. `true`
     *  renders a mode-appropriate default set; an array is fully custom. See `DatePreset`. */
    presets?: DatePreset[] | boolean;
    /** Stage the selection; commit only on Apply. Cancel reverts to the last committed value. */
    withConfirm?: boolean;
    /** Renders a clear trigger once a value is set; emits `null` (or an all-null range). */
    clearable?: boolean;
    /** Restriction predicate over a native `Date`. Compose with `lib/date-predicates.ts`'s helpers. */
    isDateUnavailable?: (date: Date) => boolean;
    min?: Date;
    max?: Date;
    /** Bounds the view levels reachable via navigation (e.g. `minView="month"`). */
    minView?: DateView;
    maxView?: DateView;
    /** Overrides the active locale context. Drives month/day names, first-day-of-week, and the
     *  embedded time row's 12h/24h default. */
    locale?: string;
    /** Overrides the local time zone for every `Date ↔ DateValue` conversion. Default
     *  `getLocalTimeZone()` — **not** Ark's own machine default (`"UTC"`). */
    timeZone?: string;
    /** Force 12-hour or 24-hour display for the embedded time row, overriding the locale default. */
    format?: 12 | 24;
    /** Force a specific hour cycle, overriding the locale default and `format`. */
    hourCycle?: HourCycle;
    minuteStep?: number;
    withSeconds?: boolean;
    /** Placeholder shown in the embedded time row's empty Hour/Minute/Second fields — see
     *  TimeRow's `placeholder`. Default `"--"`. */
    timePlaceholder?: string;
    /** Overrides built-in English strings — Ark's own accessible names, the `presets={true}`
     *  default labels, Cancel/Apply, Start/End time, and the embedded time row's Hour/Minute/
     *  Second/Period labels. Unlike `locale`, nothing here auto-derives. Partial — unset keys
     *  keep their English default. */
    translations?: DatePickerTranslations;
    /** Placeholder shown while no date is selected. */
    placeholder?: string;
    /** Inline-start adornment. Defaults to a calendar icon. */
    startSlot?: ReactNode;
    size?: Size;
    variant?: InputVariant;
    color?: Color;
    className?: string;
    classNames?: DatePickerClassNames;
};
declare const PresetsRail: ({ presets, range, timeZone, withConfirm, translations, className, }: {
    presets: DatePreset[] | boolean;
    /** Which default set `presets === true` resolves to — irrelevant once `presets` is a concrete array. */
    range?: boolean;
    timeZone: string;
    withConfirm?: boolean;
    /** Overrides individual `presets={true}` default-set labels, keyed by id. No effect on a
     *  custom `DatePreset[]`. */
    translations?: Partial<Record<DatePickerPresetId, string>>;
    className?: string;
}) => import("react").JSX.Element | null;
export type TimePanelRowProps = {
    value: DateValue | undefined;
    onSetTime: (time: {
        hour: number;
        minute: number;
        second?: number;
    }) => void;
    label?: string;
    disabled?: boolean;
    hourCycle: HourCycle;
    minuteStep?: number;
    withSeconds?: boolean;
    /** Placeholder shown in the row's empty Hour/Minute/Second fields — see TimeRow's
     *  `placeholder`. Default `"--"`. */
    placeholder?: string;
    /** Resolves the locale-correct AM/PM labels + Hour/Minute/Second unit suffixes via `Intl`.
     *  Falls back to `useLocaleContext()` when omitted. */
    locale?: string;
    /** Overrides the sr-only Hour/Minute/Second/Period accessible names. English by default. */
    translations?: TimeRowTranslations;
    size?: Size;
    variant?: InputVariant;
    color?: Color;
    classNames?: DatePickerClassNames["timePanel"] & {
        root?: string;
    };
};
/** One HOUR/MINUTE(+SECOND)+AM/PM row, bridging `TimeRow`'s display-space props to a specific
 *  `api.value` index via `api.setTime(time, index)` — the same shared `TimeRow` `TimeInput`
 *  wraps with its own local state, wrapped here with the machine's state instead. */
declare const TimePanelRow: ({ value, onSetTime, label, disabled, hourCycle, minuteStep, withSeconds, placeholder, locale, translations, size, variant, color, classNames, }: TimePanelRowProps) => import("react").JSX.Element;
export declare const DatePicker: (<Range extends boolean = false>(props: DatePickerProps<Range>) => ReactNode) & {
    Root: typeof Ark.Root;
    Context: typeof Ark.Context;
    Control: typeof Ark.Control;
    Input: typeof Ark.Input;
    Trigger: typeof Ark.Trigger;
    ClearTrigger: typeof Ark.ClearTrigger;
    Content: typeof Ark.Content;
    Presets: typeof PresetsRail;
    Calendar: typeof CalendarBody;
    TimePanel: typeof TimeRow;
    TimePanelRow: typeof TimePanelRow;
    Footer: typeof Popover.Footer;
};
export {};
//# sourceMappingURL=date-picker.d.ts.map