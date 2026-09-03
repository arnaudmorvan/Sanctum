"use client";
import { Modal } from '../../chunk-2XKAHAUB.js';
import { Button } from '../../chunk-GHV47RCM.js';
import { Drawer } from '../../chunk-GHSRENN6.js';
import '../../chunk-3KHUHVCD.js';
import '../../chunk-RNXO7W2J.js';
import '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { customAlphabet } from 'nanoid';
import { useSyncExternalStore, useMemo, useState } from 'react';
import { Portal } from '@ark-ui/react/portal';
import { Presence } from '@ark-ui/react/presence';
import { match } from 'ts-pattern';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

function OverlayRenderer({
  store,
  registry,
  controller: modals
}) {
  const { entries } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );
  const active = entries.at(0);
  const backdropOpen = entries.some((entry) => entry.status === "open");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    active?.surfaceOptions.withBackdrop !== false && /* @__PURE__ */ jsx(OverlayBackdrop, { present: backdropOpen }),
    active && /* @__PURE__ */ jsx(
      OverlayItem,
      {
        entry: active,
        store,
        registry,
        modals
      },
      active.id
    )
  ] });
}
var overlayBackdrop = [
  "fixed inset-0 z-[calc(var(--modal-z,50)-1)] bg-black/50 backdrop-blur-lg select-none pointer-events-auto",
  "data-[state=open]:animate-fade-in",
  "data-[state=closed]:animate-fade-out"
];
function OverlayBackdrop({ present }) {
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(Presence, { present, lazyMount: true, unmountOnExit: true, className: cn(overlayBackdrop) }) });
}
function OverlayItem({
  entry,
  store,
  registry,
  modals
}) {
  const open = entry.status === "open";
  const common = {
    open,
    withBackdrop: false,
    onOpenChange: (next) => {
      if (!next) store.close(entry.id);
    },
    onExitComplete: () => store.remove(entry.id)
  };
  const body = /* @__PURE__ */ jsx(OverlayBody, { entry, registry, modals });
  return match(entry).with({ surface: "drawer" }, ({ surfaceOptions }) => /* @__PURE__ */ jsx(Drawer, { ...surfaceOptions, ...common, children: body })).with({ surface: "modal" }, ({ surfaceOptions }) => /* @__PURE__ */ jsx(Modal, { ...surfaceOptions, ...common, children: body })).exhaustive();
}
function OverlayBody({
  entry,
  registry,
  modals
}) {
  return match(entry).with({ kind: "content" }, ({ children }) => /* @__PURE__ */ jsx(Fragment, { children })).with({ kind: "confirm" }, (entry2) => /* @__PURE__ */ jsxs(Fragment, { children: [
    entry2.children,
    /* @__PURE__ */ jsx(ConfirmActions, { entry: entry2, modals })
  ] })).with({ kind: "context" }, (entry2) => {
    const Component = registry[entry2.key];
    if (!Component) {
      console.error(
        `[overlays] No context overlay registered for key "${entry2.key}". Pass it to createOverlays({ registry: { ${entry2.key}: \u2026 } }).`
      );
      return null;
    }
    return /* @__PURE__ */ jsx(
      Component,
      {
        id: entry2.id,
        params: entry2.params,
        context: {
          close: () => modals.close(entry2.id),
          update: (patch) => modals.update(entry2.id, patch)
          // Cast to remove surface missmatch impossibility
        }
      }
    );
  }).exhaustive();
}
function ConfirmActions({
  entry,
  modals
}) {
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    entry.onCancel?.();
    if (entry.closeOnCancel) modals.close(entry.id);
  };
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await entry.onConfirm?.();
      if (entry.closeOnConfirm) modals.close(entry.id);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-end gap-2", children: [
    /* @__PURE__ */ jsx(Button, { variant: "light", color: "gray", onClick: handleCancel, ...entry.cancelProps, children: entry.labels.cancel }),
    /* @__PURE__ */ jsx(Button, { loading, onClick: handleConfirm, ...entry.confirmProps, children: entry.labels.confirm })
  ] });
}

// src/components/overlays/store.ts
var SERVER_SNAPSHOT = Object.freeze({ entries: [] });
function createOverlayStore() {
  let state = { entries: [] };
  const listeners = /* @__PURE__ */ new Set();
  const emit = () => {
    for (const listener of listeners) listener();
  };
  const set = (entries) => {
    state = { entries };
    emit();
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
    open(entry) {
      set([entry, ...state.entries]);
      return entry.id;
    },
    edit(id, partial) {
      set(
        state.entries.map(
          (entry) => entry.id === id ? { ...entry, ...partial } : entry
        )
      );
    },
    close(id) {
      const index = state.entries.findIndex((entry) => entry.id === id);
      if (index === -1) return;
      if (index === 0) {
        set(state.entries.map((entry, i) => i === 0 ? { ...entry, status: "closing" } : entry));
      } else {
        set(state.entries.filter((entry) => entry.id !== id));
      }
    },
    closeAll() {
      const [top] = state.entries;
      set(top ? [{ ...top, status: "closing" }] : []);
    },
    remove(id) {
      if (!state.entries.some((entry) => entry.id === id)) return;
      set(state.entries.filter((entry) => entry.id !== id));
    },
    has(id) {
      return state.entries.some((entry) => entry.id === id);
    }
  };
}
var nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 8);
var generateShortId = () => nanoid();
var NON_SURFACE_KEYS = /* @__PURE__ */ new Set([
  "surface",
  "children",
  "key",
  "params",
  "labels",
  "confirmProps",
  "cancelProps",
  "onConfirm",
  "onCancel",
  "closeOnConfirm",
  "closeOnCancel"
]);
var pickSurface = (input) => {
  const out = {};
  for (const key in input) {
    if (!NON_SURFACE_KEYS.has(key)) out[key] = input[key];
  }
  return out;
};
var mergeParams = (a, b) => {
  if (a || b) {
    return { ...a, ...b };
  } else {
    return void 0;
  }
};
function createOverlays(config = {}) {
  const store = createOverlayStore();
  const defaultLabels = config.labels ?? {
    confirm: "Confirm",
    cancel: "Cancel"
  };
  const mergeSurface = (surface, input) => {
    const defaults = surface === "drawer" ? config.drawerProps : config.modalProps;
    return {
      container: config.container ?? void 0,
      ...defaults,
      ...pickSurface(input)
    };
  };
  const controller = {
    open(input) {
      const surface = input.surface ?? "modal";
      return store.open({
        id: generateShortId(),
        status: "open",
        kind: "content",
        surface,
        surfaceOptions: mergeSurface(surface, input),
        children: input.children
        // `surface` is a runtime value, so TS can't correlate it with the
        // discriminated `surfaceOptions`; the runtime guarantees they match.
      });
    },
    openDrawer(input) {
      return controller.open({
        ...input,
        surface: "drawer"
      });
    },
    openConfirm(input) {
      const surface = input.surface ?? "modal";
      return store.open({
        id: generateShortId(),
        status: "open",
        kind: "confirm",
        surface,
        surfaceOptions: {
          role: "alertdialog",
          ...mergeSurface(surface, input)
        },
        children: input.children,
        labels: { ...defaultLabels, ...input.labels },
        confirmProps: input.confirmProps,
        cancelProps: input.cancelProps,
        onConfirm: input.onConfirm,
        onCancel: input.onCancel,
        closeOnConfirm: input.closeOnConfirm ?? true,
        closeOnCancel: input.closeOnCancel ?? true
      });
    },
    openContext(input) {
      const surface = input.surface ?? "modal";
      return store.open({
        id: generateShortId(),
        status: "open",
        kind: "context",
        surface,
        surfaceOptions: mergeSurface(surface, input),
        key: input.key,
        params: input.params
      });
    },
    close(id) {
      store.close(id);
    },
    closeAll() {
      store.closeAll();
    },
    update(id, patch) {
      const entry = store.getSnapshot().entries.find((e) => e.id === id);
      if (entry) {
        store.edit(id, {
          children: patch.children,
          params: mergeParams(entry.params, patch.params),
          surfaceOptions: { ...entry.surfaceOptions, ...patch }
        });
      } else {
        console.error(`Failed overlay update: Missing overlay with id ${id}`);
      }
    },
    updateContext(id, params) {
      const entry = store.getSnapshot().entries.find((e) => e.id === id);
      if (entry && entry.kind === "context") {
        store.edit(id, {
          params: { ...entry.params, ...params }
        });
      } else {
        console.error(`Failed overlay context update: Missing overlay with id ${id}`);
      }
    }
  };
  const OverlaysProvider = () => {
    return /* @__PURE__ */ jsx(
      OverlayRenderer,
      {
        store,
        registry: config.registry ?? {},
        controller
      }
    );
  };
  const useOverlays = () => {
    const { entries } = useSyncExternalStore(
      store.subscribe,
      store.getSnapshot,
      store.getServerSnapshot
    );
    return useMemo(() => [entries, controller], [entries]);
  };
  return { overlays: controller, OverlaysProvider, useOverlays };
}

export { createOverlays };
