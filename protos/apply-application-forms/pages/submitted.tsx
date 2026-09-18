import { CalendarCheck, IdCard, Mail } from 'lucide-react'
import { Button } from '@42/ui-react/button'
import { Card } from '@42/ui-react/card'
import { Text } from '@42/ui-react/text'
import { ThemeIcon } from '@42/ui-react/theme-icon'
import { Title } from '@42/ui-react/title'
import { TYPO } from '../../../src/typo'
import { PageHead, PathRail } from '../components/bits'
import { APPLICATION, LEARNER } from '../data/application'

const NEXT_UP = [
  {
    id: 'mail',
    icon: Mail,
    label: 'A confirmation lands in your inbox',
    detail: 'Today. It carries the list of what to bring, and nothing to fill in.',
  },
  {
    id: 'meeting',
    icon: IdCard,
    label: 'The Meeting',
    detail: `${APPLICATION.meeting} - we check your ID against the identity you just filled in.`,
  },
  {
    id: 'piscine',
    icon: CalendarCheck,
    label: 'The Piscine',
    detail: `${APPLICATION.piscineStart} - 26 days on campus. Everything before this is paperwork.`,
  },
]

/** The screen the shipped flow does not have: what the forms just opened. Without it
 *  the three forms end on a blank page and the candidate never learns what they bought.
 *  ONE gradient card, and it is the seat. */
export const Submitted = () => (
  <div className='flex flex-col gap-10'>
    <PageHead />
    <div className='flex items-start gap-10'>
      <div className='flex min-w-0 flex-1 flex-col gap-10'>
        <Card variant='gradient' padding='lg'>
          <div className='flex flex-col gap-4'>
            <Text size='xs' span c='muted' className={`${TYPO.mono('semibold')} uppercase tracking-widest`}>
              Step 3 / 4 done
            </Text>
            <Title order={2} size='xl' className={TYPO.title()}>
              Your seat is held, {LEARNER.firstName}
            </Title>
            <Text size='sm' c='secondary' className='max-w-[68ch]'>
              The three forms are in. {APPLICATION.campus} keeps a place for you in the Piscine
              starting <span className={TYPO.mono('semibold')}>{APPLICATION.piscineStart}</span>. You have
              nothing left to fill in.
            </Text>
            <div className='flex'>
              <Button
                size='sm'
                variant='filled'
                onClick={() => {
                  window.location.hash = '#/identity'
                }}
              >
                Review what I sent
              </Button>
            </div>
          </div>
        </Card>

        <div className='flex flex-col gap-4'>
          <Title order={2} size='md' className={TYPO.title()}>What happens next</Title>
          <Card variant='default' padding='lg'>
            <div className='flex flex-col gap-5'>
              {NEXT_UP.map(item => {
                const Glyph = item.icon
                return (
                  <div key={item.id} className='flex items-start gap-4'>
                    <ThemeIcon size='md' variant='light' color='gray' radius='md'>
                      <Glyph size={16} />
                    </ThemeIcon>
                    <div className='flex flex-col gap-1'>
                      <Text size='sm'>{item.label}</Text>
                      <Text size='sm' c='muted'>{item.detail}</Text>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
      <aside className='flex w-[340px] shrink-0 flex-col gap-10'>
        <PathRail />
      </aside>
    </div>
  </div>
)
