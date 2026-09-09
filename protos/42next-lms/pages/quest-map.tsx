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
  SKILLS, TERRITORIES, type Mark,
} from "../data/quest-map"

/** Screen translated from frame 22505:9532 on 2026-09-06.
 *
 *  Every gap, padding, variant and text style below is LIFTED from the frame.
 *  Figma → Tailwind mapping: 2=gap-0.5, 8=gap-2, 12=gap-3, 16=gap-4,
 *  40=gap-10. Card padding is carried by the `padding` prop (lg=24).
 *
 *  ⚠️ THIS frame's typography is not the profile's: its section titles are in
 *  `Display xs/Bold` (Lato Bold 24, SectionTitle size=xl) where the profile sets
 *  `Text md/Bold` (16, size=sm). Same Figma component, another step — which is why we
 *  lift instead of reusing. And it uses a lot of **Semibold**, which the first version
 *  of `TYPO` could not produce. */

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

/** The timeline indicator. Lifted: white `check` on a solid green dot for a validated
 *  territory, bare green dot for the one in progress, empty circle otherwise. */
const MARK: Record<Mark, { color?: string; variant?: "filled" | "outline"; bullet?: ReactNode }> = {
  validated: { color: "green", variant: "filled", bullet: <Check size={12} strokeWidth={3} /> },
  "in-progress": { color: "green", variant: "filled" },
  open: { variant: "outline" },
}

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
          <Card variant="default" padding="lg">
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
                        <Badge variant="light" color={t.status.color}>{t.status.label}</Badge>
                      </div>
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card.Content>
          </Card>
        </Section>

        <Section title="Skills">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                {SKILLS.map((s) => (
                  <div key={s.name} className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      {/* Text md/Semibold — Lato SemiBold 16 */}
                      <Text size="md" className={TYPO.title("semibold")}>{s.name}</Text>
                      <Text size="xs" c="muted">{s.detail}</Text>
                    </div>
                    <Badge variant="light" color={s.status.color}>{s.status.label}</Badge>
                  </div>
                ))}
                {/* Last row: no badge, a bar. The « 30 % » is a
                    percentage → machine register (Kode Mono SemiBold). */}
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
              <Card key={q.name} variant="default" padding="lg">
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
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                {ACHIEVEMENTS.map((a) => (
                  <div key={a.name} className="flex items-center gap-4">
                    <ThemeIcon color={a.color} size="md" variant="light" radius="full">
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
          {/* The only `gradient` card on the screen: the signature pink outline goes to
              the next deadline, not to the profile. Lifted, not chosen. */}
          <Card variant="gradient" padding="lg">
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
          <Card variant="default" padding="lg">
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
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col items-center gap-3">
                {/* The frame sets the ring at 136 px (size=3xl); the kit's scale
                    stops at xl = 80. We go through the escape hatch the component
                    documents itself (`--size` / `--thickness`, merged AFTER its
                    defaults), rather than shrinking the screen's only hero element.
                    The deviation goes out as a ds-action. */}
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
