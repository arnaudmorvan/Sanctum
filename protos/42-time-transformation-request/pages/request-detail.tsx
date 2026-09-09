import { ActionIcon } from "@42/ui-react/action-icon"
import { Alert } from "@42/ui-react/alert"
import { Avatar } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Checkbox } from "@42/ui-react/checkbox"
import { Collapse } from "@42/ui-react/collapse"
import { Divider } from "@42/ui-react/divider"
import { Field } from "@42/ui-react/field"
import { Input } from "@42/ui-react/input"
import { NumberInput } from "@42/ui-react/number-input"
import { RadioGroup } from "@42/ui-react/radio-group"
import { Select } from "@42/ui-react/select"
import { Switch } from "@42/ui-react/switch"
import { Text } from "@42/ui-react/text"
import { Textarea } from "@42/ui-react/textarea"
import { Title } from "@42/ui-react/title"
import { ChevronDown, ChevronLeft, Download, FileText } from "lucide-react"
import { type ReactNode, useState } from "react"
import { TYPO } from "../../../src/typo"
import { REASONS, REQUESTS, type TransformationType } from "../data/requests"

/** The middle crumb pointed at THIS screen while the list it names did not exist. It
 *  exists since 2026-09-09, so the crumb goes where it says it goes. */
const CRUMBS = [
  { label: "Learners" },
  { label: "Time transformations", href: "#/learners/time-transformation" },
]

/** The two options of the type radio. Declared `as const` so the union the kit narrows
 *  from `data` is the SAME union the state carries — a bare `string[]` widens it and the
 *  controlled `value` no longer typechecks. */
const TYPES = ["Time off", "Time shift"] as const

/** One metadata row of the "Request informations" panel. The label stays Lato; the value
 *  goes mono ONLY when it is something the machine counts — a login, a date. A program
 *  name is content, so it stays Lato. */
const Meta = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1">
    <Text span size="xs" c="secondary">
      {label}
    </Text>
    <span className="text-sm">{children}</span>
  </div>
)

/** Staff review of one time transformation request.
 *
 *  The screen has ONE job: decide. So the decision material is what it leads with — the
 *  changes already asked for, then the form the staff fills, then the two ways out. The
 *  request metadata is folded into a panel above: it is what you check, not what you do.
 *
 *  `Request informations` is collapsible because a staff member handling a queue reads it
 *  once and then works in the form below. It opens by default: on a request that already
 *  carries a "changes requested" note, hiding that note behind a click would be hiding the
 *  reason the request is still here. */
export const RequestDetail = ({ login }: { login: string }) => {
  const request = REQUESTS[login] ?? REQUESTS.elmorel
  const [infoOpen, setInfoOpen] = useState(true)
  const [type, setType] = useState<TransformationType>(request.form.type)
  const [blockAccess, setBlockAccess] = useState(request.form.blockWorkstations)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <Breadcrumb data={[...CRUMBS, { label: request.name }]} />

      {/* Title block — back, who, where the request stands. One block, not three. */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <ActionIcon
            variant="subtle"
            size="sm"
            aria-label="Back to the time transformation list"
            onClick={() => window.history.back()}
          >
            <ChevronLeft size={18} />
          </ActionIcon>
          <Avatar name={request.name} size="sm" color="name" />
          <Title order={1} size="2xl" className={TYPO.title()}>
            {request.name}
          </Title>
          <Badge variant="light" size="sm" color="gray">
            {request.status}
          </Badge>
        </div>
        <Text c="secondary" size="sm">
          Time transformation request — review the learner&apos;s document, adjust the
          transformation if needed, then approve or deny.
        </Text>
      </div>

      {/* Section 1 — Request informations */}
      <Card variant="default" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 text-left"
              aria-expanded={infoOpen}
              onClick={() => setInfoOpen((o) => !o)}
            >
              <Title order={2} size="sm" className={TYPO.title("semibold")}>
                Request informations
              </Title>
              <span className="flex items-center gap-2">
                <Text span size="xs" c="secondary">
                  {infoOpen ? "Hide" : "Show"}
                </Text>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${infoOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            <Collapse open={infoOpen}>
              <div className="flex flex-col gap-6 pt-2">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                  <Meta label="Learner">
                    <span className={TYPO.mono("medium")}>{request.login}</span>
                  </Meta>
                  <Meta label="Administrative tags">
                    <span className="flex flex-wrap gap-1">
                      {request.tags.map((tag) => (
                        <Badge key={tag} variant="light" size="sm" color="gray">
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
                    <Badge variant="light" size="sm" color="gray">
                      {request.status}
                    </Badge>
                  </Meta>
                  <Meta label="Last reviewed by">{request.lastReviewedBy}</Meta>
                </div>

                <Divider />

                <Alert
                  type="warning"
                  title="Changes requested"
                  description={request.changesRequested}
                />
              </div>
            </Collapse>
          </div>
        </Card.Content>
      </Card>

      {/* Section 2 — Staff validation. The one gradient card of the screen: it is what
          the staff came here to do. */}
      <Card variant="gradient" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Title order={2} size="sm" className={TYPO.title("semibold")}>
                Staff validation
              </Title>
              <Text size="xs" c="secondary">
                What you set here is what the learner&apos;s calendar will carry once the
                request is approved.
              </Text>
            </div>

            <RadioGroup
              label="Time transformation type"
              orientation="horizontal"
              data={TYPES}
              value={type}
              onChange={setType}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Start date">
                <Input size="md" defaultValue={request.form.startDate} />
              </Field>
              <Field label="Duration">
                <NumberInput
                  defaultValue={request.form.durationDays}
                  min={1}
                  max={90}
                  suffix="days"
                />
              </Field>
            </div>

            <Checkbox
              defaultChecked={request.form.deductFromTimeBank}
              label="Deduct these days from the learner's time bank"
              description="Unchecked, the time off is granted on top of the bank and the balance stays as it is."
            />

            <Field label="Reason">
              <Select data={REASONS} defaultValue={request.form.reason} />
            </Field>

            <Switch
              checked={blockAccess}
              onCheckedChange={setBlockAccess}
              label="Block the learner's access to the workstations during the time off"
              description={
                blockAccess
                  ? "Badge and cluster sessions are refused for the whole period."
                  : "The learner keeps campus access during the period."
              }
            />

            <Field
              label="Reason details"
              description="Optional — visible to the learner in the decision notification."
            >
              <Textarea
                defaultValue={request.form.details}
                minRows={3}
                maxRows={6}
                placeholder="Add what the learner should know about this decision"
              />
            </Field>

            <div className="flex flex-col gap-2">
              <Text span size="sm" c="secondary">
                Learner&apos;s document
              </Text>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/5 p-3">
                <span className="flex items-center gap-3">
                  <FileText size={18} />
                  <span className="flex flex-col">
                    <span className="text-sm">{request.document.name}</span>
                    <Text span size="xs" c="muted">
                      <span className={TYPO.mono("medium")}>{request.document.size}</span>
                      {" · uploaded on "}
                      <span className={TYPO.mono("medium")}>
                        {request.document.uploadedOn}
                      </span>
                    </Text>
                  </span>
                </span>
                <Button variant="light" size="sm" startSlot={<Download size={16} />}>
                  Download
                </Button>
              </div>
            </div>

            <Text size="xs" c="muted">
              Personal data attached to this request is processed for the sole purpose of
              handling it, kept for the duration of the learner&apos;s enrolment, then
              deleted. The learner can ask for access, rectification or erasure at any time.
            </Text>

            {/* The two ways out. They close the form they act on — a bare action row on
                the canvas would be an element outside a card. */}
            <Divider />
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="outline" size="sm" color="red">
                Deny request
              </Button>
              <Button variant="filled" size="sm" color="green">
                Approve request
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
