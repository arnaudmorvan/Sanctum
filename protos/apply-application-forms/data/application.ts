export type Stage = {
  id: string
  label: string
  state: 'done' | 'current' | 'locked'
  detail: string
}

export type FormStep = { id: string; path: string; label: string }

export type Draft = {
  legalLastName: string
  legalFirstName: string
  useUsualName: boolean
  usualFirstName: string
  phoneCode: string
  phone: string
  placeOfBirth: string
  nationality1: string | null
  nationality2: string | null
  language: string | null
  street: string
  complement: string
  postcode: string
  city: string
  country: string | null
  temporary: boolean
  temporaryUntil: string
  situation: string | null
  qualification: string | null
  heardFrom: string | null
  needsAccommodation: boolean
  accommodationDetail: string
  needsHousing: boolean
}

export const LEARNER = { firstName: 'Alexandra' }

export const APPLICATION = {
  campus: '42 Berlin',
  program: 'Selection Piscine',
  piscineStart: 'NOV 3, 2026',
  meeting: 'OCT 14, 2026',
}

/** The four stages of the application, as the shipped stepper states them. */
export const STAGES: Stage[] = [
  { id: 'campus', label: 'Campus', state: 'done', detail: 'Berlin picked, seat requested' },
  { id: 'games', label: 'Games', state: 'done', detail: 'Logic games passed on Sep 12' },
  { id: 'forms', label: 'Forms', state: 'current', detail: 'Who you are, where you live, where you are at' },
  { id: 'piscine', label: 'Piscine', state: 'locked', detail: '26 days on campus, starts Nov 3' },
]

/** The three forms. In the shipped screen they were tabs numbered 1, 2 and 2. */
export const FORM_STEPS: FormStep[] = [
  { id: 'identity', path: 'identity', label: 'Identity' },
  { id: 'address', path: 'address', label: 'Address' },
  { id: 'context', path: 'context', label: 'Context' },
]

export const NATIONALITIES = [
  'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'France', 'Germany', 'Italy',
  'Japan', 'Morocco', 'Netherlands', 'Poland', 'Portugal', 'Senegal', 'Spain',
  'Tunisia', 'Ukraine', 'United Kingdom', 'United States',
]

export const COUNTRIES = NATIONALITIES

export const LANGUAGES = ['English', 'French', 'German']

export const COUNTRY_CODES = ['+33', '+34', '+39', '+44', '+49', '+1']

export const SITUATIONS = [
  'Studying', 'Working', 'Between jobs', 'Military or civic service', 'Other',
]

export const QUALIFICATIONS = [
  'No diploma', 'High school', 'Two years of higher education', 'Bachelor', 'Master or above',
]

export const HEARD_FROM = [
  'A friend or family member', 'A 42 student', 'An open day', 'Social media',
  'My school or job centre', 'The press',
]

/** The draft the candidate is filling in. Module-level on purpose: the three screens
 *  are separate routes, and what was typed must survive the navigation - that is what
 *  Saved as you go promises at the bottom of every card. */
export const DRAFT: Draft = {
  legalLastName: 'Stark',
  legalFirstName: 'Sacha',
  useUsualName: true,
  usualFirstName: 'Alexandra',
  phoneCode: '+49',
  phone: '',
  placeOfBirth: '',
  nationality1: null,
  nationality2: null,
  language: null,
  street: '',
  complement: '',
  postcode: '',
  city: '',
  country: null,
  temporary: false,
  temporaryUntil: '',
  situation: null,
  qualification: null,
  heardFrom: null,
  needsAccommodation: false,
  accommodationDetail: '',
  needsHousing: false,
}
