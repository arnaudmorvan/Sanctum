/** Le client du serveur MCP.
 *
 *  La console est un site statique servi par Railway ; le MCP est un autre service. Ses
 *  routes exposent `Access-Control-Allow-Origin: *`, donc l'appel direct passe — pas de
 *  proxy à écrire.
 *
 *  ⚠️ `DASHBOARD_KEY` est un secret PARTAGÉ, saisi une fois et gardé dans le navigateur.
 *  Ce n'est pas une identité : ça ne dit pas QUI regarde. L'auth par personne existe côté
 *  serveur (access/users.json, jetons 42ds_…) — l'onglet Accès la montre.
 */
const BASE = (
  import.meta.env.VITE_MCP_URL ?? "https://mcp-42-production.up.railway.app"
).replace(/\/$/, "")

const CLE = "42ds.console.cle"

export const lireCle = (): string => {
  try {
    return localStorage.getItem(CLE) ?? ""
  } catch {
    return "" // navigation privée, stockage bloqué : on redemande la clé
  }
}

export const ecrireCle = (v: string): void => {
  try {
    v ? localStorage.setItem(CLE, v) : localStorage.removeItem(CLE)
  } catch {
    /* sans stockage, la clé vit le temps de la session — le reste fonctionne */
  }
}

export class ErreurAcces extends Error {}

export async function lire<T>(route: string): Promise<T> {
  const cle = lireCle()
  const r = await fetch(`${BASE}${route}`, { headers: cle ? { "X-DS-Key": cle } : {} })
  if (r.status === 401) throw new ErreurAcces("Clé refusée par le serveur.")
  if (!r.ok) throw new Error(`${route} → HTTP ${r.status}`)
  return (await r.json()) as T
}

/** Les protos sont écrits par le build, à côté de la console : même origine, pas de clé. */
export async function lireProtos<T>(): Promise<T> {
  const r = await fetch("/protos.json")
  if (!r.ok) throw new Error(`protos.json → HTTP ${r.status}`)
  return (await r.json()) as T
}

export const URL_MCP = BASE

// ---------------------------------------------------------------- formes servies

export type Paire = { n: string; v: number }

export type Metriques = {
  meta?: { range?: string; updated?: string; period?: string }
  totalCalls?: number
  activeTools?: number
  clients?: number
  errorRate?: number
  latencyMs?: number
  tokensServed?: number
  creditsSaved?: number
  thinkMs?: number
  topTools?: Paire[]
  gaps?: Paire[]
  gapsTotal?: number
  sequences?: Paire[]
  clientsList?: string[]
  recent?: Array<{ t: string; n: string; lat: number; ok: boolean }>
}

export type Session = {
  id: string
  client: string
  calls: number
  errors: number
  misses: number
  loops: number
  repeats: number
  durationS: number
  tokens: number
  friction: number
}

export type Qualite = {
  points?: Array<Record<string, unknown>>
  empty?: boolean
}

export type Entree = { nom: string; type: string; taille: number }
export type Arbre = { dir: string; entrees: Entree[] }
export type Fichier = { path: string; contenu: string; tronque?: boolean }

export type Acces = {
  utilisateurs: Array<{
    id?: string
    nom?: string
    email?: string
    role?: string
    actif?: boolean
    ajoute_le?: string
  }>
  roles: Record<string, string>
  regime?: string
  lecture_seule?: boolean
  erreur?: string
}

export type Resume = {
  skills?: number
  foundations?: number
  produit?: number
  reports?: number
  composants?: number
}
