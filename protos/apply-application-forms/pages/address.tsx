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
import { COUNTRIES, DRAFT, type Draft } from '../data/application'

const WHY = [
  'The address is where the campus sends the paperwork you sign before the Piscine.',
  'It also decides which transport pass and housing help you can be pointed to, if you need them.',
  'A temporary address is fine. Tell us until when and we will ask again before the Piscine.',
]

export const Address = () => {
  const [draft, setDraft] = useState<Draft>({ ...DRAFT })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (patch: Partial<Draft>) => {
    Object.assign(DRAFT, patch)
    setDraft({ ...DRAFT })
  }

  const onNext = () => {
    const next: Record<string, string> = {}
    if (!draft.street.trim()) next.street = 'Street and number.'
    if (!draft.postcode.trim()) next.postcode = 'Postcode.'
    if (!draft.city.trim()) next.city = 'City.'
    if (!draft.country) next.country = 'Pick a country.'
    setErrors(next)
    if (Object.keys(next).length === 0) window.location.hash = '#/context'
  }

  return (
    <FormLayout current={1} why={WHY}>
      <Card variant='default' padding='lg'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Title order={2} size='md' className={TYPO.title()}>Residential address</Title>
            <Text size='sm' c='muted'>Where you actually live right now, not where you plan to move.</Text>
          </div>

          <Field label='Street and number' error={errors.street}>
            <Input
              size='sm'
              placeholder='Karl-Marx-Allee 78'
              value={draft.street}
              onChange={event => set({ street: event.target.value })}
            />
          </Field>

          <Field label='Building, floor, extra line' description='Optional.'>
            <Input
              size='sm'
              placeholder='Aufgang B, 3. OG'
              value={draft.complement}
              onChange={event => set({ complement: event.target.value })}
            />
          </Field>

          <div className='grid grid-cols-[140px_1fr] gap-4'>
            <Field label='Postcode' error={errors.postcode}>
              <Input
                size='sm'
                placeholder='10243'
                value={draft.postcode}
                onChange={event => set({ postcode: event.target.value })}
              />
            </Field>
            <Field label='City' error={errors.city}>
              <Input
                size='sm'
                placeholder='Berlin'
                value={draft.city}
                onChange={event => set({ city: event.target.value })}
              />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field label='Country' error={errors.country}>
              <Select
                size='sm'
                data={COUNTRIES}
                placeholder='Select'
                clearable
                value={draft.country}
                onChange={value => set({ country: value })}
              />
            </Field>
          </div>

          <div className='flex flex-col gap-4'>
            <Checkbox
              size='sm'
              checked={draft.temporary}
              onCheckedChange={checked => set({ temporary: checked === true })}
              label='This address is temporary'
            />
            {draft.temporary ? (
              <Field label='Valid until' description='We will ask you again a week before the Piscine.'>
                <Input
                  size='sm'
                  placeholder='October 2026'
                  value={draft.temporaryUntil}
                  onChange={event => set({ temporaryUntil: event.target.value })}
                />
              </Field>
            ) : null}
          </div>

          <StepNav back='identity' onNext={onNext} />
        </div>
      </Card>
    </FormLayout>
  )
}
