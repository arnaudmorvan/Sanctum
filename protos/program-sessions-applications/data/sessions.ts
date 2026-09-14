export interface Breakdown {
  applied: number
  selected: number
  confirmed: number
  onboarded: number
  maxCapacity: number
}

export interface ProgramSession {
  id: string
  name: string
  program: string
  campus: string
  applied: number
  capacity: number | null
  startDate: string
  endDate: string | null
  onboardingSessions: number
  registrationStatus: string
  archived: boolean
  breakdown: Breakdown
}

export interface OnboardingSlot {
  id: string
  date: string
  slot: string
  capacity: number
  confirmed: number
  location: string
}

export interface Applicant {
  id: string
  name: string
  login: string
  status: string
  appliedOn: string
}

const OPEN_UNTIL = "Open until 27 Dec 2027 (campus time)"

export const PROGRAM_SESSIONS: ProgramSession[] = [
  {
    id: "sess-apr-2026",
    name: "April 2026",
    program: "Selection Piscine Python",
    campus: "Paris",
    applied: 140,
    capacity: 280,
    startDate: "08/03/2026",
    endDate: "08/04/2026",
    onboardingSessions: 3,
    registrationStatus: OPEN_UNTIL,
    archived: false,
    breakdown: { applied: 20, selected: 50, confirmed: 50, onboarded: 20, maxCapacity: 280 },
  },
  {
    id: "sess-may-2026",
    name: "May 2026",
    program: "Selection Piscine Web",
    campus: "Tirana",
    applied: 10,
    capacity: 100,
    startDate: "08/05/2026",
    endDate: "08/06/2026",
    onboardingSessions: 3,
    registrationStatus: "Closed",
    archived: false,
    breakdown: { applied: 10, selected: 8, confirmed: 6, onboarded: 4, maxCapacity: 100 },
  },
  {
    id: "sess-jun-2026",
    name: "June 2026",
    program: "Common Core",
    campus: "Irbid",
    applied: 50,
    capacity: null,
    startDate: "08/06/2026",
    endDate: null,
    onboardingSessions: 3,
    registrationStatus: "Open",
    archived: false,
    breakdown: { applied: 50, selected: 32, confirmed: 28, onboarded: 12, maxCapacity: 60 },
  },
  {
    id: "sess-aug-2026",
    name: "August 2026",
    program: "ZIP",
    campus: "Marseille",
    applied: 90,
    capacity: 100,
    startDate: "10/08/2026",
    endDate: null,
    onboardingSessions: 3,
    registrationStatus: OPEN_UNTIL,
    archived: false,
    breakdown: { applied: 90, selected: 64, confirmed: 60, onboarded: 40, maxCapacity: 100 },
  },
  {
    id: "sess-sep-2026",
    name: "September 2026",
    program: "Discovery Piscine IA",
    campus: "Paris",
    applied: 500,
    capacity: 600,
    startDate: "08/08/2026",
    endDate: "08/09/2026",
    onboardingSessions: 3,
    registrationStatus: "Open",
    archived: false,
    breakdown: { applied: 500, selected: 420, confirmed: 380, onboarded: 120, maxCapacity: 600 },
  },
  {
    id: "sess-oct-2026",
    name: "October 2026",
    program: "Discovery Piscine web",
    campus: "Paris",
    applied: 20,
    capacity: 20,
    startDate: "08/10/2026",
    endDate: "08/11/2026",
    onboardingSessions: 3,
    registrationStatus: "Open",
    archived: false,
    breakdown: { applied: 5, selected: 5, confirmed: 5, onboarded: 5, maxCapacity: 20 },
  },
  {
    id: "sess-nov-2026",
    name: "November 2026",
    program: "Discovery Piscine web",
    campus: "Paris",
    applied: 100,
    capacity: null,
    startDate: "08/11/2026",
    endDate: "08/12/2026",
    onboardingSessions: 3,
    registrationStatus: OPEN_UNTIL,
    archived: false,
    breakdown: { applied: 100, selected: 72, confirmed: 68, onboarded: 30, maxCapacity: 120 },
  },
  {
    id: "sess-jan-2026",
    name: "January 2026",
    program: "Selection Piscine Python",
    campus: "Paris",
    applied: 210,
    capacity: 280,
    startDate: "08/12/2025",
    endDate: "08/01/2026",
    onboardingSessions: 3,
    registrationStatus: "Closed",
    archived: true,
    breakdown: { applied: 210, selected: 180, confirmed: 165, onboarded: 150, maxCapacity: 280 },
  },
  {
    id: "sess-feb-2026",
    name: "February 2026",
    program: "Common Core",
    campus: "Angouleme",
    applied: 48,
    capacity: null,
    startDate: "08/01/2026",
    endDate: "08/02/2026",
    onboardingSessions: 2,
    registrationStatus: "Closed",
    archived: true,
    breakdown: { applied: 48, selected: 40, confirmed: 38, onboarded: 36, maxCapacity: 60 },
  },
  {
    id: "sess-mar-2026",
    name: "March 2026",
    program: "Discovery Piscine web",
    campus: "Tirana",
    applied: 20,
    capacity: 20,
    startDate: "08/02/2026",
    endDate: "08/03/2026",
    onboardingSessions: 3,
    registrationStatus: "Closed",
    archived: true,
    breakdown: { applied: 20, selected: 20, confirmed: 18, onboarded: 18, maxCapacity: 20 },
  },
]

export function formatApplicants(session: ProgramSession): string {
  return session.capacity === null ? String(session.applied) : session.applied + " / " + session.capacity
}

export function findSession(id: string): ProgramSession | undefined {
  return PROGRAM_SESSIONS.find((session) => session.id === id)
}

const DEFAULT_SLOTS: OnboardingSlot[] = [
  { id: "slot-1", date: "08/03/2026", slot: "09:00 - 12:00", capacity: 40, confirmed: 38, location: "Cluster E1 - Paris" },
  { id: "slot-2", date: "09/03/2026", slot: "14:00 - 17:00", capacity: 40, confirmed: 31, location: "Cluster E2 - Paris" },
  { id: "slot-3", date: "10/03/2026", slot: "09:00 - 12:00", capacity: 40, confirmed: 12, location: "Cluster E1 - Paris" },
]

const SLOTS_BY_SESSION: Record<string, OnboardingSlot[]> = {
  "sess-oct-2026": [
    { id: "slot-o1", date: "08/10/2026", slot: "09:00 - 12:00", capacity: 10, confirmed: 10, location: "Cluster C1 - Paris" },
    { id: "slot-o2", date: "09/10/2026", slot: "14:00 - 17:00", capacity: 5, confirmed: 5, location: "Cluster C1 - Paris" },
    { id: "slot-o3", date: "10/10/2026", slot: "09:00 - 12:00", capacity: 5, confirmed: 3, location: "Cluster C2 - Paris" },
  ],
}

export function onboardingFor(id: string): OnboardingSlot[] {
  return SLOTS_BY_SESSION[id] ?? DEFAULT_SLOTS
}

const DEFAULT_APPLICANTS: Applicant[] = [
  { id: "app-1", name: "Anita Cruz", login: "acruz", status: "Onboarded", appliedOn: "02/03/2026" },
  { id: "app-2", name: "Abraham Baker", login: "abaker", status: "Confirmed", appliedOn: "03/03/2026" },
  { id: "app-3", name: "Lena Fischer", login: "lfischer", status: "Confirmed", appliedOn: "03/03/2026" },
  { id: "app-4", name: "Youssef Haddad", login: "yhaddad", status: "Selected", appliedOn: "04/03/2026" },
  { id: "app-5", name: "Marta Oliveira", login: "moliveira", status: "Selected", appliedOn: "05/03/2026" },
  { id: "app-6", name: "Kenji Watanabe", login: "kwatanabe", status: "Applied", appliedOn: "06/03/2026" },
]

export function applicantsFor(_id: string): Applicant[] {
  return DEFAULT_APPLICANTS
}
