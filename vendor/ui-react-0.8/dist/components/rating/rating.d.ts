import { RatingGroup as Ark } from "@ark-ui/react/rating-group";
import type { ComponentPropsWithoutRef, FocusEvent, ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * Rating — a fixed-count, single-value symbol picker (star rating) on top of
 * Ark UI's RatingGroup state machine. Ark owns pointer/keyboard interaction
 * (click, drag-hover preview, `←/→`, `Home`/`End`), half-star precision, and
 * the roving-tabindex `role="radio"` group; this wrapper renders the styled
 * symbols and a flatter API.
 *
 *   - Exposed as a single `<Rating>` (unlike the deeply compound families —
 *     Mantine's own Rating isn't compound either, and one symbol shape is
 *     all this component needs).
 *   - The default symbol is a bundled star (`fullSymbol` / `emptySymbol`
 *     override it); half-fill is a full-size `fullSymbol` clipped with
 *     `clip-path: inset(...)` and stacked over a full-size `emptySymbol`
 *     (see `RatingSymbol`) — a real midline split, not a scaled-down copy —
 *     which works for the bundled star and for arbitrary overrides alike.
 *     The clip is driven by a `--rating-clip` custom property so a single
 *     `rtl:` variant flips which edge it clips from, the same technique
 *     `Indicator`'s `rtl:translate-x-*` uses for its own inline-axis flip.
 *   - `allowHalf` is Ark-native half-star precision only — Mantine's
 *     arbitrary `fractions` support is explicitly out of scope.
 *   - Palette is delivered through the kit's `data-color` + `--c-solid`
 *     slot-var system (see `components.md` -> Color system). `color` accepts
 *     either one `Color` for the whole group or an `(index: number) => Color`
 *     resolver for per-star tinting (e.g. a red -> yellow -> green mood
 *     scale); either way it's resolved per item and written on each `Item`,
 *     not once on the root — the same recipe as `Slider`'s track fill, just
 *     scoped narrower.
 *   - Unlike `RadioGroup` / `SegmentGroup`, `Rating` has no built-in `label`
 *     / `description` / `error` — it's a bare control (like `Calendar`),
 *     complete via the kit's `Field`:
 *
 *       <Field label="Rate this course">
 *         <Rating />
 *       </Field>
 *
 *     `Rating`'s real interactive control is Ark's `RatingGroup.Control`
 *     (the `role="radiogroup"` div wrapping the symbol buttons), not the
 *     outer root — `RatingControl` below reads `useFieldContext()` from
 *     *inside* that nesting so a wrapping `Field`'s `aria-*` land on it.
 */
type ArkRootProps = ComponentPropsWithoutRef<typeof Ark.Root>;
/** Ark's own `translations` prop type, derived structurally rather than imported by name —
 *  `IntlTranslations` lives in `@zag-js/rating-group`, a transitive dependency of the
 *  `@ark-ui/react` peer dep, not one this package declares itself. */
type ArkTranslations = NonNullable<ArkRootProps["translations"]>;
export type RatingTranslations = ArkTranslations;
/** Merges a partial override over a grammatically-correct English default into the full shape
 *  `Ark.Root` requires. Follows `calendar.tsx`'s `resolveCalendarTranslations` pattern, except
 *  the default here is always applied (even with no override) since it improves on Ark's own. */
export declare const resolveRatingTranslations: (overrides?: Partial<RatingTranslations>) => ArkTranslations;
export type RatingClassNames = {
    /** The outermost `Ark.Root` element. */
    root?: string;
    /** The `role="radiogroup"` `Ark.Control`, wrapping every symbol. */
    control?: string;
    /** Each `Ark.Item` (one per symbol). */
    item?: string;
    /** The symbol wrapper — the empty/full layered pair. */
    symbol?: string;
};
export type RatingProps = Omit<ArkRootProps, "count" | "value" | "defaultValue" | "onValueChange" | "readOnly" | "disabled" | "allowHalf" | "name" | "form" | "translations" | "onBlur" | "ref" | "className" | "children" | "color"> & WithTestId & {
    /** Total number of symbols in the group. */
    count?: number;
    /** Controlled value. With `allowHalf`, halves (e.g. `3.5`) are valid. */
    value?: number;
    /** Uncontrolled initial value. */
    defaultValue?: number;
    /** Fires with the next rating value (a value, not a DOM event). */
    onChange?: (value: number) => void;
    /** Keeps full contrast and announces the value, but rejects changes. */
    readOnly?: boolean;
    /** Dims and blocks interaction. */
    disabled?: boolean;
    /**
     * Half-symbol precision for pointer clicks and the keyboard step —
     * Ark-native only. Mantine's arbitrary `fractions` support is out of
     * scope; this is on/off half-symbol precision, nothing finer.
     */
    allowHalf?: boolean;
    size?: Size;
    /**
     * Fill color for the "full" portion of each symbol, via `data-color`.
     * Either one `Color` for the whole group, or `(index: number) => Color`
     * to tint each symbol independently — `index` is 0-based across `count`
     * symbols — e.g. a sentiment scale (red -> yellow -> green) on a 5-star
     * mood rating.
     */
    color?: Color | ((index: number) => Color);
    /** Overrides the bundled solid star for a symbol's filled portion. */
    fullSymbol?: ReactNode;
    /** Overrides the bundled outline star for a symbol's empty portion. */
    emptySymbol?: ReactNode;
    /**
     * Fill by Ark's `checked` state (only the exact selected value's
     * symbol) instead of `highlighted` (the default — every symbol up to
     * the hovered/selected value, the usual "N out of `count`" look).
     */
    highlightSelectedOnly?: boolean;
    /** Name for the hidden input (form submission). */
    name?: string;
    /** The associated `<form>` id for the hidden input. */
    form?: string;
    /** Partial override of the accessible per-symbol label; merges over an English default. */
    translations?: Partial<RatingTranslations>;
    /** Lands on the real `role="radiogroup"` control, for focus-on-error. */
    ref?: Ref<HTMLDivElement>;
    /** Forwarded to the control; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
    className?: string;
    classNames?: RatingClassNames;
};
export declare const Rating: ({ count, value, defaultValue, onChange, readOnly, disabled, allowHalf, size, color, fullSymbol, emptySymbol, highlightSelectedOnly, name, form, translations, ref, onBlur, className, classNames, testId, ...rest }: RatingProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=rating.d.ts.map