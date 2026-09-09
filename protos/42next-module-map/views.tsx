import { FileText, House, LayoutGrid, Map as MapIcon, Network } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { Holygraph } from "./pages/holygraph"
import { ModuleMap } from "./pages/module-map"
import { Modules } from "./pages/modules"
import { Paperwork } from "./pages/paperwork"

/** 42next — the curriculum read as a territory.
 *
 *  Two scales of the same idea. `holygraph` is the whole Common Core: milestones, branches,
 *  exam gates, what is still sealed. `modules/:slug` zooms into ONE of its nodes and shows
 *  the projects inside it. The only live node of the graph links to the only open module,
 *  so the two screens chain rather than coexist.
 *
 *  The LMS flow (`42next-lms`) already has a module screen — the module as a record. This
 *  flow is the other reading, and it keeps its own navigation: five entries, no progression
 *  / review / agenda tree.
 *
 *  The CHROME (sidebar, 42 logo, ambient background) is the skeleton's, rendered as soon as
 *  NAV is exported. Home and Cluster Map carry no target: they say what the product
 *  has around these screens, with no dead link. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", icon: <House size={16} /> },
  { label: "Holy Graph", path: "holygraph", match: "holygraph", icon: <Network size={16} /> },
  { label: "Modules", path: "modules", match: "modules", icon: <LayoutGrid size={16} /> },
  { label: "Cluster Map", icon: <MapIcon size={16} /> },
  { label: "Paperwork", path: "paperwork", match: "paperwork", icon: <FileText size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "holygraph", label: "Holy Graph", render: () => <Holygraph /> },
  { path: "modules", label: "All Modules", render: () => <Modules /> },
  {
    path: "modules/:slug",
    label: "Module progression map",
    href: "#/modules/programming-fundamentals",
    render: ({ slug }) => <ModuleMap slug={slug} />,
  },
  { path: "paperwork", label: "Paperwork", render: () => <Paperwork /> },
]
