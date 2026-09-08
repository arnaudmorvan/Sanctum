import { ActionIcon } from "@42/ui-react/action-icon"
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Field } from "@42/ui-react/field"
import { Input } from "@42/ui-react/input"
import { Menu } from "@42/ui-react/menu"
import { Modal } from "@42/ui-react/modal"
import { PasswordInput } from "@42/ui-react/password-input"
import { Select } from "@42/ui-react/select"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Copy, Ellipsis, KeyRound, Pencil, Trash2, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import {
  type Access,
  AccessError,
  type AccessUser,
  accessAction,
  AdminKeyError,
  MCP_URL,
  readAdminKey,
  writeAdminKey,
} from "../mcp"
import { notify } from "../notifier"
import { State, useRoute } from "../state"

/** The role names come from the server. An unknown role is not an error: it falls back to
 *  gray rather than making the row disappear. */
const COLOR: Record<string, string> = {
  reader: "gray",
  po: "blue",
  designer: "violet",
  admin: "green",
}

const ROLES = ["reader", "po", "designer", "admin"] as const

/** Who is acting. It goes into the commit message — since 2026-09-08 these commits are no
 *  longer only hand-made pushes, and "who granted which right to whom" is the whole reason
 *  this registry lives in git. Remembered so it is typed once. */
const WHO_KEY = "42ds.console.who"
const readWho = (): string => {
  try {
    return localStorage.getItem(WHO_KEY) ?? ""
  } catch {
    return ""
  }
}
const writeWho = (v: string): void => {
  try {
    v ? localStorage.setItem(WHO_KEY, v) : localStorage.removeItem(WHO_KEY)
  } catch {
    /* without storage the name lives for the session */
  }
}

const copy = async (text: string, what: string) => {
  try {
    await navigator.clipboard.writeText(text)
    notify.success({ title: `${what} copied`, duration: 2500 })
  } catch {
    notify.error({ title: "Cannot copy", description: "Select the text and copy it by hand." })
  }
}

// ------------------------------------------------------------ the second key

/** The administration key is asked for HERE, not on the sign-in screen: it opens the
 *  registry — i.e. it can mint a token that writes into the DS repo — and most visits to
 *  this console never touch it. */
const KeyGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [typed, setTyped] = useState("")
  return (
    <Alert type="info" variant="outline" title="Editing accesses needs a second key">
      <form
        className="flex flex-col gap-3 pt-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!typed.trim()) return
          writeAdminKey(typed.trim())
          setTyped("")
          onUnlock()
        }}
      >
        <Text c="secondary" size="sm">
          It is the <span className="font-mono">ACCESS_ADMIN_KEY</span> variable of the MCP
          service — deliberately not the console key, which only reads. It stays in your
          browser.
        </Text>
        <div className="flex items-end gap-2">
          <PasswordInput
            className="min-w-64"
            value={typed}
            placeholder="ACCESS_ADMIN_KEY"
            onChange={(e) => setTyped(e.currentTarget.value)}
          />
          <Button type="submit" size="sm" variant="filled" disabled={!typed.trim()}>
            Unlock
          </Button>
        </div>
      </form>
    </Alert>
  )
}

// ------------------------------------------------------------ create / edit

const UserModal = ({
  user,
  open,
  onClose,
  onDone,
}: {
  /** `null` = creation. An existing user = edition, and the id is then frozen: the token is
   *  derived from it, so renaming would silently revoke the person. */
  user: AccessUser | null
  open: boolean
  onClose: () => void
  onDone: (users: AccessUser[], token?: string, id?: string) => void
}) => {
  const editing = user !== null
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("reader")
  const [by, setBy] = useState(readWho())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setId(user?.id ?? "")
    setName(user?.name ?? "")
    setEmail(user?.email ?? "")
    setRole(user?.role ?? "reader")
    setBy(readWho())
    setError("")
    setBusy(false)
  }, [open, user])

  const submit = () => {
    if (busy || !id.trim()) return
    setBusy(true)
    setError("")
    writeWho(by.trim())
    accessAction(editing ? "update" : "create", {
      id: id.trim(),
      name: name.trim(),
      email: email.trim(),
      role,
      by: by.trim(),
    })
      .then((r) => {
        onDone(r.users ?? [], r.token, r.id)
        notify.success({
          title: editing ? `${r.id} updated` : `${r.id} now has access`,
          description: r.message,
          duration: 4000,
        })
        onClose()
      })
      .catch((e: Error) => {
        setError(
          e instanceof AdminKeyError
            ? "Administration key refused. Unlock the tab again."
            : e instanceof AccessError
              ? "Console key rejected. Sign in again."
              : e.message,
        )
        setBusy(false)
      })
  }

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && !busy && onClose()}
      title={editing ? `Edit ${user?.id}` : "Open an access"}
      description={
        editing
          ? "The identifier cannot change: the token is derived from it."
          : "The token is derived from the identifier — it is shown once, right after."
      }
      size="sm"
    >
      <form
        className="flex flex-col gap-4 pt-1"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field
          label="Identifier"
          description="Lowercase, no spaces. It is what the token carries."
        >
          <Input
            value={id}
            autoFocus={!editing}
            disabled={editing}
            autoComplete="off"
            spellCheck={false}
            placeholder="lea"
            className="font-mono"
            onChange={(e) => setId(e.currentTarget.value)}
          />
        </Field>

        <Field label="Name">
          <Input
            value={name}
            autoComplete="off"
            placeholder="Léa Martin"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </Field>

        <Field label="E-mail">
          <Input
            value={email}
            type="email"
            autoComplete="off"
            spellCheck={false}
            placeholder="lea@42.fr"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </Field>

        <Select
          label="Role"
          data={ROLES}
          value={role as (typeof ROLES)[number]}
          onChange={(v) => setRole(v ?? "reader")}
        />

        <Field label="Signed by" description="Goes into the commit message.">
          <Input
            value={by}
            autoComplete="off"
            placeholder="Arnaud"
            onChange={(e) => setBy(e.currentTarget.value)}
          />
        </Field>

        {error ? <Alert type="error" variant="light" title="Refused" description={error} /> : null}

        <Modal.Footer className="px-0 pb-0">
          <Button variant="subtle" size="sm" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="filled"
            size="sm"
            type="submit"
            disabled={!id.trim()}
            loading={busy}
          >
            {editing ? "Save" : "Open the access"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

// ------------------------------------------------------------ removal

const DeleteModal = ({
  user,
  onClose,
  onDone,
}: {
  user: AccessUser | null
  onClose: () => void
  onDone: (users: AccessUser[]) => void
}) => {
  const [typed, setTyped] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setTyped("")
    setError("")
    setBusy(false)
  }, [user])

  const confirmed = user !== null && typed.trim() === user.id

  const remove = () => {
    if (!user?.id || !confirmed) return
    setBusy(true)
    setError("")
    accessAction("delete", { id: user.id, by: readWho() })
      .then((r) => {
        onDone(r.users ?? [])
        notify.success({ title: `${user.id} removed`, description: r.message, duration: 4000 })
        onClose()
      })
      .catch((e: Error) => {
        setError(e instanceof AdminKeyError ? "Administration key refused." : e.message)
        setBusy(false)
      })
  }

  return (
    <Modal
      open={user !== null}
      onOpenChange={(o) => !o && !busy && onClose()}
      role="alertdialog"
      title="Remove this access?"
      description={user?.name ?? user?.id}
      size="sm"
    >
      <form
        className="flex flex-col gap-4 pt-1"
        onSubmit={(e) => {
          e.preventDefault()
          remove()
        }}
      >
        <Text size="sm" c="secondary">
          The line leaves <span className="font-mono">access/users.json</span> in one commit.
          Revoking is usually the better gesture: it keeps the line, and the reason it was
          there. Either way the person loses access immediately — and{" "}
          <span className="font-mono">git log</span> keeps the trace.
        </Text>

        <Field label="Type the identifier to confirm">
          <Input
            value={typed}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder={user?.id}
            className="font-mono"
            onChange={(e) => setTyped(e.currentTarget.value)}
          />
        </Field>

        {error ? <Alert type="error" variant="light" title="Refused" description={error} /> : null}

        <Modal.Footer className="px-0 pb-0">
          <Button variant="subtle" size="sm" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="red"
            size="sm"
            type="submit"
            disabled={!confirmed}
            loading={busy}
            startSlot={<Trash2 size={14} />}
          >
            Remove
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

// ------------------------------------------------------------ the token

const TokenModal = ({
  id,
  token,
  onClose,
}: {
  id: string
  token: string
  onClose: () => void
}) => (
  <Modal
    open={Boolean(token)}
    onOpenChange={(o) => !o && onClose()}
    title={`The token of ${id}`}
    description="Hand it over through a private channel."
    size="sm"
  >
    <div className="flex flex-col gap-4 pt-1">
      <div className="flex items-center gap-2 rounded-md border border-white/12 bg-white/4 ps-3 pe-1 py-1">
        <code className="min-w-0 flex-1 select-all break-all font-mono text-xs">{token}</code>
        <ActionIcon
          variant="subtle"
          size="sm"
          aria-label="Copy the token"
          onClick={() => copy(token, "Token")}
        >
          <Copy size={14} />
        </ActionIcon>
      </div>
      <Text size="sm" c="secondary">
        Nothing is stored: the token is derived from the identifier and{" "}
        <span className="font-mono">ACCESS_SECRET</span>, so it can be shown again at any
        time. In Claude Code, Claude Desktop or Figma Make it goes into the{" "}
        <span className="font-mono">Authorization: Bearer</span> header on{" "}
        <span className="font-mono">{MCP_URL}/mcp</span>; on claude.ai it is pasted once into
        the page the connector opens.
      </Text>
      <Modal.Footer className="px-0 pb-0">
        <Button variant="subtle" size="sm" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </div>
  </Modal>
)

// ------------------------------------------------------------ the tab

export const AccessView = ({ apiKey }: { apiKey: string }) => {
  const { data, error, loading, noKey } = useRoute<Access>("/console/access.json", apiKey)
  const [users, setUsers] = useState<AccessUser[] | null>(null)
  const [unlocked, setUnlocked] = useState(Boolean(readAdminKey()))
  const [editing, setEditing] = useState<AccessUser | null>(null)
  const [creating, setCreating] = useState(false)
  const [removing, setRemoving] = useState<AccessUser | null>(null)
  const [shown, setShown] = useState<{ id: string; token: string } | null>(null)

  // The server's answer seeds the table; every change replaces it with the registry AS
  // COMMITTED, so the tab never shows a state the file does not have.
  useEffect(() => {
    if (data) setUsers(data.users ?? [])
  }, [data])

  const rows = users ?? data?.users ?? []
  const canEdit = Boolean(data?.can_edit) && unlocked
  const editable = Boolean(data?.can_edit)

  /** Revoking and restoring are one click: they are the everyday gesture, and the
   *  confirmation lives in the fact that it is reversible by the same click. */
  const toggle = (u: AccessUser) => {
    if (!u.id) return
    accessAction("update", { id: u.id, active: !u.active, by: readWho() })
      .then((r) => {
        setUsers(r.users ?? [])
        notify.success({
          title: u.active ? `${u.id} revoked` : `${u.id} restored`,
          description: r.message,
          duration: 4000,
        })
      })
      .catch((e: Error) => {
        if (e instanceof AdminKeyError) {
          writeAdminKey("")
          setUnlocked(false)
        }
        notify.error({ title: "Refused", description: e.message })
      })
  }

  const reveal = (u: AccessUser) => {
    if (!u.id) return
    accessAction("token", { id: u.id })
      .then((r) => setShown({ id: u.id ?? "", token: r.token ?? "" }))
      .catch((e: Error) => notify.error({ title: "Refused", description: e.message }))
  }

  const applied = (next: AccessUser[], token?: string, id?: string) => {
    setUsers(next)
    if (token && id) setShown({ id, token })
  }

  return (
    <State loading={loading} error={error} data={data} noKey={noKey}>
      <div className="flex flex-col gap-5">
        {data?.read_only ? (
          <Alert
            color="orange"
            variant="light"
            title="Writing is closed on the server"
            description={`READ_ONLY is active on ${MCP_URL}: the write tools are not served, and an access cannot be changed from here.`}
          />
        ) : null}

        {editable && !unlocked ? <KeyGate onUnlock={() => setUnlocked(true)} /> : null}

        <Card variant="outline" padding="lg">
          <Card.Header>
            <Card.Title>Who has access</Card.Title>
            <div className="flex items-center gap-2">
              <Badge variant="light">{data?.regime ?? "—"}</Badge>
              {canEdit ? (
                <Button
                  size="sm"
                  variant="filled"
                  startSlot={<UserPlus size={14} />}
                  onClick={() => setCreating(true)}
                >
                  Open an access
                </Button>
              ) : null}
            </div>
          </Card.Header>
          <Card.Description>
            The registry lives in access/users.json, under version control: an access right
            changes rarely and deserves a history. It holds no secret — the tokens are derived
            from ACCESS_SECRET, which only lives in the server's environment.
          </Card.Description>
          <Card.Content>
            {data?.error ? (
              <Text c="muted">{data.error}</Text>
            ) : (
              <Table size="sm">
                <Table.Content>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>Identifier</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>E-mail</Table.HeaderCell>
                      <Table.HeaderCell>Role</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      {canEdit ? <Table.HeaderCell> </Table.HeaderCell> : null}
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {rows.map((u) => (
                      <Table.Row key={u.id}>
                        <Table.Cell className="font-mono">{u.id}</Table.Cell>
                        <Table.Cell>{u.name ?? "—"}</Table.Cell>
                        <Table.Cell>
                          {u.email ? (
                            <a className="underline decoration-dotted" href={`mailto:${u.email}`}>
                              {u.email}
                            </a>
                          ) : (
                            <Text c="muted" size="sm">
                              —
                            </Text>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant="light" color={COLOR[u.role ?? ""] ?? "gray"}>
                            {u.role ?? "—"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {u.active ? (
                            <Text size="sm">active</Text>
                          ) : (
                            <Text c="muted" size="sm">
                              revoked
                            </Text>
                          )}
                        </Table.Cell>
                        {canEdit ? (
                          <Table.Cell className="text-end">
                            <Menu
                              position="bottom-end"
                              data={[
                                {
                                  label: "Edit…",
                                  startSection: <Pencil size={16} />,
                                  onClick: () => setEditing(u),
                                },
                                {
                                  label: "Show the token",
                                  startSection: <KeyRound size={16} />,
                                  disabled: !data?.can_reveal,
                                  onClick: () => reveal(u),
                                },
                                { type: "divider" },
                                {
                                  label: u.active ? "Revoke" : "Restore",
                                  onClick: () => toggle(u),
                                },
                                {
                                  label: "Remove…",
                                  color: "red",
                                  startSection: <Trash2 size={16} />,
                                  onClick: () => setRemoving(u),
                                },
                              ]}
                            >
                              <ActionIcon
                                variant="subtle"
                                size="sm"
                                aria-label={`Actions — ${u.id}`}
                              >
                                <Ellipsis size={16} />
                              </ActionIcon>
                            </Menu>
                          </Table.Cell>
                        ) : null}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            )}
          </Card.Content>
        </Card>

        <Card variant="outline" padding="lg">
          <Card.Title>The roles</Card.Title>
          <Card.Description>
            An order, not a set: each role can do everything the previous one can.
          </Card.Description>
          <Card.Content>
            <div className="flex flex-col gap-2">
              {Object.entries(data?.roles ?? {}).map(([name, what]) => (
                <div key={name} className="flex items-baseline gap-3">
                  <Badge variant="light" color={COLOR[name] ?? "gray"}>
                    {name}
                  </Badge>
                  <Text c="secondary" size="sm">
                    {what}
                  </Text>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {editable ? (
          <Text c="muted" size="sm">
            Every change here is a commit in access/users.json, signed with the name you type:
            git log stays the answer to "who granted which right to whom, and when". A change
            that would leave no active administrator is refused by the server.
          </Text>
        ) : (
          <Text c="muted" size="sm">
            This tab is read-only: the server serves no administration route. Set
            ACCESS_ADMIN_KEY on the MCP service to open it — until then an access is opened by
            a commit in access/users.json, and the token is generated with
            tools/access-token.py.
          </Text>
        )}

        <UserModal
          user={editing}
          open={creating || editing !== null}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
          onDone={applied}
        />
        <DeleteModal user={removing} onClose={() => setRemoving(null)} onDone={setUsers} />
        <TokenModal
          id={shown?.id ?? ""}
          token={shown?.token ?? ""}
          onClose={() => setShown(null)}
        />
      </div>
    </State>
  )
}
