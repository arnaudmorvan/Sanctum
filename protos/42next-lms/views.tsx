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
import { Activity } from "./pages/activity"
import { AgendaCalendar, AgendaRegistrations } from "./pages/agenda"
import {
  Announcements,
  Changelog,
  Clubs,
  ClusterMap,
  Coalition,
  Friends,
} from "./pages/community"
import { Dashboard } from "./pages/dashboard"
import { Exams } from "./pages/exams"
import { Attendance, Paperwork } from "./pages/me"
import { Module } from "./pages/module"
import { Profile } from "./pages/profile"
import { Program } from "./pages/program"
import { Milestones, Simulator, Yams } from "./pages/progression"
import { Project } from "./pages/project"
import { QuestMap } from "./pages/quest-map"
import {
  ReviewAvailability,
  ReviewGiven,
  ReviewOverview,
  ReviewReceived,
} from "./pages/review"

/** 42next — the LMS, as ONE flow.
 *
 *  WHERE THIS COMES FROM. `_oldProto/` held eight HTML files of ~1.5 MB each. They were
 *  not eight prototypes: they were eight copies of the SAME app, identical byte for byte
 *  apart from their `<title>` and the initial value of a `route` variable. The app had no
 *  hash routing at all — `go()` mutated a variable and re-rendered — so the eight files
 *  were the only way to open it on a screen other than the home page. That is the whole
 *  reason they existed, and it is why they collapse into a single flow here: the eight
 *  entry points become eight routes of one app, and the ~24 screens the sidebar reached
 *  become deep links a PO can actually send to someone.
 *
 *  WHAT IT SUPERSEDES. `42next-learn`, `42next-profile` and `42next-quest-map` covered six
 *  of these screens each in their own flow. Their pages are folded in here unchanged
 *  (program, module, project, profile, activity, quest-map) rather than rewritten: they
 *  were already composed with the kit, and a port that threw them away would lose work
 *  and drift from what was reviewed.
 *
 *  The CHROME is the skeleton's (`NAV` below). The HTML prototype drew its own sidebar —
 *  a nested, collapsible tree — and the skeleton's nav was flat, so the first version of
 *  this flow could only expose ONE page per section and everything else lived in the
 *  bottom bar. `ProtoNavItem.children` was added on 2026-09-07 to close that gap: the
 *  kit's `NavLink` already self-nests, only the skeleton did not use it.
 *
 *  The prototype's own rule is kept: a section WITH sub-pages is a toggle, not a link
 *  (its heading folds the group rather than navigating), and a section without them —
 *  Home, Exams — is a plain link. `match` keeps a section lit on its deep screens
 *  (`learn/module/:slug` lights "My program"). */
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
      { label: "Attendance", path: "me/attendance" },
      { label: "Paperwork", path: "me/paperwork" },
    ],
  },
]

export const VIEWS: ProtoView[] = [
  { path: "dashboard", label: "Home", render: () => <Dashboard /> },

  { path: "progression/yams", label: "YAMS dashboard", render: () => <Yams /> },
  { path: "progression/milestones", label: "Milestones", render: () => <Milestones /> },
  { path: "progression/simulator", label: "YAMS simulator", render: () => <Simulator /> },

  { path: "learn/program", label: "My program", render: () => <Program /> },
  { path: "learn/holygraph", label: "Holygraph", render: () => <QuestMap /> },
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

  { path: "review/overview", label: "Review overview", render: () => <ReviewOverview /> },
  { path: "review/received", label: "Reviews received", render: () => <ReviewReceived /> },
  { path: "review/given", label: "Reviews given", render: () => <ReviewGiven /> },
  { path: "review/availability", label: "My availability", render: () => <ReviewAvailability /> },

  { path: "exams", label: "Exams", render: () => <Exams /> },

  { path: "agenda/calendar", label: "Calendar", render: () => <AgendaCalendar /> },
  { path: "agenda/registrations", label: "Registrations", render: () => <AgendaRegistrations /> },

  { path: "community/coalition", label: "Coalition", render: () => <Coalition /> },
  { path: "community/friends", label: "Friends", render: () => <Friends /> },
  { path: "community/clubs", label: "Clubs", render: () => <Clubs /> },
  { path: "community/announcements", label: "Announcements", render: () => <Announcements /> },
  { path: "community/changelog", label: "Changelog", render: () => <Changelog /> },
  { path: "community/cluster", label: "Cluster map", render: () => <ClusterMap /> },

  /* The prototype rendered the learner's own profile and any peer's from ONE function
     (`profilePage(login)`), which is why these two routes share a component. */
  { path: "me/profile", label: "My profile", render: () => <Profile login="erizzi" /> },
  {
    path: "profile/:login",
    label: "Peer profile",
    href: "#/profile/aserrano",
    render: ({ login }) => <Profile login={login} />,
  },
  {
    path: "activities/:slug",
    label: "Activity",
    href: "#/activities/minishell",
    render: ({ slug }) => <Activity slug={slug} />,
  },
  { path: "me/attendance", label: "Attendance", render: () => <Attendance /> },
  { path: "me/paperwork", label: "Paperwork", render: () => <Paperwork /> },
]
