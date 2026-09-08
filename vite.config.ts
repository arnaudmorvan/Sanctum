import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import origin from "./scripts/babel-origin.mjs"
import importsKit from "./scripts/vite-imports-kit.mjs"

/** One build per flow. `scripts/build-flow.mjs` sets PROTO_SLUG and copies the flow into
 *  src/proto/; here we only aim at the right output sub-directory. PROTO_OUT_DIR overrides
 *  it: the hot build (server.mjs) bundles into a temp directory and swaps it into place,
 *  so a viewer refreshing during the build never lands on a half-written flow. */
const slug = process.env.PROTO_SLUG ?? ""
const outDir = process.env.PROTO_OUT_DIR || (slug ? `dist/p/${slug}` : "dist/preview")

export default defineConfig({
  // `origin` tags every element of the screens with where it comes from (kit / written by
  // hand). This is what the bottom bar's inspector reads — see scripts/babel-origin.mjs.
  plugins: [react({ babel: { plugins: [origin] } }), tailwindcss(), importsKit()],
  base: slug ? `/p/${slug}/` : "/",
  // Shared assets (public/: avatars, illustrations) are copied only once, by the console
  // build (site root) — a flow references them by ABSOLUTE URL (`/avatars/<name>.webp`).
  // Copying them into every dist/p/<slug>/ would multiply each photo by the number of flows.
  publicDir: slug ? false : "public",
  build: { outDir, emptyOutDir: true },
})
