import { Alert } from "@42/ui-react/alert"
import { Card } from "@42/ui-react/card"
import { Input } from "@42/ui-react/input"
import { NavLink } from "@42/ui-react/nav-link"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { type FileContent, get, type Tree } from "../mcp"
import { NoKey } from "../state"

/** The five corpora we want to see. These are folders of the repo, not concepts invented
 *  here: skills/ (the operating procedures served to agents), foundations/ (the taste rules),
 *  product/ (the 42next spec) and reports/ (the material not yet consolidated). The CHOICE of
 *  corpus lives in the sidebar (one sub-entry per corpus, with its count): this view does not
 *  ask for it again — that was the third navigation to the same place, after the header
 *  counters and the tabs. */
export const CORPORA = [
  {
    key: "components",
    label: "Components",
    dir: "context/components/items",
    what: "The catalogue exported from Figma: axes, variants, slots. Generated, never edited by hand.",
  },
  {
    key: "foundations",
    label: "Foundations",
    dir: "context/foundations",
    what: "The taste rules — what no catalogue carries.",
  },
  {
    key: "skills",
    label: "Skills",
    dir: "skills",
    what: "The operating procedures served to agents.",
  },
  {
    key: "product",
    label: "Product",
    dir: "context/product",
    what: "The 42next spec: what the screen is about.",
  },
  {
    key: "reports",
    label: "Reports",
    dir: "context/reports",
    what: "The material submitted, not yet consolidated.",
  },
] as const

export type CorpusKey = (typeof CORPORA)[number]["key"]

export const corpusOf = (key?: string) => CORPORA.find((c) => c.key === key) ?? CORPORA[0]

export const ContextView = ({ apiKey, corpus: corpusKey }: { apiKey: string; corpus: CorpusKey }) => {
  const corpus = corpusOf(corpusKey)
  const [filter, setFilter] = useState("")
  const [tree, setTree] = useState<Tree | null>(null)
  const [file, setFile] = useState<FileContent | null>(null)
  const [error, setError] = useState("")
  const [loadingFile, setLoadingFile] = useState(false)

  useEffect(() => {
    setTree(null)
    setFile(null)
    setError("")
    setFilter("")
    if (!apiKey) return // no key: nothing to ask for, the view says so itself
    get<Tree>(`/console/tree.json?dir=${encodeURIComponent(corpus.dir)}`)
      .then(setTree)
      .catch((e: Error) => setError(e.message))
  }, [corpus, apiKey])

  const open = (name: string) => {
    setLoadingFile(true)
    setFile(null)
    get<FileContent>(`/console/file.json?path=${encodeURIComponent(`${corpus.dir}/${name}`)}`)
      .then(setFile)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoadingFile(false))
  }

  const all = (tree?.entries ?? []).filter((e) => e.type !== "dir")
  // The component catalogue runs past fifty entries: without a filter, the column becomes a
  // wall you scroll through with the wheel.
  const files = filter
    ? all.filter((e) => e.name.toLowerCase().includes(filter.toLowerCase()))
    : all

  if (!apiKey) return <NoKey />

  return (
    <div className="flex flex-col gap-5">
      <Text c="secondary">{corpus.what}</Text>

      {error ? (
        <Alert type="error" variant="light" title="Cannot read" description={error} />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <Card variant="outline" padding="xs" className="flex max-h-[32rem] flex-col gap-1">
          <div className="px-1 pb-1">
            <Input
              size="sm"
              value={filter}
              placeholder={`Filter (${all.length})`}
              startSlot={<Search size={14} aria-hidden="true" />}
              onChange={(e) => setFilter(e.currentTarget.value)}
            />
          </div>
          <nav
            aria-label={`Files — ${corpus.label}`}
            className="flex flex-col gap-0.5 overflow-auto"
          >
            {!tree ? (
              <div className="flex items-center gap-2 p-3">
                <Spinner size="xs" />
                <Text c="muted" size="sm">
                  Loading…
                </Text>
              </div>
            ) : files.length === 0 ? (
              <Text c="muted" size="sm" className="p-3">
                {all.length === 0 ? "Empty folder." : "No file matches this filter."}
              </Text>
            ) : (
              files.map((e) => (
                // A navigation row, not a home-made button: same component as the sidebar, so
                // same current state, same focus, same density.
                <NavLink
                  key={e.name}
                  label={e.name}
                  current={file?.path.endsWith(`/${e.name}`) === true}
                  linkComponent="button"
                  linkOptions={{ type: "button", onClick: () => open(e.name) }}
                  classNames={{ row: "font-mono text-xs" }}
                />
              ))
            )}
          </nav>
        </Card>

        <Card variant="outline" padding="md" className="min-w-0">
          {loadingFile ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <Text c="secondary">Loading…</Text>
            </div>
          ) : file ? (
            <div className="flex flex-col gap-3">
              <Title order={2} size="sm">
                {file.path}
              </Title>
              {file.truncated ? (
                <Text c="muted" size="sm">
                  File truncated for display.
                </Text>
              ) : null}
              <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words font-mono text-gray-dark-300 text-xs">
                {file.content}
              </pre>
            </div>
          ) : (
            <Text c="muted">Pick a file on the left.</Text>
          )}
        </Card>
      </div>
    </div>
  )
}
