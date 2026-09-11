import { type HTMLArkProps } from "@ark-ui/react";
import { type ComponentPropsWithoutRef, type Ref } from "react";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
export type AppShellProps = HTMLArkProps<"div"> & WithTestId & {
    /** AppShell's own rendered width (px) below which Sidebar renders as an
     *  overlay `Drawer` instead of a grid column — measured against the
     *  container itself via `ResizeObserver`, not the viewport. @default 768 */
    breakpoint?: number;
    /** Lands on the grid root; also used internally to measure `breakpoint`
     *  against the container's own width. */
    ref?: Ref<HTMLDivElement>;
};
export type AppShellSidebarProps = HTMLArkProps<"aside"> & WithTestId & {
    /** Width when expanded, from the kit's Size scale. @default "md" */
    size?: Size;
};
export type AppShellSidebarHeaderProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export type AppShellSidebarBodyProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export type AppShellSidebarFooterProps = ComponentPropsWithoutRef<"div"> & WithTestId;
export type AppShellHeaderProps = HTMLArkProps<"header"> & WithTestId;
export type AppShellMainProps = HTMLArkProps<"main"> & WithTestId;
export type AppShellAsideProps = HTMLArkProps<"aside"> & WithTestId & {
    /** Width when visible, from the kit's Size scale. @default "md" */
    size?: Size;
};
export type AppShellSidebarTriggerProps = HTMLArkProps<"button"> & WithTestId;
export declare const AppShell: (({ breakpoint, className, style, children, ref, testId, ...rest }: AppShellProps) => import("react").JSX.Element) & {
    Sidebar: ({ size, className, children, testId, ...rest }: AppShellSidebarProps) => import("react").JSX.Element;
    SidebarHeader: ({ className, testId, ...rest }: AppShellSidebarHeaderProps) => import("react").JSX.Element;
    SidebarBody: ({ className, testId, ...rest }: AppShellSidebarBodyProps) => import("react").JSX.Element;
    SidebarFooter: ({ className, testId, ...rest }: AppShellSidebarFooterProps) => import("react").JSX.Element;
    SidebarTrigger: ({ onClick, testId, ...rest }: AppShellSidebarTriggerProps) => import("react").JSX.Element | null;
    Header: ({ className, testId, ...rest }: AppShellHeaderProps) => import("react").JSX.Element;
    Main: ({ className, testId, ...rest }: AppShellMainProps) => import("react").JSX.Element;
    Aside: ({ size, className, testId, ...rest }: AppShellAsideProps) => import("react").JSX.Element;
};
//# sourceMappingURL=app-shell.d.ts.map