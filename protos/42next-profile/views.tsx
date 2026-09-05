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
import { Activity } from "./pages/activity"
import { Profile } from "./pages/profile"

/** Le CHROME est rendu par le squelette (migration NAV du 2026-09-05 : l'ancien
 *  components/sidebar.tsx est retiré). Mêmes entrées que l'ancienne sidebar :
 *  « Learn » cible l'écran d'activité (match sur activities/), « My activities »
 *  cible le profil (match sur profile/) — les autres sont des catégories sans lien.
 *
 *  Icônes : celles que la frame 22489:9756 porte réellement (relevé du 2026-09-05)
 *  — house, layout-dashboard, graduation-cap, calendar, folder-check. Les rangées
 *  de la maquette sont libellées « LOREM IPSUM », donc l'appariement libellé→icône
 *  ne peut pas venir d'elle : `Review`, `Exams` et `Community` gardent un choix
 *  raisonné, faute d'icône dédiée dans la frame. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "My progression", icon: <LayoutDashboard size={16} /> },
  { label: "Learn", path: "activities/:slug", match: "activities/", icon: <GraduationCap size={16} /> },
  { label: "Review", icon: <ClipboardCheck size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
  { label: "Agenda", icon: <Calendar size={16} /> },
  { label: "Community", icon: <Users size={16} /> },
  { label: "My activities", path: "profile/:login", match: "profile/", icon: <FolderCheck size={16} /> },
]

export const VIEWS: ProtoView[] = [
  {
    path: "profile/:login",
    label: "Learner profile",
    href: "#/profile/aserrano",
    render: ({ login }) => <Profile login={login} />,
  },
  {
    path: "activities/:slug",
    label: "Activity",
    href: "#/activities/minishell",
    render: ({ slug }) => <Activity slug={slug} />,
  },
]
