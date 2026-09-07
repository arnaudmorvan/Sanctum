import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { type Access, MCP_URL } from "../mcp"
import { State, useRoute } from "../state"

/** The role names come from the server. An unknown role is not an error: it falls back to
 *  gray rather than making the row disappear. */
const COLOR: Record<string, string> = {
  reader: "gray",
  po: "blue",
  designer: "violet",
  admin: "green",
}

export const AccessView = ({ apiKey }: { apiKey: string }) => {
  const { data, error, loading, noKey } = useRoute<Access>("/console/access.json", apiKey)

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      <div className="flex flex-col gap-5">
        {data?.read_only ? (
          <Alert
            color="orange"
            variant="light"
            title="Writing is closed on the server"
            description={`READ_ONLY is active on ${MCP_URL}: the write tools are not served. That was deliberate — the endpoint was reachable without any authentication.`}
          />
        ) : null}

        <Card variant="outline" padding="lg">
          <Card.Header>
            <Card.Title>Who has access</Card.Title>
            <Badge variant="light">{data?.regime ?? "—"}</Badge>
          </Card.Header>
          <Card.Description>
            The registry lives in access/users.json, under version control: an access right
            changes rarely and deserves a history. It holds no secret — the tokens are derived
            from ACCESS_SECRET, which only lives in the server's environment.
          </Card.Description>
          <Card.Content>
            {data?.error ? (
              <Text c="muted">{data.error}</Text>
            ) : (
              <Table size="sm">
                <Table.Content>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>Identifier</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Role</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {(data?.users ?? []).map((u) => (
                      <Table.Row key={u.id}>
                        <Table.Cell className="font-mono">{u.id}</Table.Cell>
                        <Table.Cell>{u.name ?? "—"}</Table.Cell>
                        <Table.Cell>
                          <Badge variant="light" color={COLOR[u.role ?? ""] ?? "gray"}>
                            {u.role ?? "—"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {u.active ? (
                            <Text size="sm">active</Text>
                          ) : (
                            <Text c="muted" size="sm">
                              revoked
                            </Text>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            )}
          </Card.Content>
        </Card>

        <Card variant="outline" padding="lg">
          <Card.Title>The roles</Card.Title>
          <Card.Description>
            An order, not a set: each role can do everything the previous one can.
          </Card.Description>
          <Card.Content>
            <div className="flex flex-col gap-2">
              {Object.entries(data?.roles ?? {}).map(([name, what]) => (
                <div key={name} className="flex items-baseline gap-3">
                  <Badge variant="light" color={COLOR[name] ?? "gray"}>
                    {name}
                  </Badge>
                  <Text c="secondary" size="sm">
                    {what}
                  </Text>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        <Text c="muted" size="sm">
          Editing access rights from here is coming: these routes are read-only. For now an
          access right is opened by a commit in access/users.json, and the token is generated
          with tools/access-token.py.
        </Text>
      </div>
    </State>
  )
}
