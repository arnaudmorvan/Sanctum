/**
 * RFC §7 (`docs/rfcs/schedule.md`) snapping — applied only at drag/resize
 * commit, never live (a smooth 1:1 drag with a live-updating snapped-time
 * label is tactile; snapping the chip's actual position on every
 * `pointermove` would visibly jump).
 */
/** Round `minutes` to the nearest multiple of `incrementMinutes`. */
export declare function snapToIncrement(minutes: number, incrementMinutes: number): number;
/** `date` shifted by `deltaMinutes`, snapped to `incrementMinutes` first. */
export declare function addSnappedMinutes(date: Date, deltaMinutes: number, incrementMinutes: number): Date;
//# sourceMappingURL=schedule-snap.d.ts.map