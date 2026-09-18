import {
  Calendar,
  ClipboardCheck,
  FileCheck,
  GraduationCap,
  House,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { Home } from "./pages/home"
import { Holygraph, Module, Program } from "./pages/learn"
import { Milestones, Simulator, Yams } from "./pages/progression"

/** 42next — the learner app, ported from the artifact of 2026-09-17.
 *
 *  WHERE THIS COMES FROM. One self-contained HTML artifact: 1.5 MB, 12 667 lines,
 *  35 routes in a single `P` registry. It is the successor of the eight HTML files
 *  `42next-lms` was folded out of on 2026-09-07, and it is no longer the same screen
 *  set: the home now leads with the forms that are OWED (post-review feedback, the
 *  social vote) and keeps the suggestions in a panel of their own, the module list
 *  carries a status rail, and the version policy of a module or a project became a
 *  first-class object.
 *
 *  WHY A NEW SLUG rather than a republication of `42next-lms`: the designer asked for
 *  the two to stay openable side by side. `42next-lms` keeps the 2026-09-09 state.
 *
 *  BUILT IN STAGES — and that is a property of the format, not a shortcut. 35 screens
 *  do not fit in one emission; each commit lands a section, compiles on its own, and
 *  extends `VIEWS`. A NAV row WITHOUT a `path` is a section whose screens have not
 *  arrived yet: the product navigation is stated in full from the first commit, and no
 *  row leads nowhere. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", path: "dashboard", icon: <House size={16} /> },
  {
    label: "My progression",
    match: "progression/",
    icon: <LayoutDashboard size={16} />,
    children: [
      { label: "YAMS dashboard", path: "progression/yams" },
      { label: "Milestones", path: "progression/milestones" },
      { label: "YAMS simulator", path: "progression/simulator" },
    ],
  },
  {
    label: "Learn",
    match: "learn/",
    icon: <GraduationCap size={16} />,
    children: [
      { label: "My program", path: "learn/program", match: "learn/module" },
      { label: "Holygraph", path: "learn/holygraph" },
    ],
  },
  {
    label: "Review",
    icon: <ClipboardCheck size={16} />,
    children: [
      { label: "Overview" },
      { label: "Received" },
      { label: "Given" },
      { label: "My availability" },
    ],
  },
  { label: "Exams", icon: <FileCheck size={16} /> },
  {
    label: "Agenda",
    icon: <Calendar size={16} />,
    children: [{ label: "Calendar" }, { label: "Registrations" }],
  },
  {
    label: "Community",
    icon: <Users size={16} />,
    children: [
      { label: "Coalition" },
      { label: "Friends" },
      { label: "Clubs" },
      { label: "Announcements" },
      { label: "Changelog" },
      { label: "Cluster map" },
    ],
  },
  {
    label: "My profile",
    icon: <UserRound size={16} />,
    children: [{ label: "Profile" }, { label: "Attendance" }, { label: "Paperwork" }],
  },
]

export const VIEWS: ProtoView[] = [
  { path: "dashboard", label: "Home", render: () => <Home /> },

  { path: "progression/yams", label: "YAMS dashboard", render: () => <Yams /> },
  { path: "progression/milestones", label: "Milestones", render: () => <Milestones /> },
  { path: "progression/simulator", label: "YAMS simulator", render: () => <Simulator /> },

  { path: "learn/program", label: "My program", render: () => <Program /> },
  { path: "learn/holygraph", label: "Holygraph", render: () => <Holygraph /> },
  {
    path: "learn/module/:slug",
    label: "Module",
    href: "#/learn/module/systems-and-networks-administration",
    render: ({ slug }) => <Module slug={slug} />,
  },
]
