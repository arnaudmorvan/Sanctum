import type { Ref } from "react";
/**
 * `mergeRefs` — compose several refs into one callback ref.
 *
 * Components that keep an internal ref to a node (e.g. Select focusing its
 * trigger) but must also expose that node to the caller's `ref` (for
 * react-hook-form's focus-on-error) route both through this. Handles function
 * and object refs and skips nullish ones, so it's safe to pass an optional
 * external `ref` straight in.
 */
export declare function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (node: T | null) => void;
//# sourceMappingURL=merge-refs.d.ts.map