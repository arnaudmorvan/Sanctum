import type { ReactNode } from "react"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { Divider } from "@42/ui-react/divider"
import { NavLink } from "@42/ui-react/nav-link"
import { Title } from "@42/ui-react/title"

/** Meme chrome que le parcours 42next-profile : NavLink du kit, sans icone
 *  (aucun asset ne transite par publish_proto). Une entree sans linkOptions est
 *  une rangee de categorie sans lien — pas de lien mort vers un ecran absent. */
const SECTIONS: { label: string; href?: string }[] = [
  { label: "Home" },
  { label: "My progression" },
  { label: "Learn", href: "#/learn/program" },
  { label: "Review" },
  { label: "Exams" },
  { label: "Agenda" },
  { label: "Community" },
  { label: "My activities" },
]

export const Sidebar = ({ actif }: { actif?: string }) => (
  <nav className="flex flex-col gap-5 lg:sticky lg:top-6 lg:h-fit">
    <Title order={2} size="xl">42</Title>
    <Divider />
    <div className="flex flex-col gap-1">
      {SECTIONS.map((s) => (
        <NavLink
          key={s.label}
          label={s.label}
          current={s.label === actif}
          {...(s.href ? { linkComponent: "a" as const, linkOptions: { href: s.href } } : {})}
        />
      ))}
    </div>
  </nav>
)

export const Ecran = ({ children }: { children: ReactNode }) => (
  <div className="relative">
    <AmbientBackground />
    <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <Sidebar actif="Learn" />
      <div className="flex flex-col gap-10">{children}</div>
    </div>
  </div>
)
