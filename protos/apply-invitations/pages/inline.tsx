import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Container } from "@42/ui-react/container"
import { Divider } from "@42/ui-react/divider"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { Decision, Meta, PageIntro, StepRail } from "../components/bits"
import type { Invitation } from "../data/invitations"
import { INVITATIONS } from "../data/invitations"

/** DIRECTION A — the path inline, no modal.
 *
 *  The bet: the thing that makes you want to say yes is the path itself, and on the
 *  shipped screen it is behind a click. So it comes out of the modal and into the card:
 *  the candidate reads what is being asked of them and decides in the same movement.
 *
 *  FOLDING — added 2026-09-17 at the designer's ask. The steps now arrive FOLDED: the
 *  rail states the shape of the commitment (its numbered, named steps, all of them on
 *  screen), and the prose opens on ONE gesture for the WHOLE path. Not step by step —
 *  someone who wants the detail wants all of it, and seven separate clicks is exactly
 *  the cost this direction set out to avoid. What it buys: the second invitation is no
 *  longer pushed below the fold, so the screen states two invitations instead of one,
 *  and A's premise survives — nothing is hidden behind a click, it is folded in place. */
const InvitationCard = ({ invitation }: { invitation: Invitation }) => {
  const [open, setOpen] = useState(false)

  return (
    <Card
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

          <div className="flex flex-col gap-4">
            {/* The label writes the effect out in full — review:a11y refuses an action
                whose consequence cannot be guessed before triggering it. Subtle grey:
                Accept stays the only filled button on the screen. */}
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="subtle"
                color="gray"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                endSlot={
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                  />
                }
              >
                {open ? "Hide all details" : "Show all details"}
              </Button>
            </div>

            <StepRail steps={invitation.steps} showDetail={open} />
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export const Inline = () => (
  <Container size="xl" padding="none">
  <div className="flex flex-col gap-10">
    <PageIntro lead="Each invitation below is a whole path, laid out step by step. Open every detail at once when you want it, then decide — there is nothing hidden behind a click." />

    <div className="flex flex-col gap-4">
      {INVITATIONS.map((invitation) => (
        <InvitationCard key={invitation.slug} invitation={invitation} />
      ))}
    </div>
  </div>
  </Container>
)
