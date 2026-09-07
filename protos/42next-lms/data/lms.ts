/** Data lifted from the HTML prototypes of `_oldProto/` (42next-lms-proto-01..08), which
 *  were EIGHT copies of one and the same app: identical byte for byte apart from their
 *  `<title>` and the initial value of `route`. The copy of the prototype IS the copy of
 *  the code — nothing is rewritten here, only typed.
 *
 *  What lives here is what the prototype held in the globals of its `<script>`: the
 *  fixtures of the screens that had not yet been ported (dashboard, progression, review,
 *  exams, agenda, community, paperwork). The screens already ported keep their own file
 *  — `learn.ts`, `profile.ts`, `quest-map.ts`. */

import type { Color } from "@42/ui-react"

/** The four tones the prototype's stat tiles carried, as CSS classes (`stat s|w|b|v`).
 *  Mapped ONCE here so a tile never picks its colour on the spot. */
export type Tone = "success" | "warning" | "brand" | "violet"

export const TONE_COLOR: Record<Tone, Color> = {
  success: "green",
  warning: "orange",
  brand: "brand",
  violet: "purple",
}

export const ME = "erizzi"

/** The identity line of the home hero: program, day count, level, milestone. */
export const HERO = {
  greeting: "Good evening",
  login: ME,
  program: "Common core",
  day: 268,
  level: "11.42",
  milestone: "M3",
  milestonePct: 65,
  yams: "Lag",
}

export const QUOTE = "Segfault is just the computer asking you to be more specific."

/* ── PROGRESSION ─────────────────────────────────────────────────────────── */

export const YAMS = {
  updatedAt: "Monday 2 Jun 2026, 08:00",
  cadence: "Data is updated weekly",
  status: "Lag",
  statusBody: "Anything getting in the way right now?",
  milestone: "Milestone 3",
  milestonePct: 65,
  elapsed: "48 days",
  estimated: "52 days",
  reference: "This status is based on the 42 reference pace (40h/week).",
  projectedEnd: "Nov 12, 2027",
  projectedNote: "within the 24-month maximum",
  commonCorePct: 38,
}

/** The seven variance qualities the prototype let you preview from a switch bar.
 *  Kept as data: they are the vocabulary of YAMS, not a demo gadget. */
export const VARIANCE = [
  "Significant Lead",
  "Lead",
  "Expected",
  "Lag (blue)",
  "Lag (pink)",
  "Lag (amber)",
  "Significant Lag",
]

export type ProjectRow = { name: string; skills: string; status: string; tone: Color }

export const MILESTONE_PROJECTS: ProjectRow[] = [
  { name: "Born2beroot", skills: "Virtualization, SSH hardening…", status: "Success", tone: "green" },
  { name: "Philosophers", skills: "Threads, mutexes…", status: "To do", tone: "gray" },
  { name: "minishell", skills: "Processes, parsing…", status: "To do", tone: "gray" },
]

export const ENGAGEMENT = {
  attendance: {
    avg: 29,
    caption: "/week avg · last 4 weeks",
    note: "YAMS uses this 4-week average.",
    disclaimer:
      "This attendance figure uses more data than the one on your profile page, so the two may differ. When they don't match, trust this one — we're working on aligning them.",
    updated: "Last updated 5 Jun 2026, 14:12",
    weeks: [24, 31, 27, 34],
  },
  reviews: {
    done: 1,
    target: 2,
    note: "Target: 2 reviews/week",
    disclaimer:
      "Reviews are how the community learns together — they sharpen your own understanding and help peers move forward. Aim for at least 2 each week.",
  },
}

/** The Common Core curriculum as the milestones screen draws it: modules, their hour
 *  budget, and the projects they chain. */
export const CURRICULUM: { module: string; hours: string; projects: { name: string; hours: string }[] }[] = [
  {
    module: "Programming Fundamentals",
    hours: "240h",
    projects: [
      { name: "Libft", hours: "70h" },
      { name: "ft_printf", hours: "70h" },
      { name: "get_next_line", hours: "100h" },
    ],
  },
  {
    module: "Object Oriented Programming",
    hours: "270h",
    projects: [
      { name: "Python Piscine", hours: "70h" },
      { name: "A-Maze-ing", hours: "50h" },
      { name: "Pac Man", hours: "150h" },
    ],
  },
  {
    module: "Algorithmics",
    hours: "190h",
    projects: [
      { name: "push_swap", hours: "70h" },
      { name: "fly-in", hours: "120h" },
    ],
  },
]

export const SCENARIOS: { label: string; end: string; body: string; tone: Tone }[] = [
  {
    label: "1 activity / week",
    end: "End Feb 2027",
    body: "Four months early. Sustainable only if review debt stays at zero.",
    tone: "success",
  },
  {
    label: "Current rhythm",
    end: "End Jun 2027",
    body: "1.4 activities per two weeks. Twelve days of slack kept.",
    tone: "brand",
  },
  {
    label: "1 activity / month",
    end: "End Feb 2028",
    body: "Outside the envelope from November onward.",
    tone: "warning",
  },
]

export const SIM_SLIDERS = [
  { label: "Activities per two weeks", value: "1.4", pct: 47 },
  { label: "Reviews given per week", value: "2.4", pct: 60 },
  { label: "Days off per month", value: "4", pct: 30 },
]

/* ── REVIEW ──────────────────────────────────────────────────────────────── */

export const REVIEW_STATS: { v: string; k: string; tone: Tone }[] = [
  { v: "94%", k: "Started on time", tone: "success" },
  { v: "4", k: "Review points", tone: "warning" },
  { v: "2.4", k: "Per week", tone: "brand" },
  { v: "7", k: "Most in 24 h", tone: "violet" },
  { v: "48 min", k: "Median duration", tone: "brand" },
  { v: "106", k: "Avg score given", tone: "success" },
]

export const REVIEW_RHYTHM = [
  {
    label: "Reviews given this month",
    value: "10 / 8 target",
    pct: 100,
    body: "You are above the campus median (6). Giving reviews is what keeps the queue moving.",
  },
  {
    label: "Post-review feedback completed",
    value: "17 / 18",
    pct: 94,
    body: "One feedback form still open. It is mandatory on every review, in both directions.",
  },
]

export const REVIEW_RULES = [
  {
    title: "The questions come from the project",
    body: "Each project defines its own set of questions. Answers are yes/no or a rating scale. A general comment at the end is mandatory — it is not counted in the score.",
  },
  {
    title: "Post-review feedback is mutual",
    body: "Three closed questions, both directions, on every review and every program. Reviewers can additionally flag concerning behaviour or can't explain their code.",
  },
]

/** The flags a reviewer raises before validating — the prototype's own badge set. */
export const REVIEW_FLAGS: { label: string; color: Color }[] = [
  { label: "exceptional", color: "purple" },
  { label: "ok", color: "gray" },
  { label: "forbidden function", color: "red" },
  { label: "crash", color: "red" },
  { label: "memory leak", color: "red" },
  { label: "incomplete group", color: "orange" },
]

export const RECEIVED_STATS: { v: string; k: string; tone: Tone }[] = [
  { v: "18", k: "Received", tone: "brand" },
  { v: "109", k: "Avg score", tone: "success" },
  { v: "3", k: "Exceptional flags", tone: "violet" },
  { v: "1", k: "Feedback to give", tone: "warning" },
]

export type ReceivedRow = {
  date: string; peer: string; activity: string
  score: string; scoreColor: Color
  flag: string; flagColor: Color
  feedback: string; feedbackColor: Color
}

export const RECEIVED: ReceivedRow[] = [
  { date: "Aug 19", peer: "sbernard", activity: "Libft", score: "104", scoreColor: "green", flag: "exceptional", flagColor: "purple", feedback: "Given", feedbackColor: "green" },
  { date: "Aug 18", peer: "mchen", activity: "Libft", score: "112", scoreColor: "green", flag: "ok", flagColor: "gray", feedback: "Pending", feedbackColor: "orange" },
  { date: "Aug 04", peer: "lpetrov", activity: "ft_printf", score: "118", scoreColor: "green", flag: "ok", flagColor: "gray", feedback: "Given", feedbackColor: "green" },
  { date: "Jul 28", peer: "akaya", activity: "ft_printf", score: "62", scoreColor: "red", flag: "crash", flagColor: "red", feedback: "Given", feedbackColor: "green" },
]

export const UPCOMING_REVIEWS = [
  {
    title: "dvargas — philosophers",
    sub: "Today 16:30 · cluster e1 · seat 42",
    badge: "In 4 h",
    color: "orange" as Color,
    urgent: true,
  },
  {
    title: "jokafor — push_swap",
    sub: "Tue 25 · 11:00 · cluster e2",
    badge: "Scheduled",
    color: "brand" as Color,
    urgent: false,
  },
]

export type GivenRow = {
  date: string; peer: string; activity: string
  score: string; scoreColor: Color
  onTime: string; onTimeColor: Color
}

export const GIVEN: GivenRow[] = [
  { date: "Aug 15", peer: "lpetrov", activity: "so_long", score: "125", scoreColor: "green", onTime: "Yes", onTimeColor: "green" },
  { date: "Aug 14", peer: "akaya", activity: "get_next_line", score: "88", scoreColor: "orange", onTime: "Yes", onTimeColor: "green" },
  { date: "Aug 11", peer: "mchen", activity: "born2beroot", score: "100", scoreColor: "green", onTime: "Late 8 min", onTimeColor: "orange" },
  { date: "Aug 07", peer: "tlemoine", activity: "Libft", score: "115", scoreColor: "green", onTime: "Yes", onTimeColor: "green" },
]

export const AVAILABILITY_STATS: { v: string; k: string; tone: Tone }[] = [
  { v: "3", k: "Slots open", tone: "brand" },
  { v: "2", k: "Booked", tone: "success" },
  { v: "14", k: "Peers waiting", tone: "warning" },
  { v: "4", k: "Points balance", tone: "violet" },
]

export const SLOTS: { when: string; duration: string; scope: string; status: string; color: Color; action: string }[] = [
  { when: "Today 16:30", duration: "1 h", scope: "philosophers", status: "Booked · dvargas", color: "green", action: "Reschedule" },
  { when: "Tue 25 · 11:00", duration: "1 h", scope: "push_swap", status: "Booked · jokafor", color: "green", action: "Reschedule" },
  { when: "Fri 21 · 14:00", duration: "1 h 30", scope: "Any rank 02–03", status: "Open", color: "brand", action: "Cancel" },
]

/* ── EXAMS ───────────────────────────────────────────────────────────────── */

export const EXAM_REGISTERED: { exam: string; session: string; seats: string; where: string; status: string; color: Color; action: string }[] = [
  { exam: "Exam 03", session: "Thu 27 Aug · 09:00", seats: "28 / 32", where: "Paris · e1", status: "Confirmed", color: "green", action: "Unregister" },
  { exam: "Exam 03", session: "Tue 01 Sep · 14:00", seats: "31 / 32", where: "Paris · e1", status: "Waitlist #3", color: "orange", action: "Leave waitlist" },
]

export const EXAM_RESULTS: { exam: string; date: string; score: string; tier: string; outcome: string; color: Color }[] = [
  { exam: "Exam 02", date: "Jun 11", score: "3 / 4", tier: "Tier 3", outcome: "Validated", color: "green" },
  { exam: "Exam 02", date: "May 28", score: "1 / 4", tier: "Tier 1", outcome: "Failed", color: "red" },
  { exam: "Exam 01", date: "Mar 19", score: "4 / 4", tier: "Tier 4", outcome: "Validated", color: "green" },
  { exam: "Exam 00", date: "Jan 15", score: "3 / 3", tier: "Tier 3", outcome: "Validated", color: "green" },
]

/* ── AGENDA ──────────────────────────────────────────────────────────────── */

/** August 2026 — the 1st is a Saturday, the grid starts on Monday, so 5 leading
 *  blanks; today is Thursday the 20th. Exactly the prototype's arithmetic. */
export const AGENDA_MONTH = { label: "August 2026", offset: 5, days: 31, today: 20 }

export type EventTone = "brand" | "success" | "violet" | "warning"

export const AGENDA_EVENTS: Record<number, { tone: EventTone; label: string }[]> = {
  20: [{ tone: "brand", label: "Review · dvargas 16:30" }],
  21: [{ tone: "warning", label: "My slot open 14:00" }],
  24: [{ tone: "violet", label: "Rush kickoff 10:42" }],
  25: [
    { tone: "brand", label: "Review · jokafor 11:00" },
    { tone: "violet", label: "Rush review" },
  ],
  26: [{ tone: "violet", label: "Workshop · Docker 17:00" }],
  27: [{ tone: "success", label: "Exam 03 · 09:00" }],
  28: [{ tone: "violet", label: "Coalition night 19:00" }],
}

export const AGENDA_LEGEND: { label: string; tone: EventTone }[] = [
  { label: "Reviews", tone: "brand" },
  { label: "Exams", tone: "success" },
  { label: "Rushes & events", tone: "violet" },
  { label: "My open slots", tone: "warning" },
]

export const REGISTRATIONS: { title: string; sub: string; badge: string; color: Color; body?: string; foot?: string; action?: string }[] = [
  {
    title: "Rush — Web scraping",
    sub: "Mon 24 Aug · 10:42 → Wed 26 · 10:42",
    badge: "Registered",
    color: "purple",
    body: "Group announced 1 h before kickoff. No rematch once started.",
    foot: "Registration closes Sun 23 · 18:00",
    action: "Unregister",
  },
  { title: "Exam 03", sub: "Thu 27 Aug · 09:00 · Paris e1", badge: "Confirmed", color: "green", action: "Manage in Exams →" },
  { title: "Coalition night — The Federation", sub: "Fri 28 Aug · 19:00", badge: "Going", color: "brand", foot: "42 attending" },
  { title: "Workshop — Docker basics", sub: "Wed 26 Aug · 17:00", badge: "Waitlist", color: "orange", foot: "Position 6 of 12" },
]

/* ── COMMUNITY ───────────────────────────────────────────────────────────── */

export const COALITION_STATS: { v: string; k: string; tone: Tone }[] = [
  { v: "2nd", k: "Of 4 coalitions", tone: "brand" },
  { v: "18 420", k: "Season points", tone: "success" },
  { v: "340", k: "Your contribution", tone: "violet" },
  { v: "12 d", k: "Season ends in", tone: "warning" },
]

export const STANDINGS: { name: string; points: string; members: string; trend: string; color: Color }[] = [
  { name: "The Order", points: "21 106", members: "312", trend: "+1 240", color: "green" },
  { name: "The Federation", points: "18 420", members: "298", trend: "+980", color: "green" },
  { name: "The Alliance", points: "17 880", members: "305", trend: "+1 410", color: "green" },
  { name: "The Assembly", points: "14 202", members: "289", trend: "+420", color: "orange" },
]

/** The login carries the identity; the badge carries the only thing that makes a friend
 *  useful right now — that is the prototype's own rule. */
export const FRIENDS: { login: string; name: string; level: string; status: string; color: Color }[] = [
  { login: "tlemoine", name: "Théo Lemoine", level: "9.02", status: "In cluster e2 · seat 22", color: "green" },
  { login: "mchen", name: "Mei Chen", level: "10.61", status: "Offering a slot Fri 14:00", color: "brand" },
  { login: "dvargas", name: "Diego Vargas", level: "8.44", status: "You review them today 14:30", color: "orange" },
  { login: "sbernard", name: "Sofia Bernard", level: "12.10", status: "Offline", color: "gray" },
]

export const CLUBS = [
  { title: "Algo club", cadence: "Weekly · Tue 18:00", members: "24 members" },
  { title: "CTF / security", cadence: "Bi-weekly", members: "41 members" },
  { title: "Game jam", cadence: "Monthly", members: "58 members" },
]

export const ANNOUNCEMENTS: { title: string; body: string; type: "warning" | "info" | "success"; when: string }[] = [
  { title: "Cluster e2 closed Friday", body: "Network maintenance 08:00–14:00. Book elsewhere for reviews.", type: "warning", when: "2 h ago" },
  { title: "Exam 03 sessions published", body: "Three sessions this month, 32 seats each.", type: "info", when: "Yesterday" },
  { title: "New: mid-review available on rank 03+", body: "Ask for formalised help mid-attempt without affecting validation.", type: "success", when: "3 d ago" },
]

/** The cluster grid: 120 seats, seat 42 is mine, four friends, and the prototype's own
 *  `i * 7 % 3 === 0` rule for an occupied seat. Computed, not hand-listed. */
export const CLUSTER_FRIENDS = [12, 38, 57, 88]
export const CLUSTER_ME = 41
export const CLUSTER_SEATS = 120

/* ── PAPERWORK ───────────────────────────────────────────────────────────── */

export const PAPERWORK: { doc: string; kind: string; deadline: string; status: string; color: Color; action: string }[] = [
  { doc: "Student card 2026–27", kind: "Issued to you", deadline: "—", status: "Available", color: "green", action: "Download" },
  { doc: "Proof of enrolment", kind: "Issued to you", deadline: "—", status: "Available", color: "green", action: "Download" },
  { doc: "Civil liability insurance", kind: "You provide", deadline: "Sep 15", status: "Missing", color: "red", action: "Upload" },
  { doc: "Internship agreement", kind: "You provide", deadline: "Oct 01", status: "Draft", color: "orange", action: "Continue" },
]

/* ── ATTENDANCE ──────────────────────────────────────────────────────────── */

export const ATTENDANCE = {
  figures: [
    { v: "6 h 12", k: "Average day", sub: "on days you came" },
    { v: "29 h", k: "Average week", sub: "over the year" },
    { v: "118 h", k: "Average month", sub: "over the year" },
    { v: "23 d", k: "Longest streak", sub: "Feb – Mar 2026" },
  ],
  today: { range: "09:14 → 18:02", hours: "8 h 48", streak: 6 },
  month: { days: 21, of: 30, hours: 142 },
}

/* ── HOME ────────────────────────────────────────────────────────────────── */

/** "Coming up" — the prototype's `UPCOMING_REVIEWS`, which its agenda block grouped by
 *  day. `dir` is what the row means: `give` = I review them, `get` = they review me. */
export const COMING_UP: {
  dir: "give" | "get"
  peer: string
  project: string
  when: string
  day: string
  loc: string
  note?: string
  open?: boolean
}[] = [
  { dir: "give", peer: "dvargas", project: "a_maze_ing", when: "14:30", day: "Today", loc: "Paris · cluster e1 · seat 42", note: "Starts in 25 min", open: true },
  { dir: "get", peer: "tlefevre", project: "sky_scraper", when: "16:30", day: "Today", loc: "Paris · cluster e2 · seat 17" },
  { dir: "give", peer: "jokafor", project: "push_swap", when: "11:00", day: "Fri 28 Aug", loc: "Paris · cluster e2" },
  { dir: "get", peer: "yhassan", project: "net_practice", when: "15:00", day: "Fri 04 Sep", loc: "Paris · cluster e1 · seat 08" },
  { dir: "give", peer: "nkovacs", project: "born2beroot", when: "10:30", day: "Mon 07 Sep", loc: "Paris · cluster e3" },
  { dir: "get", peer: "pamidal", project: "inception", when: "14:00", day: "Wed 09 Sep", loc: "Paris · cluster e2 · seat 31" },
]

/** "Action required" — feedback the learner OWES. It ages, and a peer is blocked by it:
 *  that is what separates it from the suggestions below. */
export const ACTION_REQUIRED: { title: string; sub?: string; days: number; action: string }[] = [
  { title: "Give feedback to lpetrov", sub: "so_long · reviewed Aug 15", days: 6, action: "Give feedback" },
  { title: "Give feedback to mchen", sub: "Libft · reviewed Aug 18", days: 3, action: "Give feedback" },
  { title: "Who helped you on push_swap?", days: 4, action: "Give feedback" },
]

/** "Suggestions" — available, not owed. Nothing is blocked by these and they do not age. */
export const SUGGESTIONS: { title: string; sub: string; action: string; href?: string }[] = [
  { title: "Start a new attempt on cub3d", sub: "Failure is part of the process.", action: "Start", href: "#/learn/program" },
  { title: "Project feedback", sub: "Give feedback on the content of Born2beroot · v2.1.3", action: "Give feedback" },
  { title: "Register to Algorithmics", sub: "Next module in your program", action: "Register", href: "#/learn/program" },
  { title: "Start pacman", sub: "Object-oriented programming", action: "Start", href: "#/learn/program" },
  { title: "Schedule a review for Inception", sub: "Systems & networks administration", action: "Schedule", href: "#/review/availability" },
]

/** "Wins" — what the prototype's `recentWins()` computed out of the attempts, the exam
 *  results and the milestones. Ported as its OUTPUT: recomputing it would mean porting
 *  the whole attempt engine for a strip of four cards. */
export const WINS: { kind: "project" | "exam" | "milestone"; name: string; when: string; note?: string }[] = [
  { kind: "project", name: "Born2beroot", when: "Aug 11", note: "100" },
  { kind: "exam", name: "Exam 02", when: "Jun 11", note: "Tier 3" },
  { kind: "project", name: "get_next_line", when: "Jun 02", note: "108" },
  { kind: "milestone", name: "Milestone 2", when: "May 20" },
]

/** "In progress" — the projects with an attempt in flight. */
export const IN_PROGRESS: { name: string; module: string; status: string; color: Color; sub: string }[] = [
  { name: "minishell", module: "Systems & networks administration", status: "Under review", color: "brand", sub: "Rank 03 · 2 of 3 reviews done" },
  { name: "cub3d", module: "Systems & networks administration", status: "CPM failed", color: "red", sub: "Rank 04 · a new attempt is open" },
]
