import fs from "node:fs"
import path from "node:path"

/**
 * Exposes the list of kit components the flow ACTUALLY imports, read from its sources at
 * build time (`virtual:42-imports-kit`).
 *
 * Why it is needed even though `babel-origin` already tags the DOM: not every kit component
 * forwards its unknown props down to its root element. `SegmentGroup`, for instance, passes
 * explicit props to `Ark.Root` with no `...rest`: the `data-42` stamped on its JSX never
 * reaches the DOM, and the inspector could not see it. A kit component that disappears from
 * a coverage counter is exactly the kind of silent lie we are trying to eliminate — so we
 * cross two sources:
 *
 *   what the DOM shows   (precise, but blind to uninstrumented components)
 *   what the code imports (exhaustive, but without the quantities)
 *
 * The inspector displays the gap instead of hiding it.
 */
export default function importsKit(root = "src/proto") {
  const ID = "virtual:42-imports-kit"
  const RESOLVED = `\0${ID}`
  const KIT_IMPORT = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["']@42\/ui-react[^"']*["']/g

  return {
    name: "42-imports-kit",
    resolveId: (id) => (id === ID ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null
      const names = new Set()
      const walk = (dir) => {
        if (!fs.existsSync(dir)) return
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, e.name)
          if (e.isDirectory()) {
            walk(p)
          } else if (/\.tsx?$/.test(e.name)) {
            const source = fs.readFileSync(p, "utf8")
            for (const m of source.matchAll(KIT_IMPORT)) {
              for (const raw of m[1].split(",")) {
                // `X as Y`: it is the LOCAL name that is written in the JSX.
                const name = raw.split(" as ").pop().trim()
                // Capitalized: a component. The rest (types, constants) is not rendered.
                if (/^[A-Z]/.test(name)) names.add(name)
              }
            }
          }
        }
      }
      walk(root)
      return `export const IMPORTS_KIT = ${JSON.stringify([...names].sort())}\n`
    },
  }
}
