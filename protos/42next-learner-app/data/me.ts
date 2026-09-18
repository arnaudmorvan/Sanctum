/** Community and profile fixtures.
 *
 *  VISIBILITY, V1 (decision, Emilia 2026-09-03, carried by the artifact): campus,
 *  location, attendance and activities are visible on EVERY profile. V2 gives the learner
 *  a per-block setting. The rule is stated on the screen rather than silently applied —
 *  which is why the profile carries a line about it instead of just showing the blocks. */

export const COALITION = {
  name: "The Federation",
  stats: [
    { k: "Of 4 coalitions", v: "2nd" },
    { k: "Season points", v: "18 420" },
    { k: "Your contribution", v: "340" },
    { k: "Season ends in", v: "12 d" },
  ],
  standings: [
    { name: "The Order", points: "21 106", members: 312, trend: "+1 240" },
    { name: "The Federation", points: "18 420", members: 298, trend: "+980", mine: true },
    { name: "The Alliance", points: "17 880", members: 305, trend: "+1 410" },
    { name: "The Assembly", points: "14 202", members: 289, trend: "+420" },
  ],
}

/** The login carries the identity; the badge carries the only thing that makes a friend
 *  useful right now. */
export const FRIENDS_PAGE = [
  { login: "tlemoine", name: "Théo Lemoine", level: "9.31", status: "In cluster e2 · seat 22" },
  { login: "mchen", name: "Mei Chen", level: "12.04", status: "Offering a slot Fri 14:00" },
  { login: "dvargas", name: "Diego Vargas", level: "10.77", status: "You review them today 14:30", now: true },
  { login: "sbernard", name: "Sofia Bernard", level: "8.62", status: "Offline" },
]

export const CLUBS = [
  { name: "Algo club", cadence: "Weekly · Tue 18:00", members: "24 members" },
  { name: "CTF / security", cadence: "Bi-weekly", members: "41 members" },
  { name: "Game jam", cadence: "Monthly", members: "58 members" },
]

export const ANNOUNCEMENTS = [
  {
    title: "Cluster e2 closed Friday",
    body: "Network maintenance 08:00–14:00. Book elsewhere for reviews.",
    when: "2 h ago",
    kind: "warning" as const,
  },
  {
    title: "Exam 03 sessions published",
    body: "Three sessions this month, 32 seats each.",
    when: "Yesterday",
    kind: "info" as const,
  },
  {
    title: "New: mid-review available on rank 03+",
    body: "Ask for formalised help mid-attempt without affecting validation.",
    when: "3 d ago",
    kind: "info" as const,
  },
]

/** The cluster: 120 seats, mine is 42, four friends are in, and the rest of the
 *  occupancy is the artifact's own `i * 7 % 3` pattern — kept so the map has the same
 *  density it had. */
export const CLUSTER = {
  room: "Paris e1",
  seats: 120,
  mine: 41,
  friends: [12, 38, 57, 88],
}

export const ME = {
  login: "erizzi",
  name: "Emilia Rizzi",
  level: "11.42",
  xp: "4 280 / 10 000",
  xpPct: 42,
  campus: "Paris",
  program: "Common core",
  day: 268,
  milestone: "Milestone 3",
  milestonePct: 65,
  seat: "e1 · seat 42",
}

export const SKILL_STATS = [
  { k: "Technical acquired", v: "18" },
  { k: "Power skills acquired", v: "6" },
  { k: "Remaining", v: "10" },
  { k: "One condition away", v: "3" },
]

export const TECHNICAL = [
  "Rigor",
  "Algorithms & AI",
  "Imperative programming",
  "Unix",
  "Concurrency",
  "Graphics",
  "Network & system administration",
  "Object-oriented programming",
  "Security",
  "Web",
  "DB & data",
  "Parallel computing",
]
export const TECHNICAL_GOT = 8

export const POWER = [
  "Adaptability",
  "Collaboration",
  "Communication",
  "Resilience",
  "Leadership",
  "Mentoring",
  "Initiative",
]
export const POWER_GOT = 6

/** ⚠️ A language is CONTINUOUS, a skill is not. `context/product/index-product.md` lists
 *  "are skills binary?" as an unresolved contradiction — so skills are shown as STATUSES
 *  and only language mastery carries a percentage. Flagged, not settled here. */
export const LANGUAGES = [
  { name: "C", pct: 62 },
  { name: "C++", pct: 24 },
  { name: "Shell", pct: 41 },
  { name: "Python", pct: 15 },
]

export const XP_LOG = [
  { source: "philosophers · 115", date: "Aug 12", xp: "+ 1 380", level: "11.42" },
  { source: "Exam 02 · validated", date: "Jun 11", xp: "+ 900", level: "10.88" },
  { source: "push_swap · 100", date: "Jun 02", xp: "+ 1 120", level: "10.41" },
  { source: "so_long · 125", date: "May 18", xp: "+ 1 240", level: "9.94" },
]

export const ACHIEVEMENTS = [
  { t: "Night owl", d: "12 pushes after 03:00", state: "Unlocked" },
  { t: "Good samaritan", d: "50 reviews given", state: "Unlocked" },
  { t: "On time", d: "30 reviews started on time", state: "Unlocked" },
  { t: "Asked for help", d: "First mid-review requested", state: "Unlocked" },
  { t: "Rush veteran", d: "6 rushes completed", state: "5 / 6", pct: 83 },
  { t: "Cross-campus", d: "Review someone from another campus", state: "Locked" },
]

export const ATT_FIGURES = [
  { k: "Average day", v: "6 h 40", sub: "on days you came" },
  { k: "Average week", v: "29 h", sub: "over the year" },
  { k: "Average month", v: "126 h", sub: "over the year" },
  { k: "Longest streak", v: "18 d", sub: "Feb → Mar 2026" },
]
export const ATT_TODAY = { range: "09:12 → 18:40", hours: "9 h 28", streak: 6, filled: 9 }
export const ATT_MONTH = { days: 21, of: 30, hours: 138 }
export const ATT_BY_MONTH = [
  { m: "Oct", h: 96 },
  { m: "Nov", h: 128 },
  { m: "Dec", h: 74 },
  { m: "Jan", h: 142 },
  { m: "Feb", h: 151 },
  { m: "Mar", h: 137 },
  { m: "Apr", h: 118 },
  { m: "May", h: 133 },
  { m: "Jun", h: 129 },
  { m: "Jul", h: 88 },
  { m: "Aug", h: 121 },
  { m: "Sep", h: 64 },
]

export const PAPERWORK = [
  { doc: "Student card 2026–27", kind: "Issued to you", deadline: "—", status: "Available", action: "Download" },
  { doc: "Proof of enrolment", kind: "Issued to you", deadline: "—", status: "Available", action: "Download" },
  {
    doc: "Civil liability insurance",
    kind: "You provide",
    deadline: "Sep 15",
    status: "Missing",
    action: "Upload",
    owed: true,
  },
  {
    doc: "Internship agreement",
    kind: "You provide",
    deadline: "Oct 01",
    status: "Draft",
    action: "Continue",
    owed: true,
  },
]

/** My recent activities — the artifact's filtered log. `f` is the family, `o` the
 *  outcome; both are what its two dropdowns filtered on. */
export type LogRow = { when: string; what: string; family: string; outcome: string }
export const ACTIVITY_LOG: LogRow[] = [
  { when: "Today · 11:24", what: "net_practice — attempt submitted", family: "Project", outcome: "Under evaluation" },
  { when: "Yesterday · 16:02", what: "Review given to lpetrov — so_long", family: "Review", outcome: "Done" },
  { when: "Mon 14 Sep · 09:41", what: "born2beroot — reviews passed", family: "Project", outcome: "Feedback needed" },
  { when: "Fri 11 Sep · 18:20", what: "Exam 02 — 100/100", family: "Exam", outcome: "Validated" },
  { when: "Thu 10 Sep · 14:05", what: "Review received from mchen — Libft", family: "Review", outcome: "Done" },
  { when: "Tue 08 Sep · 10:30", what: "cub3d — attempt failed", family: "Project", outcome: "Failed" },
  { when: "Mon 07 Sep · 19:15", what: "Rush — Rosetta stone completed", family: "Rush", outcome: "Validated" },
  { when: "Sat 05 Sep · 12:00", what: "Slot opened — any rank 02–03", family: "Review", outcome: "Open" },
]
export const LOG_FAMILIES = ["All", "Project", "Review", "Exam", "Rush"]

export const PROGRAMS_TIMELINE = [
  { name: "Common core", when: "Jan 26 → now", status: "In progress" },
  { name: "C Piscine", when: "Nov 25 → Dec 25", status: "Validated" },
  { name: "Discovery", when: "Oct 25", status: "Validated" },
]

export const VALIDATED = [
  { name: "philosophers", score: 115, when: "Aug 12" },
  { name: "push_swap", score: 100, when: "Jun 02" },
  { name: "so_long", score: 125, when: "May 18" },
  { name: "get_next_line", score: 108, when: "Apr 04" },
  { name: "ft_printf", score: 118, when: "Mar 12" },
  { name: "libft", score: 112, when: "Feb 02" },
]
