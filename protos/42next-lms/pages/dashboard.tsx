import { Alert } from "@42/ui-react/alert"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Title } from "@42/ui-react/title"
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CalendarPlus,
  CircleAlert,
  Lightbulb,
  LoaderCircle,
  MessageSquare,
  Play,
  RotateCcw,
  Trophy,
  Users,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { TYPO } from "../../../src/typo"
import {
  ACTION_REQUIRED,
  COMING_UP,
  FRIENDS,
  HERO,
  IN_PROGRESS,
  QUOTE,
  SUGGESTIONS,
  WINS,
} from "../data/lms"

/** Home — `P['dashboard']` of the prototype.
 *
 *  RE-LIFTED FROM THE FRAME on 2026-09-09 (`22828:12317`, figma-from-screen then a design
 *  pass in Figma). The frame is now the source: the page answers the same four questions,
 *  in the same order, but the grammar comes from the mockup and no longer from the HTML
 *  prototype it was ported from.
 *
 *  What the frame changed, and why it is not a detail:
 *  - THREE COLUMNS. The skeleton carries the sidebar; here the content area splits into a
 *    main column and a 340 rail. It is the "Learning dashboard" template of
 *    foundations-layout, and it is what the reference frames of this family all use.
 *  - ONE CARD PER LIST, not one per item. Wins, Action required, Suggestions and Friends
 *    each collapse from N cards into a single `padding="lg"` card holding rows. 23 cards
 *    became 11.
 *  - THE SIGNATURE OUTLINE MOVED. `gradient` is on the Action-required card at the head of
 *    the rail — one per screen, and it marks what to attack — instead of on the two
 *    In-progress cards.
 *  - THE HUES SHRANK. Status badges go grey by default; the label carries the meaning.
 *    `Under review` is pink, not brand: pink is this DS's "in progress", blue is not. */

const HERO_STATS = [
  { k: "Level", v: HERO.level, href: "#/me/profile" },
  { k: "Milestone", v: HERO.milestone, href: "#/progression/milestones" },
  { k: "YAMS status", v: HERO.yams, href: "#/progression/yams" },
]

/** The day separators the agenda block drew: a row only carries its day when it opens a
 *  new one. Same rule, done on the list rather than in a loop with a mutable `day`. */
const withDayBreaks = (rows: typeof COMING_UP) =>
  rows.map((row, i) => ({ row, day: i === 0 || rows[i - 1].day !== row.day ? row.day : null }))

/** One glyph per suggestion, keyed on the title.
 *
 *  The frame shipped the same `messages-square` on all five rows — a copy-paste, raised by
 *  Arnaud through the flow's feedback widget on 2026-09-09 ("update the icons based on the
 *  title"). The frame was corrected in the same pass, so the source and this file do not
 *  diverge again on the next re-lift.
 *
 *  ⚠️ These names are a REASONED choice, not a survey: the frame carried no per-row glyph to
 *  read. `review:icons` asks that such a choice be declared as one rather than passed off as
 *  a match — it is, in the report of the day. */
const SUGGESTION_ICON: Record<string, ComponentType<{ size?: number }>> = {
  "Start a new attempt on cub3d": RotateCcw,
  "Project feedback": MessageSquare,
  "Register to Algorithmics": BookOpen,
  "Start pacman": Play,
  "Schedule a review for Inception": CalendarPlus,
}

/** The frame's `sectiontitle` at `size=xl`: a lucide glyph at 24 and a Lato Bold 24 title.
 *  The DS component has no 1:1 in the kit — its own CODE section says to compose it — and
 *  its Figma icon has no swap property, so the glyph is chosen here, per section. */
const SectionHead = ({
  icon: Icon,
  title,
  right,
}: {
  icon: ComponentType<{ size?: number }>
  title: string
  right?: ReactNode
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <Icon size={24} />
      <Title order={2} size="2xl" className={TYPO.title("bold")}>
        {title}
      </Title>
    </div>
    {right}
  </div>
)

/** Uppercase label, Lato Bold 14 — `Typography-1/Text sm/BoldCap` on the frame. `Text`
 *  exposes neither weight nor transform, so both go through the className. */
const Cap = ({ children }: { children: ReactNode }) => (
  <Text size="sm" c="muted" className={`uppercase ${TYPO.title("bold")}`}>
    {children}
  </Text>
)

export const Dashboard = () => (
  <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
    {/* ── main column ─────────────────────────────────────────────── */}
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Title order={1} size="3xl" className={TYPO.title("semibold")}>
          {HERO.greeting}, {HERO.login}
        </Title>

        <div className="flex flex-wrap items-center gap-3">
          <Text size="sm" c="secondary">{HERO.program}</Text>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <Text size="sm" c="secondary">
            Day <b className={TYPO.mono("semibold")}>{HERO.day}</b>
          </Text>
        </div>

        <div className="flex flex-wrap items-stretch gap-4">
          {HERO_STATS.map((s) => (
            <a key={s.k} href={s.href} className="min-w-40 flex-1">
              <Card variant="default" padding="lg" className="h-full">
                <Card.Content>
                  <div className="flex flex-col gap-2">
                    <Cap>{s.k}</Cap>
                    {/* Kode Mono SemiBold 36 on the frame. The kit's Title scale stops at
                        3xl = 30, so the step goes through the className. */}
                    <span className={`text-4xl ${TYPO.mono("semibold")}`}>{s.v}</span>
                    {s.k === "Milestone" ? (
                      <Progress variant="gradient" value={HERO.milestonePct} size="sm" />
                    ) : null}
                  </div>
                </Card.Content>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* The quote is the prototype's one moment of levity. The frame carries it as an
          info Alert with its own title. */}
      <Alert variant="light" type="info" title="Breaking change in v3" description={`"${QUOTE}"`} />

      <section className="flex flex-col gap-4">
        <SectionHead icon={Trophy} title="Wins" />
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-4">
              {WINS.map((w) => (
                <div key={w.name} className="flex items-center gap-4">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Title order={3} size="md" className={TYPO.title("semibold")}>
                      {w.name}
                    </Title>
                    <div className="flex flex-wrap items-center gap-2">
                      <Text size="xs" c="muted" className={`uppercase ${TYPO.title("medium")}`}>
                        {w.kind}
                      </Text>
                      <Text size="xs" c="muted">{w.when}</Text>
                    </div>
                  </div>
                  {w.note ? (
                    <span className={`shrink-0 text-sm ${TYPO.mono("semibold")}`}>{w.note}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHead
          icon={CalendarClock}
          title="Coming up"
          right={
            <Button variant="outline" size="sm" asChild>
              <a href="#/agenda/calendar">See full agenda</a>
            </Button>
          }
        />
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-6">
              {withDayBreaks(COMING_UP).map(({ row, day }, i) => (
                <div key={`${row.peer}-${row.when}`} className={day ? "flex flex-col gap-3" : ""}>
                  {day ? <Cap>{day}</Cap> : null}
                  <div className="flex items-center gap-4">
                    <span className={`w-14 shrink-0 text-sm ${TYPO.mono("semibold")}`}>
                      {row.when}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <Text size="md" className={TYPO.title("semibold")}>
                        {row.dir === "give" ? "You review " : "Reviewed by "}
                        {row.peer} — {row.project}
                      </Text>
                      <Text size="xs" c="muted">{row.loc}</Text>
                    </div>
                    {row.note ? (
                      <Badge variant="light" size="md" color="orange">{row.note}</Badge>
                    ) : null}
                  </div>
                  {/* A same-day sibling row rides along inside the day group above. */}
                  {!day && i === 0 ? null : null}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHead icon={LoaderCircle} title="In progress" />
        {IN_PROGRESS.map((p) => (
          <Card key={p.name} variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <Title order={3} size="md" className={TYPO.title("semibold")}>
                    {p.name}
                  </Title>
                  <Badge variant="light" size="md" color={p.color}>{p.status}</Badge>
                </div>
                <Text size="sm" c="secondary">{p.module}</Text>
                <Text size="xs" c="muted">{p.sub}</Text>
                {p.pct !== undefined ? (
                  <Progress variant="gradient" value={p.pct} size="sm" />
                ) : null}
              </div>
            </Card.Content>
          </Card>
        ))}
      </section>
    </div>

    {/* ── side rail ───────────────────────────────────────────────── */}
    <aside className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <SectionHead
          icon={CircleAlert}
          title="Action required"
          right={
            <Badge variant="light" size="md" color="orange">{ACTION_REQUIRED.length}</Badge>
          }
        />
        {/* The one gradient card of the screen: the rail leads with what to attack. */}
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-5">
              {ACTION_REQUIRED.map((t) => (
                <div key={t.title} className="flex flex-col gap-2">
                  <Text size="md" className={TYPO.title("semibold")}>{t.title}</Text>
                  {t.sub ? <Text size="xs" c="muted">{t.sub}</Text> : null}
                  <div className="flex items-center justify-between gap-3">
                    <Text size="sm" c="muted" className={TYPO.mono("semibold")}>{t.days} d</Text>
                    <Button variant="outline" size="xs">{t.action}</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* On the frame the Suggestions title and its card are two siblings of the rail, not
          a title wrapping its card. Reproduced as such. */}
      <SectionHead icon={Lightbulb} title="Suggestions" />

      <Card variant="default" padding="md">
        <Card.Content>
          <div className="flex flex-col gap-4">
            {SUGGESTIONS.map((s) => {
              const Icon = SUGGESTION_ICON[s.title] ?? MessageSquare
              return (
              <div key={s.title} className="flex items-start gap-3">
                <ThemeIcon color="pink" variant="light" size="md" radius="md">
                  <Icon size={20} />
                </ThemeIcon>
                <div className="flex min-w-0 flex-1 items-start justify-between gap-1">
                  <div className="flex min-w-0 flex-col gap-1">
                    <Text size="sm" className={TYPO.title("bold")}>{s.title}</Text>
                    <Text size="xs" c="secondary">{s.sub}</Text>
                  </div>
                  {s.href ? (
                    <Button variant="subtle" size="xs" aria-label={s.action} asChild>
                      <a href={s.href}><ArrowRight size={16} /></a>
                    </Button>
                  ) : (
                    <Button variant="subtle" size="xs" aria-label={s.action}>
                      <ArrowRight size={16} />
                    </Button>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        </Card.Content>
      </Card>

      <section className="flex flex-col gap-4">
        <SectionHead
          icon={Users}
          title="Friends"
          right={
            <Button variant="outline" size="xs" asChild>
              <a href="#/community/friends">See all</a>
            </Button>
          }
        />
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-5">
              {FRIENDS.map((f) => (
                <a key={f.login} href={`#/profile/${f.login}`} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={f.name} size="sm" />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <Text size="sm" className={TYPO.mono("semibold")}>{f.login}</Text>
                      <Text size="xs" c="muted">level {f.level}</Text>
                    </div>
                  </div>
                  <Badge variant="light" size="md" color={f.color}>{f.status}</Badge>
                </a>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>
    </aside>
  </div>
)
