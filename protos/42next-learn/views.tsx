import {
  Calendar,
  ClipboardCheck,
  FileCheck,
  FolderCheck,
  GraduationCap,
  House,
  LayoutDashboard,
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
 *  Icônes : celles que la frame 22489:9756 porte réellement (relevé du 2026-09-05)
 *  — house, layout-dashboard, graduation-cap, calendar, folder-check. Les rangées de
 *  la maquette sont libellées « LOREM IPSUM », donc `Review`, `Exams` et `Community`
 *  gardent un choix raisonné, faute d'icône dédiée dans la frame. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "My progression", icon: <LayoutDashboard size={16} /> },
  { label: "Learn", path: "learn/program", match: "learn/", icon: <GraduationCap size={16} /> },
  { label: "Review", icon: <ClipboardCheck size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
  { label: "Agenda", icon: <Calendar size={16} /> },
  { label: "Community", icon: <Users size={16} /> },
  { label: "My activities", icon: <FolderCheck size={16} /> },
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
