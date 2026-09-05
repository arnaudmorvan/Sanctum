import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/** Un build par parcours. `scripts/build-all.mjs` pose PROTO_SLUG et recopie le parcours
 *  dans src/proto/ ; ici on ne fait que viser le bon sous-dossier de sortie. */
const slug = process.env.PROTO_SLUG ?? ""

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: slug ? `/p/${slug}/` : "/",
  // Les assets partagés (public/ : avatars, illustrations) ne sont copiés qu'une fois, par
  // le build console (racine du site) — un parcours les référence en URL ABSOLUE
  // (`/avatars/<nom>.webp`). Les recopier dans chaque dist/p/<slug>/ multiplierait chaque
  // photo par le nombre de parcours.
  publicDir: slug ? false : "public",
  build: { outDir: slug ? `dist/p/${slug}` : "dist/preview", emptyOutDir: true },
})
