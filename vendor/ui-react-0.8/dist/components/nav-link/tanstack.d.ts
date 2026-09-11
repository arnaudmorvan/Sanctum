import type { RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { type NavLinkProps } from "./nav-link";
import { type NavigationItem, type NavigationProps } from "./navigation";
/**
 * TanStack Router–typed `NavLink`/`Navigation` — opt-in only, never imported
 * by `nav-link.tsx`/`navigation.tsx` themselves, so the core components stay
 * dependency-free for everyone else. Import from here instead of `./nav-link`
 * / `./navigation` when the app is on TanStack Router, to get every
 * `linkOptions` validated/autocompleted against the app's real route tree.
 *
 * Built on TanStack Router's own documented pattern for exactly this case
 * (`RegisteredRouter` + `ValidateLinkOptions`, see its "Type Utilities for
 * Generic Components" guide) — a generic public overload preserves full
 * per-call-site inference for callers, while the implementation delegates to
 * the untyped core component.
 *
 *   import { NavLink } from "@42/ui-react/nav-link/tanstack"
 *   import { Link } from "@tanstack/react-router"
 *
 *   <NavLink label="Post" linkComponent={Link}
 *     linkOptions={{ to: "/posts/$postId", params: { postId: "1" } }} />
 */
type TanStackNavLinkProps<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown> = Omit<NavLinkProps, "linkOptions" | "children"> & {
    linkOptions?: ValidateLinkOptions<TRouter, TOptions>;
    children?: ReactNode;
};
export declare function NavLink<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown>(props: TanStackNavLinkProps<TRouter, TOptions>): ReactNode;
type TanStackNavigationItem<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown> = Omit<NavigationItem, "linkOptions" | "items"> & {
    linkOptions?: ValidateLinkOptions<TRouter, TOptions>;
    items?: readonly TanStackNavigationItem<TRouter, TOptions>[];
};
type TanStackNavigationProps<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown> = Omit<NavigationProps, "data"> & {
    data: readonly TanStackNavigationItem<TRouter, TOptions>[];
};
export declare function Navigation<TRouter extends RegisteredRouter = RegisteredRouter, TOptions = unknown>(props: TanStackNavigationProps<TRouter, TOptions>): ReactNode;
export {};
//# sourceMappingURL=tanstack.d.ts.map