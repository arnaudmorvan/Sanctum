/**
 * Les deux registres typographiques du DS 42 — RELEVÉS sur la frame 22489:9756
 * (91 textes, 18 styles distincts), pas choisis.
 *
 *   Lato       porte le texte ET les titres de contenu.
 *   Kode Mono  porte LA MACHINE : le niveau, les compteurs, les scores, la nav.
 *
 * Pourquoi ce module existe — le kit inverse la règle :
 *   • `Title` émet `font-mono font-semibold` EN DUR (`titleVariants`) : tout titre
 *     de contenu sort en Kode Mono, là où la frame veut du Lato Bold. C'est la
 *     cause visible de « la typo ne correspond pas à la maquette ».
 *   • `Text` n'expose aucune graisse (`size` et `c` seulement) : les 10 nœuds
 *     Lato Bold 14, les 6 Lato Bold 16 et les 4 Kode Mono Bold 14 de la frame
 *     sont inatteignables sans `className`.
 *
 * Ce ne sont donc pas une seconde grammaire mais des CORRECTIFS : chaque
 * constante nomme le style Figma qu'elle reproduit, et toutes disparaissent le
 * jour où le kit expose les axes (→ `ds-actions.yaml`, entrées
 * `kit-title-force-mono` et `kit-text-sans-graisse`).
 *
 * Les TAILLES, elles, se passent en prop `size` : l'échelle du kit tombe
 * exactement sur celle du DS (xs=12, sm=14, md=16, xl=20, 2xl=24, 3xl=30).
 */
export const TYPO = {
  /** Lato Bold — `Display sm/Bold`, `Text xl|md|sm/Bold`. Le titre de contenu. */
  titre: "font-sans font-bold",
  /** Lato Medium — `Text sm|xs/Medium`, et les valeurs sans style de la frame. */
  medium: "font-sans font-medium",
  /** Lato Bold capitales — `Text sm/BoldCap` : les renvois de « Elsewhere ». */
  renvoi: "font-sans font-bold uppercase",
  /** Kode Mono Bold — `Typography-2/*` : LEVEL 7, 312H, 47, les scores 125 / 100. */
  machine: "font-mono font-bold",
  /** Kode Mono SemiBold capitales — les libellés de navigation (Kode Mono SemiBold 14). */
  nav: "font-mono font-semibold uppercase",
} as const
