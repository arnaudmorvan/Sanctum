import type { ReactNode } from "react"
import { ActionIcon } from "@42/ui-react/action-icon"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { AppShell } from "@42/ui-react/app-shell"
import { NavLink } from "@42/ui-react/nav-link"
import { Menu as MenuIcon } from "lucide-react"
import { hrefOf, type ProtoNavItem, type ProtoView } from "../proto-types"
import { TYPO } from "../typo"
import { Logo42 } from "./logo-42"

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
        {/* Le logomark, pas un « 42 » typographié : c'est la marque, et la frame
            la pose en haut de la colonne de nav (LogoContainer, 200×48). */}
        <AppShell.SidebarHeader className="gap-3 px-4">
          <Logo42 className="h-6 w-auto shrink-0" />
          {titre ? (
            <span className="truncate text-gray-dark-400 text-xs">{titre}</span>
          ) : null}
        </AppShell.SidebarHeader>
        <AppShell.SidebarBody className="flex flex-col gap-1">
          {nav.map((item) => {
            const href = cible(item)
            const current =
              (item.path !== undefined && item.path === currentPath) ||
              (item.match !== undefined && currentPath?.startsWith(item.match) === true)
            return (
              <NavLink
                key={item.label}
                label={item.label}
                icon={item.icon}
                current={current}
                // Kode Mono SemiBold capitales : c'est le seul endroit du chrome
                // où la frame pose le mono (12 nœuds relevés sur 22489:9756).
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
          {/* Sous le point de rupture, la sidebar devient un tiroir : sans ce bouton (nul
              partout ailleurs), la navigation du parcours n'existerait plus en mobile. */}
          <AppShell.SidebarTrigger asChild>
            <ActionIcon variant="subtle" size="md" className="mb-4" aria-label="Ouvrir la navigation">
              <MenuIcon size={18} />
            </ActionIcon>
          </AppShell.SidebarTrigger>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
