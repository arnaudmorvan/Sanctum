"use client";
import { Notification } from '../../chunk-YFKAUYE2.js';
export { Notification, notificationRoot } from '../../chunk-YFKAUYE2.js';
import '../../chunk-5BH3GLO4.js';
import { mergeRefs } from '../../chunk-UVYTJQTJ.js';
import '../../chunk-RNXO7W2J.js';
import '../../chunk-IG7FBZVM.js';
import '../../chunk-BEL75C7N.js';
import '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Portal } from '@ark-ui/react/portal';
import { usePresence } from '@ark-ui/react/presence';
import { customAlphabet } from 'nanoid';
import { useSyncExternalStore, useState, useCallback, useEffect, useRef, isValidElement } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

// src/components/notification/store.ts
var SERVER_SNAPSHOT = Object.freeze({ toasts: [] });
function createToastStore(config = { max: 5 }) {
  let state = { toasts: [] };
  const listeners = /* @__PURE__ */ new Set();
  const timers = /* @__PURE__ */ new Map();
  let paused = false;
  const emit = () => {
    for (const listener of listeners) listener();
  };
  const set = (toasts) => {
    state = { toasts };
    emit();
  };
  const clearTimer = (id) => {
    const timer = timers.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    timers.delete(id);
  };
  const startTimer = (id, duration) => {
    clearTimer(id);
    if (!Number.isFinite(duration)) return;
    const timer = { remaining: duration, startedAt: Date.now(), handle: null };
    if (!paused) timer.handle = setTimeout(() => dismiss(id), duration);
    timers.set(id, timer);
  };
  const dismiss = (id) => {
    if (id == null) {
      for (const toast of state.toasts) clearTimer(toast.id);
      set(state.toasts.map((t) => t.status === "open" ? { ...t, status: "dismissing" } : t));
      return;
    }
    if (!state.toasts.some((t) => t.id === id)) return;
    clearTimer(id);
    set(state.toasts.map((t) => t.id === id ? { ...t, status: "dismissing" } : t));
  };
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return state;
    },
    getServerSnapshot() {
      return SERVER_SNAPSHOT;
    },
    create(data) {
      const exists = state.toasts.some((t) => t.id === data.id);
      if (exists) {
        set(state.toasts.map((t) => t.id === data.id ? { ...t, ...data } : t));
      } else {
        const next = [data, ...state.toasts];
        const open = next.filter((t) => t.status === "open");
        if (open.length > config.max) {
          const overflow = new Set(open.slice(config.max).map((t) => t.id));
          for (const id of overflow) clearTimer(id);
          set(next.map((t) => overflow.has(t.id) ? { ...t, status: "dismissing" } : t));
        } else {
          set(next);
        }
      }
      startTimer(data.id, data.duration);
      return data.id;
    },
    update(id, patch) {
      if (!state.toasts.some((t) => t.id === id)) return;
      set(state.toasts.map((t) => t.id === id ? { ...t, ...patch } : t));
    },
    dismiss,
    remove(id) {
      clearTimer(id);
      if (!state.toasts.some((t) => t.id === id)) return;
      set(state.toasts.filter((t) => t.id !== id));
    },
    pauseAll() {
      if (paused) return;
      paused = true;
      const now = Date.now();
      for (const timer of timers.values()) {
        if (!timer.handle) continue;
        clearTimeout(timer.handle);
        timer.remaining -= now - timer.startedAt;
        timer.handle = null;
      }
    },
    resumeAll() {
      if (!paused) return;
      paused = false;
      const now = Date.now();
      for (const [id, timer] of timers) {
        if (timer.remaining <= 0) {
          dismiss(id);
          continue;
        }
        timer.startedAt = now;
        timer.handle = setTimeout(() => dismiss(id), timer.remaining);
      }
    },
    has(id) {
      return state.toasts.some((t) => t.id === id);
    }
  };
}
var isOptions = (input) => input != null && typeof input === "object" && !isValidElement(input) && !Array.isArray(input);
var nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 8);
var generateId = () => nanoid();
var GAP = 12;
var REGION_POSITION = {
  "top-start": "top-4 left-4",
  top: "top-4 left-1/2 -translate-x-1/2",
  "top-end": "top-4 right-4",
  "bottom-start": "bottom-4 left-4",
  bottom: "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-end": "bottom-4 right-4"
};
var NOTIFICATION_REMOVABLE_PROPS = [
  "title",
  "description",
  "action",
  "color",
  "variant",
  "icon",
  "duration",
  "withCloseButton"
];
var SWIPE_THRESHOLD = 60;
var CLICK_SLOP = 5;
function ToasterItem({
  toast,
  store,
  index,
  offset,
  height,
  frontHeight,
  onMeasure
}) {
  const { id } = toast;
  const presence = usePresence({
    present: toast.status === "open",
    lazyMount: true,
    unmountOnExit: true,
    onExitComplete: () => store.remove(id)
  });
  const measureRef = useRef(null);
  useEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    onMeasure(id, node.offsetHeight);
    const observer = new ResizeObserver(() => onMeasure(id, node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, [id, onMeasure]);
  const drag = useRef(null);
  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    const interactive = event.target.closest("button, a, input, [role='button']") != null;
    drag.current = { startX: event.clientX, interactive };
    if (!interactive) event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    const state = drag.current;
    if (!state || state.interactive) return;
    const dx = event.clientX - state.startX;
    const el = event.currentTarget;
    el.style.transition = "none";
    el.style.setProperty("--swipe-x", `${dx}px`);
    el.style.setProperty("--swipe-opacity", `${Math.max(0.15, 1 - Math.abs(dx) / 240)}`);
  };
  const onPointerEnd = (event) => {
    const state = drag.current;
    drag.current = null;
    if (!state || state.interactive) return;
    const dx = event.clientX - state.startX;
    const el = event.currentTarget;
    el.style.transition = "";
    if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dx) < CLICK_SLOP) {
      store.dismiss(id);
    } else {
      el.style.setProperty("--swipe-x", "0px");
      el.style.setProperty("--swipe-opacity", "1");
    }
  };
  if (presence.unmounted) return null;
  return /* @__PURE__ */ jsx(
    Notification,
    {
      ref: mergeRefs(presence.ref, measureRef),
      ...toast,
      ...presence.getPresenceProps(),
      "data-part": "toast",
      onClose: () => store.dismiss(id),
      className: "cursor-grab touch-none select-none active:cursor-grabbing",
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      style: {
        ["--index"]: index,
        ["--offset"]: `${offset}px`,
        ["--height"]: `${height}px`,
        ["--front-height"]: `${frontHeight}px`
      }
    }
  );
}
function createNotifier(options = {}) {
  const {
    placement = "bottom-end",
    max = 5,
    duration: defaultDuration = 5e3,
    expand = true,
    withinPortal = true,
    container,
    defaultVariant
  } = options;
  const store = createToastStore({ max });
  const normalize = (input) => isOptions(input) ? input : { title: input };
  const toData = (input, type) => {
    const o = normalize(input);
    return {
      id: o.id ?? generateId(),
      status: "open",
      type,
      title: o.title,
      description: o.description,
      action: o.action,
      color: o.color,
      variant: o.variant ?? defaultVariant,
      icon: o.icon,
      duration: o.duration ?? (type === "loading" ? Number.POSITIVE_INFINITY : defaultDuration),
      withCloseButton: o.withCloseButton ?? true
    };
  };
  const status = (type) => (input) => store.create(toData(input, type));
  const show = (input) => store.create(toData(input));
  const update = (id, input) => {
    const o = normalize(input);
    const patch = {};
    for (const prop of NOTIFICATION_REMOVABLE_PROPS) {
      if (prop in o) patch[prop] = o[prop];
    }
    store.update(id, patch);
    return id;
  };
  const promise = (promise2, messages) => {
    const id = generateId();
    const resolve = (input, type) => store.create(toData({ ...normalize(input), id }, type));
    status("loading")({ ...normalize(messages.loading), id });
    const run = typeof promise2 === "function" ? promise2() : promise2;
    run.then(
      (value) => {
        if (messages.success === void 0) return store.dismiss(id);
        resolve(
          typeof messages.success === "function" ? messages.success(value) : messages.success,
          "success"
        );
      },
      (error) => {
        if (messages.error === void 0) return store.dismiss(id);
        resolve(
          typeof messages.error === "function" ? messages.error(error) : messages.error,
          "error"
        );
      }
    );
    return { id, unwrap: () => run };
  };
  const notify = Object.assign(show, {
    success: status("success"),
    error: status("error"),
    warning: status("warning"),
    info: status("info"),
    loading: status("loading"),
    promise,
    update,
    dismiss: store.dismiss,
    remove: store.remove,
    has: store.has,
    getToasts: () => store.getSnapshot().toasts
  });
  const Notifications = () => {
    const { toasts } = useSyncExternalStore(
      store.subscribe,
      store.getSnapshot,
      store.getServerSnapshot
    );
    const [heights, setHeights] = useState({});
    const onMeasure = useCallback((id, height) => {
      setHeights((prev) => prev[id] === height ? prev : { ...prev, [id]: height });
    }, []);
    useEffect(() => {
      const onVisibility = () => document.hidden ? store.pauseAll() : store.resumeAll();
      document.addEventListener("visibilitychange", onVisibility);
      return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);
    const heightOf = (toast) => heights[toast.id] ?? 0;
    const frontHeight = toasts[0] ? heightOf(toasts[0]) : 0;
    const items = toasts.map((toast, index) => ({
      toast,
      index,
      height: heightOf(toast),
      offset: toasts.slice(0, index).reduce((sum, newer) => sum + heightOf(newer) + GAP, 0)
    }));
    const expandedHeight = toasts.reduce((sum, toast) => sum + heightOf(toast), 0) + GAP * Math.max(0, toasts.length - 1);
    const maxHeight = toasts.reduce((max2, toast) => Math.max(max2, heightOf(toast)), 0);
    const stackOverflow = placement.startsWith("bottom") ? Math.max(0, maxHeight - frontHeight) : 0;
    const region = /* @__PURE__ */ jsx(
      "section",
      {
        "aria-label": "Notifications",
        "data-scope": "notifications",
        "data-placement": placement,
        "data-expand": expand ? "" : void 0,
        style: { ["--toast-from"]: placement.startsWith("top") ? "-100%" : "100%" },
        className: cn(
          "pointer-events-none fixed z-999 justify-center flex",
          REGION_POSITION[placement],
          // Phones (< xs): pin to the bottom, full-bleed, above the safe area.
          "max-xs:inset-x-0! max-xs:bottom-[calc(1rem+env(safe-area-inset-bottom))]! max-xs:top-auto! max-xs:translate-x-0!"
        ),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            "data-part": "stack",
            onPointerEnter: () => store.pauseAll(),
            onPointerLeave: () => store.resumeAll(),
            style: {
              ["--stack-collapsed-h"]: `${frontHeight}px`,
              ["--stack-expanded-h"]: `${expandedHeight}px`
            },
            className: "pointer-events-auto relative min-w-88 max-xs:min-w-0 max-w-[calc(100vw-2rem)] max-xs:w-screen",
            children: [
              items.map(({ toast, index, offset, height }) => /* @__PURE__ */ jsx(
                ToasterItem,
                {
                  toast,
                  store,
                  index,
                  offset,
                  height,
                  frontHeight,
                  onMeasure
                },
                toast.id
              )),
              stackOverflow > 0 && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": true,
                  "data-part": "ghost",
                  style: { ["--ghost-h"]: `${stackOverflow}px` }
                }
              )
            ]
          }
        )
      }
    );
    if (!withinPortal) return region;
    return /* @__PURE__ */ jsx(Portal, { container: container ? { current: container } : void 0, children: region });
  };
  return { notify, Notifications };
}

export { createNotifier };
