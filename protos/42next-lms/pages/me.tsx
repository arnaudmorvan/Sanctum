import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { ATTENDANCE, PAPERWORK } from "../data/lms"
import { PageHead, Tag } from "./shell"

const CRUMB = { label: "My profile", href: "#/me/profile" }

/** Attendance — `P['me.attendance']`. The prototype derived every average from the same
 *  365 days its graphs drew, and counted only days actually on campus for the daily
 *  average: dividing by 365 would average over days nobody was expected in. The figures
 *  are ported as computed. */
export const Attendance = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Attendance" }]} />
    <PageHead title="Attendance" />

    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {ATTENDANCE.figures.map((f) => (
        <Card key={f.k} variant="light" padding="sm">
          <Card.Content>
            <div className="flex flex-col gap-1">
              <span className={`text-xl ${TYPO.mono()}`}>{f.v}</span>
              <Text size="xs" c="secondary">{f.k}</Text>
              <Text size="xs" c="muted">{f.sub}</Text>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card variant="default" padding="md">
        <Card.Content>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>Today</Title>
                <Text size="xs" c="secondary">{ATTENDANCE.today.range}</Text>
              </div>
              <span className={`text-lg ${TYPO.mono()}`}>{ATTENDANCE.today.hours}</span>
            </div>
            {/* The day bar: one segment per hour on campus, 09:00 → 19:00. */}
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded-sm ${i < 9 ? "bg-brand-500/60" : "bg-white/10"}`}
                />
              ))}
            </div>
            <Text size="xs" c="secondary">
              Current streak{" "}
              <b className={TYPO.mono()}>{ATTENDANCE.today.streak} days</b>
            </Text>
          </div>
        </Card.Content>
      </Card>

      <Card variant="default" padding="md">
        <Card.Content>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>This month</Title>
                <Text size="xs" c="secondary">
                  {ATTENDANCE.month.days} days on campus out of {ATTENDANCE.month.of}
                </Text>
              </div>
              <span className={`text-lg ${TYPO.mono()}`}>{ATTENDANCE.month.hours} h</span>
            </div>
            {/* One cell per day of the month; filled = a day on campus. */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: ATTENDANCE.month.of }, (_, i) => (
                <div
                  key={i}
                  className={`h-4 w-4 rounded-sm ${i % 7 !== 5 && i % 7 !== 6 ? "bg-green-500/60" : "bg-white/10"}`}
                />
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  </div>
)

/** Paperwork — `P['me.paperwork']`. Two directions in one table, which is the point:
 *  documents the learner owes the campus, and documents the campus owes them. */
export const Paperwork = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Paperwork" }]} />
    <PageHead title="Paperwork" sub="Documents you owe the campus, and documents it owes you." />

    <Table>
      <Table.Content>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Document</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Deadline</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {PAPERWORK.map((p) => (
            <Table.Row key={p.doc}>
              <Table.Cell>{p.doc}</Table.Cell>
              <Table.Cell>
                <Text size="sm" c="secondary">{p.kind}</Text>
              </Table.Cell>
              <Table.Cell>{p.deadline}</Table.Cell>
              <Table.Cell><Tag color={p.color}>{p.status}</Tag></Table.Cell>
              <Table.Cell>
                <Button variant={p.kind === "You provide" ? "light" : "subtle"} size="xs">
                  {p.action}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  </div>
)
