import { FileCheck, Hammer, House, LayoutGrid } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { Feedback } from "./pages/feedback"

/** Simplified nav requested for this standalone prototype: only "Home" is a real
 *  route (the feedback screen); the three others are non-clickable category rows
 *  (no `path`), so the sidebar reads as intended with no dead link. This is a
 *  deliberate simplification of the real 42next IA (Learn > Modules, Review,
 *  Exams...) for a single-screen proto — flagged in the report, not silently
 *  reconciled. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", path: "feedback", icon: <House size={16} /> },
  { label: "Modules", icon: <LayoutGrid size={16} /> },
  { label: "Rushes", icon: <Hammer size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "feedback", label: "Home", render: () => <Feedback /> },
]
