import { Badge } from "@42/ui-react/badge"
import { Progress } from "@42/ui-react/progress"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import type { ComponentType, ReactNode } from "react"
import { TYPO } from "../../../src/typo"

/** The furniture the artifact repeated on every page — its `head()`, its `.section-title`,
 *  its `.progress-wrap`, its `.badge`. Thin on purpose: these compose kit components and
 *  add no grammar of their own.
 *
 *  ⚠️ ONE DIFFERENCE from the same helper in `42next-lms`, and it is not cosmetic: `Meter`
 *  is the kit's `Progress` with `variant="gradient"`, not a hand-built track. `review:color`
 *  asks that progression carry the signature gradient and never a flat colour, and a
 *  hand-rolled `div` cannot be recoloured by the theme. */

export type Tone = "gray" | "brand" | "green" | "orange" | "red" | "pink" | "purple"

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
      <Title order={1} size="3xl" className={TYPO.title("semibold")}>
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

/** A titled block, with the glyph the artifact put in front of every section heading. */
export const Section = ({
  title,
  icon: Icon,
  right,
  children,
}: {
  title: string
  icon?: ComponentType<{ size?: number }>
  right?: ReactNode
  children: ReactNode
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {Icon ? <Icon size={24} /> : null}
        <Title order={2} size="2xl" className={TYPO.title("bold")}>
          {title}
        </Title>
      </div>
      {right}
    </div>
    {children}
  </section>
)

/** Uppercase label, Lato Bold — `Typography-1/Text sm/BoldCap`. `Text` exposes neither
 *  weight nor transform, so both go through the className. */
export const Cap = ({ children }: { children: ReactNode }) => (
  <Text size="sm" c="muted" className={`uppercase ${TYPO.title("bold")}`}>
    {children}
  </Text>
)

/** A labelled bar: the label in Lato, the value in Kode Mono — it measures. */
export const Meter = ({
  label,
  value,
  pct,
}: {
  label: string
  value: string
  pct: number
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline justify-between gap-3">
      <Text size="sm" c="secondary">
        {label}
      </Text>
      <span className={`text-sm ${TYPO.mono("semibold")}`}>{value}</span>
    </div>
    <Progress variant="gradient" size="sm" value={Math.min(100, pct)} />
  </div>
)

/** Badge with the flow's default shape. Grey unless a semantic exception is stated —
 *  `review:color`: the meaning is carried by the label, never by the hue alone. */
export const Tag = ({
  children,
  color = "gray",
}: {
  children: ReactNode
  color?: Tone
}) => (
  <Badge variant="light" size="md" color={color}>
    {children}
  </Badge>
)

/** A readout: the number in mono, its name under it. */
export const Readout = ({ v, k }: { v: string; k: string }) => (
  <div className="flex flex-col gap-1">
    <span className={`text-lg ${TYPO.mono("semibold")}`}>{v}</span>
    <Text size="xs" c="muted">
      {k}
    </Text>
  </div>
)
