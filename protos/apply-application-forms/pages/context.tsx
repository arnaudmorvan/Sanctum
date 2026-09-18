import { useState } from 'react'
import { Card } from '@42/ui-react/card'
import { Checkbox } from '@42/ui-react/checkbox'
import { Field } from '@42/ui-react/field'
import { Input } from '@42/ui-react/input'
import { Select } from '@42/ui-react/select'
import { Text } from '@42/ui-react/text'
import { Title } from '@42/ui-react/title'
import { TYPO } from '../../../src/typo'
import { FormLayout, StepNav } from '../components/bits'
import { DRAFT, HEARD_FROM, QUALIFICATIONS, SITUATIONS, type Draft } from '../data/application'

const WHY = [
  'Nothing on this page is a selection criterion. 42 takes no account of your diploma, and the Piscine is the only test.',
  'What you say here goes to the campus team so they can prepare your arrival, and to nobody else.',
  'Accommodations are set up before day one. Asking now is what makes them possible.',
]

export const Context = () => {
  const [draft, setDraft] = useState<Draft>({ ...DRAFT })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (patch: Partial<Draft>) => {
    Object.assign(DRAFT, patch)
    setDraft({ ...DRAFT })
  }

  const onNext = () => {
    const next: Record<string, string> = {}
    if (!draft.situation) next.situation = 'Pick what you are doing right now.'
    setErrors(next)
    if (Object.keys(next).length === 0) window.location.hash = '#/done'
  }

  return (
    <FormLayout current={2} why={WHY}>
      <Card variant='default' padding='lg'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Title order={2} size='md' className={TYPO.title()}>Context</Title>
            <Text size='sm' c='muted'>
              None of this is graded. It tells the campus team who is walking in on day one.
            </Text>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field label='What you are doing right now' error={errors.situation}>
              <Select
                size='sm'
                data={SITUATIONS}
                placeholder='Select'
                clearable
                value={draft.situation}
                onChange={value => set({ situation: value })}
              />
            </Field>
            <Field label='Highest qualification' description='Optional. It changes nothing in the selection.'>
              <Select
                size='sm'
                data={QUALIFICATIONS}
                placeholder='Select'
                clearable
                value={draft.qualification}
                onChange={value => set({ qualification: value })}
              />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field label='How you heard about 42' description='Optional.'>
              <Select
                size='sm'
                data={HEARD_FROM}
                placeholder='Select'
                clearable
                value={draft.heardFrom}
                onChange={value => set({ heardFrom: value })}
              />
            </Field>
          </div>

          <div className='flex flex-col gap-4'>
            <Checkbox
              size='sm'
              checked={draft.needsAccommodation}
              onCheckedChange={checked => set({ needsAccommodation: checked === true })}
              label='I need accommodations during the Piscine'
            />
            {draft.needsAccommodation ? (
              <Field label='What would help' description='A sentence is enough. The campus team comes back to you.'>
                <Input
                  size='sm'
                  placeholder='Ground floor workstation, extra time on exams'
                  value={draft.accommodationDetail}
                  onChange={event => set({ accommodationDetail: event.target.value })}
                />
              </Field>
            ) : null}
            <Checkbox
              size='sm'
              checked={draft.needsHousing}
              onCheckedChange={checked => set({ needsHousing: checked === true })}
              label='I would like help finding housing for the 26 days'
            />
          </div>

          <StepNav back='address' onNext={onNext} nextLabel='Send my forms' />
        </div>
      </Card>
    </FormLayout>
  )
}
