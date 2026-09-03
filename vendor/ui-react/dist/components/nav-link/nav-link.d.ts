import type { ElementType, ReactNode } from "react";
export type NavLinkClassNames = {
    /** The link/button row itself. */
    row?: string;
    /** The indented container holding nested `<NavLink>` children. */
    items?: string;
};
export type NavLinkProps<TOptions = unknown> = {
    label: ReactNode;
    /** Leading icon slot. */
    icon?: ReactNode;
    /** Trailing generic slot (e.g. a count badge). */
    suffix?: ReactNode;
    /** Marks this as the active/current page. */
    current?: boolean;
    disabled?: boolean;
    /** Whether nested `children` are revealed. Uncontrolled by default. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** The router's own link options — e.g. `{ href: "/x" }` for a plain `<a>`,
     *  or `{ to: "/x", params: {...} }` for TanStack Router. Omit for a pure
     *  category/toggle row with no link of its own. */
    linkOptions?: TOptions;
    /** Overrides the `<LinkComponentProvider>` for this row only. */
    linkComponent?: ElementType;
    classNames?: NavLinkClassNames;
    className?: string;
    /** Nested `<NavLink>` elements, revealed when `open`. */
    children?: ReactNode;
};
/**
 * `NavLink<TOptions>` — generic so a router's own type-safety utility (e.g.
 * TanStack Router's `ValidateLinkOptions`) can validate `linkOptions` when
 * explicitly parameterized. The implementation itself stays untyped/loose
 * (the generic can't be forwarded through the JSX body); see
 * TanStack Router's own documented pattern for this exact split.
 */
export declare function NavLink<TOptions = unknown>(props: NavLinkProps<TOptions>): ReactNode;
//# sourceMappingURL=nav-link.d.ts.map