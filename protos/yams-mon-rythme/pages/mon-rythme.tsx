import { Route, Target, Wallet, Clock, MessageCircle, Flag, CalendarOff, SlidersHorizontal, RotateCcw } from "lucide-react"
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
import { Slider } from "@42/ui-react/slider"
import { NumberInput } from "@42/ui-react/number-input"
import { Fragment, useState } from "react"
import { TYPO } from "../../../src/typo"
import { MILESTONES_V3, PROJETS_M5, PRESENCE_4_SEM } from "../data/fixtures"
import type { Milestone } from "../data/fixtures"

/* -------------------------------------------------------------------------- *
 * LA FRISE EST L'OUTIL, PAS L'ILLUSTRATION.
 *
 * Trois pistes sur un même axe en jours — mon objectif / la référence / le réel —
 * et deux leviers qui les font bouger en direct : étendre ou resserrer son objectif
 * sur une quest, et poser des jours de marge dessus. Tout ce que l'écran affiche
 * ailleurs (marge restante, plafond, objectif de M5) est dérivé du MÊME état : on
 * bouge un curseur, l'écran entier répond. C'est ce qui sépare un tableau de bord
 * d'un outil de pilotage.
 *
 * ⚠️ Pas de composant DS pour la frise elle-même (la maquette Figma porte le layer
 * "frise-parcours ⚠ candidat composant DS") : composée à la main, signalée comme
 * manque dans le rapport de génération. Les deux leviers, eux, sont des composants
 * du kit : Slider et NumberInput.
 * -------------------------------------------------------------------------- */

export type Pilotage = { objectifs: Record<string, number>; conges: Record<string, number> }

const TOTAL_REF = MILESTONES_V3.reduce((t, m) => t + m.ref, 0)
const MARGE_ACQUISE = MILESTONES_V3.reduce((t, m) => t + (m.marge ?? 0), 0)
const TOTAL_MAX_INIT = MILESTONES_V3.reduce((t, m) => t + m.max, 0)
const JOUR_COURANT = MILESTONES_V3.reduce((t, m) => t + (m.reel ?? 0), 0)

/** Axe FIXE : le plafond initial plus toute la marge posable. Il ne bouge pas quand
 *  on pose des jours — sinon la frise se remettrait à l'échelle à chaque clic et on
 *  ne verrait justement pas l'effet du levier. */
const AXE = TOTAL_MAX_INIT + MARGE_ACQUISE

export const PILOTAGE_INIT: Pilotage = {
  objectifs: Object.fromEntries(MILESTONES_V3.map((m) => [m.n, m.objectif])),
  conges: Object.fromEntries(MILESTONES_V3.map((m) => [m.n, 0])),
}

const mois = (j: number) => Math.round(j / 30.4)
const pct = (j: number) => (j / AXE) * 100
const sommeObjectifs = (p: Pilotage) => MILESTONES_V3.reduce((t, m) => t + p.objectifs[m.n] + p.conges[m.n], 0)
const sommePlafond = (p: Pilotage) => MILESTONES_V3.reduce((t, m) => t + m.max + p.conges[m.n], 0)
const margePosee = (p: Pilotage) => MILESTONES_V3.reduce((t, m) => t + p.conges[m.n], 0)

function hintFor(m: Milestone, obj: number, conge: number) {
  const base = `${m.n} · objectif ${obj} j · référence ${m.ref} j · plafond ${m.max + conge} j`
  const pose = conge > 0 ? ` · ${conge} j de marge posés` : ""
  if (m.etat === "locked") return `${base}${pose} · pas encore commencée`
  if (m.etat === "current") return `${base}${pose} · en cours, jour ${m.reel}`
  return `${base}${pose} · terminée en ${m.reel} j`
}

function verdict(m: Milestone, obj: number) {
  if (m.reel == null) return { texte: "pas commencée", ton: "text-white/50" }
  if (m.etat === "current") return { texte: `jour ${m.reel} sur ${obj}`, ton: "text-pink-400" }
  if (m.reel <= obj) return { texte: `${m.reel} j · objectif tenu`, ton: "text-green-500" }
  if (m.reel <= m.ref) return { texte: `${m.reel} j · dans la référence`, ton: "text-green-500" }
  return { texte: `${m.reel} j · au-delà de la référence`, ton: "text-orange-500" }
}

/** Un segment de piste. La bordure droite transparente + bg-clip-padding sépare deux
 *  quests voisines de même couleur SANS manger de largeur (box-sizing: border-box),
 *  donc l'axe en jours reste exact : un `gap` aurait décalé les trois pistes entre elles. */
function Segment({ label, jours, fill, selected, onSelect }: { label: string; jours: number; fill: string; selected: boolean; onSelect: () => void }) {
  return (
    <Tooltip label={label} withArrow asChild>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={label}
        style={{ flexGrow: jours, flexBasis: 0 }}
        className={`min-w-0 h-6 rounded-xs bg-clip-padding border-r-2 border-transparent transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${fill} ${selected ? "ring-2 ring-white/60" : ""}`}
      />
    </Tooltip>
  )
}

function Etiquettes({ valeur, reste, filtre }: { valeur: (m: Milestone) => number; reste: number; filtre?: (m: Milestone) => boolean }) {
  const liste = filtre ? MILESTONES_V3.filter(filtre) : MILESTONES_V3
  return (
    <div className="flex w-full">
      {liste.map((m) => (
        <div key={m.n} style={{ flexGrow: valeur(m), flexBasis: 0 }} className="min-w-0 pr-1">
          <Text size="xs" c="muted" className={TYPO.mono() + " truncate block"}>{m.n}</Text>
        </div>
      ))}
      <div style={{ flexGrow: reste, flexBasis: 0 }} />
    </div>
  )
}

function Frise({ p, selected, onSelect }: { p: Pilotage; selected: string; onSelect: (n: string) => void }) {
  const totalObj = sommeObjectifs(p)
  const totalMax = sommePlafond(p)
  const dispo = MARGE_ACQUISE - margePosee(p)
  const faits = MILESTONES_V3.filter((m) => m.reel != null)

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* la règle : du premier jour au plafond */}
      <div className="relative w-full h-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        {[0, 6, 12].map((t) => (
          <div key={t} className="absolute bottom-0 flex flex-col items-start gap-1" style={{ left: `${pct(t * 30.4)}%` }}>
            <Text size="xs" c="muted" className={TYPO.mono() + " whitespace-nowrap"}>{t === 0 ? "DÉBUT" : t === 12 ? "1 AN" : `${t} MOIS`}</Text>
            <div className="w-px h-2 bg-white/20" />
          </div>
        ))}
        <div className="absolute bottom-0 flex flex-col items-end gap-1" style={{ right: `${100 - pct(totalMax)}%` }}>
          <Text size="xs" c="muted" className={TYPO.mono() + " whitespace-nowrap"}>PLAFOND · {mois(totalMax)} MOIS</Text>
          <div className="w-px h-2 bg-white/20" />
        </div>
      </div>

      <div className="relative flex flex-col gap-5 w-full">
        <div className="absolute inset-y-0 w-px bg-white/40 pointer-events-none" style={{ left: `${pct(JOUR_COURANT)}%` }} />
        <div className="absolute inset-y-0 w-px bg-white/20 pointer-events-none" style={{ left: `${pct(totalMax)}%` }} />

        {/* piste 1 — mon objectif, la seule sur laquelle j'ai la main */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Text size="xs" className="uppercase font-semibold">Mon objectif</Text>
            <Text size="xs" c="muted">ce que je me fixe — privé, toi seule es prévenue</Text>
          </div>
          <div className="flex w-full items-center">
            {MILESTONES_V3.map((m) => (
              <Fragment key={m.n}>
                <Segment
                  label={hintFor(m, p.objectifs[m.n], p.conges[m.n])}
                  jours={p.objectifs[m.n]}
                  fill="bg-purple-300/40"
                  selected={m.n === selected}
                  onSelect={() => onSelect(m.n)}
                />
                {p.conges[m.n] > 0 && (
                  <Segment
                    label={`${m.n} · ${p.conges[m.n]} j de marge posés — rien n’est attendu de toi sur ces jours-là`}
                    jours={p.conges[m.n]}
                    fill="bg-white/30"
                    selected={m.n === selected}
                    onSelect={() => onSelect(m.n)}
                  />
                )}
              </Fragment>
            ))}
            <div style={{ flexGrow: AXE - totalObj, flexBasis: 0 }} className="min-w-0 pl-2">
              <Text size="xs" c="secondary" className={TYPO.mono() + " whitespace-nowrap"}>{totalObj} J · ≈ {mois(totalObj)} MOIS</Text>
            </div>
          </div>
        </div>

        {/* piste 2 — la référence, que je subis */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Text size="xs" className="uppercase font-semibold">Référence pédagogique</Text>
            <Text size="xs" c="muted">le seuil que le staff regarde</Text>
          </div>
          <div className="flex w-full items-center">
            {MILESTONES_V3.map((m) => (
              <Segment
                key={m.n}
                label={hintFor(m, p.objectifs[m.n], p.conges[m.n])}
                jours={m.ref}
                fill="bg-white/15"
                selected={m.n === selected}
                onSelect={() => onSelect(m.n)}
              />
            ))}
            <div style={{ flexGrow: AXE - TOTAL_REF, flexBasis: 0 }} className="min-w-0 pl-2">
              <Text size="xs" c="secondary" className={TYPO.mono() + " whitespace-nowrap"}>{TOTAL_REF} J · ≈ {mois(TOTAL_REF)} MOIS</Text>
            </div>
          </div>
          <Etiquettes valeur={(m) => m.ref} reste={AXE - TOTAL_REF} />
        </div>

        {/* piste 3 — le réel, qui ne se pilote pas */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-baseline gap-2 flex-wrap">
            <Text size="xs" className="uppercase font-semibold">Réel</Text>
            <Text size="xs" c="muted">ce qui s’est passé</Text>
          </div>
          <div className="flex w-full items-center">
            {faits.map((m) => (
              <Segment
                key={m.n}
                label={hintFor(m, p.objectifs[m.n], p.conges[m.n])}
                jours={m.reel ?? 0}
                fill={m.etat === "current" ? "bg-gradient-to-r from-pink-400 to-purple-300" : m.etat === "done-over-ref" ? "bg-orange-500" : "bg-green-500"}
                selected={m.n === selected}
                onSelect={() => onSelect(m.n)}
              />
            ))}
            <div style={{ flexGrow: AXE - JOUR_COURANT, flexBasis: 0 }} className="min-w-0 pl-2">
              <Text size="xs" c="secondary" className={TYPO.mono() + " whitespace-nowrap"}>AUJOURD’HUI · JOUR {JOUR_COURANT}</Text>
            </div>
          </div>
          <Etiquettes valeur={(m) => m.reel ?? 0} reste={AXE - JOUR_COURANT} filtre={(m) => m.reel != null} />
        </div>
      </div>

      <div className="flex gap-6 items-center flex-wrap">
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-purple-300/40" /><Text size="xs" c="secondary">mon objectif</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-white/30" /><Text size="xs" c="secondary">marge posée</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-white/15" /><Text size="xs" c="secondary">référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-green-500" /><Text size="xs" c="secondary">tenue dans la référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-orange-500" /><Text size="xs" c="secondary">au-delà de la référence</Text></span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-xs bg-gradient-to-r from-pink-400 to-purple-300" /><Text size="xs" c="secondary">en cours</Text></span>
      </div>

      <div className="flex gap-10 flex-wrap">
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Si je tiens mes objectifs</Text>
          <Text size="sm" className={TYPO.mono("bold")}>{totalObj} J · ≈ {mois(totalObj)} MOIS</Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Référence</Text>
          <Text size="sm" className={TYPO.mono("bold")}>{TOTAL_REF} J · ≈ {mois(TOTAL_REF)} MOIS</Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Plafond</Text>
          <Text size="sm" className={TYPO.mono("bold")}>{totalMax} J · ≈ {mois(totalMax)} MOIS</Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text size="xs" c="secondary">Marge restante</Text>
          <Text size="sm" className={TYPO.mono("bold") + " text-green-500"}>{dispo} J</Text>
        </div>
      </div>
    </div>
  )
}

function Pilote({ p, setP, sel }: { p: Pilotage; setP: (next: Pilotage) => void; sel: Milestone }) {
  const obj = p.objectifs[sel.n]
  const conge = p.conges[sel.n]
  const posee = margePosee(p)
  const dispo = MARGE_ACQUISE - posee
  const fige = sel.etat === "done"
  const plancher = sel.reel ?? 5
  const v = verdict(sel, obj)

  const setObjectif = (n: number) => setP({ ...p, objectifs: { ...p.objectifs, [sel.n]: n } })
  const setConge = (n: number) => setP({ ...p, conges: { ...p.conges, [sel.n]: n } })

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={18} />
        <Text size="sm" className="font-semibold">Piloter {sel.n}</Text>
        <Text size="sm" className={TYPO.mono() + " " + v.ton}>{v.texte}</Text>
        <div className="grow" />
        <Button variant="subtle" color="gray" size="sm" startSlot={<RotateCcw size={14} />} onClick={() => setP(PILOTAGE_INIT)}>
          Tout réinitialiser
        </Button>
      </div>

      {fige ? (
        <Text size="sm" c="secondary">
          {sel.n} est terminée en {sel.reel} j : son objectif ne se change plus, et on ne pose pas de marge sur une quest déjà passée. Choisis M5 ou une quest à venir sur la frise pour piloter.
        </Text>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <Text size="sm" className="font-semibold">Mon objectif sur {sel.n}</Text>
              <Text size="sm" className={TYPO.mono("bold")}>{obj} J</Text>
            </div>
            <Slider value={obj} onChange={(n) => setObjectif(n as number)} min={plancher} max={sel.max} className="w-full" />
            <div className="flex justify-between gap-4 flex-wrap">
              <Text size="xs" c="muted" className={TYPO.mono()}>MIN {plancher} J</Text>
              <Text size="xs" c="secondary" className={TYPO.mono()}>RÉFÉRENCE {sel.ref} J</Text>
              <Text size="xs" c="muted" className={TYPO.mono()}>PLAFOND {sel.max + conge} J</Text>
            </div>
            <Text size="xs" c="muted">
              {obj < sel.ref
                ? `Tu vises ${sel.ref - obj} j de moins que la référence. Si tu ne tiens pas ce rythme, toi seule es prévenue.`
                : obj === sel.ref
                ? "Tu vises exactement la référence."
                : `Tu vises ${obj - sel.ref} j de plus que la référence : au-delà de la référence, le staff est prévenu.`}
            </Text>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <Text size="sm" className="font-semibold">Poser des jours de marge sur {sel.n}</Text>
              <Text size="sm" className={TYPO.mono("bold") + " text-green-500"}>{dispo} J DISPONIBLES</Text>
            </div>
            <div className="flex items-start gap-4 flex-wrap">
              <NumberInput
                value={conge}
                onChange={(n) => setConge(n ?? 0)}
                min={0}
                max={dispo + conge}
                step={1}
                suffix=" j"
                size="sm"
                clampValueOnBlur
                className="w-32"
              />
              <Text size="xs" c="muted" className="flex-1 min-w-0">
                Un jour posé recule le plafond de {sel.n} d’autant, sans toucher à ta progression. La marge est globale : ce que tu ne poses pas ici reste disponible plus tard. {posee} j posés sur {MARGE_ACQUISE} j acquis. Les jours accordés par le staff (fermeture, arrêt maladie, aménagement) ne sont pas pris dessus.
              </Text>
            </div>
          </div>

          <a href="#/simulateur" className="self-start">
            <Button variant="outline" color="gray" size="sm">Projeter ce rythme dans le simulateur</Button>
          </a>
        </>
      )}
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
  const [pilotage, setPilotage] = useState<Pilotage>(PILOTAGE_INIT)

  const sel = MILESTONES_V3.find((m) => m.n === selectedMilestone) ?? MILESTONES_V3[4]
  const posee = margePosee(pilotage)
  const dispo = MARGE_ACQUISE - posee
  const totalMax = sommePlafond(pilotage)
  const objM5 = pilotage.objectifs["M5"]

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
            <div className="flex flex-col gap-6">
              <Text size="sm" c="secondary">
                Common Core — 8 milestones. Chaque milestone porte une durée de référence et une durée max ; toi, tu te fixes un objectif entre les deux. Démarré le 29 juin 2026.
              </Text>
              <Frise p={pilotage} selected={selectedMilestone} onSelect={setSelectedMilestone} />
              <div className="h-px w-full bg-white/10" />
              <Pilote p={pilotage} setP={setPilotage} sel={sel} />
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
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Mon objectif</Text><Text size="sm" className={TYPO.mono("bold")}>{objM5} jours</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Temps écoulé</Text><Text size="sm" className={TYPO.mono("bold")}>21 jours</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Durée de référence</Text><Text size="sm" className={TYPO.mono("bold")}>63 jours</Text></div>
                <div className="flex flex-col gap-1"><Text size="xs" c="secondary">Durée max</Text><Text size="sm" className={TYPO.mono("bold")}>{126 + pilotage.conges["M5"]} jours</Text></div>
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Flag size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Prochaine étape</Text></div>
          <Card variant="gradient" padding="sm">
            <div className="flex flex-col gap-3">
              <Text size="sm" className="font-semibold">minishell</Text>
              <Text size="sm" c="secondary">Prochain projet de la Milestone 05.</Text>
              <Text size="xs" className={TYPO.mono() + " text-pink-400"}>≈ 3 SEMAINES · OBJECTIF {objM5} J</Text>
              <a href="#/simulateur"><Button variant="filled" color="pink" size="sm">Continuer</Button></a>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Wallet size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Ma marge</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>{dispo} JOURS</Title>
              <Text size="sm" c="secondary">encore disponibles — à poser où tu veux dans ton parcours.</Text>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between"><Text size="xs" c="secondary">3 milestones dans la référence</Text><Text size="xs" className={TYPO.mono()}>+12 j</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">1 milestone au-delà (prorata)</Text><Text size="xs" className={TYPO.mono()}>+3 j</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">Rattrapage assiduité / investissement</Text><Text size="xs" className={TYPO.mono()}>+0 j</Text></div>
              </div>
              <Text size="xs" c="muted" className="uppercase pt-2">{posee} j posés · {dispo} j disponibles sur {MARGE_ACQUISE} j acquis</Text>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2"><Target size={18} /><Text size="lg" className={TYPO.title() + " font-bold"}>Mon objectif</Text></div>
          <Card padding="lg">
            <div className="flex flex-col gap-3">
              <Title order={2} size="2xl" className={TYPO.mono("bold")}>{objM5} JOURS · 32 H/SEM</Title>
              <Text size="sm" c="secondary">ce que tu t’es fixée sur M5. La référence pédagogique, elle, est à 63 jours.</Text>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between"><Text size="xs" c="secondary">Jour</Text><Text size="xs" className={TYPO.mono()}>21 sur {objM5}</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">Rythme réel</Text><Text size="xs" className={TYPO.mono()}>32 h/sem</Text></div>
                <div className="flex justify-between"><Text size="xs" c="secondary">Plafond du parcours</Text><Text size="xs" className={TYPO.mono()}>{mois(totalMax)} mois</Text></div>
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
