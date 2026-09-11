import { type HTMLArkProps } from "@ark-ui/react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
/**
 * Code — inline `<code>`, no syntax highlighting. Pure React Server
 * Component. No font-size utility — inline code inherits the surrounding
 * prose size (Text/Title/body copy), matching native semantics.
 *
 * `color` tints the text only — the neutral background/border pill never
 * changes, regardless of color: `data-color:text-(--c-text)` (specificity
 * 0,2,0) beats the plain + `dark:` neutral text classes (0,1,0) regardless of
 * source order, same trick Badge's `light` variant uses, applied to text
 * only.
 *
 * Nesting a `<Mark>` (or `Code.Mark`) inside `Code` needs no special-case
 * code here — Mark always declares its own explicit text color, which wins
 * over any inherited color from `Code` (see `Mark`'s own doc comment).
 */
export type CodeProps = HTMLArkProps<"code"> & WithTestId & {
    /** Tints the text only — background/border stay neutral regardless of color. */
    color?: Color;
};
declare function CodeComponent({ className, color, testId, ...rest }: CodeProps): import("react").JSX.Element;
/**
 * `Code.Mark` is `Mark` itself — attached so marking a token inside a code
 * snippet reads as one discoverable compound API (`<Code.Mark>`), without
 * losing `Mark`'s standalone use in ordinary prose (still independently
 * exported at `@42/ui-react/mark`). Pure convenience attachment, not a
 * second implementation — mirrors how `Alert` attaches `Notification`'s
 * parts via `Object.assign`.
 */
export declare const Code: typeof CodeComponent & {
    Mark: ({ className, color, background, children, testId, ...rest }: import("../mark").MarkProps) => import("react").JSX.Element;
};
export {};
//# sourceMappingURL=code.d.ts.map