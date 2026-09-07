import type { ReactNode } from "react"

/** One screen of the flow. This is the ONLY contract the PO has to know. */
export type ProtoView = {
  /** Hash pattern, without the leading `#/`. A `:param` segment captures a value. */
  path: string
  /** Label shown in the navigation bar at the bottom. */
  label: string
  /** Concrete link opened by the bar. Required as soon as `path` carries a `:param`. */
  href?: string
  /** Removes the entry from the bar without removing it from the routing. */
  hidden?: boolean
  render: (params: Record<string, string>) => ReactNode
}

/** One entry of the side navigation — the app CHROME, rendered by the skeleton.
 *
 *  `views.tsx` may export `NAV: ProtoNavItem[]` alongside `VIEWS`: the skeleton then
 *  renders the product sidebar (AppShell + the kit's NavLink) and the ambient background,
 *  and the screens write ONLY the central area. Without a `NAV` export nothing changes:
 *  the flow keeps the historical bare frame (flows that draw their own chrome keep
 *  working — but a NEW flow must no longer do that).
 *
 *  - `path`  : the `path` of a screen in `VIEWS` — both the target AND the current-state
 *    criterion.
 *  - `href`  : explicit target (parameterized route: "#/profile/aserrano"). Wins over `path`.
 *  - neither `path` nor `href`: a category row with no link (rendered non-clickable).
 *  - `icon`  : a ReactNode, typically a lucide icon (`<House size={16} />`).
 *  - `match` : a path prefix that ALSO marks the entry as current — so that a section stays
 *    lit on its deep screens (`match: "learn/"` covers `learn/module/:slug`). */
export type ProtoNavItem = {
  label: string
  path?: string
  href?: string
  icon?: ReactNode
  match?: string
}

export const hrefOf = (view: ProtoView): string => view.href ?? `#/${view.path}`

export type ViewMatch = { view: ProtoView; params: Record<string, string> }

/** First view whose pattern covers `hash`, with the parameters captured along the way.
 *  Segment-by-segment comparison: a pattern only matches at equal length, which lets
 *  `requests` and `requests/:id` coexist without the first swallowing the second. */
export const matchView = (views: ProtoView[], hash: string): ViewMatch | undefined => {
  const segments = hash.replace(/^#\/?/, "").split("/").filter(Boolean)
  for (const view of views) {
    const pattern = view.path.split("/").filter(Boolean)
    if (pattern.length !== segments.length) continue
    const params: Record<string, string> = {}
    const ok = pattern.every((part, i) => {
      if (part.startsWith(":")) {
        params[part.slice(1)] = segments[i]
        return true
      }
      return part === segments[i]
    })
    if (ok) return { view, params }
  }
  return undefined
}
