export type ModuleData = {
  name: string
  summary: string
  current: { name: string; note: string; met: number; total: number }
  requirements: { label: string; state: string }[]
  activities: { name: string; status: string; score: string }[]
  exam: { label: string; stamp: string; note: string }
  skills: string[]
}

export const MODULES: Record<string, ModuleData> = {
  "web-server-from-scratch": {
    name: "Web server from scratch",
    summary: "Build an HTTP/1.1 server, then serve a static site with it. Milestone 03 — Network & Web.",
    current: { name: "Activity 03 — HTTP routing", note: "Attempt scored 82. Two peer reviews seal the activity.", met: 3, total: 7 },
    requirements: [
      { label: "All mandatory activities validated", state: "3 / 5" },
      { label: "Two reviews given on this module", state: "1 / 2" },
      { label: "Exam 01 passed", state: "Not yet" },
    ],
    activities: [
      { name: "Activity 01 — Sockets", status: "Validated", score: "95" },
      { name: "Activity 02 — Request parsing", status: "Validated", score: "88" },
      { name: "Activity 03 — HTTP routing", status: "In review", score: "82" },
      { name: "Activity 04 — CGI", status: "Available", score: "—" },
      { name: "Activity 05 — Load test", status: "Locked", score: "—" },
    ],
    exam: { label: "Exam 01", stamp: "Thu Sep 24 · 9:00 AM", note: "Cluster e1 · 18 seats left · waitlist open" },
    skills: ["Network & system", "Web", "Rigor"],
  },
  "concurrency-and-threads": {
    name: "Concurrency & threads",
    summary: "Threads, mutexes and starvation, measured on a dinner of philosophers. Milestone 03 — Network & Web.",
    current: { name: "Activity 04 — Starvation", note: "Attempt open, closes Sep 22, 2026 at 11:42 PM.", met: 5, total: 7 },
    requirements: [
      { label: "All mandatory activities validated", state: "5 / 6" },
      { label: "One review given on this module", state: "1 / 1" },
      { label: "Exam 01 passed", state: "Not yet" },
    ],
    activities: [
      { name: "Activity 01 — Threads", status: "Validated", score: "91" },
      { name: "Activity 02 — Mutexes", status: "Validated", score: "84" },
      { name: "Activity 03 — Deadlocks", status: "Validated", score: "79" },
      { name: "Activity 04 — Starvation", status: "Attempt open", score: "—" },
    ],
    exam: { label: "Exam 01", stamp: "Thu Sep 24 · 9:00 AM", note: "Cluster e1 · 18 seats left · waitlist open" },
    skills: ["Algorithms & AI", "Rigor"],
  },
  "shell-02": {
    name: "Shell 02",
    summary: "Pipes, redirections and job control on top of the first shell. Milestone 03 — Network & Web.",
    current: { name: "Activity 05 — Job control", note: "Submitted. The moulinette queued it 18 min ago.", met: 6, total: 7 },
    requirements: [
      { label: "All mandatory activities validated", state: "6 / 7" },
      { label: "Two reviews given on this module", state: "2 / 2" },
      { label: "Exam 01 passed", state: "Not yet" },
    ],
    activities: [
      { name: "Activity 03 — Pipes", status: "Validated", score: "93" },
      { name: "Activity 04 — Redirections", status: "Validated", score: "87" },
      { name: "Activity 05 — Job control", status: "In the queue", score: "—" },
    ],
    exam: { label: "Exam 01", stamp: "Thu Sep 24 · 9:00 AM", note: "Cluster e1 · 18 seats left · waitlist open" },
    skills: ["Network & system", "Rigor"],
  },
}
