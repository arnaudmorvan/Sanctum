import { Slider as Ark } from "@ark-ui/react/slider";
import type { ComponentPropsWithoutRef, FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
/**
 * Slider — Range input on top of Ark UI's Slider state
 * machine. Ark owns keyboard nav, RTL flipping, drag math, and ARIA wiring;
 * this wrapper provides the styled parts and a flatter API.
 *
 *   - Single or range. Pass a `number` for one thumb, or `[number, number]`
 *     for a two-thumb range. The value shape drives everything: the callbacks
 *     echo back the same shape, and a thumb (with its own label) is rendered
 *     per value. The component is generic over the shape (`V`) so single-value
 *     callers keep `number` types — no `number | number[]` leaking into their
 *     handlers.
 *   - `marks` paints filled dots on the track and an optional label below.
 *     Dots between the thumbs (or up to the thumb, for a single value) read
 *     as active.
 *   - `label` floats above each thumb; visible on hover/focus by default.
 *   - Track/range/thumb parts can be overridden via `classNames`.
 *
 * Palette is delivered through the kit's `data-color` + slot-var system
 * (see `components.md` -> Color system). The root writes `data-color={color}`
 * and the range/thumb reference `--c-solid` — adding a new color in
 * `colors.css` works here for free, no slider edits needed.
 */
type SliderValue = number | number[];
export type SliderSize = Size | null | undefined;
type SliderMark = {
    value: number;
    label?: ReactNode;
};
type SliderClassNames = {
    field?: string;
    root?: string;
    control?: string;
    track?: string;
    range?: string;
    thumb?: string;
    thumbLabel?: string;
    mark?: string;
    markGroup?: string;
    markDot?: string;
    markLabel?: string;
};
type ArkRootProps = ComponentPropsWithoutRef<typeof Ark.Root>;
/**
 * `V` is the value shape: `number` for a single thumb (the default), or
 * `number[]` (use `[number, number]`) for a two-thumb range. Inferred from
 * `value` / `defaultValue`, so callbacks echo back the same shape.
 */
export type SliderProps<V extends SliderValue = number> = Pick<FieldProps, "description" | "error" | "required"> & Omit<ArkRootProps, "value" | "defaultValue" | "onValueChange" | "onValueChangeEnd" | "onChange" | "onBlur" | "ref" | "className"> & WithTestId & {
    /** Controlled value. `number` for one thumb, `[number, number]` for a range. */
    value?: V;
    /** Uncontrolled initial value. Its shape decides single vs. range. */
    defaultValue?: V;
    /** Fires on every value change (drag, keyboard, click). */
    onChange?: (value: V) => void;
    /** Fires once the interaction settles (mouseup / keyup). */
    onChangeEnd?: (value: V) => void;
    /** Tick marks rendered on the track. */
    marks?: SliderMark[];
    /**
     * Floating label above each thumb. Pass a static node, a function that
     * receives a thumb's live value, or `null` to disable. In an RSC tree the
     * function form must live in a `"use client"` module so the boundary
     * serializes it as a client reference.
     */
    label?: ReactNode | ((value: number) => ReactNode) | null;
    /**
     * Default to `hover`, when `false` or `never` the label is hidden.
     * When `true` or `always`, the label is always visible.
     */
    showLabel?: boolean | "hover" | "always" | "never";
    size?: SliderSize;
    color?: Color;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Forwarded to the slider root; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
    /** Lands on the first thumb (the `role="slider"` element) for focus-on-error. */
    ref?: Ref<HTMLDivElement>;
    className?: string;
    classNames?: SliderClassNames;
};
export declare const Slider: <V extends SliderValue = number>({ value, defaultValue, onChange, onChangeEnd, marks, label, size, showLabel, color, min, max, step, disabled, invalid, onBlur, ref, description, error, required, className, classNames, testId, ...rest }: SliderProps<V>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=slider.d.ts.map