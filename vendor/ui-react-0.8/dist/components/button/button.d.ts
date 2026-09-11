import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Button — interactive but stateless primitive.
 *
 * The new (variant × color) model splits visual treatment from accent palette:
 *   - `variant` picks the shape (filled / light / outline / subtle)
 *   - `color` picks the palette (brand / gray / neutral / red / orange / …)
 *
 * Color is delivered through CSS variables: the component writes a
 * `data-color="…"` attribute and the global rules in `colors.css` resolve
 * `--c-solid`, `--c-soft`, `--c-text` etc. for both light and dark mode. So
 * the cva matrix only enumerates variants, not (variant × color) pairs.
 * When `color` is omitted, no `data-color` attribute is rendered and the
 * slot vars cascade from `:root` — which mirrors `neutral` — so the
 * zero-config `<Button>` renders `filled` · `neutral`. Consumers retheme the
 * default for the whole app by overriding the slot vars at `:root`, no JS
 * required.
 *
 * `asChild` (inherited from `HTMLArkProps`) renders the single child element
 * with Button's styling merged in. Ark's factory uses `Children.only`, so
 * only one element can survive the swap — `startSlot`/`endSlot` (and the
 * `loading` spinner, which replaces `startSlot`) are folded into *that*
 * element's own children (see `withAsChildContent` below) rather than
 * rendered as siblings, so they keep showing up even when the child is a
 * link. Common case: `<Button asChild startSlot={<Icon />}><a ...>Go</a></Button>`.
 *
 * `loading` doesn't use `pointer-events-none` to block interaction — that
 * also blocks `:hover`, which would make `cursor-progress` unreachable by a
 * real mouse. Instead native `disabled` handles a real `<button>` (the
 * `disabled:pointer-events-none` rule is scoped off while loading via
 * `not-data-loading:`, since `resolvedDisabled` sets native `disabled` for
 * `loading` too and would otherwise reintroduce the same dead-cursor bug),
 * and an explicit `onClick` guard (`preventWhileLoading`) handles an
 * arbitrary `asChild` element, which `disabled` doesn't affect. The dimmed
 * `opacity-50` treatment is likewise keyed off `data-loading` (not just
 * `:disabled`) for the same reason — `:disabled` never matches a non-form
 * element like an `<a>`, even with a `disabled` attribute on it, so an
 * `asChild` link would otherwise stay at full opacity while loading.
 */
declare const buttonVariants: (props?: ({
    variant?: "light" | "filled" | "outline" | "subtle" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;
export type ButtonProps = Omit<HTMLArkProps<"button">, "color"> & VariantProps<typeof buttonVariants> & WithTestId & {
    /** Accent palette. Re-exported as `Color` from `@42/ui-react`. */
    color?: Color;
    /**
     * Render a spinner in place of (or before) the children and mark the
     * button as busy + non-interactive. Use for async submit handlers.
     */
    loading?: boolean;
    /**
     * Optional element rendered at the inline-start of the children (e.g. an
     * icon) — left in LTR, right in RTL. Hidden from assistive tech via
     * `aria-hidden`.
     */
    startSlot?: ReactNode;
    /**
     * Optional element rendered at the inline-end of the children — right in
     * LTR, left in RTL. `aria-hidden`.
     */
    endSlot?: ReactNode;
};
export declare const Button: ({ className, variant, size, color, loading, startSlot, endSlot, children, disabled, type, asChild, testId, onClick, ...rest }: ButtonProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=button.d.ts.map