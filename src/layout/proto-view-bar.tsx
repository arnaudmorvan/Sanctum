import { Button } from "@42/ui-react/button"
import { ArrowLeft } from "lucide-react"
import { hrefOf, type ProtoNavItem, type ProtoView } from "../proto-types"
import { TYPO } from "../typo"
import { MARQUE_UI } from "./cible"
import { Inspecteur } from "./inspecteur"
import { Retours } from "./retours"

/** La barre du bas : l'OUTILLAGE du prototype, pas son produit. Elle ramène à la galerie
 *  et donne accès direct aux écrans déclarés dans VIEWS — sans que le PO n'ait rien à
 *  câbler : il ajoute une entrée, elle apparaît ici. À droite, les outils de revue :
 *  l'inspecteur d'origine (kit ou écrit à la main) et le dépôt d'un retour.
 *
 *  Quand le parcours exporte `NAV`, la sidebar produit porte déjà une partie des écrans.
 *  Les relister ici faisait deux navigations pour la même cible (« Learn » à gauche,
 *  « My program » en bas). Règle : un écran qu'une entrée de NAV vise n'apparaît pas dans
 *  la barre ; restent les écrans PROFONDS (module, projet, détail…) qu'on ne peut atteindre
 *  qu'en traversant le produit — c'est exactement ce dont un PO a besoin en revue. */
export const ProtoViewBar = ({
  views,
  current,
  nav,
  titre,
}: {
  views: ProtoView[]
  current?: ProtoView
  nav?: ProtoNavItem[]
  titre?: string
}) => {
  const visesParNav = new Set(
    (nav ?? []).flatMap((item) => {
      const cibles: string[] = []
      if (item.path) cibles.push(`#/${item.path}`)
      if (item.href) cibles.push(item.href)
      return cibles
    }),
  )
  const ecrans = views.filter((v) => !v.hidden && !visesParNav.has(hrefOf(v)))

  return (
    <nav
      {...{ [MARQUE_UI]: "" }}
      aria-label="Outils du prototype"
      className="flex shrink-0 flex-wrap items-center gap-1 border-white/10 border-t bg-gray-dark-950 px-2 py-1.5"
    >
      <Button variant="subtle" size="xs" asChild>
        <a href="/">
          <ArrowLeft size={14} aria-hidden="true" />
          Tous les protos
        </a>
      </Button>
      {titre ? (
        <span className={`${TYPO.nav} ms-2 truncate text-[11px] text-gray-dark-500`}>{titre}</span>
      ) : null}
      {ecrans.length > 0 ? (
        <span className="ms-3 flex flex-wrap items-center gap-1">
          <span className="me-1 text-gray-dark-500 text-xs">
            {nav ? "Écrans profonds" : "Écrans"}
          </span>
          {ecrans.map((v) => {
            const on = v === current
            return (
              <Button key={v.path} variant={on ? "light" : "subtle"} size="xs" asChild>
                <a href={hrefOf(v)} aria-current={on ? "page" : undefined}>
                  {v.label}
                </a>
              </Button>
            )
          })}
        </span>
      ) : null}
      {/* L'inspecteur porte son propre `ms-auto` : lui et le retour forment le bloc de
          droite, les outils de revue — la navigation reste à gauche. */}
      <Inspecteur />
      <Retours ecran={current?.label} />
    </nav>
  )
}
