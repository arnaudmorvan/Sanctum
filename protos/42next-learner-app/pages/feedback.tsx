import { Alert } from "@42/ui-react/alert"
import { Avatar } from "@42/ui-react/avatar"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Checkbox } from "@42/ui-react/checkbox"
import { Field } from "@42/ui-react/field"
import { Input } from "@42/ui-react/input"
import { Modal } from "@42/ui-react/modal"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Textarea } from "@42/ui-react/textarea"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Title } from "@42/ui-react/title"
import {
  Check,
  Coffee,
  Cookie,
  Heart,
  Pizza,
  Search,
  Sprout,
  X,
} from "lucide-react"
import type { ComponentType } from "react"
import { useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  FEEDBACK_SUBJECT,
  GIFTS,
  ISSUES,
  PEOPLE,
  SCALES,
  SV_MAX,
  SV_PROJECT,
} from "../data/feedback"
import { Cap, PageHead, Tag } from "./shell"

const nameOf = (login: string) => PEOPLE.find((p) => p.login === login)?.name ?? login

/** Post-review feedback — `P['feedback.form']`.
 *
 *  Mandatory in both directions, asynchronous, and — for the flags — visible to campus
 *  staff only. The wording follows the DIRECTION: you rate the reviewee when you
 *  reviewed, the reviewer when you were reviewed, and "cannot explain code" only exists
 *  reviewer → reviewee.
 *
 *  A GROUP REVIEW RUNS THE FORM ONCE PER MEMBER. The artifact put the roster at the top
 *  as the page's own rail — who is done, who is next — and would not let the form finish
 *  until every member had an answer on all three axes. Both are kept: the roster is the
 *  progress, and Finish only lights when the last member is complete. */
export const PeerFeedback = () => {
  const { dir, project, members } = FEEDBACK_SUBJECT
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({})
  const [issues, setIssues] = useState<Record<string, string[]>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const who = members[idx]
  const mine = answers[who] ?? {}
  const complete = (m: string) => SCALES.every((s) => (answers[m] ?? {})[s.id])
  const canFinish = members.every(complete)

  const pick = (axis: string, value: string) =>
    setAnswers({ ...answers, [who]: { ...mine, [axis]: value } })

  const toggleIssue = (id: string, on: boolean) => {
    const cur = issues[who] ?? []
    setIssues({ ...issues, [who]: on ? [...cur, id] : cur.filter((x) => x !== id) })
  }

  if (sent)
    return (
      <div className="flex max-w-3xl flex-col gap-8">
        <PageHead title="Feedback sent" sub={`${project} · ${members.length} reviews`} />
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex items-center gap-4">
              <ThemeIcon variant="light" color="pink" size="lg" radius="full">
                <Sprout size={22} />
              </ThemeIcon>
              <div className="flex flex-col gap-1">
                <Text size="md" className={TYPO.title("semibold")}>
                  Thank you — the attempt can close now
                </Text>
                <Text size="sm" c="secondary">
                  Your answers are not shown to the person you rated. Flags, if you raised
                  any, go to campus staff.
                </Text>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Button variant="filled" size="sm" className="self-start" asChild>
          <a href="#/dashboard">Back to the homepage</a>
        </Button>
      </div>
    )

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <PageHead
        title={dir === "given" ? "How did the review go?" : "How did your reviewer do?"}
        sub={`Review you gave on ${project}. Mandatory in both directions — the attempt stays open until it is written.`}
      />

      {/* The roster doubles as the progress rail. */}
      <Card variant="default" padding="md">
        <Card.Content>
          <div className="flex flex-wrap items-center gap-3">
            {members.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => setIdx(i)}
                className="cursor-pointer"
                aria-current={i === idx}
              >
                <div className="flex items-center gap-2">
                  <Avatar name={nameOf(m)} color="initials" size="sm" />
                  <Text
                    size="sm"
                    className={i === idx ? TYPO.mono("bold") : TYPO.mono("medium")}
                    c={i === idx ? "default" : "muted"}
                  >
                    {m}
                  </Text>
                  {complete(m) ? <Check size={14} /> : null}
                </div>
              </button>
            ))}
            <Text size="xs" c="muted" className={`ms-auto ${TYPO.mono("medium")}`}>
              {members.filter(complete).length}/{members.length} done
            </Text>
          </div>
        </Card.Content>
      </Card>

      <Card variant="gradient" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <Avatar name={nameOf(who)} color="initials" size="md" />
              <div className="flex flex-col gap-0.5">
                <Title order={2} size="lg" className={TYPO.title("bold")}>
                  {nameOf(who)}
                </Title>
                <Text size="xs" c="muted" className={TYPO.mono("medium")}>
                  {who} · {project}
                </Text>
              </div>
            </div>

            {SCALES.map((s) => (
              <div key={s.id} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Text size="md" className={TYPO.title("semibold")}>
                    {s.axis}
                  </Text>
                  <Text size="sm" c="secondary">
                    {s.question[dir]}
                  </Text>
                </div>
                {/* three ordered tiers, all visible: one instrument, not three questions */}
                <SegmentGroup
                  size="sm"
                  data={[...s.opts]}
                  value={mine[s.id] ?? null}
                  onChange={(v) => pick(s.id, String(v))}
                />
                <Text size="xs" c="muted">
                  {s.sub[dir]}
                </Text>
              </div>
            ))}

            <Field label="Anything you want to add" description="Optional, and only staff can read it.">
              <Textarea
                minRows={3}
                value={comments[who] ?? ""}
                onChange={(e) => setComments({ ...comments, [who]: e.target.value })}
                placeholder="What went well, what did not"
              />
            </Field>

            <div className="flex flex-col gap-3">
              <Cap>Flags — campus staff only</Cap>
              {ISSUES.filter((i) => i.both || dir === "given").map((i) => (
                <Checkbox
                  key={i.id}
                  label={i.label}
                  description={i.d}
                  checked={(issues[who] ?? []).includes(i.id)}
                  onCheckedChange={(c) => toggleIssue(i.id, c === true)}
                />
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={idx === 0}
          onClick={() => setIdx(Math.max(0, idx - 1))}
        >
          Previous
        </Button>
        {idx < members.length - 1 ? (
          <Button
            variant="filled"
            size="sm"
            disabled={!complete(who)}
            onClick={() => setIdx(idx + 1)}
          >
            Next — {members[idx + 1]}
          </Button>
        ) : (
          <Button variant="filled" size="sm" disabled={!canFinish} onClick={() => setSent(true)}>
            Send feedback
          </Button>
        )}
        {!canFinish ? (
          <Text size="xs" c="muted">
            Every member needs an answer on all three axes.
          </Text>
        ) : null}
      </div>
    </div>
  )
}

const GIFT_ICON: Record<string, ComponentType<{ size?: number }>> = {
  pizza: Pizza,
  coffee: Coffee,
  cookie: Cookie,
  heart: Heart,
}

/** The social vote — `P['social.vote']`.
 *
 *  Your OWN attempt asks who helped you on it: up to three people, and a thank-you you
 *  can throw at them, which lands on their homepage as a win. Naming nobody is allowed —
 *  the form confirms rather than blocks, because a vote that cannot be empty is not a
 *  vote.
 *
 *  The artifact hid an easter egg here (name yourself, and a headmaster turns up asking
 *  who put your name in the goblet of fire). It is deliberately NOT ported: it is a
 *  figurative GIF, which is the bound `foundations-context` puts on the galaxy register,
 *  and it belongs to the artifact's own moment of levity rather than to the flow. */
export const SocialVote = () => {
  const [query, setQuery] = useState("")
  const [picked, setPicked] = useState<{ login: string; gift?: string }[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [sent, setSent] = useState(false)

  const full = picked.length >= SV_MAX
  const q = query.trim().toLowerCase()
  const matches = q
    ? PEOPLE.filter(
        (p) =>
          !picked.some((x) => x.login === p.login) &&
          (p.login.includes(q) || p.name.toLowerCase().includes(q)),
      ).slice(0, 5)
    : []

  const add = (login: string) => {
    if (full) return
    setPicked([...picked, { login }])
    setQuery("")
  }
  const drop = (login: string) => setPicked(picked.filter((p) => p.login !== login))
  const setGift = (login: string, k: string) => {
    setPicked(picked.map((p) => (p.login === login ? { ...p, gift: k } : p)))
    setOpen(null)
  }

  if (sent) {
    const withGift = picked.filter((p) => p.gift)
    return (
      <div className="flex max-w-3xl flex-col gap-8">
        <PageHead title="Feedback sent" sub={SV_PROJECT} />
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Text size="md" className={TYPO.title("semibold")}>
                {picked.length
                  ? picked.map((p) => nameOf(p.login)).join(", ")
                  : "Nobody was named for this attempt"}
              </Text>
              <Text size="sm" c="secondary">
                {picked.length
                  ? withGift.length
                    ? withGift
                        .map(
                          (p) =>
                            `${nameOf(p.login)} will find your ${
                              GIFTS.find((g) => g.k === p.gift)?.l.toLowerCase() ?? "thanks"
                            } on their homepage.`,
                        )
                        .join(" ")
                    : "The people you named will see they were mentioned."
                  : "Recorded. The attempt can close now."}
              </Text>
            </div>
          </Card.Content>
        </Card>
        <Button variant="filled" size="sm" className="self-start" asChild>
          <a href="#/dashboard">Back to the homepage</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <PageHead
        title={`Who helped you on ${SV_PROJECT}?`}
        sub="Name up to three people — and throw them something if you want to. They see it on their homepage."
      />

      <Card variant="gradient" padding="lg">
        <Card.Content>
          <div className="flex flex-col gap-5">
            <Field
              label="Search by name or login"
              description={full ? "Three is the maximum." : "Naming no one is allowed."}
            >
              <Input
                value={query}
                disabled={full}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="anskywa, Leia…"
                startSlot={<Search size={16} />}
              />
            </Field>

            {matches.length ? (
              <Card variant="light" padding="xs">
                <Card.Content>
                  <div className="flex flex-col">
                    {matches.map((p) => (
                      <button
                        key={p.login}
                        type="button"
                        onClick={() => add(p.login)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 p-2">
                          <Avatar name={p.name} color="initials" size="sm" />
                          <Text size="sm" className={TYPO.title("semibold")}>
                            {p.name}
                          </Text>
                          <Text size="xs" c="muted" className={`ms-auto ${TYPO.mono("medium")}`}>
                            {p.login}
                          </Text>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            ) : null}

            {q && !matches.length ? (
              <Text size="sm" c="muted">
                No one matches “{query.trim()}”.
              </Text>
            ) : null}

            <Text size="xs" c="muted" className={TYPO.mono("medium")}>
              {picked.length} of {SV_MAX} chosen
            </Text>

            {picked.length ? (
              <div className="flex flex-col gap-3">
                {picked.map((p) => {
                  const Icon = p.gift ? GIFT_ICON[p.gift] : null
                  return (
                    <div key={p.login} className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar name={nameOf(p.login)} color="initials" size="sm" />
                        <Text size="sm" className={TYPO.title("semibold")}>
                          {nameOf(p.login)}
                        </Text>
                        {Icon ? (
                          <Tag color="purple">
                            <Icon size={12} />{" "}
                            {GIFTS.find((g) => g.k === p.gift)?.l}
                          </Tag>
                        ) : null}
                        <div className="ms-auto flex items-center gap-2">
                          <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => setOpen(open === p.login ? null : p.login)}
                          >
                            {p.gift ? "Change thank-you" : "Send a thank-you"}
                          </Button>
                          <Button
                            variant="subtle"
                            size="xs"
                            aria-label={`Remove ${nameOf(p.login)}`}
                            onClick={() => drop(p.login)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                      {open === p.login ? (
                        <div className="flex flex-wrap gap-2">
                          {GIFTS.map((g) => {
                            const GIcon = GIFT_ICON[g.k]
                            return (
                              <Button
                                key={g.k}
                                variant={p.gift === g.k ? "light" : "outline"}
                                size="xs"
                                startSlot={<GIcon size={14} />}
                                onClick={() => setGift(p.login, g.k)}
                              >
                                {g.l}
                              </Button>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </Card.Content>
      </Card>

      <Alert
        type="info"
        variant="light"
        description="A thank-you lands on their homepage as a win — it is not a validation, and it carries no score."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="filled"
          size="sm"
          onClick={() => (picked.length ? setSent(true) : setConfirming(true))}
        >
          Send
        </Button>
        <Button variant="subtle" size="sm" asChild>
          <a href="#/dashboard">Not now</a>
        </Button>
      </div>

      <Modal
        open={confirming}
        onOpenChange={(o) => (o ? null : setConfirming(false))}
        title="Name nobody?"
        description="You can send this without naming anyone — the attempt closes either way."
      >
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
            Back
          </Button>
          <Button
            variant="filled"
            size="sm"
            onClick={() => {
              setConfirming(false)
              setSent(true)
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  )
}
