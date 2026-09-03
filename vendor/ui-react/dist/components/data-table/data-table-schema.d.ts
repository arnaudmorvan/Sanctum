import type { StandardSchemaV1 } from "@standard-schema/spec";
/** Entity type inferred from any Standard Schema validator (Zod v4, Valibot,
 *  ArkType, …). See `docs/rfcs/data-table.md` §4. */
export type InferEntity<S extends StandardSchemaV1> = StandardSchemaV1.InferOutput<S>;
/**
 * A `createColumnHelper<TEntity>()` derived from a Standard Schema validator,
 * so `TEntity` never needs a duplicate hand-written type declaration — the
 * schema you already validate against also drives column narrowing. The
 * `schema` argument only drives inference (and is retained for optional
 * future runtime use); it isn't parsed here. **Type inference only** — v1
 * ships no runtime row validation (RFC §4, §12).
 *
 *   const UserSchema = z.object({ id: z.string(), age: z.number() })
 *   const col = columnHelperFor(UserSchema)
 *   col.accessor("age", { cell: (info) => info.getValue() }) // getValue(): number
 */
export declare function columnHelperFor<S extends StandardSchemaV1>(_schema: S): import("@tanstack/react-table").ColumnHelper<InferEntity<S>>;
//# sourceMappingURL=data-table-schema.d.ts.map