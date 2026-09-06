/**
 * `npm run dev <slug>` — ouvrir UN parcours en local, à chaud.
 *
 * C'est le geste qu'un dev fait après avoir cloné le repo depuis la console (« Récupérer le
 * code »). Le squelette (`src/`) importe `./proto/views` : sans un `src/proto/` en place,
 * Vite ne démarre sur rien. `build-all.mjs` l'installe avant chaque build en RECOPIANT
 * `protos/<slug>/` ; en développement, cette copie serait un piège — on éditerait la copie,
 * `src/proto/` est ignoré par git, et le travail disparaîtrait au build suivant.
 *
 * D'où un LIEN SYMBOLIQUE : ce qu'on modifie à l'écran est bien `protos/<slug>/`, donc ce
 * que le MCP a publié et ce qu'un commit emportera. La copie ne reste qu'en repli, là où le
 * lien est refusé (Windows sans droits) — et le script le dit alors à voix haute.
 */
import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const RACINE = path.resolve(import.meta.dirname, "..")
const PROTOS = path.join(RACINE, "protos")
const SRC_PROTO = path.join(RACINE, "src", "proto")
const PORT = "4244"

const slugs = fs.existsSync(PROTOS)
  ? fs
      .readdirSync(PROTOS, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  : []

const slug = process.argv[2]

// Un `vite` lancé sur un parcours inexistant démarre quand même, puis échoue à l'import avec
// une erreur de bundler. Autant refuser ici, avec la liste sous les yeux.
if (!slug || !slugs.includes(slug)) {
  console.error(slug ? `\nParcours inconnu : ${slug}` : "\nIl manque le parcours à ouvrir.")
  console.error("\n  npm run dev <slug>\n")
  console.error(
    slugs.length
      ? `Parcours disponibles :\n${slugs.map((s) => `  ${s}`).join("\n")}\n`
      : "Aucun parcours dans protos/.\n",
  )
  process.exit(1)
}

let titre = slug
try {
  titre = JSON.parse(fs.readFileSync(path.join(PROTOS, slug, "proto.json"), "utf8")).titre ?? slug
} catch {
  /* sans métadonnées, le slug fait titre */
}

// `rm` ne suit pas les liens : ceci retire le lien précédent, jamais le parcours qu'il visait.
fs.rmSync(SRC_PROTO, { recursive: true, force: true })
try {
  // "junction" ne concerne que Windows (et exige une cible absolue, ce qu'elle est) ; ailleurs
  // le type est ignoré.
  fs.symlinkSync(path.join(PROTOS, slug), SRC_PROTO, "junction")
} catch (e) {
  fs.cpSync(path.join(PROTOS, slug), SRC_PROTO, { recursive: true })
  console.warn(
    `⚠️  Lien symbolique refusé (${e.code}) — repli sur une copie.\n` +
      `   Ce que tu modifieras dans src/proto/ ne remontera PAS dans protos/${slug}/.`,
  )
}

console.log(`\n▸ ${titre} (${slug}) — http://localhost:${PORT}\n`)
// VITE_PROTO_TITRE : affiché par le chrome partagé (sidebar) sous le logo, comme au build.
spawn("npx", ["vite", "--port", PORT, ...process.argv.slice(3)], {
  cwd: RACINE,
  stdio: "inherit",
  env: { ...process.env, VITE_PROTO_TITRE: titre },
}).on("exit", (code) => process.exit(code ?? 0))
