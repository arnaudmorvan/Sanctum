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
import {
  AccessError,
  type Deletion,
  deleteFlow,
  getFlows,
  getScreenSource,
  type Repo,
} from "../mcp"
import { notify } from "../notifier"

export type Flow = {
  slug: string
  title: string
  author?: string
  summary?: string
  created_at?: string
  updated_at?: string
  ok?: boolean
  /** The flow's files, as `proto.json` lists them. Absent from a `protos.json` written
   *  before the screen list travelled: the modal then says so instead of showing nothing. */
  files?: string[]
}

// ------------------------------------------------------------ pending deletions
// Deleting a flow is ONE commit in the flows repo. The site itself only changes at the next
// deployment: `protos.json` is written by the build. In between — a few minutes — a reload
// would show the flow again as if nothing had happened, and you would conclude the deletion
// failed. So we remember locally what we deleted, and the card stays visible as "deletion in
// progress" until the build has really removed it. The entry clears itself once the slug
// disappears from protos.json.
//
// The key was renamed along with the rest (it used to end in `.suppressions`): a marker
// recorded before the rename is forgotten. That costs nothing — the badge is cosmetic and
// expires after two days anyway.
const DELETIONS_KEY = "42ds.console.deletions"
type Pending = Record<string, { commit: string; at: string }>
const TWO_DAYS = 48 * 3600 * 1000

const readDeletions = (): Pending => {
  try {
    const raw = JSON.parse(localStorage.getItem(DELETIONS_KEY) ?? "{}") as Pending
    const alive: Pending = {}
    for (const [slug, s] of Object.entries(raw)) {
      if (Date.now() - Date.parse(s.at) < TWO_DAYS) alive[slug] = s
    }
    return alive
  } catch {
    return {}
  }
}

const writeDeletions = (s: Pending) => {
  try {
    Object.keys(s).length
      ? localStorage.setItem(DELETIONS_KEY, JSON.stringify(s))
      : localStorage.removeItem(DELETIONS_KEY)
  } catch {
    /* without storage, the state lives for the session */
  }
}

// ------------------------------------------------------------ clipboard

const copy = async (text: string, what: string) => {
  try {
    await navigator.clipboard.writeText(text)
    notify.success({ title: `${what} copied`, duration: 2500 })
  } catch {
    notify.error({
      title: "Cannot copy",
      description: "Select the text and copy it by hand.",
    })
  }
}

/** A command line to copy. The text is mono — this is the machine — and the copy button is an
 *  ActionIcon: icon only, accessible name through `aria-label`. */
const Command = ({ label, text }: { label: string; text: string }) => (
  <div className="flex flex-col gap-1">
    <Text c="muted" size="xs">
      {label}
    </Text>
    <div className="flex items-center gap-2 rounded-md border border-white/12 bg-white/4 ps-3 pe-1 py-1">
      <code className="min-w-0 flex-1 select-all truncate font-mono text-gray-dark-100 text-xs">
        {text}
      </code>
      <ActionIcon variant="subtle" size="sm" aria-label={`Copy: ${label}`} onClick={() => copy(text, label)}>
        <Copy size={14} />
      </ActionIcon>
    </div>
  </div>
)

// ------------------------------------------------------------ "get the code" modal

/** A flow's screens, read from the file list `proto.json` carries. `pages/` is the
 *  convention every flow follows — the same one the MCP panel names its screens from. */
const screensOf = (files?: string[]) =>
  (files ?? [])
    .filter((f) => /^pages\/.+\.tsx?$/.test(f))
    .map((path) => ({
      path,
      label: path.slice("pages/".length).replace(/\.tsx?$/, "").replace(/[-_]/g, " "),
    }))

type Screen = ReturnType<typeof screensOf>[number]

/** One screen, and the two ways to leave with it: the code in the clipboard, or the file on
 *  GitHub. The source travels through the server — the flows repo is private — so without
 *  the console key the copy is closed, and says so rather than failing on click. */
const ScreenRow = ({
  flow,
  screen,
  repo,
  signedIn,
}: {
  flow: Flow
  screen: Screen
  repo?: Repo | null
  signedIn: boolean
}) => {
  const [busy, setBusy] = useState(false)
  const url = repo
    ? `${repo.url}/blob/${repo.branch}/${repo.protos_dir}/${flow.slug}/${screen.path}`
    : null

  const take = async () => {
    setBusy(true)
    try {
      const src = await getScreenSource(flow.slug, screen.path)
      // Several files land in one paste, each under its path: the dev splits them where they
      // belong. A block comment, not `//` — a stylesheet may be in there.
      const text =
        src.files.length === 1
          ? src.files[0].content
          : src.files.map((f) => `/* ── ${f.path} ── */\n${f.content}`).join("\n")
      const n = src.files.length
      await copy(text, `“${screen.label}” (${n} file${n > 1 ? "s" : ""})`)
      if (src.truncated) {
        notify.error({
          title: "Screen truncated",
          description:
            "It pulls in more of the flow than a copy can carry. Open the folder on GitHub.",
          duration: 8000,
        })
      }
    } catch (e) {
      notify.error({
        title: "Screen unavailable",
        description:
          e instanceof AccessError
            ? "The console key is required: the flows repo is private."
            : (e as Error).message,
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-white/12 bg-white/4 ps-3 pe-1 py-1">
      <span className="min-w-0 flex-1 truncate text-gray-dark-100 text-sm">{screen.label}</span>
      {url ? (
        <ActionIcon variant="subtle" size="sm" aria-label={`View on GitHub: ${screen.label}`} asChild>
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={14} />
          </a>
        </ActionIcon>
      ) : null}
      <ActionIcon
        variant="subtle"
        size="sm"
        aria-label={`Copy the code: ${screen.label}`}
        loading={busy}
        disabled={!signedIn}
        onClick={take}
      >
        <Copy size={14} />
      </ActionIcon>
    </div>
  )
}

const CodeModal = ({
  flow,
  repo,
  signedIn,
  onClose,
}: {
  flow: Flow | null
  repo?: Repo | null
  signedIn: boolean
  onClose: () => void
}) => {
  const dir = `${repo?.protos_dir ?? "protos"}/${flow?.slug ?? ""}`
  const dirUrl = repo ? `${repo.url}/tree/${repo.branch}/${dir}` : null
  const screens = screensOf(flow?.files)
  return (
    <Modal
      open={flow !== null}
      onOpenChange={(o) => !o && onClose()}
      title="Get the code"
      description={flow?.title}
      size="md"
    >
      <div className="flex flex-col gap-5 pt-1">
        {/* One screen first: nine times out of ten what is wanted is a screen to port into
            the product, not a prototype to run — and that need cost a full clone. */}
        <div className="flex flex-col gap-2">
          <Text c="muted" size="xs">
            Take one screen
          </Text>
          {flow && screens.length > 0 ? (
            <>
              {/* A flow can carry twenty-six screens: the list scrolls rather than pushing
                  the rest of the modal out of view. */}
              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {screens.map((sc) => (
                  <ScreenRow key={sc.path} flow={flow} screen={sc} repo={repo} signedIn={signedIn} />
                ))}
              </div>
              <Text c="muted" size="xs">
                Copies the screen and the flow files it imports (its fixtures, a shared block).
                The kit does not travel: it is imported by subpath from{" "}
                <span className="font-mono">@42/ui-react</span>, and the colours are the theme's
                CSS variables.
                {signedIn ? null : " Signing in with the console key unlocks the copy."}
              </Text>
            </>
          ) : (
            <Text c="muted" size="xs">
              {flow?.files
                ? "This flow declares no screen under pages/."
                : "The screen list arrives with the next deployment of the site."}
            </Text>
          )}
        </div>

        <div className="h-px bg-white/10" />

        <Text size="sm" c="secondary">
          To RUN it, the flow needs more than itself: it lives in{" "}
          <span className="font-mono">{dir}/</span> and depends on the skeleton (
          <span className="font-mono">src/</span>) and on the kit shipped with the repo (
          <span className="font-mono">vendor/ui-react/</span>). You clone the whole repo, then
          run this flow alone.
        </Text>

        {repo ? (
          <div className="flex flex-col gap-4">
            <Command label="Clone the repo" text={`git clone ${repo.clone}`} />
            <Command
              label="Install, then open this flow"
              text={`cd ${repo.name} && npm install && npm run dev ${flow?.slug ?? ""}`}
            />
            <Text c="muted" size="xs">
              The flow opens at <span className="font-mono">http://localhost:4244/</span>. What
              you edit really is <span className="font-mono">{dir}/</span> — the script puts a
              link there from <span className="font-mono">src/proto/</span>, not a copy.
            </Text>
          </div>
        ) : (
          <Alert
            type="warning"
            variant="light"
            title="Repo unknown to this build"
            description="The build found neither Railway variables nor a git remote: the folder is known, the URL is not. Ask Arnaud for access to the Sanctum repo."
          />
        )}

        <Modal.Footer className="px-0 pb-0">
          {dirUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={dirUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={14} aria-hidden="true" />
                View on GitHub
              </a>
            </Button>
          ) : null}
          <Button variant="subtle" size="sm" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  )
}

// ------------------------------------------------------------ deletion modal

const DeleteModal = ({
  flow,
  onClose,
  onDeleted,
}: {
  flow: Flow | null
  onClose: () => void
  onDeleted: (s: Deletion) => void
}) => {
  const [typed, setTyped] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  // Every opening starts clean: what was typed for a previous deletion must not pre-confirm
  // the next one.
  useEffect(() => {
    setTyped("")
    setError("")
    setBusy(false)
  }, [flow])

  const confirmed = flow !== null && typed.trim() === flow.slug

  const remove = () => {
    if (!flow || !confirmed) return
    setBusy(true)
    setError("")
    deleteFlow(flow.slug)
      .then((s) => {
        onDeleted(s)
        onClose()
      })
      .catch((e: Error) => {
        setError(
          e instanceof AccessError
            ? "Key rejected. Sign in again with the MCP service's DASHBOARD_KEY."
            : e.message,
        )
        setBusy(false)
      })
  }

  return (
    <Modal
      open={flow !== null}
      onOpenChange={(o) => !o && !busy && onClose()}
      role="alertdialog"
      title="Delete this flow?"
      description={flow?.title}
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
          The <span className="font-mono">protos/{flow?.slug}/</span> folder is removed from the
          repo in one commit. The flow disappears from the site at the next deployment — a few
          minutes. It stays in the git history: a <span className="font-mono">git revert</span>{" "}
          brings it back.
        </Text>

        <Field
          label="Type the slug to confirm"
          description={<span className="font-mono">{flow?.slug}</span>}
        >
          <Input
            value={typed}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder={flow?.slug}
            className="font-mono"
            onChange={(e) => setTyped(e.currentTarget.value)}
          />
        </Field>

        {error ? (
          <Alert type="error" variant="light" title="Deletion refused" description={error} />
        ) : null}

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
            Delete
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

// ------------------------------------------------------------ the gallery

export const FlowsView = ({ signedIn, repo }: { signedIn: boolean; repo?: Repo | null }) => {
  const [flows, setFlows] = useState<Flow[] | null>(null)
  const [error, setError] = useState("")
  const [pending, setPending] = useState<Pending>(readDeletions)
  const [codeOf, setCodeOf] = useState<Flow | null>(null)
  const [deleteOf, setDeleteOf] = useState<Flow | null>(null)

  useEffect(() => {
    getFlows<Flow[]>()
      .then((list) => {
        setFlows(list)
        // The build did its job: what is no longer in protos.json is no longer "pending".
        setPending((prev) => {
          const present = new Set(list.map((p) => p.slug))
          const left: Pending = {}
          for (const [slug, s] of Object.entries(prev)) if (present.has(slug)) left[slug] = s
          writeDeletions(left)
          return left
        })
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  const markDeleted = (s: Deletion) => {
    setPending((prev) => {
      const next = { ...prev, [s.slug]: { commit: s.commit, at: new Date().toISOString() } }
      writeDeletions(next)
      return next
    })
    notify.success({
      title: "Flow deleted",
      description: `Commit ${s.commit} — ${s.files} file${s.files > 1 ? "s" : ""}. It disappears from the site at the next deployment.`,
      duration: 8000,
    })
  }

  if (error)
    return <Alert type="error" variant="light" title="List unavailable" description={error} />
  if (!flows) return <Text c="secondary">Loading…</Text>

  if (flows.length === 0)
    return (
      <Card variant="outline" padding="xl">
        <Card.Header>
          <Card.Title>No prototype yet</Card.Title>
          <Card.Description>
            A PO publishes one from a Claude conversation: "build me a flow for…". No git, no
            installation.
          </Card.Description>
        </Card.Header>
      </Card>
    )

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {flows.map((p) => {
          const broken = p.ok === false
          const deleted = pending[p.slug]
          return (
            <Card
              key={p.slug}
              variant="outline"
              padding="lg"
              className={deleted ? "opacity-60" : undefined}
            >
              <Card.Header className="flex-row items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <Card.Title className="truncate">{p.title}</Card.Title>
                  {broken || deleted ? (
                    <div className="flex flex-wrap gap-1">
                      {broken ? (
                        <Badge color="red" variant="light" size="sm">
                          build failed
                        </Badge>
                      ) : null}
                      {deleted ? (
                        <Badge color="gray" variant="outline" size="sm">
                          deletion in progress · {deleted.commit}
                        </Badge>
                      ) : null}
                    </div>
                  ) : null}
                  {p.summary ? <Card.Description>{p.summary}</Card.Description> : null}
                </div>
                {/* The rare actions — clone, delete — in a menu: the card carries only ONE
                    visible button, the one you look for nine times out of ten. */}
                <Menu
                  position="bottom-end"
                  data={[
                    {
                      label: "Get the code",
                      startSection: <Code2 size={16} />,
                      onClick: () => setCodeOf(p),
                    },
                    { type: "divider" },
                    {
                      label: signedIn ? "Delete…" : "Delete… (key required)",
                      color: "red",
                      startSection: <Trash2 size={16} />,
                      disabled: !signedIn || deleted !== undefined,
                      onClick: () => setDeleteOf(p),
                    },
                  ]}
                >
                  <ActionIcon variant="subtle" size="sm" aria-label={`Actions — ${p.title}`}>
                    <Ellipsis size={16} />
                  </ActionIcon>
                </Menu>
              </Card.Header>
              <Card.Content>
                <Text c="muted" size="sm">
                  {p.author ?? "—"}
                  {p.updated_at ? (
                    <>
                      {" · updated on "}
                      <span className="font-mono">{p.updated_at}</span>
                    </>
                  ) : null}
                </Text>
              </Card.Content>
              <Card.Footer className="justify-start">
                <Button variant="light" size="sm" disabled={broken} asChild={!broken}>
                  {broken ? <span>Unavailable</span> : <a href={`/p/${p.slug}/`}>Open the flow</a>}
                </Button>
              </Card.Footer>
            </Card>
          )
        })}
      </div>

      <CodeModal
        flow={codeOf}
        repo={repo}
        signedIn={signedIn}
        onClose={() => setCodeOf(null)}
      />
      <DeleteModal flow={deleteOf} onClose={() => setDeleteOf(null)} onDeleted={markDeleted} />
    </>
  )
}
