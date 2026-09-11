import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Kbd — a keyboard-key / shortcut indicator (`<kbd>`).
 *
 * Pure React Server Component. It borrows Button's (variant × color) system so
 * a shortcut hint speaks the same accent language as the action it labels — but
 * unlike Button it is non-interactive: no focus ring, no hover treatment, just
 * a key cap.
 *
 * The shape axis is the exact set Button exposes (filled / light / outline /
 * subtle / default), wired through the same `--c-*` slot vars — `color` routes
 * via a `data-color` attribute resolved in `colors.css`, so the cva matrix
 * enumerates variants only, never (variant × color) pairs. The default
 * treatment is the `default` variant: a neutral, bordered key-cap surface that
 * reads as a physical key regardless of `color` (pairing `default` with a color
 * is a no-op, mirroring Button/Badge).
 *
 * Sizing keeps single-character keys square via a per-size `min-w` equal to the
 * height, while wider labels (`Enter`, `Esc`, `⌘N`) grow horizontally. Padding
 * is symmetric, so a key reads the same in RTL.
 *
 * `asChild` (from `HTMLArkProps`) renders the single child as the root with
 * Kbd's styling merged in — e.g. `<Kbd asChild><a href="…">⌘K</a></Kbd>`.
 */
declare const kbdVariants: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "subtle" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type KbdVariant = NonNullable<VariantProps<typeof kbdVariants>["variant"]>;
export type KbdSize = NonNullable<VariantProps<typeof kbdVariants>["size"]>;
export type KbdProps = HTMLArkProps<"kbd"> & VariantProps<typeof kbdVariants> & WithTestId & {
    /** Accent palette. Re-exported as `Color` from `@42/ui-react`. */
    color?: Color;
};
export declare const Kbd: ({ className, variant, size, color, testId, ...rest }: KbdProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=kbd.d.ts.map