import { Badge } from "@42/ui-react/badge"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { type ReactNode, useState } from "react"
import type { GenerationFlow, Generations, Metrics, Pair } from "../mcp"
import { State, Stat, useRoute } from "../state"
import { Heatmap, Series } from "./series"

const Block = ({
  title,
  help,
  children,
}: {
  title: string
  help?: string
  children: ReactNode
}) => (
  <div className="flex flex-col gap-2">
    <Title order={2} size="sm">
      {title}
    </Title>
    {help ? (
      <Text c="muted" size="sm">
        {help}
      </Text>
    ) : null}
    {children}
  </div>
)

const Ranking = ({ rows, unit, empty }: { rows?: Pair[]; unit?: string; empty: string }) =>
  rows?.length ? (
    <Table size="sm">
      <Table.Content>
        <Table.Body>
          {rows.map((l) => (
            <Table.Row key={l.n}>
              <Table.Cell className="font-mono">{l.n}</Table.Cell>
              <Table.Cell className="w-28 text-right font-mono">
                {l.v}
                {unit ? ` ${unit}` : ""}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  ) : (
    <Text c="muted" size="sm">
      {empty}
    </Text>
  )

/** `4 min 12 s`, `38 s`, `1 h 07` — the same shape as the flows' own panel. */
const duration = (seconds?: number): string => {
  const s = Math.max(0, Math.round(seconds ?? 0))
  if (s < 60) return `${s} s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min${s % 60 ? ` ${s % 60} s` : ""}`
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`
}

const compact = (n?: number): string => {
  const v = n ?? 0
  return v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
      ? `${Math.round(v / 1_000)}k`
      : String(v)
}

const day = (iso?: string): string =>
  iso ? (Number.isNaN(Date.parse(iso)) ? iso : new Date(iso).toLocaleDateString()) : "—"

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
        <Table.Cell className="text-right font-mono tabular-nums">{flow.screens}</Table.Cell>
        <Table.Cell className="text-right font-mono tabular-nums">
          {duration(flow.per_screen_s)}
        </Table.Cell>
        <Table.Cell className="text-right font-mono tabular-nums">
          {duration(flow.model_s)}
        </Table.Cell>
        <Table.Cell className="text-right font-mono tabular-nums">{flow.runs}</Table.Cell>
        <Table.Cell className="text-right font-mono tabular-nums">
          ~{compact(flow.tokens_in + flow.tokens_out)}
        </Table.Cell>
        <Table.Cell className="font-mono text-xs">
          {flow.models.join(" · ") || "—"}
        </Table.Cell>
      </Table.Row>
      {open ? (
        <Table.Row>
          <Table.Cell colSpan={7}>
            <div className="grid gap-6 py-2 lg:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  Per screen — attributed
                </Text>
                {flow.detail.map((f) => (
                  <div key={f.path} className="flex items-baseline justify-between gap-4">
                    <span className="truncate font-mono text-xs">{f.path}</span>
                    <span className="shrink-0 font-mono text-xs tabular-nums">
                      {duration(f.seconds)} · {Math.round(f.bytes / 100) / 10} Ko ·{" "}
                      {f.runs} pass{f.runs > 1 ? "es" : ""}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <Text size="sm" c="secondary">
                  Generations — measured
                </Text>
                {flow.runs_detail
                  .slice()
                  .reverse()
                  .map((r) => (
                    <div key={r.run} className="flex items-baseline justify-between gap-4">
                      <span className="truncate font-mono text-xs">
                        #{r.run} · {day(r.at)} · {r.author || "—"}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums">
                        {r.measured === false ? "not measured" : duration(r.model_s)} ·{" "}
                        {r.calls ?? 0} calls · ~
                        {compact(
                          Math.floor(((r.in_chars ?? 0) + (r.out_chars ?? 0)) / 4),
                        )}{" "}
                        tk
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

/** What a screen costs to produce here. The claim this whole setup rests on — that a
 *  screen comes out faster with the DS served to the agent than another way — had no
 *  recorded evidence until 2026-09-09: the time of a generation lived in a conversation.
 *
 *  Read from the records the MCP writes into each flow, not from the metrics: the metrics
 *  know every call, they do not know which ones were ONE generation. A failing fetch draws
 *  nothing — the route does not exist without a flows repo, and an optional capability
 *  must not take the observability page down with it.
 *
 *  ⚠️ An EMPTY answer is not the same as no answer, and treating them alike was wrong the
 *  day this shipped: with no flow republished yet there was no record anywhere, the block
 *  hid itself, and the only way to learn that the measurement exists at all — or that it
 *  is merely waiting for the next publication — was to read the code. A section that
 *  hides itself cannot tell you why. */
const GenerationBlock = ({ apiKey }: { apiKey: string }) => {
  const { data } = useRoute<Generations>("/console/generations.json", apiKey)
  if (!data) return null
  if (!data.flows.length) {
    return (
      <Block
        title="Generation cost"
        help="What a flow costs to produce — the time a generation took, how much of it was spent inside the model, the round trips and the volume, per flow and per screen."
      >
        <Text c="muted" size="sm">
          Nothing recorded yet. The measurement is written by the server at publication, so
          the next flow published (or republished) writes the first record — flows published
          before it existed carry none, and none is invented for them. Each flow also shows
          its own detail, in the "Generation" tile of its review rail.
        </Text>
      </Block>
    )
  }
  const o = data.overall
  return (
    <Block
      title="Generation cost"
      help="What a flow cost to produce. Measured on the calls themselves — the wall clock of one generation, and how much of it was spent inside the model. The per-screen figure is ATTRIBUTED: one publication carries several screens, so a run's time is shared out in proportion to what was written. Tokens are an estimate — characters through this server ÷ 4."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Average per screen" value={duration(o.per_screen_s)} />
        <Stat label="Average per flow" value={duration(o.per_flow_s)} />
        <Stat label="Screens generated" value={o.screens} />
        <Stat label="Generations" value={o.runs} />
        <Stat label="Time in the model" value={duration(o.model_s)} />
        <Stat label="Round trips" value={o.calls} />
        <Stat label="Tokens in (est.)" value={`~${compact(o.tokens_in)}`} />
        <Stat label="Tokens out (est.)" value={`~${compact(o.tokens_out)}`} />
      </div>
      <Table size="sm">
        <Table.Content>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Flow</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Screens</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Per screen</Table.HeaderCell>
              <Table.HeaderCell className="text-right">In the model</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Runs</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Tokens</Table.HeaderCell>
              <Table.HeaderCell>Model</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {data.flows.map((f) => (
              <FlowRows key={f.slug} flow={f} />
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
      <Text c="muted" size="sm">
        Click a flow for the per-screen share and the run by run detail. A model is named
        only where the agent declared it — the server cannot see which one wrote a screen.
      </Text>
    </Block>
  )
}

/** `2026-09-09T14:22:31` → `09-09 14:22`. A failure's value is largely "is it still
 *  happening since I pushed the fix", and a bare date cannot answer that. */
const seenAt = (iso?: string, day?: string): string => {
  if (!iso) return day ?? "—"
  const [d, t] = iso.split("T")
  return `${(d ?? "").slice(5)} ${(t ?? "").slice(0, 5)}`.trim() || (day ?? "—")
}

/** WHAT failed, next to how often it did.
 *
 *  The error rate said "3 %" and stopped there: the middleware caught the exception,
 *  re-raised it to the agent and kept a BOOLEAN. A failure was therefore visible and not
 *  diagnosable — the one shape of observability nobody can act on, and the reason none of
 *  this ever reached a report. The server now keeps the exception's type and message,
 *  grouped by tool × message: the same breakage seen forty times is one row.
 *
 *  The order is NOT decided here — `metrics.failures_payload` owns it (most frequent
 *  first, most recent breaking the tie). Re-sorting in the console would put a different
 *  first row in front of the same person.
 *
 *  ⚠️ Two things it deliberately does not claim. It reports what a TOOL CALL raised: a
 *  console route answering 500 is not in here, it is answered to the browser that asked
 *  and the person sees it there. And an empty list under a non-zero error rate is not
 *  "nothing broke" — it is a week whose failures were counted before the messages were
 *  kept, which is what the empty state says instead of drawing a reassuring blank. */
const Failures = ({ data }: { data: Metrics | null }) => {
  const rows = data?.failures ?? []
  const rate = data?.errorRate ?? 0
  const hidden = data?.surface?.hidden

  return (
    <Block
      title={`What failed${data?.failuresDistinct ? ` · ${data.failuresDistinct} distinct` : ""}`}
      help="What a failed call actually said — its exception, the argument it was called with, and when it last happened. One row per breakage, not per occurrence."
    >
      {rows.length ? (
        <Table size="sm">
          <Table.Content>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Tool</Table.HeaderCell>
                <Table.HeaderCell>What it said</Table.HeaderCell>
                <Table.HeaderCell>Called with</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Times</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Last</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((f) => (
                <Table.Row key={f.key}>
                  <Table.Cell className="whitespace-nowrap font-mono">{f.tool}</Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-xs [overflow-wrap:anywhere]">{f.what}</span>
                  </Table.Cell>
                  <Table.Cell className="font-mono text-xs">
                    {f.arg || "—"}
                    {f.client ? (
                      <span className="ms-1.5 text-gray-dark-400">{f.client}</span>
                    ) : null}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Badge variant="light" color={f.count > 5 ? "red" : "orange"}>
                      {f.count}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-right font-mono text-xs">
                    {seenAt(f.lastAt, f.last)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      ) : (
        <Text c="muted" size="sm">
          {hidden
            ? `The messages are hidden: ${hidden} on the server. The error rate above stays right — a failure message names internal paths and variables, which do not go on a public URL.`
            : rate > 0
              ? "Calls failed this period, and what they said was not kept: the messages are recorded since 2026-09-09, the counter is older. The next failure is named here."
              : "No failure this period — every call that was made came back."}
        </Text>
      )}
    </Block>
  )
}

export const ObservabilityView = ({ apiKey }: { apiKey: string }) => {
  const { data, error, loading, noKey } = useRoute<Metrics>("/metrics.json", apiKey)

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      <div className="flex flex-col gap-8">
        <GenerationBlock apiKey={apiKey} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Calls" value={data?.totalCalls ?? 0} />
          <Stat label="Active tools" value={data?.activeTools ?? 0} />
          <Stat label="Clients" value={data?.clients ?? 0} />
          <Stat label="Error rate" value={`${data?.errorRate ?? 0} %`} />
          <Stat label="Average latency" value={`${data?.latencyMs ?? 0} ms`} />
          <Stat label="Tokens served" value={(data?.tokensServed ?? 0).toLocaleString("en-US")} />
          <Stat label="Payloads reused" value={data?.creditsSaved ?? 0} />
          <Stat label="Average thinking" value={`${data?.thinkMs ?? 0} ms`} />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Series title="Calls" values={data?.series?.calls} />
          <Series title="Sessions" values={data?.series?.sessions} />
          <Series title="Errors" values={data?.series?.errors} status />
        </div>

        <Failures data={data} />

        <Heatmap grid={data?.heatmap} />

        <div className="grid gap-8 lg:grid-cols-2">
          <Block title="Most called tools">
            <Ranking rows={data?.topTools} empty="No calls." />
          </Block>

          <Block
            title={`Searched and not found${data?.gapsTotal ? ` · ${data.gapsTotal}` : ""}`}
            help="What the model asked for and the DS does not have. Every row is a gap, or a name that does not match."
          >
            <Ranking
              rows={data?.gaps}
              empty="No gaps — everything that was searched for exists."
            />
          </Block>

          <Block
            title="Context weight per tool"
            help="Average characters returned per call: what each tool costs in context."
          >
            <Ranking rows={data?.payloadTop} unit="chars" empty="Nothing measured." />
          </Block>

          <Block
            title="Frequent chains"
            help="The pairs of tools that follow one another — the real shape of an agent's path."
          >
            <Ranking rows={data?.sequences} empty="No recurring chain yet." />
          </Block>
        </div>

        {data?.aliases?.length ? (
          <Block
            title="Names that are probably equivalent"
            help="A term searched for without success, close to a component that exists: that is an alias to document, not a component to create."
          >
            <Table size="sm">
              <Table.Content>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>Searched</Table.HeaderCell>
                    <Table.HeaderCell>Exists as</Table.HeaderCell>
                    <Table.HeaderCell>Times</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {data.aliases.map((a) => (
                    <Table.Row key={`${a.searched}-${a.suggested}`}>
                      <Table.Cell className="font-mono">{a.searched}</Table.Cell>
                      <Table.Cell className="font-mono">{a.suggested}</Table.Cell>
                      <Table.Cell>{a.count}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table>
          </Block>
        ) : null}

        {data?.requested?.length ? (
          <Block title="What was requested" help="The values passed to the search tools.">
            <div className="grid gap-5 sm:grid-cols-2">
              {data.requested.map((g) => (
                <div key={g.group} className="flex flex-col gap-1.5">
                  <Text c="secondary" size="sm">
                    <span className="font-mono">{g.group}</span>
                  </Text>
                  <Ranking rows={g.items} empty="—" />
                </div>
              ))}
            </div>
          </Block>
        ) : null}

        {data?.recent?.length ? (
          <Block title="Latest calls">
            <Table size="sm">
              <Table.Content>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                    <Table.HeaderCell>Tool</Table.HeaderCell>
                    <Table.HeaderCell>Latency</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {data.recent.slice(0, 20).map((r, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: a log with no identifier
                    <Table.Row key={i}>
                      <Table.Cell className="font-mono">{r.t}</Table.Cell>
                      <Table.Cell className="font-mono">{r.n}</Table.Cell>
                      <Table.Cell>{r.lat} ms</Table.Cell>
                      <Table.Cell>
                        {r.ok ? (
                          <Text size="sm">ok</Text>
                        ) : (
                          <Badge color="red" variant="light">
                            error
                          </Badge>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table>
          </Block>
        ) : null}

        <Text c="muted" size="sm">
          Period {data?.meta?.period ?? "—"} · recorded {data?.meta?.updated ?? "—"} · clients:{" "}
          {(data?.clientsList ?? []).join(", ") || "—"}
        </Text>
      </div>
    </State>
  )
}
