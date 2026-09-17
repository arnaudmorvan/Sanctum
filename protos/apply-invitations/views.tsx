import { FileText, GraduationCap, History, House } from "lucide-react"
import type { ProtoNavItem, ProtoView } from "../../src/proto-types"
import { Compare } from "./pages/compare"
import { Inline } from "./pages/inline"
import { Journey } from "./pages/journey"
import { JourneyList } from "./pages/journey-list"
import { WithModal } from "./pages/with-modal"

/** Apply — Program invitations.
 *
 *  SOURCE: two screenshots of the live candidate screen (2026-09-17) — the Invitations
 *  list and the "Your path to 42" modal — plus a capture of the real product sidebar.
 *
 *  WHAT IS BEING REWORKED, and why. The shipped screen states two invitations as two
 *  identical rows, decides nothing (no campus, no path, no stakes), shouts the REFUSAL in
 *  red while the acceptance is a neutral white button, and threatens with an urgency the
 *  product cannot back: "This invitation won't last forever" — there is no response
 *  deadline in the data. review:storytelling rejects manufactured urgency, and
 *  review:components requires the button colour to follow the action.
 *
 *  THREE DIRECTIONS, same content, same data, one variable: WHERE the path is read.
 *    A (inline)  — no modal at all: the steps are in the card.
 *    B (modal)   — the card becomes decidable, the modal carries the decision.
 *    C (page)    — the path is a territory on its own page, the decision in the rail.
 *
 *  The CHROME is the skeleton's (`NAV` below) — never drawn inside the flow. */

/** Icons lifted from the sidebar capture of 2026-09-17: house, graduation-cap,
 *  history (the counter-clockwise arrow on PAST APPLICATIONS), file-text on PAPERWORK.
 *  The three rows with no `path` are categories: this flow holds the invitation screens,
 *  not the applications behind them, and the skeleton renders them non-clickable rather
 *  than pointing at nothing. */
export const NAV: ProtoNavItem[] = [
  { label: "Home", path: "compare", icon: <House size={16} /> },
  { label: "Active applications", icon: <GraduationCap size={16} /> },
  { label: "Past applications", icon: <History size={16} /> },
  { label: "Paperwork", icon: <FileText size={16} /> },
]

export const VIEWS: ProtoView[] = [
  { path: "compare", label: "Compare the 3 directions", render: () => <Compare /> },
  { path: "a", label: "A · Path inline", render: () => <Inline /> },
  { path: "b", label: "B · Card + modal", render: () => <WithModal /> },
  { path: "c", label: "C · List", render: () => <JourneyList /> },
  {
    path: "c/:program",
    label: "C · Path page",
    href: "#/c/selection-program",
    render: ({ program }) => <Journey program={program} />,
  },
]
