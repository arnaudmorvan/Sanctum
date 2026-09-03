import { type HTMLArkProps } from "@ark-ui/react";
import type { ElementType, ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
/** A framework's own link component (e.g. Next.js's `Link`), substituted for
 *  a plain `<a>` so navigation stays client-side. Must accept `href` —
 *  routers whose Link takes `to` instead (React Router) need a two-line
 *  local wrapper renaming the prop before it's passed here. */
export type BreadcrumbLinkComponent = ElementType;
export type BreadcrumbRootProps = HTMLArkProps<"nav"> & WithTestId & {
    /** Rendered between crumbs, decorative (`aria-hidden`). @default "/" */
    separator?: ReactNode;
    /** Default `linkComponent` for every `Breadcrumb.Item`/`Breadcrumb.Home`
     *  child that doesn't set its own. */
    linkComponent?: BreadcrumbLinkComponent;
    /** Styles the inner `<ol>` (the bordered pill); `className` targets the
     *  outer `<nav>`. */
    classNames?: {
        list?: string;
    };
};
export type BreadcrumbItemProps = HTMLArkProps<"a"> & WithTestId & {
    /** Marks this as the current/last crumb: non-interactive, muted,
     *  `aria-current="page"`, no href/anchor. Figma's `state="Active"`. */
    current?: boolean;
    /** Overrides the `linkComponent` inherited from `Breadcrumb.Root`. */
    linkComponent?: BreadcrumbLinkComponent;
};
export type BreadcrumbHomeProps = HTMLArkProps<"a"> & WithTestId & {
    /** Overrides the `linkComponent` inherited from `Breadcrumb.Root`. */
    linkComponent?: BreadcrumbLinkComponent;
};
export type BreadcrumbDataItem = {
    label: ReactNode;
    href?: string;
    /** Explicit override; if no entry sets this, the last entry defaults to current. */
    current?: boolean;
    linkComponent?: BreadcrumbLinkComponent;
    /** `data-testid` on the rendered crumb. Defaults to `href` when set, else a
     *  stable positional fallback (`` `breadcrumb-item-${i}` ``). */
    testId?: string;
};
export type BreadcrumbProps = Omit<BreadcrumbRootProps, "children"> & {
    /** The crumbs to render, in order. */
    data: readonly BreadcrumbDataItem[];
    /** Renders a leading icon-only `Breadcrumb.Home`. `true` uses the default
     *  house icon with no link; pass an object (with `href`) to link it. */
    withHome?: boolean | (BreadcrumbHomeProps & {
        href: string;
    });
};
export declare const Breadcrumb: (({ data, withHome, ...rootProps }: BreadcrumbProps) => import("react").JSX.Element) & {
    Root: ({ className, classNames, separator, linkComponent, children, testId, ...rest }: BreadcrumbRootProps) => import("react").JSX.Element;
    Home: ({ href, linkComponent: LinkComponent, asChild, className, children, "aria-label": ariaLabel, testId, ...rest }: BreadcrumbHomeProps) => import("react").JSX.Element;
    Item: ({ href, current, linkComponent: LinkComponent, asChild, className, children, testId, ...rest }: BreadcrumbItemProps) => import("react").JSX.Element;
};
//# sourceMappingURL=breadcrumb.d.ts.map