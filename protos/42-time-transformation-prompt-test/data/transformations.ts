/** Demo data — written from the WRITTEN SPEC ONLY (2026-09-09). No frame was read.
 *  Every value below is the spec's, verbatim.
 *
 *  ⚠️ THE SPEC CONTRADICTS ITSELF IN THREE PLACES. None is resolved here — a prompt that
 *  disagrees with itself is a question for the PO, not a merge for the agent:
 *
 *  1. START DATE. The table of screen 1 gives `10/04/2026` for the four approved rows;
 *     screens 3 and 5 give `11/12/2026` for the same field on the same request. Both are
 *     kept, on the field each one describes — the list shows its date, the staff form shows
 *     its own, and the gap is visible rather than averaged away.
 *  2. WHO IS DENIED. Screen 2 is titled "Elena Morel request" with status `Denied`, while
 *     table 1 lists `elmorel` as `Approved`. The table wins here (it is the only place the
 *     seven learners are enumerated), so the Denied read-state is reachable on `adduran`,
 *     `gapetit` and `fadurand` — the three rows the table itself marks Denied.
 *  3. WHOSE PROGRAM SHIFTS. The Time shift overview of screen 6 names `anokywa`, a learner
 *     who appears nowhere else in the spec. Rendered with the request's own learner, since
 *     an overview of someone else's program on this request would be a bug on screen. */

export type TransformationType = "Time off" | "Time shift"
export type Decision = "Approved" | "Denied"

/** The four options of the REASON select (spec, screen 4). */
export const REASONS: string[] = [
  "Medical leave",
  "Administrative / Legal obligation",
  "Personal emergency",
  "Other",
]

export type PastRequest = {
  login: string
  /** The spec names only one learner in full. `null` elsewhere — the login is shown
   *  instead rather than a name being invented. */
  name: string | null
  type: TransformationType | null
  /** As the list draws it, sign included: "+7 days" marks a shift. */
  startDate: string
  duration: string
  reason: string
  details: string
  status: Decision
  lastReviewedBy: string
  blocked: boolean
}

/** Table of screen 1, seven rows, verbatim. */
export const PAST_REQUESTS: PastRequest[] = [
  { login: "elmorel", name: "Elena Morel", type: "Time shift", startDate: "10/04/2026", duration: "+7 days", reason: "Medical leave", details: "Covid", status: "Approved", lastReviewedBy: "Bertrand Prevost", blocked: false },
  { login: "lumarti", name: null, type: "Time shift", startDate: "10/04/2026", duration: "+7 days", reason: "Personal emergency", details: "", status: "Approved", lastReviewedBy: "Bertrand Prevost", blocked: false },
  { login: "fifauch", name: null, type: "Time off", startDate: "10/04/2026", duration: "7 days", reason: "Administrative / Legal obligation", details: "VISA issue", status: "Approved", lastReviewedBy: "Bertrand Prevost", blocked: false },
  { login: "belaure", name: null, type: "Time off", startDate: "10/04/2026", duration: "7 days", reason: "Medical leave", details: "", status: "Approved", lastReviewedBy: "Bertrand Prevost", blocked: true },
  { login: "adduran", name: null, type: null, startDate: "08/04/2026", duration: "7 days", reason: "Other", details: "Preparation for a professional examination", status: "Denied", lastReviewedBy: "Bertrand Prevost", blocked: false },
  { login: "gapetit", name: null, type: null, startDate: "08/04/2026", duration: "7 days", reason: "Other", details: "Police custody", status: "Denied", lastReviewedBy: "Bertrand Prevost", blocked: false },
  { login: "fadurand", name: null, type: null, startDate: "08/04/2026", duration: "7 days", reason: "Medical leave", details: "", status: "Denied", lastReviewedBy: "Bertrand Prevost", blocked: false },
]

/** What the two filterable columns offer — DERIVED from the rows, never a second list to
 *  keep in sync. */
export const REASON_OPTIONS: string[] = [...new Set(PAST_REQUESTS.map((r) => r.reason))]
export const TYPE_OPTIONS: string[] = ["Time off", "Time shift"]
export const STATUS_OPTIONS: string[] = ["Approved", "Denied"]

export type RequestRecord = PastRequest & {
  tags: string[]
  program: string
  requestDate: string
  /** Screen 2 — shown only when the request was denied. */
  denyReason: string | null
  /** The staff form's own start date. See contradiction 1 above. */
  formStartDate: string
  formDurationDays: number
  deductFromTimeBank: boolean
  blockWorkstations: boolean
  /** Screen 5: a Time shift request draws no document block. */
  document: { name: string } | null
  /** Screen 4's "Changes overview": ACTUAL TIME BANK. */
  timeBankDays: number
  /** Screen 6's "Changes overview". */
  projectedProgramEnd: string
  maxProgramEnd: string
}

/** One record per row of the table, so every learner of the list opens on something.
 *  The fields the spec gives once (tags, program, request date, document, time bank,
 *  program end) are the same on every record — the spec shows them on one screen only. */
export const REQUESTS: Record<string, RequestRecord> = Object.fromEntries(
  PAST_REQUESTS.map((row) => [
    row.login,
    {
      ...row,
      tags: ["42I"],
      program: "Common Core April 26",
      requestDate: "08/04/2026",
      denyReason: row.status === "Denied" ? "The document is invalid" : null,
      formStartDate: "11/12/2026",
      formDurationDays: 7,
      deductFromTimeBank: false,
      blockWorkstations: row.type === "Time off",
      document: row.type === "Time off" ? { name: "Ambassy-certificate.pdf" } : null,
      timeBankDays: 7,
      projectedProgramEnd: "08/05/2026",
      maxProgramEnd: "08/05/2026",
    },
  ]),
)
