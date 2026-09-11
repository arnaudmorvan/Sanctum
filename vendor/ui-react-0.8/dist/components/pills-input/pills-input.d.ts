import { type HTMLArkProps } from "@ark-ui/react";
import { type ComponentPropsWithoutRef, type ReactNode, type RefObject } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type InputSize, type InputVariant } from "../input/input";
import { type PillSize } from "../pill/pill";
/**
 * PillsInput — a multi-line input shell that lays out `Pill`s alongside a search
 * field. Same chrome as `Input` (border, focus ring, invalid / disabled states)
 * but it wraps as values accumulate. It's the visual `MultiSelect` and
 * `TagsInput` mount as their target.
 *
 *   - It reuses `Input`'s slot layout: a `startSlot` / `endSlot` flank a
 *     `pillsContent` region that holds the `Pill`s + the field and is the only
 *     thing that wraps, so a trailing control (chevron, clear) pins to the edge
 *     instead of wrapping inline with the pills.
 *   - Host `Pill`s + a single `PillsInputField` inside it (pills first, field
 *     last). The shell sets the pill `size` / `disabled` through context, so the
 *     pills match with no prop drilling.
 *   - `maxLines` caps the pills at N rows and collapses the rest into a static
 *     "+N" counter (measured, since pills have variable widths).
 *
 * Presentational by design: the value state lives with the consumer.
 */
/** The pills *row*: same single-line flex shell as `inputShell`, just text-cursor
 *  for the click-to-focus affordance. Layout/wrap live on `pillsContent`. */
export declare const pillsShell: string;
/** The wrapping region inside a pills shell — holds the pills + field, grows to
 *  fill the row (`flex-1`), and is the only element that wraps, so the shell's
 *  start/end slots stay pinned as `shrink-0` siblings. Gap tracks `inputShell`'s
 *  per-size gap so pill spacing is unchanged from the flat layout. */
export declare const pillsContent: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * Pure row-grouping math behind `usePillOverflow` (exported for testing).
 *
 * Given each measured pill's `offsetTop` (in document order), count how many
 * fit within `maxLines` wrapped rows. A jump in `offsetTop` (beyond a sub-pixel
 * epsilon) marks a new row. When the pills overflow, reserve one slot on the
 * last visible row for the "+N" counter (it's narrower than a typical pill, so
 * dropping one always makes room).
 */
export declare function visiblePillCount(offsetTops: number[], maxLines: number): number;
/**
 * Like `visiblePillCount`, but also keeps the trailing input field on the last
 * visible row (exported for testing).
 *
 * `visiblePillCount` only reasons about pills, so when the last visible row is
 * packed, the field — which is `min-w-16` and the last flex child — can't claim
 * its minimum width and wraps onto a new line. A flex item wraps exactly when
 * the space left on its row drops below its `min-width`, so we drop pills until
 * the last visible pill leaves room on its row for `gap + fieldMinWidth` (plus
 * the `+N` counter, once anything is hidden). Pills are passed as their measured
 * `{ top, right }` in a single coordinate space; removing a trailing pill never
 * reflows the ones before it, so each drop is checked against real geometry.
 */
export declare function pillCountWithField(pills: {
    top: number;
    right: number;
}[], maxLines: number, rowRight: number, trailing: {
    fieldMinWidth: number;
    counterWidth: number;
    gap: number;
}): number;
/**
 * Measure how many pills fit within `maxLines` rows and how many overflow.
 *
 * Line caps are width-dependent (pills vary in width), so this measures the DOM.
 * Pills to be measured must carry `data-overflow-item`; the trailing field and
 * the counter must NOT (they would corrupt row detection) — instead the field
 * carries `data-overflow-field` and the counter `data-overflow-counter` so the
 * hook can locate and measure them without mistaking them for pills. The hook
 * renders the full set during a pre-paint "measuring" pass, groups pills into
 * rows, then settles on a `visibleCount` — reserving the last row for the "+N"
 * chip and, when a field is present, its `min-width` too, so the field never
 * wraps onto a new line (see `pillCountWithField`). Re-measures on width change
 * only (ignoring the height change our own slicing causes, which would loop).
 *
 * `measuring` is exposed so consumers can render the counter during the
 * measuring pass (it is otherwise hidden when nothing overflows), letting the
 * hook measure its real width for the last-row reservation.
 */
export declare function usePillOverflow({ maxLines, count, }: {
    /** Cap the rendered pills at this many rows. Omit to render every pill. */
    maxLines?: number;
    /** Total number of pills — drives re-measurement on add / remove. */
    count: number;
}): {
    containerRef: RefObject<HTMLDivElement | null>;
    visibleCount: number;
    hiddenCount: number;
    measuring: boolean;
};
export type PillOverflowCounterProps = {
    /** How many pills are hidden. */
    count: number;
    size?: PillSize;
    className?: string;
};
/** Static "+N" chip the pill controls render at the end of the visible rows.
 *  Non-interactive: the visible "+N" is its own accessible text, and the full
 *  set stays reachable via the dropdown (where one exists) or the consumer's
 *  own state. */
export declare const PillOverflowCounter: ({ count, size, className, }: PillOverflowCounterProps) => import("react").JSX.Element;
type PillsInputClassNames = {
    root?: string;
    content?: string;
    startSlot?: string;
    endSlot?: string;
};
export type PillsInputProps = Omit<HTMLArkProps<"div">, "color"> & WithTestId & {
    size?: InputSize;
    variant?: InputVariant;
    color?: Color;
    invalid?: boolean;
    disabled?: boolean;
    pointer?: boolean;
    /** Cap the pills at N rows; the rest collapse into a static "+N" counter. */
    maxLines?: number;
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before any trailing control. */
    endSlot?: ReactNode;
    classNames?: PillsInputClassNames;
};
export type PillsInputFieldProps = ComponentPropsWithoutRef<"input"> & WithTestId & {
    /** Fired on Backspace when the field is empty — pop the last value. */
    onRemoveLast?: () => void;
};
export declare const PillsInput: (({ size, variant, color, invalid, disabled, pointer, maxLines, startSlot, endSlot, className, classNames, children, testId, ...rest }: PillsInputProps) => import("react").JSX.Element) & {
    Field: ({ className, onRemoveLast, onKeyDown, testId, ...rest }: PillsInputFieldProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=pills-input.d.ts.map