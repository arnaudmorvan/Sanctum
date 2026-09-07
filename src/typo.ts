/**
 * The two typographic registers of the 42 DS — OBSERVED on the frames, not chosen.
 *
 *   Lato       carries the body text AND the content titles.
 *   Kode Mono  carries THE MACHINE: level, counters, scores, percentages, nav.
 *
 * Why this module exists — the kit inverts the rule:
 *   • `Title` emits `font-mono font-semibold` HARD-CODED (`titleVariants`): every content
 *     title comes out in Kode Mono, where the frames want Lato.
 *   • `Text` exposes no weight at all (`size` and `c` only): Bold, Semibold and Medium are
 *     unreachable without a `className`.
 *
 * These are not a second grammar but FIXES: they disappear the day the kit exposes the
 * axes (→ `ds-actions.yaml`, `kit-title-force-mono` and `kit-text-sans-graisse`).
 *
 * ⚠️ **Weight is a parameter, not a frozen role.** The first version of this module offered
 * `TYPO.title` = Lato Bold, built on a single frame. Frame `22505:9532` (Home v3) showed
 * the limit: it sets its page title and its 12 skill names in **Semibold**, and its `50%`
 * in **Kode Mono Medium**. A role freezes a weight; two families × four weights need
 * sixteen. Hence two functions, orthogonal and complete.
 *
 * `title` is therefore the LATO register, not "the helper for `<Title>`": it is just as
 * right on a `<Text>` that needs a weight (`TYPO.title("medium")`), and `<Title>` elements
 * that carry a number take `mono`.
 *
 * SIZES stay the `size` prop: the kit's scale lands exactly on the DS one
 * (xs=12, sm=14, md=16, lg=18, xl=20, 2xl=24, 3xl=30).
 *
 *   <Title size="3xl" className={TYPO.title("semibold")}>Welcome back, Amanda</Title>
 *   <Text size="sm" className={TYPO.mono("semibold")}>+120 XP</Text>
 */
export type Weight = "regular" | "medium" | "semibold" | "bold"

const WEIGHTS: Record<Weight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}

export const TYPO = {
  /** Lato — body text and content titles. `Typography-1/*`. */
  title: (weight: Weight = "bold") => `font-sans ${WEIGHTS[weight]}`,
  /** Kode Mono — THE MACHINE: level, counters, scores, %, countdowns. `Typography-2/*`. */
  mono: (weight: Weight = "bold") => `font-mono ${WEIGHTS[weight]}`,
  /** Kode Mono SemiBold uppercase — the chrome's navigation labels. */
  nav: "font-mono font-semibold uppercase",
} as const
