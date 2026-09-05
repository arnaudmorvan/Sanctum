import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { DEMANDES, LIBELLE } from "../data/demandes"

export const Liste = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-1">
      <Title order={1} size="2xl" className={TYPO.texte()}>
        Demandes de transformation d'heures
      </Title>
      <Text c="secondary">{DEMANDES.length} demandes déposées ce mois-ci.</Text>
    </div>

    <Table>
      <Table.Content>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Étudiant</Table.HeaderCell>
            <Table.HeaderCell>Motif</Table.HeaderCell>
            <Table.HeaderCell>Heures</Table.HeaderCell>
            <Table.HeaderCell>Statut</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {DEMANDES.map((d) => (
            <Table.Row key={d.id}>
              <Table.Cell>{d.etudiant}</Table.Cell>
              <Table.Cell>{d.motif}</Table.Cell>
              <Table.Cell>{d.heures} h</Table.Cell>
              <Table.Cell>
                <Badge
                  color={d.statut === "acceptee" ? "green" : d.statut === "refusee" ? "red" : "blue"}
                >
                  {LIBELLE[d.statut]}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button variant="subtle" size="sm" asChild>
                  <a href={`#/demandes/${d.id}`}>Ouvrir</a>
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  </div>
)
