/** Observability: the generations first (what each kind takes, who made what, what
 *  broke — `generations.tsx`), then the MCP server's own counters, folded under them.
 *
 *  The server half is what this tab used to open on: calls, latency, context served, the
 *  chains of tools, the heatmap. It is the plumbing under the generations — read when
 *  something is slow or missing, not every morning — so it sits at the bottom with its
 *  headline numbers always visible and the rest behind one click. */
import { Badge } from "@42/ui-react/badge"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { type ReactNode, useState } from "react"
import type { Metrics, Pair } from "../mcp"
import { State, Stat, useRoute } from "../state"
import { GenerationsDashboard } from "./generations"
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

/** The server's own counters — always the headline numbers, the rest on demand. */
const ServerSection = ({ data }: { data: Metrics | null }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-4 border-white/10 border-t pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Title order={2} size="sm">
          MCP server
        </Title>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-(--c-muted) text-sm underline hover:text-white"
        >
          {open ? "Hide the detail" : "Show the detail"}
        </button>
      </div>
      <Text c="muted" size="sm">
        The plumbing under the generations: every tool call the server answered, whichever
        conversation made it. Period {data?.meta?.period ?? "—"} · recorded{" "}
        {data?.meta?.updated ?? "—"} · clients: {(data?.clientsList ?? []).join(", ") || "—"}
      </Text>
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

      {open ? (
        <>
        <div className="grid gap-3 sm:grid-cols-3">
          <Series title="Calls" values={data?.series?.calls} />
          <Series title="Sessions" values={data?.series?.sessions} />
          <Series title="Errors" values={data?.series?.errors} status />
        </div>

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

        </>
      ) : null}
    </div>
  )
}

export const ObservabilityView = ({ apiKey }: { apiKey: string }) => {
  const { data, error, loading, noKey } = useRoute<Metrics>("/metrics.json", apiKey)

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      <div className="flex flex-col gap-10">
        <GenerationsDashboard apiKey={apiKey} failures={<Failures data={data} />} />
        <ServerSection data={data} />
      </div>
    </State>
  )
}
