/** Demo data — ONE request, the one the screen was described around. A detail screen
 *  needs a plausible record, not a dataset: the list page that would feed it is not part
 *  of this flow (deliberate scope, settled with the PO on 2026-09-08). */

export type TransformationType = "Time off" | "Time shift"

export type TimeTransformationRequest = {
  login: string
  name: string
  tags: string[]
  program: string
  requestDate: string
  status: string
  lastReviewedBy: string
  changesRequested: string
  form: {
    type: TransformationType
    startDate: string
    durationDays: number
    deductFromTimeBank: boolean
    reason: string
    blockWorkstations: boolean
    details: string
  }
  document: { name: string; size: string; uploadedOn: string }
}

export const REASONS = [
  "Administrative / Legal obligation",
  "Medical",
  "Family event",
  "Professional experience",
  "Other",
]

export const REQUESTS: Record<string, TimeTransformationRequest> = {
  elmorel: {
    login: "elmorel",
    name: "Elena Morel",
    tags: ["Under 18"],
    program: "Common Core April 26",
    requestDate: "06/04/2026",
    status: "Pending",
    lastReviewedBy: "Bertrand Prevost",
    changesRequested:
      "The uploaded document is not valid: it is a screenshot of an appointment confirmation. An official document naming the learner and the dates is required before the request can be approved.",
    form: {
      type: "Time off",
      startDate: "11/12/2026",
      durationDays: 7,
      deductFromTimeBank: true,
      reason: "Administrative / Legal obligation",
      blockWorkstations: true,
      details: "VISA issue",
    },
    document: {
      name: "Ambassa-certificate.pdf",
      size: "412 KB",
      uploadedOn: "06/04/2026",
    },
  },
}

/** ── THE LIST ──────────────────────────────────────────────────────────────────────
 *  Read off the frame "42 — Time transformations (list) v2" (`22701:11048`) on
 *  2026-09-09. The seven rows and every value in them are the mockup's, VERBATIM. The
 *  tab announces "Requests (10)"; the frame is 900 px tall and draws seven, so seven is
 *  what is here — the three missing ones are not invented.
 *
 *  ⚠️ THE LIST AND THE DETAIL DISAGREE ABOUT `elmorel`, and the disagreement showed up
 *  by FOLLOWING THE FIGMA RACCORD — neither screen says it on its own:
 *
 *    | field        | this list (mockup)  | REQUESTS.elmorel (screen shipped 2026-09-08) |
 *    |--------------|---------------------|----------------------------------------------|
 *    | request date | 08/04/2026          | 06/04/2026                                   |
 *    | start date   | 10/04/2026          | 11/12/2026                                   |
 *    | reason       | Other               | Administrative / Legal obligation             |
 *    | status       | Incomplete          | Pending                                      |
 *
 *  Neither was corrected against the other: the detail's record was settled with the PO
 *  on 2026-09-08, the list's row is what the mockup draws today. That is a question for
 *  the PO, not a merge for the agent to make in silence.
 *
 *  Same for the vocabulary: the list reads "Personal emergency" and "Medical leave",
 *  neither of which is in `REASONS` — the select the detail screen offers. One of the
 *  two lists is behind. */
export type RequestStatus = "Pending" | "Incomplete"

export type RequestRow = {
  login: string
  requestDate: string
  startDate: string
  durationDays: number
  reason: string
  /** Empty where the mockup shows an em dash — the column renders the dash. */
  details: string
  status: RequestStatus
}

export const REQUEST_ROWS: RequestRow[] = [
  { login: "elmorel", requestDate: "08/04/2026", startDate: "10/04/2026", durationDays: 7, reason: "Other", details: "VISA issue", status: "Incomplete" },
  { login: "lumarti", requestDate: "08/04/2026", startDate: "10/04/2026", durationDays: 7, reason: "Personal emergency", details: "", status: "Incomplete" },
  { login: "fifauch", requestDate: "08/04/2026", startDate: "10/04/2026", durationDays: 7, reason: "Administrative / Legal obligation", details: "VISA issue", status: "Pending" },
  { login: "belaure", requestDate: "08/04/2026", startDate: "10/04/2026", durationDays: 7, reason: "Medical leave", details: "Covid", status: "Pending" },
  { login: "adduran", requestDate: "08/04/2026", startDate: "08/04/2026", durationDays: 7, reason: "Other", details: "Preparation for a professional examination", status: "Pending" },
  { login: "gapetit", requestDate: "08/04/2026", startDate: "08/04/2026", durationDays: 7, reason: "Other", details: "Police custody", status: "Pending" },
  { login: "fadurand", requestDate: "08/04/2026", startDate: "08/04/2026", durationDays: 7, reason: "Medical leave", details: "", status: "Pending" },
]

/** What the two filterable columns offer — DERIVED from the rows, never a second list
 *  to keep in sync. */
export const REASON_OPTIONS: string[] = [...new Set(REQUEST_ROWS.map((r) => r.reason))]
export const STATUS_OPTIONS: string[] = [...new Set(REQUEST_ROWS.map((r) => r.status))]
