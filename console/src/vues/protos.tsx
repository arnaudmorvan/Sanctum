import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { lireProtos } from "../mcp"

export type Proto = {
  slug: string
  titre: string
  auteur?: string
  resume?: string
  cree_le?: string
  maj_le?: string
  ok?: boolean
}

export const VueProtos = () => {
  const [protos, setProtos] = useState<Proto[] | null>(null)
  const [erreur, setErreur] = useState("")

  useEffect(() => {
    lireProtos<Proto[]>()
      .then(setProtos)
      .catch((e: Error) => setErreur(e.message))
  }, [])

  if (erreur) return <Text c="secondary">Liste indisponible — {erreur}</Text>
  if (!protos) return <Text c="secondary">Chargement…</Text>

  if (protos.length === 0)
    return (
      <Card variant="outline" padding="xl">
        <Card.Title>Aucun prototype pour l'instant</Card.Title>
        <Card.Description>
          Un PO en publie un depuis une conversation Claude : « fais-moi un parcours de… ».
          Aucun git, aucune installation.
        </Card.Description>
      </Card>
    )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {protos.map((p) => (
        <Card key={p.slug} variant="outline" padding="lg">
          <Card.Header>
            <Card.Title>{p.titre}</Card.Title>
            {p.ok === false ? (
              <Badge color="red" variant="light">
                build en échec
              </Badge>
            ) : null}
          </Card.Header>
          {p.resume ? <Card.Description>{p.resume}</Card.Description> : null}
          <Card.Content>
            <Text c="muted" size="sm">
              {p.auteur ?? "—"}
              {p.maj_le ? ` · mis à jour le ${p.maj_le}` : ""}
            </Text>
          </Card.Content>
          <Card.Footer>
            <Button variant="light" size="sm" disabled={p.ok === false} asChild={p.ok !== false}>
              {p.ok === false ? (
                <span>Indisponible</span>
              ) : (
                <a href={`/p/${p.slug}/`}>Ouvrir le parcours</a>
              )}
            </Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  )
}
