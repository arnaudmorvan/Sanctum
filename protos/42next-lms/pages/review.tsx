import { Alert } from "@42/ui-react/alert"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  AVAILABILITY_STATS,
  GIVEN,
  RECEIVED,
  RECEIVED_STATS,
  REVIEW_FLAGS,
  REVIEW_RHYTHM,
  REVIEW_RULES,
  REVIEW_STATS,
  SLOTS,
  UPCOMING_REVIEWS,
} from "../data/lms"
import { Meter, PageHead, Section, StatGrid, Tag } from "./shell"

const CRUMB = { label: "Review", href: "#/review/overview" }

/** Review overview — `P['review.overview']`. The peer economy: what the learner puts in,
 *  what they take out, and the rules of the exchange.
 *
 *  2026-09-08 — flat surfaces everywhere, and the score / on-time / flag badges no longer
 *  carry green or red: the value and the word carry the verdict. */
export const ReviewOverview = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Overview" }]} />
    <PageHead title="Review" sub="Where you stand in the peer economy, and how a review is meant to run." />

    <StatGrid items={REVIEW_STATS} cols={6} />

    <Section title="Rhythm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {REVIEW_RHYTHM.map((r) => (
          <Card key={r.label} variant="outline" padding="md">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <Meter label={r.label} value={r.value} pct={r.pct} />
                <Text size="sm" c="secondary">{r.body}</Text>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Alert
      type="info"
      title="14 peers are waiting for a slot on projects you've validated"
      description="Opening a slot earns you a review point and clears the queue faster."
    />

    <div className="flex flex-wrap gap-3">
      <Button variant="filled" asChild>
        <a href="#/review/availability">Open a slot</a>
      </Button>
      <Button variant="outline" asChild>
        <a href="#/review/given">Reviews I owe</a>
      </Button>
    </div>

    <Section title="How a review runs">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {REVIEW_RULES.map((r) => (
          <Card key={r.title} variant="outline" padding="md">
            <Card.Content>
              <div className="flex flex-col gap-2">
                <Title order={3} size="sm" className={TYPO.title("semibold")}>{r.title}</Title>
                <Text size="sm" c="secondary">{r.body}</Text>
              </div>
            </Card.Content>
          </Card>
        ))}
        <Card variant="outline" padding="md">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Title order={3} size="sm" className={TYPO.title("semibold")}>Flags before you validate</Title>
              <div className="flex flex-wrap gap-2">
                {REVIEW_FLAGS.map((f) => (
                  <Tag key={f.label} color={f.color}>{f.label}</Tag>
                ))}
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </Section>
  </div>
)

/** Reviews received — `P['review.received']`. */
export const ReviewReceived = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Received" }]} />
    <PageHead title="Reviews received" sub="Everything peers have evaluated on your attempts, and what is still open." />

    <Card variant="outline" padding="md">
      <Card.Content>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Title order={2} size="sm" className={TYPO.title("semibold")}>get_next_line — 1 review missing</Title>
              <Text size="xs" c="secondary">2 of 3 done · provisional 108</Text>
            </div>
            <Tag color="orange">Slot needed</Tag>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="filled" size="sm" asChild>
              <a href="#/review/availability">Find a reviewer</a>
            </Button>
            <Button variant="subtle" size="sm" asChild>
              <a href="#/activities/minishell">Open activity</a>
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>

    <StatGrid items={RECEIVED_STATS} />

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
            <Table.Row key={`${r.date}-${r.peer}-${r.activity}`}>
              <Table.Cell>{r.date}</Table.Cell>
              <Table.Cell>
                <a href={`#/profile/${r.peer}`} className={TYPO.mono()}>{r.peer}</a>
              </Table.Cell>
              <Table.Cell>{r.activity}</Table.Cell>
              <Table.Cell><Tag color={r.scoreColor}>{r.score}</Tag></Table.Cell>
              <Table.Cell><Tag color={r.flagColor}>{r.flag}</Tag></Table.Cell>
              <Table.Cell><Tag color={r.feedbackColor}>{r.feedback}</Tag></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  </div>
)

/** Reviews given — `P['review.given']`. Two owed: the page opens on the debt. */
export const ReviewGiven = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Given" }]} />
    <PageHead
      title="Reviews given"
      sub="Two owed. Everything you have evaluated for peers, past and upcoming."
      aside={
        <Button variant="filled" size="sm" asChild>
          <a href="#/review/availability">Open a slot</a>
        </Button>
      }
    />

    <Section title="Upcoming" right={<Text size="sm" c="secondary">2 owed</Text>}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {UPCOMING_REVIEWS.map((u) => (
          <Card key={u.title} variant="outline" padding="md">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <Title order={3} size="sm" className={TYPO.title("semibold")}>{u.title}</Title>
                    <Text size="xs" c="secondary">{u.sub}</Text>
                  </div>
                  <Tag color={u.color}>{u.badge}</Tag>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant={u.urgent ? "filled" : "outline"} size="sm">
                    {u.urgent ? "Start review" : "Opens 15 min before"}
                  </Button>
                  <Button variant="subtle" size="sm">Cancel / reschedule</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Section title="History" right={<Text size="sm" c="muted">61 given · 94% on time</Text>}>
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
                <Table.Cell>{g.date}</Table.Cell>
                <Table.Cell>
                  <a href={`#/profile/${g.peer}`} className={TYPO.mono()}>{g.peer}</a>
                </Table.Cell>
                <Table.Cell>{g.activity}</Table.Cell>
                <Table.Cell><Tag color={g.scoreColor}>{g.score}</Tag></Table.Cell>
                <Table.Cell><Tag color={g.onTimeColor}>{g.onTime}</Tag></Table.Cell>
                <Table.Cell><Tag>Given</Tag></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>
  </div>
)

/** My availability — `P['review.availability']`. The prototype branched on the program's
 *  booking mode; the Common Core is a slot-booking program, so that is the branch shown,
 *  and the alert states the rule rather than leaving it implicit. */
export const ReviewAvailability = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "My availability" }]} />
    <PageHead
      title="Manage my availability"
      sub="Slots you offer as a reviewer, and slots you take as a reviewee."
      aside={<Button variant="filled" size="sm">+ New slot</Button>}
    />

    <StatGrid items={AVAILABILITY_STATS} />

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
              <Table.Cell>{s.when}</Table.Cell>
              <Table.Cell>{s.duration}</Table.Cell>
              <Table.Cell>{s.scope}</Table.Cell>
              <Table.Cell><Tag color={s.color}>{s.status}</Tag></Table.Cell>
              <Table.Cell>
                <Button variant="subtle" size="xs">{s.action}</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>

    <Alert
      type="info"
      title="Booking mode: slot booking"
      description="On this program, reviewee and reviewer register on calendar slots independently. Selection and discovery programs use instant matching instead."
    />
  </div>
)
