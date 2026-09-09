import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { ALL_MODULES, MODULE } from "../data/module"

/** The index the map screen comes back to. It exists so the back button and the first crumb
 *  lead somewhere: a dead control in a clickable flow is worse than a missing one.
 *  Only the module in progress opens — the others stay inert rather than opening a blank. */
export const Modules = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-2">
      <Title order={1} size="2xl" className={TYPO.title()}>
        All Modules
      </Title>
      <Text size="sm" c="secondary">
        Common Core {MODULE.version} — open a module to see its progression map.
      </Text>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {ALL_MODULES.map((m) => {
        const body = (
          <Card.Content>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>
                  {m.name}
                </Title>
                <Badge variant="light" size="xs" color="gray">
                  {m.badge}
                </Badge>
              </div>
              <Text size="xs" c="muted">
                {m.note}
              </Text>
            </div>
          </Card.Content>
        )
        return m.open ? (
          <a key={m.slug} href={`#/modules/${m.slug}`} className="block">
            <Card variant="gradient" padding="md">
              {body}
            </Card>
          </a>
        ) : (
          <Card key={m.slug} variant="default" padding="md">
            {body}
          </Card>
        )
      })}
    </div>
  </div>
)
