export type Intensity = "none" | "low" | "medium" | "high" | "peak"

/** Attendance intensity ramp. The 42next-profile report names it
 *  utility-pink-100/300/500/700 plus an empty level. The DS does not expose that
 *  scale yet: it is mapped here, so it stays fixable in one line. */
export const INTENSITY_CLASS: Record<Intensity, string> = {
  none: "bg-gray-700",
  low: "bg-pink-800",
  medium: "bg-pink-700",
  high: "bg-pink-500",
  peak: "bg-pink-300",
}

export const LEARNER = {
  login: "aserrano",
  name: "Amanda Serrano",
  initials: "AS",
  presence: "Paris campus - workstation e1r7p12 - online now",
  level: 7,
  xp: "7.42",
  levelPct: 42,
  track: "Common core - started October 2025 - Paris campus.",
}

export const MILESTONE = {
  name: "Milestone 3 - Unix & processes",
  label: "Required skills validated",
  validated: 8,
  required: 10,
  note: "40 working days of reference - 28 elapsed - a milestone never blocks progression, it shows pace.",
}

export type Activity = {
  slug: string
  name: string
  context: string
  score: string
  outOf: string
}

export const CURRENT = {
  slug: "minishell",
  name: "minishell",
  context: "Common core - Module 4 - Unix & processes - in team with bmartin - started 6 days ago",
  attempt: "Attempt 2",
  label: "Validation requirements met",
  met: 4,
  total: 7,
  teammate: "bmartin",
  requirements: [
    { label: "Repository pushed and buildable", done: true },
    { label: "Norm respected across every file", done: true },
    { label: "No leak on the reference test suite", done: true },
    { label: "Builtins implemented", done: true },
    { label: "Pipes and redirections", done: false },
    { label: "Signal handling", done: false },
    { label: "Peer review passed", done: false },
  ],
}

export const ACTIVITIES: Activity[] = [
  { slug: "philosophers", name: "Philosophers", context: "Common core - Module 4 - 3 attempts before validation", score: "125", outOf: "100" },
  { slug: "push-swap", name: "push_swap", context: "Common core - Module 3 - 1 attempt before validation", score: "110", outOf: "100" },
  { slug: "get-next-line", name: "get_next_line", context: "Common core - Module 2 - 2 attempts before validation", score: "100", outOf: "100" },
  { slug: "libft", name: "libft", context: "Common core - Module 1 - 1 attempt before validation", score: "115", outOf: "100" },
]

/** Narrow date column: short format imposed by the report (Oct 25, not Oct. 2025). */
export const PROGRAMS = [
  { name: "Common core", start: "10/25", end: "now", detail: "In progress - Paris - milestone 3 of 9 - 7 activities validated", active: true },
  { name: "Web Discovery Piscine", start: "09/25", end: "09/25", detail: "Interrupted after 4 days - no validation", active: true },
  { name: "Selection Piscine", start: "07/25", end: "08/25", detail: "Ended - validated - 54 / 100 - selected for the Common core", active: false },
]

export const STATS = [
  { label: "Reviews given", detail: "to peers, all programs", value: "47" },
  { label: "Projects", detail: "validated, all attempts counted", value: "12" },
  { label: "Exams", detail: "passed out of 4 sat", value: "3" },
]

export const ELSEWHERE = [
  { label: "SKILLS", note: "The full skill tree and what each activity validated." },
  { label: "LEVEL & XP", note: "How level 7.42 was reached, activity by activity." },
  { label: "ACHIEVEMENTS", note: "Badges earned across programs." },
  { label: "ATTENDANCE", note: "Every session, filterable by day, week and month." },
]

export const ATTENDANCE_VIEWS = ["Daily", "Weekly", "Monthly", "All time"]
export const ATTENDANCE_TOTAL = "312H"
export const ATTENDANCE_NOTE = "on campus over the last 6 months"
export const ATTENDANCE_LEGEND = "One square per day, Monday at the top. Weeks run left to right - the last two are still to come."

const WEEKS = 26
const DAYS = 7

const draw = (seed: number) => () => {
  seed = (seed * 48271) % 2147483647
  return seed / 2147483647
}

/** Emptiness has to stay in the majority: roughly 45 % of non-empty cells,
 *  hollow weekends, last two weeks still to come. */
export const buildAttendance = (): Intensity[][] => {
  const next = draw(4242)
  return Array.from({ length: DAYS }, (_, day) =>
    Array.from({ length: WEEKS }, (_, week): Intensity => {
      if (week >= WEEKS - 2) return "none"
      const t = next()
      if (day >= 5) return t > 0.88 ? "low" : "none"
      if (t > 0.88) return "peak"
      if (t > 0.75) return "high"
      if (t > 0.6) return "medium"
      if (t > 0.45) return "low"
      return "none"
    }),
  )
}
