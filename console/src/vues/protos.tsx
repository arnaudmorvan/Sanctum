import { ActionIcon } from "@42/ui-react/action-icon"
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Field } from "@42/ui-react/field"
import { Input } from "@42/ui-react/input"
import { Menu } from "@42/ui-react/menu"
import { Modal } from "@42/ui-react/modal"
import { Text } from "@42/ui-react/text"
import { Code2, Copy, Ellipsis, ExternalLink, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { type Depot, ErreurAcces, lireProtos, type Suppression, supprimerProto } from "../mcp"
import { notify } from "../notifier"

export type Proto = {
  slug: string
  titre: string
  auteur?: string
  resume?: string
  cree_le?: string
  maj_le?: string
  ok?: boolean
}

// ------------------------------------------------------------ suppressions en attente
// Supprimer un parcours, c'est UN commit dans le repo des protos. Le site, lui, ne change
// qu'au déploiement suivant : `protos.json` est écrit par le build. Entre les deux — quelques
// minutes — un rechargement remontrerait le parcours comme si rien ne s'était passé, et on
// conclurait que la suppression a échoué. On mémorise donc ce qu'on a supprimé, localement,
// et la carte reste visible en « suppression en cours » jusqu'à ce que le build l'ait
// vraiment retirée. L'entrée s'efface d'elle-même quand le slug disparaît de protos.json.
const CLE_SUPPRESSIONS = "42ds.console.suppressions"
type EnAttente = Record<string, { commit: string; le: string }>
const DEUX_JOURS = 48 * 3600 * 1000

const lireSuppressions = (): EnAttente => {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE_SUPPRESSIONS) ?? "{}") as EnAttente
    const vivantes: EnAttente = {}
    for (const [slug, s] of Object.entries(brut)) {
      if (Date.now() - Date.parse(s.le) < DEUX_JOURS) vivantes[slug] = s
    }
    return vivantes
  } catch {
    return {}
  }
}

const ecrireSuppressions = (s: EnAttente) => {
  try {
    Object.keys(s).length
      ? localStorage.setItem(CLE_SUPPRESSIONS, JSON.stringify(s))
      : localStorage.removeItem(CLE_SUPPRESSIONS)
  } catch {
    /* sans stockage, l'état vit le temps de la session */
  }
}

// ------------------------------------------------------------ presse-papiers

const copier = async (texte: string, quoi: string) => {
  try {
    await navigator.clipboard.writeText(texte)
    notify.success({ title: `${quoi} copié`, duration: 2500 })
  } catch {
    notify.error({ title: "Copie impossible", description: "Sélectionne le texte et copie-le à la main." })
  }
}

/** Une ligne de commande à copier. Le texte est en mono — c'est la machine — et le bouton
 *  de copie est un ActionIcon : icône seule, nom accessible par `aria-label`. */
const Commande = ({ label, texte }: { label: string; texte: string }) => (
  <div className="flex flex-col gap-1">
    <Text c="muted" size="xs">
      {label}
    </Text>
    <div className="flex items-center gap-2 rounded-md border border-white/12 bg-white/4 ps-3 pe-1 py-1">
      <code className="min-w-0 flex-1 select-all truncate font-mono text-gray-dark-100 text-xs">
        {texte}
      </code>
      <ActionIcon
        variant="subtle"
        size="sm"
        aria-label={`Copier : ${label}`}
        onClick={() => copier(texte, label)}
      >
        <Copy size={14} />
      </ActionIcon>
    </div>
  </div>
)

// ------------------------------------------------------------ modale « récupérer le code »

const ModaleCode = ({
  proto,
  depot,
  onFermer,
}: {
  proto: Proto | null
  depot?: Depot | null
  onFermer: () => void
}) => {
  const dossier = `${depot?.dossier_protos ?? "protos"}/${proto?.slug ?? ""}`
  const urlDossier = depot ? `${depot.url}/tree/${depot.branche}/${dossier}` : null
  return (
    <Modal
      open={proto !== null}
      onOpenChange={(o) => !o && onFermer()}
      title="Récupérer le code"
      description={proto?.titre}
      size="md"
    >
      <div className="flex flex-col gap-4 pt-1">
        <Text size="sm" c="secondary">
          Le parcours vit dans <span className="font-mono">{dossier}/</span>. Il dépend du
          squelette (<span className="font-mono">src/</span>) et du kit vendu avec le dépôt
          (<span className="font-mono">vendor/ui-react/</span>) : on clone le dépôt entier,
          puis on lance ce parcours seul.
        </Text>

        {depot ? (
          <>
            <Commande label="Cloner le dépôt" texte={`git clone ${depot.clone}`} />
            <Commande label="Installer, puis ouvrir ce parcours" texte={`cd ${depot.nom} && npm install && npm run dev ${proto?.slug ?? ""}`} />
            <Text c="muted" size="xs">
              Le parcours s'ouvre sur <span className="font-mono">http://localhost:4244/</span>.
              Ce qu'on modifie est bien <span className="font-mono">{dossier}/</span> — le
              script y pose un lien depuis <span className="font-mono">src/proto/</span>, pas une copie.
            </Text>
          </>
        ) : (
          <Alert
            type="warning"
            variant="light"
            title="Dépôt inconnu de ce build"
            description="Le build n'a trouvé ni variables Railway ni remote git : le dossier est connu, pas l'URL. Demande l'accès au dépôt Sanctum à Arnaud."
          />
        )}

        <Modal.Footer className="px-0 pb-0">
          {urlDossier ? (
            <Button variant="outline" size="sm" asChild>
              <a href={urlDossier} target="_blank" rel="noreferrer">
                <ExternalLink size={14} aria-hidden="true" />
                Voir sur GitHub
              </a>
            </Button>
          ) : null}
          <Button variant="subtle" size="sm" onClick={onFermer}>
            Fermer
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  )
}

// ------------------------------------------------------------ modale de suppression

const ModaleSuppression = ({
  proto,
  onFermer,
  onSupprime,
}: {
  proto: Proto | null
  onFermer: () => void
  onSupprime: (s: Suppression) => void
}) => {
  const [saisie, setSaisie] = useState("")
  const [occupe, setOccupe] = useState(false)
  const [erreur, setErreur] = useState("")

  // Chaque ouverture repart propre : la saisie d'une suppression précédente ne doit pas
  // pré-valider la suivante.
  useEffect(() => {
    setSaisie("")
    setErreur("")
    setOccupe(false)
  }, [proto])

  const confirme = proto !== null && saisie.trim() === proto.slug

  const supprimer = () => {
    if (!proto || !confirme) return
    setOccupe(true)
    setErreur("")
    supprimerProto(proto.slug)
      .then((s) => {
        onSupprime(s)
        onFermer()
      })
      .catch((e: Error) => {
        setErreur(
          e instanceof ErreurAcces
            ? "Clé refusée. Reconnecte-toi avec la clé DASHBOARD_KEY du service MCP."
            : e.message,
        )
        setOccupe(false)
      })
  }

  return (
    <Modal
      open={proto !== null}
      onOpenChange={(o) => !o && !occupe && onFermer()}
      role="alertdialog"
      title="Supprimer ce parcours ?"
      description={proto?.titre}
      size="sm"
    >
      <form
        className="flex flex-col gap-4 pt-1"
        onSubmit={(e) => {
          e.preventDefault()
          supprimer()
        }}
      >
        <Text size="sm" c="secondary">
          Le dossier <span className="font-mono">protos/{proto?.slug}/</span> est retiré du
          dépôt en un commit. Le parcours disparaît du site au prochain déploiement — quelques
          minutes. Il reste dans l'historique git : un <span className="font-mono">git revert</span>{" "}
          le ramène.
        </Text>

        <Field
          label="Tape le slug pour confirmer"
          description={<span className="font-mono">{proto?.slug}</span>}
        >
          <Input
            value={saisie}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder={proto?.slug}
            className="font-mono"
            onChange={(e) => setSaisie(e.currentTarget.value)}
          />
        </Field>

        {erreur ? (
          <Alert type="error" variant="light" title="Suppression refusée" description={erreur} />
        ) : null}

        <Modal.Footer className="px-0 pb-0">
          <Button variant="subtle" size="sm" type="button" onClick={onFermer} disabled={occupe}>
            Annuler
          </Button>
          <Button
            variant="filled"
            color="red"
            size="sm"
            type="submit"
            disabled={!confirme}
            loading={occupe}
            startSlot={<Trash2 size={14} />}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

// ------------------------------------------------------------ la galerie

export const VueProtos = ({ dedans, depot }: { dedans: boolean; depot?: Depot | null }) => {
  const [protos, setProtos] = useState<Proto[] | null>(null)
  const [erreur, setErreur] = useState("")
  const [enAttente, setEnAttente] = useState<EnAttente>(lireSuppressions)
  const [codeDe, setCodeDe] = useState<Proto | null>(null)
  const [suppressionDe, setSuppressionDe] = useState<Proto | null>(null)

  useEffect(() => {
    lireProtos<Proto[]>()
      .then((liste) => {
        setProtos(liste)
        // Le build a fait son travail : ce qui n'est plus dans protos.json n'est plus « en
        // attente ».
        setEnAttente((prev) => {
          const presents = new Set(liste.map((p) => p.slug))
          const restant: EnAttente = {}
          for (const [slug, s] of Object.entries(prev)) if (presents.has(slug)) restant[slug] = s
          ecrireSuppressions(restant)
          return restant
        })
      })
      .catch((e: Error) => setErreur(e.message))
  }, [])

  const marquerSupprime = (s: Suppression) => {
    setEnAttente((prev) => {
      const suivant = { ...prev, [s.slug]: { commit: s.commit, le: new Date().toISOString() } }
      ecrireSuppressions(suivant)
      return suivant
    })
    notify.success({
      title: "Parcours supprimé",
      description: `Commit ${s.commit} — ${s.fichiers} fichier${s.fichiers > 1 ? "s" : ""}. Il disparaît du site au prochain déploiement.`,
      duration: 8000,
    })
  }

  if (erreur)
    return <Alert type="error" variant="light" title="Liste indisponible" description={erreur} />
  if (!protos) return <Text c="secondary">Chargement…</Text>

  if (protos.length === 0)
    return (
      <Card variant="outline" padding="xl">
        <Card.Header>
          <Card.Title>Aucun prototype pour l'instant</Card.Title>
          <Card.Description>
            Un PO en publie un depuis une conversation Claude : « fais-moi un parcours de… ».
            Aucun git, aucune installation.
          </Card.Description>
        </Card.Header>
      </Card>
    )

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {protos.map((p) => {
          const casse = p.ok === false
          const supprime = enAttente[p.slug]
          return (
            <Card key={p.slug} variant="outline" padding="lg" className={supprime ? "opacity-60" : undefined}>
              <Card.Header className="flex-row items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <Card.Title className="truncate">{p.titre}</Card.Title>
                  {casse || supprime ? (
                    <div className="flex flex-wrap gap-1">
                      {casse ? (
                        <Badge color="red" variant="light" size="sm">
                          build en échec
                        </Badge>
                      ) : null}
                      {supprime ? (
                        <Badge color="gray" variant="outline" size="sm">
                          suppression en cours · {supprime.commit}
                        </Badge>
                      ) : null}
                    </div>
                  ) : null}
                  {p.resume ? <Card.Description>{p.resume}</Card.Description> : null}
                </div>
                {/* Les actions rares — cloner, supprimer — dans un menu : la carte n'a qu'UN
                    bouton apparent, celui qu'on cherche neuf fois sur dix. */}
                <Menu
                  position="bottom-end"
                  data={[
                    {
                      label: "Récupérer le code",
                      startSection: <Code2 size={16} />,
                      onClick: () => setCodeDe(p),
                    },
                    { type: "divider" },
                    {
                      label: dedans ? "Supprimer…" : "Supprimer… (clé requise)",
                      color: "red",
                      startSection: <Trash2 size={16} />,
                      disabled: !dedans || supprime !== undefined,
                      onClick: () => setSuppressionDe(p),
                    },
                  ]}
                >
                  <ActionIcon variant="subtle" size="sm" aria-label={`Actions — ${p.titre}`}>
                    <Ellipsis size={16} />
                  </ActionIcon>
                </Menu>
              </Card.Header>
              <Card.Content>
                <Text c="muted" size="sm">
                  {p.auteur ?? "—"}
                  {p.maj_le ? (
                    <>
                      {" · mis à jour le "}
                      <span className="font-mono">{p.maj_le}</span>
                    </>
                  ) : null}
                </Text>
              </Card.Content>
              <Card.Footer className="justify-start">
                <Button variant="light" size="sm" disabled={casse} asChild={!casse}>
                  {casse ? <span>Indisponible</span> : <a href={`/p/${p.slug}/`}>Ouvrir le parcours</a>}
                </Button>
              </Card.Footer>
            </Card>
          )
        })}
      </div>

      <ModaleCode proto={codeDe} depot={depot} onFermer={() => setCodeDe(null)} />
      <ModaleSuppression
        proto={suppressionDe}
        onFermer={() => setSuppressionDe(null)}
        onSupprime={marquerSupprime}
      />
    </>
  )
}
