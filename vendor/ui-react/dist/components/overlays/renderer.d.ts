import type { OverlayStore } from "./store";
import type { OverlayId, OverlayRegistry, ParamsOf, SurfaceOptions } from "./types";
/** Minimal slice of the imperative API the renderer needs at runtime. */
export interface OverlayController<R extends OverlayRegistry> {
    close: (id: OverlayId) => void;
    update: (id: OverlayId, patch: Partial<SurfaceOptions & {
        params: ParamsOf<R, keyof R & string>;
    }>) => void;
}
interface OverlayRendererProps<R extends OverlayRegistry> {
    store: OverlayStore;
    registry: R;
    controller: OverlayController<R>;
}
/**
 * Renders the overlay stack as a SINGLE visible overlay at a time.
 *
 * The store keeps the whole stack, but only the top entry (`entries[0]`, since
 * `open` prepends) is rendered, so there's ever one overlay on screen. Closing
 * the top reveals the next; entries beneath are retained but unmounted while
 * covered. This is the single seam to change if we ever render the stack with
 * depth/parallax effects.
 *
 * The backdrop is hoisted here and shared by the whole stack: it stays mounted
 * across swaps and only fades when the last *open* overlay begins closing, so
 * multi-step transitions don't blink a backdrop in and out.
 */
export declare function OverlayRenderer<R extends OverlayRegistry = OverlayRegistry>({ store, registry, controller: modals, }: OverlayRendererProps<R>): import("react").JSX.Element;
export {};
//# sourceMappingURL=renderer.d.ts.map