import { Badge } from "@42/ui-react/badge"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { useState } from "react"
import type { Session } from "../mcp"
import { State, useRoute } from "../state"

/** Friction aggregates errors, unsuccessful searches, loops and repeats: it is the only
 *  number that says whether the agent struggled, independently of the number of calls. */
const frictionColor = (f: number) => (f >= 8 ? "red" : f >= 3 ? "orange" : "green")

/** A session that counted errors, opened on WHAT they were.
 *
 *  The count alone sends you nowhere: two errors in one session is a tool broken for that
 *  person, or one wrong argument retried once, and those are opposite verdicts. The
 *  events carry the exception since 2026-09-09 (`err`), so the row that says "2" can be
 *  asked which two — with the argument that produced them, which is the reproduction.
 *
 *  A session whose failures predate that has a count and no text: it says so rather than
 *  opening onto nothing. */
const Failed = ({ session }: { session: Session }) => {
  const failed = (session.events ?? []).filter((e) => e.ok === false)
  return (
    <div className="flex flex-col gap-1.5 py-2">
      {failed.length ? (
        failed.map((e, i) => (
          <div key={`${e.t}-${i}`} className="flex items-baseline gap-3">
            <span className="shrink-0 font-mono text-gray-dark-400 text-xs">{e.t}</span>
            <span className="shrink-0 font-mono text-xs">
              {e.tool}
              {e.arg ? ` · ${e.arg}` : ""}
            </span>
            <span className="font-mono text-xs [overflow-wrap:anywhere]">
              {e.err || "no message kept"}
            </span>
          </div>
        ))
      ) : (
        <Text c="muted" size="sm">
          The failed calls of this session are no longer in the timeline — it holds the
          last 80 calls, and the server's memory is wiped by a redeployment.
        </Text>
      )}
    </div>
  )
}

const SessionRow = ({ session: s }: { session: Session }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Table.Row>
        <Table.Cell className="font-mono">{s.client}</Table.Cell>
        <Table.Cell>{s.calls}</Table.Cell>
        <Table.Cell>
          {s.errors ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-start hover:underline"
            >
              {s.errors}
            </button>
          ) : (
            s.errors
          )}
        </Table.Cell>
        <Table.Cell>{s.loops}</Table.Cell>
        <Table.Cell>{s.repeats}</Table.Cell>
        <Table.Cell>{s.durationS}s</Table.Cell>
        <Table.Cell>
          <Badge color={frictionColor(s.friction)} variant="light">
            {s.friction}
          </Badge>
        </Table.Cell>
      </Table.Row>
      {open ? (
        <Table.Row>
          <Table.Cell colSpan={7}>
            <Failed session={s} />
          </Table.Cell>
        </Table.Row>
      ) : null}
    </>
  )
}

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
                <SessionRow key={s.id} session={s} />
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      )}
    </State>
  )
}
