import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Etat, useRoute } from "../etat"
import type { Qualite } from "../mcp"

const cellule = (v: unknown): string => {
  if (v === null || v === undefined) return "—"
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

/** Les points de courbe sont écrits par submit_report(gate=…) et par des marqueurs
 *  (consolidation, export DS) : leurs clés diffèrent d'un point à l'autre. On rend donc les
 *  colonnes rencontrées plutôt qu'un schéma figé, qui masquerait la moitié des points. */
export const VueQualite = ({ cle }: { cle: string }) => {
  const { data, erreur, charge } = useRoute<Qualite>("/quality.json", cle)
  const points = data?.points ?? []
  const colonnes = Array.from(
    points.reduce((acc, p) => {
      for (const k of Object.keys(p)) acc.add(k)
      return acc
    }, new Set<string>()),
  ).slice(0, 8)

  return (
    <Etat
      charge={charge}
      erreur={erreur}
      data={data}
      enfants={
        points.length === 0 ? (
          <Text c="secondary">
            Aucun point de qualité. La courbe se remplit quand une génération dépose son gate
            chiffré via submit_report — écriture actuellement fermée sur le serveur.
          </Text>
        ) : (
          <Table size="sm">
            <Table.Content>
              <Table.Head>
                <Table.Row>
                  {colonnes.map((c) => (
                    <Table.HeaderCell key={c}>{c}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {points.map((p, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: les points n'ont pas d'id stable
                  <Table.Row key={i}>
                    {colonnes.map((c) => (
                      <Table.Cell key={c} className="font-mono">
                        {cellule(p[c])}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        )
      }
    />
  )
}
