import type { ReactNode } from "react"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { MODULE, PROJECT } from "../data/learn"

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <Title order={2} size="md" className={TYPO.title()}>{title}</Title>
    {children}
  </section>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <Text size="xs" c="muted">{label}</Text>
    <Text size="sm">{value}</Text>
  </div>
)

/** Screen 3 — learn.project of the prototype, attempt 4 (validated). The 4 attempt tabs
 *  are a SegmentGroup; only the 4th carries data in this flow.
 *
 *  2026-09-08 — flat surfaces and no green: every "Passed" / "Validated" badge is an
 *  uncoloured outline, the word carries the verdict. */
export const Project = ({ slug }: { slug?: string }) => {
  const p = PROJECT

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[
        { label: "Learn", href: "#/learn/program" },
        { label: "My program", href: "#/learn/program" },
        { label: MODULE.name, href: `#/learn/module/${MODULE.slug}` },
        { label: p.name },
      ]} />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title order={1} size="2xl" className={TYPO.title()}>{p.name}</Title>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Validated</Badge>
            <Text size="sm" c="muted">{p.end}</Text>
          </div>
        </div>
        <Text size="sm" c="secondary">{p.abstract}</Text>
      </div>

      <Section title="My attempts">
        <div className="flex flex-col gap-4">
          <SegmentGroup size="sm" data={p.attempts} defaultValue={p.currentAttempt} />

          <Card variant="outline" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-5">
                <div><Badge variant="outline">Success</Badge></div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card variant="outline" padding="md">
                    <Card.Content>
                      <div className="flex flex-col gap-2">
                        <Title order={3} size="sm" className={TYPO.title()}>Project details</Title>
                        {p.details.map((d) => <Row key={d.key} label={d.key} value={d.value} />)}
                      </div>
                    </Card.Content>
                  </Card>
                  <Card variant="outline" padding="md">
                    <Card.Content>
                      <div className="flex flex-col gap-2">
                        <Title order={3} size="sm" className={TYPO.title()}>Subject & resources</Title>
                        {p.resources.map((r) => (
                          <div key={r.title} className="flex flex-col gap-1">
                            <Text size="sm">{r.title}</Text>
                            <Text size="xs" c="muted">{r.note}</Text>
                          </div>
                        ))}
                      </div>
                    </Card.Content>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {p.timings.map((t) => (
                    <div key={t.key} className="flex flex-col gap-1">
                      <Text size="xs" c="muted">{t.key}</Text>
                      <Text size="sm">{t.value}</Text>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <Text size="xs" c="muted">Git repository</Text>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Git address: mono in the prototype, family unreachable here. */}
                    <Text size="sm" span>{p.repo}</Text>
                    <Button size="xs" variant="outline">Copy</Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {p.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {i > 0 && <Text size="sm" c="muted">›</Text>}
                      <Badge variant="outline">{i + 1} · {s} · Passed</Badge>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {p.reviews.map((r) => (
                    <Card key={r.step} variant="outline" padding="md">
                      <Card.Content>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Title order={3} size="sm" className={TYPO.title()}>{r.step}</Title>
                              <Text size="xs" c="secondary">{r.by}</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Text size="xs" c="muted">{r.day}</Text>
                              <Badge variant="outline">{r.verdict}</Badge>
                            </div>
                          </div>
                          <Text size="xs" c="muted">{r.slot}</Text>
                          <Text size="sm">{r.text}</Text>
                        </div>
                      </Card.Content>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Text size="sm">{p.cta}</Text>
                  <Button size="sm">Give feedback</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </Section>
    </div>
  )
}
