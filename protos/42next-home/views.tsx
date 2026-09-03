import type { ProtoView } from "../../src/proto-types"
import { Home } from "./pages/home"
import { Rush } from "./pages/rush"

/** LE PARCOURS. Ajouter un ecran = ajouter une entree ici : la barre du bas et le routage
 *  s'en deduisent tous les deux. Un ecran absent d'ici est inatteignable. */
export const VIEWS: ProtoView[] = [
  { path: "home", label: "Home learner", render: () => <Home /> },
  {
    path: "rushes/:id",
    label: "Piscine Rush",
    href: "#/rushes/rush-01",
    render: ({ id }) => <Rush id={id} />,
  },
]
