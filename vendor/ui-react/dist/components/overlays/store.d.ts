import type { OverlayEntry, OverlayId } from "./types";
/**
 * Framework-agnostic overlay store — a tiny vanilla pub/sub modelled on Ark's
 * `createToaster`. Holds the open-overlay stack; the React renderer subscribes
 * via `useSyncExternalStore`. No React here, so it's safe to import anywhere
 * (event handlers, utils) and the imperative `modals` object wraps its
 * mutators.
 *
 * Every mutation produces a fresh `state` object and a fresh `entries` array,
 * so `getSnapshot` returns a stable reference between mutations.
 * the contract `useSyncExternalStore` relies on to avoid tearing / render loops.
 */
export interface OverlayStoreState {
    entries: OverlayEntry[];
}
export interface OverlayStore {
    subscribe: (listener: () => void) => () => void;
    getSnapshot: () => OverlayStoreState;
    getServerSnapshot: () => OverlayStoreState;
    /** Append an entry and return its id. */
    open: (entry: OverlayEntry) => OverlayId;
    /** Shallow-merge fields into an existing entry. */
    edit: (id: OverlayId, partial: Partial<OverlayEntry>) => void;
    /** Flip an entry to `closing` so its wrapper animates out. */
    close: (id: OverlayId) => void;
    /** Flip every entry to `closing`. */
    closeAll: () => void;
    /** Hard-remove an entry (called once its exit animation completes). */
    remove: (id: OverlayId) => void;
    has: (id: OverlayId) => boolean;
}
export declare function createOverlayStore(): OverlayStore;
//# sourceMappingURL=store.d.ts.map