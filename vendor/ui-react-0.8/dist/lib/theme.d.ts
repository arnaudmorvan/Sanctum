/**
 * Framework-agnostic theme core — types, storage-key contract, and the pure
 * read/resolve/apply functions. No React import, no "use client": this
 * module is dual-purpose. `buildThemeInitScript` must be safely callable
 * from a genuine server/Node context (it only ever returns a string), while
 * the DOM-touching functions self-guard with `typeof document === "undefined"`
 * checks, mirroring `apps/docs/lib/direction.ts`'s `readDirection()`.
 *
 * `use-theme.ts` and `components/theme-script` both import from here so the
 * storage key, mode validation, and light/dark resolution can never drift
 * between the pre-hydration blocking script and the post-hydration hook.
 */
export declare const THEME_MODES: readonly ["light", "dark", "system"];
export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, "system">;
export declare const THEME_ATTRIBUTES: readonly ["data-theme", "class"];
export type ThemeAttribute = (typeof THEME_ATTRIBUTES)[number];
/** Shared default for `useTheme({ storageKey })` and `<ThemeScript storageKey>` —
 *  always pass the same value to both, or the persisted preference and the
 *  pre-hydration DOM attribute will disagree. */
export declare const DEFAULT_THEME_STORAGE_KEY = "ui-theme";
export declare function isThemeMode(value: unknown): value is ThemeMode;
/** SSR-safe: no `window` means no OS preference to read — defaults to
 *  "light", matching theme.css's "absence of data-theme means light" contract. */
export declare function getSystemTheme(): ResolvedTheme;
export declare function resolveTheme(mode: ThemeMode): ResolvedTheme;
/**
 * `data-theme` is the one contract this whole feature exists to drive —
 * `theme.css`'s `@custom-variant dark` matches on it. `class` is opt-in, for
 * consumers whose *other* CSS (Fumadocs' bundled styles, Tailwind's default
 * `dark` strategy, third-party components) reads a literal `.dark` class
 * instead — mirrors next-themes' `attribute` option of the same name, so
 * `@42/ui-react` can drive that too instead of every consumer hand-rolling
 * their own mirror script/observer.
 * @default "data-theme"
 */
export declare function applyThemeAttribute(theme: ResolvedTheme, attribute?: ThemeAttribute | ThemeAttribute[]): void;
/**
 * Mirrors next-themes' `disableTransitionOnChange`: without this, any
 * element with a `transition` on a color/border/background property
 * visibly animates through a theme swap instead of snapping instantly.
 * Call before changing `data-theme`, then call the returned function right
 * after — it forces a reflow (so the browser actually observes the
 * suppression instead of coalescing both style mutations into one frame)
 * and removes the override on the next tick, restoring normal transitions
 * for everything unrelated to the swap.
 */
export declare function disableTransitionsDuringChange(): () => void;
export interface BuildThemeInitScriptOptions {
    /** @default DEFAULT_THEME_STORAGE_KEY */
    storageKey?: string;
    /** Fallback used when nothing is stored yet.
     *  @default "system" */
    defaultColorScheme?: ThemeMode;
    /** Pins the applied theme, skipping the localStorage/OS-preference read
     *  entirely. Must match whatever `forceColorScheme` is passed to
     *  `useTheme()`, or the pre-hydration script and the hook will disagree. */
    forceColorScheme?: ResolvedTheme;
    /** Which DOM mechanism(s) to write. Must match whatever `attribute` is
     *  passed to `useTheme()`, or the pre-hydration script and the hook will
     *  disagree on what to keep in sync.
     *  @default "data-theme" */
    attribute?: ThemeAttribute | ThemeAttribute[];
}
/**
 * Body of the synchronous, blocking script meant to run before first paint:
 * reads the persisted mode, resolves "system" against the real OS
 * preference, and writes `data-theme` (and/or `.dark`, see `attribute`) —
 * before React/hydration exists. One-shot only, deliberately no listeners
 * registered here (kept minimal because it blocks HTML parsing) — live
 * "system" follow-up after this point is `useTheme`'s job (see `use-theme.ts`).
 *
 * A genuine constant: every option this module supports is data the IIFE
 * reads off its own `cfg` argument at runtime (`cfg.force`, `cfg.key`,
 * `cfg.def`, `cfg.attr`), never text spliced in ahead of time — so this
 * string is identical byte-for-byte no matter what callers pass to
 * `buildThemeInitScript`, which only ever appends a `JSON.stringify`d config
 * object after it. That's what lets `ThemeScript` render the same script
 * source on every request instead of a freshly-assembled one per render.
 */
export declare const THEME_INIT_SCRIPT_BODY = "(function(cfg){try{\n  var d;\n  if(cfg.force){\n    d=cfg.force;\n  }else{\n    var s=localStorage.getItem(cfg.key),v=null;\n    if(s){try{v=JSON.parse(s)}catch(e){v=null}}\n    if([\"light\",\"dark\",\"system\"].indexOf(v)===-1)v=cfg.def;\n    d=v===\"system\"?(window.matchMedia&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?\"dark\":\"light\"):v;\n  }\n  if(cfg.attr.indexOf(\"data-theme\")!==-1)document.documentElement.setAttribute(\"data-theme\",d);\n  if(cfg.attr.indexOf(\"class\")!==-1)document.documentElement.classList.toggle(\"dark\",d===\"dark\");\n}catch(e){}})(";
/**
 * Framework-agnostic string, not JSX — `ThemeScript` (a component under
 * `src/components/theme-script/`) is the Next.js-facing wrapper; the
 * package README covers pasting this same output into a Vite `index.html`.
 *
 * Only ever concatenates `THEME_INIT_SCRIPT_BODY` (always the same) with a
 * `JSON.stringify`d config object (the only part that varies per call) — the
 * script's actual logic never branches per-caller, so it stays the same
 * static source for every combination of options.
 */
export declare function buildThemeInitScript(options?: BuildThemeInitScriptOptions): string;
//# sourceMappingURL=theme.d.ts.map