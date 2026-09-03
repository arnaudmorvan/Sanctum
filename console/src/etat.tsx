import { Alert } from "@42/ui-react/alert"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { type ReactNode, useEffect, useState } from "react"
import { ErreurAcces, lire } from "./mcp"

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
  <div className="rounded-xl border border-white/12 border-dashed px-5 py-8 text-center">
    <Text c="secondary">
      Saisis la clé de lecture en haut à droite pour afficher cette section.
    </Text>
    <Text c="muted" size="sm">
      C'est la variable DASHBOARD_KEY du service MCP. Elle reste dans ton navigateur.
    </Text>
  </div>
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

export const Chiffre = ({ label, valeur }: { label: string; valeur: ReactNode }) => (
  <div className="rounded-xl border border-white/12 bg-white/4 px-4 py-3">
    <Text c="muted" size="sm">
      {label}
    </Text>
    <div className="font-mono text-2xl text-white">{valeur}</div>
  </div>
)
