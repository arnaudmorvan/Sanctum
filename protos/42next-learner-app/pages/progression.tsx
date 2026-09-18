import { Alert } from "@42/ui-react/alert"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Card } from "@42/ui-react/card"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Activity, CalendarRange, Crosshair, ListChecks, SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  ATT_LABELS,
  CURRICULUM,
  MILESTONE_PROJECTS,
  RULER,
  SCENARIOS,
  SIM_SLIDERS,
  VARIANCES,
  YAMS,
} from "../data/progression"
import { Cap, Meter, PageHead, Readout, Section, Tag } from "./shell"

const CRUMB = { label: "My progression", href: "#/progression/yams" }

/** YAMS dashboard — `P['progression.yams']`.
 *
 *  The screen answers three questions in the artifact's own order: where am I now, what
 *  do I have to do to close the current milestone, and what am I putting in. The preview
 *  switch is kept and made to WORK: picking a quality re-reads the whole screen — status,
 *  milestone completion, projected end, Common Core ring, attendance and review count all
 *  come from the same row. In the artifact that was seven DOM patches in `applyVQ()`; here
 *  it is one piece of state, which is the point of the port.
 *
 *  The status card is the screen's one `gradient` card: it is what the learner is here to
 *  read, and on "Significant Lag" it is also what they have to act on. */
export const Yams = () => {
  const [label, setLabel] = useState("Lag")
  const v = VARIANCES.find((x) => x.label === label) ?? VARIANCES[3]
  const attAvg = Math.round(v.attWeeks.reduce((a, b) => a + b, 0) / v.attWeeks.length)

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[CRUMB, { label: "Dashboard" }]} />
      <PageHead title="Your progress at a glance" />

      <div className="flex flex-wrap items-center gap-3">
        <Text size="xs" c="muted">
          Last updated at
        </Text>
        <Text size="xs" c="secondary" className={TYPO.mono("medium")}>
          {YAMS.updatedAt}
        </Text>
        <span className="h-1 w-1 rounded-full bg-white/25" />
        <Text size="xs" c="muted">
          {YAMS.cadence}
        </Text>
      </div>

      {/* A prototype control, and it says so: it previews a quality the learner is not in. */}
      <div className="flex flex-col gap-2">
        <Text size="xs" c="muted">
          Preview variance quality — prototype control
        </Text>
        <SegmentGroup
          size="sm"
          data={VARIANCES.map((x) => x.label)}
          value={label}
          onChange={(next) => setLabel(String(next))}
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex h-full flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Title order={2} size="xl" className={TYPO.title("bold")}>
                  {v.title}
                </Title>
                <Tag>In progress</Tag>
              </div>
              <Text size="sm" c="secondary">
                {YAMS.milestone}
              </Text>
              <Text size="sm">{v.body}</Text>
              {v.grace ? (
                <Alert
                  type="warning"
                  variant="light"
                  description={`${v.grace} before drop out`}
                />
              ) : null}
              <Meter label="Milestone completion" value={`${v.msPct}%`} pct={v.msPct} />
              <div className="grid grid-cols-2 gap-4">
                <Readout v={YAMS.elapsed} k="Elapsed time" />
                <Readout v={YAMS.estimated} k="Estimated duration" />
              </div>
              <Text size="xs" c="muted" className="mt-auto">
                {YAMS.reference}
              </Text>
            </div>
          </Card.Content>
        </Card>

        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex h-full flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Cap>Projected program end</Cap>
                <Text size="xs" c="muted">
                  at the current pace
                </Text>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex flex-col gap-1">
                  {/* a date measures: Kode Mono, like the counters */}
                  <span className={`text-2xl ${TYPO.mono("semibold")}`}>{v.projDate}</span>
                  <Text size="xs" c={v.atRisk ? "default" : "secondary"}>
                    {v.projSub}
                  </Text>
                </div>
                <div className="ms-auto flex flex-col items-center gap-2">
                  <CircularProgress variant="gradient" value={v.ccPct} size="lg">
                    <span className={`text-sm ${TYPO.mono("semibold")}`}>{v.ccPct}%</span>
                  </CircularProgress>
                  <Text size="xs" c="muted">
                    Common Core
                  </Text>
                </div>
              </div>
              {v.atRisk ? (
                <Alert
                  type="error"
                  variant="light"
                  description="Past the 24-month limit at this pace."
                />
              ) : null}
            </div>
          </Card.Content>
        </Card>
      </div>

      <Section title="To validate the current milestone" icon={ListChecks}>
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
                    <div className="flex flex-col gap-0.5">
                      <Text size="sm" c="secondary">
                        {p.skills}
                      </Text>
                      <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                        {p.count} skills
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {/* the one semantic exception on this screen, and it is terminal:
                        a validated project is green, everything else stays grey */}
                    <Tag color={p.done ? "green" : "gray"}>{p.status}</Tag>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      </Section>

      <Section title="Your engagement & presence" icon={Activity}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <Title order={3} size="md" className={TYPO.title("semibold")}>
                  Attendance
                </Title>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl ${TYPO.mono("semibold")}`}>{attAvg}</span>
                  <Text size="xs" c="muted">
                    h /week avg · last 4 weeks
                  </Text>
                </div>
                {/* The artifact drew four vertical bars. Rows read the same and are the
                    kit's own Progress, so they follow the theme instead of a hand height. */}
                <div className="flex flex-col gap-3">
                  {v.attWeeks.map((h, i) => (
                    <Meter
                      key={ATT_LABELS[i]}
                      label={ATT_LABELS[i]}
                      value={`${h} h`}
                      pct={(h / 40) * 100}
                    />
                  ))}
                </div>
                <Text size="xs" c="muted">
                  {YAMS.attendanceNote}
                </Text>
                {/* The artifact says the inconsistency out loud rather than hiding it. */}
                <Alert type="warning" variant="light" description={YAMS.attendanceDisclaimer} />
                <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                  {YAMS.attendanceUpdated}
                </Text>
              </div>
            </Card.Content>
          </Card>

          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <Title order={3} size="md" className={TYPO.title("semibold")}>
                  Peer reviews this week
                </Title>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl ${TYPO.mono("semibold")}`}>{v.reviews}</span>
                  <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                    / {v.reviewTarget}
                  </Text>
                </div>
                <Meter
                  label="This week"
                  value={`${v.reviews} / ${v.reviewTarget}`}
                  pct={(v.reviews / v.reviewTarget) * 100}
                />
                <Text size="xs" c="muted">
                  {YAMS.reviewTargetNote}
                </Text>
                <Alert type="info" variant="light" description={YAMS.reviewDisclaimer} />
              </div>
            </Card.Content>
          </Card>
        </div>
      </Section>
    </div>
  )
}

/** Milestones — `P['progression.milestones']`.
 *
 *  The artifact drew the Common Core as a 50-column CSS grid: a module spans the
 *  milestones it straddles, chains its projects left to right, and the ruler underneath
 *  cuts the same 50 columns into the eight milestones. That geometry IS the content — it
 *  is what says that Algorithmics and Systems & Networks Administration overlap — so it
 *  is ported as a grid and not flattened into a column of cards.
 *
 *  Its one interaction is ported too: clicking a milestone on the ruler lights the
 *  projects that count towards it. In the artifact that was a `data-ms` sweep over the
 *  DOM; here the project carries its milestone in the data and the card switches variant. */
export const Milestones = () => {
  const [ms, setMs] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[CRUMB, { label: "Milestones" }]} />
      <PageHead
        title="Milestones"
        sub="The Common Core curriculum: every module over the milestones it spans, with its hour budget and the projects it chains. Pick a milestone on the ruler to light what it waits on."
      />

      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Cap>Common Core</Cap>
              {ms ? (
                <button type="button" onClick={() => setMs(null)} className="cursor-pointer">
                  <Text size="xs" c="secondary">
                    Showing Milestone {ms} — clear
                  </Text>
                </button>
              ) : null}
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[1100px]">
                <div
                  className="grid items-stretch gap-3"
                  style={{ gridTemplateColumns: "repeat(50, minmax(0, 1fr))" }}
                >
                  {CURRICULUM.map((m) => (
                    <div
                      key={`${m.module}-${m.row}`}
                      style={{ gridRow: m.row, gridColumn: `${m.from} / ${m.to}` }}
                    >
                      <Card variant="light" padding="sm" className="h-full">
                        <Card.Content>
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <Text size="sm" className={TYPO.title("bold")}>
                                {m.module}
                              </Text>
                              <span className={`text-xs ${TYPO.mono("semibold")}`}>{m.hours}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {m.chain.map((step, i) => (
                                <div
                                  key={step.map((s) => s.name).join("+")}
                                  className="flex items-center gap-2"
                                >
                                  {i > 0 ? (
                                    <Text size="xs" c="muted">
                                      →
                                    </Text>
                                  ) : null}
                                  <div className="flex flex-col gap-1">
                                    {step.map((p) => (
                                      <Card
                                        key={p.name}
                                        variant={ms === p.ms ? "gradient" : "outline"}
                                        padding="xs"
                                      >
                                        <Card.Content>
                                          <div className="flex flex-col items-start gap-0.5">
                                            <Text size="xs">{p.name}</Text>
                                            <span className={`text-xs ${TYPO.mono("medium")}`}>
                                              {p.hours}
                                            </span>
                                          </div>
                                        </Card.Content>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card.Content>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* The ruler: the same 50 columns, cut into the eight milestones. */}
                <div
                  className="mt-6 grid gap-2"
                  style={{ gridTemplateColumns: "repeat(50, minmax(0, 1fr))" }}
                >
                  {RULER.map((r) => (
                    <button
                      key={r.n}
                      type="button"
                      onClick={() => setMs(ms === r.n ? null : r.n)}
                      style={{ gridColumn: `${r.from} / ${r.to}` }}
                      className="cursor-pointer text-left"
                    >
                      <Card variant={ms === r.n ? "light" : "default"} padding="xs">
                        <Card.Content>
                          <div className="flex flex-col gap-0.5">
                            <Text size="xs" className={TYPO.title("semibold")}>
                              Milestone {r.n}
                            </Text>
                            <span className={`text-xs ${TYPO.mono("medium")}`}>{r.weeks}</span>
                          </div>
                        </Card.Content>
                      </Card>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

/** YAMS simulator — `P['progression.simulator']`. Nothing here is committed, and the
 *  artifact said so in its own footer; the sliders stay illustrative. The three scenarios
 *  were three coloured cards (green / blue / amber) — a scenario is not a status, so the
 *  hue goes and the CURRENT rhythm is the one marked, because that is the reading that
 *  matters: the other two are what a change would cost. */
export const Simulator = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "YAMS simulator" }]} />
    <PageHead
      title="YAMS simulator"
      sub="Change the rhythm, see where you land. Nothing here is committed."
    />

    <Section title="Scenarios" icon={CalendarRange}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {SCENARIOS.map((s) => (
          <Card key={s.label} variant={s.current ? "gradient" : "default"} padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Cap>{s.label}</Cap>
                  {s.current ? <Tag>Now</Tag> : null}
                </div>
                <span className={`text-lg ${TYPO.mono("semibold")}`}>{s.end}</span>
                <Text size="sm" c="secondary">
                  {s.body}
                </Text>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Section title="Adjust" icon={SlidersHorizontal}>
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-5">
            {SIM_SLIDERS.map((s) => (
              <Meter key={s.label} label={s.label} value={s.value} pct={s.pct} />
            ))}
            <Text size="xs" c="muted">
              Sliders are illustrative in this prototype.
            </Text>
          </div>
        </Card.Content>
      </Card>
    </Section>
  </div>
)

/** Kept next to the three screens above: the artifact's own crosshair glyph headed
 *  "Your progress at a glance", and the section furniture takes a glyph per section. */
export const PROGRESSION_ICON = Crosshair
