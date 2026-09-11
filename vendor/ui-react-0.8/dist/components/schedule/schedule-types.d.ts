import type { startOfWeek } from "@internationalized/date";
import type { ReactNode } from "react";
import type { RequiredIfGranted } from "../../lib/required-if";
import type { ScheduleSlotPredicate } from "../../lib/schedule-predicates";
/**
 * A closed subset of the kit's full palette (`lib/colors.ts`), not the
 * shared `Color` type: `brand` and `gray` are excluded (reserved for chrome),
 * and there's no custom-string escape hatch — every allowed value's
 * `--c-text`/`--c-soft` pairing has been checked against a white/near-black
 * grid background, a guarantee an arbitrary custom color couldn't make.
 */
export declare const SCHEDULE_EVENT_COLORS: readonly ["red", "orange", "yellow", "green", "teal", "cyan", "blue", "purple", "pink"];
export type ScheduleEventColor = (typeof SCHEDULE_EVENT_COLORS)[number];
/**
 * RFC §4 (`docs/rfcs/schedule.md`) value model. `id`/`start`/`end` are the
 * shared shape; `kind` is required and literal-pinned (not stamped on
 * internally) so passing a static event into `data` — or vice versa — is a
 * compile error, and so a merged render list stays self-describing.
 *
 * `P` (default `unknown`) is a bare generic — the DataTable-shaped pattern,
 * not `SelectItem<P>`'s heavier `const Data extends SelectData` + structural
 * extraction machinery — since `data`/`staticEvents` are homogeneous arrays
 * with no value-literal narrowing need. `P` infers from `data` at every
 * component boundary that touches events, all the way through to
 * `renderEventDetails`/`renderDayDetails`.
 */
type ScheduleEventBase<P = unknown> = {
    /** Stable identity — never derived from array index. */
    id: string;
    /** Wall-clock instant, native `Date`, exactly like `DatePicker`'s value. */
    start: Date;
    /** Exclusive — an event ending exactly when another starts does not overlap it. */
    end: Date;
    title: string;
    /** Secondary content row in the built-in details popover — same role as
     *  Field's helper text, but `ReactNode` (not just plain text) so a
     *  consumer can render rich content there (a list, a link, formatted
     *  text). The popover's `max-w-64` cap still applies, so wide content
     *  (a table, an image) will look cramped — it's sized for wrapped text. */
    description?: ReactNode;
    /** One of `SCHEDULE_EVENT_COLORS` — a curated subset of the kit palette
     *  chosen for contrast against the grid, not the full `Color` type. */
    color?: ScheduleEventColor;
    /** `icon={null}` explicitly suppresses the glyph; `undefined` = none set. */
    icon?: ReactNode;
    /** Arbitrary extra data, surfaced to `renderEventDetails`/`renderDayDetails`
     *  — same role as `SelectItem<P>`'s `payload`. */
    payload?: P;
    /** Renders as `data-testid`; defaults to `id` (already a stable, unique
     *  identity) — the data-driven-array convention every kit component with
     *  a `data` prop follows, see `/docs/testing`. */
    testId?: string;
    /**
     * RFC's all-day addendum — Day/Week only. `start`/`end` stay real `Date`s
     * (no separate date-only value type): build an all-day event as day
     * *boundaries* — `start` = midnight of the first day, `end` = midnight of
     * the day *after* the last day (exclusive, same convention every other
     * event already uses). A multi-day all-day event draws one continuous bar
     * spanning the days it covers, not one independent pill per day. Ignored
     * outside Day/Week (Month/Year have no time axis to distinguish "all day"
     * from, and already render any event — all-day or not — as a plain pill).
     */
    allDay?: boolean;
};
/**
 * Draggable, resizable, removable — mutation is reported, never applied
 * internally. Whether each of those is actually *possible* is governed by
 * `editable` here composed with `TimeGridSharedProps.editable` — see
 * `ScheduleEventEditGesture` below. `undefined` inherits the schedule-level
 * grant entirely; when present, this can only narrow it further, never grant
 * a gesture the schedule level doesn't already allow (same "once restricted,
 * stays restricted" composition every other per-item `disabled` in the kit
 * uses — RadioGroup, TreeSelect, …).
 */
export type ScheduleEvent<P = unknown> = ScheduleEventBase<P> & {
    kind: "event";
    editable?: boolean | ScheduleEventEditGesture[];
};
/** Read-only — clickable, but never draggable, resizable, or removable. */
export type ScheduleStaticEvent<P = unknown> = ScheduleEventBase<P> & {
    kind: "static";
};
export type ScheduleAnyEvent<P = unknown> = ScheduleEvent<P> | ScheduleStaticEvent<P>;
export type ScheduleView = "days" | "month" | "year";
/**
 * RFC §12a — overlap prevention's two independent axes, both folded into the
 * single `preventOverlap` prop (`ScheduleOverlapPreventionOptions`, below)
 * rather than two separate props. Axis A (which gestures enforce no-overlap):
 * `true` covers all three; an array opts in to a subset; `undefined`/`false`
 * reproduces today's v1 behavior everywhere (unchanged — overlapping data
 * still lays out side-by-side via `layoutEventColumns`, which has no opinion
 * on whether an overlap is "allowed"). Axis B (which event kind counts as a
 * blocker) is `ScheduleOverlapTarget`, below.
 */
export type ScheduleOverlapGesture = "create" | "drag" | "resize";
/** Axis B — which event kind(s) count as an overlap blocker; `"both"` lives
 *  on `ScheduleOverlapPreventionOptions.against`, not here, since a bare
 *  event never carries `kind: "both"`. */
export type ScheduleOverlapTarget = "event" | "static";
/**
 * The object form of `TimeGridSharedProps.preventOverlap` — both axes live
 * on one prop now (a merge of what shipped as two separate props,
 * `preventOverlap`/`preventOverlapAgainst`; see `resolveOverlapPrevention`
 * below for the exact resolution table). `preventOverlap` also still accepts
 * a bare `boolean` directly (`true` = both axes at their defaults, `false`/
 * `undefined` = off) — this object form is only needed to reach for a
 * non-default `against`, a gesture subset, or both at once.
 */
export type ScheduleOverlapPreventionOptions = {
    /** Which gestures enforce no-overlap. Default `true` (all three) when this
     *  key is omitted but the options object itself is passed. */
    gestures?: boolean | ScheduleOverlapGesture[];
    /** Which event kind(s) count as a blocker. Default `"both"`. */
    against?: ScheduleOverlapTarget | "both";
};
/**
 * Edit permissions — which gestures are possible at all. Reuses the same
 * vocabulary the rest of Schedule's public API already uses for these exact
 * actions: `"drag"` (`ScheduleOverlapGesture`, `onEventChange`'s `reason`)
 * and `"remove"` (`onEventRemove`, the `removeEvent` translation key) — no
 * new synonyms. `"create"` has no per-event equivalent (there's no existing
 * event to create *on*), so `ScheduleEventEditGesture` below omits it.
 */
export type ScheduleEditGesture = "create" | "drag" | "resize" | "remove";
/** Per-event narrowing (`ScheduleEvent.editable`) — a subset of
 *  `ScheduleEditGesture` excluding `"create"`. */
export type ScheduleEventEditGesture = "drag" | "resize" | "remove";
/** Named once so `TimeGridSharedProps` (the always-optional shape) and
 *  `EditableCallbacks` (the `editable`-conditioned shape, below) can't drift
 *  from each other. */
export type ScheduleEventChangeHandler<P> = (event: ScheduleEvent<P>, next: {
    start: Date;
    end: Date;
}, reason: "drag" | "resize") => void;
export type ScheduleEventRemoveHandler<P> = (event: ScheduleEvent<P>) => void;
export type ScheduleEventCreateHandler = (range: {
    start: Date;
    end: Date;
}) => void;
/**
 * Compile-time counterpart to the dev-mode warning further down
 * (`eventEditGestureExceedsSchedule`'s call site, in
 * `schedule-timed-grid.tsx`) — see `lib/required-if.ts`'s own doc comment for
 * the general idiom and why it's safe. Consumed only by `ScheduleProps`'s
 * `Editable` generic (`schedule.tsx`), i.e. `Schedule`/`Schedule.Root` only.
 * `DaysView`/`DayView`/`WeekView` — the standalone, no-`Root`-wrapper views —
 * deliberately keep `editable` and its callbacks fully optional on
 * `TimeGridSharedProps` and rely solely on the runtime check: both
 * `DayView`/`WeekView` forward their props to `DaysView` via a `{...props}`
 * spread, and a spread doesn't carry per-field literal information for a
 * generic to infer from, so threading a second generic through that
 * standalone path wouldn't reliably catch anything at compile time — not
 * worth the extra API surface for comparatively rare standalone usage.
 */
export type EditableCallbacks<P, Editable extends boolean | readonly ScheduleEditGesture[]> = RequiredIfGranted<ScheduleEditGesture, Editable, "drag", {
    onEventChange: ScheduleEventChangeHandler<P>;
}> & RequiredIfGranted<ScheduleEditGesture, Editable, "resize", {
    onEventChange: ScheduleEventChangeHandler<P>;
}> & RequiredIfGranted<ScheduleEditGesture, Editable, "remove", {
    onEventRemove: ScheduleEventRemoveHandler<P>;
}> & RequiredIfGranted<ScheduleEditGesture, Editable, "create", {
    onEventCreate: ScheduleEventCreateHandler;
}>;
/**
 * `@internationalized/date`'s `DayOfWeek` isn't exported by name, so it's
 * derived structurally from `startOfWeek`'s own third parameter — the same
 * `NonNullable<Parameters<...>>` idiom `date-picker.tsx` uses for Ark's own
 * non-exported types.
 */
export type FirstDayOfWeek = NonNullable<Parameters<typeof startOfWeek>[2]>;
/**
 * `DaysViewProps.align` / `ScheduleProps.align`'s type — every
 * `FirstDayOfWeek` day-of-week value, plus `"relative"`: the visible
 * window's first day is always the anchor date itself (a rolling window),
 * never snapped to a locale calendar-week boundary. Named `align` (not
 * `startOfWeek`) on those two — `DaysView`'s window isn't necessarily a
 * week (`visibleDays` can be anything), so a literal "start of week" name
 * would mislead. `MonthView` has no use for a rolling window (a month grid
 * is always calendar-week-aligned, genuinely composed of calendar weeks),
 * so its own field keeps the accurate `startOfWeek` name and stays the
 * narrower `FirstDayOfWeek` — passing `"relative"` there is a compile
 * error, not just a documented restriction.
 */
export type ScheduleAlign = FirstDayOfWeek | "relative";
export type ScheduleClassNames = {
    toolbar?: string;
    grid?: string;
    event?: ScheduleEventChipClassNames;
    disabledOverlay?: string;
    nowIndicator?: string;
    /** The click-drag-to-create ghost box (RFC — click/drag-to-create). */
    createDraft?: string;
    /** The built-in event-details popover's panel. */
    eventDetailsPopover?: string;
    /** The built-in day-details popover's panel (Month view only). */
    dayDetailsPopover?: string;
    /** The Day/Week timed grid's "+N" many-way-overlap indicator. */
    overflowChip?: ScheduleOverflowChipClassNames;
    /** The Day/Week timed grid's sticky all-day row. */
    allDayRow?: string;
};
export type ScheduleEventChipClassNames = {
    root?: string;
    icon?: string;
    title?: string;
    time?: string;
    grip?: string;
    removeButton?: string;
};
export type ScheduleOverflowChipClassNames = {
    root?: string;
    content?: string;
    item?: string;
};
/**
 * RFC §15 — one unified `translations` prop, prop-only (no context), all
 * keys optional, shallow-merged over the English defaults below. Weekday/
 * month names and AM/PM are Intl-derivable from `locale`/`timeZone` and
 * deliberately have no key here.
 */
export type ScheduleTranslations = {
    now?: string;
    previous?: string;
    next?: string;
    days?: string;
    month?: string;
    year?: string;
    empty?: string;
    removeEvent?: string;
    /** `"{count}"`-substituted — see RFC §19 on why this stays a flat template for v1. */
    eventCount?: string;
    /** The day-details popover's back-to-list button — distinct from
     *  `previous` (calendar pagination), not reused for it. */
    back?: string;
    /** The Day/Week timed grid's all-day row gutter label. */
    allDay?: string;
    /** Screen-reader-only announcement (a visually-hidden `role="status"`
     *  region, `schedule-timed-grid.tsx`) fired once a create-drag commits —
     *  the create/remove chip animations are purely visual otherwise.
     *  `"{range}"`-substituted with the new event's time range: `onEventCreate`
     *  only ever receives `{ start, end }` (Schedule never invents a title),
     *  so there's nothing else to announce yet at this point. */
    eventCreated?: string;
    /** Same live region as `eventCreated`, fired once a remove's exit
     *  animation actually finishes. `"{title}"`-substituted — the full event
     *  (title included) is available by the time this fires. */
    eventRemoved?: string;
};
export declare const resolveScheduleTranslations: (overrides?: ScheduleTranslations) => Required<ScheduleTranslations>;
/** Substitutes `translations.eventCount`'s `"{count}"` template — the "+N"
 *  aria-label shared by every overflow trigger (the timed grid's and
 *  all-day row's `ScheduleOverflowPopover`, Month's own day-cell pill). */
export declare const eventCountLabel: (template: string, count: number) => string;
/** Resolves axis A of overlap-prevention (RFC §12a) for one gesture. */
export declare function isOverlapGestureEnabled(preventOverlap: boolean | ScheduleOverlapGesture[] | undefined, gesture: ScheduleOverlapGesture): boolean;
/**
 * Resolves `TimeGridSharedProps.preventOverlap`'s merged shape into its two
 * independent axes — `gestures` (feed to `isOverlapGestureEnabled`, once per
 * gesture) and `against` (feed to `resolveOverlapCandidates`,
 * `schedule-dates.ts`). Pure and cheap enough to call once per render, same
 * "resolve once, thread the result down" shape the rest of Schedule's
 * gesture/permission resolution already uses.
 *
 * | `preventOverlap`                  | → `gestures`   | → `against` |
 * |------------------------------------|-----------------|--------------|
 * | `undefined` / `false`              | `false`         | `"both"` (irrelevant — `gestures` is `false`) |
 * | `true`                              | `true`          | `"both"` |
 * | `{}`                                | `true`          | `"both"` |
 * | `{ gestures: [...] }`               | that array      | `"both"` |
 * | `{ against: X }`                    | `true`          | `X` |
 * | `{ gestures: [...], against: X }`   | that array      | `X` |
 */
export declare function resolveOverlapPrevention(preventOverlap: boolean | ScheduleOverlapPreventionOptions | undefined): {
    gestures: boolean | ScheduleOverlapGesture[];
    against: ScheduleOverlapTarget | "both";
};
/** Resolves the schedule-level `editable` grant for one gesture — same
 *  boolean-or-array shape/logic as `isOverlapGestureEnabled`, kept as a
 *  separate function since the two props are deliberately independent
 *  concepts with different gesture vocabularies. */
export declare function isEditGestureEnabled(editable: boolean | readonly ScheduleEditGesture[] | undefined, gesture: ScheduleEditGesture): boolean;
/**
 * The final, composed permission for one event + one gesture. Takes the
 * schedule-level grant *already resolved* for this gesture (via
 * `isEditGestureEnabled`, once per render at the grid level — the same
 * "resolve once, thread a boolean down" shape `preventOverlapOnDrag`/etc.
 * already use), not the raw `editable` prop — the event-level composition
 * below is the only part that varies per event. An event's own `editable`,
 * when present, can only narrow this further, never widen it: if the
 * schedule level doesn't grant a gesture, no per-event `editable` can turn
 * it back on.
 */
export declare function isEventGestureEnabled(scheduleGrant: boolean, event: Pick<ScheduleEvent, "editable">, gesture: ScheduleEventEditGesture): boolean;
/** Whether an event's own `editable` requests a gesture the schedule level
 *  doesn't already grant — a no-op the event can't actually widen into, and
 *  worth a dev-mode warning so that mismatch doesn't fail silently. */
export declare function eventEditGestureExceedsSchedule(scheduleEditable: boolean | readonly ScheduleEditGesture[] | undefined, event: Pick<ScheduleEvent, "editable">): ScheduleEventEditGesture[];
/** Shared across `Root` + all four views. */
export type ScheduleSharedProps<P = unknown> = {
    /** Draggable, resizable, removable events. Never mutated internally. */
    data: ScheduleEvent<P>[];
    /** Read-only, programmatically-supplied events. Default `[]`. */
    staticEvents?: ScheduleStaticEvent<P>[];
    /**
     * Fires on a click that lands on an event chip (of either kind). Presence
     * alone gates the built-in event-details popover — absent (the default),
     * clicking an event opens it; present, this fires instead and the popover
     * never mounts, matching the same "gated by presence" idiom `onEventRemove`
     * already uses for its remove button.
     */
    onEventClick?: (event: ScheduleAnyEvent<P>) => void;
    /**
     * Day-cell / day-header click, all four views. In Month view specifically,
     * presence alone gates the built-in day-details popover the same way
     * `onEventClick` gates the event one — absent, clicking a day opens it;
     * present, this fires instead. Day/Week/Year have no day-popover concept,
     * so there it only ever fires.
     */
    onDayClick?: (date: Date) => void;
    /**
     * Overrides the built-in event-details popover's content entirely.
     * Wherever the popover applies (everywhere `onEventClick`'s absence
     * enables it) — omitted from `YearViewProps`, which has neither.
     */
    renderEventDetails?: (event: ScheduleAnyEvent<P>) => ReactNode;
    locale?: string;
    /** Default `getLocalTimeZone()` — not Ark's own `"UTC"` default. */
    timeZone?: string;
    translations?: ScheduleTranslations;
    classNames?: ScheduleClassNames;
    className?: string;
};
/**
 * Day/Week only — structurally absent from Month/Year props, enforcing the
 * "no drag/resize outside a timed grid" rule at the type level rather than a
 * runtime flag.
 */
export type TimeGridSharedProps<P = unknown> = {
    /** Default `0`. */
    startHour?: number;
    /** Default `24`. */
    endHour?: number;
    /** Minutes — grid spacing AND the drag/resize snap increment. Default `15`.
     *  `minDurationMinutes` (resize/create floor) defaults to this same value,
     *  so the default minimum event duration is also 15 minutes. Any positive
     *  number of minutes is valid, not just the common 15/30/60 presets. */
    slotDuration?: number;
    /**
     * Row density — px per hour, as a **minimum**: the timed area stretches
     * via CSS to fill whatever real vertical space its container gives it,
     * scrolling only once this floor itself exceeds that space (**correction
     * after v1 shipped** — this used to be a fixed height, not a floor).
     * Absent: defaults to `defaultHourHeight(slotDuration)`
     * (`schedule-geometry.ts`), which scales with `slotDuration` so a finer
     * slot spacing gets a taller default hour — a coarser one, a shorter one
     * — clamped to a legible range at either extreme. An explicit value here
     * always overrides that default.
     */
    hourHeight?: number;
    slotDisabled?: ScheduleSlotPredicate;
    /** Override for tests/Storybook; a fixed value stops the live tick entirely. */
    now?: Date;
    /** Default `true`. */
    withNowIndicator?: boolean;
    /**
     * Which gestures are possible at all — `editable` (below) is the sole
     * authority on that; this fires once a permitted gesture actually
     * commits. Default `undefined`/no `"drag"` in `editable` means this never
     * fires — a schedule with no `editable` grant has nothing to report.
     */
    onEventChange?: ScheduleEventChangeHandler<P>;
    /** Fires when a permitted remove (`editable` including `"remove"`) actually
     *  happens. Whether the remove button renders is decided by `editable`
     *  alone, not by this prop's presence. */
    onEventRemove?: ScheduleEventRemoveHandler<P>;
    empty?: ReactNode;
    /**
     * Fires when a permitted click-drag-to-create (`editable` including
     * `"create"`) actually commits. Whether the gesture is possible at all is
     * decided by `editable` alone, not by this prop's presence. Schedule never
     * invents an `id`/`title`; the consumer builds the full event and adds it
     * to `data` themselves, same "fully consumer-controlled" contract as
     * `onEventChange`/`onEventRemove`. Doesn't reuse `onEventChange`'s
     * signature — there's no existing `ScheduleEvent` to pass for a fresh
     * draft. A plain click (no discernible drag) is a no-op; a drag shorter
     * than one `slotDuration` clamps up to exactly one, mirroring
     * `minDurationMinutes`'s resize floor.
     */
    onEventCreate?: ScheduleEventCreateHandler;
    /**
     * Fires on a plain click (no discernible drag) that lands on empty
     * day-column space — not on an event/overflow chip, and never alongside a
     * committed create-drag (the same click-vs-drag resolution that decides
     * `onEventCreate` decides this too, mutually exclusively). Independent of
     * `editable`'s `"create"` grant — deselecting/dismissing something the
     * consumer is tracking (e.g. a details panel driven by `onEventClick`)
     * shouldn't require create permission. Days view only, like `onEventCreate`.
     */
    onEventDismiss?: () => void;
    /**
     * Which gestures are possible on this schedule — `undefined` (the
     * default) means **nothing is editable**: no drag, no resize, no create,
     * no remove, regardless of which callbacks below are passed. `true` grants
     * all four; an array opts a subset in. A `kind:"event"` item can further
     * narrow (never widen) this via its own `editable` field — see
     * `ScheduleEvent`. In development, a console warning fires once if a
     * granted gesture's matching callback (`onEventChange` for `"drag"`/
     * `"resize"`, `onEventRemove` for `"remove"`, `onEventCreate` for
     * `"create"`) is missing, since the affordance would render but do
     * nothing when used. On `Schedule`/`Schedule.Root` specifically, passing a
     * literal (or otherwise call-site-resolvable) `editable` also makes this a
     * **compile error**, not just a console warning — see `EditableCallbacks`.
     * A non-literal `editable` (a plain `boolean`/`ScheduleEditGesture[]`
     * variable) can't be resolved to specific gestures at compile time, so it
     * conservatively requires every callback instead — the console warning
     * above remains the only check for that case, and for the standalone
     * `DaysView`/`DayView`/`WeekView`, which don't get the compile-time layer
     * at all (see `EditableCallbacks`'s own doc comment for why).
     */
    editable?: boolean | readonly ScheduleEditGesture[];
    /**
     * Overlap-prevention — keeps a created, dragged, or resized event from
     * landing on another one. Deliberately separate from `slotDisabled` (RFC
     * §12's own "occupied and disabled are two different, non-conflated
     * concepts" principle applies here too). Default (`undefined`/`false`)
     * reproduces today's v1 behavior everywhere — overlapping data still lays
     * out side-by-side via `layoutEventColumns`, unaffected until you opt in.
     *
     * A plain `boolean` covers the common case (`true` enforces it for
     * create, drag, *and* resize, against both event kinds). Pass
     * `ScheduleOverlapPreventionOptions` instead to scope which gestures
     * enforce it (`gestures`, default `true`) and/or which event kind(s) count
     * as a blocker (`against`, default `"both"`) — see
     * `resolveOverlapPrevention` for the exact resolution table.
     */
    preventOverlap?: boolean | ScheduleOverlapPreventionOptions;
    /**
     * Cap on side-by-side columns before further concurrent events collapse
     * into a "+N" overflow indicator. Applies to real point-in-time
     * concurrency, not a cluster's historical max, so a brief spike doesn't
     * flatten the cluster's otherwise-uncrowded events into overflow. Default
     * `4`. Pass `Number.POSITIVE_INFINITY` to restore unbounded columns.
     */
    maxOverlapColumns?: number;
    /**
     * Cap on visible concurrent all-day lanes before excess all-day events
     * collapse into a per-day "+N" overflow indicator — same
     * cap-then-overflow shape as `maxOverlapColumns`, just packed by day-index
     * (which day columns a bar spans) instead of by time. Default `2`, lower
     * than `maxOverlapColumns`'s `4` since a day-column is narrow. Ignored
     * when no all-day events are in view — the row itself doesn't render then.
     */
    maxAllDayRows?: number;
    /**
     * Overrides the built-in "+N" overflow disclosure popover entirely —
     * gated by presence alone, the same "defer to the consumer vs. show the
     * built-in UI" idiom `onEventClick`/`onDayClick` already use elsewhere.
     * Applies uniformly to both the timed grid's own column overflow and the
     * all-day row's per-day overflow. Absent (the default): clicking "+N"
     * opens the built-in popover — a list of the hidden events, each opening
     * into its own full details (title, time, icon, color, description) via
     * the same content every other event-details popover already shows.
     * Present: this fires instead, with the full list of hidden events for
     * that "+N", and the popover never mounts.
     */
    onOverflowClick?: (events: ScheduleAnyEvent<P>[]) => void;
};
export type AnchorDateProps = {
    date?: Date;
    defaultDate?: Date;
    onDateChange?: (date: Date) => void;
};
export type PaginationChromeProps = {
    withPagination?: boolean;
    withNowButton?: boolean;
};
export {};
//# sourceMappingURL=schedule-types.d.ts.map