import { Alert } from "@42/ui-react/alert"
import { Card } from "@42/ui-react/card"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { type ReactNode, useEffect, useState } from "react"
import { ErreurAcces, lire } from "./mcp"
import { TYPO } from "../../src/typo"

/** Un chargement, une erreur, un rendu — la même mécanique dans les cinq onglets qui lisent
 *  le serveur. Sans ça, chaque vue réinventerait son état et afficherait ses erreurs
 *  différemment. `cle` en dépendance : changer la clé relance tous les chargements. */
export function useRoute<T>(route: string, cle: string) {
  const [data, setData] = useState<T | null>(null)
  const [erreur, setErreur] = useState("")
  const [charge, setCharge] = useState(false)

  useEffect(() => {
    let vivant = true
    // Sans clé, on n'appelle même pas : un 401 provoqué par un champ vide s'affichait
    // « Clé refusée », ce qui accuse la clé alors qu'aucune n'a été envoyée.
    if (!cle) {
      setData(null)
      setErreur("")
      setCharge(false)
      return
    }
    setCharge(true)
    setErreur("")
    lire<T>(route)
      .then((d) => vivant && setData(d))
      .catch((e: Error) => {
        if (!vivant) return
        setErreur(
          e instanceof ErreurAcces
            ? "Clé refusée. C'est DASHBOARD_KEY, dans les variables du service MCP."
            : e.message,
        )
      })
      .finally(() => vivant && setCharge(false))
    return () => {
      vivant = false
    }
  }, [route, cle])

  return { data, erreur, charge, sansCle: !cle }
}

export const SansCle = () => (
  <Alert
    type="info"
    variant="outline"
    title="Cette section lit le serveur MCP : il faut la clé de lecture."
    description="C'est la variable DASHBOARD_KEY du service MCP. Elle reste dans ton navigateur."
  />
)

export const Etat = ({
  charge,
  erreur,
  data,
  enfants,
  vide,
  sansCle,
}: {
  charge: boolean
  erreur: string
  data: unknown
  enfants: ReactNode
  vide?: string
  sansCle?: boolean
}) => {
  if (sansCle) return <SansCle />
  if (erreur)
    return <Alert color="red" variant="light" title="Lecture impossible" description={erreur} />
  if (charge && !data)
    return (
      <div className="flex items-center gap-2 py-8">
        <Spinner size="sm" />
        <Text c="secondary">Chargement…</Text>
      </div>
    )
  if (!data) return <Text c="secondary">{vide ?? "Rien à afficher."}</Text>
  return <>{enfants}</>
}

/** Un compteur. La VALEUR est en Kode Mono — c'est la machine qui parle (règle typo du
 *  DS : les compteurs, scores et niveaux sont mono ; le texte reste en Lato). */
export const Chiffre = ({ label, valeur }: { label: string; valeur: ReactNode }) => (
  <Card variant="outline" padding="sm">
    <Text c="muted" size="sm">
      {label}
    </Text>
    <div className={`${TYPO.machine()} text-2xl text-white`}>{valeur}</div>
  </Card>
)
