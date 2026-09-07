import { GraduationCap, House, LayoutDashboard, Rocket } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { QuestMap } from "./pages/quest-map"

/** The CHROME is rendered by the skeleton. Labels AND icons LIFTED from frame
 *  22505:9532: Home/house, MODULES/layout-dashboard, RUSHES/rocket, EXAMS/graduation-cap.
 *
 *  ⚠️ The frame carries a fifth entry, « Menu Open », expanded over seven children all
 *  titled « Lorem Ipsum »: that is a DEMO of the component's open state, not content.
 *  Seven dead links to screens that do not exist are not a clickable flow — so the
 *  entry is not carried over, and the deviation is filed to the report.
 *  (`NavLink` knows how to self-nest through its children, the day those labels exist.) */
export const NAV: ProtoNavItem[] = [
  { label: "Home", path: "home", icon: <House size={16} /> },
  { label: "Modules", icon: <LayoutDashboard size={16} /> },
  { label: "Rushes", icon: <Rocket size={16} /> },
  { label: "Exams", icon: <GraduationCap size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "home", label: "Quest map", render: () => <QuestMap /> },
]
