import { DEFAULT_THEME_STORAGE_KEY, resolveTheme, applyThemeAttribute, getSystemTheme, isThemeMode, disableTransitionsDuringChange } from './chunk-EEMRRRYS.js';
export { DEFAULT_THEME_STORAGE_KEY, THEME_MODES, buildThemeInitScript, getSystemTheme, isThemeMode, resolveTheme } from './chunk-EEMRRRYS.js';
export { HEADING_SIZE_ALIASES, TYPOGRAPHY_SIZE_CLASSES } from './chunk-C7V53TG4.js';
export { LinkComponentProvider, useLinkComponent } from './chunk-GTKKRV5N.js';
export { useContainerQuery } from './chunk-P3XMBETI.js';
export { useUncontrolled } from './chunk-BEL75C7N.js';
export { cn } from './chunk-SAS62TWA.js';
import { useEffect, useLayoutEffect, useRef, useCallback, useSyncExternalStore, useMemo, useState } from 'react';

// src/lib/colors.ts
var COLORS = [
  "brand",
  "gray",
  // Composed from existing white/gray/brand-950 tokens rather than its own
  // scale — the literal white/dark-navy button from the 42 UI Kit Figma.
  "neutral",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
  "pink"
];

// src/lib/sizes.ts
var SIZES = ["xs", "sm", "md", "lg", "xl"];
var useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
var listeners = /* @__PURE__ */ new Map();
var memoryFallback = /* @__PURE__ */ new Map();
var totalSubscribers = 0;
function notify(key) {
  for (const listener of listeners.get(key) ?? []) listener();
}
function handleStorageEvent(event) {
  if (event.key === null) {
    for (const key of listeners.keys()) notify(key);
  } else {
    notify(event.key);
  }
}
function subscribe(key, listener) {
  let set = listeners.get(key);
  if (!set) {
    set = /* @__PURE__ */ new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  if (totalSubscribers++ === 0) window.addEventListener("storage", handleStorageEvent);
  return () => {
    set?.delete(listener);
    if (set?.size === 0) {
      listeners.delete(key);
      memoryFallback.delete(key);
    }
    if (--totalSubscribers === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}
function readStorage(key) {
  const fallback = memoryFallback.get(key);
  if (fallback !== void 0) return fallback;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key, serialized) {
  try {
    localStorage.setItem(key, serialized);
    memoryFallback.delete(key);
  } catch {
    memoryFallback.set(key, serialized);
  }
  notify(key);
}
function removeStorage(key) {
  memoryFallback.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {
  }
  notify(key);
}
function getServerSnapshot() {
  return null;
}
function useLocalStorage({
  key,
  defaultValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse
}) {
  const defaultValueRef = useRef(defaultValue);
  const subscribeToKey = useCallback((listener) => subscribe(key, listener), [key]);
  const getSnapshot = useCallback(() => readStorage(key), [key]);
  const raw = useSyncExternalStore(subscribeToKey, getSnapshot, getServerSnapshot);
  const value = useMemo(() => {
    if (raw === null) return defaultValueRef.current;
    try {
      return deserialize(raw);
    } catch {
      return defaultValueRef.current;
    }
  }, [raw, deserialize]);
  const setValue = useCallback(
    (next) => {
      const resolved = typeof next === "function" ? next(value) : next;
      writeStorage(key, serialize(resolved));
    },
    [key, serialize, value]
  );
  const removeValue = useCallback(() => {
    removeStorage(key);
  }, [key]);
  return [value, setValue, removeValue];
}
function useLogger(componentName, props) {
  const mounted = useRef(false);
  useEffect(() => {
    console.log(`${componentName} mounted`, ...props);
    return () => {
      mounted.current = false;
      console.log(`${componentName} unmounted`);
    };
  }, []);
  useEffect(() => {
    if (mounted.current) {
      console.log(`${componentName} updated`, ...props);
    } else {
      mounted.current = true;
    }
  }, props);
  return null;
}
function subscribe2(query, listener) {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", listener);
  return () => mediaQueryList.removeEventListener("change", listener);
}
function getServerSnapshot2() {
  return false;
}
function useMediaQuery(query) {
  const subscribeToQuery = useCallback(
    (listener) => subscribe2(query, listener),
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribeToQuery, getSnapshot, getServerSnapshot2);
}
function applyThemeGuarded(theme, attribute, keepTransitions) {
  const restore = keepTransitions ? null : disableTransitionsDuringChange();
  applyThemeAttribute(theme, attribute);
  restore?.();
}
var resolvedThemeListeners = /* @__PURE__ */ new Set();
var observer = null;
function notifyResolvedTheme() {
  for (const listener of resolvedThemeListeners) listener();
}
function subscribeResolvedTheme(listener) {
  resolvedThemeListeners.add(listener);
  if (resolvedThemeListeners.size === 1 && typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(notifyResolvedTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"]
    });
  }
  return () => {
    resolvedThemeListeners.delete(listener);
    if (resolvedThemeListeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}
function getResolvedThemeSnapshot(attribute) {
  if (typeof document === "undefined") return "light";
  const attrs = Array.isArray(attribute) ? attribute : [attribute];
  const root = document.documentElement;
  if (attrs.includes("data-theme"))
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  return root.classList.contains("dark") ? "dark" : "light";
}
function getResolvedThemeServerSnapshot() {
  return "light";
}
function deserializeThemeMode(raw) {
  const parsed = JSON.parse(raw);
  if (!isThemeMode(parsed)) throw new Error(`invalid stored theme mode: ${raw}`);
  return parsed;
}
function useTheme(options = {}) {
  const storageKey = options.storageKey ?? DEFAULT_THEME_STORAGE_KEY;
  const defaultColorScheme = options.defaultColorScheme ?? "system";
  const keepTransitions = options.keepTransitions ?? false;
  const forceColorScheme = options.forceColorScheme;
  const attribute = options.attribute ?? "data-theme";
  const attributeKey = Array.isArray(attribute) ? attribute.join(",") : attribute;
  const [storedMode, setStoredMode] = useLocalStorage({
    key: storageKey,
    defaultValue: defaultColorScheme,
    deserialize: deserializeThemeMode
  });
  const [domResolvedTheme, setDomResolvedTheme] = useState(
    getResolvedThemeServerSnapshot
  );
  useIsomorphicLayoutEffect(() => {
    setDomResolvedTheme(getResolvedThemeSnapshot(attribute));
    return subscribeResolvedTheme(() => setDomResolvedTheme(getResolvedThemeSnapshot(attribute)));
  }, [attributeKey]);
  const mode = forceColorScheme ?? storedMode;
  const resolvedTheme = forceColorScheme ?? domResolvedTheme;
  const setMode = useCallback(
    (next) => {
      if (forceColorScheme) return;
      const resolved = typeof next === "function" ? next(mode) : next;
      setStoredMode(resolved);
      applyThemeGuarded(resolveTheme(resolved), attribute, keepTransitions);
    },
    [mode, setStoredMode, attributeKey, keepTransitions, forceColorScheme]
  );
  useEffect(() => {
    if (forceColorScheme || mode !== "system" || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeGuarded(getSystemTheme(), attribute, keepTransitions);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode, attributeKey, keepTransitions, forceColorScheme]);
  useEffect(() => {
    if (forceColorScheme) return;
    const reapply = () => {
      if (document.visibilityState === "visible") {
        applyThemeGuarded(resolveTheme(mode), attribute, keepTransitions);
      }
    };
    window.addEventListener("visibilitychange", reapply);
    window.addEventListener("focus", reapply);
    return () => {
      window.removeEventListener("visibilitychange", reapply);
      window.removeEventListener("focus", reapply);
    };
  }, [mode, attributeKey, keepTransitions, forceColorScheme]);
  useEffect(() => {
    if (forceColorScheme) applyThemeAttribute(forceColorScheme, attribute);
  }, [forceColorScheme, attributeKey]);
  return { mode, resolvedTheme, setMode };
}

export { COLORS, SIZES, useIsomorphicLayoutEffect, useLocalStorage, useLogger, useMediaQuery, useTheme };
