import { type RefObject } from "react";
/**
 * Tracks whether a container element's width is below `maxWidth`, updating
 * live via `ResizeObserver` as the container is resized — the container-query
 * counterpart to `useMediaQuery`, for components that need to respond to
 * their own allocated space rather than the browser viewport (embedded in a
 * panel, a resizable pane, or anything narrower than the window). SSR-safe
 * via `useSyncExternalStore`, same reasoning as `useMediaQuery`: the
 * hydration snapshot is fixed (`false`) so server and first-client-render
 * markup always agree — real browsers correct it shortly after mount,
 * `ResizeObserver` fires once immediately upon `observe()` with the
 * element's current size, not just on subsequent changes.
 *
 *   const ref = useRef<HTMLDivElement>(null)
 *   const isNarrow = useContainerQuery(ref, 768)
 *   <div ref={ref}>…</div>
 */
export declare function useContainerQuery(ref: RefObject<Element | null>, maxWidth: number): boolean;
//# sourceMappingURL=use-container-query.d.ts.map