import { Alert } from "@42/ui-react/alert"
import { Card } from "@42/ui-react/card"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { type ReactNode, useEffect, useState } from "react"
import { AccessError, get } from "./mcp"
import { TYPO } from "../../src/typo"

/** One loading state, one error, one render — the same machinery in the five tabs that read
 *  the server. Without it, every view would reinvent its own state and display its errors
 *  differently. `key` as a dependency: changing the key restarts every load. */
export function useRoute<T>(route: string, key: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true
    // With no key we don't even call: a 401 caused by an empty field used to display
    // "Key rejected", which blames the key when none was ever sent.
    if (!key) {
      setData(null)
      setError("")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    get<T>(route)
      .then((d) => alive && setData(d))
      .catch((e: Error) => {
        if (!alive) return
        setError(
          e instanceof AccessError
            ? "Key rejected. It is DASHBOARD_KEY, in the MCP service variables."
            : e.message,
        )
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [route, key])

  return { data, error, loading, noKey: !key }
}

export const NoKey = () => (
  <Alert
    type="info"
    variant="outline"
    title="This section reads the MCP server: it needs the read key."
    description="It is the DASHBOARD_KEY variable of the MCP service. It stays in your browser."
  />
)

export const State = ({
  loading,
  error,
  data,
  children,
  empty,
  noKey,
}: {
  loading: boolean
  error: string
  data: unknown
  children: ReactNode
  empty?: string
  noKey?: boolean
}) => {
  if (noKey) return <NoKey />
  if (error) return <Alert color="red" variant="light" title="Cannot read" description={error} />
  if (loading && !data)
    return (
      <div className="flex items-center gap-2 py-8">
        <Spinner size="sm" />
        <Text c="secondary">Loading…</Text>
      </div>
    )
  if (!data) return <Text c="secondary">{empty ?? "Nothing to show."}</Text>
  return <>{children}</>
}

/** A counter. The VALUE is in Kode Mono — this is the machine talking (DS typography rule:
 *  counters, scores and levels are mono; text stays in Lato). */
export const Stat = ({ label, value }: { label: string; value: ReactNode }) => (
  <Card variant="outline" padding="sm">
    <Text c="muted" size="sm">
      {label}
    </Text>
    <div className={`${TYPO.mono()} text-2xl text-white`}>{value}</div>
  </Card>
)
