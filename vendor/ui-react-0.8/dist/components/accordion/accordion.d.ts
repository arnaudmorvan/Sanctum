import { Accordion as Ark } from "@ark-ui/react/accordion";
import { type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type CollapseClassNames } from "../collapse/collapse";
import { type TitleOrder } from "../title/title";
/**
 * Accordion — a stack of expandable sections on Ark UI's Accordion machine.
 * Each item is a heading (`<h2>`..`<h6>`, via `Title`) wrapping a trigger
 * button; clicking it reveals that item's panel. Two ways to use it:
 *
 *   // 1. Data-driven — the common case
 *   <Accordion
 *     variant="separated"
 *     data={[
 *       { value: "billing", label: "Billing", content: <Billing /> },
 *       { value: "shipping", label: "Shipping", content: <Shipping /> },
 *     ]}
 *   />
 *
 *   // 2. Compound — for anything the data array can't express
 *   <Accordion.Root defaultValue={["billing"]}>
 *     <Accordion.Item value="billing">
 *       <Accordion.ItemTrigger>Billing</Accordion.ItemTrigger>
 *       <Accordion.ItemContent><Billing /></Accordion.ItemContent>
 *     </Accordion.Item>
 *   </Accordion.Root>
 *
 * Content never animates via Ark's own JS-measured height (the same category
 * of runtime-measurement quirk this kit already worked around for `Slider`'s
 * `thumbSize`) — `ItemContent` renders through this kit's own zero-JS
 * `Collapse` primitive instead (a CSS-grid `0fr` -> `1fr` row track), merged
 * onto Ark's part via `asChild`. Ark's own `--height`/`--width` vars go
 * unused since `Collapse`'s CSS never references them.
 *
 * `variant` / `size` / `radius` / `chevronPosition` / `chevron` / `order` all
 * live on `Root` — there's no separate `List` part the way `Tabs` has one,
 * since the root itself *is* the list — and cascade to every `Item` /
 * `ItemTrigger` / `ItemContent` through context, so a caller sets them once
 * rather than repeating them per item.
 */
/** The container. `default` is a single bordered list with dividers between
 *  items (the hairline `bg-white/4` + `border-brand-900/20 dark:border-white/15`
 *  recipe, matching `Tabs`' own `default` tray); `separated` lays each item
 *  out as its own block with a visible gap between them — `radius` only
 *  applies to it, `default`'s corners are fixed to the container. */
declare const accordionRoot: (props?: ({
    variant?: "default" | "separated" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type AccordionVariant = NonNullable<VariantProps<typeof accordionRoot>["variant"]>;
/** Logical chevron position — `start` / `end`, not left/right, so it flips
 *  correctly under `dir="rtl"` (matching `Divider`'s `labelPosition`). */
export type AccordionChevronPosition = "start" | "end";
/** A heading can't itself be a button — `order={1}` is reserved for the page's
 *  own `<h1>`, so the shallowest an accordion trigger's heading goes is `<h2>`. */
export type AccordionOrder = Extract<TitleOrder, 2 | 3 | 4 | 5 | 6>;
export type AccordionRootProps = Omit<Ark.RootProps, "onValueChange"> & WithTestId & {
    /** Container + item treatment. `default` is a single bordered list with
     *  dividers; `separated` lays each item out as its own block. A different
     *  vocabulary than the button-family `filled`/`light`/`outline`/`subtle`
     *  — see the type's own doc. */
    variant?: AccordionVariant;
    /** Trigger + content sizing. */
    size?: Size;
    /** Corner rounding for `separated` item cards. Ignored by `default`. */
    radius?: Size;
    /** Where the chevron sits on each trigger. */
    chevronPosition?: AccordionChevronPosition;
    /** Custom chevron icon, replacing the default `ChevronIcon`. `null` hides
     *  it entirely — there's no separate flag to keep the icon but disable its
     *  open/close rotation. */
    chevron?: ReactNode | null;
    /** Semantic heading level wrapping each trigger. */
    order?: AccordionOrder;
    /** Fires with the next expanded values (flattened from Ark's `onValueChange`). */
    onChange?: (value: string[]) => void;
};
declare const Root: ({ variant, size, radius, chevronPosition, chevron, order, orientation, onChange, className, testId, ...rest }: AccordionRootProps) => import("react").JSX.Element;
export type AccordionItemProps = Ark.ItemProps & WithTestId;
declare const Item: ({ className, testId, ...rest }: AccordionItemProps) => import("react").JSX.Element;
export type AccordionItemIndicatorProps = Ark.ItemIndicatorProps & WithTestId;
declare const ItemIndicator: ({ className, testId, ...rest }: AccordionItemIndicatorProps) => import("react").JSX.Element;
export type AccordionItemTriggerProps = Ark.ItemTriggerProps & WithTestId & {
    /** Leading icon, rendered before the label. */
    icon?: ReactNode;
};
declare const ItemTrigger: ({ icon, children, className, testId, ...rest }: AccordionItemTriggerProps) => import("react").JSX.Element;
export type AccordionItemContentProps = Ark.ItemContentProps & WithTestId & {
    classNames?: CollapseClassNames;
};
/**
 * The panel. Bypasses Ark's own JS-measured height animation entirely —
 * `Ark.ItemContent` is merged (`asChild`) onto this kit's own `Collapse`
 * primitive, driven by the item's live `expanded` state off `Ark.ItemContext`.
 *
 * `hidden` is explicitly pinned to `false`: Ark's nested Collapsible machine
 * (every `Item` is one under the hood) drops it to `true` within a frame of
 * closing — it detects "no CSS `animation`" (only `Collapse`'s `transition`)
 * and immediately calls the exit "complete" — which would otherwise clip the
 * close animation to nothing via `display: none`. `Collapse`'s own zero-height
 * `overflow-clip` state is what actually hides the panel instead (the same
 * trade-off `NavLink` already makes for its nested items).
 *
 * The size-based padding lives on an *extra* inner `<div>` wrapping `children`
 * — not on `Collapse`'s own `classNames.content` slot — because that slot
 * *is* the CSS grid item `Collapse` collapses. A grid item's own padding
 * always occupies space regardless of `min-height: 0`, so padding placed
 * there stalls the `0fr` track a few pixels short of a true collapse (the
 * same pattern `NavLink` already uses for its nested-items padding).
 */
declare const ItemContent: ({ children, className, classNames, testId, ...rest }: AccordionItemContentProps) => import("react").JSX.Element;
export { Item, ItemContent, ItemIndicator, ItemTrigger, Root };
export declare const ItemContext: (props: Ark.ItemContextProps) => ReactNode;
export declare const Context: (props: Ark.ContextProps) => ReactNode;
//# sourceMappingURL=accordion.d.ts.map