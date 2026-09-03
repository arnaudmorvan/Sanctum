import type { ReactNode } from "react"

/** Cadre commun à tous les parcours : une surface qui laisse voir le canvas, et rien de plus.
 *  Le contenu de l'écran vient du parcours ; ce cadre ne décide d'aucune mise en page. */
export const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="h-full overflow-auto">
    <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
  </div>
)
