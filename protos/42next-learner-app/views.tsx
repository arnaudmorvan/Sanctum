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
import { AgendaCalendar, AgendaRegistrations, Exams } from "./pages/agenda"
import {
  Announcements,
  Changelog,
  Clubs,
  ClusterMap,
  Coalition,
  Friends,
} from "./pages/community"
import {
  Achievements,
  Activities,
  Attendance,
  Paperwork,
  Profile,
  Skills,
  Xp,
} from "./pages/me"
import { Milestones, Simulator, Yams } from "./pages/progression"
import {
  ReviewAvailability,
  ReviewGiven,
  ReviewOverview,
  ReviewReceived,
} from "./pages/review"

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
    match: "review/",
    icon: <ClipboardCheck size={16} />,
    children: [
      { label: "Overview", path: "review/overview" },
      { label: "Received", path: "review/received" },
      { label: "Given", path: "review/given" },
      { label: "My availability", path: "review/availability" },
    ],
  },
  { label: "Exams", path: "exams", icon: <FileCheck size={16} /> },
  {
    label: "Agenda",
    match: "agenda/",
    icon: <Calendar size={16} />,
    children: [
      { label: "Calendar", path: "agenda/calendar" },
      { label: "Registrations", path: "agenda/registrations" },
    ],
  },
  {
    label: "Community",
    match: "community/",
    icon: <Users size={16} />,
    children: [
      { label: "Coalition", path: "community/coalition" },
      { label: "Friends", path: "community/friends" },
      { label: "Clubs", path: "community/clubs" },
      { label: "Announcements", path: "community/announcements" },
      { label: "Changelog", path: "community/changelog" },
      { label: "Cluster map", path: "community/cluster" },
    ],
  },
  {
    label: "My profile",
    match: "me/",
    icon: <UserRound size={16} />,
    children: [
      { label: "Profile", path: "me/profile" },
      { label: "Skills", path: "me/skills" },
      { label: "Level & XP", path: "me/xp" },
      { label: "Achievements", path: "me/achievements" },
      { label: "My recent activities", path: "me/activities" },
      { label: "Attendance", path: "me/attendance" },
      { label: "Paperwork", path: "me/paperwork" },
    ],
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

  { path: "review/overview", label: "Review overview", render: () => <ReviewOverview /> },
  { path: "review/received", label: "Reviews received", render: () => <ReviewReceived /> },
  { path: "review/given", label: "Reviews given", render: () => <ReviewGiven /> },
  {
    path: "review/availability",
    label: "My availability",
    render: () => <ReviewAvailability />,
  },

  { path: "exams", label: "Exams", render: () => <Exams /> },

  { path: "agenda/calendar", label: "Calendar", render: () => <AgendaCalendar /> },
  {
    path: "agenda/registrations",
    label: "Registrations",
    render: () => <AgendaRegistrations />,
  },

  { path: "community/coalition", label: "Coalition", render: () => <Coalition /> },
  { path: "community/friends", label: "Friends", render: () => <Friends /> },
  { path: "community/clubs", label: "Clubs", render: () => <Clubs /> },
  { path: "community/announcements", label: "Announcements", render: () => <Announcements /> },
  { path: "community/changelog", label: "Changelog", render: () => <Changelog /> },
  { path: "community/cluster", label: "Cluster map", render: () => <ClusterMap /> },

  /* The artifact rendered the learner's own profile and any peer's from ONE function,
     which is why these two routes share a component. */
  { path: "me/profile", label: "My profile", render: () => <Profile login="erizzi" /> },
  {
    path: "profile/:login",
    label: "Peer profile",
    href: "#/profile/dvargas",
    render: ({ login }) => <Profile login={login} />,
  },
  { path: "me/skills", label: "Skills", render: () => <Skills /> },
  { path: "me/xp", label: "Level & XP", render: () => <Xp /> },
  { path: "me/achievements", label: "Achievements", render: () => <Achievements /> },
  { path: "me/activities", label: "My recent activities", render: () => <Activities /> },
  { path: "me/attendance", label: "Attendance", render: () => <Attendance /> },
  { path: "me/paperwork", label: "Paperwork", render: () => <Paperwork /> },
]
