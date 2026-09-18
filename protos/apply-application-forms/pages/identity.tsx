import { useState } from 'react'
import { Info, Plus } from 'lucide-react'
import { Button } from '@42/ui-react/button'
import { Card } from '@42/ui-react/card'
import { Checkbox } from '@42/ui-react/checkbox'
import { Field } from '@42/ui-react/field'
import { Input } from '@42/ui-react/input'
import { Select } from '@42/ui-react/select'
import { Text } from '@42/ui-react/text'
import { Title } from '@42/ui-react/title'
import { Tooltip } from '@42/ui-react/tooltip'
import { TYPO } from '../../../src/typo'
import { FormLayout, StepNav } from '../components/bits'
import { COUNTRY_CODES, DRAFT, LANGUAGES, NATIONALITIES, type Draft } from '../data/application'

const WHY = [
  'The legal name is checked against the ID you bring to the Meeting. If the two differ, the seat cannot be confirmed on the spot.',
  'The phone number is used by the campus team for logistics before the Piscine, never for marketing.',
  'Nationality is asked because some campuses need it for site access, not to sort candidates.',
]

export const Identity = () => {
  const [draft, setDraft] = useState<Draft>({ ...DRAFT })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [secondNationality, setSecondNationality] = useState(Boolean(DRAFT.nationality2))

  const set = (patch: Partial<Draft>) => {
    Object.assign(DRAFT, patch)
    setDraft({ ...DRAFT })
  }

  const onNext = () => {
    const next: Record<string, string> = {}
    if (!draft.legalLastName.trim()) next.legalLastName = 'As printed on your ID.'
    if (!draft.legalFirstName.trim()) next.legalFirstName = 'As printed on your ID.'
    if (!draft.phone.trim()) next.phone = 'The campus team calls this number before the Piscine.'
    if (!draft.placeOfBirth.trim()) next.placeOfBirth = 'The city on your birth certificate.'
    if (!draft.nationality1) next.nationality1 = 'Pick the nationality on the ID you will bring.'
    if (!draft.language) next.language = 'Pick the language we write to you in.'
    setErrors(next)
    if (Object.keys(next).length === 0) window.location.hash = '#/address'
  }

  return (
    <FormLayout current={0} why={WHY}>
      <Card variant='default' padding='lg'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Title order={2} size='md' className={TYPO.title()}>Identity</Title>
            <Text size='sm' c='muted'>
              Copy what is printed on the ID you will bring on day one. If your situation needs
              special handling, fill this in with your current identity and tell the campus team.
            </Text>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field label='Legal last name' error={errors.legalLastName}>
              <Input
                size='sm'
                placeholder='Stark'
                value={draft.legalLastName}
                onChange={event => set({ legalLastName: event.target.value })}
              />
            </Field>
            <Field label='Legal first name' error={errors.legalFirstName}>
              <Input
                size='sm'
                placeholder='Sacha'
                value={draft.legalFirstName}
                onChange={event => set({ legalFirstName: event.target.value })}
              />
            </Field>
          </div>

          <div className='flex flex-col gap-4'>
            <Checkbox
              size='sm'
              checked={draft.useUsualName}
              onCheckedChange={checked => set({ useUsualName: checked === true })}
              label={
                <span className='flex items-center gap-1.5'>
                  I go by a different first name
                  <Tooltip label='The name 42 calls you, on your profile and in the classrooms. Your legal name stays on the paperwork only.'>
                    <Info size={14} />
                  </Tooltip>
                </span>
              }
            />
            {draft.useUsualName ? (
              <Field label='Usual first name' description='This is the name you will see everywhere at 42.'>
                <Input
                  size='sm'
                  placeholder='Alexandra'
                  value={draft.usualFirstName}
                  onChange={event => set({ usualFirstName: event.target.value })}
                />
              </Field>
            ) : null}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field label='Phone' error={errors.phone}>
              <div className='grid grid-cols-[110px_1fr] gap-2'>
                <Select
                  size='sm'
                  data={COUNTRY_CODES}
                  value={draft.phoneCode}
                  onChange={value => set({ phoneCode: value ?? '+49' })}
                />
                <Input
                  size='sm'
                  placeholder='151 234 5678'
                  value={draft.phone}
                  onChange={event => set({ phone: event.target.value })}
                />
              </div>
            </Field>
            <Field label='Place of birth' description='City as written on your birth certificate.' error={errors.placeOfBirth}>
              <Input
                size='sm'
                placeholder='Sydney'
                value={draft.placeOfBirth}
                onChange={event => set({ placeOfBirth: event.target.value })}
              />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field label='Nationality' error={errors.nationality1}>
              <Select
                size='sm'
                data={NATIONALITIES}
                placeholder='Select'
                clearable
                value={draft.nationality1}
                onChange={value => set({ nationality1: value })}
              />
            </Field>
            <Field label='Communication language' description='We write to you in this language.' error={errors.language}>
              <Select
                size='sm'
                data={LANGUAGES}
                placeholder='Select'
                clearable
                value={draft.language}
                onChange={value => set({ language: value })}
              />
            </Field>
          </div>

          {secondNationality ? (
            <div className='grid grid-cols-2 gap-4'>
              <Field label='Second nationality' description='Optional.'>
                <Select
                  size='sm'
                  data={NATIONALITIES}
                  placeholder='Select'
                  clearable
                  value={draft.nationality2}
                  onChange={value => set({ nationality2: value })}
                />
              </Field>
            </div>
          ) : (
            <div className='flex'>
              <Button
                size='xs'
                variant='subtle'
                color='gray'
                startSlot={<Plus size={14} />}
                onClick={() => setSecondNationality(true)}
              >
                Add a second nationality
              </Button>
            </div>
          )}

          <StepNav onNext={onNext} />
        </div>
      </Card>
    </FormLayout>
  )
}
