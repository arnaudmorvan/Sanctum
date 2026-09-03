import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Etat, useRoute } from "../etat"
import { type Acces, URL_MCP } from "../mcp"

const COULEUR: Record<string, string> = {
  lecteur: "gray",
  po: "blue",
  designer: "violet",
  admin: "green",
}

export const VueAcces = ({ cle }: { cle: string }) => {
  const { data, erreur, charge, sansCle } = useRoute<Acces>("/console/acces.json", cle)

  return (
    <Etat
      charge={charge}
      erreur={erreur}
      data={data}
      sansCle={sansCle}
      enfants={
        <div className="flex flex-col gap-5">
          {data?.lecture_seule ? (
            <Alert
              color="orange"
              variant="light"
              title="Écriture fermée sur le serveur"
              description={`READ_ONLY est actif sur ${URL_MCP} : les outils d'écriture ne sont pas servis. C'était voulu — l'endpoint était joignable sans aucune authentification.`}
            />
          ) : null}

          <Card variant="outline" padding="lg">
            <Card.Header>
              <Card.Title>Qui a accès</Card.Title>
              <Badge variant="light">{data?.regime ?? "—"}</Badge>
            </Card.Header>
            <Card.Description>
              Le registre vit dans access/users.json, versionné : un accès change rarement et
              mérite une histoire. Il ne contient aucun secret — les jetons sont dérivés
              d'ACCESS_SECRET, qui ne vit que dans l'environnement du serveur.
            </Card.Description>
            <Card.Content>
              {data?.erreur ? (
                <Text c="muted">{data.erreur}</Text>
              ) : (
                <Table size="sm">
                  <Table.Content>
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>Identifiant</Table.HeaderCell>
                        <Table.HeaderCell>Nom</Table.HeaderCell>
                        <Table.HeaderCell>Rôle</Table.HeaderCell>
                        <Table.HeaderCell>État</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {(data?.utilisateurs ?? []).map((u) => (
                        <Table.Row key={u.id}>
                          <Table.Cell className="font-mono">{u.id}</Table.Cell>
                          <Table.Cell>{u.nom ?? "—"}</Table.Cell>
                          <Table.Cell>
                            <Badge variant="light" color={COULEUR[u.role ?? ""] ?? "gray"}>
                              {u.role ?? "—"}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>
                            {u.actif ? (
                              <Text size="sm">actif</Text>
                            ) : (
                              <Text c="muted" size="sm">
                                révoqué
                              </Text>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table>
              )}
            </Card.Content>
          </Card>

          <Card variant="outline" padding="lg">
            <Card.Title>Les rôles</Card.Title>
            <Card.Description>
              Un ordre, pas un ensemble : chaque rôle peut tout ce que peut le précédent.
            </Card.Description>
            <Card.Content>
              <div className="flex flex-col gap-2">
                {Object.entries(data?.roles ?? {}).map(([nom, quoi]) => (
                  <div key={nom} className="flex items-baseline gap-3">
                    <Badge variant="light" color={COULEUR[nom] ?? "gray"}>
                      {nom}
                    </Badge>
                    <Text c="secondary" size="sm">
                      {quoi}
                    </Text>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          <Text c="muted" size="sm">
            Modifier les accès depuis ici viendra : ces routes sont en lecture seule. Pour
            l'instant on ouvre un accès par un commit dans access/users.json, et on génère le
            jeton avec tools/acces-jeton.py.
          </Text>
        </div>
      }
    />
  )
}
