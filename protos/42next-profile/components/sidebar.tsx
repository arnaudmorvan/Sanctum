import type { ReactNode } from "react"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { Button } from "@42/ui-react/button"
import { Divider } from "@42/ui-react/divider"
import { Title } from "@42/ui-react/title"

/** NavLink existe dans le 42 UI Kit V3 mais n'est PAS expose par @42/ui-react.
 *  Reconstruit ici a partir de Button + Divider. Libelles pris sur le sitemap
 *  as-built du LMS, pas sur les LOREM IPSUM de la maquette. */
const SECTIONS = [
  "Home",
  "My progression",
  "Learn",
  "Review",
  "Exams",
  "Agenda",
  "Community",
  "My activities",
]

export const Sidebar = ({ actif }: { actif?: string }) => (
  <nav className="flex flex-col gap-5 lg:sticky lg:top-6 lg:h-fit">
    <Title order={2} size="xl">42</Title>
    <Divider />
    <div className="flex flex-col items-start gap-1">
      {SECTIONS.map((s) => (
        <Button key={s} size="sm" variant={s === actif ? "light" : "subtle"}>
          {s}
        </Button>
      ))}
    </div>
  </nav>
)

/** Chaque ecran du parcours est pose sur le meme fond ambiant, puis divise
 *  en colonne de navigation + zone de contenu. */
export const Ecran = ({ actif, children }: { actif?: string; children: ReactNode }) => (
  <div className="relative">
    <AmbientBackground />
    <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <Sidebar actif={actif} />
      <div className="flex flex-col gap-10">{children}</div>
    </div>
  </div>
)
