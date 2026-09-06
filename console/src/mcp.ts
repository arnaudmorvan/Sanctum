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

/** Le tampon du build : quel commit est servi, et d'où vient le code. Même origine, pas de
 *  clé. C'est ce qui permet à la console de dire à un dev COMMENT cloner un parcours sans
 *  qu'aucune URL de dépôt ne soit écrite en dur ici. */
export async function lireVersion(): Promise<Version> {
  const r = await fetch("/version.json")
  if (!r.ok) throw new Error(`version.json → HTTP ${r.status}`)
  return (await r.json()) as Version
}

/** Retire un parcours du repo des protos — un commit, réversible par `git revert`. Le
 *  serveur MCP tient le PAT ; la console ne fait que présenter la clé. Le parcours ne
 *  disparaît du site qu'au prochain déploiement : `protos.json` est écrit par le build. */
export async function supprimerProto(slug: string): Promise<Suppression> {
  const cle = lireCle()
  const r = await fetch(`${BASE}/console/protos/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: cle ? { "X-DS-Key": cle } : {},
  })
  if (r.status === 401) throw new ErreurAcces("Clé refusée par le serveur.")
  if (r.status === 404) throw new Error("Le serveur ne sait pas supprimer les parcours (route absente ou parcours déjà retiré).")
  if (!r.ok) {
    let detail = `HTTP ${r.status}`
    try {
      detail = ((await r.json()) as { error?: string }).error ?? detail
    } catch {
      /* corps non JSON : le statut suffit */
    }
    throw new Error(detail)
  }
  return (await r.json()) as Suppression
}

/** Teste une clé SANS la stocker : c'est ce qui permet à l'écran de connexion de dire
 *  « refusée » plutôt que d'enregistrer une clé fausse et de laisser six onglets échouer
 *  chacun de leur côté. Rend le résumé en cas de succès — l'appel sert deux fois. */
export async function verifierCle(cle: string): Promise<Resume> {
  const r = await fetch(`${BASE}/console/resume.json`, { headers: { "X-DS-Key": cle } })
  if (r.status === 401) throw new ErreurAcces("Clé refusée par le serveur.")
  if (!r.ok) throw new Error(`Serveur injoignable (HTTP ${r.status}).`)
  return (await r.json()) as Resume
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
  series?: { calls?: number[]; sessions?: number[]; errors?: number[] }
  heatmap?: number[][]
  payloadTop?: Paire[]
  aliases?: Array<{ searched: string; suggested: string; count: number; score: number }>
  requested?: Array<{ group: string; items: Paire[] }>
  matrix?: Array<{ tool: string; row: number[] }>
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

/** Écrit par `scripts/build-all.mjs`. `depot` est null quand le build n'a trouvé ni
 *  variables Railway ni remote git — la console dit alors le dossier, pas l'URL. */
export type Depot = {
  proprietaire: string
  nom: string
  branche: string
  url: string
  clone: string
  dossier_protos: string
}

export type Version = {
  commit: string | null
  construit_le: string
  depot?: Depot | null
}

export type Suppression = { ok: true; slug: string; commit: string; fichiers: number }
