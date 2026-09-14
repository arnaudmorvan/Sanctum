import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { DataTable } from "@42/ui-react/data-table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { ArrowLeft, ListChecks } from "lucide-react"
import { TYPO } from "../../../src/typo"
import { findSession, formatApplicants, onboardingFor, type OnboardingSlot } from "../data/sessions"

const go = (hash: string) => {
  window.location.hash = hash
}

function Figure({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <Text size="sm" c="muted">
        {label}
      </Text>
      <Text size="lg" className={mono ? TYPO.mono() : TYPO.title()}>
        {value}
      </Text>
    </div>
  )
}

export function SessionDetail({ id }: { id: string }) {
  const session = findSession(id)
  const slots = onboardingFor(id)

  const columns = useMemo<ColumnDef<OnboardingSlot, any>[]>(
    () => [
      { accessorKey: "date", header: "Date", size: 140 },
      { accessorKey: "slot", header: "Time slot", size: 160 },
      {
        id: "seats",
        header: "Confirmed",
        size: 140,
        cell: ({ row }) => (
          <Text span size="sm" className={TYPO.mono("medium")}>
            {row.original.confirmed} / {row.original.capacity}
          </Text>
        ),
      },
      { accessorKey: "location", header: "Location", size: 220 },
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
          Onboarding sessions
        </Title>
        <Text c="muted">
          {session.name} - {session.program} - {session.campus}
        </Text>
      </div>
      <Card variant="default" padding="lg">
        <div className="flex flex-wrap gap-10">
          <Figure label="Applicants" value={formatApplicants(session)} />
          <Figure label="Confirmed" value={String(session.breakdown.confirmed)} />
          <Figure label="Onboarded" value={String(session.breakdown.onboarded)} />
          <Figure label="Registration" value={session.registrationStatus} mono={false} />
        </div>
      </Card>
      <DataTable data={slots} columns={columns} getRowId={(row) => row.id} />
      <div>
        <Button
          variant="outline"
          size="sm"
          startSlot={<ListChecks size={16} />}
          onClick={() => go("/sessions/" + session.id + "/applicants")}
        >
          See applicants
        </Button>
      </div>
    </div>
  )
}
