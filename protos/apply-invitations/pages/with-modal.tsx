import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Modal } from "@42/ui-react/modal"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { Decision, Meta, PageIntro, StepRail } from "../components/bits"
import type { Invitation } from "../data/invitations"
import { INVITATIONS } from "../data/invitations"

/** DIRECTION B — the card becomes decidable, the modal earns its click.
 *
 *  The bet: the modal is not the problem, the EMPTY card is. On the shipped screen the
 *  card says a name and nothing else, so the click is not a choice — it is the only way
 *  to learn anything. Here the card already carries where it happens, what it leads to
 *  and how long the path is: most people can decide without opening anything.
 *
 *  And the modal gets the decision. On the shipped screen you read the 7 steps, close the
 *  dialog, then hunt for the button on the row behind — you decide somewhere other than
 *  where you understood. The Accept button now lives at the foot of the path itself. */
const PathModal = ({
  invitation,
  onClose,
}: {
  invitation: Invitation | null
  onClose: () => void
}) => (
  <Modal
    open={invitation !== null}
    onOpenChange={(open) => { if (!open) onClose() }}
    title={<span className={TYPO.title()}>Your path to 42</span>}
    description={
      <Text size="sm" c="muted">
        {invitation ? `${invitation.name} — here is what the journey looks like, step by step.` : ""}
      </Text>
    }
  >
    {invitation ? (
      <div className="flex flex-col gap-6">
        <StepRail steps={invitation.steps} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Text size="xs" c="muted">You can go back on this at any point before the first step.</Text>
          <Decision />
        </div>
      </div>
    ) : null}
  </Modal>
)

export const WithModal = () => {
  const [open, setOpen] = useState<Invitation | null>(null)

  return (
    <div className="flex flex-col gap-10">
      <PageIntro lead="Everything you need to decide is on the card. Open the path when you want the detail — and you can say yes from there." />

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
                    {/* Was an underlined text link, which read as a footnote on the least
                        important line of the card. A real control, still subtle enough not
                        to compete with Accept. */}
                    <Button
                      size="sm"
                      variant="subtle"
                      endSlot={<ArrowRight size={14} />}
                      onClick={() => setOpen(invitation)}
                    >
                      See the {invitation.steps.length} steps
                    </Button>
                  </div>
                </div>
                <Decision />
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      <PathModal invitation={open} onClose={() => setOpen(null)} />
    </div>
  )
}
