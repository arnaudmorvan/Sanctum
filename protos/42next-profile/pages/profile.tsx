import type { ReactNode } from "react"
import { CalendarDays, Clock3, Flame, FolderCheck, GraduationCap, Grid2x2, Milestone } from "lucide-react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Calendar } from "@42/ui-react/calendar"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { AGENDA_LEGEND, NEXT_EVENT, hasAgenda } from "../data/agenda"
import { ACTIVITIES, ATTENDANCE_LEGEND, ATTENDANCE_NOTE, ATTENDANCE_TOTAL, ATTENDANCE_VIEWS, CURRENT, ELSEWHERE, INTENSITY_CLASS, LEARNER, MILESTONE, PROGRAMS, STATS, buildAttendance } from "../data/profile"

/** CONFORMANCE PASS 2026-09-04, against frame 22489:9756.
 *  Every (variant, padding) pair on Card, every title size and every gap below are
 *  LIFTED from the frame, not chosen. Do not "harmonise" them: a uniform gap is the
 *  generation defect that foundations-layout explicitly corrects.
 *
 *  Figma -> Tailwind gap mapping: 4=gap-1, 8=gap-2, 12=gap-3,
 *  16=gap-4, 20=gap-5, 24=gap-6, 40=gap-10.
 *  A card's inner padding is carried by the `padding` prop (lg=24, md=16,
 *  sm=12): never re-apply it by hand on Card.Content.
 *
 *  TYPO PASS 2026-09-05, against the survey of the 91 texts of that same frame.
 *  The DS rule: Lato carries the text AND the titles; Kode Mono carries THE
 *  MACHINE (level, counters, scores). The kit does the opposite — `Title` forces
 *  `font-mono` — hence the `className={TYPO.*}` below, each of which names the
 *  Figma style it reproduces. They will disappear once the kit exposes the axes.
 *
 *  ADDITION 2026-09-08 — the « Agenda » block at the foot of the rail (next item,
 *  month grid, event dots) does NOT come from the frame: it was asked for after the
 *  lift. Do not read its presence as a survey, and do not re-lift it from here. */

/** SectionTitle from the Figma DS: size=sm, title in Typography-1/Text md/Bold (16px),
 *  icon leading, gap 6 between the two. size="md" maps the Figma `Text md` step by its
 *  name. The scale used to be size="lg": titles too big, rejection 9.
 *  TYPO.title(): the frame sets them in Lato Bold, the kit was rendering them in Kode Mono.
 *
 *  The icon is NO LONGER missing (2026-09-05): it had been dropped on the belief
 *  that « no asset travels through publish_proto ». An icon is not an asset,
 *  it is a lucide import — and the names are LIFTED from the frame, not chosen
 *  (folder-check, milestone, clock-3, grid-2x2, flame, graduation-cap).
 *  ⚠️ calendar-days, on the Agenda block, is the ONE reasoned choice: the frame
 *  carries no such section. Declared as a gap in the report, not passed off as a lift. */
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

/** Agenda dot. It rides in `Calendar`'s renderDay slot, which appends INSIDE the day
 *  cell, next to the number: a plain dot therefore pushes the digit and breaks the
 *  column alignment (seen on the 2026-09-08 publish). The zero-size wrapper takes no
 *  room in the flow and hangs the dot under the baseline. */
const AgendaDot = () => (
  <span className="relative inline-block h-0 w-0 align-baseline">
    <span className="absolute -bottom-1 left-0 block size-1 -translate-x-1/2 rounded-full bg-pink-400" />
  </span>
)

const ATTENDANCE = buildAttendance()

export const Profile = ({ login }: { login?: string }) => {
  const milestonePct = Math.round((MILESTONE.validated / MILESTONE.required) * 100)
  const requirementsPct = Math.round((CURRENT.met / CURRENT.total) * 100)

  return (
    <div className="flex flex-col gap-10">
      {/* Figma PageHeader: V gap 6, title in Display sm/Bold — Lato Bold 30.
          Used to be size="2xl" (24) in Kode Mono: two deviations at once. */}
      <div className="flex flex-col gap-1.5">
        <Title order={1} size="3xl" className={TYPO.title()}>{login ?? LEARNER.login}</Title>
        <Text size="sm" c="secondary">{LEARNER.name} - learner profile</Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          {/* Identity: lifted as gradient/lg. Used to be default/lg — the signature
              pink outline was missing on the identity card (rejection 11). */}
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-5">
                  {/* Figma Avatar: size=2xl, shape=circle. The kit caps at xl.
                      The photo is the frame's one (_Avatar photos, photo=Olivia
                      Rhye), served by the site: /avatars/<slug>.webp. `name` stays
                      set — it is the initials fallback if the file is missing. */}
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
                      {/* Typography-2/Display xs/Bold — Kode Mono Bold 24: THIS is
                          the machine register, and the only place in the block where it
                          serves. Used to be size="xl" (20) in SemiBold. */}
                      <Title order={2} size="2xl" className={TYPO.mono()}>LEVEL {LEARNER.level}</Title>
                      <Text size="xs" c="muted" className={TYPO.title("medium")}>{MILESTONE.name}</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Figma Progress: axis Color=Pink. In React the signature
                          gradient goes through variant="gradient" (CVA default
                          purple-300 -> pink-400). review:color demands the gradient,
                          never a flat color. */}
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
              {/* Current activity: lifted as gradient/md. Used to be gradient/lg. */}
              <Card variant="gradient" padding="md">
                <Card.Content>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="light" color="blue">In progress</Badge>
                      <Badge variant="light" color="gray">{CURRENT.attempt}</Badge>
                    </div>
                    {/* Figma: Text sm/Bold (Lato Bold 14). Used to be a Title with no
                        size, so at the default for its order — several steps too big. */}
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

              {/* Past activity: lifted as default/md, past-row H gap 12,
                  past-copy V gap 4, past-right H gap 12. Used to be default/lg. */}
              {ACTIVITIES.map((a) => (
                <Card key={a.slug} variant="default" padding="md">
                  <Card.Content>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Title order={3} size="sm" className={TYPO.title()}>{a.name}</Title>
                        <Text size="xs" c="muted">{a.context}</Text>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Typography-2/Text sm/Bold — Kode Mono Bold 14. A score
                            is a counter: it belongs to the machine register. */}
                        <Text size="sm" className={TYPO.mono()}>{a.score} / {a.outOf}</Text>
                        <Badge variant="light" color="green">Validated</Badge>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Programs" icon={<Milestone size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                {/* FIXED on 2026-09-05. The previous version passed the program name
                    as `title={...}` — but Timeline.Item has NO `title` prop: it fell
                    through to the HTML `title` attribute, so into a tooltip,
                    invisible on screen. The three program names were simply
                    missing. The real API is
                    Item > Label + Content > Title (the component's JSDoc).
                    The frame's left column carries the start (Lato Bold 16) above
                    the end (Lato Regular 14); the title is Text xl/Bold. */}
                <Timeline size="md" lineVariant="solid">
                  {PROGRAMS.map((p) => (
                    <Timeline.Item
                      key={p.name}
                      color={p.active ? "green" : undefined}
                      variant={p.active ? undefined : "outline"}
                    >
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
            <Card variant="default" padding="md">
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
                      {/* 312H: Typography-2/Display xs/Bold — an hour counter,
                          machine register. Used to be size="xl" in SemiBold. */}
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
          {/* Stats: lifted as default/md, stats-body V gap 16, stat-row H gap 12,
              NO divider. Used to be outline/lg with invented Dividers. */}
          <Section title="Stats" icon={<Grid2x2 size={16} />}>
            <Card variant="default" padding="md">
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

          {/* Current milestone: lifted as gradient/sm, milestone-body V gap 12.
              Used to be outline/lg — this is the side rail's other pink-outlined card. */}
          <Section title="Current milestone" icon={<Flame size={16} />}>
            <Card variant="gradient" padding="sm">
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

          {/* Elsewhere: lifted as default/md, links-body V gap 16, link V gap 4.
              The cross-references are LINKS in Text sm/BoldCap, not buttons —
              4 Buttons inside one card violated "buttons must not dominate".
              They are inert (designer's call), so rendered as text: the kit
              has neither a Link component nor a color prop on Text, so the DS
              interactive color is not reachable here. Filed to the report. */}
          <Section title="Elsewhere on this profile" icon={<GraduationCap size={16} />}>
            <Card variant="default" padding="md">
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

          {/* Agenda — ADDED 2026-09-08, not in frame 22489:9756. The rail's job is to
              carry what accompanies the reading and to say what comes next, so the
              block LEADS with the next item (stamp in Kode Mono: a date measures)
              and only then shows the month. `Calendar` carries the grid and its own
              event-dot slot (`renderDay`) — the dot is the one hand-written scrap.
              locale en-GB: the week starts on MONDAY, like the attendance grid right
              above it; the kit default (en-US) started it on Sunday and the two
              calendars of the same screen disagreed.
              default/md, NOT gradient: the screen already has its entry point.
              Inert, like the Elsewhere block: this proto holds no agenda screen and a
              dead control is worse than no control. */}
          <Section title="Agenda" icon={<CalendarDays size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      {/* Typography-2/Text sm/Bold — a date measures, so Kode Mono. */}
                      <Text size="sm" className={TYPO.mono()}>{NEXT_EVENT.stamp}</Text>
                      <Text size="sm" className={TYPO.title("medium")}>{NEXT_EVENT.label}</Text>
                    </div>
                    <Text size="xs" c="muted">Next on your agenda.</Text>
                  </div>
                  <Calendar
                    size="sm"
                    locale="en-GB"
                    fixedWeeks
                    renderDay={(date) => (hasAgenda(date) ? <AgendaDot /> : null)}
                  />
                  <Text size="xs" c="muted">{AGENDA_LEGEND}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>
        </aside>
      </div>
    </div>
  )
}
