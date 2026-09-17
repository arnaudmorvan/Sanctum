// Données de démo — Common Core d'Amanda, modèle "trois seuils".
// Reprises de l'exploration HTML du 17/09. Ce que le mock porte réellement : les durées
// de référence (semaines × 7) et l'objectif de M5 (50 j). Le reste — objectif des sept
// autres milestones, réel des quatre passés — est de la donnée de démonstration, ajoutée
// pour que les trois pistes se lisent. À remplacer par la vraie règle produit.

export type MilestoneState = "done" | "current" | "todo"

export interface Milestone {
  id: string
  name: string
  /** Durée de référence : le seuil pédagogique, celui que le staff voit. */
  ref: number
  /** Objectif personnel de départ. Privé : la learner seule est prévenue. */
  goal: number
  /** Jours actifs réellement passés. 0 tant que le milestone n'a pas commencé. */
  actual: number
  state: MilestoneState
  work: string
}

export const MILESTONES: Milestone[] = [
  { id: "M1", name: "Milestone 1", ref: 14, goal: 12, actual: 12, state: "done", work: "Libft · 70 h" },
  { id: "M2", name: "Milestone 2", ref: 21, goal: 17, actual: 26, state: "done", work: "ft_printf · get_next_line · 100 h" },
  { id: "M3", name: "Milestone 3", ref: 21, goal: 17, actual: 28, state: "done", work: "push_swap · 70 h" },
  { id: "M4", name: "Milestone 4", ref: 35, goal: 29, actual: 38, state: "done", work: "Python Piscine · A-Maze-ing · born2beroot · netpractice · 220 h" },
  { id: "M5", name: "Milestone 5", ref: 63, goal: 50, actual: 30, state: "current", work: "Fly-in · Call Me Maybe · RAG Against The Machine · Codexion" },
  { id: "M6", name: "Milestone 6", ref: 56, goal: 46, actual: 0, state: "todo", work: "Agent Smith · tree_nity · The Answer Protocol · 350 h" },
  { id: "M7", name: "Milestone 7", ref: 77, goal: 63, actual: 0, state: "todo", work: "Pac-Man · inception · 300 h" },
  { id: "M8", name: "Milestone 8", ref: 42, goal: 36, actual: 0, state: "todo", work: "ft_transcendance · 280 h" },
]

export const CURRENT = 4

/** Axe FIXE, en jours CALENDAIRES : plafond (658) + marge posable (15) + place pour
 *  120 jours de congés planifiables. Fixe, sinon poser un congé annulerait
 *  visuellement son propre effet — tout rétrécirait d'autant. */
export const AXIS = 793
export const BREAK_ROOM = 120
export const BREAK_MAX = 90
export const MARGIN_STOCK = 15
/** Congés que la NORME suppose. Nulle part écrit en jours : paramètre, pas constante. */
export const REF_OFF_DEFAULT = 35

export const ATTENDANCE = [34, 41, 38, 29]
export const ENGAGEMENT = [3, 2, 4, 1]

export const REF_TOTAL = MILESTONES.reduce((s, m) => s + m.ref, 0)
export const CAP_TOTAL = REF_TOTAL * 2
