import { Tooltip } from './chunk-ARWGZ23S.js';
import { popoverChrome } from './chunk-GLWR5YCB.js';
import { useUncontrolled } from './chunk-BEL75C7N.js';
import { Collapse } from './chunk-HLBFHYKE.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { useClipboard } from '@ark-ui/react/clipboard';
import { ChevronUpIcon, ChevronDownIcon, CheckIcon, CopyIcon } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';

var DEFAULT_TRANSLATIONS = {
  copy: "Copy",
  copied: "Copied",
  expand: "Show more",
  collapse: "Show less"
};
var CodeBlockButton = ({
  className,
  asChild,
  type,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  ark.button,
  {
    asChild,
    type: asChild ? type : type ?? "button",
    ...props({ "data-testid": testId }),
    className: cn(
      "inline-flex size-6 shrink-0 items-center justify-center rounded",
      "text-(--c-text) [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
      "hover:bg-(--c-soft)",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...rest
  }
);
function CopyTrigger({
  code,
  onCopy,
  copyLabel,
  copiedLabel,
  copyIcon,
  copiedIcon,
  className,
  testId
}) {
  const { copied, copy } = useClipboard({
    value: code,
    timeout: 2e3,
    onStatusChange: (details) => details.copied && onCopy?.()
  });
  const label = copied ? copiedLabel : copyLabel;
  return /* @__PURE__ */ jsx(Tooltip, { label, asChild: true, children: /* @__PURE__ */ jsx(CodeBlockButton, { "aria-label": label, onClick: copy, className, testId, children: copied ? copiedIcon === void 0 ? /* @__PURE__ */ jsx(CheckIcon, {}) : copiedIcon : copyIcon === void 0 ? /* @__PURE__ */ jsx(CopyIcon, {}) : copyIcon }) });
}
function ExpandTrigger({
  expanded,
  onToggle,
  expandLabel,
  collapseLabel,
  expandIcon,
  collapseIcon,
  className,
  testId
}) {
  const label = expanded ? collapseLabel : expandLabel;
  return /* @__PURE__ */ jsx(Tooltip, { label, asChild: true, children: /* @__PURE__ */ jsx(
    CodeBlockButton,
    {
      "aria-label": label,
      "aria-expanded": expanded,
      onClick: onToggle,
      className,
      testId,
      children: expanded ? collapseIcon === void 0 ? /* @__PURE__ */ jsx(ChevronUpIcon, {}) : collapseIcon : expandIcon === void 0 ? /* @__PURE__ */ jsx(ChevronDownIcon, {}) : expandIcon
    }
  ) });
}
function CodeBlockChrome({
  code,
  isCollapsible,
  headContent,
  tailContent,
  withCopyButton = true,
  copyIcon,
  copiedIcon,
  onCopy,
  defaultExpanded = false,
  expanded: expandedProp,
  onExpandedChange,
  expandIcon,
  collapseIcon,
  controls,
  translations,
  testId,
  className,
  classNames
}) {
  const t = { ...DEFAULT_TRANSLATIONS, ...translations };
  const [expanded, setExpanded] = useUncontrolled({
    value: expandedProp,
    defaultValue: defaultExpanded,
    finalValue: false,
    onChange: onExpandedChange
  });
  const isSingleLine = !code.includes("\n");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative rounded-card border border-brand-900/30 dark:border-white/10 bg-white/4",
        className,
        classNames?.root
      ),
      ...props({ "data-testid": testId }),
      children: [
        (controls != null || withCopyButton || isCollapsible) && /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "absolute right-2 z-10 flex items-center gap-1 p-0.5",
              isSingleLine ? "top-1/2 -translate-y-1/2" : "top-2",
              // Same floating-surface chrome every other overlay panel in the
              // kit uses (Popover/Menu/Select's positioner) — border-brand-900/20
              // dark:border-white/15 + bg-brand-50/90 dark:bg-brand-950/85 +
              // backdrop-blur-sm + shadow-lg — rather than an ad-hoc neutral
              // white/gray-dark tint that doesn't match the kit's own convention
              // for "a small panel floating over content."
              popoverChrome,
              classNames?.controls
            ),
            children: [
              controls,
              isCollapsible && /* @__PURE__ */ jsx(
                ExpandTrigger,
                {
                  expanded,
                  onToggle: () => setExpanded((prev) => !prev),
                  expandLabel: t.expand,
                  collapseLabel: t.collapse,
                  expandIcon,
                  collapseIcon,
                  className: classNames?.expandButton,
                  testId: testId && `${testId}-expand`
                }
              ),
              withCopyButton && /* @__PURE__ */ jsx(
                CopyTrigger,
                {
                  code,
                  onCopy,
                  copyLabel: t.copy,
                  copiedLabel: t.copied,
                  copyIcon,
                  copiedIcon,
                  className: classNames?.copyButton,
                  testId: testId && `${testId}-copy`
                }
              )
            ]
          }
        ),
        headContent,
        isCollapsible && /* @__PURE__ */ jsx(Collapse, { open: expanded, children: tailContent }),
        isCollapsible && // Pinned to the *outer* card's own bottom edge (that div is the
        // nearest positioned ancestor), not to the code/Collapse content —
        // so it tracks the container's live height as Collapse animates
        // open/closed instead of sitting at a fixed spot relative to the
        // head/tail boundary, which "teleported" relative to the visibly
        // growing/shrinking content. Always mounted; only opacity toggles,
        // in sync with Collapse's own 300ms timing, so it fades together
        // with the reveal instead of popping in/out at the instant of click.
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-card",
              "transition-opacity duration-300",
              // Same brand-tinted family as this card's own border
              // (border-brand-900/30 dark:border-white/10) and the toolbar's
              // popoverChrome (bg-brand-50/90 dark:bg-brand-950/85) — a plain
              // neutral white/gray-950 fade doesn't match either, and visibly
              // seams against a brand-tinted page background (dark mode's
              // --color-fd-background is brand-950, not a neutral gray).
              "bg-linear-to-t from-brand-50/95 to-transparent dark:from-brand-950/95",
              expanded ? "opacity-0" : "opacity-100"
            )
          }
        )
      ]
    }
  );
}

export { CodeBlockButton, CodeBlockChrome };
//# sourceMappingURL=chunk-AREDZU73.js.map
//# sourceMappingURL=chunk-AREDZU73.js.map