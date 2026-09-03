import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { WithTestId } from "../../lib/test-id";
/**
 * Grid — CSS-grid layout primitive.
 *
 * Pure React Server Component (no `"use client"`): renders to `<div>` by
 * default but defers to its single child when `asChild` is set (Ark UI's
 * native polymorphism).
 *
 * Variants are exposed as static class lookups so Tailwind v4's compiler
 * picks them up at scan time — no dynamic class concatenation.
 */
declare const gridVariants: (props?: ({
    cols?: 12 | 1 | 3 | 2 | 4 | 6 | null | undefined;
    gap?: "xs" | "sm" | "md" | "lg" | "xl" | "none" | "xxs" | "xxl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type GridProps = HTMLArkProps<"div"> & VariantProps<typeof gridVariants> & WithTestId;
export declare const Grid: ({ className, cols, gap, testId, ...rest }: GridProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=grid.d.ts.map