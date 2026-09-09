import {
  AlignLeft,
  ArrowLeft,
  Binary,
  Check,
  Clock,
  Code,
  FileText,
  Hammer,
  Hourglass,
  Layers,
  Library,
  Link,
  Link2,
  Lock,
  MapPin,
  MemoryStick,
  MoreHorizontal,
  Pointer,
  Repeat,
  Search,
  Terminal,
  Trophy,
  Type,
  Users,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Divider } from "@42/ui-react/divider"
import { Input } from "@42/ui-react/input"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { AND_GATE, EXAM, LINKS, MAP, MODULE, NODES, SKILLS, type MapNode } from "../data/module"

const SKILL_ICON: Record<string, LucideIcon> = {
  memory: MemoryStick,
  link2: Link2,
  type: Type,
  hammer: Hammer,
  link: Link,
  library: Library,
  pointer: Pointer,
  file: FileText,
  repeat: Repeat,
  align: AlignLeft,
  binary: Binary,
  dots: MoreHorizontal,
  layers: Layers,
  terminal: Terminal,
  code: Code,
}

const KIND_ICON: Record<MapNode["kind"], LucideIcon> = {
  todo: Hourglass,
  locked: Lock,
  exam: Trophy,
}

/** One step of the map.
 *
 *  The card VARIANT states the step's state — there is no invented greying out and no
 *  hand-rebuilt outline: `gradient` marks the one thing to attack (and it is the only
 *  gradient card of the screen), `outline` a locked step, `filled` the exam that closes
 *  the module, `default` the steps that are simply ahead. */
const Node = ({ n }: { n: MapNode }) => {
  const Icon = KIND_ICON[n.kind]
  const variant =
    n.entry ? "gradient" : n.kind === "locked" ? "outline" : n.kind === "exam" ? "light" : "default"

  return (
    <div className="absolute" style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
      <Card
        variant={variant}
        color={n.kind === "exam" ? "purple" : undefined}
        padding="md"
        className="h-full"
      >
        <Card.Content className="h-full">
          <div className="flex h-full flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <ThemeIcon variant="light" size="sm" radius="md" color={n.entry ? "pink" : "gray"}>
                <Icon size={14} aria-hidden />
              </ThemeIcon>
              {/* Grey by default: the label carries the meaning. The exam keeps green — a
                  terminal validation, the one semantic exception review:color allows. */}
              <Badge variant="light" size="xs" color={n.kind === "exam" ? "green" : "gray"}>
                {n.badge}
              </Badge>
            </div>

            <Title order={3} size="sm" className={TYPO.title("semibold")}>
              {n.name}
            </Title>

            {n.kind === "exam" ? (
              <div className="mt-auto flex flex-col gap-1.5">
                <span className="flex items-center gap-2">
                  <Clock size={13} aria-hidden className="text-gray-dark-400" />
                  {/* A date measures: machine register. */}
                  <span className={`text-xs ${TYPO.mono("medium")}`}>{EXAM.date}</span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={13} aria-hidden className="text-gray-dark-400" />
                  <Text size="xs" c="secondary" span>
                    {EXAM.place}
                  </Text>
                </span>
                <span className="flex items-center gap-2">
                  <Users size={13} aria-hidden className="text-gray-dark-400" />
                  <span className={`text-xs ${TYPO.mono("medium")}`}>{EXAM.seats}</span>
                </span>
              </div>
            ) : (
              <Text size="xs" c="muted">
                {n.note}
              </Text>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

/** Programming Fundamentals — the module as a territory.
 *
 *  Three columns: the skeleton's sidebar, the map at the centre (what there is left to
 *  conquer), the skills rail on the side (what it gives you). The screen opens on Libft
 *  rather than reporting on what is done. */
export const ModuleMap = ({ slug }: { slug?: string }) => {
  const [scale, setScale] = useState(0.85)
  const [pan, setPan] = useState({ x: 24, y: 0 })
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
    setScale((s) => Math.min(1.6, Math.max(0.5, Number((s + step).toFixed(2)))))

  const acquired = SKILLS.filter((s) => s.acquired).length
  const name = slug && slug !== MODULE.slug ? MODULE.name : MODULE.name

  return (
    <div className="flex flex-col gap-10">
      {/* Student search. `Input` exposes no leading-icon slot, so the magnifier sits next to
          it rather than inside it — recorded as a kit gap, not worked around with a
          hand-rolled field. */}
      <div className="flex items-center gap-3">
        <Search size={16} aria-hidden className="shrink-0 text-gray-dark-400" />
        <Input
          size="sm"
          className="w-full max-w-lg"
          placeholder="Search a student — login or name"
          aria-label="Search a student"
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="subtle" size="sm" asChild>
                <a href="#/modules">
                  <ArrowLeft size={14} aria-hidden className="me-1.5" />
                  Back
                </a>
              </Button>
              <Breadcrumb
                data={[{ label: "All Modules", href: "#/modules" }, { label: name }]}
              />
            </div>

            <Title order={1} size="2xl" className={TYPO.title()}>
              {name}
            </Title>
          </div>

          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-2">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>
                  About this module
                </Title>
                <Text size="sm" c="secondary">
                  {MODULE.about}
                </Text>
              </div>
            </Card.Content>
          </Card>

          <Divider />

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="light"
              size="sm"
              onClick={() => zoom(0.15)}
              startSlot={<ZoomIn size={14} />}
            >
              Zoom in
            </Button>
            <Button
              variant="light"
              size="sm"
              onClick={() => zoom(-0.15)}
              startSlot={<ZoomOut size={14} />}
            >
              Zoom out
            </Button>
          </div>

          {/* The map viewport. The card is the surface; the transform inside it is the only
              thing this screen owns that the kit does not carry. */}
          <Card variant="default" padding="none">
            <Card.Content>
              <div
                className="relative h-[520px] cursor-grab overflow-hidden active:cursor-grabbing"
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: MAP.w,
                    height: MAP.h,
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    transformOrigin: "0 0",
                  }}
                >
                  <svg
                    width={MAP.w}
                    height={MAP.h}
                    className="absolute left-0 top-0 text-white/20"
                    aria-hidden
                  >
                    <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                      {LINKS.map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </g>
                  </svg>

                  {/* Both branches required: the AND sits between them, on the axis. */}
                  <div
                    className="absolute flex items-center justify-center rounded-full border border-white/20 bg-white/5"
                    style={{
                      left: AND_GATE.cx - AND_GATE.r,
                      top: AND_GATE.cy - AND_GATE.r,
                      width: AND_GATE.r * 2,
                      height: AND_GATE.r * 2,
                    }}
                    title="Both projects are required"
                  >
                    <span className={`text-xs ${TYPO.mono("semibold")}`}>&amp;</span>
                  </div>

                  {NODES.map((n) => (
                    <Node key={n.id} n={n} />
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>

          <Text size="xs" c="muted">
            Drag the map to move across it. Zoom with the two controls above.
          </Text>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <Card variant="default" padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <Title order={2} size="sm" className={TYPO.title("semibold")}>
                      Skills you will gain
                    </Title>
                    {/* A counter measures: machine register. */}
                    <span className={`text-sm ${TYPO.mono("semibold")}`}>
                      {acquired} / {SKILLS.length}
                    </span>
                  </div>
                  <Progress
                    variant="gradient"
                    size="sm"
                    value={Math.round((acquired / SKILLS.length) * 100)}
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  {SKILLS.map((s) => {
                    const Icon = SKILL_ICON[s.icon] ?? Code
                    return (
                      <div key={s.name} className="flex items-center gap-3">
                        <ThemeIcon
                          size="sm"
                          radius="md"
                          variant={s.acquired ? "light" : "default"}
                          color={s.acquired ? "pink" : "gray"}
                        >
                          <Icon size={13} aria-hidden />
                        </ThemeIcon>
                        <Text size="sm" c={s.acquired ? "default" : "muted"}>
                          {s.name}
                        </Text>
                        {s.acquired ? (
                          <Check size={14} aria-hidden className="ms-auto text-pink-400" />
                        ) : (
                          <Lock size={12} aria-hidden className="ms-auto text-gray-dark-400" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card.Content>
          </Card>
        </aside>
      </div>
    </div>
  )
}
