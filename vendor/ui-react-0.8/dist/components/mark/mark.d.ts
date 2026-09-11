import type { ComponentPropsWithoutRef } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Mark — an inline `<mark>` highlighter. Pure React Server Component.
 *
 * `background` and `color` are fully independent — `background` only ever
 * changes the highlight, `color` only ever changes the text, neither leaks
 * into the other: `background` alone (no `color`) tints the highlight with
 * *neutral* ("gray") text, not text matching the highlight; `color` alone (no
 * `background`) renders as tinted text with no highlight at all —
 * `background` only defaults to `"yellow"` when it's unset, regardless of
 * `color`. This needs two DOM nodes rather than one: `--c-soft`/`--c-text`
 * are both defined together inside the same `[data-color="X"]` block in
 * `colors.css`, so a single `data-color` attribute can only ever scope one
 * color's worth of both vars at once. Letting background and text pick
 * *different* color names — and stay theme-aware, the whole reason
 * `--c-soft`/`--c-text` exist instead of a fixed shade — means they need two
 * independently-scoped `data-color` attributes. The outer `<mark>` scopes
 * `--c-soft` for the background; the inner `<span>` scopes its own `--c-text`
 * for the text, independent of the outer scope.
 *
 * The inner span's `text-(--c-text)` class is unconditional — never gated
 * behind an `if (color)` branch — so it always declares its own explicit
 * `color`, never inheriting one. That's what makes nesting a colored `<Mark>`
 * inside a colored `<Code>` (or any other colored ancestor) "just work": an
 * ancestor's `color` only reaches a descendant by inheritance, the
 * lowest-priority source of a property's value, so the inner span's own
 * declaration always wins, no `!important` or descendant-selector games
 * needed.
 *
 * No `asChild` (plain `ComponentPropsWithoutRef<"mark">`, not `HTMLArkProps`):
 * the inner span above already repurposes `children` as "the highlighted
 * content," which collides with `asChild`'s usual meaning (the one child to
 * render as root) — the same reasoning `Skeleton`'s wrap mode uses to skip it.
 */
export type MarkProps = ComponentPropsWithoutRef<"mark"> & WithTestId & {
    /**
     * Text color. Independent of `background` — never falls back to it.
     * @default "gray" (neutral)
     */
    color?: Color;
    /**
     * Background/highlight tint. Re-exported as `Color` from `@42/ui-react`.
     * @default "yellow"
     */
    background?: Color;
};
export declare const Mark: ({ className, color, background, children, testId, ...rest }: MarkProps) => import("react").JSX.Element;
//# sourceMappingURL=mark.d.ts.map