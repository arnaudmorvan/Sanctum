import { ChevronDown } from "lucide-react"
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
 *  its level where it has one — and the prose opens on demand. The candidate takes in the
 *  SHAPE of the commitment at a glance (seven rows, not seven paragraphs) and reaches for
 *  the detail of the one step they actually wonder about.
 *
 *  WHY THIS IS NOT A TIMELINE. foundations-composants: `Timeline` is the only DS component
 *  that states an ordered path, and A / C both use it. A disclosure list states a LIST, not
 *  an order — so the order is carried by the ordinal in the summary (01 … 07, Kode Mono:
 *  it counts). Drop the ordinal and the path becomes a menu.
 *
 *  ⚠️ WHY THIS IS HAND-WRITTEN, and what it is NOT.
 *  The first build of this screen imported `Accordion` from `@42/ui-react/accordion` — the
 *  component the DS catalog documents, with its `variant: default | separated` axis. tsc
 *  refused it: TS2307, no such module. The catalog is synced from the kit SOURCE; the
 *  protos repo vendors a BUILT package, and that build has no accordion. So the component
 *  is not missing from the DS, it is missing from what this repo can import — reported as
 *  a ds-actions task, not worked around in silence.
 *
 *  What replaces it is deliberately NOT a component that looks like a DS one: a native
 *  <details>/<summary>, which is keyboard-operable and screen-reader-announced with no
 *  JavaScript and no ARIA of ours, separated by the kit's own `Divider`. When the vendored
 *  kit catches up, this file collapses back to <Accordion variant="default">. */
const StepDisclosure = ({ invitation }: { invitation: Invitation }) => (
  <div className="flex flex-col">
    {invitation.steps.map((step, index) => {
      const Glyph = step.icon
      return (
        <div key={step.id}>
          {index > 0 ? <Divider /> : null}
          {/* The first step opens by default: a tile of seven identically closed rows
              states a wall, not a path. The reader sees at once what an open row gives. */}
          <details className="group" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center gap-3 py-3 [&::-webkit-details-marker]:hidden">
              {/* An ordinal counts: Kode Mono. It is what keeps this reading as a path. */}
              <span className={`${TYPO.mono("semibold")} text-gray-dark-400`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <Glyph size={16} className="text-gray-dark-400" />
              <span className={`${TYPO.title()} text-sm`}>{step.name}</span>
              {step.note ? (
                <Badge size="sm" variant="light" color="gray">{step.note}</Badge>
              ) : null}
              <ChevronDown
                size={16}
                className="ml-auto shrink-0 text-gray-dark-400 transition-transform group-open:rotate-180"
              />
            </summary>
            {/* pl-10 aligns the prose under the step name, past the ordinal and the glyph.
                40 is on the surveyed scale (4/8/12/16/20/24/40); 36 would not be. */}
            <div className="pb-3 pl-10">
              <Text size="sm" c="muted">{step.detail}</Text>
            </div>
          </details>
        </div>
      )
    })}
  </div>
)

export const Stepper = () => (
  <div className="flex flex-col gap-10">
    <PageIntro lead="Every step of every invitation is listed below. Open the ones you want the detail on — nothing is hidden, and nothing is forced on you." />

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

              <StepDisclosure invitation={invitation} />
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)
