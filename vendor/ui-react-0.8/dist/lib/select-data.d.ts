import { createListCollection } from "@ark-ui/react/collection";
import type { ReactNode } from "react";
import type { Color } from "./colors";
/**
 * Shared `data` normalization for the data-driven pickers (Select, Autocomplete,
 * MultiSelect). Accepts the three styles of shapes and turns them into an
 * Ark `ListCollection` plus a render-friendly flat/grouped view:
 *
 *   - `string[]`                                → value === label
 *   - `{ value, label?, disabled?, color? }[]`  → explicit items
 *   - `{ group, items }[]`                      → grouped (items are strings or objects)
 *
 * Items may carry an arbitrary, optional `payload`. The machine ignores it
 * (value / label / disabled drive everything) but it flows through to a picker's
 * `renderItem` on the `RenderableItem` — typed via `SelectPayload<Data>`.
 */
/**
 * How a picker's clearable control occupies the trigger's end section, shared by
 * the whole family (Select, MultiSelect, Autocomplete, TreeSelect,
 * TreeMultiSelect):
 *
 *   - `"replace"` (default) — the clear button replaces the chevron once there's
 *     a value to clear.
 *   - `"both"` — the clear button sits beside the chevron (clear, then chevron at
 *     the far edge).
 */
export type ClearSectionMode = "replace" | "both";
export type SelectItem<P = unknown> = {
    value: string;
    label?: string;
    disabled?: boolean;
    /** Optional accent — tints the item's rendered pill/badge. */
    color?: Color;
    /** Arbitrary extra data, surfaced to `renderItem`. */
    payload?: P;
    /** `data-testid` on the rendered option. Defaults to `` `item-${value}` `` —
     *  set it explicitly when `value` isn't a safe/stable test selector on its
     *  own. Ark's own `data-value={value}` is also always present as a
     *  complementary, zero-config selector (see the "Testing" guide). */
    testId?: string;
};
export type SelectGroup<P = unknown> = {
    group: string;
    items: ReadonlyArray<string | SelectItem<P>>;
};
export type SelectData<P = unknown> = ReadonlyArray<string | SelectItem<P> | SelectGroup<P>>;
/**
 * Extract the value-string union from a `SelectData` shape. The data pickers are
 * generic over their `data` array (which a `const` type parameter narrows to its
 * literals); this derives the matching `value` / `onChange` type from it — bare
 * strings, item `.value`s, and group items all contribute.
 */
export type SelectValue<Data extends SelectData> = EntryValue<Data[number]>;
type EntryValue<E> = E extends string ? E : E extends SelectItem ? E["value"] : E extends SelectGroup ? GroupItemValue<E["items"][number]> : never;
type GroupItemValue<I> = I extends string ? I : I extends SelectItem ? I["value"] : never;
/**
 * Derive the literal value union from a flat array of bare strings or
 * `{ value: string }`-shaped items — the minimal shared contract behind
 * `SelectValue` (above) and any other flat, non-grouped picker's value
 * narrowing (e.g. `RadioGroup`, `ChoiceCardGroup`). Structural, not keyed on
 * `SelectItem` itself, so it works for item shapes with their own `label`/
 * extra fields that aren't otherwise compatible with `SelectItem`.
 */
export type FlatValueOf<Data extends ReadonlyArray<string | {
    value: string;
}>> = Data[number] extends infer E ? E extends string ? E : E extends {
    value: string;
} ? E["value"] : never : never;
/**
 * Extract the `payload` type carried by a `SelectData` shape — read structurally
 * off the items' `payload` property (robust against generic-instantiation
 * inference). Bare strings and payload-less items contribute `never` / `unknown`;
 * a homogeneous `payload` resolves precisely, a mixed one to the union.
 */
export type SelectPayload<Data extends SelectData> = PayloadOf<FlatEntry<Data>>;
type FlatEntry<Data> = Data extends ReadonlyArray<infer E> ? E extends SelectGroup<unknown> ? E["items"][number] : E : never;
type PayloadOf<T> = T extends string ? never : T extends {
    payload?: infer P;
} ? P : never;
/** A fully resolved option — every field present (`payload`/`color` may be `undefined`). */
export type NormalizedItem<P = unknown> = {
    value: string;
    label: string;
    disabled: boolean;
    color: Color | undefined;
    payload: P | undefined;
    testId: string;
};
/**
 * The option handed to a flat picker's `renderItem`. Same shape as
 * `NormalizedItem`, but `value` is narrowed to the data's value union and
 * `payload` to the data's payload type (so a `const`-typed `data` gives literal
 * `value`s and a precise `payload` in the callback).
 */
export type RenderableItem<Data extends SelectData> = {
    value: SelectValue<Data>;
    label: string;
    disabled: boolean;
    color: Color | undefined;
    payload: SelectPayload<Data>;
};
/** Live option state passed alongside the item to `renderItem`. */
export type ItemRenderState = {
    selected: boolean;
    highlighted: boolean;
};
/**
 * Render an option's content yourself. Receives the (value-narrowed) item —
 * including its typed `payload` — and its live state; you own the whole row,
 * including any selected/highlighted affordance. In an RSC tree the function
 * must live in a `"use client"` module so the boundary serializes it as a
 * client reference.
 */
export type RenderItem<Data extends SelectData> = (item: RenderableItem<Data>, state: ItemRenderState) => ReactNode;
export type NormalizedGroup<P = unknown> = {
    group: string;
    items: NormalizedItem<P>[];
};
export type NormalizedData<P = unknown> = {
    collection: ReturnType<typeof createListCollection<NormalizedItem<P>>>;
    items: NormalizedItem<P>[];
    /** Present only when `data` was passed as groups. */
    groups: NormalizedGroup<P>[] | null;
};
/** Normalize any `SelectData` shape into an Ark collection + flat/grouped view. */
export declare function normalizeSelectData<P>(data: SelectData<P>): NormalizedData<P>;
/**
 * Filter a normalized dataset by a predicate (dropping now-empty groups) and
 * rebuild the collection. Shared by the searchable pickers so the filter +
 * group-prune + collection rebuild lives in one place; normalization stays a
 * separate, `data`-keyed step so typing only re-filters.
 */
export declare function filterSelectData<P>(data: NormalizedData<P>, predicate: (item: NormalizedItem<P>) => boolean): NormalizedData<P>;
export {};
//# sourceMappingURL=select-data.d.ts.map