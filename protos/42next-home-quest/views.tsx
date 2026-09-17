import { Calendar, ClipboardCheck, FileCheck, FolderCheck, GraduationCap, House, LayoutDashboard, Users } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { Home } from "./pages/home"
import { ModuleDetail } from "./pages/module"

/** 42next — Home (quest).
 *
 *  PROVENANCE. This flow was rebuilt from a throwaway artifact (skill
 *  artifact-sketch-screen, 2026-09-17) — an HTML page, no kit, components redrawn in
 *  CSS. The artifact is NOT the source: it is replaced by this flow, it does not get
 *  promoted. What it settled and what is kept here: the next quest as the screen's
 *  entry point, the milestone path in the centre, the learner rail led by the next
 *  agenda item.
 *
 *  THE CHROME is the skeleton's (NAV below). The artifact had no sidebar at all — the
 *  artifact skill forbids redrawing it — so the screen arrives here with its side
 *  navigation for the first time, and review:layout passes in full.
 *
 *  NAV reproduces the PRODUCT's navigation (context/product/42next-lms-sitemap-as-built.md,
 *  8 sections), not this flow's two screens: rows with no `path` are categories the
 *  skeleton renders non-clickable. Icons are a REASONED choice — no frame was surveyed
 *  for this flow. Declared as a gap in the report, not passed off as a lift. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", path: "home", icon: <House size={16} /> },
  { label: "My progression", icon: <LayoutDashboard size={16} /> },
  { label: "Learn", path: "modules/:slug", match: "modules/", icon: <GraduationCap size={16} /> },
  { label: "Review", icon: <ClipboardCheck size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
  { label: "Agenda", icon: <Calendar size={16} /> },
  { label: "Community", icon: <Users size={16} /> },
  { label: "My activities", icon: <FolderCheck size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "home", label: "Home", render: () => <Home /> },
  /* The home's one outbound affordance — « Open module » on the next-quest card. It
     ships with the screen so the primary action leads somewhere. */
  {
    path: "modules/:slug",
    label: "Module detail",
    href: "#/modules/web-server-from-scratch",
    render: ({ slug }) => <ModuleDetail slug={slug} />,
  },
]
