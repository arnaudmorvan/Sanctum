import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { DEMANDES, LIBELLE } from "../data/demandes"

export const Liste = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-1">
      <Title order={1} size="2xl">
        Demandes de transformation d'heures
      </Title>
      <Text className="text-gray-dark-400">
        {DEMANDES.length} demandes déposées ce mois-ci.
      </Text>
    </div>

    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Étudiant</Table.Header>
          <Table.Header>Motif</Table.Header>
          <Table.Header>Heures</Table.Header>
          <Table.Header>Statut</Table.Header>
          <Table.Header />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {DEMANDES.map((d) => (
          <Table.Row key={d.id}>
            <Table.Cell>{d.etudiant}</Table.Cell>
            <Table.Cell>{d.motif}</Table.Cell>
            <Table.Cell>{d.heures} h</Table.Cell>
            <Table.Cell>
              <Badge color={d.statut === "acceptee" ? "green" : d.statut === "refusee" ? "red" : "blue"}>
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
    </Table.Root>
  </div>
)
