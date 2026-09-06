import { createNotifier } from "@42/ui-react/notification"

/** Une seule instance pour la console. `<Notifications />` est montée par App ; `notify`
 *  s'appelle de n'importe où (copie dans le presse-papiers, suppression d'un parcours). */
export const { notify, Notifications } = createNotifier({ placement: "bottom-end" })
