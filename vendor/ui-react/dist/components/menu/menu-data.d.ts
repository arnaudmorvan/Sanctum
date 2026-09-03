import type { ReactNode } from "react";
import type { Color } from "../../lib/colors";
import { type MenuRootProps } from "./menu";
/**
 * Data-driven Menu — the convenience wrapper over the composable parts, for the
 * common action-menu case. Mirrors how `Autocomplete` is built on `Combobox`:
 * pass a `data` array, get a fully wired dropdown; drop to `Menu.Root` + parts
 * for anything the array can't express (custom rows, checkbox / radio menus).
 *
 *   <Menu data={[
 *     { label: "Profile", startSection: <User />, onClick: goProfile },
 *     { type: "divider" },
 *     { group: "Danger", items: [
 *       { label: "Delete", color: "red", startSection: <Trash />, onClick: del },
 *     ]},
 *     { label: "More", items: [{ label: "Nested", onClick: nested }] }, // submenu
 *   ]}>
 *     <Button>Open</Button>
 *   </Menu>
 *
 * Generic over `const data`, so an item's explicit `value` narrows the optional
 * top-level `onSelect(value)`. Each item's own `onClick` fires on activation
 * (click *and* keyboard), and is the primary handler. A group's or submenu's own
 * nested `items` field is a different concept — that entry's own children, not
 * the top-level data source — so it keeps its name (same idea as `TreeSelect`'s
 * `children`).
 */
/** An actionable row. `value` is optional — provide it to get a typed top-level
 *  `onSelect`; otherwise a stable position-based value is generated. */
export type MenuActionItem = {
    label: ReactNode;
    value?: string;
    onClick?: () => void;
    startSection?: ReactNode;
    endSection?: ReactNode;
    color?: Color;
    disabled?: boolean;
    /** `data-testid` on the rendered item. Defaults to the entry's resolved
     *  `value` (explicit `value`, or the auto-generated positional fallback)
     *  when omitted. */
    testId?: string;
};
/** A row that opens a nested submenu (an entry with both `label` and `items`). */
export type MenuSubItem = {
    label: ReactNode;
    items: MenuItemsData;
    startSection?: ReactNode;
    color?: Color;
    /** `data-testid` on the submenu's trigger row. */
    testId?: string;
};
/** A visual separator (`{ type: "divider" }`). */
export type MenuDividerItem = {
    type: "divider";
};
/** A labelled section (an entry with both `group` and `items`). */
export type MenuGroupItem = {
    group: string;
    /** Decorative leader before the group label (e.g. `"// "`). Off by default. */
    prefix?: ReactNode;
    items: ReadonlyArray<string | MenuActionItem | MenuSubItem | MenuDividerItem>;
};
/** A single entry: a bare string (label === value), an action, a submenu, a
 *  divider, or a group. */
export type MenuEntry = string | MenuActionItem | MenuSubItem | MenuDividerItem | MenuGroupItem;
export type MenuItemsData = ReadonlyArray<MenuEntry>;
/**
 * Extract the value-string union from a `MenuItemsData` shape — bare strings and
 * action items with an explicit `value` contribute; groups and submenus recurse;
 * dividers and value-less actions contribute `never`. Checked structurally by
 * key (submenu / group carry `items`, so they must be matched before the action
 * branch, which any labelled object would otherwise satisfy).
 */
export type MenuValue<Data extends MenuItemsData> = ExtractValue<Data[number]>;
type ExtractValue<E> = E extends string ? E : E extends {
    type: "divider";
} ? never : E extends {
    group: string;
    items: infer I;
} ? I extends readonly unknown[] ? ExtractValue<I[number]> : never : E extends {
    items: infer I;
} ? I extends readonly unknown[] ? ExtractValue<I[number]> : never : E extends {
    value: infer V;
} ? V extends string ? V : never : never;
export type MenuProps<Data extends MenuItemsData = MenuItemsData> = Omit<MenuRootProps, "onSelect" | "children"> & {
    /** The menu entries. Pass `as const` (or inline literals) for a typed `onSelect`. */
    data: Data;
    /** The trigger element — rendered as the trigger via `asChild`. */
    children: ReactNode;
    /** Called with the selected item's `value` (typed to the data's value union). */
    onSelect?: (value: MenuValue<Data>) => void;
};
/**
 * The public `Menu` export — callable for the data-driven form, with the
 * composable parts attached (like `Tooltip`). `<Menu data={…}>` and
 * `<Menu.Root>…</Menu.Root>` both work from one import.
 */
export declare const Menu: (<const Data extends MenuItemsData>({ data, children, onSelect, ...root }: MenuProps<Data>) => import("react").JSX.Element) & {
    Root: ({ position, offset, withinPortal, container, onOpenChange, onClose, children, ...rest }: MenuRootProps) => import("react").JSX.Element;
    Trigger: import("react").ForwardRefExoticComponent<import("@ark-ui/react").MenuTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    ContextTrigger: import("react").ForwardRefExoticComponent<import("@ark-ui/react").MenuContextTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Content: ({ className, children, testId, ...rest }: import("./menu").MenuContentProps) => import("react").JSX.Element;
    Item: ({ value, startSection, endSection, color, onClick, className, children, testId, ...rest }: import("./menu").MenuItemProps) => import("react").JSX.Element;
    Label: ({ className, prefix, children, testId, ...rest }: import("./menu").MenuLabelProps) => import("react").JSX.Element;
    ItemGroup: import("react").ForwardRefExoticComponent<import("@ark-ui/react").MenuItemGroupProps & import("react").RefAttributes<HTMLDivElement>>;
    ItemGroupLabel: ({ className, prefix, children, testId, ...rest }: import("./menu").MenuItemGroupLabelProps) => import("react").JSX.Element;
    Divider: ({ className, testId, ...rest }: import("@ark-ui/react").MenuSeparatorProps & import("../../lib/test-id").WithTestId) => import("react").JSX.Element;
    Separator: ({ className, testId, ...rest }: import("@ark-ui/react").MenuSeparatorProps & import("../../lib/test-id").WithTestId) => import("react").JSX.Element;
    CheckboxItem: ({ startSection, color, className, children, testId, ...rest }: import("./menu").MenuCheckboxItemProps) => import("react").JSX.Element;
    RadioGroup: ({ onChange, ...rest }: import("./menu").MenuRadioGroupProps) => import("react").JSX.Element;
    RadioItem: ({ startSection, color, className, children, testId, ...rest }: import("./menu").MenuRadioItemProps) => import("react").JSX.Element;
    Sub: ({ offset, children, ...rest }: import("./menu").MenuSubProps) => import("react").JSX.Element;
    SubTrigger: ({ startSection, color, className, children, testId, ...rest }: import("./menu").MenuSubTriggerProps) => import("react").JSX.Element;
    SubContent: ({ className, children, testId, ...rest }: import("./menu").MenuContentProps) => import("react").JSX.Element;
    Context: (props: import("@ark-ui/react").MenuContextProps) => ReactNode;
};
export {};
//# sourceMappingURL=menu-data.d.ts.map