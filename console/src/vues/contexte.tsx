import { Alert } from "@42/ui-react/alert"
import { Card } from "@42/ui-react/card"
import { Input } from "@42/ui-react/input"
import { NavLink } from "@42/ui-react/nav-link"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { SansCle } from "../etat"
import { type Arbre, type Fichier, lire } from "../mcp"

/** Les cinq corpus qu'on veut voir. Ce sont des dossiers du repo, pas des concepts
 *  inventés ici : skills/ (les modes opératoires servis aux agents), foundations/ (les
 *  règles de goût), produit/ (la spec de 42next) et reports/ (la matière pas encore
 *  consolidée). Le CHOIX du corpus vit dans la sidebar (une sous-entrée par corpus, avec son
 *  compte) : cette vue ne le redemande pas — c'était la troisième navigation vers la même
 *  chose, après les compteurs de l'en-tête et les onglets. */
export const CORPUS = [
  { cle: "composants", label: "Composants", dir: "context/components/items", quoi: "Le catalogue exporté de Figma : axes, variantes, slots. Généré, jamais édité à la main." },
  { cle: "foundations", label: "Foundations", dir: "context/foundations", quoi: "Les règles de goût — ce qu'aucun catalogue ne porte." },
  { cle: "skills", label: "Skills", dir: "skills", quoi: "Les modes opératoires servis aux agents." },
  { cle: "produit", label: "Produit", dir: "context/produit", quoi: "La spec de 42next : ce que l'écran raconte." },
  { cle: "reports", label: "Reports", dir: "context/reports", quoi: "La matière déposée, pas encore consolidée." },
] as const

export type CorpusCle = (typeof CORPUS)[number]["cle"]

export const corpusDe = (cle?: string) => CORPUS.find((c) => c.cle === cle) ?? CORPUS[0]

export const VueContexte = ({ cle, corpus: corpusCle }: { cle: string; corpus: CorpusCle }) => {
  const corpus = corpusDe(corpusCle)
  const [filtre, setFiltre] = useState("")
  const [arbre, setArbre] = useState<Arbre | null>(null)
  const [fichier, setFichier] = useState<Fichier | null>(null)
  const [erreur, setErreur] = useState("")
  const [chargeFichier, setChargeFichier] = useState(false)

  useEffect(() => {
    setArbre(null)
    setFichier(null)
    setErreur("")
    setFiltre("")
    if (!cle) return // pas de clé : rien à demander, la vue le dit d'elle-même
    lire<Arbre>(`/console/arbre.json?dir=${encodeURIComponent(corpus.dir)}`)
      .then(setArbre)
      .catch((e: Error) => setErreur(e.message))
  }, [corpus, cle])

  const ouvrir = (nom: string) => {
    setChargeFichier(true)
    setFichier(null)
    lire<Fichier>(`/console/fichier.json?path=${encodeURIComponent(`${corpus.dir}/${nom}`)}`)
      .then(setFichier)
      .catch((e: Error) => setErreur(e.message))
      .finally(() => setChargeFichier(false))
  }

  const tous = (arbre?.entrees ?? []).filter((e) => e.type !== "dir")
  // Le catalogue de composants dépasse la cinquantaine d'entrées : sans filtre, la colonne
  // devient un mur qu'on parcourt à la molette.
  const fichiers = filtre
    ? tous.filter((e) => e.nom.toLowerCase().includes(filtre.toLowerCase()))
    : tous

  if (!cle) return <SansCle />

  return (
    <div className="flex flex-col gap-5">
      <Text c="secondary">{corpus.quoi}</Text>

      {erreur ? (
        <Alert type="error" variant="light" title="Lecture impossible" description={erreur} />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <Card variant="outline" padding="xs" className="flex max-h-[32rem] flex-col gap-1">
          <div className="px-1 pb-1">
            <Input
              size="sm"
              value={filtre}
              placeholder={`Filtrer (${tous.length})`}
              startSlot={<Search size={14} aria-hidden="true" />}
              onChange={(e) => setFiltre(e.currentTarget.value)}
            />
          </div>
          <nav aria-label={`Fichiers — ${corpus.label}`} className="flex flex-col gap-0.5 overflow-auto">
            {!arbre ? (
              <div className="flex items-center gap-2 p-3">
                <Spinner size="xs" />
                <Text c="muted" size="sm">
                  Chargement…
                </Text>
              </div>
            ) : fichiers.length === 0 ? (
              <Text c="muted" size="sm" className="p-3">
                {tous.length === 0 ? "Dossier vide." : "Aucun fichier ne contient ce filtre."}
              </Text>
            ) : (
              fichiers.map((e) => (
                // Une rangée de navigation, pas un bouton maison : même composant que la
                // sidebar, donc même état courant, même focus, même densité.
                <NavLink
                  key={e.nom}
                  label={e.nom}
                  current={fichier?.path.endsWith(`/${e.nom}`) === true}
                  linkComponent="button"
                  linkOptions={{ type: "button", onClick: () => ouvrir(e.nom) }}
                  classNames={{ row: "font-mono text-xs" }}
                />
              ))
            )}
          </nav>
        </Card>

        <Card variant="outline" padding="md" className="min-w-0">
          {chargeFichier ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <Text c="secondary">Chargement…</Text>
            </div>
          ) : fichier ? (
            <div className="flex flex-col gap-3">
              <Title order={2} size="sm">
                {fichier.path}
              </Title>
              {fichier.tronque ? (
                <Text c="muted" size="sm">
                  Fichier tronqué pour l'affichage.
                </Text>
              ) : null}
              <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words font-mono text-gray-dark-300 text-xs">
                {fichier.contenu}
              </pre>
            </div>
          ) : (
            <Text c="muted">Choisis un fichier à gauche.</Text>
          )}
        </Card>
      </div>
    </div>
  )
}
