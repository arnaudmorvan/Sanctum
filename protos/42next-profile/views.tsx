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

/** The CHROME is rendered by the skeleton (NAV migration of 2026-09-05: the former
 *  components/sidebar.tsx is gone). Same entries as the former sidebar:
 *  « Learn » targets the activity screen (match on activities/), « My activities »
 *  targets the profile (match on profile/) — the others are categories with no link.
 *
 *  Icons: the ones frame 22489:9756 actually carries (lifted on 2026-09-05)
 *  — house, layout-dashboard, graduation-cap, calendar, folder-check. The mockup's
 *  rows are all labelled « LOREM IPSUM », so the label→icon pairing cannot come from
 *  it: `Review`, `Exams` and `Community` keep a reasoned choice, for want of a
 *  dedicated icon in the frame. */
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
