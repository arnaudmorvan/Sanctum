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
import { Check, ChevronDown, ChevronRight, Copy, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Signature } from "../../../src/layout/identity"
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
import {
  AssignButtons,
  Closed,
  FindingRow,
  IgnoreButton,
  OWNER,
  HandOff,
  type Owner,
  RestoreButton,
  ReviewContext,
  PendingBar,
  useReviewState,
} from "./review"

const VERDICT: Record<string, { color: string; label: string }> = {
  aligned: { color: "green", label: "aligned" },
  differs: { color: "red", label: "differs" },
  "figma-only": { color: "orange", label: "not in the kit" },
  "kit-only": { color: "gray", label: "not in Figma" },
  unreadable: { color: "purple", label: "not readable" },
}

/** A section of the page that can be folded — never a TAB.
 *
 *  ⚠️ Reported twice on 2026-09-10, the second time as "je n'arrive pas à comprendre la vue
 *  token, ce qui manque et où". The four numbers at the top WERE the navigation: clicking
 *  "Colours the kit lacks" opened the colours, and nothing said so. A reader saw four
 *  figures and a list of two findings — the smallest bucket, because the owner filter
 *  opened on it — and had no way to reach the rest. Everything is on ONE page now; the
 *  numbers scroll to their section instead of swapping the content. */
const Section = ({
  title,
  hint,
  count,
  open,
  onToggle,
  children,
  anchor,
}: {
  title: string
  hint?: string
  count?: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
  anchor?: React.RefObject<HTMLDivElement | null>
}) => (
  <div ref={anchor} className="scroll-mt-4">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/5"
    >
      {open ? (
        <ChevronDown size={16} className="shrink-0 text-gray-dark-500" />
      ) : (
        <ChevronRight size={16} className="shrink-0 text-gray-dark-500" />
      )}
      <Title order={2} size="md" className={TYPO.title()}>
        {title}
      </Title>
      {count ? <span className="text-gray-dark-400 text-sm">{count}</span> : null}
      {hint ? <span className="text-[11px] text-gray-dark-500">{hint}</span> : null}
    </button>
    {open ? <div className="mt-2 flex flex-col gap-3">{children}</div> : null}
  </div>
)

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
                    <th className="pb-1 pr-3 font-normal">React</th>
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

/** The colours, grouped by ROOT CAUSE — the hue behind the role, blocking first.
 *
 *  Reported on 2026-09-10 by a reader of the brief: forty-nine colours in a wall say
 *  nothing about priority. Two things separate `bg-error-primary` from
 *  `utility-fuchsia-700`: its CLASS (a semantic token the kit cannot paint blocks a
 *  screen; a primitive palette step is a note) and its USAGE (how many components paint
 *  with it, read off the exported surfaces). Both are on every line, and the decision
 *  stays per colour: the reviewer settles one red without settling the others. */
/** THE table — where a colour review starts, and the only place it needs to look.
 *
 *  ⚠️ Reported three times on 2026-09-10, the last one plainly: « restructure la partie
 *  token pour que je ne cherche pas où commencer le review — un tableau avec couleur dans
 *  Figma, couleur dans le kit, si pas la même montrer chez qui, et l'action. Moins de
 *  menus qui se déploient. » What was there instead: two boxes grouping the same colours
 *  by family, a folded list of primitives, a findings list that folded the colours back
 *  into two rows, and this table under all of it. Four ways to say the same thing, and
 *  the reader had to assemble them.
 *
 *  One row per COLOUR (a dozen roles share one hex), four columns and no fold: what Figma
 *  draws, what the kit has, WHO settles it, WHAT they do. */
const Colours = ({
  colors,
  findings,
}: {
  colors: TokensReport["colors"]
  findings: ParityFinding[]
}) => {
  const [filter, setFilter] = useState<"missing" | "carried" | "all">("missing")
  const [query, setQuery] = useState("")
  const [showIgnored, setShowIgnored] = useState(false)
  // The modes of ONE collection — the one that covers the most tokens. The union across
  // collections would offer `brand`/`gray`/`pink`, which resolve nothing for 346 of the
  // 347 colour tokens.
  const modeNames = colors.mode_sets?.[0]?.modes ?? []
  // ⚠️ A token is an ALIAS PER MODE: `text-primary` is white in dark and near-black in
  // light, and so is the colour it lands on. The table shows ONE mode and says which.
  const [mode, setMode] = useState(colors.default_mode || modeNames[0] || "")
  const ignored = new Set(colors.ignored_colors)
  // The finding of each off-palette colour, by the colour itself: it carries the owner
  // (who settles it) and the action (what they do), both written server-side.
  const byColourFinding = useMemo(
    () =>
      new Map(
        findings
          .filter((f) => f.kind === "color-off-palette")
          .map((f) => [f.id.split(":").pop() ?? "", f]),
      ),
    [findings],
  )

  const byColour = useMemo(() => {
    type Colour = {
      rgb: string
      hex: string
      /** The distinct opacities the tokens of this colour carry, and whether one is
       *  opaque: `#f04438` and `#f044384d` are ONE colour seen twice. */
      alphas: number[]
      opaque: boolean
      tokens: string[]
      kit: string[]
      used: string[]
      family: string
      near?: { name: string; hex: string; distance: number }
    }
    const out = new Map<string, Colour>()
    for (const r of colors.rows) {
      // ⚠️ The value and the palette hit come from the SAME place. A token whose
      // collection has no such mode (`accent-solid` lives in `7. Accent`, whose modes are
      // brand/gray/pink) falls back to its default value — and must fall back to the
      // default's hit too, or it reads "absent" while the kit ships it.
      const perMode = mode ? r.modes[mode] : ""
      const hex = perMode || r.default
      const rgb = hex.replace("#", "").slice(0, 6).toLowerCase()
      if (rgb.length < 6) continue
      const kit = perMode ? (r.mode_hits[mode] ?? []) : r.in_palette
      const raw = hex.replace("#", "")
      const c: Colour = out.get(rgb) ?? {
        rgb,
        hex: `#${rgb}`,
        alphas: [],
        opaque: false,
        tokens: [],
        kit,
        used: [],
        family: r.family,
        near: colors.nearest?.[rgb],
      }
      c.tokens.push(r.token)
      for (const u of r.used_by) if (!c.used.includes(u)) c.used.push(u)
      if (raw.length === 8) {
        const a = Math.round((Number.parseInt(raw.slice(6, 8), 16) / 255) * 100)
        if (!c.alphas.includes(a)) c.alphas.push(a)
      } else c.opaque = true
      out.set(rgb, c)
    }
    // Missing first, and inside it what is painted the most: the order a reader acts in.
    return [...out.values()].sort((a, b) => {
      if (!a.kit.length !== !b.kit.length) return a.kit.length ? 1 : -1
      if (b.used.length !== a.used.length) return b.used.length - a.used.length
      return a.rgb.localeCompare(b.rgb)
    })
  }, [colors, mode])

  const counted = {
    missing: byColour.filter((c) => c.kit.length === 0).length,
    carried: byColour.filter((c) => c.kit.length > 0).length,
    all: byColour.length,
  }
  const q = query.trim().toLowerCase()
  const shown = byColour.filter((c) => {
    if (filter === "missing" && c.kit.length > 0) return false
    if (filter === "carried" && c.kit.length === 0) return false
    if (!showIgnored && ignored.has(c.rgb) && c.kit.length === 0 && filter !== "all") return false
    if (!q) return true
    return (
      c.rgb.includes(q.replace("#", "")) ||
      c.tokens.some((t) => t.toLowerCase().includes(q)) ||
      c.kit.some((k) => k.toLowerCase().includes(q)) ||
      (c.near?.name ?? "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-2">
      {/* ⚠️ Stated FIRST when it is true: a colour comparison run on one mode looks
          exactly like one run on both, and this is the only thing that says otherwise. */}
      {!colors.modes_exported ? (
        <Alert
          type="warning"
          variant="outline"
          title="Only one colour mode is in the export"
          description="ds-fondations.yaml resolves every variable against its collection's default mode — Dark, on this file — so the Light values are nowhere. The Figma plugin was fixed on 2026-09-09 to write values_by_mode; re-run a sync from Figma and both modes are compared here."
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {(["missing", "carried", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-md border px-2.5 py-1 text-xs transition ${
              filter === f
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/15 text-gray-dark-400 hover:border-white/30"
            }`}
          >
            {f === "missing" ? "Not in React" : f === "carried" ? "In React" : "All"}{" "}
            ({counted[f]})
          </button>
        ))}
        {modeNames.length > 1 ? (
          <span className="ml-2 flex items-center gap-1 border-white/10 border-l pl-3">
            {modeNames.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-md border px-2 py-1 text-xs transition ${
                  mode === m
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/15 text-gray-dark-400 hover:border-white/30"
                }`}
                title="A token is an alias PER MODE: the colour it resolves to is not the same in both."
              >
                {m}
                {m === colors.default_mode ? (
                  <span className="ml-1 text-[9px] text-gray-dark-500">default</span>
                ) : null}
              </button>
            ))}
          </span>
        ) : null}
        {mode && colors.default_mode && mode !== colors.default_mode ? (
          <span className="text-[11px] text-orange-200/80">
            the counts elsewhere on this page are {colors.default_mode} — this table is not
          </span>
        ) : null}
        {ignored.size > 0 ? (
          <button
            type="button"
            onClick={() => setShowIgnored((v) => !v)}
            className="text-[11px] text-gray-dark-500 hover:text-white"
          >
            {showIgnored ? "hide" : "show"} {ignored.size} ignored
          </button>
        ) : null}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="a token, a hex, a kit variable"
          className={`${TYPO.mono()} ml-auto w-56 rounded border border-white/15 bg-transparent px-2 py-1 text-[11px] text-gray-dark-200`}
        />
      </div>

      <div className="max-h-[38rem] overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-gray-dark-950">
            <tr className="text-[11px] text-gray-dark-500 uppercase">
              {/* ⚠️ FIGMA and REACT, the same two words as the Parity tab and as the
                  scales table below — a reader navigates by the side, not by how the
                  value was obtained. */}
              <th className="pb-1 pr-3 font-normal">Figma</th>
              <th className="pb-1 pr-3 font-normal">React</th>
              <th className="pb-1 pr-3 font-normal">Who settles it</th>
              <th className="pb-1 pr-3 font-normal">What they do</th>
              <th className="pb-1 font-normal" />
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => {
              const id = `color-off-palette:foundations:${c.rgb}`
              const isIgnored = ignored.has(c.rgb)
              const finding = byColourFinding.get(c.rgb)
              const owner = finding ? OWNER[finding.owner] : undefined
              return (
                <tr
                  key={c.rgb}
                  className={`border-white/6 border-t align-top ${isIgnored ? "opacity-50" : ""}`}
                >
                  <td className="py-1.5 pr-3">
                    <span className="flex items-center gap-1.5">
                      <Swatch hex={c.hex} />
                      <code className={`${TYPO.mono()} text-gray-dark-200 text-xs`}>
                        {c.hex}
                      </code>
                      {c.alphas.length === 1 && !c.opaque ? (
                        <span className="text-[11px] text-gray-dark-500">{c.alphas[0]}%</span>
                      ) : c.alphas.length > 0 ? (
                        <span
                          className="text-[11px] text-gray-dark-500"
                          title={`${c.opaque ? "opaque, " : ""}${[...c.alphas]
                            .sort((a, b) => a - b)
                            .map((a) => `${a}%`)
                            .join(", ")}`}
                        >
                          {c.alphas.length + (c.opaque ? 1 : 0)} opacities
                        </span>
                      ) : null}
                    </span>
                    <span className={`${TYPO.mono()} mt-0.5 flex flex-wrap gap-1 text-[11px]`}>
                      {c.tokens.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded bg-white/5 px-1.5 py-0.5 text-gray-dark-400"
                        >
                          {t}
                        </span>
                      ))}
                      {c.tokens.length > 3 ? (
                        <span
                          className="px-1 py-0.5 text-gray-dark-600"
                          title={c.tokens.join(", ")}
                        >
                          +{c.tokens.length - 3}
                        </span>
                      ) : null}
                    </span>
                    {/* WHERE it is used — a colour painted by four components and one
                        painted by nothing do not ask for the same work. */}
                    <span className={`${TYPO.mono()} mt-0.5 block text-[10px] text-gray-dark-600`}>
                      {c.used.length === 0
                        ? "painted by nothing"
                        : `painted by ${c.used.slice(0, 3).join(", ")}${
                            c.used.length > 3 ? ` +${c.used.length - 3}` : ""
                          }`}
                    </span>
                  </td>
                  <td className="py-1.5 pr-3">
                    {c.kit.length > 0 ? (
                      <span className="flex items-center gap-1.5">
                        <Check size={12} className="shrink-0 text-green-500" />
                        <code className={`${TYPO.mono()} whitespace-nowrap text-gray-dark-300 text-xs`}>
                          {c.kit[0]}
                        </code>
                        {c.kit.length > 1 ? (
                          <span
                            className="text-[10px] text-gray-dark-600"
                            title={c.kit.join(", ")}
                          >
                            +{c.kit.length - 1}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="flex flex-col items-start gap-0.5">
                        <Badge color="orange" size="sm" variant="light">
                          no such colour
                        </Badge>
                        {c.near ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-dark-500">closest</span>
                            <Swatch hex={c.near.hex} />
                            <code
                              className={`${TYPO.mono()} whitespace-nowrap text-gray-dark-400 text-xs`}
                            >
                              {c.near.name}
                            </code>
                            <span
                              className={`text-[10px] ${
                                c.near.distance < 8 ? "text-orange-200" : "text-gray-dark-600"
                              }`}
                              title="0 is the same colour, 100 is black against white."
                            >
                              {c.near.distance}%
                            </span>
                          </span>
                        ) : null}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-1.5 pr-3">
                    {c.kit.length > 0 ? (
                      <span className="text-[11px] text-gray-dark-600">nothing to do</span>
                    ) : owner ? (
                      <span className="flex items-center gap-1.5">
                        <Badge color={owner.color} size="sm" variant="light">
                          {owner.short}
                        </Badge>
                        <span className="text-[11px] text-gray-dark-400">{owner.person}</span>
                      </span>
                    ) : null}
                  </td>
                  <td className="py-1.5 pr-3 text-[11px] text-gray-dark-400">
                    {c.kit.length > 0 ? "—" : (finding?.action ?? "")}
                  </td>
                  <td className="py-1.5">
                    {c.kit.length > 0 ? null : isIgnored ? (
                      <RestoreButton id={id} />
                    ) : (
                      <span className="flex items-center gap-1">
                        {/* Hand THIS colour to someone, right where it is read. The owner
                            the report computed is a default; the reviewer knows which
                            side is taking it. */}
                        {finding ? (
                          <AssignButtons
                            id={finding.id}
                            title={finding.title}
                            owner={finding.owner as Owner}
                            assignedBy={finding.assigned_by}
                            computed={finding.owner_computed}
                          />
                        ) : null}
                        <IgnoreButton
                          id={id}
                          title={`${c.hex} (${c.family}) is not in the kit's palette`}
                          compact
                        />
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {shown.length === 0 ? (
          <Text size="xs" c="muted" className="py-2">
            Nothing matches.
          </Text>
        ) : null}
      </div>
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
  // Two folds left on the whole page, and both hold reference material rather than work:
  // the scales that line up, and the decisions already set aside.
  const [open, setOpen] = useState({ scales: false, ignored: false })
  const toggle = (k: keyof typeof open) => setOpen((o) => ({ ...o, [k]: !o[k] }))

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
              ? "Token rejected. Sign in again with your 42ds_… access token — the one your MCP connector uses."
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
        title="This section reads the MCP server: it needs your access token."
        description="The same 42ds_… token your MCP connector uses. It stays in your browser."
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
          {/* The export, per person, in the toolbar — where a reader looks for it before
              scrolling. The same three lists the hand-off block hands out further down;
              one gesture, two places, because this one is the one you reach for. */}
          <Button size="sm" variant="outline" onClick={() => void copy({}, "all")}>
            {copied === "all" ? <Check size={14} /> : <Copy size={14} />}
            {copied === "all" ? "Copied" : "Everything"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="The findings the kit has to act on, as a list"
            onClick={() => void copy({ owner: "kit" }, "kit")}
          >
            {copied === "kit" ? <Check size={14} /> : <Copy size={14} />}
            Brief · dev
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="The findings the Figma file has to act on, as a list"
            onClick={() => void copy({ owner: "figma" }, "figma")}
          >
            {copied === "figma" ? <Check size={14} /> : <Copy size={14} />}
            Brief · designer
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
        {/* What has been checked and not yet written — one commit when validated. */}
        <PendingBar />

        {/* ONE line before anything: what is missing, and how much of it. The four big
            numbers that used to sit here WERE the navigation — a reader saw figures and
            could not tell they hid the page's content. */}
        <Text size="sm" c="secondary">
          {offColours > 0 ? (
            <>
              <strong className="text-orange-200">{offColours} colours</strong> drawn in Figma
              land on nothing React ships
              {(() => {
                const blocking = data.colors.off_palette_groups.filter(
                  (g) => g.kind === "semantic" && g.used_by.length > 0,
                ).length
                return blocking > 0 ? (
                  <>
                    {" "}
                    — <strong className="text-orange-200">{blocking}</strong> of them are
                    painted by components today, and those block a screen
                  </>
                ) : null
              })()}
              . Everything else lines up:{" "}
              {data.families.filter((f) => f.counts.aligned === f.counts.total).length} of{" "}
              {data.families.length} scales match name by name, and {c.ignored} decision
              {c.ignored === 1 ? " has" : "s have"} been set aside.
            </>
          ) : (
            "Every colour a token resolves to exists in the kit's palette."
          )}
        </Text>
        {/* What is NOT compared, before any list. At the bottom as a low finding, the
            Tailwind line read as one more hole instead of "this family is out of scope". */}
        {data.scope.map((note) => (
          <Text key={note} size="xs" c="muted">
            <strong>Scope.</strong> {note}
          </Text>
        ))}

        {/* 1. THE TABLE. The review starts here and needs nothing above it: what Figma
            draws, what the kit has, who settles a gap, what they do. It used to sit under
            two boxes and a folded list that said the same thing three ways. */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <Title order={2} size="md" className={TYPO.title()}>
              Every colour: Figma against React
            </Title>
            <span className="text-[11px] text-gray-dark-500">
              {data.colors.counts.in_palette} of {data.colors.counts.tokens} tokens land on a
              colour React ships ({data.colors.palette_size} in its palette)
            </span>
          </div>
          <Colours colors={data.colors} findings={data.findings} />
        </div>

        {/* 2. WHO gets what, right under the table. */}
        <HandOff
          counts={c.by_owner}
          copy={(o, prompt) => void copy({ owner: o, prompt }, prompt ? `${o}:prompt` : o)}
          copied={copied}
        />

        {/* What has landed: the findings the report stopped producing, struck through.
            Without it a fix vanishes silently and a reviewer never sees their own work. */}
        <Closed history={data.history} />

        {/* 3. What is left once the colours are out: three lines, no fold, no filter. A
            filter over three rows is a menu that hides two of them. */}
        {(() => {
          const rest = active.filter((f) => f.kind !== "color-off-palette")
          if (rest.length === 0) return null
          return (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <Title order={2} size="md" className={TYPO.title()}>
                  Not a colour
                </Title>
                <span className="text-[11px] text-gray-dark-500">
                  {rest.length} finding{rest.length > 1 ? "s" : ""} on the rest of the
                  foundations — radii, the grid, the export itself
                </span>
              </div>
              <Card>
                <Card.Content>
                  <ul className="flex flex-col">
                    {rest.map((f) => (
                      <FindingRow key={f.id} f={f} />
                    ))}
                  </ul>
                </Card.Content>
              </Card>
            </div>
          )
        })()}

        <Section
          title="The scales"
          count={`${data.families.filter((f) => f.counts.aligned === f.counts.total).length} of ${data.families.length} match`}
          hint="radius, type, line heights, widths, containers, weights"
          open={open.scales}
          onToggle={() => toggle("scales")}
        >
          <div className="flex flex-col gap-3">
            <Text size="xs" c="muted">
              Compared name by name once rem becomes px. A family that lines up is one line;
              open it to see the steps.
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
        </Section>

        <Section
          title="Ignored by the reviewer"
          count={`${ignoredList.length}`}
          hint="left out of the brief and of every count"
          open={open.ignored}
          onToggle={() => toggle("ignored")}
        >
          <div className="flex flex-col gap-3">
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
        </Section>
      </div>
    </ReviewContext.Provider>
  )
}
