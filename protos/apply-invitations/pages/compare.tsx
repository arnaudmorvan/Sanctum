import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Container } from "@42/ui-react/container"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { DIRECTIONS } from "../data/invitations"

/** The hub. Not a product screen — a review screen: it says what each direction bets on
 *  AND what it costs, so the comparison is made on the trade-off and not on the prettiest
 *  card. Kept to one column: there is nothing here that accompanies the reading, so there
 *  is nothing to put in a side rail (foundations-layout — the column count follows from
 *  the content, it is not reached for). */
export const Compare = () => (
  <Container size="xl" padding="none">
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-1.5">
      <Title order={1} size="3xl" className={TYPO.title()}>Program invitations</Title>
      <Text size="sm" c="secondary">Three reworks of the same screen — pick the one to take further.</Text>
    </div>

    <div className="flex flex-col gap-4">
      <Title order={2} size="md" className={TYPO.title()}>What every direction fixes first</Title>
      <Card variant="default" padding="md">
        <Card.Content>
          <div className="flex flex-col gap-3">
            <Text size="sm" c="muted">The false deadline is gone — there is no response deadline in the data, so the screen no longer pretends there is one.</Text>
            <Text size="sm" c="muted">Accept is the only filled button; Decline stops shouting in red. The colour follows the action.</Text>
            <Text size="sm" c="muted">The two invitations stop being interchangeable rows: the one that commits you leads, and carries the signature outline.</Text>
            <Text size="sm" c="muted">Each card says where it happens and how long the path is, so the decision has something to stand on.</Text>
          </div>
        </Card.Content>
      </Card>
    </div>

    <div className="flex flex-col gap-4">
      <Title order={2} size="md" className={TYPO.title()}>The three directions</Title>
      <div className="flex flex-col gap-4">
        {DIRECTIONS.map((d) => (
          <Card key={d.id} variant={d.featured ? "gradient" : "default"} padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-baseline gap-3">
                  <Title order={3} size="2xl" className={TYPO.mono()}>{d.letter}</Title>
                  <Title order={4} size="md" className={TYPO.title()}>{d.name}</Title>
                </div>
                <Text size="sm" className={TYPO.title("medium")}>{d.claim}</Text>
                <Text size="sm" c="muted">{d.detail}</Text>
                <Text size="xs" c="muted">Trade-off — {d.cost}</Text>
                <div>
                  <Button size="sm" variant={d.featured ? "filled" : "outline"} asChild>
                    <a href={`#/${d.id}`}>Open direction {d.letter}</a>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  </div>
  </Container>
)
