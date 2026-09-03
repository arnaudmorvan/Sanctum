import type { ToastData, ToastId } from "./types";
/**
 * Framework-agnostic toast store — a tiny vanilla pub/sub modelled on the kit's
 * overlay store (`components/overlays/store.ts`). Holds the live toast stack;
 * the React renderer (`Notifications`) subscribes via `useSyncExternalStore`,
 * and the bound `notify` controller wraps its mutators. No React here, so it's
 * safe to call from anywhere (event handlers, utils).
 *
 * Every mutation produces a fresh `state` + `toasts` array, so `getSnapshot`
 * returns a stable reference between mutations — the contract
 * `useSyncExternalStore` relies on to avoid tearing / render loops.
 *
 * Auto-dismiss timers live here (plain `setTimeout`), with remaining-time
 * bookkeeping so `pauseAll`/`resumeAll` (driven by the renderer on hover /
 * tab-hidden) can freeze and resume them. DOM listeners do NOT live here.
 */
export interface ToastStoreState {
    toasts: ToastData[];
}
export interface ToastStore {
    subscribe: (listener: () => void) => () => void;
    getSnapshot: () => ToastStoreState;
    getServerSnapshot: () => ToastStoreState;
    /** Upsert by id: a new id prepends (and starts its timer); an existing id
     *  merges in place and restarts its timer (used for status transitions). */
    create: (data: ToastData) => ToastId;
    /** Shallow-merge a patch into a live toast without touching its timer/status. */
    update: (id: ToastId, patch: Partial<ToastData>) => void;
    /** Flip a toast to `dismissing` so its exit animation plays (all if no id). */
    dismiss: (id?: ToastId) => void;
    /** Hard-remove a toast — called once its exit animation completes. */
    remove: (id: ToastId) => void;
    /** Freeze every auto-dismiss timer (hover / tab hidden). */
    pauseAll: () => void;
    /** Resume every frozen timer from its remaining time. */
    resumeAll: () => void;
    has: (id: ToastId) => boolean;
}
export declare function createToastStore(config?: {
    max: number;
}): ToastStore;
//# sourceMappingURL=store.d.ts.map