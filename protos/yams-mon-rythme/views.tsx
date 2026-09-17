import { House, LayoutDashboard, Rocket, GraduationCap, Route as RouteIcon, ListChecks, CalendarRange } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { MonRythme } from "./pages/mon-rythme"
import { Simulateur } from "./pages/simulateur"
import { ArretMaladie } from "./pages/arret-maladie"
import { MyProgram } from "./pages/my-program"

/** THE CHROME. Reproduit la navigation produit de 42next telle que le mock la montre :
 *  Accueil / Apprendre / Reviews / Exams, puis la section "Ma progression" (dépliée,
 *  section courante) avec ses sous-lignes. Seules les lignes qui ont un écran dans ce
 *  flow portent un `path` ; les autres sont la nav réelle du produit, sans lien mort. */
export const NAV: ProtoNavItem[] = [
  { label: "Accueil", icon: <House size={16} /> },
  { label: "Apprendre", icon: <LayoutDashboard size={16} /> },
  { label: "Reviews", icon: <Rocket size={16} /> },
  { label: "Exams", icon: <GraduationCap size={16} /> },
  { label: "Ma progression", icon: <GraduationCap size={16} /> },
  { label: "Tableau de bord", path: "mon-rythme", icon: <ListChecks size={16} /> },
  { label: "My program", path: "my-program", icon: <CalendarRange size={16} /> },
  { label: "Milestones", icon: <RouteIcon size={16} /> },
  { label: "Simulateur YAMS", path: "simulateur", icon: <RouteIcon size={16} /> },
]

/** THE FLOW.
 *  mon-rythme    — dashboard d'Amanda, modèle atelier du 16/09 (stock de jours, deux bornes
 *                  référence/max). Ouvre le simulateur et la modale "Déclarer une absence".
 *  my-program    — LE PLUS RÉCENT, et celui qui fait foi sur le modèle : trois pistes sur un
 *                  même axe en jours calendaires (objectif / référence / réel puis projeté),
 *                  frise pilotable, congés tracés à la main. Porté depuis l'exploration HTML
 *                  du 17/09 ; en anglais, vocabulaire du glossaire appliqué.
 *  simulateur    — resté sur l'ancien modèle (fin projetée / plafond 24 mois).
 *  arret-maladie — l'état "en arrêt" du dashboard (V2). */
export const VIEWS: ProtoView[] = [
  { path: "mon-rythme", label: "Mon rythme", render: () => <MonRythme /> },
  { path: "my-program", label: "My program", render: () => <MyProgram /> },
  { path: "simulateur", label: "Simulateur", render: () => <Simulateur /> },
  {
    path: "arret-maladie",
    label: "Arrêt maladie en cours",
    href: "#/arret-maladie",
    render: () => <ArretMaladie />,
  },
]
