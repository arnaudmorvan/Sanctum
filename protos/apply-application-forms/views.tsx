import { FileText, GraduationCap, History, House } from 'lucide-react'
import type { ProtoNavItem, ProtoView } from '../../src/proto-types'
import { Address } from './pages/address'
import { Context } from './pages/context'
import { Identity } from './pages/identity'
import { Submitted } from './pages/submitted'

/** Apply - Application forms (42 Berlin, Selection Piscine).
 *
 *  SOURCE: screenshot of the live candidate form, 2026-09-18.
 *
 *  WHAT IS BEING REWORKED. The shipped screen states a legal questionnaire: a bare
 *  stepper floating on the canvas, a title that says Tell us who we are, four
 *  paragraphs of administrative prose before the first field, two tabs both numbered 2,
 *  nine fields in one flat column, and a full-width white NEXT that dominates the page.
 *  It reports an obligation; it never says what the forms open.
 *
 *  WHAT REPLACES IT. The path comes first, in the gradient card: step 3 of 4, and what
 *  the three forms unlock (the Piscine seat). The three sub-steps become real navigable
 *  screens instead of tabs that lie about their number. The prose drops to one line at
 *  the top of the card plus a why-we-ask rail. Fields are paired, optional ones are
 *  folded until asked for, and the primary action is a sm button that no longer owns
 *  the screen.
 *
 *  The CHROME is the skeleton (NAV below), never drawn inside the flow. */

export const NAV: ProtoNavItem[] = [
  { label: 'Home', icon: <House size={16} /> },
  { label: 'Active applications', path: 'identity', icon: <GraduationCap size={16} /> },
  { label: 'Past applications', icon: <History size={16} /> },
  { label: 'Paperwork', icon: <FileText size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: 'identity', label: '01 - Identity', render: () => <Identity /> },
  { path: 'address', label: '02 - Address', render: () => <Address /> },
  { path: 'context', label: '03 - Context', render: () => <Context /> },
  { path: 'done', label: 'Forms complete', render: () => <Submitted /> },
]
