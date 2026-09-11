declare const brand: unique symbol;
/**
 * `Brand<Base, Name>` — a nominal (branded) type: a `Base` value tagged with a
 * unique `Name` so the type system won't let it be confused with a plain `Base`
 * or with another brand. The tag is phantom (it never exists at runtime), so a
 * branded value IS its base at runtime; you mint one with a cast
 * (`value as MyId`), typically inside the id generator that owns it.
 *
 * ```ts
 *   type ToastId = Brand<string, "ToastId">
 *   type OverlayId = Brand<string, "OverlayId">
 *   declare const t: ToastId
 *   const s: string = t          // ✅ a brand widens back to its base
 *   const o: OverlayId = t        // ✗ Type 'ToastId' is not assignable to 'OverlayId'
 *   const back: ToastId = "x"     // ✗ plain string isn't a ToastId
 * ```
 */
export type Brand<Base, Name extends string> = Base & {
    readonly [brand]: Name;
};
export {};
//# sourceMappingURL=brand.d.ts.map