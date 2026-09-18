import { Alert } from "@42/ui-react/alert"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import {
  Award,
  CalendarCheck,
  Check,
  CircleDot,
  FileText,
  Flag,
  History,
  Languages,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react"
import { useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  ACHIEVEMENTS,
  ACTIVITY_LOG,
  ATT_BY_MONTH,
  ATT_FIGURES,
  ATT_MONTH,
  ATT_TODAY,
  LANGUAGES,
  LOG_FAMILIES,
  ME,
  PAPERWORK,
  POWER,
  POWER_GOT,
  PROGRAMS_TIMELINE,
  SKILL_STATS,
  TECHNICAL,
  TECHNICAL_GOT,
  VALIDATED,
  XP_LOG,
} from "../data/me"
import { Cap, Meter, PageHead, Readout, Section, Tag } from "./shell"

const CRUMB = { label: "My profile", href: "#/me/profile" }

/** Profile — `P['me.profile']`, which the artifact rendered from ONE function for the
 *  learner and for any peer (`profilePage(login)`); the two routes share this component
 *  for the same reason.
 *
 *  Three columns: the person and their standing at the centre, the month and the links
 *  back to the canonical pages in the rail. The rail LEADS with the current milestone —
 *  the same reorder that was applied to `42next-profile` on 2026-09-08.
 *
 *  VISIBILITY V1 is stated on the screen: campus, location, attendance and activities are
 *  visible on every profile, and the per-block setting is V2. */
export const Profile = ({ login }: { login: string }) => {
  const me = login === ME.login
  const name = me ? ME.name : login

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-10">
        {!me ? <Breadcrumb data={[{ label: "Community", href: "#/community/friends" }, { label: login }]} /> : null}

        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={name} color="initials" size="xl" />
          <div className="flex min-w-0 flex-col gap-1">
            <Title order={1} size="3xl" className={TYPO.title("semibold")}>
              {login}
            </Title>
            <Text size="sm" c="secondary">
              {name} · {ME.campus} · {ME.seat}
            </Text>
          </div>
          <div className="ms-auto flex items-center gap-3">
            <Readout v={ME.level} k="Level" />
            <Readout v={`${ME.day}`} k="Days in program" />
          </div>
        </div>

        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Meter label={`Level 11 → 12`} value={`${ME.xp} XP`} pct={ME.xpPct} />
              <Text size="xs" c="muted">
                Level is recomputed from the program formula on every validation — Common
                Core, Piscine and Advanced Core do not share a curve.
              </Text>
            </div>
          </Card.Content>
        </Card>

        <Section title="Validated activities" icon={Trophy}>
          {/* one card, rows inside: a list of readings */}
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                {VALIDATED.map((v) => (
                  <div key={v.name} className="flex items-center gap-4">
                    <Check size={16} />
                    <Text size="md" className={TYPO.title("semibold")}>
                      {v.name}
                    </Text>
                    <Text size="xs" c="muted" className={`ms-auto ${TYPO.mono("medium")}`}>
                      {v.when}
                    </Text>
                    <span className={`text-sm ${TYPO.mono("semibold")}`}>{v.score}</span>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section title="Programs" icon={Flag}>
          {/* `Timeline` is the only component that states an ordered path carrying
             states — and it has no state axis, so the status rides in the content. */}
          <Card variant="default" padding="lg">
            <Card.Content>
              <Timeline size="md">
                {PROGRAMS_TIMELINE.map((p) => (
                  <Timeline.Item key={p.name}>
                    <Timeline.Label>
                      <span className={TYPO.mono("medium")}>{p.when}</span>
                    </Timeline.Label>
                    <Timeline.Content>
                      <div className="flex flex-wrap items-center gap-3">
                        <Text size="sm" className={TYPO.title("semibold")}>
                          {p.name}
                        </Text>
                        <Tag color={p.status === "Validated" ? "green" : "pink"}>{p.status}</Tag>
                      </div>
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card.Content>
          </Card>
        </Section>
      </div>

      <aside className="flex flex-col gap-10">
        {/* the rail leads with what to attack */}
        <Section title="Current milestone" icon={Flag}>
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex items-center gap-5">
                <CircularProgress variant="gradient" value={ME.milestonePct} size="lg">
                  <span className={`text-sm ${TYPO.mono("semibold")}`}>{ME.milestonePct}%</span>
                </CircularProgress>
                <div className="flex min-w-0 flex-col gap-1">
                  <Text size="md" className={TYPO.title("semibold")}>
                    {ME.milestone}
                  </Text>
                  <Button variant="outline" size="xs" asChild>
                    <a href="#/progression/milestones">See milestones</a>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section title="This month on campus" icon={CalendarCheck}>
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-3">
                  <Text size="sm" c="secondary">
                    {ATT_MONTH.days} days out of {ATT_MONTH.of}
                  </Text>
                  <span className={`text-lg ${TYPO.mono("semibold")}`}>{ATT_MONTH.hours} h</span>
                </div>
                {/* One cell per day. The void stays in the majority — an intensity grid
                   where colour is everywhere states nothing. */}
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: ATT_MONTH.of }, (_, i) => (
                    <div
                      key={i}
                      className={`h-4 w-4 rounded-sm ${
                        i % 7 !== 5 && i % 7 !== 6 ? "bg-brand-500/60" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <Button variant="subtle" size="xs" className="self-start" asChild>
                  <a href="#/me/attendance">Attendance</a>
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section title="Canonical pages" icon={Sparkles}>
          <Card variant="default" padding="md">
            <Card.Content>
              <div className="flex flex-col gap-2">
                {[
                  { l: "Skills", h: "#/me/skills" },
                  { l: "Level & XP", h: "#/me/xp" },
                  { l: "Achievements", h: "#/me/achievements" },
                  { l: "My recent activities", h: "#/me/activities" },
                  { l: "Paperwork", h: "#/me/paperwork" },
                ].map((x) => (
                  <Button key={x.l} variant="subtle" size="sm" className="justify-start" asChild>
                    <a href={x.h}>{x.l}</a>
                  </Button>
                ))}
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Cap>
          Visibility V1: campus, location, attendance and activities are visible on every
          profile. A per-block setting is planned.
        </Cap>
      </aside>
    </div>
  )
}

/** Skills — `P['me.skills']`. Skills are STATUSES, language mastery is a percentage: the
 *  product corpus contradicts itself on whether a skill is binary, and a gauge on a skill
 *  would settle that in silence. */
export const Skills = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Skills" }]} />
    <PageHead title="Skills" sub="Everything you have acquired, and what is one condition away." />

    <Card variant="default" padding="lg">
      <Card.Content>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {SKILL_STATS.map((s) => (
            <Readout key={s.k} v={s.v} k={s.k} />
          ))}
        </div>
      </Card.Content>
    </Card>

    <Section title="Technical" icon={Award}>
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-wrap gap-2">
            {TECHNICAL.map((s, i) => (
              <Badge
                key={s}
                variant={i < TECHNICAL_GOT ? "light" : "outline"}
                size="md"
                color={i < TECHNICAL_GOT ? "green" : "gray"}
              >
                {s}
              </Badge>
            ))}
          </div>
        </Card.Content>
      </Card>
    </Section>

    <Section
      title="Power skills"
      icon={Sparkles}
      right={
        <Text size="xs" c="muted">
          Acquired by meeting conditions, like technical skills
        </Text>
      }
    >
      <div className="flex flex-col gap-4">
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-wrap gap-2">
              {POWER.map((s, i) => (
                <Badge
                  key={s}
                  variant={i < POWER_GOT ? "light" : "outline"}
                  size="md"
                  color={i < POWER_GOT ? "green" : "gray"}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </Card.Content>
        </Card>
        {/* the one thing on this screen to act on */}
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Title order={3} size="md" className={TYPO.title("semibold")}>
                  Initiative — 1 condition remaining
                </Title>
                <Text size="sm" c="secondary">
                  Participate in 6 rushes. You have{" "}
                  <span className={TYPO.mono("semibold")}>5</span>. The next rush is Mon 24 Aug.
                </Text>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="#/agenda/registrations">See registration</a>
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </Section>

    <Section
      title="Language mastery"
      icon={Languages}
      right={
        <Text size="xs" c="muted">
          Continuous, unlike skills
        </Text>
      }
    >
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {LANGUAGES.map((l) => (
              <Meter key={l.name} label={l.name} value={`${l.pct}%`} pct={l.pct} />
            ))}
          </div>
        </Card.Content>
      </Card>
    </Section>
  </div>
)

/** Level & XP — `P['me.xp']`. */
export const Xp = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Level & XP" }]} />
    <PageHead
      title="Level & XP"
      sub="Level is recomputed from the program formula on every validation."
    />

    <Card variant="gradient" padding="lg">
      <Card.Content>
        <div className="flex flex-col gap-3">
          <Meter label="Level 11 → 12" value={`${ME.level} · ${ME.xp} XP`} pct={ME.xpPct} />
          <Text size="xs" c="muted">
            Formula differs per program — Common Core, Piscine and Advanced Core do not share
            a curve.
          </Text>
        </div>
      </Card.Content>
    </Card>

    <Section title="Where it came from" icon={Zap}>
      <Table>
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Source</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>XP</Table.HeaderCell>
              <Table.HeaderCell>Level after</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {XP_LOG.map((x) => (
              <Table.Row key={x.source}>
                <Table.Cell>{x.source}</Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{x.date}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("semibold")}>{x.xp}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("semibold")}>{x.level}</span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>
  </div>
)

/** Achievements — `P['me.achievements']`. The artifact gave each unlocked badge its own
 *  hue (violet, green, brand); six hues on one screen is the rejection, so the state is a
 *  label and the one in progress carries the only bar. */
export const Achievements = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Achievements" }]} />
    <PageHead
      title="Achievements"
      sub="Recognition for milestones and for behaviour worth encouraging."
    />

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {ACHIEVEMENTS.map((a) => (
        <Card
          key={a.t}
          variant={a.pct ? "gradient" : a.state === "Unlocked" ? "light" : "default"}
          padding="lg"
        >
          <Card.Content>
            <div className="flex h-full flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <Title order={3} size="md" className={TYPO.title("semibold")}>
                  {a.t}
                </Title>
                {a.state === "Unlocked" ? (
                  <Check size={18} />
                ) : a.pct ? (
                  <Tag color="pink">{a.state}</Tag>
                ) : (
                  <Tag>{a.state}</Tag>
                )}
              </div>
              <Text size="sm" c="secondary">
                {a.d}
              </Text>
              {a.pct ? <Meter label="" value="" pct={a.pct} /> : null}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>

    <Alert
      type="info"
      variant="light"
      title="Asking for help is rewarded too"
      description="Mid-reviews count toward recognition the same way giving reviews does."
    />
  </div>
)

/** Attendance — `P['me.attendance']`. Every average is derived from the same year the
 *  graphs draw, and the per-DAY average counts only days on campus: dividing by 365 would
 *  average over days nobody was expected in. */
export const Attendance = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Attendance" }]} />
    <PageHead title="Attendance" />

    <Card variant="default" padding="lg">
      <Card.Content>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {ATT_FIGURES.map((f) => (
            <div key={f.k} className="flex flex-col gap-1">
              <span className={`text-xl ${TYPO.mono("semibold")}`}>{f.v}</span>
              <Text size="xs" c="secondary">
                {f.k}
              </Text>
              <Text size="xs" c="muted">
                {f.sub}
              </Text>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Title order={2} size="md" className={TYPO.title("semibold")}>
                  Today
                </Title>
                <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                  {ATT_TODAY.range}
                </Text>
              </div>
              <span className={`text-lg ${TYPO.mono("semibold")}`}>{ATT_TODAY.hours}</span>
            </div>
            {/* one segment per hour on campus, 09:00 → 19:00 */}
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded-sm ${
                    i < ATT_TODAY.filled ? "bg-brand-500/60" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <Text size="xs" c="secondary">
              Current streak <b className={TYPO.mono("semibold")}>{ATT_TODAY.streak} days</b>
            </Text>
          </div>
        </Card.Content>
      </Card>

      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Title order={2} size="md" className={TYPO.title("semibold")}>
                  This month
                </Title>
                <Text size="xs" c="muted">
                  {ATT_MONTH.days} days on campus out of {ATT_MONTH.of}
                </Text>
              </div>
              <span className={`text-lg ${TYPO.mono("semibold")}`}>{ATT_MONTH.hours} h</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: ATT_MONTH.of }, (_, i) => (
                <div
                  key={i}
                  className={`h-4 w-4 rounded-sm ${
                    i % 7 !== 5 && i % 7 !== 6 ? "bg-brand-500/60" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>

    <Section title="By month" icon={History} right={<Text size="xs" c="muted">Hours per month, last 12</Text>}>
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ATT_BY_MONTH.map((m) => (
              <Meter key={m.m} label={m.m} value={`${m.h} h`} pct={(m.h / 160) * 100} />
            ))}
          </div>
        </Card.Content>
      </Card>
    </Section>

    <Button variant="outline" size="sm" className="self-start" asChild>
      <a href="#/me/paperwork">Paperwork</a>
    </Button>
  </div>
)

/** My recent activities — `P['me.activities']`. The artifact filtered the log on two
 *  axes with multi-selects; here the family is a `SegmentGroup` (five options, all
 *  visible, exclusive choice) and the outcome stays on the row. */
export const Activities = () => {
  const [family, setFamily] = useState("All")
  const rows = ACTIVITY_LOG.filter((r) => family === "All" || r.family === family)

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[CRUMB, { label: "My recent activities" }]} />
      <PageHead
        title="My recent activities"
        sub="Everything that happened on your attempts, your reviews and your registrations."
        aside={
          <SegmentGroup
            size="sm"
            data={LOG_FAMILIES}
            value={family}
            onChange={(v) => setFamily(String(v))}
          />
        }
      />

      <Table>
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>When</Table.HeaderCell>
              <Table.HeaderCell>What</Table.HeaderCell>
              <Table.HeaderCell>Family</Table.HeaderCell>
              <Table.HeaderCell>Outcome</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((r) => (
              <Table.Row key={r.when}>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{r.when}</span>
                </Table.Cell>
                <Table.Cell>{r.what}</Table.Cell>
                <Table.Cell>
                  <Text size="sm" c="secondary">
                    {r.family}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Tag
                    color={
                      r.outcome === "Validated" || r.outcome === "Done"
                        ? "green"
                        : r.outcome === "Under evaluation" || r.outcome === "Feedback needed"
                          ? "pink"
                          : "gray"
                    }
                  >
                    {r.outcome}
                  </Tag>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </div>
  )
}

/** Paperwork — `P['me.paperwork']`. Two directions in one table, which is the point:
 *  documents the learner owes the campus, and documents the campus owes them. The one
 *  that is MISSING and dated leads, stated in the vocabulary of the path — otherwise the
 *  screen is the compliance dashboard the foundations reject at severity 1. */
export const Paperwork = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Paperwork" }]} />
    <PageHead title="Paperwork" sub="Documents you owe the campus, and documents it owes you." />

    <Card variant="gradient" padding="lg">
      <Card.Content>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Title order={2} size="lg" className={TYPO.title("bold")}>
              Civil liability insurance is missing
            </Title>
            <Text size="sm" c="secondary">
              It is due <span className={TYPO.mono("semibold")}>Sep 15</span> — without it the
              campus cannot confirm your enrolment for the year.
            </Text>
          </div>
          <Button variant="filled" size="sm">
            Upload
          </Button>
        </div>
      </Card.Content>
    </Card>

    <Section title="All documents" icon={FileText}>
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
                  <Text size="sm" c="secondary">
                    {p.kind}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <span className={TYPO.mono("medium")}>{p.deadline}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    {p.status === "Available" ? <Check size={14} /> : <CircleDot size={14} />}
                    <Tag color={p.status === "Available" ? "green" : "gray"}>{p.status}</Tag>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Button variant={p.owed ? "light" : "subtle"} size="xs">
                    {p.action}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </Section>
  </div>
)
