// src/lib/gradient.ts
var TW_VIA_STOPS = "var(--tw-gradient-position),var(--tw-gradient-from) var(--tw-gradient-from-position),var(--tw-gradient-via) var(--tw-gradient-via-position),var(--tw-gradient-to) var(--tw-gradient-to-position)";
function buildGradientVars(g, {
  fromVar = "--tw-gradient-from",
  toVar = "--tw-gradient-to",
  viaVar = "--tw-gradient-via",
  fromDefault,
  toDefault
} = {}) {
  const vars = {};
  const from = g?.from ?? fromDefault;
  const to = g?.to ?? toDefault;
  if (from) vars[fromVar] = from;
  if (to) vars[toVar] = to;
  if (g?.via) {
    vars[viaVar] = g.via;
    vars["--tw-gradient-via-stops"] = TW_VIA_STOPS;
  }
  return vars;
}
var GRADIENT_DIR_CLASS = {
  "to-r": "bg-linear-to-r",
  "to-l": "bg-linear-to-l",
  "to-t": "bg-linear-to-t",
  "to-b": "bg-linear-to-b",
  "to-tr": "bg-linear-to-tr",
  "to-tl": "bg-linear-to-tl",
  "to-br": "bg-linear-to-br",
  "to-bl": "bg-linear-to-bl"
};
var GRADIENT_DIR_BEFORE_CLASS = {
  "to-r": "before:bg-linear-to-r",
  "to-l": "before:bg-linear-to-l",
  "to-t": "before:bg-linear-to-t",
  "to-b": "before:bg-linear-to-b",
  "to-tr": "before:bg-linear-to-tr",
  "to-tl": "before:bg-linear-to-tl",
  "to-br": "before:bg-linear-to-br",
  "to-bl": "before:bg-linear-to-bl"
};

export { GRADIENT_DIR_BEFORE_CLASS, GRADIENT_DIR_CLASS, buildGradientVars };
