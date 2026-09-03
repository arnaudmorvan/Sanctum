import type { ProtoView } from "../../src/proto-types"
import { Detail } from "./pages/detail"
import { Liste } from "./pages/liste"

/** LE PARCOURS. Ajouter un écran = ajouter une entrée ici : la barre du bas et le routage
 *  s'en déduisent tous les deux. Un écran absent d'ici est inatteignable. */
export const VIEWS: ProtoView[] = [
  { path: "demandes", label: "Liste des demandes", render: () => <Liste /> },
  {
    path: "demandes/:id",
    label: "Détail d'une demande",
    href: "#/demandes/d-1",
    render: ({ id }) => <Detail id={id} />,
  },
]
