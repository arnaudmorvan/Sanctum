export type MilestoneState = "validated" | "current" | "locked"

/** Demo data — 5 to 8 rows per list, the minimum that makes the screen plausible.
 *  Vocabulary from context/product: module, activity, attempt, review, milestone,
 *  exam. « review », never « evaluation ». */
export const LEARNER = {
  login: "alefevre",
  name: "Amanda Lefèvre",
  campus: "Paris · e1 · seat 42",
  program: "Common core",
  milestone: "Milestone 03 — Network & Web",
  level: 7,
  levelPct: 83,
  xp: "2 480 / 3 000 XP",
  attendance: "38h / 40h",
  attendanceNote: "This week on campus",
}

export const NEXT_QUEST = {
  module: "Web server from scratch",
  slug: "web-server-from-scratch",
  activity: "Activity 03 — HTTP routing",
  note: "The last attempt scored 82 and unlocked the review step. Two peer reviews seal the activity.",
  validated: 3,
  total: 7,
  closesIn: "CLOSES IN 6 DAYS",
}

export const MILESTONES: {
  name: string
  stamp: string
  status: string
  detail: string
  validated: number
  required: number
  state: MilestoneState
}[] = [
  { name: "Milestone 01 — Fundamentals", stamp: "Mar 26", status: "Validated", detail: "Sealed on Mar 12, 2026", validated: 6, required: 6, state: "validated" },
  { name: "Milestone 02 — Systems", stamp: "Jul 26", status: "Validated", detail: "Sealed on Jul 4, 2026", validated: 5, required: 5, state: "validated" },
  { name: "Milestone 03 — Network & Web", stamp: "Now", status: "In progress", detail: "Exam 01 seals this milestone", validated: 5, required: 8, state: "current" },
  { name: "Milestone 04 — Specialisation", stamp: "Later", status: "Locked", detail: "Opens once Exam 01 is passed", validated: 0, required: 6, state: "locked" },
]

export const QUESTS = [
  { name: "Web server from scratch", slug: "web-server-from-scratch", detail: "Activity 03 · 2 reviews to collect", pct: 43, action: "Resume" },
  { name: "Concurrency & threads", slug: "concurrency-and-threads", detail: "Attempt open · closes Sep 22, 2026 at 11:42 PM", pct: 71, action: "Submit attempt" },
  { name: "Shell 02", slug: "shell-02", detail: "Waiting for the moulinette · queued 18 min ago", pct: 90, action: "See attempt" },
]

export const REVIEWS = [
  { label: "You review Noah B. — ft_printf", when: "Today at 4:30 PM · e1 · seat 42", kind: "Given" },
  { label: "Lina K. reviews you — minishell", when: "Fri Sep 19 at 11:00 AM", kind: "Received" },
  { label: "Web server from scratch", when: "2 reviewers still to book", kind: "To book" },
]

export const AGENDA_NEXT = {
  stamp: "Thu Sep 24 · 9:00 AM",
  label: "Exam 01",
  note: "Cluster e1 · registration confirmed",
}

export const SKILLS: { name: string; status: string }[] = [
  { name: "Algorithms & AI", status: "Acquired" },
  { name: "Network & system", status: "In progress" },
  { name: "Rigor", status: "Acquired" },
  { name: "Web", status: "In progress" },
  { name: "Object-oriented programming", status: "Available" },
]

export const SKILLS_COUNT = "12 / 24"

export const ACHIEVEMENTS = [
  { label: "Milestone 02 sealed", date: "Jul 4, 2026", xp: "+300 XP" },
  { label: "10 reviews given", date: "Sep 9, 2026", xp: "+120 XP" },
  { label: "First exam passed", date: "Jun 18, 2026", xp: "+200 XP" },
]
