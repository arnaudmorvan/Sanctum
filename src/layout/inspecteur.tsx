import { useCallback, useEffect, useState } from "react"
import { IMPORTS_KIT } from "virtual:42-imports-kit"

/** L'inspecteur d'origine : ce que l'écran doit VRAIMENT au kit.
 *
 *  La question qu'il répond — « qu'est-ce qui est un composant `@42/ui-react`, et
 *  qu'est-ce qui est écrit à la main ? » — n'a pas de réponse dans le DOM rendu : une
 *  `Card` du kit et une `div` bricolée sont deux `div`. La réponse vient du code source,
 *  posée à la compilation par `scripts/babel-origine.mjs` en `data-42`.
 *
 *  Ce qu'il compte, et ce qu'il ne compte pas :
 *   • seuls les éléments des fichiers du parcours (`src/proto/`) portent la marque ;
 *   • le chrome (sidebar, fond ambiant, cette barre) est fourni par le squelette et
 *     n'entre donc pas dans le calcul — il ne dit rien de l'intégration de CET écran ;
 *   • les composants locaux du parcours ne sont pas marqués : ce sont leurs éléments
 *     internes qui le sont, ce qui est la bonne granularité.
 *
 *  Le taux affiché est une mesure d'éléments, pas de zones : deux `div` de mise en page
 *  autour d'une `Card` font 33 %, alors que la zone, elle, est bien couverte. Il se lit
 *  comme un ordre de grandeur et comme une LISTE — c'est le détail qui informe. */

type Compte = { nom: string; n: number }

const lire = (): { kit: Compte[]; main: Compte[] } => {
  const kit = new Map<string, number>()
  const main = new Map<string, number>()
  for (const el of document.querySelectorAll<HTMLElement>("[data-42]")) {
    const v = el.dataset["42"] ?? ""
    const [origine, ...reste] = v.split(":")
    const nom = reste.join(":")
    if (!nom) continue
    const cible = origine === "kit" ? kit : main
    cible.set(nom, (cible.get(nom) ?? 0) + 1)
  }
  const trier = (m: Map<string, number>) =>
    [...m.entries()].map(([nom, n]) => ({ nom, n })).sort((a, b) => b.n - a.n || a.nom.localeCompare(b.nom))
  return { kit: trier(kit), main: trier(main) }
}

export const Inspecteur = () => {
  const [ouvert, setOuvert] = useState(false)
  const [surligne, setSurligne] = useState(false)
  const [data, setData] = useState<{ kit: Compte[]; main: Compte[] }>({ kit: [], main: [] })

  // Relevé à l'ouverture ET à chaque changement d'écran : le hash pilote le routage,
  // donc le DOM change sous le panneau s'il reste ouvert.
  const relever = useCallback(() => setData(lire()), [])
  useEffect(() => {
    if (!ouvert) return
    relever()
    window.addEventListener("hashchange", relever)
    return () => window.removeEventListener("hashchange", relever)
  }, [ouvert, relever])

  useEffect(() => {
    const actif = ouvert && surligne
    document.documentElement.toggleAttribute("data-42-inspect", actif)
    return () => document.documentElement.removeAttribute("data-42-inspect")
  }, [ouvert, surligne])

  const nKit = data.kit.reduce((s, c) => s + c.n, 0)
  const nMain = data.main.reduce((s, c) => s + c.n, 0)
  const total = nKit + nMain
  const taux = total ? Math.round((nKit / total) * 100) : 0

  // Les composants importés par le parcours mais qu'aucune marque n'a révélés : ils ne
  // propagent pas leurs props jusqu'au DOM (cas de `SegmentGroup`). Sans cette ligne, un
  // composant du kit disparaîtrait du compte et le taux mentirait à la baisse.
  const vus = new Set(data.kit.map((c) => c.nom.split(".")[0]))
  const muets = ouvert ? IMPORTS_KIT.filter((n) => !vus.has(n)) : []

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        className={`ms-auto rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          ouvert
            ? "bg-white/10 font-semibold text-white"
            : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        Composants
      </button>

      {ouvert && (
        <div
          className="fixed inset-x-0 bottom-11 z-50 max-h-[60vh] overflow-y-auto border-gray-dark-800 border-t bg-gray-dark-950/98 px-4 py-4 backdrop-blur"
          role="dialog"
          aria-label="Origine des composants de l'écran"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-semibold text-sm text-white">
                  {taux}% du kit
                </span>
                <span className="text-gray-dark-400 text-xs">
                  {nKit} élément{nKit > 1 ? "s" : ""} @42/ui-react · {nMain} écrit
                  {nMain > 1 ? "s" : ""} à la main
                </span>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-gray-dark-400 text-xs">
                <input
                  type="checkbox"
                  checked={surligne}
                  onChange={(e) => setSurligne(e.target.checked)}
                  className="accent-pink-400"
                />
                Surligner dans l'écran
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Colonne
                titre="Composants du kit"
                sous="importés de @42/ui-react"
                puce="bg-green-400"
                items={data.kit}
                vide="Aucun composant du kit sur cet écran."
              />
              <Colonne
                titre="Écrit à la main"
                sous="éléments HTML posés dans le parcours"
                puce="bg-pink-400"
                items={data.main}
                vide="Rien d'écrit à la main."
              />
            </div>

            {muets.length > 0 && (
              <div className="flex flex-col gap-1 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2">
                <span className="text-gray-dark-300 text-xs">
                  <span className="font-semibold">Importés mais non détectés</span> — ces
                  composants du kit sont bien utilisés par l'écran, mais ils ne propagent pas
                  leurs props jusqu'au DOM : ils échappent au comptage, et au surlignage.
                </span>
                <span className="font-mono text-gray-dark-200 text-xs">
                  {muets.join(" · ")}
                </span>
              </div>
            )}

            <p className="text-gray-dark-500 text-xs leading-relaxed">
              Mesure d'éléments, pas de zones : deux <code className="font-mono">div</code> de
              mise en page autour d'une carte pèsent autant que la carte. Le chrome (barre
              latérale, fond, cette barre) vient du squelette et n'est pas compté. L'origine
              est relevée dans le code source à la compilation, pas devinée dans le DOM.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

const Colonne = ({
  titre,
  sous,
  puce,
  items,
  vide,
}: {
  titre: string
  sous: string
  puce: string
  items: Compte[]
  vide: string
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline gap-2">
      <span className={`size-2 rounded-full ${puce}`} />
      <span className="font-semibold text-sm text-white">{titre}</span>
      <span className="text-gray-dark-500 text-xs">{sous}</span>
    </div>
    {items.length === 0 ? (
      <span className="text-gray-dark-500 text-xs italic">{vide}</span>
    ) : (
      <ul className="flex flex-col gap-1">
        {items.map((c) => (
          <li key={c.nom} className="flex items-baseline justify-between gap-3">
            <span className="truncate font-mono text-gray-dark-200 text-xs">{c.nom}</span>
            <span className="font-mono text-gray-dark-400 text-xs tabular-nums">×{c.n}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)
