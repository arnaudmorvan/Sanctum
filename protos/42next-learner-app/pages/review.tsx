import { Alert } from "@42/ui-react/alert"
import { Avatar } from "@42/ui-react/avatar"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { BookOpen, CalendarClock, ExternalLink, Gauge, Scale, Users } from "lucide-react"
import { TYPO } from "../../../src/typo"
import {
  AVAILABILITY_STATS,
  BOOKING_MODE,
  GIVEN,
  GIVEN_UPCOMING,
  HOW_IT_RUNS,
  PRINCIPLES,
  RECEIVED,
  RECEIVED_STATS,
  RESOURCES,
  REVIEW_STATS,
  RHYTHM,
  SLOTS,
} from "../data/review"
import { Cap, Meter, PageHead, Readout, Section, Tag } from "./shell"

const CRUMB = { label: "Review", href: "#/review/overview" }

/** A readings block: the artifact laid six `.stat` tiles side by side. Six cards for six
 *  numbers quadruples the chrome and states nothing more — one card, rows inside. */
const Readouts = ({ items }: { items: { k: string; v: string }[] }) => (
  <Card variant="default" padding="lg">
    <Card.Content>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {items.map((s) => (
          <Readout key={s.k} v={s.v} k={s.k} />
        ))}
      </div>
    </Card.Content>
  </Card>
)

/** Review overview — `P['review.overview']`.
 *
 *  The artifact's own framing: where you stand in the peer economy, and how a review is
 *  meant to run. The screen OPENS on the queue — fourteen peers waiting on projects the
 *  learner has already validated — because that is the one thing to attack here; the
 *  numbers above it only say where they stand. */
export const ReviewOverview = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Overview" }]} />
    <PageHead
      title="Review"
      sub="Where you stand in the peer economy, and how a review is meant to run."
    />

    {/* The one gradient card: it marks what to do, not what has happened. */}
    <Card variant="gradient" padding="lg">
      <Card.Content>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Title order={2} size="lg" className={TYPO.title("bold")}>
              <span className={TYPO.mono("bold")}>14</span> peers are waiting for a slot on
              projects you have validated
            </Title>
            <Text size="sm" c="secondary">
              Opening a slot earns you a review point and clears the queue faster.
            </Text>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="filled" size="sm" asChild>
              <a href="#/review/availability">Open a slot</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#/review/given">Reviews I owe</a>
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>

    <Section title="Where you stand" icon={Gauge}>
      <Readouts items={REVIEW_STATS} />
    </Section>

    <Section title="Rhythm" icon={CalendarClock}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {RHYTHM.map((r) => (
          <Card key={r.label} variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <Meter label={r.label} value={r.value} pct={r.pct} />
                <Text size="sm" c="secondary">
                  {r.body}
                </Text>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Section title="How a review runs" icon={BookOpen}>
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {HOW_IT_RUNS.map((h) => (
              <div key={h.t} className="flex flex-col gap-1">
                <Text size="md" className={TYPO.title("semibold")}>
                  {h.t}
                </Text>
                <Text size="sm" c="secondary">
                  {h.b}
                </Text>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </Section>

    <Section title="Principles" icon={Scale}>
      <Card variant="light" padding="lg">
        <Card.Content>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="flex flex-col gap-1">
                <Text size="sm" className={TYPO.title("bold")}>
                  {p.t}
                </Text>
                <Text size="xs" c="secondary">
                  {p.b}
                </Text>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </Section>

    <Section title="Resources" icon={ExternalLink}>
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-4">
            {RESOURCES.map((r) => (
              <div key={r.t} className="flex items-center gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Text size="sm" className={TYPO.title("semibold")}>
                    {r.t}
                  </Text>
                  <Text size="xs" c="muted">
                    {r.b}
                  </Text>
                </div>
                {/* the label is written: an icon alone would not say where it goes */}
                <Button variant="subtle" size="xs" endSlot={<ExternalLink size={14} />}>
                  Open
                </Button>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </Section>
  </div>
)

/** Reviews received — `P['review.received']`. The attempt still short of a review leads:
 *  it is the only row on the screen where the learner is blocked on someone else. */
export const ReviewReceived = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Received" }]} />
    <PageHead
      title="Reviews received"
      sub="Everything peers have evaluated on your attempts, and what is still open."
    />

    <Card variant="gradient" padding="lg">
      <Card.Content>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Title order={2} size="lg" className={TYPO.title("bold")}>
              get_next_line — 1 review missing
            </Title>
            <Text size="sm" c="secondary">
              <span className={TYPO.mono("semibold")}>2 of 3</span> done · provisional{" "}
              <span className={TYPO.mono("semibold")}>108</span>
            </Text>
          </div>
          <Tag color="pink">Slot needed</Tag>
          <Button variant="filled" size="sm" asChild>
            <a href="#/review/availability">Find a reviewer</a>
          </Button>
        </div>
      </Card.Content>
    </Card>

    <Readouts items={RECEIVED_STATS} />

    <Section title="History" icon={Users}>
      <Table>
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Reviewer</Table.HeaderCell>
              <Table.HeaderCell>Activity</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
              <Table.HeaderCell>Flags</Table.HeaderCell>
              <Table.HeaderCell>My feedback</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {RECEIVED.map((r) => (
              <Table.Row key={`${r.date}-${r.peer}`}>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{r.date}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Avatar name={r.peer} color="initials" size="xs" />
                    <Text size="sm" className={TYPO.mono("medium")}>
                      {r.peer}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>{r.activity}</Table.Cell>
                <Table.Cell>
                  {/* a score measures — mono, and the pass/fail reading stays in the
                      number, not in a hue */}
                  <span className={TYPO.mono("semibold")}>{r.score}</span>
                </Table.Cell>
                <Table.Cell>
                  <Tag>{r.flag}</Tag>
                </Table.Cell>
                <Table.Cell>
                  <Tag color={r.feedback === "Given" ? "green" : "gray"}>{r.feedback}</Tag>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>
  </div>
)

/** Reviews given — `P['review.given']`. Two owed, and the one that can be STARTED is the
 *  gradient card. The other keeps its button, disabled, with the condition written: a
 *  disabled action says more than a hidden one. */
export const ReviewGiven = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Given" }]} />
    <PageHead
      title="Reviews given"
      sub="Two owed. Everything you have evaluated for peers, past and upcoming."
      aside={
        <Button variant="outline" size="sm" asChild>
          <a href="#/review/availability">Open a slot</a>
        </Button>
      }
    />

    <Section
      title="Upcoming"
      icon={CalendarClock}
      right={
        <Text size="xs" c="muted" className={TYPO.mono("semibold")}>
          2 owed
        </Text>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {GIVEN_UPCOMING.map((g) => (
          <Card key={g.peer} variant={g.open ? "gradient" : "default"} padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Avatar name={g.peer} color="initials" size="sm" />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Title order={3} size="md" className={TYPO.title("semibold")}>
                      {g.peer} — {g.activity}
                    </Title>
                    <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                      {g.when}
                    </Text>
                  </div>
                  <Tag color={g.open ? "pink" : "gray"}>{g.note}</Tag>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {g.open ? (
                    <Button variant="filled" size="sm">
                      Start review
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Opens 15 min before
                    </Button>
                  )}
                  <Button variant="subtle" size="sm">
                    Cancel / reschedule
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Section
      title="History"
      icon={Users}
      right={
        <Text size="xs" c="muted" className={TYPO.mono("medium")}>
          61 given · 94% on time
        </Text>
      }
    >
      <Table>
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Reviewee</Table.HeaderCell>
              <Table.HeaderCell>Activity</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
              <Table.HeaderCell>On time</Table.HeaderCell>
              <Table.HeaderCell>Feedback</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {GIVEN.map((g) => (
              <Table.Row key={`${g.date}-${g.peer}`}>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{g.date}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Avatar name={g.peer} color="initials" size="xs" />
                    <Text size="sm" className={TYPO.mono("medium")}>
                      {g.peer}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>{g.activity}</Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("semibold")}>{g.score}</span>
                </Table.Cell>
                <Table.Cell>
                  <Tag>{g.onTime}</Tag>
                </Table.Cell>
                <Table.Cell>
                  <Tag color="green">{g.feedback}</Tag>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>
  </div>
)

/** My availability — `P['review.availability']`. Slots offered as a reviewer, and the
 *  booking mode that governs them: the artifact states which of the two systems the
 *  current program runs on, because the screen means something different in each. */
export const ReviewAvailability = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "My availability" }]} />
    <PageHead
      title="Manage my availability"
      sub="Slots you offer as a reviewer, and slots you take as a reviewee."
      aside={
        <Button variant="filled" size="sm">
          New slot
        </Button>
      }
    />

    <Card variant="gradient" padding="lg">
      <Card.Content>
        <div className="flex flex-wrap items-center gap-6">
          {AVAILABILITY_STATS.map((s) => (
            <Readout key={s.k} v={s.v} k={s.k} />
          ))}
        </div>
      </Card.Content>
    </Card>

    <Section title="My slots" icon={CalendarClock}>
      <Table>
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>When</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
              <Table.HeaderCell>Scope</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell> </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {SLOTS.map((s) => (
              <Table.Row key={s.when}>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{s.when}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{s.dur}</span>
                </Table.Cell>
                <Table.Cell>{s.scope}</Table.Cell>
                <Table.Cell>
                  <Tag>{s.status}</Tag>
                </Table.Cell>
                <Table.Cell>
                  <Button variant="subtle" size="xs">
                    {s.action}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>

    <Alert type="info" variant="light" title={BOOKING_MODE.title} description={BOOKING_MODE.body} />

    <Cap>Review points are earned by opening slots and spent when you take one.</Cap>
  </div>
)
