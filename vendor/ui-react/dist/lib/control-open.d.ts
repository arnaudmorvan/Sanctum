import type { PointerEvent } from "react";
/**
 * "Tap anywhere on the control to open" — a pointer-only affordance for the
 * picker family, so the chevron and the field's dead zones (padding, value /
 * pill text, empty space) open the popover. Frustrating to tablet users
 * otherwise: the chevron is the obvious tap target but only the inner trigger /
 * input reacts.
 *
 * The real combobox element (the `<input>` or the trigger) keeps ownership of
 * keyboard + ARIA; this is purely an additive pointer convenience, so the
 * wrapper carries no role and there's no keyboard trap. Rules:
 *
 *   - Taps on a nested control — chevron toggle, clear ✕, pill-remove ✕, the
 *     input itself — are left alone (`closest(...)`), so they keep their own
 *     behavior and the picker never toggles shut on a stray field tap.
 *   - Dead-zone taps are **open-only** (`open` should call `setOpen(true)`,
 *     never toggle).
 *   - If the control hosts a text input (searchable pickers), it's focused
 *     first so typing and the soft keyboard follow on touch devices.
 *
 * Spread onto the control element, with `open` wired to the machine api:
 *
 *   <Ark.Control {...controlOpenProps(() => api.setOpen(true))}>
 */
export declare function controlOpenProps(open: () => void): {
    onPointerDown(event: PointerEvent<HTMLElement>): void;
};
//# sourceMappingURL=control-open.d.ts.map