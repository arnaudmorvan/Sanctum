import type { ReactNode } from "react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { ACTIVITES, AILLEURS, CLASSE_NIVEAU, EN_COURS, LEARNER, MILESTONE, PRESENCE_LECTURE, PRESENCE_NOTE, PRESENCE_TOTAL, PROGRAMMES, STATS, VUES_PRESENCE, construirePresence } from "../data/profile"

/** REPASSE DE CONFORMITE 2026-09-04, contre la frame 22489:9756.
 *  Tous les couples (variant, padding) de Card, toutes les tailles de titre et
 *  tous les gaps ci-dessous sont RELEVES sur la frame, pas choisis. Ne pas les
 *  "harmoniser" : un gap uniforme est le defaut de generation que
 *  foundations-layout corrige explicitement.
 *
 *  Correspondance des gaps Figma -> Tailwind : 4=gap-1, 8=gap-2, 12=gap-3,
 *  16=gap-4, 20=gap-5, 24=gap-6, 40=gap-10.
 *  Le padding interne d'une card est porte par la prop `padding` (lg=24, md=16,
 *  sm=12) : ne jamais le reposer a la main sur Card.Content. */

/** SectionTitle du DS Figma : size=sm, titre en Typography-1/Text md/Bold (16px),
 *  icone en tete, gap 6 entre les deux. L'icone est absente ici — aucun asset ne
 *  transite par publish_proto. size="md" mappe le cran Figma `Text md` par son nom.
 *  L'echelle etait auparavant size="lg" : titres trop gros, signal de rejet 9. */
const Section = ({ titre, children }: { titre: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <Title order={2} size="md">{titre}</Title>
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
    <div className="flex flex-col gap-10">
      {/* PageHeader Figma : V gap 6, titre en Display sm/Bold (30px). */}
      <div className="flex flex-col gap-1.5">
        <Title order={1} size="2xl">{login ?? LEARNER.login}</Title>
        <Text size="sm" c="secondary">{LEARNER.nom} - learner profile</Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          {/* Identity : releve gradient/lg. Etait default/lg — le contour rose
              signature manquait sur la card d'identite (rejet 11). */}
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-5">
                  {/* Avatar Figma : size=2xl, shape=circle. Le kit plafonne a xl.
                      src vide : la photo ne peut pas transiter par publish_proto. */}
                  <Avatar size="xl" name={LEARNER.nom} color="initials" />
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <Text size="sm">{LEARNER.nom}</Text>
                      <Text size="xs" c="muted">{LEARNER.presence}</Text>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <Title order={2} size="xl">LEVEL {LEARNER.level}</Title>
                      <Text size="xs" c="muted">{MILESTONE.nom}</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Progress Figma : axe Color=Pink. En React le degrade
                          signature passe par variant="gradient" (defaut CVA
                          purple-300 -> pink-400). review:color exige le degrade,
                          jamais une couleur unie. */}
                      <div className="grow"><Progress variant="gradient" value={LEARNER.levelPct} size="sm" /></div>
                      <Text size="sm">{LEARNER.xp}</Text>
                    </div>
                    <Text size="xs" c="muted">{LEARNER.parcours}</Text>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Section titre="Activities">
            <div className="flex flex-col gap-4">
              {/* Current activity : releve gradient/md. Etait gradient/lg. */}
              <Card variant="gradient" padding="md">
                <Card.Content>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="light" color="blue">In progress</Badge>
                      <Badge variant="light" color="gray">{EN_COURS.tentative}</Badge>
                    </div>
                    {/* Figma : Text sm/Bold (14px). Etait Title sans size, donc
                        au defaut par order — plusieurs crans trop gros. */}
                    <Title order={3} size="sm">{EN_COURS.nom}</Title>
                    <Text size="xs" c="muted">{EN_COURS.contexte}</Text>
                    <div className="flex items-baseline justify-between gap-3">
                      <Text size="sm">{EN_COURS.libelle}</Text>
                      <Text size="sm" c="muted">{EN_COURS.faites} / {EN_COURS.total}</Text>
                    </div>
                    <Progress variant="gradient" value={exigencesPct} size="sm" />
                    <div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`#/activities/${EN_COURS.slug}`}>Open the activity</a>
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Past activity : releve default/md, past-row H gap 12,
                  past-copy V gap 4, past-right H gap 12. Etait default/lg. */}
              {ACTIVITES.map((a) => (
                <Card key={a.slug} variant="default" padding="md">
                  <Card.Content>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Title order={3} size="sm">{a.nom}</Title>
                        <Text size="xs" c="muted">{a.contexte}</Text>
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
            <Card variant="default" padding="md">
              <Card.Content>
                <Timeline size="md" lineVariant="solid">
                  {PROGRAMMES.map((p) => (
                    <Timeline.Item key={p.nom} title={p.nom}>
                      <Text size="md" c="muted">{p.detail}</Text>
                      <Text size="sm" c="muted">{p.debut} - {p.fin}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Attendance">
            <Card variant="default" padding="md">
              <Card.Content>
                {/* attendance-body V gap 16, grid-row H gap 24. */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Text size="sm" c="secondary">Attendance view</Text>
                    <SegmentGroup size="sm" data={VUES_PRESENCE} defaultValue="Monthly" />
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                      {PRESENCE.map((ligne, i) => (
                        <div key={i} className="flex gap-1">
                          {ligne.map((niveau, j) => <Case key={j} niveau={niveau} />)}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Title order={3} size="xl">{PRESENCE_TOTAL}</Title>
                      <Text size="xs" c="muted">{PRESENCE_NOTE}</Text>
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
                  <Text size="xs" c="muted">{PRESENCE_LECTURE}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
          {/* Stats : releve default/md, stats-body V gap 16, stat-row H gap 12,
              AUCUN divider. Etait outline/lg avec des Divider inventes. */}
          <Section titre="Stats">
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {STATS.map((s) => (
                    <div key={s.libelle} className="flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <Text size="sm">{s.libelle}</Text>
                        <Text size="xs" c="muted">{s.precision}</Text>
                      </div>
                      <Title order={3} size="xl">{s.valeur}</Title>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          {/* Current milestone : releve gradient/sm, milestone-body V gap 12.
              Etait outline/lg — c'est l'autre card a contour rose du side rail. */}
          <Section titre="Current milestone">
            <Card variant="gradient" padding="sm">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text size="sm">{MILESTONE.nom}</Text>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="sm" c="secondary">{MILESTONE.libelle}</Text>
                    <Text size="sm" c="muted">{MILESTONE.validees} / {MILESTONE.requises}</Text>
                  </div>
                  <Progress variant="gradient" value={milestonePct} size="sm" />
                  <Text size="xs" c="muted">{MILESTONE.note}</Text>
                </div>
              </Card.Content>
            </Card>
          </Section>

          {/* Elsewhere : releve default/md, links-body V gap 16, link V gap 4.
              Les renvois sont des LIENS en Text sm/BoldCap, pas des boutons —
              4 Button dans une card violaient "les boutons ne predominent pas".
              Ils sont inertes (decision designer), donc rendus en texte : le kit
              n'a ni composant Link ni prop de couleur sur Text, donc la couleur
              d'interactif du DS n'est pas atteignable ici. Consigne au report. */}
          <Section titre="Elsewhere on this profile">
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {AILLEURS.map((l) => (
                    <div key={l.libelle} className="flex flex-col gap-1">
                      <Text size="sm">{l.libelle}</Text>
                      <Text size="xs" c="muted">{l.note}</Text>
                    </div>
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
