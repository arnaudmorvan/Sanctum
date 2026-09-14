import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@42/ui-react/button"
import { DataTable } from "@42/ui-react/data-table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { ArrowLeft, CalendarClock } from "lucide-react"
import { TYPO } from "../../../src/typo"
import { applicantsFor, findSession, type Applicant } from "../data/sessions"

const go = (hash: string) => {
  window.location.hash = hash
}

export function SessionApplicants({ id }: { id: string }) {
  const session = findSession(id)
  const rows = applicantsFor(id)

  const columns = useMemo<ColumnDef<Applicant, any>[]>(
    () => [
      { accessorKey: "name", header: "Name", size: 180 },
      {
        id: "login",
        header: "Login",
        size: 140,
        cell: ({ row }) => (
          <Text span size="sm" className={TYPO.mono("medium")}>
            {row.original.login}
          </Text>
        ),
      },
      { accessorKey: "status", header: "Status", size: 140 },
      { accessorKey: "appliedOn", header: "Applied on", size: 140 },
    ],
    [],
  )

  if (!session) {
    return <Text>Unknown program session.</Text>
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 items-start">
        <Button variant="subtle" size="sm" startSlot={<ArrowLeft size={16} />} onClick={() => go("/sessions")}>
          Program sessions applications
        </Button>
        <Title order={1} size="3xl" className={TYPO.title()}>
          Applicants
        </Title>
        <Text c="muted">
          {session.name} - {session.program} - {session.campus}
        </Text>
      </div>
      <DataTable data={rows} columns={columns} getRowId={(row) => row.id} enableGlobalFilter globalFilterPlaceholder="Search an applicant" />
      <div>
        <Button
          variant="outline"
          size="sm"
          startSlot={<CalendarClock size={16} />}
          onClick={() => go("/sessions/" + session.id)}
        >
          Onboarding sessions
        </Button>
      </div>
    </div>
  )
}
