import { Alert } from "@42/ui-react/alert"
import { Avatar } from "@42/ui-react/avatar"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Grid3x3, Megaphone, Rocket, ScrollText, Trophy, Users } from "lucide-react"
import { TYPO } from "../../../src/typo"
import { ANNOUNCEMENTS, CLUBS, CLUSTER, COALITION, FRIENDS_PAGE } from "../data/me"
import { Cap, PageHead, Readout, Section, Tag } from "./shell"

const CRUMB = { label: "Community", href: "#/community/coalition" }

/** Coalition — `P['community.coalition']`. The season standing, and what the learner
 *  contributed to it. The learner's own coalition is the row that is marked; a rank is a
 *  quantity, so it is mono. */
export const Coalition = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Coalition" }]} />
    <PageHead
      title={COALITION.name}
      sub="Your coalition, its standing, and what you contributed."
    />

    <Card variant="gradient" padding="lg">
      <Card.Content>
        <div className="flex flex-wrap items-center gap-8">
          {COALITION.stats.map((s) => (
            <Readout key={s.k} v={s.v} k={s.k} />
          ))}
        </div>
      </Card.Content>
    </Card>

    <Section title="Standings" icon={Trophy}>
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
            {COALITION.standings.map((c) => (
              <Table.Row key={c.name}>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Text size="sm" className={TYPO.title("semibold")}>
                      {c.name}
                    </Text>
                    {c.mine ? <Tag>Yours</Tag> : null}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("semibold")}>{c.points}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{c.members}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{c.trend}</span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>
  </div>
)

/** Friends — `P['community.friends']`. One card per peer, because each one opens a
 *  profile: a list of decisions, not a list of readings. */
export const Friends = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Friends" }]} />
    <PageHead title="Friends" sub="Peers you follow. Their availability is what makes them useful." />

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {FRIENDS_PAGE.map((f) => (
        <Card key={f.login} variant={f.now ? "gradient" : "default"} padding="lg">
          <Card.Content>
            <a href={`#/profile/${f.login}`} className="flex items-center gap-4">
              <Avatar name={f.name} color="initials" size="md" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Text size="md" className={TYPO.mono("semibold")}>
                  {f.login}
                </Text>
                <Text size="xs" c="muted">
                  {f.name} · level <span className={TYPO.mono("medium")}>{f.level}</span>
                </Text>
              </div>
              <Tag color={f.now ? "pink" : "gray"}>{f.status}</Tag>
            </a>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)

/** Clubs — `P['community.clubs']`. */
export const Clubs = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Clubs" }]} />
    <PageHead title="Clubs" sub="Campus-run interest groups." />

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {CLUBS.map((c) => (
        <Card key={c.name} variant="default" padding="lg">
          <Card.Content>
            <div className="flex h-full flex-col gap-2">
              <Title order={3} size="md" className={TYPO.title("semibold")}>
                {c.name}
              </Title>
              <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                {c.cadence}
              </Text>
              <div className="mt-auto flex items-center justify-between gap-3">
                <Text size="xs" c="secondary" className={TYPO.mono("medium")}>
                  {c.members}
                </Text>
                <Button variant="outline" size="xs">
                  Join
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  </div>
)

/** Announcements — `P['community.announcements']`. Staff speaking to the campus: the
 *  `Alert` is the component for it, and the one maintenance notice is the only warning. */
export const Announcements = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Announcements" }]} />
    <PageHead title="Campus announcements" sub="From your campus staff." />

    <Section title="Latest" icon={Megaphone}>
      <div className="flex flex-col gap-4">
        {ANNOUNCEMENTS.map((a) => (
          <Alert
            key={a.title}
            type={a.kind}
            variant="light"
            title={a.title}
            description={`${a.body} — ${a.when}`}
          />
        ))}
      </div>
    </Section>
  </div>
)

/** Changelog — `P['community.changelog']`. The artifact shipped this page EMPTY, with its
 *  own empty state, and that is ported as it stands: an invented release history would be
 *  the one thing on this flow that claims something about the platform that is not true. */
export const Changelog = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Changelog" }]} />
    <PageHead title="Changelog" sub="What shipped on the platform, newest first." />

    <Card variant="default" padding="lg">
      <Card.Content>
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <ScrollText size={28} />
          <Title order={2} size="md" className={TYPO.title("semibold")}>
            Nothing here yet
          </Title>
          <Text size="sm" c="secondary" className="max-w-md">
            Release notes will appear here as they are published.
          </Text>
        </div>
      </Card.Content>
    </Card>
  </div>
)

/** Cluster map — `P['community.cluster']`.
 *
 *  ⚠️ HAND-COMPOSED, and declared: the kit has no seat-map component, and a 120-cell
 *  occupancy grid is layout, not a component to invent. Four states, four theme surfaces,
 *  and the legend names each one — the seat colour is the only thing that can carry
 *  "who is where", so it is the stated exception to "meaning lives in the label". */
export const ClusterMap = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Cluster map" }]} />
    <PageHead
      title={`Cluster map — ${CLUSTER.room}`}
      sub="Who is here, and where."
      aside={
        <Button variant="outline" size="sm">
          {CLUSTER.room}
        </Button>
      }
    />

    <Section title="Occupancy" icon={Grid3x3}>
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-10 gap-2 sm:grid-cols-[repeat(20,minmax(0,1fr))]">
              {Array.from({ length: CLUSTER.seats }, (_, i) => {
                const cls =
                  i === CLUSTER.mine
                    ? "bg-white"
                    : CLUSTER.friends.includes(i)
                      ? "bg-green-500/70"
                      : (i * 7) % 3 === 0
                        ? "bg-brand-500/60"
                        : "bg-white/10"
                return <div key={i} className={`aspect-square rounded-sm ${cls}`} />
              })}
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {[
                { c: "bg-white", l: "You · seat 42" },
                { c: "bg-green-500/70", l: "Friends" },
                { c: "bg-brand-500/60", l: "Occupied" },
                { c: "bg-white/10", l: "Free" },
              ].map((x) => (
                <span key={x.l} className="flex items-center gap-2">
                  <i className={`h-2.5 w-2.5 rounded-sm ${x.c}`} />
                  <Text size="xs" c="secondary">
                    {x.l}
                  </Text>
                </span>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>
    </Section>

    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" asChild>
        <a href="#/community/friends">
          <Users size={16} /> Friends
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href="#/community/coalition">
          <Rocket size={16} /> Coalition
        </a>
      </Button>
    </div>

    <Cap>Seat occupancy is a snapshot — it does not refresh on its own in this prototype.</Cap>
  </div>
)
