import { Badge } from "@42/ui-react/badge"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import type { ReactNode } from "react"
import { Chiffre, Etat, useRoute } from "../etat"
import type { Metriques, Paire } from "../mcp"
import { Heatmap, Serie } from "./serie"

const Bloc = ({
  titre,
  aide,
  children,
}: {
  titre: string
  aide?: string
  children: ReactNode
}) => (
  <div className="flex flex-col gap-2">
    <Title order={2} size="sm">
      {titre}
    </Title>
    {aide ? (
      <Text c="muted" size="sm">
        {aide}
      </Text>
    ) : null}
    {children}
  </div>
)

const Classement = ({ lignes, unite, vide }: { lignes?: Paire[]; unite?: string; vide: string }) =>
  lignes?.length ? (
    <Table size="sm">
      <Table.Content>
        <Table.Body>
          {lignes.map((l) => (
            <Table.Row key={l.n}>
              <Table.Cell className="font-mono">{l.n}</Table.Cell>
              <Table.Cell className="w-28 text-right font-mono">
                {l.v}
                {unite ? ` ${unite}` : ""}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  ) : (
    <Text c="muted" size="sm">
      {vide}
    </Text>
  )

export const VueObservabilite = ({ cle }: { cle: string }) => {
  const { data, erreur, charge, sansCle } = useRoute<Metriques>("/metrics.json", cle)

  return (
    <Etat
      charge={charge}
      erreur={erreur}
      data={data}
      sansCle={sansCle}
      enfants={
        <div className="flex flex-col gap-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Chiffre label="Appels" valeur={data?.totalCalls ?? 0} />
            <Chiffre label="Outils actifs" valeur={data?.activeTools ?? 0} />
            <Chiffre label="Clients" valeur={data?.clients ?? 0} />
            <Chiffre label="Taux d'erreur" valeur={`${data?.errorRate ?? 0} %`} />
            <Chiffre label="Latence moyenne" valeur={`${data?.latencyMs ?? 0} ms`} />
            <Chiffre
              label="Tokens servis"
              valeur={(data?.tokensServed ?? 0).toLocaleString("fr-FR")}
            />
            <Chiffre label="Payloads réutilisés" valeur={data?.creditsSaved ?? 0} />
            <Chiffre label="Réflexion moyenne" valeur={`${data?.thinkMs ?? 0} ms`} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Serie titre="Appels" valeurs={data?.series?.calls} />
            <Serie titre="Sessions" valeurs={data?.series?.sessions} />
            <Serie titre="Erreurs" valeurs={data?.series?.errors} statut />
          </div>

          <Heatmap grille={data?.heatmap} />

          <div className="grid gap-8 lg:grid-cols-2">
            <Bloc titre="Outils les plus appelés">
              <Classement lignes={data?.topTools} vide="Aucun appel." />
            </Bloc>

            <Bloc
              titre={`Cherché et pas trouvé${data?.gapsTotal ? ` · ${data.gapsTotal}` : ""}`}
              aide="Ce que le modèle a demandé et que le DS n'a pas. Chaque ligne est un manque, ou un nom qui ne correspond pas."
            >
              <Classement
                lignes={data?.gaps}
                vide="Aucun manque — tout ce qui a été cherché existe."
              />
            </Bloc>

            <Bloc
              titre="Poids de contexte par outil"
              aide="Caractères moyens rendus par appel : ce que chaque outil coûte en contexte."
            >
              <Classement lignes={data?.payloadTop} unite="car." vide="Rien de mesuré." />
            </Bloc>

            <Bloc
              titre="Enchaînements fréquents"
              aide="Les paires d'outils qui se suivent — la forme réelle des parcours d'agent."
            >
              <Classement lignes={data?.sequences} vide="Pas encore d'enchaînement récurrent." />
            </Bloc>
          </div>

          {data?.aliases?.length ? (
            <Bloc
              titre="Noms probablement équivalents"
              aide="Un terme cherché sans succès, proche d'un composant qui existe : c'est un alias à documenter, pas un composant à créer."
            >
              <Table size="sm">
                <Table.Content>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>Cherché</Table.HeaderCell>
                      <Table.HeaderCell>Existe sous</Table.HeaderCell>
                      <Table.HeaderCell>Fois</Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {data.aliases.map((a) => (
                      <Table.Row key={`${a.searched}-${a.suggested}`}>
                        <Table.Cell className="font-mono">{a.searched}</Table.Cell>
                        <Table.Cell className="font-mono">{a.suggested}</Table.Cell>
                        <Table.Cell>{a.count}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            </Bloc>
          ) : null}

          {data?.requested?.length ? (
            <Bloc titre="Ce qui a été demandé" aide="Les valeurs passées aux outils de recherche.">
              <div className="grid gap-5 sm:grid-cols-2">
                {data.requested.map((g) => (
                  <div key={g.group} className="flex flex-col gap-1.5">
                    <Text c="secondary" size="sm">
                      <span className="font-mono">{g.group}</span>
                    </Text>
                    <Classement lignes={g.items} vide="—" />
                  </div>
                ))}
              </div>
            </Bloc>
          ) : null}

          {data?.recent?.length ? (
            <Bloc titre="Derniers appels">
              <Table size="sm">
                <Table.Content>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>Heure</Table.HeaderCell>
                      <Table.HeaderCell>Outil</Table.HeaderCell>
                      <Table.HeaderCell>Latence</Table.HeaderCell>
                      <Table.HeaderCell>État</Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {data.recent.slice(0, 20).map((r, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: journal sans identifiant
                      <Table.Row key={i}>
                        <Table.Cell className="font-mono">{r.t}</Table.Cell>
                        <Table.Cell className="font-mono">{r.n}</Table.Cell>
                        <Table.Cell>{r.lat} ms</Table.Cell>
                        <Table.Cell>
                          {r.ok ? (
                            <Text size="sm">ok</Text>
                          ) : (
                            <Badge color="red" variant="light">
                              erreur
                            </Badge>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            </Bloc>
          ) : null}

          <Text c="muted" size="sm">
            Période {data?.meta?.period ?? "—"} · relevé {data?.meta?.updated ?? "—"} · clients :{" "}
            {(data?.clientsList ?? []).join(", ") || "—"}
          </Text>
        </div>
      }
    />
  )
}
