export type Statut = "en-attente" | "acceptee" | "refusee"

export type Demande = {
  id: string
  etudiant: string
  motif: string
  heures: number
  statut: Statut
  depose_le: string
}

export const DEMANDES: Demande[] = [
  { id: "d-1", etudiant: "Camille Roy", motif: "Stage en entreprise", heures: 35, statut: "en-attente", depose_le: "2026-08-28" },
  { id: "d-2", etudiant: "Sacha Nguyen", motif: "Projet associatif", heures: 12, statut: "acceptee", depose_le: "2026-08-24" },
  { id: "d-3", etudiant: "Ilyes Benali", motif: "Mission freelance", heures: 20, statut: "refusee", depose_le: "2026-08-19" },
]

export const parId = (id: string) => DEMANDES.find((d) => d.id === id)

export const LIBELLE: Record<Statut, string> = {
  "en-attente": "En attente",
  acceptee: "Acceptée",
  refusee: "Refusée",
}
