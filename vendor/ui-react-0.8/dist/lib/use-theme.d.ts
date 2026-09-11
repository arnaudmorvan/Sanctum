import { type ResolvedTheme, type ThemeAttribute, type ThemeMode } from "./theme";
export interface UseThemeOptions {
    /** @default DEFAULT_THEME_STORAGE_KEY — must match whatever key was passed
     *  to `<ThemeScript storageKey>` / the pasted init script. */
    storageKey?: string;
    /** Fallback used when nothing is stored yet.
     *  @default "system" */
    defaultColorScheme?: ThemeMode;
    /** Pins `mode`/`resolvedTheme` to a fixed value and makes `setMode` a
     *  no-op — no storage write, no DOM write. Must also be passed to
     *  `<ThemeScript forceColorScheme>` / the pasted init script, or the
     *  pre-hydration script and this hook will disagree on first load. */
    forceColorScheme?: ResolvedTheme;
    /** @default false — mirrors Mantine's option of the same name (flipped
     *  from next-themes' `disableTransitionOnChange`: here, suppression is
     *  the default). Transitions are suppressed for one frame around every
     *  applied theme change (`setMode`, the live system-preference listener,
     *  and the focus/visibility reapply) unless this is `true`. */
    keepTransitions?: boolean;
    /** Which DOM mechanism(s) to keep in sync — `"data-theme"` is the kit's
     *  own contract (`theme.css`'s `@custom-variant dark`); add `"class"` for
     *  consumers whose *other* CSS reads a literal `.dark` class instead
     *  (mirrors next-themes' `attribute` option). Must match whatever
     *  `attribute` was passed to `<ThemeScript>` / the pasted init script, or
     *  the pre-hydration script and this hook will disagree on first load.
     *  @default "data-theme" */
    attribute?: ThemeAttribute | ThemeAttribute[];
}
export interface UseThemeReturnValue {
    /** The user's explicit, persisted choice — "system" included as a real value. */
    mode: ThemeMode;
    /** The live, applied light/dark value — "system" already resolved. Read
     *  this to swap an icon; CSS never needs it directly (the kit's `dark:`
     *  utilities key off the `data-theme` attribute this mirrors). */
    resolvedTheme: ResolvedTheme;
    /** Persists `mode` (synced cross-tab/same-tab via `useLocalStorage`) AND
     *  synchronously applies the DOM attribute this-tab in the same call.
     *  Accepts a value or an updater resolved against the current `mode`
     *  (`setMode((prev) => ...)`), same shape as `useState`'s setter. A
     *  no-op while `forceColorScheme` is set — the updater isn't called. */
    setMode: (mode: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => void;
}
/**
 * Manages a persisted `"light" | "dark" | "system"` choice and keeps
 * `data-theme` on `<html>` in sync with it. Pair with `ThemeScript` (Next.js)
 * or a manually-pasted init script (Vite) to avoid a flash of the wrong
 * theme on first load — see the package README.
 *
 * Read `resolvedTheme` for *logic* (e.g. deciding what a click switches to);
 * don't render it directly. A server can't know the visitor's real
 * preference, so anything rendered from `resolvedTheme` is necessarily
 * wrong in the raw server-rendered HTML — before any JS/hydration runs at
 * all — no matter how quickly the hook itself corrects afterward. Derive
 * the *visible* state from CSS keyed off `data-theme` instead (the kit's
 * own `dark:` variant already matches it — see `theme.css`'s
 * `@custom-variant dark`), so the browser paints it correctly from the
 * very first frame, same as the rest of the page:
 *
 *   const { resolvedTheme, setMode } = useTheme()
 *   const next = resolvedTheme === "dark" ? "light" : "dark"
 *   <button onClick={() => setMode(next)}>
 *     <SunIcon className="dark:hidden" />
 *     <MoonIcon className="hidden dark:block" />
 *   </button>
 *
 * Deliberately does NOT run `applyThemeAttribute(resolveTheme(storedMode))`
 * in a plain effect keyed on the stored mode. During SSR and the first
 * client render, `useLocalStorage`'s `getServerSnapshot` always returns
 * `null`, forcing the stored mode to `defaultColorScheme` regardless of
 * what's actually stored — an effect deriving a DOM write from that stale
 * value could overwrite a `data-theme` an init script already set correctly.
 * `resolvedTheme` reads the DOM instead, so React only ever *reads* what (a)
 * the blocking script, (b) `setMode`, or (c) the system-preference listener
 * below already wrote.
 *
 * `resolvedTheme` is corrected via `useIsomorphicLayoutEffect`, not
 * `useSyncExternalStore`. React's own docs don't specify that
 * `useSyncExternalStore`'s hydration-snapshot correction happens before the
 * browser paints, and empirically it isn't reliably so — the fallback
 * `getResolvedThemeServerSnapshot()` value ("light") could get painted for a
 * frame before the real DOM-read value replaced it, a real visible flash.
 * `useLayoutEffect`'s "flushes before paint" guarantee is explicit, so the
 * correction is forced there instead — still a pure DOM *read*, same
 * safety property as above, just guaranteed pre-paint. Vitest/jsdom's
 * `act()` can't distinguish these two timings (it flushes every effect
 * synchronously regardless of kind), so a green test run alone doesn't
 * prove no flash — this specific class of bug only shows up in a real
 * browser.
 *
 * `forceColorScheme`, when set, is a constant argument (not derived from
 * `useLocalStorage`'s SSR-diverging state) — identical on server and
 * client, so applying it directly in an effect is safe and doesn't
 * reintroduce the flash bug above.
 *
 * `setMode` also accepts a `useState`-style updater resolved against the
 * current `mode` (e.g. a 3-way cycle: `setMode((m) => NEXT[m])`) — resolved
 * once, synchronously, against `mode` at call time, not queued/batched the
 * way React's own `setState` updater can be.
 */
export declare function useTheme(options?: UseThemeOptions): UseThemeReturnValue;
//# sourceMappingURL=use-theme.d.ts.map