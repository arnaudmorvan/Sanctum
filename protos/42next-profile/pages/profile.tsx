import type { ReactNode } from "react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Divider } from "@42/ui-react/divider"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { Ecran } from "../components/sidebar"
import { ACTIVITES, AILLEURS, CLASSE_NIVEAU, EN_COURS, LEARNER, MILESTONE, PRESENCE_LECTURE, PRESENCE_NOTE, PRESENCE_TOTAL, PROGRAMMES, STATS, VUES_PRESENCE, construirePresence } from "../data/profile"

/** Le titre de section vit au-dessus de la card - confirme sur 5 sections au run Figma.
 *  SectionTitle existe dans le DS Figma mais n'est pas expose par @42/ui-react.
 *  Vrai manque, consigne dans ds-actions.yaml (2e occurrence React). */
const Section = ({ titre, children }: { titre: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <Title order={2} size="lg">{titre}</Title>
    {children}
  </section>
)

const Case = ({ niveau }: { niveau: keyof typeof CLASSE_NIVEAU }) => (
  <div className={`size-3 rounded-sm ${CLASSE_NIVEAU[niveau]}`} />
)

const PRESENCE = construirePresence()

export const Profile = ({ login }: { login?: string }) => {
  const milestonePct = Math.round((MILESTONE.validees / MILESTONE.requises) * 100)
  const exigencesPct = Math.round((EN_COURS.faites / EN_COURS.total) * 100)

  return (
    <Ecran actif="My activities">
      <div className="flex flex-col gap-1">
        <Title order={1} size="2xl">{login ?? LEARNER.login}</Title>
        <Text c="secondary">{LEARNER.nom} - learner profile</Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  {/* CORRIGE le 2026-09-04 : Avatar EST expose par @42/ui-react
                      (import "@42/ui-react/avatar"). Le report du matin le declarait
                      COMPOSANT_MANQUANT et posait un Badge variant="gradient" a la
                      place — c'etait faux. Le fallback initiales est automatique a
                      partir de `name` ; la photo de la maquette ne peut pas transiter
                      par publish_proto, donc `src` reste vide, volontairement. */}
                  <Avatar size="lg" name={LEARNER.nom} color="initials" />
                  <div className="flex flex-col">
                    <Text>{LEARNER.nom}</Text>
                    <Text size="sm" c="muted">{LEARNER.presence}</Text>
                  </div>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <Title order={2} size="xl">LEVEL {LEARNER.level}</Title>
                  <Text size="sm" c="muted">{MILESTONE.nom}</Text>
                </div>
                <div className="flex items-center gap-4">
                  <div className="grow"><Progress value={LEARNER.levelPct} size="sm" /></div>
                  <Text size="sm">{LEARNER.xp}</Text>
                </div>
                <Text size="sm" c="muted">{LEARNER.parcours}</Text>
              </div>
            </Card.Content>
          </Card>

          <Section titre="Activities">
            <div className="flex flex-col gap-4">
              <Card variant="gradient" padding="lg">
                <Card.Content>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="light" color="blue">In progress</Badge>
                      <Badge variant="light" color="gray">{EN_COURS.tentative}</Badge>
                    </div>
                    <Title order={3}>{EN_COURS.nom}</Title>
                    <Text size="sm" c="muted">{EN_COURS.contexte}</Text>
                    <div className="flex items-baseline justify-between gap-3">
                      <Text size="sm">{EN_COURS.libelle}</Text>
                      <Text size="sm" c="muted">{EN_COURS.faites} / {EN_COURS.total}</Text>
                    </div>
                    <Progress value={exigencesPct} size="sm" />
                    <div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`#/activities/${EN_COURS.slug}`}>Open the activity</a>
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {ACTIVITES.map((a) => (
                <Card key={a.slug} variant="default" padding="lg">
                  <Card.Content>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Title order={3} size="lg">{a.nom}</Title>
                        <Text size="sm" c="muted">{a.contexte}</Text>
                      </div>
                      <div className="flex items-center gap-3">
                        <Text size="sm">{a.note} / {a.bareme}</Text>
                        <Badge variant="light" color="green">Validated</Badge>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </Section>

          <Section titre="Programs">
            <Card variant="default" padding="lg">
              <Card.Content>
                <Timeline size="md" lineVariant="solid">
                  {PROGRAMMES.map((p) => (
                    <Timeline.Item key={p.nom} title={p.nom}>
                      <Text size="sm" c="muted">{p.detail}</Text>
                      <Text size="xs" c="muted">{p.debut} - {p.fin}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Attendance">
            <Card variant="default" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <Text size="sm" c="secondary">Attendance view</Text>
                    <SegmentGroup size="sm" data={VUES_PRESENCE} defaultValue="Monthly" />
                  </div>
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex flex-col gap-1">
                      {PRESENCE.map((ligne, i) => (
                        <div key={i} className="flex gap-1">
                          {ligne.map((niveau, j) => <Case key={j} niveau={niveau} />)}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Title order={3} size="xl">{PRESENCE_TOTAL}</Title>
                      <Text size="sm" c="muted">{PRESENCE_NOTE}</Text>
                      <div className="flex items-center gap-2">
                        <Text size="xs" c="muted">Less</Text>
                        <div className="flex gap-1">
                          <Case niveau="vide" />
                          <Case niveau="faible" />
                          <Case niveau="moyen" />
                          <Case niveau="fort" />
                          <Case niveau="intense" />
                        </div>
                        <Text size="xs" c="muted">More</Text>
                      </div>
                    </div>
                  </div>
                  <Text size="sm" c="muted">{PRESENCE_LECTURE}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
          <Section titre="Stats">
            <Card variant="outline" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {STATS.map((s, i) => (
                    <div key={s.libelle} className="flex flex-col gap-4">
                      {i > 0 && <Divider />}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <Text>{s.libelle}</Text>
                          <Text size="sm" c="muted">{s.precision}</Text>
                        </div>
                        <Title order={3} size="xl">{s.valeur}</Title>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Current milestone">
            <Card variant="outline" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text>{MILESTONE.nom}</Text>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="sm" c="secondary">{MILESTONE.libelle}</Text>
                    <Text size="sm" c="muted">{MILESTONE.validees} / {MILESTONE.requises}</Text>
                  </div>
                  <Progress value={milestonePct} size="sm" />
                  <Text size="sm" c="muted">{MILESTONE.note}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Elsewhere on this profile">
            <Card variant="outline" padding="lg">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {AILLEURS.map((l, i) => (
                    <div key={l.libelle} className="flex flex-col gap-4">
                      {i > 0 && <Divider />}
                      <div className="flex flex-col gap-1">
                        <div><Button size="xs" variant="subtle">{l.libelle}</Button></div>
                        <Text size="sm" c="muted">{l.note}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>
        </aside>
      </div>
    </Ecran>
  )
}
