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

  const isCurrent = (item: ProtoNavItem): boolean =>
    (item.path !== undefined && item.path === currentPath) ||
    (item.match !== undefined && currentPath?.startsWith(item.match) === true)

  /** A section is open when it holds the current screen. `defaultOpen` is uncontrolled, so
   *  the open-ness is folded into the `key`: entering a section remounts it open, leaving
   *  it remounts it closed, and a manual collapse survives as long as you stay inside —
   *  which is the behaviour the HTML prototype had (its tree started open and remembered
   *  what you folded). */
  const renderItem = (item: ProtoNavItem, depth: number) => {
    const href = targetOf(item)
    const kids = item.children
    const holdsCurrent = kids?.some((k) => isCurrent(k)) === true
    // A parent that holds the current child is not itself lit: the deepest row wins,
    // otherwise a section and its page both read as current.
    const current = holdsCurrent ? false : isCurrent(item)
    return (
      <NavLink
        key={`${item.label}-${holdsCurrent}`}
        label={item.label}
        icon={item.icon}
        current={current}
        {...(kids ? { defaultOpen: holdsCurrent } : {})}
        // Kode Mono SemiBold uppercase: this is the only place in the chrome where
        // the frame uses mono (12 nodes observed on 22489:9756). Sub-rows stay in Lato —
        // the frame's mono is the register of the top-level nav, not of everything in it.
        classNames={{ row: depth === 0 ? TYPO.nav : undefined }}
        {...(href ? { linkComponent: "a" as const, linkOptions: { href } } : {})}
      >
        {kids?.map((kid) => renderItem(kid, depth + 1))}
      </NavLink>
    )
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
          {nav.map((item) => renderItem(item, 0))}
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
