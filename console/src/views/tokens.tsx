/** The Tokens tab — the FOUNDATIONS compared, the layer under the components, REVIEWED.
 *
 *  Parity answers "does this component exist on both sides". This answers the question
 *  underneath it, and a divergence here is worth more: a component can be wrong on its
 *  own, a token is wrong on every screen at once.
 *
 *  Same shape as the Parity tab since 2026-09-10, on purpose — a reviewer moving between
 *  the two should not have to learn a second page:
 *
 *    • **the differences first**, each with its owner and an Ignore, and the number on
 *      the card is the number of ACTIVE findings — the same one the brief carries;
 *    • **the numbers are doors**: "To review", "Colours the kit lacks", "Ignored" each
 *      open the list they count;
 *    • **the colours are grouped by COLOUR**, not by token — `#f04438` seen through a dozen
 *      alpha variants is one divergence, not twelve — and each colour can be ignored on
 *      its own: the reviewer who knows the error red is being re-bound next sprint
 *      settles that red, not the other forty-eight;
 *    • **the scales fold**: a family whose eleven steps line up is one line saying so,
 *      because a front-end dev needs to know where NOT to look as much as where to.
 *
 *  Two halves, because the two sides do not describe the same kind of thing: the SCALES
 *  compare name by name once rem becomes px; the COLOURS have no name correspondence
 *  (`text-primary` against `--color-gray-dark-100`) and are matched by value — does the
 *  colour a token resolves to exist in the kit's palette at all.
 *
 *  ⚠️ This tab has NO snapshot fallback for the kit's CSS beyond `ui-tokens.json`, and
 *  the report says which road it took. */
import { Alert } from "@42/ui-react/alert"
import { Badge } from "@42/ui-react/badge"
import { Button } from "@42/ui-react/button"
import { Card } from "@42/ui-react/card"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import { Check, ChevronDown, ChevronRight, Copy, RefreshCw, Sparkles } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Signature } from "../../../src/layout/identity"
import { TYPO } from "../../../src/typo"
import {
  AccessError,
  type ColorRow,
  getTokens,
  getTokensBrief,
  NotConfigured,
  readKey,
  type TokenFamily,
  type TokensReport,
} from "../mcp"
import {
  FindingRow,
  IgnoreButton,
  OWNER,
  type Owner,
  OwnerBar,
  RestoreButton,
  ReviewContext,
  useReview,
  useReviewState,
} from "./review"

const VERDICT: Record<string, { color: string; label: string }> = {
  aligned: { color: "green", label: "aligned" },
  differs: { color: "red", label: "differs" },
  "figma-only": { color: "orange", label: "not in the kit" },
  "kit-only": { color: "gray", label: "not in Figma" },
  unreadable: { color: "purple", label: "not readable" },
}

type Tab = "findings" | "colours" | "scales" | "ignored"

/** ⚠️ Two layers, not one. A third of these tokens carry alpha — `#f044381a` is that red
 *  at 10% — and painted straight onto the dark panel they are indistinguishable from the
 *  background AND from each other. The chequer underneath is what makes a translucent
 *  swatch legible, and it is the same trick every colour picker uses for the same reason.
 *
 *  The one place an inline style earns its keep: the colour IS the datum, and no class can
 *  carry an arbitrary hex read from a catalogue at runtime. */
const CHEQUER = "repeating-conic-gradient(#8a8a8a 0% 25%, #ffffff 0% 50%) 50% / 6px 6px"

const Swatch = ({ hex, title, size = 4 }: { hex: string; title?: string; size?: number }) => (
  <span
    title={title ?? hex}
    className={`inline-block shrink-0 overflow-hidden rounded border border-white/20 align-middle ${
      size === 6 ? "h-6 w-6" : "h-4 w-4"
    }`}
    style={{ background: CHEQUER }}
  >
    <span className="block h-full w-full" style={{ background: hex }} />
  </span>
)

// ---------------------------------------------------------------- the scales

/** One family. Open when something differs; a clean family is ONE line, and the eleven
 *  aligned rows are a click away for whoever wants to see them line up. */
const Family = ({ fam }: { fam: TokenFamily }) => {
  const dirty = fam.counts.differs + fam.counts.figma_only + fam.counts.kit_only
  const [open, setOpen] = useState(dirty > 0)
  const [all, setAll] = useState(false)
  const rows = all ? fam.rows : fam.rows.filter((r) => r.verdict !== "aligned")
  return (
    <div className="rounded-lg border border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/3"
      >
        {open ? (
          <ChevronDown size={14} className="shrink-0 text-gray-dark-500" />
        ) : (
          <ChevronRight size={14} className="shrink-0 text-gray-dark-500" />
        )}
        <Text size="sm" className={TYPO.title("semibold")}>
          {fam.label}
        </Text>
        <span className={`${TYPO.mono()} text-gray-dark-500 text-xs`}>
          {fam.counts.aligned}/{fam.counts.total} aligned
        </span>
        {dirty === 0 ? (
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
        <span className="ml-1 truncate text-[11px] text-gray-dark-500">{fam.what}</span>
      </button>
      {open ? (
        <div className="border-white/8 border-t px-3 py-2">
          <label className="mb-1 flex items-center gap-2 text-gray-dark-400 text-xs">
            <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
            Show the aligned steps too
          </label>
          {rows.length === 0 ? (
            <Text size="xs" c="muted">
              Every step lines up, name for name and value for value.
            </Text>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] text-gray-dark-500 uppercase">
                    <th className="pb-1 pr-3 font-normal">Token</th>
                    <th className="pb-1 pr-3 font-normal">Figma</th>
                    <th className="pb-1 pr-3 font-normal">Kit</th>
                    <th className="pb-1 font-normal">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
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
          )}
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- the colours

/** The colours, grouped by COLOUR. The question a dev opens this with is "which colours
 *  do I have to add to the palette" — forty-nine answers, not sixty-one tokens. Each one
 *  carries the tokens that resolve to it and the reviewer's decision. */
const Colours = ({ colors }: { colors: TokensReport["colors"] }) => {
  const review = useReview()
  const [showCarried, setShowCarried] = useState(false)
  const [showIgnored, setShowIgnored] = useState(false)
  const off = Object.entries(colors.off_palette_colors)
  const ignored = new Set(colors.ignored_colors)
  const shown = off.filter(([rgb]) => showIgnored || !ignored.has(rgb))
  const byRgb = (rgb: string) => colors.rows.filter((r) => r.default.toLowerCase().slice(1, 7) === rgb)

  return (
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
          Modes exported: {colors.modes.join(" · ")}. Each token is looked up in the kit's
          palette once per mode.
        </Text>
      )}
      <Text size="xs" c="muted">
        Figma names colours by ROLE (<code className={TYPO.mono()}>text-primary</code>), the
        kit by HUE (<code className={TYPO.mono()}>--color-gray-dark-100</code>) — so they are
        matched by value, not by name. A colour with no palette entry is one no{" "}
        <code className={TYPO.mono()}>data-color</code> can reproduce. Grouped by colour: the
        error red seen through a dozen alpha variants is one divergence, not twelve.
      </Text>

      <div className="flex flex-wrap items-center gap-2">
        <Text size="sm" className={TYPO.title("semibold")}>
          Colours the palette cannot reproduce
        </Text>
        <Badge color={shown.length > 0 ? "orange" : "green"} size="sm" variant="light">
          {shown.length} colour{shown.length === 1 ? "" : "s"} · {colors.counts.off_palette}{" "}
          token{colors.counts.off_palette === 1 ? "" : "s"}
        </Badge>
        <span className="text-[11px] text-gray-dark-500">
          {colors.counts.in_palette} of {colors.counts.tokens} tokens resolve to a colour the
          kit ships ({colors.palette_size} in the palette)
        </span>
        {ignored.size > 0 ? (
          <button
            type="button"
            onClick={() => setShowIgnored((v) => !v)}
            className="text-[11px] text-gray-dark-500 hover:text-white"
          >
            {showIgnored ? "hide" : "show"} {ignored.size} ignored
          </button>
        ) : null}
      </div>

      {shown.length === 0 ? (
        <Text size="xs" c="muted">
          {off.length === 0
            ? "Every colour a token resolves to exists in the kit's palette."
            : "Every off-palette colour has been settled by the reviewer."}
        </Text>
      ) : (
        <ul className="flex flex-col">
          {shown.map(([rgb, tokens]) => {
            const id = `color-off-palette:foundations:${rgb}`
            const isIgnored = ignored.has(rgb)
            const rows = byRgb(rgb)
            const alphas = [...new Set(rows.map((r) => r.alpha).filter((a): a is number => a !== null))]
            return (
              <li
                key={rgb}
                className={`border-white/6 border-t py-2 first:border-t-0 ${isIgnored ? "opacity-50" : ""}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Swatch hex={`#${rgb}`} size={6} />
                  <code className={`${TYPO.mono()} text-gray-dark-100 text-sm`}>#{rgb}</code>
                  <span className="text-[11px] text-gray-dark-500">
                    {tokens.length} token{tokens.length > 1 ? "s" : ""}
                    {alphas.length > 0
                      ? ` · at ${alphas
                          .sort((a, b) => b - a)
                          .map((a) => `${Math.round(a * 100)}%`)
                          .join(", ")}`
                      : ""}
                  </span>
                  <span className="ml-auto">
                    {isIgnored ? (
                      <RestoreButton id={id} />
                    ) : (
                      <IgnoreButton id={id} title={`#${rgb} is not in the kit's palette`} />
                    )}
                  </span>
                </div>
                <div className={`${TYPO.mono()} mt-1 flex flex-wrap gap-1 text-[11px]`}>
                  {tokens.map((t) => (
                    <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-gray-dark-300">
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <label className="flex items-center gap-2 text-gray-dark-400 text-xs">
        <input
          type="checkbox"
          checked={showCarried}
          onChange={(e) => setShowCarried(e.target.checked)}
        />
        Show the {colors.counts.in_palette} tokens the palette carries, and where
      </label>
      {showCarried ? (
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] text-gray-dark-500 uppercase">
                <th className="pb-1 pr-3 font-normal">Token</th>
                <th className="pb-1 pr-3 font-normal">Resolves to</th>
                <th className="pb-1 font-normal">In the kit's palette</th>
              </tr>
            </thead>
            <tbody>
              {colors.rows
                .filter((r: ColorRow) => r.in_palette.length > 0)
                .map((r: ColorRow) => (
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
                    <td className={`${TYPO.mono()} py-1 text-gray-dark-400 text-xs`}>
                      {r.in_palette[0]}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------- the page

export const TokensView = () => {
  const key = readKey()
  const [data, setData] = useState<TokensReport | null>(null)
  const [error, setError] = useState("")
  // A 503 is not a failure: it is the server saying this capability was never wired. Shown
  // as an alarm it sends someone hunting for a bug that does not exist.
  const [unwired, setUnwired] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState("")
  const [tab, setTab] = useState<Tab>("findings")
  const [owner, setOwner] = useState<Owner>("both")

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

  const reload = useCallback(async () => setData(await getTokens(false)), [])
  const { review, error: reviewError } = useReviewState(data?.review, reload)

  const copy = async (filter: { owner?: Owner; prompt?: boolean }, tag: string) => {
    try {
      await navigator.clipboard.writeText(await getTokensBrief(filter))
      setCopied(tag)
      setTimeout(() => setCopied(""), 2000)
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
        <Alert type="info" variant="outline" title="This tab is not wired yet" description={error} />
        <Card>
          <Card.Header>
            <Card.Title>What to set, and where</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-3">
              <Text size="sm" c="secondary">
                On the <strong>mcp-42</strong> service in Railway → Variables. The Configuration
                tab shows the capability once it is set.
              </Text>
              <pre
                className={`${TYPO.mono()} overflow-x-auto rounded border border-white/10 p-3 text-gray-dark-300 text-xs`}
              >{`KIT_REPO=42staff/kit
KIT_BRANCH=main
KIT_TOKEN=<a PAT with Contents: Read on that repo>`}</pre>
              <Text size="sm" c="secondary">
                ⚠️ <code className={TYPO.mono()}>KIT_TOKEN</code> is not optional in practice:
                the server's own PAT is fine-grained on{" "}
                <code className={TYPO.mono()}>mcp-Omniscient</code> and cannot read a repo of
                the <code className={TYPO.mono()}>42staff</code> org.
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
  const offColours = Object.keys(data.colors.off_palette_colors).filter(
    (rgb) => !data.colors.ignored_colors.includes(rgb),
  ).length
  const active = data.findings.filter((f) => !f.ignored)
  const ignoredList = data.findings.filter((f) => f.ignored)

  const stat = (label: string, value: number, t: Tab, tone?: string) => (
    <button
      key={t}
      type="button"
      onClick={() => setTab(t)}
      className={`rounded-lg border p-3 text-left transition ${
        tab === t ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/25"
      }`}
    >
      <Text c="muted" size="sm">
        {label}
      </Text>
      <div className={`${TYPO.mono()} text-2xl ${tone ?? "text-white"}`}>{value}</div>
    </button>
  )

  return (
    <ReviewContext.Provider value={review}>
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
              <div className="flex items-center gap-2">
                <Text size="xs" c="muted">
                  Kit
                </Text>
                <Badge
                  color={data.sources.kit.mode === "live" ? "green" : "orange"}
                  size="sm"
                  variant="light"
                >
                  {data.sources.kit.mode === "live" ? "read live" : "snapshot"}
                </Badge>
              </div>
              <Text size="sm">
                {data.sources.kit.mode === "live" ? (
                  <span className={`${TYPO.mono()} text-gray-dark-500`}>
                    {data.sources.kit.repo}@{data.sources.kit.branch} ·{" "}
                    {data.sources.kit.sources.join(", ")}
                  </span>
                ) : (
                  <span className={`${TYPO.mono()} text-gray-dark-500`}>
                    {data.sources.kit.package} {data.sources.kit.version} · ui-tokens.json,{" "}
                    {data.sources.kit.generated_at}
                  </span>
                )}
              </Text>
              {/* Not an error, and not hidden either: the snapshot gives the right answer
                  for the day it was taken, and the only thing that can say so is this. */}
              {data.sources.kit.note ? (
                <Text size="xs" c="muted" className="mt-1">
                  {data.sources.kit.note}
                </Text>
              ) : null}
              {data.sources.kit.error ? (
                <Text size="xs" className="mt-1 text-orange-300">
                  {data.sources.kit.error}
                </Text>
              ) : null}
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => load(true)} disabled={loading}>
            <RefreshCw size={14} />
            {loading ? "Re-reading…" : "Re-read"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => void copy({}, "all")}>
            {copied === "all" ? <Check size={14} /> : <Copy size={14} />}
            {copied === "all" ? "Copied" : "Copy the whole brief"}
          </Button>
          <span className="ml-2 flex items-center gap-2 border-white/10 border-l pl-3">
            <Text size="xs" c="muted">
              Reviewing as
            </Text>
            <Signature />
          </span>
        </div>
        {!data.review.can_write ? (
          <Text size="xs" c="muted">
            The review is read-only on this server (no write access, or READ_ONLY): findings
            can be read and copied, not ignored.
          </Text>
        ) : !review.author ? (
          <Text size="xs" className="text-blue-200">
            Say who you are (in the toolbar) to ignore a finding — a decision is signed.
          </Text>
        ) : null}
        {reviewError ? (
          <Alert
            color="red"
            variant="light"
            title="The decision was not saved"
            description={reviewError}
          />
        ) : null}

        {/* The numbers are DOORS. Each opens the list it counts. */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stat("To review", c.findings, "findings", c.findings > 0 ? "text-orange-300" : "text-white")}
          {stat(
            "Colours the kit lacks",
            offColours,
            "colours",
            offColours > 0 ? "text-orange-300" : "text-white",
          )}
          {stat("Tokens compared", c.tokens, "scales")}
          {stat("Ignored", c.ignored, "ignored", "text-gray-dark-400")}
        </div>

        {tab === "findings" ? (
          <div className="flex flex-col gap-3">
            <Title order={2} size="md" className={TYPO.title()}>
              What to change, and who changes it
            </Title>
            <OwnerBar owner={owner} counts={c.by_owner} setOwner={setOwner}>
              <Button size="sm" variant="subtle" onClick={() => void copy({ owner }, owner)}>
                {copied === owner ? <Check size={14} /> : <Copy size={14} />}
                {copied === owner ? "Copied" : "Copy this list"}
              </Button>
              <Button
                size="sm"
                variant="subtle"
                title="The same list, prefaced so an agent can run it"
                onClick={() => void copy({ owner, prompt: true }, `${owner}:prompt`)}
              >
                {copied === `${owner}:prompt` ? <Check size={14} /> : <Sparkles size={14} />}
                {copied === `${owner}:prompt` ? "Copied" : "as a prompt for Claude"}
              </Button>
            </OwnerBar>
            <Text size="sm" c="secondary">
              {OWNER[owner].hint}
            </Text>
            <Card>
              <Card.Content>
                {(() => {
                  const mine = active.filter((f) => f.owner === owner)
                  // The off-palette colours are forty-nine findings of one shape. As
                  // forty-nine rows they buried the radius that differs; here they are ONE
                  // line, and the Colours tab is where they are settled one by one.
                  const colours = mine.filter((f) => f.kind === "color-off-palette")
                  const rest = mine.filter((f) => f.kind !== "color-off-palette")
                  if (mine.length === 0)
                    return (
                      <Text c="secondary" size="sm">
                        Nothing on this side.
                      </Text>
                    )
                  return (
                    <ul className="flex flex-col">
                      {rest.map((f) => (
                        <FindingRow key={f.id} f={f} />
                      ))}
                      {colours.length > 0 ? (
                        <li className="border-white/6 border-t py-2 first:border-t-0">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <Badge color="orange" size="sm" variant="light">
                              medium
                            </Badge>
                            <Badge color={OWNER[owner].color} size="sm" variant="outline">
                              {OWNER[owner].short}
                            </Badge>
                            <Text size="sm" className={TYPO.title("semibold")}>
                              {colours.length} colour{colours.length > 1 ? "s" : ""} the kit's
                              palette cannot reproduce
                            </Text>
                            <button
                              type="button"
                              onClick={() => setTab("colours")}
                              className="ml-auto text-[11px] text-gray-dark-400 underline decoration-dotted underline-offset-2 hover:text-white"
                            >
                              settle them one by one
                            </button>
                          </div>
                          <Text size="sm" c="secondary" className="mt-1">
                            No <code className={TYPO.mono()}>data-color</code> reproduces
                            them: a screen built on one cannot be rebuilt with the kit. Each
                            is its own line in the brief, and its own decision in Colours.
                          </Text>
                        </li>
                      ) : null}
                    </ul>
                  )
                })()}
              </Card.Content>
            </Card>
          </div>
        ) : null}

        {tab === "colours" ? (
          <Card>
            <Card.Header>
              <Card.Title>Colours</Card.Title>
            </Card.Header>
            <Card.Content>
              <Colours colors={data.colors} />
            </Card.Content>
          </Card>
        ) : null}

        {tab === "scales" ? (
          <div className="flex flex-col gap-3">
            <Title order={2} size="md" className={TYPO.title()}>
              The scales
            </Title>
            <Text size="xs" c="muted">
              Radius, type, line heights, widths, containers, weights — compared name by name
              once rem becomes px. A family that lines up is one line; open it to see the
              steps.
            </Text>
            {data.families.map((f) => (
              <Family key={f.key} fam={f} />
            ))}
            {/* Spacing is a STRUCTURAL divergence, not a set of holes — Tailwind owns
                spacing on the kit's side. Said once, here, rather than as forty missing
                tokens above. */}
            <div className="rounded-lg border border-white/10 px-3 py-2">
              <Text size="sm" className={TYPO.title("semibold")}>
                Spacing
              </Text>
              <Text size="xs" c="muted" className="mt-1">
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
                        odd
                          ? "border-orange-500/60 text-orange-300"
                          : "border-white/10 text-gray-dark-400"
                      }`}
                      title={odd ? "Off the 4-point grid" : undefined}
                    >
                      {name.replace(/^spacing-/, "")} {value}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "ignored" ? (
          <div className="flex flex-col gap-3">
            <Title order={2} size="md" className={TYPO.title()}>
              Ignored by the reviewer ({ignoredList.length})
            </Title>
            <Text size="xs" c="muted">
              Left out of the brief and of every count, with who and why. Same file as the
              components' review (<code className={TYPO.mono()}>{data.review.path}</code>); a
              restore puts one back.
            </Text>
            <Card>
              <Card.Content>
                {ignoredList.length === 0 ? (
                  <Text c="secondary" size="sm">
                    Nothing has been ignored yet.
                  </Text>
                ) : (
                  <ul className="flex flex-col">
                    {ignoredList.map((f) => (
                      <FindingRow key={f.id} f={f} />
                    ))}
                  </ul>
                )}
              </Card.Content>
            </Card>
          </div>
        ) : null}
      </div>
    </ReviewContext.Provider>
  )
}
