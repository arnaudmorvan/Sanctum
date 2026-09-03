/** Le client du serveur MCP.
 *
 *  La console est un site statique servi par Railway ; le MCP est un autre service. Les
 *  routes d'observabilité exposent `Access-Control-Allow-Origin: *`, donc l'appel direct
 *  passe — pas de proxy à écrire.
 *
 *  ⚠️ `DASHBOARD_KEY` est un secret PARTAGÉ, saisi par la personne et gardé dans son
 *  navigateur. Ce n'est pas une identité : ça ne dit pas QUI regarde. La vraie auth par
 *  personne existe côté MCP (access/users.json, jetons 42ds_…) mais aucune route HTTP ne
 *  l'expose encore — c'est ce que dit l'onglet Accès.
 */
const BASE = (
  import.meta.env.VITE_MCP_URL ?? "https://mcp-42-production.up.railway.app"
).replace(/\/$/, "")

const CLE = "42ds.console.cle"

export const lireCle = (): string => {
  try {
    return localStorage.getItem(CLE) ?? ""
  } catch {
    return "" // navigation privée, stockage bloqué : on demande la clé à chaque fois
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
