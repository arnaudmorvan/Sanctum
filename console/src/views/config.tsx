import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { PasswordInput } from "@42/ui-react/password-input"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { CircleAlert, CircleCheck, CircleSlash, Lock } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import {
  AccessError,
  type Config,
  type ConfigCapability,
  type ConfigVar,
  getConfig,
  readAdminKey,
  writeAdminKey,
} from "../mcp"
import { TYPO } from "../../../src/typo"
import { State } from "../state"

/** The Configuration tab: what this MCP server is actually WIRED TO.
 *
 *  Every optional capability of the server is fail-closed — no variable, no route, no
 *  tool. That is the right default and it has one cost: **the failure is silent**. A PO
 *  clicks "Source" and reads "no Figma token"; flows do not go live in seconds and nobody
 *  knows the hot build was never wired; the Access tab stays read-only without saying
 *  which of the two keys is missing. Until this tab, the only way to find out was to curl
 *  the routes one by one and read the status codes.
 *
 *  ⚠️ It shows state, it does not SET anything, and the reason is worth keeping: this repo
 *  is the database, and it holds an invariant — `access/users.json` carries no secret,
 *  tokens are derived by HMAC. A third-party PAT cannot be derived, so storing one would
 *  mean either losing it at every redeploy or committing it forever (git keeps what it is
 *  given). Railway holds the secrets; this panel says which are missing and where.
 *
 *  A secret variable NEVER travels here — `config_report` reports it as set/unset and
 *  nothing else, pinned by `test_the_config_panel_agrees_with_what_is_really_mounted`.
 *  A non-secret one shows its value, because reading it is the point: `UI_REPO` still
 *  pointing at the snapshot is exactly what this tab exists to make visible. */

const TONE = {
  on: { color: "green", icon: <CircleCheck size={14} />, label: "on" },
  off: { color: "orange", icon: <CircleAlert size={14} />, label: "off" },
  blocked: { color: "gray", icon: <Lock size={14} />, label: "blocked" },
} as const

/** ⚠️ Orange means "something is MISSING", never merely "this variable is empty".
 *
 *  The first version coloured every unset variable, optional ones included — so a
 *  perfectly healthy server (no PROTOS_TOKEN because GITHUB_TOKEN is used, no
 *  PROTOS_BRANCH because the default is main) read as broken everywhere, and the one row
 *  that actually needed attention was lost in the noise. Reported on 2026-09-09, an hour
 *  after the tab shipped. An optional variable now shows the DEFAULT the code applies,
 *  which is information rather than an alarm. */
const Var = ({ v }: { v: ConfigVar }) => {
  const alarming = v.required && !v.set
  return (
    <li className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <code
        className={`${TYPO.mono()} text-xs ${alarming ? "text-orange-300" : "text-gray-dark-200"}`}
      >
        {v.name}
      </code>
      {v.secret ? (
        <span className="text-gray-dark-500 text-xs">{v.set ? "set" : "not set"}</span>
      ) : (
        <span className={`${TYPO.mono()} text-gray-dark-400 text-xs`}>
          {v.value ? v.value : "not set"}
        </span>
      )}
      {/* Which NAME carries the value, when the variable has two legal ones. Saying it is
          the whole point: FEEDBACK_KEY reads "not set" on a server where the feedback
          works, because the Railway dashboard still holds the pre-migration RETOURS_KEY —
          and someone reading that goes and creates a variable that already exists. */}
      {v.via && v.via !== v.name ? (
        <span className="text-gray-dark-500 text-xs">
          · via <code className={TYPO.mono()}>{v.via}</code>
        </span>
      ) : null}
      {!v.set && v.default ? (
        <span className="text-gray-dark-500 text-xs">· default: {v.default}</span>
      ) : null}
      {!v.set && !v.default && v.aliases.length > 0 ? (
        <span className="text-gray-dark-500 text-xs">· or {v.aliases.join(", ")}</span>
      ) : null}
      {/* The twin lives on the OTHER Railway service. We cannot read it from here, so it is
          a reminder and never a verdict — announcing "not set" about an environment we do
          not see sends someone re-setting a variable that was already right. */}
      {v.twin ? <span className="text-gray-dark-500 text-xs">· twin: {v.twin}</span> : null}
    </li>
  )
}

const Capability = ({ c }: { c: ConfigCapability }) => {
  const tone = TONE[c.state]
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-wrap items-center gap-2">
          <Card.Title>{c.label}</Card.Title>
          <Badge color={tone.color} size="sm">
            {tone.icon}
            {tone.label}
          </Badge>
          {c.required ? (
            <Badge color="gray" size="sm" variant="outline">
              required
            </Badge>
          ) : null}
          {c.optional ? (
            <Badge color="gray" size="sm" variant="outline">
              optional
            </Badge>
          ) : null}
        </div>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-3">
          <Text c="secondary" size="sm">
            {c.what}
          </Text>
          {c.missing.length > 0 ? (
            <Text size="sm" className="text-orange-300">
              Missing: {c.missing.join(", ")} — on the mcp-42 service in Railway.
            </Text>
          ) : null}
          {c.blocked_by ? (
            <Text size="sm" c="secondary">
              Configured, but {c.blocked_by} is closing it. Nothing to set — a mode is
              switching it off.
            </Text>
          ) : null}
          <ul className="flex flex-col gap-1">
            {c.vars.map((v) => (
              <Var key={v.name} v={v} />
            ))}
          </ul>
          {c.refines.length > 0 ? (
            <details>
              <summary className="cursor-pointer text-gray-dark-500 text-xs">
                {c.refines.length} optional setting{c.refines.length > 1 ? "s" : ""}
              </summary>
              <ul className="mt-2 flex flex-col gap-1">
                {c.refines.map((v) => (
                  <Var key={v.name} v={v} />
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  )
}

/** The keys THIS BROWSER holds — and the reason they belong here rather than only in the
 *  Access tab, where the administration key used to be asked for and nowhere else.
 *
 *  ⚠️ They are not the same kind of thing as the variables above, and confusing the two is
 *  what made this tab hard to use. `FIGMA_TOKEN` and the rest are SERVER secrets: they live
 *  on Railway, and nothing here writes them. These two are the opposite — they are never
 *  stored server-side at all; the browser keeps them to present as headers. Typing one here
 *  stores nothing new anywhere, which is why it costs no invariant.
 *
 *  The administration key is CHECKED as it is typed: the config route answers whether the
 *  key presented is the right one (a boolean, never an echo). Storing it blind meant
 *  discovering a typo later, in another tab, on a gesture one then believed was broken. */
const BrowserKeys = ({ admin, onSaved }: { admin: Config["admin_key"]; onSaved: () => void }) => {
  const [typed, setTyped] = useState("")
  const held = Boolean(readAdminKey())

  const save = (value: string) => {
    writeAdminKey(value)
    setTyped("")
    onSaved()
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex flex-wrap items-center gap-2">
          <Card.Title>Keys held by this browser</Card.Title>
          {admin.ok ? (
            <Badge color="green" size="sm">
              <CircleCheck size={14} />
              admin key accepted
            </Badge>
          ) : held ? (
            <Badge color="orange" size="sm">
              <CircleAlert size={14} />
              admin key refused
            </Badge>
          ) : (
            <Badge color="gray" size="sm">
              <Lock size={14} />
              admin key not held
            </Badge>
          )}
        </div>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-3">
          <Text c="secondary" size="sm">
            These are not server secrets: they are never stored on the server. The browser
            keeps them to present as headers. The console key opens this page; the
            administration key unlocks the writes of the Access tab — opening an access,
            changing a role, revoking, reading a token back.
          </Text>

          {!admin.configured ? (
            <Text size="sm" className="text-orange-300">
              The server has no ACCESS_ADMIN_KEY: there is nothing to unlock yet. Set it on
              the mcp-42 service in Railway first — the card above says so too.
            </Text>
          ) : (
            <form
              className="flex flex-wrap items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (typed.trim()) save(typed.trim())
              }}
            >
              <PasswordInput
                className="min-w-64"
                value={typed}
                placeholder="ACCESS_ADMIN_KEY"
                onChange={(e) => setTyped(e.currentTarget.value)}
              />
              <Button type="submit" size="sm" variant="filled" disabled={!typed.trim()}>
                {held ? "Replace" : "Unlock"}
              </Button>
              {held ? (
                <Button size="sm" variant="subtle" onClick={() => save("")}>
                  Forget
                </Button>
              ) : null}
            </form>
          )}

          {held && !admin.ok && admin.configured ? (
            <Text size="sm" className="text-orange-300">
              The key this browser holds is not the one the server expects. Copy
              ACCESS_ADMIN_KEY from the mcp-42 variables in Railway and paste it again.
            </Text>
          ) : null}
          {admin.ok ? (
            <Text c="secondary" size="sm">
              The Access tab can now write. It reads this same key — nothing to type twice.
            </Text>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  )
}

export const ConfigView = ({ apiKey }: { apiKey: string }) => {
  // Not `useRoute`: the answer depends on the ADMIN key too, and it has to be re-fetched
  // the moment one is typed — that round trip IS the verdict shown next to the field.
  const [data, setData] = useState<Config | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    if (!apiKey) {
      setData(null)
      setError("")
      return
    }
    setLoading(true)
    setError("")
    getConfig()
      .then(setData)
      .catch((e: Error) =>
        setError(
          e instanceof AccessError
            ? "Key rejected. It is DASHBOARD_KEY, in the MCP service variables."
            : e.message,
        ),
      )
      .finally(() => setLoading(false))
  }, [apiKey])

  useEffect(load, [load])
  const noKey = !apiKey

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      <div className="flex flex-col gap-6">
        {data ? <BrowserKeys admin={data.admin_key} onSaved={load} /> : null}

        {data && data.broken.length > 0 ? (
          <Alert color="red">
            <Alert.Title>The server is not wired to its own repository</Alert.Title>
            <Alert.Description>
              {data.broken.join(", ")} — every tool raises ConfigError until this is set.
            </Alert.Description>
          </Alert>
        ) : null}

        <Text c="secondary" size="sm">
          {data?.note}
        </Text>

        {data && data.off.length > 0 ? (
          <Text c="secondary" size="sm">
            Switched off right now: {data.off.length} capabilit
            {data.off.length > 1 ? "ies" : "y"} — each one below says what it is waiting for.
          </Text>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {(data?.capabilities ?? []).map((c) => (
            <Capability key={c.key} c={c} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Title order={2} size="md" className={TYPO.title()}>
            Modes
          </Title>
          <Text c="secondary" size="sm">
            Not capabilities: they do not fail, they change what everything else does.
          </Text>
          {(data?.modes ?? []).map((m) => (
            <Card key={m.key}>
              <Card.Header>
                <div className="flex flex-wrap items-center gap-2">
                  <Card.Title>{m.label}</Card.Title>
                  <Badge color={m.on ? "blue" : "gray"} size="sm">
                    {m.on ? (
                      <CircleCheck size={14} />
                    ) : (
                      <CircleSlash size={14} />
                    )}
                    {m.on ? "active" : "inactive"}
                  </Badge>
                  <code className={`${TYPO.mono()} text-gray-dark-500 text-xs`}>
                    {m.name}
                    {m.value ? `=${m.value}` : ""}
                  </code>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-col gap-2">
                  <Text c="secondary" size="sm">
                    {m.detail}
                  </Text>
                  {m.warn ? (
                    <Text size="sm" className="text-orange-300">
                      {m.warn}
                    </Text>
                  ) : null}
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </State>
  )
}
