import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Ecran } from "../components/sidebar"
import { ACTIVITES, EN_COURS, LEARNER } from "../data/profile"

export const Activity = ({ slug }: { slug?: string }) => {
  const validee = ACTIVITES.find((a) => a.slug === slug)
  const enCours = !slug || slug === EN_COURS.slug

  if (!enCours && !validee) {
    return (
      <Ecran actif="Learn">
        <Card variant="outline" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Title order={2} size="lg">No activity under this name</Title>
              <Text c="secondary">It may have been retired from the program.</Text>
              <div>
                <Button size="sm" variant="outline" asChild>
                  <a href={`#/profile/${LEARNER.login}`}>Back to the profile</a>
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </Ecran>
    )
  }

  const pct = Math.round((EN_COURS.faites / EN_COURS.total) * 100)

  return (
    <Ecran actif="Learn">
      <div className="flex flex-col gap-4">
        <div>
          <Button size="sm" variant="subtle" asChild>
            <a href={`#/profile/${LEARNER.login}`}>Back to the profile</a>
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="sm" c="muted">{validee ? validee.contexte : EN_COURS.contexte}</Text>
          <div className="flex flex-wrap items-center gap-3">
            <Title order={1} size="2xl">{validee ? validee.nom : EN_COURS.nom}</Title>
            {validee ? (
              <Badge variant="light" color="green">Validated</Badge>
            ) : (
              <>
                <Badge variant="light" color="blue">In progress</Badge>
                <Badge variant="light" color="gray">{EN_COURS.tentative}</Badge>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="flex flex-col gap-4">
          <Title order={2} size="lg">Validation requirements</Title>
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-3">
                  <Text size="sm">{EN_COURS.libelle}</Text>
                  <Text size="sm" c="muted">{EN_COURS.faites} / {EN_COURS.total}</Text>
                </div>
                <Progress value={validee ? 100 : pct} size="sm" />
                <div className="flex flex-col gap-3">
                  {EN_COURS.exigences.map((e) => (
                    <div key={e.libelle} className="flex items-center justify-between gap-3">
                      <Text>{e.libelle}</Text>
                      <Badge variant={validee || e.fait ? "outline" : "light"} color="gray">
                        {validee || e.fait ? "Met" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>
        </section>

        <aside className="flex flex-col gap-10">
          <section className="flex flex-col gap-4">
            <Title order={2} size="lg">Team</Title>
            <Card variant="outline" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text>{LEARNER.login} - {EN_COURS.equipier}</Text>
                  <Text size="sm" c="muted">Both members are reviewed together. One evaluation covers the team.</Text>
                  <div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`#/profile/${EN_COURS.equipier}`}>Open {EN_COURS.equipier}</a>
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            <Title order={2} size="lg">Attempts</Title>
            <Card variant="outline" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text>{validee ? "Validated on the last attempt" : EN_COURS.tentative}</Text>
                  <Text size="sm" c="muted">An attempt never removes what a previous one validated.</Text>
                </div>
              </Card.Content>
            </Card>
          </section>
        </aside>
      </div>
    </Ecran>
  )
}
