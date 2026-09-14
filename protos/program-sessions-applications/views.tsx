import { Building2, CalendarDays, ClipboardList, FileText, GraduationCap, Grid2x2, House, LifeBuoy, ListChecks, Rocket, Users } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { SessionApplicants } from "./pages/session-applicants"
import { SessionDetail } from "./pages/session-detail"
import { Sessions } from "./pages/sessions"

/** The staff navigation of the source screen. Rows without a target are the product's
 *  other sections: they say what exists around, with no dead link. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "Campus administration", icon: <Building2 size={16} /> },
  { label: "Program sessions applications", path: "sessions", icon: <ClipboardList size={16} /> },
  { label: "Applicants", icon: <Users size={16} /> },
  { label: "Project reviews", icon: <ListChecks size={16} /> },
  { label: "Learners", icon: <GraduationCap size={16} /> },
  { label: "Program management", icon: <Rocket size={16} /> },
  { label: "Paperwork", icon: <FileText size={16} /> },
  { label: "Events", icon: <CalendarDays size={16} /> },
  { label: "Cluster map", icon: <Grid2x2 size={16} /> },
  { label: "Support", icon: <LifeBuoy size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "sessions", label: "Program sessions applications", render: () => <Sessions /> },
  {
    path: "sessions/:id",
    label: "Onboarding sessions",
    href: "#/sessions/sess-apr-2026",
    render: ({ id }) => <SessionDetail id={id} />,
  },
  {
    path: "sessions/:id/applicants",
    label: "Applicants",
    href: "#/sessions/sess-apr-2026/applicants",
    render: ({ id }) => <SessionApplicants id={id} />,
  },
]
