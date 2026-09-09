import { ActionIcon } from "@42/ui-react/action-icon"
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Collapse } from "@42/ui-react/collapse"
import { DatePicker } from "@42/ui-react/date-picker"
import { Divider } from "@42/ui-react/divider"
import { Field } from "@42/ui-react/field"
import { Input } from "@42/ui-react/input"
import { RadioGroup } from "@42/ui-react/radio-group"
import { Select } from "@42/ui-react/select"
import { Switch } from "@42/ui-react/switch"
import { Table } from "@42/ui-react/table"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Tooltip } from "@42/ui-react/tooltip"
import { ChevronDown, ChevronLeft, Download, FileText, Info, Pencil, RotateCcw } from "lucide-react"
import { type ReactNode, useState } from "react"
import { TYPO } from "../../../src/typo"
import { REASONS, REQUESTS, type TransformationType } from "../data/transformations"

const TYPES: TransformationType[] = ["Time off", "Time shift"]

/** "08/05/2026" + 7 → "15/05/2026". The spec gives the result; this computes it, so the
 *  overview follows the duration the staff actually types. */
const addDays = (date: string, days: number) => {
  const [d, m, y] = date.split("/").map(Number)
  const shifted = new Date(y, m - 1, d + days)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(shifted.getDate())}/${pad(shifted.getMonth() + 1)}/${shifted.getFullYear()}`
}

/** One row of the read-only metadata panel. The label stays Lato; the value goes mono only
 *  when it is something the machine counts — a login, a date. A program name is content. */
const Meta = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1">
    <Text span size="xs" c="secondary">
      {label}
    </Text>
    <span className="text-sm">{children}</span>
  </div>
)

/** Screens 2 to 6 of the spec, as ONE screen.
 *
 *  `status` decides whether the staff panel exists at all (screen 2 has none), `mode`
 *  decides read or edit, `type` decides which fields the form carries. Three pieces of
 *  state, five described screens. */
export const RequestDetail = ({ login }: { login: string }) => {
  const request = REQUESTS[login] ?? REQUESTS.fifauch

  const [mode, setMode] = useState<"read" | "edit">("read")
  const [resetKey, setResetKey] = useState(0)
  const [type, setType] = useState<TransformationType>(request.type ?? "Time off")
  const [duration, setDuration] = useState(String(request.formDurationDays))
  const [deduct, setDeduct] = useState(request.deductFromTimeBank)
  const [blockAccess, setBlockAccess] = useState(request.blockWorkstations)

  const reset = () => {
    setType(request.type ?? "Time off")
    setDuration(String(request.formDurationDays))
    setDeduct(request.deductFromTimeBank)
    setBlockAccess(request.blockWorkstations)
    setResetKey((k) => k + 1)
  }

  const days = Number.parseInt(duration, 10) || 0
  const editing = mode === "edit"
  const timeOff = type === "Time off"
  /* The overview appears when a change actually has an impact to show — that is what the
     spec ties it to, not to the edit mode itself. */
  const showOverview = editing && (timeOff ? deduct : days > 0)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <ActionIcon
          variant="subtle"
          size="sm"
          aria-label="Back to the time transformations list"
          asChild
        >
          <a href="#/time-transformations">
            <ChevronLeft size={18} />
          </a>
        </ActionIcon>
        <Title order={1} size="2xl" className={TYPO.title()}>
          {request.name ?? request.login} request
        </Title>
      </div>

      {/* ── Request informations ─────────────────────────────────────── */}
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-4">
            <RequestInfo request={request} />
          </div>
        </Card.Content>
      </Card>

      {/* ── Staff validation ─────────────────────────────────────────────
          Absent on a denied request: screen 2 shows the decision, not a form to redo it.
          The one gradient card of the screen — it is what the staff came here to do. */}
      {request.status === "Denied" ? null : (
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-6" key={resetKey}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Title order={2} size="md" className={TYPO.title("semibold")}>
                  Staff validation
                </Title>
                {editing ? (
                  <Button variant="subtle" size="xs" startSlot={<RotateCcw size={14} />} onClick={reset}>
                    Reset changes
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="xs"
                    startSlot={<Pencil size={14} />}
                    onClick={() => setMode("edit")}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {editing ? (
                <RadioGroup
                  label="Time transformation type"
                  orientation="horizontal"
                  data={TYPES}
                  value={type}
                  onChange={setType}
                />
              ) : (
                <Meta label="Time transformation type">{type}</Meta>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {editing ? (
                  <Field
                    label="Start date"
                    description="Selection from the past is permitted for regularization."
                  >
                    <DatePicker size="md" placeholder={request.formStartDate} />
                  </Field>
                ) : (
                  <Meta label="Start date">
                    <span className={TYPO.mono("medium")}>{request.formStartDate}</span>
                  </Meta>
                )}

                {editing ? (
                  <Field label="Duration">
                    <Input
                      size="md"
                      value={duration}
                      onChange={(event) => setDuration(event.target.value)}
                    />
                  </Field>
                ) : (
                  <Meta label="Duration">
                    <span className={TYPO.mono("medium")}>
                      {timeOff ? `${days} days` : `+${days} days`}
                    </span>
                  </Meta>
                )}
              </div>

              {/* Time off only: the two levers a shift does not have. */}
              {timeOff ? (
                <>
                  <Switch
                    checked={deduct}
                    onCheckedChange={setDeduct}
                    disabled={!editing}
                    label="Deduce days from Time bank"
                  />
                  {deduct ? (
                    <Field label="Deduct from Time bank">
                      <Input size="md" defaultValue={`${days} days`} disabled={!editing} />
                    </Field>
                  ) : null}
                </>
              ) : null}

              {editing ? (
                <Field label="Reason">
                  <Select data={REASONS} defaultValue={request.reason} />
                </Field>
              ) : (
                <Meta label="Reason">{request.reason}</Meta>
              )}

              {timeOff ? (
                <div className="flex items-start gap-2">
                  <Switch
                    checked={blockAccess}
                    onCheckedChange={setBlockAccess}
                    disabled={!editing}
                    label="Block learners' access to their workstations during Time off"
                  />
                  <Tooltip label="Badge and cluster sessions are refused for the whole period.">
                    <Info size={14} />
                  </Tooltip>
                </div>
              ) : null}

              {editing ? (
                <Field label="Reason details" description="Optional.">
                  <Input size="md" defaultValue={request.details} />
                </Field>
              ) : (
                <Meta label="Reason details (optional)">{request.details || "—"}</Meta>
              )}

              {/* Screen 5: a Time shift request draws no document block. */}
              {request.document && timeOff ? (
                <div className="flex flex-col gap-2">
                  <Text span size="sm" c="secondary">
                    Learner&apos;s document
                  </Text>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/5 p-3">
                    <span className="flex items-center gap-3">
                      <FileText size={18} />
                      <span className="text-sm">{request.document.name}</span>
                    </span>
                    <Button variant="light" size="sm" startSlot={<Download size={16} />}>
                      Download
                    </Button>
                  </div>
                  <Text size="xs" c="muted">
                    Ensure personal data is processed confidentially and in compliance with GDPR.
                  </Text>
                </div>
              ) : null}

              <Divider />
              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button variant="filled" size="sm" color="red">
                  Deny request
                </Button>
                {/* Nothing has been touched in read mode, so there is nothing to save. */}
                <Button variant="outline" size="sm" disabled={!editing} onClick={() => setMode("read")}>
                  Save changes
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* ── Changes overview ─────────────────────────────────────────── */}
      {showOverview ? (
        <Card variant="default" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-4">
              <Title order={2} size="md" className={TYPO.title("semibold")}>
                Changes overview
              </Title>
              {timeOff ? (
                <Table size="sm">
                  <Table.Content>
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>Actual time bank</Table.HeaderCell>
                        <Table.HeaderCell>Time off</Table.HeaderCell>
                        <Table.HeaderCell>New time bank</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <span className={TYPO.mono("medium")}>{request.timeBankDays} days</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className={TYPO.mono("medium")}>{days} days</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant="light" size="sm" color="green">
                            {Math.max(0, request.timeBankDays - days)} days
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Content>
                </Table>
              ) : (
                <Table size="sm">
                  <Table.Content>
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>Learner</Table.HeaderCell>
                        <Table.HeaderCell>Projected program end</Table.HeaderCell>
                        <Table.HeaderCell>Max program end</Table.HeaderCell>
                        <Table.HeaderCell>Time shift</Table.HeaderCell>
                        <Table.HeaderCell>New max program end</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <span className={TYPO.mono("medium")}>{request.login}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className={TYPO.mono("medium")}>{request.projectedProgramEnd}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className={TYPO.mono("medium")}>{request.maxProgramEnd}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className={TYPO.mono("medium")}>+{days} days</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant="light" size="sm" color="green">
                            {addDays(request.maxProgramEnd, days)}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Content>
                </Table>
              )}
            </div>
          </Card.Content>
        </Card>
      ) : null}
    </div>
  )
}

/** The metadata panel. Collapsible because a staff member handling a queue reads it once
 *  and then works in the form below; open by default because on a denied request it
 *  carries the deny reason, which is the only thing that screen has to say. */
const RequestInfo = ({ request }: { request: (typeof REQUESTS)[string] }) => {
  const [open, setOpen] = useState(true)

  return (
    <>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Title order={2} size="md" className={TYPO.title("semibold")}>
          Request informations
        </Title>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <Collapse open={open}>
        <div className="grid grid-cols-2 gap-6 pt-2 md:grid-cols-3">
          <Meta label="Learner">
            <Tooltip label={`${request.name ?? request.login} — @ 3ES2P`}>
              <span className={TYPO.mono("medium")}>{request.login}</span>
            </Tooltip>
          </Meta>
          <Meta label="Administrative tags">
            <span className="flex flex-wrap gap-1">
              {request.tags.map((tag) => (
                <Badge key={tag} variant="light" size="sm" color="neutral">
                  {tag}
                </Badge>
              ))}
            </span>
          </Meta>
          <Meta label="Program">{request.program}</Meta>
          <Meta label="Request date">
            <span className={TYPO.mono("medium")}>{request.requestDate}</span>
          </Meta>
          <Meta label="Status">
            <Badge
              variant="light"
              size="sm"
              color={request.status === "Approved" ? "green" : "red"}
            >
              {request.status}
            </Badge>
          </Meta>
          <Meta label="Last reviewed by">{request.lastReviewedBy}</Meta>
        </div>

        {request.denyReason ? (
          <div className="pt-6">
            <Alert type="error" title="Deny reason" description={request.denyReason} />
          </div>
        ) : null}
      </Collapse>
    </>
  )
}
