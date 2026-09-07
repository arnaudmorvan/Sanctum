/** The small series of the Observability tab.
 *
 *  Why three separate charts rather than a single one with three curves: calls, sessions and
 *  errors do not share an order of magnitude (hundreds against a handful). Overlaying them
 *  would call for two axes — the worst possible flaw in dataviz, the low curve becomes a
 *  flat line. Separated, each one keeps its own scale and stays readable.
 *
 *  A single hue everywhere: each chart carries a single series, and its TITLE says which
 *  one. A categorical palette would be false information here — and green/red failed the
 *  color-blindness check (ΔE 4.1 under deuteranopia). Red therefore only ever means STATUS,
 *  on errors, and always comes with its label.
 */
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import { TYPO } from "../../../src/typo"

export const Series = ({
  title,
  values,
  status,
}: {
  title: string
  values?: number[]
  status?: boolean
}) => {
  const v = values ?? []
  const max = Math.max(1, ...v)
  const total = v.reduce((a, b) => a + b, 0)
  const hue = status ? "var(--color-red-400)" : "var(--color-brand-400)"

  return (
    <Card variant="outline" padding="sm" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Text c="secondary" size="sm">
          {title}
        </Text>
        <span className={`${TYPO.mono()} text-white text-xl`}>{total}</span>
      </div>
      {v.length ? (
        <div className="flex h-10 items-end gap-[2px]" aria-hidden="true">
          {v.map((n, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: a series is indexed by position
              key={i}
              // 4px rounded at the tip of the bar, anchored to the baseline; 2px of gutter
              // between bars (the `gap` above) so they never touch.
              className="min-h-[2px] flex-1 rounded-t"
              style={{ height: `${(n / max) * 100}%`, background: hue, opacity: n ? 1 : 0.25 }}
              title={`${n}`}
            />
          ))}
        </div>
      ) : (
        <div className="h-10" />
      )}
      <Text c="muted" size="xs">
        last {v.length} days
      </Text>
    </Card>
  )
}

/** Activity by day and by hour. Magnitude → ONE single hue, from light to dense: a rainbow
 *  would suggest categories where there is only intensity. */
export const Heatmap = ({ grid }: { grid?: number[][] }) => {
  const g = grid ?? []
  const max = Math.max(1, ...g.flat())
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  if (!g.length) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-dark-400 text-sm">Activity by day and hour</span>
      <div className="flex flex-col gap-[2px]">
        {g.map((row, d) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 7 days, index = day
          <div key={d} className="flex items-center gap-[2px]">
            <span className="w-3 shrink-0 text-gray-dark-500 text-xs">{days[d]}</span>
            {row.map((n, h) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: 24 hours, index = hour
                key={h}
                className="h-3 flex-1 rounded-[2px]"
                style={{
                  background: "var(--color-brand-400)",
                  opacity: n ? 0.2 + 0.8 * (n / max) : 0.06,
                }}
                title={`${days[d]} ${String(h).padStart(2, "0")}:00 — ${n} calls`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
