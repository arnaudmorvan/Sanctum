/**
 * Les deux registres typographiques du DS 42 — RELEVÉS sur les frames, pas choisis.
 *
 *   Lato       porte le texte ET les titres de contenu.
 *   Kode Mono  porte LA MACHINE : niveau, compteurs, scores, pourcentages, nav.
 *
 * Pourquoi ce module existe — le kit inverse la règle :
 *   • `Title` émet `font-mono font-semibold` EN DUR (`titleVariants`) : tout titre
 *     de contenu sort en Kode Mono, là où les frames veulent du Lato.
 *   • `Text` n'expose aucune graisse (`size` et `c` seulement) : Bold, Semibold et
 *     Medium sont inatteignables sans `className`.
 *
 * Ce ne sont pas une seconde grammaire mais des CORRECTIFS : ils disparaissent le
 * jour où le kit expose les axes (→ `ds-actions.yaml`, `kit-title-force-mono` et
 * `kit-text-sans-graisse`).
 *
 * ⚠️ **La graisse est un paramètre, pas un rôle figé.** La première version de ce
 * module offrait `TYPO.titre` = Lato Bold, construit sur une seule frame. La frame
 * `22505:9532` (Home v3) a montré la limite : elle pose son titre de page et ses 12
 * noms de compétences en **Semibold**, et son `50%` en **Kode Mono Medium**. Un rôle
 * fige une graisse ; deux familles × quatre graisses en demandent seize. D'où deux
 * fonctions, orthogonales et complètes.
 *
 * Les TAILLES restent la prop `size` : l'échelle du kit tombe exactement sur celle du
 * DS (xs=12, sm=14, md=16, lg=18, xl=20, 2xl=24, 3xl=30).
 *
 *   <Title size="3xl" className={TYPO.texte("semibold")}>Welcome back, Amanda</Title>
 *   <Text size="sm" className={TYPO.machine("semibold")}>+120 XP</Text>
 */
export type Poids = "regular" | "medium" | "semibold" | "bold"

const POIDS: Record<Poids, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}

export const TYPO = {
  /** Lato — le texte et les titres de contenu. `Typography-1/*`. */
  texte: (poids: Poids = "bold") => `font-sans ${POIDS[poids]}`,
  /** Kode Mono — LA MACHINE : niveau, compteurs, scores, %, décomptes. `Typography-2/*`. */
  machine: (poids: Poids = "bold") => `font-mono ${POIDS[poids]}`,
  /** Kode Mono SemiBold capitales — les libellés de navigation du chrome. */
  nav: "font-mono font-semibold uppercase",
} as const
