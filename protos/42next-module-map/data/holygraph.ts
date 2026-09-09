/** The Holy Graph — the whole Common Core as one map.
 *
 *  Invented content, as asked: nobody surveyed this path, it is a proposal. What is NOT
 *  invented is the shape — milestones that gate one another, branches you cross in any
 *  order, an exam that seals the next band. That is the grammar 42 already uses.
 *
 *  x / y / w / h are MAP-SPACE geometry, not design values: the connector paths are written
 *  from the same anchors as the nodes, so a node cannot move without its links moving. No
 *  colour, no spacing and no radius is decided in this file.
 *
 *  Anchor convention: right edge = (x + w, y + h/2), left edge = (x, y + h/2). Three rows
 *  only — centre 275, top 125, bottom 425 — which is what keeps the curves readable. */

export type NodeKind = "cleared" | "progress" | "open" | "locked" | "gate" | "final"

export type GraphNode = {
  id: string
  name: string
  note?: string
  /** A counter or a duration — rendered in the machine register. */
  meta?: string
  kind: NodeKind
  href?: string
  x: number
  y: number
  w: number
  h: number
}

export const GRAPH = { w: 1990, h: 560 }

/** The bands. A milestone is a stretch of the path, not a folder: it is what the graph is
 *  read by, so its label sits above the column rather than inside a card. */
export const BANDS: { label: string; x: number }[] = [
  { label: "Milestone 00 · Selection", x: 0 },
  { label: "Milestone 01 · Fundamentals", x: 290 },
  { label: "Gate", x: 580 },
  { label: "Milestone 02 · Core systems", x: 830 },
  { label: "Gate", x: 1120 },
  { label: "Milestone 03 · Specialisation", x: 1370 },
  { label: "Milestone 04 · The outside", x: 1660 },
]

export const NODES: GraphNode[] = [
  {
    id: "piscine",
    name: "C Piscine",
    note: "Four weeks, no teacher, one selection at the end.",
    meta: "CLEARED · 26 DAYS",
    kind: "cleared",
    x: 0,
    y: 220,
    w: 230,
    h: 110,
  },
  {
    id: "fundamentals",
    name: "Programming Fundamentals",
    note: "C, memory, strings, your first library.",
    meta: "6 / 15 SKILLS",
    kind: "progress",
    href: "#/modules/programming-fundamentals",
    x: 290,
    y: 220,
    w: 230,
    h: 110,
  },
  {
    id: "exam-01",
    name: "Exam 01",
    meta: "SEALS MILESTONE 02",
    kind: "gate",
    x: 580,
    y: 235,
    w: 180,
    h: 80,
  },
  {
    id: "systems",
    name: "Systems & Networks",
    note: "Virtualisation, subnetting, containers.",
    meta: "0 / 12 SKILLS",
    kind: "locked",
    x: 830,
    y: 70,
    w: 230,
    h: 110,
  },
  {
    id: "oop",
    name: "Object-Oriented Programming",
    note: "C++, classes, templates, the standard library.",
    meta: "0 / 14 SKILLS",
    kind: "locked",
    x: 830,
    y: 220,
    w: 230,
    h: 110,
  },
  {
    id: "algo",
    name: "Algorithmics",
    note: "Graphs, complexity, pathfinding.",
    meta: "0 / 9 SKILLS",
    kind: "locked",
    x: 830,
    y: 370,
    w: 230,
    h: 110,
  },
  {
    id: "exam-02",
    name: "Exam 02",
    meta: "SEALS MILESTONE 03",
    kind: "gate",
    x: 1120,
    y: 235,
    w: 180,
    h: 80,
  },
  {
    id: "web",
    name: "Web Programming",
    note: "Full stack, from the socket to the browser.",
    meta: "0 / 11 SKILLS",
    kind: "locked",
    x: 1370,
    y: 70,
    w: 230,
    h: 110,
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    note: "Models, training, inference on your own machine.",
    meta: "0 / 10 SKILLS",
    kind: "locked",
    x: 1370,
    y: 220,
    w: 230,
    h: 110,
  },
  {
    id: "sysprog",
    name: "System & Network Programming",
    note: "Processes, threads, protocols you write yourself.",
    meta: "0 / 10 SKILLS",
    kind: "locked",
    x: 1370,
    y: 370,
    w: 230,
    h: 110,
  },
  {
    id: "outside",
    name: "Internship & final project",
    note: "One specialisation is enough to leave. Two if you want to stay longer.",
    meta: "UNLOCKS AT 1 SPECIALISATION",
    kind: "final",
    x: 1660,
    y: 195,
    w: 280,
    h: 160,
  },
]

/** Everything still ahead. Thin hairlines: the path is read by its shape, not by its ink. */
export const LINKS = [
  "M520,275 L580,275",
  "M760,275 C800,275 800,125 830,125",
  "M760,275 L830,275",
  "M760,275 C800,275 800,425 830,425",
  "M1060,125 C1090,125 1090,275 1120,275",
  "M1060,275 L1120,275",
  "M1060,425 C1090,425 1090,275 1120,275",
  "M1300,275 C1335,275 1335,125 1370,125",
  "M1300,275 L1370,275",
  "M1300,275 C1335,275 1335,425 1370,425",
  "M1600,125 C1630,125 1630,275 1660,275",
  "M1600,275 L1660,275",
  "M1600,425 C1630,425 1630,275 1660,275",
]

/** The stretch already walked. It is the only pink ink on the map, and that is the point:
 *  the colour says "you came from here", it does not decorate the graph. */
export const CLEARED_LINKS = ["M230,275 L290,275"]

export const QUEST = {
  name: "Programming Fundamentals",
  detail: "Libft is open, Printf and GetNextLine follow. Both are needed before Push_Swap.",
  meta: "2 OF 5 ACTIVITIES LEFT",
  href: "#/modules/programming-fundamentals",
}

export const STANDING = {
  milestone: "Milestone 01 of 04",
  pct: 22,
  level: "LEVEL 3 · 1 240 XP",
  note: "A milestone never blocks you. It says the pace, and what the next gate will ask.",
}

export const LEGEND: { kind: NodeKind; label: string }[] = [
  { kind: "cleared", label: "Cleared" },
  { kind: "progress", label: "In progress" },
  { kind: "gate", label: "Exam gate" },
  { kind: "locked", label: "Sealed" },
]
