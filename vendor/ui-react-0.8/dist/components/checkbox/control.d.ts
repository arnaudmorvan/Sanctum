import { type VariantProps } from "class-variance-authority";
/**
 * `controlIndicator` — the bordered box surface shared by the kit's
 * **selection** controls (`Checkbox` and `RadioGroup`). It draws the neutral
 * resting square, the palette-filled checked / indeterminate state, the focus
 * ring, and the invalid / disabled affordances; the consumer drops the actual
 * mark (a check, a minus, or a dot) inside it.
 *
 * It is deliberately shape-agnostic. `Checkbox` uses it as-is (a rounded
 * square holding a `CheckIcon` / `MinusIcon`). `Radio` imports this same cva
 * and layers `rounded-full` on top, swapping the icon for a centered dot — so
 * the two controls share one resting surface, one fill, one focus ring, and
 * one invalid state, and only diverge on the corner radius and the mark.
 *
 * Color is orthogonal: the box references the active palette only through the
 * slot vars (`--c-solid` for the fill / focus ring, `--c-on-solid` for the
 * mark), so it tints from whatever `data-color` sits on the root.
 *
 * @example Radio reuse
 *   cn(controlIndicator({ size }), "rounded-full")  // + a centered dot child
 */
export declare const controlIndicator: (props?: ({
    variant?: "default" | "filled" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ControlIndicatorSize = NonNullable<VariantProps<typeof controlIndicator>["size"]>;
export type ControlIndicatorVariant = NonNullable<VariantProps<typeof controlIndicator>["variant"]>;
//# sourceMappingURL=control.d.ts.map