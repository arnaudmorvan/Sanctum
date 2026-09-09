import { Alert } from "@42/ui-react/alert"
import { Avatar } from "@42/ui-react/avatar"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  ANNOUNCEMENTS,
  CLUBS,
  CLUSTER_FRIENDS,
  CLUSTER_ME,
  CLUSTER_SEATS,
  COALITION_STATS,
  FRIENDS,
  STANDINGS,
} from "../data/lms"
import { Legend, PageHead, Section, StatGrid, Tag } from "./shell"

const CRUMB = { label: "Community", href: "#/community/coalition" }

/** Coalition — `P['community.coalition']`. */
export const Coalition = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Coalition" }]} />
    <PageHead title="The Federation" sub="Your coalition, its standing, and what you contributed." />

    <StatGrid items={COALITION_STATS} />

    <Section title="Standings" num="01">
      <Table>
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Coalition</Table.HeaderCell>
              <Table.HeaderCell>Points</Table.HeaderCell>
              <Table.HeaderCell>Members</Table.HeaderCell>
              <Table.HeaderCell>Trend</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {STANDINGS.map((s) => (
              <Table.Row key={s.name}>
                <Table.Cell>
                  {/* The learner's own coalition is the one the page is about. */}
                  {s.name === "The Federation" ? <b>{s.name}</b> : s.name}
                </Table.Cell>
                <Table.Cell><span className={TYPO.mono()}>{s.points}</span></Table.Cell>
                <Table.Cell><span className={TYPO.mono()}>{s.members}</span></Table.Cell>
                <Table.Cell><Tag color={s.color}>{s.trend}</Tag></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>
  </div>
)

/** Friends — `P['community.friends']`. The login carries the identity, the badge carries
 *  the only thing that makes a friend useful right now. Each card opens their profile. */
export const Friends = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Friends" }]} />
    <PageHead title="Friends" sub="Peers you follow. Their availability is what makes them useful." />

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {FRIENDS.map((f) => (
        <a key={f.login} href={`#/profile/${f.login}`}>
          <Card variant="default" padding="sm">
            <Card.Content>
              <div className="flex items-center gap-3">
                <Avatar name={f.name} size="md" />
                <div className="min-w-0 flex-1">
                  <Text size="sm" className={TYPO.mono("semibold")}>{f.login}</Text>
                  <Text size="xs" c="muted">{f.name} · level {f.level}</Text>
                </div>
                <Tag color={f.color}>{f.status}</Tag>
              </div>
            </Card.Content>
          </Card>
        </a>
      ))}
    </div>
  </div>
)

/** Clubs — `P['community.clubs']`. */
export const Clubs = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Clubs" }]} />
    <PageHead title="Clubs" sub="Campus-run interest groups." />

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {CLUBS.map((c) => (
        <Card key={c.title} variant="default" padding="md">
          <Card.Content>
            <div className="flex flex-col gap-2">
              <Title order={2} size="sm" className={TYPO.title("semibold")}>{c.title}</Title>
              <Text size="xs" c="secondary">{c.cadence}</Text>
              <div className="flex items-center gap-3">
                <Text size="xs" c="muted">{c.members}</Text>
                <Button variant="light" size="xs" className="ms-auto">Join</Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)

/** Announcements — `P['community.announcements']`. From the campus staff; the type
 *  carries the urgency, which is why they are Alerts rather than cards. */
export const Announcements = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Announcements" }]} />
    <PageHead title="Campus announcements" sub="From your campus staff." />

    <div className="flex flex-col gap-4">
      {ANNOUNCEMENTS.map((a) => (
        <Alert
          key={a.title}
          type={a.type}
          title={a.title}
          description={a.body}
          action={<Text size="xs" c="muted">{a.when}</Text>}
        />
      ))}
    </div>
  </div>
)

/** Changelog — `P['community.changelog']`. Empty on purpose in the prototype: the shape
 *  of the area is shown rather than filled with invented release notes. */
export const Changelog = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Changelog" }]} />
    <PageHead title="Changelog" sub="What shipped on the platform, newest first." />

    <Card variant="outline" padding="xl">
      <Card.Content>
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Title order={2} size="sm" className={TYPO.title("semibold")}>Nothing here yet</Title>
          <Text size="sm" c="muted" className="max-w-[46ch]">
            Release notes will appear here as they are published.
          </Text>
        </div>
      </Card.Content>
    </Card>
  </div>
)

/** Cluster map — `P['community.cluster']`. 120 seats; seat 42 is mine, four are friends,
 *  and the rest follow the prototype's own `i * 7 % 3 === 0` occupancy rule. */
export const ClusterMap = () => (
  <div className="flex flex-col gap-8">
    <Breadcrumb data={[CRUMB, { label: "Cluster Map" }]} />
    <PageHead
      title="Cluster Map — Paris e1"
      sub="Who is here, and where."
      aside={<Button variant="light" size="sm">e1 ⌄</Button>}
    />

    <Card variant="default" padding="md">
      <Card.Content>
        <div className="grid grid-cols-12 gap-1.5 md:grid-cols-20">
          {Array.from({ length: CLUSTER_SEATS }, (_, i) => {
            const cls =
              i === CLUSTER_ME
                ? "bg-white"
                : CLUSTER_FRIENDS.includes(i)
                  ? "bg-green-500"
                  : (i * 7) % 3 === 0
                    ? "bg-brand-500/60"
                    : "bg-white/10"
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm ${cls}`}
                title={i === CLUSTER_ME ? "You · seat 42" : `Seat ${i + 1}`}
              />
            )
          })}
        </div>
      </Card.Content>
    </Card>

    <Legend
      items={[
        { label: "You · seat 42", className: "bg-white" },
        { label: "Friends", className: "bg-green-500" },
        { label: "Occupied", className: "bg-brand-500/60" },
        { label: "Free", className: "bg-white/10" },
      ]}
    />
  </div>
)
