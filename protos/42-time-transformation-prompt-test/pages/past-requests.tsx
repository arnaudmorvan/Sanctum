import { ActionIcon } from "@42/ui-react/action-icon"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { type ColumnDef, createColumnHelper, DataTable } from "@42/ui-react/data-table"
import { Input } from "@42/ui-react/input"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { ExternalLink, LayoutGrid, Lock, Pencil, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  PAST_REQUESTS,
  type PastRequest,
  REASON_OPTIONS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
} from "../data/transformations"

const detailHref = (login: string) => `#/time-transformations/${login}`

/** "08/04/2026" → "2026-04-08". Without it the date column sorts as a string that begins
 *  with a day, which is not a date order. */
const iso = (date: string) => date.split("/").reverse().join("-")

const column = createColumnHelper<PastRequest>()

/** The nine columns of the spec, in its order. What carries a filter is what the spec
 *  draws a filter icon on — nothing else is made sortable or filterable. */
// biome-ignore lint/suspicious/noExplicitAny: react-table's own array convention
const COLUMNS: ColumnDef<PastRequest, any>[] = [
  column.accessor("login", {
    header: "Username",
    enableSorting: false,
    cell: (cell) => (
      <a className="inline-flex items-center gap-2 hover:underline" href={detailHref(cell.getValue())}>
        <Avatar name={cell.getValue()} size="xs" color="name" />
        <span className={TYPO.mono("medium")}>{cell.getValue()}</span>
      </a>
    ),
  }),
  column.accessor("type", {
    header: "Type",
    enableSorting: false,
    meta: { filter: { type: "select", options: TYPE_OPTIONS, multiple: true } },
    cell: (cell) => cell.getValue() ?? "—",
  }),
  column.accessor("startDate", {
    header: "Start date",
    sortingFn: (a, b) => iso(a.original.startDate).localeCompare(iso(b.original.startDate)),
    cell: (cell) => <span className={TYPO.mono("medium")}>{cell.getValue()}</span>,
  }),
  column.accessor("duration", {
    header: "Duration",
    cell: (cell) => <span className={TYPO.mono("medium")}>{cell.getValue()}</span>,
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
    /* A terminal decision is the stated exception to "a status badge is grey by default":
       the hue repeats what the label already says, it does not replace it. */
    cell: (cell) => (
      <Badge variant="light" size="sm" color={cell.getValue() === "Approved" ? "green" : "red"}>
        {cell.getValue()}
      </Badge>
    ),
  }),
  column.accessor("lastReviewedBy", { header: "Last reviewed by", enableSorting: false }),
  column.accessor("blocked", {
    header: "Restrictions",
    enableSorting: false,
    cell: (cell) =>
      cell.getValue() ? (
        <Badge variant="light" size="sm" color="orange">
          <Lock size={12} /> Blocked
        </Badge>
      ) : (
        "—"
      ),
  }),
  column.display({
    id: "actions",
    header: "",
    cell: (cell) => {
      const { login } = cell.row.original
      return (
        <span className="flex items-center gap-1">
          <ActionIcon variant="subtle" size="sm" aria-label={`Edit ${login}'s request`} asChild>
            <a href={detailHref(login)}>
              <Pencil size={16} />
            </a>
          </ActionIcon>
          <ActionIcon variant="subtle" size="sm" aria-label={`View ${login}'s request details`} asChild>
            <a href={detailHref(login)}>
              <LayoutGrid size={16} />
            </a>
          </ActionIcon>
        </span>
      )
    },
  }),
]

const TABS = ["Requests (10)", "Past requests", "Staff transformations"]

/** Screen 1 — the queue of decided requests.
 *
 *  Only the `Past requests` tab is described, so it is the one that opens and the only one
 *  that draws a table. The other two say why they are empty rather than faking rows.
 *
 *  The spec's pagination reads `1 2 3`, which belongs to the ten requests the first tab
 *  announces; this tab enumerates seven, so it paginates over seven. Inventing three more
 *  rows to reach a third page would be inventing content. */
export const PastRequests = () => {
  const [tab, setTab] = useState<string>(TABS[1])
  const [search, setSearch] = useState("")

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return needle ? PAST_REQUESTS.filter((row) => row.login.includes(needle)) : PAST_REQUESTS
  }, [search])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Title order={1} size="2xl" className={TYPO.title()}>
          Time transformations
        </Title>
        {/* The spec gives it no destination, so it is not a link — same rule the nav rows
            follow: no dead links. */}
        <Text span size="sm" className="inline-flex w-fit items-center gap-1.5 underline">
          See documentation <ExternalLink size={14} />
        </Text>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SegmentGroup size="sm" data={TABS} value={tab} onChange={setTab} />
        {/* The width goes on a WRAPPER: `className` lands on the `<input>`, not on the
            shell that draws the border and holds `startSlot`. */}
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

      {tab === TABS[1] ? (
        <DataTable
          data={rows}
          columns={COLUMNS}
          getRowId={(row) => row.login}
          sizing="auto"
          pageSizeOptions={[10, 20]}
          initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        />
      ) : (
        <div className="rounded-sm border border-brand-900/20 p-8 text-center dark:border-white/15">
          <Text size="sm" c="secondary">
            “{tab}” is named by the spec but never described — no rows are invented for it.
          </Text>
        </div>
      )}
    </div>
  )
}
