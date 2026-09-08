import { Building2, GraduationCap, LayoutDashboard, Settings, Users } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { RequestDetail } from "./pages/request-detail"

/** 42 — Time transformation request (staff back-office).
 *
 *  WHY IT IS NOT IN `42next-lms`. That flow is the LEARNER app: Home, My progression,
 *  Learn, Review, Exams, Agenda, Community, My profile. This screen is the other side of
 *  the same object — a staff member deciding on a learner's request — and its nav says
 *  "Learners", not "my". Folding it into the learner sidebar would have put two products
 *  in one chrome. Settled with the PO on 2026-09-08.
 *
 *  ⚠️ THE STAFF NAV IS A HYPOTHESIS, NOT A SURVEY. `context/product/` documents the LMS
 *  (learner side) only; no back-office sitemap exists there yet, and the rows below —
 *  Dashboard, Programs, Campus, Settings — were reasoned, not read off a frame. They are
 *  deliberately targetless (no dead link): only "Time transformation" navigates. Same
 *  status for their icons. To be confirmed against the real back-office nav. */
export const NAV: ProtoNavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  {
    label: "Learners",
    match: "learners/",
    icon: <Users size={16} />,
    children: [
      { label: "All learners" },
      {
        label: "Time transformation",
        match: "learners/time-transformation",
        href: "#/learners/time-transformation/elmorel",
      },
      { label: "Paperwork" },
    ],
  },
  { label: "Programs", icon: <GraduationCap size={16} /> },
  { label: "Campus", icon: <Building2 size={16} /> },
  { label: "Settings", icon: <Settings size={16} /> },
]

/** THE FLOW. One screen for now — the detail of a request. The list it drills down from
 *  is the next entry to add here, not a screen this flow silently fakes. */
export const VIEWS: ProtoView[] = [
  {
    path: "learners/time-transformation/:login",
    label: "Time transformation request",
    href: "#/learners/time-transformation/elmorel",
    render: ({ login }) => <RequestDetail login={login} />,
  },
]
