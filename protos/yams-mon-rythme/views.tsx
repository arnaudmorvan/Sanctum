import { House, LayoutDashboard, Rocket, GraduationCap, Route as RouteIcon, ListChecks } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { MonRythme } from "./pages/mon-rythme"
import { Simulateur } from "./pages/simulateur"
import { ArretMaladie } from "./pages/arret-maladie"

/** THE CHROME. Reproduit la navigation produit de 42next telle que le mock la montre :
 *  Accueil / Apprendre / Reviews / Exams, puis la section "Ma progression" (dépliée,
 *  section courante) avec ses trois sous-lignes. Seules "Tableau de bord" (Mon rythme)
 *  et "Simulateur YAMS" ont un écran dans ce flow ; les autres lignes sont décoratives
 *  (product nav réelle, écrans hors scope) — pas de lien mort inventé, juste pas de path. */
export const NAV: ProtoNavItem[] = [
  { label: "Accueil", icon: <House size={16} /> },
  { label: "Apprendre", icon: <LayoutDashboard size={16} /> },
  { label: "Reviews", icon: <Rocket size={16} /> },
  { label: "Exams", icon: <GraduationCap size={16} /> },
  { label: "Ma progression", icon: <GraduationCap size={16} /> },
  { label: "Tableau de bord", path: "mon-rythme", icon: <ListChecks size={16} /> },
  { label: "Milestones", icon: <RouteIcon size={16} /> },
  { label: "Simulateur YAMS", path: "simulateur", icon: <RouteIcon size={16} /> },
]

/** THE FLOW.
 *  mon-rythme    — dashboard d'Amanda, modèle atelier du 16/09 (stock de jours, deux bornes
 *                  référence/max). Point d'entrée du flow, ouvre le simulateur et la modale
 *                  "Déclarer une absence".
 *  simulateur    — resté sur l'ancien modèle (fin projetée / plafond 24 mois) : les 3 autres
 *                  écrans de ce parcours n'ont pas encore été mis à jour après l'atelier du
 *                  16/09, voir figma-source.json et le rapport de génération.
 *  arret-maladie — l'état "en arrêt" du dashboard (V2), atteint en déclarant une absence pour
 *                  motif "Arrêt maladie" depuis mon-rythme. */
export const VIEWS: ProtoView[] = [
  { path: "mon-rythme", label: "Mon rythme", render: () => <MonRythme /> },
  { path: "simulateur", label: "Simulateur", render: () => <Simulateur /> },
  {
    path: "arret-maladie",
    label: "Arrêt maladie en cours",
    href: "#/arret-maladie",
    render: () => <ArretMaladie />,
  },
]
