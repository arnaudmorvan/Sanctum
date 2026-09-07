import { Button } from "@42/ui-react/button"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { AppChrome } from "./layout/app-chrome"
import { AppLayout } from "./layout/app-layout"
import { Feedback } from "./layout/feedback"
import { ProtoViewBar } from "./layout/proto-view-bar"
// The PO's flow. `scripts/build-all.mjs` copies protos/<slug>/ here before the build.
// Namespace import: `NAV` is an OPTIONAL export (see proto-types.ts) — flows from before
// the shared chrome do not have it, and must keep compiling.
import * as proto from "./proto/views"
import { hrefOf, matchView, type ProtoNavItem } from "./proto-types"
import { TYPO } from "./typo"

const VIEWS = proto.VIEWS
const NAV = (proto as Record<string, unknown>).NAV as ProtoNavItem[] | undefined
const TITLE = (import.meta.env.VITE_PROTO_TITLE as string | undefined) || undefined

const Unknown = ({ hash }: { hash: string }) => (
  <div className="flex flex-col items-start gap-4">
    <Title order={1} size="2xl" className={TYPO.title()}>
      Unknown view
    </Title>
    <Text c="secondary">
      No screen matches <code className="font-mono">{hash || "#/"}</code>.
    </Text>
    {VIEWS[0] ? (
      <Button variant="light" size="sm" asChild>
        <a href={hrefOf(VIEWS[0])}>Back to “{VIEWS[0].label}”</a>
      </Button>
    ) : null}
  </div>
)

export const App = () => {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // No hash on opening: we enter through the first declared screen.
  useEffect(() => {
    if (!window.location.hash && VIEWS[0]) window.location.hash = hrefOf(VIEWS[0]).slice(1)
  }, [])

  const match = matchView(VIEWS, hash)
  const screen = match ? match.view.render(match.params) : <Unknown hash={hash} />

  return (
    <div className="flex h-dvh flex-col">
      <div className="min-h-0 flex-1">
        {NAV ? (
          <AppChrome nav={NAV} views={VIEWS} currentPath={match?.view.path} title={TITLE}>
            {screen}
          </AppChrome>
        ) : (
          <AppLayout>{screen}</AppLayout>
        )}
      </div>
      <ProtoViewBar views={VIEWS} current={match?.view} nav={NAV} title={TITLE} />
      {/* The feedback widget FLOATS over the flow: it is mounted here, beside the bar and
          not inside it, because it is no longer one of the bar's buttons. */}
      <Feedback screen={match?.view.label} />
    </div>
  )
}
