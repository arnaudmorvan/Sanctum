import { GraduationCap, House, LayoutDashboard, Rocket } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { QuestMap } from "./pages/quest-map"

/** Le CHROME est rendu par le squelette. Libellés ET icônes RELEVÉS sur la frame
 *  22505:9532 : Home/house, MODULES/layout-dashboard, RUSHES/rocket, EXAMS/graduation-cap.
 *
 *  ⚠️ La frame porte une cinquième entrée, « Menu Open », dépliée sur sept enfants tous
 *  intitulés « Lorem Ipsum » : c'est une DÉMO de l'état ouvert du composant, pas du
 *  contenu. Sept liens morts vers des écrans inexistants ne sont pas un parcours
 *  cliquable — l'entrée n'est donc pas reprise, et l'écart est consigné au report.
 *  (`NavLink` sait s'auto-imbriquer via ses enfants, le jour où ces libellés existent.) */
export const NAV: ProtoNavItem[] = [
  { label: "Home", path: "home", icon: <House size={16} /> },
  { label: "Modules", icon: <LayoutDashboard size={16} /> },
  { label: "Rushes", icon: <Rocket size={16} /> },
  { label: "Exams", icon: <GraduationCap size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "home", label: "Quest map", render: () => <QuestMap /> },
]
