import { Tabs } from "@42/ui-react/tabs"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { VueAcces } from "./vues/acces"
import { VueObservabilite } from "./vues/observabilite"
import { VueProtos } from "./vues/protos"

const ONGLETS = [
  { valeur: "protos", label: "Prototypes", vue: <VueProtos /> },
  { valeur: "observabilite", label: "Observabilité", vue: <VueObservabilite /> },
  { valeur: "acces", label: "Accès", vue: <VueAcces /> },
]

export const App = () => (
  <div className="mx-auto w-full max-w-6xl px-6 py-10">
    <header className="mb-8 flex flex-col gap-1">
      <Title order={1} size="3xl">
        Console 42
      </Title>
      <Text c="secondary">
        Les prototypes du produit, l'usage du serveur MCP, et qui a le droit d'écrire.
      </Text>
    </header>

    <Tabs.Root defaultValue="protos">
      <Tabs.List>
        {ONGLETS.map((o) => (
          <Tabs.Trigger key={o.valeur} value={o.valeur}>
            {o.label}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      {ONGLETS.map((o) => (
        <Tabs.Content key={o.valeur} value={o.valeur} className="pt-6">
          {o.vue}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  </div>
)
