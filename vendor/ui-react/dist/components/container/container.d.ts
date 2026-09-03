import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { WithTestId } from "../../lib/test-id";
/**
 * Container — centered, max-width content wrapper.
 *
 * Pure React Server Component. The size scale tracks Tailwind's `screen-*`
 * breakpoints so a `size="lg"` container caps at the lg breakpoint width.
 * Horizontal padding scales modestly across the size axis.
 */
declare const containerVariants: (props?: ({
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | null | undefined;
    padding?: "sm" | "md" | "lg" | "none" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ContainerProps = HTMLArkProps<"div"> & VariantProps<typeof containerVariants> & WithTestId;
export declare const Container: ({ className, size, padding, testId, ...rest }: ContainerProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=container.d.ts.map