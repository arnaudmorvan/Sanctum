/** The Tokens tab — the FOUNDATIONS compared, the layer under the components.
 *
 *  Parity answers "does this component exist on both sides". This answers the question
 *  underneath it, and a divergence here is worth more: a component can be wrong on its
 *  own, a token is wrong on every screen at once.
 *
 *  Two halves, because the two sides do not describe the same kind of thing:
 *
 *    • **the scales** — radius, type, line heights, widths, containers, weights. Both
 *      sides name them almost identically, so they compare name by name once rem is
 *      turned into px. Today they line up almost perfectly, and saying so is half the
 *      value: a front-end dev needs to know where NOT to look;
 *    • **the colours** — no name correspondence exists between Figma's semantic tokens
 *      (`text-primary`) and the kit's primitives (`--color-gray-dark-100`), and inventing
 *      one would be a mapping with no owner. The answerable question is whether the colour
 *      a token resolves to is one the kit's palette actually holds — shown as a swatch
 *      next to the palette entry that carries it, or the absence of one.
 *
 *  ⚠️ This tab has NO snapshot fallback. `ui-manifest.json` carries the component API and
 *  no CSS at all, so without `KIT_REPO` there is nothing to compare against — and the tab
 *  says exactly that instead of showing half a report.
 */
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Check, Copy, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { TYPO } from "../../../src/typo"
import {
  AccessError,
  type ColorRow,
  getTokens,
  getTokensBrief,
  NotConfigured,
  type ParityFinding,
  readKey,
  type TokenFamily,
  type TokensReport,
} from "../mcp"

const VERDICT: Record<string, { color: string; label: string }> = {
  aligned: { color: "green", label: "aligned" },
  differs: { color: "red", label: "differs" },
  "figma-only": { color: "orange", label: "not in the kit" },
  "kit-only": { color: "gray", label: "not in Figma" },
  unreadable: { color: "purple", label: "not readable" },
}

const SEVERITY: Record<string, string> = { high: "red", medium: "orange", low: "gray" }
const OWNER: Record<string, string> = {
  kit: "For the kit",
  both: "To settle together",
  figma: "For the Figma file",
}

/** ⚠️ Two layers, not one. A third of these tokens carry alpha — `#f044381a` is that red
 *  at 10% — and painted straight onto the dark panel they are indistinguishable from the
 *  background AND from each other. The chequer underneath is what makes a translucent
 *  swatch legible, and it is the same trick every colour picker uses for the same reason.
 *
 *  The one place an inline style earns its keep: the colour IS the datum, and no class can
 *  carry an arbitrary hex read from a catalogue at runtime. */
const CHEQUER =
  "repeating-conic-gradient(#8a8a8a 0% 25%, #ffffff 0% 50%) 50% / 6px 6px"

const Swatch = ({ hex, title }: { hex: string; title?: string }) => (
  <span
    title={title ?? hex}
    className="inline-block h-4 w-4 shrink-0 overflow-hidden rounded border border-white/20 align-middle"
    style={{ background: CHEQUER }}
  >
    <span className="block h-full w-full" style={{ background: hex }} />
  </span>
)

const Family = ({ fam }: { fam: TokenFamily }) => {
  const [open, setOpen] = useState(fam.counts.differs > 0 || fam.counts.figma_only > 0)
  const clean = fam.counts.aligned === fam.counts.total
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-wrap items-center gap-2">
          <Card.Title>{fam.label}</Card.Title>
          <span className={`${TYPO.mono()} text-gray-dark-500 text-xs`}>
            {fam.counts.total} tokens
          </span>
          {clean ? (
            <Badge color="green" size="sm">
              <Check size={13} />
              all aligned
            </Badge>
          ) : (
            <>
              {fam.counts.differs > 0 ? (
                <Badge color="red" size="sm">
                  {fam.counts.differs} differ
                </Badge>
              ) : null}
              {fam.counts.figma_only > 0 ? (
                <Badge color="orange" size="sm" variant="light">
                  {fam.counts.figma_only} not in the kit
                </Badge>
              ) : null}
              {fam.counts.kit_only > 0 ? (
                <Badge color="gray" size="sm" variant="light">
                  {fam.counts.kit_only} not in Figma
                </Badge>
              ) : null}
            </>
          )}
        </div>
      </Card.Header>
      <Card.Content>
        <Text size="sm" c="secondary">
          {fam.what}
        </Text>
        <button
          type="button"
          className="mt-2 cursor-pointer text-gray-dark-400 text-xs hover:text-gray-dark-200"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Hide" : "Show"} the {fam.counts.total} tokens
        </button>
        {open ? (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-dark-500 text-[11px] uppercase">
                  <th className="pb-1 pr-3 font-normal">Token</th>
                  <th className="pb-1 pr-3 font-normal">Figma</th>
                  <th className="pb-1 pr-3 font-normal">Kit</th>
                  <th className="pb-1 font-normal">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {fam.rows.map((r) => {
                  const v = VERDICT[r.verdict] ?? VERDICT.unreadable
                  return (
                    <tr key={r.token} className="border-white/6 border-t align-top">
                      <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-200 text-xs`}>
                        {r.token}
                      </td>
                      <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-xs`}>
                        {r.figma ?? "—"}
                      </td>
                      <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-300 text-xs`}>
                        {r.kit ?? "—"}
                      </td>
                      <td className="py-1">
                        <Badge color={v.color} size="sm" variant="light">
                          {v.label}
                        </Badge>
                        {r.note ? (
                          <div className="mt-0.5 text-[11px] text-gray-dark-500">{r.note}</div>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card.Content>
    </Card>
  )
}

const Colors = ({ colors }: { colors: TokensReport["colors"] }) => {
  const [onlyHoles, setOnlyHoles] = useState(true)
  const rows = onlyHoles ? colors.rows.filter((r) => r.in_palette.length === 0) : colors.rows
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-wrap items-center gap-2">
          <Card.Title>Colours</Card.Title>
          <span className={`${TYPO.mono()} text-gray-dark-500 text-xs`}>
            {colors.counts.tokens} semantic tokens · {colors.palette_size} in the kit's palette
          </span>
          {colors.counts.off_palette > 0 ? (
            <Badge color="orange" size="sm">
              {Object.keys(colors.off_palette_colors).length} colours the kit does not ship
            </Badge>
          ) : (
            <Badge color="green" size="sm">
              <Check size={13} />
              every token is in the palette
            </Badge>
          )}
        </div>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-3">
          {/* ⚠️ Stated FIRST when it is true: a colour comparison run on one mode looks
              exactly like one run on both, and this is the only thing that says otherwise. */}
          {!colors.modes_exported ? (
            <Alert
              type="warning"
              variant="outline"
              title="Only one colour mode is in the export"
              description="ds-fondations.yaml resolves every variable against its collection's default mode — Dark, on this file — so the Light values are nowhere. The Figma plugin was fixed on 2026-09-09 to write values_by_mode; re-run a sync from Figma and both modes are compared here."
            />
          ) : (
            <Text size="sm" c="secondary">
              Modes exported: {colors.modes.join(" · ")}. Each token is looked up in the
              kit's palette once per mode.
            </Text>
          )}

          <Text size="sm" c="secondary">
            Figma names colours by ROLE (<code className={TYPO.mono()}>text-primary</code>),
            the kit by HUE (<code className={TYPO.mono()}>--color-gray-dark-100</code>) — so
            they are matched by value, not by name. A token with no palette entry is a
            colour no <code className={TYPO.mono()}>data-color</code> can reproduce.
          </Text>

          <label className="flex items-center gap-2 text-gray-dark-400 text-xs">
            <input
              type="checkbox"
              checked={onlyHoles}
              onChange={(e) => setOnlyHoles(e.target.checked)}
            />
            Show only the tokens the palette cannot reproduce ({colors.counts.off_palette})
          </label>

          <div className="max-h-96 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-dark-500 text-[11px] uppercase">
                  <th className="pb-1 pr-3 font-normal">Token</th>
                  <th className="pb-1 pr-3 font-normal">Resolves to</th>
                  <th className="pb-1 font-normal">In the kit's palette</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: ColorRow) => (
                  <tr key={r.token} className="border-white/6 border-t align-top">
                    <td className={`${TYPO.mono()} py-1 pr-3 text-gray-dark-200 text-xs`}>
                      {r.token}
                    </td>
                    <td className="py-1 pr-3">
                      <span className="flex items-center gap-1.5">
                        <Swatch hex={r.default} />
                        <code className={`${TYPO.mono()} text-gray-dark-300 text-xs`}>
                          {r.default}
                        </code>
                        {r.alpha !== null ? (
                          <span className="text-[11px] text-gray-dark-500">
                            {Math.round(r.alpha * 100)}%
                          </span>
                        ) : null}
                      </span>
                      {Object.entries(r.modes).map(([mode, v]) => (
                        <span key={mode} className="mt-0.5 flex items-center gap-1.5">
                          <Swatch hex={v} />
                          <span className="text-[11px] text-gray-dark-500">
                            {mode} · {v}
                          </span>
                        </span>
                      ))}
                    </td>
                    <td className="py-1">
                      {r.in_palette.length > 0 ? (
                        <code className={`${TYPO.mono()} text-gray-dark-400 text-xs`}>
                          {r.in_palette[0]}
                        </code>
                      ) : (
                        <Badge color="orange" size="sm" variant="light">
                          nothing carries it
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

const Finding = ({ f }: { f: ParityFinding }) => (
  <li className="border-white/6 border-t py-2 first:border-t-0">
    <div className="flex flex-wrap items-baseline gap-2">
      <Badge color={SEVERITY[f.severity]} size="sm" variant="light">
        {f.severity}
      </Badge>
      <Badge color="gray" size="sm" variant="outline">
        {OWNER[f.owner]}
      </Badge>
      <Text size="sm" className={TYPO.title("semibold")}>
        {f.title}
      </Text>
    </div>
    <Text size="sm" c="secondary" className="mt-1">
      {f.detail}
    </Text>
    {f.evidence ? (
      <div className={`${TYPO.mono()} mt-1 text-[11px] text-gray-dark-500`}>{f.evidence}</div>
    ) : null}
  </li>
)

export const TokensView = () => {
  const key = readKey()
  const [data, setData] = useState<TokensReport | null>(null)
  const [error, setError] = useState("")
  // A 503 is not a failure: it is the server saying this capability was never wired. Shown
  // as an alarm it sends someone hunting for a bug that does not exist.
  const [unwired, setUnwired] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const load = useCallback(
    (fresh: boolean) => {
      if (!key) return
      setLoading(true)
      setError("")
      setUnwired(false)
      getTokens(fresh)
        .then(setData)
        .catch((e: Error) => {
          setUnwired(e instanceof NotConfigured)
          setError(
            e instanceof AccessError
              ? "Key rejected. It is DASHBOARD_KEY, in the MCP service variables."
              : e.message,
          )
        })
        .finally(() => setLoading(false))
    },
    [key],
  )

  useEffect(() => {
    load(false)
  }, [load])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(await getTokensBrief())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  if (!key)
    return (
      <Alert
        type="info"
        variant="outline"
        title="This section reads the MCP server: it needs the read key."
        description="It is the DASHBOARD_KEY variable of the MCP service. It stays in your browser."
      />
    )
  if (error && !data)
    return unwired ? (
      // Not an error state: a set-up state. It says what is missing, WHERE to set it, and
      // why this tab — unlike Parity — has no snapshot to fall back on.
      <div className="flex flex-col gap-4">
        <Alert
          type="info"
          variant="outline"
          title="This tab is not wired yet"
          description={error}
        />
        <Card>
          <Card.Header>
            <Card.Title>What to set, and where</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Text size="sm" c="secondary">
                On the <strong>mcp-42</strong> service in Railway → Variables. The
                Configuration tab shows the capability once it is set.
              </Text>
              <pre
                className={`${TYPO.mono()} overflow-x-auto rounded border border-white/10 p-3 text-gray-dark-300 text-xs`}
              >{`KIT_REPO=42staff/kit
KIT_BRANCH=main
KIT_TOKEN=<a PAT with Contents: Read on that repo>`}</pre>
              <Text size="sm" c="secondary">
                ⚠️ <code className={TYPO.mono()}>KIT_TOKEN</code> is not optional in
                practice: the server's own PAT is fine-grained on{" "}
                <code className={TYPO.mono()}>mcp-Omniscient</code> and cannot read a repo
                of the <code className={TYPO.mono()}>42staff</code> org.
              </Text>
              <Text size="sm" c="secondary">
                Why there is no fallback: the kit's CSS —{" "}
                <code className={TYPO.mono()}>theme.css</code>,{" "}
                <code className={TYPO.mono()}>colors.css</code> — exists in no committed
                snapshot. <code className={TYPO.mono()}>ui-manifest.json</code> carries the
                component API and no tokens at all, so there is genuinely nothing here to
                compare Figma against until the kit can be read.
              </Text>
            </div>
          </Card.Content>
        </Card>
      </div>
    ) : (
      <Alert
        color="red"
        variant="light"
        title="The foundations cannot be compared"
        description={error}
      />
    )
  if (!data)
    return (
      <div className="flex items-center gap-2 py-8">
        <Spinner size="sm" />
        <Text c="secondary">Reading the two sets of tokens…</Text>
      </div>
    )

  const c = data.counts
  return (
    <div className="flex flex-col gap-6">
      <Card variant="outline" padding="sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Text size="xs" c="muted">
              Figma
            </Text>
            <Text size="sm">
              {data.sources.figma.ds_name || "the DS file"}{" "}
              <span className={`${TYPO.mono()} text-gray-dark-500`}>
                · synced {data.sources.figma.generated_at || "?"}
              </span>
            </Text>
          </div>
          <div>
            <Text size="xs" c="muted">
              Kit
            </Text>
            <Text size="sm">
              <span className={`${TYPO.mono()} text-gray-dark-500`}>
                {data.sources.kit.repo}@{data.sources.kit.branch} · {data.sources.kit.theme}
              </span>
            </Text>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => load(true)} disabled={loading}>
          <RefreshCw size={14} />
          {loading ? "Re-reading…" : "Re-read"}
        </Button>
        <Button size="sm" variant="outline" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy the brief"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Tokens compared", c.tokens],
          ["Values that differ", c.differs],
          ["Colour tokens", data.colors.counts.tokens],
          ["Findings", c.findings],
        ].map(([label, value]) => (
          <Card key={String(label)} variant="outline" padding="sm">
            <Text c="muted" size="sm">
              {label}
            </Text>
            <div className={`${TYPO.mono()} text-2xl text-white`}>{value}</div>
          </Card>
        ))}
      </div>

      {data.findings.length > 0 ? (
        <Card>
          <Card.Header>
            <Card.Title>What to change, and who changes it</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="flex flex-col">
              {data.findings.map((f, i) => (
                <Finding key={`${f.kind}-${i}`} f={f} />
              ))}
            </ul>
          </Card.Content>
        </Card>
      ) : null}

      <Colors colors={data.colors} />

      <div className="flex flex-col gap-3">
        <Title order={2} size="md" className={TYPO.title()}>
          The scales
        </Title>
        {data.families.map((f) => (
          <Family key={f.key} fam={f} />
        ))}
      </div>

      {/* Spacing is a STRUCTURAL divergence, not a set of holes — Tailwind owns spacing on
          the kit's side. Said once, here, rather than as forty missing tokens above. */}
      <Card>
        <Card.Header>
          <Card.Title>Spacing</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text size="sm" c="secondary">
            {data.spacing.kit_declares.length === 0
              ? "The kit declares no spacing scale of its own: Tailwind v4 owns spacing and the kit consumes it. Figma's scale therefore has no counterpart to compare against — a structural divergence, not a hole."
              : `The kit declares ${data.spacing.kit_declares.length} spacing tokens.`}
          </Text>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(data.spacing.figma_steps).map(([name, value]) => {
              const odd = data.spacing.off_grid.includes(name)
              return (
                <span
                  key={name}
                  className={`${TYPO.mono()} rounded border px-1.5 py-0.5 text-[11px] ${
                    odd ? "border-orange-500/60 text-orange-300" : "border-white/10 text-gray-dark-400"
                  }`}
                  title={odd ? "Off the 4-point grid" : undefined}
                >
                  {name.replace(/^spacing-/, "")} {value}
                </span>
              )
            })}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
