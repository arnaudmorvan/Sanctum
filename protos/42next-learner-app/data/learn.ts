/** Learn fixtures — the program, its modules, and the two modules that have a real
 *  `config.yml` in the artifact.
 *
 *  THE ARTIFACT'S OWN ASYMMETRY IS KEPT. Only some modules carry an uploaded config;
 *  the others show their abstract and say so. Faking a config for the five that have none
 *  would turn a known gap into invented content — and the artifact deliberately printed
 *  "No module config uploaded" instead.
 *
 *  `status` is what the artifact's `statusOf()` resolved to on this demo state:
 *  a module is `locked` until every module it requires is validated, and nothing is
 *  validated yet. `entry` marks the one module the learner is actually working in — it is
 *  what carries the screen's signature outline. */

export type Status = "validated" | "progress" | "available" | "locked"

export type ModuleRow = {
  id: string
  name: string
  theme: string
  requires: string[]
  skills: [number, number]
  activities: number
  status: Status
  abstract: string
  entry?: boolean
  hasConfig?: boolean
}

export const PROGRAM = {
  name: "Common core",
  version: "1.4.0",
  versionDate: "12 Sep 2026",
}

export const MODULES: ModuleRow[] = [
  {
    id: "programming-fundamentals",
    name: "Programming Fundamentals",
    theme: "Core",
    requires: [],
    skills: [5, 8],
    activities: 5,
    status: "progress",
    hasConfig: true,
    abstract:
      "In the Programming Fundamentals module, you will master the art of C programming from the ground up, learning to build your own tools and libraries while understanding how memory really works. You will explore string manipulation, dynamic allocation, file I/O, and algorithmic problem-solving, developing the foundational skills that every great programmer needs.",
  },
  {
    id: "systems-and-networks-administration",
    name: "Systems & networks administration",
    theme: "Systems",
    requires: ["programming-fundamentals"],
    skills: [3, 6],
    activities: 4,
    status: "progress",
    entry: true,
    hasConfig: true,
    abstract:
      "Set up and secure a machine you are responsible for. Partitions, users, services, firewall rules — and the habit of documenting what you changed.",
  },
  {
    id: "object-oriented-programming",
    name: "Object-oriented programming",
    theme: "Core",
    requires: ["programming-fundamentals"],
    skills: [2, 7],
    activities: 5,
    status: "progress",
    abstract:
      "Model a problem with objects instead of procedures. Inheritance, polymorphism, and the discipline of keeping an interface small.",
  },
  {
    id: "algorithmics",
    name: "Algorithmics",
    theme: "Core",
    requires: ["object-oriented-programming", "systems-and-networks-administration"],
    skills: [0, 5],
    activities: 4,
    status: "locked",
    abstract:
      "Choose the right structure and the right complexity for the problem in front of you, then prove your choice under constraint.",
  },
  {
    id: "artificial-intelligence",
    name: "Artificial intelligence",
    theme: "AI",
    requires: ["object-oriented-programming", "systems-and-networks-administration"],
    skills: [0, 6],
    activities: 4,
    status: "locked",
    abstract:
      "Build systems that search, decide and learn. Starts with classical search and ends with your first trained model.",
  },
  {
    id: "system-and-network-programming",
    name: "System & network programming",
    theme: "Systems",
    requires: ["object-oriented-programming", "systems-and-networks-administration"],
    skills: [0, 6],
    activities: 5,
    status: "locked",
    abstract:
      "Talk directly to the operating system. Processes, signals, sockets, and the failure modes that only appear under load.",
  },
  {
    id: "web-programming",
    name: "Web programming",
    theme: "Web",
    requires: ["algorithmics", "artificial-intelligence", "system-and-network-programming"],
    skills: [0, 8],
    activities: 6,
    status: "locked",
    abstract:
      "Ship a full web application end to end — data model, API, interface, deployment — and defend the choices you made.",
  },
]

/** Started modules carry the version the learner started on, and the day they did.
 *  `next` is a newer content version they may take — the artifact made that a
 *  first-class object, with a read-only view of the version they worked on before. */
export const STARTED: Record<string, { version: string; on: string; next?: string; kind?: string; past?: string[] }> = {
  "programming-fundamentals": { version: "1.2.0", on: "14 Jan 2026", past: ["1.1.0"] },
  "systems-and-networks-administration": {
    version: "2.0.0",
    on: "02 Jun 2026",
    next: "2.1.0",
    kind: "minor",
  },
  "object-oriented-programming": { version: "1.0.0", on: "28 Aug 2026" },
}

export type ActStatus = "done" | "now" | "open"
export type Activity = {
  id: string
  name: string
  kind: "Project" | "Exam"
  status: ActStatus
  skills: string[]
  /** what the live attempt is doing, when there is one — the module's own status cannot
   *  tell "still working on it" from "submitted and waiting for a reviewer" */
  attempt?: string
}
export type Layer = { layer: number; items: string[]; after?: number }
export type Skill = { id: string; name: string; got: boolean }
export type ModuleConfig = {
  name: string
  validation: { projects: string[]; exams: string[] }
  layers: Layer[]
  activities: Activity[]
  skills: Skill[]
  exam?: { sessions: number; free: number; lastScore?: number; lastDay?: string; passed?: boolean }
}

export const CONFIGS: Record<string, ModuleConfig> = {
  "programming-fundamentals": {
    name: "Programming Fundamentals",
    validation: {
      projects: [
        "Common_Core-Project-C-Libft",
        "Common_Core-Project-C-Printf",
        "Common_Core-Project-C-GetNextLine",
        "Common_Core-Project-C-Push_Swap",
      ],
      exams: ["exam---programming-fundamentals"],
    },
    layers: [
      { layer: 1, items: ["exam---programming-fundamentals"] },
      { layer: 2, items: ["Common_Core-Project-C-Libft"] },
      {
        layer: 3,
        items: ["Common_Core-Project-C-Printf", "Common_Core-Project-C-GetNextLine"],
        after: 2,
      },
      { layer: 4, items: ["Common_Core-Project-C-Push_Swap"], after: 3 },
    ],
    activities: [
      {
        id: "Common_Core-Project-C-Libft",
        name: "libft",
        kind: "Project",
        status: "done",
        skills: ["c/strings", "c/memory", "c/structs", "soft/rigor"],
      },
      {
        id: "Common_Core-Project-C-Printf",
        name: "ft_printf",
        kind: "Project",
        status: "done",
        skills: ["c/variadic", "c/strings"],
      },
      {
        id: "Common_Core-Project-C-GetNextLine",
        name: "get_next_line",
        kind: "Project",
        status: "done",
        skills: ["c/file-io", "c/memory"],
      },
      {
        id: "Common_Core-Project-C-Push_Swap",
        name: "push_swap",
        kind: "Project",
        status: "done",
        skills: ["algo/sorting", "algo/complexity", "c/structs"],
      },
      {
        id: "exam---programming-fundamentals",
        name: "Exam — Programming Fundamentals",
        kind: "Exam",
        status: "done",
        skills: [],
      },
    ],
    skills: [
      { id: "c/strings", name: "String manipulation", got: true },
      { id: "c/memory", name: "Memory management", got: true },
      { id: "c/structs", name: "Data structures", got: true },
      { id: "soft/rigor", name: "Rigor", got: true },
      { id: "c/variadic", name: "Variadic functions", got: true },
      { id: "c/file-io", name: "File I/O", got: false },
      { id: "algo/sorting", name: "Sorting algorithms", got: false },
      { id: "algo/complexity", name: "Complexity analysis", got: false },
    ],
    exam: { sessions: 4, free: 2, passed: true, lastScore: 100, lastDay: "Fri 22 Aug" },
  },
  "systems-and-networks-administration": {
    name: "Systems And Networks Administration",
    validation: {
      projects: [
        "Common_Core-Project-Network-Born2beRoot",
        "Common_Core-Project-Network-Net_practice",
        "Common_Core-Project-Network-Inception",
      ],
      exams: ["exam---systems-and-networks-administration"],
    },
    layers: [
      { layer: 1, items: ["exam---systems-and-networks-administration"] },
      { layer: 2, items: ["Common_Core-Project-Network-Born2beRoot"] },
      { layer: 3, items: ["Common_Core-Project-Network-Net_practice"], after: 2 },
      { layer: 4, items: ["Common_Core-Project-Network-Inception"], after: 3 },
    ],
    activities: [
      {
        id: "Common_Core-Project-Network-Born2beRoot",
        name: "born2beroot",
        kind: "Project",
        status: "done",
        attempt: "Feedback needed",
        skills: ["sys/virtualisation", "sys/hardening", "soft/rigor"],
      },
      {
        id: "Common_Core-Project-Network-Net_practice",
        name: "net_practice",
        kind: "Project",
        status: "now",
        attempt: "Under evaluation",
        skills: ["net/subnetting", "net/protocols"],
      },
      {
        id: "Common_Core-Project-Network-Inception",
        name: "inception",
        kind: "Project",
        status: "open",
        attempt: "In progress",
        skills: ["sys/containers", "sys/orchestration"],
      },
      {
        id: "exam---systems-and-networks-administration",
        name: "Exam — Systems And Networks Administration",
        kind: "Exam",
        status: "open",
        skills: [],
      },
    ],
    skills: [
      { id: "sys/virtualisation", name: "Virtualisation", got: true },
      { id: "sys/hardening", name: "System hardening", got: true },
      { id: "soft/rigor", name: "Rigor", got: true },
      { id: "net/subnetting", name: "Subnetting", got: false },
      { id: "net/protocols", name: "Network protocols", got: false },
      { id: "sys/containers", name: "Containers", got: false },
    ],
    exam: { sessions: 3, free: 1 },
  },
}

/** The status vocabulary, kept in one place: the LABEL carries the meaning.
 *  Two semantic exceptions are stated rather than inherited from habit — green on a
 *  terminal validation, and PINK on "in progress", which is this DS's own reading
 *  (`foundations-colors`: green Mastered, pink In progress, and brand blue stays on the
 *  interactive). Everything else is grey. */
export const STATUS_LABEL: Record<Status, string> = {
  validated: "Success",
  progress: "In progress",
  available: "NEW",
  locked: "Locked",
}
export const STATUS_COLOR: Record<Status, "green" | "pink" | "gray"> = {
  validated: "green",
  progress: "pink",
  available: "gray",
  locked: "gray",
}
export const ACT_LABEL: Record<ActStatus, string> = {
  done: "Success",
  now: "In progress",
  open: "NEW",
}
