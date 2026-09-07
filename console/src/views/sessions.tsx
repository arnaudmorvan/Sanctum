import { Badge } from "@42/ui-react/badge"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import type { Session } from "../mcp"
import { State, useRoute } from "../state"

/** Friction aggregates errors, unsuccessful searches, loops and repeats: it is the only
 *  number that says whether the agent struggled, independently of the number of calls. */
const frictionColor = (f: number) => (f >= 8 ? "red" : f >= 3 ? "orange" : "green")

export const SessionsView = ({ apiKey }: { apiKey: string }) => {
  const { data, error, loading, noKey } = useRoute<{ sessions: Session[] }>(
    "/sessions.json",
    apiKey,
  )
  const sessions = data?.sessions ?? []

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      {sessions.length === 0 ? (
        <Text c="secondary">
          No session tracked yet. Tracking lives in the server's memory: a redeployment resets
          it to zero.
        </Text>
      ) : (
        <Table size="sm">
          <Table.Content>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Client</Table.HeaderCell>
                <Table.HeaderCell>Calls</Table.HeaderCell>
                <Table.HeaderCell>Errors</Table.HeaderCell>
                <Table.HeaderCell>Loops</Table.HeaderCell>
                <Table.HeaderCell>Repeats</Table.HeaderCell>
                <Table.HeaderCell>Duration</Table.HeaderCell>
                <Table.HeaderCell>Friction</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {sessions.map((s) => (
                <Table.Row key={s.id}>
                  <Table.Cell className="font-mono">{s.client}</Table.Cell>
                  <Table.Cell>{s.calls}</Table.Cell>
                  <Table.Cell>{s.errors}</Table.Cell>
                  <Table.Cell>{s.loops}</Table.Cell>
                  <Table.Cell>{s.repeats}</Table.Cell>
                  <Table.Cell>{s.durationS}s</Table.Cell>
                  <Table.Cell>
                    <Badge color={frictionColor(s.friction)} variant="light">
                      {s.friction}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      )}
    </State>
  )
}
