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
import { Activity } from "./pages/activity"
import { Profile } from "./pages/profile"

/** Le CHROME est rendu par le squelette (migration NAV du 2026-09-05 : l'ancien
 *  components/sidebar.tsx est retiré). Mêmes entrées que l'ancienne sidebar :
 *  « Learn » cible l'écran d'activité (match sur activities/), « My activities »
 *  cible le profil (match sur profile/) — les autres sont des catégories sans lien.
 *  ⚠️ Icônes : choix lucide raisonnés, PAS relevés sur la frame Figma de la nav
 *  (22489:9757) — à confronter à la maquette à la prochaine passe Figma. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "My progression", icon: <ChartLine size={16} /> },
  { label: "Learn", path: "activities/:slug", match: "activities/", icon: <GraduationCap size={16} /> },
  { label: "Review", icon: <ClipboardCheck size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
  { label: "Agenda", icon: <Calendar size={16} /> },
  { label: "Community", icon: <Users size={16} /> },
  { label: "My activities", path: "profile/:login", match: "profile/", icon: <User size={16} /> },
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
