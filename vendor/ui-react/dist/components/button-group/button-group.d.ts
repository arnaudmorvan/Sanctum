import { type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { WithTestId } from "../../lib/test-id";
/**
 * ButtonGroup — joins a row (or column) of `Button` / `ActionIcon` siblings into
 * a single segmented control: the inner corners are flattened and adjacent
 * borders collapse to one hairline, so the children read as one unit (toolbars,
 * split actions, view switchers).
 *
 * Pure layout wrapper — a React Server Component like `Flex`. It deliberately
 * does NOT touch its children's props: give every child the same `size` (and
 * usually the same `variant` / `color`) so their edges align. `asChild` is
 * inherited from the `ark.div` factory.
 *
 * The join is done with arbitrary-variant selectors that target the children by
 * position *from the group itself*, rather than mutating each child's own
 * classes:
 *   - They carry higher specificity than the child's own `rounded-*`, so they
 *     win regardless of source order — and they sidestep the fact that plain
 *     `tailwind-merge` doesn't recognise the custom `rounded-button` /
 *     `rounded-action-icon` utilities (the overriding class never lands on the
 *     child, so there's nothing to (fail to) merge).
 *   - Only the inner corners are flattened; the outer corners keep whatever
 *     radius each child already uses, so retheming still flows through.
 *
 * Adjacent borders overlap by 1px (`-ms-px` / `-mt-px`) into a single hairline
 * for the bordered `outline` / `light` / `default` variants. The borderless
 * `filled` / `subtle` variants (which have `border-transparent`, so there's
 * nothing to collapse) instead get an adaptive divider on both shared inner
 * edges: a translucent `currentColor` line, targeted via each child's
 * `data-variant`. Because it follows the text color it reads as a soft light
 * seam on a `filled` fill and a faint neutral one on `subtle`, correct on every
 * palette and in dark mode. It lives on both edges — not one — so both
 * neighbours carry the shared seam and it stays symmetric regardless of which
 * child is on top. `isolate` + a per-child `z-10` lift the hovered / focused
 * child above its neighbours, so its border (all four sides) and focus ring paint
 * over the shared edges rather than being covered by the neighbour that owns them.
 *
 * `orientation="horizontal"` (default) flattens the inline edges — logical
 * `rounded-s` / `rounded-e` + `-ms`, so it flips correctly under RTL — while
 * `"vertical"` flattens the block edges.
 */
declare const buttonGroupVariants: (props?: ({
    orientation?: "horizontal" | "vertical" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ButtonGroupOrientation = NonNullable<VariantProps<typeof buttonGroupVariants>["orientation"]>;
export type ButtonGroupProps = HTMLArkProps<"div"> & VariantProps<typeof buttonGroupVariants> & WithTestId;
export declare const ButtonGroup: ({ className, orientation, testId, ...rest }: ButtonGroupProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=button-group.d.ts.map