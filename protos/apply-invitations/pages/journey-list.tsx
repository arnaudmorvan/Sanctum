import { ArrowRight } from "lucide-react"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Container } from "@42/ui-react/container"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { Decision, Meta, PageIntro } from "../components/bits"
import { INVITATIONS } from "../data/invitations"

/** DIRECTION C — the list. Same decidable card as B, but the path is not a dialog:
 *  it is a place you go to. */
export const JourneyList = () => (
  <Container size="xl" padding="none">
  <div className="flex flex-col gap-10">
    <PageIntro lead="Each invitation opens onto a path you can walk through before committing to it. Take a look around, then come back and decide." />

    <div className="flex flex-col gap-4">
      {INVITATIONS.map((invitation) => (
        <Card
          key={invitation.slug}
          variant={invitation.featured ? "gradient" : "default"}
          padding="lg"
        >
          <Card.Content>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Title order={2} size="md" className={TYPO.title()}>{invitation.name}</Title>
                <Text size="sm" c="secondary">{invitation.promise}</Text>
                <Meta invitation={invitation} />
                <div className="pt-1">
                  <Button size="sm" variant="subtle" endSlot={<ArrowRight size={14} />} asChild>
                    <a href={`#/c/${invitation.slug}`}>Explore the path</a>
                  </Button>
                </div>
              </div>
              <Decision />
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
  </Container>
)
