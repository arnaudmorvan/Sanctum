import type { ReactNode } from "react"
import { Clock3, Flame, FolderCheck, GraduationCap, Grid2x2, Milestone } from "lucide-react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { ACTIVITIES, ATTENDANCE_LEGEND, ATTENDANCE_NOTE, ATTENDANCE_TOTAL, ATTENDANCE_VIEWS, CURRENT, ELSEWHERE, INTENSITY_CLASS, LEARNER, MILESTONE, PROGRAMS, STATS, buildAttendance } from "../data/profile"

/** CONFORMANCE PASS 2026-09-04, against frame 22489:9756, then TYPO PASS 2026-09-05:
 *  Lato carries the text AND the titles, Kode Mono carries THE MACHINE (level, counters,
 *  scores). The kit does the opposite — `Title` forces `font-mono` — hence the
 *  `className={TYPO.*}` below, each naming the Figma style it reproduces.
 *
 *  2026-09-08 — DEVIATION FROM THE FRAME, asked for and assumed: every card is `outline`
 *  (the identity card, the current activity and the current milestone lose the signature
 *  pink outline), and the "Validated" badges lose their green. The frame still says
 *  gradient/green: this flow deliberately does not. */

/** SectionTitle from the Figma DS: size=sm, title in Typography-1/Text md/Bold (16px),
 *  icon leading, gap 6 between the two. The icon names are LIFTED from the frame
 *  (folder-check, milestone, clock-3, grid-2x2, flame, graduation-cap). */
const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center gap-1.5 text-gray-dark-400">
      {icon}
      <Title order={2} size="md" className={TYPO.title()}>{title}</Title>
    </div>
    {children}
  </section>
)

const Cell = ({ intensity }: { intensity: keyof typeof INTENSITY_CLASS }) => (
  <div className={`size-3 rounded-sm ${INTENSITY_CLASS[intensity]}`} />
)

const ATTENDANCE = buildAttendance()

export const Profile = ({ login }: { login?: string }) => {
  const milestonePct = Math.round((MILESTONE.validated / MILESTONE.required) * 100)
  const requirementsPct = Math.round((CURRENT.met / CURRENT.total) * 100)

  return (
    <div className="flex flex-col gap-10">
      {/* Figma PageHeader: V gap 6, title in Display sm/Bold — Lato Bold 30. */}
      <div className="flex flex-col gap-1.5">
        <Title order={1} size="3xl" className={TYPO.title()}>{login ?? LEARNER.login}</Title>
        <Text size="sm" c="secondary">{LEARNER.name} - learner profile</Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-5">
                  {/* Figma Avatar: size=2xl, shape=circle. The kit caps at xl. The photo
                      is the frame's one, served by the site: /avatars/<slug>.webp.
                      `name` stays set — it is the initials fallback. */}
                  <Avatar
                    size="xl"
                    src="/avatars/olivia-rhye.webp"
                    alt=""
                    name={LEARNER.name}
                    color="initials"
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      {/* Text sm/Bold — Lato Bold 14. */}
                      <Text size="sm" className={TYPO.title()}>{LEARNER.name}</Text>
                      <Text size="xs" c="muted">{LEARNER.presence}</Text>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      {/* Typography-2/Display xs/Bold — Kode Mono Bold 24: THIS is the
                          machine register, and the only place in the block where it serves. */}
                      <Title order={2} size="2xl" className={TYPO.mono()}>LEVEL {LEARNER.level}</Title>
                      <Text size="xs" c="muted" className={TYPO.title("medium")}>{MILESTONE.name}</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Figma Progress: axis Color=Pink. In React the signature gradient
                          goes through variant="gradient". */}
                      <div className="grow"><Progress variant="gradient" value={LEARNER.levelPct} size="sm" /></div>
                      <Text size="sm" className={TYPO.title("medium")}>{LEARNER.xp}</Text>
                    </div>
                    <Text size="xs" c="muted">{LEARNER.track}</Text>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Section title="Activities" icon={<FolderCheck size={16} />}>
            <div className="flex flex-col gap-4">
              <Card variant="outline" padding="md">
                <Card.Content>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="light" color="blue">In progress</Badge>
                      <Badge variant="outline">{CURRENT.attempt}</Badge>
                    </div>
                    {/* Figma: Text sm/Bold (Lato Bold 14). */}
                    <Title order={3} size="sm" className={TYPO.title()}>{CURRENT.name}</Title>
                    <Text size="xs" c="muted">{CURRENT.context}</Text>
                    <div className="flex items-baseline justify-between gap-3">
                      <Text size="sm" className={TYPO.title("medium")}>{CURRENT.label}</Text>
                      <Text size="sm" c="muted" className={TYPO.title("medium")}>{CURRENT.met} / {CURRENT.total}</Text>
                    </div>
                    <Progress variant="gradient" value={requirementsPct} size="sm" />
                    <div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`#/activities/${CURRENT.slug}`}>Open the activity</a>
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {ACTIVITIES.map((a) => (
                <Card key={a.slug} variant="outline" padding="md">
                  <Card.Content>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Title order={3} size="sm" className={TYPO.title()}>{a.name}</Title>
                        <Text size="xs" c="muted">{a.context}</Text>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Typography-2/Text sm/Bold — Kode Mono Bold 14. A score is a
                            counter: it belongs to the machine register. */}
                        <Text size="sm" className={TYPO.mono()}>{a.score} / {a.outOf}</Text>
                        <Badge variant="outline">Validated</Badge>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Programs" icon={<Milestone size={16} />}>
            <Card variant="outline" padding="md">
              <Card.Content>
                {/* Timeline.Item has NO `title` prop — the real API is
                    Item > Label + Content > Title. The active program is now told by a
                    filled mark rather than by a green one. */}
                <Timeline size="md" lineVariant="solid">
                  {PROGRAMS.map((p) => (
                    <Timeline.Item key={p.name} variant={p.active ? undefined : "outline"}>
                      <Timeline.Label>
                        <span className="flex flex-col">
                          <span className={TYPO.title()}>{p.start}</span>
                          <span className="text-gray-dark-400">{p.end}</span>
                        </span>
                      </Timeline.Label>
                      <Timeline.Content>
                        <Timeline.Title className={`${TYPO.title()} text-xl`}>{p.name}</Timeline.Title>
                        <Text size="md" c="muted">{p.detail}</Text>
                      </Timeline.Content>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Attendance" icon={<Clock3 size={16} />}>
            <Card variant="outline" padding="md">
              <Card.Content>
                {/* attendance-body V gap 16, grid-row H gap 24. */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Text size="sm" c="secondary" className={TYPO.title("medium")}>Attendance view</Text>
                    <SegmentGroup size="sm" data={ATTENDANCE_VIEWS} defaultValue="Monthly" />
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                      {ATTENDANCE.map((row, i) => (
                        <div key={i} className="flex gap-1">
                          {row.map((intensity, j) => <Cell key={j} intensity={intensity} />)}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* 312H: Typography-2/Display xs/Bold — an hour counter, machine. */}
                      <Title order={3} size="2xl" className={TYPO.mono()}>{ATTENDANCE_TOTAL}</Title>
                      <Text size="xs" c="muted">{ATTENDANCE_NOTE}</Text>
                      <div className="flex items-center gap-2">
                        <Text size="xs" c="muted">Less</Text>
                        <div className="flex gap-1">
                          <Cell intensity="none" />
                          <Cell intensity="low" />
                          <Cell intensity="medium" />
                          <Cell intensity="high" />
                          <Cell intensity="peak" />
                        </div>
                        <Text size="xs" c="muted">More</Text>
                      </div>
                    </div>
                  </div>
                  <Text size="xs" c="muted">{ATTENDANCE_LEGEND}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
          <Section title="Stats" icon={<Grid2x2 size={16} />}>
            <Card variant="outline" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {STATS.map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <Text size="sm" className={TYPO.title("medium")}>{s.label}</Text>
                        <Text size="xs" c="muted">{s.detail}</Text>
                      </div>
                      {/* 47 / 12 / 3: Typography-2/Display xs/Bold, like LEVEL. */}
                      <Title order={3} size="2xl" className={TYPO.mono()}>{s.value}</Title>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Current milestone" icon={<Flame size={16} />}>
            <Card variant="outline" padding="sm">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text size="sm" className={TYPO.title()}>{MILESTONE.name}</Text>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="sm" c="secondary" className={TYPO.title("medium")}>{MILESTONE.label}</Text>
                    <Text size="sm" c="muted" className={TYPO.title("medium")}>{MILESTONE.validated} / {MILESTONE.required}</Text>
                  </div>
                  <Progress variant="gradient" value={milestonePct} size="sm" />
                  <Text size="xs" c="muted">{MILESTONE.note}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>

          {/* The cross-references are LINKS in Text sm/BoldCap, not buttons — 4 Buttons
              inside one card violated "buttons must not dominate". They are inert. */}
          <Section title="Elsewhere on this profile" icon={<GraduationCap size={16} />}>
            <Card variant="outline" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {ELSEWHERE.map((l) => (
                    <div key={l.label} className="flex flex-col gap-1">
                      <Text size="sm" className={TYPO.title() + " uppercase"}>{l.label}</Text>
                      <Text size="xs" c="muted">{l.note}</Text>
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
