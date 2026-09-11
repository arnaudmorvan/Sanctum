import { Menu as ArkMenu } from "@ark-ui/react/menu";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { Color } from "../../lib/colors";
import { type LogicalPosition } from "../../lib/placement";
import type { WithTestId } from "../../lib/test-id";
type MenuPlacement = NonNullable<NonNullable<ArkMenu.RootProps["positioning"]>["placement"]>;
/** `position` accepts Ark's physical placements plus the logical, RTL-aware
 *  horizontal sides `start` / `end` (resolved to `left` / `right` by direction). */
export type MenuPosition = LogicalPosition<MenuPlacement>;
export type MenuRootProps = Omit<ArkMenu.RootProps, "positioning" | "onOpenChange"> & {
    /** Dropdown placement relative to the trigger. Prefer the logical `start` / `end`
     *  sides (RTL-aware), or use any Ark placement (`bottom-start`, `top`, …).
     *  Defaults to `"bottom-start"`. */
    position?: MenuPosition;
    /** Gap in px between the trigger and the dropdown. */
    offset?: number;
    /** Render the dropdown in a Portal so it escapes clipping ancestors. Default `true`. */
    withinPortal?: boolean;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    /** Called when the menu opens or closes (flattened from Ark's detail object). */
    onOpenChange?: (open: boolean) => void;
    /** Fires on close (any source) — Escape, outside interaction, item selection, or a controlled `onOpenChange`. */
    onClose?: () => void;
};
declare const Root: ({ position, offset, withinPortal, container, onOpenChange, onClose, children, ...rest }: MenuRootProps) => import("react").JSX.Element;
export type MenuContentProps = ArkMenu.ContentProps & WithTestId;
declare const Content: ({ className, children, testId, ...rest }: MenuContentProps) => import("react").JSX.Element;
export type MenuItemProps = Omit<ArkMenu.ItemProps, "value" | "onClick" | "onSelect"> & WithTestId & {
    /** Unique value — used for type-ahead + the selection detail. Auto-generated
     *  when omitted (Mantine-style items need no explicit value). */
    value?: string;
    /** Content before the label (usually an icon). */
    startSection?: ReactNode;
    /** Content after the label, pushed to the inline-end. */
    endSection?: ReactNode;
    /** Palette for the row — colors the label + highlight tint (e.g. `"red"` for a
     *  destructive action). Resolved from `data-color` via the slot vars. */
    color?: Color;
    /** Fires when the item is selected — on click *and* keyboard activation
     *  (Enter / Space), not just a pointer click. Wraps Ark's `onSelect`. */
    onClick?: () => void;
};
declare const Item: ({ value, startSection, endSection, color, onClick, className, children, testId, ...rest }: MenuItemProps) => import("react").JSX.Element;
export type MenuLabelProps = Omit<ComponentPropsWithoutRef<"div">, "prefix"> & WithTestId & {
    /** Decorative leader before the label (e.g. `"// "`). Off by default; hidden
     *  from screen readers and the clipboard. */
    prefix?: ReactNode;
};
/** Standalone section heading (Mantine parity). For grouped items with proper
 *  ARIA wiring, prefer `Menu.ItemGroup` + `Menu.ItemGroupLabel`. */
declare const Label: ({ className, prefix, children, testId, ...rest }: MenuLabelProps) => import("react").JSX.Element;
export type MenuItemGroupLabelProps = Omit<ArkMenu.ItemGroupLabelProps, "prefix"> & WithTestId & {
    /** Decorative leader before the label (e.g. `"// "`). Off by default; hidden
     *  from screen readers and the clipboard. */
    prefix?: ReactNode;
};
declare const ItemGroupLabel: ({ className, prefix, children, testId, ...rest }: MenuItemGroupLabelProps) => import("react").JSX.Element;
declare const Divider: ({ className, testId, ...rest }: ArkMenu.SeparatorProps & WithTestId) => import("react").JSX.Element;
export type MenuCheckboxItemProps = ArkMenu.CheckboxItemProps & WithTestId & {
    startSection?: ReactNode;
    color?: Color;
};
declare const CheckboxItem: ({ startSection, color, className, children, testId, ...rest }: MenuCheckboxItemProps) => import("react").JSX.Element;
export type MenuRadioGroupProps = Omit<ArkMenu.RadioItemGroupProps, "onValueChange" | "onChange"> & {
    /** Called with the newly selected value (flattened from Ark's detail object). */
    onChange?: (value: string) => void;
};
declare const RadioGroup: ({ onChange, ...rest }: MenuRadioGroupProps) => import("react").JSX.Element;
export type MenuRadioItemProps = ArkMenu.RadioItemProps & WithTestId & {
    startSection?: ReactNode;
    color?: Color;
};
declare const RadioItem: ({ startSection, color, className, children, testId, ...rest }: MenuRadioItemProps) => import("react").JSX.Element;
export type MenuSubProps = Omit<ArkMenu.RootProps, "positioning"> & {
    /** Gap in px between the trigger row and the submenu. Ark manages submenu
     *  *placement* itself (RTL-aware `right-start` / `left-start`, flush to the
     *  parent), so only this main-axis gap is adjustable. Defaults to `10`. */
    offset?: number;
};
/** Submenu root — a nested Ark Menu whose triggering row is `Menu.SubTrigger`.
 *  Inherits the parent's portal settings via context (see `Menu.SubContent`).
 *
 *  Ark's menu machine hard-overrides a submenu's placement and `gutter` (to `0`),
 *  so a `gutter`-based offset is silently dropped. It leaves `offset` untouched,
 *  and Floating UI resolves the axes as `offset.mainAxis ?? gutter` (the gap) and
 *  `offset.crossAxis` (the top alignment) — so the whole `offset` object is the
 *  one path that survives the override. */
declare const Sub: ({ offset, children, ...rest }: MenuSubProps) => import("react").JSX.Element;
export type MenuSubTriggerProps = ArkMenu.TriggerItemProps & WithTestId & {
    startSection?: ReactNode;
    color?: Color;
};
declare const SubTrigger: ({ startSection, color, className, children, testId, ...rest }: MenuSubTriggerProps) => import("react").JSX.Element;
export { CheckboxItem, Content, Divider, Item, ItemGroupLabel, Label, RadioGroup, RadioItem, Root, Sub, SubTrigger, };
/** Ark parts re-exported unchanged (no styling needed). */
export declare const Trigger: import("react").ForwardRefExoticComponent<ArkMenu.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const ContextTrigger: import("react").ForwardRefExoticComponent<ArkMenu.ContextTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const ItemGroup: import("react").ForwardRefExoticComponent<ArkMenu.ItemGroupProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const Context: (props: ArkMenu.ContextProps) => ReactNode;
/** Alias for `Divider` (Ark's name for the same part). */
export declare const Separator: ({ className, testId, ...rest }: ArkMenu.SeparatorProps & WithTestId) => import("react").JSX.Element;
/** Submenu dropdown — identical surface + portalling to `Menu.Content`. */
export declare const SubContent: ({ className, children, testId, ...rest }: MenuContentProps) => import("react").JSX.Element;
//# sourceMappingURL=menu.d.ts.map