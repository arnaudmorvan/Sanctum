import { Badge } from "@42/ui-react/badge"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import type { ReactNode } from "react"
import type { Metrics, Pair } from "../mcp"
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

export const ObservabilityView = ({ apiKey }: { apiKey: string }) => {
  const { data, error, loading, noKey } = useRoute<Metrics>("/metrics.json", apiKey)

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      <div className="flex flex-col gap-8">
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
