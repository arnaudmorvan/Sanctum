import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Divider } from "@42/ui-react/divider"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
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
import { PageHead, Section, Tag } from "./shell"

/** Home — `P['dashboard']` of the prototype.
 *
 *  The page answers four questions in this order, and the order is the point: where do I
 *  stand (hero), what did I just win, what is coming at me, and what am I holding.
 *
 *  2026-09-08 — every card is `outline`: transparent surface, no green on the wins, no
 *  orange fill on the tasks. The hierarchy is carried by the order of the sections and by
 *  the words, not by the tint of the surfaces. */

const HERO_STATS = [
  { k: "Level", v: HERO.level, href: "#/me/profile" },
  { k: "Milestone", v: HERO.milestone, href: "#/progression/milestones" },
  { k: "YAMS status", v: HERO.yams, href: "#/progression/yams" },
]

/** The day separators the agenda block drew: a row only carries its day when it opens a
 *  new one. */
const withDayBreaks = (rows: typeof COMING_UP) =>
  rows.map((row, i) => ({ row, day: i === 0 || rows[i - 1].day !== row.day ? row.day : null }))

export const Dashboard = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-4">
      <PageHead title={`${HERO.greeting}, ${HERO.login}`} />
      <div className="flex flex-wrap items-center gap-3">
        <Text size="sm" c="secondary">{HERO.program}</Text>
        <span className="h-1 w-1 rounded-full bg-white/25" />
        <Text size="sm" c="secondary">
          Day <b className={TYPO.mono()}>{HERO.day}</b>
        </Text>
      </div>

      <div className="flex flex-wrap items-stretch gap-3">
        {HERO_STATS.map((s) => (
          <a key={s.k} href={s.href} className="min-w-40 flex-1">
            <Card variant="outline" padding="sm" className="h-full">
              <Card.Content>
                <div className="flex flex-col gap-1">
                  <Text size="xs" c="muted">{s.k}</Text>
                  <span className={`text-lg ${TYPO.mono()}`}>{s.v}</span>
                  {s.k === "Milestone" ? (
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${HERO.milestonePct}%` }} />
                    </div>
                  ) : null}
                </div>
              </Card.Content>
            </Card>
          </a>
        ))}
      </div>
    </div>

    {/* The quote is the prototype's one moment of levity. It is content, not chrome. */}
    <Card variant="outline" padding="md">
      <Card.Content>
        <Text size="sm" c="secondary" className="italic">“{QUOTE}”</Text>
      </Card.Content>
    </Card>

    <Section title="Wins">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {WINS.map((w) => (
          <Card key={w.name} variant="outline" padding="sm">
            <Card.Content>
              <div className="flex flex-col gap-1">
                <Text size="xs" c="muted" className="uppercase">{w.kind}</Text>
                <Title order={3} size="sm" className={TYPO.title("semibold")}>{w.name}</Title>
                <div className="flex items-center justify-between gap-2">
                  <Text size="xs" c="secondary">{w.when}</Text>
                  {w.note ? <span className={`text-xs ${TYPO.mono()}`}>{w.note}</span> : null}
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Section
        title="Coming up"
        right={
          <Button variant="subtle" size="xs" asChild>
            <a href="#/agenda/calendar">See full agenda</a>
          </Button>
        }
      >
        <Card variant="outline" padding="none">
          <Card.Content>
            <div className="flex flex-col">
              {withDayBreaks(COMING_UP).map(({ row, day }) => (
                <div key={`${row.peer}-${row.when}`}>
                  {day ? (
                    <div className="px-4 pt-4 pb-1">
                      <Text size="xs" c="muted" className="uppercase">{day}</Text>
                    </div>
                  ) : null}
                  <div className={`flex items-center gap-3 px-4 py-3 ${row.open ? "bg-white/5" : ""}`}>
                    <span className={`w-14 shrink-0 text-sm ${TYPO.mono("semibold")}`}>{row.when}</span>
                    <div className="min-w-0 flex-1">
                      <Text size="sm">
                        {row.dir === "give" ? "You review " : "Reviewed by "}
                        <b className={TYPO.mono()}>{row.peer}</b> — {row.project}
                      </Text>
                      <Text size="xs" c="muted">{row.loc}</Text>
                    </div>
                    {row.note ? <Tag>{row.note}</Tag> : null}
                  </div>
                  <Divider />
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </Section>

      <div className="flex flex-col gap-8">
        <Section
          title="Action required"
          right={<Badge variant="outline" size="sm">{ACTION_REQUIRED.length}</Badge>}
        >
          <div className="flex flex-col gap-3">
            {ACTION_REQUIRED.map((t) => (
              <Card key={t.title} variant="outline" padding="sm">
                <Card.Content>
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <Text size="sm">{t.title}</Text>
                      {t.sub ? <Text size="xs" c="muted">{t.sub}</Text> : null}
                    </div>
                    <Text size="xs" c="muted" className="shrink-0">{t.days} d</Text>
                    <Button variant="outline" size="xs">{t.action}</Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Suggestions">
          <div className="flex flex-col gap-3">
            {SUGGESTIONS.map((s) => (
              <Card key={s.title} variant="outline" padding="sm">
                <Card.Content>
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <Text size="sm">{s.title}</Text>
                      <Text size="xs" c="muted">{s.sub}</Text>
                    </div>
                    {s.href ? (
                      <Button variant="subtle" size="xs" asChild>
                        <a href={s.href}>{s.action}</a>
                      </Button>
                    ) : (
                      <Button variant="subtle" size="xs">{s.action}</Button>
                    )}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Section title="In progress">
        <div className="flex flex-col gap-3">
          {IN_PROGRESS.map((p) => (
            <Card key={p.name} variant="outline" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <Title order={3} size="sm" className={TYPO.title("semibold")}>{p.name}</Title>
                    <Tag color={p.color}>{p.status}</Tag>
                  </div>
                  <Text size="xs" c="secondary">{p.module}</Text>
                  <Text size="xs" c="muted">{p.sub}</Text>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Friends"
        right={
          <Button variant="subtle" size="xs" asChild>
            <a href="#/community/friends">See all</a>
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          {FRIENDS.map((f) => (
            <a key={f.login} href={`#/profile/${f.login}`}>
              <Card variant="outline" padding="sm">
                <Card.Content>
                  <div className="flex items-center gap-3">
                    <Avatar name={f.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Text size="sm" className={TYPO.mono("semibold")}>{f.login}</Text>
                      <Text size="xs" c="muted">level {f.level}</Text>
                    </div>
                    <Tag color={f.color}>{f.status}</Tag>
                  </div>
                </Card.Content>
              </Card>
            </a>
          ))}
        </div>
      </Section>
    </div>
  </div>
)
