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

/** 42next — Learner profile. ONE screen, on its own.
 *
 *  WHY IT EXISTS SEPARATELY. This screen also lives in the `42next-lms` flow, on the
 *  routes `me/profile` and `profile/:login`. That flow carries 26 routes and the whole
 *  product sidebar: opening it to show THIS frame means arriving somewhere else and
 *  navigating. This proto is the frame alone, at its own URL, for a review or a hand-off
 *  that is about the profile and nothing else.
 *
 *  ⚠️ It is therefore a DUPLICATE, on purpose. `pages/`, `data/` are copies of the
 *  `42next-lms` files, not imports across flows — the publish path takes one flow folder
 *  at a time and a cross-flow import would not survive it. A change to the profile screen
 *  has to be made TWICE, or this proto retired. It was already retired once, on
 *  2026-09-07, when the eight HTML prototypes were folded into one flow (`7a6ba82`).
 *
 *  THE SOURCE is the frame, not the HTML prototype: `figma-source.json` records it, and
 *  the two conformance passes (2026-09-04 layout, 2026-09-05 typography) are documented
 *  at the top of `pages/profile.tsx`. Re-lift from the frame, never from this copy.
 *
 *  The CHROME is the skeleton's (`NAV` below), not drawn here.
 */

/** Icons: the ones frame 22489:9756 actually carries (lifted on 2026-09-05) — house,
 *  layout-dashboard, graduation-cap, calendar, folder-check. The mockup's rows are all
 *  labelled « LOREM IPSUM », so the label→icon pairing cannot come from it: `Review`,
 *  `Exams` and `Community` keep a reasoned choice, for want of a dedicated icon in the
 *  frame. Rows with no `path` are categories: the skeleton renders them non-clickable,
 *  which is honest here — this proto holds two screens, not eight sections. */
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
  /* The profile's one outbound affordance — « Open the activity » on the minishell card.
     It ships with the screen so the button leads somewhere: a proto whose only control is
     dead is worse than one screen fewer. */
  {
    path: "activities/:slug",
    label: "Activity",
    href: "#/activities/minishell",
    render: ({ slug }) => <Activity slug={slug} />,
  },
]
