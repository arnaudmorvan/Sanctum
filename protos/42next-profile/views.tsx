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

/** 42next — Learner profile. ONE screen, on its own, plus the screen its only
 *  control opens.
 *
 *  WHY IT EXISTS SEPARATELY. This screen also lives in the `42next-lms` flow,
 *  on the routes `me/profile` and `profile/:login`. That flow carries 26 routes
 *  and the whole product sidebar: opening it to show THIS screen means arriving
 *  somewhere else and navigating. This proto is the screen alone, at its own
 *  URL, for a review that is about the profile and nothing else.
 *
 *  ⚠️ It is therefore a DUPLICATE, on purpose. `pages/` and `data/` are copies
 *  of the `42next-lms` files, not imports across flows — publish takes one flow
 *  folder at a time. A change to the profile has to be made TWICE, or this
 *  proto retired.
 *
 *  ⚠️ FIXED 2026-09-08: the previous publish left `pages/activity.tsx`,
 *  `data/profile.ts` and `data/agenda.ts` OUT of the repo while `views.tsx` and
 *  `pages/profile.tsx` imported all three. The flow could not build. Every file
 *  the screens import now ships in the same commit — publish_proto adds and
 *  replaces, it never fills a gap on its own.
 *
 *  THE SOURCE is the frame, not the HTML prototype: `figma-source.json` records
 *  it. This version is a NEW PROPOSAL on that content, not a lift — the reasons
 *  are at the top of `pages/profile.tsx`.
 *
 *  The CHROME is the skeleton's (`NAV` below), not drawn here.
 */

/** Icons: the ones frame 22489:9756 actually carries (lifted 2026-09-05) —
 *  house, layout-dashboard, graduation-cap, calendar, folder-check. The
 *  mockup's rows are all labelled « LOREM IPSUM », so the label→icon pairing
 *  cannot come from it: `Review`, `Exams` and `Community` keep a reasoned
 *  choice. Rows with no `path` are categories: the skeleton renders them
 *  non-clickable, which is honest — this proto holds two screens, not eight
 *  sections. Section names come from `42next-lms-sitemap-as-built.md`. */
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
