/** Données de l'écran, RELEVÉES sur la frame 22505:9532 (« 42next — Home v3 · Quest map »).
 *  Les libellés sont ceux de la maquette, à la lettre — y compris ceux qui posent
 *  question (voir le report du 2026-09-06 : « Territories » et « Next mission »
 *  renomment des objets du produit, ce que foundations-context interdit au registre
 *  du jeu). On ne corrige pas un libellé en silence : on le reproduit et on le signale. */

export const LEARNER = {
  prenom: "Amanda",
  nom: "Amanda Serrano",
  contexte: "Common Core · Paris campus",
  parcours: "Common Core · Paris campus · Milestone 2 of 6",
  level: 4,
  xpPct: 70,
  xp: "740 / 1000 XP · 260 XP left before Level 5",
}

/** Couleurs de badge relevées instance par instance. ⚠️ La frame pose `grey` sur trois
 *  badges et `neutral` sur un quatrième pour un rôle voisin ; le kit ne connaît que
 *  `gray`. On pose `gray`, l'écart part en ds-action. */
export type Statut = { libelle: string; color: "green" | "orange" | "pink" | "neutral" | "gray" }

/** L'indicateur de la timeline, relevé sur `_Timeline / _CircleCheck` :
 *  State=Active + icône check · State=Checked (point plein) · State=Dashed (cercle vide). */
export type Marque = "valide" | "en-cours" | "ouvert"

export const TERRITOIRES: {
  nom: string
  detail: string
  statut: Statut
  marque: Marque
}[] = [
  {
    nom: "Libft",
    detail: "9 skills validated — your own C library.",
    statut: { libelle: "Mastered", color: "green" },
    marque: "valide",
  },
  {
    nom: "ft_printf",
    detail: "Validated, but 2 skills sit below the mastery threshold.",
    statut: { libelle: "To consolidate", color: "orange" },
    marque: "valide",
  },
  {
    nom: "Born2beroot",
    detail: "System administration — 2 activities left before validation.",
    statut: { libelle: "In progress", color: "pink" },
    marque: "en-cours",
  },
  {
    nom: "get_next_line",
    detail: "Open now. No prerequisite left to clear.",
    statut: { libelle: "Available", color: "neutral" },
    marque: "ouvert",
  },
  {
    nom: "minitalk",
    detail: "Unlocks once Born2beroot and get_next_line are validated.",
    statut: { libelle: "Locked", color: "gray" },
    marque: "ouvert",
  },
]

export const FILTRES = ["All", "In progress", "Available", "Locked"]

export const SKILLS: { nom: string; detail: string; statut: Statut }[] = [
  {
    nom: "Algorithms & data structures",
    detail: "Unlocked by Libft · 9 sub-skills validated",
    statut: { libelle: "Acquired", color: "green" },
  },
  {
    nom: "Unix processes & signals",
    detail: "Requires Born2beroot · 2 activities left",
    statut: { libelle: "In progress", color: "pink" },
  },
  {
    nom: "Peer collaboration",
    detail: "Power skill · validation criteria not specified yet",
    statut: { libelle: "Not specified", color: "gray" },
  },
  {
    nom: "Network configuration",
    detail: "Requires Unix processes & signals",
    statut: { libelle: "Locked", color: "gray" },
  },
]

/** La cinquième ligne de la card Skills n'a pas de badge : un titre et une barre. */
export const MAITRISE = { nom: "C — language mastery", pct: 30 }

export const QUETES: {
  nom: string
  xp: string
  detail: string
  pct: number
  action: string
}[] = [
  {
    nom: "Born2beroot",
    xp: "+120 XP",
    detail: "2 activities left before the module validates.",
    pct: 60,
    action: "Continue",
  },
  {
    nom: "Rush 01 peer review",
    xp: "+40 XP",
    detail: "One review to give before Sunday 18:00.",
    pct: 30,
    action: "Book a slot",
  },
]

export const HAUTS_FAITS: { nom: string; detail: string; color: "green" | "blue" | "purple" }[] = [
  {
    nom: "First territory cleared",
    detail: "Libft validated on 12 May — 9 skills acquired.",
    color: "green",
  },
  {
    nom: "Reviewer",
    detail: "10 peer reviews given. Cross-campus reviews now open to you.",
    color: "blue",
  },
  {
    nom: "New capability unlocked",
    detail: "You can now register for Rushes without a sponsor.",
    color: "purple",
  },
]

export const PROCHAINE_MISSION = {
  nom: "Rush 01 — Push_swap",
  detail: "Teams of 3 · 48 h · one Rush review, no retry.",
  decompte: "OPENS IN 2 DAYS",
  action: "Register",
}

export const TERRITOIRE_COURANT = {
  pct: 50,
  nom: "C Piscine",
  detail: "3 of 6 skills validated · 2 activities left",
}
