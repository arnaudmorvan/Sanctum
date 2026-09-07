import { Alert } from "@42/ui-react/alert"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Field } from "@42/ui-react/field"
import { Input } from "@42/ui-react/input"
import { Text } from "@42/ui-react/text"
import { KeyRound } from "lucide-react"
import { useState } from "react"
import { MCP_URL } from "./mcp"

/** The sign-in screen. It takes the whole place of the requested section until you are in:
 *  a discreet field in a header does not say that something is MISSING — you think the
 *  console is broken when you simply have not opened the door. It does NOT cover the whole
 *  page: the flow gallery itself asks for no key.
 *
 *  It does not repeat what the page already says (the section title sits above it): it talks
 *  about the key, and nothing else. */
export const Login = ({
  onSubmit,
  error,
  busy,
}: {
  onSubmit: (key: string) => void
  error: string
  busy: boolean
}) => {
  const [key, setKey] = useState("")

  return (
    <div className="flex justify-center py-6">
      <div className="w-full max-w-md">
        <Card variant="outline" padding="xl">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <KeyRound size={18} aria-hidden="true" />
              Read key
            </Card.Title>
            <Card.Description>
              This section reads the MCP server. The key is the service's{" "}
              <span className="font-mono">DASHBOARD_KEY</span> variable, in the Railway
              variables. It stays in your browser.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <form
              className="flex flex-col gap-4 pt-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (key.trim()) onSubmit(key.trim())
              }}
            >
              <Field label="Key">
                <Input
                  type="password"
                  value={key}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="paste the key here"
                  onChange={(e) => setKey(e.currentTarget.value)}
                />
              </Field>

              {error ? (
                <Alert type="error" variant="light" title="Sign-in refused" description={error} />
              ) : null}

              <Button type="submit" variant="filled" loading={busy} disabled={!key.trim()}>
                Sign in
              </Button>
            </form>
          </Card.Content>

          <Card.Footer>
            <Text c="muted" size="sm">
              Server: <span className="font-mono">{MCP_URL}</span>
            </Text>
          </Card.Footer>
        </Card>
      </div>
    </div>
  )
}
