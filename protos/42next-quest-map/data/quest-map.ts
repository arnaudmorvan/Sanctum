/** Screen data, LIFTED from frame 22505:9532 (« 42next — Home v3 · Quest map »).
 *  The labels are the mockup's own, to the letter — including the ones that raise a
 *  question (see the report of 2026-09-06: « Territories » and « Next mission »
 *  rename product objects, which foundations-context forbids for the game register).
 *  A label is never fixed in silence: it is reproduced, and it is flagged. */

export const LEARNER = {
  firstName: "Amanda",
  name: "Amanda Serrano",
  context: "Common Core · Paris campus",
  track: "Common Core · Paris campus · Milestone 2 of 6",
  level: 4,
  xpPct: 70,
  xp: "740 / 1000 XP · 260 XP left before Level 5",
}

/** Badge colors lifted instance by instance. ⚠️ The frame sets `grey` on three
 *  badges and `neutral` on a fourth one for a neighbouring role; the kit only knows
 *  `gray`. We set `gray`, and the deviation goes out as a ds-action. */
export type Status = { label: string; color: "green" | "orange" | "pink" | "neutral" | "gray" }

/** The timeline indicator, lifted from `_Timeline / _CircleCheck`:
 *  State=Active + check icon · State=Checked (solid dot) · State=Dashed (empty circle). */
export type Mark = "validated" | "in-progress" | "open"

export const TERRITORIES: {
  name: string
  detail: string
  status: Status
  mark: Mark
}[] = [
  {
    name: "Libft",
    detail: "9 skills validated — your own C library.",
    status: { label: "Mastered", color: "green" },
    mark: "validated",
  },
  {
    name: "ft_printf",
    detail: "Validated, but 2 skills sit below the mastery threshold.",
    status: { label: "To consolidate", color: "orange" },
    mark: "validated",
  },
  {
    name: "Born2beroot",
    detail: "System administration — 2 activities left before validation.",
    status: { label: "In progress", color: "pink" },
    mark: "in-progress",
  },
  {
    name: "get_next_line",
    detail: "Open now. No prerequisite left to clear.",
    status: { label: "Available", color: "neutral" },
    mark: "open",
  },
  {
    name: "minitalk",
    detail: "Unlocks once Born2beroot and get_next_line are validated.",
    status: { label: "Locked", color: "gray" },
    mark: "open",
  },
]

export const FILTERS = ["All", "In progress", "Available", "Locked"]

export const SKILLS: { name: string; detail: string; status: Status }[] = [
  {
    name: "Algorithms & data structures",
    detail: "Unlocked by Libft · 9 sub-skills validated",
    status: { label: "Acquired", color: "green" },
  },
  {
    name: "Unix processes & signals",
    detail: "Requires Born2beroot · 2 activities left",
    status: { label: "In progress", color: "pink" },
  },
  {
    name: "Peer collaboration",
    detail: "Power skill · validation criteria not specified yet",
    status: { label: "Not specified", color: "gray" },
  },
  {
    name: "Network configuration",
    detail: "Requires Unix processes & signals",
    status: { label: "Locked", color: "gray" },
  },
]

/** The fifth row of the Skills card carries no badge: a title and a bar. */
export const MASTERY = { name: "C — language mastery", pct: 30 }

export const QUESTS: {
  name: string
  xp: string
  detail: string
  pct: number
  action: string
}[] = [
  {
    name: "Born2beroot",
    xp: "+120 XP",
    detail: "2 activities left before the module validates.",
    pct: 60,
    action: "Continue",
  },
  {
    name: "Rush 01 peer review",
    xp: "+40 XP",
    detail: "One review to give before Sunday 18:00.",
    pct: 30,
    action: "Book a slot",
  },
]

export const ACHIEVEMENTS: { name: string; detail: string; color: "green" | "blue" | "purple" }[] = [
  {
    name: "First territory cleared",
    detail: "Libft validated on 12 May — 9 skills acquired.",
    color: "green",
  },
  {
    name: "Reviewer",
    detail: "10 peer reviews given. Cross-campus reviews now open to you.",
    color: "blue",
  },
  {
    name: "New capability unlocked",
    detail: "You can now register for Rushes without a sponsor.",
    color: "purple",
  },
]

export const NEXT_MISSION = {
  name: "Rush 01 — Push_swap",
  detail: "Teams of 3 · 48 h · one Rush review, no retry.",
  countdown: "OPENS IN 2 DAYS",
  action: "Register",
}

export const CURRENT_TERRITORY = {
  pct: 50,
  name: "C Piscine",
  detail: "3 of 6 skills validated · 2 activities left",
}
