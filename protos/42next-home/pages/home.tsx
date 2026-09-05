import type { ReactNode } from "react"
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { FEEDBACK, LEARNER, PROJETS, REVIEWS, RUSHES, TEMPS, enHeures } from "../data/home"

const Section = ({ titre, children }: { titre: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <Title order={2} size="lg" className={TYPO.texte()}>{titre}</Title>
    {children}
  </section>
)

export const Home = () => {
  const rush = RUSHES[0]
  const tempsPct = Math.round((TEMPS.restantMinutes / TEMPS.totalMinutes) * 100)
  const reviewsPct = Math.round((REVIEWS.faites / REVIEWS.attendues) * 100)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <Title order={1} size="2xl" className={TYPO.texte()}>Welcome home, {LEARNER.prenom}</Title>
        <Text c="secondary">
          Il te reste {REVIEWS.attendues - REVIEWS.faites} reviews et un rush avant la fin de ta semaine de selection.
        </Text>
      </div>

      {!LEARNER.githubLie && (
        <Alert
          type="warning"
          title="Ton compte GitHub n'est pas encore lie"
          description="Les rendus de projets passent par GitHub. Tant que le compte n'est pas lie, aucun rendu ne remonte."
          action={<Button size="sm" variant="outline">Lier mon compte GitHub</Button>}
        />
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-10">
          <Section titre="Ta prochaine quete">
            <Card variant="gradient" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Title order={3} size="xl" className={TYPO.texte()}>{rush.nom}</Title>
                    <Badge variant="light" color="pink">
                      {rush.inscrit ? "Inscrite" : "Inscriptions ouvertes"}
                    </Badge>
                  </div>
                  <Text c="secondary">{rush.sujet}</Text>
                  <div className="flex flex-wrap gap-6">
                    <Text size="sm" c="muted">Debut - {rush.debut}</Text>
                    <Text size="sm" c="muted">Duree - {rush.duree}</Text>
                    <Text size="sm" c="muted">Equipe - {rush.equipe.length} learners tires au sort</Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="filled">S'inscrire au rush</Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`#/rushes/${rush.id}`}>Ouvrir le rush</a>
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Mes projets en cours">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PROJETS.map((p) => (
                <Card key={p.id} variant="default" padding="lg">
                  <Card.Content>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <Title order={3} size="md" className={TYPO.texte()}>{p.nom}</Title>
                          <Text size="sm" c="muted">{p.module}</Text>
                        </div>
                        <Badge variant="light" color="gray">En cours</Badge>
                      </div>
                      <Progress value={p.progression} size="sm" />
                      <div className="flex items-center justify-between gap-3">
                        <Text size="sm" c="muted">Demarre {p.demarre}</Text>
                        <Button size="xs" variant="subtle">Reprendre</Button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </Section>

          <Section titre="Ce que les autres attendent de toi">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card variant="outline" padding="lg">
                <Card.Content>
                  <div className="flex flex-col gap-3">
                    <Title order={3} size="md" className={TYPO.texte()}>Feedback a donner</Title>
                    <Text c="secondary">
                      {FEEDBACK.learner} t'a fait passer une review sur {FEEDBACK.activite}.
                    </Text>
                    <Text size="sm" c="muted">Review passee {FEEDBACK.reviewLe}</Text>
                    <div>
                      <Button size="sm" variant="outline">Donner mon feedback</Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card variant="outline" padding="lg">
                <Card.Content>
                  <div className="flex flex-col gap-3">
                    <Title order={3} size="md" className={TYPO.texte()}>Rush Review a faire</Title>
                    <Text c="secondary">Une equipe de {rush.nom} attend sa Rush Review.</Text>
                    <Text size="sm" c="muted">Une seule review par equipe - elle ne se repasse pas.</Text>
                    <div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`#/rushes/${rush.id}`}>Ouvrir la review</a>
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="gradient" size="lg">{LEARNER.initiales}</Badge>
                  <div className="flex flex-col">
                    <Text>{LEARNER.prenom}</Text>
                    <Text size="sm" c="muted">{LEARNER.login}</Text>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="light" color="gray">Level {LEARNER.level}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <Text size="sm" c="secondary">{LEARNER.programme}</Text>
                    <Text size="sm" c="muted">{LEARNER.acquis}/{LEARNER.total}</Text>
                  </div>
                  <Progress value={LEARNER.acquis} size="sm" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col items-center gap-4">
                <Title order={3} size="md" className={TYPO.texte()}>Temps disponible aujourd'hui</Title>
                <CircularProgress variant="gradient" value={tempsPct} />
                <div className="flex flex-col items-center gap-1">
                  <Text>{enHeures(TEMPS.restantMinutes)} restantes</Text>
                  <Text size="sm" c="muted">sur {enHeures(TEMPS.totalMinutes)} declarees</Text>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <Title order={3} size="md" className={TYPO.texte()}>Mes reviews du jour</Title>
                <Progress value={reviewsPct} size="sm" />
                <Text size="sm" c="muted">{REVIEWS.faites} faites sur {REVIEWS.attendues} attendues</Text>
                <div>
                  <Button size="sm" variant="subtle" asChild>
                    <a href={`#/rushes/${rush.id}`}>Prendre une review</a>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </aside>
      </div>
    </div>
  )
}
