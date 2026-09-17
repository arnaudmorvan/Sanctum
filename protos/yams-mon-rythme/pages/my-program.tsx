import { useMemo, useRef, useState } from "react"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { NumberInput } from "@42/ui-react/number-input"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Select } from "@42/ui-react/select"
import { Slider } from "@42/ui-react/slider"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Tooltip } from "@42/ui-react/tooltip"
import { TYPO } from "../../../src/typo"
import {
  MILESTONES, CURRENT, AXIS, BREAK_ROOM, BREAK_MAX, MARGIN_STOCK,
  REF_OFF_DEFAULT, ATTENDANCE, ENGAGEMENT, REF_TOTAL, CAP_TOTAL,
} from "../data/curriculum"

/* ────────────────────────────────────────────────────────────────────────────
   LA PALETTE DE LA FRISE, EN UN SEUL ENDROIT.
   La frise n'a pas de composant DS : ses blocs sont composés à la main, donc
   leurs classes sont écrites ici et nulle part ailleurs. Aucun hex : des noms de
   couleurs du thème et `currentColor` pour les hachures. ⚠️ Les noms de classes
   du thème ne sont pas documentés dans le contexte MCP (gap déjà signalé au
   rapport du 17/09) : si une teinte sort fausse, c'est ICI que ça se corrige,
   pas dans le corps de l'écran.
   ──────────────────────────────────────────────────────────────────────────── */
const SEG = {
  goal: "bg-brand-800 text-white",
  ref: "bg-white/15 text-white",
  done: "bg-white/5 text-white/80",
  todo: "bg-transparent text-white/40 ring-1 ring-inset ring-white/10",
  proj: "bg-white/5 text-white/70",
  off: "bg-white/10 text-white/70 ring-1 ring-inset ring-white/20",
  live: "bg-gradient-to-b from-pink-400 to-purple-300 text-brand-950",
  overSolid: "bg-orange-500 text-brand-950",
  critSolid: "bg-red-500 text-brand-950",
  overSoft: "bg-orange-500/25 text-white",
  critSoft: "bg-red-500/25 text-white",
} as const

const LINE = { today: "bg-pink-400", cap: "border-red-500", year: "border-white/25", pace: "border-white/50", paceLate: "border-orange-500" } as const

const FRISE_H = 880

interface Break { id: number; ms: number; after: number; len: number }

const d = (n: number) => `${Math.round(n)} d`
const months = (n: number) => (n / 30.44).toFixed(1).replace(/\.0$/, "")

/** Hachure : des filets pleins en `currentColor`, jamais une teinte à 10 % qui
 *  disparaît sur le ciel. Posée en surcouche pour ne rien coûter à la hauteur —
 *  et la hauteur, ici, EST la durée. */
function Hatch({ tone }: { tone: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${tone} bg-[repeating-linear-gradient(135deg,currentColor_0_2px,transparent_2px_7px)]`}
    />
  )
}

/** Le trait qui marque la référence, en surcouche pour la même raison. */
function RefEdge({ tone }: { tone: string }) {
  return <span aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 ${tone}`} />
}

export function MyProgram() {
  const [goals, setGoals] = useState<number[]>(() => MILESTONES.map((m) => m.goal))
  const [actualCur, setActualCur] = useState(MILESTONES[CURRENT].actual)
  const [breaks, setBreaks] = useState<Break[]>([])
  const [seq, setSeq] = useState(1)
  const [margin, setMargin] = useState(0)
  const [refOff, setRefOff] = useState(REF_OFF_DEFAULT)
  const [takenOff, setTakenOff] = useState(0)
  const [sel, setSel] = useState(CURRENT)
  const barRef = useRef<HTMLDivElement>(null)

  /* ── dérivations : tout vient de l'état, rien n'est stocké deux fois ── */
  const starts = useMemo(() => { const a: number[] = []; let t = 0; for (const g of goals) { a.push(t); t += g } return a }, [goals])
  const breaksTotal = breaks.reduce((t, b) => t + b.len, 0)
  const breaksLeft = BREAK_ROOM - breaksTotal
  const capCur = MILESTONES[CURRENT].ref * 2 + margin
  const pastActual = MILESTONES.slice(0, CURRENT).reduce((t, m) => t + m.actual, 0)
  const today = pastActual + actualCur + takenOff
  const goalTotal = goals.reduce((t, g) => t + g, 0) + margin + breaksTotal
  const refDay = REF_TOTAL + refOff
  const capDay = CAP_TOTAL + margin + takenOff + breaksTotal
  const paceRatio = useMemo(() => {
    const s = MILESTONES.slice(0, CURRENT).reduce((t, m) => t + m.actual, 0)
    const r = MILESTONES.slice(0, CURRENT).reduce((t, m) => t + m.ref, 0)
    return r ? s / r : 1
  }, [])
  const breaksAfterToday = breaks.reduce((t, b) => t + (b.ms > CURRENT || (b.ms === CURRENT && b.after >= actualCur) ? b.len : 0), 0)
  const paceEnd = useMemo(() => {
    let e = today + breaksAfterToday + Math.max(0, paceRatio * MILESTONES[CURRENT].ref - actualCur)
    for (let i = CURRENT + 1; i < MILESTONES.length; i++) e += paceRatio * MILESTONES[i].ref
    return e
  }, [today, breaksAfterToday, paceRatio, actualCur])
  const goalEnd = useMemo(() => {
    let e = today + breaksAfterToday + Math.max(0, goals[CURRENT] - actualCur)
    for (let i = CURRENT + 1; i < MILESTONES.length; i++) e += goals[i]
    return e
  }, [today, breaksAfterToday, goals, actualCur])

  const pc = (days: number) => `${(days / AXIS) * 100}%`
  const perDay = () => (barRef.current ? barRef.current.getBoundingClientRect().height / AXIS : FRISE_H / AXIS)

  const setGoal = (i: number, v: number) => setGoals((g) => g.map((x, k) => (k === i ? v : x)))
  const goalBounds = (i: number) =>
    i === CURRENT
      ? { min: Math.max(1, Math.ceil(actualCur)), max: capCur }
      : { min: Math.max(1, Math.round(MILESTONES[i].ref * 0.1)), max: MILESTONES[i].ref * 2 }

  /* ── un geste, des écouteurs sur window : chaque rendu jette le bloc tiré ── */
  function drag(e: React.PointerEvent, from: number, apply: (v: number) => void, clamp: (v: number) => number) {
    e.preventDefault(); e.stopPropagation()
    const y0 = e.clientY, k = perDay()
    const move = (ev: PointerEvent) => apply(clamp(Math.round(from + (ev.clientY - y0) / k)))
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up) }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up)
  }
  function moveBreak(b: Break, x: number) {
    const lim = { min: starts[CURRENT] + actualCur, max: starts[MILESTONES.length - 1] + goals[MILESTONES.length - 1] }
    const v = Math.max(lim.min, Math.min(lim.max, Math.round(x)))
    let i = MILESTONES.length - 1
    for (let k = 0; k < MILESTONES.length; k++) if (v >= starts[k] && v <= starts[k] + goals[k]) { i = k; break }
    setBreaks((list) => list.map((o) => (o.id === b.id ? { ...o, ms: i, after: v - starts[i] } : o)))
  }

  /* ── le verdict, découpé dans le bloc : la frontière EST la référence ── */
  type Kind = "goal" | "proj" | "live"
  const zoneClass: Record<Kind, [string, string, string]> = {
    goal: [SEG.goal, SEG.overSoft, SEG.critSoft],
    proj: [SEG.proj, SEG.overSoft, SEG.critSoft],
    live: [SEG.live, SEG.overSolid, SEG.critSolid],
  }
  function cut(i: number, offset: number, len: number) {
    const ref = MILESTONES[i].ref
    const cap = ref * 2 + (i === CURRENT ? margin : 0)
    const edges = [ref, cap, Infinity]
    const out: { zone: 0 | 1 | 2; at: number; len: number }[] = []
    let cur = offset
    const end = offset + len
    for (let z = 0; z < 3 && cur < end; z++) {
      const stop = Math.min(end, edges[z])
      if (stop > cur) { out.push({ zone: z as 0 | 1 | 2, at: cur, len: stop - cur }); cur = stop }
    }
    return out
  }
  const label = (zone: number, len: number, fallback: string) =>
    zone === 0 ? fallback : len < 13 ? "" : `${zone === 1 ? "+" : "‼ +"}${Math.round(len)} d`

  function tipFor(i: number) {
    const m = MILESTONES[i]
    const rows: [string, string][] = [["Reference", d(m.ref)], ["My goal", d(goals[i])]]
    if (i < CURRENT) rows.push(["Actually spent", d(m.actual)])
    else if (i === CURRENT) { rows.push(["Spent so far", d(actualCur)], ["Left to my goal", d(Math.max(0, goals[i] - actualCur))], ["Cap", d(capCur)]) }
    else rows.push(["At my pace", d(paceRatio * m.ref)])
    return (
      <span className="flex flex-col gap-1">
        <span className={TYPO.title("semibold")}>{m.name}</span>
        <span className="text-white/60">{m.work}</span>
        {rows.map(([k, v]) => (
          <span key={k} className="flex justify-between gap-6">
            <span className="text-white/70">{k}</span>
            <span className={TYPO.mono("semibold")}>{v}</span>
          </span>
        ))}
      </span>
    )
  }

  /* ── les blocs d'une piste ── */
  function Seg(p: { cls: string; days: number; text?: string; i?: number; hatch?: string; edge?: string; onDown?: (e: React.PointerEvent) => void; grip?: { onDown: (e: React.PointerEvent) => void; label: string }; tip?: number }) {
    const body = (
      <button
        type="button"
        style={{ flex: `0 0 ${(p.days / AXIS) * 100}%`, minHeight: 0 }}
        onPointerDown={p.onDown}
        onClick={() => p.i != null && setSel(p.i)}
        aria-label={p.text || undefined}
        className={`relative grid w-full place-items-center overflow-hidden border-0 border-b border-b-brand-950 p-0 ${p.cls} ${p.i === sel ? "ring-2 ring-inset ring-brand-500" : ""} ${p.onDown ? "cursor-crosshair" : ""}`}
      >
        {p.hatch && <Hatch tone={p.hatch} />}
        {p.edge && <RefEdge tone={p.edge} />}
        {p.text && <span className={`relative ${TYPO.mono("semibold")} text-[10px]`}>{p.text}</span>}
        {p.grip && (
          <span
            role="slider"
            aria-label={p.grip.label}
            aria-valuenow={Math.round(p.days)}
            tabIndex={0}
            onPointerDown={p.grip.onDown}
            className="absolute inset-x-0 bottom-0 grid h-3 max-h-[45%] cursor-ns-resize place-items-center"
          >
            <span className="h-0.5 w-[55%] rounded-full bg-brand-500" />
          </span>
        )}
      </button>
    )
    return p.tip != null ? <Tooltip asChild label={tipFor(p.tip)}>{body}</Tooltip> : body
  }

  const breaksIn = (i: number) => breaks.filter((b) => b.ms === i).sort((a, b) => a.after - b.after)

  function BreakSeg({ b }: { b: Break }) {
    return (
      <Seg
        cls={SEG.off}
        days={b.len}
        text="off"
        onDown={(e) => { const x0 = starts[b.ms] + b.after; drag(e, x0, (v) => moveBreak(b, v), (v) => v) }}
        grip={b.len >= 20 ? {
          label: `Time off, in days`,
          onDown: (e) => drag(e, b.len, (v) => setBreaks((l) => l.map((o) => (o.id === b.id ? { ...o, len: v } : o))), (v) => Math.max(1, Math.min(Math.min(BREAK_MAX, b.len + breaksLeft), v))),
        } : undefined}
      />
    )
  }

  /** Découpe un milestone autour des congés posés dedans. */
  function split(i: number, total: number, from: number, part: (offset: number, len: number) => React.ReactNode) {
    const nodes: React.ReactNode[] = []
    let cur = from
    for (const b of breaksIn(i)) {
      if (b.after < from || b.after > total) continue
      if (b.after > cur) nodes.push(part(cur, b.after - cur))
      nodes.push(<BreakSeg key={`b${b.id}`} b={b} />)
      cur = b.after
    }
    if (total > cur) nodes.push(part(cur, total - cur))
    return nodes
  }

  function drawOn(i: number, offset: number) {
    return (e: React.PointerEvent) => {
      e.preventDefault()
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const k = perDay()
      const at = Math.max(0, Math.round(offset + (e.clientY - rect.top) / k))
      const y0 = e.clientY
      const id = seq
      let created = false
      const move = (ev: PointerEvent) => {
        const len = Math.round((ev.clientY - y0) / k)
        if (len < 1) return
        const capped = Math.min(len, BREAK_MAX, breaksLeft)
        if (!created) { created = true; setSeq((s) => s + 1); setBreaks((l) => [...l, { id, ms: i, after: at, len: capped }]); setSel(i) }
        else setBreaks((l) => l.map((o) => (o.id === id ? { ...o, len: capped } : o)))
      }
      const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up) }
      window.addEventListener("pointermove", move); window.addEventListener("pointerup", up)
    }
  }

  const goalGrip = (i: number) => ({
    label: `Goal on ${MILESTONES[i].name}, in days`,
    onDown: (e: React.PointerEvent) => { const b = goalBounds(i); drag(e, goals[i], (v) => setGoal(i, v), (v) => Math.max(b.min, Math.min(b.max, v))) },
  })

  /* ── alertes : dérivées, jamais stockées ── */
  const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length
  const threshold = Math.min(60, Math.max(20, 60 - 0.2 * ((goals[CURRENT] / MILESTONES[CURRENT].ref) * 100)))
  const alerts: { lvl: "risk" | "watch" | "note"; what: string; todo: string }[] = []
  if (paceEnd > capDay) alerts.push({ lvl: "risk", what: `At the pace you have actually held, you finish ${d(paceEnd - capDay)} past the cap.`, todo: "Your goals assume you speed up. The dotted line is where the pace leads." })
  else if (paceEnd > refDay) alerts.push({ lvl: "watch", what: `At the pace you have actually held you land on day ${Math.round(paceEnd)}, ${d(paceEnd - refDay)} after the reference — and ${d(paceEnd - goalEnd)} after your own goals.`, todo: "Nothing is lost: it means the goals ahead are tighter than the milestones behind you." })
  if (actualCur > capCur) alerts.push({ lvl: "risk", what: `${MILESTONES[CURRENT].name} is ${d(actualCur - capCur)} past its cap.`, todo: "No extra time left on it — this is the state that ends the program in failure." })
  else if (actualCur > MILESTONES[CURRENT].ref) alerts.push({ lvl: "watch", what: `${MILESTONES[CURRENT].name} is ${d(actualCur - MILESTONES[CURRENT].ref)} past its reference.`, todo: `You still have ${d(capCur - actualCur)} before its cap.` })
  const late = MILESTONES.slice(0, CURRENT).filter((m) => m.actual > m.ref)
  if (late.length) alerts.push({ lvl: "note", what: `${late.map((m) => m.id).join(", ")} went past the reference — ${d(late.reduce((t, m) => t + (m.actual - m.ref), 0))} in total.`, todo: "Already counted in where you stand today. Nothing to do about it now." })
  if (avg(ATTENDANCE) < threshold) alerts.push({ lvl: "watch", what: `Attendance is ${avg(ATTENDANCE).toFixed(1)} h/week, under your own threshold of ${Math.round(threshold)} h.`, todo: "The threshold follows the goal you set: aim lower and it drops, aim higher and it rises." })
  if (avg(ENGAGEMENT) < 2) alerts.push({ lvl: "watch", what: `Engagement is ${avg(ENGAGEMENT).toFixed(1)} reviews/week, under the 2 expected.`, todo: "Every week held adds a quarter day of extra time." })
  if (MARGIN_STOCK - margin <= 0) alerts.push({ lvl: "note", what: "No extra time left to spend.", todo: "It comes back with attendance and engagement, a quarter day per week held." })

  const m = MILESTONES[sel]
  const bounds = goalBounds(sel)
  const steerable = sel >= CURRENT

  /* ── rendu ── */
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <Text size="sm" c="secondary">Common Core · learner view</Text>
        <Title order={1} size="3xl" className={TYPO.title()}>My program</Title>
        <Text c="secondary" className="max-w-[68ch]">
          Three thresholds govern your path: the goal you set yourself, the educational reference, and the cap.
          The timeline shows all three on one axis in days — move your goal and watch the result.
        </Text>
      </header>

      {/* LA carte d'entrée : ce qu'on attaque maintenant */}
      <Card variant="gradient" padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start gap-10">
          <div className="flex min-w-[320px] flex-1 flex-col gap-2">
            <Text size="xs" span className={`${TYPO.mono("semibold")} uppercase tracking-widest text-pink-400`}>Current milestone</Text>
            <Title order={2} size="md" className={TYPO.title()}>{MILESTONES[CURRENT].name} — {MILESTONES[CURRENT].work}</Title>
            <Text c="secondary">
              You have spent <span className={TYPO.mono("semibold")}>{d(actualCur)}</span> of the {MILESTONES[CURRENT].ref} the reference allows, and you are aiming at {goals[CURRENT]}.
            </Text>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button size="sm">Resume Fly-in</Button>
              <Button size="sm" variant="subtle">See the 4 activities</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-10">
            {[[d(today), "Day of the path"], [d(goalTotal), "My goal"], [d(paceEnd), "At my pace"], [d(MARGIN_STOCK - margin), "Extra time available"]].map(([v, k]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className={`${TYPO.mono()} text-2xl tabular-nums`}>{v}</span>
                <Text size="sm" c="secondary">{k}</Text>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Ce qui demande de l'attention — un écran doit avertir, pas seulement rapporter */}
      <section className="flex flex-col gap-4">
        <Title order={2} size="md" className={TYPO.title()}>What needs attention</Title>
        <Card padding="lg" className="flex flex-col gap-4">
          {alerts.length === 0 ? (
            <Text c="secondary">Nothing. You are inside every threshold, and the plan lands before the cap.</Text>
          ) : (
            alerts.map((a, k) => (
              <div key={k} className="flex items-start gap-4">
                <Badge size="sm" variant="outline" color={a.lvl === "risk" ? "red" : a.lvl === "watch" ? "orange" : "gray"}>
                  {a.lvl === "risk" ? "At risk" : a.lvl === "watch" ? "Watch" : "Noted"}
                </Badge>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <Text size="sm" className={TYPO.title("semibold")}>{a.what}</Text>
                  <Text size="sm" c="secondary">{a.todo}</Text>
                </div>
              </div>
            ))
          )}
        </Card>
      </section>

      {/* La frise : surface de contrôle */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <Title order={2} size="md" className={TYPO.title()}>My timeline</Title>
          <Text size="sm" c="muted">Fixed axis: 0 → {AXIS} calendar days</Text>
        </div>

        <Card padding="lg" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end gap-6">
            <label className="flex min-w-[240px] flex-1 flex-col gap-2">
              <Text size="xs" c="muted" className="uppercase tracking-wider">Replay a situation on the current milestone</Text>
              <SegmentGroup
                size="sm"
                data={["Where I am", "Just started", "At the reference", "At the cap", "Past the cap"]}
                value={"Where I am"}
                onChange={(v) => {
                  const ref = MILESTONES[CURRENT].ref
                  setActualCur(v === "Just started" ? 0 : v === "At the reference" ? ref : v === "At the cap" ? capCur : v === "Past the cap" ? capCur + 12 : MILESTONES[CURRENT].actual)
                }}
              />
            </label>
            <label className="flex min-w-[200px] flex-col gap-2">
              <Text size="xs" c="muted" className="uppercase tracking-wider">Time off the reference assumes</Text>
              <NumberInput size="sm" value={refOff} min={0} max={70} step={7} suffix=" d" clampValueOnBlur onChange={(v) => setRefOff(v ?? 0)} />
            </label>
            <label className="flex min-w-[200px] flex-col gap-2">
              <Text size="xs" c="muted" className="uppercase tracking-wider">Time off already taken</Text>
              <Select size="sm" data={["None", "7 d", "14 d", "17 d"]} value={takenOff === 0 ? "None" : `${takenOff} d`} onChange={(v) => setTakenOff(v && v !== "None" ? parseInt(String(v), 10) : 0)} />
            </label>
          </div>

          <div className="overflow-x-auto">
            <div className="relative grid min-w-[560px] gap-x-4 gap-y-3" style={{ gridTemplateColumns: "76px repeat(3, minmax(0,1fr))" }}>
              <div style={{ gridRow: 1, gridColumn: 1 }} />
              {[["My goal", d(goalTotal), months(goalTotal)], ["Educational reference", d(refDay), months(refDay)], ["Actual, then projected at my goals", d(today), months(today)]].map(([name, tot, mo], k) => (
                <div key={name} style={{ gridRow: 1, gridColumn: k + 2 }} className="flex min-w-0 flex-col gap-0.5">
                  <Text size="sm" className={TYPO.title("semibold")}>{name}</Text>
                  <span className={`${TYPO.mono("semibold")} text-sm tabular-nums`}>{tot} <span className="font-sans font-normal text-white/60">≈ {mo} months</span></span>
                </div>
              ))}

              {/* règle en mois */}
              <div style={{ gridRow: 2, gridColumn: 1, height: FRISE_H }} className="relative border-r border-white/10">
                {[0, 4, 8, 12, 16, 20].map((mo) => (
                  <span key={mo} style={{ top: pc(mo * 30.44) }} className={`absolute right-3 -translate-y-1/2 ${TYPO.mono("medium")} text-[11px] leading-none text-white/40`}>{mo} months</span>
                ))}
              </div>

              {/* piste 1 — mon objectif */}
              <div style={{ gridRow: 2, gridColumn: 2, height: FRISE_H }} className="relative flex flex-col overflow-hidden rounded-sm bg-white/5 ring-1 ring-inset ring-white/10">
                {MILESTONES.map((ms, i) => (
                  <div key={ms.id} className="contents">
                    {split(i, goals[i], 0, (offset, len) =>
                      cut(i, offset, len).map((p) => (
                        <Seg
                          key={`g${i}-${p.at}`}
                          i={i}
                          tip={i}
                          days={p.len}
                          cls={zoneClass.goal[p.zone]}
                          hatch={p.zone === 1 ? "text-orange-500" : p.zone === 2 ? "text-red-500" : undefined}
                          edge={p.zone === 1 ? "bg-orange-500" : p.zone === 2 ? "bg-red-500" : undefined}
                          text={label(p.zone, p.len, p.at === 0 ? ms.id : "")}
                          onDown={i > CURRENT ? drawOn(i, p.at) : undefined}
                          grip={steerableAt(i) && p.at + p.len >= goals[i] ? goalGrip(i) : undefined}
                        />
                      )),
                    )}
                  </div>
                ))}
              </div>

              {/* piste 2 — la référence pédagogique */}
              <div style={{ gridRow: 2, gridColumn: 3, height: FRISE_H }} className="relative flex flex-col overflow-hidden rounded-sm bg-white/5 ring-1 ring-inset ring-white/10">
                {MILESTONES.map((ms, i) => (
                  <Seg key={ms.id} i={i} tip={i} days={ms.ref} cls={SEG.ref} text={ms.id} />
                ))}
                {refOff > 0 && <Seg cls={`${SEG.off} opacity-75`} days={refOff} text="off" />}
              </div>

              {/* piste 3 — le réel, puis la projection */}
              <div ref={barRef} style={{ gridRow: 2, gridColumn: 4, height: FRISE_H }} className="relative flex flex-col overflow-hidden rounded-sm bg-white/5 ring-1 ring-inset ring-white/10">
                {MILESTONES.slice(0, CURRENT).map((ms, i) => (
                  <div key={ms.id} className="contents">
                    <Seg i={i} tip={i} days={Math.min(ms.actual, ms.ref)} cls={SEG.done} text={ms.id} />
                    {ms.actual > ms.ref && (
                      <Seg i={i} tip={i} days={ms.actual - ms.ref} cls={SEG.overSolid} edge="bg-white" text={label(1, ms.actual - ms.ref, "")} />
                    )}
                  </div>
                ))}
                {cut(CURRENT, 0, actualCur).map((p, k, all) => (
                  <Seg
                    key={`l${p.at}`}
                    i={CURRENT}
                    tip={CURRENT}
                    days={p.len}
                    cls={zoneClass.live[p.zone]}
                    edge={p.zone > 0 ? "bg-white" : undefined}
                    text={label(p.zone, p.len, p.at === 0 ? MILESTONES[CURRENT].id : "")}
                    grip={k === all.length - 1 ? { label: "Days spent on the current milestone — moves today", onDown: (e) => drag(e, actualCur, setActualCur, (v) => Math.max(0, Math.min(capCur + 60, v))) } : undefined}
                  />
                ))}
                {takenOff > 0 && <Seg cls={SEG.off} days={takenOff} text="off" />}
                {split(CURRENT, Math.max(actualCur, goals[CURRENT]), actualCur, (offset, len) =>
                  cut(CURRENT, offset, len).map((p) => (
                    <Seg key={`p${p.at}`} i={CURRENT} tip={CURRENT} days={p.len} cls={zoneClass.proj[p.zone]}
                      hatch={p.zone === 1 ? "text-orange-500" : p.zone === 2 ? "text-red-500" : "text-white/25"}
                      edge={p.zone === 1 ? "bg-orange-500" : p.zone === 2 ? "bg-red-500" : undefined}
                      text={label(p.zone, p.len, "")} />
                  )),
                )}
                {MILESTONES.map((ms, i) => i <= CURRENT ? null : (
                  <div key={ms.id} className="contents">
                    {split(i, goals[i], 0, (offset, len) =>
                      cut(i, offset, len).map((p) => (
                        <Seg key={`j${i}-${p.at}`} i={i} tip={i} days={p.len} cls={zoneClass.proj[p.zone]}
                          hatch={p.zone === 1 ? "text-orange-500" : p.zone === 2 ? "text-red-500" : "text-white/25"}
                          edge={p.zone === 1 ? "bg-orange-500" : p.zone === 2 ? "bg-red-500" : undefined}
                          text={label(p.zone, p.len, p.at === 0 ? ms.id : "")}
                          onDown={drawOn(i, p.at)}
                          grip={p.at + p.len >= goals[i] ? goalGrip(i) : undefined} />
                      )),
                    )}
                  </div>
                ))}
              </div>

              {/* les quatre lignes, en travers des trois pistes */}
              <div style={{ gridRow: 2, gridColumn: "2 / -1", height: FRISE_H }} className="pointer-events-none relative">
                <div style={{ top: pc(365) }} className={`absolute inset-x-0 border-t border-dashed ${LINE.year}`}>
                  <span className={`absolute right-0 top-0.5 ${TYPO.mono("semibold")} text-[10px] uppercase tracking-wider text-white/50`}>1 year</span>
                </div>
                <div style={{ top: pc(capDay) }} className={`absolute inset-x-0 border-t border-dashed ${LINE.cap}`}>
                  <span className={`absolute right-0 top-0.5 ${TYPO.mono("semibold")} text-[10px] uppercase tracking-wider text-red-500`}>Cap</span>
                </div>
                <div style={{ top: pc(paceEnd) }} className={`absolute inset-x-0 border-t-2 border-dotted ${paceEnd > refDay ? LINE.paceLate : LINE.pace}`}>
                  <span className={`absolute left-0 -top-2.5 rounded-sm px-2 ${TYPO.mono("semibold")} text-[10px] uppercase tracking-wider text-brand-950 ${paceEnd > refDay ? "bg-orange-500" : "bg-white/70"}`}>At my pace · day {Math.round(paceEnd)}</span>
                </div>
                <div style={{ top: pc(today) }} className={`absolute inset-x-0 h-0.5 ${LINE.today}`}>
                  <span className={`absolute left-0 -top-2.5 rounded-sm bg-pink-400 px-2 ${TYPO.mono("semibold")} text-[10px] uppercase tracking-wider text-brand-950`}>Today · day {Math.round(today)}</span>
                </div>
              </div>
            </div>
          </div>

          <Text size="sm" c="muted">
            Time runs downward. Drag the bottom edge of a milestone to stretch it, across a milestone ahead of you to draw time off,
            and an <span className={TYPO.mono("semibold")}>off</span> block to move it. Milestones behind you are facts: they neither stretch nor move.
          </Text>

          {/* pilotage */}
          <div className="flex flex-wrap gap-10">
            <div className="flex min-w-[280px] flex-1 flex-col gap-3">
              <Text size="xs" c="muted" className="uppercase tracking-wider">{steerable ? `My goal on ${m.name}` : `${m.name} — goal frozen, this milestone is behind you`}</Text>
              <Slider size="sm" value={goals[sel]} min={bounds.min} max={bounds.max} onChange={(v) => setGoal(sel, v as number)} disabled={!steerable} showLabel="always" />
              <Text size="sm" c="secondary">
                {sel < CURRENT ? "What it cost is a fact: it neither stretches nor moves."
                  : sel > CURRENT ? "An upcoming milestone moves inside the pace band the model allows — ×0.1 to ×2.0 of its reference."
                  : goals[CURRENT] <= MILESTONES[CURRENT].ref ? "Below the educational reference: you alone are told if you do not hold this goal."
                  : "Above the educational reference: the staff is told if you do not hold this goal."}
              </Text>
            </div>

            <div className="flex min-w-[280px] flex-1 flex-col gap-3">
              <Text size="xs" c="muted" className="uppercase tracking-wider">Plan time off</Text>
              {breaks.length === 0 ? (
                <Text size="sm" c="secondary">Nothing planned. Drag down across any milestone ahead of you to draw time off where you will take it. The reference assumes {d(refOff)}.</Text>
              ) : (
                breaks.slice().sort((a, b) => a.ms - b.ms || a.after - b.after).map((b) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <Text size="sm" c="secondary" className="flex-1">{b.after === 0 ? `At the start of ${MILESTONES[b.ms].name}` : `${Math.round(b.after)} d into ${MILESTONES[b.ms].name}`}</Text>
                    <NumberInput size="xs" className="w-28" value={b.len} min={1} max={BREAK_MAX} step={7} suffix=" d" clampValueOnBlur onChange={(v) => setBreaks((l) => l.map((o) => (o.id === b.id ? { ...o, len: v ?? 1 } : o)))} />
                    <Button size="xs" variant="subtle" onClick={() => setBreaks((l) => l.filter((o) => o.id !== b.id))}>Remove</Button>
                  </div>
                ))
              )}
              <Button size="sm" variant="outline" disabled={breaksLeft < 7} onClick={() => { setBreaks((l) => [...l, { id: seq, ms: CURRENT, after: Math.ceil(actualCur), len: 7 }]); setSeq((s) => s + 1) }}>
                Plan a week from today
              </Button>
            </div>

            <div className="flex min-w-[240px] flex-col gap-3">
              <Text size="xs" c="muted" className="uppercase tracking-wider">Spend extra time on the current milestone</Text>
              <NumberInput size="sm" value={margin} min={0} max={MARGIN_STOCK} step={1} suffix=" d" clampValueOnBlur onChange={(v) => setMargin(v ?? 0)} />
              <Text size="sm" c="secondary">Extra time pushes the milestone's cap further out. You earn it through attendance and engagement, and a milestone already validated accepts none.</Text>
            </div>
          </div>
        </Card>
      </section>

      {/* Les jalons : UNE carte, des lignes */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <Title order={2} size="md" className={TYPO.title()}>My milestones</Title>
          <Text size="sm" c="muted">8 milestones · Common Core</Text>
        </div>
        <Card padding="lg" className="flex flex-col gap-4">
          {MILESTONES.map((ms, i) => {
            const done = i === CURRENT ? actualCur : ms.actual
            return (
              <button key={ms.id} type="button" onClick={() => setSel(i)}
                className={`grid w-full grid-cols-[1fr_minmax(120px,220px)_auto] items-center gap-4 rounded-md p-2 text-left ${i === sel ? "bg-white/5 ring-1 ring-inset ring-brand-500" : "hover:bg-white/5"}`}>
                <span className="flex min-w-0 flex-col">
                  <Text size="sm" className={TYPO.title("semibold")}>{ms.name}</Text>
                  <Text size="xs" c="muted" className="truncate">{ms.work}</Text>
                </span>
                <span className="flex h-2 overflow-hidden rounded-full bg-white/15">
                  <span className={`h-full ${i === CURRENT ? "bg-gradient-to-r from-pink-400 to-purple-300" : ms.state === "todo" ? "bg-white/20" : "bg-green-500"}`} style={{ width: `${Math.min(100, (done / ms.ref) * 100)}%` }} />
                  {done > ms.ref && <span className="h-full bg-orange-500" style={{ width: `${Math.min(100, ((done - ms.ref) / ms.ref) * 100)}%` }} />}
                </span>
                <span className="flex items-center gap-3">
                  <span className={`${TYPO.mono("semibold")} text-sm tabular-nums text-white/70`}>{Math.round(done)} / {ms.ref} d</span>
                  <Badge size="sm" variant="outline" color={i === CURRENT ? "pink" : done > ms.ref ? "orange" : ms.state === "done" ? "green" : "gray"}>
                    {i === CURRENT ? "In progress" : done > ms.ref ? "Past reference" : ms.state === "done" ? "Validated" : "Upcoming"}
                  </Badge>
                </span>
              </button>
            )
          })}
        </Card>
      </section>

      {/* Rythme — une série chacune, l'accent est hérité */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <Title order={2} size="md" className={TYPO.title()}>My pace</Title>
          <Text size="sm" c="muted">Last 4 weeks</Text>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[{ t: "Attendance", data: ATTENDANCE, max: 50, unit: "h", note: `Reference is 40 h/week for a 100% pace. Your personal threshold follows the goal you set: ${Math.round(threshold)} h.`, avg: `${avg(ATTENDANCE).toFixed(1)} h` },
            { t: "Engagement", data: ENGAGEMENT, max: 5, unit: "reviews", note: "Minimum expected: 2 reviews per week. Every week held adds 0.25 day of extra time.", avg: `${avg(ENGAGEMENT).toFixed(1)} /week` }].map((c) => (
            <Card key={c.t} padding="lg" className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-4">
                <Title order={3} size="md" className={TYPO.title()}>{c.t}</Title>
                <span className={`${TYPO.mono()} text-2xl tabular-nums`}>{c.avg}</span>
              </div>
              <div className="flex h-36 items-stretch gap-3 pt-5">
                {c.data.map((v, k) => (
                  <div key={k} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
                    <div className="rounded-t-xs bg-pink-600" style={{ height: `${Math.max(2, (v / c.max) * 100)}%` }} title={`W-${c.data.length - k} · ${v} ${c.unit}`} />
                    <span className={`${TYPO.mono()} text-center text-[11px] text-white/40`}>W-{c.data.length - k}</span>
                  </div>
                ))}
              </div>
              <Text size="sm" c="secondary">{c.note}</Text>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )

  function steerableAt(i: number) { return i >= CURRENT }
}
