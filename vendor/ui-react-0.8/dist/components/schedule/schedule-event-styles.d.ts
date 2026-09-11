/**
 * Shared color surface for every rendered event — the timed-grid chip
 * (`schedule-event-chip.tsx`), the Month view pill, and the all-day bar all
 * render the same `kind: "event" | "static"` data through this one
 * definition instead of three independently-duplicated class strings, so
 * they can't drift out of sync with each other. The `--c-text`/`--c-soft`
 * text-on-background pairing itself is already solid (checked by hand
 * against every allowed color's actual hex values — yellow is the tightest
 * at ~4.98:1, everything else higher, all clearing WCAG AA's 4.5:1); the
 * border here is just a soft outline, not a contrast fix, hence the low
 * opacity.
 */
export declare const EVENT_COLOR_CLASSES = "border border-(--c-text)/30 bg-(--c-soft) text-(--c-text)";
//# sourceMappingURL=schedule-event-styles.d.ts.map