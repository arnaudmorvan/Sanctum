import type { CSSProperties } from "react";
/**
 * RFC §12 (`docs/rfcs/schedule.md`) disabled-slot visual, shared by the timed
 * grid (Day/Week)'s per-run overlay and Month's whole-day cells. A flat
 * neutral tint at rest, `cursor-not-allowed` on hover (`pointer-events-auto`
 * is what lets it actually receive that hover instead of passing it through)
 * — the tint is load-bearing, not decorative flourish: `cursor` alone is a
 * hover-only affordance, invisible to a touch/mobile user who never hovers
 * anything, so a disabled slot needs an at-rest visual regardless of input
 * method. Year deliberately doesn't render this component at all — a flat
 * fill would read as a smudge at its much smaller mini-month cell size, so it
 * uses a muted day-number instead ([§10](../../../docs/rfcs/schedule.md)).
 *
 * `pointer-events-auto` here is still safe for the click-drag-to-create
 * gesture on the timed grid: its handlers read `e.currentTarget` (the
 * day-column) for all geometry, and its one `e.target`-based check just looks
 * for an ancestor event-chip, which this overlay never is — a pointerdown
 * landing on the overlay still bubbles to and arms the gesture normally. On
 * Month, a click here still bubbles to the day-cell's own `onClick`.
 *
 * DOM order matters: this renders *before* any chip at the same call site,
 * so an occupied portion of an otherwise-disabled range paints (and
 * hit-tests) as the chip, not this overlay — hovering an event never shows
 * `not-allowed`, only the empty disabled space around it does.
 */
export declare function ScheduleDisabledOverlay({ className, style, }: {
    className?: string;
    /** An explicit `top`/`height` (a partial run within a day-column) wins
     *  over the base `inset-0`'s `top: 0; bottom: 0` per the CSS box-model
     *  rule that a specified `height` overrides `bottom` — no `!important`
     *  override needed. */
    style?: CSSProperties;
}): import("react").JSX.Element;
//# sourceMappingURL=schedule-disabled-overlay.d.ts.map