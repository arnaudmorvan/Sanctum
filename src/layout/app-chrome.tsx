import type { ReactNode } from "react"
import { ActionIcon } from "@42/ui-react/action-icon"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { AppShell } from "@42/ui-react/app-shell"
import { NavLink } from "@42/ui-react/nav-link"
import { Menu as MenuIcon } from "lucide-react"
import { hrefOf, type ProtoNavItem, type ProtoView } from "../proto-types"
import { TYPO } from "../typo"
import { Logo42 } from "./logo-42"

/** The app CHROME: product sidebar + ambient background, rendered by the SKELETON.
 *
 *  This is the counterpart of the skills rule ("the chrome belongs to the skeleton, not to
 *  the flow"): as long as the skeleton only offered a bare frame, every flow rewrote its
 *  own sidebar — two diverging copies as soon as there was a second flow. Here: the kit's
 *  AppShell (automatic drawer on mobile), NavLink for the rows, AmbientBackground for the
 *  material (halo + grain — `foundations-context`). The screens write ONLY the central area.
 *
 *  Activated when `views.tsx` exports `NAV` (see proto-types.ts). */
export const AppChrome = ({
  nav,
  views,
  currentPath,
  title,
  children,
}: {
  nav: ProtoNavItem[]
  views: ProtoView[]
  currentPath?: string
  title?: string
  children: ReactNode
}) => {
  const targetOf = (item: ProtoNavItem): string | undefined => {
    if (item.href) return item.href
    if (!item.path) return undefined
    const view = views.find((v) => v.path === item.path)
    return view ? hrefOf(view) : `#/${item.path}`
  }
  return (
    <AppShell className="h-full bg-transparent">
      <AppShell.Sidebar size="xs">
        {/* The logomark, not a typeset "42": this is the brand, and the frame puts it at
            the top of the nav column (LogoContainer, 200×48). */}
        <AppShell.SidebarHeader className="gap-3 px-4">
          <Logo42 className="h-6 w-auto shrink-0" />
          {title ? (
            <span className="truncate text-gray-dark-400 text-xs">{title}</span>
          ) : null}
        </AppShell.SidebarHeader>
        <AppShell.SidebarBody className="flex flex-col gap-1">
          {nav.map((item) => {
            const href = targetOf(item)
            const current =
              (item.path !== undefined && item.path === currentPath) ||
              (item.match !== undefined && currentPath?.startsWith(item.match) === true)
            return (
              <NavLink
                key={item.label}
                label={item.label}
                icon={item.icon}
                current={current}
                // Kode Mono SemiBold uppercase: this is the only place in the chrome where
                // the frame uses mono (12 nodes observed on 22489:9756).
                classNames={{ row: TYPO.nav }}
                {...(href ? { linkComponent: "a" as const, linkOptions: { href } } : {})}
              />
            )
          })}
        </AppShell.SidebarBody>
      </AppShell.Sidebar>
      <AppShell.Main>
        <AmbientBackground />
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          {/* Below the breakpoint the sidebar becomes a drawer: without this button (a
              no-op everywhere else), the flow's navigation would not exist on mobile. */}
          <AppShell.SidebarTrigger asChild>
            <ActionIcon variant="subtle" size="md" className="mb-4" aria-label="Open navigation">
              <MenuIcon size={18} />
            </ActionIcon>
          </AppShell.SidebarTrigger>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
