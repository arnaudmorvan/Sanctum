import { ActionIcon } from "@42/ui-react/action-icon"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { AppShell } from "@42/ui-react/app-shell"
import { NavLink } from "@42/ui-react/nav-link"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import {
  Activity,
  BookOpen,
  KeyRound,
  LayoutGrid,
  Plug,
  GitCompare,
  ListChecks,
  LogOut,
  Menu as MenuIcon,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react"
import { lazy, type ReactNode, Suspense, useEffect, useState } from "react"
import { Logo42 } from "../../src/layout/logo-42"
import { TYPO } from "../../src/typo"
import { Login } from "./login"
import {
  AccessError,
  checkKey,
  getFlows,
  getVersion,
  readKey,
  type Summary,
  type Version,
  writeKey,
} from "./mcp"
import { Notifications } from "./notifier"
import { AccessView } from "./views/access"
import { ConfigView } from "./views/config"
import { ContextView, CORPORA, type CorpusKey, corpusOf } from "./views/context"
import { ConnectorsView } from "./views/connectors"
import { ObservabilityView } from "./views/observability"
import { FlowsView } from "./views/protos"
import { QualityView } from "./views/quality"
import { SessionsView } from "./views/sessions"

/** ⚠️ The Parity tab is loaded ON DEMAND, and it is the only one that is.
 *
 *  It mounts the real `@42/ui-react` components next to the Figma frames, so it imports
 *  fifty of them — which took the console bundle from 500 KB to 790 KB, on every tab,
 *  for a page most sessions never open. Split out, the seven other tabs pay nothing and
 *  the parity chunk arrives while its own report is still being fetched. */
const ParityView = lazy(() =>
  import("./views/parity").then((m) => ({ default: m.ParityView })),
)

type Status = "checking" | "out" | "in"

/** The sections of the console. ONE navigation — the sidebar — and nothing else: the previous
 *  version stacked three paths to the same place (the header counters, the tabs, then the row
 *  of corpora inside Context). Here the sidebar carries everything, corpora and counts
 *  included, and the URL (`#/context/skills`) says where you are. */
type Section = {
  v: string
  label: string
  icon: ReactNode
  /** This section reads the MCP server: with no key, it shows the sign-in screen. */
  keyRequired: boolean
  sub: string
}

const SECTIONS: Section[] = [
  {
    v: "protos",
    label: "Prototypes",
    icon: <LayoutGrid size={16} />,
    keyRequired: false,
    sub: "The clickable flows published by the POs. Open to anyone with the URL.",
  },
  {
    v: "context",
    label: "Context",
    icon: <BookOpen size={16} />,
    keyRequired: true,
    sub: "What the server serves to agents: the catalogue, the rules, the skills, the product spec.",
  },
  {
    v: "parity",
    label: "Parity",
    icon: <GitCompare size={16} />,
    keyRequired: true,
    sub: "Figma against @42/ui-react, component by component: what is paired, what is missing, and on which side.",
  },
  {
    v: "observability",
    label: "Observability",
    icon: <Activity size={16} />,
    keyRequired: true,
    sub: "Usage of the MCP server: calls, tools, clients, latency.",
  },
  {
    v: "sessions",
    label: "Sessions",
    icon: <Users size={16} />,
    keyRequired: true,
    sub: "Every conversation that talked to the server, and its friction.",
  },
  {
    v: "connectors",
    label: "Connectors",
    icon: <Plug size={16} />,
    keyRequired: true,
    sub: "Which tool list each person's connector still carries, and who to ping when it moves.",
  },
  {
    v: "quality",
    label: "Quality",
    icon: <ListChecks size={16} />,
    keyRequired: true,
    sub: "The curve of generations: what the gate measured, report after report.",
  },
  {
    v: "access",
    label: "Access",
    icon: <ShieldCheck size={16} />,
    keyRequired: true,
    sub: "Who is allowed to write, and under which regime.",
  },
  {
    v: "config",
    label: "Configuration",
    icon: <SlidersHorizontal size={16} />,
    keyRequired: true,
    sub: "What the server is wired to: every capability, its state, and what it is waiting for.",
  },
]

/** The hash is the navigation state: `#/context/skills`. A reload, a shared link, a "← All
 *  the flows" from inside a flow all land back in the right place. */
const readRoute = (): { section: string; param?: string } => {
  const [section, param] = window.location.hash.replace(/^#\/?/, "").split("/")
  return { section: section || "protos", param: param || undefined }
}

const Count = ({ n }: { n?: number }) => (
  <span className={`${TYPO.mono()} text-gray-dark-400 text-xs`}>{n ?? "—"}</span>
)

export const App = () => {
  const [apiKey, setApiKey] = useState(readKey())
  // We start in `checking` when a key is already stored: it may have been revoked since. The
  // check does not block the page — it only keeps the sections that read the server closed
  // for the duration of the round trip.
  const [status, setStatus] = useState<Status>(readKey() ? "checking" : "out")
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState("")
  const [route, setRoute] = useState(readRoute)
  const [flowCount, setFlowCount] = useState<number | undefined>(undefined)
  const [version, setVersion] = useState<Version | null>(null)

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener("hashchange", onHash)
    if (!window.location.hash) window.location.hash = "#/protos"
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // Same origin, no key: the number of flows and the build stamp are files written by the
  // build. They have no reason to wait for sign-in.
  useEffect(() => {
    getFlows<unknown[]>()
      .then((l) => setFlowCount(l.length))
      .catch(() => setFlowCount(undefined))
    getVersion()
      .then(setVersion)
      .catch(() => setVersion(null))
  }, [])

  const signIn = (candidate: string) => {
    setError("")
    setStatus("checking")
    checkKey(candidate)
      .then((r) => {
        writeKey(candidate)
        setApiKey(candidate)
        setSummary(r)
        setStatus("in")
      })
      .catch((e: Error) => {
        setError(
          e instanceof AccessError
            ? "This is not the server's key. It is the DASHBOARD_KEY variable, not its name."
            : e.message,
        )
        setStatus("out")
      })
  }

  // Check on load when a key is already stored.
  useEffect(() => {
    if (status === "checking" && !summary && apiKey) signIn(apiKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = () => {
    writeKey("")
    setApiKey("")
    setSummary(null)
    setError("")
    setStatus("out")
  }

  const signedIn = status === "in"
  const section = SECTIONS.find((s) => s.v === route.section) ?? SECTIONS[0]
  const corpus = corpusOf(route.param).key as CorpusKey

  // The Context group opens when you enter it (by link, by URL, by the footer) and stays
  // collapsible by hand afterwards. `defaultOpen` would not be enough: it only applies on the
  // first render, not when you reach the section from another one.
  const [contextOpen, setContextOpen] = useState(section.v === "context")
  useEffect(() => {
    if (section.v === "context") setContextOpen(true)
  }, [section.v])

  const view = (): ReactNode => {
    switch (section.v) {
      case "protos":
        return <FlowsView signedIn={signedIn} repo={version?.repo} />
      case "context":
        return <ContextView apiKey={apiKey} corpus={corpus} />
      case "parity":
        return (
          <Suspense
            fallback={
              <div className="flex items-center gap-2 py-8">
                <Spinner size="sm" />
                <Text c="secondary">Loading the comparator…</Text>
              </div>
            }
          >
            <ParityView />
          </Suspense>
        )
      case "observability":
        return <ObservabilityView apiKey={apiKey} />
      case "sessions":
        return <SessionsView apiKey={apiKey} />
      case "connectors":
        return <ConnectorsView apiKey={apiKey} />
      case "quality":
        return <QualityView apiKey={apiKey} />
      case "access":
        return <AccessView apiKey={apiKey} />
      case "config":
        return <ConfigView apiKey={apiKey} />
      default:
        return null
    }
  }

  // The sign-in screen takes the place of the requested section: it occupies the field of
  // vision where something is missing, without confiscating the rest of the console.
  const content = (): ReactNode => {
    if (!section.keyRequired || signedIn) return view()
    if (status === "checking")
      return (
        <div className="flex items-center gap-2 py-8">
          <Spinner size="sm" />
          <Text c="secondary">Checking the key…</Text>
        </div>
      )
    return <Login onSubmit={signIn} error={error} busy={false} />
  }

  const link = (section: string, param?: string) => ({
    linkComponent: "a" as const,
    linkOptions: { href: param ? `#/${section}/${param}` : `#/${section}` },
  })

  const counts: Partial<Record<CorpusKey, number | undefined>> = {
    components: summary?.components,
    foundations: summary?.foundations,
    skills: summary?.skills,
    product: summary?.product,
    reports: summary?.reports,
  }

  return (
    <AppShell className="bg-transparent">
      <AppShell.Sidebar size="sm">
        <AppShell.SidebarHeader className="gap-3 px-4">
          <Logo42 className="h-6 w-auto shrink-0" />
          <span className={`${TYPO.nav} text-gray-dark-400 text-xs`}>Console</span>
        </AppShell.SidebarHeader>

        <AppShell.SidebarBody className="flex flex-col gap-1">
          {SECTIONS.map((s) =>
            s.v === "context" ? (
              // The corpora are SUB-ENTRIES, with their count: what the header counters showed
              // without letting you go there, and what the row of buttons in the view
              // repeated. The counts only exist once you have the key.
              <NavLink
                key={s.v}
                label={s.label}
                icon={s.icon}
                current={section.v === s.v}
                open={contextOpen}
                onOpenChange={setContextOpen}
                classNames={{ row: TYPO.nav }}
                {...link(s.v)}
              >
                {CORPORA.map((c) => (
                  <NavLink
                    key={c.key}
                    label={c.label}
                    current={section.v === "context" && corpus === c.key}
                    suffix={signedIn ? <Count n={counts[c.key]} /> : undefined}
                    {...link("context", c.key)}
                  />
                ))}
              </NavLink>
            ) : (
              <NavLink
                key={s.v}
                label={s.label}
                icon={s.icon}
                current={section.v === s.v}
                suffix={s.v === "protos" ? <Count n={flowCount} /> : undefined}
                classNames={{ row: TYPO.nav }}
                {...link(s.v)}
              />
            ),
          )}
        </AppShell.SidebarBody>

        <AppShell.SidebarFooter className="flex flex-col gap-2 border-white/10 border-t">
          {signedIn ? (
            <NavLink
              label="Sign out"
              icon={<LogOut size={16} />}
              linkComponent="button"
              linkOptions={{ type: "button", onClick: signOut }}
            />
          ) : (
            <NavLink
              label="Read key"
              icon={<KeyRound size={16} />}
              suffix={status === "checking" ? <Spinner size="xs" /> : undefined}
              // A closed section: the sign-in screen shows up in its place.
              {...link("context")}
            />
          )}
          {/* The build stamp, in the footer: "which commit is being served?" must not require
              a curl. This is what gives away a Railway Redeploy that replayed an old
              snapshot. */}
          {version ? (
            <Text c="muted" size="xs" className="px-2.5">
              Deployed{" "}
              {version.repo && version.commit ? (
                <a
                  href={`${version.repo.url}/commit/${version.commit}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono underline-offset-2 hover:underline"
                >
                  {version.commit.slice(0, 7)}
                </a>
              ) : (
                <span className="font-mono">{version.commit?.slice(0, 7) ?? "—"}</span>
              )}
              {" · "}
              <span className="font-mono">{version.built_at.slice(0, 10)}</span>
            </Text>
          ) : null}
        </AppShell.SidebarFooter>
      </AppShell.Sidebar>

      <AppShell.Main>
        <AmbientBackground />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
          <header className="flex items-start gap-3">
            {/* Only exists below the breakpoint: the sidebar becomes a drawer there. */}
            <AppShell.SidebarTrigger asChild>
              <ActionIcon variant="subtle" size="md" aria-label="Open the navigation">
                <MenuIcon size={18} />
              </ActionIcon>
            </AppShell.SidebarTrigger>
            <div className="flex flex-col gap-1">
              <Title order={1} size="2xl" className={TYPO.title()}>
                {section.v === "context" ? corpusOf(corpus).label : section.label}
              </Title>
              <Text c="secondary">{section.sub}</Text>
            </div>
          </header>
          {content()}
        </div>
      </AppShell.Main>

      <Notifications />
    </AppShell>
  )
}
