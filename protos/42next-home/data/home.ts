export type Projet = {
  id: string
  nom: string
  module: string
  demarre: string
  progression: number
}

export type Etape = { libelle: string; fait: boolean }

export type Rush = {
  id: string
  nom: string
  module: string
  sujet: string
  debut: string
  duree: string
  equipe: string[]
  inscrit: boolean
  etapes: Etape[]
}

export const LEARNER = {
  prenom: "Amanda",
  initiales: "AL",
  login: "alopez",
  level: 1,
  programme: "Selection Piscine",
  acquis: 54,
  total: 100,
  githubLie: false,
}

export const PROJETS: Projet[] = [
  {
    id: "p-1",
    nom: "C Project Tutorial",
    module: "C - Fondamentaux",
    demarre: "il y a 1 jour",
    progression: 35,
  },
  {
    id: "p-2",
    nom: "Shell Basics",
    module: "Unix - Ligne de commande",
    demarre: "il y a 3 jours",
    progression: 70,
  },
]

export const REVIEWS = { faites: 3, attendues: 6 }

export const TEMPS = { restantMinutes: 187, totalMinutes: 360 }

export const FEEDBACK = {
  learner: "John Doe",
  activite: "C Project Tutorial",
  reviewLe: "hier, 16:20",
}

export const RUSHES: Rush[] = [
  {
    id: "rush-01",
    nom: "Piscine Rush 01",
    module: "Selection Piscine",
    sujet:
      "Reconstruire une bibliotheque de manipulation de chaines en C, a trois, en 36 heures.",
    debut: "samedi 5 septembre, 13:00",
    duree: "36 heures",
    equipe: ["Amanda Lopez", "John Doe", "Sacha Nguyen"],
    inscrit: false,
    etapes: [
      { libelle: "S'inscrire au rush", fait: false },
      { libelle: "Decouvrir son equipe (tirage au sort)", fait: false },
      { libelle: "Rendre le sujet sur GitHub", fait: false },
      { libelle: "Passer la Rush Review", fait: false },
    ],
  },
]

export const parId = (id: string) => RUSHES.find((r) => r.id === id)

export const enHeures = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}`
