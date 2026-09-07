import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/** The console: the admin app, served at the root of the site. A config separate from the
 *  flows' one — it has its own root and is not built per slug. */
export default defineConfig({
  root: "console",
  plugins: [react(), tailwindcss()],
  base: "/",
  build: { outDir: "../dist", emptyOutDir: false },
})
