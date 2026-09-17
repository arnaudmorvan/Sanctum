import type { ReactNode } from "react"
import { FileCheck, Grid2x2, ListChecks, Target } from "lucide-react"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { MODULES } from "../data/modules"

/** The drill-down behind « Open module ». Same grammar as the home: one gradient card
 *  (the activity under way — what to attack here), everything else in default cards.
 *  The locked activity KEEPS its disabled button with the condition written next to it:
 *  a disabled action says more than a hidden one. */

const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center gap-1.5 text-gray-dark-400">
      {icon}
      <Title order={2} size="md" className={TYPO.title()}>{title}</Title>
    </div>
    {children}
  </section>
)

export const ModuleDetail = ({ slug }: { slug?: string }) => {
  const module = MODULES[slug ?? ""] ?? MODULES["web-server-from-scratch"]
  const pct = Math.round((module.current.met / module.current.total) * 100)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <Text size="xs" c="muted" className={TYPO.title("medium") + " uppercase"}>Learn · Modules</Text>
        <Title order={1} size="3xl" className={TYPO.title()}>{module.name}</Title>
        <Text size="sm" c="secondary">{module.summary}</Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <Text size="xs" c="secondary" className={TYPO.title() + " uppercase"}>Under way</Text>
                <Title order={3} size="md" className={TYPO.title()}>{module.current.name}</Title>
                <Text size="sm" c="secondary">{module.current.note}</Text>
                <div className="flex items-baseline justify-between gap-3">
                  <Text size="sm" c="muted" className={TYPO.title("medium")}>Steps done</Text>
                  <Text size="sm" className={TYPO.mono()}>{module.current.met} / {module.current.total}</Text>
                </div>
                <Progress variant="gradient" value={pct} size="sm" />
                <div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="#/home">Back to home</a>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Section title="Validation requirements" icon={<ListChecks size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {module.requirements.map((r) => (
                    <div key={r.label} className="flex flex-wrap items-center justify-between gap-3">
                      <Text size="sm" className={TYPO.title("medium")}>{r.label}</Text>
                      <Text size="sm" className={TYPO.mono()}>{r.state}</Text>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Activities" icon={<Target size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {module.activities.map((a) => (
                    <div key={a.name} className="flex flex-wrap items-center justify-between gap-3">
                      <Text size="sm" className={TYPO.title("medium")}>{a.name}</Text>
                      <div className="flex items-center gap-3">
                        <Text size="sm" className={TYPO.mono()}>{a.score}</Text>
                        <Badge variant="light" color="gray">{a.status}</Badge>
                        {a.status === "Locked" ? (
                          <Button size="xs" variant="outline" disabled>Opens after Activity 04</Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
          <Section title="Exam" icon={<FileCheck size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-1">
                  <Text size="sm" className={TYPO.mono()}>{module.exam.stamp}</Text>
                  <Text size="sm" className={TYPO.title()}>{module.exam.label}</Text>
                  <Text size="xs" c="muted">{module.exam.note}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section title="Skills touched" icon={<Grid2x2 size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-wrap gap-2">
                  {module.skills.map((s) => (
                    <Badge key={s} variant="light" color="gray">{s}</Badge>
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
