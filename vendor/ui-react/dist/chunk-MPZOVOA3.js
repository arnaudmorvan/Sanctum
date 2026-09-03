import { PillGroupContext, pill } from './chunk-3YVX2KOL.js';
import { inputSlot, inputShell, inputControlClasses } from './chunk-MWXEQ5QX.js';
import { props } from './chunk-WYCMIIRR.js';
import { cn } from './chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { Children, isValidElement, cloneElement, useRef, useState, useLayoutEffect, useEffect } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

var pillsShell = cn("cursor-text");
var pillsContent = cva("flex min-w-0 flex-1 flex-wrap items-center py-1 gap-y-0.5", {
  variants: {
    size: {
      xs: "gap-1.5",
      sm: "gap-1.5",
      md: "gap-2",
      lg: "gap-2.5",
      xl: "gap-3"
    }
  },
  defaultVariants: { size: "md" }
});
var useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;
function visiblePillCount(offsetTops, maxLines) {
  let rows = 0;
  let lastTop = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < offsetTops.length; i++) {
    const top = offsetTops[i] ?? lastTop;
    if (top - lastTop > 1) {
      rows += 1;
      lastTop = top;
      if (rows > maxLines) {
        return Math.max(0, i - 1);
      }
    }
  }
  return offsetTops.length;
}
function pillCountWithField(pills, maxLines, rowRight, trailing) {
  const total = pills.length;
  const { fieldMinWidth, counterWidth, gap } = trailing;
  let visible = visiblePillCount(
    pills.map((p) => p.top),
    maxLines
  );
  while (visible > 0) {
    const last = pills[visible - 1];
    if (last == null) break;
    const needsCounter = visible < total;
    const trailingWidth = gap + fieldMinWidth + (needsCounter ? counterWidth + gap : 0);
    if (last.right + trailingWidth <= rowRight) break;
    visible--;
  }
  return visible;
}
function usePillOverflow({
  maxLines,
  count
}) {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(count);
  const [measuring, setMeasuring] = useState(true);
  const lastWidth = useRef(0);
  useIsoLayoutEffect(() => {
    setMeasuring(true);
  }, [count, maxLines]);
  useIsoLayoutEffect(() => {
    if (!measuring) return;
    const container = containerRef.current;
    if (maxLines == null || container == null) {
      setVisibleCount(count);
      setMeasuring(false);
      return;
    }
    const items = Array.from(container.querySelectorAll("[data-overflow-item]"));
    lastWidth.current = container.clientWidth;
    const fieldEl = container.querySelector("[data-overflow-field]");
    if (fieldEl == null) {
      setVisibleCount(
        visiblePillCount(
          items.map((el) => el.offsetTop),
          maxLines
        )
      );
      setMeasuring(false);
      return;
    }
    const style = getComputedStyle(container);
    const gap = Number.parseFloat(style.columnGap || style.gap) || 0;
    const rowRight = container.getBoundingClientRect().right;
    const fieldMinWidth = Number.parseFloat(getComputedStyle(fieldEl).minWidth) || 0;
    const counterEl = container.querySelector("[data-overflow-counter]");
    const counterWidth = counterEl?.getBoundingClientRect().width ?? 0;
    const pills = items.map((el) => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top, right: rect.right };
    });
    setVisibleCount(
      pillCountWithField(pills, maxLines, rowRight, { fieldMinWidth, counterWidth, gap })
    );
    setMeasuring(false);
  }, [measuring, count, maxLines]);
  useIsoLayoutEffect(() => {
    const container = containerRef.current;
    if (maxLines == null || container == null || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (Math.abs(width - lastWidth.current) < 1) return;
      lastWidth.current = width;
      setMeasuring(true);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [maxLines]);
  const resolved = maxLines == null || measuring ? count : Math.min(visibleCount, count);
  return {
    containerRef,
    visibleCount: resolved,
    hiddenCount: Math.max(0, count - resolved),
    measuring
  };
}
var PillOverflowCounter = ({
  count,
  size = "md",
  className
}) => /* @__PURE__ */ jsxs("span", { "data-overflow-counter": true, className: cn(pill({ size }), "tabular-nums", className), children: [
  "+",
  count
] });
var PillsInputBase = ({
  size = "md",
  variant = "default",
  color,
  invalid,
  disabled,
  pointer,
  maxLines,
  startSlot,
  endSlot,
  className,
  classNames,
  children,
  testId,
  ...rest
}) => {
  const items = Children.toArray(children);
  const field = items.length > 0 ? items[items.length - 1] : null;
  const pills = items.length > 0 ? items.slice(0, -1) : [];
  const { containerRef, visibleCount, hiddenCount, measuring } = usePillOverflow({
    maxLines,
    count: pills.length
  });
  const renderedPills = (maxLines == null ? pills : pills.slice(0, visibleCount)).map(
    (child, i) => isValidElement(child) ? cloneElement(child, {
      key: child.key ?? i,
      "data-overflow-item": true
    }) : child
  );
  return /* @__PURE__ */ jsx(PillGroupContext.Provider, { value: { size, disabled }, children: /* @__PURE__ */ jsxs(
    ark.div,
    {
      "data-color": color,
      ...props({
        "data-invalid": invalid,
        "data-disabled": disabled,
        "data-pointer": pointer,
        // Slot-aware padding in `inputShell` — see InputBase for the rationale.
        "data-with-start-slot": startSlot != null,
        "data-with-end-slot": endSlot != null,
        "data-testid": testId
      }),
      className: cn(inputShell({ size, variant }), pillsShell, className, classNames?.root),
      ...rest,
      children: [
        startSlot != null && /* @__PURE__ */ jsx("span", { className: cn(inputSlot, classNames?.startSlot), "aria-hidden": true, children: startSlot }),
        /* @__PURE__ */ jsxs("div", { ref: containerRef, className: cn(pillsContent({ size }), classNames?.content), children: [
          renderedPills,
          (hiddenCount > 0 || measuring && maxLines != null) && /* @__PURE__ */ jsx(
            PillOverflowCounter,
            {
              count: measuring ? pills.length : hiddenCount,
              size,
              className: measuring ? "invisible" : void 0
            }
          ),
          field
        ] }),
        endSlot != null && /* @__PURE__ */ jsx("span", { className: cn(inputSlot, classNames?.endSlot), children: endSlot })
      ]
    }
  ) });
};
var PillsInputField = ({
  className,
  onRemoveLast,
  onKeyDown,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  "input",
  {
    "data-overflow-field": true,
    className: cn(inputControlClasses, "w-auto min-w-16", className),
    onKeyDown: (event) => {
      if (onRemoveLast && event.key === "Backspace" && event.currentTarget.value === "") {
        onRemoveLast();
      }
      onKeyDown?.(event);
    },
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var PillsInput = Object.assign(PillsInputBase, {
  Field: PillsInputField
});

export { PillOverflowCounter, PillsInput, pillsContent, pillsShell, usePillOverflow };
