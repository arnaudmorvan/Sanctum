/**
 * Single source of truth for the `size` prop accepted by sized components
 * (Button, Badge, ActionIcon, Spinner, Slider, Container, Text, Title, …).
 * The const array drives both the type and any runtime iteration (story
 * controls, docs sliders).
 *
 * Listed from smallest to largest — the base tier the playground's size
 * slider sorts against (see `SizeSlider`'s `CANONICAL_ORDER`, which layers
 * further known tiers — Text/Title's `2xl..4xl`, the heading aliases — on
 * top of this array). Strict by design: unlike `Color`, size has no
 * CSS-token escape hatch (no `data-size` slot vars), so widening to
 * `(string & {})` would only let callers slip in values the cva mappings
 * can't honor. Components that need extra tokens (Text/Title's shared
 * `xs..4xl` scale in `lib/typography-size.ts`, Container's `full`) declare
 * them via their own cva variants and export their own widened type —
 * outside this canonical scale.
 */
export declare const SIZES: readonly ["xs", "sm", "md", "lg", "xl"];
export type Size = (typeof SIZES)[number];
//# sourceMappingURL=sizes.d.ts.map