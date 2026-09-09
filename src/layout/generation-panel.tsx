import { useState } from "react"
import {
  compact,
  duration,
  type FileCost,
  fileForScreen,
  type Run,
  files as readFiles,
  runs as readRuns,
  totals as readTotals,
} from "./generation"

/** The "Generation" tab: what this flow cost to produce, and what each screen cost.
 *
 *  Why it exists. The whole point of serving a design system to an agent is the claim that
 *  a screen comes out faster this way than another way. Until 2026-09-09 that claim had no
 *  recorded evidence: the time of a generation lived in a conversation, and the
 *  conversation is gone. Now every publication writes what it cost next to the screens it
 *  produced, and this panel is where a PO reads it back — beside the flow it describes,
 *  which is the only place the comparison can be checked against the thing produced.
 *
 *  ⚠️ The three kinds of number are LABELLED, never mixed (see `generation.ts`):
 *  measured (the run), attributed (the per-screen share of it), estimated (the tokens).
 *  A prorated number printed as a measurement is a lie that survives into a comparison
 *  table, which is exactly where it does the damage.
 *
 *  Free to draw: the records travel in the flow's own bundle, so this tab makes no
 *  request and needs no key — unlike History, which reads the flows repo through the
 *  server. A flow with no record says so in one line rather than showing zeros. */

const Row = ({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) => (
  <div className="flex flex-col gap-0.5 rounded-md border border-gray-dark-800 bg-white/2 px-2.5 py-2">
    <span className="font-mono font-semibold text-sm text-white tabular-nums">{value}</span>
    <span className="text-[11px] text-gray-dark-400">{label}</span>
    {hint ? <span className="text-[10px] text-gray-dark-600">{hint}</span> : null}
  </div>
)

const when = (iso: string): string => {
  if (!iso) return "—"
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
}

const FileRow = ({ file, current }: { file: FileCost; current: boolean }) => (
  <li
    className={`flex flex-col gap-0.5 rounded-md px-2 py-1.5 ${
      current ? "bg-white/5 ring-1 ring-white/10" : ""
    }`}
  >
    <div className="flex items-baseline justify-between gap-3">
      <span className="truncate font-mono text-gray-dark-200 text-xs">
        {file.path.replace(/^pages\//, "")}
      </span>
      <span className="shrink-0 font-mono text-white text-xs tabular-nums">
        {duration(file.seconds)}
      </span>
    </div>
    <span className="text-[10px] text-gray-dark-500">
      {Math.round(file.bytes / 100) / 10} Ko · {file.lines} lines · {file.runs} pass
      {file.runs > 1 ? "es" : ""}
      {current ? " · on screen" : ""}
    </span>
  </li>
)

const RunRow = ({ run }: { run: Run }) => (
  <li className="flex flex-col gap-0.5 border-gray-dark-800 border-b px-2 py-2 last:border-b-0">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-gray-dark-200 text-xs">
        <span className="font-mono">#{run.n}</span> · {when(run.at)}
      </span>
      <span className="font-mono text-white text-xs tabular-nums">
        {run.measured ? duration(run.modelS) : "not measured"}
      </span>
    </div>
    <span className="text-[10px] text-gray-dark-500">
      {run.files} file{run.files > 1 ? "s" : ""} · {run.calls} call
      {run.calls > 1 ? "s" : ""} · ~{compact(run.tokensIn)} in / ~{compact(run.tokensOut)} out
      {run.awayS > 60 ? ` · ${duration(run.awayS)} idle` : ""}
    </span>
    <span className="truncate text-[10px] text-gray-dark-600">
      {[run.model || "model not declared", run.author].filter(Boolean).join(" · ")}
    </span>
  </li>
)

export const GenerationBody = ({ screen }: { screen?: string }) => {
  const [showRuns, setShowRuns] = useState(false)
  const t = readTotals()
  const rows = readFiles()
  const screens = rows.filter((f) => f.isScreen)
  const rest = rows.filter((f) => !f.isScreen)
  const current = fileForScreen(screen)

  if (!t.runs) {
    return (
      <div className="flex flex-col gap-2 px-3 py-3">
        <span className="font-semibold text-sm text-white">Nothing recorded yet</span>
        <p className="text-gray-dark-400 text-xs leading-relaxed">
          The cost of a generation is written by the server at publication. This flow was
          published before that existed — republishing it records the next run, and the ones
          after it.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-3 py-3" aria-label="What this flow cost to generate">
      <div className="grid grid-cols-2 gap-2">
        <Row
          label="per screen"
          value={duration(t.perScreenS)}
          hint={`${t.screens} screen${t.screens > 1 ? "s" : ""}, attributed`}
        />
        <Row label="in the model" value={duration(t.modelS)} hint={`${t.runs} generation${t.runs > 1 ? "s" : ""}`} />
        <Row label="round trips" value={String(t.calls)} hint={`${duration(t.serverS)} of server`} />
        <Row
          label="tokens (estimate)"
          value={`~${compact(t.tokensIn + t.tokensOut)}`}
          hint={`${compact(t.tokensIn)} in · ${compact(t.tokensOut)} out`}
        />
      </div>

      {t.models.length ? (
        <span className="font-mono text-[11px] text-gray-dark-400">{t.models.join(" · ")}</span>
      ) : (
        <span className="text-[11px] text-gray-dark-500 italic">
          No model declared — the server cannot see which one wrote this.
        </span>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-semibold text-sm text-white">Per screen</span>
          <span className="text-[11px] text-gray-dark-500">attributed, not measured</span>
        </div>
        {screens.length ? (
          <ul className="flex flex-col gap-0.5">
            {screens.map((f) => (
              <FileRow key={f.path} file={f} current={f.path === current} />
            ))}
          </ul>
        ) : (
          <span className="text-gray-dark-500 text-xs italic">
            This flow declares no screen under pages/.
          </span>
        )}
      </div>

      {rest.length ? (
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-dark-300 text-xs">
            The rest of the flow
          </span>
          <ul className="flex flex-col gap-0.5">
            {rest.map((f) => (
              <FileRow key={f.path} file={f} current={false} />
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setShowRuns((v) => !v)}
          className="self-start rounded-md px-1 text-gray-dark-300 text-xs hover:text-white"
        >
          {showRuns ? "Hide" : "Show"} the{" "}
          {t.runs > 1 ? `${t.runs} generations` : "generation"}
        </button>
        {showRuns ? (
          <ul className="flex flex-col rounded-md border border-gray-dark-800 bg-white/2">
            {readRuns().map((r) => (
              <RunRow key={r.n} run={r} />
            ))}
          </ul>
        ) : null}
      </div>

      <p className="text-gray-dark-500 text-xs leading-relaxed">
        <span className="font-semibold">Measured</span>: the time between the first call of a
        generation and its publication, and how much of it was spent inside the model (the
        silences between two calls of the server).{" "}
        <span className="font-semibold">Attributed</span>: one publication carries several
        screens, so a run's time is shared out between them in proportion to what was
        written — a screen published on its own is the only exact one.{" "}
        <span className="font-semibold">Estimated</span>: no model knows its own billed
        tokens, so these are the characters that went through the design-system server,
        divided by four — the context it served and the code it received, not the host's own
        scaffolding.
        {t.allMeasured ? "" : " One run was published by a server that had lost its window: the totals are a floor."}
        {t.awayS > 300 ? ` ${duration(t.awayS)} of idle time is excluded from the model's time.` : ""}
      </p>
    </div>
  )
}
