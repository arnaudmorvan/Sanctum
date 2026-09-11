/**
 * `WithTestId` — the kit-wide `testId` contract every component's props type
 * intersects.
 *
 * `testId` always renders as `data-testid` (via the `props()` helper, so it's
 * dropped cleanly when unset) on the component's real interactive DOM node —
 * never on a decorative wrapper. What "real" means depends on the component's
 * shape:
 *
 *   - A component that renders a single element through the `ark.*` factory
 *     (`Button`, `Badge`, a compound part like `Tabs.Trigger`) — `testId`
 *     lands on that element.
 *   - A "shell" component whose styled outer `<div>` isn't what a user
 *     interacts with (`Input`, `Select`, …) — `testId` lands on the real
 *     inner control (the `<input>`, the trigger `<button>`), not the shell.
 *   - A data-driven array API generates one DOM node per item with no prop
 *     slot of its own — see the `testId` field on `SelectItem` and the
 *     menu/tabs item shapes, threaded to each rendered item individually.
 *   - `DataTable` rows/cells have no per-row prop slot either — see
 *     `getRowTestId` on `DataTableProps`.
 *
 * See the "Testing" guide (`/docs/testing`) for the full per-component
 * cheatsheet, and Ark UI's own `data-scope` / `data-part` / `data-value`
 * attributes (emitted for free on every machine-backed part) as a
 * complementary, always-on selector.
 */
export type WithTestId = {
    testId?: string;
};
//# sourceMappingURL=test-id.d.ts.map