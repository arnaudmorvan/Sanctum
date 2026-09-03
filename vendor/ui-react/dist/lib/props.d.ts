/**
 * `props` — drop the falsy entries from an HTML props object.
 *
 * The kit leans on the `attr={value || undefined}` idiom to keep boolean
 * `data-*` / `aria-*` attributes off the DOM when they're off: React omits a
 * prop whose value is `undefined` / `null`, but a bare `false` / `0` still
 * renders as `data-x="false"` / `data-x="0"`. `props` does that for a whole
 * object at once, so a cluster of state flags reads as one spread instead of N
 * `|| undefined` tails:
 *
 *   <ark.div
 *     data-color={color}
 *     {...props({
 *       "data-invalid": invalid,
 *       "data-disabled": disabled,
 *       "data-pointer": pointer,
 *     })}
 *     {...rest}
 *   />
 *
 * Falsy means JS-falsy (`false`, `0`, `""`, `null`, `undefined`, `NaN`), so a
 * meaningful `0` (e.g. `tabIndex={0}`) is dropped too — pass those directly.
 *
 * The return type mirrors the runtime: every key turns optional (it may have
 * been stripped) and its value narrows to the truthy subset — so a `boolean`
 * flag surfaces as `?: true`, and a key that can only ever be falsy drops out
 * of the type entirely.
 */
/** JS-falsy values that are representable in the type system (`NaN` isn't). */
type Falsy = false | 0 | 0n | "" | null | undefined;
/** Any property bag — string keys, unknown values. */
type Props = Record<string, unknown>;
/** Drop the always-falsy keys; keep the rest optional and narrowed to truthy. */
type Truthy<T extends Props> = {
    [K in keyof T as Exclude<T[K], Falsy> extends never ? never : K]?: Exclude<T[K], Falsy>;
};
/** Return a copy of `source` with every falsy-valued entry removed. */
export declare function props<const T extends Props>(source: T): Truthy<T>;
export {};
//# sourceMappingURL=props.d.ts.map