import { MapPin } from "lucide-react"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import type { Invitation, Step } from "../data/invitations"
import { LEARNER } from "../data/invitations"

/** THE INTRO. What the shipped screen says: "You've been selected to join 42. This
 *  invitation won't last forever."
 *
 *  Two faults in one line. It manufactures urgency — review:storytelling rejects that
 *  outright, and calm is a constraint of the DS, not a mood. And it is not even TRUE:
 *  there is no response deadline anywhere in the data (confirmed by the designer,
 *  2026-09-17), so the screen threatens with a clock that does not exist.
 *
 *  What replaces it does the motivating without the threat: someone chose you (that is
 *  the reward), and you get to see the whole path before saying yes (that is the calm).
 *  It also makes the screen OPEN rather than report — foundations-layout. */
export const PageIntro = ({ lead }: { lead: string }) => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-1.5">
      <Title order={1} size="3xl" className={TYPO.title()}>Welcome, {LEARNER.firstName}!</Title>
      <Text size="sm" c="secondary">Someone at 42 picked you out.</Text>
    </div>
    <div className="flex flex-col gap-4">
      <Title order={2} size="md" className={TYPO.title()}>Invitations</Title>
      <Text size="sm" c="muted" className="max-w-[68ch]">{lead}</Text>
    </div>
  </div>
)

/** Campus NAMES a place, it does not measure one — so it stays Lato
 *  (foundations-typography is explicit: "5ème étage" stays Lato). The step count DOES
 *  measure: Kode Mono.
 *
 *  The gradient badge goes on the featured invitation only. The pink has to designate
 *  something; on both cards it designates nothing. */
export const Meta = ({ invitation }: { invitation: Invitation }) => (
  <div className="flex flex-wrap items-center gap-3">
    <span className="flex items-center gap-1.5 text-gray-dark-400">
      <MapPin size={14} />
      <Text size="sm" span c="secondary">{invitation.campus}</Text>
    </span>
    <Badge
      size="sm"
      variant={invitation.featured ? "gradient" : "light"}
      color={invitation.featured ? undefined : "gray"}
      className={TYPO.mono("semibold")}
    >
      {invitation.steps.length} STEPS
    </Badge>
  </div>
)

/** THE DECISION. The shipped screen has DECLINE in a red outline and ACCEPT as a white
 *  filled button: the refusal is the loudest thing on the row, and the acceptance is a
 *  neutral slab. review:components — the colour follows the action, it is never
 *  decorative, and buttons must not predominate.
 *
 *  So: Accept is the only filled button on the screen (brand carries the interactive),
 *  Decline is subtle grey. Declining is not destructive; nothing justifies red. */
export const Decision = () => (
  <div className="flex items-center gap-2">
    <Button size="sm" variant="subtle" color="gray">Decline</Button>
    <Button size="sm" variant="filled">Accept</Button>
  </div>
)

/** THE PATH. `Timeline` is the only DS component that states an ordered sequence
 *  carrying states (foundations-composants) — which is exactly what a 7-step
 *  application is, and exactly the video-game grammar the DS borrows: steps, a path,
 *  a territory.
 *
 *  ⚠️ API checked against the one place it was already got wrong: Timeline.Item has NO
 *  `title` prop — it is Item > Label + Content > Title. A prop that does not exist falls
 *  through to the DOM attribute of the same name and vanishes from the screen with no
 *  error at all.
 *
 *  Every bullet is `outline`: no step has started yet. The item's state comes from the
 *  variant, there is no state axis.
 *
 *  The source modal coloured its icons blue, red, green and grey — four hues on one
 *  dialog, which review:color rejects ("one colour predominates"). Here the glyphs are
 *  uniform and neutral: they identify the step, they do not rank it. */
export const StepRail = ({
  steps,
  dense = false,
  showDetail = !dense,
}: {
  steps: Step[]
  dense?: boolean
  /** The prose under each step. Direction A folds it: the rail keeps stating the SHAPE of
   *  the path (numbered, named steps), and the detail opens for the whole path at once. */
  showDetail?: boolean
}) => (
  <Timeline size={dense ? "sm" : "md"} lineVariant="solid">
    {steps.map((step, index) => {
      const Glyph = step.icon
      return (
        <Timeline.Item key={step.id} variant="outline">
          <Timeline.Label>
            <span className={TYPO.mono("semibold")}>{String(index + 1).padStart(2, "0")}</span>
          </Timeline.Label>
          <Timeline.Content>
            <Timeline.Title className={`${TYPO.title()} text-sm`}>
              <span className="flex flex-wrap items-center gap-2">
                <Glyph size={16} className="text-gray-dark-400" />
                {step.name}
                {step.note ? (
                  <Badge size="sm" variant="light" color="gray">{step.note}</Badge>
                ) : null}
              </span>
            </Timeline.Title>
            {showDetail ? <Text size="sm" c="muted">{step.detail}</Text> : null}
          </Timeline.Content>
        </Timeline.Item>
      )
    })}
  </Timeline>
)
