import { useEffect, useState } from "react"

/** The height of the flow's bottom bar, MEASURED.
 *
 *  Three things rest on that bar — the review rail, the map, the source frame — and none
 *  of them may assume its height: the bar wraps its list of deep screens, so it goes from
 *  44 px to 130 px depending on the flow, which is precisely the case where the map is
 *  worth opening. The bar declares itself with `data-sanctum-bar`; a flow rendered without
 *  it (`?bare`, inside a frame of the compare page) falls back to one row.
 *
 *  It became a shared hook on 2026-09-08, when the map and the source frame stopped being
 *  buttons OF the bar: they used to find it with `button.closest("nav")`, which now finds
 *  the rail instead — the rail is a `<nav>` too. Measuring the bar by its marker is the
 *  only form that survives the tooling moving. */
const FALLBACK = 44

export const useBottomBar = (): number => {
  const [height, setHeight] = useState(FALLBACK)
  useEffect(() => {
    const bar = document.querySelector("[data-sanctum-bar]")
    if (!bar) return
    const measure = () => setHeight(Math.round(bar.getBoundingClientRect().height))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [])
  return height
}
