// Données de démo — YAMS · Mon rythme (Amanda). Textes et chiffres repris tels quels des
// maquettes Figma (23486:2328 pour mon-rythme, 23315:330 / 23329:975 / 23383:40448 pour les
// trois écrans restés en V2). Rien n'est inventé au-delà de ce que le mock affiche.

export type MilestoneEtat = "done" | "done-over-ref" | "current" | "locked"

export interface Milestone {
  n: string
  ref: number
  max: number
  reel: number | null
  marge: number | null
  etat: MilestoneEtat
}

// Frise "Mon parcours" — modèle atelier 16/09 (référence + durée max par quest).
export const MILESTONES_V3: Milestone[] = [
  { n: "M1", ref: 14, max: 28, reel: 11, marge: 4, etat: "done" },
  { n: "M2", ref: 21, max: 42, reel: 19, marge: 4, etat: "done" },
  { n: "M3", ref: 21, max: 42, reel: 26, marge: 3, etat: "done-over-ref" },
  { n: "M4", ref: 35, max: 70, reel: 33, marge: 4, etat: "done" },
  { n: "M5", ref: 63, max: 126, reel: 21, marge: null, etat: "current" },
  { n: "M6", ref: 56, max: 112, reel: null, marge: null, etat: "locked" },
  { n: "M7", ref: 77, max: 154, reel: null, marge: null, etat: "locked" },
  { n: "M8", ref: 42, max: 84, reel: null, marge: null, etat: "locked" },
]

// Frise "Mon parcours" — ancien modèle (une seule durée par milestone), pour les écrans
// restés en V2 (arrêt maladie). Mêmes 8 milestones, mêmes durées de référence.
export const MILESTONES_V2 = MILESTONES_V3.map((m) => ({ n: m.n, ref: m.ref }))

export interface Projet {
  slug: string
  desc: string
  statut: "Validé" | "En review" | "À faire"
}

export const PROJETS_M5: Projet[] = [
  { slug: "minitalk", desc: "Signaux UNIX · 2 compétences", statut: "Validé" },
  { slug: "philosophers", desc: "Threads et mutex · 2 compétences", statut: "Validé" },
  { slug: "NetPractice", desc: "Réseau et adressage · 1 compétence", statut: "En review" },
  { slug: "minishell", desc: "Shell et processus · 2 compétences", statut: "À faire" },
]

export const PRESENCE_4_SEM = [
  { semaine: "S-4", heures: 28 },
  { semaine: "S-3", heures: 34 },
  { semaine: "S-2", heures: 30 },
  { semaine: "S-1", heures: 36 },
]

export const SEMAINES_SIMULATEUR = [
  { semaine: "S+1", heures: 32, milestone: "—" },
  { semaine: "S+2", heures: 32, milestone: "—" },
  { semaine: "S+3", heures: 36, milestone: "M4 validée" },
  { semaine: "S+4", heures: 36, milestone: "—" },
]

export const TRAJECTOIRE = [
  { mois: "Jan", valeur: 20 },
  { mois: "Fev", valeur: 32 },
  { mois: "Mar", valeur: 45 },
  { mois: "Avr", valeur: 58 },
  { mois: "Mai", valeur: 68 },
  { mois: "Jun", valeur: 80 },
  { mois: "Jul", valeur: 92 },
]
