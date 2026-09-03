import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import type { FlatValueOf } from "../../lib/select-data";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type ControlIndicatorVariant } from "../checkbox/control";
/**
 * ChoiceCardGroup — a data-driven set of **selectable cards**, the richer cousin
 * of `RadioGroup` / `Checkbox`. Each option is a bordered card with a title, an
 * optional helper line, and an optional leading icon / avatar / misc slot;
 * selecting one tints its border and fill with the active palette. The group's
 * `label` / `description` / `error` / `required` live around it via the shared
 * `Field` scaffold, so it is accessible and complete on its own — exactly like
 * the rest of the form family (and implementing the kit's value-based
 * `FormControlProps` contract).
 *
 * One prop, `multiple`, switches the selection semantics — and the machine under
 * the hood:
 *
 *   - **single** (default): Ark UI's `RadioGroup`. The value is a `string | null`
 *     and each card shows a **radio** circle.
 *   - **multi** (`multiple`): Ark UI's `CheckboxGroup`. The value is a `string[]`
 *     and each card shows a **checkbox** tick.
 *
 * Arrow keys move focus between cards in both modes — native for the radio
 * path (grouped `<input type="radio">`), hand-rolled for the checkbox path
 * (standalone checkboxes have no such native grouping). Only single mode
 * selects as focus moves; multi mode still needs `Space` / a click to toggle.
 *
 * In both modes `onChange` hands you the next value directly (a value, not a DOM
 * event), `name` wires the hidden inputs into native form submission, and `ref` /
 * `onBlur` land on the group root for focus-on-error. `invalid` is OR'd with
 * `error != null`, so a form library can flip the red state independently of the
 * message.
 *
 *   - `data` accept bare strings (`value === label`) or
 *     `{ value, label, description?, icon?, disabled? }` objects, mixed freely.
 *   - `icon` is the leading **start** slot — any node (icon, avatar, …). When an
 *     item has one, that card lays the icon at the start and pushes the selection
 *     indicator to the **end**; otherwise the indicator sits at the start.
 *   - `renderItem` is an escape hatch that replaces a card's text block with your
 *     own content, handed the item and its live `{ checked, disabled }` state.
 *
 * The card reuses the family's shared `controlIndicator` surface for its tick /
 * dot (`variant`: `default` monochrome or `filled` palette-colored), so a card's
 * checkbox matches a bare `Checkbox` pixel-for-pixel. The selected card's tint
 * and the focus ring ride the `--c-solid` / `--c-soft` slot vars off `data-color`,
 * so every kit color works for free; `invalid` overrides to red.
 */
/** A single option: a bare string (used as both value + label) or an explicit object. */
export type ChoiceCardItem = string | {
    value: string;
    label: ReactNode;
    /** Helper line under the card's title. */
    description?: ReactNode;
    /** Leading start slot — icon / avatar / misc. Moves the indicator to the card's end. */
    icon?: ReactNode;
    disabled?: boolean;
    /** `data-testid` on the rendered card. Defaults to `` `item-${value}` ``. */
    testId?: string;
};
/** A fully resolved option (a bare string is normalized to `{ value, label }`). */
type NormalizedItem = {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    testId: string;
};
/** Live state handed to `renderItem` alongside the item. */
export type ChoiceCardRenderState = {
    checked: boolean;
    disabled: boolean;
};
/**
 * Render a card's content yourself. Receives the (normalized) item and its live
 * `{ checked, disabled }` state, and replaces the default title + description
 * block; the card keeps its surface, icon slot, indicator, and selection wiring.
 * In an RSC tree the function must live in a `"use client"` module.
 */
export type RenderChoiceCard = (item: NormalizedItem, state: ChoiceCardRenderState) => ReactNode;
type ChoiceCardClassNames = {
    field?: string;
    root?: string;
    item?: string;
    control?: string;
    label?: string;
    description?: string;
};
export type ChoiceCardGroupData = ReadonlyArray<ChoiceCardItem>;
/** The value union `data` narrows to — literal option values for a `const`-typed
 *  `data` array, or plain `string` for a dynamically-built one. */
export type ChoiceCardGroupValue<Data extends ChoiceCardGroupData> = FlatValueOf<Data>;
type ChoiceCardGroupBaseProps<Data extends ChoiceCardGroupData> = WithTestId & {
    /** The options. Bare strings are normalized to `{ value, label }`. */
    data: Data;
    /** Stacking direction of the cards. */
    orientation?: "horizontal" | "vertical";
    /** Replace a card's text block with your own content (with its live state). */
    renderItem?: RenderChoiceCard;
    /** Field label above the group. */
    label?: ReactNode;
    /** Helper text below the group. */
    description?: ReactNode;
    /** Error message below the group; its presence sets the invalid state. */
    error?: ReactNode;
    /** Required flag (and, with a label, the red asterisk). */
    required?: boolean;
    /** Red invalid state, OR'd with `error != null`. */
    invalid?: boolean;
    /** Dims and blocks interaction. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    size?: Size;
    /** Indicator fill: `default` (monochrome) or `filled` (palette-colored). */
    variant?: ControlIndicatorVariant;
    color?: Color;
    /** Field name for native form submission. */
    name?: string;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the group root for focus-on-error. */
    ref?: Ref<HTMLDivElement>;
    /** Forwarded to the group root; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    className?: string;
    classNames?: ChoiceCardClassNames;
};
/** Single-select (radio): value is a `string | null`. */
type SingleSelection<Data extends ChoiceCardGroupData> = {
    multiple?: false;
    value?: ChoiceCardGroupValue<Data> | null;
    defaultValue?: ChoiceCardGroupValue<Data> | null;
    onChange?: (value: ChoiceCardGroupValue<Data> | null) => void;
};
/** Multi-select (checkbox): value is a `string[]`. */
type MultiSelection<Data extends ChoiceCardGroupData> = {
    multiple: true;
    value?: ChoiceCardGroupValue<Data>[];
    defaultValue?: ChoiceCardGroupValue<Data>[];
    onChange?: (value: ChoiceCardGroupValue<Data>[]) => void;
};
export type ChoiceCardGroupProps<Data extends ChoiceCardGroupData = ChoiceCardItem[]> = ChoiceCardGroupBaseProps<Data> & (SingleSelection<Data> | MultiSelection<Data>);
export declare const ChoiceCardGroup: <const Data extends ChoiceCardGroupData = ChoiceCardItem[]>({ data, multiple, value, defaultValue, onChange, orientation, renderItem, label, description, error, required, invalid, disabled, readOnly, size, variant, color, name, id, ref, onBlur, className, classNames, testId, }: ChoiceCardGroupProps<Data>) => import("react").JSX.Element;
export {};
//# sourceMappingURL=choice-card-group.d.ts.map