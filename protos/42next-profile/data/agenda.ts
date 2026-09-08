/** Agenda block of the profile rail — the learner's month, a dot on the days that
 *  carry something. Product source: 42next-lms-sitemap-as-built.md, section Agenda
 *  (Calendar + Registrations). The vocabulary is the product's: review, exam, rush,
 *  milestone.
 *
 *  The dates are built as OFFSETS FROM TODAY, not written down: a proto whose demo
 *  month has passed shows an empty calendar and says nothing. */

export type AgendaEvent = { date: Date; stamp: string; label: string }

const at = (offset: number) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offset)
  return d
}

const STAMP = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" })

const build = (offset: number, label: string): AgendaEvent => {
  const date = at(offset)
  return { date, stamp: STAMP.format(date).toUpperCase(), label }
}

export const AGENDA_EVENTS: AgendaEvent[] = [
  build(1, "Review to give - philosophers"),
  build(3, "Exam session - C exam 02"),
  build(6, "Review to give - minishell"),
  build(10, "Rush weekend - registration closes"),
  build(17, "Milestone 3 checkpoint"),
]

const DAYS = new Set(AGENDA_EVENTS.map((e) => e.date.toDateString()))

export const hasAgenda = (date: Date) => DAYS.has(date.toDateString())

export const NEXT_EVENT = AGENDA_EVENTS[0]

export const AGENDA_LEGEND =
  "A dot marks a day that carries something - reviews to give, exam sessions, campus events."
