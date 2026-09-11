/**
 * Tracks whether a media query currently matches, updating live as the
 * viewport (or whichever media feature) changes. SSR-safe via
 * `useSyncExternalStore`, mirroring `useLocalStorage`'s use of the same hook
 * for the same reason: the hydration snapshot is fixed (`false`) so server
 * and first-client-render markup always agree.
 *
 *   const isMobile = useMediaQuery("(width < 768px)")
 */
export declare function useMediaQuery(query: string): boolean;
//# sourceMappingURL=use-media-query.d.ts.map