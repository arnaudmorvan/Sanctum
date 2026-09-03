import { Alert } from "@42/ui-react/alert"
import { Button } from "@42/ui-react/button"
import { Input } from "@42/ui-react/input"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { SansCle } from "../etat"
import { type Arbre, type Fichier, lire } from "../mcp"

/** Les quatre corpus qu'on veut voir. Ce sont des dossiers du repo, pas des concepts
 *  inventés ici : skills/ (les modes opératoires servis aux agents), foundations/ (les
 *  règles de goût), produit/ (la spec de 42next) et reports/ (la matière pas encore
 *  consolidée). */
export const CORPUS = [
  { cle: "composants", label: "Composants", dir: "context/components/items", quoi: "Le catalogue exporté de Figma : axes, variantes, slots. Généré, jamais édité à la main." },
  { cle: "foundations", label: "Foundations", dir: "context/foundations", quoi: "Les règles de goût — ce qu'aucun catalogue ne porte." },
  { cle: "skills", label: "Skills", dir: "skills", quoi: "Les modes opératoires servis aux agents." },
  { cle: "produit", label: "Produit", dir: "context/produit", quoi: "La spec de 42next : ce que l'écran raconte." },
  { cle: "reports", label: "Reports", dir: "context/reports", quoi: "La matière déposée, pas encore consolidée." },
]

export const VueContexte = ({ cle, corpusInitial }: { cle: string; corpusInitial?: string }) => {
  const [corpus, setCorpus] = useState(
    () => CORPUS.find((c) => c.cle === corpusInitial) ?? CORPUS[0],
  )
  const [filtre, setFiltre] = useState("")

  // Le corpus peut être imposé de l'extérieur : les compteurs de l'en-tête ouvrent
  // directement le bon dossier.
  useEffect(() => {
    const c = CORPUS.find((x) => x.cle === corpusInitial)
    if (c) setCorpus(c)
  }, [corpusInitial])
  const [arbre, setArbre] = useState<Arbre | null>(null)
  const [fichier, setFichier] = useState<Fichier | null>(null)
  const [erreur, setErreur] = useState("")
  const [chargeFichier, setChargeFichier] = useState(false)

  useEffect(() => {
    setArbre(null)
    setFichier(null)
    setErreur("")
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
      <div className="flex flex-wrap gap-2">
        {CORPUS.map((c) => (
          <Button
            key={c.cle}
            size="sm"
            variant={c.cle === corpus.cle ? "filled" : "subtle"}
            onClick={() => setCorpus(c)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <Text c="secondary">{corpus.quoi}</Text>

      {erreur ? (
        <Alert color="red" variant="light" title="Lecture impossible" description={erreur} />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="flex max-h-[32rem] flex-col gap-1 rounded-xl border border-white/12 p-2">
          <div className="px-1 pb-1">
            <Input
              size="sm"
              value={filtre}
              placeholder={`Filtrer (${tous.length})`}
              onChange={(e) => setFiltre(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-col gap-1 overflow-auto">
          {!arbre ? (
            <div className="flex items-center gap-2 p-3">
              <Spinner size="xs" />
              <Text c="muted" size="sm">
                Chargement…
              </Text>
            </div>
          ) : fichiers.length === 0 ? (
            <Text c="muted" size="sm">
              Dossier vide.
            </Text>
          ) : (
            fichiers.map((e) => (
              <button
                type="button"
                key={e.nom}
                onClick={() => ouvrir(e.nom)}
                className={`rounded-lg px-3 py-2 text-left font-mono text-xs transition-colors ${
                  fichier?.path.endsWith(`/${e.nom}`)
                    ? "bg-white/10 text-white"
                    : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {e.nom}
              </button>
            ))
          )}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-white/12 p-4">
          {chargeFichier ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <Text c="secondary">Chargement…</Text>
            </div>
          ) : fichier ? (
            <div className="flex flex-col gap-3">
              <Title order={2} size="sm">
                <span className="font-mono">{fichier.path}</span>
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
        </div>
      </div>
    </div>
  )
}
