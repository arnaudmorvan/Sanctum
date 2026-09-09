import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Send } from "lucide-react"
import type { Connector, Metrics } from "../mcp"
import { notify } from "../notifier"
import { State, Stat, useRoute } from "../state"

/** Who calls this server, from which client, with which TOOL LIST.
 *
 *  A host freezes the tool list when the connector is added. After a server update, a
 *  connector nobody refreshed keeps calling the old one — silently: the person sees a tool
 *  that does not exist, or does not see one that does, and blames the server. The only
 *  thing the server knows about that cached list is the number each connector echoes back
 *  through `start(version=…)`, which is what this tab is built on.
 *
 *  It reads the SAME `/metrics.json` the Observability tab reads, over 30 days rather than
 *  7 — a connector that has not been opened this week is exactly the one to chase. The
 *  server sorts the rows (blocked, then stale, then unknown, then up to date; most recent
 *  first): re-sorting here would be a second owner of the priority.
 *
 *  What was NOT ported from the HTML dashboard it replaces: the count on the sidebar entry.
 *  There it was free — that page fetched the metrics once for every tab. Here it would mean
 *  a metrics read (a chain of GitHub calls) on EVERY console load, signed in on any tab, for
 *  a number the tab's own header already carries. */

const LABEL: Record<Connector["state"], string> = {
  blocked: "blocked",
  stale: "stale",
  unknown: "unknown",
  current: "up to date",
}

const COLOR: Record<Connector["state"], string> = {
  blocked: "red",
  stale: "orange",
  unknown: "gray",
  current: "green",
}

/** The note to send to ONE person. The refresh instructions are NOT written here: they
 *  come from the payload (`surface.REFRESH_HOWTO` on the server), which the panel and the
 *  Gate's refusal message also read. The HTML dashboard this tab replaces had retyped
 *  them, and the two copies had already drifted. */
const note = (p: Connector, s: NonNullable<Metrics["surface"]>): string => {
  const first = (p.name || p.id).split(" ")[0]
  const ver = p.version ? `v${p.version}` : "an old version"
  const blocked = p.state === "blocked"
  return [
    `Hi ${first},`,
    "",
    `Your 42 Design connector on ${p.client} still carries ${ver} of the tool list; the ` +
      `server now serves v${s.served ?? "?"}` +
      (blocked
        ? ` and no longer accepts anything below v${s.minimum ?? "?"} — your conversations ` +
          "there are refused until it is refreshed."
        : ". Tools exist there that you cannot see yet."),
    "",
    `To refresh: ${s.refreshHowto ?? "re-add the connector, then open a new conversation."}`,
    "",
    "Your token does not change. Thanks!",
  ].join("\n")
}

const copy = async (text: string, who: string) => {
  try {
    await navigator.clipboard.writeText(text)
    notify.success({ title: `Note for ${who} copied`, duration: 2500 })
  } catch {
    notify.error({ title: "Cannot copy", description: "Select the text and copy it by hand." })
  }
}

const Version = ({ p }: { p: Connector }) => (
  <span className="font-mono">
    {p.version === null ? "—" : p.version === 0 ? "not sent" : `v${p.version}`}
    {p.versionAt ? (
      <span className="ms-1.5 text-gray-dark-400 text-xs" title="last echoed">
        {p.versionAt.slice(0, 10)}
      </span>
    ) : null}
  </span>
)

export const ConnectorsView = ({ apiKey }: { apiKey: string }) => {
  // 30 days, not the default week: the connector to chase is the one nobody opened
  // recently, and a 7-day window is exactly where it disappears.
  const { data, error, loading, noKey } = useRoute<Metrics>("/metrics.json?range=month", apiKey)

  const s = data?.surface ?? {}
  const people = data?.people ?? []
  const toUpdate = people.filter((p) => p.state === "blocked" || p.state === "stale").length

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      <div className="flex flex-col gap-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Served version" value={s.served != null ? `v${s.served}` : "—"} />
          <Stat label="Minimum accepted" value={s.minimum != null ? `v${s.minimum}` : "—"} />
          <Stat label="To contact" value={toUpdate} />
          <Stat label="Up to date" value={people.filter((p) => p.state === "current").length} />
        </div>

        {s.hidden ? (
          <Alert
            color="orange"
            variant="light"
            title="The people are hidden"
            description={`${s.hidden} on the server: without it /metrics.json is public, and names and e-mails do not go on a public URL. The counts above stay right; the rows below need the key to be set on the MCP service.`}
          />
        ) : null}

        <Card variant="outline" padding="lg">
          <Card.Header>
            <Card.Title>People × client × version</Card.Title>
            <Badge variant="light" color={toUpdate ? "red" : "green"}>
              {toUpdate ? `${toUpdate} to contact` : "everyone up to date"}
            </Badge>
          </Card.Header>
          <Card.Description>
            A host freezes the tool list when the connector is added: after a server update, a
            connector that was not refreshed still calls the old list. The version is the number
            each connector echoes through start(version=…) — below the minimum the server
            refuses the conversation, below the served version it accepts it with tools missing
            on their side. Sorted: blocked, then stale, then unknown, then up to date.
          </Card.Description>
          <Card.Content>
            {people.length ? (
              <Table size="sm">
                <Table.Content>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>Person</Table.HeaderCell>
                      <Table.HeaderCell>Client</Table.HeaderCell>
                      <Table.HeaderCell>State</Table.HeaderCell>
                      <Table.HeaderCell>Tool list</Table.HeaderCell>
                      <Table.HeaderCell className="text-end">Calls</Table.HeaderCell>
                      <Table.HeaderCell className="text-end">Sessions</Table.HeaderCell>
                      <Table.HeaderCell>Last seen</Table.HeaderCell>
                      <Table.HeaderCell> </Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {people.map((p) => (
                      <Table.Row key={`${p.id}-${p.client}`}>
                        <Table.Cell>
                          <div className="flex flex-col">
                            <span className="font-medium">{p.name || p.id}</span>
                            {p.email ? (
                              <a
                                className="text-gray-dark-400 text-xs underline decoration-dotted"
                                href={`mailto:${p.email}`}
                              >
                                {p.email}
                              </a>
                            ) : null}
                          </div>
                        </Table.Cell>
                        <Table.Cell>{p.client}</Table.Cell>
                        <Table.Cell>
                          <Badge variant="light" color={COLOR[p.state]}>
                            {LABEL[p.state]}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Version p={p} />
                        </Table.Cell>
                        <Table.Cell className="text-end font-mono">{p.calls}</Table.Cell>
                        <Table.Cell className="text-end font-mono">{p.sessions}</Table.Cell>
                        <Table.Cell className="font-mono text-xs">{p.last || "—"}</Table.Cell>
                        <Table.Cell>
                          {p.state === "blocked" || p.state === "stale" ? (
                            <Button
                              size="xs"
                              variant="subtle"
                              startSlot={<Send size={13} />}
                              onClick={() => copy(note(p, s), p.name || p.id)}
                            >
                              Copy note
                            </Button>
                          ) : null}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            ) : (
              <Text c="muted">
                {s.hidden
                  ? "Set DASHBOARD_KEY on the MCP service to see who is connected."
                  : "No connector recorded over the last 30 days."}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Text c="muted" size="sm">
          Period {data?.meta?.period ?? "—"} · recorded {data?.meta?.updated ?? "—"}
        </Text>
      </div>
    </State>
  )
}
