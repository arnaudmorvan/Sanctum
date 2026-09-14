import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { MODULES, MODULE_STATUS_BADGE } from "../data/modules"

/** Modules — the program's modules as cards. Only the module "in progress"
 *  carries the signature gradient outline: it is the one thing to attack next on
 *  this screen (one gradient card per screen, foundations rule). Locked /
 *  available modules stay `default` — no invented greying-out, the badge already
 *  carries the state. */
export const Modules = () => (
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-2">
      <Title order={1} size="2xl" className={TYPO.title()}>Modules</Title>
      <Text size="sm" c="secondary">Your program, module by module.</Text>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {MODULES.map((m) => {
        const b = MODULE_STATUS_BADGE[m.status]
        return (
          <Card key={m.slug} variant={m.status === "progress" ? "gradient" : "default"} padding="md">
            <Card.Content>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <Title order={2} size="sm" className={TYPO.title()}>{m.name}</Title>
                  <Badge variant="light" color={b.color}>{b.label}</Badge>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Text size="xs" c="secondary">{m.skillsDone}/{m.skillsTotal} skills</Text>
                  <Text size="xs" c="muted">{m.pct}%</Text>
                </div>
                <Progress variant="gradient" value={m.pct} size="sm" />
                <Text size="xs" c="muted">{m.activities} activities</Text>
              </div>
            </Card.Content>
          </Card>
        )
      })}
    </div>
  </div>
)
