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
/** The kit the console RENDERS — `vendor/ui-react`, the built copy the previews import.
 *  The Parity tab compares Figma against a render of this version and the API against
 *  the manifest's; when the two differ, a measured difference may be a difference
 *  between versions, and the tab has to say which one it measured (2026-09-11: the
 *  vendored kit was 0.5.0, the manifest 0.8.0, and a radius 0.8.0 had already changed
 *  went into a brief as a parity gap). */
const kitVersion = (): string => {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(import.meta.dirname, "vendor/ui-react/package.json"), "utf8"),
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
