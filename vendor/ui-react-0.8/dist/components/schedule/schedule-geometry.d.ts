import type { ScheduleLayoutResult } from "./schedule-layout";
/**
 * RFC §5 (`docs/rfcs/schedule.md`) geometry — pure minutes↔pixels/percent
 * helpers plus the DOM-measurement helper the interaction hooks use to
 * derive `pxPerMinute` from the day-column's own real rendered height
 * (see `resolvePxPerMinute`'s own comment — corrected after v1 shipped, RFC
 * §18).
 */
/** Minutes since local midnight, including fractional seconds. */
export declare function minutesFromMidnight(date: Date): number;
export declare function minutesToPixels(minutes: number, pxPerMinute: number): number;
/** Minutes as a percentage (0–100, not clamped — callers that need clamping,
 *  e.g. `nowIndicatorTop`, do it themselves) of a total window — the
 *  render-time replacement for `minutesToPixels`'s job wherever the
 *  day-column's own rendered height is no longer a fixed function of a known
 *  `hourHeight` (it's now only a `min-height` floor CSS can stretch past —
 *  see `schedule-timed-grid.tsx`). Pure ratio math, no DOM access, fully
 *  SSR-safe: a chip/overlay/now-line positioned this way naturally tracks
 *  whatever height the day-column ends up rendering at, no re-measurement
 *  ever needed. */
export declare function minutesToPercent(minutes: number, totalWindowMinutes: number): number;
export declare function pixelsToMinutes(pixels: number, pxPerMinute: number): number;
/** Inverse of `minutesFromMidnight` — the instant on `day`'s calendar date at
 *  `minutes` past midnight, host-local (same `.setHours()` idiom
 *  `schedule-timed-grid.tsx`'s `disabledHourRuns` already uses). Used by
 *  `use-event-create.ts` to convert a drafted pointer position back into a
 *  real `Date`. */
export declare function dateAtMinutes(day: Date, minutes: number): Date;
/**
 * Default `--sch-hour-height` (px), scaled by `slotDuration` so a finer slot
 * spacing gets a taller default hour — more px per slot keeps each slot's
 * row a legible, roughly-constant height regardless of how many slots make
 * up an hour, clamped to a sane range at either extreme. An explicit
 * `hourHeight` prop (`TimeGridSharedProps.hourHeight`) always overrides this.
 */
export declare function defaultHourHeight(slotDuration: number): number;
/** `layoutEventColumns`'s `column`/`columnCount` as cascading insets.
 *  `columnSpan` (still present on `ScheduleLayoutResult` for
 *  `schedule-layout.ts`'s own column-*assignment* purposes) is deliberately
 *  NOT consumed here — `width` below is a function of `column`/`columnCount`
 *  alone, not of how many columns a widen-eligible event could occupy.
 *
 *  **Every column's width is `var(--sch-column-fraction, 0.7)` of whatever
 *  space remains after that column's own `left`, not a flat fraction of the
 *  whole row and not anchored to any fixed right edge — except the
 *  cluster's *last* column (`column === columnCount - 1`), which takes the
 *  *entire* remainder.** `left` shifts further left by
 *  `column * var(--sch-column-overlap)` (a custom property, declared
 *  alongside `--sch-column-gap` in `schedule-timed-grid.tsx`) for every
 *  column beyond the first, same as before — but `width` is now always
 *  `(100% - left) * fraction` for every non-last column (deliberate,
 *  permanent, not a hover/focus-triggered "reveal" — earlier iterations
 *  tried that, see the dated note below for why it was dropped): every
 *  overlapping event that has something stacked *after* it leaves roughly
 *  30% of its own remaining space unclaimed, so that later, more-
 *  overlapping card always has real room to intrude into and read as "the
 *  front of a stack," rather than each column claiming its flat share
 *  edge-to-edge. The *last* column has nothing stacked after it — there's
 *  nothing left to hold room open for — so it takes all of `100% - left`
 *  instead, the same "reach the row's own right edge" rule the cascade
 *  always used pre-fraction. A solo, non-overlapping event
 *  (`columnCount === 1`) is column `0` *and* the last column at once, so it
 *  renders at the full `100%` it always has — the fraction only ever
 *  narrows an event that's making room for something stacked in front of
 *  it. `ScheduleOverflowChip` (`schedule-timed-grid.tsx`) always calls this
 *  with `column: maxOverlapColumns, columnCount: maxOverlapColumns + 1` —
 *  i.e. always the last column — so the "+N" indicator gets the same
 *  full-remainder treatment as any other frontmost card, no special-casing
 *  needed.
 *
 *  *(Dated note — two earlier iterations of this formula, both replaced,
 *  not layered on top of what's below: a first pass made every column's
 *  `width` reach the row's own right edge unconditionally at rest, relying
 *  on the chip shell's `hover:z-20 focus-within:z-20` (still present, see
 *  `schedule-event-chip.tsx`) to bring a covered chip's already-wide box to
 *  the front on hover — but `hover:` is a flat z-index override regardless
 *  of the hovered chip's own natural rank, so hovering a lower-column chip
 *  could promote it above a naturally-higher-column sibling and swallow it
 *  with no escape route, since the pointer was already inside the
 *  now-topmost hovered chip's footprint. A second pass split `width` (a
 *  narrow, `:hover`-safe rest size) from a separate, wider `revealWidth`
 *  gated to `:focus-within` only — fixing the swallow bug, but reintroducing
 *  confusion of its own (a deeply-cascaded column's rest width, anchored to
 *  a fixed right edge, could already reach further than a 70%-of-remaining
 *  reveal would add, so focusing it visibly did nothing). The single,
 *  always-on formula below is simpler than either: one width, no
 *  interaction-dependent state, provably consistent for every column.)*
 *
 *  `zIndex` still climbs with `column`, capped at `MAX_CASCADE_Z_INDEX`, and
 *  the chip shell's `hover:z-20 focus-within:z-20 data-[resizing-edge]:z-20`
 *  promotion is untouched — bringing the interacted-with (or resizing)
 *  chip to the front is still useful on its own (resize-handle
 *  reachability; letting a user see whichever card they're pointed at
 *  unobstructed), it just no longer resizes anything while doing it.
 *  Setting `--sch-column-fraction: 1` restores full-width, edge-to-edge
 *  columns (the very first, pre-cascade layout) with no code change. */
export declare function columnInsets({ column, columnCount }: ScheduleLayoutResult): {
    left: string;
    width: string;
    zIndex: number;
};
/**
 * Resolves a px-per-minute rate by measuring the day-column's *real*
 * rendered height (`getBoundingClientRect()`), divided by the window's total
 * minutes (`--sch-window-minutes` — a bare unitless number written by
 * `schedule-timed-grid.tsx`), rather than a fixed `hourHeight`-derived
 * number. **Correction after v1 shipped (RFC §18's "geometry contract"):**
 * the day-column's rendered height used to always exactly equal
 * `hourHeight * totalHours`, so probing `--sch-hour-height` on a throwaway
 * element was equivalent to (and cheaper than) measuring the real column —
 * that stopped being true once the column's height became a `min-height`
 * floor CSS can stretch past, so this now measures the actual rendered box
 * instead, which is the fix, not a violation, of that documented risk.
 * Call sites measure once at gesture-start and cache the result for that
 * gesture's whole duration (unaffected by a resize mid-gesture, same as
 * before this change). Accepts an optional pre-computed `rect` so a caller
 * that already measured the element for another reason
 * (`use-event-create.ts`'s `rect.top`) isn't forced to measure twice.
 */
export declare function resolvePxPerMinute(dayColumnEl: Element, rect?: DOMRect): number;
/**
 * The now-line's own clamped `top`, as a percentage (0–100) of the
 * day-column's own total height — `now-cursor-line.tsx`'s rendered position
 * for both the line and its label. Clamped to `[0, 100]`: the day-column
 * only paints `[startHour, endHour)`, so a `now` outside that window (or an
 * `endHour` short of midnight) would otherwise place the line past the
 * column's own bottom edge.
 */
export declare function nowIndicatorTop(now: Date, startHour: number, endHour: number): number;
export interface ScrollToCenterOptions {
    behavior?: ScrollBehavior;
}
/**
 * Scrolls `container` so `element` — an actual, already-rendered descendant,
 * not a recomputed position — sits centered in its viewport, on both axes.
 * RFC §14's "scroll to now" (`DaysView`/`Root`, both via their own `nowRef`
 * onto `NowCursorLine`'s `marker` instance) used to derive its target from
 * `nowIndicatorTop`/`resolvePxPerMinute` — the same math the line's own
 * `style.top` is built from, so it agreed with the render *in theory*, but
 * a second, independent computation of "where is now" is still a second
 * place for that agreement to quietly break. Measuring the real element's
 * `getBoundingClientRect()` instead removes that whole class of drift, and
 * centering on both axes (not vertical-only, as the old approach was) also
 * brings today's own day column into view horizontally on a multi-day
 * grid wide enough to scroll — not just the right time of day, but the
 * right day too. Clamped to `[0, scrollWidth/Height - clientWidth/Height]`
 * so a target near an edge never overshoots into empty space past the
 * container's own scrollable bounds. Respects `prefers-reduced-motion` —
 * a `"smooth"` scroll is a motion effect like any other, so it's opted out
 * the same way the rest of the kit already does; `options.behavior`
 * overrides that default outright for a caller with its own opinion.
 */
export declare function scrollElementToCenter(container: HTMLElement, element: HTMLElement, options?: ScrollToCenterOptions): void;
//# sourceMappingURL=schedule-geometry.d.ts.map