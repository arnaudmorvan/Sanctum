/**
 * Construit UN site, N parcours.
 *
 * Un build par parcours, et pas un seul build global : le code des protos est écrit par des
 * agents pilotés par des PO. Un parcours qui ne compile pas ne doit pas emporter ceux des
 * autres — il est marqué « build en échec » dans la galerie, les autres restent en ligne.
 * C'est pour ça que l'échec est attrapé ici au lieu de faire sortir le process.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const RACINE = path.resolve(import.meta.dirname, "..")
const PROTOS = path.join(RACINE, "protos")
const SRC_PROTO = path.join(RACINE, "src", "proto")
const DIST = path.join(RACINE, "dist")

const echappe = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])

const lireProtos = () => {
  if (!fs.existsSync(PROTOS)) return []
  return fs
    .readdirSync(PROTOS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const meta = path.join(PROTOS, e.name, "proto.json")
      let m = { slug: e.name, titre: e.name }
      try {
        m = { ...m, ...JSON.parse(fs.readFileSync(meta, "utf8")) }
      } catch {
        /* un parcours sans métadonnées reste constructible : le slug suffit */
      }
      return m
    })
}

const construire = (proto) => {
  fs.rmSync(SRC_PROTO, { recursive: true, force: true })
  fs.cpSync(path.join(PROTOS, proto.slug), SRC_PROTO, { recursive: true })
  // proto.json n'est pas du code : le laisser dans src/ le ferait passer au bundler.
  fs.rmSync(path.join(SRC_PROTO, "proto.json"), { force: true })
  execFileSync("npx", ["vite", "build"], {
    cwd: RACINE,
    stdio: "inherit",
    env: { ...process.env, PROTO_SLUG: proto.slug },
  })
}

const protos = lireProtos()
const resultats = []

for (const proto of protos) {
  process.stdout.write(`\n▸ build ${proto.slug}\n`)
  try {
    construire(proto)
    resultats.push({ ...proto, ok: true })
  } catch (e) {
    console.error(`✗ ${proto.slug} : build en échec — ${e.message}`)
    resultats.push({ ...proto, ok: false })
  }
}

fs.rmSync(SRC_PROTO, { recursive: true, force: true })
fs.mkdirSync(DIST, { recursive: true })

const carte = (p) => `
  <a class="carte${p.ok ? "" : " ko"}" ${p.ok ? `href="/p/${echappe(p.slug)}/"` : ""}>
    <h2>${echappe(p.titre)}</h2>
    ${p.resume ? `<p class="resume">${echappe(p.resume)}</p>` : ""}
    <p class="meta">
      ${echappe(p.auteur ?? "—")}
      ${p.maj_le ? ` · mis à jour le ${echappe(p.maj_le)}` : ""}
      ${p.ok ? "" : ' · <span class="badge">build en échec</span>'}
    </p>
  </a>`

fs.writeFileSync(
  path.join(DIST, "index.html"),
  `<!doctype html>
<html lang="fr" data-theme="dark">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prototypes — 42</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&family=Kode+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;background:#0b0d0e;color:#e8e9ec;font-family:Lato,system-ui,sans-serif}
  .wrap{max-width:1100px;margin:0 auto;padding:56px 24px 80px}
  h1{font-size:30px;margin:0 0 6px}
  .sous{color:#8b8c96;margin:0 0 36px;font-size:14px}
  .grille{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
  .carte{display:block;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:12px;
         background:rgba(255,255,255,.04);text-decoration:none;color:inherit;transition:.15s}
  .carte:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.22)}
  .carte.ko{opacity:.55;cursor:not-allowed}
  .carte h2{font-size:16px;margin:0 0 6px}
  .resume{color:#c8c9d2;font-size:13px;margin:0 0 10px;line-height:1.5}
  .meta{color:#8b8c96;font-size:12px;margin:0;font-family:"Kode Mono",monospace}
  .badge{color:#ff6b6b}
  .vide{color:#8b8c96;border:1px dashed rgba(255,255,255,.16);border-radius:12px;padding:32px;text-align:center}
</style>
</head>
<body><div class="wrap">
<h1>Prototypes</h1>
<p class="sous">Parcours cliquables construits avec les composants du design system 42.</p>
${
  resultats.length
    ? `<div class="grille">${resultats.map(carte).join("")}</div>`
    : `<div class="vide">Aucun prototype pour l'instant. Demande à Claude d'en publier un.</div>`
}
</div></body></html>
`,
)

const ko = resultats.filter((r) => !r.ok)
console.log(`\n${resultats.length - ko.length}/${resultats.length} parcours construits.`)
if (ko.length) console.log(`En échec : ${ko.map((k) => k.slug).join(", ")}`)
