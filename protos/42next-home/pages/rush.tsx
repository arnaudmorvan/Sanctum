import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { parId } from "../data/home"

export const Rush = ({ id }: { id: string }) => {
  const rush = parId(id)

  if (!rush) {
    return (
      <Card variant="outline" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-3">
            <Title order={2} size="lg" className={TYPO.texte()}>Ce rush n'existe pas</Title>
            <Text c="secondary">Il a peut-etre ete retire du programme.</Text>
            <div>
              <Button size="sm" variant="outline" asChild>
                <a href="#/home">Revenir a l'accueil</a>
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  const restant = rush.etapes.filter((e) => !e.fait).length

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div>
          <Button size="sm" variant="subtle" asChild>
            <a href="#/home">Retour a l'accueil</a>
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="sm" c="muted">{rush.module}</Text>
          <div className="flex flex-wrap items-center gap-3">
            <Title order={1} size="2xl" className={TYPO.texte()}>{rush.nom}</Title>
            <Badge variant="light" color="pink">
              {rush.inscrit ? "Inscrite" : "Inscriptions ouvertes"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-4">
            <Title order={2} size="lg" className={TYPO.texte()}>Ce qu'il reste a faire</Title>
            <Card variant="gradient" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  <Text c="secondary">
                    {restant} etapes avant la Rush Review. Elles se font dans cet ordre.
                  </Text>
                  <div className="flex flex-col gap-3">
                    {rush.etapes.map((e) => (
                      <div key={e.libelle} className="flex items-center justify-between gap-3">
                        <Text>{e.libelle}</Text>
                        <Badge variant={e.fait ? "outline" : "light"} color="gray">
                          {e.fait ? "Fait" : "A faire"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="filled">S'inscrire au rush</Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            <Title order={2} size="lg" className={TYPO.texte()}>Le sujet</Title>
            <Card variant="default" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text>{rush.sujet}</Text>
                  <Text size="sm" c="muted">Le sujet complet s'ouvre au demarrage du rush, pas avant.</Text>
                </div>
              </Card.Content>
            </Card>
          </section>
        </div>

        <aside className="flex flex-col gap-10">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <Title order={3} size="md" className={TYPO.texte()}>Quand</Title>
                <Text>{rush.debut}</Text>
                <Text size="sm" c="muted">Duree - {rush.duree}. Meme creneau pour toutes les equipes.</Text>
              </div>
            </Card.Content>
          </Card>

          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <Title order={3} size="md" className={TYPO.texte()}>Ton equipe</Title>
                <Text size="sm" c="muted">Tiree au sort, elle ne se choisit pas.</Text>
                <div className="flex flex-col gap-2">
                  {rush.equipe.map((membre) => (
                    <Text key={membre}>{membre}</Text>
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>
        </aside>
      </div>
    </div>
  )
}
