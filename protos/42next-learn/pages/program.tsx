import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Ecran } from "../components/sidebar"
import { BADGE_STATUT, MODULES, PROGRAMME, VUES_PROGRAMME } from "../data/learn"

/** Ecran 1 — learn.modules du proto : grille 2 colonnes de module cards.
 *  Seule la card "In progress" mene a l'ecran module : c'est le chemin nominal
 *  du parcours, les autres restent inertes plutot que d'ouvrir un ecran vide.
 *  Rythme repris du releve de 42next-profile : sections 16, cards 16, contenu 12. */
export const Program = () => (
  <Ecran>
    <Breadcrumb data={[{ label: "Learn", href: "#/learn/program" }, { label: "My program" }]} />

    <div className="flex flex-wrap items-center justify-between gap-3">
      <Title order={1} size="2xl">{PROGRAMME.nom}</Title>
      <div className="flex items-center gap-3">
        <Text size="sm" c="muted">program</Text>
        <Badge variant="light" color="gray">{PROGRAMME.version}</Badge>
        <SegmentGroup size="sm" data={VUES_PROGRAMME} defaultValue="Cards" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {MODULES.map((m) => {
        const b = BADGE_STATUT[m.statut]
        const corps = (
          <Card.Content>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <Title order={2} size="sm">{m.nom}</Title>
                <Badge variant="light" color={b.color}>{b.libelle}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Text size="xs" c="secondary">{m.skills}</Text>
                <Text size="xs" c="muted">{m.pct}%</Text>
              </div>
              <Progress variant="gradient" value={m.pct} size="sm" />
              <Text size="xs" c="muted">{m.activites}</Text>
            </div>
          </Card.Content>
        )
        /* Le contour rose signature va a la seule card en cours : c'est elle qui
           "ouvre" l'ecran. Les cards verrouillees restent en default, sans grisage
           invente — le badge Locked porte l'etat. */
        return m.ouvert ? (
          <a key={m.slug} href={`#/learn/module/${m.slug}`} className="block">
            <Card variant="gradient" padding="md">{corps}</Card>
          </a>
        ) : (
          <Card key={m.slug} variant="default" padding="md">{corps}</Card>
        )
      })}
    </div>
  </Ecran>
)
