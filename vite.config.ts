import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import origine from "./scripts/babel-origine.mjs"
import importsKit from "./scripts/vite-imports-kit.mjs"

/** Un build par parcours. `scripts/build-all.mjs` pose PROTO_SLUG et recopie le parcours
 *  dans src/proto/ ; ici on ne fait que viser le bon sous-dossier de sortie. */
const slug = process.env.PROTO_SLUG ?? ""

export default defineConfig({
  // `origine` tague chaque élément des écrans avec sa provenance (kit / écrit à la main).
  // C'est ce que lit l'inspecteur de la barre du bas — voir scripts/babel-origine.mjs.
  plugins: [react({ babel: { plugins: [origine] } }), tailwindcss(), importsKit()],
  base: slug ? `/p/${slug}/` : "/",
  // Les assets partagés (public/ : avatars, illustrations) ne sont copiés qu'une fois, par
  // le build console (racine du site) — un parcours les référence en URL ABSOLUE
  // (`/avatars/<nom>.webp`). Les recopier dans chaque dist/p/<slug>/ multiplierait chaque
  // photo par le nombre de parcours.
  publicDir: slug ? false : "public",
  build: { outDir: slug ? `dist/p/${slug}` : "dist/preview", emptyOutDir: true },
})
