import { ArrowLeft } from "lucide-react"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { Decision, Meta, StepRail } from "../components/bits"
import { bySlug } from "../data/invitations"

/** DIRECTION C — the path as a page.
 *
 *  A 7-step application is a territory to cross, and the DS already has the layout for
 *  that: the learning-dashboard template — the world to conquer at the centre, ME in a
 *  narrower side rail (foundations-layout). The sidebar is the skeleton's, so this page
 *  writes the other two columns.
 *
 *  The rail LEADS with the decision, which is the precision foundations-layout adds to
 *  its own rule: on a screen that must open, the rail starts with the next action, not
 *  with a readout. So the gradient card — the entry point, the ONE per screen — is the
 *  Accept card, not the path.
 *
 *  A modal could not do this: it has no room for two columns, it cannot be linked to,
 *  and it cannot be come back to. */
export const Journey = ({ program }: { program?: string }) => {
  const invitation = bySlug(program)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div>
          {/* An explicit way back. review:a11y — every interaction is predictable, and a
              page reached from a list owes the reader the return trip. */}
          <Button size="sm" variant="subtle" color="gray" startSlot={<ArrowLeft size={14} />} asChild>
            <a href="#/c">All invitations</a>
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          <Title order={1} size="3xl" className={TYPO.title()}>{invitation.name}</Title>
          <Text size="sm" c="secondary">{invitation.promise}</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-4">
          <Title order={2} size="md" className={TYPO.title()}>The path, step by step</Title>
          <Card variant="default" padding="lg">
            <Card.Content>
              <StepRail steps={invitation.steps} />
            </Card.Content>
          </Card>
        </div>

        <aside className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Title order={2} size="md" className={TYPO.title()}>Your invitation</Title>
            <Card variant="gradient" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  <Meta invitation={invitation} />
                  <Text size="sm" c="muted">
                    Accepting starts the first step. You are not committing to the whole path today.
                  </Text>
                  <Decision />
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Title order={2} size="md" className={TYPO.title()}>Good to know</Title>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text size="sm" c="muted">No degree and no experience are required at any point of this path.</Text>
                  <Text size="sm" c="muted">Every step happens at {invitation.campus}, or online where the step allows it.</Text>
                  <Text size="sm" c="muted">You can decline now and apply again later — an invitation is not a one-shot.</Text>
                </div>
              </Card.Content>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}
