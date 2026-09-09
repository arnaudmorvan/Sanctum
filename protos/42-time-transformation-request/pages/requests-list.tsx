import { ActionIcon } from "@42/ui-react/action-icon"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { type ColumnDef, createColumnHelper, DataTable } from "@42/ui-react/data-table"
import { Input } from "@42/ui-react/input"
import { Menu } from "@42/ui-react/menu"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { ExternalLink, MoreVertical, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  REASON_OPTIONS,
  REQUEST_ROWS,
  type RequestRow,
  STATUS_OPTIONS,
} from "../data/requests"

/** THE FIGMA RACCORD, TRANSLATED.
 *
 *  In the mockup the eight cells of a row each carry `ON_CLICK → NAVIGATE` to the single
 *  detail frame `22705:11627`. A mockup has ONE frame per screen, so it cannot say "the
 *  detail OF THIS ROW" — it points every row at the same drawing. A route can, and that
 *  is the whole translation: one destination becomes one parameterized href.
 *
 *  It is deliberately NOT wired as a row click. The kit's own `onRowClick` says so in as
 *  many words ("not great with a11y", "never the row's only affordance"), so the link
 *  sits where a reader looks for it — on the identifying cell — and the kebab repeats it
 *  with the wording the mockup's own tooltip shows: "View request details". */
const detailHref = (login: string) => `#/learners/time-transformation/${login}`

/** "08/04/2026" → "2026-04-08". Without it the two date columns sort as strings that
 *  begin with a day, which is not a date order. */
const iso = (date: string) => date.split("/").reverse().join("-")

const column = createColumnHelper<RequestRow>()

/** The eight columns of the frame, in its order. What carries a sort and what carries a
 *  filter is read off the mockup's own header icons — nothing else is made sortable. */
// biome-ignore lint/suspicious/noExplicitAny: react-table's own array convention
const COLUMNS: ColumnDef<RequestRow, any>[] = [
  column.accessor("login", {
    header: "Username",
    enableSorting: false,
    cell: (cell) => (
      <a
        className="inline-flex items-center gap-2 hover:underline"
        href={detailHref(cell.getValue())}
      >
        <Avatar name={cell.getValue()} size="xs" color="name" />
        <span className={TYPO.mono("medium")}>{cell.getValue()}</span>
      </a>
    ),
  }),
  column.accessor("requestDate", {
    header: "Request date",
    sortingFn: (a, b) => iso(a.original.requestDate).localeCompare(iso(b.original.requestDate)),
  }),
  column.accessor("startDate", {
    header: "Start date",
    sortingFn: (a, b) => iso(a.original.startDate).localeCompare(iso(b.original.startDate)),
  }),
  column.accessor("durationDays", {
    header: "Duration",
    cell: (cell) => `${cell.getValue()} days`,
  }),
  column.accessor("reason", {
    header: "Reason",
    enableSorting: false,
    meta: { filter: { type: "select", options: REASON_OPTIONS, multiple: true } },
  }),
  column.accessor("details", {
    header: "Reason details",
    enableSorting: false,
    cell: (cell) => cell.getValue() || "—",
  }),
  column.accessor("status", {
    header: "Status",
    enableSorting: false,
    meta: { filter: { type: "select", options: STATUS_OPTIONS, multiple: true } },
    cell: (cell) => (
      <Badge variant="light" size="sm" color={cell.getValue() === "Incomplete" ? "red" : "orange"}>
        {cell.getValue()}
      </Badge>
    ),
  }),
  column.display({
    id: "actions",
    header: "Actions",
    cell: (cell) => {
      const { login } = cell.row.original
      return (
        <Menu
          data={[
            {
              label: "View request details",
              onClick: () => {
                window.location.hash = detailHref(login)
              },
            },
          ]}
        >
          <ActionIcon variant="subtle" size="sm" aria-label={`Actions for ${login}`}>
            <MoreVertical size={16} />
          </ActionIcon>
        </Menu>
      )
    },
  }),
]

/** The three segments of the frame. Only the first is drawn — see the panel below. */
const TABS: string[] = ["Requests (10)", "Past requests", "Staff transformations"]

/** Staff queue of time transformation requests.
 *
 *  The screen this one drills down into — `RequestDetail` — already existed; what the
 *  flow was missing is the list it is reached FROM, and the reason it can be built today
 *  is that the mockup finally says how: the raccord names the destination, the frame
 *  names the columns.
 *
 *  The search sits ABOVE the table, next to the segments, because that is where the frame
 *  puts it — not in the table's own toolbar (`enableGlobalFilter`), which is where the
 *  kit would put it by default. It filters on the login, which is what "Search learners"
 *  means on a queue keyed by learner. */
export const RequestsList = () => {
  const [tab, setTab] = useState<string>(TABS[0])
  const [search, setSearch] = useState("")

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return needle ? REQUEST_ROWS.filter((row) => row.login.includes(needle)) : REQUEST_ROWS
  }, [search])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Title order={1} size="2xl" className={TYPO.title()}>
          Time transformations
        </Title>
        {/* The frame underlines it and gives it no destination. So it is not a link here
            either — same rule the NAV rows follow in `views.tsx`: no dead links. */}
        <Text span size="sm" className="inline-flex w-fit items-center gap-1.5 underline">
          See documentation <ExternalLink size={14} />
        </Text>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SegmentGroup size="sm" data={TABS} value={tab} onChange={setTab} />
        {/* The width goes on a WRAPPER. `className` lands on the `<input>` itself, not on
            the shell that draws the border and holds `startSlot`, so a `w-72` passed to
            the component leaves the shell full-width and pushes the row onto two lines. */}
        <div className="w-72">
          <Input
            size="sm"
            placeholder="Search learners"
            startSlot={<Search size={16} />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {/* `sizing="auto"` — the frame sizes its columns from their content. The kit's
          default (`fixed`) gives all eight the same 150 px, which sums past the container
          and clips ACTIONS off the right edge.

          And NO initial sort, deliberately: the frame draws an ascending arrow on START
          DATE while its rows are NOT in that order (10/04 first, then 08/04) — the arrow
          is decoration. Sorting on load would reorder the seven rows and make the screen
          and its mockup impossible to read side by side. */}
      {tab === TABS[0] ? (
        <DataTable
          data={rows}
          columns={COLUMNS}
          getRowId={(row) => row.login}
          sizing="auto"
          pageSizeOptions={[20, 50]}
          initialState={{ pagination: { pageIndex: 0, pageSize: 20 } }}
        />
      ) : (
        <div className="rounded-sm border border-brand-900/20 p-8 text-center dark:border-white/15">
          <Text size="sm" c="secondary">
            “{tab}” is not drawn in the mockup — only the requests queue is.
          </Text>
        </div>
      )}
    </div>
  )
}
