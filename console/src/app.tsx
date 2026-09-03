import { Input } from "@42/ui-react/input"
import { Tabs } from "@42/ui-react/tabs"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { ecrireCle, lire, lireCle, type Resume } from "./mcp"
import { VueAcces } from "./vues/acces"
import { VueContexte } from "./vues/contexte"
import { VueObservabilite } from "./vues/observabilite"
import { VueProtos } from "./vues/protos"
import { VueQualite } from "./vues/qualite"
import { VueSessions } from "./vues/sessions"

const Compteur = ({ n, label }: { n?: number; label: string }) => (
  <div className="flex items-baseline gap-1.5">
    <span className="font-mono text-white text-sm">{n ?? "—"}</span>
    <Text c="muted" size="sm">
      {label}
    </Text>
  </div>
)

export const App = () => {
  // La clé vit ici, pas dans chaque onglet : une seule saisie, et la changer relance
  // tous les chargements (elle est en dépendance de `useRoute`).
  const [cle, setCle] = useState(lireCle())
  const [resume, setResume] = useState<Resume | null>(null)

  useEffect(() => {
    lire<Resume>("/console/resume.json")
      .then(setResume)
      .catch(() => setResume(null)) // sans clé valide, l'en-tête reste muet — les onglets le disent
  }, [cle])

  const onglets = [
    { v: "protos", label: "Prototypes", vue: <VueProtos /> },
    { v: "contexte", label: "Contexte", vue: <VueContexte cle={cle} /> },
    { v: "observabilite", label: "Observabilité", vue: <VueObservabilite cle={cle} /> },
    { v: "sessions", label: "Sessions", vue: <VueSessions cle={cle} /> },
    { v: "qualite", label: "Qualité", vue: <VueQualite cle={cle} /> },
    { v: "acces", label: "Accès", vue: <VueAcces cle={cle} /> },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Title order={1} size="3xl">
              Console 42
            </Title>
            <Text c="secondary">
              Les prototypes du produit, le contexte servi aux agents, l'usage du serveur, et
              qui a le droit d'écrire.
            </Text>
          </div>
          <div className="w-full max-w-64">
            <Text c="muted" size="sm">
              Clé de lecture
            </Text>
            <Input
              type="password"
              value={cle}
              placeholder="colle la clé ici"
              onChange={(e) => {
                const v = e.currentTarget.value
                setCle(v)
                ecrireCle(v)
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 border-white/10 border-t pt-4">
          <Compteur n={resume?.composants} label="composants" />
          <Compteur n={resume?.foundations} label="foundations" />
          <Compteur n={resume?.skills} label="skills" />
          <Compteur n={resume?.produit} label="docs produit" />
          <Compteur n={resume?.reports} label="reports en attente" />
        </div>
      </header>

      <Tabs.Root defaultValue="protos">
        <Tabs.List>
          {onglets.map((o) => (
            <Tabs.Trigger key={o.v} value={o.v}>
              {o.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {onglets.map((o) => (
          <Tabs.Content key={o.v} value={o.v} className="pt-6">
            {o.vue}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  )
}
