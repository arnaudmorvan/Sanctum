/**
 * RFC §5 (`docs/rfcs/schedule.md`) concurrent-event layout — the "Google
 * Calendar" interval-graph greedy column-packing algorithm, plus a
 * width-maximizing pass and an optional per-cluster column cap with
 * overflow reporting. Pure, no React, no day-boundary awareness: the
 * caller pre-clips `events` to one rendered day-column (via
 * `eventOccursOnDay`) before calling either export below.
 */
export type ScheduleLayoutResult = {
    column: number;
    /** Contiguous columns (from `column`, rightward) this event may occupy —
     *  widened up to (not touching) the nearest column, among columns to its
     *  right, containing an event that actually overlaps it in time. Always
     *  `>= 1` and never wide enough to cover a reserved overflow-indicator
     *  column when the cluster has one. Optional in the type only so
     *  hand-built literals (tests, mocks) don't need it; `layoutEventColumns`
     *  and `layoutEventColumnsCapped` always populate it. */
    columnSpan?: number;
    columnCount: number;
};
type LayoutInput = {
    id: string;
    start: Date;
    end: Date;
};
/** One overflowing cluster's hidden events, collapsed into a single "+N"
 *  indicator (`ids.length` is the "N") — not one entry per instant-by-instant
 *  change in exactly which events are hidden. `start`/`end` are the union of
 *  the hidden events' own ranges (their earliest start to their latest end),
 *  not a precise per-instant window: time-slicing by exactly who's hidden
 *  when sounds more precise, but for a cluster of several staggered
 *  short-lived events it fragments into many awkwardly-short spans that,
 *  once each is floored to a legible minimum height, visually collide with
 *  their neighbors. One coarse-but-clickable indicator per cluster — the
 *  same "don't try to convey timing, just disclose who's hidden" shape
 *  Month view's own "+N" pill already uses — reads far better and loses
 *  nothing a click-through doesn't already recover (each hidden event still
 *  shows its own real time range once disclosed). */
export type ScheduleOverflowSpan = {
    start: Date;
    end: Date;
    ids: string[];
};
export type ScheduleCappedLayout = {
    layout: Map<string, ScheduleLayoutResult>;
    overflow: ScheduleOverflowSpan[];
};
/**
 * Assigns each event a `column` (0-based), a `columnSpan` (how many
 * contiguous columns it may occupy, widened up to the nearest real
 * conflict to its right), and the `columnCount` of the overlap cluster it
 * belongs to, so overlapping events can render side by side instead of
 * stacked. Returns a `Map` (not an array in input order) since callers
 * look up by `event.id` while iterating their own already-ordered render
 * list. Unbounded — every event is visible, matching the column count of
 * the classic (uncapped) side-by-side layout. See `layoutEventColumnsCapped`
 * for a version that collapses many-way overlap into an overflow report.
 */
export declare function layoutEventColumns<T extends LayoutInput>(events: T[]): Map<string, ScheduleLayoutResult>;
/**
 * Like `layoutEventColumns`, but once a cluster's point-in-time
 * concurrency would exceed `maxColumns`, the excess events are left out of
 * `layout` entirely and reported instead — one `ScheduleOverflowSpan` per
 * overflowing cluster, not one per instant-by-instant change in who's
 * hidden (see that type's own comment) — so a rendering layer resolves
 * `overflow`'s ids back to real events and draws its own overflow
 * indicator; this module stays decoupled from any event/UI type.
 * `maxColumns` bounds the *total* rendered column count for an overflowing
 * cluster, overflow indicator included — see `runLayout`'s own comment.
 * `maxColumns` is clamped to at least 1 so a misconfigured `0`/negative
 * value can never force a lone, non-conflicting event into overflow.
 */
export declare function layoutEventColumnsCapped<T extends LayoutInput>(events: T[], maxColumns: number): ScheduleCappedLayout;
export {};
//# sourceMappingURL=schedule-layout.d.ts.map