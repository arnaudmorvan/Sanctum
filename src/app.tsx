import { Button } from "@42/ui-react/button"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { AppChrome } from "./layout/app-chrome"
import { AppLayout } from "./layout/app-layout"
import { useEmbedBridge } from "./layout/embed"
import { BARE, IS_PAST_VERSION } from "./layout/env"
import { ProtoViewBar } from "./layout/proto-view-bar"
import { SidePanel } from "./layout/side-panel"
import { VersionBanner } from "./layout/version-banner"
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

  // Inside a frame of the compare page: say where we are, follow where we are sent.
  useEmbedBridge(BARE, VIEWS, hash)

  return (
    <div className="flex h-dvh flex-col">
      {/* A past version says so before anything else — and not in a frame: the compare
          page labels its two sides itself, and the banner would be drawn twice. */}
      {IS_PAST_VERSION && !BARE ? <VersionBanner /> : null}
      <div className="min-h-0 flex-1">
        {NAV ? (
          <AppChrome nav={NAV} views={VIEWS} currentPath={match?.view.path} title={TITLE}>
            {screen}
          </AppChrome>
        ) : (
          <AppLayout>{screen}</AppLayout>
        )}
      </div>
      {/* The bar and the panel are the tooling of ONE tab. In a frame (`?bare`, the
          compare page) they would be drawn twice and drive nothing: the page holding the
          frames carries its own. */}
      {BARE ? null : (
        <>
          <ProtoViewBar views={VIEWS} current={match?.view} nav={NAV} title={TITLE} />
          {/* The side panel (Feedback · Components · History) FLOATS over the flow: it is
              mounted here, beside the bar and not inside it — the bar is the flow's
              navigation, the panel is what one says ABOUT the flow. */}
          <SidePanel screen={match?.view.label} />
        </>
      )}
    </div>
  )
}
