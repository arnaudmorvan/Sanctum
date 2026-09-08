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
