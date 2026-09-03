# Sanctum — la console 42

Un site, deux choses : **la console d'administration** à la racine, et **N parcours
cliquables** sous `/p/<slug>/`. Tout est construit avec les vrais composants de
`@42/ui-react` — y compris la console, qui est donc le premier vrai test du kit sur une
application non triviale.

Le repo s'appelle `Sanctum` ; le serveur MCP qui écrit dedans, `mcp-Omniscient`.

Un parcours est déposé **depuis une conversation Claude** (connecteur 42 Design), pas par
git : le PO décrit son parcours, le serveur MCP commit ici, Railway construit et déploie.

- **Console** : `/` — onglets Prototypes, Observabilité, Accès
- **Un parcours** : `/p/<slug>/`

## Pour un PO : ajouter ou faire évoluer un parcours

Rien à installer, rien à cloner. Dans une conversation avec le connecteur **42 Design** :

- « Fais-moi un parcours de demande de transformation d'heures : la liste, le détail,
  la confirmation. » → l'agent le génère et appelle `publish_proto`.
- « Reprends le parcours `exemple-demandes` et ajoute un écran de refus motivé. »
  → l'agent appelle `list_protos("exemple-demandes")`, modifie, republie.

Republier avec le **même slug** met le parcours à jour. Un slug nouveau crée un parcours de plus.

## Structure

```
console/             ← la console React (@42/ui-react) : galerie, métriques, rôles
protos/<slug>/
├── views.tsx        ← LE PARCOURS : une entrée par écran. Obligatoire.
├── pages/*.tsx      ← les écrans
├── data/*.ts        ← les données de démo
└── proto.json       ← titre, auteur, dates (écrit par le MCP)

src/                 ← le squelette, commun à tous les parcours (routage, barre de vues)
vendor/ui-react/     ← snapshot CONSTRUIT de @42/ui-react
scripts/build-all.mjs ← un build par parcours, puis la galerie
server.mjs           ← service statique de dist/ (Railway)
```

`views.tsx` est le contrat : la barre de navigation du bas **et** le routage par hash s'en
déduisent tous les deux. Un écran qui n'y figure pas est inatteignable.

## Deux contraintes porteuses — ne pas les défaire

**1. `@42/ui-react` n'est publié nulle part.** Ni sur npm, ni installable par git : le package
à la racine de `42staff/kit` est `@42/ui` (racine de workspace privée), et `@42/ui-react` vit
dans `packages/react/` — npm ne sait pas installer un sous-dossier d'un dépôt git, et le
package n'a pas de script `prepare`. D'où `vendor/ui-react/` : une copie du package
**construit**, branchée en `file:`.

Rafraîchir après une évolution du kit :

```bash
cd <kit>/packages/react && pnpm build
rm -rf <ici>/vendor/ui-react/dist
cp -R dist <ici>/vendor/ui-react/dist
find <ici>/vendor/ui-react -name '*.map' -delete   # inutiles, et ça divise le poids par deux
```

**2. Le CSS du kit n'existe pas compilé.** `@42/ui-react/styles.css` ne contient que des
directives ; les classes des composants sont générées par un **scan de son `dist`**. C'est
`src/styles.css` qui le déclare :

```css
@source "../node_modules/@42/ui-react/dist/**/*.js";
```

Sans cette ligne : 0 classe générée, composants entièrement nus. Avec : ~1600 règles.
Mesuré le 2026-09-03.

## Build

```bash
npm install
npm run build     # dist/ (la console) + dist/p/<slug>/ (un par parcours)
npm start         # sert dist/ sur $PORT
```

**Chaque build est précédé d'un `tsc --noEmit`**, et ce n'est pas du zèle : Vite/esbuild
retirent les types sans les vérifier. Un parcours qui écrit `Table.Root` (la racine est
`Table` lui-même) se bundle sans broncher puis plante à l'ouverture — la console afficherait
un parcours vert et cassé. Le typecheck est la seule chose qui attrape ça.

Un build **par parcours**, volontairement : le code vient d'agents pilotés par des PO, et un
parcours qui ne compile pas ne doit pas emporter ceux des autres. Il est marqué « build en
échec » dans la galerie, les autres restent en ligne.

> ⚠️ npm ≥ 11 bloque les scripts d'installation par défaut ; esbuild (via Vite) en a un.
> Si le build échoue sur esbuild, lancer `npm approve-scripts --allow-scripts-pending`
> en local, ou poser `NPM_CONFIG_ALLOW_SCRIPTS_PENDING=true` côté hébergeur.
