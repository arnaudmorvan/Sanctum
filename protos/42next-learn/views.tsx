import type { ProtoView } from "../../src/proto-types"
import { Program } from "./pages/program"
import { Module } from "./pages/module"
import { Project } from "./pages/project"

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
