/**
 * Shared by Menu/Tooltip (and any future floating-panel component with the
 * same contract): `position` accepts a component's own physical placement
 * union `P` (Ark/Floating UI's vocabulary) plus the logical, RTL-aware
 * horizontal sides `start` / `end`, resolved to `left` / `right` by direction.
 */
export type LogicalPosition<P extends string> = P | "start" | "end";
/**
 * Map the logical `start` / `end` sides to physical placements for the active
 * direction — Ark / Floating UI only understands physical sides; every other
 * placement passes through unchanged. Plain conditionals rather than
 * ts-pattern here: matching string literals against a generic union `P`
 * defeats ts-pattern's pattern-inference machinery.
 */
export declare function resolveLogicalPlacement<P extends string>(position: LogicalPosition<P>, dir: "ltr" | "rtl"): P;
//# sourceMappingURL=placement.d.ts.map