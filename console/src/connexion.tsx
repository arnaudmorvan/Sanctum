import { Alert } from "@42/ui-react/alert"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Field } from "@42/ui-react/field"
import { Input } from "@42/ui-react/input"
import { Text } from "@42/ui-react/text"
import { KeyRound } from "lucide-react"
import { useState } from "react"
import { URL_MCP } from "./mcp"

/** L'écran de connexion. Il prend toute la place de la section demandée tant qu'on n'est
 *  pas entré : un champ discret dans un en-tête ne dit pas qu'il MANQUE quelque chose — on
 *  croit la console cassée alors qu'on n'a simplement pas ouvert la porte. Il ne couvre PAS
 *  la page entière : la galerie des parcours, elle, ne demande aucune clé.
 *
 *  Il ne redit pas ce que la page dit déjà (le titre de la section est au-dessus) : il
 *  parle de la clé, et de rien d'autre. */
export const Connexion = ({
  onValider,
  erreur,
  occupe,
}: {
  onValider: (cle: string) => void
  erreur: string
  occupe: boolean
}) => {
  const [cle, setCle] = useState("")

  return (
    <div className="flex justify-center py-6">
      <div className="w-full max-w-md">
        <Card variant="outline" padding="xl">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <KeyRound size={18} aria-hidden="true" />
              Clé de lecture
            </Card.Title>
            <Card.Description>
              Cette section lit le serveur MCP. La clé est la variable{" "}
              <span className="font-mono">DASHBOARD_KEY</span> du service, dans les variables
              Railway. Elle reste dans ton navigateur.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <form
              className="flex flex-col gap-4 pt-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (cle.trim()) onValider(cle.trim())
              }}
            >
              <Field label="Clé">
                <Input
                  type="password"
                  value={cle}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="colle la clé ici"
                  onChange={(e) => setCle(e.currentTarget.value)}
                />
              </Field>

              {erreur ? (
                <Alert type="error" variant="light" title="Connexion refusée" description={erreur} />
              ) : null}

              <Button type="submit" variant="filled" loading={occupe} disabled={!cle.trim()}>
                Se connecter
              </Button>
            </form>
          </Card.Content>

          <Card.Footer>
            <Text c="muted" size="sm">
              Serveur : <span className="font-mono">{URL_MCP}</span>
            </Text>
          </Card.Footer>
        </Card>
      </div>
    </div>
  )
}
