import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Chiffre, Etat, useRoute } from "../etat"
import type { Metriques, Paire } from "../mcp"

const Classement = ({ titre, lignes, vide }: { titre: string; lignes?: Paire[]; vide: string }) => (
  <div className="flex flex-col gap-2">
    <Title order={2} size="sm">
      {titre}
    </Title>
    {lignes?.length ? (
      <Table size="sm">
        <Table.Content>
          <Table.Body>
            {lignes.map((l) => (
              <Table.Row key={l.n}>
                <Table.Cell className="font-mono">{l.n}</Table.Cell>
                <Table.Cell className="w-20 text-right">{l.v}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    ) : (
      <Text c="muted" size="sm">
        {vide}
      </Text>
    )}
  </div>
)

export const VueObservabilite = ({ cle }: { cle: string }) => {
  const { data, erreur, charge, sansCle } = useRoute<Metriques>("/metrics.json", cle)

  return (
    <Etat
      charge={charge}
      erreur={erreur}
      data={data}
      sansCle={sansCle}
      enfants={
        <div className="flex flex-col gap-6">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Chiffre label="Appels" valeur={data?.totalCalls ?? 0} />
            <Chiffre label="Outils actifs" valeur={data?.activeTools ?? 0} />
            <Chiffre label="Clients" valeur={data?.clients ?? 0} />
            <Chiffre label="Taux d'erreur" valeur={`${data?.errorRate ?? 0} %`} />
            <Chiffre label="Latence" valeur={`${data?.latencyMs ?? 0} ms`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Classement titre="Outils les plus appelés" lignes={data?.topTools} vide="Aucun appel." />
            <Classement
              titre={`Cherché et pas trouvé${data?.gapsTotal ? ` (${data.gapsTotal})` : ""}`}
              lignes={data?.gaps}
              vide="Aucun manque relevé — tout ce qui a été cherché existe."
            />
          </div>

          <Text c="muted" size="sm">
            Période {data?.meta?.period ?? "—"} · relevé {data?.meta?.updated ?? "—"} ·{" "}
            {data?.tokensServed ?? 0} tokens servis
          </Text>
        </div>
      }
    />
  )
}
