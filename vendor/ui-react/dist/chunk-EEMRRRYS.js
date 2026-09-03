// src/lib/theme.ts
var THEME_MODES = ["light", "dark", "system"];
var DEFAULT_THEME_STORAGE_KEY = "ui-theme";
function isThemeMode(value) {
  return typeof value === "string" && THEME_MODES.includes(value);
}
function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function resolveTheme(mode) {
  return mode === "system" ? getSystemTheme() : mode;
}
function applyThemeAttribute(theme, attribute = "data-theme") {
  if (typeof document === "undefined") return;
  const attrs = Array.isArray(attribute) ? attribute : [attribute];
  const root = document.documentElement;
  if (attrs.includes("data-theme")) root.setAttribute("data-theme", theme);
  if (attrs.includes("class")) root.classList.toggle("dark", theme === "dark");
}
function disableTransitionsDuringChange() {
  if (typeof document === "undefined" || typeof window === "undefined") return () => {
  };
  const style = document.createElement("style");
  style.textContent = "*{transition:none!important}";
  document.head.appendChild(style);
  return () => {
    (() => window.getComputedStyle(document.body))();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  };
}
var THEME_INIT_SCRIPT_BODY = `(function(cfg){try{
  var d;
  if(cfg.force){
    d=cfg.force;
  }else{
    var s=localStorage.getItem(cfg.key),v=null;
    if(s){try{v=JSON.parse(s)}catch(e){v=null}}
    if(["light","dark","system"].indexOf(v)===-1)v=cfg.def;
    d=v==="system"?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):v;
  }
  if(cfg.attr.indexOf("data-theme")!==-1)document.documentElement.setAttribute("data-theme",d);
  if(cfg.attr.indexOf("class")!==-1)document.documentElement.classList.toggle("dark",d==="dark");
}catch(e){}})(`;
function buildThemeInitScript(options = {}) {
  const attribute = options.attribute ?? "data-theme";
  const config = {
    key: options.storageKey ?? DEFAULT_THEME_STORAGE_KEY,
    def: options.defaultColorScheme ?? "system",
    force: options.forceColorScheme ?? null,
    attr: Array.isArray(attribute) ? attribute : [attribute]
  };
  return `${THEME_INIT_SCRIPT_BODY}${JSON.stringify(config)});`;
}

export { DEFAULT_THEME_STORAGE_KEY, THEME_MODES, applyThemeAttribute, buildThemeInitScript, disableTransitionsDuringChange, getSystemTheme, isThemeMode, resolveTheme };
