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
export default defineConfig({
  root: "console",
  plugins: [react(), tailwindcss()],
  base: "/",
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
