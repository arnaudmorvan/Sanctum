import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ActionIcon } from "@42/ui-react/action-icon"
import { Button } from "@42/ui-react/button"
import { DataTable } from "@42/ui-react/data-table"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Tooltip } from "@42/ui-react/tooltip"
import { CalendarClock, ListChecks } from "lucide-react"
import { TYPO } from "../../../src/typo"
import { PROGRAM_SESSIONS, formatApplicants, type ProgramSession } from "../data/sessions"

const go = (hash: string) => {
  window.location.hash = hash
}

function Breakdown({ session }: { session: ProgramSession }) {
  const b = session.breakdown
  const lines: Array<[string, number]> = [
    ["Applied", b.applied],
    ["Selected", b.selected],
    ["Confirmed", b.confirmed],
    ["Onboarded", b.onboarded],
    ["Max capacity", b.maxCapacity],
  ]
  return (
    <div className="flex flex-col gap-1">
      {lines.map(([label, value]) => (
        <Text key={label} size="sm">
          {label}: {value}
        </Text>
      ))}
    </div>
  )
}

export function Sessions() {
  const [tab, setTab] = useState<"active" | "archived">("active")

  const rows = useMemo(
    () => PROGRAM_SESSIONS.filter((session) => (tab === "archived" ? session.archived : !session.archived)),
    [tab],
  )

  const columns = useMemo<ColumnDef<ProgramSession, any>[]>(
    () => [
      { accessorKey: "name", header: "Name", size: 120 },
      { accessorKey: "program", header: "Program", size: 150 },
      { accessorKey: "campus", header: "Campus", size: 110 },
      {
        id: "applicants",
        header: "Applicants",
        size: 130,
        enableSorting: false,
        cell: ({ row }) => (
          <Tooltip label={<Breakdown session={row.original} />}>
            <Text span size="sm" className={TYPO.mono("medium")}>
              {formatApplicants(row.original)}
            </Text>
          </Tooltip>
        ),
      },
      { accessorKey: "startDate", header: "Start date", size: 120 },
      {
        id: "endDate",
        header: "End date",
        size: 120,
        cell: ({ row }) => (
          <Text span size="sm">
            {row.original.endDate ?? "\u2014"}
          </Text>
        ),
      },
      {
        id: "onboarding",
        header: "Onboarding",
        size: 130,
        enableSorting: false,
        cell: ({ row }) => (
          <Button variant="subtle" size="xs" onClick={() => go("/sessions/" + row.original.id)}>
            {row.original.onboardingSessions} sessions
          </Button>
        ),
      },
      { accessorKey: "registrationStatus", header: "Registration status", size: 210 },
      {
        id: "actions",
        header: "Actions",
        size: 110,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Tooltip label="See applicants">
              <ActionIcon
                variant="subtle"
                size="sm"
                aria-label="See applicants"
                onClick={() => go("/sessions/" + row.original.id + "/applicants")}
              >
                <ListChecks size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Onboarding sessions">
              <ActionIcon
                variant="subtle"
                size="sm"
                aria-label="Onboarding sessions"
                onClick={() => go("/sessions/" + row.original.id)}
              >
                <CalendarClock size={16} />
              </ActionIcon>
            </Tooltip>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Title order={1} size="3xl" className={TYPO.title()}>
          Program sessions applications
        </Title>
        <SegmentGroup
          size="sm"
          data={[
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ]}
          value={tab}
          onChange={(value) => setTab(value as "active" | "archived")}
        />
      </div>
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        enablePagination
        pageSizeOptions={[10, 20, 50]}
        initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
      />
    </div>
  )
}
