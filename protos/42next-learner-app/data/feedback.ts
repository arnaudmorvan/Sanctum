/** Post-review feedback and the social vote — the two forms the artifact's home leads on.
 *
 *  Both are MANDATORY in the product sense: an attempt cannot close while the feedback it
 *  owes is unwritten, which is why they are the rows carrying the signature outline on the
 *  home. They are also the two screens that did not exist in `42next-lms`.
 *
 *  ⚠️ ONE INSTRUMENT HERE, FOUR IN THE ARTIFACT. The artifact carried four candidate
 *  instruments for the three axes behind a tab bar (continuous energy bars, dials, a
 *  dragged triangle, a plain picker) — that comparison is a flow of its own and it is
 *  already published: `peer-review-feedback` (Zoe, 2026-09-14). Re-porting it here would
 *  duplicate a reviewed exploration, so this screen carries the DS-canonical form: three
 *  options per axis, all visible, exclusive choice — a `SegmentGroup`, which is exactly
 *  the catalog's own threshold. */

export type Dir = "given" | "received"

export type Scale = {
  id: string
  axis: string
  sub: Record<Dir, string>
  question: Record<Dir, string>
  opts: [string, string, string]
}

export const SCALES: Scale[] = [
  {
    id: "perf",
    axis: "Performance",
    sub: {
      given: "How they presented and defended their work",
      received: "How they ran the review",
    },
    question: {
      given: "How would you describe the reviewee's performance during the review?",
      received: "How would you describe the reviewer's performance during the review?",
    },
    opts: ["Superficial", "Rigorous", "Outstanding"],
  },
  {
    id: "exch",
    axis: "Exchange",
    sub: { given: "The exchange you had", received: "The exchange you had" },
    question: {
      given: "How would you describe the exchange you had with the reviewee?",
      received: "How would you describe the exchange you had with the reviewer?",
    },
    opts: ["Unfruitful", "Constructive", "Empowering"],
  },
  {
    id: "att",
    axis: "Attitude",
    sub: {
      given: "Their attitude during the review",
      received: "Their attitude during the review",
    },
    question: {
      given: "How would you describe the reviewee's attitude during the review?",
      received: "How would you describe the reviewer's attitude during the review?",
    },
    opts: ["Unprofessional", "Adequate", "Exemplary"],
  },
]

/** The two flags, and who may raise them. "Cannot explain code" only exists
 *  reviewer → reviewee. Both go to campus staff, and the form says so out loud —
 *  an action whose consequence is not written is the `review:a11y` failure. */
export const ISSUES = [
  {
    id: "CONCERNING_SITUATION",
    label: "Concerning behaviour",
    both: true,
    d: "Anything inappropriate, or that made you uncomfortable. Goes to campus staff.",
  },
  {
    id: "CANNOT_EXPLAIN_CODE",
    label: "Cannot explain code",
    both: false,
    d: "The reviewee could not explain their own code. Goes to campus staff.",
  },
]

/** The item the home's Action required panel opens: a group review, so the form runs
 *  once per member. */
export const FEEDBACK_SUBJECT = {
  dir: "given" as Dir,
  project: "so_long",
  members: ["luskywa", "anskywa", "tlefevre"],
  days: 6,
}

/** The social vote: who helped you on your own attempt. Up to three people, and naming
 *  nobody is allowed — the form asks for confirmation rather than blocking. */
export const SV_MAX = 3
export const SV_PROJECT = "Rush — Rosetta stone"
export const PEOPLE = [
  { login: "anskywa", name: "Ana Skywalker" },
  { login: "luskywa", name: "Luke Skywalker" },
  { login: "lorgana", name: "Leia Organa" },
  { login: "tlefevre", name: "Tom Lefèvre" },
  { login: "mokafor", name: "Mary Okafor" },
  { login: "sdiallo", name: "Sira Diallo" },
  { login: "rtakeda", name: "Ren Takeda" },
  { login: "pamidal", name: "Priya Amidala" },
  { login: "yhassan", name: "Yara Hassan" },
  { login: "nkovacs", name: "Nora Kovacs" },
  { login: "erizzi", name: "Emilia Rizzi" },
]

/** The thank-yous. ⚠️ THE ARTIFACT SENT EMOJI (🍕 ☕ 🍪 ❤️): the gate flags an emoji and
 *  `review:storytelling` asks for the grammar of the game, not its aesthetics, so each
 *  one is a lucide glyph in a `ThemeIcon` instead. The gesture survives; the costume
 *  does not. */
export const GIFTS = [
  { k: "pizza", l: "Pizza" },
  { k: "coffee", l: "Coffee" },
  { k: "cookie", l: "Cookie" },
  { k: "heart", l: "Thanks" },
]
