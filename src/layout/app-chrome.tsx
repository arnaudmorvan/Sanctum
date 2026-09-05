import type { ReactNode } from "react"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { AppShell } from "@42/ui-react/app-shell"
import { NavLink } from "@42/ui-react/nav-link"
import { Title } from "@42/ui-react/title"
import { hrefOf, type ProtoNavItem, type ProtoView } from "../proto-types"

/** Le CHROME de l'app : sidebar produit + fond ambiant, rendus par le SQUELETTE.
 *
 *  C'est la contrepartie de la règle des skills (« le chrome appartient au squelette,
 *  pas au parcours ») : tant que le squelette n'offrait qu'un cadre nu, chaque parcours
 *  réécrivait sa propre sidebar — deux copies divergentes dès le deuxième parcours.
 *  Ici : AppShell du kit (drawer automatique en mobile), NavLink pour les rangées,
 *  AmbientBackground pour la matière (halo + grain — `foundations-context`). Les écrans
 *  n'écrivent QUE la zone centrale.
 *
 *  S'active quand `views.tsx` exporte `NAV` (voir proto-types.ts). */
export const AppChrome = ({
  nav,
  views,
  currentPath,
  titre,
  children,
}: {
  nav: ProtoNavItem[]
  views: ProtoView[]
  currentPath?: string
  titre?: string
  children: ReactNode
}) => {
  const cible = (item: ProtoNavItem): string | undefined => {
    if (item.href) return item.href
    if (!item.path) return undefined
    const vue = views.find((v) => v.path === item.path)
    return vue ? hrefOf(vue) : `#/${item.path}`
  }
  return (
    <AppShell className="h-full bg-transparent">
      <AppShell.Sidebar size="xs">
        <AppShell.SidebarHeader>
          <Title order={1} size="xl">
            42
          </Title>
          {titre ? (
            <span className="truncate text-gray-dark-400 text-xs">{titre}</span>
          ) : null}
        </AppShell.SidebarHeader>
        <AppShell.SidebarBody className="flex flex-col gap-1">
          {nav.map((item) => {
            const href = cible(item)
            return (
              <NavLink
                key={item.label}
                label={item.label}
                icon={item.icon}
                current={item.path !== undefined && item.path === currentPath}
                {...(href ? { linkComponent: "a" as const, linkOptions: { href } } : {})}
              />
            )
          })}
        </AppShell.SidebarBody>
      </AppShell.Sidebar>
      <AppShell.Main>
        <AmbientBackground />
        <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
      </AppShell.Main>
    </AppShell>
  )
}
