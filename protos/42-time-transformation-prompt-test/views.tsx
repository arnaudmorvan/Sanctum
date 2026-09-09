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
import { PastRequests } from "./pages/past-requests"
import { RequestDetail } from "./pages/request-detail"

/** 42 — Time transformations, BUILT FROM A WRITTEN SPEC ONLY.
 *
 *  WHY THIS FLOW EXISTS NEXT TO `42-time-transformation-request`. That one was lifted from
 *  the mockups (`22701:11048`, `22705:11627`). This one was written from prose, with no
 *  Figma read at all — deliberately, to measure what a prompt produces against what a
 *  frame produces on the same product. Two sources, two flows, comparable side by side.
 *  It is NOT a duplicate to clean up: merging them would destroy the comparison.
 *
 *  The nav below is the spec's sidebar, verbatim. Every row except Time transformations is
 *  targetless: the spec names them but describes no screen behind them, and a nav that
 *  lights up on a page that does not exist is worse than one that waits. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "Campus administration", icon: <Building2 size={16} /> },
  { label: "Apply", icon: <Send size={16} /> },
  { label: "Cohorts management", icon: <Users size={16} /> },
  { label: "Program management", icon: <Rocket size={16} /> },
  { label: "Project reviews", icon: <MessagesSquare size={16} /> },
  {
    label: "Learners",
    match: "time-transformations",
    icon: <GraduationCap size={16} />,
    children: [
      { label: "Time transformations", path: "time-transformations", match: "time-transformations" },
      { label: "Profile picture" },
    ],
  },
  { label: "Paperwork", icon: <FileText size={16} /> },
  { label: "Events", icon: <Calendar size={16} /> },
  { label: "TIG", icon: <Medal size={16} /> },
  { label: "Cluster map", icon: <MapPin size={16} /> },
  { label: "Support", icon: <CircleHelp size={16} /> },
]

/** TWO ROUTES, NOT SIX SCREENS.
 *
 *  The spec describes six screens. Five of them are the SAME screen: the request detail,
 *  in three statuses (Denied / Approved), two modes (read / edit) and two types (Time off /
 *  Time shift). Those are React state, not routes — six entries here would be six URLs for
 *  one screen, and a navigation that lies. Screen 1 is the `Past requests` tab of the list. */
export const VIEWS: ProtoView[] = [
  { path: "time-transformations", label: "Time transformations", render: () => <PastRequests /> },
  {
    path: "time-transformations/:login",
    label: "Request detail",
    href: "#/time-transformations/fifauch",
    render: ({ login }) => <RequestDetail login={login} />,
  },
]
