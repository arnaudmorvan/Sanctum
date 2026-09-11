/**
 * Compile-time counterpart to `dev-warn.ts` — for a "capability flag grants a
 * gesture, and the gesture is only useful with its matching callback" pair
 * (Pill's `withRemoveButton`/`onRemove`, Schedule's `editable`/
 * `onEventChange`/`onEventRemove`/`onEventCreate`), require the callback at
 * compile time whenever the flag can be resolved to a specific value at the
 * call site.
 *
 * The one rule that makes this safe rather than misleading: when the flag
 * *can't* be pinned to a literal (a plain `boolean`/string-array-typed
 * variable, a ternary between a grant and a non-grant, an explicit
 * `undefined`), every branch below resolves toward **requiring** the
 * callback, never toward silently allowing its absence — verified in a
 * scratch `.ts` file against literal, ternary, explicit-`undefined`, and
 * plain-variable cases before this shipped. Getting the direction backwards
 * is the actual trap here: the naive version of either type below (skip the
 * `[T] extends [U]` tuple wrap) is *distributive* over a `boolean`-typed flag
 * — TS expands it into a union of the whole required-shape and the whole
 * optional-shape, and a value missing the callback still structurally
 * matches the optional half of that union, so the "requirement" silently
 * evaporates exactly when the flag is dynamic. Wrapping both sides of the
 * `extends` check in a single-element tuple (`[T] extends [U]`) is the
 * standard idiom to suppress that distribution.
 *
 * This only covers the direct flag↔callback correlation. It can't (and
 * deliberately doesn't try to) express "a value inside a runtime array only
 * narrows, never widens, a sibling prop's grant" — Schedule's own per-event
 * `editable` vs. its schedule-level `editable` is exactly that shape, and
 * stays a `dev-warn.ts` runtime check (`eventEditGestureExceedsSchedule`)
 * for good reason: typing `data`'s elements against the grant would either
 * catch nothing (too permissive) or reject ordinary API-fetched event data
 * that just happens to use the full gesture union (too strict, false
 * positives on the common case). See `code-style.md`'s "Capability flag +
 * required callback" section for the full writeup and worked examples.
 */
export type RequiredIfTrue<Flag extends boolean, WhenTrue extends object> = [Flag] extends [false] ? Partial<WhenTrue> : WhenTrue;
/** The gestures actually granted by a `boolean | readonly Member[]`-shaped
 *  flag — `AllMembers` (the full literal universe, e.g. every
 *  `ScheduleEditGesture`) has to be a separate type param from the one
 *  `RequiredIfGranted` below tests membership of; collapsing them forces the
 *  flag to be narrowed to `readonly Member[]` for a single `Member`, which
 *  doesn't typecheck against a flag that legitimately ranges over the whole
 *  set. */
export type GrantedMembers<AllMembers extends string, Grant extends boolean | readonly AllMembers[]> = Grant extends true ? AllMembers : Grant extends readonly AllMembers[] ? Grant[number] : never;
export type RequiredIfGranted<AllMembers extends string, Grant extends boolean | readonly AllMembers[], Member extends AllMembers, WhenTrue extends object> = Member extends GrantedMembers<AllMembers, Grant> ? WhenTrue : Partial<WhenTrue>;
//# sourceMappingURL=required-if.d.ts.map