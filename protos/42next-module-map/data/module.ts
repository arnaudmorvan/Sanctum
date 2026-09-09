/** Programming Fundamentals — the module as a progression map.
 *
 *  x / y / w / h are MAP-SPACE geometry, not design values: the connectors are computed
 *  from them, so they belong to the data rather than being eyeballed in the JSX. No colour,
 *  no spacing and no radius is decided here.
 *
 *  The copy is the one asked for, to the letter — including the two labels that raise a
 *  question and are reproduced rather than fixed in silence: the exam carries `Success`
 *  while Push_Swap is still locked, and `5ème étage` stays in French inside an otherwise
 *  English screen. Both are flagged in the report. */

export const MODULE = {
  slug: "programming-fundamentals",
  name: "Programming Fundamentals",
  version: "v4.1.0",
  about:
    "Get the fundamentals of the C language: memory management, strings, file handling, and how to compile, link and ship your own library. What you build here becomes the toolbox the rest of the Common Core is written with.",
}

export type NodeKind = "todo" | "locked" | "exam"

export type MapNode = {
  id: string
  name: string
  note: string
  badge: string
  kind: NodeKind
  /** The ONE step to attack — it takes the signature outline. */
  entry?: boolean
  x: number
  y: number
  w: number
  h: number
}

export const MAP = { w: 1520, h: 480 }

export const NODES: MapNode[] = [
  {
    id: "libft",
    name: "Common Core – Libft",
    note: "Your own C library. Everything that comes after links against it.",
    badge: "In progress",
    kind: "todo",
    entry: true,
    x: 0,
    y: 150,
    w: 260,
    h: 140,
  },
  {
    id: "printf",
    name: "Common Core – Printf",
    note: "Variadic functions and formatting. Runs alongside GetNextLine.",
    badge: "To do",
    kind: "todo",
    x: 380,
    y: 10,
    w: 260,
    h: 140,
  },
  {
    id: "gnl",
    name: "Common Core – GetNextLine",
    note: "Buffered reading, and state kept between two calls.",
    badge: "To do",
    kind: "todo",
    x: 380,
    y: 290,
    w: 260,
    h: 140,
  },
  {
    id: "push-swap",
    name: "Common Core – Push_Swap",
    note: "Solo or in group. Opens once Printf and GetNextLine are both validated.",
    badge: "Locked",
    kind: "locked",
    x: 760,
    y: 150,
    w: 260,
    h: 140,
  },
  {
    id: "exam",
    name: "Exam – Programming Fundamentals",
    note: "",
    badge: "Success",
    kind: "exam",
    x: 1140,
    y: 110,
    w: 320,
    h: 220,
  },
]

/** Anchors: (x + w, y + h/2) -> (x, y + h/2). Written out flat so the renderer never has to
 *  reason about geometry — it draws a list. */
export const LINKS = [
  "M260,220 C320,220 320,80 380,80",
  "M260,220 C320,220 320,360 380,360",
  "M640,80 C700,80 700,220 760,220",
  "M640,360 C700,360 700,220 760,220",
  "M1020,220 L1140,220",
]

/** Both branches are required before Push_Swap opens — hence the AND between them. */
export const AND_GATE = { cx: 510, cy: 220, r: 18 }

export const EXAM = {
  date: "July 2, 2026 at 08:00 PM",
  place: "5ème étage",
  seats: "5/42",
}

export type Skill = { name: string; icon: string; acquired: boolean }

/** The six skills Libft alone carries are the acquired ones; the rest unlock further down
 *  the map. That is what makes the panel a state and not a menu. */
export const SKILLS: Skill[] = [
  { name: "Dynamic Memory Allocation", icon: "memory", acquired: true },
  { name: "Linked Lists", icon: "link2", acquired: true },
  { name: "Strings", icon: "type", acquired: true },
  { name: "Automated Compilation", icon: "hammer", acquired: true },
  { name: "Library Linking", icon: "link", acquired: true },
  { name: "Library Creation", icon: "library", acquired: true },
  { name: "Memory Management & Pointers", icon: "pointer", acquired: false },
  { name: "Buffered I/O", icon: "file", acquired: false },
  { name: "State Management in Functions", icon: "repeat", acquired: false },
  { name: "String Parsing & Formatting", icon: "align", acquired: false },
  { name: "Type Conversion & Representation", icon: "binary", acquired: false },
  { name: "Variadic Functions", icon: "dots", acquired: false },
  { name: "Stacks", icon: "layers", acquired: false },
  { name: "Command-Line Argument Parsing", icon: "terminal", acquired: false },
  { name: "Imperative Programming", icon: "code", acquired: false },
]

export const ALL_MODULES: {
  slug: string
  name: string
  note: string
  badge: string
  open?: boolean
}[] = [
  {
    slug: "programming-fundamentals",
    name: "Programming Fundamentals",
    note: "C, memory, strings, files, and your first library.",
    badge: "In progress",
    open: true,
  },
  {
    slug: "systems-and-networks-administration",
    name: "Systems & Networks Administration",
    note: "Virtualisation, subnetting, containers, orchestration.",
    badge: "Locked",
  },
  {
    slug: "object-oriented-programming",
    name: "Object-Oriented Programming",
    note: "C++, classes, templates, the standard library.",
    badge: "Locked",
  },
  {
    slug: "algorithmics",
    name: "Algorithmics",
    note: "Graphs, complexity, pathfinding.",
    badge: "Locked",
  },
]
