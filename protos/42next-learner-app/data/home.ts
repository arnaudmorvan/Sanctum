/** Home fixtures — the rows the artifact's own derivations RESOLVED TO.
 *
 *  The artifact computed this screen at render time out of live structures
 *  (`ATTEMPTS`, `PROGRAMS`, `FEEDBACK_TODO`, `UPCOMING_REVIEWS`, `CAMPUS_EVENTS`,
 *  `EXAM_SESSIONS`). A flow does not need the derivation: what the PO judges is the
 *  screen, so the computed rows are frozen here as the data they resolved to on the
 *  artifact's demo state. Everything below is INVENTED demo data, exactly as it was
 *  there — five to eight rows per list, per the skill. */

export const HERO = {
  greeting: "Good afternoon",
  login: "erizzi",
  program: "Common core",
  day: 268,
  level: "11.42",
  milestone: "M3",
  milestonePct: 65,
  yams: "Lag",
}

export const QUOTE = "Segfault is just the computer asking you to be more specific."

export type Win = {
  kind: "project" | "exam" | "milestone" | "gift"
  name: string
  when: string
  note?: string
}
/** The artifact's `recentWins()`: the four most recent closings of the CURRENT program,
 *  whatever their nature — a validated project, a passed exam, a validated milestone, and
 *  a thank-you a peer sent through their own attempt feedback. */
export const WINS: Win[] = [
  { kind: "gift", name: "anskywa sent you pizza", when: "Sat 30 Aug" },
  { kind: "project", name: "philosophers", when: "Thu 28 Aug" },
  { kind: "exam", name: "Exam 02", when: "Fri 22 Aug", note: "100 / 100" },
  { kind: "milestone", name: "Milestone 2", when: "Fri 11 Jul" },
]

export type AgendaRow = {
  day: string
  at: string
  dur?: string
  kind: "give" | "get" | "event" | "exam"
  title: string
  sub?: string
  note?: string
  cta?: string
}
/** `agendaEvents()` — booked reviews (45 min slots), campus events, and an exam whose
 *  registration window is open. Only the review that can actually be STARTED carries a
 *  button; the rest are information. */
export const COMING_UP: AgendaRow[] = [
  {
    day: "Today",
    at: "14:30",
    dur: "45 min",
    kind: "give",
    title: "Review dvargas — a_maze_ing",
    sub: "Paris · cluster e1 · seat 42",
    note: "Starts in 25 min",
    cta: "Start review",
  },
  {
    day: "Today",
    at: "16:30",
    dur: "45 min",
    kind: "get",
    title: "Reviewed by tlefevre — sky_scraper",
    sub: "Paris · cluster e2 · seat 17",
  },
  {
    day: "Fri 04 Sep",
    at: "15:00",
    dur: "45 min",
    kind: "get",
    title: "Reviewed by yhassan — net_practice",
    sub: "Paris · cluster e1 · seat 08",
  },
  {
    day: "Fri 04 Sep",
    at: "18:00",
    dur: "2 h",
    kind: "event",
    title: "Hackathon kick-off",
    sub: "Paris · agora",
  },
  {
    day: "Mon 07 Sep",
    at: "10:30",
    dur: "45 min",
    kind: "give",
    title: "Review nkovacs — born2beroot",
    sub: "Paris · cluster e3",
  },
  {
    day: "Mon 07 Sep",
    at: "19:00",
    dur: "1 h 30",
    kind: "event",
    title: "Alumni talk — infra at scale",
    sub: "Paris · auditorium",
  },
  {
    day: "Thu 10 Sep",
    at: "09:00",
    dur: "3 h",
    kind: "exam",
    title: "Exam 03",
    sub: "Paris · cluster e1 · registration closes 08 Sep",
    note: "Registration open",
    cta: "Register",
  },
]

export type OwedRow = {
  title: string
  days: number
  action: string
  peer?: string
  group?: string[]
}
/** `todoOwed()` — what someone is WAITING for, oldest first. Post-review feedback is
 *  mandatory in both directions, and an attempt also asks who helped you on it. Only the
 *  two oldest peer items surface: this panel is a nudge, not the full list, which lives
 *  in Review > Given / Received. */
export const OWED: OwedRow[] = [
  { peer: "lorgana", days: 10, title: "Review received on Libft", action: "Give feedback" },
  {
    peer: "luskywa",
    group: ["luskywa", "anskywa", "tlefevre"],
    days: 6,
    title: "Review you gave on so_long",
    action: "Give feedback",
  },
  { days: 1, title: "Who helped you on Rosetta stone?", action: "Give feedback" },
]

export type Suggestion = {
  kind: "retry" | "feedback" | "module" | "project" | "schedule"
  title: string
  sub: string
  action: string
}
/** `todoSuggest()` — available, NOT owed: nobody is blocked by these and they do not age,
 *  which is why the artifact gave them a panel of their own rather than a zone inside
 *  Action required. A failed project belongs here — nothing is in flight, there is a next
 *  move to offer, and the copy says out loud that a failure is not a verdict. */
export const SUGGESTIONS: Suggestion[] = [
  {
    kind: "retry",
    title: "Start a new attempt on cub3d",
    sub: "Failure is part of the process.",
    action: "Start",
  },
  {
    kind: "feedback",
    title: "Project feedback",
    sub: "Give feedback on the content of so_long · v1.2.0",
    action: "Give feedback",
  },
  {
    kind: "module",
    title: "Register to Algorithmics",
    sub: "Next module in your program",
    action: "Register",
  },
  {
    kind: "project",
    title: "Start pacman",
    sub: "Object-oriented programming",
    action: "Start",
  },
  {
    kind: "schedule",
    title: "Schedule a review for Inception",
    sub: "Systems & networks administration",
    action: "Schedule",
  },
]

export type WipRow = {
  name: string
  module: string
  since: number
  status: string
  milestone: string | null
  peers: string[]
}
/** `projectsInProgress()` — a project is in progress when its LAST attempt is. `hold`
 *  counts: the learner still has something to do before the attempt closes, which is
 *  exactly what this section is for. The milestone chip says what the project counts
 *  towards. */
export const WIP: WipRow[] = [
  {
    name: "born2beroot",
    module: "Systems & networks administration",
    since: 21,
    status: "Feedback needed",
    milestone: "M4",
    peers: [],
  },
  {
    name: "net_practice",
    module: "Systems & networks administration",
    since: 12,
    status: "Under evaluation",
    milestone: "M5",
    peers: ["anskywa", "luskywa", "lorgana", "tlefevre"],
  },
  {
    name: "Inception",
    module: "Systems & networks administration",
    since: 6,
    status: "In progress",
    milestone: "M5",
    peers: ["pamidal", "yhassan", "nkovacs"],
  },
  {
    name: "minishell",
    module: "Programming Fundamentals",
    since: 3,
    status: "In progress",
    milestone: null,
    peers: [],
  },
]

/** `friendsList()` — everyone crossed paths with lately: reviews given or received, and
 *  peers on a project currently open. Logins only: the point is who, not what for. Capped
 *  at eight — a glance, not a directory. */
export const FRIENDS: string[] = [
  "lorgana",
  "luskywa",
  "anskywa",
  "pamidal",
  "dvargas",
  "tlefevre",
  "jokafor",
  "yhassan",
]
