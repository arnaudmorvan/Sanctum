import { FileCheck, Hammer, House, LayoutGrid } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { Feedback } from "./pages/feedback"
import { Modules } from "./pages/modules"

/** Simplified nav for this standalone prototype: "Home" and "Modules" are real
 *  routes; "Rushes" and "Exams" stay non-clickable category rows (no `path`), so
 *  the sidebar reads as intended with no dead link. Deliberate simplification of
 *  the real 42next IA (Learn > Modules, Review, Exams...) for a focused proto —
 *  flagged in the report, not silently reconciled. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", path: "feedback", icon: <House size={16} /> },
  { label: "Modules", path: "modules", icon: <LayoutGrid size={16} /> },
  { label: "Rushes", icon: <Hammer size={16} /> },
  { label: "Exams", icon: <FileCheck size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "feedback", label: "Home", render: () => <Feedback /> },
  { path: "modules", label: "Modules", render: () => <Modules /> },
]
