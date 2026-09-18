/** Progression fixtures — YAMS, the milestone ruler, the simulator.
 *
 *  YAMS is the pace indicator: it compares where the learner stands against the 42
 *  reference pace (40 h/week) and NAMES the gap. The artifact carried a switch to preview
 *  each quality with its own full set of figures — that switch is the vocabulary of the
 *  indicator, so it is ported as a working control rather than a static row of chips.
 *
 *  ⚠️ FIVE QUALITIES HERE, SEVEN IN THE ARTIFACT. `lag`, `lag2` and `lag3` were the SAME
 *  quality under three candidate hues (blue / pink / amber) — a hue trial, not three
 *  states. `foundations-colors` settles that a threshold is a MODE and not a variant, and
 *  `review:color` asks that a status carry its meaning in the label; so the trial belongs
 *  to the Figma debate and the flow keeps one Lag. Reported, not decided in silence. */

export type Variance = {
  label: string
  title: string
  body: string
  grace?: string
  attWeeks: number[]
  reviews: number
  reviewTarget: number
  msPct: number
  ccPct: number
  projDate: string
  projSub: string
  atRisk?: boolean
}

export const VARIANCES: Variance[] = [
  {
    label: "Significant Lead",
    title: "Significant Lead",
    body: "Outstanding pace — you're well ahead of the reference. If you'd like, helping peers is a great way to deepen your own mastery.",
    attWeeks: [39, 41, 40, 42],
    reviews: 3,
    reviewTarget: 2,
    msPct: 100,
    ccPct: 52,
    projDate: "May 8, 2027",
    projSub: "within the 24-month maximum",
  },
  {
    label: "Lead",
    title: "Lead",
    body: "Great pace — you're ahead, and your consistency is paying off.",
    attWeeks: [38, 41, 39, 40],
    reviews: 2,
    reviewTarget: 2,
    msPct: 88,
    ccPct: 46,
    projDate: "Jul 15, 2027",
    projSub: "within the 24-month maximum",
  },
  {
    label: "Expected",
    title: "Expected",
    body: "You're on track — keep going at your own rhythm.",
    attWeeks: [33, 37, 34, 36],
    reviews: 2,
    reviewTarget: 2,
    msPct: 70,
    ccPct: 40,
    projDate: "Sep 22, 2027",
    projSub: "within the 24-month maximum",
  },
  {
    label: "Lag",
    title: "Lag",
    body: "Anything getting in the way right now?",
    attWeeks: [32, 26, 30, 28],
    reviews: 1,
    reviewTarget: 2,
    msPct: 65,
    ccPct: 38,
    projDate: "Nov 12, 2027",
    projSub: "within the 24-month maximum",
  },
  {
    label: "Significant Lag",
    title: "Significant Lag",
    body: "You are at risk of drop out: action is needed to get back on track.",
    grace: "5 days",
    attWeeks: [20, 14, 18, 16],
    reviews: 0,
    reviewTarget: 2,
    msPct: 45,
    ccPct: 33,
    projDate: "Feb 18, 2028",
    projSub: "past the 24-month limit",
    atRisk: true,
  },
]

export const YAMS = {
  updatedAt: "Monday 2 Jun 2026, 08:00",
  cadence: "Data is updated weekly",
  milestone: "Milestone 3",
  elapsed: "48 days",
  estimated: "52 days",
  reference: "This status is based on the 42 reference pace (40h/week).",
  attendanceNote: "YAMS uses this 4-week average.",
  attendanceUpdated: "Last updated 5 Jun 2026, 14:12",
  attendanceDisclaimer:
    "This attendance figure uses more data than the one on your profile page, so the two may differ. When they don't match, trust this one — we're working on aligning them.",
  reviewTargetNote: "Target: 2 reviews/week",
  reviewDisclaimer:
    "Reviews are how the community learns together — they sharpen your own understanding and help peers move forward. Aim for at least 2 each week.",
}

export const ATT_LABELS = ["W-3", "W-2", "W-1", "This week"]

/** The projects the CURRENT milestone waits on. `count` is what the artifact's
 *  "See all 15 skills" opened — the modal is out of this commit's scope, so the count is
 *  stated on the row instead of hidden behind a link that leads nowhere. */
export const MILESTONE_PROJECTS = [
  {
    name: "Born2beroot",
    skills: "Virtualization, SSH hardening…",
    count: 15,
    status: "Success",
    done: true,
  },
  { name: "Philosophers", skills: "Threads, mutexes…", count: 15, status: "To do", done: false },
  { name: "minishell", skills: "Processes, parsing…", count: 15, status: "To do", done: false },
]

/** The Common Core as the artifact drew it: a 50-column grid where a module SPANS the
 *  milestones it straddles, and chains its projects left to right. The spans are the
 *  artifact's own `grid-column` values — structural data, not styling, which is why they
 *  travel as data and not as classes. */
export type Step = { name: string; hours: string; ms: number }
export type Module = {
  module: string
  hours: string
  row: number
  from: number
  to: number
  /** one entry per step of the chain; an entry with two projects is a branch */
  chain: Step[][]
}

export const CURRICULUM: Module[] = [
  {
    module: "Algorithmics",
    hours: "190h",
    row: 1,
    from: 23,
    to: 42,
    chain: [[{ name: "push_swap", hours: "70h", ms: 6 }], [{ name: "fly-in", hours: "120h", ms: 6 }]],
  },
  {
    module: "Object Oriented Programming",
    hours: "270h",
    row: 2,
    from: 9,
    to: 23,
    chain: [
      [{ name: "Python Piscine", hours: "70h", ms: 4 }],
      [{ name: "A-Maze-ing", hours: "50h", ms: 4 }],
      [{ name: "Pac Man", hours: "150h", ms: 5 }],
    ],
  },
  {
    module: "Programming Fundamentals",
    hours: "240h",
    row: 3,
    from: 1,
    to: 9,
    chain: [
      [{ name: "Libft", hours: "70h", ms: 1 }],
      [
        { name: "ft_printf", hours: "60h", ms: 2 },
        { name: "get_next_line", hours: "60h", ms: 2 },
      ],
      [{ name: "push_swap", hours: "70h", ms: 3 }],
    ],
  },
  {
    module: "Artificial Intelligence",
    hours: "330h",
    row: 3,
    from: 26,
    to: 39,
    chain: [
      [{ name: "Call Me Maybe", hours: "60h", ms: 6 }],
      [{ name: "RAG Against The Machine", hours: "150h", ms: 7 }],
      [{ name: "Agent Smith", hours: "160h", ms: 7 }],
    ],
  },
  {
    module: "Web",
    hours: "280h",
    row: 3,
    from: 41,
    to: 51,
    chain: [[{ name: "ft_transcendence", hours: "250h", ms: 8 }]],
  },
  {
    module: "Systems & Networks Administration",
    hours: "250h",
    row: 4,
    from: 12,
    to: 25,
    chain: [
      [{ name: "born2beroot", hours: "80h", ms: 4 }],
      [{ name: "netpractice", hours: "80h", ms: 5 }],
      [{ name: "inception", hours: "150h", ms: 5 }],
    ],
  },
  {
    module: "Systems & Networks Programming",
    hours: "290h",
    row: 5,
    from: 26,
    to: 39,
    chain: [
      [{ name: "Codexion", hours: "80h", ms: 7 }],
      [{ name: "The Answer Protocol", hours: "160h", ms: 7 }],
    ],
  },
]

export const RULER = [
  { n: 1, weeks: "2 weeks", from: 1, to: 3 },
  { n: 2, weeks: "3 weeks", from: 3, to: 6 },
  { n: 3, weeks: "3 weeks", from: 6, to: 9 },
  { n: 4, weeks: "5 weeks", from: 9, to: 14 },
  { n: 5, weeks: "9 weeks", from: 14, to: 23 },
  { n: 6, weeks: "8 weeks", from: 23, to: 31 },
  { n: 7, weeks: "11 weeks", from: 31, to: 42 },
  { n: 8, weeks: "6 weeks", from: 42, to: 48 },
]

export const SCENARIOS = [
  {
    label: "1 activity / week",
    end: "End Feb 2027",
    body: "Four months early. Sustainable only if review debt stays at zero.",
    current: false,
  },
  {
    label: "Current rhythm",
    end: "End Jun 2027",
    body: "1.4 activities per two weeks. Twelve days of slack kept.",
    current: true,
  },
  {
    label: "1 activity / month",
    end: "End Feb 2028",
    body: "Outside the envelope from November onward.",
    current: false,
  },
]

export const SIM_SLIDERS = [
  { label: "Activities per two weeks", value: "1.4", pct: 47 },
  { label: "Reviews given per week", value: "2.4", pct: 60 },
  { label: "Days off per month", value: "4", pct: 30 },
]
