import { Alert } from "@42/ui-react/alert"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import {
  CalendarDays,
  CalendarPlus,
  ClipboardCheck,
  FileCheck,
  Sparkles,
  Ticket,
} from "lucide-react"
import type { ComponentType } from "react"
import { useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  CAL,
  EXAMS_ELIGIBLE,
  EXAMS_REGISTERED,
  EXAM_RESULTS,
  REGISTRATIONS,
  type EventKind,
} from "../data/review"
import { Cap, PageHead, Section, Tag } from "./shell"

/** Exams — `P['exams']`, one page and three tabs. A module has zero or one exam.
 *
 *  The tab bar is a `SegmentGroup`: three options, all visible, exclusive choice — the
 *  catalog's own threshold. The counts the artifact hung off the first two tabs move into
 *  the panel headings, because a segment's label is not a slot for a badge. */
export const Exams = () => {
  const [tab, setTab] = useState<"Eligible" | "Registered" | "Results">("Eligible")

  return (
    <div className="flex flex-col gap-10">
      <PageHead
        title="Exams"
        sub="Sessions, registrations and results. A module has zero or one exam."
        aside={
          <SegmentGroup
            size="sm"
            data={["Eligible", "Registered", "Results"]}
            value={tab}
            onChange={(v) => setTab(v as "Eligible" | "Registered" | "Results")}
          />
        }
      />

      {tab === "Eligible" ? (
        <Section title="Eligible — 1" icon={FileCheck}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {EXAMS_ELIGIBLE.map((x) => (
              <Card key={x.name} variant={x.entry ? "gradient" : "default"} padding="lg">
                <Card.Content>
                  <div className="flex h-full flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <Title order={3} size="md" className={TYPO.title("semibold")}>
                          {x.name}
                        </Title>
                        <Text size="xs" c="muted">
                          {x.sub}
                        </Text>
                      </div>
                      <Tag>{x.status}</Tag>
                    </div>
                    <Text size="sm" c="secondary">
                      {x.body}
                    </Text>
                    {x.action ? (
                      <div className="mt-auto flex flex-wrap items-center gap-3">
                        <Button variant="filled" size="sm">
                          {x.action}
                        </Button>
                        <Text size="xs" c="muted">
                          {x.note}
                        </Text>
                      </div>
                    ) : null}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {tab === "Registered" ? (
        <Section title="Registered — 2" icon={Ticket}>
          <div className="flex flex-col gap-6">
            <Table>
              <Table.Content>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>Exam</Table.HeaderCell>
                    <Table.HeaderCell>Session</Table.HeaderCell>
                    <Table.HeaderCell>Seats</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell> </Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {EXAMS_REGISTERED.map((r) => (
                    <Table.Row key={r.session}>
                      <Table.Cell>{r.exam}</Table.Cell>
                      <Table.Cell>
                        <span className={TYPO.mono("medium")}>{r.session}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className={TYPO.mono("medium")}>{r.seats}</span>
                      </Table.Cell>
                      <Table.Cell>{r.loc}</Table.Cell>
                      <Table.Cell>
                        <Tag>{r.status}</Tag>
                      </Table.Cell>
                      <Table.Cell>
                        <Button variant="subtle" size="xs">
                          {r.action}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table>
            <Alert
              type="info"
              variant="light"
              title="You can hold a seat and a waitlist place at once"
              description="Registering for several sessions of the same exam is allowed — the first one you sit closes the others."
            />
          </div>
        </Section>
      ) : null}

      {tab === "Results" ? (
        <Section title="Results" icon={FileCheck}>
          <Table>
            <Table.Content>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Exam</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Score</Table.HeaderCell>
                  <Table.HeaderCell>Tier reached</Table.HeaderCell>
                  <Table.HeaderCell>Outcome</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {EXAM_RESULTS.map((r) => (
                  <Table.Row key={`${r.exam}-${r.date}`}>
                    <Table.Cell>{r.exam}</Table.Cell>
                    <Table.Cell>
                      <span className={TYPO.mono("medium")}>{r.date}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={TYPO.mono("semibold")}>{r.score}</span>
                    </Table.Cell>
                    <Table.Cell>{r.tier}</Table.Cell>
                    <Table.Cell>
                      {/* terminal validation is the stated green exception; a failure
                          keeps the grey and says the word */}
                      <Tag color={r.outcome === "Validated" ? "green" : "gray"}>{r.outcome}</Tag>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        </Section>
      ) : null}
    </div>
  )
}

const CAL_ICON: Record<EventKind, ComponentType<{ size?: number }>> = {
  review: ClipboardCheck,
  slot: CalendarPlus,
  exam: FileCheck,
  event: Sparkles,
}
const CAL_LEGEND: { kind: EventKind; label: string }[] = [
  { kind: "review", label: "Reviews" },
  { kind: "exam", label: "Exams" },
  { kind: "event", label: "Rushes & events" },
  { kind: "slot", label: "My open slots" },
]

/** Calendar — `P['agenda.calendar']`.
 *
 *  ⚠️ THE MONTH GRID IS HAND-COMPOSED, and it is the one ❌ of this screen's coverage
 *  table. The kit's `Calendar` is a date PICKER on Ark's date-picker machine: its
 *  `renderDay` slot takes an event dot, not a stack of labelled events, and selecting a
 *  day is not what this screen is for. So the grid is owned Tailwind layout inside one
 *  card — logged as a gap rather than solved by bending a picker into an agenda.
 *
 *  THE FOUR EVENT HUES ARE GONE. The artifact coloured chips blue / green / purple /
 *  amber by kind. Four chip families on one surface is exactly the "two colours fighting
 *  over the screen" rejection, so the KIND is carried by a glyph and the legend names
 *  them. */
export const AgendaCalendar = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[{ label: "Agenda", href: "#/agenda/calendar" }, { label: "Calendar" }]} />
    <PageHead
      title="Calendar"
      sub="Everything with a date — reviews, exam sessions, rushes, events and your own slots."
      aside={
        <>
          <Button variant="outline" size="sm">
            {CAL.month}
          </Button>
          <Button variant="filled" size="sm" asChild>
            <a href="#/review/availability">New slot</a>
          </Button>
        </>
      }
    />

    <Card variant="default" padding="lg">
      <Card.Content>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <Text key={d} size="xs" c="muted" className={`text-center ${TYPO.nav}`}>
                {d}
              </Text>
            ))}
            {Array.from({ length: 42 }, (_, i) => {
              const n = i - CAL.offset + 1
              if (n < 1 || n > CAL.days)
                return <div key={`blank-${i}`} className="min-h-20 rounded-md" />
              const events = CAL.events[n] ?? []
              return (
                <div
                  key={n}
                  className={`flex min-h-20 flex-col gap-1 rounded-md border p-2 ${
                    n === CAL.today ? "border-brand-500" : "border-white/10"
                  }`}
                >
                  <span className={`text-xs ${TYPO.mono("semibold")}`}>{n}</span>
                  {events.map((e) => {
                    const Icon = CAL_ICON[e.kind]
                    return (
                      <div key={e.label} className="flex items-start gap-1">
                        <Icon size={12} />
                        <Text size="xs" c="secondary" className="leading-tight">
                          {e.label}
                        </Text>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {CAL_LEGEND.map((l) => {
              const Icon = CAL_ICON[l.kind]
              return (
                <span key={l.kind} className="flex items-center gap-2">
                  <Icon size={14} />
                  <Text size="xs" c="secondary">
                    {l.label}
                  </Text>
                </span>
              )
            })}
          </div>
        </div>
      </Card.Content>
    </Card>
  </div>
)

/** Registrations — `P['agenda.registrations']`. One card per registration, because each
 *  one carries its own decision: unregister, manage elsewhere, or nothing at all. The
 *  rush leads — it is the only one with a deadline that closes. */
export const AgendaRegistrations = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb
      data={[{ label: "Agenda", href: "#/agenda/calendar" }, { label: "Registrations" }]}
    />
    <PageHead
      title="Registrations"
      sub="Everything you signed up for, and the deadlines that close it."
    />

    <Section title="Signed up" icon={CalendarDays}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {REGISTRATIONS.map((r) => (
          <Card key={r.name} variant={r.entry ? "gradient" : "default"} padding="lg">
            <Card.Content>
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <Title order={3} size="md" className={TYPO.title("semibold")}>
                      {r.name}
                    </Title>
                    <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                      {r.when}
                    </Text>
                  </div>
                  <Tag>{r.status}</Tag>
                </div>
                {r.body ? (
                  <Text size="sm" c="secondary">
                    {r.body}
                  </Text>
                ) : null}
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  {r.foot ? (
                    <Text size="xs" c="muted">
                      {r.foot}
                    </Text>
                  ) : null}
                  {r.action ? (
                    r.href ? (
                      <Button variant="outline" size="xs" className="ms-auto" asChild>
                        <a href={r.href}>{r.action}</a>
                      </Button>
                    ) : (
                      <Button variant="subtle" size="xs" className="ms-auto">
                        {r.action}
                      </Button>
                    )
                  ) : null}
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Cap>A rush group is announced one hour before kickoff — there is no rematch once started.</Cap>
  </div>
)
