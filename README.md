# Sanctum — the 42 console

One site, two things: **the admin console** at the root, and **N clickable flows** under
`/p/<slug>/`. Everything is built with the real `@42/ui-react` components — including the
console, which is therefore the first genuine test of the kit on a non-trivial application.

The repo is called `Sanctum`; the MCP server that writes into it, `mcp-Omniscient`.

A flow is published **from a Claude conversation** (42 Design connector), not through git:
the PO describes their flow, the MCP server commits here, Railway builds and deploys.

- **Console**: `/` — Prototypes, Context, Parity, Tokens, Observability, Sessions,
  Connectors, Quality, Access, Configuration. A single navigation, the sidebar (the kit's
  AppShell + NavLink); the URL carries the section (`#/context/skills`). Everything — the
  gallery and the flows included, since 2026-09-11 — asks for the person's **access
  token**, the same `42ds_…` token as their MCP connector, and shows what the ROLE opens: a `po` sees
  Prototypes and Context, a `designer` adds Parity and Tokens, an `admin` everything. The
  list comes from the server (`me.sections` on `/console/summary.json`), which refuses the
  other routes with a 403; the console draws it and decides nothing. The MCP service's
  `DASHBOARD_KEY` still works as the operator's key.
- **A flow**: `/p/<slug>/` — behind the same token. The flows are static files, so the
  gate is on the Sanctum server (`scripts/gate.mjs`): `/protos.json`, `/p/` and `/v/` are
  served only to a browser whose `ds_token` cookie the MCP server recognises (the sign-in
  writes it next to the stored token). A cold flow URL lands on the sign-in and comes back
  after (`?next=`). The console owns no secret and no registry: it asks `/console/summary.json`
  and caches the answer per token for a minute. Unreachable MCP ⇒ 503, never a pass.
  `npm test` drives the gate with no network.

## For a PO: adding or evolving a flow

Nothing to install, nothing to clone. In a conversation with the **42 Design** connector:

- "Build me a flow for requesting an hours transformation: the list, the detail, the
  confirmation." → the agent generates it and calls `publish_proto`.
- "Take the `example-requests` flow and add a screen for a motivated rejection."
  → the agent calls `list_protos("example-requests")`, edits, republishes.

Republishing with the **same slug** updates the flow. A new slug creates one more flow.

**Deleting a flow** is done from the console (the card's `⋯` menu → Delete…, read key
required, slug to retype). It is a commit in this repo, executed by the MCP server
(`DELETE /console/protos/<slug>`): the flow stays in the git history, and it disappears from
the site **at the next deploy** — the card stays visible as "deletion in progress" until
then.

**Reviewing a flow** happens inside it, in the **rail** in the bottom-right corner
(`src/layout/side-panel.tsx`, since 2026-09-08). It is the whole tool box: four tabs that
open one floating/dockable panel (Feedback, Comments, Components, History), three tools
one looks at the flow with and that open no panel (**Map**, **Source**, **Compare**), and
the **pins** switch. Nothing of this is in the bottom bar any more — the bar is the flow's
navigation, the rail is what one does WITH the flow:

- **Feedback** — say what should change, **to the system**: optionally pointing at an
  element or circling an area. Goes to the MCP's feedback queue (this flow) or out as a
  report (a system rule). The tab also lists what was filed, with where each item stands:
  `open` until the agent handles it, `handled` after — the agent flips it, the page only
  reads it back (`GET /feedback/list.json`).
- **Comments** — say it **to the developers**. Same pointing, but a comment is never read
  by the agent: it lives in the MCP repo under `comments/<slug>.json`, outside everything
  the tools can read (`comments_api.py`). Edit, resolve, delete; author and time on each;
  and every comment records the **version** of the flow it was made on (`published_at`,
  see History) — the list is grouped by version, so a comment survives republications and
  a dev still knows what it was about. Deleting removes it from the file; the repo's
  history keeps it.
- **Pins** — the comments and feedback of the screen on display, drawn where they were
  left (`src/layout/pins.tsx`): blue for comments, purple for feedback, numbered like the
  lists, dimmed once resolved or handled. A pin is placed by resolving the note's selector
  in the current DOM, never by replaying old coordinates — a note whose element no longer
  exists gets no pin. One switch shows or hides them, on the rail and in the panel header.
- **Components** — what the screen owes to `@42/ui-react` and what is written by hand,
  read from the compile-time origin marks, with a highlight mode.
- **History** — every version of the flow, with the **date and time** it was generated and
  by whom, and a **Restore** on each older one. Without a key the tab still shows when the
  current version was generated (`published_at`, stamped by the MCP into `proto.json`);
  the list and the restore need the console's read key — the same one, shared in the
  browser. A restore is one commit executed by the MCP server
  (`POST /console/protos/restore.json`) that makes `protos/<slug>/` identical to the
  chosen version, a screen added since included; the version it replaces stays in the
  list, and the site picks the restored one up **at the next deploy** (the entry reads
  "deploying" until then). Since 2026-09-08 (later the same day) every version also has
  an **Open** — a new tab on that version, nothing restored — and a **Compare** — that
  version next to the live flow. Both need the hot build (below): the history says
  whether it is wired, and the tab explains instead of drawing buttons that would fail.
- **Map** — the flow zoomed out on one canvas (`src/layout/flow-map.tsx`), read two ways:
  **Grid** (the screens grouped by navigation section — what the app contains) and **Flow**
  (laid out by distance from the entry point, with the links between them drawn, read off
  the rendered DOM — what the app leads to). The miniatures are the real screens, live;
  clicking one enters it.
- **Source** — the Figma frame this screen was translated from, rendered next to it
  (`figma-source.json`, published by `proto-from-figma`). The tile only exists on a screen
  that HAS a frame — which is itself an answer to "was this one designed, or composed?".
  The link is free; the render needs a `FIGMA_TOKEN` on the MCP, and says so when there is
  none.
- **Compare** — this screen as it is now, next to **the same screen in the previous
  version** (`/compare/`): the question one opens that page with, ready without a click.
  Either side can then become another screen, another version or another flow. From a
  past version, the right side is that version and the left the live flow. See "Two
  versions, two screens" below.

## Two versions, two screens — `/v/<slug>/<sha7>/` and `/compare/` (since 2026-09-08)

The site serves the latest build of a flow and nothing else; the older versions exist
as git blobs, and until now the only way to LOOK at one was to restore it — a commit on
the branch, and a second one to come back.

**A past version is built on demand**, next to the live flow and never in its place.
The History tab asks the MCP (`POST /console/protos/preview.json {slug, sha}`, console
key); the MCP reads the flow's files at that commit (blobs — nothing is committed) and
posts them to `POST /preview/<slug>/<sha7>` on this site (`scripts/hot-build.mjs`,
same key as the hot build, same `buildFlow`); the bundle lands in `dist/v/<slug>/<sha7>/`
and is served at once. The build carries the version stamp (`VITE_PROTO_VERSION*`): the
skeleton shows a **banner** (which version, generated when and by whom, the way to the
live flow), and keeps **feedback and comments on the live flow** — a pin left on a screen
that no longer exists would point at nothing. `protos/<slug>/` on disk is not touched
and `protos.json` is not rewritten. The previews are a **cache**: the sixteen most
recently opened are kept, the rest pruned, and a redeploy wipes them all — which is why
the page always asks again instead of remembering a URL (a version already built answers
in 0 ms, `cached: true`).

**`/compare/?a=<slug>[@<sha7>|@prev][#/screen]&b=…`** puts two of these side by side — two
versions of one screen, two screens of one flow, or two flows. Each side is a locator
in the URL, so a comparison is a link. `@prev` — "the version before the live one" — is
the one that cannot be written as a sha: a flow's Compare tile hands out the same link
whatever gets published next, and the page resolves it against the flow's history the
moment that history arrives (it needs the read key, and says so otherwise), then rewrites
the URL with the sha it found — so what one copies from the address bar is a fixed
comparison. A flow with a single version has nothing before it: the side falls back to
the live flow. The frames are the flows themselves, rendered
`?bare` (no bottom bar, no side panel — the tooling of a tab, drawn twice it would
drive nothing), and they talk to the page (`src/layout/embed.ts`: `sanctum:state` in,
`sanctum:navigate` out): that is what fills the screen picker of each side and drives
**Sync** — navigate on one side, the other follows. Picking a different screen on one
side turns the sync off: that is the "two screens" question. The frames are rendered
at a fixed width (1280 or 1440) and scaled to their column, so what is compared is the
layout, not its response to half a window; "Fit" gives the native width. Both sides are
behind the person's token like every flow; a past version that is not built yet asks the
MCP server for its build, once.

## For a dev: getting a flow's code

The card's `⋯` menu → **Get the code**: the modal gives the repo's `git clone`, the
`protos/<slug>/` directory, and the GitHub link. The build writes the origin into
`dist/version.json` (`repo`, from the Railway variables or the git remote) — no URL is
hard-coded in the console. Then, locally:

```bash
npm install
npm run dev <slug>       # http://localhost:4244
```

`npm run dev` **requires** a slug (`scripts/dev-proto.mjs` lists the available flows if you
forget it): the skeleton imports `./proto/views`, so `src/proto/` must point somewhere
before Vite starts. The script places a **symlink** there to `protos/<slug>/`, where
`build-all.mjs` makes a copy — in dev, a copy would mean editing a git-ignored directory,
and the work would be lost at the next build. What you change on screen really is the flow.

## Structure

```
console/             ← the React console (@42/ui-react): gallery, metrics, roles
protos/<slug>/
├── views.tsx        ← THE FLOW: one entry per screen. Mandatory.
├── pages/*.tsx      ← the screens
├── data/*.ts        ← the demo data
└── proto.json       ← title, author, dates (written by the MCP)

src/                 ← the skeleton, shared by every flow (routing, chrome, toolbar)
vendor/ui-react/     ← a BUILT snapshot of @42/ui-react
scripts/build-flow.mjs ← ONE flow: copy → tsc → vite (shared by the CI and the hot build)
scripts/build-all.mjs ← every flow, then the gallery (the CI)
scripts/hot-build.mjs ← POST /build/<slug>: rebuild one flow in the running container;
                        POST /preview/<slug>/<sha7>: build a PAST version under /v/…
scripts/dev-proto.mjs ← `npm run dev <slug>`: one flow locally
server.mjs           ← static serving of dist/ (Railway) + the two build routes
console/compare/     ← /compare/: two flows side by side (second entry of the console build)
```

`views.tsx` is the contract: the bottom bar **and** the hash routing are both derived from
it. A screen that is not listed there is unreachable. When `views.tsx` also exports `NAV`,
the skeleton renders the product sidebar — and the bottom bar does **not** relist the
screens a `NAV` entry already targets: it keeps only the deep screens (module, project,
detail…), the ones you can reach only by walking through the product.

## Two load-bearing constraints — do not undo them

**1. `@42/ui-react` is published nowhere.** Not on npm, not installable from git: the package
at the root of `42staff/kit` is `@42/ui` (a private workspace root), and `@42/ui-react` lives
in `packages/react/` — npm cannot install a sub-directory of a git repo, and the package has
no `prepare` script. Hence `vendor/ui-react/`: a copy of the **built** package, wired in with
`file:`.

Refreshing it after the kit evolves:

```bash
cd <kit>/packages/react && pnpm build
rm -rf <here>/vendor/ui-react/dist
cp -R dist <here>/vendor/ui-react/dist
find <here>/vendor/ui-react -name '*.map' -delete   # useless, and it halves the weight
```

⚠️ **Two copies since 2026-09-11.** `vendor/ui-react/` (0.5.0) is what the FLOWS and the
skeleton build against; `vendor/ui-react-0.8/` (0.8.0, installed as `@42/ui-react-next`)
is what the CONSOLE renders — `vite.console.config.ts` aliases `@42/ui-react` to it and
`tsconfig.console.json` maps its types. The Parity tab measures a render of the console's
copy and reads the API from mcp-42's manifest: the two must be the same version, or a
measured difference is a difference between versions. Refreshing `vendor/ui-react` to
0.8.0 was tried the same day and reverted: `NavLink` lost `icon` / `suffix` for
`startSlot` / `endSlot`, `AvatarGroup` became `Avatar.Group`, `Pill` requires `onRemove`,
and the skeleton, the console and every flow broke. The console was migrated (three
files); the flows are a separate piece of work. When they move, delete the second copy.

**2. The kit's CSS does not exist compiled.** `@42/ui-react/styles.css` contains only
directives; the components' classes are generated by a **scan of its `dist`**. It is
`src/styles.css` that declares it:

```css
@source "../node_modules/@42/ui-react/dist/**/*.js";
```

Without this line: 0 classes generated, components entirely bare. With it: ~1600 rules.
Measured on 2026-09-03.

## Build

```bash
npm install
npm run build     # dist/ (the console) + dist/p/<slug>/ (one per flow)
npm start         # serves dist/ on $PORT
```

**Every build is preceded by a `tsc --noEmit`**, and that is not zeal: Vite/esbuild strip
the types without checking them. A flow that writes `Table.Root` (the root is `Table` itself)
bundles without a complaint, then blows up on open — the console would show a green, broken
flow. The typecheck is the only thing that catches this.

One build **per flow**, deliberately: the code comes from agents driven by POs, and a flow
that does not compile must not take the others down with it. It is marked "build failed" in
the gallery, the others stay online.

> ⚠️ npm ≥ 11 blocks install scripts by default; esbuild (via Vite) has one.
> If the build fails on esbuild, run `npm approve-scripts --allow-scripts-pending`
> locally, or set `NPM_CONFIG_ALLOW_SCRIPTS_PENDING=true` on the host.

## The hot build — a flow is live seconds after `publish_proto` (since 2026-09-08)

The commit `publish_proto` makes triggers a Railway redeploy: clone, `npm ci`, build,
image, swap — **minutes**, for a per-flow build that takes ~3 s (`tsc` 0.9 s + `vite`
1.6 s measured locally). During those minutes the PO looks at a "published · deploying"
card and nothing else.

`server.mjs` therefore carries ONE non-static route, `POST /build/<slug>`
(`scripts/hot-build.mjs`): the MCP server posts it the files it has just committed, the
running container rebuilds **that one flow** with the same `buildFlow` as the CI
(`scripts/build-flow.mjs`), swaps it into `dist/p/<slug>/` with two renames (a viewer
refreshing mid-build never gets a 404) and rewrites `dist/protos.json` — the console's
card flips within seconds. A flow that does not compile answers **422 with the tsc
diagnostics**, which the MCP hands back to the agent in the same answer as the commit
sha: the fix is a republish, not a new conversation.

- **Fail-closed**: the route exists only when `BUILD_KEY` is set (Railway → Variables on
  this service). The same value goes on the MCP service as `SANCTUM_BUILD_KEY`, with
  `SANCTUM_BUILD_URL=https://<this site>`.
- **Not a second truth**: the commit remains the flow. The hot build is a fast-forward of
  what the next redeploy produces from git anyway; if the hook is down or absent, the
  publication behaves exactly as before.
- **Same bounds as the MCP** (slug shape, 40 files, 200 KB/file, 1 MB, 3 levels,
  extension allowlist, no path escape), re-checked here: a route that trusts its
  caller's validation has none.
- **Serialized**: `src/proto/` is a single working directory, builds queue up.
- The redeploy that follows the commit still happens today — it is the safety net. Once
  the hook has proven itself, add `"watchPatterns": ["!protos/**"]`-style rules to
  `railway.json` so a publication no longer redeploys the whole site at all.

Try it locally: `BUILD_KEY=x PORT=4299 npm start`, then POST `{files, meta}` with the
header `X-Build-Key: x` to `http://localhost:4299/build/<slug>` — or `{files, meta,
version}` to `http://localhost:4299/preview/<slug>/<sha7>` for a past version, which then
serves at `/v/<slug>/<sha7>/` (the files of that version: `git show <sha>:protos/<slug>/…`).
