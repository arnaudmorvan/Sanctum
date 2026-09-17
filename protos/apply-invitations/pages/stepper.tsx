import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
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
 *  Every step is on screen from the first second — its number, its glyph, its name, its
 *  level where it has one — and the prose opens on demand.
 *
 *  WHY THIS IS NOT A TIMELINE. foundations-composants: `Timeline` is the only DS component
 *  that states an ordered path, and A / C both use it. A disclosure list states a LIST, not
 *  an order — so the order is carried by the ordinal in the summary (01 … 07, Kode Mono:
 *  it counts). Drop the ordinal and the path becomes a menu.
 *
 *  WHY THIS IS HAND-WRITTEN. The first build imported `Accordion` from
 *  `@42/ui-react/accordion` — the component the DS catalog documents. tsc refused it:
 *  TS2307, no such module. The catalog is synced from the kit SOURCE; the protos repo
 *  vendors a BUILT package, and that build has no accordion. Reported as a ds-actions
 *  task, not worked around in silence. What replaces it is deliberately NOT something
 *  that looks like a DS component: a native <details>/<summary>, keyboard-operable and
 *  screen-reader-announced with no JavaScript and no ARIA of ours, separated by the kit's
 *  own `Divider`. When the vendored kit catches up, this collapses back to <Accordion>.
 *
 *  FOLDING — reworked 2026-09-17 at the designer's ask. The steps now arrive ALL CLOSED,
 *  and one control folds or unfolds the whole path in a single gesture. The first step no
 *  longer opens by itself: what a closed tile states is the shape of the commitment, and
 *  the reader who wants the prose wants it for every step, not seven times over. Each row
 *  stays individually operable — the master control sets them, it does not lock them —
 *  which is why `<details>` is driven by state here instead of its own `open` attribute. */
const StepDisclosure = ({
  invitation,
  openIds,
  onToggleStep,
}: {
  invitation: Invitation
  openIds: string[]
  onToggleStep: (id: string, isOpen: boolean) => void
}) => (
  <div className="flex flex-col">
    {invitation.steps.map((step, index) => {
      const Glyph = step.icon
      return (
        <div key={step.id}>
          {index > 0 ? <Divider /> : null}
          <details
            className="group"
            open={openIds.includes(step.id)}
            onToggle={(event) => onToggleStep(step.id, event.currentTarget.open)}
          >
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

const InvitationTile = ({ invitation }: { invitation: Invitation }) => {
  const [openIds, setOpenIds] = useState<string[]>([])
  const allOpen = openIds.length === invitation.steps.length

  const toggleStep = (id: string, isOpen: boolean) =>
    setOpenIds((current) => {
      if (isOpen) return current.includes(id) ? current : [...current, id]
      return current.filter((value) => value !== id)
    })

  const toggleAll = () =>
    setOpenIds(allOpen ? [] : invitation.steps.map((step) => step.id))

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

          <div className="flex flex-col gap-2">
            {/* The label writes the effect out in full — review:a11y refuses an action
                whose consequence cannot be guessed before triggering it. */}
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="subtle"
                color="gray"
                aria-expanded={allOpen}
                onClick={toggleAll}
                endSlot={
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${allOpen ? "rotate-180" : ""}`}
                  />
                }
              >
                {allOpen ? "Collapse all steps" : "Expand all steps"}
              </Button>
            </div>

            <StepDisclosure
              invitation={invitation}
              openIds={openIds}
              onToggleStep={toggleStep}
            />
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export const Stepper = () => (
  <div className="flex flex-col gap-10">
    <PageIntro lead="Every step of every invitation is listed below, folded. Open them all at once, or just the one you wonder about — nothing is hidden, and nothing is forced on you." />

    <div className="flex flex-col gap-4">
      {INVITATIONS.map((invitation) => (
        <InvitationTile key={invitation.slug} invitation={invitation} />
      ))}
    </div>
  </div>
)
