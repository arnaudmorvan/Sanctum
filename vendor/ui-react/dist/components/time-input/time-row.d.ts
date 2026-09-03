import type { FocusEvent, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { InputVariant } from "../input/input";
import { type HourCycle } from "./hour-cycle";
/**
 * The HOUR/MINUTE (+ SECOND) + AM/PM row — the piece `TimeInput` wraps with
 * state, and `DatePicker`'s embedded time panel wraps with `api.setTime()`
 * (one implementation, two call sites). Operates entirely in *display* units
 * (1–12 in 12h mode, 0–23 in 24h) — the always-24h stored `hour` conversion
 * happens at the caller's boundary, not here.
 */
type TimeRowClassNames = {
    hour?: string;
    minute?: string;
    second?: string;
    period?: string;
};
/** Overrides the sr-only accessible names for Hour/Minute/Second/Period — English by default.
 *  Arbitrary microcopy with no locale-derivation path (unlike AM/PM and the unit suffixes,
 *  which read from `Intl` instead). */
export type TimeRowTranslations = {
    hour?: string;
    minute?: string;
    second?: string;
    period?: string;
};
/** The row's own minimum rendered width for a given configuration. `DatePicker` uses this (see
 *  its own `calendarColumnWidth` comment) to keep its popover column at least as wide as the
 *  embedded time row needs, instead of only ever sizing off the calendar grid — otherwise the
 *  row's `flex-1` + `min-w-0` fields silently shrink below their content size to fit.
 *
 *  This is deliberately just Hour/Minute/[Second] at their basis plus the gaps *between* them —
 *  not the AM/PM toggle's width added on top. The toggle wraps onto its own line (the row's
 *  `flex-wrap` below) rather than forcing the row wider, so at a single narrow month it drops
 *  below Hour/Minute instead of pushing the popover past the calendar's own width — the row only
 *  needs to be as wide as the toggle itself in the (currently never hit — Hour+Minute together
 *  are wider than the toggle at every size) case where that's the larger requirement. */
export declare const timeRowMinWidth: (size: Size, hourCycle: HourCycle, withSeconds: boolean | undefined) => number;
export type TimeRowProps = {
    hour: number | null;
    minute: number | null;
    second?: number | null;
    onHourChange: (hour: number | null) => void;
    onMinuteChange: (minute: number | null) => void;
    onSecondChange?: (second: number | null) => void;
    period: "AM" | "PM" | null;
    onPeriodChange: (period: "AM" | "PM") => void;
    hourCycle: HourCycle;
    minuteStep?: number;
    withSeconds?: boolean;
    /** Placeholder shown in each empty Hour/Minute/Second field. Default `"--"`. */
    placeholder?: string;
    /** Resolves the locale-correct AM/PM labels + Hour/Minute/Second unit suffixes via `Intl`.
     *  Falls back to `useLocaleContext()` when omitted. */
    locale?: string;
    /** Overrides the sr-only Hour/Minute/Second/Period accessible names. English by default. */
    translations?: TimeRowTranslations;
    size?: Size;
    variant?: InputVariant;
    color?: Color;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    /** Lands on the hour field's `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    /** Forwarded to the hour field's `<input>`; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    className?: string;
    classNames?: TimeRowClassNames;
};
export declare const TimeRow: ({ hour, minute, second, onHourChange, onMinuteChange, onSecondChange, period, onPeriodChange, hourCycle, minuteStep, withSeconds, placeholder, locale, translations, size, variant, color, disabled, readOnly, invalid, ref, onBlur, className, classNames, }: TimeRowProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=time-row.d.ts.map