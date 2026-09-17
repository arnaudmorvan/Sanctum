import { Card } from "@42/ui-react/card"
import { Divider } from "@42/ui-react/divider"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { Decision, Meta, PageIntro, StepRail } from "../components/bits"
import { INVITATIONS } from "../data/invitations"

/** DIRECTION A — the path inline, no modal.
 *
 *  The bet: the thing that makes you want to say yes is the path itself, and on the
 *  shipped screen it is behind a click. So it comes out of the modal and into the card.
 *  The candidate reads what is being asked of them and decides in the same movement —
 *  the decision sits at the bottom of the very thing it decides on.
 *
 *  The cost, stated rather than hidden: the page is long. That is the direction's premise,
 *  not an accident. */
export const Inline = () => (
  <div className="flex flex-col gap-10">
    <PageIntro lead="Each invitation below is a whole path, laid out step by step. Read it, then decide — there is nothing hidden behind a click." />

    <div className="flex flex-col gap-4">
      {INVITATIONS.map((invitation) => (
        <Card
          key={invitation.slug}
          variant={invitation.featured ? "gradient" : "default"}
          padding="lg"
        >
          <Card.Content>
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <Title order={2} size="md" className={TYPO.title()}>{invitation.name}</Title>
                  <Text size="sm" c="secondary">{invitation.promise}</Text>
                  <Meta invitation={invitation} />
                </div>
                <Decision />
              </div>

              <Divider />

              <StepRail steps={invitation.steps} />
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)
