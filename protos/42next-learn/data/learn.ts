/** Donnees relevees dans le proto HTML 42next-lms-prototype_47, pages
 *  learn.modules / learn.module / learn.project rendues par le proto lui-meme.
 *  Le texte du proto est le texte du code. */

export type Statut = "validated" | "progress" | "available" | "locked"

export const PROGRAMME = { nom: "Common core", version: "v4.1.0" }

export const VUES_PROGRAMME = ["Cards", "Map"]

export const MODULES: { slug: string; nom: string; statut: Statut; skills: string; pct: number; activites: string; ouvert?: boolean }[] = [
  { slug: "programming-fundamentals", nom: "Programming Fundamentals", statut: "validated", skills: "8/8 skills", pct: 100, activites: "5 activities" },
  { slug: "systems-and-networks-administration", nom: "Systems & networks administration", statut: "progress", skills: "3/7 skills", pct: 43, activites: "4 activities", ouvert: true },
  { slug: "object-oriented-programming", nom: "Object-oriented programming", statut: "available", skills: "0/8 skills", pct: 0, activites: "14 activities" },
  { slug: "algorithmics", nom: "Algorithmics", statut: "locked", skills: "0/5 skills", pct: 0, activites: "3 activities" },
  { slug: "artificial-intelligence", nom: "Artificial intelligence", statut: "locked", skills: "0/5 skills", pct: 0, activites: "3 activities" },
  { slug: "system-and-network-programming", nom: "System & network programming", statut: "locked", skills: "0/5 skills", pct: 0, activites: "3 activities" },
  { slug: "web-programming", nom: "Web programming", statut: "locked", skills: "0/6 skills", pct: 0, activites: "1 activity" },
]

/** Un seul statut -> une seule couleur de badge, toujours la meme sur les 3 ecrans. */
export const BADGE_STATUT: Record<Statut, { libelle: string; color: "green" | "pink" | "gray" }> = {
  validated: { libelle: "Success", color: "green" },
  progress: { libelle: "In progress", color: "pink" },
  available: { libelle: "NEW", color: "gray" },
  locked: { libelle: "Locked", color: "gray" },
}

export const MODULE = {
  slug: "systems-and-networks-administration",
  nom: "Systems & networks administration",
  debut: "02 Jun 2026",
  version: "v2.1.3",
  versionSuivante: { numero: "v2.2.0", note: "upd. 18 Aug 2026", type: "minor" },
  abstract: "In the Administration System module, you will step into the role of a system administrator, learning to build, secure, and manage server infrastructure from scratch. You will master virtualization, networking fundamentals, and modern containerization technologies, gaining the power to deploy and orchestrate complex multi-service applications. By the end, you will possess the skills to manage modern infrastructure with confidence and efficiency.",
  exigences: {
    faites: 1,
    total: 4,
    groupes: [
      { cle: "projects", items: [
        { id: "Common_Core-Project-Network-Born2beRoot", fait: true },
        { id: "Common_Core-Project-Network-Net_practice", fait: false },
        { id: "Common_Core-Project-Network-Inception", fait: false },
      ] },
      { cle: "exams", items: [
        { id: "exam---systems-and-networks-administration", fait: false },
      ] },
    ],
  },
  activites: [
    { slug: "born2beroot", nom: "born2beroot", type: "Project", statut: "validated" as Statut, ouvert: true },
    { slug: "net_practice", nom: "net_practice", type: "Project", statut: "progress" as Statut },
    { slug: "inception", nom: "inception", type: "Project", statut: "locked" as Statut },
  ],
  skills: { faites: 3, total: 7, liste: [
    { nom: "Virtualisation", fait: true },
    { nom: "System hardening", fait: true },
    { nom: "Rigor", fait: true },
    { nom: "Subnetting", fait: false },
    { nom: "Network protocols", fait: false },
    { nom: "Containerisation", fait: false },
    { nom: "Orchestration", fait: false },
  ] },
  exam: { statut: "Failed", derniere: "Last attempt Thu 13 Aug", note: 55, bareme: 100 },
}

export const PROJET = {
  slug: "born2beroot",
  nom: "born2beroot",
  fin: "Sat 18 Jul 2026 · 15:30",
  abstract: "Step into the world of virtualization and learn how to create and manage isolated environments on a single machine. This project introduces key concepts that are foundational to modern infrastructure and cloud technologies, teaching learners essential system administration skills through hands-on virtual machine configuration and security implementation.",
  tentatives: ["Attempt 1", "Attempt 2", "Attempt 3", "Attempt 4"],
  tentativeCourante: "Attempt 4",
  details: [
    { cle: "Version of this attempt", valeur: "v2.1.0" },
    { cle: "Technology", valeur: "Python" },
    { cle: "Uses git", valeur: "Yes" },
    { cle: "Participants", valeur: "Solo" },
  ],
  ressources: [
    { titre: "en.subject.pdf", note: "Subject · v1.2 · 313 KB" },
    { titre: "Project feedback", note: "Give feedback on the content of born2beroot · v2.1.0" },
  ],
  chrono: [
    { cle: "Started", valeur: "Mon 06 Jul 2026 · 09:05" },
    { cle: "Submitted", valeur: "Thu 16 Jul 2026 · 20:12" },
    { cle: "Ended", valeur: "Sat 18 Jul 2026 · 15:30" },
    { cle: "Total time", valeur: "12 d 6 h" },
  ],
  repo: "git@vogsphere.42.fr:vogsphere/intra-uuid-93ba07de-born2beroot-erizzi",
  etapes: ["Peer review", "Peer review", "Peer review"],
  reviews: [
    { etape: "Step 1 — Peer review", par: "tnguyen", jour: "Fri 17 Jul 2026", creneau: "started: 09:50 · ended: 10:20 (30 minutes)", verdict: "Pass", texte: "Both required items from the previous attempt are fixed. Good defense on LVM." },
    { etape: "Step 2 — Peer review", par: "sbenali", jour: "Fri 17 Jul 2026", creneau: "started: 14:52 · ended: 15:40 (48 minutes)", verdict: "Pass", texte: "Signature matches. Hostname, partitions and services all conform to the subject." },
    { etape: "Step 3 — Peer review", par: "pmoreau", jour: "Sat 18 Jul 2026", creneau: "started: 14:30 · ended: 15:30 (60 minutes)", verdict: "Pass", texte: "Bonus partitioning done and defended. Nothing to report." },
  ],
  cta: "Who helped you on this attempt?",
}
