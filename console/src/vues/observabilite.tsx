import { Alert } from "@42/ui-react/alert"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Input } from "@42/ui-react/input"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { useEffect, useState } from "react"
import { ecrireCle, ErreurAcces, lire, lireCle } from "../mcp"

type Metriques = {
  totals?: { calls?: number; errors?: number; sessions?: number }
  tools?: Record<string, { calls?: number; errors?: number; p50?: number }>
  generated_at?: string
}

const Chiffre = ({ label, valeur }: { label: string; valeur: string | number }) => (
  <Card variant="outline" padding="md">
    <Text c="muted" size="sm">
      {label}
    </Text>
    <Text className="font-mono text-2xl">{valeur}</Text>
  </Card>
)

export const VueObservabilite = () => {
  const [cle, setCle] = useState(lireCle())
  const [data, setData] = useState<Metriques | null>(null)
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)

  const charger = () => {
    setChargement(true)
    setErreur("")
    lire<Metriques>("/metrics.json")
      .then(setData)
      .catch((e: Error) =>
        setErreur(
          e instanceof ErreurAcces
            ? "Clé refusée. C'est DASHBOARD_KEY, côté variables du service mcp-42."
            : e.message,
        ),
      )
      .finally(() => setChargement(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (cle) charger()
  }, [])

  const tools = Object.entries(data?.tools ?? {}).sort(
    (a, b) => (b[1].calls ?? 0) - (a[1].calls ?? 0),
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-2">
        <div className="w-full max-w-sm">
          <Text c="muted" size="sm">
            Clé du dashboard
          </Text>
          <Input
            type="password"
            value={cle}
            placeholder="DASHBOARD_KEY"
            onChange={(e) => {
              setCle(e.currentTarget.value)
              ecrireCle(e.currentTarget.value)
            }}
          />
        </div>
        <Button variant="filled" onClick={charger} loading={chargement}>
          Charger
        </Button>
      </div>

      {erreur ? <Alert color="red" variant="light" title="Lecture impossible" description={erreur} /> : null}

      {data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Chiffre label="Appels" valeur={data.totals?.calls ?? 0} />
            <Chiffre label="Sessions" valeur={data.totals?.sessions ?? 0} />
            <Chiffre label="Erreurs" valeur={data.totals?.errors ?? 0} />
          </div>

          <Table size="sm">
            <Table.Content>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Outil</Table.HeaderCell>
                  <Table.HeaderCell>Appels</Table.HeaderCell>
                  <Table.HeaderCell>Erreurs</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {tools.map(([nom, t]) => (
                  <Table.Row key={nom}>
                    <Table.Cell className="font-mono">{nom}</Table.Cell>
                    <Table.Cell>{t.calls ?? 0}</Table.Cell>
                    <Table.Cell>{t.errors ?? 0}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        </>
      ) : null}
    </div>
  )
}
