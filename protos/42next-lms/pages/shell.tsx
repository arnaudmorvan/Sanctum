import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import type { ReactNode } from "react"
import { TYPO } from "../../../src/typo"
import type { Tone } from "../data/lms"

/** The furniture the HTML prototype repeated on EVERY page — its `head()`, its
 *  `.section-title`, its `.stat` tiles.
 *
 *  2026-09-08 — FLAT SURFACES. Every card of the flow is `variant="outline"`: no fill,
 *  the canvas shows through, the border does the delimiting (`review:color` — the
 *  background does not repeat, cards stay translucent). Consequence here: `Stat` no
 *  longer tints by tone, and `Tag` drops green and red (`review:color` — a status badge
 *  is grey by default, the meaning is carried by the label). */

/** Page header: the title, an optional lead paragraph, and an optional action zone that
 *  the prototype pinned to the right of the title. */
export const PageHead = ({
  title,
  sub,
  aside,
}: {
  title: string
  sub?: string
  aside?: ReactNode
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Title order={1} size="2xl" className={TYPO.title()}>
        {title}
      </Title>
      {aside ? <div className="flex items-center gap-2">{aside}</div> : null}
    </div>
    {sub ? (
      <Text c="secondary" size="sm" className="max-w-3xl">
        {sub}
      </Text>
    ) : null}
  </div>
)

/** A titled block. The prototype numbered some of them (`<span class="section-num">01`);
 *  the number is passed, never derived, because it numbered only SOME sections. */
export const Section = ({
  title,
  num,
  right,
  children,
}: {
  title: string
  num?: string
  right?: ReactNode
  children: ReactNode
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <Title order={2} size="sm" className={TYPO.title("semibold")}>
        {num ? <span className={`mr-2 text-gray-dark-400 ${TYPO.mono()}`}>{num}</span> : null}
        {title}
      </Title>
      {right}
    </div>
    {children}
  </section>
)

/** One stat tile. The VALUE is mono — it is a number, and mono is the machine register
 *  of the DS (`TYPO`); the label stays Lato. `tone` stays in the signature (the callers
 *  pass it, and it still says what the tile MEANS) but no longer paints the surface. */
export const Stat = ({ v, k }: { v: string; k: string; tone?: Tone }) => (
  <Card variant="outline" padding="sm">
    <Card.Content>
      <div className="flex flex-col gap-1">
        <span className={`text-xl ${TYPO.mono()}`}>{v}</span>
        <Text size="xs" c="secondary">
          {k}
        </Text>
      </div>
    </Card.Content>
  </Card>
)

export const StatGrid = ({
  items,
  cols = 4,
}: {
  items: { v: string; k: string; tone: Tone }[]
  cols?: 3 | 4 | 6
}) => (
  <div
    className={`grid grid-cols-2 gap-3 ${
      cols === 3 ? "md:grid-cols-3" : cols === 6 ? "md:grid-cols-3 lg:grid-cols-6" : "md:grid-cols-4"
    }`}
  >
    {items.map((s) => (
      <Stat key={s.k} {...s} />
    ))}
  </div>
)

/** The legend under the calendar and the cluster map — a colour, a word. */
export const Legend = ({ items }: { items: { label: string; className: string }[] }) => (
  <div className="flex flex-wrap items-center gap-4">
    {items.map((i) => (
      <span key={i.label} className="flex items-center gap-2">
        <i className={`h-2.5 w-2.5 rounded-full ${i.className}`} />
        <Text size="xs" c="secondary">
          {i.label}
        </Text>
      </span>
    ))}
  </div>
)

/** A labelled bar. The prototype used it for every rhythm/quota it displayed; the value
 *  sits in mono next to the label, as on the frames. */
export const Meter = ({
  label,
  value,
  pct,
  color,
}: {
  label: string
  value: string
  pct: number
  color?: string
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline justify-between gap-3">
      <Text size="sm" c="secondary">
        {label}
      </Text>
      <span className={`text-sm ${TYPO.mono("semibold")}`}>{value}</span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${color ?? "bg-brand-500"}`}
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  </div>
)

/** Badge with the flow's default shape — `sm`. GREEN AND RED ARE FILTERED HERE, once,
 *  rather than in the three data files that feed it: a tag whose data says `green` or
 *  `red` comes out as an uncoloured `outline` badge. The word it carries (Passed,
 *  Validated, Failed) is what states the outcome. */
const NEUTRALISED = new Set(["green", "red"])

export const Tag = ({ children, color }: { children: ReactNode; color?: string }) =>
  color && !NEUTRALISED.has(color) ? (
    <Badge variant="light" size="sm" color={color}>
      {children}
    </Badge>
  ) : (
    <Badge variant="outline" size="sm">
      {children}
    </Badge>
  )
