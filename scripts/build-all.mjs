/**
 * Construit UN site : la console à la racine, et N parcours sous /p/<slug>/.
 *
 * Un build par parcours, et pas un build global : le code des protos est écrit par des
 * agents pilotés par des PO. Un parcours qui ne compile pas ne doit pas emporter ceux des
 * autres — il est marqué « build en échec » dans la console, les autres restent en ligne.
 * D'où l'échec attrapé ici au lieu de faire sortir le process.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const RACINE = path.resolve(import.meta.dirname, "..")
const PROTOS = path.join(RACINE, "protos")
const SRC_PROTO = path.join(RACINE, "src", "proto")
const DIST = path.join(RACINE, "dist")

const npx = (args, env = {}) =>
  execFileSync("npx", args, { cwd: RACINE, stdio: "inherit", env: { ...process.env, ...env } })

const lireProtos = () => {
  if (!fs.existsSync(PROTOS)) return []
  return fs
    .readdirSync(PROTOS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      let m = { slug: e.name, titre: e.name }
      try {
        m = { ...m, ...JSON.parse(fs.readFileSync(path.join(PROTOS, e.name, "proto.json"), "utf8")) }
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
  // Typecheck AVANT le bundle, et c'est essentiel : Vite/esbuild retirent les types sans les
  // vérifier. Un parcours qui écrit `Table.Root` (qui n'existe pas — la racine est `Table`
  // lui-même) se bundle sans broncher puis plante à l'ouverture. Sans cette étape, la console
  // afficherait des parcours verts qui sont cassés.
  npx(["tsc", "--noEmit", "-p", "tsconfig.json"])
  // VITE_PROTO_TITRE : affiché par le chrome partagé (sidebar) sous le logo 42.
  // VITE_PROTO_SLUG : le widget « Retour » l'attache à chaque dépôt — c'est lui qui dit au
  // serveur MCP dans quelle file (`context/retours-parcours/<slug>.md`) le retour tombe.
  npx(["vite", "build"], {
    PROTO_SLUG: proto.slug,
    VITE_PROTO_SLUG: proto.slug,
    VITE_PROTO_TITRE: proto.titre ?? "",
  })
}

const resultats = []
for (const proto of lireProtos()) {
  process.stdout.write(`\n▸ parcours ${proto.slug}\n`)
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

// « Quel commit est déployé ? » doit être un curl, pas une fouille dans Railway : un
// redéploiement manuel rejoue le snapshot du déploiement cliqué, pas le HEAD du repo,
// et sans ce tampon l'écart est invisible de l'extérieur.
const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: RACINE, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
  } catch {
    return null
  }
}
const sha = process.env.RAILWAY_GIT_COMMIT_SHA ?? git("rev-parse", "HEAD")

// D'où vient le code : c'est ce que la console montre à un dev qui veut cloner un parcours.
// Railway pose owner/nom/branche en variables (le build tourne sur un snapshot sans remote) ;
// en local on lit le remote. Sans rien, `depot` vaut null et la console dit seulement le
// dossier — elle n'invente pas d'URL.
const depuisRailway =
  process.env.RAILWAY_GIT_REPO_OWNER && process.env.RAILWAY_GIT_REPO_NAME
    ? {
        proprietaire: process.env.RAILWAY_GIT_REPO_OWNER,
        nom: process.env.RAILWAY_GIT_REPO_NAME,
        branche: process.env.RAILWAY_GIT_BRANCH ?? "main",
      }
    : null
const depuisRemote = (() => {
  const m = git("remote", "get-url", "origin")?.match(
    /github\.com[:/]([^/]+)\/([^/\s]+?)(?:\.git)?$/,
  )
  return m
    ? { proprietaire: m[1], nom: m[2], branche: git("rev-parse", "--abbrev-ref", "HEAD") ?? "main" }
    : null
})()
const origine = depuisRailway ?? depuisRemote
const depot = origine
  ? {
      ...origine,
      url: `https://github.com/${origine.proprietaire}/${origine.nom}`,
      clone: `git@github.com:${origine.proprietaire}/${origine.nom}.git`,
      dossier_protos: "protos",
    }
  : null

fs.writeFileSync(
  path.join(DIST, "version.json"),
  `${JSON.stringify({ commit: sha, construit_le: new Date().toISOString(), depot }, null, 2)}\n`,
)

// Lu par la console au chargement (même origine, aucune clé). Écrit AVANT son build pour
// qu'un `vite preview` local trouve le fichier tout de suite.
fs.writeFileSync(
  path.join(DIST, "protos.json"),
  `${JSON.stringify(
    resultats.map(({ slug, titre, auteur, resume, cree_le, maj_le, ok }) => ({
      slug, titre, auteur, resume, cree_le, maj_le, ok,
    })),
    null,
    2,
  )}\n`,
)

process.stdout.write("\n▸ console\n")
npx(["tsc", "--noEmit", "-p", "tsconfig.console.json"])
npx(["vite", "build", "--config", "vite.console.config.ts"])

const ko = resultats.filter((r) => !r.ok)
console.log(`\nConsole construite. ${resultats.length - ko.length}/${resultats.length} parcours.`)
if (ko.length) console.log(`En échec : ${ko.map((k) => k.slug).join(", ")}`)
