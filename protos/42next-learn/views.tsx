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
import { Program } from "./pages/program"
import { Module } from "./pages/module"
import { Project } from "./pages/project"

/** The CHROME is rendered by the skeleton (NAV migration of 2026-09-05: the former
 *  components/sidebar.tsx is gone). The nav mirrors the 42next product architecture;
 *  the rows without a target are categories with no dead link — as before.
 *  `match: "learn/"` keeps « Learn » current on module and project, which is what the
 *  former Screen component did with its hard-coded active="Learn".
 *  Icons: the ones frame 22489:9756 actually carries (lifted on 2026-09-05)
 *  — house, layout-dashboard, graduation-cap, calendar, folder-check. The mockup's rows
 *  are all labelled « LOREM IPSUM », so `Review`, `Exams` and `Community` keep a
 *  reasoned choice, for want of a dedicated icon in the frame. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "My progression", icon: <LayoutDashboard size={16} /> },
  { label: "Learn", path: "learn/program", match: "learn/", icon: <GraduationCap size={16} /> },
  { label: "Review", icon: <ClipboardCheck size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
  { label: "Agenda", icon: <Calendar size={16} /> },
  { label: "Community", icon: <Users size={16} /> },
  { label: "My activities", icon: <FolderCheck size={16} /> },
]

export const VIEWS: ProtoView[] = [
  {
    path: "learn/program",
    label: "My program",
    href: "#/learn/program",
    render: () => <Program />,
  },
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
]
