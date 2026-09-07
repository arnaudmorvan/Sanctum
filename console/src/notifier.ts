import { createNotifier } from "@42/ui-react/notification"

/** A single instance for the console. `<Notifications />` is mounted by App; `notify` can be
 *  called from anywhere (copy to clipboard, deletion of a flow). */
export const { notify, Notifications } = createNotifier({ placement: "bottom-end" })
