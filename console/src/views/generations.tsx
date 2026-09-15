/** The generation-centric half of Observability (2026-09-15).
 *
 *  Why it was rebuilt. The tab opened on one block called "Generation cost" that mixed
 *  three things a reader had to untangle: the flows (measured at publication), the Figma
 *  mockups (measured at the report that closes them) and the reports themselves (the
 *  quality curve's points) — and the mockup's row named its report file, so a mockup and
 *  a report looked like the same thing. Under it came the server's own counters, with the
 *  failures somewhere in the middle. What a person opens this tab for is three questions,
 *  in this order: how long does each KIND of generation take, who made what, and what
 *  broke. That is the order of the page now, and the server's plumbing sits under it,
 *  folded.
 *
 *  Three kinds, told apart everywhere by the same badge:
 *   • FIGMA MOCKUP — a frame built in the Figma file; its window opens on the skill (or
 *     the keys pre-flight) and closes on the report; `build_s` is the longest silence,
 *     the turn spent in the Figma MCP;
 *   • FLOW — a React prototype published to this site; its window closes on the
 *     publication; `write_s` is the composing turn;
 *   • REPORT — what was learned, filed with `submit_report`; a quality-curve point when
 *     it carries a gate. Not a measured generation: counted, with who filed it, and
 *     whether the gate was at zero.
 *
 *  Everything here is READ: `generation.py` computes the averages, the split by skill,
 *  the per-person rows and the error rows server-side, and this file only draws them —
 *  two implementations of "the average per mockup" would put two numbers in front of the
 *  same person. Tokens are an estimate (characters through the server ÷ 4); the
 *  per-screen figure of a flow is ATTRIBUTED (one publication carries several screens). */
import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { type ReactNode, useState } from "react"
import type {
  ErrorRun,
  FigmaRun,
  GenerationFlow,
  GenerationPerson,
  GenerationType,
  Generations,
  ReportRow,
  ReportsOverall,
} from "../mcp"
import { useRoute } from "../state"

/** `4 min 12 s`, `38 s`, `1 h 07` — the same shape as the flows' own panel. */
export const duration = (seconds?: number): string => {
  const s = Math.max(0, Math.round(seconds ?? 0))
  if (s < 60) return `${s} s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min${s % 60 ? ` ${s % 60} s` : ""}`
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`
}

export const compact = (n?: number): string => {
  const v = n ?? 0
  return v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
      ? `${Math.round(v / 1_000)}k`
      : String(v)
}

export const day = (iso?: string): string =>
  iso ? (Number.isNaN(Date.parse(iso)) ? iso : new Date(iso).toLocaleDateString()) : "—"

/** A section: a title, one sentence saying what the numbers are, the content. */
export const Section = ({
  title,
  help,
  aside,
  children,
}: {
  title: string
  help?: string
  aside?: ReactNode
  children: ReactNode
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <Title order={2} size="sm">
        {title}
      </Title>
      {aside}
    </div>
    {help ? (
      <Text c="muted" size="sm">
        {help}
      </Text>
    ) : null}
    {children}
  </div>
)

// ---------------------------------------------------------------- the three kinds

type Kind = "figma" | "flow" | "report"

const KIND: Record<Kind, { label: string; plural: string; color: "blue" | "brand" | "gray"; unit: string }> = {
  figma: { label: "Figma mockup", plural: "Figma mockups", color: "blue", unit: "mockup" },
  flow: { label: "Flow", plural: "Flows", color: "brand", unit: "screen" },
  report: { label: "Report", plural: "Reports", color: "gray", unit: "report" },
}

const kindOf = (t: string): Kind => (t === "figma" || t === "report" ? t : "flow")

/** The one badge that tells the three apart, wherever a row can be one of them. */
export const TypeBadge = ({ type, size = "sm" }: { type: string; size?: "sm" | "md" }) => {
  const k = KIND[kindOf(type)]
  return (
    <Badge color={k.color} variant="light" size={size}>
      {k.label}
    </Badge>
  )
}

/** What a skill MEANS, in words a PO reads — the name stays next to it in mono. */
const SKILL_LABEL: Record<string, string> = {
  "figma-build-mockup": "from a prompt or an image",
  "figma-migrate-mockup": "migrated from another design system",
  "figma-from-screen": "from a React screen (code → Figma)",
  "proto-build-flow": "from a prompt",
  "proto-from-figma": "from Figma frames",
}

const SkillName = ({ skill }: { skill: string }) =>
  skill ? (
    <span className="flex min-w-44 flex-col">
      <span className="whitespace-nowrap font-mono text-xs">{skill}</span>
      {SKILL_LABEL[skill] ? (
        <span className="text-(--c-muted) text-xs">{SKILL_LABEL[skill]}</span>
      ) : null}
    </span>
  ) : (
    <span className="text-(--c-muted) text-xs">skill not recorded</span>
  )

const Line = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-baseline justify-between gap-3">
    <Text c="muted" size="sm">
      {label}
    </Text>
    <span className="font-mono text-sm tabular-nums">{value}</span>
  </div>
)

const Errors = ({ n }: { n: number }) =>
  n ? (
    <Badge color="red" variant="light" size="sm">
      {n}
    </Badge>
  ) : (
    <span className="text-(--c-muted)">0</span>
  )

/** One kind, on its card: what was made, how long one takes, who, what broke. A kind
 *  with nothing yet still has its card, dimmed — the answer to "is this measured at
 *  all" must not be a missing box. */
const TypeCard = ({ row, reports }: { row: GenerationType; reports?: ReportsOverall }) => {
  const k = kindOf(row.type)
  const meta = KIND[k]
  const empty = row.runs === 0
  const unmeasured = k !== "report" && row.runs > 0 && row.measured_runs === 0
  return (
    <Card variant="outline" padding="md" className={empty ? "opacity-60" : undefined}>
      <Card.Header className="flex-row items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div>
            <TypeBadge type={k} size="md" />
          </div>
          <div className="font-mono text-3xl text-white tabular-nums">{row.units}</div>
          <Text c="muted" size="sm">
            {k === "report"
              ? `${row.units === 1 ? "report" : "reports"} filed${
                  reports?.gated ? ` · ${reports.gated} with a gate` : ""
                }`
              : `${row.units === 1 ? meta.unit : `${meta.unit}s`} · ${row.runs} generation${
                  row.runs === 1 ? "" : "s"
                }${row.measured_runs < row.runs ? ` · ${row.measured_runs} measured` : ""}`}
          </Text>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-1">
        {k === "report" ? (
          <>
            <Line
              label="gate at zero"
              value={reports?.gated ? `${reports.gate_zero} / ${reports.gated}` : "—"}
            />
            <Line
              label="kinds"
              value={
                Object.entries(reports?.kinds ?? {})
                  .map(([kind, n]) => `${n} ${kind}`)
                  .join(" · ") || "—"
              }
            />
          </>
        ) : (
          <>
            <Line
              label={`per ${meta.unit}`}
              value={unmeasured ? "not measured" : empty ? "—" : duration(row.per_unit_s)}
            />
            <Line label="in the model" value={empty ? "—" : duration(row.model_s)} />
            <Line
              label={k === "figma" ? "in Figma" : "composing"}
              value={empty ? "—" : duration(row.focus_s)}
            />
            <Line label="tokens (est.)" value={`~${compact(row.tokens_in + row.tokens_out)}`} />
          </>
        )}
        <Line label="people" value={row.people} />
        <Line label="errors" value={<Errors n={row.errors} />} />
        <Line label="last" value={day(row.last)} />
      </Card.Content>
    </Card>
  )
}

/** The split by SKILL — a flow from a prompt against a flow from frames, a mockup from a
 *  prompt against a migrated one. The type's own row first, its skills under it. */
const TypesTable = ({ rows }: { rows: GenerationType[] }) => (
  <Table size="sm">
    <Table.Content>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Kind</Table.HeaderCell>
          <Table.HeaderCell>How</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Generations</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Made</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Per unit</Table.HeaderCell>
          <Table.HeaderCell className="text-right">In the model</Table.HeaderCell>
          <Table.HeaderCell className="text-right">In Figma · composing</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Calls</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Errors</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Tokens</Table.HeaderCell>
          <Table.HeaderCell className="text-right">People</Table.HeaderCell>
          <Table.HeaderCell>Last</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows
          .filter((r) => r.runs > 0)
          .map((r) => {
            const k = kindOf(r.type)
            const measured = k === "report" || r.measured_runs > 0
            return (
              <Table.Row key={`${r.type}:${r.skill}`}>
                <Table.Cell>{r.skill ? "" : <TypeBadge type={k} />}</Table.Cell>
                <Table.Cell>
                  {r.skill ? (
                    <SkillName skill={r.skill} />
                  ) : (
                    <span className="text-(--c-muted) text-xs">all</span>
                  )}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">{r.runs}</Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                  {r.units} {r.unit}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                  {k === "report" ? "—" : measured ? duration(r.per_unit_s) : "not measured"}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                  {k === "report" ? "—" : duration(r.model_s)}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                  {k === "report" ? "—" : duration(r.focus_s)}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                  {k === "report" ? "—" : r.calls}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                  {k === "report" ? "—" : <Errors n={r.errors} />}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                  {k === "report" ? "—" : `~${compact(r.tokens_in + r.tokens_out)}`}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">{r.people}</Table.Cell>
                <Table.Cell className="font-mono text-xs">{day(r.last)}</Table.Cell>
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table.Content>
  </Table>
)

// ---------------------------------------------------------------- who did what

/** One row per person, the three kinds as three columns. Keyed on the token's id
 *  server-side, so "Arnaud", "arnaud" and "Arnaud Morvan" are one person; a record with
 *  no token falls back on the typed name, and one with neither is the last row. */
const WhoTable = ({ people }: { people: GenerationPerson[] }) => (
  <Table size="sm">
    <Table.Content>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Person</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Figma mockups</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Flows · screens</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Reports</Table.HeaderCell>
          <Table.HeaderCell className="text-right">In the model</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Per screen</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Errors</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Tokens</Table.HeaderCell>
          <Table.HeaderCell>Last</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {people.map((p) => (
          <Table.Row key={p.id}>
            <Table.Cell>
              {p.name}
              <Text c="muted" size="xs">
                {[p.id !== "?" ? p.id : "", ...p.clients].filter(Boolean).join(" · ") || "—"}
              </Text>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
              {p.mockups.length}
              {p.figma_runs > p.mockups.length ? (
                <Text c="muted" size="xs">
                  {p.figma_runs} generations
                </Text>
              ) : null}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
              {p.flows.length} · {p.screens}
              {p.flow_runs > p.flows.length ? (
                <Text c="muted" size="xs">
                  {p.flow_runs} publications
                </Text>
              ) : null}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">{p.reports}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
              {duration(p.model_s)}
              {p.measured_runs < p.flow_runs + p.figma_runs ? (
                <Text c="muted" size="xs">
                  {p.measured_runs} measured
                </Text>
              ) : null}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
              {p.screens ? duration(p.per_screen_s) : "—"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
              <Errors n={p.errors} />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
              ~{compact(p.tokens_in + p.tokens_out)}
            </Table.Cell>
            <Table.Cell className="font-mono text-xs">{day(p.last)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Content>
  </Table>
)

// ---------------------------------------------------------------- the errors

/** Which generation paid for a failed call, whose, and how many — before the list of what
 *  the calls said (`Failures`, from the metrics), which is grouped by tool and message. */
const ErrorRuns = ({ errors }: { errors: ErrorRun[] }) =>
  errors.length ? (
    <Table size="sm">
      <Table.Content>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Kind</Table.HeaderCell>
            <Table.HeaderCell>Generation</Table.HeaderCell>
            <Table.HeaderCell>Who</Table.HeaderCell>
            <Table.HeaderCell>When</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Failed calls</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {errors.map((e) => (
            <Table.Row key={`${e.type}:${e.name}:${e.at}`}>
              <Table.Cell>
                <TypeBadge type={e.type} />
              </Table.Cell>
              <Table.Cell>
                <span className="font-mono text-xs">{e.name || "—"}</span>
                {e.skill ? (
                  <Text c="muted" size="xs">
                    {e.skill}
                  </Text>
                ) : null}
              </Table.Cell>
              <Table.Cell>{e.who || "—"}</Table.Cell>
              <Table.Cell className="font-mono text-xs">{day(e.at)}</Table.Cell>
              <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
                <Errors n={e.errors} /> <span className="text-(--c-muted)">/ {e.calls}</span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  ) : (
    <Text c="muted" size="sm">
      No generation paid for a failed call — every call made inside a measured window came
      back. The list below is the server's own view: every tool call that raised, whichever
      conversation made it.
    </Text>
  )

// ---------------------------------------------------------------- the detail, per kind

/** One flow, and what it cost. Expanded, it shows the per-screen share and the runs — the
 *  two things a comparison with another method is actually read off.
 *
 *  ⚠️ The per-screen column is ATTRIBUTED: one publication carries several screens, so a
 *  run's time is prorated on what was written. The header says so once, here, rather than
 *  on every cell — but it must never be dropped: a prorated number printed as a
 *  measurement is a lie that survives into whatever table it is copied to. */
const FlowRows = ({ flow }: { flow: GenerationFlow }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Table.Row>
        <Table.Cell>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-start hover:underline"
          >
            {flow.title}
          </button>
          <Text c="muted" size="xs">
            <span className="font-mono">{flow.slug}</span> · {day(flow.last)}
          </Text>
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">{flow.screens}</Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          {duration(flow.per_screen_s)}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          {duration(flow.model_s)}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">{flow.runs}</Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          <Errors n={flow.errors ?? 0} />
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          ~{compact(flow.tokens_in + flow.tokens_out)}
        </Table.Cell>
        <Table.Cell className="font-mono text-xs">
          {flow.models.join(" · ") || "—"}
        </Table.Cell>
      </Table.Row>
      {open ? (
        <Table.Row>
          <Table.Cell colSpan={8}>
            <div className="grid gap-6 py-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  Per screen — attributed
                </Text>
                {flow.detail.map((f) => (
                  <div key={f.path} className="flex flex-col">
                    <span className="font-mono text-xs">{f.path}</span>
                    <span className="font-mono text-[11px] text-(--c-muted) tabular-nums">
                      {duration(f.seconds)} · {Math.round(f.bytes / 100) / 10} Ko · {f.runs}{" "}
                      pass{f.runs > 1 ? "es" : ""}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  Where the context goes — tokens, every run
                </Text>
                {Object.entries(flow.context ?? {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([tool, chars]) => (
                    <div key={tool} className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-mono text-xs">{tool}</span>
                      <span className="shrink-0 font-mono text-xs tabular-nums">
                        ~{compact(Math.floor(chars / 4))}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  Generations — measured
                </Text>
                {/* Stacked, not justified across the row: a run's line carries four
                    facts and this column is a third of a table cell — side by side, the
                    last of them was clipped by the cell's edge, which is the one way a
                    number can be wrong without being false. */}
                {flow.runs_detail
                  .slice()
                  .reverse()
                  .map((r) => (
                    <div key={r.run} className="flex flex-col">
                      <span className="font-mono text-xs">
                        #{r.run} · {day(r.at)} · {r.who || r.author || "—"}
                        {r.skill ? ` · ${r.skill}` : ""}
                        {r.errors ? ` · ${r.errors} error${r.errors > 1 ? "s" : ""}` : ""}
                      </span>
                      <span className="font-mono text-[11px] text-(--c-muted) tabular-nums">
                        {r.measured === false ? "not measured" : duration(r.model_s)}
                        {r.write_s ? ` · ${duration(r.write_s)} composing` : ""} ·{" "}
                        {r.calls ?? 0} calls · ~
                        {compact(Math.floor(((r.in_chars ?? 0) + (r.out_chars ?? 0)) / 4))} tk
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      ) : null}
    </>
  )
}


/** The name on a mockup's row: the person the token names, else what the agent typed. */
const whoOf = (r: FigmaRun): string => r.who || r.designer || "—"

/** One mockup, and what it cost. Expanded: the tools it called and where its context
 *  went — the same two lists a flow's row opens on. */
const FigmaRows = ({ run }: { run: FigmaRun }) => {
  const [open, setOpen] = useState(false)
  const gate = run.gate
  return (
    <>
      <Table.Row>
        <Table.Cell>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-start hover:underline"
          >
            {run.screen || run.title || "mockup"}
          </button>
          <Text c="muted" size="xs">
            <span className="font-mono">{run.skill || "—"}</span> · {day(run.at)}
          </Text>
        </Table.Cell>
        <Table.Cell>{whoOf(run)}</Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          {run.measured === false ? "not measured" : duration(run.model_s)}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          {run.measured === false ? "—" : duration(run.build_s)}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">{run.calls ?? 0}</Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          <Errors n={run.errors ?? 0} />
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          ~{compact(Math.floor(((run.in_chars ?? 0) + (run.out_chars ?? 0)) / 4))}
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
          {gate && gate.issues !== null ? (
            <Badge color={gate.issues === 0 ? "green" : "red"} variant="light" size="sm">
              {gate.issues === 0 ? "0" : gate.issues}
            </Badge>
          ) : (
            "—"
          )}
        </Table.Cell>
        <Table.Cell className="font-mono text-xs">{run.model || "—"}</Table.Cell>
      </Table.Row>
      {open ? (
        <Table.Row>
          <Table.Cell colSpan={9}>
            <div className="grid gap-6 py-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  The window — measured
                </Text>
                <span className="font-mono text-[11px] text-(--c-muted) tabular-nums">
                  {duration(run.wall_s)} wall · {duration(run.model_s)} in the model ·{" "}
                  {duration(run.server_s)} server
                  {run.away_s ? ` · ${duration(run.away_s)} away` : ""}
                </span>
                <span className="font-mono text-[11px] text-(--c-muted) tabular-nums">
                  longest silence {duration(run.build_s)}
                  {run.build_before ? ` (ended by ${run.build_before})` : " (the trailing one)"}{" "}
                  · {duration(run.write_s)} before the report
                </span>
                {gate ? (
                  <span className="font-mono text-[11px] text-(--c-muted) tabular-nums">
                    gate: {gate.issues ?? "?"} issue{gate.issues === 1 ? "" : "s"} ·{" "}
                    {gate.ds_nodes ?? "?"} DS nodes · {gate.custom_nodes ?? "?"} custom
                  </span>
                ) : null}
                {run.report ? (
                  <span className="truncate font-mono text-[11px] text-(--c-muted)">
                    {run.report}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  Where the context goes — tokens
                </Text>
                {Object.entries(run.context ?? {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([tool, chars]) => (
                    <div key={tool} className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-mono text-xs">{tool}</span>
                      <span className="shrink-0 font-mono text-xs tabular-nums">
                        ~{compact(Math.floor(chars / 4))}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  Calls, by tool
                </Text>
                {Object.entries(run.tools ?? {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([tool, n]) => (
                    <div key={tool} className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-mono text-xs">{tool}</span>
                      <span className="shrink-0 font-mono text-xs tabular-nums">{n}</span>
                    </div>
                  ))}
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      ) : null}
    </>
  )
}


/** One report, as the quality curve holds it: what it was about, who filed it, the gate. */
const ReportRows = ({ rows }: { rows: ReportRow[] }) => (
  <Table size="sm">
    <Table.Content>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Report</Table.HeaderCell>
          <Table.HeaderCell>Who</Table.HeaderCell>
          <Table.HeaderCell>Kind</Table.HeaderCell>
          <Table.HeaderCell>Skill</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Gate</Table.HeaderCell>
          <Table.HeaderCell>When</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((r, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a curve point has no identifier
          <Table.Row key={i}>
            <Table.Cell>
              {r.screen || r.kind}
              {r.report ? (
                <Text c="muted" size="xs">
                  <span className="font-mono">{r.report}</span>
                </Text>
              ) : null}
            </Table.Cell>
            <Table.Cell>{r.who || r.designer || "—"}</Table.Cell>
            <Table.Cell className="font-mono text-xs">{r.kind}</Table.Cell>
            <Table.Cell className="font-mono text-xs">{r.skill || "—"}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-mono tabular-nums">
              {r.issues === null || r.issues === undefined ? (
                "—"
              ) : (
                <Badge color={r.issues === 0 ? "green" : "red"} variant="light" size="sm">
                  {r.issues}
                </Badge>
              )}
            </Table.Cell>
            <Table.Cell className="font-mono text-xs">{day(r.at)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Content>
  </Table>
)

/** The detail, ONE kind at a time — a chip per kind, with its count. Opens on the kind
 *  that moved last: what a person comes back to check is the thing they just made. */
const RunsSection = ({ data }: { data: Generations }) => {
  const mockups = data.figma?.runs ?? []
  const flows = data.flows
  const reports = data.reports?.rows ?? []
  const lastOf = (at?: string) => (at ? Date.parse(at) || 0 : 0)
  const latest: Kind = (() => {
    const t: Array<[Kind, number]> = [
      ["figma", lastOf(mockups[0]?.at)],
      ["flow", lastOf(flows[0]?.last)],
      ["report", lastOf(reports[0]?.at)],
    ]
    t.sort((a, b) => b[1] - a[1])
    return t[0][1] ? t[0][0] : "figma"
  })()
  const [kind, setKind] = useState<Kind>(latest)
  const counts: Record<Kind, number> = {
    figma: mockups.length,
    flow: flows.length,
    report: reports.length,
  }
  const chip = (k: Kind) => (
    <button
      key={k}
      type="button"
      onClick={() => setKind(k)}
      aria-pressed={kind === k}
      className={`rounded-full border px-3 py-1 text-sm ${
        kind === k
          ? "border-white/40 bg-white/10 text-white"
          : "border-white/10 text-(--c-muted) hover:text-white"
      }`}
    >
      {KIND[k].plural} <span className="font-mono tabular-nums">{counts[k]}</span>
    </button>
  )
  return (
    <Section
      title="Detail"
      help={
        kind === "figma"
          ? "One row per mockup, newest first. 'In Figma' is the longest silence of the window — the turn spent instantiating, node by node. Click a row for the window, where its context went and the calls by tool."
          : kind === "flow"
            ? "One row per flow. Click it for the per-screen share (ATTRIBUTED: a publication carries several screens), where its context went, and the run by run detail."
            : "One row per report, newest first — the quality curve's points. The gate is the TOKENS GATE result the report carried; a dash is a report that carried none."
      }
      aside={<div className="flex flex-wrap gap-2">{(["figma", "flow", "report"] as Kind[]).map(chip)}</div>}
    >
      {kind === "figma" ? (
        mockups.length ? (
          <Table size="sm">
            <Table.Content>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Mockup</Table.HeaderCell>
                  <Table.HeaderCell>Who</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">In the model</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">In Figma</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Calls</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Errors</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Tokens</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Gate</Table.HeaderCell>
                  <Table.HeaderCell>Model</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {mockups.map((r) => (
                  <FigmaRows key={r.n} run={r} />
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        ) : (
          <Text c="muted" size="sm">
            No mockup recorded yet. The record is written when the report that closes a Figma
            skill arrives; a mockup whose report never came is not here, and none is invented
            for it.
          </Text>
        )
      ) : kind === "flow" ? (
        flows.length ? (
          <Table size="sm">
            <Table.Content>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Flow</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Screens</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Per screen</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">In the model</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Runs</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Errors</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Tokens</Table.HeaderCell>
                  <Table.HeaderCell>Model</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {flows.map((f) => (
                  <FlowRows key={f.slug} flow={f} />
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        ) : (
          <Text c="muted" size="sm">
            No flow recorded yet. The record is written at publication; flows published
            before the measurement existed carry none.
          </Text>
        )
      ) : reports.length ? (
        <ReportRows rows={reports} />
      ) : (
        <Text c="muted" size="sm">
          No report on the quality curve yet — the curve fills up when a generation submits
          its measured gate through submit_report.
        </Text>
      )}
    </Section>
  )
}

// ---------------------------------------------------------------- the dashboard

/** The whole generation half of the tab, top to bottom: the three kinds, the split by
 *  skill, who did what, the errors (with the server's own list of what failed handed in
 *  as `failures`), then the detail per kind. */
export const GenerationsDashboard = ({
  apiKey,
  failures,
}: {
  apiKey: string
  failures: ReactNode
}) => {
  const { data, error, loading } = useRoute<Generations>("/console/generations.json", apiKey)
  const types = data?.types ?? []
  const typeRows = types.filter((t) => !t.skill)
  const people = data?.people ?? []
  const errors = data?.errors ?? []
  const total = typeRows.reduce((n, t) => n + t.runs, 0)
  const sideErrors = [data?.figma?.error, data?.reports?.error].filter(Boolean)
  return (
    <>
      <Section
        title="Generations"
        help="Three kinds, measured three ways. A Figma mockup and a flow are timed on the calls themselves — from the skill load to the report (mockup) or the publication (flow); a report is counted, not timed. 'In the model' is the time inside the model; 'in Figma' the turn spent in the Figma MCP; 'composing' the turn in which the screens were written. Tokens are an estimate: characters through this server ÷ 4."
      >
        {error ? (
          <Text c="muted" size="sm">
            The generation records cannot be read: {error}
          </Text>
        ) : loading && !data ? (
          <Text c="muted" size="sm">
            Loading…
          </Text>
        ) : null}
        {data && total === 0 ? (
          <Text c="muted" size="sm">
            Nothing recorded yet. A record is written when a generation closes — a flow at
            its publication, a mockup at the report its skill files last, a report when it
            carries a gate — so the next one writes the first record.
          </Text>
        ) : null}
        {typeRows.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {typeRows.map((r) => (
              <TypeCard key={r.type} row={r} reports={data?.reports?.overall} />
            ))}
          </div>
        ) : null}
        {sideErrors.length ? (
          <Text c="muted" size="sm">
            Part of the records could not be read ({sideErrors.join(" · ")}) — the rest of
            the page is unaffected.
          </Text>
        ) : null}
      </Section>

      {types.some((t) => t.skill) ? (
        <Section
          title="By way of generating"
          help="The same numbers split by SKILL: a flow from a prompt against a flow from Figma frames, a mockup from a prompt against one migrated or lifted from code. 'Per unit' is per screen created (flow) or per mockup (Figma)."
        >
          <TypesTable rows={types} />
        </Section>
      ) : null}

      {people.length ? (
        <Section
          title="Who did what"
          help="One row per person, the three kinds as three columns. Time and tokens sum the measured runs; screens are the ones CREATED (a new pages/ file), mockups the distinct frames reported, reports the quality curve's points."
        >
          <WhoTable people={people} />
        </Section>
      ) : null}

      <Section
        title={`Errors${errors.length ? ` · ${errors.length} generation${errors.length > 1 ? "s" : ""}` : ""}`}
        help="First the generations that paid for a failed call — which one, whose, how many. Then what the calls SAID, grouped by tool and message, whichever conversation made them."
      >
        <ErrorRuns errors={errors} />
        {failures}
      </Section>

      {data ? <RunsSection data={data} /> : null}
    </>
  )
}
