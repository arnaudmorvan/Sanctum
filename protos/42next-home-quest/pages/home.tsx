import type { ReactNode } from "react"
import { Award, CalendarDays, ClipboardCheck, Flame, Grid2x2, Route } from "lucide-react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { ACHIEVEMENTS, AGENDA_NEXT, LEARNER, MILESTONES, NEXT_QUEST, QUESTS, REVIEWS, SKILLS, SKILLS_COUNT } from "../data/home"

/** DECISIONS CARRIED BY THIS SCREEN (foundations, 2026-09-17):
 *
 *  - ONE gradient card, and it is « Next quest » — the entry point of the path
 *    (review:components). The rail therefore leads with its next agenda item in a
 *    `default` card: foundations-layout asks the rail to lead with the next action,
 *    review:components allows one pink outline per screen, and the centre already
 *    holds it.
 *  - Badges are GREY (review:color): the meaning is in the label — Validated, In
 *    progress, Locked, Given, Received. Pink is not spent on a badge here, it is
 *    carried by the signature gradient on the progressions and by the current
 *    milestone's bullet: « pink means in progress ».
 *  - Cards hold everything. Reviews is a list of readings, so ONE card; active
 *    quests is a list of decisions, so one card per row (foundations-layout).
 *  - TYPO.*: the kit forces `font-mono` on Title and exposes no weight on Text. Lato
 *    carries every content title, Kode Mono only what counts or measures — counters,
 *    scores, XP, level, dates, durations. */

const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center gap-1.5 text-gray-dark-400">
      {icon}
      <Title order={2} size="md" className={TYPO.title()}>{title}</Title>
    </div>
    {children}
  </section>
)

export const Home = () => {
  const questPct = Math.round((NEXT_QUEST.validated / NEXT_QUEST.total) * 100)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <Title order={1} size="3xl" className={TYPO.title()}>Home</Title>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="light" color="gray">{LEARNER.program}</Badge>
          <Text size="sm" c="secondary">{LEARNER.milestone}</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          {/* THE entry point. The screen opens on what to attack next, not on a report. */}
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <Text size="xs" c="secondary" className={TYPO.title() + " uppercase"}>Next quest</Text>
                  {/* A countdown measures: Kode Mono. Stated calmly, no red dot. */}
                  <Text size="xs" c="muted" className={TYPO.mono("semibold")}>{NEXT_QUEST.closesIn}</Text>
                </div>
                <Title order={3} size="md" className={TYPO.title()}>{NEXT_QUEST.module}</Title>
                <Text size="sm" c="secondary">{NEXT_QUEST.activity} — {NEXT_QUEST.note}</Text>
                <div className="flex items-baseline justify-between gap-3">
                  <Text size="sm" c="muted" className={TYPO.title("medium")}>Activities validated</Text>
                  <Text size="sm" className={TYPO.mono()}>{NEXT_QUEST.validated} / {NEXT_QUEST.total}</Text>
                </div>
                <Progress variant="gradient" value={questPct} size="sm" />
                <div>
                  <Button size="sm" variant="filled" asChild>
                    <a href={`#/modules/${NEXT_QUEST.slug}`}>Open module</a>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Section title="My path" icon={<Flame size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                {/* Timeline is the only DS component that states an ordered path carrying
                    states. No state axis: the bullet carries it (color / variant). */}
                <Timeline size="md" lineVariant="solid">
                  {MILESTONES.map((m) => (
                    <Timeline.Item
                      key={m.name}
                      color={m.state === "current" ? "pink" : undefined}
                      variant={m.state === "locked" ? "outline" : undefined}
                    >
                      <Timeline.Label>
                        <span className={TYPO.mono("semibold")}>{m.stamp}</span>
                      </Timeline.Label>
                      <Timeline.Content>
                        <Timeline.Title className={`${TYPO.title()} text-base`}>{m.name}</Timeline.Title>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <Text size="xs" c="muted">{m.detail}</Text>
                            <div className="flex items-center gap-3">
                              <Text size="sm" className={TYPO.mono()}>{m.validated} / {m.required}</Text>
                              <Badge variant="light" color="gray">{m.status}</Badge>
                            </div>
                          </div>
                          {m.state === "current" ? (
                            <Progress variant="gradient" value={Math.round((m.validated / m.required) * 100)} size="sm" />
                          ) : null}
                        </div>
                      </Timeline.Content>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card.Content>
            </Card>
          </Section>

          {/* A list of DECISIONS: one card per row, because each row carries an action. */}
          <Section title="Active quests" icon={<Route size={16} />}>
            <div className="flex flex-col gap-4">
              {QUESTS.map((q) => (
                <Card key={q.slug} variant="default" padding="md">
                  <Card.Content>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Title order={3} size="sm" className={TYPO.title()}>{q.name}</Title>
                        <Text size="xs" c="muted">{q.detail}</Text>
                      </div>
                      <div className="flex items-center gap-3">
                        <Text size="sm" className={TYPO.mono()}>{q.pct}%</Text>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`#/modules/${q.slug}`}>{q.action}</a>
                        </Button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </Section>

          {/* A list of READINGS: one card, rows inside. No action per row. */}
          <Section title="Reviews" icon={<ClipboardCheck size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {REVIEWS.map((r) => (
                    <div key={r.label} className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Text size="sm" className={TYPO.title("medium")}>{r.label}</Text>
                        <Text size="xs" c="muted" className={TYPO.mono("regular")}>{r.when}</Text>
                      </div>
                      <Badge variant="light" color="gray">{r.kind}</Badge>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
          {/* The rail leads with what comes next — in a default card: the pink outline
              is spent on the centre's entry point. */}
          <Section title="Next in your agenda" icon={<CalendarDays size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-1">
                  <Text size="sm" className={TYPO.mono()}>{AGENDA_NEXT.stamp}</Text>
                  <Text size="sm" className={TYPO.title()}>{AGENDA_NEXT.label}</Text>
                  <Text size="xs" c="muted">{AGENDA_NEXT.note}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Card variant="default" padding="md">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {/* No photo deposited for this learner: the initials fallback is the
                      right render, not a missing asset. Noted in the report. */}
                  <Avatar size="lg" name={LEARNER.name} color="initials" />
                  <div className="flex flex-col gap-1">
                    <Text size="sm" className={TYPO.title()}>{LEARNER.name}</Text>
                    <Text size="xs" c="muted">{LEARNER.login} · {LEARNER.campus}</Text>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <CircularProgress variant="gradient" value={LEARNER.levelPct} size="xl">
                    <Text size="sm" span className={TYPO.mono()}>{LEARNER.level}</Text>
                  </CircularProgress>
                  <div className="flex flex-col gap-1">
                    <Text size="xs" c="muted" className={TYPO.title("medium") + " uppercase"}>Level</Text>
                    <Text size="sm" className={TYPO.mono()}>{LEARNER.xp}</Text>
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <Text size="xs" c="muted">{LEARNER.attendanceNote}</Text>
                  <Text size="sm" className={TYPO.mono()}>{LEARNER.attendance}</Text>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Section title="Skills" icon={<Grid2x2 size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="xs" c="muted">Acquired</Text>
                    <Text size="sm" className={TYPO.mono()}>{SKILLS_COUNT}</Text>
                  </div>
                  {/* STATUSES, not gauges: whether a skill is binary is an OPEN question
                      in context/product (index-product.md, contradiction 2). A gauge here
                      would settle it in silence. */}
                  {SKILLS.map((s) => (
                    <div key={s.name} className="flex flex-wrap items-center justify-between gap-3">
                      <Text size="sm" className={TYPO.title("medium")}>{s.name}</Text>
                      <Badge variant="light" color="gray">{s.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Achievements" icon={<Award size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {ACHIEVEMENTS.map((a) => (
                    <div key={a.label} className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Text size="sm" className={TYPO.title("medium")}>{a.label}</Text>
                        <Text size="xs" c="muted" className={TYPO.mono("regular")}>{a.date}</Text>
                      </div>
                      <Text size="sm" className={TYPO.mono()}>{a.xp}</Text>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>
        </aside>
      </div>
    </div>
  )
}
