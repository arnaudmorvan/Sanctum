import { useCallback, useSyncExternalStore } from 'react';

// src/lib/use-container-query.ts
function subscribe(ref, onChange) {
  const el = ref.current;
  if (!el || typeof ResizeObserver === "undefined") return () => {
  };
  const observer = new ResizeObserver(onChange);
  observer.observe(el);
  return () => observer.disconnect();
}
function getServerSnapshot() {
  return false;
}
function useContainerQuery(ref, maxWidth) {
  const subscribeToResize = useCallback((onChange) => subscribe(ref, onChange), [ref]);
  const getSnapshot = useCallback(() => {
    const width = ref.current?.getBoundingClientRect().width;
    return width != null && width < maxWidth;
  }, [ref, maxWidth]);
  return useSyncExternalStore(subscribeToResize, getSnapshot, getServerSnapshot);
}

export { useContainerQuery };
