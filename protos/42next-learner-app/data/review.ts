/** Review, exams and agenda fixtures — the peer economy of the artifact.
 *
 *  Two things drive every screen here and neither is decoration: a review is OWED to a
 *  person (so it ages, and being late costs someone else a day), and post-review feedback
 *  is MANDATORY in both directions. That is why "what is owed" carries the signature
 *  outline on all four review screens and the stats never do. */

export const REVIEW_STATS = [
  { k: "Started on time", v: "94%" },
  { k: "Review points", v: "4" },
  { k: "Per week", v: "2.4" },
  { k: "Most in 24 h", v: "7" },
  { k: "Median duration", v: "48 min" },
  { k: "Avg score given", v: "106" },
]

export const RHYTHM = [
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

/** "How a review runs" — the artifact's own explanation of the rules, kept verbatim
 *  because it is the part a learner reads once and refers back to. */
export const HOW_IT_RUNS = [
  {
    t: "The questions come from the project",
    b: "Each project defines its own set of questions. Answers are yes/no or a rating scale. A general comment at the end is mandatory — it is not counted in the score.",
  },
  {
    t: "Flags before you validate",
    b: "exceptional · ok · forbidden function · crash · memory leak · incomplete group. A flag is not punishment: it is how the system learns what happened.",
  },
  {
    t: "Post-review feedback is mutual",
    b: "Three closed questions, both directions, on every review and every program. Reviewers can additionally flag concerning behaviour or can't explain their code.",
  },
  {
    t: "Mid-review — asking for help",
    b: "Optional, triggered by you mid-attempt. It does not validate or invalidate anything. It exists so that being stuck is a thing you can declare instead of hide.",
  },
  {
    t: "Jury reviews",
    b: "Several reviewers evaluate the same attempt at once. The final score is the average of their individual marks.",
  },
  {
    t: "Moulinette",
    b: "On Piscine and early Common Core, the automated grade carries more weight than the human one. Its weight is set per project.",
  },
]

export const PRINCIPLES = [
  {
    t: "Evaluate the work, not the person",
    b: "Read the code in front of you. The score answers the subject, nothing else.",
  },
  {
    t: "Make them explain it",
    b: "If they cannot walk you through it, the code is not theirs to defend.",
  },
  {
    t: "Say the hard thing kindly",
    b: "A generous score that teaches nothing is worse than a fair one that does.",
  },
  {
    t: "Show up on time",
    b: "A missed slot costs someone else a day. On-time rate is recorded for a reason.",
  },
  { t: "Flag honestly", b: "Flags are not punishment. They are how the system learns what happened." },
  {
    t: "You are also being reviewed",
    b: "Post-review feedback runs both ways. Reviewing badly is visible.",
  },
]

export const RESOURCES = [
  { t: "Review guide", b: "The full method, with worked examples." },
  { t: "Flag reference", b: "What each flag means and when it applies." },
  { t: "Règlement intérieur", b: "Conduct rules that apply during a review." },
]

export const RECEIVED_STATS = [
  { k: "Received", v: "18" },
  { k: "Avg score", v: "109" },
  { k: "Exceptional flags", v: "3" },
  { k: "Feedback to give", v: "1" },
]

export const RECEIVED = [
  {
    date: "Aug 19",
    peer: "sbernard",
    activity: "Libft",
    score: 104,
    flag: "exceptional",
    feedback: "Given",
  },
  { date: "Aug 18", peer: "mchen", activity: "Libft", score: 112, flag: "ok", feedback: "Pending" },
  {
    date: "Aug 04",
    peer: "lpetrov",
    activity: "ft_printf",
    score: 118,
    flag: "ok",
    feedback: "Given",
  },
  { date: "Jul 28", peer: "akaya", activity: "ft_printf", score: 62, flag: "crash", feedback: "Given" },
]

export const GIVEN_UPCOMING = [
  {
    peer: "dvargas",
    activity: "philosophers",
    when: "Today 16:30 · cluster e1 · seat 42",
    note: "In 4 h",
    open: true,
  },
  {
    peer: "jokafor",
    activity: "push_swap",
    when: "Tue 25 · 11:00 · cluster e2",
    note: "Scheduled",
    open: false,
  },
]

export const GIVEN = [
  { date: "Aug 15", peer: "lpetrov", activity: "so_long", score: 125, onTime: "Yes", feedback: "Given" },
  {
    date: "Aug 14",
    peer: "akaya",
    activity: "get_next_line",
    score: 88,
    onTime: "Yes",
    feedback: "Given",
  },
  {
    date: "Aug 11",
    peer: "mchen",
    activity: "born2beroot",
    score: 100,
    onTime: "Late 8 min",
    feedback: "Given",
  },
  { date: "Aug 07", peer: "tlemoine", activity: "Libft", score: 115, onTime: "Yes", feedback: "Given" },
]

export const AVAILABILITY_STATS = [
  { k: "Slots open", v: "3" },
  { k: "Booked", v: "2" },
  { k: "Peers waiting", v: "14" },
  { k: "Points balance", v: "4" },
]

export const SLOTS = [
  { when: "Today 16:30", dur: "1 h", scope: "philosophers", status: "Booked · dvargas", action: "Reschedule" },
  {
    when: "Tue 25 · 11:00",
    dur: "1 h",
    scope: "push_swap",
    status: "Booked · jokafor",
    action: "Reschedule",
  },
  { when: "Fri 21 · 14:00", dur: "1 h 30", scope: "Any rank 02–03", status: "Open", action: "Cancel" },
]

export const BOOKING_MODE = {
  title: "Booking mode: slot booking",
  body: "On this program, reviewee and reviewer register on calendar slots independently. Selection and discovery programs use instant matching instead — there, you declare yourself available for ONE review from Coming up on the home, and a peer is assigned as soon as one needs it.",
}

/** Exams — one page, three tabs. A module has zero or one exam. */
export const EXAMS_ELIGIBLE = [
  {
    name: "Exam 03",
    sub: "Rank 03 · required to validate the module",
    status: "Eligible",
    body: "3 sessions open this month. 32 seats each. Registration opens tomorrow 09:00.",
    action: "See sessions",
    note: "You may register to several sessions at once",
    entry: true,
  },
  {
    name: "Exam 04",
    sub: "Rank 04",
    status: "Locked",
    body: "Unlocks when cub3d validates.",
  },
]

export const EXAMS_REGISTERED = [
  {
    exam: "Exam 03",
    session: "Thu 27 Aug · 09:00",
    seats: "28 / 32",
    loc: "Paris · e1",
    status: "Confirmed",
    action: "Unregister",
  },
  {
    exam: "Exam 03",
    session: "Tue 01 Sep · 14:00",
    seats: "31 / 32",
    loc: "Paris · e1",
    status: "Waitlist #3",
    action: "Leave waitlist",
  },
]

export const EXAM_RESULTS = [
  { exam: "Exam 02", date: "Jun 11", score: "3 / 4", tier: "Tier 3", outcome: "Validated" },
  { exam: "Exam 02", date: "May 28", score: "1 / 4", tier: "Tier 1", outcome: "Failed" },
  { exam: "Exam 01", date: "Mar 19", score: "4 / 4", tier: "Tier 4", outcome: "Validated" },
  { exam: "Exam 00", date: "Jan 15", score: "3 / 3", tier: "Tier 3", outcome: "Validated" },
]

/** The month the artifact drew: August 2026, Monday-first, 5 leading blanks, today is
 *  Thursday 20. The event KIND drives a glyph, never a hue — four coloured chip families
 *  on one screen is the "two colours fighting" rejection of `review:color`. */
export type EventKind = "review" | "slot" | "exam" | "event"
export const CAL = {
  month: "August 2026",
  offset: 5,
  days: 31,
  today: 20,
  events: {
    20: [{ kind: "review" as EventKind, label: "Review · dvargas 16:30" }],
    21: [{ kind: "slot" as EventKind, label: "My slot open 14:00" }],
    24: [{ kind: "event" as EventKind, label: "Rush kickoff 10:42" }],
    25: [
      { kind: "review" as EventKind, label: "Review · jokafor 11:00" },
      { kind: "event" as EventKind, label: "Rush review" },
    ],
    26: [{ kind: "event" as EventKind, label: "Workshop · Docker 17:00" }],
    27: [{ kind: "exam" as EventKind, label: "Exam 03 · 09:00" }],
    28: [{ kind: "event" as EventKind, label: "Coalition night 19:00" }],
  } as Record<number, { kind: EventKind; label: string }[]>,
}

export const REGISTRATIONS = [
  {
    name: "Rush — Web scraping",
    when: "Mon 24 Aug · 10:42 → Wed 26 · 10:42",
    status: "Registered",
    body: "Group announced 1 h before kickoff. No rematch once started.",
    foot: "Registration closes Sun 23 · 18:00",
    action: "Unregister",
    entry: true,
  },
  {
    name: "Exam 03",
    when: "Thu 27 Aug · 09:00 · Paris e1",
    status: "Confirmed",
    action: "Manage in Exams",
    href: "#/exams",
  },
  {
    name: "Coalition night — The Federation",
    when: "Fri 28 Aug · 19:00",
    status: "Going",
    foot: "42 attending",
  },
  {
    name: "Workshop — Docker basics",
    when: "Wed 26 Aug · 17:00",
    status: "Waitlist",
    foot: "Position 6 of 12",
  },
]
