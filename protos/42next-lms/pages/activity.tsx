import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { ACTIVITIES, CURRENT, LEARNER } from "../data/profile"

export const Activity = ({ slug }: { slug?: string }) => {
  const validated = ACTIVITIES.find((a) => a.slug === slug)
  const inProgress = !slug || slug === CURRENT.slug

  if (!inProgress && !validated) {
    return (
      <div className="flex flex-col gap-10">
        <Card variant="outline" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Title order={2} size="lg" className={TYPO.title()}>No activity under this name</Title>
              <Text c="secondary">It may have been retired from the program.</Text>
              <div>
                <Button size="sm" variant="outline" asChild>
                  <a href={`#/profile/${LEARNER.login}`}>Back to the profile</a>
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    )
  }

  const pct = Math.round((CURRENT.met / CURRENT.total) * 100)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div>
          <Button size="sm" variant="subtle" asChild>
            <a href={`#/profile/${LEARNER.login}`}>Back to the profile</a>
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="sm" c="muted">{validated ? validated.context : CURRENT.context}</Text>
          <div className="flex flex-wrap items-center gap-3">
            <Title order={1} size="2xl" className={TYPO.title()}>{validated ? validated.name : CURRENT.name}</Title>
            {validated ? (
              <Badge variant="light" color="green">Validated</Badge>
            ) : (
              <>
                <Badge variant="light" color="blue">In progress</Badge>
                <Badge variant="light" color="gray">{CURRENT.attempt}</Badge>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="flex flex-col gap-4">
          <Title order={2} size="lg" className={TYPO.title()}>Validation requirements</Title>
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-3">
                  <Text size="sm">{CURRENT.label}</Text>
                  <Text size="sm" c="muted">{CURRENT.met} / {CURRENT.total}</Text>
                </div>
                <Progress value={validated ? 100 : pct} size="sm" />
                <div className="flex flex-col gap-3">
                  {CURRENT.requirements.map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-3">
                      <Text>{r.label}</Text>
                      <Badge variant={validated || r.done ? "outline" : "light"} color="gray">
                        {validated || r.done ? "Met" : "Pending"}
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
            <Title order={2} size="lg" className={TYPO.title()}>Team</Title>
            <Card variant="outline" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text>{LEARNER.login} - {CURRENT.teammate}</Text>
                  <Text size="sm" c="muted">Both members are reviewed together. One evaluation covers the team.</Text>
                  <div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`#/profile/${CURRENT.teammate}`}>Open {CURRENT.teammate}</a>
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            <Title order={2} size="lg" className={TYPO.title()}>Attempts</Title>
            <Card variant="outline" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text>{validated ? "Validated on the last attempt" : CURRENT.attempt}</Text>
                  <Text size="sm" c="muted">An attempt never removes what a previous one validated.</Text>
                </div>
              </Card.Content>
            </Card>
          </section>
        </aside>
      </div>
    </div>
  )
}
