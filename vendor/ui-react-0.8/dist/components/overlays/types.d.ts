import type { ComponentType, ReactNode } from "react";
import type { Brand } from "../../lib/brand";
import type { ButtonProps } from "../button/button";
import type { DrawerProps } from "../drawer/drawer";
import type { ModalProps } from "../modal/modal";
/** An overlay's id. Branded so it can't be passed a plain string or an id from
 *  a different manager (e.g. a toast id). Minted by `createOverlays`. */
export type OverlayId = Brand<string, "OverlayId">;
/**
 * Shared types for the imperative overlays manager.
 *
 * The store holds ONE discriminated union of overlay descriptors. `kind`
 * (content / confirm / context) selects the inner content; the orthogonal
 * `surface` (modal / drawer) selects the wrapper. A confirm-drawer or a
 * context-drawer therefore costs nothing — it's the same union.
 */
export type OverlayStatus = "open" | "closing";
export type OverlaySurface = "modal" | "drawer";
/** Per-instance presentation options, mirroring each wrapper's props minus the
 * lifecycle bits the manager drives itself. `modal` (Ark's modal-vs-modeless
 * boolean) is omitted too — overlays are always modal. */
export type ModalSurfaceOptions = Omit<ModalProps & {
    params?: Record<string, unknown>;
}, "open" | "defaultOpen" | "onOpenChange" | "onExitComplete" | "modal">;
export type DrawerSurfaceOptions = Omit<DrawerProps & {
    params?: Record<string, unknown>;
}, "open" | "defaultOpen" | "onOpenChange" | "onExitComplete" | "modal">;
export type SurfaceOptions = ModalSurfaceOptions | DrawerSurfaceOptions;
/** Picks the surface and carries its options (defaults to a modal). */
export type SurfaceInput = ({
    surface?: "modal";
} & ModalSurfaceOptions) | ({
    surface: "drawer";
} & DrawerSurfaceOptions);
export type ConfirmLabels = {
    confirm: ReactNode;
    cancel: ReactNode;
};
export type ContentOverlayInput = SurfaceInput & {
    /** Free-form content rendered in the body. */
    children: ReactNode;
};
export type ConfirmOverlayInput = SurfaceInput & {
    /** Body content rendered above the confirm/cancel buttons. */
    children?: ReactNode;
    /** Button labels. Falls back to the manager's configured `labels`. */
    labels?: Partial<ConfirmLabels>;
    /** Props forwarded to the confirm `Button` (e.g. `{ color: "red" }`). */
    confirmProps?: Partial<ButtonProps>;
    /** Props forwarded to the cancel `Button`. */
    cancelProps?: Partial<ButtonProps>;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    /** Close once `onConfirm` resolves. @default true */
    closeOnConfirm?: boolean;
    /** Close on cancel. @default true */
    closeOnCancel?: boolean;
};
/** Props received by a registered context-overlay component. */
export interface ContextOverlayProps<TInner extends Record<string, unknown> = Record<string, unknown>> {
    /** This overlay's id. */
    id: OverlayId;
    /** Caller-supplied, typed props. */
    params: TInner;
    /** Imperative handle scoped to this overlay. */
    context: {
        close: () => void;
        update: (patch: Partial<SurfaceOptions & {
            params: TInner;
        }>) => void;
    };
}
/** Maps string keys → components that accept `ContextOverlayProps<TInner>`. */
export type OverlayRegistry<T extends Record<string, unknown> = Record<string, unknown>> = Record<string, ComponentType<ContextOverlayProps<T>>>;
/** Extracts the `params` type a registered key expects. */
export type ParamsOf<R extends OverlayRegistry, K extends keyof R> = R[K] extends ComponentType<ContextOverlayProps<infer T>> ? T : never;
export type OverlaySurfaceBase = {
    surface: "drawer";
    surfaceOptions: DrawerSurfaceOptions;
} | {
    surface: "modal";
    surfaceOptions: ModalSurfaceOptions;
};
type OverlayBase = {
    id: OverlayId;
    status: OverlayStatus;
    params?: Record<string, unknown>;
} & OverlaySurfaceBase;
/** Context-overlay descriptor. For a concrete registry it distributes into a
 * union discriminated by `key`, each carrying that key's typed `params`;
 * for the bare default (an index-signature registry) it stays loose, matching
 * the pre-generic shape so the store/renderer compile unchanged. */
type ContextEntry<R extends OverlayRegistry> = string extends keyof R ? OverlayBase & {
    kind: "context";
    key: string;
    params: Record<string, unknown>;
} : {
    [K in keyof R & string]: OverlayBase & {
        kind: "context";
        key: K;
        params: ParamsOf<R, K>;
    };
}[keyof R & string];
export type OverlayEntry<R extends OverlayRegistry = OverlayRegistry> = (OverlayBase & {
    kind: "content";
    children: ReactNode;
}) | (OverlayBase & {
    kind: "confirm";
    children?: ReactNode;
    labels: ConfirmLabels;
    confirmProps?: Partial<ButtonProps>;
    cancelProps?: Partial<ButtonProps>;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    closeOnConfirm: boolean;
    closeOnCancel: boolean;
}) | ContextEntry<R>;
export {};
//# sourceMappingURL=types.d.ts.map