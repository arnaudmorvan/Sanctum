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
import { Tooltip } from "@42/ui-react/tooltip"
import { useState } from "react"
import { TYPO } from "../../../src/typo"
import { MILESTONES_V3, PROJETS_M5, PRESENCE_4_SEM } from "../data/fixtures"
import type { Milestone } from "../data/fixtures"

// "frise-parcours" — pas de composant DS pour une frise à plusieurs seuils par quest
// (repéré ⚠ candidat composant DS sur la maquette elle-même) : composée à la main,
// signalée comme manque dans le rapport de génération.
//
// V3 de la frise, sur retour du designer : "on ne voit pas la durée de référence, on ne
// voit pas comment on se fixe des objectifs — on peut faire les milestones en 1 an mais
// max 2 ans". Le système a donc TROIS seuils, et une frise qui n'en montre qu'un ne dit
// rien. Ici : trois pistes superposées sur UN MÊME axe en jours (0 → plafond), pour lire
// d'un coup d'œil où finit l'objectif qu'on se fixe, où finit la référence, et où on en
// est vraiment. La verticale claire marque aujourd'hui, à travers les trois pistes.
function hintFor(m: Milestone) {
  const base = `${m.n} · objectif ${m.objectif} j · référence ${m.ref} j · plafond ${m.max} j`
  if (m.etat === "locked") return `${base} · pas encore commencée`
  if (m.etat === "current") return `${base} · en cours, jour ${m.reel}`
  return `${base} · terminée en ${m.reel} j`
}

function verdict(m: Milestone) {
  if (m.reel == null) return { texte: "—", ton: "text-white/50" }
  if (m.etat === "current") return { texte: `jour ${m.reel}`, ton: "text-pink-400" }
  if (m.reel <= m.objectif) return { texte: `${m.reel} j · objectif tenu`, ton: "text-green-500" }
  if (m.reel <= m.ref) return { texte: `${m.reel} j · dans la référence`, ton: "text-green-500" }
  return { texte: `${m.reel} j · au-delà de la référence`, ton: "text-orange-500" }
}

function Segment({ m, jours, fill, selected, onSelect }: { m: Milestone; jours: number; fill: string; selected: boolean; onSelect: (n: string) => void }) {
  const h = hintFor(m)
  return (
    <Tooltip label={h} withArrow asChild>
      <button
        type="button"
        onClick={() => onSelect(m.n)}
        aria-pressed={selected}
        aria-label={h}
        style={{ flexGrow: jours, flexBasis: 0 }}
        // border-r transparent + bg-clip-padding : sépare visuellement deux milestones
        // voisines de même couleur SANS manger de largeur (box-sizing: border-box), donc
        // l'axe en jours reste exact — un `gap` aurait décalé les trois pistes entre elles.
        className={`min-w-0 h-6 rounded-xs bg-clip-padding border-r-2 border-transparent transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${fill} ${selected ? "ring-2 ring-white/60" : ""}`}
      />
    </Tooltip>
  )
}

function Frise({ selected, onSelect }: { selected: string; onSelect: (n: string) => void }) {
  const sel = MILESTONES_V3.find((m) => m.n === selected) ?? MILESTONES_V3[4]
  const totalRef = MILESTONES_V3.reduce((t, m) => t + m.ref, 0)
  const totalObj = MILESTONES_V3.reduce((t, m) => t + m.objectif, 0)
  const totalMax = MILESTONES_V3.reduce((t, m) => t + m.max, 0)
  const jourCourant = MILESTONES_V3.reduce((t, m) => t + (m.reel ?? 0), 0)
  const faits = MILESTONES_V3.filter((m) => m.reel != null)
  const mois = (j: number) => Math.round(j / 30.4)
  const pct = (j: number) => (j / totalMax) * 100
  const v = verdict(sel)

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* L'axe : 0 → plafond du parcours. Les trois pistes se lisent dessus. */}
      <div className="relative w-full h-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        {[0, 6, 12].map((t) => (
          <div key={t} className="absolute bottom-0 flex flex-col items-start gap-1" style={{ left: `${pct(t * 30.4)}%` }}>
            <Text size="xs" c="muted" className={TYPO.mono() + " whitespace-nowrap"}>{t === 0 ? "DÉBUT" : t === 12 ? "1 AN" : `${t} MOIS`}</Text>
            <div className="w-px h-2 bg-white/20" />
          </div>
        ))}
        <div className="absolute bottom-0 right-0 flex flex-col items-end gap-1">
          <Text size="xs" c="muted" className={TYPO.mono() + " whitespace-nowrap"}>PLAFOND · {mois(totalMax)} MOIS</Text>
          <div className="w-px h-2 bg-white/20" />
        </div>
      </div>

      <div className="relative flex flex-col gap-5 w-full">
        {/* aujourd'hui, à travers les trois pistes */}
        <div className="absolute inset-y-0 w-px bg-white/40 pointer-events-none" style={{ left: `${pct(jourCourant)}%` }} />

        {/* piste 1 — mon objectif */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Text size="xs" className="uppercase font-semibold">Mon objectif</Text>
            <Text size="xs" c="muted">ce que je me fixe — privé, toi seule es prévenue</Text>
          </div>
          <div className="flex w-full items-center">
            {MILESTONES_V3.map((m) => (
              <Segment key={m.n} m={m} jours={m.objectif} fill="bg-purple-300/40" selected={m.n === selected} onSelect={onSelect} />
            ))}
            <div style={{ flexGrow: totalMax - totalObj, flexBasis: 0 }} className="min-w-0 pl-2">
              <Text size="xs" c="secondary" className={TYPO.mono() + " whitespace-nowrap"}>{totalObj} J · ≈ {mois(totalObj)} MOIS</Text>
            </div>
          </div>
        </div>

        {/* piste 2 — la référence */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Text size="xs" className="uppercase font-semibold">Référence pédagogique</Text>
            <Text size="xs" c="muted">le seuil que le staff regarde</Text>
          </div>
          <div className="flex w-full items-center">
            {MILESTONES_V3.map((m) => (
              <Segment key={m.n} m={m} jours={m.ref} fill="bg-white/15" selected={m.n === selected} onSelect={onSelect} />
            ))}
            <div style={{ flexGrow: totalMax - totalRef, flexBasis: 0 }} className="min-w-0 pl-2">
              <Text size="xs" c="secondary" className={TYPO.mono() + " whitespace-nowrap"}>{totalRef} J · ≈ {mois(totalRef)} MOIS</Text>
            </div>
          </div>
          <div className="flex w-full">
            {MILESTONES_V3.map((m) => (
              <div key={m.n} style={{ flexGrow: m.ref, flexBasis: 0 }} className="min-w-0 pr-1">
                <Text size="xs" c="muted" className={TYPO.mono() + " truncate block"}>{m.n}</Text>
              </div>
            ))}
            <div style={{ flexGrow: totalMax - totalRef, flexBasis: 0 }} />
          </div>
        </div>

        {/* piste 3 — le réel */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Text size="xs" className="uppercase font-semibold">Réel</Text>
            <Text size="xs" c="muted">ce qui s’est passé</Text>
          </div>
          <div className="flex w-full items-center">
            {faits.map((m) => (
              <Segment
                key={m.n}
                m={m}
                jours={m.reel ?? 0}
                fill={m.etat === "current" ? "bg-gradient-to-r from-pink-400 to-purple-300" : m.etat === "done-over-ref" ? "bg-orange-500" : "bg-green-500"}
                selected={m.n === selected}
                onSelect={onSelect}
              />
            ))}
            <div style={{ flexGrow: totalMax - jourCourant, flexBasis: 0 }} className="min-w-0 pl-2">
              <Text size="xs" c="secondary" className={TYPO.mono() + " whitespace-nowrap"}>AUJOURD’HUI · JOUR {jourCourant}</Text>
            </div>
          </div>
          <div className="flex w-full">
            {faits.map((m) => (
              <div key={m.n} style={{ flexGrow: m.reel ?? 0, flexBasis: 0 }} className="min-w-0 pr-1">
                <Text size="xs" c="muted" className={TYPO.mono() + " truncate block"}>{m.n}</Text>
              </div>
            ))}
            <div style={{ flexGrow: totalMax - jourCourant, flexBasis: 0 }} />
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-center flex-wrap">
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-purple-300/40" /><Text size="xs" c="secondary">mon objectif</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-white/15" /><Text size="xs" c="secondary">référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-green-500" /><Text size="xs" c="secondary">tenue dans la référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-orange-500" /><Text size="xs" c="secondary">au-delà de la référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-gradient-to-r from-pink-400 to-purple-300" /><Text size="xs" c="secondary">en cours</Text></span>
      </div>
      <Text size="xs" c="muted">
        Les trois pistes partagent le même axe en jours, du premier jour au plafond du parcours. Clique une milestone sur n’importe quelle piste pour comparer ses trois seuils.
      </Text>

      <div className="flex gap-10 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Milestone</Text>
          <Text size="sm" className={TYPO.mono("bold")}>{sel.n}</Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Mon objectif</Text>
          <Text size="sm" className={TYPO.mono("bold")}>{sel.objectif} J</Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Référence</Text>
          <Text size="sm" className={TYPO.mono("bold")}>{sel.ref} J</Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Plafond</Text>
          <Text size="sm" className={TYPO.mono("bold")}>{sel.max} J</Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Résultat</Text>
          <Text size="sm" className={TYPO.mono("bold") + " " + v.ton}>{v.texte}</Text>
        </div>
        <a href="#/simulateur">
          <Button variant="outline" color="gray" size="sm">Ajuster mon objectif</Button>
        </a>
      </div>
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
        <div className="border border-pink-400/30 rounded-xs p-4 flex flex-col gap-2 w-full">
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
  const [selectedMilestone, setSelectedMilestone] = useState<string>("M5")

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
          <div className="flex items-center gap-2">
            <Route size={18} />
            <Text size="lg" className={TYPO.title() + " font-bold"}>Mon parcours</Text>
          </div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <Text size="sm" c="secondary">
                Common Core — 8 milestones. Chaque milestone porte une durée de référence et une durée max. Démarré le 29 juin 2026.
              </Text>
              <Frise selected={selectedMilestone} onSelect={setSelectedMilestone} />
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
          <div className="flex items-center gap-2">
            <Target size={18} />
            <Text size="lg" className={TYPO.title() + " font-bold"}>Milestone 05 — en cours</Text>
          </div>
          <Card padding="lg">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <Text size="md" className="font-bold">Réseau &amp; programmation système</Text>
                <Badge color="pink" variant="light">En cours</Badge>
              </div>
              <Progress value={17} variant="gradient" />
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
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2"><Flag size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Prochaine étape</Text></div>
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
          <div className="flex items-center gap-2"><Wallet size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma marge</Text></div>
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
          <div className="flex items-center gap-2"><Target size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Mon objectif</Text></div>
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
          <div className="flex items-center gap-2"><Clock size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma présence</Text></div>
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
          <div className="flex items-center gap-2"><MessageCircle size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma participation</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>5 REVIEWS</Title>
              <Text size="sm" c="secondary">données cette semaine · objectif 2 par semaine</Text>
              <Progress value={100} variant="gradient" />
              <Button variant="subtle" color="gray" size="sm" className="justify-start px-0">Voir mes reviews</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
