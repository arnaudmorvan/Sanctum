import { type ThemeAttribute, type ThemeMode } from "./theme";
export interface ThemeInitOptions {
    storageKey: string;
    defaultColorScheme: ThemeMode;
    forceColorScheme?: "light" | "dark";
    attribute: ThemeAttribute[];
}
/**
 * Reads config off a `<script>`'s own `data-*` attributes — the browser
 * sets `document.currentScript` to the tag currently executing, which is
 * exactly this script when loaded via a plain `<script src>` — falling
 * back to the same defaults `buildThemeInitScript()` uses. A pure function
 * (dataset in, options out) so it's directly testable: `document.currentScript`
 * only reflects reality for an actually-parsed `<script>` tag in a real
 * browser, not for a module imported under vitest/jsdom.
 */
export declare function resolveInitOptionsFromDataset(dataset: DOMStringMap | undefined): ThemeInitOptions;
/**
 * The same resolve-and-apply `buildThemeInitScript()`'s generated string
 * performs, as real, directly-testable code — this runs standalone (no
 * imports left at runtime once bundled as an IIFE) for consumers loading
 * `dist/theme-init.js` via a plain `<script src>` instead of rendering
 * `ThemeScript` from a Next.js Server Component.
 */
export declare function runThemeInit({ storageKey, defaultColorScheme, forceColorScheme, attribute, }: ThemeInitOptions): void;
//# sourceMappingURL=theme-init-runtime.d.ts.map