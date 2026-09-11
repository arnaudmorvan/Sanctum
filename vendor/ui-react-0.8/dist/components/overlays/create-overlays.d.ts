import { type ReactNode } from "react";
import type { ConfirmLabels, ConfirmOverlayInput, ContentOverlayInput, DrawerSurfaceOptions, ModalSurfaceOptions, OverlayEntry, OverlayId, OverlayRegistry, ParamsOf, SurfaceInput, SurfaceOptions } from "./types";
export interface CreateOverlaysConfig<R extends OverlayRegistry = OverlayRegistry> {
    /** Registered context-overlay components, keyed by string. */
    registry?: R;
    /** Default confirm/cancel labels. */
    labels?: ConfirmLabels;
    /** Surface options merged under every modal. */
    modalProps?: Partial<ModalSurfaceOptions>;
    /** Surface options merged under every drawer. */
    drawerProps?: Partial<DrawerSurfaceOptions>;
    /** Portal container shared by all overlays. */
    container?: HTMLElement | null;
}
type OpenContextInput<R extends OverlayRegistry, K extends keyof R & string> = {
    key: K;
    params: ParamsOf<R, K>;
} & SurfaceInput;
export interface OverlayApi<R extends OverlayRegistry = OverlayRegistry> {
    /** Open an overlay with free-form content. Returns its id. */
    open: (input: ContentOverlayInput) => OverlayId;
    /** Open a confirm/cancel overlay (alertdialog by default). */
    openConfirm: (input: ConfirmOverlayInput) => OverlayId;
    /** Open a registered context overlay with typed `params`. */
    openContext: <K extends keyof R & string>(input: OpenContextInput<R, K>) => OverlayId;
    /** Sugar for `open({ ...input, surface: "drawer" })`. */
    openDrawer: (input: {
        children: ReactNode;
    } & DrawerSurfaceOptions) => OverlayId;
    close: (id: OverlayId) => void;
    closeAll: () => void;
    /** Patch an open overlay's surface options (title, size, …). */
    update: <K extends keyof R & string>(id: OverlayId, patch: Partial<SurfaceOptions & {
        params: ParamsOf<R, K>;
    }>) => void;
    /** Patch a context overlay's `params`. */
    updateContext: <K extends keyof R & string>(id: OverlayId, params: ParamsOf<R, K>) => void;
}
/**
 * Reactive return of `useOverlays()` — `[entries, handlers]`, à la `useState`.
 * `entries` is typed against the registry, so context entries narrow on
 * `key` and expose typed `params`.
 */
export type UseOverlaysReturn<R extends OverlayRegistry = OverlayRegistry> = readonly [
    OverlayEntry<R>[],
    OverlayApi<R>
];
export interface OverlayHandle<R extends OverlayRegistry = OverlayRegistry> {
    overlays: OverlayApi<R>;
    OverlaysProvider: () => React.JSX.Element;
    useOverlays: () => UseOverlaysReturn<R>;
}
/**
 * `createOverlays(config)` — the imperative overlays manager (modals + drawers).
 *
 * Returns a bound `overlays` object (callable from anywhere: event handlers,
 * utils), an `<OverlaysProvider />` renderer to mount once near the app root,
 * and a `useOverlays()` hook.
 *
 * Children is a bit weird in it's handling as it's not strictly a surface prop.
 * Might need to change later.
 *
 * Modelled on Ark's `createToaster`, but typed via generics
 * so registered context overlays are type-checked WITHOUT a `declare module` augmentation:
 * ```tsx
 *   export const { overlays, OverlaysProvider } = createOverlays({
 *     registry: { deleteUser: DeleteUserModal },   // ContextOverlayProps<{ userId }>
 *     labels: { confirm: "Confirm", cancel: "Cancel" },
 *   });
 *
 *   overlays.openContext({ key: "deleteUser", params: { userId: "42" } });
 *   //                                        ^ checked against DeleteUserModal's props
 * ```
 */
export declare function createOverlays<const R extends OverlayRegistry<any> = OverlayRegistry>(config?: CreateOverlaysConfig<R>): OverlayHandle<R>;
export {};
//# sourceMappingURL=create-overlays.d.ts.map