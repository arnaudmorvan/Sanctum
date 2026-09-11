/**
 * The click-drag-to-create ghost box. RSC — owns no state, only reads the
 * `--sch-create-top`/`--sch-create-height` CSS vars `use-event-create.ts`
 * writes imperatively during a gesture, the same "permanently-mounted leaf,
 * driven by an external imperative write" shape `schedule-disabled-overlay.tsx`
 * uses for its own decorative overlay — never a `useState` re-render per
 * `pointermove`, matching the module's "refs are not state" discipline for
 * in-flight gesture coordinates.
 *
 * `data-invalid` (also written imperatively, live on every `pointermove`)
 * swaps the brand tint for red whenever the *currently snapped* candidate
 * would be rejected by `checkRangeCommit` — a separate, additive signal from
 * the unsnapped visual position, which never snaps live.
 */
export declare function ScheduleCreateDraft({ className }: {
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=schedule-create-draft.d.ts.map