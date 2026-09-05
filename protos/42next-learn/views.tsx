import {
  Calendar,
  ChartLine,
  ClipboardCheck,
  FileCheck,
  GraduationCap,
  House,
  User,
  Users,
} from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { Program } from "./pages/program"
import { Module } from "./pages/module"
import { Project } from "./pages/project"

/** Le CHROME est rendu par le squelette (migration NAV du 2026-09-05 : l'ancien
 *  components/sidebar.tsx est retiré). La nav reproduit l'architecture produit 42next ;
 *  les rangées sans cible sont des catégories sans lien mort — comme avant.
 *  `match: "learn/"` garde « Learn » courant sur module et project, ce que faisait
 *  l'ancien Ecran avec son actif="Learn" figé.
 *  ⚠️ Icônes : choix lucide raisonnés, PAS relevés sur la frame Figma de la nav
 *  (22489:9757) — à confronter à la maquette à la prochaine passe Figma. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "My progression", icon: <ChartLine size={16} /> },
  { label: "Learn", path: "learn/program", match: "learn/", icon: <GraduationCap size={16} /> },
  { label: "Review", icon: <ClipboardCheck size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
  { label: "Agenda", icon: <Calendar size={16} /> },
  { label: "Community", icon: <Users size={16} /> },
  { label: "My activities", icon: <User size={16} /> },
]

export const VIEWS: ProtoView[] = [
  {
    path: "learn/program",
    label: "My program",
    href: "#/learn/program",
    render: () => <Program />,
  },
  {
    path: "learn/module/:slug",
    label: "Module",
    href: "#/learn/module/systems-and-networks-administration",
    render: ({ slug }) => <Module slug={slug} />,
  },
  {
    path: "learn/project/:slug",
    label: "Project",
    href: "#/learn/project/born2beroot",
    render: ({ slug }) => <Project slug={slug} />,
  },
]
