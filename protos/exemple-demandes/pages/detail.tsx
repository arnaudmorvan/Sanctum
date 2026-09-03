import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { LIBELLE, parId } from "../data/demandes"

export const Detail = ({ id }: { id: string }) => {
  const d = parId(id)
  if (!d) return <Text>Demande introuvable.</Text>

  return (
    <div className="flex flex-col gap-6">
      <Button variant="subtle" size="sm" asChild>
        <a href="#/demandes">← Retour à la liste</a>
      </Button>

      <div className="flex items-center gap-3">
        <Title order={1} size="2xl">
          {d.etudiant}
        </Title>
        <Badge color={d.statut === "acceptee" ? "green" : d.statut === "refusee" ? "red" : "blue"}>
          {LIBELLE[d.statut]}
        </Badge>
      </div>

      <Card.Root>
        <Card.Body>
          <div className="flex flex-col gap-3">
            <Text><strong>Motif</strong> — {d.motif}</Text>
            <Text><strong>Heures demandées</strong> — {d.heures} h</Text>
            <Text><strong>Déposée le</strong> — {d.depose_le}</Text>
          </div>
        </Card.Body>
      </Card.Root>

      <div className="flex gap-2">
        <Button variant="filled" color="blue">Accepter</Button>
        <Button variant="outline">Refuser</Button>
      </div>
    </div>
  )
}
