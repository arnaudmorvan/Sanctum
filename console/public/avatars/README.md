# Avatars partagés — les photos du DS, servies à `/avatars/<slug>.webp`

Le DS Figma porte 246 photos d'avatar (page `↳ Avatars` : `abraham-baker`,
`anita-cruz`…) et `publish_proto` ne fait transiter aucun binaire : sans ce dossier,
chaque parcours retombait sur des initiales là où la maquette montre une photo.

**Le contrat** :

- Déposer ici (un commit humain, une fois) les photos exportées du fichier Figma
  `yoP06GsdWscdgqpJMV2YuN`, nommées par le slug de leur fiche : `anita-cruz.webp`.
  Export conseillé : WebP, 128×128 (l'`Avatar` du kit plafonne à `xl`).
- Elles sont copiées à la racine du site par le build console (`vite.console.config.ts`,
  `root: console/` → `dist/`) et servies à **`/avatars/<slug>.webp`** — une seule copie
  pour tous les parcours (les builds de parcours ont `publicDir: false`).
- Dans un écran : `<Avatar src="/avatars/anita-cruz.webp" name="Anita Cruz" />` — le
  `name` reste obligatoire : c'est le repli (initiales) si la photo n'est pas déposée,
  et l'accessibilité dans tous les cas.
- Une photo absente n'est **pas** un bug du parcours : l'`Avatar` retombe sur les
  initiales. Le parcours note dans son report quelles photos manquent ici.

Les illustrations et logos **vectoriels**, eux, n'ont pas besoin de ce dossier :
`publish_proto` accepte les `.svg` (texte, assaini côté serveur) dans le parcours.
