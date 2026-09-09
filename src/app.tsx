import { Button } from "@42/ui-react/button"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { AppChrome } from "./layout/app-chrome"
import { AppLayout } from "./layout/app-layout"
import { useEmbedBridge } from "./layout/embed"
import { BARE, FIGMA_VIEW, IS_PAST_VERSION } from "./layout/env"
import { FigmaView } from "./layout/figma-view"
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

// `?bare&figma`: this tab is not the flow, it is the MOCKUP the flow was translated from —
// one side of the compare page. Never on its own: without `?bare` the flow is a tab a PO
// walks, and the mockup belongs in the rail's "Source" panel.
const AS_MOCKUP = BARE && FIGMA_VIEW

export const App = () => {
  const [hash, setHash] = useState(() => window.location.hash)
  // Reported to the compare page, which lays BOTH sides out at that width — the condition
  // for the two to be superposable rather than merely adjacent.
  const [figmaWidth, setFigmaWidth] = useState(0)

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
  useEmbedBridge(BARE, VIEWS, hash, figmaWidth)

  return (
    <div className="flex h-dvh flex-col">
      {/* A past version says so before anything else — and not in a frame: the compare
          page labels its two sides itself, and the banner would be drawn twice. */}
      {IS_PAST_VERSION && !BARE ? <VersionBanner /> : null}
      <div className="min-h-0 flex-1">
        {AS_MOCKUP ? (
          <FigmaView current={match?.view} onWidth={setFigmaWidth} />
        ) : NAV ? (
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
          {/* The review rail and its panel FLOAT over the flow: mounted here, beside the bar
              and not inside it — the bar is the flow's navigation, the rail is everything
              one does WITH the flow (feedback, comments, components, history, and since
              2026-09-08 the map, the Figma source and the compare link). It takes the same
              four arguments as the bar: the map draws the whole flow, "Source" is attached
              to the current screen. */}
          <SidePanel views={VIEWS} nav={NAV} title={TITLE} current={match?.view} />
        </>
      )}
    </div>
  )
}
