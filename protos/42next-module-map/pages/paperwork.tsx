import { FileText, Upload } from "lucide-react"
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { BLOCKER, CAMPUS_PROVIDES, YOU_PROVIDE, type Doc } from "../data/paperwork"

/** One direction of the paperwork, one table. The kit's `Table` carries its own bordered
 *  shell, so nothing is drawn around it — `foundations-table` asks for exactly that shell
 *  and the component already applies it unconditionally. */
const DocTable = ({ title, note, rows }: { title: string; note: string; rows: Doc[] }) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <Title order={2} size="sm" className={TYPO.title("semibold")}>
        {title}
      </Title>
      <Text size="xs" c="muted">
        {note}
      </Text>
    </div>

    <Table>
      <Table.Content>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Document</Table.HeaderCell>
            <Table.HeaderCell>Cadence</Table.HeaderCell>
            <Table.HeaderCell>Deadline</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((d) => (
            <Table.Row key={d.name}>
              <Table.Cell>{d.name}</Table.Cell>
              <Table.Cell>
                <Text size="sm" c="secondary" span>
                  {d.kind}
                </Text>
              </Table.Cell>
              {/* A deadline measures: machine register, same as the counters on the maps. */}
              <Table.Cell>
                <span className={`text-sm ${TYPO.mono("medium")}`}>{d.deadline}</span>
              </Table.Cell>
              {/* Grey everywhere: the word carries the state. A late document does not get a
                  red badge — there is no manufactured urgency on a 42 screen, and the one
                  thing that actually blocks is already at the top of the page. */}
              <Table.Cell>
                <Badge variant="light" size="xs" color="gray">
                  {d.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button variant="subtle" size="xs" disabled={!d.enabled}>
                  {d.action}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  </section>
)

/** Paperwork.
 *
 *  Two columns, no side rail: the content is a table, and `foundations-layout` gives the
 *  width to the table rather than looking for something to fill a third column with.
 *
 *  The screen still has to OPEN. What makes it open is the first card: the single document
 *  that closes a door, and the door it closes — stated in the vocabulary of the graph, so
 *  the learner reads a form as a gate rather than as an errand. */
export const Paperwork = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-2">
      <Title order={1} size="2xl" className={TYPO.title()}>
        Paperwork
      </Title>
      <Text size="sm" c="secondary" className="max-w-3xl">
        What you owe the campus, and what the campus owes you. None of it judges your
        progression — but one of these files can keep a gate shut.
      </Text>
    </div>

    <Card variant="gradient" padding="lg">
      <Card.Content>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <ThemeIcon variant="light" color="pink" size="sm" radius="md">
                <FileText size={14} aria-hidden />
              </ThemeIcon>
              <span className={`text-xs ${TYPO.nav}`}>Keeping a gate shut</span>
            </div>
            <Title order={2} size="sm" className={TYPO.title("semibold")}>
              {BLOCKER.name}
            </Title>
            <Text size="xs" c="secondary" className="max-w-xl">
              {BLOCKER.why}
            </Text>
            <span className={`text-xs ${TYPO.mono("medium")}`}>{BLOCKER.meta}</span>
          </div>

          <Button variant="filled" size="sm" startSlot={<Upload size={14} />}>
            {BLOCKER.action}
          </Button>
        </div>
      </Card.Content>
    </Card>

    <DocTable
      title="You provide"
      note="Filed once, or renewed on a cadence. A replaced file keeps its previous versions."
      rows={YOU_PROVIDE}
    />

    <DocTable
      title="The campus provides"
      note="Issued for you. Downloading one never removes it from here."
      rows={CAMPUS_PROVIDES}
    />

    <Alert
      type="info"
      title="A missing document never erases what you validated"
      description="It can close a registration — an exam seat, an internship agreement — and it opens again the day the file lands. Nothing on the graph is lost in the meantime."
    />
  </div>
)
