import { FileText, House, LayoutGrid, Map as MapIcon, Network } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { ModuleMap } from "./pages/module-map"
import { Modules } from "./pages/modules"

/** 42next — the module seen as a MAP, not as a fiche.
 *
 *  The LMS flow (`42next-lms`) already has a module screen: a two-column record with an
 *  abstract, a requirements list and an activity table. This flow is the other reading of
 *  the same object — the module as a territory to cross, with branches, a gate and an exam
 *  at the end. It is kept apart rather than folded into the LMS because its navigation is
 *  a different one: five entries, Modules selected, no progression / review / agenda tree.
 *
 *  The CHROME (sidebar, 42 logo, ambient background) is the skeleton's, rendered as soon as
 *  NAV is exported. Home, Holy Graph, Cluster Map and Paperwork carry no target: they say
 *  what the product has around this screen, with no dead link. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "Holy Graph", icon: <Network size={16} /> },
  { label: "Modules", path: "modules", match: "modules", icon: <LayoutGrid size={16} /> },
  { label: "Cluster Map", icon: <MapIcon size={16} /> },
  { label: "Paperwork", icon: <FileText size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "modules", label: "All Modules", render: () => <Modules /> },
  {
    path: "modules/:slug",
    label: "Module progression map",
    href: "#/modules/programming-fundamentals",
    render: ({ slug }) => <ModuleMap slug={slug} />,
  },
]
