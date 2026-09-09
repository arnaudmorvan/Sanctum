import { Check, FileCheck, Hourglass, Lock, LockOpen, Rocket, ZoomIn, ZoomOut } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Divider } from "@42/ui-react/divider"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  BANDS,
  CLEARED_LINKS,
  GRAPH,
  LEGEND,
  LINKS,
  NODES,
  QUEST,
  STANDING,
  type GraphNode,
  type NodeKind,
} from "../data/holygraph"

/** One kind -> one icon, one card variant, one word. The word is what carries the meaning:
 *  the badge stays grey everywhere, and no node is greyed out by hand — `outline` is what a
 *  sealed step looks like, `gradient` what the one live step looks like. */
const KIND: Record<
  NodeKind,
  { icon: LucideIcon; variant: "default" | "light" | "outline" | "filled" | "gradient"; badge: string }
> = {
  cleared: { icon: Check, variant: "light", badge: "Cleared" },
  progress: { icon: Hourglass, variant: "gradient", badge: "In progress" },
  open: { icon: LockOpen, variant: "default", badge: "Open" },
  locked: { icon: Lock, variant: "outline", badge: "Sealed" },
  gate: { icon: FileCheck, variant: "light", badge: "Exam" },
  final: { icon: Rocket, variant: "light", badge: "Final" },
}

const Node = ({ n }: { n: GraphNode }) => {
  const k = KIND[n.kind]
  const Icon = k.icon

  const card = (
    <Card
      variant={k.variant}
      color={n.kind === "gate" || n.kind === "final" ? "purple" : undefined}
      padding="md"
      className="h-full"
    >
      <Card.Content className="h-full">
        <div className="flex h-full flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <ThemeIcon
              variant="light"
              size="sm"
              radius="md"
              color={n.kind === "progress" ? "pink" : "gray"}
            >
              <Icon size={14} aria-hidden />
            </ThemeIcon>
            <Badge variant="light" size="xs" color="gray">
              {k.badge}
            </Badge>
          </div>

          <Title order={3} size="sm" className={TYPO.title("semibold")}>
            {n.name}
          </Title>

          {n.note ? (
            <Text size="xs" c="muted">
              {n.note}
            </Text>
          ) : null}

          {/* A count and a duration both measure: machine register. */}
          {n.meta ? (
            <span className={`mt-auto text-xs ${TYPO.mono("medium")}`}>{n.meta}</span>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  )

  return (
    <div className="absolute" style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
      {n.href ? (
        <a href={n.href} className="block h-full">
          {card}
        </a>
      ) : (
        card
      )}
    </div>
  )
}

/** The Holy Graph — the whole path, and the one square of it that is yours right now.
 *
 *  Three columns: the skeleton's sidebar, the graph at the centre, the rail on the side. The
 *  rail does not report on what is done: it names the next quest and what the next gate will
 *  ask. The screen opens rather than summarising. */
export const Holygraph = () => {
  const [scale, setScale] = useState(0.7)
  const [pan, setPan] = useState({ x: 16, y: 0 })
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { x: pan.x, y: pan.y, px: e.clientX, py: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    setPan({ x: d.x + (e.clientX - d.px), y: d.y + (e.clientY - d.py) })
  }
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    drag.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const zoom = (step: number) =>
    setScale((s) => Math.min(1.4, Math.max(0.4, Number((s + step).toFixed(2)))))

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Title order={1} size="2xl" className={TYPO.title()}>
          Holy Graph
        </Title>
        <Text size="sm" c="secondary" className="max-w-3xl">
          The whole Common Core, end to end. Every milestone opens several modules you may
          cross in any order; an exam seals the next one. Nothing here is a schedule — it is
          what there is left to conquer, and in which order it becomes possible.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <Divider />

          <div className="flex items-center justify-center gap-3">
            <Button variant="light" size="sm" onClick={() => zoom(0.15)} startSlot={<ZoomIn size={14} />}>
              Zoom in
            </Button>
            <Button variant="light" size="sm" onClick={() => zoom(-0.15)} startSlot={<ZoomOut size={14} />}>
              Zoom out
            </Button>
          </div>

          {/* The viewport. The card is the surface; the transform inside it is the only thing
              this screen owns that the kit does not carry. */}
          <Card variant="default" padding="none">
            <Card.Content>
              <div
                className="relative h-[560px] cursor-grab overflow-hidden active:cursor-grabbing"
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: GRAPH.w,
                    height: GRAPH.h,
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    transformOrigin: "0 0",
                  }}
                >
                  <svg
                    width={GRAPH.w}
                    height={GRAPH.h}
                    className="absolute left-0 top-0"
                    aria-hidden
                  >
                    <g fill="none" stroke="currentColor" strokeWidth={1.5} className="text-white/20">
                      {LINKS.map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </g>
                    <g fill="none" stroke="currentColor" strokeWidth={2} className="text-pink-400">
                      {CLEARED_LINKS.map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </g>
                  </svg>

                  {/* Milestone labels: the band is what the graph is read by, so its name sits
                      above the column. Navigation register -> Kode Mono. */}
                  {BANDS.map((b) => (
                    <div key={b.label + b.x} className="absolute" style={{ left: b.x, top: 8 }}>
                      <Text size="xs" c="muted" span className={TYPO.nav}>
                        {b.label}
                      </Text>
                    </div>
                  ))}

                  {NODES.map((n) => (
                    <Node key={n.id} n={n} />
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>

          <Text size="xs" c="muted">
            Drag the graph to move across it. Zoom with the two controls above. The live node
            opens its own map.
          </Text>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          {/* The rail leads with what to do next, not with what is done. */}
          <Card variant="light" color="purple" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <span className={`text-xs ${TYPO.nav}`}>Next quest</span>
                <Title order={2} size="sm" className={TYPO.title("semibold")}>
                  {QUEST.name}
                </Title>
                <Text size="xs" c="secondary">
                  {QUEST.detail}
                </Text>
                <span className={`text-xs ${TYPO.mono("medium")}`}>{QUEST.meta}</span>
                <div>
                  <Button variant="filled" size="sm" asChild>
                    <a href={QUEST.href}>Open the module map</a>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <Title order={2} size="sm" className={TYPO.title("semibold")}>
                    Where you stand
                  </Title>
                  <span className={`text-xs ${TYPO.mono("semibold")}`}>{STANDING.milestone}</span>
                </div>
                <Progress variant="gradient" size="sm" value={STANDING.pct} />
                <span className={`text-sm ${TYPO.mono("semibold")}`}>{STANDING.level}</span>
                <Text size="xs" c="muted">
                  {STANDING.note}
                </Text>
              </div>
            </Card.Content>
          </Card>

          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>
                  Reading the graph
                </Title>
                {LEGEND.map((l) => {
                  const Icon = KIND[l.kind].icon
                  return (
                    <div key={l.label} className="flex items-center gap-3">
                      <ThemeIcon
                        variant="light"
                        size="sm"
                        radius="md"
                        color={l.kind === "progress" ? "pink" : "gray"}
                      >
                        <Icon size={13} aria-hidden />
                      </ThemeIcon>
                      <Text size="sm" c="secondary">
                        {l.label}
                      </Text>
                    </div>
                  )
                })}
              </div>
            </Card.Content>
          </Card>
        </aside>
      </div>
    </div>
  )
}
