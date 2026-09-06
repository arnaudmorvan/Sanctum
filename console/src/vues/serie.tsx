/** Les petites séries de l'onglet Observabilité.
 *
 *  Pourquoi trois graphes séparés plutôt qu'un seul à trois courbes : appels, sessions et
 *  erreurs n'ont pas le même ordre de grandeur (des centaines contre quelques unités). Les
 *  superposer demanderait deux axes — le pire défaut possible en dataviz, la courbe basse
 *  devient une ligne plate. Séparés, chacun garde son échelle et se lit.
 *
 *  Une seule teinte partout : chaque graphe ne porte qu'une série, et son TITRE dit laquelle.
 *  Une palette catégorielle serait ici une fausse information — et vert/rouge échouait la
 *  validation daltonisme (ΔE 4,1 en deutéranopie). Le rouge ne sert donc que de STATUT, sur
 *  les erreurs, toujours accompagné de son libellé.
 */
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { TYPO } from "../../../src/typo"

export const Serie = ({
  titre,
  valeurs,
  statut,
}: {
  titre: string
  valeurs?: number[]
  statut?: boolean
}) => {
  const v = valeurs ?? []
  const max = Math.max(1, ...v)
  const total = v.reduce((a, b) => a + b, 0)
  const teinte = statut ? "var(--color-red-400)" : "var(--color-brand-400)"

  return (
    <Card variant="outline" padding="sm" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Text c="secondary" size="sm">
          {titre}
        </Text>
        <span className={`${TYPO.machine()} text-white text-xl`}>{total}</span>
      </div>
      {v.length ? (
        <div className="flex h-10 items-end gap-[2px]" aria-hidden="true">
          {v.map((n, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: une série est indexée par position
              key={i}
              // 4px arrondis en bout de barre, ancrés à la ligne de base ; 2px de gouttière
              // entre les barres (le `gap` ci-dessus) pour qu'elles ne se touchent jamais.
              className="min-h-[2px] flex-1 rounded-t"
              style={{ height: `${(n / max) * 100}%`, background: teinte, opacity: n ? 1 : 0.25 }}
              title={`${n}`}
            />
          ))}
        </div>
      ) : (
        <div className="h-10" />
      )}
      <Text c="muted" size="xs">
        {v.length} derniers jours
      </Text>
    </Card>
  )
}

/** Activité par jour et par heure. Grandeur → UNE seule teinte, du clair au dense : un
 *  arc-en-ciel ferait croire à des catégories là où il n'y a qu'une intensité. */
export const Heatmap = ({ grille }: { grille?: number[][] }) => {
  const g = grille ?? []
  const max = Math.max(1, ...g.flat())
  const jours = ["L", "M", "M", "J", "V", "S", "D"]
  if (!g.length) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-dark-400 text-sm">Activité par jour et par heure</span>
      <div className="flex flex-col gap-[2px]">
        {g.map((ligne, j) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 7 jours, index = jour
          <div key={j} className="flex items-center gap-[2px]">
            <span className="w-3 shrink-0 text-gray-dark-500 text-xs">{jours[j]}</span>
            {ligne.map((n, h) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: 24 heures, index = heure
                key={h}
                className="h-3 flex-1 rounded-[2px]"
                style={{
                  background: "var(--color-brand-400)",
                  opacity: n ? 0.2 + 0.8 * (n / max) : 0.06,
                }}
                title={`${jours[j]} ${String(h).padStart(2, "0")}h — ${n} appels`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
