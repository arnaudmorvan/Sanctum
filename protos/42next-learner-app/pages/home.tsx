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
  CircleCheck,
  ClipboardCheck,
  Flag,
  Gift,
  Lightbulb,
  LoaderCircle,
  MessageSquare,
  Play,
  Quote,
  RotateCcw,
  Sparkles,
  Trophy,
  UserRound,
  Users,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { TYPO } from "../../../src/typo"
import {
  COMING_UP,
  FRIENDS,
  HERO,
  OWED,
  QUOTE,
  SUGGESTIONS,
  WINS,
  WIP,
} from "../data/home"

/** Home — `P['dashboard']` of the artifact.
 *
 *  WHAT THE SCREEN ANSWERS, in the artifact's own order: who I am and where I stand
 *  (greeting, program, day, the three readouts), what just closed (Wins), what is booked
 *  (Coming up), what is OWED (Action required) and what is merely available
 *  (Suggestions), what is open (In progress), and who I have been crossing paths with
 *  (Friends). The two temperatures — owed versus available — are the artifact's own
 *  distinction and the reason they are two panels and not one list: a suggestion is not
 *  a debt, and only debts are counted in the header.
 *
 *  WHAT THE PORT CHANGED, and why none of it is cosmetic:
 *  - THREE COLUMNS. The skeleton carries the sidebar; the content area splits into a main
 *    column and a 340 rail — the "Learning dashboard" template of `foundations-layout`.
 *    The artifact stacked two 2/3 + 1/3 bands instead, which put Friends level with In
 *    progress; here the rail is one column and it LEADS with what to attack.
 *  - ONE CARD PER LIST. Wins, Coming up, Action required, Suggestions and Friends are each
 *    a single `padding="lg"` card holding rows. In progress stays one card per project:
 *    each row carries its own action, and that is the stated exception.
 *  - THE SIGNATURE OUTLINE is on Action required, at the head of the rail — one `gradient`
 *    card on the screen, and it marks the thing to attack.
 *  - THE EMOJI ARE GONE. The artifact celebrated with 🎉 / 🏆 / 🏁 chips, confetti and an
 *    emoji rain. `review:storytelling` asks for the grammar of the game and not its
 *    aesthetics, so a win is a glyph in a `ThemeIcon` and the reward is that the row is
 *    there at all. The billiard-break facepile went the same way.
 *  - THE HUES SHRANK. Every status badge is grey: the label carries the meaning. Pink
 *    predominates through the gradient — the entry-point card and the milestone Progress.
 *
 *  STAGED BUILD: the actions on this screen will get their `href` as the target screens
 *  land in the following commits. Nothing here links to a route that does not exist. */

/** Uppercase label, Lato Bold 14 — `Typography-1/Text sm/BoldCap`. `Text` exposes neither
 *  weight nor transform, so both go through the className. */
const Cap = ({ children }: { children: ReactNode }) => (
  <Text size="sm" c="muted" className={`uppercase ${TYPO.title("bold")}`}>
    {children}
  </Text>
)

/** `sectiontitle` at `size=xl`: a lucide glyph at 24 and a Lato Bold 24 title. The DS
 *  component has no 1:1 in the kit and its Figma icon has no swap property, so the glyph
 *  is chosen here, per section. */
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

/** The artifact's `hero-status`: three readings, each with its own page. Only the
 *  milestone carries a bar — a number there would compete with the level. */
const HERO_STATS: { k: string; v: string; bar?: number }[] = [
  { k: "Level", v: HERO.level },
  { k: "Milestone", v: HERO.milestone, bar: HERO.milestonePct },
  { k: "YAMS status", v: HERO.yams },
]

/** ⚠️ REASONED glyph choices, not a survey: the artifact carried its own 18px line set and
 *  no Figma frame backs this flow. `review:icons` asks that such a choice be declared as
 *  one rather than passed off as a match. */
const WIN_ICON: Record<string, ComponentType<{ size?: number }>> = {
  project: CircleCheck,
  exam: Trophy,
  milestone: Flag,
  gift: Gift,
}
const WIN_WHAT: Record<string, string> = {
  project: "Project validated",
  exam: "Exam passed",
  milestone: "Milestone validated",
  gift: "Sent by a peer",
}
const AGENDA_ICON: Record<string, ComponentType<{ size?: number }>> = {
  give: ClipboardCheck,
  get: UserRound,
  event: Sparkles,
  exam: BookOpen,
}
const SUGGESTION_ICON: Record<string, ComponentType<{ size?: number }>> = {
  retry: RotateCcw,
  feedback: MessageSquare,
  module: BookOpen,
  project: Play,
  schedule: CalendarPlus,
}

/** The day separators the artifact's agenda drew: a row only carries its day when it
 *  opens a new one. */
const withDayBreaks = (rows: typeof COMING_UP) =>
  rows.map((row, i) => ({
    row,
    day: i === 0 || rows[i - 1].day !== row.day ? row.day : null,
  }))

export const Home = () => (
  <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
    {/* ── main column ─────────────────────────────────────────────── */}
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Title order={1} size="3xl" className={TYPO.title("semibold")}>
          {HERO.greeting}, {HERO.login}
        </Title>

        <div className="flex flex-wrap items-center gap-3">
          <Text size="sm" c="secondary">
            {HERO.program}
          </Text>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <Text size="sm" c="secondary">
            Day <b className={TYPO.mono("semibold")}>{HERO.day}</b>
          </Text>
        </div>

        <div className="flex flex-wrap items-stretch gap-4">
          {HERO_STATS.map((s) => (
            <Card key={s.k} variant="default" padding="lg" className="min-w-40 flex-1">
              <Card.Content>
                <div className="flex flex-col gap-2">
                  <Cap>{s.k}</Cap>
                  {/* Kode Mono SemiBold: a level, a milestone ordinal and a monitoring
                      verdict all measure. The kit's Title scale stops at 3xl = 30, so the
                      step goes through the className. */}
                  <span className={`text-4xl ${TYPO.mono("semibold")}`}>{s.v}</span>
                  {s.bar !== undefined ? (
                    <Progress variant="gradient" value={s.bar} size="sm" />
                  ) : null}
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>

      {/* The quote is the artifact's one moment of levity, and it is not a notification:
          no title, no action, no urgency. */}
      <Alert
        variant="light"
        type="info"
        icon={<Quote size={18} />}
        description={`\"${QUOTE}\"`}
      />

      <section className="flex flex-col gap-4">
        <SectionHead icon={Trophy} title="Wins" />
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-4">
              {WINS.map((w) => {
                const Icon = WIN_ICON[w.kind] ?? CircleCheck
                return (
                  <div key={w.name} className="flex items-center gap-4">
                    {/* a thank-you is not a validation: it keeps the second identity hue */}
                    <ThemeIcon
                      variant="light"
                      color={w.kind === "gift" ? "purple" : "pink"}
                      size="md"
                      radius="md"
                    >
                      <Icon size={20} />
                    </ThemeIcon>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <Text size="md" className={TYPO.title("semibold")}>
                        {w.name}
                      </Text>
                      <div className="flex flex-wrap items-center gap-2">
                        <Text
                          size="xs"
                          c="muted"
                          className={`uppercase ${TYPO.title("medium")}`}
                        >
                          {WIN_WHAT[w.kind]}
                        </Text>
                        <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                          {w.when}
                        </Text>
                      </div>
                    </div>
                    {w.note ? (
                      <span className={`shrink-0 text-sm ${TYPO.mono("semibold")}`}>
                        {w.note}
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </Card.Content>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHead
          icon={CalendarClock}
          title="Coming up"
          right={
            <Button variant="outline" size="sm">
              See full agenda
            </Button>
          }
        />
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-6">
              {withDayBreaks(COMING_UP).map(({ row, day }) => {
                const Icon = AGENDA_ICON[row.kind] ?? ClipboardCheck
                return (
                  <div key={`${row.title}-${row.at}`} className="flex flex-col gap-3">
                    {day ? <Cap>{day}</Cap> : null}
                    <div className="flex items-start gap-4">
                      {/* a schedule measures: hour and duration are both machine */}
                      <div className="flex w-16 shrink-0 flex-col gap-0.5">
                        <Text size="sm" className={TYPO.mono("semibold")}>
                          {row.at}
                        </Text>
                        {row.dur ? (
                          <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                            {row.dur}
                          </Text>
                        ) : null}
                      </div>
                      <ThemeIcon
                        variant="light"
                        color={row.kind === "event" ? "purple" : "pink"}
                        size="md"
                        radius="md"
                      >
                        <Icon size={20} />
                      </ThemeIcon>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <Text size="md" className={TYPO.title("semibold")}>
                          {row.title}
                        </Text>
                        {row.sub ? (
                          <Text size="xs" c="muted">
                            {row.sub}
                          </Text>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {row.note ? (
                          <Badge variant="light" size="md" color="gray">
                            {row.note}
                          </Badge>
                        ) : null}
                        {row.cta ? (
                          <Button variant="filled" size="xs">
                            {row.cta}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* One card per project, and it is the stated exception to "a list lives in ONE
          card": every row here carries its own action. */}
      <section className="flex flex-col gap-4">
        <SectionHead icon={LoaderCircle} title="In progress" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {WIP.map((p) => (
            <Card key={p.name} variant="default" padding="lg">
              <Card.Content>
                <div className="flex h-full flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <Title order={3} size="md" className={TYPO.title("semibold")}>
                        {p.name}
                      </Title>
                      <Text size="xs" c="muted">
                        {p.module}
                      </Text>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {p.milestone ? (
                        <Badge
                          variant="outline"
                          size="sm"
                          color="gray"
                          className={TYPO.mono("semibold")}
                        >
                          {p.milestone}
                        </Badge>
                      ) : null}
                      <Badge variant="light" size="md" color="gray">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                  <Text size="sm" c="secondary">
                    Started <b className={TYPO.mono("semibold")}>{p.since}</b>{" "}
                    {p.since === 1 ? "day" : "days"} ago
                  </Text>
                  {p.peers.length ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        {p.peers.slice(0, 3).map((l) => (
                          <Avatar
                            key={l}
                            name={l}
                            color="initials"
                            size="sm"
                            className="-mr-2 last:mr-0"
                          />
                        ))}
                      </div>
                      <Text size="xs" c="muted">
                        other learners also working on this project
                      </Text>
                    </div>
                  ) : null}
                  <Button variant="outline" size="sm" className="mt-auto self-end">
                    Go to project
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>
    </div>

    {/* ── side rail: what to attack, then what is on offer, then who ── */}
    <aside className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <SectionHead
          icon={CircleAlert}
          title="Action required"
          right={
            <Badge variant="light" size="md" color="gray">
              {OWED.length}
            </Badge>
          }
        />
        {/* The one gradient card of the screen. */}
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-5">
              {OWED.map((t) => (
                <div key={t.title} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    {t.group ? (
                      <div className="flex shrink-0 items-center">
                        {t.group.slice(0, 3).map((l) => (
                          <Avatar
                            key={l}
                            name={l}
                            color="initials"
                            size="sm"
                            className="-mr-2 last:mr-0"
                          />
                        ))}
                      </div>
                    ) : t.peer ? (
                      <Avatar name={t.peer} color="initials" size="sm" />
                    ) : (
                      /* nobody is waiting on the other side of this one: it is your own
                         attempt asking who helped you */
                      <ThemeIcon variant="light" color="purple" size="md" radius="full">
                        <Sparkles size={18} />
                      </ThemeIcon>
                    )}
                    <Text size="sm" className={TYPO.title("semibold")}>
                      {t.title}
                    </Text>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    {/* the debt ages, and the age is a quantity */}
                    <Text size="sm" c="muted" className={TYPO.mono("semibold")}>
                      {t.days} d
                    </Text>
                    <Button variant="outline" size="xs">
                      {t.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHead icon={Lightbulb} title="Suggestions" />
        <Card variant="default" padding="md">
          <Card.Content>
            <div className="flex flex-col gap-4">
              {SUGGESTIONS.map((s) => {
                const Icon = SUGGESTION_ICON[s.kind] ?? MessageSquare
                return (
                  <div key={s.title} className="flex items-start gap-3">
                    <ThemeIcon variant="light" color="pink" size="md" radius="md">
                      <Icon size={20} />
                    </ThemeIcon>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Text size="sm" className={TYPO.title("bold")}>
                        {s.title}
                      </Text>
                      <Text size="xs" c="secondary">
                        {s.sub}
                      </Text>
                      <Button
                        variant="subtle"
                        size="xs"
                        className="self-start"
                        endSlot={<ArrowRight size={14} />}
                      >
                        {s.action}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card.Content>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHead icon={Users} title="Friends" />
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-wrap gap-4">
              {FRIENDS.map((f) => (
                <div key={f} className="flex w-16 flex-col items-center gap-2">
                  <Avatar name={f} color="initials" size="lg" />
                  <Text size="xs" c="secondary" className={TYPO.mono("medium")}>
                    {f}
                  </Text>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>
    </aside>
  </div>
)
