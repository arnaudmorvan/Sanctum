/** The construction site card: a flow being built, right now, by three little agents.
 *
 *  Why it exists. Between "build me a flow" and the flow appearing on the site, several
 *  minutes pass in which this tab showed NOTHING — `protos.json` is written by the build.
 *  The person who asked had no way of telling a working agent from a dead conversation.
 *  This card is that missing minute, and the pixel scene is what makes the wait readable
 *  at a glance: whoever is at work is the one moving.
 *
 *  The server decides WHAT is said (`activity`, `role`) — `workshop.py` deduces it from
 *  the tool calls. This file decides only how it is drawn: a phase added over there needs
 *  no deployment over here.
 *
 *  ⚠️ The animation is confined to this card, and to the time it exists. A console that
 *  animates permanently is a console you stop reading.
 */
import { Badge } from "@42/ui-react/badge"
import { Card } from "@42/ui-react/card"
import { Text } from "@42/ui-react/text"
import type { ReactElement } from "react"
import type { Building } from "../mcp"

// ---------------------------------------------------------------- the sprites
//
// One character per role, two frames each, on an 18×16 grid. One letter = one pixel; the
// palette below turns it into a DS token. Written as text because that is what makes them
// editable: moving an arm is moving a letter, and the diff of a redrawn sprite stays
// readable.
//
//   o outline · h hair · s skin · c cloth · d cloth in shadow
//   m machine (desk, easel) · G screen · g screen glyph · w paper · C drawn shape · P sticky note

const DEV: [string[], string[]] = [
  [
    "..................",
    ".....ooooo........",
    "....ohhhhho.......",
    "....ohhhhho.oooooo",
    "....ohsssho.oGgGGo",
    "....ohosoho.oGGGGo",
    "....ohsssho.oGgGGo",
    ".....ooooo..oGGGGo",
    "....occccco.oooooo",
    "...occccccccsmmm..",
    "....odddddo.mmmmmm",
    "....odddddo.oooooo",
    "....oo...oo.......",
    ".............m..m.",
    ".............m..m.",
    "..................",
  ],
  [
    "..................",
    ".....ooooo........",
    "....ohhhhho.......",
    "....ohhhhho.oooooo",
    "....ohsssho.oGGGgo",
    "....ohoooho.oGGGGo",
    "....ohsssho.oGGgGo",
    ".....ooooo..oGGGGo",
    "....occccco.oooooo",
    "....occccco..mmm..",
    "...occccccccsmmmmm",
    "....odddddo.oooooo",
    "....oo...oo.......",
    ".............m..m.",
    ".............m..m.",
    "..................",
  ],
]

const DESIGNER: [string[], string[]] = [
  [
    "..................",
    ".ooooooooo........",
    ".owwwwwwwo..ooooo.",
    ".owCCCwwwo.ohhhhho",
    ".owCCCwwwo.ohhhhho",
    ".owwwwwwwo.ohsssho",
    ".owwwwCCwo.ohosoho",
    ".owwwwCCwo.ohsssho",
    ".ooooooooo..ooooo.",
    "...........occccco",
    "....msccccccccccco",
    "....m......odddddo",
    "...m.m.....odddddo",
    "..m...m....oo...oo",
    "..................",
    "..................",
  ],
  [
    "..................",
    ".ooooooooo........",
    ".owwwwwwwo..ooooo.",
    ".owCCCwwwo.ohhhhho",
    ".owCCCwwwo.ohhhhho",
    ".owwwCCwwo.ohsssho",
    ".owwwwCCwo.ohoooho",
    ".owwwwCCwo.ohsssho",
    ".ooooooooo..ooooo.",
    ".....sccccccccccco",
    "....m......occccco",
    "....m......odddddo",
    "...m.m.....odddddo",
    "..m...m....oo...oo",
    "..................",
    "..................",
  ],
]

const PO: [string[], string[]] = [
  [
    "..................",
    ".oPPo.oPPo........",
    ".oPPo.oPPo........",
    "............ooooo.",
    ".oPPo......ohhhhho",
    ".oPPo......ohhhhho",
    "...........ohsssho",
    "...........ohosoho",
    "...........ohsssho",
    "............ooooo.",
    ".........occccccco",
    ".........occwwwwco",
    ".........ocwwwwwwo",
    ".........occwwwwco",
    ".........oddddddo.",
    "...........oo...oo",
  ],
  [
    "..................",
    ".oPPo.oPPo........",
    ".oPPo.oPPo........",
    "............ooooo.",
    ".oPPo.oPPo.ohhhhho",
    ".oPPo.oPPo.ohhhhho",
    "...........ohsssho",
    "...........ohoooho",
    "...........ohsssho",
    "............ooooo.",
    ".........occccccco",
    ".........occwwwwco",
    ".........ocwwwwwwo",
    ".........occwwwwco",
    ".........oddddddo.",
    "...........oo...oo",
  ],
]

const SPRITES: Record<string, [string[], string[]]> = { po: PO, designer: DESIGNER, dev: DEV }

/** The order they stand in, left to right: the one who asks, the one who draws, the one who
 *  builds. It is the order of the work, and it never changes — you find your character in
 *  the same place from one card to the next. */
const TEAM: Array<{
  role: "po" | "designer" | "dev"
  name: string
  cloth: string
  solid: string
  shade: string
}> = [
  { role: "po", name: "PO", cloth: "purple", solid: "#9b8afb", shade: "#6938ef" },
  { role: "designer", name: "Designer", cloth: "pink", solid: "#f670c7", shade: "#dd2590" },
  { role: "dev", name: "Dev", cloth: "cyan", solid: "#22ccee", shade: "#088ab2" },
]

/** Pixel → token. The scene follows the theme like everything else; the skin tone is the
 *  only concession — the DS has no such token, `orange-200` is the closest.
 *
 *  Each token carries its value as a fallback (the convention of `styles.css`), and here it
 *  earns its keep: an unresolved `fill="var(…)"` does not warn, it paints BLACK — three
 *  black silhouettes on a dark card, and nothing anywhere to say why. */
const palette = (cloth: string, solid: string, shade: string): Record<string, string> => ({
  o: "var(--color-gray-dark-950, #0c0e12)",
  h: "var(--color-gray-dark-600, #61656c)",
  s: "var(--color-orange-200, #f9dbaf)",
  c: `var(--color-${cloth}-400, ${solid})`,
  d: `var(--color-${cloth}-600, ${shade})`,
  m: "var(--color-gray-dark-600, #61656c)",
  G: "var(--color-gray-dark-800, #22262f)",
  g: "var(--color-brand-400, #92b0fa)",
  w: "var(--color-gray-dark-200, #ececed)",
  C: "var(--color-brand-500, #6388e3)",
  P: "var(--color-yellow-400, #fac515)",
})

const CELL = 18
const ROWS = 16
const GAP = 3

/** One frame, as rects. Runs of identical pixels are merged into a single rect: 288 cells
 *  per frame, six frames per card — drawn one by one, the card alone would carry a
 *  thousand nodes. */
const Frame = ({ rows, colors, x }: { rows: string[]; colors: Record<string, string>; x: number }) => {
  const rects: ReactElement[] = []
  rows.forEach((row, y) => {
    let run = 0
    for (let i = 0; i <= row.length; i++) {
      const ch = row[i]
      const prev = row[run]
      if (ch === prev && i < row.length) continue
      if (prev && prev !== ".") {
        rects.push(
          <rect
            key={`${y}-${run}`}
            x={x + run}
            y={y}
            width={i - run}
            height={1}
            fill={colors[prev] ?? "transparent"}
          />,
        )
      }
      run = i
    }
  })
  return <>{rects}</>
}

/** The three of them, on their floor. The one whose `role` the server names is the one that
 *  animates and stands in full light; the other two idle in the background, frozen on their
 *  first frame — three characters all moving at once is a fairground, not a workshop. */
export const WorkshopScene = ({ role }: { role: string }) => {
  const width = TEAM.length * CELL + (TEAM.length - 1) * GAP
  return (
    <svg
      viewBox={`0 0 ${width} ${ROWS + 2}`}
      className="w-full"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Three agents at work: a PO, a designer, a dev."
    >
      {/* The floor: one line, so the characters are standing on something. */}
      <rect x={0} y={ROWS} width={width} height={1} fill="var(--color-gray-dark-800, #22262f)" />
      {TEAM.map((member, i) => {
        const x = i * (CELL + GAP)
        const colors = palette(member.cloth, member.solid, member.shade)
        const active = member.role === role
        const [a, b] = SPRITES[member.role]
        return (
          <g key={member.role} opacity={active ? 1 : 0.35}>
            {/* The working light, under the one at work only. */}
            {active ? (
              <rect
                x={x + 2}
                y={ROWS}
                width={CELL - 4}
                height={1}
                fill={`var(--color-${member.cloth}-400, ${member.solid})`}
                className="ds-worklight"
              />
            ) : null}
            <g className={active ? "ds-frame-a" : undefined}>
              <Frame rows={a} colors={colors} x={x} />
            </g>
            {active ? (
              <g className="ds-frame-b">
                <Frame rows={b} colors={colors} x={x} />
              </g>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

const minutes = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)} min`)

/** The card. Same shape as a published flow's — it takes its place in the same grid — with
 *  what replaces the "Open the flow" button: what is happening, and for how long. */
export const WorkshopCard = ({ card }: { card: Building }) => (
  <Card variant="outline" padding="lg" className="ds-worksite">
    <Card.Header className="flex-row items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <Card.Title className="truncate">{card.title || card.slug || "New flow"}</Card.Title>
        <div className="flex flex-wrap gap-1">
          <Badge color={card.shipped ? "green" : "brand"} variant="light" size="sm">
            {card.shipped ? "published · deploying" : "in the works"}
          </Badge>
          {card.slug ? (
            <Badge color="gray" variant="outline" size="sm">
              <span className="font-mono">{card.slug}</span>
            </Badge>
          ) : null}
        </div>
      </div>
    </Card.Header>

    <Card.Content className="flex flex-col gap-3">
      <div className="rounded-md border border-white/10 bg-black/25 px-3 pt-3 pb-2">
        <WorkshopScene role={card.shipped ? "dev" : card.role} />
      </div>
      <Text size="sm" c="secondary">
        {card.activity}
        <span className="ds-ellipsis" aria-hidden="true" />
      </Text>
      <Text c="muted" size="sm">
        {card.author || card.client || "an agent"}
        {" · "}
        <span className="font-mono">{minutes(card.seconds)}</span>
        {card.shipped ? " · the site is rebuilding" : null}
      </Text>
    </Card.Content>
  </Card>
)
