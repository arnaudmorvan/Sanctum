# Shared avatars — the DS photos, served at `/avatars/<slug>.webp`

The Figma DS carries 246 avatar photos (page `↳ Avatars`: `abraham-baker`,
`anita-cruz`…) and `publish_proto` transfers no binary at all: without this folder,
every flow fell back to initials where the mockup shows a photo.

**The contract**:

- Drop the photos here (one human commit, once), exported from the Figma file
  `yoP06GsdWscdgqpJMV2YuN`, named after the slug of their entry: `anita-cruz.webp`.
  Recommended export: WebP, 128×128 (the kit's `Avatar` caps out at `xl`).
- They are copied to the root of the site by the console build (`vite.console.config.ts`,
  `root: console/` → `dist/`) and served at **`/avatars/<slug>.webp`** — a single copy
  for every flow (flow builds have `publicDir: false`).
- In a screen: `<Avatar src="/avatars/anita-cruz.webp" name="Anita Cruz" />` — the
  `name` stays mandatory: it is the fallback (initials) when the photo has not been
  dropped here, and the accessibility name in every case.
- A missing photo is **not** a bug in the flow: the `Avatar` falls back to initials.
  The flow notes in its report which photos are missing here.

**Vector** illustrations and logos, on the other hand, do not need this folder:
`publish_proto` accepts `.svg` files (text, sanitized server-side) inside the flow.
