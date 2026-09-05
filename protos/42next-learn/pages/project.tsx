import type { ReactNode } from "react"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { MODULE, PROJET } from "../data/learn"

const Section = ({ titre, children }: { titre: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <Title order={2} size="md" className={TYPO.texte()}>{titre}</Title>
    {children}
  </section>
)

const Ligne = ({ cle, valeur }: { cle: string; valeur: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <Text size="xs" c="muted">{cle}</Text>
    <Text size="sm">{valeur}</Text>
  </div>
)

/** Ecran 3 — learn.project du proto, tentative 4 (validee). Une card
 *  d'attempt en padding lg, tout le reste en md. Les 4 onglets d'attempt sont
 *  un SegmentGroup ; seule la 4e a des donnees dans ce parcours. */
export const Project = ({ slug }: { slug?: string }) => {
  const p = PROJET

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[
        { label: "Learn", href: "#/learn/program" },
        { label: "My program", href: "#/learn/program" },
        { label: MODULE.nom, href: `#/learn/module/${MODULE.slug}` },
        { label: p.nom },
      ]} />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title order={1} size="2xl" className={TYPO.texte()}>{p.nom}</Title>
          <div className="flex items-center gap-2">
            <Badge variant="light" color="green">Validated</Badge>
            <Text size="sm" c="muted">{p.fin}</Text>
          </div>
        </div>
        <Text size="sm" c="secondary">{p.abstract}</Text>
      </div>

      <Section titre="My attempts">
        <div className="flex flex-col gap-4">
          <SegmentGroup size="sm" data={p.tentatives} defaultValue={p.tentativeCourante} />

          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-5">
                <div><Badge variant="light" color="green">Success</Badge></div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card variant="default" padding="md">
                    <Card.Content>
                      <div className="flex flex-col gap-2">
                        <Title order={3} size="sm" className={TYPO.texte()}>Project details</Title>
                        {p.details.map((d) => <Ligne key={d.cle} cle={d.cle} valeur={d.valeur} />)}
                      </div>
                    </Card.Content>
                  </Card>
                  <Card variant="default" padding="md">
                    <Card.Content>
                      <div className="flex flex-col gap-2">
                        <Title order={3} size="sm" className={TYPO.texte()}>Subject & resources</Title>
                        {p.ressources.map((r) => (
                          <div key={r.titre} className="flex flex-col gap-1">
                            <Text size="sm">{r.titre}</Text>
                            <Text size="xs" c="muted">{r.note}</Text>
                          </div>
                        ))}
                      </div>
                    </Card.Content>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {p.chrono.map((c) => (
                    <div key={c.cle} className="flex flex-col gap-1">
                      <Text size="xs" c="muted">{c.cle}</Text>
                      <Text size="sm">{c.valeur}</Text>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <Text size="xs" c="muted">Git repository</Text>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Adresse git : mono dans le proto, famille inatteignable ici. */}
                    <Text size="sm" span>{p.repo}</Text>
                    <Button size="xs" variant="outline">Copy</Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {p.etapes.map((e, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {i > 0 && <Text size="sm" c="muted">›</Text>}
                      <Badge variant="light" color="green">{i + 1} · {e} · Passed</Badge>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {p.reviews.map((r) => (
                    <Card key={r.etape} variant="default" padding="md">
                      <Card.Content>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Title order={3} size="sm" className={TYPO.texte()}>{r.etape}</Title>
                              <Text size="xs" c="secondary">{r.par}</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Text size="xs" c="muted">{r.jour}</Text>
                              <Badge variant="light" color="green">{r.verdict}</Badge>
                            </div>
                          </div>
                          <Text size="xs" c="muted">{r.creneau}</Text>
                          <Text size="sm">{r.texte}</Text>
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
