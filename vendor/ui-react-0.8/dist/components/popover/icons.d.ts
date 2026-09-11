/**
 * Tiny shared SVGs for the form family's popovers — hand-rolled (not lucide)
 * to keep these leaves dependency-free, matching Spinner's approach. Both
 * inherit `currentColor` and are sized by the parent's `[&_svg]:size-*`.
 */
/** Selected-option check mark (Combobox / Select item indicator). */
export declare const CheckIcon: () => import("react").JSX.Element;
/** Trigger chevron. Rotate via `data-[state=open]:rotate-180` on the trigger. */
export declare const ChevronIcon: () => import("react").JSX.Element;
/** Previous-month/year/decade nav (Calendar's `PrevTrigger`). Dedicated glyph rather than
 *  `ChevronIcon` rotated 90° — that one's a down-facing dropdown-toggle affordance, a
 *  differently-intentioned shape to reuse for directional paging. */
export declare const ChevronLeftIcon: () => import("react").JSX.Element;
/** Next-month/year/decade nav (Calendar's `NextTrigger`). See `ChevronLeftIcon`. */
export declare const ChevronRightIcon: () => import("react").JSX.Element;
/** Indeterminate (partial) mark — TreeMultiSelect's checkbox when some children are selected. */
export declare const MinusIcon: () => import("react").JSX.Element;
/** Clear (×) — for clear triggers and pill removes. */
export declare const CloseIcon: () => import("react").JSX.Element;
/** DatePicker's trigger leading icon. */
export declare const CalendarIcon: () => import("react").JSX.Element;
/** DatePicker's embedded time-panel section marker. */
export declare const ClockIcon: () => import("react").JSX.Element;
//# sourceMappingURL=icons.d.ts.map