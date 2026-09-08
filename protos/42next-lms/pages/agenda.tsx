import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  AGENDA_EVENTS,
  AGENDA_LEGEND,
  AGENDA_MONTH,
  type EventTone,
  REGISTRATIONS,
} from "../data/lms"
import { Legend, PageHead, Tag } from "./shell"

const CRUMB = { label: "Agenda", href: "#/agenda/calendar" }

/** One tone -> one surface. Declared once so a cell never picks its colour inline.
 *  2026-09-08 — `success` no longer renders green: it is a neutral translucent chip like
 *  the rest, and the event label states what it is. */
const EVENT_CLASS: Record<EventTone, string> = {
  brand: "bg-brand-500/25 text-brand-100",
  success: "bg-white/15 text-white",
  violet: "bg-purple-500/25 text-purple-100",
  warning: "bg-orange-500/25 text-orange-100",
}

const DOT_CLASS: Record<EventTone, string> = {
  brand: "bg-brand-500",
  success: "bg-white/50",
  violet: "bg-purple-400",
  warning: "bg-orange-500",
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** Calendar — `P['agenda.calendar']`. A 6×7 grid; the month's arithmetic (5 leading
 *  blanks, 31 days, today the 20th) is data, not a magic number in the loop. */
export const AgendaCalendar = () => {
  const cells = Array.from({ length: 42 }, (_, i) => i - AGENDA_MONTH.offset + 1)
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb data={[CRUMB, { label: "Calendar" }]} />
      <PageHead
        title="Calendar"
        sub="Everything with a date — reviews, exam sessions, rushes, events and your own slots."
        aside={
          <>
            <Button variant="outline" size="sm">{AGENDA_MONTH.label} ⌄</Button>
            <Button variant="filled" size="sm" asChild>
              <a href="#/review/availability">+ Slot</a>
            </Button>
          </>
        }
      />

      <Card variant="outline" padding="md">
        <Card.Content>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-1 pb-2">
                <Text size="xs" c="muted" className={TYPO.nav}>{d}</Text>
              </div>
            ))}
            {cells.map((n, i) => {
              if (n < 1 || n > AGENDA_MONTH.days)
                return <div key={`blank-${i}`} className="min-h-20 rounded-md opacity-20" />
              const events = AGENDA_EVENTS[n] ?? []
              const today = n === AGENDA_MONTH.today
              return (
                <div
                  key={n}
                  className={`flex min-h-20 flex-col gap-1 rounded-md border p-1.5 ${
                    today ? "border-brand-500" : "border-white/10"
                  }`}
                >
                  <span className={`text-xs ${TYPO.mono(today ? "bold" : "regular")}`}>{n}</span>
                  {events.map((e) => (
                    <span
                      key={e.label}
                      className={`truncate rounded px-1 py-0.5 text-[10px] ${EVENT_CLASS[e.tone]}`}
                      title={e.label}
                    >
                      {e.label}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        </Card.Content>
      </Card>

      <Legend items={AGENDA_LEGEND.map((l) => ({ label: l.label, className: DOT_CLASS[l.tone] }))} />
    </div>
  )
}

/** Registrations — `P['agenda.registrations']`. Everything signed up for, and the
 *  deadline that closes it: the deadline is the reason the page exists. */
export const AgendaRegistrations = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Registrations" }]} />
    <PageHead title="Registrations" sub="Everything you signed up for, and the deadlines that close it." />

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {REGISTRATIONS.map((r) => (
        <Card key={r.title} variant="outline" padding="md">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Title order={2} size="sm" className={TYPO.title("semibold")}>{r.title}</Title>
                  <Text size="xs" c="secondary">{r.sub}</Text>
                </div>
                <Tag color={r.color}>{r.badge}</Tag>
              </div>
              {r.body ? <Text size="sm" c="secondary">{r.body}</Text> : null}
              {r.foot || r.action ? (
                <div className="flex flex-wrap items-center gap-3">
                  {r.foot ? <Text size="xs" c="muted">{r.foot}</Text> : null}
                  {r.action ? (
                    <Button variant="subtle" size="xs" className="ms-auto" asChild={r.action.startsWith("Manage")}>
                      {r.action.startsWith("Manage") ? <a href="#/exams">{r.action}</a> : r.action}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)
