// src/lib/typography-size.ts
var TYPOGRAPHY_SIZE_CLASSES = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl"
};
var HEADING_SIZE_ALIASES = {
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  h4: "xl",
  h5: "lg",
  h6: "md",
  p: "md"
};
function resolveHeadingSize(size) {
  return Object.hasOwn(HEADING_SIZE_ALIASES, size) ? HEADING_SIZE_ALIASES[size] : size;
}

export { HEADING_SIZE_ALIASES, TYPOGRAPHY_SIZE_CLASSES, resolveHeadingSize };
