import type { ReactNode } from "react"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { Divider } from "@42/ui-react/divider"
import { NavLink } from "@42/ui-react/nav-link"
import { Title } from "@42/ui-react/title"

/** CORRIGE le 2026-09-04. La version precedente reconstruisait la nav avec des
 *  Button, sur la foi d'un commentaire faux ("NavLink n'est pas expose par
 *  @42/ui-react"). Il l'est : import "@42/ui-react/nav-link", `label` requise,
 *  `current` porte l'etat de page courante, `linkOptions` la cible.
 *  NE PAS revenir a Button.
 *
 *  Pas d'icone de rangee : `icon` est un slot ReactNode, et aucun asset ne
 *  transite par publish_proto. La maquette Figma (22489:9757, instance NavLink,
 *  slot navItems) en porte une par entree — ecart assume, consigne au report.
 *
 *  Une entree sans `linkOptions` est une rangee de categorie sans lien propre :
 *  c'est le comportement documente, et ca evite des liens morts vers des ecrans
 *  qui n'existent pas dans ce parcours. */
const SECTIONS: { label: string; href?: string }[] = [
  { label: "Home" },
  { label: "My progression" },
  { label: "Learn", href: "#/activities/minishell" },
  { label: "Review" },
  { label: "Exams" },
  { label: "Agenda" },
  { label: "Community" },
  { label: "My activities", href: "#/profile/aserrano" },
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

/** Chaque ecran du parcours est pose sur le meme fond ambiant, puis divise
 *  en colonne de navigation + zone de contenu.
 *  Rythme repris de la frame : content pad 40, gap 40 entre colonnes. */
export const Ecran = ({ actif, children }: { actif?: string; children: ReactNode }) => (
  <div className="relative">
    <AmbientBackground />
    <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <Sidebar actif={actif} />
      <div className="flex flex-col gap-10">{children}</div>
    </div>
  </div>
)
