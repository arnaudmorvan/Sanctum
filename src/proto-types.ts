import type { ReactNode } from "react"

/** Un écran du parcours. C'est le SEUL contrat que le PO doit connaître. */
export type ProtoView = {
  /** Motif de hash, sans le `#/`. Un segment `:param` capture une valeur. */
  path: string
  /** Libellé affiché dans la barre de navigation, en bas. */
  label: string
  /** Lien concret ouvert par la barre. Obligatoire dès que `path` porte un `:param`. */
  href?: string
  /** Retire l'entrée de la barre sans la retirer du routage. */
  hidden?: boolean
  render: (params: Record<string, string>) => ReactNode
}

export const hrefOf = (view: ProtoView): string => view.href ?? `#/${view.path}`

export type ViewMatch = { view: ProtoView; params: Record<string, string> }

/** Première vue dont le motif couvre `hash`, paramètres capturés au passage.
 *  Comparaison segment à segment : un motif ne matche qu'à longueur égale, ce qui laisse
 *  `demandes` et `demandes/:id` coexister sans que le premier n'avale le second. */
export const matchView = (views: ProtoView[], hash: string): ViewMatch | undefined => {
  const segments = hash.replace(/^#\/?/, "").split("/").filter(Boolean)
  for (const view of views) {
    const pattern = view.path.split("/").filter(Boolean)
    if (pattern.length !== segments.length) continue
    const params: Record<string, string> = {}
    const ok = pattern.every((part, i) => {
      if (part.startsWith(":")) {
        params[part.slice(1)] = segments[i]
        return true
      }
      return part === segments[i]
    })
    if (ok) return { view, params }
  }
  return undefined
}
