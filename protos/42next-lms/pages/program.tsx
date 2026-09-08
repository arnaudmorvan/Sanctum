import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Card } from "@42/ui-react/card"
import { Progress } from "@42/ui-react/progress"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import { MODULES, PROGRAM, PROGRAM_VIEWS, STATUS_BADGE } from "../data/learn"

/** Screen 1 — learn.modules of the prototype: a 2-column grid of module cards.
 *  Only the "In progress" card leads to the module screen: that is the nominal path
 *  through the flow, the others stay inert rather than opening an empty screen. */
export const Program = () => (
  <div className="flex flex-col gap-10">
    <Breadcrumb data={[{ label: "Learn", href: "#/learn/program" }, { label: "My program" }]} />

    <div className="flex flex-wrap items-center justify-between gap-3">
      <Title order={1} size="2xl" className={TYPO.title()}>{PROGRAM.name}</Title>
      <div className="flex items-center gap-3">
        <Text size="sm" c="muted">program</Text>
        <Badge variant="outline" size="sm">{PROGRAM.version}</Badge>
        <SegmentGroup size="sm" data={PROGRAM_VIEWS} defaultValue="Cards" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {MODULES.map((m) => {
        const b = STATUS_BADGE[m.status]
        const body = (
          <Card.Content>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <Title order={2} size="sm" className={TYPO.title()}>{m.name}</Title>
                <Badge variant="outline">{b.label}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Text size="xs" c="secondary">{m.skills}</Text>
                <Text size="xs" c="muted">{m.pct}%</Text>
              </div>
              <Progress variant="gradient" value={m.pct} size="sm" />
              <Text size="xs" c="muted">{m.activities}</Text>
            </div>
          </Card.Content>
        )
        /* 2026-09-08 — the cards are flat: no fill, no signature outline. What sets the
           module in progress apart is no longer its surface but the fact that it is the
           only one you can open; the status badge carries the rest. */
        return m.open ? (
          <a key={m.slug} href={`#/learn/module/${m.slug}`} className="block">
            <Card variant="outline" padding="md">{body}</Card>
          </a>
        ) : (
          <Card key={m.slug} variant="outline" padding="md">{body}</Card>
        )
      })}
    </div>
  </div>
)
