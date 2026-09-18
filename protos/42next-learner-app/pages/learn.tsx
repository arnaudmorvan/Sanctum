import { Alert } from "@42/ui-react/alert"
import { ActionIcon } from "@42/ui-react/action-icon"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Modal } from "@42/ui-react/modal"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import {
  ArrowDown,
  Check,
  ChevronRight,
  CircleDot,
  FileCheck,
  LayoutGrid,
  Lock,
  Network,
  Orbit,
} from "lucide-react"
import { useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  ACT_LABEL,
  CONFIGS,
  MODULES,
  PROGRAM,
  STARTED,
  STATUS_COLOR,
  STATUS_LABEL,
  type ModuleRow,
} from "../data/learn"
import { Cap, Meter, PageHead, Section, Tag } from "./shell"

const CRUMB = { label: "Learn", href: "#/learn/program" }

const byId = (id: string) => MODULES.find((m) => m.id === id)
const pct = (m: ModuleRow) => (m.skills[1] ? Math.round((m.skills[0] / m.skills[1]) * 100) : 0)

/** The artifact replaced the word "Locked" with a lock BUTTON: the status of a locked
 *  module is not a label, it is a question — what is blocking it. `review:a11y` asks that
 *  an icon-only action on a non-obvious path carry its label; it does. */
const LockButton = ({ onClick }: { onClick: () => void }) => (
  <ActionIcon
    variant="default"
    size="sm"
    aria-label="Locked — see requirements"
    onClick={onClick}
  >
    <Lock size={16} />
  </ActionIcon>
)

/** My program — `P['learn.modules']`.
 *
 *  Two views of the same program, as in the artifact: CARDS (the module list, each with
 *  its status, its skill count and its activity count) and MAP (the same modules placed
 *  by dependency depth, which is what says what unlocks what). The toggle is a
 *  `SegmentGroup` — two options, both visible, exclusive choice.
 *
 *  THE STATUS RAIL BECAME A BADGE AND A VARIANT. The artifact painted a 4px colour rail
 *  down the left edge of every card (green / pink gradient / white / grey). A hand-drawn
 *  rail is exactly what `review:components` rejects — the card's own chrome carries this,
 *  so: `gradient` on the module being worked in (one per screen, and it marks the entry
 *  point), `light` on the other live ones, `default` otherwise, with the label doing the
 *  talking. */
export const Program = () => {
  /** `SegmentGroup` narrows its value to the literals of `data`, so the state has to be
   *  typed with them — a plain `string` does not compile. */
  const [view, setView] = useState<"Cards" | "Map">("Cards")
  const [req, setReq] = useState<ModuleRow | null>(null)
  const [skills, setSkills] = useState<ModuleRow | null>(null)

  const validated = MODULES.filter((m) => m.status === "validated").length
  const acquired = MODULES.reduce((a, m) => a + m.skills[0], 0)
  const total = MODULES.reduce((a, m) => a + m.skills[1], 0)

  /** Dependency depth: a module sits one column right of the deepest module it
   *  requires. The artifact computed the same thing in `depths()`. */
  const depthOf = (m: ModuleRow, seen = 0): number =>
    m.requires.length === 0 || seen > 6
      ? 0
      : 1 +
        Math.max(
          ...m.requires.map((r) => {
            const p = byId(r)
            return p ? depthOf(p, seen + 1) : 0
          }),
        )
  const columns = [0, 1, 2, 3].map((d) => MODULES.filter((m) => depthOf(m) === d))

  const card = (m: ModuleRow) => {
    const started = STARTED[m.id]
    return (
      <Card
        key={m.id}
        variant={m.entry ? "gradient" : m.status === "progress" ? "light" : "default"}
        padding="lg"
        className="h-full"
      >
        <Card.Content>
          <div className="flex h-full flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <Title order={3} size="md" className={TYPO.title("semibold")}>
                  {m.name}
                </Title>
                {started ? (
                  <Text size="xs" c="muted">
                    Started{" "}
                    <b className={TYPO.mono("medium")}>{started.on}</b> · v
                    <b className={TYPO.mono("medium")}>{started.version}</b>
                  </Text>
                ) : (
                  <Text size="xs" c="muted">
                    {m.theme}
                  </Text>
                )}
              </div>
              {m.status === "locked" ? (
                <LockButton onClick={() => setReq(m)} />
              ) : (
                <Tag color={STATUS_COLOR[m.status]}>{STATUS_LABEL[m.status]}</Tag>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => setSkills(m)} className="cursor-pointer">
                  <Text size="xs" c="secondary" className={TYPO.mono("medium")}>
                    {m.skills[0]}/{m.skills[1]} skills ›
                  </Text>
                </button>
                <span className={`text-xs ${TYPO.mono("semibold")}`}>{pct(m)}%</span>
              </div>
              <Meter label="" value="" pct={pct(m)} />
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
              <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                {m.activities} {m.activities === 1 ? "activity" : "activities"}
              </Text>
              {started?.next ? (
                <Badge variant="outline" size="sm" color="gray">
                  v{started.next} available
                </Badge>
              ) : null}
              <Button variant="outline" size="sm" asChild>
                <a href={`#/learn/module/${m.id}`}>Open module</a>
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb data={[CRUMB, { label: "My program" }]} />
      <PageHead
        title={PROGRAM.name}
        aside={
          <>
            <Badge variant="outline" size="md" color="gray" className={TYPO.mono("medium")}>
              v{PROGRAM.version}
            </Badge>
            <SegmentGroup
              size="sm"
              data={["Cards", "Map"]}
              value={view}
              onChange={(v) => setView(v as "Cards" | "Map")}
            />
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-baseline gap-2">
          <span className={`text-xl ${TYPO.mono("semibold")}`}>
            {validated}/{MODULES.length}
          </span>
          <Text size="xs" c="muted">
            modules validated
          </Text>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-xl ${TYPO.mono("semibold")}`}>
            {acquired}/{total}
          </span>
          <Text size="xs" c="muted">
            skills acquired
          </Text>
        </div>
      </div>

      {view === "Cards" ? (
        <Section title="Modules" icon={LayoutGrid}>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{MODULES.map(card)}</div>
        </Section>
      ) : (
        <Section title="Dependency map" icon={Network}>
          {/* One column per depth: a module sits to the right of everything it needs. */}
          <div className="overflow-x-auto">
            <div className="flex min-w-[900px] items-stretch gap-4">
              {columns.map((col, i) => (
                <div key={`depth-${i}`} className="flex min-w-56 flex-1 flex-col gap-3">
                  <Cap>{i === 0 ? "No prerequisite" : `After ${i}`}</Cap>
                  {col.map((m) => (
                    <Card
                      key={m.id}
                      variant={m.entry ? "gradient" : m.status === "locked" ? "default" : "light"}
                      padding="sm"
                    >
                      <Card.Content>
                        <a href={`#/learn/module/${m.id}`} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <Text size="sm" className={TYPO.title("semibold")}>
                              {m.name}
                            </Text>
                            {m.status === "locked" ? <Lock size={14} /> : null}
                          </div>
                          <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                            {m.skills[0]}/{m.skills[1]} skills
                          </Text>
                        </a>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* The two modals the cards open. They exist so the CARD never resizes — the
          artifact's own reason for putting requirements and skills behind them. */}
      <Modal
        open={!!req}
        onOpenChange={(o) => (o ? null : setReq(null))}
        title={req ? `${req.name} — requirements` : ""}
        description="What has to be validated before this module opens."
      >
        <div className="flex flex-col gap-3">
          {(req?.requires ?? []).map((r) => {
            const p = byId(r)
            const met = p?.status === "validated"
            return (
              <div key={r} className="flex items-center gap-3">
                {met ? <Check size={16} /> : <CircleDot size={16} />}
                <Text size="sm">{p ? p.name : r}</Text>
                <Text size="xs" c="muted" className="ms-auto">
                  {met ? "validated" : p ? STATUS_LABEL[p.status].toLowerCase() : "unknown"}
                </Text>
              </div>
            )
          })}
        </div>
      </Modal>

      <Modal
        open={!!skills}
        onOpenChange={(o) => (o ? null : setSkills(null))}
        title={skills ? `${skills.name} — skills` : ""}
        description="Skills you will gain in this module."
      >
        <div className="flex flex-col gap-3">
          {(skills && CONFIGS[skills.id]?.skills ? CONFIGS[skills.id].skills : []).map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              {s.got ? <Check size={16} /> : <CircleDot size={16} />}
              <Text size="sm">{s.name}</Text>
              <Text size="xs" c="muted" className={`ms-auto ${TYPO.mono("medium")}`}>
                {s.id}
              </Text>
            </div>
          ))}
          {skills && !CONFIGS[skills.id] ? (
            <Text size="sm" c="secondary">
              This module has no uploaded config yet, so its skill list is not available —
              only its count is.
            </Text>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}

/** Module detail — `P['learn.module']`.
 *
 *  The artifact's anatomy, kept in its order: the header states where the learner is in
 *  the module's CONTENT VERSION (started on, current version, a newer one to take, past
 *  ones read-only), the abstract says what the module is for, the validation conditions
 *  are printed AS THE CONFIG HAS THEM — raw activity ids under `projects:` / `exams:` —
 *  and the activities are stacked in LAYERS, each layer shut until the one it depends on
 *  is done.
 *
 *  The exam is pulled out of the layers into its own block, because it carries actions no
 *  project card has: register, change session, attempt history.
 *
 *  MODULES WITHOUT A CONFIG SAY SO. The artifact printed "No module config uploaded"
 *  rather than inventing activities, and that is kept: a prototype that fakes the gap
 *  stops being a prototype of anything. */
export const Module = ({ slug }: { slug: string }) => {
  const m = byId(slug) ?? MODULES[0]
  const cfg = CONFIGS[m.id]
  const started = STARTED[m.id]
  const [showValidation, setShowValidation] = useState(true)

  const act = (id: string) => cfg?.activities.find((a) => a.id === id)
  const layerShut = (after?: number) =>
    m.status === "locked" ||
    (!!after &&
      !(cfg?.layers.find((l) => l.layer === after)?.items ?? []).every(
        (id) => act(id)?.status === "done",
      ))

  const examId = cfg?.layers.flatMap((l) => l.items).find((id) => act(id)?.kind === "Exam")
  const workLayers = (cfg?.layers ?? [])
    .filter((l) => !l.items.some((id) => act(id)?.kind === "Exam"))
    .sort((a, b) => a.layer - b.layer)

  const done = cfg
    ? [...cfg.validation.projects, ...cfg.validation.exams].filter(
        (id) => act(id)?.status === "done",
      ).length
    : 0
  const all = cfg ? cfg.validation.projects.length + cfg.validation.exams.length : 0

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb
        data={[CRUMB, { label: "My program", href: "#/learn/program" }, { label: m.name }]}
      />
      <PageHead
        title={m.name}
        aside={
          m.status === "locked" ? (
            <Badge variant="light" size="md" color="gray">
              Locked
            </Badge>
          ) : started ? (
            <>
              <Text size="xs" c="muted">
                Started <b className={TYPO.mono("medium")}>{started.on}</b>
              </Text>
              <Badge variant="outline" size="md" color="gray" className={TYPO.mono("medium")}>
                v{started.version}
              </Badge>
              {started.next ? (
                <Button variant="light" size="sm">
                  Update to v{started.next}
                </Button>
              ) : null}
            </>
          ) : (
            <Button variant="filled" size="sm">
              Start module
            </Button>
          )
        }
      />

      {/* The abstract is the module's own voice — the artifact gave it a rule and a tint
          rather than a card, and that is the one place on the screen where text sits
          outside a card. Here it is a card, because `review:layout` asks for it. */}
      <Card variant="light" padding="lg">
        <Card.Content>
          <Text size="md" c="secondary">
            {m.abstract}
          </Text>
        </Card.Content>
      </Card>

      {started?.next ? (
        <Alert
          type="info"
          variant="light"
          title={`Content version ${started.next} is available`}
          description={`You are working on v${started.version}. Updating changes the subject you are graded against — the artifact made that a decision, never a silent upgrade, except for a patch.`}
        />
      ) : null}

      {!cfg ? (
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-2">
              <Title order={2} size="md" className={TYPO.title("semibold")}>
                No module config uploaded
              </Title>
              <Text size="sm" c="secondary">
                Only Programming Fundamentals and Systems & networks administration carry a
                real config.yml so far — open one of those from My program to see the full
                page.
              </Text>
              <Button variant="outline" size="sm" className="self-start" asChild>
                <a href="#/learn/module/programming-fundamentals">
                  Open Programming Fundamentals
                </a>
              </Button>
            </div>
          </Card.Content>
        </Card>
      ) : (
        <>
          <Section
            title="Validation conditions"
            icon={FileCheck}
            right={
              <div className="flex items-center gap-3">
                <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                  {done}/{all} met
                </Text>
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setShowValidation(!showValidation)}
                >
                  {showValidation ? "Hide" : "Show"}
                </Button>
              </div>
            }
          >
            {showValidation ? (
              <Card variant="default" padding="lg">
                <Card.Content>
                  {/* Printed as the config has it: the keys, then the raw ids. The
                      artifact showed the YAML on purpose — the learner is being graded
                      against a file, and the file is legible. */}
                  <div className={`flex flex-col gap-1 text-sm ${TYPO.mono("medium")}`}>
                    <Text size="sm" c="muted" className={TYPO.mono("semibold")}>
                      validation-conditions:
                    </Text>
                    {cfg.validation.projects.length ? (
                      <Text size="sm" c="muted" className={`ms-4 ${TYPO.mono("medium")}`}>
                        projects:
                      </Text>
                    ) : null}
                    {cfg.validation.projects.map((id) => (
                      <div key={id} className="ms-8 flex items-center gap-2">
                        {act(id)?.status === "done" ? (
                          <Check size={14} />
                        ) : (
                          <CircleDot size={14} />
                        )}
                        <Text size="xs" c="secondary" className={TYPO.mono("medium")}>
                          - {id}
                        </Text>
                      </div>
                    ))}
                    {cfg.validation.exams.length ? (
                      <Text size="sm" c="muted" className={`ms-4 ${TYPO.mono("medium")}`}>
                        exams:
                      </Text>
                    ) : null}
                    {cfg.validation.exams.map((id) => (
                      <div key={id} className="ms-8 flex items-center gap-2">
                        {act(id)?.status === "done" ? (
                          <Check size={14} />
                        ) : (
                          <CircleDot size={14} />
                        )}
                        <Text size="xs" c="secondary" className={TYPO.mono("medium")}>
                          - {id}
                        </Text>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            ) : null}
          </Section>

          <Section title="Activities" icon={LayoutGrid}>
            <div className="flex flex-col gap-3">
              {workLayers.map((layer, i) => {
                const shut = layerShut(layer.after)
                return (
                  <div key={layer.layer} className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {layer.items.map((id) => {
                        const a = act(id)
                        if (!a) return null
                        return (
                          <Card key={id} variant={shut ? "default" : "light"} padding="md">
                            <Card.Content>
                              <div className="flex items-center gap-3">
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                  <Text size="md" className={TYPO.title("semibold")}>
                                    {a.name}
                                  </Text>
                                  <Text size="xs" c="muted">
                                    {a.kind}
                                  </Text>
                                </div>
                                {shut ? (
                                  <Badge variant="light" size="sm" color="gray">
                                    Locked
                                  </Badge>
                                ) : (
                                  /* a project with a live attempt reports what the
                                     ATTEMPT is doing — that difference is why the
                                     learner opens the card */
                                  <Tag
                                    color={
                                      a.status === "done"
                                        ? "green"
                                        : a.attempt || a.status === "now"
                                          ? "pink"
                                          : "gray"
                                    }
                                  >
                                    {a.attempt ?? ACT_LABEL[a.status]}
                                  </Tag>
                                )}
                                {a.kind === "Project" && !shut ? (
                                  <Button
                                    variant="subtle"
                                    size="xs"
                                    aria-label={`Open ${a.name}`}
                                    asChild
                                  >
                                    <a href={`#/learn/project/${a.name}`}>
                                      <ChevronRight size={16} />
                                    </a>
                                  </Button>
                                ) : null}
                              </div>
                            </Card.Content>
                          </Card>
                        )
                      })}
                    </div>
                    {i < workLayers.length - 1 ? (
                      <div className="flex justify-center">
                        <ArrowDown size={18} />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </Section>

          {examId && act(examId) ? (
            <Section title="Exam" icon={FileCheck}>
              <Card variant="default" padding="lg">
                <Card.Content>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Text size="md" className={TYPO.title("semibold")}>
                        {act(examId)?.name}
                      </Text>
                      {cfg.exam?.passed ? (
                        <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                          {cfg.exam.lastDay} · {cfg.exam.lastScore}/100
                        </Text>
                      ) : m.status === "locked" ? (
                        <Text size="xs" c="muted">
                          Registration opens when the module unlocks.
                        </Text>
                      ) : (
                        <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                          {cfg.exam?.sessions} sessions · {cfg.exam?.free} with seats left
                        </Text>
                      )}
                    </div>
                    <Tag color={cfg.exam?.passed ? "green" : "gray"}>
                      {cfg.exam?.passed ? "Success" : "NEW"}
                    </Tag>
                    {/* A disabled action says more than a hidden one: the learner sees
                        WHAT will be asked and WHEN. */}
                    <Button
                      variant={cfg.exam?.passed ? "outline" : "filled"}
                      size="sm"
                      disabled={m.status === "locked"}
                    >
                      {cfg.exam?.passed ? "Attempt history" : "Register"}
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </Section>
          ) : null}
        </>
      )}
    </div>
  )
}

/** Holygraph — `P['learn.holygraph']`.
 *
 *  The artifact PARKED the interactive dependency graph (2026-08-20) and left a page that
 *  says so, with the program and the attempts currently in orbit around it. That state is
 *  ported as it stands: a prototype that quietly shipped the parked graph would misreport
 *  what the product has. */
export const Holygraph = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[CRUMB, { label: "Holygraph" }]} />
    <PageHead
      title="Holygraph"
      sub="Your program and everything currently in orbit around it."
    />

    <Section title="In orbit" icon={Orbit}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {MODULES.filter((m) => m.status === "progress").map((m) => (
          <Card key={m.id} variant={m.entry ? "gradient" : "default"} padding="lg">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <Title order={3} size="md" className={TYPO.title("semibold")}>
                    {m.name}
                  </Title>
                  <Tag color="pink">In progress</Tag>
                </div>
                <Meter
                  label="Skills acquired"
                  value={`${m.skills[0]}/${m.skills[1]}`}
                  pct={pct(m)}
                />
                <Button variant="outline" size="sm" className="self-start" asChild>
                  <a href={`#/learn/module/${m.id}`}>Open module</a>
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </Section>

    <Alert
      type="info"
      variant="light"
      title="The full dependency graph is still to come"
      description="This shows the program you are on and the attempts open against it. Every activity and its prerequisites live in My program until the graph itself lands — the interactive Holygraph was parked on 2026-08-20."
    />

    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" asChild>
        <a href="#/learn/program">My program</a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href="#/progression/milestones">Milestones</a>
      </Button>
    </div>
  </div>
)
