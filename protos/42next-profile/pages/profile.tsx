import type { ReactNode } from "react"
import { Clock3, Flame, FolderCheck, GraduationCap, Grid2x2, Milestone } from "lucide-react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
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
 *  sm=12) : ne jamais le reposer a la main sur Card.Content.
 *
 *  PASSE TYPO 2026-09-05, contre le releve des 91 textes de la meme frame.
 *  La regle du DS : Lato porte le texte ET les titres ; Kode Mono porte LA
 *  MACHINE (niveau, compteurs, scores). Le kit fait l'inverse — `Title` force
 *  `font-mono` — d'ou les `className={TYPO.*}` ci-dessous, qui nomment chacun le
 *  style Figma reproduit. Ils disparaitront quand le kit exposera les axes. */

/** SectionTitle du DS Figma : size=sm, titre en Typography-1/Text md/Bold (16px),
 *  icone en tete, gap 6 entre les deux. size="md" mappe le cran Figma `Text md`
 *  par son nom. L'echelle etait auparavant size="lg" : titres trop gros, rejet 9.
 *  TYPO.texte() : la frame les pose en Lato Bold, le kit les rendait en Kode Mono.
 *
 *  L'icone n'est PLUS absente (2026-09-05) : elle etait tombee sur la croyance
 *  qu'« aucun asset ne transite par publish_proto ». Une icone n'est pas un asset,
 *  c'est un import lucide — et les noms sont RELEVES sur la frame, pas choisis
 *  (folder-check, milestone, clock-3, grid-2x2, flame, graduation-cap). */
const Section = ({ titre, icone, children }: { titre: string; icone: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center gap-1.5 text-gray-dark-400">
      {icone}
      <Title order={2} size="md" className={TYPO.texte()}>{titre}</Title>
    </div>
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
      {/* PageHeader Figma : V gap 6, titre en Display sm/Bold — Lato Bold 30.
          Etait size="2xl" (24) en Kode Mono : deux ecarts a la fois. */}
      <div className="flex flex-col gap-1.5">
        <Title order={1} size="3xl" className={TYPO.texte()}>{login ?? LEARNER.login}</Title>
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
                      La photo est celle de la frame (_Avatar photos, photo=Olivia
                      Rhye), servie par le site : /avatars/<slug>.webp. `name` reste
                      pose — c'est le repli en initiales si le fichier manque. */}
                  <Avatar
                    size="xl"
                    src="/avatars/olivia-rhye.webp"
                    alt=""
                    name={LEARNER.nom}
                    color="initials"
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      {/* Text sm/Bold — Lato Bold 14. */}
                      <Text size="sm" className={TYPO.texte()}>{LEARNER.nom}</Text>
                      <Text size="xs" c="muted">{LEARNER.presence}</Text>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      {/* Typography-2/Display xs/Bold — Kode Mono Bold 24 : c'est
                          LE registre machine, et le seul endroit du bloc ou il sert.
                          Etait size="xl" (20) en SemiBold. */}
                      <Title order={2} size="2xl" className={TYPO.machine()}>LEVEL {LEARNER.level}</Title>
                      <Text size="xs" c="muted" className={TYPO.texte("medium")}>{MILESTONE.nom}</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Progress Figma : axe Color=Pink. En React le degrade
                          signature passe par variant="gradient" (defaut CVA
                          purple-300 -> pink-400). review:color exige le degrade,
                          jamais une couleur unie. */}
                      <div className="grow"><Progress variant="gradient" value={LEARNER.levelPct} size="sm" /></div>
                      <Text size="sm" className={TYPO.texte("medium")}>{LEARNER.xp}</Text>
                    </div>
                    <Text size="xs" c="muted">{LEARNER.parcours}</Text>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Section titre="Activities" icone={<FolderCheck size={16} />}>
            <div className="flex flex-col gap-4">
              {/* Current activity : releve gradient/md. Etait gradient/lg. */}
              <Card variant="gradient" padding="md">
                <Card.Content>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="light" color="blue">In progress</Badge>
                      <Badge variant="light" color="gray">{EN_COURS.tentative}</Badge>
                    </div>
                    {/* Figma : Text sm/Bold (Lato Bold 14). Etait Title sans size,
                        donc au defaut par order — plusieurs crans trop gros. */}
                    <Title order={3} size="sm" className={TYPO.texte()}>{EN_COURS.nom}</Title>
                    <Text size="xs" c="muted">{EN_COURS.contexte}</Text>
                    <div className="flex items-baseline justify-between gap-3">
                      <Text size="sm" className={TYPO.texte("medium")}>{EN_COURS.libelle}</Text>
                      <Text size="sm" c="muted" className={TYPO.texte("medium")}>{EN_COURS.faites} / {EN_COURS.total}</Text>
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
                        <Title order={3} size="sm" className={TYPO.texte()}>{a.nom}</Title>
                        <Text size="xs" c="muted">{a.contexte}</Text>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Typography-2/Text sm/Bold — Kode Mono Bold 14. Une note
                            est un compteur : elle appartient au registre machine. */}
                        <Text size="sm" className={TYPO.machine()}>{a.note} / {a.bareme}</Text>
                        <Badge variant="light" color="green">Validated</Badge>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </Section>

          <Section titre="Programs" icone={<Milestone size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                {/* CORRIGE le 2026-09-05. La version precedente passait le nom du
                    programme en `title={...}` — or Timeline.Item n'a PAS de prop
                    `title` : il tombait dans l'attribut HTML `title`, donc en
                    infobulle, invisible a l'ecran. Les trois noms de programmes
                    manquaient purement et simplement. L'API reelle est
                    Item > Label + Content > Title (JSDoc du composant).
                    La colonne de gauche de la frame porte debut (Lato Bold 16) au
                    dessus de fin (Lato Regular 14) ; le titre est Text xl/Bold. */}
                <Timeline size="md" lineVariant="solid">
                  {PROGRAMMES.map((p) => (
                    <Timeline.Item
                      key={p.nom}
                      color={p.actif ? "green" : undefined}
                      variant={p.actif ? undefined : "outline"}
                    >
                      <Timeline.Label>
                        <span className="flex flex-col">
                          <span className={TYPO.texte()}>{p.debut}</span>
                          <span className="text-gray-dark-400">{p.fin}</span>
                        </span>
                      </Timeline.Label>
                      <Timeline.Content>
                        <Timeline.Title className={`${TYPO.texte()} text-xl`}>{p.nom}</Timeline.Title>
                        <Text size="md" c="muted">{p.detail}</Text>
                      </Timeline.Content>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card.Content>
            </Card>
          </Section>

          <Section titre="Attendance" icone={<Clock3 size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                {/* attendance-body V gap 16, grid-row H gap 24. */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Text size="sm" c="secondary" className={TYPO.texte("medium")}>Attendance view</Text>
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
                      {/* 312H : Typography-2/Display xs/Bold — un compteur d'heures,
                          registre machine. Etait size="xl" en SemiBold. */}
                      <Title order={3} size="2xl" className={TYPO.machine()}>{PRESENCE_TOTAL}</Title>
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
          <Section titre="Stats" icone={<Grid2x2 size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {STATS.map((s) => (
                    <div key={s.libelle} className="flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <Text size="sm" className={TYPO.texte("medium")}>{s.libelle}</Text>
                        <Text size="xs" c="muted">{s.precision}</Text>
                      </div>
                      {/* 47 / 12 / 3 : Typography-2/Display xs/Bold, comme LEVEL. */}
                      <Title order={3} size="2xl" className={TYPO.machine()}>{s.valeur}</Title>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          {/* Current milestone : releve gradient/sm, milestone-body V gap 12.
              Etait outline/lg — c'est l'autre card a contour rose du side rail. */}
          <Section titre="Current milestone" icone={<Flame size={16} />}>
            <Card variant="gradient" padding="sm">
              <Card.Content>
                <div className="flex flex-col gap-3">
                  <Text size="sm" className={TYPO.texte()}>{MILESTONE.nom}</Text>
                  <div className="flex items-baseline justify-between gap-3">
                    <Text size="sm" c="secondary" className={TYPO.texte("medium")}>{MILESTONE.libelle}</Text>
                    <Text size="sm" c="muted" className={TYPO.texte("medium")}>{MILESTONE.validees} / {MILESTONE.requises}</Text>
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
          <Section titre="Elsewhere on this profile" icone={<GraduationCap size={16} />}>
            <Card variant="default" padding="md">
              <Card.Content>
                <div className="flex flex-col gap-4">
                  {AILLEURS.map((l) => (
                    <div key={l.libelle} className="flex flex-col gap-1">
                      <Text size="sm" className={TYPO.texte() + " uppercase"}>{l.libelle}</Text>
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
