import { CodeBlockButton, CodeBlockChrome } from '../../chunk-AREDZU73.js';
export { CodeBlockButton } from '../../chunk-AREDZU73.js';
import '../../chunk-ARWGZ23S.js';
import '../../chunk-G52U24GR.js';
import '../../chunk-GLWR5YCB.js';
import '../../chunk-BEL75C7N.js';
import '../../chunk-HLBFHYKE.js';
import '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { useMemo, useState, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';
import { CodeBlockStatic } from './static.js';

// src/components/code-block/gutters.ts
function countNonSkipped(lines, skip) {
  let n = 0;
  for (const l of lines) {
    if (l.blank) continue;
    if (!l.matches.some((m) => skip.has(m.tag))) n++;
  }
  return n;
}
function defaultCounterWidth(column, notation) {
  const startAt = column.startAt ?? 1;
  const total = countNonSkipped(notation.perLine, new Set(column.skip ?? []));
  const maxValue = startAt + Math.max(total - 1, 0);
  const digits = String(maxValue).length;
  return `${Math.max(digits + 0.5, 1.5)}ch`;
}
function appendClass(span, extra) {
  const existing = span.properties["class"];
  span.properties["class"] = existing ? `${existing} ${extra}` : extra;
}
function applyMarkerColor(span, color, background) {
  if (background !== void 0 && color !== void 0 && background !== color) {
    span.properties["data-color"] = background;
    appendClass(span, "decoration-bg");
    span.children = [
      {
        type: "element",
        tagName: "span",
        properties: { "data-color": color, class: "decoration-text" },
        children: span.children
      }
    ];
  } else if (background !== void 0 || color !== void 0) {
    const value = background ?? color;
    if (value !== void 0) span.properties["data-color"] = value;
    if (background !== void 0) appendClass(span, "decoration-bg");
    if (color !== void 0) appendClass(span, "decoration-text");
  }
}
function renderColumn(column, matches, counter, defaultWidth) {
  const isCounter = column.kind === "counter";
  const width = column.width ?? defaultWidth;
  const align = column.align ?? (isCounter ? "right" : "center");
  const ariaHidden = column.ariaHidden ?? isCounter;
  let text = "";
  let color;
  let background;
  if (isCounter && counter) {
    const skip = column.skip;
    const skipped = skip != null && matches.some((m) => skip.includes(m.tag));
    if (!skipped) {
      text = String(counter.value);
      counter.value += 1;
    }
  } else if (!isCounter) {
    const match = matches.find((m) => m.tag in column.tags);
    if (match) {
      const mapped = column.tags[match.tag];
      if (mapped !== null && typeof mapped === "object") {
        text = mapped.text === true ? match.payload ?? "" : mapped.text;
        color = mapped.color;
        background = mapped.background;
      } else {
        text = mapped === true ? match.payload ?? "" : mapped ?? "";
      }
    }
  }
  const baseClasses = ["gutter-column", isCounter ? "gutter-counter" : "gutter-content"];
  if (column.className) baseClasses.push(column.className);
  const span = {
    type: "element",
    tagName: "span",
    properties: {
      class: baseClasses.join(" "),
      style: `min-width:${width};text-align:${align}`,
      ...ariaHidden ? { "aria-hidden": "true" } : {}
    },
    children: text ? [{ type: "text", value: text }] : []
  };
  if (text) applyMarkerColor(span, color, background);
  return span;
}
function resolveGutterColumns(gutters, notation, headLineOffset) {
  const resolved = gutters.map((column) => {
    if (column.kind === "counter") {
      const seed = (column.startAt ?? 1) + countNonSkipped(notation.perLine.slice(0, headLineOffset), new Set(column.skip ?? []));
      return {
        column,
        counter: { value: seed },
        defaultWidth: defaultCounterWidth(column, notation)
      };
    }
    return { column, counter: void 0, defaultWidth: "3ch" };
  });
  return {
    /** A blank (fully-removed) line never advances any counter, since it
     *  never renders at all — callers should not invoke this for a line
     *  whose `ParsedLine.blank` is true. */
    render(parsed) {
      if (resolved.length === 0) return [];
      const matches = parsed?.matches ?? [];
      return resolved.map((r) => renderColumn(r.column, matches, r.counter, r.defaultWidth));
    }
  };
}

// src/components/code-block/notation.ts
var MARKER_SOURCE = String.raw`\[!code\s+([A-Za-z][\w-]*)(?::((?:\\.|[^:\]])*))?\s*\]`;
var MARKER_RE = new RegExp(MARKER_SOURCE, "g");
var TRAILING_MARKERS_RE = new RegExp(`(?:${MARKER_SOURCE}\\s*)+$`);
var LINE_OPENER_RE = /\/\/|#|;{1,2}|%{1,2}|--/g;
var UNESCAPE_RE = /\\(.)/g;
var NO_MATCH = { matches: [], stripCount: 0, blank: false };
function unescapePayload(payload) {
  return payload.replace(UNESCAPE_RE, "$1");
}
function collectMarkers(text) {
  return [...text.matchAll(MARKER_RE)].map((m) => ({
    tag: m[1],
    payload: m[2] !== void 0 ? unescapePayload(m[2]) : void 0
  }));
}
function backOverWhitespace(line, index) {
  let i = index;
  while (i > 0 && (line[i - 1] === " " || line[i - 1] === "	")) i--;
  return i;
}
function toParsedLine(matches, line, removableFrom) {
  const start = backOverWhitespace(line, removableFrom);
  return { matches, stripCount: line.length - start, blank: line.slice(0, start).trim() === "" };
}
function matchBlock(line, open, close) {
  const closeIdx = line.lastIndexOf(close);
  if (closeIdx === -1) return null;
  if (line.slice(closeIdx + close.length).trim() !== "") return null;
  const openIdx = line.lastIndexOf(open, closeIdx);
  if (openIdx === -1) return null;
  const body = line.slice(openIdx + open.length, closeIdx);
  MARKER_RE.lastIndex = 0;
  if (!MARKER_RE.test(body)) return null;
  MARKER_RE.lastIndex = 0;
  const remaining = body.replace(MARKER_RE, "").trim();
  if (remaining !== "") return null;
  return toParsedLine(collectMarkers(body), line, openIdx);
}
function matchLineStyle(line) {
  MARKER_RE.lastIndex = 0;
  const markerSpans = [...line.matchAll(MARKER_RE)].map(
    (m) => [m.index, m.index + m[0].length]
  );
  const insideAMarker = (i) => markerSpans.some(([s, e]) => i >= s && i < e);
  let openIdx = -1;
  let openLen = 0;
  for (const m of line.matchAll(LINE_OPENER_RE)) {
    if (insideAMarker(m.index)) continue;
    openIdx = m.index;
    openLen = m[0].length;
  }
  if (openIdx === -1) return null;
  const body = line.slice(openIdx + openLen);
  const trailing = body.match(TRAILING_MARKERS_RE);
  if (!trailing || trailing.index === void 0) return null;
  const matches = collectMarkers(trailing[0]);
  const prose = body.slice(0, trailing.index).trim();
  const removableFrom = prose === "" ? openIdx : openIdx + openLen + trailing.index;
  return toParsedLine(matches, line, removableFrom);
}
function matchContinuation(line) {
  const m = line.match(/^(\s*)\*(?!\/)([\s\S]*)$/);
  if (!m) return null;
  const [, indent, body] = m;
  const trailing = body.match(TRAILING_MARKERS_RE);
  if (!trailing || trailing.index === void 0) return null;
  const matches = collectMarkers(trailing[0]);
  const prose = body.slice(0, trailing.index).trim();
  const removableFrom = prose === "" ? indent.length : indent.length + 1 + trailing.index;
  return toParsedLine(matches, line, removableFrom);
}
function parseLine(line) {
  const jsx2 = matchBlock(line, "{/*", "*/}");
  if (jsx2) return jsx2;
  const html = matchBlock(line, "<!--", "-->");
  if (html) return html;
  const block = matchBlock(line, "/*", "*/");
  if (block) return block;
  const lineStyle = matchLineStyle(line);
  if (lineStyle) return lineStyle;
  const continuation = matchContinuation(line);
  if (continuation) return continuation;
  return NO_MATCH;
}
function parseNotation(code) {
  return { perLine: code.split("\n").map(parseLine) };
}

// src/components/code-block/highlighter.ts
var DEFAULT_THEMES = { light: "github-light", dark: "github-dark-default" };
var highlighterPromise = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(
      ({ createHighlighter }) => createHighlighter({ themes: [DEFAULT_THEMES.light, DEFAULT_THEMES.dark], langs: [] })
    );
  }
  return highlighterPromise;
}
async function registerLanguage(lang) {
  const highlighter = await getHighlighter();
  await highlighter.loadLanguage(lang);
}
async function registerTheme(theme) {
  const highlighter = await getHighlighter();
  await highlighter.loadTheme(theme);
}
function appendStyle(hast, style) {
  const existing = hast.properties["style"];
  hast.properties["style"] = typeof existing === "string" && existing.length > 0 ? `${existing};${style}` : style;
}
function applyStyle(hast, s, addClassToHast) {
  if (s.className) addClassToHast(hast, s.className);
  if (s.style) appendStyle(hast, s.style);
  const { background, color } = s;
  if (background !== void 0 && color !== void 0 && background !== color) {
    hast.properties["data-color"] = background;
    addClassToHast(hast, "decoration-bg");
    hast.children = [
      {
        type: "element",
        tagName: "span",
        properties: { "data-color": color, class: "decoration-text" },
        children: hast.children
      }
    ];
  } else if (background !== void 0 || color !== void 0) {
    hast.properties["data-color"] = background ?? color;
    if (background !== void 0) addClassToHast(hast, "decoration-bg");
    if (color !== void 0) addClassToHast(hast, "decoration-text");
  }
}
function isEmptyNode(node) {
  if (node.type === "text") return node.value.length === 0;
  if (node.type === "element") return node.children.length === 0;
  return false;
}
function trimNode(node, remaining) {
  if (node.type === "text") {
    const take = Math.min(remaining, node.value.length);
    node.value = node.value.slice(0, node.value.length - take);
    return remaining - take;
  }
  if (node.type === "element") {
    let left = remaining;
    while (left > 0 && node.children.length > 0) {
      const child = node.children[node.children.length - 1];
      left = trimNode(child, left);
      if (isEmptyNode(child)) node.children.pop();
      else break;
    }
    return left;
  }
  return remaining;
}
function trimTrailingChars(hast, count) {
  let remaining = count;
  while (remaining > 0 && hast.children.length > 0) {
    const last = hast.children[hast.children.length - 1];
    remaining = trimNode(last, remaining);
    if (isEmptyNode(last)) hast.children.pop();
    else break;
  }
}
function buildCodeBlockTransformer(opts, notation) {
  const offset = opts.lineOffset ?? 0;
  const gutters = resolveGutterColumns(opts.gutters ?? [], notation, offset);
  const toRemove = /* @__PURE__ */ new Set();
  return {
    name: "42-ui-code-block",
    line(hast, renderedLine) {
      const line = renderedLine + offset;
      const parsed = notation.perLine[line - 1];
      if (parsed?.blank) {
        toRemove.add(hast);
        return hast;
      }
      if (parsed && parsed.stripCount > 0) trimTrailingChars(hast, parsed.stripCount);
      for (const m of parsed?.matches ?? []) {
        const style = opts.tags?.[m.tag];
        if (style) applyStyle(hast, style, this.addClassToHast);
      }
      const gutterSpans = gutters.render(parsed);
      if (gutterSpans.length > 0) hast.children.unshift(...gutterSpans);
      return hast;
    },
    code(hast) {
      if (toRemove.size === 0) return hast;
      hast.children = hast.children.filter((child, i, arr) => {
        if (child.type === "element" && toRemove.has(child)) return false;
        if (child.type === "text" && child.value === "\n") {
          const neighbor = arr[i - 1] ?? arr[i + 1];
          if (neighbor?.type === "element" && toRemove.has(neighbor)) return false;
        }
        return true;
      });
      return hast;
    }
  };
}
async function highlightCode(code, opts = {}) {
  const lang = opts.lang ?? "text";
  const themes = opts.themes ?? DEFAULT_THEMES;
  const highlighter = await getHighlighter();
  const notation = opts.notation ?? parseNotation(code);
  await Promise.all(
    [themes.light, themes.dark].filter((t) => !highlighter.getLoadedThemes().includes(t)).map((t) => highlighter.loadTheme(t))
  );
  if (!highlighter.getLoadedLanguages().includes(lang)) {
    await highlighter.loadLanguage(lang);
  }
  return highlighter.codeToHtml(code, {
    lang,
    themes,
    defaultColor: false,
    transformers: [buildCodeBlockTransformer(opts, notation), ...opts.transformers ?? []]
  });
}
function HighlightedPre({
  code,
  lang,
  themes,
  tags,
  gutters,
  notation,
  lineOffset,
  transformers,
  className
}) {
  const [html, setHtml] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    highlightCode(code, {
      lang,
      themes,
      tags,
      gutters,
      notation,
      lineOffset,
      transformers
    }).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [
    code,
    lang,
    themes?.light,
    themes?.dark,
    tags,
    gutters,
    notation,
    lineOffset,
    transformers,
    themes
  ]);
  if (html) {
    return /* @__PURE__ */ jsx("div", { className, dangerouslySetInnerHTML: { __html: html } });
  }
  return (
    // The plain fallback has no `.line` spans of its own to carry padding,
    // so it keeps the horizontal inset directly.
    /* @__PURE__ */ jsx("pre", { className: cn(className, "px-4"), children: /* @__PURE__ */ jsx("code", { children: code }) })
  );
}
function CodeBlockComponent({
  code,
  language,
  themes,
  tags,
  gutters,
  transformers,
  collapsedLines,
  className,
  classNames,
  ...chromeProps
}) {
  const lines = code.split("\n");
  const isCollapsible = collapsedLines != null && lines.length > collapsedLines;
  const headCode = isCollapsible ? lines.slice(0, collapsedLines).join("\n") : code;
  const tailCode = isCollapsible ? lines.slice(collapsedLines).join("\n") : "";
  const notation = useMemo(() => parseNotation(code), [code]);
  const preClassName = cn("overflow-x-auto py-3 text-sm leading-relaxed font-mono", classNames?.pre);
  return /* @__PURE__ */ jsx(
    CodeBlockChrome,
    {
      code,
      isCollapsible,
      className,
      classNames,
      headContent: /* @__PURE__ */ jsx(
        HighlightedPre,
        {
          code: headCode,
          lang: language,
          themes,
          tags,
          gutters,
          notation,
          transformers,
          className: preClassName
        }
      ),
      tailContent: isCollapsible && /* @__PURE__ */ jsx(
        HighlightedPre,
        {
          code: tailCode,
          lang: language,
          themes,
          tags,
          gutters,
          notation,
          lineOffset: collapsedLines,
          transformers,
          className: preClassName
        }
      ),
      ...chromeProps
    }
  );
}
var CodeBlock = Object.assign(CodeBlockComponent, { Button: CodeBlockButton });

// src/components/code-block/presets.ts
function lineNumbers(options) {
  return { kind: "counter", startAt: options?.startAt };
}
function highlight(options) {
  const { tag = "highlight", ...style } = options ?? {};
  return { [tag]: { background: "yellow", ...style } };
}
var CodeBlock2 = Object.assign(CodeBlock, { Static: CodeBlockStatic });

export { CodeBlock2 as CodeBlock, highlight, lineNumbers, registerLanguage, registerTheme };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map