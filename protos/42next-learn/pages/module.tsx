import type { ReactNode } from "react"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { BADGE_STATUT, MODULE } from "../data/learn"

const Section = ({ titre, aside, children }: { titre: string; aside?: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-baseline justify-between gap-3">
      <Title order={2} size="md" className={TYPO.texte()}>{titre}</Title>
      {aside}
    </div>
    {children}
  </section>
)

/** Coche / cercle du proto (✓ / ○) : des caracteres, pas des icones —
 *  ils transitent. */
const Etat = ({ fait }: { fait: boolean }) => (
  <Text span size="sm" c={fait ? "default" : "muted"}>{fait ? "✓" : "○"}</Text>
)

/** Ecran 2 — learn.module du proto. Deux colonnes : exigences + activites a
 *  gauche, skills + exam a droite. Le switch de version reste inerte (le flux
 *  de mise a jour est un pane a part dans le proto). */
export const Module = ({ slug }: { slug?: string }) => {
  const m = MODULE
  const exigPct = Math.round((m.exigences.faites / m.exigences.total) * 100)

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[{ label: "Learn", href: "#/learn/program" }, { label: "My program", href: "#/learn/program" }, { label: m.nom }]} />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Title order={1} size="2xl" className={TYPO.texte()}>{m.nom}</Title>
          <div className="flex flex-wrap items-center gap-3">
            <Text size="sm" c="muted">Started {m.debut}</Text>
            <Badge variant="light" color="gray">{m.version}</Badge>
            <Badge variant="light" color="blue">{m.versionSuivante.numero} · {m.versionSuivante.note}</Badge>
            <Button size="sm" variant="outline">Update to {m.versionSuivante.numero}</Button>
          </div>
        </div>
        <Text size="sm" c="secondary">{m.abstract}</Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-10">
          <Section titre="Validation requirements" aside={<Text size="sm" c="muted">{m.exigences.faites}/{m.exigences.total}</Text>}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  {/* Le proto rend ce bloc en YAML monospace. La famille mono est
                      inatteignable par une prop du kit : rendu en liste, cles et
                      identifiants conserves tels quels. */}
                  <Text size="xs" c="muted">validation-conditions:</Text>
                  {m.exigences.groupes.map((g) => (
                    <div key={g.cle} className="flex flex-col gap-1">
                      <Text size="xs" c="secondary">{g.cle}:</Text>
                      {g.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-2">
                          <Etat fait={it.fait} />
                          <Text size="sm" c={it.fait ? "default" : "muted"}>- {it.id}</Text>
                        </div>
                      ))}
                    </div>
                  ))}
                  <Progress variant="gradient" value={exigPct} size="sm" />
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Activities">
            <div className="flex flex-col gap-3">
              {m.activites.map((a, i) => {
                const b = BADGE_STATUT[a.statut]
                return (
                  <div key={a.slug} className="flex flex-col gap-3">
                    {i > 0 && <Text size="sm" c="muted">↓</Text>}
                    <Card variant={a.ouvert ? "gradient" : "default"} padding="md">
                      <Card.Content>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Title order={3} size="sm" className={TYPO.texte()}>{a.nom}</Title>
                              <Badge variant="light" color={b.color}>{b.libelle}</Badge>
                            </div>
                            <Text size="xs" c="muted">{a.type}</Text>
                          </div>
                          {a.ouvert ? (
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
          <Section titre="Skills" aside={<Text size="sm" c="muted">{m.skills.faites}/{m.skills.total}</Text>}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-2">
                  {m.skills.liste.map((s) => (
                    <div key={s.nom} className="flex items-center gap-2">
                      <Etat fait={s.fait} />
                      <Text size="sm" c={s.fait ? "default" : "muted"}>{s.nom}</Text>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Exam">
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <Title order={3} size="sm" className={TYPO.texte()}>Exam</Title>
                    <Badge variant="light" color="red">{m.exam.statut}</Badge>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="xs" c="muted">{m.exam.derniere}</Text>
                    {/* Une note est un compteur : registre machine (Kode Mono Bold),
                        comme les scores de la frame profil. */}
                    <Text size="sm" className={TYPO.machine()}>{m.exam.note} / {m.exam.bareme}</Text>
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
