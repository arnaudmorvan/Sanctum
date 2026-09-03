import type { Color } from "../../lib/colors";
import type { FormControlProps } from "../../lib/form-control";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import type { InputVariant } from "../input/input";
import { type HourCycle } from "./hour-cycle";
import { type TimeRowTranslations } from "./time-row";
/**
 * TimeInput — a standalone HOUR/MINUTE (+ SECOND) + AM/PM time entry, composed
 * from the kit's `NumberInput` + `SegmentGroup` (Ark ships no time-picker
 * machine, only a countdown timer). It's the same time row `DatePicker`
 * embeds in its popover for `withTime`.
 *
 *   - Value is `{ hour, minute, second? } | null` — `hour` is always stored in
 *     24h, regardless of display. There's no built-in range: a "start" /
 *     "end" pair reads better as two labelled `TimeInput`s (e.g. "Start
 *     time" / "End time") than as one control with no visual differentiation
 *     between its two halves — compose that at the call site.
 *   - 12h vs 24h is locale-driven by default (`Intl.DateTimeFormat`'s
 *     `hourCycle`); override with `format` or `hourCycle`.
 *   - Label / description / error come from the built-in `Field` wrapper.
 *   - `name` wires a hidden `HH:mm[:ss]` input into native form submission —
 *     the machine-backed controls in this kit have a real hidden part for
 *     this; a composed field like this one has none, so it's hand-rolled.
 *
 * Palette / shape forward straight through to the underlying `NumberInput` /
 * `SegmentGroup` instances, so it matches the rest of the family for free.
 */
type TimeInputClassNames = {
    field?: string;
    hour?: string;
    minute?: string;
    second?: string;
    period?: string;
};
export type TimeValue = {
    hour: number;
    minute: number;
    second?: number;
} | null;
export type TimeInputProps = Omit<FormControlProps<TimeValue, HTMLInputElement>, "id"> & Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Force 12-hour or 24-hour display, overriding the locale default. */
    format?: 12 | 24;
    /** Force a specific hour cycle, overriding the locale default and `format`. */
    hourCycle?: HourCycle;
    /** Minute stepper increment. Default `1`. */
    minuteStep?: number;
    /** Add a SECOND field alongside HOUR/MINUTE. */
    withSeconds?: boolean;
    /** Placeholder shown in each empty Hour/Minute/Second field. Default `"--"`. */
    placeholder?: string;
    /** Locale used to resolve 12h vs 24h. Defaults to the active locale context. */
    locale?: string;
    /** Overrides the sr-only Hour/Minute/Second/Period accessible names. English by default. */
    translations?: TimeRowTranslations;
    size?: Size;
    variant?: InputVariant;
    color?: Color;
    className?: string;
    classNames?: TimeInputClassNames;
};
export declare const TimeInput: ({ value, defaultValue, onChange, format, hourCycle, minuteStep, withSeconds, placeholder, locale, translations, size, variant, color, disabled, readOnly, invalid, required, name, onBlur, ref, label, description, error, className, classNames, testId, }: TimeInputProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=time-input.d.ts.map