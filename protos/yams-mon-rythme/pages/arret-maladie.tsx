import { Route, Target, ShieldOff, Clock, MessageCircle } from "lucide-react"
import { Card } from "@42/ui-react/card"
import { Title } from "@42/ui-react/title"
import { Text } from "@42/ui-react/text"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Alert } from "@42/ui-react/alert"
import { TYPO } from "../../../src/typo"
import { MILESTONES_V2, PROJETS_M5 } from "../data/fixtures"

// Ancien modèle de frise (une seule durée par milestone, pas de durée max) — cet écran
// est resté en V2, non repris depuis l'atelier du 16/09 (voir figma-source.json et le
// rapport de génération : incohérence assumée avec mon-rythme, qui lui est en V3).
function FriseV2() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-1 w-full h-6">
        {MILESTONES_V2.map((m, i) => (
          <div key={m.n} className={`flex-1 rounded-xs ${i < 3 ? "bg-white/15" : i === 3 ? "bg-gradient-to-r from-pink-400 to-purple-300" : "bg-white/10"}`} title={m.n} />
        ))}
      </div>
      <div className="flex gap-1 w-full">
        {MILESTONES_V2.map((m) => (
          <div key={m.n} className="flex-1 flex flex-col items-start">
            <Text size="xs" c="secondary" className={TYPO.mono()}>{m.n}</Text>
            <Text size="xs" c="muted" className={TYPO.mono()}>{m.ref} j</Text>
          </div>
        ))}
      </div>
      <Text size="sm" className={TYPO.mono("semibold") + " text-pink-400"}>ARRÊT EN COURS — REPRISE LE 26 FÉVRIER</Text>
      <div className="flex flex-col gap-2 pt-1">
        <Text size="sm" className="font-semibold">Ta projection face au cadre</Text>
        <div className="flex gap-10">
          <Text size="xs" c="secondary" className={TYPO.mono()}>11 MOIS — RÉFÉRENCE</Text>
          <Text size="xs" c="secondary" className={TYPO.mono()}>24 MOIS — PLAFOND</Text>
        </div>
        <Text size="sm" className={TYPO.mono("bold")}>JUIN 2027 · 11 MOIS</Text>
      </div>
      <div className="flex gap-10 pt-1">
        <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Milestone en cours</Text><Text size="sm" className={TYPO.mono("bold")}>M4</Text></div>
        <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Fin projetée</Text><Text size="sm" className={TYPO.mono("bold")}>juin 2027</Text></div>
        <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Plafond décalé</Text><Text size="sm" className={TYPO.mono("bold")}>mi-juillet 2028</Text></div>
      </div>
    </div>
  )
}

export function ArretMaladie() {
  return (
    <div className="flex gap-10 p-10 w-full">
      <div className="flex flex-col gap-10 w-[800px] shrink-0">
        <div className="flex flex-col gap-3">
          <Title order={1} size="3xl" className={TYPO.title()}>Mon rythme</Title>
          <Text size="sm" c="secondary">Common Core · Paris campus · Milestone 4 sur 8 · arrêt en cours</Text>
          <Alert
            type="info"
            title="Tu es en arrêt jusqu’au 26 février"
            description="L’alerting est suspendu et ton plafond est décalé de 14 jours. Repose-toi, tu n’es pas attendu."
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Route size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Mon parcours</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <Text size="sm" c="secondary">Common Core — 8 milestones, 329 jours de référence. Démarré le 29 juin 2026.</Text>
              <FriseV2 />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Target size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Milestone 04 — en cours</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <Text size="md" className="font-bold">Réseau &amp; programmation système</Text>
                <Badge color="pink" variant="light">En cours</Badge>
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Compétences couvertes</Text><Text size="sm" className={TYPO.mono("bold")}>4 / 7</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Temps écoulé</Text><Text size="sm" className={TYPO.mono("bold")}>22 jours</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Durée de référence</Text><Text size="sm" className={TYPO.mono("bold")}>35 jours</Text></div>
              </div>
              <div className="flex flex-col gap-3">
                {PROJETS_M5.map((p) => (
                  <div key={p.slug} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <Text size="sm" className="font-semibold">{p.slug}</Text>
                      <Text size="xs" c="secondary">{p.desc}</Text>
                    </div>
                    <Badge variant="light" color={p.statut === "Validé" ? "green" : p.statut === "En review" ? "blue" : "gray"}>{p.statut}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-10 w-[340px] shrink-0">
        {/* Seul écran de la série sans carte gradient : on ne demande rien à quelqu'un
            en arrêt (voir maj-protos-figma-apres-atelier-2026-09-16.md, §3.3). */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><ShieldOff size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ton cadre</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>EN PAUSE</Title>
              <Text size="sm" c="secondary">Ta projection reprendra à ton retour, sans pénalité pour cette période.</Text>
              <Text size="xs" c="muted" className="uppercase pt-1">Plafond décalé de 14 jours · mi-juillet 2028</Text>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Clock size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma présence</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>NON MESURÉE</Title>
              <Text size="sm" c="secondary">pendant un arrêt, ta présence n’est pas comptée</Text>
              <Button variant="subtle" color="gray" size="sm" className="justify-start px-0">Voir mon assiduité</Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><MessageCircle size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma participation</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>NON MESURÉE</Title>
              <Text size="sm" c="secondary">aucune review n’est attendue pendant ton arrêt</Text>
              <Button variant="subtle" color="gray" size="sm" className="justify-start px-0">Voir mes reviews</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
