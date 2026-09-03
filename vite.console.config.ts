import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/** La console : l'app d'administration, servie à la racine du site. Config séparée de celle
 *  des parcours — elle a sa propre racine et n'est pas construite par slug. */
export default defineConfig({
  root: "console",
  plugins: [react(), tailwindcss()],
  base: "/",
  build: { outDir: "../dist", emptyOutDir: false },
})
