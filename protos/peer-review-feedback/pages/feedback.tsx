import { Sparkles } from "lucide-react"
import { useState } from "react"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Divider } from "@42/ui-react/divider"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Text } from "@42/ui-react/text"
import { Textarea } from "@42/ui-react/textarea"
import { Title } from "@42/ui-react/title"
import { TYPO } from "../../../src/typo"
import {
  ATTITUDE_OPTIONS,
  EXCHANGE_OPTIONS,
  PERFORMANCE_OPTIONS,
  REVIEWEE,
} from "../data/feedback"

/** Every segment carries the same small spark icon, whatever the option — the
 *  request is decorative consistency, not a per-option glyph. */
const SparkLabel = ({ label }: { label: string }) => (
  <span className="flex items-center gap-1.5">
    <Sparkles size={13} />
    {label}
  </span>
)

/** Peer-review feedback form — evaluates the REVIEW a student ran on a peer's
 *  project (not the project itself). Three required single-choice questions +
 *  one optional free-text field. "Finish the feedback" only unlocks once the
 *  three required questions are answered — the comment stays optional, nothing
 *  in the brief made it mandatory. */
export const Feedback = () => {
  const [performance, setPerformance] = useState<string | null>(null)
  const [exchange, setExchange] = useState<string | null>(null)
  const [attitude, setAttitude] = useState<string | null>(null)
  const [comment, setComment] = useState("")

  const complete = Boolean(performance && exchange && attitude)

  return (
    <div className="flex justify-center px-6 py-20">
      <Card variant="gradient" padding="xl" className="w-full max-w-xl">
        <Card.Content>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div>
                <Badge variant="light" color="gray" size="sm">Feedback</Badge>
              </div>
              <Title order={1} size="2xl" className={TYPO.title()}>
                Review done on {REVIEWEE.name}&rsquo;s work on {REVIEWEE.project}
              </Title>
              <Text size="sm" c="secondary">
                Select the word that best matches what you experienced.
              </Text>
            </div>

            <Divider />

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>
                  Reviewed student&rsquo;s performance
                </Title>
                <SegmentGroup
                  size="sm"
                  data={PERFORMANCE_OPTIONS}
                  value={performance}
                  onChange={setPerformance}
                  renderItem={(item) => <SparkLabel label={item.label ?? String(item.value)} />}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>
                  Quality of the exchange
                </Title>
                <SegmentGroup
                  size="sm"
                  data={EXCHANGE_OPTIONS}
                  value={exchange}
                  onChange={setExchange}
                  renderItem={(item) => <SparkLabel label={item.label ?? String(item.value)} />}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Title order={2} size="sm" className={TYPO.title("semibold")}>
                  Attitude during the review
                </Title>
                <SegmentGroup
                  size="sm"
                  data={ATTITUDE_OPTIONS}
                  value={attitude}
                  onChange={setAttitude}
                  renderItem={(item) => <SparkLabel label={item.label ?? String(item.value)} />}
                />
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-3">
              <Title order={2} size="sm" className={TYPO.title("semibold")}>
                Global feedback
              </Title>
              <Textarea
                placeholder="What do you think about this review?"
                minRows={4}
                maxRows={8}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <Divider />

            <div className="flex justify-end">
              <Button size="sm" disabled={!complete}>
                Finish the feedback
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
