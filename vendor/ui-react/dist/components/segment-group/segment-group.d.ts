import { type VariantProps } from "class-variance-authority";
import type { FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
/**
 * SegmentGroup — a segmented single-choice control on Ark UI's SegmentGroup
 * machine (the radio-group model under the hood). It renders a row (or column)
 * of mutually exclusive segments with a sliding pill that animates to the
 * selected item. Use it as a compact, always-visible alternative to a `Select`
 * when the option set is small (2–5 items): view toggles, filters, billing
 * cadence, and the like.
 *
 *   - Value is a single `string | null`; `onChange` hands it to you directly,
 *     matching the kit's value-based `FormControlProps` contract.
 *   - `data` accepts bare strings (`value === label`) or
 *     `{ value, label?, disabled?, color?, payload? }` objects, mixed freely.
 *     The component is generic over `data` (a `const` type parameter), so
 *     `value` / `onChange` narrow to the literal value union and an item's
 *     `payload` flows—typed—into `renderItem` (the same contract as `Select`).
 *   - Label / description / error / required come from the built-in `Field`
 *     wrapper, so a `SegmentGroup` is accessible and complete on its own.
 *   - `name` renders a hidden radio input per item, so the selected value rides
 *     a native `<form>` submission.
 *
 * `variant` mirrors the `Button` family (`filled` / `light` / `outline` /
 * `subtle` / `default`): the tray, the sliding pill, and the checked label all
 * adopt the variant's treatment off the shared `--c-*` slots. Palette rides on
 * `data-color`, so every kit color tints for free. A per-item `color` overrides
 * the group palette for whichever segment is selected — and forces a solid
 * colored pill even under the otherwise-neutral `default` variant (signalled by
 * `data-tinted`).
 *
 * The moving pill is the Ark `Indicator`: Ark positions it absolutely via the
 * CSS vars `--left` / `--top` / `--width` / `--height` (the selected segment's
 * measured rect), so it sits *behind* the labels (`z-0`). Ark only re-measures
 * that rect on mount and on value change — not when `orientation` flips — so we
 * remount the root with `key={orientation}` to force a fresh measure on the new
 * axis. The value is held in `useUncontrolled` so the selection survives that
 * remount.
 */
/**
 * Per-segment label: size sets the padding / text, `variant` sets the *checked*
 * text color so it reads against that variant's pill. The unchecked color is a
 * neutral gray applied at the call site. `data-[tinted]` (a per-item color) flips
 * the neutral `default` checked label to `--c-on-solid` for the now-solid pill.
 */
declare const segItem: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "subtle" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "input-xs" | "input-sm" | "input-md" | "input-lg" | "input-xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * The tray. Mirrors the `Button` variants: `filled` is a heavier neutral fill so
 * the colored pill pops, `light` / `default` frame the pill with the same
 * translucent surface as `Input`'s own `default` shell (`bg-white/4` + the
 * hairline `border-brand-900/20 dark:border-white/15`) rather than an opaque
 * gray step, so the tray reads correctly on any host background, `subtle` /
 * `outline` are chromeless.
 */
declare const segTray: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "subtle" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "input-xs" | "input-sm" | "input-md" | "input-lg" | "input-xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type SegmentGroupSize = NonNullable<VariantProps<typeof segItem>["size"]>;
export type SegmentGroupVariant = VariantProps<typeof segTray>["variant"];
/**
 * A single segment: a bare value-as-label string, or a labelled object. Objects
 * may carry a `payload` of arbitrary data (the machine ignores it; it flows
 * through to `renderItem`, typed off the `data` shape — the same contract as
 * `Select`'s `SelectItem`).
 */
export type SegmentGroupItem<P = unknown> = string | {
    value: string;
    label?: ReactNode;
    disabled?: boolean;
    /** Overrides the group palette for the pill + label when this item is selected. */
    color?: Color;
    /** Arbitrary extra data, surfaced to `renderItem`. */
    payload?: P;
    /** `data-testid` on the rendered segment. Defaults to `` `item-${value}` ``. */
    testId?: string;
};
/** The `data` array the component is generic over. */
export type SegmentGroupData<P = unknown> = ReadonlyArray<SegmentGroupItem<P>>;
/**
 * Extract the value-string union from a `SegmentGroupData` shape — bare strings
 * and item `.value`s both contribute. A `const` type parameter narrows it to the
 * literal union, so `value` / `onChange` are typed off the data (like `Select`).
 */
export type SegmentGroupValue<Data extends SegmentGroupData> = ItemValue<Data[number]>;
type ItemValue<E> = E extends string ? E : E extends {
    value: infer V extends string;
} ? V : never;
/**
 * Extract the `payload` type carried by a `SegmentGroupData` shape, read
 * structurally off the data's `payload` property. Bare strings contribute
 * `never`; a homogeneous payload resolves precisely, a mixed one to the union.
 */
export type SegmentGroupPayload<Data extends SegmentGroupData> = PayloadOf<Data[number]>;
type PayloadOf<T> = T extends string ? never : T extends {
    payload?: infer P;
} ? P : never;
/**
 * The segment handed to `renderItem`: `value` narrowed to the data's value union
 * and `payload` to the data's payload type, so a `const`-typed `data` yields
 * literal values and a precise payload in the callback.
 */
export type RenderableSegment<Data extends SegmentGroupData> = {
    value: SegmentGroupValue<Data>;
    label: ReactNode;
    disabled: boolean;
    color: Color | undefined;
    payload: SegmentGroupPayload<Data> | undefined;
};
/** Live segment state passed alongside the item to `renderItem`. */
export type SegmentRenderState = {
    checked: boolean;
    disabled: boolean;
};
/**
 * Render a segment's label content yourself. Receives the (value-narrowed) item —
 * including its typed `payload` — and its live `{ checked, disabled }` state. The
 * segment keeps its sizing, pill, and selection wiring; you fill the label. In an
 * RSC tree the function must live in a `"use client"` module so the boundary
 * serializes it as a client reference.
 */
export type RenderSegment<Data extends SegmentGroupData> = (item: RenderableSegment<Data>, state: SegmentRenderState) => ReactNode;
type SegmentGroupClassNames = {
    field?: string;
    /** The label element itself — e.g. `"sr-only"` to keep the accessible name
     *  without showing it. */
    label?: string;
    root?: string;
    indicator?: string;
    item?: string;
    itemText?: string;
};
export type SegmentGroupProps<Data extends SegmentGroupData = SegmentGroupData> = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Segments: bare strings (`value === label`) or `{ value, label?, disabled?, color?, payload? }`. */
    data: Data;
    /** Controlled value. `null` clears the selection. */
    value?: SegmentGroupValue<Data> | null;
    /** Uncontrolled initial value. */
    defaultValue?: SegmentGroupValue<Data> | null;
    /** Fires with the selected value. */
    onChange?: (value: SegmentGroupValue<Data>) => void;
    /** Render each segment's label content yourself, with its typed `payload`. */
    renderItem?: RenderSegment<Data>;
    /** Lay the segments in a row (default) or a column. */
    orientation?: "horizontal" | "vertical";
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Dims and blocks interaction. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    /** `xs`–`xl` size the segments themselves; the `input-*` variants instead
     *  match the exact height of an `Input` / `NumberInput` at that size, for
     *  composing a `SegmentGroup` inline next to one (see `TimeInput`'s AM/PM
     *  toggle). */
    size?: SegmentGroupSize;
    variant?: SegmentGroupVariant;
    color?: Color;
    /** Wires the hidden radio inputs into native form submission. */
    name?: string;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the root for focus-on-error. */
    ref?: Ref<HTMLDivElement>;
    /** Forwarded to the root; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    className?: string;
    classNames?: SegmentGroupClassNames;
};
export declare const SegmentGroup: <const Data extends SegmentGroupData = SegmentGroupData>({ data, value, defaultValue, onChange, renderItem, orientation, invalid, disabled, readOnly, required, size, variant, color, name, id, ref, onBlur, label, description, error, className, classNames, testId, }: SegmentGroupProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=segment-group.d.ts.map