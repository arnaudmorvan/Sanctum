import {
  Building2,
  Calendar,
  CircleHelp,
  FileText,
  GraduationCap,
  House,
  MapPin,
  Medal,
  MessagesSquare,
  Rocket,
  Send,
  Users,
} from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { RequestDetail } from "./pages/request-detail"
import { RequestsList } from "./pages/requests-list"

/** 42 — Time transformation request (staff back-office).
 *
 *  WHY IT IS NOT IN `42next-lms`. That flow is the LEARNER app: Home, My progression,
 *  Learn, Review, Exams, Agenda, Community, My profile. This screen is the other side of
 *  the same object — a staff member deciding on a learner's request — and its nav says
 *  "Learners", not "my". Folding it into the learner sidebar would have put two products
 *  in one chrome. Settled with the PO on 2026-09-08.
 *
 *  THE STAFF NAV IS NO LONGER A HYPOTHESIS (2026-09-09). The rows below used to be
 *  reasoned — no back-office sitemap exists in `context/product/` — and were marked as
 *  such. The mockup "42 — Time transformations (list) v2" (`22701:11048`) draws the real
 *  sidebar, so they are now READ, not guessed. Two labels are truncated in the frame
 *  itself ("CAMPUS ADMINISTRA...", "PROGRAM MANAGEME..."): expanded here to the only
 *  reading they have.
 *
 *  Every row except Time transformations is still targetless, because the mockup draws
 *  no screen behind it — a nav that lights up on a page that does not exist is worse than
 *  one that waits. Five of them (Campus administration, Apply, Program management,
 *  Learners, Paperwork) carry a chevron in the frame whose contents it does not draw;
 *  only Learners' two children are visible, so only those are written. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "Campus administration", icon: <Building2 size={16} /> },
  { label: "Apply", icon: <Send size={16} /> },
  { label: "Cohorts management", icon: <Users size={16} /> },
  { label: "Program management", icon: <Rocket size={16} /> },
  { label: "Project reviews", icon: <MessagesSquare size={16} /> },
  {
    label: "Learners",
    match: "learners/",
    icon: <GraduationCap size={16} />,
    children: [
      {
        label: "Time transformations",
        match: "learners/time-transformation",
        path: "learners/time-transformation",
      },
      { label: "Profile picture" },
    ],
  },
  { label: "Paperwork", icon: <FileText size={16} /> },
  { label: "Events", icon: <Calendar size={16} /> },
  { label: "TIG", icon: <Medal size={16} /> },
  { label: "Cluster map", icon: <MapPin size={16} /> },
  { label: "Support", icon: <CircleHelp size={16} /> },
]

/** THE FLOW — the queue, and the request you open from it.
 *
 *  The second entry was here first: the detail was built alone on 2026-09-08, and this
 *  file said the list "is the next entry to add here, not a screen this flow silently
 *  fakes". It is added today from the mockup, and the edge between the two is not a
 *  guess either: Figma carries an `ON_CLICK → NAVIGATE` from the list's table rows to the
 *  detail frame. Read, not asked. */
export const VIEWS: ProtoView[] = [
  {
    path: "learners/time-transformation",
    label: "Time transformations",
    render: () => <RequestsList />,
  },
  {
    path: "learners/time-transformation/:login",
    label: "Time transformation request",
    href: "#/learners/time-transformation/elmorel",
    render: ({ login }) => <RequestDetail login={login} />,
  },
]
