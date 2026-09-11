import fs from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/** The console: the admin app, served at the root of the site. A config separate from the
 *  flows' one — it has its own root and is not built per slug.
 *
 *  Two entries, one build: `/` (the console) and `/compare/` (two flows side by side —
 *  two versions of one, or two screens). The compare page is its own document rather
 *  than a section of the console: it is opened from INSIDE a flow, in a new tab, and it
 *  asks for no sign-in — a live flow is public, and the key is only needed the moment a
 *  side is a past version that is not built yet. */
/** The kit the CONSOLE renders — `vendor/ui-react-0.8`, a second built copy, aliased
 *  below (C6, 2026-09-11). The flows keep `vendor/ui-react` (0.5.0): refreshing that one
 *  breaks their skeleton (NavLink, AvatarGroup, Pill changed API), and migrating every
 *  flow is its own piece of work. The Parity tab measures a render of THIS copy and reads
 *  the API from the manifest; the two have to be the same version, or a measured
 *  difference may be a difference between versions — which is what happened with the
 *  Badge radius (0.5.0's `rounded-md` filed as a parity gap). `__KIT_VERSION__` says
 *  which one was measured, and the tab compares it with the manifest's. */
const KIT_DIR = "vendor/ui-react-0.8"
const kitVersion = (): string => {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(import.meta.dirname, `${KIT_DIR}/package.json`), "utf8"),
    ).version as string
  } catch {
    return ""
  }
}

export default defineConfig({
  root: "console",
  plugins: [react(), tailwindcss()],
  base: "/",
  define: { __KIT_VERSION__: JSON.stringify(kitVersion()) },
  resolve: {
    // `@42/ui-react/*` in the console's own sources resolves to the 0.8.0 copy, installed
    // as `@42/ui-react-next` so its `exports` map (subpaths, CSS) keeps working. The
    // shared `src/` files the console imports (typo, who) carry no kit import.
    alias: [{ find: /^@42\/ui-react(?=\/|$)/, replacement: "@42/ui-react-next" }],
  },
  build: {
    outDir: "../dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        console: path.resolve(import.meta.dirname, "console/index.html"),
        compare: path.resolve(import.meta.dirname, "console/compare/index.html"),
      },
    },
  },
})
