import { ArrowLeft, Check, CircleDashed, Clock3, Users } from "lucide-react"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { CURRENT, LEARNER, MILESTONE } from "../data/profile"

/** ACTIVITY DETAIL — the target of the profile's primary action.
 *
 *  WHY IT EXISTS. The profile's « Next » card carries one control, « Open the
 *  activity ». A proto whose only control is dead is worse than one screen
 *  fewer, so the screen it opens ships with it. It was declared in `views.tsx`
 *  before, but its file was never in the repo — the flow could not build.
 *
 *  LAYOUT. Two columns, not three: `foundations-layout` says a drill-down
 *  sub-page takes the sidebar plus a full-width content area, and keeps the
 *  side panel for screens that give an overview. There is nothing here to
 *  accompany the reading — the reading IS the subject.
 *
 *  ⚠️ THE SEVEN REQUIREMENTS BELOW ARE DEMO DATA, not a lift: frame 22489:9756
 *  states the ratio (4 / 7) and never the list. They are plausible for a
 *  minishell and they let the screen be clicked and discussed. Do not re-lift
 *  them from here as if they came from the mockup, and do not read them as a
 *  pedagogical spec — the real validation conditions belong to the module
 *  configuration.
 */
const REQUIREMENTS = [
  { label: "The repository builds with make, with no warning", met: true },
  { label: "Builtins: echo, cd, pwd, export, unset, env, exit", met: true },
  { label: "Redirections and pipes, chained", met: true },
  { label: "No memory leak on the tested scenarios", met: true },
  { label: "Signal handling — ctrl-C, ctrl-D, ctrl-\\", met: false },
  { label: "Environment variable expansion, including $?", met: false },
  { label: "Peer review passed by two learners", met: false },
]

export const Activity = ({ slug }: { slug?: string }) => {
  const met = REQUIREMENTS.filter((r) => r.met).length
  const pct = Math.round((met / REQUIREMENTS.length) * 100)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        {/* No Breadcrumb here: the kit's takes a `data` array whose item shape
            is not published in the manifest, and guessing a prop shape is how
            a value silently lands in an HTML attribute. A single subtle button
            back to where the learner came from, instead. */}
        <div>
          <Button size="sm" variant="subtle" color="gray" startSlot={<ArrowLeft size={16} />} asChild>
            <a href={`#/profile/${LEARNER.login}`}>Back to the profile</a>
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          <Title order={1} size="3xl" className={TYPO.title()}>
            {slug ?? CURRENT.slug}
          </Title>
          <Text size="sm" c="secondary">
            {CURRENT.context}
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* THE ONE gradient card of this screen too: what is left to do. */}
        <Card variant="gradient" padding="lg">
          <Card.Content>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="light" color="blue">
                  In progress
                </Badge>
                <Badge variant="light" color="gray">
                  {CURRENT.attempt}
                </Badge>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <Text size="sm" className={TYPO.title("medium")}>
                  {CURRENT.label}
                </Text>
                <Text size="sm" c="secondary" className={TYPO.mono()}>
                  {met} / {REQUIREMENTS.length}
                </Text>
              </div>
              <Progress variant="gradient" value={pct} size="sm" />
              <div className="flex flex-col gap-3 pt-1">
                {REQUIREMENTS.map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    {/* The met / not-met mark carries no colour of its own on
                        the unmet side: a status is grey by default, and the
                        meaning is in the label. Green is the stated exception
                        for a terminal validation. */}
                    <ThemeIcon
                      variant="light"
                      color={r.met ? "green" : "gray"}
                      size="sm"
                      radius="full"
                    >
                      {r.met ? <Check size={14} /> : <CircleDashed size={14} />}
                    </ThemeIcon>
                    <Text size="sm" c={r.met ? "default" : "muted"}>
                      {r.label}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </Card.Content>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card variant="default" padding="md">
            <Card.Content>
              <div className="flex items-center gap-3">
                <ThemeIcon variant="light" color="purple" size="md" radius="md">
                  <Users size={16} />
                </ThemeIcon>
                <div className="flex flex-col">
                  <Text size="sm" className={TYPO.title("medium")}>
                    In team with bmartin
                  </Text>
                  <Text size="xs" c="muted">
                    Both members are reviewed on the same attempt.
                  </Text>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card variant="default" padding="md">
            <Card.Content>
              <div className="flex items-center gap-3">
                <ThemeIcon variant="light" color="purple" size="md" radius="md">
                  <Clock3 size={16} />
                </ThemeIcon>
                <div className="flex flex-col">
                  <Text size="sm" className={TYPO.title("medium")}>
                    Started 6 days ago
                  </Text>
                  <Text size="xs" c="muted">
                    {MILESTONE.daysElapsed} of {MILESTONE.daysReference} working days elapsed on{" "}
                    {MILESTONE.name}.
                  </Text>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
