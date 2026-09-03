import type { ElementType, ReactNode } from "react";
/**
 * `Navigation` — the `data`-driven convenience wrapper over `NavLink` (same
 * relationship as `menu-data.tsx` to `menu.tsx`): pass a `data` array, get a
 * fully wired, arbitrarily-nested nav tree.
 *
 *   <Navigation
 *     data={[
 *       { label: "Dashboard", icon: <Home />, linkOptions: { href: "/dashboard" } },
 *       { label: "Settings", icon: <Settings />, items: [
 *         { label: "Profile", linkOptions: { href: "/settings/profile" } },
 *         { label: "Security", linkOptions: { href: "/settings/security" } },
 *       ]},
 *     ]}
 *   />
 *
 * Generic over the same `TOptions` as `NavLink` — parameterize it (e.g. with
 * `TanStackLinkOptions` from `nav-link/tanstack`) to get a router's own
 * type-safety utilities validating every entry's `linkOptions`.
 */
export type NavigationItem<TOptions = unknown> = {
    label: ReactNode;
    icon?: ReactNode;
    suffix?: ReactNode;
    current?: boolean;
    disabled?: boolean;
    defaultOpen?: boolean;
    linkOptions?: TOptions;
    /** Nested entries — an item with `items` renders its children indented,
     *  revealed on expand/collapse. Recursive: nests to any depth. */
    items?: readonly NavigationItem<TOptions>[];
};
export type NavigationProps<TOptions = unknown> = {
    /** The nav entries, in order. */
    data: readonly NavigationItem<TOptions>[];
    /** Overrides the app-wide `<LinkComponentProvider>` for every generated row. */
    linkComponent?: ElementType;
};
/** Generic for the same reason as `NavLink` — see its doc comment. */
export declare function Navigation<TOptions = unknown>(props: NavigationProps<TOptions>): ReactNode;
//# sourceMappingURL=navigation.d.ts.map