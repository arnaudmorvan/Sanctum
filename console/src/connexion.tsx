import { Alert } from "@42/ui-react/alert"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Input } from "@42/ui-react/input"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useState } from "react"
import { URL_MCP } from "./mcp"

/** L'écran de connexion. Il occupe toute la page tant qu'on n'est pas entré : un champ
 *  discret dans un en-tête ne dit pas qu'il MANQUE quelque chose — on croit la console
 *  cassée alors qu'on n'a simplement pas ouvert la porte. */
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
    <div className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Card variant="outline" padding="xl">
          <Card.Header>
            <Card.Title>
              <Title order={1} size="xl">
                Console 42
              </Title>
            </Card.Title>
          </Card.Header>
          <Card.Description>
            Les prototypes du produit, le contexte servi aux agents, l'usage du serveur, et qui
            a le droit d'écrire.
          </Card.Description>

          <Card.Content>
            <form
              className="flex flex-col gap-4 pt-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (cle.trim()) onValider(cle.trim())
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Text size="sm">Clé de lecture</Text>
                <Input
                  type="password"
                  value={cle}
                  autoFocus
                  placeholder="colle la clé ici"
                  onChange={(e) => setCle(e.currentTarget.value)}
                />
                <Text c="muted" size="sm">
                  C'est la variable <span className="font-mono">DASHBOARD_KEY</span> du service
                  MCP, dans les variables Railway. Elle reste dans ton navigateur.
                </Text>
              </div>

              {erreur ? (
                <Alert color="red" variant="light" title="Connexion refusée" description={erreur} />
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
