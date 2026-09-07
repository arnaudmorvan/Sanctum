import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Card } from "@42/ui-react/card"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  CURRICULUM,
  ENGAGEMENT,
  MILESTONE_PROJECTS,
  SCENARIOS,
  SIM_SLIDERS,
  TONE_COLOR,
  VARIANCE,
  YAMS,
} from "../data/lms"
import { Meter, PageHead, Section, Tag } from "./shell"

const CRUMB = { label: "My progression", href: "#/progression/yams" }

/** YAMS dashboard — `P['progression.yams']`.
 *
 *  YAMS is the pace indicator: it compares where the learner stands against the 42
 *  reference pace and names the gap (lead / expected / lag). The screen answers three
 *  questions in the prototype's own order: where am I now, what do I have to do, and
 *  what am I putting in. */
export const Yams = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Dashboard" }]} />
    <PageHead title="Your progress at a glance" />

    <div className="flex flex-wrap items-center gap-3">
      <Text size="xs" c="muted">Last updated at</Text>
      <Text size="xs" c="secondary">{YAMS.updatedAt}</Text>
      <span className="h-1 w-1 rounded-full bg-white/25" />
      <Text size="xs" c="muted">{YAMS.cadence}</Text>
    </div>

    {/* The prototype carried a switch to preview each variance quality. It is kept
        because it is the vocabulary of YAMS — seven qualities, not a red/green pair. */}
    <div className="flex flex-col gap-2">
      <Text size="xs" c="muted">Preview variance quality</Text>
      <SegmentGroup size="sm" data={VARIANCE} defaultValue="Lag (blue)" />
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card variant="light" color="brand" padding="md">
        <Card.Content>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Title order={2} size="lg" className={TYPO.title()}>{YAMS.status}</Title>
              <Badge variant="light" color="brand" size="sm" className="ms-auto">In progress</Badge>
            </div>
            <Text size="sm" c="secondary">{YAMS.milestone}</Text>
            <Text size="sm">{YAMS.statusBody}</Text>
            <Meter label="Milestone completion" value={`${YAMS.milestonePct}%`} pct={YAMS.milestonePct} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Text size="xs" c="muted">Elapsed time</Text>
                <span className={`text-lg ${TYPO.mono()}`}>{YAMS.elapsed}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Text size="xs" c="muted">Estimated duration</Text>
                <span className={`text-lg ${TYPO.mono()}`}>{YAMS.estimated}</span>
              </div>
            </div>
            <Text size="xs" c="muted">{YAMS.reference}</Text>
          </div>
        </Card.Content>
      </Card>

      <Card variant="default" padding="md">
        <Card.Content>
          <div className="flex h-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Text size="xs" c="muted">Projected program end</Text>
              <Text size="xs" c="muted">at the current pace</Text>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className={`text-2xl ${TYPO.mono()}`}>{YAMS.projectedEnd}</span>
                <Text size="xs" c="secondary">{YAMS.projectedNote}</Text>
              </div>
              <div className="ms-auto flex flex-col items-center gap-2">
                <CircularProgress variant="gradient" value={YAMS.commonCorePct} size="lg" />
                <Text size="xs" c="muted">Common Core</Text>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>

    <Section title="To validate the current milestone">
      <Table>
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Project</Table.HeaderCell>
              <Table.HeaderCell>Skills covered</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {MILESTONE_PROJECTS.map((p) => (
              <Table.Row key={p.name}>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>
                  <Text size="sm" c="secondary">{p.skills}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Tag color={p.tone}>{p.status}</Tag>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>

    <Section title="Your engagement & presence">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card variant="default" padding="md">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Title order={3} size="sm" className={TYPO.title("semibold")}>Attendance</Title>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl ${TYPO.mono()}`}>{ENGAGEMENT.attendance.avg}</span>
                <Text size="xs" c="muted">h {ENGAGEMENT.attendance.caption}</Text>
              </div>
              <div className="flex items-end gap-2">
                {ENGAGEMENT.attendance.weeks.map((h, i) => (
                  <div key={`${h}-${i}`} className="flex flex-1 flex-col items-center gap-1">
                    <div className="w-full rounded-sm bg-brand-500/60" style={{ height: `${h * 2}px` }} />
                    <Text size="xs" c="muted">{h}h</Text>
                  </div>
                ))}
              </div>
              <Text size="xs" c="muted">{ENGAGEMENT.attendance.note}</Text>
              {/* The prototype says this out loud rather than hiding the inconsistency:
                  two attendance figures exist and they disagree. */}
              <Alert type="warning" description={ENGAGEMENT.attendance.disclaimer} />
              <Text size="xs" c="muted">{ENGAGEMENT.attendance.updated}</Text>
            </div>
          </Card.Content>
        </Card>

        <Card variant="default" padding="md">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Title order={3} size="sm" className={TYPO.title("semibold")}>Peer reviews this week</Title>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl ${TYPO.mono()}`}>{ENGAGEMENT.reviews.done}</span>
                <Text size="xs" c="muted">/ {ENGAGEMENT.reviews.target}</Text>
              </div>
              <Meter
                label="This week"
                value={`${ENGAGEMENT.reviews.done} / ${ENGAGEMENT.reviews.target}`}
                pct={(ENGAGEMENT.reviews.done / ENGAGEMENT.reviews.target) * 100}
                color="bg-orange-500"
              />
              <Text size="xs" c="muted">{ENGAGEMENT.reviews.note}</Text>
              <Alert type="info" description={ENGAGEMENT.reviews.disclaimer} />
            </div>
          </Card.Content>
        </Card>
      </div>
    </Section>
  </div>
)

/** Milestones — `P['progression.milestones']`. The prototype drew the Common Core as an
 *  absolutely-positioned CSS grid of modules chaining their projects. Here the same
 *  content is a column of modules, each chaining its projects: the dependency reads left
 *  to right, and it survives a narrow window, which the grid did not. */
export const Milestones = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Milestones" }]} />
    <PageHead title="Milestones" sub="Common Core curriculum — the modules, their hour budget, and the projects they chain." />

    <div className="flex flex-col gap-4">
      {CURRICULUM.map((m) => (
        <Card key={m.module} variant="default" padding="md">
          <Card.Content>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>{m.module}</Title>
                <span className={`text-sm ${TYPO.mono()}`}>{m.hours}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {m.projects.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    {i > 0 ? <span className="text-gray-dark-400">→</span> : null}
                    <Card variant="light" padding="xs">
                      <Card.Content>
                        <div className="flex flex-col items-start gap-0.5">
                          <Text size="sm">{p.name}</Text>
                          <span className={`text-xs ${TYPO.mono()}`}>{p.hours}</span>
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)

/** YAMS simulator — `P['progression.simulator']`. Nothing here is committed, and the
 *  prototype said so in its own footer; the sliders stay illustrative. */
export const Simulator = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "YAMS simulator" }]} />
    <PageHead title="YAMS simulator" sub="Change the rhythm, see where you land. Nothing here is committed." />

    <Section title="Scenarios">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SCENARIOS.map((s) => (
          <Card key={s.label} variant="light" color={TONE_COLOR[s.tone]} padding="md">
            <Card.Content>
              <div className="flex flex-col gap-2">
                <Text size="xs" c="muted" className="uppercase">{s.label}</Text>
                <Title order={3} size="sm" className={TYPO.title("semibold")}>{s.end}</Title>
                <Text size="xs" c="secondary">{s.body}</Text>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Section title="Adjust">
      <Card variant="default" padding="md">
        <Card.Content>
          <div className="flex flex-col gap-5">
            {SIM_SLIDERS.map((s) => (
              <Meter key={s.label} label={s.label} value={s.value} pct={s.pct} />
            ))}
            <Text size="xs" c="muted">Sliders are illustrative in this prototype.</Text>
          </div>
        </Card.Content>
      </Card>
    </Section>
  </div>
)
