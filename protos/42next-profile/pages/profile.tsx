import type { ReactNode } from "react"
import {
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Flame,
  FolderCheck,
  GraduationCap,
  Grid2x2,
  Milestone,
  Target,
} from "lucide-react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Calendar } from "@42/ui-react/calendar"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { AGENDA_LEGEND, NEXT_EVENT, hasAgenda } from "../data/agenda"
import {
  ACTIVITIES,
  ATTENDANCE_LEGEND,
  ATTENDANCE_NOTE,
  ATTENDANCE_TOTAL,
  ATTENDANCE_VIEWS,
  CURRENT,
  ELSEWHERE,
  INTENSITY_CLASS,
  LEARNER,
  MILESTONE,
  PROGRAMS,
  STATS,
  buildAttendance,
} from "../data/profile"

/** 42next — LEARNER PROFILE · PROPOSAL OF 2026-09-08
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  WHAT THIS VERSION CHANGES, AND WHY IT IS NOT A MATTER OF TASTE
 *  ─────────────────────────────────────────────────────────────────────────
 *  The previous screen was a faithful lift of frame 22489:9756. Read against
 *  the DS's own foundations, that frame fails three written assertions:
 *
 *  1. `review:components` — THREE `gradient` cards (identity, minishell,
 *     milestone). The rule says one, and it designates the entry point. Three
 *     cancel the signal: nothing on the screen says where to start.
 *  2. `review:layout` — « the screen opens, it does not report ». The profile
 *     was retrospective almost end to end: level reached, activities validated,
 *     programs past, attendance past. One zone said what to attack next, and it
 *     sat in third position.
 *  3. `foundations-layout` — « on a screen that must open, the rail LEADS with
 *     the next action ». The rail led with Stats, which is a readout.
 *
 *  THE INTENTION: the profile becomes a POSITION ON THE PATH, not a file.
 *  What is left to conquer leads; what is already proven folds into evidence.
 *
 *  Three moves, in the order the eye meets them:
 *  A. The identity card is DEMOTED from `gradient` to `default`. Identity says
 *     who, it is not what to attack.
 *  B. `minishell` is PROMOTED to second position, in the screen's ONLY
 *     `gradient` card, under a section named « Next », and it carries the
 *     primary action plus the milestone pace it belongs to.
 *  C. The four validated activities COLLAPSE from four full-width cards into
 *     one card of four rows. Same content, a quarter of the weight — the past
 *     stops being the heaviest block on the screen.
 *  D. The rail is reordered: milestone (pace) → stats → elsewhere → agenda.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  WHAT IS KEPT FROM THE TWO CONFORMANCE PASSES — do not undo it
 *  ─────────────────────────────────────────────────────────────────────────
 *  LAYOUT (2026-09-04): a card's inner padding is carried by the `padding`
 *  prop (lg=24, md=16, sm=12), never re-applied by hand on Card.Content.
 *  Figma → Tailwind gaps: 4=gap-1, 8=gap-2, 12=gap-3, 16=gap-4, 24=gap-6,
 *  40=gap-10. The two steps of a 42 screen are 40 (any first-level separation)
 *  and 16 (a SectionTitle and its cards). A uniform 24 reads flat.
 *
 *  TYPO (2026-09-05): Lato carries the text AND all titles; Kode Mono carries
 *  THE MACHINE only — level, counters, scores, dates. The kit inverts it
 *  (`Title` hard-codes `font-mono`, `Text` exposes no weight), hence every
 *  `className={TYPO.*}` below. They disappear when the kit exposes the axes
 *  (`ds-actions:kit-title-force-mono`, `kit-text-sans-graisse`).
 *
 *  ICONS: folder-check, milestone, clock-3, grid-2x2, flame, graduation-cap
 *  are LIFTED from the frame. `target` (Next), `clipboard-check` (Reviews
 *  given) and `calendar-days` (Agenda) are REASONED — the frame carries no
 *  such section. Declared as gaps in the report, not passed off as a lift.
 */

/** SectionTitle from the Figma DS: size=sm, title in Typography-1/Text md/Bold
 *  (16 px), icon leading, gap 6 between the two, 16 down to the cards. */
const Section = ({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center gap-1.5 text-gray-dark-400">
      {icon}
      <Title order={2} size="md" className={TYPO.title()}>
        {title}
      </Title>
    </div>
    {children}
  </section>
)

const Cell = ({ intensity }: { intensity: keyof typeof INTENSITY_CLASS }) => (
  <div className={`size-3 rounded-sm ${INTENSITY_CLASS[intensity]}`} />
)

/** Agenda dot. It rides in `Calendar`'s renderDay slot, which appends INSIDE
 *  the day cell — a dot in the flow pushes the digit and breaks the column
 *  alignment (measured 2026-09-08). The cell is `relative flex items-center
 *  justify-center`, so the only correct treatment is an absolute dot centred
 *  under the number: no flow, no shift. */
const AgendaDot = () => (
  <span className="pointer-events-none absolute inset-x-0 bottom-0.5 mx-auto block size-1 rounded-full bg-pink-400" />
)

const STAT_ICON = {
  reviews: ClipboardCheck,
  projects: FolderCheck,
  exams: GraduationCap,
}

const ATTENDANCE = buildAttendance()

export const Profile = ({ login }: { login?: string }) => {
  const milestonePct = Math.round((MILESTONE.validated / MILESTONE.required) * 100)
  const requirementsPct = Math.round((CURRENT.met / CURRENT.total) * 100)
  const requirementsLeft = CURRENT.total - CURRENT.met

  return (
    <div className="flex flex-col gap-10">
      {/* Page title. No DS component carries it: `SectionTitle` explicitly
          forbids it and `PageHeader` is fixed at 1152 with clipsContent, so
          unusable in a three-column layout (ds-actions:pageheader-fixe-1152).
          Display sm/Bold = Lato Bold 30. */}
      <div className="flex flex-col gap-1.5">
        <Title order={1} size="3xl" className={TYPO.title()}>
          {login ?? LEARNER.login}
        </Title>
        <Text size="sm" c="secondary">
          {LEARNER.name} — learner profile
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          {/* A. IDENTITY — `default`, not `gradient`. The demotion is the whole
              point: the signature outline is a pointer, and it now points at
              one thing only, the card below. */}
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex items-center gap-5">
                {/* Figma Avatar: size=2xl, shape=circle. The kit caps at xl. */}
                <Avatar
                  size="xl"
                  src={LEARNER.avatar}
                  alt=""
                  name={LEARNER.name}
                  color="initials"
                />
                <div className="flex grow flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <Text size="sm" className={TYPO.title()}>
                      {LEARNER.name}
                    </Text>
                    <Text size="xs" c="muted">
                      {LEARNER.presence}
                    </Text>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    {/* Typography-2/Display xs/Bold — Kode Mono Bold 24. THE
                        machine register, and the only place it serves here. */}
                    <Title order={2} size="2xl" className={TYPO.mono()}>
                      LEVEL {LEARNER.level}
                    </Title>
                    <Text size="xs" c="muted" className={TYPO.title("medium")}>
                      {MILESTONE.name}
                    </Text>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* review:color demands the signature gradient on progress,
                        never a flat colour. */}
                    <div className="grow">
                      <Progress variant="gradient" value={LEARNER.levelPct} size="sm" />
                    </div>
                    <Text size="sm" className={TYPO.mono()}>
                      {LEARNER.xp}
                    </Text>
                  </div>
                  <Text size="xs" c="muted">
                    {LEARNER.track}
                  </Text>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* B. NEXT — the ONE gradient card of the screen, and the only zone
              that carries a primary action. Everything above states a
              position; this states a move. */}
          <Section title="Next" icon={<Target size={16} />}>
            <Card variant="gradient" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {/* A status badge is grey by default: the meaning is in the
                        label. `blue` here is the stated exception — brand blue
                        carries the interactive / in-progress state. */}
                    <Badge variant="light" color="blue">
                      In progress
                    </Badge>
                    <Badge variant="light" color="gray">
                      {CURRENT.attempt}
                    </Badge>
                  </div>
                  <Title order={3} size="sm" className={TYPO.title()}>
                    {CURRENT.name}
                  </Title>
                  <Text size="xs" c="muted">
                    {CURRENT.context}
                  </Text>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="sm" className={TYPO.title("medium")}>
                      {CURRENT.label}
                    </Text>
                    {/* A counter measures: Kode Mono. */}
                    <Text size="sm" c="secondary" className={TYPO.mono()}>
                      {CURRENT.met} / {CURRENT.total}
                    </Text>
                  </div>
                  <Progress variant="gradient" value={requirementsPct} size="sm" />
                  {/* What the frame never said out loud: how much is LEFT, and
                      at what pace. A screen that opens has to answer that. */}
                  <Text size="xs" c="muted">
                    {requirementsLeft} requirements left · {MILESTONE.name} ·{" "}
                    {MILESTONE.daysElapsed} of {MILESTONE.daysReference} working days elapsed
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {/* `sm` is a screen's default (the kit declares md), and a
                        single primary button: buttons must not dominate. */}
                    <Button size="sm" variant="filled" color="brand" asChild>
                      <a href={`#/activities/${CURRENT.slug}`}>Open the activity</a>
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Section>

          {/* C. THE PROVEN PAST — four rows, one card. In the frame these were
              four full-width cards: the heaviest block of the screen given to
              what is already finished. */}
          <Section title="Validated activities" icon={<FolderCheck size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {ACTIVITIES.map((a) => (
                    <div
                      key={a.slug}
                      className="flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex flex-col gap-1">
                        <Text size="sm" className={TYPO.title()}>
                          {a.name}
                        </Text>
                        <Text size="xs" c="muted">
                          {a.context}
                        </Text>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Typography-2/Text sm/Bold — a score is a counter. */}
                        <Text size="sm" className={TYPO.mono()}>
                          {a.score} / {a.outOf}
                        </Text>
                        {/* Green is the stated semantic exception: a terminal
                            validation. */}
                        <Badge variant="light" color="green">
                          Validated
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Programs" icon={<Milestone size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                {/* `timeline` is the only DS component that states an ORDERED
                    path carrying states — it is kept as is. There is no state
                    axis: you pick the item variant that already carries the
                    indicator you want.
                    ⚠️ `Timeline.Item` has NO `title` prop: passing one drops it
                    into the HTML title attribute, so into a tooltip, invisible
                    on screen. The real API is Item > Label + Content > Title. */}
                <Timeline size="md" lineVariant="solid">
                  {PROGRAMS.map((p) => (
                    <Timeline.Item
                      key={p.name}
                      color={p.active ? "green" : undefined}
                      variant={p.active ? undefined : "outline"}
                    >
                      <Timeline.Label>
                        {/* The date column is narrow: "10/25" fits where
                            "Oct. 2025" is truncated. */}
                        <span className="flex flex-col">
                          <span className={TYPO.mono()}>{p.start}</span>
                          <span className="text-gray-dark-400">{p.end}</span>
                        </span>
                      </Timeline.Label>
                      <Timeline.Content>
                        <Timeline.Title className={`${TYPO.title()} text-xl`}>
                          {p.name}
                        </Timeline.Title>
                        <Text size="md" c="muted">
                          {p.detail}
                        </Text>
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
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Text size="sm" c="secondary" className={TYPO.title("medium")}>
                      Attendance view
                    </Text>
                    <SegmentGroup size="sm" data={ATTENDANCE_VIEWS} defaultValue="Monthly" />
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                      {ATTENDANCE.map((row, i) => (
                        <div key={i} className="flex gap-1">
                          {row.map((intensity, j) => (
                            <Cell key={j} intensity={intensity} />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* 312H — an hour counter, machine register. */}
                      <Title order={3} size="2xl" className={TYPO.mono()}>
                        {ATTENDANCE_TOTAL}
                      </Title>
                      <Text size="xs" c="muted">
                        {ATTENDANCE_NOTE}
                      </Text>
                      <div className="flex items-center gap-2">
                        <Text size="xs" c="muted">
                          Less
                        </Text>
                        <div className="flex gap-1">
                          <Cell intensity="none" />
                          <Cell intensity="low" />
                          <Cell intensity="medium" />
                          <Cell intensity="high" />
                          <Cell intensity="peak" />
                        </div>
                        <Text size="xs" c="muted">
                          More
                        </Text>
                      </div>
                    </div>
                  </div>
                  <Text size="xs" c="muted">
                    {ATTENDANCE_LEGEND}
                  </Text>
                </div>
              </Card.Content>
            </Card>
          </Section>
        </div>

        {/* D. THE RAIL — reordered. It used to lead with Stats, a readout.
            `foundations-layout`: on a screen that must open, the rail leads
            with what says where the learner stands on the current territory,
            then the readouts, then the way out. */}
        <aside className="flex flex-col gap-10">
          <Section title="Current milestone" icon={<Flame size={16} />}>
            {/* `default`, not `gradient`: the signature outline is spent on the
                Next card. Two gradient cards cancel the signal. */}
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text size="sm" className={TYPO.title()}>
                    {MILESTONE.name}
                  </Text>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="sm" c="secondary" className={TYPO.title("medium")}>
                      {MILESTONE.label}
                    </Text>
                    <Text size="sm" c="muted" className={TYPO.mono()}>
                      {MILESTONE.validated} / {MILESTONE.required}
                    </Text>
                  </div>
                  <Progress variant="gradient" value={milestonePct} size="sm" />
                  <Text size="xs" c="muted">
                    {MILESTONE.note}
                  </Text>
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Stats" icon={<Grid2x2 size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {STATS.map((s) => {
                    const Icon = STAT_ICON[s.icon]
                    return (
                      <div key={s.label} className="flex items-center gap-3">
                        {/* The frame carries these tiles; the first React lift
                            had dropped them. `ThemeIcon` is the DS component
                            for exactly this — it exposes an icon swap, unlike
                            `SectionTitle`. */}
                        <ThemeIcon variant="light" color="purple" size="md" radius="md">
                          <Icon size={16} />
                        </ThemeIcon>
                        <div className="flex grow flex-col">
                          <Text size="sm" className={TYPO.title("medium")}>
                            {s.label}
                          </Text>
                          <Text size="xs" c="muted">
                            {s.detail}
                          </Text>
                        </div>
                        <Title order={3} size="2xl" className={TYPO.mono()}>
                          {s.value}
                        </Title>
                      </div>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>
          </Section>

          {/* The cross-references stay INERT text, not links: this proto holds
              two screens, and a dead link is worse than a label that never
              promised. The kit has no Link component and `Text` has no colour
              prop, so the DS interactive colour is not reachable here either —
              filed to the report rather than approximated with a raw class. */}
          <Section title="Elsewhere on this profile" icon={<GraduationCap size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {ELSEWHERE.map((l) => (
                    <div key={l.label} className="flex flex-col gap-1">
                      <Text size="sm" className={`${TYPO.title()} uppercase`}>
                        {l.label}
                      </Text>
                      <Text size="xs" c="muted">
                        {l.note}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          {/* Agenda — ADDED 2026-09-08, not in the frame. It leads with the
              next item (stamp in Kode Mono: a date measures) and only then
              shows the month. locale en-GB: the week starts on MONDAY, like
              the attendance grid — the kit default (en-US) started it on
              Sunday and the two calendars of one screen disagreed. */}
          <Section title="Agenda" icon={<CalendarDays size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <Text size="sm" className={TYPO.mono()}>
                        {NEXT_EVENT.stamp}
                      </Text>
                      <Text size="sm" className={TYPO.title("medium")}>
                        {NEXT_EVENT.label}
                      </Text>
                    </div>
                    <Text size="xs" c="muted">
                      Next on your agenda.
                    </Text>
                  </div>
                  <Calendar
                    size="sm"
                    locale="en-GB"
                    fixedWeeks
                    renderDay={(date) => (hasAgenda(date) ? <AgendaDot /> : null)}
                  />
                  <Text size="xs" c="muted">
                    {AGENDA_LEGEND}
                  </Text>
                </div>
              </Card.Content>
            </Card>
          </Section>
        </aside>
      </div>
    </div>
  )
}
