import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import type { Quality } from "../mcp"
import { State, useRoute } from "../state"

const cell = (v: unknown): string => {
  if (v === null || v === undefined) return "—"
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

/** The curve's points are written by submit_report(gate=…) and by markers (consolidation, DS
 *  export): their keys differ from one point to the next. So we render the columns we
 *  actually meet rather than a fixed schema, which would hide half the points.
 *
 *  ⚠️ The values are historical DATA and are rendered as they come — including the old skill
 *  names (`figma-build-maquette`…) and the `hors-skill` workflow label of the points recorded
 *  before the English migration. Rewriting them here would falsify the history. */
export const QualityView = ({ apiKey }: { apiKey: string }) => {
  const { data, error, loading, noKey } = useRoute<Quality>("/quality.json", apiKey)
  const points = data?.points ?? []
  const columns = Array.from(
    points.reduce((acc, p) => {
      for (const k of Object.keys(p)) acc.add(k)
      return acc
    }, new Set<string>()),
  ).slice(0, 8)

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      {points.length === 0 ? (
        <Text c="secondary">
          No quality point yet. The curve fills up when a generation submits its measured gate
          through submit_report — writing is currently closed on the server.
        </Text>
      ) : (
        <Table size="sm">
          <Table.Content>
            <Table.Head>
              <Table.Row>
                {columns.map((c) => (
                  <Table.HeaderCell key={c}>{c}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {points.map((p, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: the points have no stable id
                <Table.Row key={i}>
                  {columns.map((c) => (
                    <Table.Cell key={c} className="font-mono">
                      {cell(p[c])}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      )}
    </State>
  )
}
