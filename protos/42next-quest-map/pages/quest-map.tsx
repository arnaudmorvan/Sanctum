import type { CSSProperties, ReactNode } from "react"
import { Check, Hourglass, Rocket } from "lucide-react"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  FILTRES, HAUTS_FAITS, LEARNER, MAITRISE, PROCHAINE_MISSION, QUETES,
  SKILLS, TERRITOIRE_COURANT, TERRITOIRES, type Marque,
} from "../data/quest-map"

/** Écran traduit de la frame 22505:9532 le 2026-09-06.
 *
 *  Tous les gaps, paddings, variants et styles de texte ci-dessous sont RELEVÉS sur la
 *  frame. Correspondance Figma → Tailwind : 2=gap-0.5, 8=gap-2, 12=gap-3, 16=gap-4,
 *  40=gap-10. Le padding des cards est porté par la prop `padding` (lg=24).
 *
 *  ⚠️ La typographie de CETTE frame n'est pas celle du profil : ses titres de section
 *  sont en `Display xs/Bold` (Lato Bold 24, SectionTitle size=xl) là où le profil pose
 *  `Text md/Bold` (16, size=sm). Même composant Figma, autre cran — c'est pourquoi on
 *  relève au lieu de réutiliser. Et elle emploie beaucoup de **Semibold**, que la
 *  première version de `TYPO` ne savait pas produire. */

/** `SectionTitle` du DS (size=xl, iconPosition=left, gap 8) n'a AUCUN équivalent React :
 *  on compose. L'icône est `hourglass`, identique sur les 7 sections de la frame. */
const Section = ({ titre, aside, children }: { titre: string; aside?: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-gray-dark-400">
        <Hourglass size={24} />
        <Title order={2} size="2xl" className={TYPO.texte()}>{titre}</Title>
      </div>
      {aside}
    </div>
    {children}
  </section>
)

/** L'indicateur de la timeline. Relevé : `check` blanc sur pastille verte pleine pour un
 *  territoire validé, pastille verte nue pour celui en cours, cercle vide sinon. */
const MARQUE: Record<Marque, { color?: string; variant?: "filled" | "outline"; bullet?: ReactNode }> = {
  valide: { color: "green", variant: "filled", bullet: <Check size={12} strokeWidth={3} /> },
  "en-cours": { color: "green", variant: "filled" },
  ouvert: { variant: "outline" },
}

export const QuestMap = () => (
  <div className="flex flex-col gap-10">
    {/* welcome — V gap 8. Display sm/Semibold (Lato SemiBold 30), pas Bold. */}
    <div className="flex flex-col gap-2">
      <Title order={1} size="3xl" className={TYPO.texte("semibold")}>
        Welcome back, {LEARNER.prenom}
      </Title>
      <Text size="sm" c="secondary">{LEARNER.parcours}</Text>
    </div>

    {/* content — H gap 40, colonne principale 800 / rail 340 */}
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-10">
        <Section
          titre="Territories"
          aside={<SegmentGroup size="sm" data={FILTRES} defaultValue="All" />}
        >
          <Card variant="default" padding="lg">
            <Card.Content>
              {/* La frame donne trois zones par item : rail, contenu, actions. La
                  Timeline du kit n'a que label / axe / contenu — le badge vit donc
                  DANS le contenu, poussé à droite. Écart de composition assumé. */}
              <Timeline size="md" lineVariant="solid">
                {TERRITOIRES.map((t) => (
                  <Timeline.Item key={t.nom} {...MARQUE[t.marque]}>
                    <Timeline.Content>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                          {/* Text xl/Bold — Lato Bold 20 */}
                          <Timeline.Title className={`${TYPO.texte()} text-xl`}>
                            {t.nom}
                          </Timeline.Title>
                          <Text size="md" c="muted">{t.detail}</Text>
                        </div>
                        <Badge variant="light" color={t.statut.color}>{t.statut.libelle}</Badge>
                      </div>
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card.Content>
          </Card>
        </Section>

        <Section titre="Skills">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                {SKILLS.map((s) => (
                  <div key={s.nom} className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      {/* Text md/Semibold — Lato SemiBold 16 */}
                      <Text size="md" className={TYPO.texte("semibold")}>{s.nom}</Text>
                      <Text size="xs" c="muted">{s.detail}</Text>
                    </div>
                    <Badge variant="light" color={s.statut.color}>{s.statut.libelle}</Badge>
                  </div>
                ))}
                {/* Dernière ligne : pas de badge, une barre. Le « 30 % » est un
                    pourcentage → registre machine (Kode Mono SemiBold). */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <Text size="md" className={TYPO.texte("semibold")}>{MAITRISE.nom}</Text>
                    <Text size="sm" className={TYPO.machine("semibold")}>{MAITRISE.pct} %</Text>
                  </div>
                  <Progress variant="gradient" value={MAITRISE.pct} size="sm" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section titre="Active quests">
          {/* Deux cards SŒURS, pas une card à deux lignes : la section est en V gap 16
              et porte SectionTitle + Card + Card. */}
          <div className="flex flex-col gap-4">
            {QUETES.map((q) => (
              <Card key={q.nom} variant="default" padding="lg">
                <Card.Content>
                  <div className="flex flex-wrap items-center gap-4">
                    <ThemeIcon color="pink" size="md" variant="light" radius="full">
                      <Rocket size={20} />
                    </ThemeIcon>
                    <div className="flex min-w-0 grow flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <Text size="md" className={TYPO.texte("semibold")}>{q.nom}</Text>
                        {/* Un gain d'XP compte : registre machine. */}
                        <Text size="sm" className={TYPO.machine("semibold")}>{q.xp}</Text>
                      </div>
                      <Text size="sm" c="muted">{q.detail}</Text>
                      <Progress variant="gradient" value={q.pct} size="sm" />
                    </div>
                    <Button size="sm" variant="outline" color="gray">{q.action}</Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </Section>

        <Section titre="Achievements">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                {HAUTS_FAITS.map((h) => (
                  <div key={h.nom} className="flex items-center gap-4">
                    <ThemeIcon color={h.color} size="md" variant="light" radius="full">
                      <Rocket size={20} />
                    </ThemeIcon>
                    <div className="flex flex-col gap-0.5">
                      <Text size="md" className={TYPO.texte("semibold")}>{h.nom}</Text>
                      <Text size="xs" c="muted">{h.detail}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </Section>
      </div>

      <aside className="flex flex-col gap-10">
        <Section titre="Next mission">
          {/* La seule card `gradient` de l'écran : le contour rose signature va à la
              prochaine échéance, pas au profil. Relevé, pas choisi. */}
          <Card variant="gradient" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                {/* Text lg/Semibold — Lato SemiBold 18 */}
                <Text size="lg" className={TYPO.texte("semibold")}>{PROCHAINE_MISSION.nom}</Text>
                <Text size="sm" c="muted">{PROCHAINE_MISSION.detail}</Text>
                {/* Un décompte mesure : registre machine. */}
                <Text size="sm" className={TYPO.machine("semibold")}>{PROCHAINE_MISSION.decompte}</Text>
                <div>
                  <Button size="sm" color="brand">{PROCHAINE_MISSION.action}</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section titre="Profile">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar size=md shape=circle, photo=Olivia Rhye — servie par le site. */}
                  <Avatar size="md" src="/avatars/olivia-rhye.webp" alt="" name={LEARNER.nom} color="initials" />
                  <div className="flex flex-col gap-0.5">
                    <Text size="md" className={TYPO.texte("semibold")}>{LEARNER.nom}</Text>
                    <Text size="sm" c="muted">{LEARNER.contexte}</Text>
                  </div>
                </div>
                {/* Display xs/Semibold — Kode Mono SemiBold 24. Le niveau est LE
                    marqueur de progression : machine, comme sur le profil. */}
                <Title order={3} size="2xl" className={TYPO.machine("semibold")}>
                  LEVEL {LEARNER.level}
                </Title>
                <Progress variant="gradient" value={LEARNER.xpPct} size="sm" />
                <Text size="xs" c="muted">{LEARNER.xp}</Text>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section titre="Current territory">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col items-center gap-3">
                {/* La frame pose l'anneau à 136 px (size=3xl) ; l'échelle du kit
                    s'arrête à xl = 80. On passe par l'échappatoire que le composant
                    documente lui-même (`--size` / `--thickness`, fusionnées APRÈS ses
                    défauts), plutôt que de rétrécir le seul élément héros de l'écran.
                    L'écart part en ds-action. */}
                <CircularProgress
                  variant="gradient"
                  value={TERRITOIRE_COURANT.pct}
                  size="xl"
                  style={{ "--size": "136px", "--thickness": "12px" } as CSSProperties}
                >
                  {/* Display sm/Medium — Kode Mono Medium 30 */}
                  <Text span size="3xl" className={TYPO.machine("medium")}>
                    {TERRITOIRE_COURANT.pct}%
                  </Text>
                </CircularProgress>
                <Text size="md" className={TYPO.texte("semibold")}>{TERRITOIRE_COURANT.nom}</Text>
                <Text size="sm" c="muted">{TERRITOIRE_COURANT.detail}</Text>
              </div>
            </Card.Content>
          </Card>
        </Section>
      </aside>
    </div>
  </div>
)
