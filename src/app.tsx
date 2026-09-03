import { useEffect, useState } from "react"
import { AppLayout } from "./layout/app-layout"
import { ProtoViewBar } from "./layout/proto-view-bar"
// Le parcours du PO. `scripts/build-all.mjs` recopie protos/<slug>/ ici avant le build.
import { VIEWS } from "./proto/views"
import { hrefOf, matchView } from "./proto-types"

const Inconnue = ({ hash }: { hash: string }) => (
  <div className="flex flex-col items-start gap-4">
    <h1 className="font-semibold text-2xl text-white">Vue inconnue</h1>
    <p className="text-gray-dark-400">
      Aucun écran ne correspond à <code className="font-mono">{hash || "#/"}</code>.
    </p>
    {VIEWS[0] ? (
      <a
        href={hrefOf(VIEWS[0])}
        className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
      >
        Revenir à « {VIEWS[0].label} »
      </a>
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

  return (
    <div className="flex h-dvh flex-col">
      <div className="min-h-0 flex-1">
        <AppLayout>{match ? match.view.render(match.params) : <Inconnue hash={hash} />}</AppLayout>
      </div>
      <ProtoViewBar views={VIEWS} current={match?.view} />
    </div>
  )
}
