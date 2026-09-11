import { type DatePickerProps } from "./date-picker";
export type DateRangePickerProps = Omit<DatePickerProps<true>, "range">;
/** `DateRangePicker` === `<DatePicker range />` — same component, narrowed value type. */
export declare const DateRangePicker: (props: DateRangePickerProps) => import("react").JSX.Element;
export type DateTimePickerProps = Omit<DatePickerProps<false>, "withTime">;
/** `DateTimePicker` === `<DatePicker withTime />`. */
export declare const DateTimePicker: (props: DateTimePickerProps) => import("react").JSX.Element;
export type DateTimeRangePickerProps = Omit<DatePickerProps<true>, "range" | "withTime">;
/** `DateTimeRangePicker` === `<DatePicker range withTime />`. */
export declare const DateTimeRangePicker: (props: DateTimeRangePickerProps) => import("react").JSX.Element;
//# sourceMappingURL=aliases.d.ts.map