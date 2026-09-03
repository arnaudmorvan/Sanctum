import { Button } from "@42/ui-react/button"
import { Tabs } from "@42/ui-react/tabs"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { Connexion } from "./connexion"
import { ecrireCle, ErreurAcces, lireCle, type Resume, verifierCle } from "./mcp"
import { VueAcces } from "./vues/acces"
import { VueContexte } from "./vues/contexte"
import { VueObservabilite } from "./vues/observabilite"
import { VueProtos } from "./vues/protos"
import { VueQualite } from "./vues/qualite"
import { VueSessions } from "./vues/sessions"

type Statut = "verification" | "dehors" | "dedans"

/** Un compteur est un RACCOURCI, pas une décoration : cliquer ouvre l'onglet Contexte sur
 *  le dossier correspondant. Afficher « 56 composants » sans pouvoir les regarder était la
 *  moitié d'une fonctionnalité. */
const Compteur = ({
  n,
  label,
  onClick,
}: {
  n?: number
  label: string
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-baseline gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-white/8"
  >
    <span className="font-mono text-sm text-white">{n ?? "—"}</span>
    <Text c="muted" size="sm">
      {label}
    </Text>
  </button>
)

export const App = () => {
  const [cle, setCle] = useState(lireCle())
  // On part de `verification` s'il y a une clé en mémoire : elle a pu être révoquée depuis.
  // Afficher la console puis la voir échouer onglet par onglet serait pire que d'attendre.
  const [statut, setStatut] = useState<Statut>(lireCle() ? "verification" : "dehors")
  const [resume, setResume] = useState<Resume | null>(null)
  const [erreur, setErreur] = useState("")
  const [onglet, setOnglet] = useState("protos")
  const [corpus, setCorpus] = useState("composants")

  const ouvrirCorpus = (c: string) => {
    setCorpus(c)
    setOnglet("contexte")
  }

  const entrer = (candidate: string) => {
    setErreur("")
    setStatut("verification")
    verifierCle(candidate)
      .then((r) => {
        ecrireCle(candidate)
        setCle(candidate)
        setResume(r)
        setStatut("dedans")
      })
      .catch((e: Error) => {
        setErreur(
          e instanceof ErreurAcces
            ? "Cette clé n'est pas celle du serveur. C'est la variable DASHBOARD_KEY, pas son nom."
            : e.message,
        )
        setStatut("dehors")
      })
  }

  // Vérification au chargement quand une clé est déjà mémorisée.
  useEffect(() => {
    if (statut === "verification" && !resume && cle) entrer(cle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortir = () => {
    ecrireCle("")
    setCle("")
    setResume(null)
    setErreur("")
    setStatut("dehors")
  }

  if (statut !== "dedans")
    return <Connexion onValider={entrer} erreur={erreur} occupe={statut === "verification"} />

  const onglets = [
    { v: "protos", label: "Prototypes", vue: <VueProtos /> },
    { v: "contexte", label: "Contexte", vue: <VueContexte cle={cle} corpusInitial={corpus} /> },
    { v: "observabilite", label: "Observabilité", vue: <VueObservabilite cle={cle} /> },
    { v: "sessions", label: "Sessions", vue: <VueSessions cle={cle} /> },
    { v: "qualite", label: "Qualité", vue: <VueQualite cle={cle} /> },
    { v: "acces", label: "Accès", vue: <VueAcces cle={cle} /> },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Title order={1} size="3xl">
              Console 42
            </Title>
            <Text c="secondary">
              Les prototypes du produit, le contexte servi aux agents, l'usage du serveur, et
              qui a le droit d'écrire.
            </Text>
          </div>
          <Button variant="subtle" size="sm" onClick={sortir}>
            Se déconnecter
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 border-white/10 border-t pt-4">
          <Compteur n={resume?.composants} label="composants" onClick={() => ouvrirCorpus("composants")} />
          <Compteur n={resume?.foundations} label="foundations" onClick={() => ouvrirCorpus("foundations")} />
          <Compteur n={resume?.skills} label="skills" onClick={() => ouvrirCorpus("skills")} />
          <Compteur n={resume?.produit} label="docs produit" onClick={() => ouvrirCorpus("produit")} />
          <Compteur n={resume?.reports} label="reports en attente" onClick={() => ouvrirCorpus("reports")} />
        </div>
      </header>

      <Tabs.Root value={onglet} onValueChange={(d) => setOnglet(d.value)}>
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
