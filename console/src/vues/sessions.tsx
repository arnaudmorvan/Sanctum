import { Badge } from "@42/ui-react/badge"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Etat, useRoute } from "../etat"
import type { Session } from "../mcp"

/** La friction agrège erreurs, recherches infructueuses, boucles et répétitions : c'est le
 *  seul chiffre qui dit si l'agent a peiné, indépendamment du nombre d'appels. */
const couleurFriction = (f: number) => (f >= 8 ? "red" : f >= 3 ? "orange" : "green")

export const VueSessions = ({ cle }: { cle: string }) => {
  const { data, erreur, charge, sansCle } = useRoute<{ sessions: Session[] }>("/sessions.json", cle)
  const sessions = data?.sessions ?? []

  return (
    <Etat
      charge={charge}
      erreur={erreur}
      data={data}
      sansCle={sansCle}
      enfants={
        sessions.length === 0 ? (
          <Text c="secondary">
            Aucune session tracée pour l'instant. Le suivi vit en mémoire du serveur : un
            redéploiement le remet à zéro.
          </Text>
        ) : (
          <Table size="sm">
            <Table.Content>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Client</Table.HeaderCell>
                  <Table.HeaderCell>Appels</Table.HeaderCell>
                  <Table.HeaderCell>Erreurs</Table.HeaderCell>
                  <Table.HeaderCell>Boucles</Table.HeaderCell>
                  <Table.HeaderCell>Répétitions</Table.HeaderCell>
                  <Table.HeaderCell>Durée</Table.HeaderCell>
                  <Table.HeaderCell>Friction</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {sessions.map((s) => (
                  <Table.Row key={s.id}>
                    <Table.Cell className="font-mono">{s.client}</Table.Cell>
                    <Table.Cell>{s.calls}</Table.Cell>
                    <Table.Cell>{s.errors}</Table.Cell>
                    <Table.Cell>{s.loops}</Table.Cell>
                    <Table.Cell>{s.repeats}</Table.Cell>
                    <Table.Cell>{s.durationS}s</Table.Cell>
                    <Table.Cell>
                      <Badge color={couleurFriction(s.friction)} variant="light">
                        {s.friction}
                      </Badge>
                    </Table.Cell>
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
