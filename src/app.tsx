import { Button } from "@42/ui-react/button"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { useEffect, useState } from "react"
import { AppChrome } from "./layout/app-chrome"
import { AppLayout } from "./layout/app-layout"
import { ProtoViewBar } from "./layout/proto-view-bar"
// Le parcours du PO. `scripts/build-all.mjs` recopie protos/<slug>/ ici avant le build.
// Import en espace de noms : `NAV` est un export OPTIONNEL (voir proto-types.ts) — les
// parcours d'avant le chrome partagé ne l'ont pas, et doivent continuer de compiler.
import * as proto from "./proto/views"
import { hrefOf, matchView, type ProtoNavItem } from "./proto-types"
import { TYPO } from "./typo"

const VIEWS = proto.VIEWS
const NAV = (proto as Record<string, unknown>).NAV as ProtoNavItem[] | undefined
const TITRE = (import.meta.env.VITE_PROTO_TITRE as string | undefined) || undefined

const Inconnue = ({ hash }: { hash: string }) => (
  <div className="flex flex-col items-start gap-4">
    <Title order={1} size="2xl" className={TYPO.texte()}>
      Vue inconnue
    </Title>
    <Text c="secondary">
      Aucun écran ne correspond à <code className="font-mono">{hash || "#/"}</code>.
    </Text>
    {VIEWS[0] ? (
      <Button variant="light" size="sm" asChild>
        <a href={hrefOf(VIEWS[0])}>Revenir à « {VIEWS[0].label} »</a>
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

  // Pas de hash à l'ouverture : on entre par le premier écran déclaré.
  useEffect(() => {
    if (!window.location.hash && VIEWS[0]) window.location.hash = hrefOf(VIEWS[0]).slice(1)
  }, [])

  const match = matchView(VIEWS, hash)
  const ecran = match ? match.view.render(match.params) : <Inconnue hash={hash} />

  return (
    <div className="flex h-dvh flex-col">
      <div className="min-h-0 flex-1">
        {NAV ? (
          <AppChrome nav={NAV} views={VIEWS} currentPath={match?.view.path} titre={TITRE}>
            {ecran}
          </AppChrome>
        ) : (
          <AppLayout>{ecran}</AppLayout>
        )}
      </div>
      <ProtoViewBar views={VIEWS} current={match?.view} nav={NAV} titre={TITRE} />
    </div>
  )
}
