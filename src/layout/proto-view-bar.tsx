import { hrefOf, type ProtoView } from "../proto-types"

/** La barre du bas : un lien par écran déclaré dans VIEWS. C'est ce qui rend le parcours
 *  NAVIGABLE sans que le PO n'ait à câbler quoi que ce soit — il ajoute une entrée, elle
 *  apparaît ici. Le lien « ← Tous les protos » ramène à la galerie du site. */
export const ProtoViewBar = ({
  views,
  current,
}: {
  views: ProtoView[]
  current?: ProtoView
}) => (
  <nav className="flex shrink-0 flex-wrap items-center gap-1 border-gray-dark-800 border-t bg-gray-dark-950 px-3 py-2">
    <a
      href="/"
      className="mr-2 rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs hover:text-white"
    >
      ← Tous les protos
    </a>
    {views
      .filter((v) => !v.hidden)
      .map((v) => {
        const on = v === current
        return (
          <a
            key={v.path}
            href={hrefOf(v)}
            aria-current={on ? "page" : undefined}
            className={`rounded-md px-2.5 py-1.5 text-xs transition-colors ${
              on
                ? "bg-white/10 font-semibold text-white"
                : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {v.label}
          </a>
        )
      })}
  </nav>
)
