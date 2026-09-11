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
 *  about the token, and nothing else. Since 2026-09-11 that token is the person's OWN
 *  `42ds_…` access token — the one their MCP connector carries — and not a key shared by
 *  everyone: one secret per person, and the server knows who is looking. */
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
              Access token
            </Card.Title>
            <Card.Description>
              The console and the flows read the MCP server. Paste your{" "}
              <span className="font-mono">42ds_…</span> access token — the same one your MCP
              connector uses. It stays in your browser, and what you see next depends on
              your role.
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
              <Field label="Token">
                <Input
                  type="password"
                  value={key}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="42ds_…"
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
