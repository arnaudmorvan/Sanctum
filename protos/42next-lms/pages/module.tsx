import type { ReactNode } from "react"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { MODULE, STATUS_BADGE } from "../data/learn"

const Section = ({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-baseline justify-between gap-3">
      <Title order={2} size="md" className={TYPO.title()}>{title}</Title>
      {aside}
    </div>
    {children}
  </section>
)

/** The prototype's tick / circle (✓ / ○): characters, not icons — they travel. */
const Tick = ({ done }: { done: boolean }) => (
  <Text span size="sm" c={done ? "default" : "muted"}>{done ? "✓" : "○"}</Text>
)

/** Screen 2 — learn.module of the prototype. Two columns: requirements + activities on
 *  the left, skills + exam on the right. The version switch stays inert.
 *
 *  2026-09-08 — flat surfaces, and no green/red status hue: the activity in progress is
 *  no longer distinguished by a pink gradient card but by the fact that it is the only
 *  one whose "Open" button works. */
export const Module = ({ slug }: { slug?: string }) => {
  const m = MODULE
  const requirementsPct = Math.round((m.requirements.done / m.requirements.total) * 100)

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[{ label: "Learn", href: "#/learn/program" }, { label: "My program", href: "#/learn/program" }, { label: m.name }]} />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title order={1} size="2xl" className={TYPO.title()}>{m.name}</Title>
          <div className="flex flex-wrap items-center gap-3">
            <Text size="sm" c="muted">Started {m.start}</Text>
            <Badge variant="outline">{m.version}</Badge>
            <Badge variant="light" color="blue">{m.nextVersion.number} · {m.nextVersion.note}</Badge>
            <Button size="sm" variant="outline">Update to {m.nextVersion.number}</Button>
          </div>
        </div>
        <Text size="sm" c="secondary">{m.abstract}</Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          <Section title="Validation requirements" aside={<Text size="sm" c="muted">{m.requirements.done}/{m.requirements.total}</Text>}>
            <Card variant="outline" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  {/* The prototype renders this block as monospace YAML. The mono family
                      is unreachable through a kit prop: rendered as a list, keys and
                      identifiers kept exactly as they are. */}
                  <Text size="xs" c="muted">validation-conditions:</Text>
                  {m.requirements.groups.map((g) => (
                    <div key={g.key} className="flex flex-col gap-1">
                      <Text size="xs" c="secondary">{g.key}:</Text>
                      {g.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-2">
                          <Tick done={it.done} />
                          <Text size="sm" c={it.done ? "default" : "muted"}>- {it.id}</Text>
                        </div>
                      ))}
                    </div>
                  ))}
                  <Progress variant="gradient" value={requirementsPct} size="sm" />
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Activities">
            <div className="flex flex-col gap-3">
              {m.activities.map((a, i) => {
                const b = STATUS_BADGE[a.status]
                return (
                  <div key={a.slug} className="flex flex-col gap-3">
                    {i > 0 && <Text size="sm" c="muted">↓</Text>}
                    <Card variant="outline" padding="md">
                      <Card.Content>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Title order={3} size="sm" className={TYPO.title()}>{a.name}</Title>
                              <Badge variant="outline">{b.label}</Badge>
                            </div>
                            <Text size="xs" c="muted">{a.type}</Text>
                          </div>
                          {a.open ? (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`#/learn/project/${a.slug}`}>Open</a>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>Open</Button>
                          )}
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                )
              })}
            </div>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
          <Section title="Skills" aside={<Text size="sm" c="muted">{m.skills.done}/{m.skills.total}</Text>}>
            <Card variant="outline" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-2">
                  {m.skills.list.map((s) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <Tick done={s.done} />
                      <Text size="sm" c={s.done ? "default" : "muted"}>{s.name}</Text>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Exam">
            <Card variant="outline" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <Title order={3} size="sm" className={TYPO.title()}>Exam</Title>
                    <Badge variant="outline">{m.exam.status}</Badge>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="xs" c="muted">{m.exam.last}</Text>
                    {/* A score is a counter: machine register (Kode Mono Bold). */}
                    <Text size="sm" className={TYPO.mono()}>{m.exam.score} / {m.exam.outOf}</Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">Attempt history</Button>
                    <Button size="sm">Register again</Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Section>
        </aside>
      </div>
    </div>
  )
}
