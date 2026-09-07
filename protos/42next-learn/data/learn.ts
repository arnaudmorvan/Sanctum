/** Data lifted from the HTML prototype 42next-lms-prototype_47, pages
 *  learn.modules / learn.module / learn.project as the prototype itself renders them.
 *  The prototype's copy IS the copy of the code. */

export type Status = "validated" | "progress" | "available" | "locked"

export const PROGRAM = { name: "Common core", version: "v4.1.0" }

export const PROGRAM_VIEWS = ["Cards", "Map"]

export const MODULES: { slug: string; name: string; status: Status; skills: string; pct: number; activities: string; open?: boolean }[] = [
  { slug: "programming-fundamentals", name: "Programming Fundamentals", status: "validated", skills: "8/8 skills", pct: 100, activities: "5 activities" },
  { slug: "systems-and-networks-administration", name: "Systems & networks administration", status: "progress", skills: "3/7 skills", pct: 43, activities: "4 activities", open: true },
  { slug: "object-oriented-programming", name: "Object-oriented programming", status: "available", skills: "0/8 skills", pct: 0, activities: "14 activities" },
  { slug: "algorithmics", name: "Algorithmics", status: "locked", skills: "0/5 skills", pct: 0, activities: "3 activities" },
  { slug: "artificial-intelligence", name: "Artificial intelligence", status: "locked", skills: "0/5 skills", pct: 0, activities: "3 activities" },
  { slug: "system-and-network-programming", name: "System & network programming", status: "locked", skills: "0/5 skills", pct: 0, activities: "3 activities" },
  { slug: "web-programming", name: "Web programming", status: "locked", skills: "0/6 skills", pct: 0, activities: "1 activity" },
]

/** One status -> one badge color, always the same one across the 3 screens. */
export const STATUS_BADGE: Record<Status, { label: string; color: "green" | "pink" | "gray" }> = {
  validated: { label: "Success", color: "green" },
  progress: { label: "In progress", color: "pink" },
  available: { label: "NEW", color: "gray" },
  locked: { label: "Locked", color: "gray" },
}

export const MODULE = {
  slug: "systems-and-networks-administration",
  name: "Systems & networks administration",
  start: "02 Jun 2026",
  version: "v2.1.3",
  nextVersion: { number: "v2.2.0", note: "upd. 18 Aug 2026", type: "minor" },
  abstract: "In the Administration System module, you will step into the role of a system administrator, learning to build, secure, and manage server infrastructure from scratch. You will master virtualization, networking fundamentals, and modern containerization technologies, gaining the power to deploy and orchestrate complex multi-service applications. By the end, you will possess the skills to manage modern infrastructure with confidence and efficiency.",
  requirements: {
    done: 1,
    total: 4,
    groups: [
      { key: "projects", items: [
        { id: "Common_Core-Project-Network-Born2beRoot", done: true },
        { id: "Common_Core-Project-Network-Net_practice", done: false },
        { id: "Common_Core-Project-Network-Inception", done: false },
      ] },
      { key: "exams", items: [
        { id: "exam---systems-and-networks-administration", done: false },
      ] },
    ],
  },
  activities: [
    { slug: "born2beroot", name: "born2beroot", type: "Project", status: "validated" as Status, open: true },
    { slug: "net_practice", name: "net_practice", type: "Project", status: "progress" as Status },
    { slug: "inception", name: "inception", type: "Project", status: "locked" as Status },
  ],
  skills: { done: 3, total: 7, list: [
    { name: "Virtualisation", done: true },
    { name: "System hardening", done: true },
    { name: "Rigor", done: true },
    { name: "Subnetting", done: false },
    { name: "Network protocols", done: false },
    { name: "Containerisation", done: false },
    { name: "Orchestration", done: false },
  ] },
  exam: { status: "Failed", last: "Last attempt Thu 13 Aug", score: 55, outOf: 100 },
}

export const PROJECT = {
  slug: "born2beroot",
  name: "born2beroot",
  end: "Sat 18 Jul 2026 · 15:30",
  abstract: "Step into the world of virtualization and learn how to create and manage isolated environments on a single machine. This project introduces key concepts that are foundational to modern infrastructure and cloud technologies, teaching learners essential system administration skills through hands-on virtual machine configuration and security implementation.",
  attempts: ["Attempt 1", "Attempt 2", "Attempt 3", "Attempt 4"],
  currentAttempt: "Attempt 4",
  details: [
    { key: "Version of this attempt", value: "v2.1.0" },
    { key: "Technology", value: "Python" },
    { key: "Uses git", value: "Yes" },
    { key: "Participants", value: "Solo" },
  ],
  resources: [
    { title: "en.subject.pdf", note: "Subject · v1.2 · 313 KB" },
    { title: "Project feedback", note: "Give feedback on the content of born2beroot · v2.1.0" },
  ],
  timings: [
    { key: "Started", value: "Mon 06 Jul 2026 · 09:05" },
    { key: "Submitted", value: "Thu 16 Jul 2026 · 20:12" },
    { key: "Ended", value: "Sat 18 Jul 2026 · 15:30" },
    { key: "Total time", value: "12 d 6 h" },
  ],
  repo: "git@vogsphere.42.fr:vogsphere/intra-uuid-93ba07de-born2beroot-erizzi",
  steps: ["Peer review", "Peer review", "Peer review"],
  reviews: [
    { step: "Step 1 — Peer review", by: "tnguyen", day: "Fri 17 Jul 2026", slot: "started: 09:50 · ended: 10:20 (30 minutes)", verdict: "Pass", text: "Both required items from the previous attempt are fixed. Good defense on LVM." },
    { step: "Step 2 — Peer review", by: "sbenali", day: "Fri 17 Jul 2026", slot: "started: 14:52 · ended: 15:40 (48 minutes)", verdict: "Pass", text: "Signature matches. Hostname, partitions and services all conform to the subject." },
    { step: "Step 3 — Peer review", by: "pmoreau", day: "Sat 18 Jul 2026", slot: "started: 14:30 · ended: 15:30 (60 minutes)", verdict: "Pass", text: "Bonus partitioning done and defended. Nothing to report." },
  ],
  cta: "Who helped you on this attempt?",
}
