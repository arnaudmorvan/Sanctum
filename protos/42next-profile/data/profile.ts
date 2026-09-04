export type Niveau = "vide" | "faible" | "moyen" | "fort" | "intense"

/** Rampe d'intensite de presence. Le report 42next-profile la nomme
 *  utility-pink-100/300/500/700 + un niveau vide. Le DS n'expose pas encore cette
 *  echelle : elle est mappee ici, donc corrigeable en une ligne. */
export const CLASSE_NIVEAU: Record<Niveau, string> = {
  vide: "bg-gray-700",
  faible: "bg-pink-800",
  moyen: "bg-pink-700",
  fort: "bg-pink-500",
  intense: "bg-pink-300",
}

export const LEARNER = {
  login: "aserrano",
  nom: "Amanda Serrano",
  initiales: "AS",
  presence: "Paris campus - workstation e1r7p12 - online now",
  level: 7,
  xp: "7.42",
  levelPct: 42,
  parcours: "Common core - started October 2025 - Paris campus.",
}

export const MILESTONE = {
  nom: "Milestone 3 - Unix & processes",
  libelle: "Required skills validated",
  validees: 8,
  requises: 10,
  note: "40 working days of reference - 28 elapsed - a milestone never blocks progression, it shows pace.",
}

export type Activite = {
  slug: string
  nom: string
  contexte: string
  note: string
  bareme: string
}

export const EN_COURS = {
  slug: "minishell",
  nom: "minishell",
  contexte: "Common core - Module 4 - Unix & processes - in team with bmartin - started 6 days ago",
  tentative: "Attempt 2",
  libelle: "Validation requirements met",
  faites: 4,
  total: 7,
  equipier: "bmartin",
  exigences: [
    { libelle: "Repository pushed and buildable", fait: true },
    { libelle: "Norm respected across every file", fait: true },
    { libelle: "No leak on the reference test suite", fait: true },
    { libelle: "Builtins implemented", fait: true },
    { libelle: "Pipes and redirections", fait: false },
    { libelle: "Signal handling", fait: false },
    { libelle: "Peer review passed", fait: false },
  ],
}

export const ACTIVITES: Activite[] = [
  { slug: "philosophers", nom: "Philosophers", contexte: "Common core - Module 4 - 3 attempts before validation", note: "125", bareme: "100" },
  { slug: "push-swap", nom: "push_swap", contexte: "Common core - Module 3 - 1 attempt before validation", note: "110", bareme: "100" },
  { slug: "get-next-line", nom: "get_next_line", contexte: "Common core - Module 2 - 2 attempts before validation", note: "100", bareme: "100" },
  { slug: "libft", nom: "libft", contexte: "Common core - Module 1 - 1 attempt before validation", note: "115", bareme: "100" },
]

/** Colonne de date etroite : format court impose par le report (Oct 25, pas Oct. 2025). */
export const PROGRAMMES = [
  { nom: "Common core", debut: "10/25", fin: "now", detail: "In progress - Paris - milestone 3 of 9 - 7 activities validated", actif: true },
  { nom: "Web Discovery Piscine", debut: "09/25", fin: "09/25", detail: "Interrupted after 4 days - no validation", actif: true },
  { nom: "Selection Piscine", debut: "07/25", fin: "08/25", detail: "Ended - validated - 54 / 100 - selected for the Common core", actif: false },
]

export const STATS = [
  { libelle: "Reviews given", precision: "to peers, all programs", valeur: "47" },
  { libelle: "Projects", precision: "validated, all attempts counted", valeur: "12" },
  { libelle: "Exams", precision: "passed out of 4 sat", valeur: "3" },
]

export const AILLEURS = [
  { libelle: "SKILLS", note: "The full skill tree and what each activity validated." },
  { libelle: "LEVEL & XP", note: "How level 7.42 was reached, activity by activity." },
  { libelle: "ACHIEVEMENTS", note: "Badges earned across programs." },
  { libelle: "ATTENDANCE", note: "Every session, filterable by day, week and month." },
]

export const VUES_PRESENCE = ["Daily", "Weekly", "Monthly", "All time"]
export const PRESENCE_TOTAL = "312H"
export const PRESENCE_NOTE = "on campus over the last 6 months"
export const PRESENCE_LECTURE = "One square per day, Monday at the top. Weeks run left to right - the last two are still to come."

const SEMAINES = 26
const JOURS = 7

const tirage = (graine: number) => () => {
  graine = (graine * 48271) % 2147483647
  return graine / 2147483647
}

/** Le vide doit rester majoritaire : environ 45 % de cellules non nulles,
 *  week-ends creux, deux dernieres semaines a venir. */
export const construirePresence = (): Niveau[][] => {
  const suivant = tirage(4242)
  return Array.from({ length: JOURS }, (_, jour) =>
    Array.from({ length: SEMAINES }, (_, semaine): Niveau => {
      if (semaine >= SEMAINES - 2) return "vide"
      const t = suivant()
      if (jour >= 5) return t > 0.88 ? "faible" : "vide"
      if (t > 0.88) return "intense"
      if (t > 0.75) return "fort"
      if (t > 0.6) return "moyen"
      if (t > 0.45) return "faible"
      return "vide"
    }),
  )
}
