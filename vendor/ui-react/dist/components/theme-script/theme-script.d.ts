import { type ResolvedTheme, type ThemeAttribute, type ThemeMode } from "../../lib/theme";
export interface ThemeScriptProps {
    /** @default DEFAULT_THEME_STORAGE_KEY — must match `useTheme`'s `storageKey`. */
    storageKey?: string;
    /** Fallback used when nothing is stored yet. Must match `useTheme`'s
     *  `defaultColorScheme`, or the two can disagree on a visitor's first load.
     *  @default "system" */
    defaultColorScheme?: ThemeMode;
    /** Pins the applied theme, skipping the localStorage/OS-preference read
     *  entirely. Must also be passed to `useTheme`'s `forceColorScheme`, or
     *  this script and the hook will disagree on first load. */
    forceColorScheme?: ResolvedTheme;
    /** Which DOM mechanism(s) to write — add `"class"` alongside `"data-theme"`
     *  for consumers whose *other* CSS reads a literal `.dark` class (mirrors
     *  next-themes' `attribute` option). Must match `useTheme`'s `attribute`,
     *  or this script and the hook will disagree on first load.
     *  @default "data-theme" */
    attribute?: ThemeAttribute | ThemeAttribute[];
    /** CSP nonce, forwarded to the rendered `<script nonce>` — required if your
     *  app enforces a script-src CSP without `'unsafe-inline'`. */
    nonce?: string;
}
/**
 * Renders the blocking pre-hydration script that prevents a flash of the
 * wrong theme. Render it as early as possible — e.g. as the first child of
 * `<body>` — from a Server Component (the root `app/layout.tsx`), so
 * Next.js serializes it into the actual initial HTML response and the
 * browser executes it before paint, before hydration.
 *
 * No "use client": plain server-renderable markup, no hooks. This component
 * cannot help a Vite CSR app at all (by the time React could insert a
 * `<script>` after boot, the "before paint" window has passed) — see the
 * package README for the equivalent manual `<script>` paste into
 * `index.html`.
 *
 * Also requires `<html suppressHydrationWarning>` on the consumer's root
 * layout — the script mutates `data-theme` on `<html>` before React
 * hydrates it, an attribute the server-rendered markup never included.
 */
export declare function ThemeScript({ storageKey, defaultColorScheme, forceColorScheme, attribute, nonce, }?: ThemeScriptProps): import("react").JSX.Element;
//# sourceMappingURL=theme-script.d.ts.map