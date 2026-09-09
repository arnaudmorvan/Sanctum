import { useSyncExternalStore } from "react"

/** How many pixels the docked panel takes AWAY from the flow, rather than covering.
 *
 *  Until 2026-09-09 the panel always floated over the screen, docked included: a rail
 *  against the right edge, drawn on top of the last 420 px of the flow. That is fine for
 *  a glance and wrong for a session — the thing being reviewed is precisely what the
 *  panel hides, and a PO ends up dragging the panel back and forth to read the card it
 *  covers. Docked, it now RESERVES its width: the flow is laid out in what is left, and
 *  reflows into it (`app.tsx` puts the reserve on the stage as a right margin).
 *
 *  Why a store and not a prop: the width is decided by the panel and consumed by the
 *  stage, which are siblings — the panel is mounted OUTSIDE the stage on purpose, so that
 *  the margin (and the containing block that comes with it) never applies to the panel
 *  itself. Same module-level `useSyncExternalStore` as `notes.ts`, for the same reason:
 *  two readers of one value that must never disagree.
 *
 *  0 means "covers", and that is the value in every case but one: floating, closed, or
 *  docked in a window too narrow to give 420 px away (see `reserve` in `side-panel.tsx`). */
let width = 0
const listeners = new Set<() => void>()

export const setDock = (px: number): void => {
  if (px === width) return
  width = px
  for (const listener of listeners) listener()
}

export const useDock = (): number =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    () => width,
    () => 0,
  )
