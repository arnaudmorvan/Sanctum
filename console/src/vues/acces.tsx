import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { URL_MCP } from "../mcp"

/** Les rôles servis par le serveur (acces.DESCRIPTION_ROLES). Recopiés ici volontairement :
 *  aucune route HTTP ne les expose encore, et inventer un appel qui n'existe pas afficherait
 *  une erreur permanente au lieu d'un état honnête. */
const ROLES: Array<{ nom: string; couleur: string; peut: string }> = [
  { nom: "lecteur", couleur: "gray", peut: "lit le DS et la console ; n'écrit rien" },
  { nom: "po", couleur: "blue", peut: "lit, dépose des reports et publie des parcours" },
  { nom: "designer", couleur: "violet", peut: "en plus : foundations, skills, contexte, consolidations" },
  { nom: "admin", couleur: "green", peut: "en plus : administration de la console et des accès" },
]

export const VueAcces = () => (
  <div className="flex flex-col gap-5">
    <Alert
      color="orange"
      variant="light"
      title="Écriture fermée sur le serveur MCP"
      description={`READ_ONLY est actif sur ${URL_MCP} : les outils d'écriture ne sont pas servis. C'est volontaire — l'endpoint était joignable sans aucune authentification. Poser ACCESS_SECRET active le régime par personne ci-dessous.`}
    />

    <Card variant="outline" padding="lg">
      <Card.Title>Les rôles</Card.Title>
      <Card.Description>
        Un ordre, pas un ensemble : chaque rôle peut tout ce que peut le précédent.
      </Card.Description>
      <Card.Content>
        <Table size="sm">
          <Table.Content>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Rôle</Table.HeaderCell>
                <Table.HeaderCell>Ce qu'il peut faire</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {ROLES.map((r) => (
                <Table.Row key={r.nom}>
                  <Table.Cell>
                    <Badge variant="light">{r.nom}</Badge>
                  </Table.Cell>
                  <Table.Cell>{r.peut}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      </Card.Content>
    </Card>

    <Card variant="outline" padding="lg">
      <Card.Title>Administrer les accès depuis ici — pas encore</Card.Title>
      <Card.Content>
        <div className="flex flex-col gap-2">
          <Text c="secondary">
            Le registre vit dans <code className="font-mono">access/users.json</code> du repo
            mcp-42 : dans git, parce qu'un accès change rarement et mérite une histoire — qui a
            ouvert quel droit à qui, et quand.
          </Text>
          <Text c="secondary">
            Aucune route HTTP ne l'expose encore. L'ajouter demande de toucher{" "}
            <code className="font-mono">metrics.py</code>, en cours de modification par ailleurs.
            Tant que c'est le cas, on ouvre un accès par un commit et on génère le jeton avec{" "}
            <code className="font-mono">tools/acces-jeton.py</code>.
          </Text>
        </div>
      </Card.Content>
    </Card>
  </div>
)
