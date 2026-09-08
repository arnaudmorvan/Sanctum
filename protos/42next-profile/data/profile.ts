/** 42next — learner profile · DEMO DATA
 *
 *  Every value below is LIFTED from Figma frame 22489:9756 (Amanda Serrano,
 *  login `aserrano`). Nothing here is a plausible-looking substitute: a proto
 *  shown for review carries the mockup's own content, so that a disagreement is
 *  about the design and never about the data.
 *
 *  The ONE exception is the attendance grid, which is generated (see the bottom
 *  of this file): 182 cells cannot be lifted one by one, and the frame only
 *  states their density.
 */

export const LEARNER = {
  login: "aserrano",
  name: "Amanda Serrano",
  presence: "Paris campus · workstation e1r7p12 · online now",
  level: 7,
  /** Level 7.42 — the decimals are the progress towards level 8. */
  xp: "7.42",
  levelPct: 42,
  track: "Common core · started October 2025 · Paris campus.",
  /** The frame's photo (_Avatar photos, photo=Olivia Rhye), served by the site.
   *  `name` stays set on <Avatar>: it is the initials fallback. */
  avatar: "/avatars/olivia-rhye.webp",
}

/** THE ENTRY POINT of the screen. It is the only activity that is not finished,
 *  and it is what the whole composition now leads with. */
export const CURRENT = {
  slug: "minishell",
  name: "minishell",
  attempt: "Attempt 2",
  context:
    "Common core · Module 4 — Unix & processes · in team with bmartin · started 6 days ago",
  label: "Validation requirements met",
  met: 4,
  total: 7,
}

export const MILESTONE = {
  name: "Milestone 3 — Unix & processes",
  label: "Required skills validated",
  validated: 8,
  required: 10,
  daysElapsed: 28,
  daysReference: 40,
  note: "40 working days of reference · 28 elapsed · a milestone never blocks progression, it shows pace.",
}

/** The proven past. Four rows in ONE card — in the frame they were four
 *  full-width cards, which gave the heaviest block of the screen to what is
 *  already done. */
export const ACTIVITIES = [
  {
    slug: "philosophers",
    name: "Philosophers",
    context: "Common core · Module 4 · 3 attempts before validation",
    score: 125,
    outOf: 100,
  },
  {
    slug: "push_swap",
    name: "push_swap",
    context: "Common core · Module 3 · 1 attempt before validation",
    score: 110,
    outOf: 100,
  },
  {
    slug: "get_next_line",
    name: "get_next_line",
    context: "Common core · Module 2 · 2 attempts before validation",
    score: 100,
    outOf: 100,
  },
  {
    slug: "libft",
    name: "libft",
    context: "Common core · Module 1 · 1 attempt before validation",
    score: 115,
    outOf: 100,
  },
]

export const PROGRAMS = [
  {
    name: "Common core",
    start: "10/25",
    end: "now",
    detail: "In progress · Paris · milestone 3 of 9 · 7 activities validated",
    active: true,
  },
  {
    name: "Web Discovery Piscine",
    start: "09/25",
    end: "09/25",
    detail: "Interrupted after 4 days · no validation",
    active: false,
  },
  {
    name: "Selection Piscine",
    start: "07/25",
    end: "08/25",
    detail: "Ended · validated · 54 / 100 · selected for the Common core",
    active: false,
  },
]

/** `icon` is a key, not a node: this is a .ts file, the page resolves it to a
 *  lucide component. */
export const STATS = [
  { label: "Reviews given", detail: "to peers, all programs", value: 47, icon: "reviews" },
  { label: "Projects", detail: "validated, all attempts counted", value: 12, icon: "projects" },
  { label: "Exams", detail: "passed out of 4 sat", value: 3, icon: "exams" },
] as const

/** Cross-references to the sibling pages of `My activities`. They are INERT on
 *  purpose: this proto holds two screens, and a link that leads nowhere is
 *  worse than a label that never promised to. */
export const ELSEWHERE = [
  { label: "Skills", note: "The full skill tree and what each activity validated." },
  { label: "Level & XP", note: "How level 7.42 was reached, activity by activity." },
  { label: "Achievements", note: "Badges earned across programs." },
  { label: "Attendance", note: "Every session, filterable by day, week and month." },
]

export const ATTENDANCE_VIEWS = ["Daily", "Weekly", "Monthly", "All time"]
export const ATTENDANCE_TOTAL = "312H"
export const ATTENDANCE_NOTE = "on campus over the last 6 months"
export const ATTENDANCE_LEGEND =
  "One square per day, Monday at the top. Weeks run left to right — the last two are still to come."

/** THE INTENSITY RAMP.
 *  `foundations-colors` records two measurements on this exact grid: the pink
 *  ramp is already too warm at step 1 in dark mode, and the right density is
 *  around 45 % of non-empty cells, weekends deliberately hollow. So step 1 is
 *  a quarter-opacity pink, not a named step, and the void stays in the
 *  majority — a grid where colour is everywhere states nothing.
 *  No hex: theme colour + Tailwind opacity modifier. */
export const INTENSITY_CLASS = {
  none: "bg-white/5",
  low: "bg-pink-400/25",
  medium: "bg-pink-400/45",
  high: "bg-pink-400/70",
  peak: "bg-pink-300",
} as const

export type Intensity = keyof typeof INTENSITY_CLASS

const WEEKS = 26
const DAYS = 7

/** Deterministic on purpose: the same grid on every render. A Math.random()
 *  grid re-rolls on each re-render and makes two screenshots of the same proto
 *  disagree. */
const noise = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** 7 rows (Monday at the top) × 26 weeks = 182 cells, as the frame states.
 *  Measured density of this generator: ~47 % non-empty. */
export const buildAttendance = (): Intensity[][] =>
  Array.from({ length: DAYS }, (_, day) =>
    Array.from({ length: WEEKS }, (_, week): Intensity => {
      if (week >= WEEKS - 2) return "none" // the last two weeks are still to come
      if (day >= 5) return "none" // Saturday and Sunday stay hollow
      const r = noise(day * WEEKS + week + 1)
      if (r < 0.28) return "none"
      if (r < 0.5) return "low"
      if (r < 0.72) return "medium"
      if (r < 0.9) return "high"
      return "peak"
    }),
  )
