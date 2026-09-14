export type ModuleStatus = "validated" | "progress" | "available" | "locked"

export const MODULE_STATUS_BADGE: Record<ModuleStatus, { label: string; color: "green" | "pink" | "gray" }> = {
  validated: { label: "Validated", color: "green" },
  progress: { label: "In progress", color: "pink" },
  available: { label: "Available", color: "gray" },
  locked: { label: "Locked", color: "gray" },
}

export const MODULES: {
  slug: string
  name: string
  status: ModuleStatus
  skillsDone: number
  skillsTotal: number
  pct: number
  activities: number
}[] = [
  { slug: "programming-fundamentals", name: "Programming Fundamentals", status: "validated", skillsDone: 8, skillsTotal: 8, pct: 100, activities: 5 },
  { slug: "systems-and-networks-administration", name: "Systems & networks administration", status: "progress", skillsDone: 3, skillsTotal: 7, pct: 43, activities: 4 },
  { slug: "object-oriented-programming", name: "Object-oriented programming", status: "available", skillsDone: 0, skillsTotal: 8, pct: 0, activities: 14 },
  { slug: "algorithmics", name: "Algorithmics", status: "locked", skillsDone: 0, skillsTotal: 5, pct: 0, activities: 3 },
  { slug: "web-programming", name: "Web programming", status: "locked", skillsDone: 0, skillsTotal: 6, pct: 0, activities: 1 },
  { slug: "artificial-intelligence", name: "Artificial intelligence", status: "locked", skillsDone: 0, skillsTotal: 5, pct: 0, activities: 3 },
]
