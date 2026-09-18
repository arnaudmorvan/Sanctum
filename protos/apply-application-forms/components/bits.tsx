import type { ReactNode } from 'react'
import { Badge } from '@42/ui-react/badge'
import { Button } from '@42/ui-react/button'
import { Card } from '@42/ui-react/card'
import { Progress } from '@42/ui-react/progress'
import { Text } from '@42/ui-react/text'
import { Timeline } from '@42/ui-react/timeline'
import { Title } from '@42/ui-react/title'
import { TYPO } from '../../../src/typo'
import { APPLICATION, FORM_STEPS, STAGES } from '../data/application'

/** THE PAGE TITLE. The shipped screen says Tell us who we are - a copy slip, and the
 *  wrong voice: 42 has no teachers and the interface does not speak for the school.
 *  Lato Bold on the title (TYPO.title), because the kit forces Kode Mono on Title. */
export const PageHead = () => (
  <div className='flex flex-col gap-1'>
    <Title order={1} size='3xl' className={TYPO.title()}>Tell us who you are</Title>
    <Text size='sm' c='secondary'>{APPLICATION.campus} - {APPLICATION.program}</Text>
  </div>
)

/** THE CARD THAT OPENS THE SCREEN. foundations-layout: a form screen opens too, by
 *  naming the door it shuts. The shipped stepper sits bare on the canvas and states
 *  four words; here the same four stages sit in the gradient card - the one entry
 *  point of the screen - and say what the forms unlock.
 *
 *  Step 3 / 4 and the dates MEASURE: Kode Mono. Campus names a place: Lato. */
export const JourneyCard = () => (
  <Card variant='gradient' padding='lg'>
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <Text size='xs' span c='muted' className={`${TYPO.mono('semibold')} uppercase tracking-widest`}>
          Step 3 / 4
        </Text>
        <Title order={2} size='xl' className={TYPO.title()}>Three forms, then the Piscine</Title>
        <Text size='sm' c='secondary' className='max-w-[68ch]'>
          About six minutes. Once they are in, your seat at {APPLICATION.campus} for the Piscine
          starting <span className={TYPO.mono('semibold')}>{APPLICATION.piscineStart}</span> is held,
          and we check your ID at the Meeting on <span className={TYPO.mono('semibold')}>{APPLICATION.meeting}</span>.
        </Text>
      </div>
      <Progress variant='gradient' value={62} size='sm' />
      <div className='flex flex-wrap items-center gap-2'>
        {STAGES.map(stage => (
          <Badge
            key={stage.id}
            size='sm'
            variant={stage.state === 'current' ? 'light' : 'subtle'}
            color={stage.state === 'current' ? 'pink' : 'gray'}
            className={TYPO.mono('semibold')}
          >
            {stage.label.toUpperCase()}
          </Badge>
        ))}
      </div>
    </div>
  </Card>
)

/** THE SUB-STEPS. The shipped screen numbers its three tabs 1, 2 and 2 - and two of
 *  them are not reachable. Here they are three real screens, each one an anchor, and
 *  the current one carries the pink (pink means in progress, foundations-colors). */
export const StepTabs = ({ current }: { current: number }) => (
  <div className='flex flex-wrap items-center gap-2'>
    {FORM_STEPS.map((step, index) => (
      <a key={step.id} href={`#/${step.path}`} className='no-underline'>
        <Badge
          size='sm'
          variant={index === current ? 'light' : 'subtle'}
          color={index === current ? 'pink' : 'gray'}
          className={TYPO.mono('semibold')}
        >
          {`${String(index + 1).padStart(2, '0')} ${step.label.toUpperCase()}`}
        </Badge>
      </a>
    ))}
  </div>
)

/** THE RAIL. Timeline is the only DS component that states an ordered path carrying
 *  states (foundations-composants). */
export const PathRail = () => (
  <Card variant='default' padding='lg'>
    <div className='flex flex-col gap-4'>
      <Title order={3} size='sm' className={TYPO.title()}>Your path to 42</Title>
      <Timeline size='sm' lineVariant='solid'>
        {STAGES.map(stage => (
          <Timeline.Item
            key={stage.id}
            variant={stage.state === 'locked' ? 'outline' : 'filled'}
            color={stage.state === 'current' ? 'pink' : 'gray'}
          >
            <Timeline.Content>
              <Timeline.Title className={`${TYPO.title()} text-sm`}>{stage.label}</Timeline.Title>
              <Text size='sm' c='muted'>{stage.detail}</Text>
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  </Card>
)

/** The four paragraphs of administrative prose of the shipped screen, moved out of the
 *  way of the fields and cut to what answers the only question a candidate has here:
 *  why are you asking me this. */
export const WhyRail = ({ points }: { points: string[] }) => (
  <Card variant='default' padding='lg'>
    <div className='flex flex-col gap-4'>
      <Title order={3} size='sm' className={TYPO.title()}>Why we ask</Title>
      <div className='flex flex-col gap-3'>
        {points.map(point => (
          <Text key={point} size='sm' c='muted'>{point}</Text>
        ))}
      </div>
    </div>
  </Card>
)

export const FormLayout = ({
  current,
  why,
  children,
}: {
  current: number
  why: string[]
  children: ReactNode
}) => (
  <div className='flex flex-col gap-10'>
    <PageHead />
    <div className='flex items-start gap-10'>
      <div className='flex min-w-0 flex-1 flex-col gap-10'>
        <JourneyCard />
        <div className='flex flex-col gap-4'>
          <StepTabs current={current} />
          {children}
        </div>
      </div>
      <aside className='flex w-[340px] shrink-0 flex-col gap-10'>
        <PathRail />
        <WhyRail points={why} />
      </aside>
    </div>
  </div>
)

/** THE ACTIONS. The shipped NEXT is a full-width white slab: the loudest thing on the
 *  page, for a step that is one of nine. review:components - a button predominates
 *  neither by size nor by number, and its colour follows the action. */
export const StepNav = ({
  back,
  onNext,
  nextLabel = 'Continue',
}: {
  back?: string
  onNext: () => void
  nextLabel?: string
}) => (
  <div className='flex flex-wrap items-center justify-between gap-4'>
    <Text size='sm' c='muted'>Saved as you go. You can close this and come back.</Text>
    <div className='flex items-center gap-2'>
      {back ? (
        <Button
          size='sm'
          variant='subtle'
          color='gray'
          onClick={() => {
            window.location.hash = `#/${back}`
          }}
        >
          Back
        </Button>
      ) : null}
      <Button size='sm' variant='filled' onClick={onNext}>{nextLabel}</Button>
    </div>
  </div>
)
