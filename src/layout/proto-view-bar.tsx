import { Button } from "@42/ui-react/button"
import { ArrowLeft } from "lucide-react"
import { hrefOf, type ProtoNavItem, type ProtoView } from "../proto-types"
import { TYPO } from "../typo"
import { Feedback } from "./feedback"
import { Inspector } from "./inspector"
import { UI_MARK } from "./target"

/** The bottom bar: the prototype's TOOLING, not its product. It leads back to the gallery
 *  and gives direct access to the screens declared in VIEWS — without the PO having to
 *  wire anything: they add an entry, it shows up here. On the right, the review tools: the
 *  origin inspector (kit or written by hand) and the feedback widget.
 *
 *  When the flow exports `NAV`, the product sidebar already carries some of the screens.
 *  Relisting them here made two navigations for the same target ("Learn" on the left,
 *  "My program" at the bottom). Rule: a screen that a NAV entry targets does not appear in
 *  the bar; what remains are the DEEP screens (module, project, detail…) that can only be
 *  reached by walking through the product — exactly what a PO needs during a review. */
export const ProtoViewBar = ({
  views,
  current,
  nav,
  title,
}: {
  views: ProtoView[]
  current?: ProtoView
  nav?: ProtoNavItem[]
  title?: string
}) => {
  const targetedByNav = new Set(
    (nav ?? []).flatMap((item) => {
      const targets: string[] = []
      if (item.path) targets.push(`#/${item.path}`)
      if (item.href) targets.push(item.href)
      return targets
    }),
  )
  const screens = views.filter((v) => !v.hidden && !targetedByNav.has(hrefOf(v)))

  return (
    <nav
      {...{ [UI_MARK]: "" }}
      aria-label="Prototype tools"
      className="flex shrink-0 flex-wrap items-center gap-1 border-white/10 border-t bg-gray-dark-950 px-2 py-1.5"
    >
      <Button variant="subtle" size="xs" asChild>
        <a href="/">
          <ArrowLeft size={14} aria-hidden="true" />
          All prototypes
        </a>
      </Button>
      {title ? (
        <span className={`${TYPO.nav} ms-2 truncate text-[11px] text-gray-dark-500`}>{title}</span>
      ) : null}
      {screens.length > 0 ? (
        <span className="ms-3 flex flex-wrap items-center gap-1">
          <span className="me-1 text-gray-dark-500 text-xs">
            {nav ? "Deep screens" : "Screens"}
          </span>
          {screens.map((v) => {
            const on = v === current
            return (
              <Button key={v.path} variant={on ? "light" : "subtle"} size="xs" asChild>
                <a href={hrefOf(v)} aria-current={on ? "page" : undefined}>
                  {v.label}
                </a>
              </Button>
            )
          })}
        </span>
      ) : null}
      {/* The inspector carries its own `ms-auto`: it and the feedback button form the right
          block, the review tools — the navigation stays on the left. */}
      <Inspector />
      <Feedback screen={current?.label} />
    </nav>
  )
}
