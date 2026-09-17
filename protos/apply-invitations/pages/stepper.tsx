import { Accordion } from "@42/ui-react/accordion"
import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Divider } from "@42/ui-react/divider"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { Decision, Meta, PageIntro } from "../components/bits"
import type { Invitation } from "../data/invitations"
import { INVITATIONS } from "../data/invitations"

/** DIRECTION D — the stepper folded into the tile.
 *
 *  The bet: direction A was right that the path belongs in the card, and wrong about
 *  what "in the card" costs. Seven steps written out in full push the second invitation
 *  below the fold, so the screen states one invitation and hides the other — which is
 *  exactly the hierarchy problem it set out to fix.
 *
 *  Here every step is on screen from the first second — its number, its glyph, its name,
 *  its level where it has one — and the prose opens on demand. The candidate sees the
 *  SHAPE of the commitment at a glance (seven rows, not seven paragraphs) and reaches
 *  for the detail of the one step they actually wonder about.
 *
 *  WHY THIS IS NOT A TIMELINE. foundations-composants: `Timeline` is the only DS
 *  component that states an ordered path, and A / C both use it. An accordion states a
 *  LIST, not an order — so the order has to be carried by something else, and here it is
 *  the ordinal in the trigger (01 … 07, Kode Mono: it counts). Dropping the ordinal would
 *  turn the path into a menu. Declared in the report as the gap it is: the kit has no
 *  Stepper, and this is the closest legal composition.
 *
 *  `variant="default"` and not `separated`: default keeps the root as ONE surface inside
 *  the tile, where separated would make each of the seven steps its own card — seven
 *  nested surfaces inside a card inside the canvas. */
const StepAccordion = ({ invitation }: { invitation: Invitation }) => (
  <Accordion variant="default" defaultValue={[invitation.steps[0].id]}>
    {invitation.steps.map((step, index) => {
      const Glyph = step.icon
      return (
        <Accordion.Item key={step.id} value={step.id}>
          <Accordion.ItemTrigger>
            <span className="flex flex-1 flex-wrap items-center gap-3 text-left">
              {/* An ordinal counts: Kode Mono. It is what keeps this reading as a path
                  and not as a list of topics. */}
              <span className={`${TYPO.mono("semibold")} text-gray-dark-400`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <Glyph size={16} className="text-gray-dark-400" />
              <span className={`${TYPO.title()} text-sm`}>{step.name}</span>
              {step.note ? (
                <Badge size="sm" variant="light" color="gray">{step.note}</Badge>
              ) : null}
            </span>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Text size="sm" c="muted">{step.detail}</Text>
          </Accordion.ItemContent>
        </Accordion.Item>
      )
    })}
  </Accordion>
)

export const Stepper = () => (
  <div className="flex flex-col gap-10">
    <PageIntro lead="Every step of every invitation is listed below. Open the ones you want the detail on — nothing is hidden, nothing is forced on you." />

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

              <StepAccordion invitation={invitation} />
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)
