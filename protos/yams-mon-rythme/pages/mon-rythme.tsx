import { Route, Target, Wallet, Clock, MessageCircle, Flag, CalendarOff } from "lucide-react"
import { Card } from "@42/ui-react/card"
import { Title } from "@42/ui-react/title"
import { Text } from "@42/ui-react/text"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Progress } from "@42/ui-react/progress"
import { Modal } from "@42/ui-react/modal"
import { ChoiceCardGroup } from "@42/ui-react/choice-card-group"
import { DatePicker } from "@42/ui-react/date-picker"
import { Field } from "@42/ui-react/field"
import { useState } from "react"
import { TYPO } from "../../../src/typo"
import { MILESTONES_V3, PROJETS_M5, PRESENCE_4_SEM } from "../data/fixtures"

// "frise-parcours" — pas de composant DS pour une frise référence/max par quest
// (repéré ⚠ candidat composant DS sur la maquette elle-même) : composée à la main,
// signalée comme manque dans le rapport de génération.
function Frise() {
  const etatColor: Record<string, string> = {
    done: "bg-green-500",
    "done-over-ref": "bg-orange-500",
    current: "bg-gradient-to-r from-pink-400 to-purple-300",
    locked: "bg-white/10",
  }
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-1 w-full h-6">
        {MILESTONES_V3.map((m) => (
          <div key={m.n} className={`flex-1 rounded-xs overflow-hidden relative ${etatColor[m.etat]}`} title={m.n} />
        ))}
      </div>
      <div className="flex gap-1 w-full">
        {MILESTONES_V3.map((m) => (
          <div key={m.n} className="flex-1 flex flex-col items-start">
            <Text size="xs" c="secondary" className={TYPO.mono()}>{m.n}</Text>
            <Text size="xs" c="muted" className={TYPO.mono()}>{m.ref} j</Text>
          </div>
        ))}
      </div>
      <div className="flex gap-6 items-center flex-wrap">
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-green-500" /><Text size="xs" c="secondary">terminée dans la durée de référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-orange-500" /><Text size="xs" c="secondary">terminée au-delà de la référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-pink-400" /><Text size="xs" c="secondary">en cours</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-white/20" /><Text size="xs" c="secondary">à venir</Text></span>
      </div>
      <Text size="xs" c="muted">
        Le trait vertical marque la durée de référence · la fin de la barre marque la durée max · le remplissage est la durée réelle
      </Text>
      <Text size="sm" className={TYPO.mono("semibold") + " text-pink-400"}>
        M5 EN COURS — JOUR 21 SUR 63 DE RÉFÉRENCE · 126 J DE DURÉE MAX
      </Text>
    </div>
  )
}

function AbsenceModal({ open, onClose, onDeclarer }: { open: boolean; onClose: () => void; onDeclarer: () => void }) {
  const [motif, setMotif] = useState<"vacances" | "arret-maladie">("arret-maladie")
  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()} title="Déclarer une absence" size="sm">
      <div className="flex flex-col gap-5 w-full">
        <ChoiceCardGroup
          label="Motif"
          description="Ce que ça change dépend du motif choisi."
          value={motif}
          onChange={(v) => setMotif(v as "vacances" | "arret-maladie")}
          data={[
            { value: "vacances", label: "Vacances", description: "Le temps continue de courir sur ton budget. Tu vois l’impact avant de valider." },
            { value: "arret-maladie", label: "Arrêt maladie", description: "Le plafond est décalé d’autant, après validation sur justificatif." },
          ]}
        />
        <div className="flex gap-4 w-full">
          <Field size="sm" label="Du" className="flex-1">
            <DatePicker defaultValue={new Date(2027, 1, 12)} />
          </Field>
          <Field size="sm" label="Au" className="flex-1">
            <DatePicker defaultValue={new Date(2027, 1, 26)} />
          </Field>
        </div>
        <div className="border border-pink-400/30 rounded-xs p-4 flex flex-col gap-1.5 w-full">
          <Text size="xs" c="secondary">Ce que ça change</Text>
          <Text size="sm" className={TYPO.mono("bold")}>AOÛT 2027</Text>
          <Text size="sm" c="secondary">fin projetée au lieu de juin 2027. Tu restes 10 mois sous le plafond de juin 2028.</Text>
        </div>
      </div>
      <div className="flex gap-2 justify-end w-full pt-6">
        <Button variant="light" color="gray" size="sm" onClick={onClose}>Annuler</Button>
        <Button
          variant="light"
          color="gray"
          size="sm"
          onClick={() => {
            onClose()
            if (motif === "arret-maladie") onDeclarer()
          }}
        >
          Déclarer
        </Button>
      </div>
    </Modal>
  )
}

export function MonRythme() {
  const [absenceOpen, setAbsenceOpen] = useState(false)

  return (
    <div className="flex gap-10 p-10 w-full">
      <AbsenceModal
        open={absenceOpen}
        onClose={() => setAbsenceOpen(false)}
        onDeclarer={() => { window.location.hash = "#/arret-maladie" }}
      />

      <div className="flex flex-col gap-10 w-[800px] shrink-0">
        <div className="flex flex-col gap-2">
          <Title order={1} size="3xl" className={TYPO.title()}>Mon rythme</Title>
          <Text size="sm" c="secondary">Common Core · Paris campus · Milestone 5 sur 8</Text>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <Route size={18} />
            <Text size="lg" className={TYPO.title() + " font-bold"}>Mon parcours</Text>
          </div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <Text size="sm" c="secondary">
                Common Core — 8 milestones. Chaque milestone porte une durée de référence et une durée max. Démarré le 29 juin 2026.
              </Text>
              <Frise />
              <div className="flex flex-col gap-2">
                <Text size="sm" className="font-semibold">Ce que chaque milestone t’a rendu en marge</Text>
                <div className="border border-white/10 rounded-xs overflow-hidden">
                  <div className="grid grid-cols-5 bg-white/5 border-b border-white/10">
                    {["MILESTONE", "RÉFÉRENCE", "MAX", "RÉELLE", "MARGE"].map((h) => (
                      <div key={h} className="px-6 py-3"><Text size="xs" className="uppercase">{h}</Text></div>
                    ))}
                  </div>
                  {MILESTONES_V3.filter((m) => m.etat !== "locked").map((m) => (
                    <div key={m.n} className="grid grid-cols-5 border-b border-white/10 last:border-0">
                      <div className="px-6 py-4"><Text size="sm">{m.n}</Text></div>
                      <div className="px-6 py-4"><Text size="sm" className={TYPO.mono()}>{m.ref} j</Text></div>
                      <div className="px-6 py-4"><Text size="sm" className={TYPO.mono()}>{m.max} j</Text></div>
                      <div className="px-6 py-4">
                        <Text size="sm" className={TYPO.mono() + (m.etat === "current" ? " text-pink-400" : m.etat === "done-over-ref" ? " text-orange-400" : " text-green-500")}>
                          {m.etat === "current" ? "j21 en cours" : `${m.reel} j`}
                        </Text>
                      </div>
                      <div className="px-6 py-4"><Text size="sm" className={TYPO.mono()}>{m.marge != null ? `+${m.marge} j` : "—"}</Text></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Milestone en cours</Text><Text size="sm" className={TYPO.mono("bold")}>M5 · j21 / 63</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Marge acquise</Text><Text size="sm" className={TYPO.mono("bold")}>15 j</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Marge posée</Text><Text size="sm" className={TYPO.mono("bold")}>0 j</Text></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <Target size={18} />
            <Text size="lg" className={TYPO.title() + " font-bold"}>Milestone 05 — en cours</Text>
          </div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <Text size="md" className="font-bold">Réseau &amp; programmation système</Text>
                <Badge color="pink" variant="light">En cours</Badge>
              </div>
              <Progress value={17} color="pink" />
              <div className="flex gap-10">
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Durée max</Text><Text size="sm" className={TYPO.mono("bold")}>126 jours</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Temps écoulé</Text><Text size="sm" className={TYPO.mono("bold")}>21 jours</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Durée de référence</Text><Text size="sm" className={TYPO.mono("bold")}>63 jours</Text></div>
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

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <Clock size={18} />
            <Text size="lg" className={TYPO.title() + " font-bold"}>Poser des jours de marge</Text>
          </div>
          <Card padding="lg">
            <div className="flex flex-col gap-4">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>15 JOURS À TOI</Title>
              <Text size="sm" c="secondary">
                Un jour posé recule la durée max de la milestone où tu le poses, sans toucher à ta progression. La marge est globale : ce que tu ne poses pas ici reste disponible plus tard dans le parcours.
              </Text>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between"><Text size="sm" c="secondary">Posés sur M5</Text><Text size="sm" className={TYPO.mono()}>0 j</Text></div>
                <div className="flex justify-between"><Text size="sm" c="secondary">Encore disponibles</Text><Text size="sm" className={TYPO.mono()}>15 j</Text></div>
                <div className="flex justify-between"><Text size="sm" c="secondary">Plafond du cursus</Text><Text size="sm" className={TYPO.mono()}>24 mois</Text></div>
              </div>
              <Text size="xs" c="muted" className="uppercase">
                Les jours accordés par le staff (fermeture, arrêt maladie, aménagement) ne sont pas pris sur ta marge.
              </Text>
              <a href="#/simulateur" className="self-start">
                <Button variant="outline" color="gray" size="sm">Ouvrir le simulateur</Button>
              </a>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-10 w-[340px] shrink-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5"><Flag size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Prochaine étape</Text></div>
          <Card variant="gradient" padding="sm">
            <div className="flex flex-col gap-3">
              <Text size="sm" className="font-semibold">minishell</Text>
              <Text size="sm" c="secondary">Prochain projet de la Milestone 05.</Text>
              <Text size="xs" className={TYPO.mono() + " text-pink-400"}>≈ 3 SEMAINES · RÉFÉRENCE 63 J</Text>
              <a href="#/simulateur"><Button variant="filled" color="pink" size="sm">Continuer</Button></a>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5"><Wallet size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma marge</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>15 JOURS</Title>
              <Text size="sm" c="secondary">de marge acquise — à poser où tu veux dans ton parcours.</Text>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between"><Text size="xs" c="secondary">3 milestones dans la référence</Text><Text size="xs" className={TYPO.mono()}>+12 j</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">1 milestone au-delà (prorata)</Text><Text size="xs" className={TYPO.mono()}>+3 j</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">Rattrapage assiduité / investissement</Text><Text size="xs" className={TYPO.mono()}>+0 j</Text></div>
              </div>
              <Text size="xs" c="muted" className="uppercase pt-2">0 j posé · 15 j disponibles</Text>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5"><Target size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Mon objectif</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>50 JOURS · 32 H/SEM</Title>
              <Text size="sm" c="secondary">ce que tu t’es fixée sur M5. La référence pédagogique, elle, est à 63 jours.</Text>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between"><Text size="xs" c="secondary">Jour</Text><Text size="xs" className={TYPO.mono()}>21 sur 50</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">Rythme réel</Text><Text size="xs" className={TYPO.mono()}>32 h/sem</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">Projection</Text><Text size="xs" className={TYPO.mono()}>48 j</Text></div>
              </div>
              <Text size="xs" c="muted" className="uppercase pt-2">
                Si tu ne tiens pas cet objectif, toi seule es prévenue. Le staff ne l’est que si tu sors de la référence.
              </Text>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5"><Clock size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma présence</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>32 H / SEMAINE</Title>
              <Text size="sm" c="secondary">moyenne des 4 dernières semaines</Text>
              <Text size="xs" c="secondary">L’assiduité ne peut pas te mettre en retard. Elle alimente ta marge.</Text>
              <div className="border border-white/10 rounded-xs overflow-hidden mt-1">
                <div className="grid grid-cols-2 bg-white/5 border-b border-white/10">
                  <div className="px-4 py-2"><Text size="xs" className="uppercase">Semaine</Text></div>
                  <div className="px-4 py-2"><Text size="xs" className="uppercase">Heures</Text></div>
                </div>
                {PRESENCE_4_SEM.map((s) => (
                  <div key={s.semaine} className="grid grid-cols-2 border-b border-white/10 last:border-0">
                    <div className="px-4 py-3"><Text size="sm">{s.semaine}</Text></div>
                    <div className="px-4 py-3"><Text size="sm" className={TYPO.mono()}>{s.heures} h</Text></div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <Button variant="subtle" color="gray" size="sm" className="justify-start px-0">Voir mon assiduité</Button>
                <Button variant="subtle" color="gray" size="sm" className="justify-start px-0" startSlot={<CalendarOff size={14} />} onClick={() => setAbsenceOpen(true)}>
                  Déclarer une absence
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5"><MessageCircle size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma participation</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>5 REVIEWS</Title>
              <Text size="sm" c="secondary">données cette semaine · objectif 2 par semaine</Text>
              <Progress value={100} color="pink" />
              <Button variant="subtle" color="gray" size="sm" className="justify-start px-0">Voir mes reviews</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
