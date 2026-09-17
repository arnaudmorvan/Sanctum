import { CalendarClock, TrendingUp, Lightbulb, Gauge } from "lucide-react"
import { Card } from "@42/ui-react/card"
import { Title } from "@42/ui-react/title"
import { Text } from "@42/ui-react/text"
import { Button } from "@42/ui-react/button"
import { TYPO } from "../../../src/typo"
import { SEMAINES_SIMULATEUR, TRAJECTOIRE } from "../data/fixtures"

// "Chart / Line" du DS (23036:168) — un seul tracé, tenu par un SVG polyline minimal :
// on n'a pas fait rentrer TanStack Charts dans ce prototype, la forme reste fidèle
// (grille légère, axes en registre machine).
function TrajectoireChart() {
  const w = 640
  const h = 160
  const max = 100
  const points = TRAJECTOIRE.map((p, i) => {
    const x = (i / (TRAJECTOIRE.length - 1)) * w
    const y = h - (p.valeur / max) * h
    return `${x},${y}`
  }).join(" ")
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-2 w-full h-[160px]">
        <div className="flex flex-col justify-between items-end w-7">
          {[100, 75, 50, 25, 0].map((v) => (
            <Text key={v} size="xs" c="muted" className={TYPO.mono()}>{v}</Text>
          ))}
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (<div key={i} className="h-px bg-white/[0.08] w-full" />))}
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polyline points={points} fill="none" className="stroke-pink-400" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="flex gap-2 w-full pl-9">
        {TRAJECTOIRE.map((p) => (
          <Text key={p.mois} size="xs" c="muted" className={TYPO.mono() + " flex-1"}>{p.mois}</Text>
        ))}
      </div>
    </div>
  )
}

export function Simulateur() {
  return (
    <div className="flex gap-10 p-10 w-full">
      <div className="flex flex-col gap-10 w-[800px] shrink-0">
        <div className="flex flex-col gap-2">
          <Title order={1} size="3xl" className={TYPO.title()}>Simulateur</Title>
          <Text size="sm" c="secondary">Projette l’effet de tes prochaines semaines sur ton parcours.</Text>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><CalendarClock size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Mes semaines à venir</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <div className="border border-white/10 rounded-xs overflow-hidden">
                <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
                  {["SEMAINE", "HEURES PRÉVUES", "MILESTONE VALIDÉE"].map((h) => (
                    <div key={h} className="px-6 py-3"><Text size="xs" className="uppercase">{h}</Text></div>
                  ))}
                </div>
                {SEMAINES_SIMULATEUR.map((s) => (
                  <div key={s.semaine} className="grid grid-cols-3 border-b border-white/10 last:border-0">
                    <div className="px-6 py-4"><Text size="sm">{s.semaine}</Text></div>
                    <div className="px-6 py-4"><Text size="sm" className={TYPO.mono()}>{s.heures} h</Text></div>
                    <div className="px-6 py-4"><Text size="sm">{s.milestone}</Text></div>
                  </div>
                ))}
              </div>
              <Button variant="outline" color="gray" size="sm" className="self-start">Ajouter une semaine</Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><TrendingUp size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma trajectoire</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <TrajectoireChart />
              <div className="flex gap-10">
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Fin projetée</Text><Text size="sm" className={TYPO.mono("bold")}>avril 2027</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Plafond</Text><Text size="sm" className={TYPO.mono("bold")}>juin 2028</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Marge</Text><Text size="sm" className={TYPO.mono("bold")}>15 mois</Text></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-10 w-[340px] shrink-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Gauge size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ce que ça change</Text></div>
          <Card variant="gradient" padding="sm">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>AVRIL 2027</Title>
              <Text size="sm" c="secondary">fin projetée du Common Core, au lieu de juin 2027</Text>
              <Text size="xs" className={TYPO.mono() + " text-pink-400"}>2 MOIS GAGNÉS · 15 MOIS DE MARGE</Text>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Lightbulb size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Recommandations</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Text size="xs" c="secondary">Pour gagner encore</Text>
                <Text size="sm" className="font-semibold">Valider M4 avant S+3 : 3 semaines gagnées sur la projection.</Text>
              </div>
              <div className="flex flex-col gap-1">
                <Text size="xs" c="secondary">Ce qui ferait basculer</Text>
                <Text size="sm" className="font-semibold">Moins de 24 h/semaine sur 4 semaines : la projection repasse au-delà de 14 mois.</Text>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Gauge size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Mon rythme réel</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Text size="sm" c="secondary">la simulation part de là</Text>
              <div className="border border-white/10 rounded-xs overflow-hidden">
                <div className="grid grid-cols-2 bg-white/5 border-b border-white/10">
                  <div className="px-6 py-3"><Text size="xs" className="uppercase">Signal</Text></div>
                  <div className="px-6 py-3"><Text size="xs" className="uppercase">4 dern. sem.</Text></div>
                </div>
                <div className="grid grid-cols-2 border-b border-white/10">
                  <div className="px-6 py-4"><Text size="sm">Présence</Text></div>
                  <div className="px-6 py-4"><Text size="sm" className={TYPO.mono()}>32 h / sem</Text></div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-6 py-4"><Text size="sm">Reviews données</Text></div>
                  <div className="px-6 py-4"><Text size="sm" className={TYPO.mono()}>5 / sem</Text></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
