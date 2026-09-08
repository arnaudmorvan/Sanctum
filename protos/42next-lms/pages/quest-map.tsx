import type { CSSProperties, ReactNode } from "react"
import { Check, Hourglass, Rocket } from "lucide-react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  ACHIEVEMENTS, CURRENT_TERRITORY, FILTERS, LEARNER, MASTERY, NEXT_MISSION, QUESTS,
  SKILLS, TERRITORIES, type Mark, type Status,
} from "../data/quest-map"

/** Screen translated from frame 22505:9532 on 2026-09-06.
 *
 *  Every gap, padding, variant and text style below is LIFTED from the frame.
 *  Figma → Tailwind mapping: 2=gap-0.5, 8=gap-2, 12=gap-3, 16=gap-4, 40=gap-10.
 *
 *  2026-09-08 — TWO DEVIATIONS FROM THE FRAME, asked for and assumed: every card is
 *  `outline` (transparent surface, the signature pink outline included), and green is
 *  out of the palette — validated territories and acquired skills come back as
 *  uncoloured badges and neutral timeline marks. */

/** The DS `SectionTitle` (size=xl, iconPosition=left, gap 8) has NO React equivalent:
 *  we compose. The icon is `hourglass`, the same on all 7 sections of the frame. */
const Section = ({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-gray-dark-400">
        <Hourglass size={24} />
        <Title order={2} size="2xl" className={TYPO.title()}>{title}</Title>
      </div>
      {aside}
    </div>
    {children}
  </section>
)

/** The timeline indicator. The frame filled it green; here a validated territory keeps
 *  its white `check` on a filled neutral dot, and an open one stays an empty circle. */
const MARK: Record<Mark, { color?: string; variant?: "filled" | "outline"; bullet?: ReactNode }> = {
  validated: { variant: "filled", bullet: <Check size={12} strokeWidth={3} /> },
  "in-progress": { variant: "filled" },
  open: { variant: "outline" },
}

/** Green and red are out of the flow's palette: a status carrying one comes back as an
 *  uncoloured outline badge — the label states the state. */
const NEUTRALISED = new Set(["green", "red"])

const StatusBadge = ({ status }: { status: Status }) =>
  NEUTRALISED.has(status.color) ? (
    <Badge variant="outline">{status.label}</Badge>
  ) : (
    <Badge variant="light" color={status.color}>{status.label}</Badge>
  )

export const QuestMap = () => (
  <div className="flex flex-col gap-10">
    {/* welcome — V gap 8. Display sm/Semibold (Lato SemiBold 30), not Bold. */}
    <div className="flex flex-col gap-2">
      <Title order={1} size="3xl" className={TYPO.title("semibold")}>
        Welcome back, {LEARNER.firstName}
      </Title>
      <Text size="sm" c="secondary">{LEARNER.track}</Text>
    </div>

    {/* content — H gap 40, main column 800 / rail 340 */}
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-10">
        <Section
          title="Territories"
          aside={<SegmentGroup size="sm" data={FILTERS} defaultValue="All" />}
        >
          <Card variant="outline" padding="lg">
            <Card.Content>
              {/* The frame gives three zones per item: rail, content, actions. The
                  kit's Timeline only has label / axis / content — so the badge lives
                  INSIDE the content, pushed to the right. Composition gap accepted. */}
              <Timeline size="md" lineVariant="solid">
                {TERRITORIES.map((t) => (
                  <Timeline.Item key={t.name} {...MARK[t.mark]}>
                    <Timeline.Content>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                          {/* Text xl/Bold — Lato Bold 20 */}
                          <Timeline.Title className={`${TYPO.title()} text-xl`}>
                            {t.name}
                          </Timeline.Title>
                          <Text size="md" c="muted">{t.detail}</Text>
                        </div>
                        <StatusBadge status={t.status} />
                      </div>
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card.Content>
          </Card>
        </Section>

        <Section title="Skills">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                {SKILLS.map((s) => (
                  <div key={s.name} className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      {/* Text md/Semibold — Lato SemiBold 16 */}
                      <Text size="md" className={TYPO.title("semibold")}>{s.name}</Text>
                      <Text size="xs" c="muted">{s.detail}</Text>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
                {/* Last row: no badge, a bar. The « 30 % » is a percentage → machine
                    register (Kode Mono SemiBold). */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <Text size="md" className={TYPO.title("semibold")}>{MASTERY.name}</Text>
                    <Text size="sm" className={TYPO.mono("semibold")}>{MASTERY.pct} %</Text>
                  </div>
                  <Progress variant="gradient" value={MASTERY.pct} size="sm" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section title="Active quests">
          {/* Two SIBLING cards, not one card with two rows: the section is in V gap 16
              and carries SectionTitle + Card + Card. */}
          <div className="flex flex-col gap-4">
            {QUESTS.map((q) => (
              <Card key={q.name} variant="outline" padding="lg">
                <Card.Content>
                  <div className="flex flex-wrap items-center gap-4">
                    <ThemeIcon color="pink" size="md" variant="light" radius="full">
                      <Rocket size={20} />
                    </ThemeIcon>
                    <div className="flex min-w-0 grow flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <Text size="md" className={TYPO.title("semibold")}>{q.name}</Text>
                        {/* An XP gain counts: machine register. */}
                        <Text size="sm" className={TYPO.mono("semibold")}>{q.xp}</Text>
                      </div>
                      <Text size="sm" c="muted">{q.detail}</Text>
                      <Progress variant="gradient" value={q.pct} size="sm" />
                    </div>
                    <Button size="sm" variant="outline" color="gray">{q.action}</Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Achievements">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                {ACHIEVEMENTS.map((a) => (
                  <div key={a.name} className="flex items-center gap-4">
                    <ThemeIcon color={a.color === "green" ? "gray" : a.color} size="md" variant="light" radius="full">
                      <Rocket size={20} />
                    </ThemeIcon>
                    <div className="flex flex-col gap-0.5">
                      <Text size="md" className={TYPO.title("semibold")}>{a.name}</Text>
                      <Text size="xs" c="muted">{a.detail}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </Section>
      </div>

      <aside className="flex flex-col gap-10">
        <Section title="Next mission">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                {/* Text lg/Semibold — Lato SemiBold 18 */}
                <Text size="lg" className={TYPO.title("semibold")}>{NEXT_MISSION.name}</Text>
                <Text size="sm" c="muted">{NEXT_MISSION.detail}</Text>
                {/* A countdown measures: machine register. */}
                <Text size="sm" className={TYPO.mono("semibold")}>{NEXT_MISSION.countdown}</Text>
                <div>
                  <Button size="sm" color="brand">{NEXT_MISSION.action}</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section title="Profile">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar size=md shape=circle, photo=Olivia Rhye — served by the site. */}
                  <Avatar size="md" src="/avatars/olivia-rhye.webp" alt="" name={LEARNER.name} color="initials" />
                  <div className="flex flex-col gap-0.5">
                    <Text size="md" className={TYPO.title("semibold")}>{LEARNER.name}</Text>
                    <Text size="sm" c="muted">{LEARNER.context}</Text>
                  </div>
                </div>
                {/* Display xs/Semibold — Kode Mono SemiBold 24. The level is THE
                    progression marker: machine, as on the profile. */}
                <Title order={3} size="2xl" className={TYPO.mono("semibold")}>
                  LEVEL {LEARNER.level}
                </Title>
                <Progress variant="gradient" value={LEARNER.xpPct} size="sm" />
                <Text size="xs" c="muted">{LEARNER.xp}</Text>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section title="Current territory">
          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col items-center gap-3">
                {/* The frame sets the ring at 136 px (size=3xl); the kit's scale stops at
                    xl = 80. We go through the escape hatch the component documents itself
                    (`--size` / `--thickness`), rather than shrinking the screen's only
                    hero element. The deviation goes out as a ds-action. */}
                <CircularProgress
                  variant="gradient"
                  value={CURRENT_TERRITORY.pct}
                  size="xl"
                  style={{ "--size": "136px", "--thickness": "12px" } as CSSProperties}
                >
                  {/* Display sm/Medium — Kode Mono Medium 30 */}
                  <Text span size="3xl" className={TYPO.mono("medium")}>
                    {CURRENT_TERRITORY.pct}%
                  </Text>
                </CircularProgress>
                <Text size="md" className={TYPO.title("semibold")}>{CURRENT_TERRITORY.name}</Text>
                <Text size="sm" c="muted">{CURRENT_TERRITORY.detail}</Text>
              </div>
            </Card.Content>
          </Card>
        </Section>
      </aside>
    </div>
  </div>
)
