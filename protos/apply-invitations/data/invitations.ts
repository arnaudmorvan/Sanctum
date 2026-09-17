import type { ComponentType } from "react"
import { CalendarDays, FileText, Gamepad2, GraduationCap, Info, PlayCircle, User } from "lucide-react"

type Glyph = ComponentType<{ size?: number; className?: string }>

export type Step = {
  id: string
  name: string
  detail: string
  icon: Glyph
  /** Shown as a grey Badge. In the source screenshot "Level: HARD" was bare text
   *  floating under a paragraph — review:color wants the meaning in the label of a
   *  neutral badge, not in a hue and not loose on the canvas. */
  note?: string
}

export type Invitation = {
  slug: string
  name: string
  campus: string
  /** One line saying what the path LEADS TO. The shipped screen says nothing of the
   *  kind, which is why the two invitations read as interchangeable. */
  promise: string
  /** The entry point of the screen — it alone gets the gradient card.
   *  foundations-composants: one gradient card per screen, or the signal is cancelled. */
  featured: boolean
  steps: Step[]
}

/** The 7 steps and their copy are LIFTED from the "Your path to 42" modal
 *  (screenshot, 2026-09-17), icons included: play-circle, file-text, gamepad,
 *  user, info, calendar, graduation-cap.
 *
 *  ⚠️ NOT lifted, and flagged as such in the report: the campuses, and the 3 steps of
 *  Open Day — the shipped screen only says "3-step journey" without ever listing them.
 *  They are plausible demo data, to be confirmed with the devs. */
const SELECTION_STEPS: Step[] = [
  {
    id: "overview",
    name: "Overview",
    detail: "An overview of the full journey ahead — so you know exactly what to expect before you take the leap.",
    icon: PlayCircle,
  },
  {
    id: "sessions",
    name: "Sessions & Programs",
    detail: "Browse the available meeting sessions and programs near you. Pick the one that fits your schedule.",
    icon: FileText,
  },
  {
    id: "challenges",
    name: "Coding Challenges",
    detail: "Fun, no-experience-needed coding challenges to see if the 42 method clicks with you. Curiosity is the only prerequisite.",
    icon: Gamepad2,
    note: "Level: Hard",
  },
  {
    id: "about-you",
    name: "About You",
    detail: "A short form where you tell us who you are. No degree, no résumé — just your story and your ambitions.",
    icon: User,
  },
  {
    id: "background",
    name: "Your Background",
    detail: "A few more questions to help us understand your background and tailor the experience for you.",
    icon: Info,
  },
  {
    id: "visit",
    name: "Campus Visit",
    detail: "A group visit to the campus. Meet the team, discover the space, and get a feel for how 42's peer-learning pedagogy works in real life.",
    icon: CalendarDays,
  },
  {
    id: "program",
    name: "Program",
    detail: "A multi-week intensive challenge alongside other candidates. Places are limited, but everyone has a fair shot — it's all about how you grow.",
    icon: GraduationCap,
  },
]

const OPEN_DAY_STEPS: Step[] = [
  {
    id: "overview",
    name: "Overview",
    detail: "What the day looks like, from the moment you arrive to the moment you leave.",
    icon: PlayCircle,
  },
  {
    id: "sessions",
    name: "Sessions & Programs",
    detail: "Pick the open day that fits your schedule. Several dates, same content.",
    icon: FileText,
  },
  {
    id: "visit",
    name: "Campus Visit",
    detail: "Come see the place, meet the team, and ask anything you want about how 42 works.",
    icon: CalendarDays,
  },
]

export const LEARNER = { firstName: "Sloane" }

/** ORDER IS A DESIGN DECISION. The shipped screen lists Open Day first and the Selection
 *  Program second, in equal rows — so the screen says the two are the same size of
 *  commitment. They are not: one is a visit, the other is the path to becoming a student.
 *  The heavier one leads, and it is the one that carries the signature outline. */
export const INVITATIONS: Invitation[] = [
  {
    slug: "selection-program",
    name: "Selection Program",
    campus: "42 Paris",
    promise: "The full path to becoming a student at 42.",
    featured: true,
    steps: SELECTION_STEPS,
  },
  {
    slug: "open-day",
    name: "Open Day",
    campus: "42 Lyon",
    promise: "A few hours on campus to see what the place is like.",
    featured: false,
    steps: OPEN_DAY_STEPS,
  },
]

export const bySlug = (slug?: string): Invitation =>
  INVITATIONS.find((i) => i.slug === slug) ?? INVITATIONS[0]

/** The three directions, described for the compare screen. */
export const DIRECTIONS = [
  {
    id: "a",
    letter: "A",
    name: "The path inline",
    claim: "No modal at all.",
    detail: "The steps live inside the invitation card. Nothing to click before deciding — what you are being asked is on screen from the first second.",
    cost: "The page gets long. With two invitations of 7 and 3 steps, the fold is far down.",
    featured: false,
  },
  {
    id: "b",
    letter: "B",
    name: "Decidable card, enriched modal",
    claim: "The modal stays, but it earns its click.",
    detail: "The card carries campus, stakes and step count — enough to decide without opening anything. The modal adds the detail and, crucially, the Accept button: you decide where you understood.",
    cost: "Still one click away from the thing that motivates.",
    featured: false,
  },
  {
    id: "c",
    letter: "C",
    name: "The path as a page",
    claim: "A journey is a territory, not a dialog.",
    detail: "The path opens as a real page: the steps at the centre as a map, the decision in the side rail. It is the DS dashboard template applied to an application.",
    cost: "Leaves the list. Heavier to build, and the back-and-forth has to be handled.",
    featured: false,
  },
  {
    id: "d",
    letter: "D",
    name: "The stepper folded into the tile",
    claim: "Every step on screen, none of them shouting.",
    detail: "The path is a stepper inside the invitation card: seven rows you take in at a glance — number, glyph, name — each opening onto its own prose. It is A's promise, that nothing hides behind a click, without A's scroll.",
    cost: "A closed row says its name and nothing more. If the detail of a step is what decides, it is still one interaction away.",
    featured: true,
  },
]
