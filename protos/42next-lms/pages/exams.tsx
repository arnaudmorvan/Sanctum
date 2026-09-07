import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Tabs } from "@42/ui-react/tabs"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { EXAM_REGISTERED, EXAM_RESULTS } from "../data/lms"
import { PageHead, Tag } from "./shell"

/** Exams — `P['exams']`. A single page with three tabs, exactly as the prototype had it
 *  (it kept the active tab in a module-level `examTab` and re-rendered; `Tabs` from the
 *  kit holds that state itself).
 *
 *  A module has zero or one exam — that is the rule the subtitle states, and it is why
 *  this section is a page rather than a tree in the sidebar. */
export const Exams = () => (
  <div className="flex flex-col gap-10">
    <PageHead title="Exams" sub="Sessions, registrations and results. A module has zero or one exam." />

    <Tabs.Root defaultValue="eligible">
      <Tabs.List>
        <Tabs.Trigger value="eligible">
          Eligible
          <Badge variant="light" color="brand" size="xs" className="ms-2">1</Badge>
        </Tabs.Trigger>
        <Tabs.Trigger value="registered">
          Registered
          <Badge variant="light" color="brand" size="xs" className="ms-2">2</Badge>
        </Tabs.Trigger>
        <Tabs.Trigger value="results">Results</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="eligible">
        <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
          <Card variant="gradient" padding="md">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <Title order={2} size="sm" className={TYPO.title("semibold")}>Exam 03</Title>
                    <Text size="xs" c="secondary">Rank 03 · required to validate the module</Text>
                  </div>
                  <Tag color="brand">Eligible</Tag>
                </div>
                <Text size="sm" c="secondary">
                  3 sessions open this month. 32 seats each. Registration opens tomorrow 09:00.
                </Text>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="filled" size="sm">See sessions</Button>
                  <Text size="xs" c="muted">You may register to several sessions at once</Text>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card variant="default" padding="md">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <Title order={2} size="sm" className={TYPO.title("semibold")}>Exam 04</Title>
                    <Text size="xs" c="secondary">Rank 04</Text>
                  </div>
                  <Tag color="gray">Locked</Tag>
                </div>
                <Text size="sm" c="secondary">Unlocks when cub3d validates.</Text>
              </div>
            </Card.Content>
          </Card>
        </div>
      </Tabs.Content>

      <Tabs.Content value="registered">
        <div className="flex flex-col gap-6 pt-6">
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
                {EXAM_REGISTERED.map((e) => (
                  <Table.Row key={e.session}>
                    <Table.Cell>{e.exam}</Table.Cell>
                    <Table.Cell>{e.session}</Table.Cell>
                    <Table.Cell><span className={TYPO.mono()}>{e.seats}</span></Table.Cell>
                    <Table.Cell>{e.where}</Table.Cell>
                    <Table.Cell><Tag color={e.color}>{e.status}</Tag></Table.Cell>
                    <Table.Cell>
                      <Button variant="subtle" size="xs">{e.action}</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>

          <Alert
            type="info"
            title="You can hold a seat and a waitlist place at once"
            description="Registering for several sessions of the same exam is allowed — the first one you sit closes the others."
          />
        </div>
      </Tabs.Content>

      <Tabs.Content value="results">
        <div className="pt-6">
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
                    <Table.Cell>{r.date}</Table.Cell>
                    <Table.Cell><span className={TYPO.mono()}>{r.score}</span></Table.Cell>
                    <Table.Cell>{r.tier}</Table.Cell>
                    <Table.Cell><Tag color={r.color}>{r.outcome}</Tag></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
)
