import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/** Un build par parcours. `scripts/build-all.mjs` pose PROTO_SLUG et recopie le parcours
 *  dans src/proto/ ; ici on ne fait que viser le bon sous-dossier de sortie. */
const slug = process.env.PROTO_SLUG ?? ""

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: slug ? `/p/${slug}/` : "/",
  build: { outDir: slug ? `dist/p/${slug}` : "dist/preview", emptyOutDir: true },
})
