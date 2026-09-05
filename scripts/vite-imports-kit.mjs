import fs from "node:fs"
import path from "node:path"

/**
 * Expose la liste des composants du kit RÉELLEMENT importés par le parcours, lue dans
 * ses sources au moment du build (`virtual:42-imports-kit`).
 *
 * Pourquoi elle est nécessaire alors que `babel-origine` tague déjà le DOM : tous les
 * composants du kit ne propagent pas leurs props inconnues jusqu'à leur élément racine.
 * `SegmentGroup`, par exemple, passe des props explicites à `Ark.Root` sans `...rest` :
 * le `data-42` posé sur son JSX n'atteint jamais le DOM, et l'inspecteur ne le voyait pas.
 * Un composant du kit qui disparaît d'un compteur de couverture est exactement le genre
 * de mensonge silencieux qu'on cherche à éliminer — donc on croise deux sources :
 *
 *   ce que le DOM montre  (précis, mais aveugle aux composants non instrumentés)
 *   ce que le code importe (exhaustif, mais sans les quantités)
 *
 * L'inspecteur affiche l'écart au lieu de le taire.
 */
export default function importsKit(racine = "src/proto") {
  const ID = "virtual:42-imports-kit"
  const RESOLU = `\0${ID}`
  const IMPORT_KIT = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["']@42\/ui-react[^"']*["']/g

  return {
    name: "42-imports-kit",
    resolveId: (id) => (id === ID ? RESOLU : null),
    load(id) {
      if (id !== RESOLU) return null
      const noms = new Set()
      const parcourir = (dossier) => {
        if (!fs.existsSync(dossier)) return
        for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
          const p = path.join(dossier, e.name)
          if (e.isDirectory()) {
            parcourir(p)
          } else if (/\.tsx?$/.test(e.name)) {
            const source = fs.readFileSync(p, "utf8")
            for (const m of source.matchAll(IMPORT_KIT)) {
              for (const brut of m[1].split(",")) {
                // `X as Y` : c'est le nom LOCAL qui est écrit dans le JSX.
                const nom = brut.split(" as ").pop().trim()
                // Majuscule : un composant. Le reste (types, constantes) n'est pas rendu.
                if (/^[A-Z]/.test(nom)) noms.add(nom)
              }
            }
          }
        }
      }
      parcourir(racine)
      return `export const IMPORTS_KIT = ${JSON.stringify([...noms].sort())}\n`
    },
  }
}
