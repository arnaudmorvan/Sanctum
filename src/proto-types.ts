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

/** Une entrée de la navigation latérale — le CHROME de l'app, rendu par le squelette.
 *
 *  `views.tsx` peut exporter `NAV: ProtoNavItem[]` en plus de `VIEWS` : le squelette rend
 *  alors la sidebar produit (AppShell + NavLink du kit) et le fond ambiant, et les écrans
 *  n'écrivent QUE la zone centrale. Sans export `NAV`, rien ne change : le parcours garde
 *  le cadre nu historique (les parcours qui dessinent leur propre chrome continuent de
 *  marcher — mais un NOUVEAU parcours ne doit plus le faire).
 *
 *  - `path` : le `path` d'un écran de `VIEWS` — la cible ET le critère d'état courant.
 *  - `href` : cible explicite (route paramétrée : "#/profile/aserrano"). Prime sur `path`.
 *  - ni `path` ni `href` : rangée de catégorie sans lien (rendue non cliquable).
 *  - `icon` : un ReactNode, typiquement une icône lucide (`<House size={16} />`).
 *  - `match` : préfixe de path qui rend AUSSI l'entrée courante — pour qu'une section
 *    reste allumée sur ses écrans profonds (`match: "learn/"` couvre `learn/module/:slug`). */
export type ProtoNavItem = {
  label: string
  path?: string
  href?: string
  icon?: ReactNode
  match?: string
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
