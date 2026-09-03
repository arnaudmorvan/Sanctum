/**
 * Public root entry — exposes only the styling utility and tailwind plugin
 * re-export. Components are deliberately NOT re-exported here: consumers
 * import them via subpath entries (`@42/ui/button`, `@42/ui/dialog`) so
 * bundlers can tree-shake at the component-file boundary.
 */
export { cn } from "./lib/cn";
export { COLORS, type Color } from "./lib/colors";
export type { FormControlProps } from "./lib/form-control";
export { LinkComponentProvider, type LinkComponentProviderProps, useLinkComponent, } from "./lib/link-component";
export { SIZES, type Size } from "./lib/sizes";
export { type BuildThemeInitScriptOptions, buildThemeInitScript, DEFAULT_THEME_STORAGE_KEY, getSystemTheme, isThemeMode, type ResolvedTheme, resolveTheme, THEME_MODES, type ThemeMode, } from "./lib/theme";
export { HEADING_SIZE_ALIASES, type HeadingSizeAlias, TYPOGRAPHY_SIZE_CLASSES, type TypographySize, } from "./lib/typography-size";
export { useContainerQuery } from "./lib/use-container-query";
export { useIsomorphicLayoutEffect } from "./lib/use-isomorphic-layout-effect";
export { type UseLocalStorageOptions, useLocalStorage } from "./lib/use-local-storage";
export { useLogger } from "./lib/use-logger";
export { useMediaQuery } from "./lib/use-media-query";
export { type UseThemeOptions, type UseThemeReturnValue, useTheme } from "./lib/use-theme";
export { type UseUncontrolledOptions, type UseUncontrolledReturnValue, useUncontrolled, } from "./lib/use-uncontrolled";
//# sourceMappingURL=index.d.ts.map