/** Paperwork — the administrative counterpart of the map screens.
 *
 *  Invented content, as everywhere in this flow. What is deliberate: the deadlines speak the
 *  same language as the graph ("Milestone 03", "Milestone 04"), so a document that unlocks
 *  later is placed on the same path the learner already read on the Holy Graph. A form is
 *  not a separate world — it gates the same territories.
 *
 *  `enabled: false` marks a row whose action is not open yet: the button stays visible and
 *  disabled rather than disappearing, so the learner can see WHAT will be asked and when. */

export type Doc = {
  name: string
  kind: string
  deadline: string
  status: string
  action: string
  enabled: boolean
}

/** The one document that closes a door. It is what makes this screen open rather than
 *  report — everything else on the page is a state, this is a move. */
export const BLOCKER = {
  name: "Proof of enrolment 2026-2027",
  why: "Exam registration stays closed until the campus has it. Exam 01 seals Milestone 02, so this single file is what stands between you and the whole next band of the graph.",
  meta: "DUE IN 6 DAYS",
  action: "Upload the file",
}

export const YOU_PROVIDE: Doc[] = [
  {
    name: "Proof of enrolment 2026-2027",
    kind: "Yearly renewal",
    deadline: "15 SEP 2026",
    status: "Missing",
    action: "Upload",
    enabled: true,
  },
  {
    name: "Civil liability insurance",
    kind: "Yearly renewal",
    deadline: "30 SEP 2026",
    status: "Expires soon",
    action: "Renew",
    enabled: true,
  },
  {
    name: "Identity document",
    kind: "One-off",
    deadline: "—",
    status: "Filed",
    action: "Replace",
    enabled: true,
  },
  {
    name: "Bank details",
    kind: "One-off",
    deadline: "—",
    status: "Filed",
    action: "Replace",
    enabled: true,
  },
  {
    name: "Internship agreement",
    kind: "On demand",
    deadline: "AT MILESTONE 04",
    status: "Not open yet",
    action: "See conditions",
    enabled: false,
  },
]

export const CAMPUS_PROVIDES: Doc[] = [
  {
    name: "Student status certificate",
    kind: "Automatic",
    deadline: "—",
    status: "Available",
    action: "Download",
    enabled: true,
  },
  {
    name: "Certificate of attendance",
    kind: "On request",
    deadline: "48 H TO ISSUE",
    status: "Available",
    action: "Request",
    enabled: true,
  },
  {
    name: "Transcript — Piscine",
    kind: "Automatic",
    deadline: "—",
    status: "Available",
    action: "Download",
    enabled: true,
  },
  {
    name: "Transcript — Common Core",
    kind: "At each milestone",
    deadline: "AT MILESTONE 02",
    status: "Not issued yet",
    action: "Download",
    enabled: false,
  },
]
