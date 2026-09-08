/** Agenda block of the rail — DEMO DATA.
 *
 *  ⚠️ This block does NOT come from frame 22489:9756. It was asked for on
 *  2026-09-08, after the lift. Do not read its presence as a survey. */

export const NEXT_EVENT = {
  /** Kode Mono: a date measures. */
  stamp: "12/09 · 14:00",
  label: "Peer review — minishell",
}

export const AGENDA_LEGEND = "A dot marks a day with something booked."

/** Days of the displayed month carrying an event. */
export const AGENDA_DAYS = [10, 12, 15, 18, 24]

/** `Calendar`'s `renderDay` hands over its own date object (Ark's DateValue).
 *  Typed loosely on purpose: the kit does not export that type through the
 *  subpath, and guessing it would break the build for nothing. */
export const hasAgenda = (date: unknown): boolean => {
  const d = date as { day?: number } | null
  return typeof d?.day === "number" && AGENDA_DAYS.includes(d.day)
}
